import type { Ref } from 'vue';

export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'expert';

export type GameStatus = 'idle' | 'loading' | 'running' | 'finished' | 'error';

export type PowerCardType = 'swap' | 'remove-correct' | 'double-score' | 'time-keep';

export interface ThemeDefinition {
  id: string;
  label: string;
  description: string;
  icon: string;
  accentColor: string;
  difficultyRamp: DifficultyLevel[];
  comingSoon?: boolean;
}

export interface QuestionOption {
  id: string;
  text: string;
  isOddOneOut: boolean;
}

export interface GameQuestion {
  id: string;
  seed: string;
  prompt: string;
  themeId: string;
  difficulty: DifficultyLevel;
  options: QuestionOption[];
  oddOptionId: string;
  source: 'genkit' | 'fallback';
  generatedAt: string;
}

export interface PlayedQuestion {
  question: GameQuestion;
  chosenOptionId: string | null;
  outcome: 'correct' | 'incorrect' | 'skipped';
  answeredAt: string;
  timeRemainingAfter: number;
  powerCardsUsed: PowerCardType[];
}

export interface PowerCardState {
  type: PowerCardType;
  remaining: number;
  isActive: boolean;
}

export interface ActiveModifiers {
  doubleScore: boolean;
  timeKeep: boolean;
}

export interface GameSessionSnapshot {
  sessionId: string;
  themeId: string;
  themeLabel: string;
  status: GameStatus;
  remainingTime: number;
  score: number;
  totalQuestions: number;
  startedAt: string;
  finishedAt?: string;
  powerCards: Record<PowerCardType, PowerCardState>;
  activeModifiers: ActiveModifiers;
}

export interface GameRecord extends GameSessionSnapshot {
  questions: PlayedQuestion[];
  userId: string;
  userDisplayName: string;
}

export interface HighScoreEntry {
  id: string;
  sessionId: string;
  userId: string;
  userDisplayName: string;
  avatarUrl?: string;
  score: number;
  themeId: string | 'all';
  finishedAt: string;
}

export interface UseCountdownTimer {
  start: () => void;
  stop: () => void;
  reset: () => void;
  remaining: Ref<number>;
}

export interface LeaderboardEntry {
  userId: string;
  userDisplayName: string;
  avatarUrl?: string;
  bestScore: number;
  bestFinishedAt: string;
  gamesPlayed: number;
}

export interface UserProfile {
  displayName: string;
  avatarUrl?: string;
  email: string;
  createdAt: string;
  lastSeenAt: string;
}

export interface FriendRecord {
  friendId: string;
  displayName: string;
  avatarUrl?: string;
  addedAt: string;
}

export interface FriendRequest {
  id: string;
  fromUserId: string;
  fromDisplayName: string;
  fromAvatarUrl?: string;
  toUserId: string;
  toDisplayName?: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

export type ChallengeStatus = 'pending' | 'accepted' | 'completed' | 'declined' | 'expired';

export interface Challenge {
  id: string;
  challengerId: string;
  challengerDisplayName: string;
  challengerAvatarUrl?: string;
  challengedId: string;
  challengedDisplayName: string;
  challengedAvatarUrl?: string;
  themeId: string;
  themeLabel: string;
  status: ChallengeStatus;
  challengerScore: number | null;
  challengedScore: number | null;
  challengerSessionId: string | null;
  challengedSessionId: string | null;
  createdAt: string;
  expiresAt: string;
  winnerId: string | null;
}
