import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  signInWithCredential,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  type Auth,
  type User,
} from 'firebase/auth';
import {
  getFirestore,
  enableMultiTabIndexedDbPersistence,
  type Firestore,
} from 'firebase/firestore';
import { getFunctions, type Functions } from 'firebase/functions';

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let functions: Functions | null = null;

function getFirebaseConfig(): Record<string, string> | null {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;

  if (!apiKey || !authDomain || !projectId) {
    return null;
  }

  return {
    apiKey,
    authDomain,
    projectId,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID ?? '',
  };
}

export function isFirebaseConfigured(): boolean {
  return getFirebaseConfig() !== null;
}

export function initializeFirebase(): FirebaseApp | null {
  if (app) {
    return app;
  }

  const config = getFirebaseConfig();
  if (!config) {
    return null;
  }

  if (getApps().length > 0) {
    app = getApps()[0];
  } else {
    app = initializeApp(config);
  }

  auth = getAuth(app);
  db = getFirestore(app);
  functions = getFunctions(app);

  enableMultiTabIndexedDbPersistence(db).catch((err) => {
    console.warn('[Oddyssey] Firestore persistence unavailable:', err.code);
  });

  return app;
}

export function getFirebaseAuth(): Auth | null {
  if (!auth) {
    initializeFirebase();
  }
  return auth;
}

export function getFirebaseDb(): Firestore | null {
  if (!db) {
    initializeFirebase();
  }
  return db;
}

export function getFirebaseFunctions(): Functions | null {
  if (!functions) {
    initializeFirebase();
  }
  return functions;
}

export async function signInWithGoogleCredential(idToken: string): Promise<User | null> {
  const firebaseAuth = getFirebaseAuth();
  if (!firebaseAuth) {
    return null;
  }

  const credential = GoogleAuthProvider.credential(idToken);
  const result = await signInWithCredential(firebaseAuth, credential);
  return result.user;
}

export async function firebaseSignOutUser(): Promise<void> {
  const firebaseAuth = getFirebaseAuth();
  if (firebaseAuth) {
    await firebaseSignOut(firebaseAuth);
  }
}

export function onFirebaseAuthStateChanged(callback: (user: User | null) => void): (() => void) | null {
  const firebaseAuth = getFirebaseAuth();
  if (!firebaseAuth) {
    return null;
  }
  return onAuthStateChanged(firebaseAuth, callback);
}

export function getCurrentFirebaseUser(): User | null {
  const firebaseAuth = getFirebaseAuth();
  return firebaseAuth?.currentUser ?? null;
}
