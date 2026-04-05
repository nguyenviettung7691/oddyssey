import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { GameRecord } from '@/types/game';

interface OddysseyDB extends DBSchema {
  questions: {
    key: string;
    value: {
      id: string;
      themeId: string;
      locale: string;
      data: unknown;
      cachedAt: number;
    };
    indexes: { 'by-theme-locale': [string, string] };
  };
  gameRecords: {
    key: string;
    value: GameRecord;
    indexes: { 'by-userId': string };
  };
  userPreferences: {
    key: string;
    value: {
      key: string;
      value: unknown;
    };
  };
}

const DB_NAME = 'oddyssey-offline';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<OddysseyDB>> | null = null;

function getDB(): Promise<IDBPDatabase<OddysseyDB>> {
  if (!dbPromise) {
    dbPromise = openDB<OddysseyDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('questions')) {
          const questionStore = db.createObjectStore('questions', { keyPath: 'id' });
          questionStore.createIndex('by-theme-locale', ['themeId', 'locale']);
        }
        if (!db.objectStoreNames.contains('gameRecords')) {
          const recordStore = db.createObjectStore('gameRecords', { keyPath: 'sessionId' });
          recordStore.createIndex('by-userId', 'userId');
        }
        if (!db.objectStoreNames.contains('userPreferences')) {
          db.createObjectStore('userPreferences', { keyPath: 'key' });
        }
      },
    });
  }
  return dbPromise;
}

// --- Questions cache ---

export interface CachedQuestion {
  id: string;
  themeId: string;
  locale: string;
  data: unknown;
  cachedAt: number;
}

export async function getCachedQuestions(themeId: string, locale: string): Promise<CachedQuestion[]> {
  try {
    const db = await getDB();
    return await db.getAllFromIndex('questions', 'by-theme-locale', [themeId, locale]);
  } catch {
    return [];
  }
}

export async function cacheQuestion(question: CachedQuestion): Promise<void> {
  try {
    const db = await getDB();
    await db.put('questions', question);
  } catch {
    // Silently fail — caching is best-effort
  }
}

export async function clearQuestionCache(): Promise<void> {
  try {
    const db = await getDB();
    await db.clear('questions');
  } catch {
    // Silently fail
  }
}

// --- Game records ---

export async function saveGameRecordToIDB(record: GameRecord): Promise<void> {
  try {
    const db = await getDB();
    await db.put('gameRecords', record);
  } catch {
    // Silently fail — localStorage is the synchronous fallback
  }
}

export async function getGameRecordsByUser(userId: string): Promise<GameRecord[]> {
  try {
    const db = await getDB();
    return await db.getAllFromIndex('gameRecords', 'by-userId', userId);
  } catch {
    return [];
  }
}

export async function getAllGameRecords(): Promise<GameRecord[]> {
  try {
    const db = await getDB();
    return await db.getAll('gameRecords');
  } catch {
    return [];
  }
}

export async function clearGameRecordsFromIDB(): Promise<void> {
  try {
    const db = await getDB();
    await db.clear('gameRecords');
  } catch {
    // Silently fail
  }
}

// --- User preferences ---

export async function getPreference<T>(key: string): Promise<T | undefined> {
  try {
    const db = await getDB();
    const entry = await db.get('userPreferences', key);
    return entry?.value as T | undefined;
  } catch {
    return undefined;
  }
}

export async function setPreference<T>(key: string, value: T): Promise<void> {
  try {
    const db = await getDB();
    await db.put('userPreferences', { key, value });
  } catch {
    // Silently fail
  }
}
