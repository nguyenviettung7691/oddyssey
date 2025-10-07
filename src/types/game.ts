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
