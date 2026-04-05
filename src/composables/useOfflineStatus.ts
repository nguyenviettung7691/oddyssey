import { ref, onMounted, onUnmounted } from 'vue';

/**
 * Reactive composable that tracks the browser's online/offline status.
 * Listens to window `online` and `offline` events.
 */
export function useOfflineStatus() {
  const isOffline = ref(typeof navigator !== 'undefined' ? !navigator.onLine : false);

  function handleOnline() {
    isOffline.value = false;
  }

  function handleOffline() {
    isOffline.value = true;
  }

  onMounted(() => {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
  });

  onUnmounted(() => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  });

  return { isOffline };
}
