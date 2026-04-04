import { defineStore } from 'pinia';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { getFirebaseDb, isFirebaseConfigured } from '@/services/firebaseService';
import type { FriendRequest, Challenge } from '@/types/game';

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    pendingFriendRequests: 0,
    pendingChallenges: 0,
    activeChallenges: 0,
    _unsubscribers: [] as Unsubscribe[],
  }),
  getters: {
    totalBadgeCount(state): number {
      return state.pendingFriendRequests + state.pendingChallenges + state.activeChallenges;
    },
    friendsBadge(state): number {
      return state.pendingFriendRequests;
    },
    challengesBadge(state): number {
      return state.pendingChallenges + state.activeChallenges;
    },
  },
  actions: {
    startListening(userId: string): void {
      this.stopListening();

      if (!isFirebaseConfigured()) {
        return;
      }

      const db = getFirebaseDb();
      if (!db) {
        return;
      }

      const friendRequestsRef = collection(db, 'friendRequests');
      const friendRequestsQuery = query(
        friendRequestsRef,
        where('toUserId', '==', userId),
        where('status', '==', 'pending'),
      );

      const unsubFriendRequests = onSnapshot(friendRequestsQuery, (snapshot) => {
        this.pendingFriendRequests = snapshot.size;
      }, (error) => {
        console.warn('[Oddyssey] Friend requests listener error', error);
      });
      this._unsubscribers.push(unsubFriendRequests);

      const challengesRef = collection(db, 'challenges');

      const pendingQuery = query(
        challengesRef,
        where('challengedId', '==', userId),
        where('status', '==', 'pending'),
      );
      const unsubPending = onSnapshot(pendingQuery, (snapshot) => {
        this.pendingChallenges = snapshot.size;
      }, (error) => {
        console.warn('[Oddyssey] Pending challenges listener error', error);
      });
      this._unsubscribers.push(unsubPending);

      const activeQuery = query(
        challengesRef,
        where('status', '==', 'accepted'),
      );
      const unsubActive = onSnapshot(activeQuery, (snapshot) => {
        let count = 0;
        snapshot.docs.forEach((d) => {
          const data = d.data();
          if (data.challengerId === userId || data.challengedId === userId) {
            const isChallenger = data.challengerId === userId;
            const myScore = isChallenger ? data.challengerScore : data.challengedScore;
            if (myScore === null) {
              count++;
            }
          }
        });
        this.activeChallenges = count;
      }, (error) => {
        console.warn('[Oddyssey] Active challenges listener error', error);
      });
      this._unsubscribers.push(unsubActive);
    },
    stopListening(): void {
      this._unsubscribers.forEach((unsub) => unsub());
      this._unsubscribers = [];
      this.pendingFriendRequests = 0;
      this.pendingChallenges = 0;
      this.activeChallenges = 0;
    },
  },
});
