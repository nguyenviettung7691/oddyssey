import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  onSnapshot,
  updateDoc,
  increment,
  serverTimestamp,
  type Unsubscribe,
} from 'firebase/firestore';
import { getFirebaseDb, isFirebaseConfigured } from '@/services/firebaseService';
import type { GameEvent, EventStanding, GameRecord } from '@/types/game';

/**
 * Fetch all currently active events (status === 'active' and endTime > now).
 */
export async function getActiveEvents(): Promise<GameEvent[]> {
  if (!isFirebaseConfigured()) {
    return [];
  }

  const db = getFirebaseDb();
  if (!db) {
    return [];
  }

  try {
    const eventsRef = collection(db, 'events');
    const q = query(
      eventsRef,
      where('status', '==', 'active'),
      orderBy('startTime', 'desc'),
      firestoreLimit(20),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<GameEvent, 'id'>),
    }));
  } catch (error) {
    console.warn('[Oddyssey] Failed to get active events', error);
    return [];
  }
}

/**
 * Fetch upcoming events (status === 'upcoming').
 */
export async function getUpcomingEvents(): Promise<GameEvent[]> {
  if (!isFirebaseConfigured()) {
    return [];
  }

  const db = getFirebaseDb();
  if (!db) {
    return [];
  }

  try {
    const eventsRef = collection(db, 'events');
    const q = query(
      eventsRef,
      where('status', '==', 'upcoming'),
      orderBy('startTime', 'asc'),
      firestoreLimit(10),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<GameEvent, 'id'>),
    }));
  } catch (error) {
    console.warn('[Oddyssey] Failed to get upcoming events', error);
    return [];
  }
}

/**
 * Fetch completed events (status === 'completed').
 */
export async function getCompletedEvents(count = 10): Promise<GameEvent[]> {
  if (!isFirebaseConfigured()) {
    return [];
  }

  const db = getFirebaseDb();
  if (!db) {
    return [];
  }

  try {
    const eventsRef = collection(db, 'events');
    const q = query(
      eventsRef,
      where('status', '==', 'completed'),
      orderBy('endTime', 'desc'),
      firestoreLimit(count),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<GameEvent, 'id'>),
    }));
  } catch (error) {
    console.warn('[Oddyssey] Failed to get completed events', error);
    return [];
  }
}

/**
 * Fetch a single event by ID.
 */
export async function getEventDetails(eventId: string): Promise<GameEvent | null> {
  if (!isFirebaseConfigured()) {
    return null;
  }

  const db = getFirebaseDb();
  if (!db) {
    return null;
  }

  try {
    const eventRef = doc(db, 'events', eventId);
    const snap = await getDoc(eventRef);
    if (!snap.exists()) {
      return null;
    }
    return { id: snap.id, ...(snap.data() as Omit<GameEvent, 'id'>) };
  } catch (error) {
    console.warn('[Oddyssey] Failed to get event details', error);
    return null;
  }
}

/**
 * Join an event — creates a standings entry for the user and increments participantCount.
 */
export async function joinEvent(
  eventId: string,
  userId: string,
  displayName: string,
  avatarUrl?: string,
): Promise<void> {
  if (!isFirebaseConfigured()) {
    return;
  }

  const db = getFirebaseDb();
  if (!db) {
    return;
  }

  try {
    const standingRef = doc(db, 'events', eventId, 'standings', userId);
    const existing = await getDoc(standingRef);
    if (existing.exists()) {
      return;
    }

    const now = new Date().toISOString();
    await setDoc(standingRef, {
      userId,
      displayName,
      avatarUrl: avatarUrl ?? null,
      bestScore: 0,
      totalScore: 0,
      gamesPlayed: 0,
      bestStreak: 0,
      lastPlayedAt: now,
      joinedAt: now,
    });

    const eventRef = doc(db, 'events', eventId);
    await updateDoc(eventRef, { participantCount: increment(1) });
  } catch (error) {
    console.warn('[Oddyssey] Failed to join event', error);
  }
}

/**
 * Fetch the event leaderboard (standings sorted by bestScore).
 */
export async function getEventLeaderboard(
  eventId: string,
  count = 20,
): Promise<EventStanding[]> {
  if (!isFirebaseConfigured()) {
    return [];
  }

  const db = getFirebaseDb();
  if (!db) {
    return [];
  }

  try {
    const standingsRef = collection(db, 'events', eventId, 'standings');
    const q = query(standingsRef, orderBy('bestScore', 'desc'), firestoreLimit(count));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((d, index) => ({
      ...(d.data() as EventStanding),
      rank: index + 1,
    }));
  } catch (error) {
    console.warn('[Oddyssey] Failed to get event leaderboard', error);
    return [];
  }
}

/**
 * Submit a game score to an event.
 * Saves a game record under the event and updates standings.
 */
export async function submitEventScore(
  eventId: string,
  record: GameRecord,
): Promise<void> {
  if (!isFirebaseConfigured()) {
    return;
  }

  const db = getFirebaseDb();
  if (!db) {
    return;
  }

  try {
    const gameRecordRef = doc(collection(db, 'events', eventId, 'gameRecords'));
    await setDoc(gameRecordRef, {
      userId: record.userId,
      userDisplayName: record.userDisplayName,
      score: record.score,
      themeId: record.themeId,
      totalQuestions: record.totalQuestions,
      longestStreak: record.longestStreak,
      finishedAt: record.finishedAt ?? new Date().toISOString(),
      sessionId: record.sessionId,
      createdAt: serverTimestamp(),
    });

    const standingRef = doc(db, 'events', eventId, 'standings', record.userId);
    const standingSnap = await getDoc(standingRef);

    if (standingSnap.exists()) {
      const existing = standingSnap.data() as EventStanding;
      const updates: Record<string, unknown> = {
        gamesPlayed: (existing.gamesPlayed ?? 0) + 1,
        totalScore: (existing.totalScore ?? 0) + record.score,
        lastPlayedAt: new Date().toISOString(),
      };

      if (record.score > (existing.bestScore ?? 0)) {
        updates.bestScore = record.score;
      }
      if (record.longestStreak > (existing.bestStreak ?? 0)) {
        updates.bestStreak = record.longestStreak;
      }

      await updateDoc(standingRef, updates);
    } else {
      const now = new Date().toISOString();
      await setDoc(standingRef, {
        userId: record.userId,
        displayName: record.userDisplayName,
        avatarUrl: null,
        bestScore: record.score,
        totalScore: record.score,
        gamesPlayed: 1,
        bestStreak: record.longestStreak,
        lastPlayedAt: now,
        joinedAt: now,
      });

      const eventRef = doc(db, 'events', eventId);
      await updateDoc(eventRef, { participantCount: increment(1) });
    }
  } catch (error) {
    console.warn('[Oddyssey] Failed to submit event score', error);
  }
}

/**
 * Get the current user's standing in an event.
 */
export async function getUserEventStanding(
  eventId: string,
  userId: string,
): Promise<EventStanding | null> {
  if (!isFirebaseConfigured()) {
    return null;
  }

  const db = getFirebaseDb();
  if (!db) {
    return null;
  }

  try {
    const standingRef = doc(db, 'events', eventId, 'standings', userId);
    const snap = await getDoc(standingRef);
    if (!snap.exists()) {
      return null;
    }
    return snap.data() as EventStanding;
  } catch (error) {
    console.warn('[Oddyssey] Failed to get user event standing', error);
    return null;
  }
}

/**
 * Subscribe to real-time event updates.
 */
export function subscribeToEvent(
  eventId: string,
  callback: (event: GameEvent) => void,
): Unsubscribe | null {
  if (!isFirebaseConfigured()) {
    return null;
  }

  const db = getFirebaseDb();
  if (!db) {
    return null;
  }

  const eventRef = doc(db, 'events', eventId);
  return onSnapshot(eventRef, (snap) => {
    if (snap.exists()) {
      callback({ id: snap.id, ...(snap.data() as Omit<GameEvent, 'id'>) });
    }
  });
}

/**
 * Subscribe to real-time event leaderboard updates.
 */
export function subscribeToEventLeaderboard(
  eventId: string,
  count: number,
  callback: (standings: EventStanding[]) => void,
): Unsubscribe | null {
  if (!isFirebaseConfigured()) {
    return null;
  }

  const db = getFirebaseDb();
  if (!db) {
    return null;
  }

  const standingsRef = collection(db, 'events', eventId, 'standings');
  const q = query(standingsRef, orderBy('bestScore', 'desc'), firestoreLimit(count));

  return onSnapshot(q, (snapshot) => {
    const standings = snapshot.docs.map((d, index) => ({
      ...(d.data() as EventStanding),
      rank: index + 1,
    }));
    callback(standings);
  });
}
