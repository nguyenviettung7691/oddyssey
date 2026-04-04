import {
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  updateDoc,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { getFirebaseDb, isFirebaseConfigured } from '@/services/firebaseService';
import type { Challenge, ChallengeStatus } from '@/types/game';

export async function sendChallenge(
  challengerId: string,
  challengerDisplayName: string,
  challengerAvatarUrl: string | undefined,
  challengedId: string,
  challengedDisplayName: string,
  challengedAvatarUrl: string | undefined,
  themeId: string,
  themeLabel: string,
): Promise<string | null> {
  if (!isFirebaseConfigured()) {
    return null;
  }

  const db = getFirebaseDb();
  if (!db) {
    return null;
  }

  const challengeRef = doc(collection(db, 'challenges'));
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  await setDoc(challengeRef, {
    challengerId,
    challengerDisplayName,
    challengerAvatarUrl: challengerAvatarUrl ?? null,
    challengedId,
    challengedDisplayName,
    challengedAvatarUrl: challengedAvatarUrl ?? null,
    themeId,
    themeLabel,
    status: 'pending',
    challengerScore: null,
    challengedScore: null,
    challengerSessionId: null,
    challengedSessionId: null,
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    winnerId: null,
  });

  return challengeRef.id;
}

export async function acceptChallenge(challengeId: string): Promise<void> {
  if (!isFirebaseConfigured()) {
    return;
  }

  const db = getFirebaseDb();
  if (!db) {
    return;
  }

  const challengeRef = doc(db, 'challenges', challengeId);
  await updateDoc(challengeRef, { status: 'accepted' });
}

export async function declineChallenge(challengeId: string): Promise<void> {
  if (!isFirebaseConfigured()) {
    return;
  }

  const db = getFirebaseDb();
  if (!db) {
    return;
  }

  const challengeRef = doc(db, 'challenges', challengeId);
  await updateDoc(challengeRef, { status: 'declined' });
}

export async function submitChallengeScore(
  challengeId: string,
  userId: string,
  score: number,
  sessionId: string,
): Promise<void> {
  if (!isFirebaseConfigured()) {
    return;
  }

  const db = getFirebaseDb();
  if (!db) {
    return;
  }

  const challengeRef = doc(db, 'challenges', challengeId);
  const challengeSnap = await getDoc(challengeRef);
  if (!challengeSnap.exists()) {
    return;
  }

  const challenge = challengeSnap.data() as Omit<Challenge, 'id'>;

  const updates: Record<string, string | number | null> = {};

  if (userId === challenge.challengerId) {
    updates.challengerScore = score;
    updates.challengerSessionId = sessionId;
  } else if (userId === challenge.challengedId) {
    updates.challengedScore = score;
    updates.challengedSessionId = sessionId;
  } else {
    return;
  }

  const challengerScore = userId === challenge.challengerId ? score : challenge.challengerScore;
  const challengedScore = userId === challenge.challengedId ? score : challenge.challengedScore;

  if (challengerScore !== null && challengedScore !== null) {
    updates.status = 'completed';
    if (challengerScore > challengedScore) {
      updates.winnerId = challenge.challengerId;
    } else if (challengedScore > challengerScore) {
      updates.winnerId = challenge.challengedId;
    } else {
      updates.winnerId = null;
    }
  }

  await updateDoc(challengeRef, updates);
}

export async function getChallenges(
  userId: string,
  status?: ChallengeStatus,
): Promise<Challenge[]> {
  if (!isFirebaseConfigured()) {
    return [];
  }

  const db = getFirebaseDb();
  if (!db) {
    return [];
  }

  try {
    const challengesRef = collection(db, 'challenges');

    const asChallenger = status
      ? query(challengesRef, where('challengerId', '==', userId), where('status', '==', status), orderBy('createdAt', 'desc'), firestoreLimit(50))
      : query(challengesRef, where('challengerId', '==', userId), orderBy('createdAt', 'desc'), firestoreLimit(50));

    const asChallenged = status
      ? query(challengesRef, where('challengedId', '==', userId), where('status', '==', status), orderBy('createdAt', 'desc'), firestoreLimit(50))
      : query(challengesRef, where('challengedId', '==', userId), orderBy('createdAt', 'desc'), firestoreLimit(50));

    const [challengerSnap, challengedSnap] = await Promise.all([
      getDocs(asChallenger),
      getDocs(asChallenged),
    ]);

    const challenges = new Map<string, Challenge>();
    for (const docSnap of [...challengerSnap.docs, ...challengedSnap.docs]) {
      if (!challenges.has(docSnap.id)) {
        challenges.set(docSnap.id, {
          id: docSnap.id,
          ...(docSnap.data() as Omit<Challenge, 'id'>),
        });
      }
    }

    return Array.from(challenges.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  } catch (error) {
    console.warn('[Oddyssey] Failed to get challenges', error);
    return [];
  }
}

export async function getChallengeDetails(challengeId: string): Promise<Challenge | null> {
  if (!isFirebaseConfigured()) {
    return null;
  }

  const db = getFirebaseDb();
  if (!db) {
    return null;
  }

  try {
    const challengeRef = doc(db, 'challenges', challengeId);
    const snap = await getDoc(challengeRef);
    if (!snap.exists()) {
      return null;
    }
    return { id: snap.id, ...(snap.data() as Omit<Challenge, 'id'>) };
  } catch (error) {
    console.warn('[Oddyssey] Failed to get challenge details', error);
    return null;
  }
}

export function subscribeToChallenges(
  userId: string,
  callback: (challenges: Challenge[]) => void,
): Unsubscribe | null {
  if (!isFirebaseConfigured()) {
    return null;
  }

  const db = getFirebaseDb();
  if (!db) {
    return null;
  }

  const challengesRef = collection(db, 'challenges');
  const q = query(
    challengesRef,
    where('challengedId', '==', userId),
    where('status', 'in', ['pending', 'accepted']),
    orderBy('createdAt', 'desc'),
  );

  return onSnapshot(q, (snapshot) => {
    const challenges = snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Challenge, 'id'>),
    }));
    callback(challenges);
  });
}
