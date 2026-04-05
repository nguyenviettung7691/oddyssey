import { ref } from 'vue';

const politeMessage = ref('');
const assertiveMessage = ref('');

export function useAnnouncer() {
  function announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    const target = priority === 'assertive' ? assertiveMessage : politeMessage;
    // Clear first to ensure re-announcement of identical messages
    target.value = '';
    requestAnimationFrame(() => {
      target.value = message;
    });
  }

  return {
    politeMessage,
    assertiveMessage,
    announce,
  };
}
