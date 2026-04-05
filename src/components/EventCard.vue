<template>
  <ion-card class="event-card" button :aria-label="event.title + ' — ' + statusLabel" @click="$emit('select', event.id)">
    <ion-card-header>
      <ion-card-subtitle>
        <ion-icon :icon="calendarOutline" />
        {{ eventTypeLabel }}
      </ion-card-subtitle>
      <ion-card-title>{{ event.title }}</ion-card-title>
    </ion-card-header>
    <ion-card-content>
      <p class="event-description">{{ event.description }}</p>
      <div class="event-meta">
        <ion-chip :color="statusColor" outline>
          <ion-icon :icon="statusIcon" />
          <ion-label>{{ statusLabel }}</ion-label>
        </ion-chip>
        <ion-chip color="medium" outline>
          <ion-icon :icon="peopleOutline" />
          <ion-label>{{ event.participantCount }}</ion-label>
        </ion-chip>
        <ion-chip v-if="event.status === 'active'" color="warning" outline>
          <ion-icon :icon="timerOutline" />
          <ion-label>{{ timeRemainingText }}</ion-label>
        </ion-chip>
      </div>
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonChip,
  IonIcon,
  IonLabel,
} from '@ionic/vue';
import { calendarOutline, peopleOutline, timerOutline, checkmarkCircleOutline, timeOutline, trophyOutline } from 'ionicons/icons';
import { useI18n } from 'vue-i18n';
import type { GameEvent } from '@/types/game';

const props = defineProps<{
  event: GameEvent;
}>();

defineEmits<{
  (e: 'select', eventId: string): void;
}>();

const { t } = useI18n();

const eventTypeLabel = computed(() => {
  switch (props.event.eventType) {
    case 'weekly': return t('events.typeWeekly');
    case 'seasonal': return t('events.typeSeasonal');
    case 'special': return t('events.typeSpecial');
    default: return props.event.eventType;
  }
});

const statusColor = computed(() => {
  switch (props.event.status) {
    case 'active': return 'success';
    case 'upcoming': return 'primary';
    case 'completed': return 'medium';
    default: return 'medium';
  }
});

const statusIcon = computed(() => {
  switch (props.event.status) {
    case 'active': return timerOutline;
    case 'upcoming': return timeOutline;
    case 'completed': return checkmarkCircleOutline;
    default: return trophyOutline;
  }
});

const statusLabel = computed(() => {
  switch (props.event.status) {
    case 'active': return t('events.statusActive');
    case 'upcoming': return t('events.statusUpcoming');
    case 'completed': return t('events.statusCompleted');
    default: return props.event.status;
  }
});

const timeRemainingText = computed(() => {
  const end = new Date(props.event.endTime).getTime();
  const now = Date.now();
  const diff = Math.max(0, end - now);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) {
    return t('events.daysLeft', { count: days });
  }
  if (hours > 0) {
    return t('events.hoursLeft', { count: hours });
  }
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return t('events.minutesLeft', { count: minutes });
});
</script>

<style scoped>
.event-card {
  background: rgba(24, 24, 24, 0.9);
}

.event-description {
  color: var(--ion-color-medium);
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
}

.event-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}
</style>
