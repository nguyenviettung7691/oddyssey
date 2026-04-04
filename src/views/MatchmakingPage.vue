<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="dark">
        <ion-buttons slot="start">
          <ion-button fill="clear" router-link="/home">
            <ion-icon slot="icon-only" :icon="arrowBackOutline" />
          </ion-button>
        </ion-buttons>
        <ion-title>{{ $t('multiplayer.matchmaking') }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="matchmaking-content">
      <template v-if="!multiplayerStore.isSearching && !multiplayerStore.matchId">
        <section class="mode-selection">
          <h2>{{ $t('multiplayer.selectMode') }}</h2>
          <div class="mode-cards">
            <ion-card button @click="selectedMode = 'versus'" :class="{ selected: selectedMode === 'versus' }">
              <ion-card-content class="mode-card-content">
                <span class="mode-icon">⚔️</span>
                <h3>{{ $t('multiplayer.versus') }}</h3>
                <p>{{ $t('multiplayer.versusDescription') }}</p>
              </ion-card-content>
            </ion-card>
            <ion-card button @click="selectedMode = 'cooperative'" :class="{ selected: selectedMode === 'cooperative' }">
              <ion-card-content class="mode-card-content">
                <span class="mode-icon">🤝</span>
                <h3>{{ $t('multiplayer.cooperative') }}</h3>
                <p>{{ $t('multiplayer.cooperativeDescription') }}</p>
              </ion-card-content>
            </ion-card>
          </div>
        </section>

        <section>
          <h2>{{ $t('home.selectTheme') }}</h2>
          <ThemePicker
            v-model="selectedTheme"
            :themes="coreThemes"
            :upcoming-themes="[]"
          />
        </section>

        <div class="search-action">
          <ion-button
            expand="block"
            size="large"
            :disabled="!selectedTheme || !isAuthenticated"
            @click="startSearch"
          >
            {{ $t('multiplayer.findMatch') }}
          </ion-button>
          <p v-if="!isAuthenticated" class="auth-hint">
            {{ $t('multiplayer.signInRequired') }}
          </p>
        </div>
      </template>

      <template v-else-if="multiplayerStore.isSearching">
        <div class="searching-state">
          <ion-spinner name="dots" class="search-spinner" />
          <h2>{{ $t('multiplayer.searching') }}</h2>
          <p>{{ $t('multiplayer.searchingHint') }}</p>
          <ion-button fill="outline" color="danger" @click="cancelSearch">
            {{ $t('multiplayer.cancelSearch') }}
          </ion-button>
        </div>
      </template>

      <template v-else-if="multiplayerStore.match && multiplayerStore.match.status === 'waiting'">
        <VersusLobby
          :theme-label="multiplayerStore.match.themeLabel"
          :mode="multiplayerStore.match.mode"
          :player="playerInfo"
          :opponent="opponentInfo"
          :player-ready="isPlayerReady"
          :opponent-ready="isOpponentReady"
          @ready="handleReady"
          @leave="handleLeave"
        />
      </template>

      <template v-else-if="multiplayerStore.match && multiplayerStore.match.status === 'ready'">
        <VersusLobby
          :theme-label="multiplayerStore.match.themeLabel"
          :mode="multiplayerStore.match.mode"
          :player="playerInfo"
          :opponent="opponentInfo"
          :player-ready="isPlayerReady"
          :opponent-ready="isOpponentReady"
          @ready="handleReady"
          @leave="handleLeave"
        />
      </template>

      <div v-if="multiplayerStore.error" class="error-message">
        <ion-text color="danger">{{ multiplayerStore.error }}</ion-text>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, ref, watch, onUnmounted } from 'vue';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/vue';
import { arrowBackOutline } from 'ionicons/icons';
import { useRouter } from 'vue-router';
import ThemePicker from '@/components/ThemePicker.vue';
import VersusLobby from '@/components/VersusLobby.vue';
import { coreThemes } from '@/data/themes';
import { useMultiplayerStore } from '@/store/multiplayerStore';
import { useUserStore } from '@/store/userStore';
import type { MatchMode } from '@/types/game';

const router = useRouter();
const multiplayerStore = useMultiplayerStore();
const userStore = useUserStore();

const selectedTheme = ref<string | null>(coreThemes[0]?.id ?? null);
const selectedMode = ref<MatchMode>('versus');

const isAuthenticated = computed(() => userStore.isAuthenticated);

const playerInfo = computed(() => ({
  displayName: userStore.displayName,
  avatarUrl: userStore.avatarUrl,
}));

const opponentInfo = computed(() => {
  if (!multiplayerStore.match || !userStore.user) {
    return { displayName: '...', avatarUrl: undefined };
  }
  const info = multiplayerStore.getOpponentInfo(userStore.user.id);
  return info ?? { displayName: '...', avatarUrl: undefined };
});

const isPlayerReady = computed(() => {
  if (!multiplayerStore.match || !userStore.user) return false;
  const match = multiplayerStore.match;
  return match.player1Id === userStore.user.id ? match.player1Ready : match.player2Ready;
});

const isOpponentReady = computed(() => {
  if (!multiplayerStore.match || !userStore.user) return false;
  const match = multiplayerStore.match;
  return match.player1Id === userStore.user.id ? match.player2Ready : match.player1Ready;
});

async function startSearch(): Promise<void> {
  if (!selectedTheme.value || !userStore.user) return;
  await multiplayerStore.searchForMatch(
    userStore.user.id,
    userStore.displayName,
    userStore.avatarUrl,
    selectedTheme.value,
    selectedMode.value,
  );
}

async function cancelSearch(): Promise<void> {
  await multiplayerStore.cancelSearch();
}

async function handleReady(): Promise<void> {
  if (!multiplayerStore.matchId || !userStore.user) return;
  await multiplayerStore.readyUp(multiplayerStore.matchId, userStore.user.id);
}

function handleLeave(): void {
  multiplayerStore.cleanup();
}

watch(
  () => multiplayerStore.match?.status,
  (status) => {
    if (status === 'playing' && multiplayerStore.match) {
      router.push({
        name: 'Game',
        query: {
          theme: multiplayerStore.match.themeId,
          matchId: multiplayerStore.match.id,
        },
      });
    }
  },
);

onUnmounted(() => {
  if (multiplayerStore.isSearching) {
    multiplayerStore.cancelSearch();
  }
});
</script>

<style scoped>
.matchmaking-content {
  --padding-start: 16px;
  --padding-end: 16px;
  --padding-bottom: 40px;
}

.mode-selection {
  margin-bottom: 1.5rem;
}

.mode-selection h2,
section h2 {
  font-size: 1.2rem;
  margin-bottom: 0.75rem;
}

.mode-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.mode-cards ion-card {
  background: rgba(24, 24, 24, 0.9);
  border: 2px solid transparent;
  margin: 0;
}

.mode-cards ion-card.selected {
  border-color: var(--ion-color-primary);
}

.mode-card-content {
  text-align: center;
}

.mode-icon {
  font-size: 2rem;
}

.mode-card-content h3 {
  margin: 0.5rem 0 0.3rem;
  font-size: 1rem;
}

.mode-card-content p {
  font-size: 0.8rem;
  color: var(--ion-color-medium);
  margin: 0;
}

.search-action {
  margin-top: 1.5rem;
}

.auth-hint {
  text-align: center;
  color: var(--ion-color-medium);
  font-size: 0.85rem;
  margin-top: 0.5rem;
}

.searching-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 4rem;
  text-align: center;
}

.search-spinner {
  transform: scale(2);
  margin-bottom: 1rem;
}

.searching-state p {
  color: var(--ion-color-medium);
}

.error-message {
  text-align: center;
  margin-top: 1rem;
}
</style>
