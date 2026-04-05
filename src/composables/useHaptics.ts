import { ref } from 'vue';

const STORAGE_KEY = 'oddyssey:haptics-enabled';

const hapticsEnabled = ref(true);

function readPreference(): boolean {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'false') return false;
    return true;
  } catch {
    return true;
  }
}

hapticsEnabled.value = readPreference();

async function getHapticsPlugin() {
  try {
    const { Haptics } = await import('@capacitor/haptics');
    return Haptics;
  } catch {
    return null;
  }
}

async function safeImpact(style: 'Heavy' | 'Medium' | 'Light'): Promise<void> {
  if (!hapticsEnabled.value) return;
  try {
    const haptics = await getHapticsPlugin();
    if (!haptics) return;
    const { ImpactStyle } = await import('@capacitor/haptics');
    await haptics.impact({ style: ImpactStyle[style] });
  } catch {
    // Not supported on this platform
  }
}

async function safeNotification(type: 'Success' | 'Warning' | 'Error'): Promise<void> {
  if (!hapticsEnabled.value) return;
  try {
    const haptics = await getHapticsPlugin();
    if (!haptics) return;
    const { NotificationType } = await import('@capacitor/haptics');
    await haptics.notification({ type: NotificationType[type] });
  } catch {
    // Not supported on this platform
  }
}

export function useHaptics() {
  function setHapticsEnabled(value: boolean): void {
    hapticsEnabled.value = value;
    try {
      localStorage.setItem(STORAGE_KEY, String(value));
    } catch {
      // storage unavailable
    }
  }

  async function lightTap(): Promise<void> {
    await safeImpact('Light');
  }

  async function mediumTap(): Promise<void> {
    await safeImpact('Medium');
  }

  async function heavyTap(): Promise<void> {
    await safeImpact('Heavy');
  }

  async function success(): Promise<void> {
    await safeNotification('Success');
  }

  async function warning(): Promise<void> {
    await safeNotification('Warning');
  }

  async function error(): Promise<void> {
    await safeNotification('Error');
  }

  async function selectionChanged(): Promise<void> {
    if (!hapticsEnabled.value) return;
    try {
      const haptics = await getHapticsPlugin();
      if (!haptics) return;
      await haptics.selectionChanged();
    } catch {
      // Not supported on this platform
    }
  }

  return {
    hapticsEnabled,
    setHapticsEnabled,
    lightTap,
    mediumTap,
    heavyTap,
    success,
    warning,
    error,
    selectionChanged,
  };
}
