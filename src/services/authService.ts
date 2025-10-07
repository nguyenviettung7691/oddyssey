import { jwtDecode } from 'jwt-decode';
import type { JwtPayload } from 'jwt-decode';

const GOOGLE_SCRIPT_ID = 'google-identity-service';
const GOOGLE_SCRIPT_SRC = 'https://accounts.google.com/gsi/client';

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
}

interface GoogleCredential extends JwtPayload {
  email?: string;
  name?: string;
  picture?: string;
  sub: string;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: Record<string, unknown>) => void;
          prompt: (callback?: (notification: { isNotDisplayed: () => boolean; getNotDisplayedReason?: () => string | undefined; isSkippedMoment: () => boolean; getSkippedReason?: () => string | undefined; }) => void) => void;
          cancel: () => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}

let scriptLoadPromise: Promise<void> | null = null;

function ensureClientId(): string {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new Error('Missing VITE_GOOGLE_CLIENT_ID environment variable.');
  }
  return clientId;
}

async function loadGoogleScript(): Promise<void> {
  if (typeof window === 'undefined') {
    throw new Error('Google sign-in is only available in the browser context.');
  }

  if (window.google?.accounts?.id) {
    return;
  }

  if (!scriptLoadPromise) {
    scriptLoadPromise = new Promise((resolve, reject) => {
      const existing = document.getElementById(GOOGLE_SCRIPT_ID);
      if (existing) {
        existing.addEventListener('load', () => resolve(), { once: true });
        existing.addEventListener('error', () => reject(new Error('Failed to load Google Identity Services script.')), { once: true });
        return;
      }

      const script = document.createElement('script');
      script.id = GOOGLE_SCRIPT_ID;
      script.src = GOOGLE_SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google Identity Services script.'));
      document.head.appendChild(script);
    });
  }

  await scriptLoadPromise;
}

export async function signInWithGoogle(): Promise<AuthUser> {
  await loadGoogleScript();

  const clientId = ensureClientId();

  return new Promise<AuthUser>((resolve, reject) => {
    if (!window.google?.accounts?.id) {
      reject(new Error('Google Identity Services SDK failed to initialize.'));
      return;
    }

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (response: { credential?: string }) => {
        if (!response.credential) {
          reject(new Error('No Google credential returned.'));
          return;
        }

        const payload = jwtDecode<GoogleCredential>(response.credential);
        resolve({
          id: payload.sub,
          email: payload.email ?? 'unknown@oddyssey.app',
          displayName: payload.name ?? 'Oddyssey Player',
          avatarUrl: payload.picture,
        });
      },
      auto_select: false,
      prompt_parent_id: 'oddyssey-google-signin',
      ux_mode: 'popup',
    });

    let promptHandled = false;

    window.google.accounts.id.prompt((notification) => {
      if (promptHandled) {
        return;
      }
      if (notification.isNotDisplayed?.()) {
        promptHandled = true;
        const reason = notification.getNotDisplayedReason?.() ?? 'Prompt was not displayed.';
        reject(new Error(`Google Sign-In prompt unavailable: ${reason}`));
      } else if (notification.isSkippedMoment?.()) {
        promptHandled = true;
        const reason = notification.getSkippedReason?.() ?? 'Prompt was skipped.';
        reject(new Error(`Google Sign-In was skipped: ${reason}`));
      }
    });
  });
}

export async function signOutFromGoogle(): Promise<void> {
  if (!window.google?.accounts?.id) {
    return;
  }
  window.google.accounts.id.disableAutoSelect();
  window.google.accounts.id.cancel();
}

export function isGoogleConfigured(): boolean {
  return Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);
}
