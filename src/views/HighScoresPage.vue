<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="dark">
        <ion-title>High Scores</ion-title>
        <ion-buttons slot="start">
          <ion-button fill="clear" router-link="/home">
            <ion-icon slot="icon-only" :icon="arrowBackOutline" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="scores-content">
      <ion-segment v-model="selectedTheme" mode="md" class="theme-segment">
        <ion-segment-button value="all">
          <ion-label>All Themes</ion-label>
        </ion-segment-button>
        <ion-segment-button v-for="theme in coreThemes" :key="theme.id" :value="theme.id">
          <ion-label>{{ theme.label }}</ion-label>
        </ion-segment-button>
      </ion-segment>

      <ion-list inset>
        <ion-list-header>
          <ion-label>{{ activeThemeLabel }}</ion-label>
        </ion-list-header>
        <ion-item v-for="(entry, index) in highScores" :key="entry.id">
          <ion-avatar slot="start">
            <div class="rank-badge">#{{ index + 1 }}</div>
          </ion-avatar>
          <ion-label>
            <h3>{{ entry.userDisplayName }}</h3>
            <p>{{ formatDate(entry.finishedAt) }}</p>
          </ion-label>
          <ion-badge slot="end" color="primary">{{ entry.score }}</ion-badge>
        </ion-item>
        <ion-item v-if="!highScores.length">
          <ion-label>No runs logged for this theme yet. Be the first!</ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import {
  IonAvatar,
  IonBadge,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
} from '@ionic/vue';
import { arrowBackOutline } from 'ionicons/icons';
import { coreThemes } from '@/data/themes';
import { listHighScores } from '@/services/storageService';
import type { HighScoreEntry } from '@/types/game';

const selectedTheme = ref<'all' | string>('all');
const highScores = ref<HighScoreEntry[]>([]);

const activeThemeLabel = computed(() => {
  if (selectedTheme.value === 'all') {
    return 'Across All Themes';
  }
  const theme = coreThemes.find((item) => item.id === selectedTheme.value);
  return theme?.label ?? 'Unknown Theme';
});

function refreshLeaderboard(): void {
  highScores.value = listHighScores(selectedTheme.value, 10);
}

watch(selectedTheme, () => {
  refreshLeaderboard();
});

onMounted(() => {
  refreshLeaderboard();
});

function formatDate(input: string): string {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) {
    return 'Unknown time';
  }
  return date.toLocaleString();
}
</script>

<style scoped>
.scores-content {
  --padding-start: 16px;
  --padding-end: 16px;
  --padding-bottom: 40px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.theme-segment {
  margin-top: 1rem;
  overflow-x: auto;
}

.rank-badge {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: rgba(255, 140, 66, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: var(--oddyssey-accent);
}
</style>
