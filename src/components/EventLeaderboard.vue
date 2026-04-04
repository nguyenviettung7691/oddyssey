<template>
  <div class="event-leaderboard">
    <ion-list v-if="standings.length > 0" inset>
      <ion-list-header>{{ $t('events.leaderboard') }}</ion-list-header>
      <ion-item v-for="entry in standings" :key="entry.userId" :class="{ 'current-user': entry.userId === currentUserId }">
        <ion-avatar slot="start" v-if="entry.avatarUrl">
          <img :src="entry.avatarUrl" :alt="entry.displayName" />
        </ion-avatar>
        <div slot="start" v-else class="rank-badge">{{ entry.rank }}</div>
        <ion-label>
          <h3>
            <span class="rank-num">#{{ entry.rank }}</span>
            {{ entry.displayName }}
          </h3>
          <p>
            {{ $t('events.gamesPlayed', { count: entry.gamesPlayed }) }}
            · 🔥 {{ entry.bestStreak }}
          </p>
        </ion-label>
        <ion-note slot="end" class="score-note">{{ entry.bestScore }} {{ $t('events.pts') }}</ion-note>
      </ion-item>
    </ion-list>
    <div v-else class="empty-leaderboard">
      <p>{{ $t('events.noStandings') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  IonAvatar,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonNote,
} from '@ionic/vue';
import type { EventStanding } from '@/types/game';

defineProps<{
  standings: EventStanding[];
  currentUserId?: string;
}>();
</script>

<style scoped>
.rank-badge {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--ion-color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.85rem;
}

.rank-num {
  color: var(--ion-color-primary);
  font-weight: 700;
  margin-right: 0.3rem;
}

.score-note {
  font-size: 1rem;
  font-weight: 600;
}

.current-user {
  --background: rgba(107, 191, 185, 0.1);
  border-left: 3px solid var(--ion-color-primary);
}

.empty-leaderboard {
  text-align: center;
  padding: 2rem;
  color: var(--ion-color-medium);
}
</style>
