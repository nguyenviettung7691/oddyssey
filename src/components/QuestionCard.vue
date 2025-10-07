<template>
  <ion-card class="question-card">
    <ion-card-header>
      <ion-chip class="difficulty" color="dark">
        <ion-icon :icon="chipIcon" />
        <ion-label>{{ question.difficulty.toUpperCase() }}</ion-label>
      </ion-chip>
      <ion-card-title>{{ question.prompt }}</ion-card-title>
    </ion-card-header>
    <ion-card-content>
      <ion-list lines="none">
        <ion-item
          v-for="option in question.options"
          :key="option.id"
          :button="true"
          :detail="false"
          class="option-item"
          :disabled="disabled"
          @click="() => emit('select', option.id)"
        >
          <ion-label>{{ option.text }}</ion-label>
        </ion-item>
      </ion-list>
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonList,
  IonChip,
  IonIcon,
} from '@ionic/vue';
import { alertCircleOutline, flameOutline, sparklesOutline } from 'ionicons/icons';
import type { GameQuestion } from '@/types/game';

const props = defineProps<{
  question: GameQuestion;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  select: [optionId: string];
}>();

const chipIcon = computed(() => {
  switch (props.question.difficulty) {
    case 'easy':
      return sparklesOutline;
    case 'medium':
      return flameOutline;
    default:
      return alertCircleOutline;
  }
});
</script>

<style scoped>
.question-card {
  --background: rgba(24, 24, 24, 0.9);
  border: 1px solid rgba(255, 140, 66, 0.15);
  box-shadow: 0 16px 30px rgba(0, 0, 0, 0.35);
}

ion-card-title {
  font-size: 1.25rem;
  line-height: 1.3;
}

.option-item {
  margin-bottom: 0.5rem;
  border-radius: 12px;
  background: rgba(40, 40, 40, 0.95);
  transition: transform 0.15s ease, background 0.15s ease;
}

.option-item:active {
  transform: scale(0.98);
}

.difficulty {
  align-self: flex-start;
  margin-bottom: 0.75rem;
  backdrop-filter: blur(6px);
}
</style>
