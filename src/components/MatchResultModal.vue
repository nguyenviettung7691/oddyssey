<template>
  <ion-modal :is-open="isOpen" @did-dismiss="$emit('dismiss')" role="dialog" :aria-label="$t('multiplayer.matchResult')">
    <ion-header>
      <ion-toolbar color="dark">
        <ion-title>{{ $t('multiplayer.matchResult') }}</ion-title>
        <ion-buttons slot="end">
          <ion-button :aria-label="$t('accessibility.close')" @click="$emit('dismiss')">
            <ion-icon slot="icon-only" :icon="closeOutline" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="result-content">
      <div class="result-display">
        <div class="result-icon">
          <span v-if="result === 'win'">🏆</span>
          <span v-else-if="result === 'loss'">😔</span>
          <span v-else>🤝</span>
        </div>
        <h1 :class="resultClass">{{ resultText }}</h1>

        <div class="scores-comparison" v-if="match">
          <div class="player-score">
            <span class="player-label">{{ $t('multiplayer.you') }}</span>
            <span class="score-value">{{ myScore }}</span>
          </div>
          <span class="vs-separator">vs</span>
          <div class="player-score opponent">
            <span class="player-label">{{ opponentName }}</span>
            <span class="score-value">{{ opponentScore }}</span>
          </div>
        </div>
      </div>

      <div class="result-actions">
        <ion-button expand="block" @click="$emit('rematch')">
          {{ $t('multiplayer.rematch') }}
        </ion-button>
        <ion-button expand="block" fill="outline" router-link="/home" @click="$emit('dismiss')">
          {{ $t('results.chooseTheme') }}
        </ion-button>
      </div>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonModal,
  IonTitle,
  IonToolbar,
} from '@ionic/vue';
import { closeOutline } from 'ionicons/icons';
import { useI18n } from 'vue-i18n';
import type { Match } from '@/types/game';

const props = defineProps<{
  isOpen: boolean;
  result: 'win' | 'loss' | 'draw' | null;
  match: Match | null;
  userId: string;
}>();

defineEmits<{
  (e: 'dismiss'): void;
  (e: 'rematch'): void;
}>();

const { t } = useI18n();

const resultText = computed(() => {
  switch (props.result) {
    case 'win': return t('multiplayer.youWin');
    case 'loss': return t('multiplayer.youLose');
    case 'draw': return t('multiplayer.draw');
    default: return '';
  }
});

const resultClass = computed(() => {
  switch (props.result) {
    case 'win': return 'result-win';
    case 'loss': return 'result-loss';
    case 'draw': return 'result-draw';
    default: return '';
  }
});

const myScore = computed(() => {
  if (!props.match) return 0;
  return props.match.player1Id === props.userId
    ? props.match.player1Score ?? 0
    : props.match.player2Score ?? 0;
});

const opponentScore = computed(() => {
  if (!props.match) return 0;
  return props.match.player1Id === props.userId
    ? props.match.player2Score ?? 0
    : props.match.player1Score ?? 0;
});

const opponentName = computed(() => {
  if (!props.match) return '';
  return props.match.player1Id === props.userId
    ? props.match.player2DisplayName
    : props.match.player1DisplayName;
});
</script>

<style scoped>
.result-content {
  --padding-start: 16px;
  --padding-end: 16px;
}

.result-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem 0;
}

.result-icon span {
  font-size: 4rem;
}

.result-win {
  color: var(--ion-color-success);
}

.result-loss {
  color: var(--ion-color-danger);
}

.result-draw {
  color: var(--ion-color-warning);
}

.scores-comparison {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-top: 1rem;
}

.player-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
}

.player-label {
  font-size: 0.8rem;
  text-transform: uppercase;
  color: var(--ion-color-medium);
}

.score-value {
  font-size: 2rem;
  font-weight: 700;
}

.opponent .score-value {
  color: var(--ion-color-danger);
}

.vs-separator {
  font-size: 1.2rem;
  color: var(--ion-color-medium);
  font-weight: 600;
}

.result-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem 0;
}
</style>
