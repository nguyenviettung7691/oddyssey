/**
 * Returns the combo multiplier for a given streak count.
 *
 * Tiers:
 *   Streak 0–2  → ×1
 *   Streak 3–4  → ×2
 *   Streak 5–6  → ×3
 *   Streak 7–9  → ×4
 *   Streak 10+  → ×5
 */
export function comboMultiplierFromStreak(streak: number): number {
  if (streak >= 10) return 5;
  if (streak >= 7) return 4;
  if (streak >= 5) return 3;
  if (streak >= 3) return 2;
  return 1;
}
