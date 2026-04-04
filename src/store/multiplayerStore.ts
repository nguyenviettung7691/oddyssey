import { defineStore } from 'pinia';
import type { Match, MatchMode, PlayerMatchState } from '@/types/game';
import {
  joinMatchmaking,
  cancelMatchmaking,
  subscribeToMatchmakingEntry,
  subscribeToMatch,
  subscribeToPlayerState,
  setPlayerReady,
  updatePlayerState,
  finishMatch,
} from '@/services/matchService';
import type { Unsubscribe } from 'firebase/firestore';

export const useMultiplayerStore = defineStore('multiplayer', {
  state: () => ({
    matchId: null as string | null,
    match: null as Match | null,
    matchmakingEntryId: null as string | null,
    isSearching: false,
    opponentState: null as PlayerMatchState | null,
    matchResult: null as 'win' | 'loss' | 'draw' | null,
    error: null as string | null,
    _matchUnsub: null as Unsubscribe | null,
    _matchmakingUnsub: null as Unsubscribe | null,
    _opponentStateUnsub: null as Unsubscribe | null,
  }),
  getters: {
    isInMatch(state): boolean {
      return state.match !== null && state.match.status !== 'finished' && state.match.status !== 'abandoned';
    },
    matchStatus(state): Match['status'] | null {
      return state.match?.status ?? null;
    },
    opponentInfo(state): { id: string; displayName: string; avatarUrl?: string } | null {
      if (!state.match) return null;
      // Determine which player the current user is NOT
      // This will be resolved with the userId from userStore when used
      return null;
    },
    opponentScore(state): number {
      return state.opponentState?.currentScore ?? 0;
    },
    opponentStreak(state): number {
      return state.opponentState?.currentStreak ?? 0;
    },
    isVersus(state): boolean {
      return state.match?.mode === 'versus';
    },
    isCooperative(state): boolean {
      return state.match?.mode === 'cooperative';
    },
    teamScore(state): number {
      return state.match?.teamScore ?? 0;
    },
  },
  actions: {
    async searchForMatch(
      userId: string,
      displayName: string,
      avatarUrl: string | undefined,
      themeId: string,
      mode: MatchMode = 'versus',
    ): Promise<void> {
      this.isSearching = true;
      this.error = null;

      try {
        const entryId = await joinMatchmaking(userId, displayName, avatarUrl, themeId, mode);
        if (!entryId) {
          this.error = 'Failed to join matchmaking';
          this.isSearching = false;
          return;
        }

        this.matchmakingEntryId = entryId;

        this._matchmakingUnsub = subscribeToMatchmakingEntry(entryId, (entry) => {
          if (!entry) {
            this.isSearching = false;
            return;
          }

          if (entry.status === 'matched' && entry.matchId) {
            this.isSearching = false;
            this.matchId = entry.matchId;
            this.subscribeToMatchUpdates(entry.matchId, userId);
            this.unsubscribeMatchmaking();
          }
        });
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Matchmaking failed';
        this.isSearching = false;
      }
    },
    async cancelSearch(): Promise<void> {
      if (this.matchmakingEntryId) {
        await cancelMatchmaking(this.matchmakingEntryId);
      }
      this.isSearching = false;
      this.matchmakingEntryId = null;
      this.unsubscribeMatchmaking();
    },
    subscribeToMatchUpdates(matchId: string, userId?: string): void {
      this.unsubscribeMatch();
      this._matchUnsub = subscribeToMatch(matchId, (match) => {
        this.match = match;
        if (match?.status === 'finished' && userId) {
          this.determineResult(userId);
        }
      });
    },
    subscribeToOpponent(matchId: string, opponentId: string): void {
      this.unsubscribeOpponentState();
      this._opponentStateUnsub = subscribeToPlayerState(matchId, opponentId, (state) => {
        this.opponentState = state;
      });
    },
    async readyUp(matchId: string, playerId: string): Promise<void> {
      await setPlayerReady(matchId, playerId);
    },
    async broadcastState(matchId: string, playerId: string, state: PlayerMatchState): Promise<void> {
      await updatePlayerState(matchId, playerId, state);
    },
    async submitFinalScore(matchId: string, playerId: string, finalScore: number): Promise<void> {
      await finishMatch(matchId, playerId, finalScore);
    },
    determineResult(userId: string): void {
      if (!this.match) return;

      if (this.match.mode === 'cooperative') {
        this.matchResult = 'win'; // Coop always "wins" together
        return;
      }

      if (this.match.winnerId === null &&
          this.match.player1Score !== null &&
          this.match.player2Score !== null) {
        this.matchResult = 'draw';
      } else if (this.match.winnerId === userId) {
        this.matchResult = 'win';
      } else if (this.match.winnerId !== null) {
        this.matchResult = 'loss';
      }
    },
    getOpponentId(userId: string): string | null {
      if (!this.match) return null;
      if (this.match.player1Id === userId) return this.match.player2Id;
      if (this.match.player2Id === userId) return this.match.player1Id;
      return null;
    },
    getOpponentInfo(userId: string): { id: string; displayName: string; avatarUrl?: string } | null {
      if (!this.match) return null;
      if (this.match.player1Id === userId) {
        return {
          id: this.match.player2Id,
          displayName: this.match.player2DisplayName,
          avatarUrl: this.match.player2AvatarUrl,
        };
      }
      if (this.match.player2Id === userId) {
        return {
          id: this.match.player1Id,
          displayName: this.match.player1DisplayName,
          avatarUrl: this.match.player1AvatarUrl,
        };
      }
      return null;
    },
    unsubscribeMatchmaking(): void {
      if (this._matchmakingUnsub) {
        this._matchmakingUnsub();
        this._matchmakingUnsub = null;
      }
    },
    unsubscribeMatch(): void {
      if (this._matchUnsub) {
        this._matchUnsub();
        this._matchUnsub = null;
      }
    },
    unsubscribeOpponentState(): void {
      if (this._opponentStateUnsub) {
        this._opponentStateUnsub();
        this._opponentStateUnsub = null;
      }
    },
    cleanup(): void {
      this.unsubscribeMatchmaking();
      this.unsubscribeMatch();
      this.unsubscribeOpponentState();
      this.matchId = null;
      this.match = null;
      this.matchmakingEntryId = null;
      this.isSearching = false;
      this.opponentState = null;
      this.matchResult = null;
      this.error = null;
    },
  },
});
