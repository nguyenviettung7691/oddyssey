<template>
  <div class="coop-hud" v-if="partner">
    <div class="team-score">
      <span class="team-label">{{ $t('multiplayer.teamScore') }}</span>
      <span class="team-value">{{ teamScore }}</span>
    </div>
    <div class="partner-info">
      <ion-avatar v-if="partner.avatarUrl" class="partner-avatar">
        <img :src="partner.avatarUrl" :alt="partner.displayName" />
      </ion-avatar>
      <ion-icon v-else :icon="personCircleOutline" class="partner-icon" />
      <span class="partner-name">{{ partner.displayName }}</span>
      <span v-if="partnerStreak > 0" class="partner-streak">🔥{{ partnerStreak }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonAvatar, IonIcon } from '@ionic/vue';
import { personCircleOutline } from 'ionicons/icons';

defineProps<{
  partner: {
    id: string;
    displayName: string;
    avatarUrl?: string;
  } | null;
  teamScore: number;
  partnerStreak: number;
}>();
</script>

<style scoped>
.coop-hud {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.75rem;
  background: rgba(107, 191, 185, 0.15);
  border: 1px solid rgba(107, 191, 185, 0.3);
  border-radius: 12px;
}

.team-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.1rem;
}

.team-label {
  font-size: 0.6rem;
  text-transform: uppercase;
  color: var(--ion-color-medium);
}

.team-value {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--ion-color-primary);
}

.partner-info {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.partner-avatar {
  width: 24px;
  height: 24px;
}

.partner-icon {
  font-size: 24px;
  color: var(--ion-color-medium);
}

.partner-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--ion-color-primary);
}

.partner-streak {
  font-size: 0.85rem;
}
</style>
