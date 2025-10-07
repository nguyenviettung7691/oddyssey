import { defineStore } from 'pinia';
import { randomUUID } from '@/utils/id';
import type { AuthUser } from '@/services/authService';
import { isGoogleConfigured, signInWithGoogle, signOutFromGoogle } from '@/services/authService';

const STORAGE_KEY = 'oddyssey:user-profile';

interface PersistedUser extends AuthUser {
  provider: 'google' | 'guest';
}

type AuthStatus = 'signed-out' | 'loading' | 'signed-in' | 'error';

function loadPersistedUser(): PersistedUser | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const payload = window.localStorage.getItem(STORAGE_KEY);
    if (!payload) {
      return null;
    }
    return JSON.parse(payload) as PersistedUser;
  } catch (error) {
    console.warn('[Oddyssey] Failed to parse persisted user', error);
    return null;
  }
}

function persistUser(user: PersistedUser | null): void {
  if (typeof window === 'undefined') {
    return;
  }

  if (!user) {
    window.localStorage.removeItem(STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export const useUserStore = defineStore('user', {
  state: () => ({
    status: 'signed-out' as AuthStatus,
    user: null as PersistedUser | null,
    error: null as string | null,
  }),
  getters: {
    isAuthenticated(state): boolean {
      return state.status === 'signed-in' && !!state.user;
    },
    displayName(state): string {
      return state.user?.displayName ?? 'Guest';
    },
    avatarUrl(state): string | undefined {
      return state.user?.avatarUrl;
    },
    provider(state): PersistedUser['provider'] | 'unknown' {
      return state.user?.provider ?? 'unknown';
    },
  },
  actions: {
    hydrateFromStorage(): void {
      const stored = loadPersistedUser();
      if (stored) {
        this.user = stored;
        this.status = 'signed-in';
      }
    },
    async signInWithGoogle(): Promise<void> {
      if (!isGoogleConfigured()) {
        this.error = 'Google Sign-In is not configured. Set VITE_GOOGLE_CLIENT_ID to enable.';
        this.status = 'error';
        return;
      }

      this.status = 'loading';
      this.error = null;
      try {
        const user = await signInWithGoogle();
        const enriched: PersistedUser = { ...user, provider: 'google' };
        this.user = enriched;
        this.status = 'signed-in';
        persistUser(enriched);
      } catch (error) {
        this.status = 'error';
        this.error = error instanceof Error ? error.message : 'Unable to sign in with Google.';
        throw error;
      }
    },
    async signOut(): Promise<void> {
      await signOutFromGoogle();
      this.user = null;
      this.status = 'signed-out';
      this.error = null;
      persistUser(null);
    },
    setGuest(displayName: string): void {
      const guest: PersistedUser = {
        id: `guest-${randomUUID()}`,
        email: 'guest@oddyssey.app',
        displayName,
        provider: 'guest',
      };
      this.user = guest;
      this.status = 'signed-in';
      this.error = null;
      persistUser(guest);
    },
  },
});
