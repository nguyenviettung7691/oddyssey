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
