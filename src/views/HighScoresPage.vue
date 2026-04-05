<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="dark">
        <ion-title>{{ $t('highScores.title') }}</ion-title>
        <ion-buttons slot="start">
          <ion-button fill="clear" router-link="/home" :aria-label="$t('accessibility.backToHome')">
            <ion-icon slot="icon-only" :icon="arrowBackOutline" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="scores-content">
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
        <ion-refresher-content />
      </ion-refresher>

      <ion-segment v-if="showSourceToggle" v-model="leaderboardSource" mode="md" class="source-segment">
        <ion-segment-button value="local">
          <ion-label>{{ $t('highScores.local') }}</ion-label>
        </ion-segment-button>
        <ion-segment-button value="global">
          <ion-label>{{ $t('highScores.global') }}</ion-label>
        </ion-segment-button>
        <ion-segment-button v-if="isAuthenticated" value="friends">
          <ion-label>{{ $t('highScores.friends') }}</ion-label>
        </ion-segment-button>
      </ion-segment>

      <ion-segment v-model="selectedTheme" mode="md" class="theme-segment">
        <ion-segment-button value="all">
          <ion-label>{{ $t('highScores.allThemes') }}</ion-label>
        </ion-segment-button>
        <ion-segment-button v-for="theme in coreThemes" :key="theme.id" :value="theme.id">
          <ion-label>{{ theme.label }}</ion-label>
        </ion-segment-button>
      </ion-segment>

      <div v-if="isLoading" class="loading-container">
        <ion-spinner name="crescent" />
        <p>{{ $t('highScores.loading') }}</p>
      </div>

      <ion-list v-else inset>
        <ion-list-header>
          <ion-label>{{ activeThemeLabel }}</ion-label>
        </ion-list-header>
        <ion-item v-for="(entry, index) in highScores" :key="entry.id">
          <ion-avatar slot="start">
            <img v-if="entry.avatarUrl" :src="entry.avatarUrl" :alt="entry.userDisplayName" />
            <div v-else class="rank-badge">#{{ index + 1 }}</div>
          </ion-avatar>
          <ion-label>
            <h3>{{ entry.userDisplayName }}</h3>
            <p>{{ formatDate(entry.finishedAt) }}</p>
          </ion-label>
          <ion-badge slot="end" color="primary">{{ entry.score }}</ion-badge>
        </ion-item>
        <ion-item v-if="!highScores.length">
          <ion-label>{{ $t('highScores.noRuns') }}</ion-label>
        </ion-item>
      </ion-list>

      <div v-if="userRank !== null && leaderboardSource !== 'local'" class="user-rank">
        <ion-chip color="tertiary">
          <ion-icon :icon="trophyOutline" />
          <ion-label>{{ $t('highScores.yourRank', { rank: userRank }) }}</ion-label>
        </ion-chip>
      </div>
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
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSegment,
  IonSegmentButton,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from '@ionic/vue';
import { useI18n } from 'vue-i18n';
import { arrowBackOutline, trophyOutline } from 'ionicons/icons';
import { coreThemes } from '@/data/themes';
import { listHighScores } from '@/services/storageService';
import { getGlobalLeaderboard, getFriendsLeaderboard, getUserRank } from '@/services/leaderboardService';
import { getFriendIds } from '@/services/friendService';
import { isFirebaseConfigured } from '@/services/firebaseService';
import { useUserStore } from '@/store/userStore';
import type { HighScoreEntry } from '@/types/game';

const { t } = useI18n();
const userStore = useUserStore();
const selectedTheme = ref<'all' | string>('all');
const leaderboardSource = ref<'local' | 'global' | 'friends'>('local');
const highScores = ref<HighScoreEntry[]>([]);
const isLoading = ref(false);
const userRank = ref<number | null>(null);

const isAuthenticated = computed(() => userStore.isAuthenticated);
const showSourceToggle = computed(() => isFirebaseConfigured());

const activeThemeLabel = computed(() => {
  if (selectedTheme.value === 'all') {
    return t('highScores.acrossAll');
  }
  const theme = coreThemes.find((item) => item.id === selectedTheme.value);
  return theme?.label ?? t('highScores.unknownTheme');
});

async function refreshLeaderboard(): Promise<void> {
  isLoading.value = true;
  userRank.value = null;

  try {
    if (leaderboardSource.value === 'global') {
      highScores.value = await getGlobalLeaderboard(selectedTheme.value, 20);
      if (userStore.user?.id) {
        userRank.value = await getUserRank(userStore.user.id, selectedTheme.value);
      }
    } else if (leaderboardSource.value === 'friends') {
      if (userStore.user?.id) {
        const friendIds = await getFriendIds(userStore.user.id);
        friendIds.push(userStore.user.id);
        highScores.value = await getFriendsLeaderboard(selectedTheme.value, friendIds, 20);
      } else {
        highScores.value = [];
      }
    } else {
      highScores.value = listHighScores(selectedTheme.value, 20);
    }
  } catch (error) {
    console.warn('[Oddyssey] Failed to refresh leaderboard', error);
    highScores.value = listHighScores(selectedTheme.value, 20);
  } finally {
    isLoading.value = false;
  }
}

async function handleRefresh(event: CustomEvent): Promise<void> {
  await refreshLeaderboard();
  (event.target as HTMLIonRefresherElement).complete();
}

watch([selectedTheme, leaderboardSource], () => {
  void refreshLeaderboard();
});

onMounted(() => {
  if (isFirebaseConfigured()) {
    leaderboardSource.value = 'global';
  }
  void refreshLeaderboard();
});

function formatDate(input: string): string {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) {
    return t('highScores.unknownTime');
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

.source-segment {
  margin-top: 1rem;
}

.theme-segment {
  margin-top: 0.5rem;
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

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
  gap: 1rem;
  color: var(--ion-color-medium);
}

.user-rank {
  display: flex;
  justify-content: center;
  padding: 1rem 0;
}
</style>
