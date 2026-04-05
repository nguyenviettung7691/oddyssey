import type { GameRecord, HighScoreEntry } from '@/types/game';
import { isFirebaseConfigured } from '@/services/firebaseService';
import { submitScore } from '@/services/leaderboardService';
import { saveGameRecordToIDB, getGameRecordsByUser as getIDBRecordsByUser } from '@/services/offlineDatabase';

const STORAGE_KEY = 'oddyssey:game-records';

interface StoragePayload {
  records: GameRecord[];
}

function readStorage(): StoragePayload {
  if (typeof window === 'undefined') {
    return { records: [] };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { records: [] };
    }
    const payload = JSON.parse(raw) as StoragePayload;
    return {
      records: payload.records ?? [],
    };
  } catch (error) {
    console.warn('[Oddyssey] Unable to parse stored game records', error);
    return { records: [] };
  }
}

function writeStorage(data: StoragePayload): void {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function sortRecords(records: GameRecord[]): GameRecord[] {
  return [...records].sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return new Date(b.finishedAt ?? '').getTime() - new Date(a.finishedAt ?? '').getTime();
  });
}

export function saveGameRecord(record: GameRecord): { isPersonalBest: boolean; isThemeBest: boolean } {
  const state = readStorage();
  const nextRecords = state.records.filter((entry) => entry.sessionId !== record.sessionId);
  nextRecords.push(record);

  writeStorage({ records: nextRecords });

  // Mirror to IndexedDB for larger/more reliable storage
  saveGameRecordToIDB(record).catch(() => {});

  const themeRecords = nextRecords.filter((entry) => entry.themeId === record.themeId && entry.userId === record.userId);
  const globalThemeRecords = nextRecords.filter((entry) => entry.themeId === record.themeId);

  const personalBest = sortRecords(themeRecords)[0];
  const themeBest = sortRecords(globalThemeRecords)[0];

  if (isFirebaseConfigured()) {
    submitScore(record).catch((error) => {
      console.warn('[Oddyssey] Background score submission failed', error);
    });
  }

  return {
    isPersonalBest: personalBest?.sessionId === record.sessionId,
    isThemeBest: themeBest?.sessionId === record.sessionId,
  };
}

export function getUserRecords(userId: string): GameRecord[] {
  const state = readStorage();
  return sortRecords(state.records.filter((record) => record.userId === userId));
}

/**
 * Async version that merges localStorage records with IndexedDB for completeness.
 * Falls back to localStorage-only if IndexedDB is unavailable.
 */
export async function getUserRecordsAsync(userId: string): Promise<GameRecord[]> {
  const localRecords = getUserRecords(userId);
  try {
    const idbRecords = await getIDBRecordsByUser(userId);
    // Merge: use a Map keyed by sessionId to deduplicate
    const merged = new Map<string, GameRecord>();
    for (const r of localRecords) merged.set(r.sessionId, r);
    for (const r of idbRecords) merged.set(r.sessionId, r);
    return sortRecords(Array.from(merged.values()));
  } catch {
    return localRecords;
  }
}

export function listHighScores(themeId: string | 'all', limit = 10): HighScoreEntry[] {
  const state = readStorage();
  const candidates = themeId === 'all'
    ? state.records
    : state.records.filter((record) => record.themeId === themeId);

  const ranked = sortRecords(candidates).slice(0, limit);

  return ranked.map((record) => ({
    id: `${record.sessionId}-${record.userId}`,
    sessionId: record.sessionId,
    userId: record.userId,
    userDisplayName: record.userDisplayName,
    score: record.score,
    themeId: themeId === 'all' ? 'all' : record.themeId,
    finishedAt: record.finishedAt ?? record.startedAt,
  }));
}

export function clearAllRecords(): void {
  writeStorage({ records: [] });
}
