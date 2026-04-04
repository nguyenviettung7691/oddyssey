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
  streakAtAnswer: number;
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
  longestStreak: number;
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

// --- Weekly Events ---

export type EventType = 'weekly' | 'seasonal' | 'special';
export type EventStatus = 'upcoming' | 'active' | 'completed' | 'archived';

export interface EventRules {
  timeLimit?: number;
  scoreMultiplier?: number;
  allowedPowerCards?: PowerCardType[];
  difficultyOverride?: DifficultyLevel;
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  themeId: string;
  themeLabel: string;
  eventType: EventType;
  startTime: string;
  endTime: string;
  status: EventStatus;
  rules: EventRules;
  participantCount: number;
  createdAt: string;
}

export interface EventStanding {
  userId: string;
  displayName: string;
  avatarUrl?: string;
  bestScore: number;
  totalScore: number;
  gamesPlayed: number;
  bestStreak: number;
  lastPlayedAt: string;
  joinedAt: string;
  rank?: number;
}

// --- Multiplayer (Versus / Cooperative) ---

export type MatchStatus = 'waiting' | 'ready' | 'playing' | 'finished' | 'abandoned';
export type MatchMode = 'versus' | 'cooperative';

export interface Match {
  id: string;
  player1Id: string;
  player1DisplayName: string;
  player1AvatarUrl?: string;
  player2Id: string;
  player2DisplayName: string;
  player2AvatarUrl?: string;
  mode: MatchMode;
  status: MatchStatus;
  themeId: string;
  themeLabel: string;
  player1Score: number | null;
  player2Score: number | null;
  player1Ready: boolean;
  player2Ready: boolean;
  teamScore: number | null;
  winnerId: string | null;
  startedAt: string | null;
  createdAt: string;
}

export interface MatchmakingEntry {
  id: string;
  userId: string;
  displayName: string;
  avatarUrl?: string;
  themeId: string;
  mode: MatchMode;
  status: 'searching' | 'matched';
  matchId: string | null;
  createdAt: string;
}

export interface PlayerMatchState {
  currentScore: number;
  currentStreak: number;
  questionsAnswered: number;
  lastAnsweredAt: string;
}
