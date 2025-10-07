<template>
  <div class="power-strip">
    <ion-button
      v-for="card in cards"
      :key="card.type"
      size="default"
      fill="clear"
      class="power-card"
      :disabled="card.remaining <= 0 || disabled"
      :class="{ active: card.isActive }"
      @click="() => emit('use', card.type)"
    >
      <ion-icon slot="start" :icon="iconMap[card.type]" />
      <ion-label>
        <div class="card-title">{{ titleMap[card.type] }}</div>
        <small>{{ card.remaining }} left</small>
      </ion-label>
    </ion-button>
  </div>
</template>

<script setup lang="ts">
import { IonButton, IonIcon, IonLabel } from '@ionic/vue';
import {
  colorWandOutline,
  constructOutline,
  timeOutline,
  swapHorizontalOutline,
} from 'ionicons/icons';
import type { PowerCardState, PowerCardType } from '@/types/game';

const { cards, disabled } = defineProps<{
  cards: PowerCardState[];
  disabled?: boolean;
}>();

const emit = defineEmits<{
  use: [type: PowerCardType];
}>();

const iconMap: Record<PowerCardType, string> = {
  swap: swapHorizontalOutline,
  'remove-correct': constructOutline,
  'double-score': colorWandOutline,
  'time-keep': timeOutline,
};

const titleMap: Record<PowerCardType, string> = {
  swap: 'Swap',
  'remove-correct': 'Remove Correct',
  'double-score': 'Double Score',
  'time-keep': 'Time Keep',
};
</script>

<style scoped>
.power-strip {
  display: flex;
  gap: 0.75rem;
  justify-content: space-between;
  flex-wrap: wrap;
}

.power-card {
  --color: var(--ion-color-light);
  border: 1px solid rgba(255, 140, 66, 0.25);
  border-radius: 14px;
  background: rgba(38, 38, 38, 0.9);
  text-transform: none;
}

.power-card[disabled] {
  opacity: 0.35;
}

.power-card.active {
  border-color: var(--oddyssey-accent, #ff8c42);
  box-shadow: 0 0 12px rgba(255, 140, 66, 0.35);
}

.card-title {
  font-weight: 600;
}

small {
  color: var(--ion-color-medium);
}
</style>
