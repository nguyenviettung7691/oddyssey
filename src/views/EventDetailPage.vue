<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="dark">
        <ion-buttons slot="start">
          <ion-button fill="clear" router-link="/events">
            <ion-icon slot="icon-only" :icon="arrowBackOutline" />
          </ion-button>
        </ion-buttons>
        <ion-title>{{ eventStore.currentEvent?.title ?? $t('events.title') }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="event-detail-content">
      <ion-spinner v-if="eventStore.loading" name="crescent" class="spinner" />

      <template v-else-if="eventStore.currentEvent">
        <ion-card class="event-info-card">
          <ion-card-header>
            <ion-card-subtitle>
              {{ eventTypeLabel }}
              · {{ themeLabel }}
            </ion-card-subtitle>
            <ion-card-title>{{ eventStore.currentEvent.title }}</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <p>{{ eventStore.currentEvent.description }}</p>

            <EventCountdown
              v-if="eventStore.isEventActive"
              :target-time="eventStore.currentEvent.endTime"
              :label="$t('events.endsIn')"
            />

            <div class="event-stats">
              <ion-chip color="medium" outline>
                <ion-icon :icon="peopleOutline" />
                <ion-label>{{ $t('events.participants', { count: eventStore.currentEvent.participantCount }) }}</ion-label>
              </ion-chip>
            </div>

            <div v-if="eventStore.currentEvent.rules" class="event-rules">
              <h4>{{ $t('events.rules') }}</h4>
              <ul>
                <li v-if="eventStore.currentEvent.rules.timeLimit">
                  {{ $t('events.ruleTimeLimit', { seconds: eventStore.currentEvent.rules.timeLimit }) }}
                </li>
                <li v-if="eventStore.currentEvent.rules.scoreMultiplier">
                  {{ $t('events.ruleScoreMultiplier', { multiplier: eventStore.currentEvent.rules.scoreMultiplier }) }}
                </li>
                <li v-if="eventStore.currentEvent.rules.difficultyOverride">
                  {{ $t('events.ruleDifficulty', { level: eventStore.currentEvent.rules.difficultyOverride }) }}
                </li>
              </ul>
            </div>
          </ion-card-content>
        </ion-card>

        <ion-card v-if="eventStore.userStanding" class="user-standing-card">
          <ion-card-header>
            <ion-card-title>{{ $t('events.yourStanding') }}</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <div class="stats-row">
              <div class="stat-item">
                <span class="stat-label">{{ $t('events.bestScoreLabel') }}</span>
                <span class="stat-value">{{ eventStore.userStanding.bestScore }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">{{ $t('events.gamesPlayedLabel') }}</span>
                <span class="stat-value">{{ eventStore.userStanding.gamesPlayed }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">{{ $t('events.bestStreakLabel') }}</span>
                <span class="stat-value">🔥{{ eventStore.userStanding.bestStreak }}</span>
              </div>
            </div>
          </ion-card-content>
        </ion-card>

        <div class="play-actions" v-if="eventStore.isEventActive">
          <ion-button
            v-if="!eventStore.hasJoinedCurrentEvent && isAuthenticated"
            expand="block"
            size="large"
            @click="handleJoin"
          >
            {{ $t('events.joinEvent') }}
          </ion-button>
          <ion-button
            v-else-if="eventStore.hasJoinedCurrentEvent"
            expand="block"
            size="large"
            @click="handlePlay"
          >
            {{ $t('events.playEvent') }}
          </ion-button>
          <ion-button
            v-else
            expand="block"
            fill="outline"
            router-link="/profile"
          >
            {{ $t('events.signInToJoin') }}
          </ion-button>
        </div>

        <EventLeaderboard
          :standings="eventStore.eventStandings"
          :current-user-id="userStore.user?.id"
        />
      </template>

      <div v-else class="error-state">
        <h2>{{ $t('events.notFound') }}</h2>
        <ion-button router-link="/events">{{ $t('events.backToEvents') }}</ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from '@ionic/vue';
import { arrowBackOutline, peopleOutline } from 'ionicons/icons';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import EventCountdown from '@/components/EventCountdown.vue';
import EventLeaderboard from '@/components/EventLeaderboard.vue';
import { useEventStore } from '@/store/eventStore';
import { useUserStore } from '@/store/userStore';
import { coreThemes } from '@/data/themes';

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const eventStore = useEventStore();
const userStore = useUserStore();

const eventId = computed(() => route.params.eventId as string);
const isAuthenticated = computed(() => userStore.isAuthenticated);

const eventTypeLabel = computed(() => {
  const event = eventStore.currentEvent;
  if (!event) return '';
  switch (event.eventType) {
    case 'weekly': return t('events.typeWeekly');
    case 'seasonal': return t('events.typeSeasonal');
    case 'special': return t('events.typeSpecial');
    default: return event.eventType;
  }
});

const themeLabel = computed(() => {
  const event = eventStore.currentEvent;
  if (!event) return '';
  return coreThemes.find((th) => th.id === event.themeId)?.label ?? event.themeLabel;
});

async function handleJoin(): Promise<void> {
  if (!userStore.user) return;
  await eventStore.joinEvent(
    eventId.value,
    userStore.user.id,
    userStore.user.displayName,
    userStore.user.avatarUrl,
  );
}

function handlePlay(): void {
  const event = eventStore.currentEvent;
  if (!event) return;
  router.push({
    name: 'Game',
    query: { theme: event.themeId, eventId: event.id },
  });
}

onMounted(async () => {
  await eventStore.fetchEventDetails(eventId.value);
  eventStore.subscribeToCurrentEvent(eventId.value);
  eventStore.subscribeToStandings(eventId.value);

  if (userStore.user) {
    await eventStore.fetchUserStanding(eventId.value, userStore.user.id);
  }
});

onUnmounted(() => {
  eventStore.cleanup();
});
</script>

<style scoped>
.event-detail-content {
  --padding-start: 16px;
  --padding-end: 16px;
  --padding-bottom: 40px;
}

.spinner {
  display: block;
  margin: 4rem auto;
}

.event-info-card {
  background: rgba(24, 24, 24, 0.9);
}

.event-stats {
  margin-top: 0.75rem;
}

.event-rules {
  margin-top: 1rem;
}

.event-rules h4 {
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.event-rules ul {
  padding-left: 1rem;
  color: var(--ion-color-medium);
  font-size: 0.9rem;
}

.user-standing-card {
  background: rgba(24, 24, 24, 0.9);
}

.stats-row {
  display: flex;
  justify-content: space-around;
  gap: 1rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  align-items: center;
}

.stat-label {
  text-transform: uppercase;
  font-size: 0.7rem;
  letter-spacing: 0.06em;
  color: var(--ion-color-medium);
}

.stat-value {
  font-size: 1.3rem;
  font-weight: 600;
}

.play-actions {
  margin: 1rem 0;
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-top: 4rem;
  text-align: center;
}
</style>
