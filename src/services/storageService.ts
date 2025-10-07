import type { GameRecord, HighScoreEntry } from '@/types/game';

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

  const themeRecords = nextRecords.filter((entry) => entry.themeId === record.themeId && entry.userId === record.userId);
  const globalThemeRecords = nextRecords.filter((entry) => entry.themeId === record.themeId);

  const personalBest = sortRecords(themeRecords)[0];
  const themeBest = sortRecords(globalThemeRecords)[0];

  return {
    isPersonalBest: personalBest?.sessionId === record.sessionId,
    isThemeBest: themeBest?.sessionId === record.sessionId,
  };
}

export function getUserRecords(userId: string): GameRecord[] {
  const state = readStorage();
  return sortRecords(state.records.filter((record) => record.userId === userId));
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
