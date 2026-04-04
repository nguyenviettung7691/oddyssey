import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  onSnapshot,
  updateDoc,
  type Unsubscribe,
} from 'firebase/firestore';
import { getFirebaseDb, isFirebaseConfigured } from '@/services/firebaseService';
import type { Match, MatchmakingEntry, MatchMode, PlayerMatchState } from '@/types/game';

/**
 * Join the matchmaking queue.
 * Creates a matchmaking entry and returns its ID.
 */
export async function joinMatchmaking(
  userId: string,
  displayName: string,
  avatarUrl: string | undefined,
  themeId: string,
  mode: MatchMode = 'versus',
): Promise<string | null> {
  if (!isFirebaseConfigured()) {
    return null;
  }

  const db = getFirebaseDb();
  if (!db) {
    return null;
  }

  try {
    const entryRef = doc(collection(db, 'matchmaking'));
    await setDoc(entryRef, {
      userId,
      displayName,
      avatarUrl: avatarUrl ?? null,
      themeId,
      mode,
      status: 'searching',
      matchId: null,
      createdAt: new Date().toISOString(),
    });
    return entryRef.id;
  } catch (error) {
    console.warn('[Oddyssey] Failed to join matchmaking', error);
    return null;
  }
}

/**
 * Cancel matchmaking by deleting the entry.
 */
export async function cancelMatchmaking(entryId: string): Promise<void> {
  if (!isFirebaseConfigured()) {
    return;
  }

  const db = getFirebaseDb();
  if (!db) {
    return;
  }

  try {
    const entryRef = doc(db, 'matchmaking', entryId);
    await deleteDoc(entryRef);
  } catch (error) {
    console.warn('[Oddyssey] Failed to cancel matchmaking', error);
  }
}

/**
 * Subscribe to matchmaking entry changes (to detect when matched).
 */
export function subscribeToMatchmakingEntry(
  entryId: string,
  callback: (entry: MatchmakingEntry | null) => void,
): Unsubscribe | null {
  if (!isFirebaseConfigured()) {
    return null;
  }

  const db = getFirebaseDb();
  if (!db) {
    return null;
  }

  const entryRef = doc(db, 'matchmaking', entryId);
  return onSnapshot(entryRef, (snap) => {
    if (snap.exists()) {
      callback({ id: snap.id, ...(snap.data() as Omit<MatchmakingEntry, 'id'>) });
    } else {
      callback(null);
    }
  });
}

/**
 * Create a match directly (for friend invites, skipping matchmaking).
 */
export async function createDirectMatch(
  player1Id: string,
  player1DisplayName: string,
  player1AvatarUrl: string | undefined,
  player2Id: string,
  player2DisplayName: string,
  player2AvatarUrl: string | undefined,
  themeId: string,
  themeLabel: string,
  mode: MatchMode = 'versus',
): Promise<string | null> {
  if (!isFirebaseConfigured()) {
    return null;
  }

  const db = getFirebaseDb();
  if (!db) {
    return null;
  }

  try {
    const matchRef = doc(collection(db, 'matches'));
    await setDoc(matchRef, {
      player1Id,
      player1DisplayName,
      player1AvatarUrl: player1AvatarUrl ?? null,
      player2Id,
      player2DisplayName,
      player2AvatarUrl: player2AvatarUrl ?? null,
      mode,
      status: 'waiting',
      themeId,
      themeLabel,
      player1Score: null,
      player2Score: null,
      player1Ready: false,
      player2Ready: false,
      teamScore: null,
      winnerId: null,
      startedAt: null,
      createdAt: new Date().toISOString(),
    });
    return matchRef.id;
  } catch (error) {
    console.warn('[Oddyssey] Failed to create direct match', error);
    return null;
  }
}

/**
 * Subscribe to real-time match updates.
 */
export function subscribeToMatch(
  matchId: string,
  callback: (match: Match | null) => void,
): Unsubscribe | null {
  if (!isFirebaseConfigured()) {
    return null;
  }

  const db = getFirebaseDb();
  if (!db) {
    return null;
  }

  const matchRef = doc(db, 'matches', matchId);
  return onSnapshot(matchRef, (snap) => {
    if (snap.exists()) {
      callback({ id: snap.id, ...(snap.data() as Omit<Match, 'id'>) });
    } else {
      callback(null);
    }
  });
}

/**
 * Get match details.
 */
export async function getMatchDetails(matchId: string): Promise<Match | null> {
  if (!isFirebaseConfigured()) {
    return null;
  }

  const db = getFirebaseDb();
  if (!db) {
    return null;
  }

  try {
    const matchRef = doc(db, 'matches', matchId);
    const snap = await getDoc(matchRef);
    if (!snap.exists()) {
      return null;
    }
    return { id: snap.id, ...(snap.data() as Omit<Match, 'id'>) };
  } catch (error) {
    console.warn('[Oddyssey] Failed to get match details', error);
    return null;
  }
}

/**
 * Set player as ready. When both players are ready, status transitions to 'playing'.
 */
export async function setPlayerReady(matchId: string, playerId: string): Promise<void> {
  if (!isFirebaseConfigured()) {
    return;
  }

  const db = getFirebaseDb();
  if (!db) {
    return;
  }

  try {
    const matchRef = doc(db, 'matches', matchId);
    const matchSnap = await getDoc(matchRef);
    if (!matchSnap.exists()) {
      return;
    }

    const match = matchSnap.data() as Omit<Match, 'id'>;
    const updates: Record<string, string | boolean> = {};

    if (playerId === match.player1Id) {
      updates.player1Ready = true;
    } else if (playerId === match.player2Id) {
      updates.player2Ready = true;
    } else {
      return;
    }

    const p1Ready = playerId === match.player1Id ? true : match.player1Ready;
    const p2Ready = playerId === match.player2Id ? true : match.player2Ready;

    if (p1Ready && p2Ready) {
      updates.status = 'playing';
      updates.startedAt = new Date().toISOString();
    } else {
      updates.status = 'ready';
    }

    await updateDoc(matchRef, updates);
  } catch (error) {
    console.warn('[Oddyssey] Failed to set player ready', error);
  }
}

/**
 * Update live player state during a match.
 */
export async function updatePlayerState(
  matchId: string,
  playerId: string,
  state: PlayerMatchState,
): Promise<void> {
  if (!isFirebaseConfigured()) {
    return;
  }

  const db = getFirebaseDb();
  if (!db) {
    return;
  }

  try {
    const stateRef = doc(db, 'matches', matchId, 'state', playerId);
    await setDoc(stateRef, state);
  } catch (error) {
    console.warn('[Oddyssey] Failed to update player state', error);
  }
}

/**
 * Subscribe to opponent's live state.
 */
export function subscribeToPlayerState(
  matchId: string,
  playerId: string,
  callback: (state: PlayerMatchState | null) => void,
): Unsubscribe | null {
  if (!isFirebaseConfigured()) {
    return null;
  }

  const db = getFirebaseDb();
  if (!db) {
    return null;
  }

  const stateRef = doc(db, 'matches', matchId, 'state', playerId);
  return onSnapshot(stateRef, (snap) => {
    if (snap.exists()) {
      callback(snap.data() as PlayerMatchState);
    } else {
      callback(null);
    }
  });
}

/**
 * Finish a match — submit final score and determine winner when both done.
 */
export async function finishMatch(
  matchId: string,
  playerId: string,
  finalScore: number,
): Promise<void> {
  if (!isFirebaseConfigured()) {
    return;
  }

  const db = getFirebaseDb();
  if (!db) {
    return;
  }

  try {
    const matchRef = doc(db, 'matches', matchId);
    const matchSnap = await getDoc(matchRef);
    if (!matchSnap.exists()) {
      return;
    }

    const match = matchSnap.data() as Omit<Match, 'id'>;
    const updates: Record<string, string | number | null> = {};

    if (playerId === match.player1Id) {
      updates.player1Score = finalScore;
    } else if (playerId === match.player2Id) {
      updates.player2Score = finalScore;
    } else {
      return;
    }

    const p1Score = playerId === match.player1Id ? finalScore : match.player1Score;
    const p2Score = playerId === match.player2Id ? finalScore : match.player2Score;

    if (match.mode === 'cooperative') {
      updates.teamScore = (p1Score ?? 0) + (p2Score ?? 0);
    }

    if (p1Score !== null && p2Score !== null) {
      updates.status = 'finished';
      if (match.mode === 'versus') {
        if (p1Score > p2Score) {
          updates.winnerId = match.player1Id;
        } else if (p2Score > p1Score) {
          updates.winnerId = match.player2Id;
        } else {
          updates.winnerId = null;
        }
      }
    }

    await updateDoc(matchRef, updates);
  } catch (error) {
    console.warn('[Oddyssey] Failed to finish match', error);
  }
}

/**
 * Get recent matches for a user.
 */
export async function getUserMatches(userId: string, count = 20): Promise<Match[]> {
  if (!isFirebaseConfigured()) {
    return [];
  }

  const db = getFirebaseDb();
  if (!db) {
    return [];
  }

  try {
    const matchesRef = collection(db, 'matches');

    const asPlayer1 = query(
      matchesRef,
      where('player1Id', '==', userId),
      orderBy('createdAt', 'desc'),
      firestoreLimit(count),
    );
    const asPlayer2 = query(
      matchesRef,
      where('player2Id', '==', userId),
      orderBy('createdAt', 'desc'),
      firestoreLimit(count),
    );

    const [snap1, snap2] = await Promise.all([getDocs(asPlayer1), getDocs(asPlayer2)]);

    const matches = new Map<string, Match>();
    for (const docSnap of [...snap1.docs, ...snap2.docs]) {
      if (!matches.has(docSnap.id)) {
        matches.set(docSnap.id, {
          id: docSnap.id,
          ...(docSnap.data() as Omit<Match, 'id'>),
        });
      }
    }

    return Array.from(matches.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, count);
  } catch (error) {
    console.warn('[Oddyssey] Failed to get user matches', error);
    return [];
  }
}
