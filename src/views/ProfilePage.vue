<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="dark">
        <ion-title>Profile</ion-title>
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
            Signed in via {{ userStore.provider }}
          </ion-card-subtitle>
          <ion-card-subtitle v-else>Play as guest or link Google</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
          <div class="profile-actions">
            <ion-button expand="block" :disabled="userStore.status === 'loading'" @click="handleGoogleSignIn">
              Sign in with Google
            </ion-button>
            <ion-button expand="block" fill="outline" @click="handleSignOut" :disabled="userStore.status === 'loading'">
              Sign out
            </ion-button>
          </div>
          <ion-item lines="none">
            <ion-label position="stacked">Guest alias</ion-label>
            <ion-input v-model="guestAlias" type="text" placeholder="Oddyssey Explorer"></ion-input>
          </ion-item>
          <ion-button expand="block" fill="clear" @click="applyGuestAlias">
            Use guest profile
          </ion-button>
          <ion-text color="danger" v-if="userStore.error">{{ userStore.error }}</ion-text>
          <ion-text color="warning" v-if="!isGoogleReady">
            Set VITE_GOOGLE_CLIENT_ID in your environment to enable Google Sign-In.
          </ion-text>
        </ion-card-content>
      </ion-card>

      <ion-list inset v-if="userStore.isAuthenticated && pastRuns.length">
        <ion-list-header>Your recent runs</ion-list-header>
        <ion-item v-for="record in pastRuns" :key="record.sessionId">
          <ion-label>
            <h3>{{ record.themeLabel }} · {{ record.score }} pts</h3>
            <p>{{ formatDate(record.finishedAt ?? record.startedAt) }}</p>
          </ion-label>
        </ion-item>
      </ion-list>

      <ion-text color="medium" class="no-runs" v-else-if="userStore.isAuthenticated">
        No saved runs yet. Finish a game to see it here.
      </ion-text>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
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
import { arrowBackOutline } from 'ionicons/icons';
import { useUserStore } from '@/store/userStore';
import { getUserRecords } from '@/services/storageService';
import { isGoogleConfigured } from '@/services/authService';
import type { GameRecord } from '@/types/game';

const userStore = useUserStore();
const guestAlias = ref(userStore.displayName);
const pastRuns = ref<GameRecord[]>([]);

const isGoogleReady = computed(() => isGoogleConfigured());

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
  const name = guestAlias.value?.trim() || 'Oddyssey Explorer';
  userStore.setGuest(name);
  refreshRuns();
}

function formatDate(input: string): string {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) {
    return 'Unknown time';
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
