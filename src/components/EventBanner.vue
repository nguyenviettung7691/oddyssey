<template>
  <ion-card v-if="event" class="event-banner" button :aria-label="event.title + ' — ' + $t('events.liveNow')" @click="$emit('select', event.id)">
    <ion-card-content class="banner-content">
      <div class="banner-info">
        <ion-chip color="success" outline>
          <ion-icon :icon="flashOutline" />
          <ion-label>{{ $t('events.liveNow') }}</ion-label>
        </ion-chip>
        <h3>{{ event.title }}</h3>
        <p>{{ event.description }}</p>
      </div>
      <div class="banner-stats">
        <EventCountdown :target-time="event.endTime" :label="$t('events.endsIn')" />
        <div class="participant-count">
          <ion-icon :icon="peopleOutline" />
          <span>{{ event.participantCount }}</span>
        </div>
      </div>
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import {
  IonCard,
  IonCardContent,
  IonChip,
  IonIcon,
  IonLabel,
} from '@ionic/vue';
import { flashOutline, peopleOutline } from 'ionicons/icons';
import EventCountdown from '@/components/EventCountdown.vue';
import type { GameEvent } from '@/types/game';

defineProps<{
  event: GameEvent;
}>();

defineEmits<{
  (e: 'select', eventId: string): void;
}>();
</script>

<style scoped>
.event-banner {
  background: linear-gradient(135deg, rgba(107, 191, 185, 0.2), rgba(156, 108, 255, 0.2));
  border: 1px solid rgba(107, 191, 185, 0.3);
}

.banner-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.banner-info {
  flex: 1;
}

.banner-info h3 {
  margin: 0.4rem 0 0.2rem;
  font-size: 1.1rem;
}

.banner-info p {
  color: var(--ion-color-medium);
  font-size: 0.85rem;
  margin: 0;
}

.banner-stats {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  min-width: 100px;
}

.participant-count {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.85rem;
  color: var(--ion-color-medium);
}
</style>
