import { coreThemes } from '@/data/themes';
import { getFallbackQuestion } from '@/data/questionBank';
import type { DifficultyLevel, GameQuestion } from '@/types/game';
import { GenkitQuestionService } from './genkitService';

const genkit = new GenkitQuestionService();

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
): Promise<GameQuestion> {
  const theme = coreThemes.find((item) => item.id === themeId);

  const args = {
    themeId,
    themeLabel: theme?.label ?? themeId,
    difficulty,
    excludedQuestionSeeds: Array.from(seenQuestionIds),
    excludedOptionTexts: Array.from(seenOptionTexts),
  };

  try {
    const aiQuestion = await genkit.generateQuestion(args);
    if (aiQuestion) {
      const sanitized = sanitizeQuestion(aiQuestion);
      applyUniquenessTracking(sanitized, seenQuestionIds, seenOptionTexts);
      return sanitized;
    }
  } catch (error) {
    console.warn('[Oddyssey] Genkit generation failed, falling back to curated bank.', error);
  }

  const fallback = getFallbackQuestion(themeId, difficulty, seenQuestionIds);
  if (!fallback) {
    throw new Error('Exhausted questions for the selected theme.');
  }

  const sanitizedFallback = sanitizeQuestion(fallback);
  applyUniquenessTracking(sanitizedFallback, seenQuestionIds, seenOptionTexts);
  return sanitizedFallback;
}
