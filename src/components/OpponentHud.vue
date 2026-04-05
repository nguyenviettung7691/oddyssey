<template>
  <div class="opponent-hud" v-if="opponent" :aria-label="$t('accessibility.opponentStatus')" role="status">
    <div class="opponent-info">
      <ion-avatar v-if="opponent.avatarUrl" class="opponent-avatar">
        <img :src="opponent.avatarUrl" :alt="opponent.displayName" />
      </ion-avatar>
      <ion-icon v-else :icon="personCircleOutline" class="opponent-icon" :aria-hidden="true" />
      <span class="opponent-name">{{ opponent.displayName }}</span>
    </div>
    <div class="opponent-stats">
      <div class="stat" :aria-label="$t('multiplayer.score') + ': ' + score">
        <span class="stat-label">{{ $t('multiplayer.score') }}</span>
        <span class="stat-value">{{ score }}</span>
      </div>
      <div class="stat" v-if="streak > 0" :aria-label="$t('hud.streak') + ': ' + streak">
        <span class="stat-label">{{ $t('hud.streak') }}</span>
        <span class="stat-value">🔥{{ streak }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonAvatar, IonIcon } from '@ionic/vue';
import { personCircleOutline } from 'ionicons/icons';

defineProps<{
  opponent: {
    id: string;
    displayName: string;
    avatarUrl?: string;
  } | null;
  score: number;
  streak: number;
}>();
</script>

<style scoped>
.opponent-hud {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.75rem;
  background: rgba(232, 93, 117, 0.15);
  border: 1px solid rgba(232, 93, 117, 0.3);
  border-radius: 12px;
}

.opponent-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.opponent-avatar {
  width: 28px;
  height: 28px;
}

.opponent-icon {
  font-size: 28px;
  color: var(--ion-color-medium);
}

.opponent-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--ion-color-danger);
}

.opponent-stats {
  display: flex;
  gap: 1rem;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.1rem;
}

.stat-label {
  font-size: 0.6rem;
  text-transform: uppercase;
  color: var(--ion-color-medium);
}

.stat-value {
  font-size: 1rem;
  font-weight: 700;
}
</style>
