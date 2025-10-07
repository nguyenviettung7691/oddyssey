import { defineStore } from 'pinia';
import { fetchQuestion } from '@/services/questionService';
import { coreThemes } from '@/data/themes';
import type {
  ActiveModifiers,
  DifficultyLevel,
  GameQuestion,
  GameStatus,
  PlayedQuestion,
  PowerCardState,
  PowerCardType,
} from '@/types/game';
import { randomUUID } from '@/utils/id';

const GAME_DURATION_SECONDS = 60;
const INCORRECT_PENALTY_SECONDS = 3;
const SKIP_PENALTY_SECONDS = 1;

const POWER_CARD_TYPES: PowerCardType[] = ['swap', 'remove-correct', 'double-score', 'time-keep'];

function createPowerCards(): Record<PowerCardType, PowerCardState> {
  return POWER_CARD_TYPES.reduce((accumulator, card) => {
    accumulator[card] = {
      type: card,
      remaining: 1,
      isActive: false,
    };
    return accumulator;
  }, {} as Record<PowerCardType, PowerCardState>);
}

function getDifficultyForQuestionCount(count: number): DifficultyLevel {
  if (count >= 12) return 'expert';
  if (count >= 7) return 'hard';
  if (count >= 3) return 'medium';
  return 'easy';
}

function cloneModifiers(): ActiveModifiers {
  return {
    doubleScore: false,
    timeKeep: false,
  };
}

export const useGameStore = defineStore('game', {
  state: () => ({
    status: 'idle' as GameStatus,
    sessionId: '',
    themeId: '',
    themeLabel: '',
    remainingTime: GAME_DURATION_SECONDS,
    score: 0,
    currentQuestion: null as GameQuestion | null,
    questions: [] as PlayedQuestion[],
    startedAt: '',
    finishedAt: '' as string | null,
    powerCards: createPowerCards(),
    activeModifiers: cloneModifiers(),
    seenQuestionIds: new Set<string>() as Set<string>,
    seenOptionTexts: new Set<string>() as Set<string>,
    timerHandle: null as ReturnType<typeof setInterval> | null,
    isLoadingQuestion: false,
    error: '' as string | null,
    currentQuestionCardsUsed: new Set<PowerCardType>() as Set<PowerCardType>,
  }),
  getters: {
    powerCardsList(state): PowerCardState[] {
      return POWER_CARD_TYPES.map((card) => state.powerCards[card]);
    },
    isRunning(state): boolean {
      return state.status === 'running';
    },
  },
  actions: {
    resetState(): void {
      this.stopTimer();
      this.status = 'idle';
      this.sessionId = '';
      this.themeId = '';
      this.themeLabel = '';
      this.remainingTime = GAME_DURATION_SECONDS;
      this.score = 0;
      this.currentQuestion = null;
      this.questions = [];
      this.startedAt = '';
      this.finishedAt = null;
      this.powerCards = createPowerCards();
      this.activeModifiers = cloneModifiers();
      this.seenQuestionIds = new Set();
      this.seenOptionTexts = new Set();
      this.timerHandle = null;
      this.isLoadingQuestion = false;
      this.error = null;
      this.currentQuestionCardsUsed = new Set();
    },
    async startGame(themeId: string): Promise<void> {
      const theme = coreThemes.find((item) => item.id === themeId);
      if (!theme) {
        throw new Error(`Theme with id ${themeId} not found.`);
      }

      this.resetState();
      this.status = 'loading';
      this.sessionId = randomUUID();
      this.themeId = theme.id;
      this.themeLabel = theme.label;
      this.startedAt = new Date().toISOString();

      await this.fetchNextQuestion();
      this.status = 'running';
      this.startTimer();
    },
    async fetchNextQuestion(): Promise<void> {
      if (this.isLoadingQuestion || this.status === 'finished') {
        return;
      }

      this.isLoadingQuestion = true;
      this.currentQuestionCardsUsed = new Set();
      const difficulty = getDifficultyForQuestionCount(this.questions.length);

      try {
        const question = await fetchQuestion(
          this.themeId,
          difficulty,
          this.seenQuestionIds,
          this.seenOptionTexts,
        );
        this.currentQuestion = question;
      } catch (error) {
        console.error('[Oddyssey] Failed to fetch question', error);
        this.error = error instanceof Error ? error.message : 'Unknown error';
        this.status = 'error';
        this.stopTimer();
      } finally {
        this.isLoadingQuestion = false;
      }
    },
    startTimer(): void {
      this.stopTimer();
      this.timerHandle = setInterval(() => {
        if (this.status !== 'running') {
          return;
        }
        if (this.remainingTime <= 0) {
          this.remainingTime = 0;
          this.finishGame();
          return;
        }
        this.remainingTime = Math.max(0, this.remainingTime - 1);
        if (this.remainingTime === 0) {
          this.finishGame();
        }
      }, 1000);
    },
    stopTimer(): void {
      if (this.timerHandle) {
        clearInterval(this.timerHandle);
        this.timerHandle = null;
      }
    },
    async answer(optionId: string): Promise<void> {
      if (!this.currentQuestion || this.status !== 'running') {
        return;
      }

      const question = this.currentQuestion;
      const isCorrect = optionId === question.oddOptionId;
      const cardsUsed = Array.from(this.currentQuestionCardsUsed);

      if (isCorrect) {
        const gained = this.activeModifiers.doubleScore ? 2 : 1;
        this.score += gained;
      } else if (!this.activeModifiers.timeKeep) {
        this.remainingTime = Math.max(0, this.remainingTime - INCORRECT_PENALTY_SECONDS);
      }

      const record: PlayedQuestion = {
        question,
        chosenOptionId: optionId,
        outcome: isCorrect ? 'correct' : 'incorrect',
        answeredAt: new Date().toISOString(),
        timeRemainingAfter: this.remainingTime,
        powerCardsUsed: cardsUsed,
      };

      this.questions = [...this.questions, record];
      this.resetActiveModifiers();

      if (this.remainingTime === 0) {
        this.finishGame();
        return;
      }

      await this.fetchNextQuestion();
    },
    async skipQuestion(): Promise<void> {
      if (!this.currentQuestion || this.status !== 'running') {
        return;
      }

      this.remainingTime = Math.max(0, this.remainingTime - SKIP_PENALTY_SECONDS);
      const record: PlayedQuestion = {
        question: this.currentQuestion,
        chosenOptionId: null,
        outcome: 'skipped',
        answeredAt: new Date().toISOString(),
        timeRemainingAfter: this.remainingTime,
        powerCardsUsed: Array.from(this.currentQuestionCardsUsed),
      };

      this.questions = [...this.questions, record];
      this.resetActiveModifiers();

      if (this.remainingTime === 0) {
        this.finishGame();
        return;
      }

      await this.fetchNextQuestion();
    },
    async usePowerCard(cardType: PowerCardType): Promise<void> {
      const card = this.powerCards[cardType];
      if (!card || card.remaining <= 0 || !this.currentQuestion) {
        return;
      }

      switch (cardType) {
        case 'swap': {
          card.remaining -= 1;
          await this.fetchNextQuestion();
          return;
        }
        case 'remove-correct': {
          if (this.currentQuestion.options.length <= 3) {
            return;
          }
          const retaining = this.currentQuestion.options.filter((option) => !option.isOddOneOut);
          if (retaining.length === 0) {
            return;
          }
          const target = retaining[Math.floor(Math.random() * retaining.length)];
          this.currentQuestion = {
            ...this.currentQuestion,
            options: this.currentQuestion.options.filter((option) => option.id !== target.id),
          };
          card.remaining -= 1;
          card.isActive = true;
          this.currentQuestionCardsUsed.add(cardType);
          return;
        }
        case 'double-score': {
          card.remaining -= 1;
          card.isActive = true;
          this.activeModifiers.doubleScore = true;
          this.currentQuestionCardsUsed.add(cardType);
          return;
        }
        case 'time-keep': {
          card.remaining -= 1;
          card.isActive = true;
          this.activeModifiers.timeKeep = true;
          this.currentQuestionCardsUsed.add(cardType);
          return;
        }
        default:
          return;
      }
    },
    resetActiveModifiers(): void {
      this.activeModifiers.doubleScore = false;
      this.activeModifiers.timeKeep = false;
      POWER_CARD_TYPES.forEach((card) => {
        this.powerCards[card].isActive = false;
      });
      this.currentQuestionCardsUsed = new Set();
    },
    finishGame(): void {
      if (this.status === 'finished') {
        return;
      }
      this.status = 'finished';
      this.finishedAt = new Date().toISOString();
      this.stopTimer();
    },
  },
});
