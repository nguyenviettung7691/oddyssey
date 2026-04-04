import {
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  query,
  orderBy,
  limit as firestoreLimit,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { getFirebaseDb, isFirebaseConfigured } from '@/services/firebaseService';
import { listHighScores as listLocalHighScores } from '@/services/storageService';
import type { GameRecord, HighScoreEntry, LeaderboardEntry } from '@/types/game';

function mapLeaderboardToHighScore(entry: LeaderboardEntry, themeId: string, index: number): HighScoreEntry {
  return {
    id: `${entry.userId}-${themeId}-${index}`,
    sessionId: '',
    userId: entry.userId,
    userDisplayName: entry.userDisplayName,
    avatarUrl: entry.avatarUrl,
    score: entry.bestScore,
    themeId,
    finishedAt: entry.bestFinishedAt,
  };
}

export async function submitScore(record: GameRecord): Promise<void> {
  if (!isFirebaseConfigured()) {
    return;
  }

  const db = getFirebaseDb();
  if (!db) {
    return;
  }

  try {
    const recordRef = doc(collection(db, 'gameRecords'));
    await setDoc(recordRef, {
      userId: record.userId,
      userDisplayName: record.userDisplayName,
      avatarUrl: (record as GameRecord & { avatarUrl?: string }).avatarUrl ?? null,
      score: record.score,
      themeId: record.themeId,
      themeLabel: record.themeLabel,
      totalQuestions: record.totalQuestions,
      finishedAt: record.finishedAt ?? new Date().toISOString(),
      sessionId: record.sessionId,
      createdAt: serverTimestamp(),
    });

    await updateLeaderboardEntry(record);
  } catch (error) {
    console.warn('[Oddyssey] Failed to submit score to server', error);
  }
}

async function updateLeaderboardEntry(record: GameRecord): Promise<void> {
  const db = getFirebaseDb();
  if (!db) {
    return;
  }

  const themes = [record.themeId, 'all'];

  for (const themeId of themes) {
    const entryRef = doc(db, 'leaderboards', themeId, 'entries', record.userId);
    const entrySnap = await getDoc(entryRef);

    if (entrySnap.exists()) {
      const existing = entrySnap.data() as LeaderboardEntry;
      if (record.score > existing.bestScore) {
        await setDoc(entryRef, {
          userId: record.userId,
          userDisplayName: record.userDisplayName,
          avatarUrl: (record as GameRecord & { avatarUrl?: string }).avatarUrl ?? null,
          bestScore: record.score,
          bestFinishedAt: record.finishedAt ?? new Date().toISOString(),
          gamesPlayed: (existing.gamesPlayed ?? 0) + 1,
        });
      } else {
        await setDoc(entryRef, {
          ...existing,
          gamesPlayed: (existing.gamesPlayed ?? 0) + 1,
        });
      }
    } else {
      await setDoc(entryRef, {
        userId: record.userId,
        userDisplayName: record.userDisplayName,
        avatarUrl: (record as GameRecord & { avatarUrl?: string }).avatarUrl ?? null,
        bestScore: record.score,
        bestFinishedAt: record.finishedAt ?? new Date().toISOString(),
        gamesPlayed: 1,
      });
    }
  }
}

export async function getGlobalLeaderboard(themeId: string | 'all', count = 20): Promise<HighScoreEntry[]> {
  if (!isFirebaseConfigured()) {
    return listLocalHighScores(themeId, count);
  }

  const db = getFirebaseDb();
  if (!db) {
    return listLocalHighScores(themeId, count);
  }

  try {
    const entriesRef = collection(db, 'leaderboards', themeId, 'entries');
    const q = query(entriesRef, orderBy('bestScore', 'desc'), firestoreLimit(count));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((docSnap, index) => {
      const data = docSnap.data() as LeaderboardEntry;
      return mapLeaderboardToHighScore(data, themeId, index);
    });
  } catch (error) {
    console.warn('[Oddyssey] Failed to fetch global leaderboard, falling back to local', error);
    return listLocalHighScores(themeId, count);
  }
}

export async function getFriendsLeaderboard(
  themeId: string | 'all',
  friendIds: string[],
  count = 20,
): Promise<HighScoreEntry[]> {
  if (!isFirebaseConfigured() || friendIds.length === 0) {
    return [];
  }

  const db = getFirebaseDb();
  if (!db) {
    return [];
  }

  try {
    const allIds = [...friendIds];
    const entriesRef = collection(db, 'leaderboards', themeId, 'entries');

    const batches: HighScoreEntry[] = [];
    for (let i = 0; i < allIds.length; i += 10) {
      const batch = allIds.slice(i, i + 10);
      const q = query(entriesRef, where('userId', 'in', batch));
      const snapshot = await getDocs(q);
      snapshot.docs.forEach((docSnap, index) => {
        const data = docSnap.data() as LeaderboardEntry;
        batches.push(mapLeaderboardToHighScore(data, themeId, i + index));
      });
    }

    return batches
      .sort((a, b) => b.score - a.score)
      .slice(0, count);
  } catch (error) {
    console.warn('[Oddyssey] Failed to fetch friends leaderboard', error);
    return [];
  }
}

export async function getUserRank(userId: string, themeId: string | 'all'): Promise<number | null> {
  if (!isFirebaseConfigured()) {
    return null;
  }

  const db = getFirebaseDb();
  if (!db) {
    return null;
  }

  try {
    const userRef = doc(db, 'leaderboards', themeId, 'entries', userId);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      return null;
    }

    const userData = userSnap.data() as LeaderboardEntry;
    const entriesRef = collection(db, 'leaderboards', themeId, 'entries');
    const q = query(entriesRef, where('bestScore', '>', userData.bestScore));
    const snapshot = await getDocs(q);
    return snapshot.size + 1;
  } catch (error) {
    console.warn('[Oddyssey] Failed to get user rank', error);
    return null;
  }
}

export async function syncLocalRecords(userId: string, localRecords: GameRecord[]): Promise<void> {
  if (!isFirebaseConfigured() || localRecords.length === 0) {
    return;
  }

  const db = getFirebaseDb();
  if (!db) {
    return;
  }

  try {
    const recordsRef = collection(db, 'gameRecords');
    const q = query(recordsRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    const serverSessionIds = new Set(snapshot.docs.map((d) => d.data().sessionId));

    const missing = localRecords.filter((r) => !serverSessionIds.has(r.sessionId));
    for (const record of missing) {
      await submitScore(record);
    }
  } catch (error) {
    console.warn('[Oddyssey] Failed to sync local records', error);
  }
}
