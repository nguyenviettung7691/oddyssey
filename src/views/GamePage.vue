<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="dark">
        <ion-buttons slot="start">
          <ion-button fill="clear" router-link="/home">
            <ion-icon slot="icon-only" :icon="arrowBackOutline" />
          </ion-button>
        </ion-buttons>
        <ion-title>{{ headerTitle }}</ion-title>
        <ion-buttons slot="end">
          <ion-button fill="clear" @click="handleSkip" :disabled="!canInteract">
            <ion-icon :icon="playSkipForwardOutline" slot="start" />
            Skip (-1s)
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="game-content">
      <div class="game-wrapper" v-if="game.status !== 'error'">
        <CountdownBar :total="totalTime" :remaining="game.remainingTime" :accent-color="accentColor" />
        <GameHud
          :remaining-time="game.remainingTime"
          :score="game.score"
          :question-count="game.questions.length"
          :accent-color="accentColor"
        />

        <ion-spinner v-if="game.isLoadingQuestion || !game.currentQuestion" name="crescent" class="spinner" />

        <QuestionCard
          v-else
          :question="game.currentQuestion"
          :disabled="!canInteract"
          @select="handleAnswer"
        />

        <PowerCardsStrip :cards="game.powerCardsList" :disabled="!canInteract" @use="handlePowerCard" />

        <ion-text color="medium" class="footer-note">
          Wrong calls cost 3 seconds. Stay sharp.
        </ion-text>
      </div>

      <div v-else class="error-state">
        <ion-icon :icon="warningOutline" size="large" />
        <h2>We ran out of questions.</h2>
        <p>{{ game.error }}</p>
        <ion-button expand="block" router-link="/home">Back to themes</ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/vue';
import { useRoute, useRouter } from 'vue-router';
import { arrowBackOutline, warningOutline, playSkipForwardOutline } from 'ionicons/icons';
import CountdownBar from '@/components/CountdownBar.vue';
import GameHud from '@/components/GameHud.vue';
import PowerCardsStrip from '@/components/PowerCardsStrip.vue';
import QuestionCard from '@/components/QuestionCard.vue';
import { coreThemes } from '@/data/themes';
import { useGameStore } from '@/store/gameStore';
import type { PowerCardType } from '@/types/game';

const router = useRouter();
const route = useRoute();
const game = useGameStore();
const totalTime = 60;

const themeId = computed(() => (route.query.theme as string | undefined) ?? game.themeId);

const theme = computed(() => coreThemes.find((item) => item.id === themeId.value));

const accentColor = computed(() => theme.value?.accentColor ?? '#FF8C42');

const headerTitle = computed(() => theme.value?.label ?? 'Oddyssey');

const canInteract = computed(() => game.status === 'running' && !game.isLoadingQuestion);

async function ensureGameStarted(): Promise<void> {
  if (!themeId.value) {
    router.replace({ name: 'Home' });
    return;
  }

  if (game.status === 'running' && game.themeId === themeId.value) {
    return;
  }

  await game.startGame(themeId.value);
}

function handleAnswer(optionId: string): void {
  if (!canInteract.value) {
    return;
  }
  game.answer(optionId);
}

function handleSkip(): void {
  if (!canInteract.value) {
    return;
  }
  game.skipQuestion();
}

function handlePowerCard(card: PowerCardType): void {
  if (!canInteract.value && card !== 'swap') {
    return;
  }
  game.usePowerCard(card);
}

watch(
  () => game.status,
  (status) => {
    if (status === 'finished') {
      router.replace({ name: 'Results' });
    }
  },
);

onMounted(() => {
  ensureGameStarted();
});
</script>

<style scoped>
.game-content {
  --padding-start: 16px;
  --padding-end: 16px;
  --padding-bottom: 40px;
  display: flex;
  flex-direction: column;
}

.game-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-top: 1rem;
}

.spinner {
  align-self: center;
  margin-top: 4rem;
}

.footer-note {
  text-align: center;
  font-size: 0.85rem;
}

.error-state {
  margin-top: 4rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  text-align: center;
}
</style>

