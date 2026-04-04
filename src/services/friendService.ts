import {
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { getFirebaseDb, isFirebaseConfigured } from '@/services/firebaseService';
import type { FriendRecord, FriendRequest, UserProfile } from '@/types/game';

export async function ensureUserProfile(
  userId: string,
  displayName: string,
  email: string,
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
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      await updateDoc(userRef, {
        displayName,
        avatarUrl: avatarUrl ?? null,
        lastSeenAt: new Date().toISOString(),
      });
    } else {
      await setDoc(userRef, {
        displayName,
        avatarUrl: avatarUrl ?? null,
        email,
        createdAt: new Date().toISOString(),
        lastSeenAt: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.warn('[Oddyssey] Failed to ensure user profile', error);
  }
}

export async function searchUsers(queryText: string, currentUserId: string): Promise<UserProfile & { id: string }[]> {
  if (!isFirebaseConfigured() || !queryText.trim()) {
    return [];
  }

  const db = getFirebaseDb();
  if (!db) {
    return [];
  }

  try {
    const usersRef = collection(db, 'users');
    const q = query(
      usersRef,
      where('displayName', '>=', queryText),
      where('displayName', '<=', queryText + '\uf8ff'),
      firestoreLimit(20),
    );
    const snapshot = await getDocs(q);

    return snapshot.docs
      .filter((d) => d.id !== currentUserId)
      .map((d) => ({
        id: d.id,
        ...(d.data() as UserProfile),
      }));
  } catch (error) {
    console.warn('[Oddyssey] Failed to search users', error);
    return [];
  }
}

export async function sendFriendRequest(
  fromUserId: string,
  fromDisplayName: string,
  fromAvatarUrl: string | undefined,
  toUserId: string,
): Promise<void> {
  if (!isFirebaseConfigured()) {
    return;
  }

  const db = getFirebaseDb();
  if (!db) {
    return;
  }

  const requestsRef = collection(db, 'friendRequests');
  const existing = query(
    requestsRef,
    where('fromUserId', '==', fromUserId),
    where('toUserId', '==', toUserId),
    where('status', '==', 'pending'),
  );
  const existingSnap = await getDocs(existing);
  if (!existingSnap.empty) {
    return;
  }

  const requestRef = doc(requestsRef);
  await setDoc(requestRef, {
    fromUserId,
    fromDisplayName,
    fromAvatarUrl: fromAvatarUrl ?? null,
    toUserId,
    status: 'pending',
    createdAt: new Date().toISOString(),
  });
}

export async function acceptFriendRequest(requestId: string): Promise<void> {
  if (!isFirebaseConfigured()) {
    return;
  }

  const db = getFirebaseDb();
  if (!db) {
    return;
  }

  const requestRef = doc(db, 'friendRequests', requestId);
  const requestSnap = await getDoc(requestRef);
  if (!requestSnap.exists()) {
    return;
  }

  const request = requestSnap.data() as Omit<FriendRequest, 'id'>;
  await updateDoc(requestRef, { status: 'accepted' });

  const fromUserRef = doc(db, 'users', request.fromUserId);
  const toUserRef = doc(db, 'users', request.toUserId);
  const fromSnap = await getDoc(fromUserRef);
  const toSnap = await getDoc(toUserRef);

  const fromData = fromSnap.data() as UserProfile | undefined;
  const toData = toSnap.data() as UserProfile | undefined;

  const friendRef1 = doc(db, 'users', request.fromUserId, 'friends', request.toUserId);
  await setDoc(friendRef1, {
    friendId: request.toUserId,
    displayName: toData?.displayName ?? 'Unknown',
    avatarUrl: toData?.avatarUrl ?? null,
    addedAt: new Date().toISOString(),
  });

  const friendRef2 = doc(db, 'users', request.toUserId, 'friends', request.fromUserId);
  await setDoc(friendRef2, {
    friendId: request.fromUserId,
    displayName: fromData?.displayName ?? request.fromDisplayName,
    avatarUrl: fromData?.avatarUrl ?? request.fromAvatarUrl ?? null,
    addedAt: new Date().toISOString(),
  });
}

export async function declineFriendRequest(requestId: string): Promise<void> {
  if (!isFirebaseConfigured()) {
    return;
  }

  const db = getFirebaseDb();
  if (!db) {
    return;
  }

  const requestRef = doc(db, 'friendRequests', requestId);
  await updateDoc(requestRef, { status: 'declined' });
}

export async function removeFriend(userId: string, friendId: string): Promise<void> {
  if (!isFirebaseConfigured()) {
    return;
  }

  const db = getFirebaseDb();
  if (!db) {
    return;
  }

  await deleteDoc(doc(db, 'users', userId, 'friends', friendId));
  await deleteDoc(doc(db, 'users', friendId, 'friends', userId));
}

export async function getFriends(userId: string): Promise<FriendRecord[]> {
  if (!isFirebaseConfigured()) {
    return [];
  }

  const db = getFirebaseDb();
  if (!db) {
    return [];
  }

  try {
    const friendsRef = collection(db, 'users', userId, 'friends');
    const q = query(friendsRef, orderBy('addedAt', 'desc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((d) => d.data() as FriendRecord);
  } catch (error) {
    console.warn('[Oddyssey] Failed to get friends', error);
    return [];
  }
}

export async function getFriendIds(userId: string): Promise<string[]> {
  const friends = await getFriends(userId);
  return friends.map((f) => f.friendId);
}

export async function getPendingRequests(userId: string): Promise<FriendRequest[]> {
  if (!isFirebaseConfigured()) {
    return [];
  }

  const db = getFirebaseDb();
  if (!db) {
    return [];
  }

  try {
    const requestsRef = collection(db, 'friendRequests');
    const q = query(
      requestsRef,
      where('toUserId', '==', userId),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc'),
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<FriendRequest, 'id'>),
    }));
  } catch (error) {
    console.warn('[Oddyssey] Failed to get pending requests', error);
    return [];
  }
}
