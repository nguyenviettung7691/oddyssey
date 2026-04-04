import { defineStore } from 'pinia';
import type { GameEvent, EventStanding, GameRecord } from '@/types/game';
import {
  getActiveEvents,
  getUpcomingEvents,
  getCompletedEvents,
  getEventDetails,
  joinEvent as joinEventService,
  getEventLeaderboard,
  submitEventScore,
  getUserEventStanding,
  subscribeToEvent,
  subscribeToEventLeaderboard,
} from '@/services/eventService';
import type { Unsubscribe } from 'firebase/firestore';

export const useEventStore = defineStore('event', {
  state: () => ({
    activeEvents: [] as GameEvent[],
    upcomingEvents: [] as GameEvent[],
    completedEvents: [] as GameEvent[],
    currentEvent: null as GameEvent | null,
    eventStandings: [] as EventStanding[],
    userStanding: null as EventStanding | null,
    loading: false,
    error: null as string | null,
    _eventUnsub: null as Unsubscribe | null,
    _standingsUnsub: null as Unsubscribe | null,
  }),
  getters: {
    isEventActive(state): boolean {
      if (!state.currentEvent) return false;
      return state.currentEvent.status === 'active';
    },
    currentEventTimeRemaining(state): number {
      if (!state.currentEvent) return 0;
      const end = new Date(state.currentEvent.endTime).getTime();
      const now = Date.now();
      return Math.max(0, end - now);
    },
    hasJoinedCurrentEvent(state): boolean {
      return state.userStanding !== null;
    },
    featuredEvent(state): GameEvent | null {
      return state.activeEvents.length > 0 ? state.activeEvents[0] : null;
    },
  },
  actions: {
    async fetchActiveEvents(): Promise<void> {
      this.loading = true;
      try {
        this.activeEvents = await getActiveEvents();
      } catch (error) {
        console.warn('[Oddyssey] Failed to fetch active events', error);
      } finally {
        this.loading = false;
      }
    },
    async fetchUpcomingEvents(): Promise<void> {
      try {
        this.upcomingEvents = await getUpcomingEvents();
      } catch (error) {
        console.warn('[Oddyssey] Failed to fetch upcoming events', error);
      }
    },
    async fetchCompletedEvents(count = 10): Promise<void> {
      try {
        this.completedEvents = await getCompletedEvents(count);
      } catch (error) {
        console.warn('[Oddyssey] Failed to fetch completed events', error);
      }
    },
    async fetchEventDetails(eventId: string): Promise<void> {
      this.loading = true;
      this.error = null;
      try {
        this.currentEvent = await getEventDetails(eventId);
        if (!this.currentEvent) {
          this.error = 'Event not found';
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to load event';
      } finally {
        this.loading = false;
      }
    },
    async joinEvent(eventId: string, userId: string, displayName: string, avatarUrl?: string): Promise<void> {
      try {
        await joinEventService(eventId, userId, displayName, avatarUrl);
        this.userStanding = {
          userId,
          displayName,
          avatarUrl,
          bestScore: 0,
          totalScore: 0,
          gamesPlayed: 0,
          bestStreak: 0,
          lastPlayedAt: new Date().toISOString(),
          joinedAt: new Date().toISOString(),
        };
        if (this.currentEvent) {
          this.currentEvent = {
            ...this.currentEvent,
            participantCount: this.currentEvent.participantCount + 1,
          };
        }
      } catch (error) {
        console.warn('[Oddyssey] Failed to join event', error);
      }
    },
    async fetchStandings(eventId: string, count = 20): Promise<void> {
      try {
        this.eventStandings = await getEventLeaderboard(eventId, count);
      } catch (error) {
        console.warn('[Oddyssey] Failed to fetch standings', error);
      }
    },
    async submitScore(eventId: string, record: GameRecord): Promise<void> {
      try {
        await submitEventScore(eventId, record);
        await this.fetchUserStanding(eventId, record.userId);
      } catch (error) {
        console.warn('[Oddyssey] Failed to submit event score', error);
      }
    },
    async fetchUserStanding(eventId: string, userId: string): Promise<void> {
      try {
        this.userStanding = await getUserEventStanding(eventId, userId);
      } catch (error) {
        console.warn('[Oddyssey] Failed to fetch user standing', error);
      }
    },
    subscribeToCurrentEvent(eventId: string): void {
      this.unsubscribeEvent();
      this._eventUnsub = subscribeToEvent(eventId, (event) => {
        this.currentEvent = event;
      });
    },
    subscribeToStandings(eventId: string, count = 20): void {
      this.unsubscribeStandings();
      this._standingsUnsub = subscribeToEventLeaderboard(eventId, count, (standings) => {
        this.eventStandings = standings;
      });
    },
    unsubscribeEvent(): void {
      if (this._eventUnsub) {
        this._eventUnsub();
        this._eventUnsub = null;
      }
    },
    unsubscribeStandings(): void {
      if (this._standingsUnsub) {
        this._standingsUnsub();
        this._standingsUnsub = null;
      }
    },
    cleanup(): void {
      this.unsubscribeEvent();
      this.unsubscribeStandings();
      this.currentEvent = null;
      this.eventStandings = [];
      this.userStanding = null;
    },
  },
});
