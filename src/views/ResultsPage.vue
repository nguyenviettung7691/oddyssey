<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="dark">
        <ion-title>Results</ion-title>
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
          <ion-card-title>{{ game.score }} pts</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <p>You cleared {{ game.questions.length }} questions in one minute.</p>
          <ion-chip color="success" v-if="highScoreUpdated">New personal best!</ion-chip>
          <ion-chip color="tertiary" v-if="themeTop">Top score for this theme!</ion-chip>
          <ion-chip color="warning" v-if="saveState === 'skipped'">
            Sign in with Google to save your runs and compete on leaderboards.
          </ion-chip>
          <ion-chip color="danger" v-if="saveState === 'error'">{{ saveError }}</ion-chip>
        </ion-card-content>
      </ion-card>

      <ion-list class="question-list" inset>
        <ion-list-header>Question Review</ion-list-header>
        <ion-item v-for="entry in game.questions" :key="entry.question.id">
          <ion-label>
            <h3>{{ entry.question.prompt }}</h3>
            <p>
              Odd One Out: <strong>{{ oddText(entry.question) }}</strong>
              <span v-if="entry.chosenOptionId"> · You picked: {{ optionText(entry) }}</span>
              <span v-else> · You skipped</span>
            </p>
          </ion-label>
          <ion-badge :color="badgeColor(entry.outcome)">{{ entry.outcome }}</ion-badge>
        </ion-item>
      </ion-list>

      <div class="actions">
        <ion-button expand="block" @click="replay">Play again</ion-button>
        <ion-button expand="block" fill="outline" router-link="/home">Choose theme</ion-button>
      </div>
    </ion-content>

    <ion-content v-else class="empty-state">
      <ion-icon :icon="compassOutline" size="large" />
      <h2>No session found</h2>
      <p>Start a new run to see your results summary.</p>
      <ion-button router-link="/home">Back to start</ion-button>
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
import { useRouter } from 'vue-router';
import { compassOutline, homeOutline } from 'ionicons/icons';
import { coreThemes } from '@/data/themes';
import { useGameStore } from '@/store/gameStore';
import { useUserStore } from '@/store/userStore';
import { saveGameRecord } from '@/services/storageService';
import type { GameRecord, PlayedQuestion, PowerCardType, PowerCardState } from '@/types/game';

const router = useRouter();
const game = useGameStore();
const userStore = useUserStore();

const highScoreUpdated = ref(false);
const themeTop = ref(false);
const saveState = ref<'idle' | 'saved' | 'error' | 'skipped'>('idle');
const saveError = ref('');

const hasSession = computed(() => game.status === 'finished' && game.questions.length > 0);

const themeLabel = computed(
  () => coreThemes.find((item) => item.id === game.themeId)?.label ?? 'Unknown Theme',
);

const isAuthenticated = computed(() => userStore.isAuthenticated);

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
</style>
