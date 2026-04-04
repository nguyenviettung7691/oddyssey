import { createApp } from 'vue';
import { IonicVue } from '@ionic/vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import i18n from './i18n';
import { useUserStore } from '@/store/userStore';
import { useNotificationStore } from '@/store/notificationStore';
import { initializeFirebase, isFirebaseConfigured } from '@/services/firebaseService';
import { ensureUserProfile } from '@/services/friendService';
import { syncLocalRecords } from '@/services/leaderboardService';
import { getUserRecords } from '@/services/storageService';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Always-on dark mode */
import '@ionic/vue/css/palettes/dark.always.css';

/* Theme variables */
import './theme/variables.css';

initializeFirebase();

const pinia = createPinia();

const app = createApp(App)
  .use(IonicVue)
  .use(pinia)
  .use(i18n)
  .use(router);

const userStore = useUserStore(pinia);
const notificationStore = useNotificationStore(pinia);
userStore.hydrateFromStorage();

if (isFirebaseConfigured() && userStore.isAuthenticated && userStore.user) {
  notificationStore.startListening(userStore.user.id);
  ensureUserProfile(
    userStore.user.id,
    userStore.user.displayName,
    userStore.user.email,
    userStore.user.avatarUrl,
  ).catch(() => {});
  const localRecords = getUserRecords(userStore.user.id);
  syncLocalRecords(userStore.user.id, localRecords).catch(() => {});
}

userStore.$onAction(({ name, after }) => {
  if (name === 'signInWithGoogle') {
    after(() => {
      if (userStore.user && isFirebaseConfigured()) {
        notificationStore.startListening(userStore.user.id);
        ensureUserProfile(
          userStore.user.id,
          userStore.user.displayName,
          userStore.user.email,
          userStore.user.avatarUrl,
        ).catch(() => {});
        const records = getUserRecords(userStore.user.id);
        syncLocalRecords(userStore.user.id, records).catch(() => {});
      }
    });
  }
  if (name === 'signOut') {
    after(() => {
      notificationStore.stopListening();
    });
  }
});

router.isReady().then(() => {
  app.mount('#app');
});
