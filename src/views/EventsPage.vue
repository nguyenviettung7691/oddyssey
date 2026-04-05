<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="dark">
        <ion-buttons slot="start">
          <ion-button fill="clear" router-link="/home" :aria-label="$t('accessibility.backToHome')">
            <ion-icon slot="icon-only" :icon="arrowBackOutline" />
          </ion-button>
        </ion-buttons>
        <ion-title>{{ $t('events.title') }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="events-content">
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
        <ion-refresher-content />
      </ion-refresher>

      <ion-spinner v-if="eventStore.loading && !hasAnyEvents" name="crescent" class="spinner" />

      <template v-else>
        <section v-if="eventStore.activeEvents.length > 0">
          <h2>{{ $t('events.activeEvents') }}</h2>
          <EventCard
            v-for="event in eventStore.activeEvents"
            :key="event.id"
            :event="event"
            @select="goToEvent"
          />
        </section>

        <section v-if="eventStore.upcomingEvents.length > 0">
          <h2>{{ $t('events.upcomingEvents') }}</h2>
          <EventCard
            v-for="event in eventStore.upcomingEvents"
            :key="event.id"
            :event="event"
            @select="goToEvent"
          />
        </section>

        <section v-if="eventStore.completedEvents.length > 0">
          <h2>{{ $t('events.completedEvents') }}</h2>
          <EventCard
            v-for="event in eventStore.completedEvents"
            :key="event.id"
            :event="event"
            @select="goToEvent"
          />
        </section>

        <div v-if="!hasAnyEvents" class="empty-state">
          <ion-icon :icon="calendarOutline" size="large" />
          <h2>{{ $t('events.noEvents') }}</h2>
          <p>{{ $t('events.noEventsHint') }}</p>
        </div>
      </template>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from '@ionic/vue';
import { arrowBackOutline, calendarOutline } from 'ionicons/icons';
import { useRouter } from 'vue-router';
import EventCard from '@/components/EventCard.vue';
import { useEventStore } from '@/store/eventStore';

const router = useRouter();
const eventStore = useEventStore();

const hasAnyEvents = computed(
  () =>
    eventStore.activeEvents.length > 0 ||
    eventStore.upcomingEvents.length > 0 ||
    eventStore.completedEvents.length > 0,
);

function goToEvent(eventId: string): void {
  router.push({ name: 'EventDetail', params: { eventId } });
}

async function loadEvents(): Promise<void> {
  await Promise.all([
    eventStore.fetchActiveEvents(),
    eventStore.fetchUpcomingEvents(),
    eventStore.fetchCompletedEvents(),
  ]);
}

async function handleRefresh(event: CustomEvent): Promise<void> {
  await loadEvents();
  (event.target as HTMLIonRefresherElement).complete();
}

onMounted(() => {
  loadEvents();
});
</script>

<style scoped>
.events-content {
  --padding-start: 16px;
  --padding-end: 16px;
  --padding-bottom: 40px;
}

section {
  margin-bottom: 1.5rem;
}

section h2 {
  font-size: 1.2rem;
  margin-bottom: 0.75rem;
}

.spinner {
  display: block;
  margin: 4rem auto;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  text-align: center;
  margin-top: 4rem;
}

.empty-state p {
  color: var(--ion-color-medium);
}
</style>
