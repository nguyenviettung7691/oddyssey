import type { DifficultyLevel, GameQuestion } from '@/types/game';

export interface GenkitQuestionArgs {
  themeId: string;
  themeLabel: string;
  difficulty: DifficultyLevel;
  excludedQuestionSeeds: string[];
  excludedOptionTexts: string[];
}

export interface GenkitQuestionResponse {
  prompt: string;
  options: Array<{ text: string; isOddOneOut: boolean }>;
}

export function buildGenkitPrompt({
  themeId,
  themeLabel,
  difficulty,
  excludedQuestionSeeds,
  excludedOptionTexts,
}: GenkitQuestionArgs): string {
  const exclusions = excludedOptionTexts.length
    ? `Avoid reusing these option phrasings: ${excludedOptionTexts.join('; ')}`
    : 'Ensure all options use distinct language.';

  const previousSeeds = excludedQuestionSeeds.length
    ? `Avoid repeating prompts that match any of these seeds: ${excludedQuestionSeeds.join(', ')}.`
    : 'Keep every prompt distinct from earlier questions in this session.';

  return [
    'You are the Oddyssey quiz master AI generating fast-paced Odd-One-Out trivia.',
    'Game rules: Present exactly four answer options. Exactly one option must be the odd one out (intentionally incorrect or thematically misaligned).',
    'The other three options must closely relate to the prompt and be unique.',
    `Theme focus: "${themeLabel}" (id: ${themeId}). The difficulty should feel ${difficulty}.`,
    'Keep the prompt concise (<120 characters) and the options under 60 characters each.',
    exclusions,
    previousSeeds,
    'Return JSON only with fields: prompt (string) and options (array of { text, isOddOneOut }).',
  ].join('\n');
}

export class GenkitQuestionService {
  async generateQuestion(args: GenkitQuestionArgs): Promise<GameQuestion | null> {
    const prompt = buildGenkitPrompt(args);

    console.info('[Genkit] Prepared prompt for generation', { prompt });

    // TODO: Integrate with the actual Genkit AI service client here.
    // For now we return null so that the fallback question bank takes over.
    return Promise.resolve(null);
  }
}
