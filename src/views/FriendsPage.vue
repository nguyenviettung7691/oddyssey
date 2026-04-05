<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="dark">
        <ion-title>{{ $t('friends.title') }}</ion-title>
        <ion-buttons slot="start">
          <ion-button fill="clear" router-link="/home" :aria-label="$t('accessibility.backToHome')">
            <ion-icon slot="icon-only" :icon="arrowBackOutline" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="friends-content">
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh($event)">
        <ion-refresher-content />
      </ion-refresher>

      <div v-if="!isAuthenticated" class="empty-state">
        <ion-icon :icon="personAddOutline" size="large" />
        <h2>{{ $t('friends.signInRequired') }}</h2>
        <p>{{ $t('friends.signInHint') }}</p>
        <ion-button router-link="/profile">{{ $t('friends.goToProfile') }}</ion-button>
      </div>

      <template v-else>
        <ion-searchbar
          v-model="searchQuery"
          :placeholder="$t('friends.searchPlaceholder')"
          :debounce="500"
          @ionInput="handleSearch"
          class="search-bar"
        />

        <ion-list v-if="searchResults.length" inset>
          <ion-list-header>{{ $t('friends.searchResults') }}</ion-list-header>
          <ion-item v-for="user in searchResults" :key="user.id">
            <ion-avatar slot="start">
              <img v-if="user.avatarUrl" :src="user.avatarUrl" :alt="user.displayName" />
              <div v-else class="avatar-placeholder">{{ user.displayName.charAt(0) }}</div>
            </ion-avatar>
            <ion-label>
              <h3>{{ user.displayName }}</h3>
            </ion-label>
            <ion-button slot="end" fill="outline" size="small" @click="handleSendRequest(user.id)">
              <ion-icon :icon="personAddOutline" slot="start" />
              {{ $t('friends.addFriend') }}
            </ion-button>
          </ion-item>
        </ion-list>

        <ion-list v-if="pendingRequests.length" inset>
          <ion-list-header>{{ $t('friends.pendingRequests') }}</ion-list-header>
          <ion-item v-for="request in pendingRequests" :key="request.id">
            <ion-avatar slot="start">
              <img v-if="request.fromAvatarUrl" :src="request.fromAvatarUrl" :alt="request.fromDisplayName" />
              <div v-else class="avatar-placeholder">{{ request.fromDisplayName.charAt(0) }}</div>
            </ion-avatar>
            <ion-label>
              <h3>{{ request.fromDisplayName }}</h3>
              <p>{{ formatDate(request.createdAt) }}</p>
            </ion-label>
            <ion-button slot="end" fill="solid" size="small" color="success" @click="handleAccept(request.id)">
              <ion-icon :icon="checkmarkOutline" />
            </ion-button>
            <ion-button slot="end" fill="outline" size="small" color="danger" @click="handleDecline(request.id)">
              <ion-icon :icon="closeOutline" />
            </ion-button>
          </ion-item>
        </ion-list>

        <ion-list v-if="friends.length" inset>
          <ion-list-header>{{ $t('friends.friendsList') }}</ion-list-header>
          <ion-item v-for="friend in friends" :key="friend.friendId">
            <ion-avatar slot="start">
              <img v-if="friend.avatarUrl" :src="friend.avatarUrl" :alt="friend.displayName" />
              <div v-else class="avatar-placeholder">{{ friend.displayName.charAt(0) }}</div>
            </ion-avatar>
            <ion-label>
              <h3>{{ friend.displayName }}</h3>
            </ion-label>
            <ion-button slot="end" fill="outline" size="small" color="primary" @click="openChallengeModal(friend)">
              <ion-icon :icon="flashOutline" slot="start" />
              {{ $t('friends.challenge') }}
            </ion-button>
            <ion-button slot="end" fill="clear" size="small" color="danger" @click="handleRemoveFriend(friend.friendId)">
              <ion-icon :icon="trashOutline" />
            </ion-button>
          </ion-item>
        </ion-list>

        <ion-text v-if="!friends.length && !pendingRequests.length && !searchResults.length" color="medium" class="empty-state">
          <ion-icon :icon="peopleOutline" size="large" />
          <p>{{ $t('friends.noFriends') }}</p>
        </ion-text>
      </template>

      <ion-modal :is-open="showChallengeModal" @didDismiss="showChallengeModal = false">
        <ion-header>
          <ion-toolbar color="dark">
            <ion-title>{{ $t('friends.selectTheme') }}</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="showChallengeModal = false">{{ $t('friends.cancel') }}</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="modal-content">
          <ion-list>
            <ion-item v-for="theme in coreThemes" :key="theme.id" button @click="handleSendChallenge(theme)">
              <ion-icon :icon="getThemeIcon(theme.icon)" slot="start" />
              <ion-label>{{ theme.label }}</ion-label>
            </ion-item>
          </ion-list>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonModal,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSearchbar,
  IonText,
  IonTitle,
  IonToolbar,
  toastController,
} from '@ionic/vue';
import { useI18n } from 'vue-i18n';
import {
  arrowBackOutline,
  checkmarkOutline,
  closeOutline,
  flashOutline,
  peopleOutline,
  personAddOutline,
  trashOutline,
} from 'ionicons/icons';
import { coreThemes } from '@/data/themes';
import { useUserStore } from '@/store/userStore';
import {
  searchUsers,
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  removeFriend,
  getFriends,
  getPendingRequests,
} from '@/services/friendService';
import { sendChallenge } from '@/services/challengeService';
import type { FriendRecord, FriendRequest, ThemeDefinition, UserProfile } from '@/types/game';

const { t } = useI18n();
const userStore = useUserStore();

const searchQuery = ref('');
const searchResults = ref<(UserProfile & { id: string })[]>([]);
const friends = ref<FriendRecord[]>([]);
const pendingRequests = ref<FriendRequest[]>([]);
const showChallengeModal = ref(false);
const challengeTarget = ref<FriendRecord | null>(null);

const isAuthenticated = computed(() => userStore.isAuthenticated);

function getThemeIcon(iconName: string): string {
  return iconName;
}

async function refreshData(): Promise<void> {
  if (!userStore.user?.id) {
    return;
  }

  const [friendsList, requests] = await Promise.all([
    getFriends(userStore.user.id),
    getPendingRequests(userStore.user.id),
  ]);

  friends.value = friendsList;
  pendingRequests.value = requests;
}

async function handleRefresh(event: CustomEvent): Promise<void> {
  await refreshData();
  (event.target as HTMLIonRefresherElement).complete();
}

async function handleSearch(): Promise<void> {
  if (!searchQuery.value.trim() || !userStore.user?.id) {
    searchResults.value = [];
    return;
  }

  searchResults.value = await searchUsers(searchQuery.value.trim(), userStore.user.id);
}

async function handleSendRequest(toUserId: string): Promise<void> {
  if (!userStore.user) {
    return;
  }

  await sendFriendRequest(
    userStore.user.id,
    userStore.user.displayName,
    userStore.user.avatarUrl,
    toUserId,
  );

  searchResults.value = searchResults.value.filter((u) => u.id !== toUserId);

  const toast = await toastController.create({
    message: t('friends.requestSent'),
    duration: 2000,
    color: 'success',
  });
  await toast.present();
}

async function handleAccept(requestId: string): Promise<void> {
  await acceptFriendRequest(requestId);
  await refreshData();

  const toast = await toastController.create({
    message: t('friends.requestAccepted'),
    duration: 2000,
    color: 'success',
  });
  await toast.present();
}

async function handleDecline(requestId: string): Promise<void> {
  await declineFriendRequest(requestId);
  pendingRequests.value = pendingRequests.value.filter((r) => r.id !== requestId);
}

async function handleRemoveFriend(friendId: string): Promise<void> {
  if (!userStore.user?.id) {
    return;
  }

  await removeFriend(userStore.user.id, friendId);
  friends.value = friends.value.filter((f) => f.friendId !== friendId);

  const toast = await toastController.create({
    message: t('friends.friendRemoved'),
    duration: 2000,
    color: 'medium',
  });
  await toast.present();
}

function openChallengeModal(friend: FriendRecord): void {
  challengeTarget.value = friend;
  showChallengeModal.value = true;
}

async function handleSendChallenge(theme: ThemeDefinition): Promise<void> {
  if (!userStore.user || !challengeTarget.value) {
    return;
  }

  await sendChallenge(
    userStore.user.id,
    userStore.user.displayName,
    userStore.user.avatarUrl,
    challengeTarget.value.friendId,
    challengeTarget.value.displayName,
    challengeTarget.value.avatarUrl,
    theme.id,
    theme.label,
  );

  showChallengeModal.value = false;
  challengeTarget.value = null;

  const toast = await toastController.create({
    message: t('friends.challengeSent'),
    duration: 2000,
    color: 'success',
  });
  await toast.present();
}

function formatDate(input: string): string {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return date.toLocaleString();
}

onMounted(() => {
  void refreshData();
});
</script>

<style scoped>
.friends-content {
  --padding-start: 16px;
  --padding-end: 16px;
  --padding-bottom: 40px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.search-bar {
  margin-top: 1rem;
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

.modal-content {
  --padding-start: 16px;
  --padding-end: 16px;
}
</style>
