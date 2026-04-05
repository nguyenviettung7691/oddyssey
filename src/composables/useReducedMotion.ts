import { ref, onMounted, onUnmounted } from 'vue';

const STORAGE_KEY = 'oddyssey:reduced-motion';

const prefersReducedMotion = ref(false);
let initialized = false;

function readOsPreference(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function readUserPreference(): boolean | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'true') return true;
    if (stored === 'false') return false;
    return null;
  } catch {
    return null;
  }
}

function applyClass(active: boolean): void {
  if (typeof document === 'undefined') return;
  if (active) {
    document.documentElement.classList.add('reduced-motion');
  } else {
    document.documentElement.classList.remove('reduced-motion');
  }
}

function sync(): void {
  const userPref = readUserPreference();
  const value = userPref !== null ? userPref : readOsPreference();
  prefersReducedMotion.value = value;
  applyClass(value);
}

export function useReducedMotion() {
  let mediaQuery: MediaQueryList | null = null;
  const handler = () => {
    if (readUserPreference() === null) {
      sync();
    }
  };

  onMounted(() => {
    if (!initialized) {
      sync();
      initialized = true;
    }
    if (typeof window !== 'undefined') {
      mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      mediaQuery.addEventListener('change', handler);
    }
  });

  onUnmounted(() => {
    if (mediaQuery) {
      mediaQuery.removeEventListener('change', handler);
    }
  });

  function setReducedMotion(value: boolean): void {
    try {
      localStorage.setItem(STORAGE_KEY, String(value));
    } catch {
      // storage unavailable
    }
    prefersReducedMotion.value = value;
    applyClass(value);
  }

  return {
    prefersReducedMotion,
    setReducedMotion,
  };
}
