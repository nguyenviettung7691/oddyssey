<template>
  <div class="power-strip" role="group" :aria-label="$t('accessibility.powerCards')">
    <ion-button
      v-for="card in cards"
      :key="card.type"
      size="default"
      fill="clear"
      class="power-card"
      :disabled="card.remaining <= 0 || disabled"
      :aria-disabled="card.remaining <= 0 || disabled"
      :aria-label="t(titleKeyMap[card.type]) + ', ' + t('powerCard.remaining', { count: card.remaining })"
      :class="{ active: card.isActive }"
      @click="() => activateCard(card.type)"
    >
      <ion-icon slot="start" :icon="iconMap[card.type]" />
      <ion-label>
        <div class="card-title">{{ t(titleKeyMap[card.type]) }}</div>
        <small>{{ t('powerCard.remaining', { count: card.remaining }) }}</small>
      </ion-label>
    </ion-button>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { IonButton, IonIcon, IonLabel } from '@ionic/vue';
import {
  colorWandOutline,
  constructOutline,
  timeOutline,
  swapHorizontalOutline,
} from 'ionicons/icons';
import type { PowerCardState, PowerCardType } from '@/types/game';
import { useHaptics } from '@/composables/useHaptics';

const { cards, disabled } = defineProps<{
  cards: PowerCardState[];
  disabled?: boolean;
}>();

const emit = defineEmits<{
  use: [type: PowerCardType];
}>();

const { t } = useI18n();
const { mediumTap } = useHaptics();

function activateCard(type: PowerCardType): void {
  emit('use', type);
  mediumTap();
}

const iconMap: Record<PowerCardType, string> = {
  swap: swapHorizontalOutline,
  'remove-correct': constructOutline,
  'double-score': colorWandOutline,
  'time-keep': timeOutline,
};

const titleKeyMap: Record<PowerCardType, string> = {
  swap: 'powerCard.swap',
  'remove-correct': 'powerCard.removeCorrect',
  'double-score': 'powerCard.doubleScore',
  'time-keep': 'powerCard.timeKeep',
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
