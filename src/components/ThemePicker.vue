<template>
  <ion-grid class="theme-grid">
    <ion-row>
      <ion-col
        v-for="theme in themes"
        :key="theme.id"
        size="12"
        size-md="6"
        size-lg="4"
      >
        <ion-card
          button
          :disabled="disabled"
          :class="{ selected: theme.id === modelValue }"
          @click="() => emit('update:modelValue', theme.id)"
        >
          <ion-card-header>
            <ion-card-title>{{ theme.label }}</ion-card-title>
            <ion-card-subtitle>{{ theme.description }}</ion-card-subtitle>
          </ion-card-header>
          <ion-card-content>
            <ion-chip :style="{ '--background': theme.accentColor + '22', '--color': theme.accentColor }">
              <ion-icon :icon="icons[theme.icon] ?? icons.book" />
              <ion-label>{{ theme.icon.replace('-', ' ') }}</ion-label>
            </ion-chip>
          </ion-card-content>
        </ion-card>
      </ion-col>
    </ion-row>

    <ion-row v-if="upcomingThemes.length">
      <ion-col size="12">
        <ion-text color="medium" class="upcoming-label">Coming Soon</ion-text>
      </ion-col>
      <ion-col
        v-for="theme in upcomingThemes"
        :key="theme.id"
        size="12"
        size-md="6"
        size-lg="4"
      >
        <ion-card class="upcoming" disabled>
          <ion-card-header>
            <ion-card-title>{{ theme.label }}</ion-card-title>
            <ion-card-subtitle>{{ theme.description }}</ion-card-subtitle>
          </ion-card-header>
        </ion-card>
      </ion-col>
    </ion-row>
  </ion-grid>
</template>

<script setup lang="ts">
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonChip,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonLabel,
  IonText,
} from '@ionic/vue';
import { bookOutline, fastFoodOutline, flaskOutline, footballOutline, planetOutline, sparklesOutline } from 'ionicons/icons';
import type { ThemeDefinition } from '@/types/game';

const { themes, upcomingThemes, modelValue, disabled } = defineProps<{
  themes: ThemeDefinition[];
  upcomingThemes: ThemeDefinition[];
  modelValue: string | null;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const icons: Record<string, string> = {
  football: footballOutline,
  sparkles: sparklesOutline,
  flask: flaskOutline,
  planet: planetOutline,
  'fast-food': fastFoodOutline,
  book: bookOutline,
};
</script>

<style scoped>
.theme-grid {
  gap: 1rem;
}

ion-card {
  background: var(--ion-color-step-200, #202020);
  border: 1px solid transparent;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

ion-card.selected {
  border-color: var(--oddyssey-accent, #ff8c42);
  transform: translateY(-4px);
}

ion-card.upcoming {
  opacity: 0.5;
  filter: grayscale(0.2);
}

.upcoming-label {
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 0.75rem;
}
</style>
