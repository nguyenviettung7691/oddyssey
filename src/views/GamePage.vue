<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="dark">
        <ion-buttons slot="start">
          <ion-button fill="clear" router-link="/home" :aria-label="$t('accessibility.backToHome')">
            <ion-icon slot="icon-only" :icon="arrowBackOutline" />
          </ion-button>
        </ion-buttons>
        <ion-title>{{ headerTitle }}</ion-title>
        <ion-buttons slot="end">
          <ion-button fill="clear" @click="handleSkip" :disabled="!canInteract" :aria-label="$t('game.skipButton')">
            <ion-icon :icon="playSkipForwardOutline" slot="start" />
            {{ $t('game.skipButton') }}
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
          :current-streak="game.currentStreak"
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
          {{ $t('game.footerNote') }}
        </ion-text>
      </div>

      <div v-else class="error-state">
        <ion-icon :icon="warningOutline" size="large" />
        <h2>{{ $t('game.errorTitle') }}</h2>
        <p>{{ game.error }}</p>
        <ion-button expand="block" router-link="/home">{{ $t('game.backToThemes') }}</ion-button>
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
import { useI18n } from 'vue-i18n';
import { arrowBackOutline, warningOutline, playSkipForwardOutline } from 'ionicons/icons';
import CountdownBar from '@/components/CountdownBar.vue';
import GameHud from '@/components/GameHud.vue';
import PowerCardsStrip from '@/components/PowerCardsStrip.vue';
import QuestionCard from '@/components/QuestionCard.vue';
import { coreThemes } from '@/data/themes';
import { useGameStore } from '@/store/gameStore';
import { useAnnouncer } from '@/composables/useAnnouncer';
import { useHaptics } from '@/composables/useHaptics';
import type { PowerCardType } from '@/types/game';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const game = useGameStore();
const { announce } = useAnnouncer();
const { success: hapticSuccess, error: hapticError, warning: hapticWarning, heavyTap } = useHaptics();
const totalTime = 60;

const themeId = computed(() => (route.query.theme as string | undefined) ?? game.themeId);
const challengeId = computed(() => (route.query.challengeId as string | undefined) ?? undefined);
const eventId = computed(() => (route.query.eventId as string | undefined) ?? undefined);
const matchId = computed(() => (route.query.matchId as string | undefined) ?? undefined);

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

  await game.startGame(themeId.value, challengeId.value, eventId.value, matchId.value);
}

function handleAnswer(optionId: string): void {
  if (!canInteract.value) {
    return;
  }
  const question = game.currentQuestion;
  const isCorrect = question ? optionId === question.oddOptionId : false;
  game.answer(optionId);
  if (isCorrect) {
    hapticSuccess();
  } else {
    hapticError();
  }
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
  announce(t('accessibility.powerCardUsed', { card: t(`powerCard.${card === 'remove-correct' ? 'removeCorrect' : card === 'double-score' ? 'doubleScore' : card === 'time-keep' ? 'timeKeep' : card}`) }));
}

// Announce score changes
watch(() => game.score, (newScore, oldScore) => {
  if (newScore !== oldScore && game.status === 'running') {
    announce(t('accessibility.scoreUpdate', { score: newScore }));
  }
});

// Announce correct/incorrect answers
watch(() => game.questions.length, (newLen, oldLen) => {
  if (newLen > oldLen && game.status === 'running') {
    const lastQuestion = game.questions[newLen - 1];
    if (lastQuestion) {
      if (lastQuestion.outcome === 'correct') {
        announce(t('accessibility.correct'));
      } else if (lastQuestion.outcome === 'incorrect') {
        const oddOption = lastQuestion.question.options.find(o => o.id === lastQuestion.question.oddOptionId);
        announce(t('accessibility.incorrect', { answer: oddOption?.text ?? '' }));
      }
    }
  }
});

// Announce streak changes
watch(() => game.currentStreak, (newStreak) => {
  if (newStreak >= 3 && game.status === 'running') {
    announce(t('accessibility.streakUpdate', { streak: newStreak, multiplier: game.comboMultiplier }));
  }
});

// Timer warnings
watch(() => game.remainingTime, (time) => {
  if (time === 10) {
    announce(t('accessibility.timeWarning', { seconds: 10 }), 'assertive');
    hapticWarning();
  } else if (time === 5) {
    announce(t('accessibility.timeWarning', { seconds: 5 }), 'assertive');
    hapticWarning();
  }
});

// Announce new question loaded
watch(() => game.currentQuestion, (question) => {
  if (question && game.status === 'running') {
    announce(question.prompt);
  }
});

// Game over
watch(
  () => game.status,
  (status) => {
    if (status === 'finished') {
      announce(t('accessibility.gameOver', { score: game.score }), 'assertive');
      heavyTap();
      router.replace({ name: 'Results' });
    } else if (status === 'error') {
      announce(t('accessibility.errorLoading'), 'assertive');
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

