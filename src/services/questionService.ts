import { coreThemes } from '@/data/themes';
import { getFallbackQuestion } from '@/data/questionBank';
import { getFallbackQuestion as getFallbackQuestionVi } from '@/data/questionBank.vi';
import { getFallbackQuestion as getFallbackQuestionJa } from '@/data/questionBank.ja';
import type { DifficultyLevel, GameQuestion } from '@/types/game';
import { GenkitQuestionService } from './genkitService';
import { getCachedQuestions, cacheQuestion } from './offlineDatabase';

const genkit = new GenkitQuestionService();

type GetFallbackFn = typeof getFallbackQuestion;

const fallbackByLocale: Record<string, GetFallbackFn> = {
  en: getFallbackQuestion,
  vi: getFallbackQuestionVi,
  ja: getFallbackQuestionJa,
};

function getLocalizedFallback(locale: string): GetFallbackFn {
  return fallbackByLocale[locale] ?? getFallbackQuestion;
}

function applyUniquenessTracking(
  question: GameQuestion,
  seenQuestionIds: Set<string>,
  seenOptionTexts: Set<string>,
): void {
  seenQuestionIds.add(question.id);
  question.options.forEach((option) => {
    seenOptionTexts.add(option.text.trim().toLowerCase());
  });
}

function sanitizeQuestion(question: GameQuestion): GameQuestion {
  const uniqueOptionTexts = new Set<string>();
  const sanitizedOptions = question.options.filter((option) => {
    const normalized = option.text.trim().toLowerCase();
    if (uniqueOptionTexts.has(normalized)) {
      return false;
    }
    uniqueOptionTexts.add(normalized);
    return true;
  });

  const oddOption = sanitizedOptions.find((option) => option.isOddOneOut);
  if (!oddOption) {
    throw new Error('Question missing odd one out option.');
  }

  return {
    ...question,
    options: sanitizedOptions,
    oddOptionId: oddOption.id,
  };
}

export async function fetchQuestion(
  themeId: string,
  difficulty: DifficultyLevel,
  seenQuestionIds: Set<string>,
  seenOptionTexts: Set<string>,
  locale = 'en',
): Promise<GameQuestion> {
  const theme = coreThemes.find((item) => item.id === themeId);

  const args = {
    themeId,
    themeLabel: theme?.label ?? themeId,
    difficulty,
    excludedQuestionSeeds: Array.from(seenQuestionIds),
    excludedOptionTexts: Array.from(seenOptionTexts),
    locale,
  };

  try {
    const aiQuestion = await genkit.generateQuestion(args);
    if (aiQuestion) {
      const sanitized = sanitizeQuestion(aiQuestion);
      applyUniquenessTracking(sanitized, seenQuestionIds, seenOptionTexts);

      // Cache the AI-generated question for offline use
      cacheQuestion({
        id: sanitized.id,
        themeId,
        locale,
        data: sanitized,
        cachedAt: Date.now(),
      }).catch(() => {});

      return sanitized;
    }
  } catch (error) {
    console.warn('[Oddyssey] Genkit generation failed, trying offline cache.', error);

    // Try IndexedDB cache before falling back to curated bank
    try {
      const cached = await getCachedQuestions(themeId, locale);
      const unseen = cached.filter((c) => !seenQuestionIds.has(c.id));
      if (unseen.length > 0) {
        const pick = unseen[Math.floor(Math.random() * unseen.length)];
        const cachedQuestion = pick.data as GameQuestion;
        const sanitized = sanitizeQuestion(cachedQuestion);
        applyUniquenessTracking(sanitized, seenQuestionIds, seenOptionTexts);
        return sanitized;
      }
    } catch {
      // IndexedDB unavailable — continue to curated fallback
    }
  }

  const localizedFallback = getLocalizedFallback(locale);
  const fallback = localizedFallback(themeId, difficulty, seenQuestionIds);
  if (!fallback) {
    throw new Error('Exhausted questions for the selected theme.');
  }

  const sanitizedFallback = sanitizeQuestion(fallback);
  applyUniquenessTracking(sanitizedFallback, seenQuestionIds, seenOptionTexts);
  return sanitizedFallback;
}
