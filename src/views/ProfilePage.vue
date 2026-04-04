<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="dark">
        <ion-title>{{ $t('profile.title') }}</ion-title>
        <ion-buttons slot="start">
          <ion-button fill="clear" router-link="/home">
            <ion-icon slot="icon-only" :icon="arrowBackOutline" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="profile-content">
      <ion-card>
        <ion-card-header>
          <ion-card-title>{{ userStore.displayName }}</ion-card-title>
          <ion-card-subtitle v-if="userStore.isAuthenticated">
            {{ $t('profile.signedInVia', { provider: userStore.provider }) }}
          </ion-card-subtitle>
          <ion-card-subtitle v-else>{{ $t('profile.guestHint') }}</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
          <div class="profile-actions">
            <ion-button expand="block" :disabled="userStore.status === 'loading'" @click="handleGoogleSignIn">
              {{ $t('profile.signInGoogle') }}
            </ion-button>
            <ion-button expand="block" fill="outline" @click="handleSignOut" :disabled="userStore.status === 'loading'">
              {{ $t('profile.signOut') }}
            </ion-button>
          </div>
          <ion-item lines="none">
            <ion-label position="stacked">{{ $t('profile.guestAlias') }}</ion-label>
            <ion-input v-model="guestAlias" type="text" :placeholder="$t('profile.guestPlaceholder')"></ion-input>
          </ion-item>
          <ion-button expand="block" fill="clear" @click="applyGuestAlias">
            {{ $t('profile.useGuest') }}
          </ion-button>
          <ion-text color="danger" v-if="userStore.error">{{ userStore.error }}</ion-text>
          <ion-text color="warning" v-if="!isGoogleReady">
            {{ $t('profile.googleNotConfigured') }}
          </ion-text>
        </ion-card-content>
      </ion-card>

      <ion-card>
        <ion-card-header>
          <ion-card-title>{{ $t('profile.language') }}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-list lines="none">
            <ion-item v-for="loc in supportedLocales" :key="loc.code" button @click="switchLocale(loc.code)">
              <ion-label>{{ loc.label }}</ion-label>
              <ion-icon v-if="locale === loc.code" :icon="checkmarkOutline" slot="end" color="primary" />
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>

      <ion-list inset v-if="userStore.isAuthenticated && pastRuns.length">
        <ion-list-header>{{ $t('profile.recentRuns') }}</ion-list-header>
        <ion-item v-for="record in pastRuns" :key="record.sessionId">
          <ion-label>
            <h3>{{ $t('profile.runSummary', { theme: record.themeLabel, score: record.score }) }}</h3>
            <p>{{ formatDate(record.finishedAt ?? record.startedAt) }}</p>
          </ion-label>
        </ion-item>
      </ion-list>

      <ion-text color="medium" class="no-runs" v-else-if="userStore.isAuthenticated">
        {{ $t('profile.noRuns') }}
      </ion-text>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/vue';
import { arrowBackOutline, checkmarkOutline } from 'ionicons/icons';
import { useUserStore } from '@/store/userStore';
import { getUserRecords } from '@/services/storageService';
import { isGoogleConfigured } from '@/services/authService';
import { supportedLocales, persistLocale } from '@/i18n';
import type { GameRecord } from '@/types/game';

const { t, locale } = useI18n();
const userStore = useUserStore();
const guestAlias = ref(userStore.displayName);
const pastRuns = ref<GameRecord[]>([]);

const isGoogleReady = computed(() => isGoogleConfigured());

function switchLocale(code: string): void {
  locale.value = code;
  persistLocale(code);
}

function refreshRuns(): void {
  if (!userStore.user) {
    pastRuns.value = [];
    return;
  }
  pastRuns.value = getUserRecords(userStore.user.id).slice(0, 10);
}

async function handleGoogleSignIn(): Promise<void> {
  try {
    await userStore.signInWithGoogle();
    refreshRuns();
  } catch (error) {
    console.error('[Oddyssey] Google sign-in failed', error);
  }
}

async function handleSignOut(): Promise<void> {
  await userStore.signOut();
  refreshRuns();
}

function applyGuestAlias(): void {
  const name = guestAlias.value?.trim() || t('profile.guestPlaceholder');
  userStore.setGuest(name);
  refreshRuns();
}

function formatDate(input: string): string {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) {
    return t('profile.unknownTime');
  }
  return date.toLocaleString();
}

onMounted(() => {
  refreshRuns();
});

watch(
  () => userStore.user?.id,
  () => {
    refreshRuns();
    guestAlias.value = userStore.displayName;
  },
);
</script>

<style scoped>
.profile-content {
  --padding-start: 16px;
  --padding-end: 16px;
  --padding-bottom: 40px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.profile-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.no-runs {
  text-align: center;
}
</style>
