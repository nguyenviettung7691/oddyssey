<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="dark">
        <ion-title>Oddyssey</ion-title>
        <ion-buttons slot="end">
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
        <h1>Find the Odd One Out.</h1>
        <p>
          Blitz through 60 seconds of themed trivia. Climb the streaks, trigger power cards, and keep the clock alive.
        </p>
        <ion-chip color="primary" v-if="userStore.isAuthenticated">
          <ion-icon :icon="sparklesOutline" />
          <ion-label>Welcome back, {{ userStore.displayName }}</ion-label>
        </ion-chip>
      </section>

      <section>
        <h2>Select your theme</h2>
        <ThemePicker
          v-model="selectedTheme"
          :themes="coreThemes"
          :upcoming-themes="upcomingThemes"
        />
      </section>

      <ion-card class="power-card">
        <ion-card-header>
          <ion-card-title>Power Cards</ion-card-title>
          <ion-card-subtitle>Each match comes with four single-use boosts.</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
          <ul>
            <li><strong>Swap Question:</strong> Roll a fresh challenge instantly.</li>
            <li><strong>Remove Correct:</strong> Trim one safe option.</li>
            <li><strong>Double Score:</strong> Bank double points on a confident call.</li>
            <li><strong>Time Keep:</strong> Protect the clock from a misfire.</li>
          </ul>
        </ion-card-content>
      </ion-card>

      <ion-footer class="start-footer">
        <ion-button expand="block" size="large" :disabled="!selectedTheme" @click="begin">
          Start Oddyssey
        </ion-button>
      </ion-footer>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
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
import { trophyOutline, personCircleOutline, sparklesOutline } from 'ionicons/icons';
import { coreThemes, upcomingThemesPlaceholders } from '@/data/themes';
import ThemePicker from '@/components/ThemePicker.vue';
import { useUserStore } from '@/store/userStore';

const router = useRouter();
const userStore = useUserStore();
const selectedTheme = ref<string | null>(coreThemes[0]?.id ?? null);

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
</style>
