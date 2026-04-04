import { defineStore } from 'pinia';
import {
  collection,
  query,
  where,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { getFirebaseDb, isFirebaseConfigured } from '@/services/firebaseService';

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    pendingFriendRequests: 0,
    pendingChallenges: 0,
    activeChallenges: 0,
    activeMatches: 0,
    activeEvents: 0,
    _unsubscribers: [] as Unsubscribe[],
  }),
  getters: {
    totalBadgeCount(state): number {
      return state.pendingFriendRequests + state.pendingChallenges + state.activeChallenges + state.activeMatches;
    },
    friendsBadge(state): number {
      return state.pendingFriendRequests;
    },
    challengesBadge(state): number {
      return state.pendingChallenges + state.activeChallenges;
    },
    matchesBadge(state): number {
      return state.activeMatches;
    },
    eventsBadge(state): number {
      return state.activeEvents;
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

      // Friend requests
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

      // Pending challenges
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

      // Active challenges
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

      // Active matches (waiting for this user)
      const matchesRef = collection(db, 'matches');
      const matchesAsP1 = query(
        matchesRef,
        where('player1Id', '==', userId),
        where('status', 'in', ['waiting', 'ready']),
      );
      const unsubMatchesP1 = onSnapshot(matchesAsP1, (snapshot) => {
        this.activeMatches = snapshot.size;
      }, (error) => {
        console.warn('[Oddyssey] Matches P1 listener error', error);
      });
      this._unsubscribers.push(unsubMatchesP1);

      const matchesAsP2 = query(
        matchesRef,
        where('player2Id', '==', userId),
        where('status', 'in', ['waiting', 'ready']),
      );
      const unsubMatchesP2 = onSnapshot(matchesAsP2, (snapshot) => {
        // Add to existing count from P1 query
        this.activeMatches += snapshot.size;
      }, (error) => {
        console.warn('[Oddyssey] Matches P2 listener error', error);
      });
      this._unsubscribers.push(unsubMatchesP2);

      // Active events
      const eventsRef = collection(db, 'events');
      const activeEventsQuery = query(
        eventsRef,
        where('status', '==', 'active'),
      );
      const unsubEvents = onSnapshot(activeEventsQuery, (snapshot) => {
        this.activeEvents = snapshot.size;
      }, (error) => {
        console.warn('[Oddyssey] Events listener error', error);
      });
      this._unsubscribers.push(unsubEvents);
    },
    stopListening(): void {
      this._unsubscribers.forEach((unsub) => unsub());
      this._unsubscribers = [];
      this.pendingFriendRequests = 0;
      this.pendingChallenges = 0;
      this.activeChallenges = 0;
      this.activeMatches = 0;
      this.activeEvents = 0;
    },
  },
});
