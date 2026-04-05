<template>
  <div class="versus-lobby" role="region" :aria-label="$t('multiplayer.matchmaking')">
    <div class="lobby-header">
      <h2>{{ themeLabel }}</h2>
      <ion-chip :color="modeColor" outline>
        <ion-label>{{ modeLabel }}</ion-label>
      </ion-chip>
    </div>

    <div class="players-display" role="group" aria-label="Players">
      <div class="player-card you" :aria-label="player.displayName">
        <ion-avatar v-if="player.avatarUrl">
          <img :src="player.avatarUrl" :alt="player.displayName" />
        </ion-avatar>
        <ion-icon v-else :icon="personCircleOutline" size="large" :aria-hidden="true" />
        <span class="player-name">{{ player.displayName }}</span>
        <ion-chip :color="playerReady ? 'success' : 'medium'" outline>
          {{ playerReady ? $t('multiplayer.ready') : $t('multiplayer.notReady') }}
        </ion-chip>
      </div>

      <span class="vs-text" aria-hidden="true">VS</span>

      <div class="player-card opponent" :aria-label="opponent.displayName">
        <ion-avatar v-if="opponent.avatarUrl">
          <img :src="opponent.avatarUrl" :alt="opponent.displayName" />
        </ion-avatar>
        <ion-icon v-else :icon="personCircleOutline" size="large" :aria-hidden="true" />
        <span class="player-name">{{ opponent.displayName }}</span>
        <ion-chip :color="opponentReady ? 'success' : 'medium'" outline>
          {{ opponentReady ? $t('multiplayer.ready') : $t('multiplayer.notReady') }}
        </ion-chip>
      </div>
    </div>

    <div class="lobby-actions">
      <ion-button v-if="!playerReady" expand="block" size="large" :aria-label="$t('multiplayer.readyUp')" @click="$emit('ready')">
        {{ $t('multiplayer.readyUp') }}
      </ion-button>
      <ion-button v-else expand="block" size="large" color="success" disabled :aria-label="$t('multiplayer.waitingForOpponent')">
        {{ $t('multiplayer.waitingForOpponent') }}
      </ion-button>
      <ion-button expand="block" fill="outline" color="danger" :aria-label="$t('multiplayer.leaveLobby')" @click="$emit('leave')">
        {{ $t('multiplayer.leaveLobby') }}
      </ion-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  IonAvatar,
  IonButton,
  IonChip,
  IonIcon,
  IonLabel,
} from '@ionic/vue';
import { personCircleOutline } from 'ionicons/icons';
import { useI18n } from 'vue-i18n';
import type { MatchMode } from '@/types/game';

const props = defineProps<{
  themeLabel: string;
  mode: MatchMode;
  player: { displayName: string; avatarUrl?: string };
  opponent: { displayName: string; avatarUrl?: string };
  playerReady: boolean;
  opponentReady: boolean;
}>();

defineEmits<{
  (e: 'ready'): void;
  (e: 'leave'): void;
}>();

const { t } = useI18n();

const modeColor = computed(() => props.mode === 'versus' ? 'danger' : 'primary');
const modeLabel = computed(() =>
  props.mode === 'versus' ? t('multiplayer.versus') : t('multiplayer.cooperative'),
);
</script>

<style scoped>
.versus-lobby {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1.5rem;
}

.lobby-header {
  text-align: center;
}

.lobby-header h2 {
  margin-bottom: 0.5rem;
}

.players-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
}

.player-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.player-card ion-avatar {
  width: 64px;
  height: 64px;
}

.player-name {
  font-weight: 600;
  font-size: 0.9rem;
}

.vs-text {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--ion-color-danger);
}

.lobby-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
</style>
