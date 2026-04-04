import * as admin from "firebase-admin";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { onSchedule } from "firebase-functions/v2/scheduler";

admin.initializeApp();
const db = admin.firestore();

interface GameRecordData {
  userId: string;
  userDisplayName: string;
  avatarUrl?: string | null;
  score: number;
  themeId: string;
  themeLabel: string;
  totalQuestions: number;
  finishedAt: string;
  sessionId: string;
}

interface LeaderboardEntry {
  userId: string;
  userDisplayName: string;
  avatarUrl?: string | null;
  bestScore: number;
  bestFinishedAt: string;
  gamesPlayed: number;
}

/**
 * Triggered when a new game record is created.
 * Validates the score and updates leaderboard entries.
 */
export const onGameRecordCreated = onDocumentCreated(
  "gameRecords/{recordId}",
  async (event) => {
    const data = event.data?.data() as GameRecordData | undefined;
    if (!data) {
      return;
    }

    // Anti-cheat validation
    if (data.score < 0) {
      console.warn(`[Anti-cheat] Negative score rejected: ${data.score}`);
      await event.data?.ref.delete();
      return;
    }

    if (data.totalQuestions > 0 && data.score > data.totalQuestions * 2) {
      console.warn(
        `[Anti-cheat] Implausible score rejected: ${data.score} for ${data.totalQuestions} questions`
      );
      await event.data?.ref.delete();
      return;
    }

    const themes = [data.themeId, "all"];

    for (const themeId of themes) {
      const entryRef = db
        .collection("leaderboards")
        .doc(themeId)
        .collection("entries")
        .doc(data.userId);

      const entrySnap = await entryRef.get();

      if (entrySnap.exists) {
        const existing = entrySnap.data() as LeaderboardEntry;
        if (data.score > existing.bestScore) {
          await entryRef.set({
            userId: data.userId,
            userDisplayName: data.userDisplayName,
            avatarUrl: data.avatarUrl ?? null,
            bestScore: data.score,
            bestFinishedAt: data.finishedAt,
            gamesPlayed: (existing.gamesPlayed ?? 0) + 1,
          });
        } else {
          await entryRef.update({
            gamesPlayed: (existing.gamesPlayed ?? 0) + 1,
          });
        }
      } else {
        await entryRef.set({
          userId: data.userId,
          userDisplayName: data.userDisplayName,
          avatarUrl: data.avatarUrl ?? null,
          bestScore: data.score,
          bestFinishedAt: data.finishedAt,
          gamesPlayed: 1,
        });
      }
    }
  }
);

/**
 * Callable function to get leaderboard entries.
 */
export const getLeaderboard = onCall(async (request) => {
  const { themeId = "all", limit = 20, offset = 0 } = request.data ?? {};

  if (typeof themeId !== "string" || typeof limit !== "number" || typeof offset !== "number") {
    throw new HttpsError("invalid-argument", "Invalid parameters.");
  }

  const safeLimit = Math.min(Math.max(limit, 1), 100);

  const entriesRef = db
    .collection("leaderboards")
    .doc(themeId)
    .collection("entries");

  const snapshot = await entriesRef
    .orderBy("bestScore", "desc")
    .offset(offset)
    .limit(safeLimit)
    .get();

  return {
    entries: snapshot.docs.map((doc) => ({
      userId: doc.id,
      ...doc.data(),
    })),
    hasMore: snapshot.size === safeLimit,
  };
});

/**
 * Callable function to search users by display name.
 */
export const searchUsers = onCall(async (request) => {
  const { query: searchQuery } = request.data ?? {};

  if (!searchQuery || typeof searchQuery !== "string") {
    throw new HttpsError("invalid-argument", "Search query is required.");
  }

  const trimmed = searchQuery.trim();
  if (trimmed.length < 2) {
    return { users: [] };
  }

  const snapshot = await db
    .collection("users")
    .where("displayName", ">=", trimmed)
    .where("displayName", "<=", trimmed + "\uf8ff")
    .limit(20)
    .get();

  return {
    users: snapshot.docs.map((doc) => ({
      id: doc.id,
      displayName: doc.data().displayName,
      avatarUrl: doc.data().avatarUrl ?? null,
    })),
  };
});

/**
 * Scheduled function to expire stale challenges.
 * Runs every hour.
 */
export const expireStaleChallenges = onSchedule("every 1 hours", async () => {
  const now = new Date().toISOString();
  const challengesRef = db.collection("challenges");

  const pendingExpired = await challengesRef
    .where("status", "in", ["pending", "accepted"])
    .where("expiresAt", "<=", now)
    .get();

  const batch = db.batch();
  pendingExpired.docs.forEach((doc) => {
    batch.update(doc.ref, { status: "expired" });
  });

  if (!pendingExpired.empty) {
    await batch.commit();
    console.log(`Expired ${pendingExpired.size} stale challenges.`);
  }
});

// --- Weekly Events Cloud Functions ---

const WEEKLY_THEMES = [
  { id: "football", label: "World Football" },
  { id: "anime", label: "Anime Universe" },
  { id: "science", label: "Science & Discovery" },
  { id: "space-explorers", label: "Space Explorers" },
  { id: "street-foods", label: "Street Foods" },
  { id: "world-history", label: "World History" },
  { id: "pop-music", label: "Pop Music" },
];

/**
 * Scheduled function to create weekly events.
 * Runs every Monday at 00:00 UTC.
 */
export const createWeeklyEvent = onSchedule("every monday 00:00", async () => {
  const now = new Date();
  const weekNumber = getWeekNumber(now);
  const themeIndex = weekNumber % WEEKLY_THEMES.length;
  const theme = WEEKLY_THEMES[themeIndex];

  const startTime = now.toISOString();
  const endTime = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

  const eventRef = db.collection("events").doc();
  await eventRef.set({
    title: `Week ${weekNumber}: ${theme.label} Challenge`,
    description: `Compete in ${theme.label} this week! Play as many times as you like — only your best score counts.`,
    themeId: theme.id,
    themeLabel: theme.label,
    eventType: "weekly",
    startTime,
    endTime,
    status: "active",
    rules: {},
    participantCount: 0,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  console.log(`Created weekly event: Week ${weekNumber} - ${theme.label}`);
});

/**
 * Triggered when a new game record is created under an event.
 * Updates event standings.
 */
export const onEventGameRecordCreated = onDocumentCreated(
  "events/{eventId}/gameRecords/{recordId}",
  async (event) => {
    const data = event.data?.data();
    if (!data) {
      return;
    }

    const eventId = event.params.eventId;

    // Anti-cheat validation
    if (typeof data.score !== "number" || data.score < 0) {
      await event.data?.ref.delete();
      return;
    }

    const standingRef = db
      .collection("events")
      .doc(eventId)
      .collection("standings")
      .doc(data.userId);

    const standingSnap = await standingRef.get();

    if (standingSnap.exists) {
      const existing = standingSnap.data()!;
      const updates: Record<string, unknown> = {
        gamesPlayed: (existing.gamesPlayed ?? 0) + 1,
        totalScore: (existing.totalScore ?? 0) + data.score,
        lastPlayedAt: data.finishedAt,
      };

      if (data.score > (existing.bestScore ?? 0)) {
        updates.bestScore = data.score;
      }
      if (data.longestStreak && data.longestStreak > (existing.bestStreak ?? 0)) {
        updates.bestStreak = data.longestStreak;
      }

      await standingRef.update(updates);
    } else {
      await standingRef.set({
        userId: data.userId,
        displayName: data.userDisplayName,
        avatarUrl: data.avatarUrl ?? null,
        bestScore: data.score,
        totalScore: data.score,
        gamesPlayed: 1,
        bestStreak: data.longestStreak ?? 0,
        lastPlayedAt: data.finishedAt,
        joinedAt: new Date().toISOString(),
      });

      // Increment participant count
      const eventRef = db.collection("events").doc(eventId);
      await eventRef.update({
        participantCount: admin.firestore.FieldValue.increment(1),
      });
    }
  }
);

/**
 * Scheduled function to archive completed events.
 * Runs daily.
 */
export const archiveCompletedEvents = onSchedule("every day 01:00", async () => {
  const now = new Date().toISOString();
  const eventsRef = db.collection("events");

  const activeExpired = await eventsRef
    .where("status", "==", "active")
    .where("endTime", "<=", now)
    .get();

  const batch = db.batch();
  activeExpired.docs.forEach((doc) => {
    batch.update(doc.ref, { status: "completed" });
  });

  if (!activeExpired.empty) {
    await batch.commit();
    console.log(`Archived ${activeExpired.size} completed events.`);
  }
});

/**
 * Scheduled function to clean up stale matches.
 * Runs every 30 minutes.
 */
export const cleanupStaleMatches = onSchedule("every 30 minutes", async () => {
  const cutoff = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(); // 2 hours ago
  const matchesRef = db.collection("matches");

  const staleMatches = await matchesRef
    .where("status", "in", ["waiting", "ready", "playing"])
    .where("createdAt", "<=", cutoff)
    .get();

  const batch = db.batch();
  staleMatches.docs.forEach((doc) => {
    batch.update(doc.ref, { status: "abandoned" });
  });

  if (!staleMatches.empty) {
    await batch.commit();
    console.log(`Abandoned ${staleMatches.size} stale matches.`);
  }
});

/**
 * Triggered when a matchmaking entry is created.
 * Tries to find a compatible opponent.
 */
export const onMatchmakingEntryCreated = onDocumentCreated(
  "matchmaking/{entryId}",
  async (event) => {
    const data = event.data?.data();
    if (!data || data.status !== "searching") {
      return;
    }

    const entryId = event.params.entryId;
    const matchmakingRef = db.collection("matchmaking");

    // Find another searching entry with same theme and mode
    const candidates = await matchmakingRef
      .where("themeId", "==", data.themeId)
      .where("mode", "==", data.mode)
      .where("status", "==", "searching")
      .limit(10)
      .get();

    let opponent: FirebaseFirestore.DocumentSnapshot | null = null;
    for (const doc of candidates.docs) {
      if (doc.id !== entryId && doc.data().userId !== data.userId) {
        opponent = doc;
        break;
      }
    }

    if (!opponent) {
      return;
    }

    const opponentData = opponent.data()!;
    const themeLabel = WEEKLY_THEMES.find((t) => t.id === data.themeId)?.label ?? data.themeId;

    // Create a match
    const matchRef = db.collection("matches").doc();
    await matchRef.set({
      player1Id: data.userId,
      player1DisplayName: data.displayName,
      player1AvatarUrl: data.avatarUrl ?? null,
      player2Id: opponentData.userId,
      player2DisplayName: opponentData.displayName,
      player2AvatarUrl: opponentData.avatarUrl ?? null,
      mode: data.mode,
      status: "waiting",
      themeId: data.themeId,
      themeLabel: themeLabel,
      player1Score: null,
      player2Score: null,
      player1Ready: false,
      player2Ready: false,
      teamScore: null,
      winnerId: null,
      startedAt: null,
      createdAt: new Date().toISOString(),
    });

    // Update both matchmaking entries
    const batch = db.batch();
    batch.update(event.data!.ref, { status: "matched", matchId: matchRef.id });
    batch.update(opponent.ref, { status: "matched", matchId: matchRef.id });
    await batch.commit();

    console.log(`Matched players: ${data.userId} vs ${opponentData.userId} (${data.mode})`);
  }
);

/**
 * Helper to get ISO week number.
 */
function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}
