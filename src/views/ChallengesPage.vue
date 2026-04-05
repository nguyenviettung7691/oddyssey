<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="dark">
        <ion-title>{{ $t('challenges.title') }}</ion-title>
        <ion-buttons slot="start">
          <ion-button fill="clear" router-link="/home" :aria-label="$t('accessibility.backToHome')">
            <ion-icon slot="icon-only" :icon="arrowBackOutline" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="challenges-content">
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
        <ion-refresher-content />
      </ion-refresher>

      <div v-if="!isAuthenticated" class="empty-state">
        <ion-icon :icon="flashOutline" size="large" />
        <h2>{{ $t('challenges.signInRequired') }}</h2>
        <p>{{ $t('challenges.signInHint') }}</p>
        <ion-button router-link="/profile">{{ $t('challenges.goToProfile') }}</ion-button>
      </div>

      <template v-else>
        <div v-if="isLoading" class="loading-container">
          <ion-spinner name="crescent" />
        </div>

        <template v-else>
          <ion-list v-if="incomingChallenges.length" inset>
            <ion-list-header>{{ $t('challenges.incoming') }}</ion-list-header>
            <ion-item v-for="challenge in incomingChallenges" :key="challenge.id">
              <ion-avatar slot="start">
                <img v-if="challenge.challengerAvatarUrl" :src="challenge.challengerAvatarUrl" :alt="challenge.challengerDisplayName" />
                <div v-else class="avatar-placeholder">{{ challenge.challengerDisplayName.charAt(0) }}</div>
              </ion-avatar>
              <ion-label>
                <h3>{{ challenge.challengerDisplayName }}</h3>
                <p>{{ challenge.themeLabel }} · {{ timeRemaining(challenge.expiresAt) }}</p>
              </ion-label>
              <ion-button slot="end" fill="solid" size="small" color="success" @click="handleAccept(challenge)">
                {{ $t('challenges.accept') }}
              </ion-button>
              <ion-button slot="end" fill="outline" size="small" color="danger" @click="handleDecline(challenge.id)">
                {{ $t('challenges.decline') }}
              </ion-button>
            </ion-item>
          </ion-list>

          <ion-list v-if="activeChallenges.length" inset>
            <ion-list-header>{{ $t('challenges.active') }}</ion-list-header>
            <ion-item v-for="challenge in activeChallenges" :key="challenge.id">
              <ion-avatar slot="start">
                <img v-if="opponentAvatar(challenge)" :src="opponentAvatar(challenge)!" :alt="opponentName(challenge)" />
                <div v-else class="avatar-placeholder">{{ opponentName(challenge).charAt(0) }}</div>
              </ion-avatar>
              <ion-label>
                <h3>{{ $t('challenges.vsOpponent', { name: opponentName(challenge) }) }}</h3>
                <p>{{ challenge.themeLabel }}</p>
              </ion-label>
              <ion-button v-if="needsToPlay(challenge)" slot="end" fill="solid" size="small" @click="playChallenge(challenge)">
                {{ $t('challenges.playNow') }}
              </ion-button>
              <ion-chip v-else slot="end" color="warning">
                {{ $t('challenges.waiting') }}
              </ion-chip>
            </ion-item>
          </ion-list>

          <ion-list v-if="completedChallenges.length" inset>
            <ion-list-header>{{ $t('challenges.completed') }}</ion-list-header>
            <ion-item v-for="challenge in completedChallenges" :key="challenge.id">
              <ion-avatar slot="start">
                <img v-if="opponentAvatar(challenge)" :src="opponentAvatar(challenge)!" :alt="opponentName(challenge)" />
                <div v-else class="avatar-placeholder">{{ opponentName(challenge).charAt(0) }}</div>
              </ion-avatar>
              <ion-label>
                <h3>{{ $t('challenges.vsOpponent', { name: opponentName(challenge) }) }}</h3>
                <p>{{ challenge.themeLabel }} · {{ myScore(challenge) }} vs {{ opponentScore(challenge) }}</p>
              </ion-label>
              <ion-badge slot="end" :color="resultColor(challenge)">{{ resultLabel(challenge) }}</ion-badge>
            </ion-item>
          </ion-list>

          <ion-list v-if="sentChallenges.length" inset>
            <ion-list-header>{{ $t('challenges.sent') }}</ion-list-header>
            <ion-item v-for="challenge in sentChallenges" :key="challenge.id">
              <ion-avatar slot="start">
                <img v-if="challenge.challengedAvatarUrl" :src="challenge.challengedAvatarUrl" :alt="challenge.challengedDisplayName" />
                <div v-else class="avatar-placeholder">{{ challenge.challengedDisplayName.charAt(0) }}</div>
              </ion-avatar>
              <ion-label>
                <h3>{{ challenge.challengedDisplayName }}</h3>
                <p>{{ challenge.themeLabel }} · {{ $t('challenges.pendingStatus') }}</p>
              </ion-label>
            </ion-item>
          </ion-list>

          <div v-if="!incomingChallenges.length && !activeChallenges.length && !completedChallenges.length && !sentChallenges.length" class="empty-state">
            <ion-icon :icon="flashOutline" size="large" />
            <p>{{ $t('challenges.noChallenges') }}</p>
            <ion-button router-link="/friends" fill="outline">{{ $t('challenges.findFriends') }}</ion-button>
          </div>
        </template>
      </template>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
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
  IonSpinner,
  IonTitle,
  IonToolbar,
} from '@ionic/vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { arrowBackOutline, flashOutline } from 'ionicons/icons';
import { useUserStore } from '@/store/userStore';
import {
  getChallenges,
  acceptChallenge,
  declineChallenge,
} from '@/services/challengeService';
import type { Challenge } from '@/types/game';

const { t } = useI18n();
const router = useRouter();
const userStore = useUserStore();

const allChallenges = ref<Challenge[]>([]);
const isLoading = ref(false);

const isAuthenticated = computed(() => userStore.isAuthenticated);
const userId = computed(() => userStore.user?.id ?? '');

const incomingChallenges = computed(() =>
  allChallenges.value.filter((c) => c.challengedId === userId.value && c.status === 'pending'),
);

const activeChallenges = computed(() =>
  allChallenges.value.filter((c) => c.status === 'accepted'),
);

const completedChallenges = computed(() =>
  allChallenges.value.filter((c) => c.status === 'completed').slice(0, 20),
);

const sentChallenges = computed(() =>
  allChallenges.value.filter((c) => c.challengerId === userId.value && c.status === 'pending'),
);

function opponentName(challenge: Challenge): string {
  return challenge.challengerId === userId.value
    ? challenge.challengedDisplayName
    : challenge.challengerDisplayName;
}

function opponentAvatar(challenge: Challenge): string | undefined {
  return challenge.challengerId === userId.value
    ? challenge.challengedAvatarUrl ?? undefined
    : challenge.challengerAvatarUrl ?? undefined;
}

function myScore(challenge: Challenge): number | string {
  const score = challenge.challengerId === userId.value
    ? challenge.challengerScore
    : challenge.challengedScore;
  return score ?? '-';
}

function opponentScore(challenge: Challenge): number | string {
  const score = challenge.challengerId === userId.value
    ? challenge.challengedScore
    : challenge.challengerScore;
  return score ?? '-';
}

function needsToPlay(challenge: Challenge): boolean {
  if (challenge.challengerId === userId.value) {
    return challenge.challengerScore === null;
  }
  return challenge.challengedScore === null;
}

function resultColor(challenge: Challenge): string {
  if (challenge.winnerId === userId.value) return 'success';
  if (challenge.winnerId === null) return 'warning';
  return 'danger';
}

function resultLabel(challenge: Challenge): string {
  if (challenge.winnerId === userId.value) return t('challenges.won');
  if (challenge.winnerId === null) return t('challenges.tie');
  return t('challenges.lost');
}

function timeRemaining(expiresAt: string): string {
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return t('challenges.expired');
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours > 0) return t('challenges.hoursLeft', { count: hours });
  const minutes = Math.floor(diff / (1000 * 60));
  return t('challenges.minutesLeft', { count: minutes });
}

async function refreshData(): Promise<void> {
  if (!userId.value) return;
  isLoading.value = true;
  try {
    allChallenges.value = await getChallenges(userId.value);
  } catch (error) {
    console.warn('[Oddyssey] Failed to load challenges', error);
  } finally {
    isLoading.value = false;
  }
}

async function handleRefresh(event: CustomEvent): Promise<void> {
  await refreshData();
  (event.target as HTMLIonRefresherElement).complete();
}

async function handleAccept(challenge: Challenge): Promise<void> {
  await acceptChallenge(challenge.id);
  await refreshData();
}

async function handleDecline(challengeId: string): Promise<void> {
  await declineChallenge(challengeId);
  allChallenges.value = allChallenges.value.filter((c) => c.id !== challengeId);
}

function playChallenge(challenge: Challenge): void {
  router.push({
    name: 'Game',
    query: { theme: challenge.themeId, challengeId: challenge.id },
  });
}

onMounted(() => {
  void refreshData();
});
</script>

<style scoped>
.challenges-content {
  --padding-start: 16px;
  --padding-end: 16px;
  --padding-bottom: 40px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  text-align: center;
  padding: 3rem 1rem;
}

.loading-container {
  display: flex;
  justify-content: center;
  padding: 3rem 0;
}

.avatar-placeholder {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: rgba(255, 140, 66, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.2rem;
  color: var(--oddyssey-accent);
}
</style>
