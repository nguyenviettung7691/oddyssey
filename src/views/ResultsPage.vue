<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="dark">
        <ion-title>{{ $t('results.title') }}</ion-title>
        <ion-buttons slot="end">
          <ion-button router-link="/home" fill="clear">
            <ion-icon slot="icon-only" :icon="homeOutline" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content v-if="hasSession" class="results-content">
      <ion-card class="score-card">
        <ion-card-header>
          <ion-card-subtitle>{{ themeLabel }}</ion-card-subtitle>
          <ion-card-title>{{ $t('results.points', { score: game.score }) }}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <p>{{ $t('results.summary', { count: game.questions.length }) }}</p>
          <ion-chip color="success" v-if="highScoreUpdated">{{ $t('results.personalBest') }}</ion-chip>
          <ion-chip color="tertiary" v-if="themeTop">{{ $t('results.themeBest') }}</ion-chip>
          <ion-chip color="warning" v-if="saveState === 'skipped'">
            {{ $t('results.signInPrompt') }}
          </ion-chip>
          <ion-chip color="danger" v-if="saveState === 'error'">{{ saveError }}</ion-chip>
        </ion-card-content>
      </ion-card>

      <ion-card v-if="challengeResult" class="challenge-card">
        <ion-card-header>
          <ion-card-title>{{ $t('results.challengeResult') }}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <template v-if="challengeResult.status === 'completed'">
            <p v-if="challengeResult.winnerId === userStore.user?.id" class="challenge-won">
              {{ $t('results.challengeWon', { score: game.score, opponentScore: opponentChallengeScore }) }}
            </p>
            <p v-else-if="challengeResult.winnerId === null" class="challenge-tie">
              {{ $t('results.challengeTie', { score: game.score }) }}
            </p>
            <p v-else class="challenge-lost">
              {{ $t('results.challengeLost', { score: game.score, opponentScore: opponentChallengeScore }) }}
            </p>
          </template>
          <p v-else>{{ $t('results.challengeWaiting') }}</p>
        </ion-card-content>
      </ion-card>

      <ion-card v-if="game.longestStreak > 0" class="stats-card">
        <ion-card-header>
          <ion-card-title>{{ $t('results.performanceStats') }}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <div class="stats-row">
            <div class="stat-item">
              <span class="stat-label">{{ $t('results.longestStreak') }}</span>
              <span class="stat-value">🔥 {{ game.longestStreak }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">{{ $t('results.bestMultiplier') }}</span>
              <span class="stat-value">{{ $t('results.streakValue', { count: bestMultiplier }) }}</span>
            </div>
          </div>
        </ion-card-content>
      </ion-card>

      <ion-list class="question-list" inset>
        <ion-list-header>{{ $t('results.questionReview') }}</ion-list-header>
        <ion-item v-for="entry in game.questions" :key="entry.question.id">
          <ion-label>
            <h3>{{ entry.question.prompt }}</h3>
            <p>
              {{ $t('results.oddOneOut') }} <strong>{{ oddText(entry.question) }}</strong>
              <span v-if="entry.chosenOptionId"> · {{ $t('results.youPicked', { option: optionText(entry) }) }}</span>
              <span v-else> · {{ $t('results.youSkipped') }}</span>
            </p>
          </ion-label>
          <ion-badge :color="badgeColor(entry.outcome)">{{ $t(`outcome.${entry.outcome}`) }}</ion-badge>
          <ion-badge v-if="(entry.streakAtAnswer ?? 0) >= 3" color="tertiary" class="streak-badge">🔥{{ entry.streakAtAnswer }}</ion-badge>
        </ion-item>
      </ion-list>

      <div class="actions">
        <ion-button expand="block" @click="replay">{{ $t('results.playAgain') }}</ion-button>
        <ion-button expand="block" fill="outline" router-link="/home">{{ $t('results.chooseTheme') }}</ion-button>
      </div>
    </ion-content>

    <ion-content v-else class="empty-state">
      <ion-icon :icon="compassOutline" size="large" />
      <h2>{{ $t('results.noSession') }}</h2>
      <p>{{ $t('results.noSessionHint') }}</p>
      <ion-button router-link="/home">{{ $t('results.backToStart') }}</ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import {
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { compassOutline, homeOutline } from 'ionicons/icons';
import { coreThemes } from '@/data/themes';
import { useGameStore } from '@/store/gameStore';
import { useUserStore } from '@/store/userStore';
import { saveGameRecord } from '@/services/storageService';
import { submitChallengeScore, getChallengeDetails } from '@/services/challengeService';
import type { GameRecord, PlayedQuestion, PowerCardType, PowerCardState, Challenge } from '@/types/game';

const { t } = useI18n();
const router = useRouter();
const game = useGameStore();
const userStore = useUserStore();

const highScoreUpdated = ref(false);
const themeTop = ref(false);
const saveState = ref<'idle' | 'saved' | 'error' | 'skipped'>('idle');
const saveError = ref('');
const challengeResult = ref<Challenge | null>(null);

const hasSession = computed(() => game.status === 'finished' && game.questions.length > 0);

const themeLabel = computed(
  () => coreThemes.find((item) => item.id === game.themeId)?.label ?? t('results.unknownTheme'),
);

const isAuthenticated = computed(() => userStore.isAuthenticated);

const opponentChallengeScore = computed(() => {
  if (!challengeResult.value || !userStore.user?.id) return 0;
  const c = challengeResult.value;
  return c.challengerId === userStore.user.id ? c.challengedScore : c.challengerScore;
});

function comboMultiplierFromStreak(streak: number): number {
  if (streak >= 10) return 5;
  if (streak >= 7) return 4;
  if (streak >= 5) return 3;
  if (streak >= 3) return 2;
  return 1;
}

const bestMultiplier = computed(() => comboMultiplierFromStreak(game.longestStreak));

function badgeColor(outcome: PlayedQuestion['outcome']): 'success' | 'danger' | 'warning' {
  switch (outcome) {
    case 'correct':
      return 'success';
    case 'incorrect':
      return 'danger';
    default:
      return 'warning';
  }
}

function oddText(question: PlayedQuestion['question']): string {
  const option = question.options.find((item) => item.id === question.oddOptionId);
  return option?.text ?? 'Unknown';
}

function optionText(entry: PlayedQuestion): string {
  const option = entry.question.options.find((item) => item.id === entry.chosenOptionId);
  return option?.text ?? 'Unknown';
}

function clonePowerCards(): Record<PowerCardType, PowerCardState> {
  return Object.entries(game.powerCards).reduce((accumulator, [key, value]) => {
    accumulator[key as PowerCardType] = { ...value };
    return accumulator;
  }, {} as Record<PowerCardType, PowerCardState>);
}

function cloneQuestions(): PlayedQuestion[] {
  return game.questions.map((entry) => ({
    ...entry,
    question: {
      ...entry.question,
      options: entry.question.options.map((option) => ({ ...option })),
    },
    powerCardsUsed: [...entry.powerCardsUsed],
  }));
}

function buildRecord(): GameRecord {
  const finishedAt = game.finishedAt ?? new Date().toISOString();
  return {
    sessionId: game.sessionId,
    themeId: game.themeId,
    themeLabel: game.themeLabel,
    status: game.status,
    remainingTime: game.remainingTime,
    score: game.score,
    totalQuestions: game.questions.length,
    startedAt: game.startedAt,
    finishedAt,
    powerCards: clonePowerCards(),
    activeModifiers: { ...game.activeModifiers },
    longestStreak: game.longestStreak,
    questions: cloneQuestions(),
    userId: userStore.user?.id ?? 'guest',
    userDisplayName: userStore.displayName,
  };
}

async function persistResult(): Promise<void> {
  if (!hasSession.value) {
    return;
  }

  if (!isAuthenticated.value) {
    saveState.value = 'skipped';
    return;
  }

  try {
    const snapshot = buildRecord();
    const outcome = saveGameRecord(snapshot);
    highScoreUpdated.value = outcome.isPersonalBest;
    themeTop.value = outcome.isThemeBest;
    saveState.value = 'saved';

    if (game.challengeId && userStore.user?.id) {
      try {
        await submitChallengeScore(
          game.challengeId,
          userStore.user.id,
          game.score,
          game.sessionId,
        );
        const details = await getChallengeDetails(game.challengeId);
        if (details) {
          challengeResult.value = details;
        }
      } catch (challengeError) {
        console.warn('[Oddyssey] Failed to submit challenge score', challengeError);
      }
    }
  } catch (error) {
    saveState.value = 'error';
    saveError.value = error instanceof Error ? error.message : 'Unable to save your run.';
  }
}

function replay(): void {
  if (!game.themeId) {
    router.replace({ name: 'Home' });
    return;
  }
  router.replace({ name: 'Game', query: { theme: game.themeId } });
}

onMounted(() => {
  if (!hasSession.value) {
    router.replace({ name: 'Home' });
    return;
  }
  void persistResult();
});
</script>

<style scoped>
.results-content {
  --padding-start: 16px;
  --padding-end: 16px;
  --padding-bottom: 40px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.score-card {
  background: rgba(24, 24, 24, 0.9);
  text-align: center;
}

.question-list h3 {
  font-size: 1rem;
  margin-bottom: 0.2rem;
}

.question-list p {
  font-size: 0.85rem;
  color: var(--ion-color-medium);
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  text-align: center;
}

.challenge-card {
  background: rgba(24, 24, 24, 0.9);
  text-align: center;
}

.challenge-won {
  color: var(--ion-color-success);
  font-weight: 600;
}

.challenge-lost {
  color: var(--ion-color-danger);
  font-weight: 600;
}

.challenge-tie {
  color: var(--ion-color-warning);
  font-weight: 600;
}

.stats-card {
  background: rgba(24, 24, 24, 0.9);
  text-align: center;
}

.stats-row {
  display: flex;
  justify-content: space-around;
  gap: 1rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.stat-label {
  text-transform: uppercase;
  font-size: 0.7rem;
  letter-spacing: 0.06em;
  color: var(--ion-color-medium);
}

.stat-value {
  font-size: 1.3rem;
  font-weight: 600;
}

.streak-badge {
  margin-left: 0.3rem;
  font-size: 0.75rem;
}
</style>
