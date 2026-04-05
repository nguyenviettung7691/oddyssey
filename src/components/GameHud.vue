<template>
  <ion-card class="hud-card" :aria-label="$t('accessibility.gameStatus')">
    <ion-card-content>
      <div class="hud-row">
        <div class="hud-item" :aria-label="$t('hud.timeLeft') + ': ' + formattedTime">
          <ion-text color="light" class="hud-label">{{ $t('hud.timeLeft') }}</ion-text>
          <ion-text class="hud-value" :style="{ color: accentColor }">{{ formattedTime }}</ion-text>
        </div>
        <div class="hud-item" :aria-label="$t('hud.score') + ': ' + score">
          <ion-text color="light" class="hud-label">{{ $t('hud.score') }}</ion-text>
          <ion-text class="hud-value">{{ score }}</ion-text>
        </div>
        <div class="hud-item" :aria-label="$t('hud.question') + ': ' + questionIndex">
          <ion-text color="light" class="hud-label">{{ $t('hud.question') }}</ion-text>
          <ion-text class="hud-value">{{ questionIndex }}</ion-text>
        </div>
        <div v-if="currentStreak >= 1" class="hud-item" :aria-label="$t('hud.streak') + ': ' + currentStreak">
          <ion-text color="light" class="hud-label">{{ $t('hud.streak') }}</ion-text>
          <ion-text class="hud-value streak-value" :key="currentStreak" :style="{ color: accentColor }">🔥{{ currentStreak }}</ion-text>
        </div>
      </div>
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IonCard, IonCardContent, IonText } from '@ionic/vue';

const props = defineProps<{
  remainingTime: number;
  score: number;
  questionCount: number;
  accentColor: string;
  currentStreak: number;
}>();

const formattedTime = computed(() => {
  const minutes = Math.floor(props.remainingTime / 60).toString().padStart(2, '0');
  const seconds = (props.remainingTime % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
});

const questionIndex = computed(() => props.questionCount + 1);
</script>

<style scoped>
.hud-card {
  --background: rgba(32, 32, 32, 0.65);
  backdrop-filter: blur(12px);
}

.hud-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.hud-item {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  text-align: center;
}

.hud-label {
  text-transform: uppercase;
  font-size: 0.65rem;
  letter-spacing: 0.08em;
  color: var(--ion-color-medium-shade);
}

.hud-value {
  font-size: 1.4rem;
  font-weight: 600;
}

.streak-value {
  animation: streak-pulse 0.3s ease;
}

@keyframes streak-pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.15); }
  100% { transform: scale(1); }
}
</style>
