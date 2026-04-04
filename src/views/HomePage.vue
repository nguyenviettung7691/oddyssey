<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="dark">
        <ion-title>{{ $t('app.title') }}</ion-title>
        <ion-buttons slot="end">
          <ion-button v-if="firebaseReady && userStore.isAuthenticated" router-link="/friends" fill="clear">
            <ion-icon slot="icon-only" :icon="peopleOutline" />
            <ion-badge v-if="notificationStore.friendsBadge > 0" color="danger" class="nav-badge">{{ notificationStore.friendsBadge }}</ion-badge>
          </ion-button>
          <ion-button v-if="firebaseReady && userStore.isAuthenticated" router-link="/challenges" fill="clear">
            <ion-icon slot="icon-only" :icon="flashOutline" />
            <ion-badge v-if="notificationStore.challengesBadge > 0" color="danger" class="nav-badge">{{ notificationStore.challengesBadge }}</ion-badge>
          </ion-button>
          <ion-button router-link="/highscores" fill="clear">
            <ion-icon slot="icon-only" :icon="trophyOutline" />
          </ion-button>
          <ion-button router-link="/profile" fill="clear">
            <ion-icon slot="icon-only" :icon="personCircleOutline" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="home-content">
      <section class="hero">
        <h1>{{ $t('home.headline') }}</h1>
        <p>{{ $t('home.subtitle') }}</p>
        <ion-chip color="primary" v-if="userStore.isAuthenticated">
          <ion-icon :icon="sparklesOutline" />
          <ion-label>{{ $t('home.welcomeBack', { name: userStore.displayName }) }}</ion-label>
        </ion-chip>
      </section>

      <section>
        <h2>{{ $t('home.selectTheme') }}</h2>
        <ThemePicker
          v-model="selectedTheme"
          :themes="coreThemes"
          :upcoming-themes="upcomingThemes"
        />
      </section>

      <ion-card class="power-card">
        <ion-card-header>
          <ion-card-title>{{ $t('home.powerCards.title') }}</ion-card-title>
          <ion-card-subtitle>{{ $t('home.powerCards.subtitle') }}</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
          <ul>
            <li><strong>{{ $t('home.powerCards.swapLabel') }}</strong> {{ $t('home.powerCards.swap') }}</li>
            <li><strong>{{ $t('home.powerCards.removeCorrectLabel') }}</strong> {{ $t('home.powerCards.removeCorrect') }}</li>
            <li><strong>{{ $t('home.powerCards.doubleScoreLabel') }}</strong> {{ $t('home.powerCards.doubleScore') }}</li>
            <li><strong>{{ $t('home.powerCards.timeKeepLabel') }}</strong> {{ $t('home.powerCards.timeKeep') }}</li>
          </ul>
        </ion-card-content>
      </ion-card>

      <ion-footer class="start-footer">
        <ion-button expand="block" size="large" :disabled="!selectedTheme" @click="begin">
          {{ $t('home.startButton') }}
        </ion-button>
      </ion-footer>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  IonBadge,
  IonButtons,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonChip,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/vue';
import { useRouter } from 'vue-router';
import { trophyOutline, personCircleOutline, sparklesOutline, peopleOutline, flashOutline } from 'ionicons/icons';
import { coreThemes, upcomingThemesPlaceholders } from '@/data/themes';
import ThemePicker from '@/components/ThemePicker.vue';
import { useUserStore } from '@/store/userStore';
import { useNotificationStore } from '@/store/notificationStore';
import { isFirebaseConfigured } from '@/services/firebaseService';

const router = useRouter();
const userStore = useUserStore();
const notificationStore = useNotificationStore();
const selectedTheme = ref<string | null>(coreThemes[0]?.id ?? null);
const firebaseReady = isFirebaseConfigured();

function begin(): void {
  if (!selectedTheme.value) {
    return;
  }
  router.push({ name: 'Game', query: { theme: selectedTheme.value } });
}

const upcomingThemes = upcomingThemesPlaceholders;
</script>

<style scoped>
.home-content {
  --padding-start: 16px;
  --padding-end: 16px;
  --padding-bottom: 120px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: radial-gradient(circle at top right, rgba(255, 140, 66, 0.28), transparent 60%);
}

.hero {
  text-align: left;
  margin: 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.hero h1 {
  font-size: 2.4rem;
  margin-bottom: 0.5rem;
}

.hero p {
  color: var(--ion-color-medium);
  font-size: 1rem;
}

section h2 {
  font-size: 1.2rem;
  margin-bottom: 0.75rem;
}

.power-card {
  background: rgba(22, 22, 22, 0.85);
}

.power-card ul {
  margin: 0;
  padding-left: 1rem;
  display: grid;
  gap: 0.4rem;
}

.power-card li {
  color: var(--ion-color-medium);
}

.start-footer {
  position: sticky;
  bottom: 32px;
  background: transparent;
}

.nav-badge {
  position: absolute;
  top: 2px;
  right: 2px;
  font-size: 0.6rem;
  min-width: 16px;
  height: 16px;
  border-radius: 8px;
}
</style>
