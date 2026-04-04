import type { DifficultyLevel, GameQuestion } from '@/types/game';
import { randomUUID } from '@/utils/id';

export interface GenkitQuestionArgs {
  themeId: string;
  themeLabel: string;
  difficulty: DifficultyLevel;
  excludedQuestionSeeds: string[];
  excludedOptionTexts: string[];
  locale?: string;
}

export interface GenkitQuestionResponse {
  prompt: string;
  options: Array<{ text: string; isOddOneOut: boolean }>;
}

const REQUEST_TIMEOUT_MS = 10_000;
const RETRY_DELAY_MS = 1_500;

export function buildGenkitPrompt({
  themeId,
  themeLabel,
  difficulty,
  excludedQuestionSeeds,
  excludedOptionTexts,
  locale,
}: GenkitQuestionArgs): string {
  const exclusions = excludedOptionTexts.length
    ? `Avoid reusing these option phrasings: ${excludedOptionTexts.join('; ')}`
    : 'Ensure all options use distinct language.';

  const previousSeeds = excludedQuestionSeeds.length
    ? `Avoid repeating prompts that match any of these seeds: ${excludedQuestionSeeds.join(', ')}.`
    : 'Keep every prompt distinct from earlier questions in this session.';

  const languageInstruction = locale && locale !== 'en'
    ? `Generate all text (prompt and option texts) in the language identified by locale code "${locale}".`
    : 'Generate all text in English.';

  return [
    'You are the Oddyssey quiz master AI generating fast-paced Odd-One-Out trivia.',
    'Game rules: Present exactly four answer options. Exactly one option must be the odd one out (intentionally incorrect or thematically misaligned).',
    'The other three options must closely relate to the prompt and be unique.',
    `Theme focus: "${themeLabel}" (id: ${themeId}). The difficulty should feel ${difficulty}.`,
    'Keep the prompt concise (<120 characters) and the options under 60 characters each.',
    languageInstruction,
    exclusions,
    previousSeeds,
    'Return JSON only with fields: prompt (string) and options (array of { text, isOddOneOut }).',
  ].join('\n');
}

function getGenkitApiUrl(): string | null {
  const url = import.meta.env.VITE_GENKIT_API_URL;
  return url ? url : null;
}

function extractJson(raw: string): string {
  const fenceMatch = raw.match(/```(?:json)?\s*\n?([\s\S]*?)```/);
  if (fenceMatch) {
    return fenceMatch[1].trim();
  }
  return raw.trim();
}

export function parseGenkitResponse(raw: string): GenkitQuestionResponse | null {
  try {
    const jsonStr = extractJson(raw);
    const parsed: unknown = JSON.parse(jsonStr);

    if (typeof parsed !== 'object' || parsed === null) {
      return null;
    }

    const obj = parsed as Record<string, unknown>;

    if (typeof obj.prompt !== 'string' || !Array.isArray(obj.options)) {
      return null;
    }

    if (obj.options.length !== 4) {
      console.warn('[Genkit] Expected exactly 4 options, got', obj.options.length);
      return null;
    }

    const options: Array<{ text: string; isOddOneOut: boolean }> = [];
    for (const opt of obj.options) {
      if (typeof opt !== 'object' || opt === null) {
        return null;
      }
      const o = opt as Record<string, unknown>;
      if (typeof o.text !== 'string' || typeof o.isOddOneOut !== 'boolean') {
        return null;
      }
      options.push({ text: o.text, isOddOneOut: o.isOddOneOut });
    }

    const oddCount = options.filter((o) => o.isOddOneOut).length;
    if (oddCount !== 1) {
      console.warn('[Genkit] Expected exactly 1 odd-one-out option, got', oddCount);
      return null;
    }

    const prompt = obj.prompt as string;
    if (prompt.length > 120) {
      console.warn('[Genkit] Prompt exceeds 120 characters, truncating');
    }

    for (const o of options) {
      if (o.text.length > 60) {
        console.warn('[Genkit] Option text exceeds 60 characters, truncating:', o.text);
      }
    }

    return { prompt: prompt.slice(0, 120), options: options.map((o) => ({ ...o, text: o.text.slice(0, 60) })) };
  } catch {
    console.warn('[Genkit] Failed to parse response as JSON');
    return null;
  }
}

function toGameQuestion(
  response: GenkitQuestionResponse,
  themeId: string,
  difficulty: DifficultyLevel,
): GameQuestion {
  const questionId = `genkit-${randomUUID()}`;
  const options = response.options.map((opt, index) => ({
    id: `${questionId}-option-${index}`,
    text: opt.text,
    isOddOneOut: opt.isOddOneOut,
  }));

  const oddOption = options.find((o) => o.isOddOneOut);
  if (!oddOption) {
    throw new Error('[Genkit] Invalid state: validated response missing odd option');
  }

  return {
    id: questionId,
    seed: randomUUID(),
    prompt: response.prompt,
    themeId,
    difficulty,
    options,
    oddOptionId: oddOption.id,
    source: 'genkit',
    generatedAt: new Date().toISOString(),
  };
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

function isRetryable(status: number): boolean {
  return status >= 500 || status === 429;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class GenkitQuestionService {
  async generateQuestion(args: GenkitQuestionArgs): Promise<GameQuestion | null> {
    const apiUrl = getGenkitApiUrl();
    if (!apiUrl) {
      console.info('[Genkit] VITE_GENKIT_API_URL not configured, skipping AI generation.');
      return null;
    }

    const prompt = buildGenkitPrompt(args);
    console.info('[Genkit] Prepared prompt for generation', { prompt });

    const body = JSON.stringify({ data: { prompt } });
    const headers = { 'Content-Type': 'application/json' };

    let lastError: unknown = null;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        if (attempt > 0) {
          console.info('[Genkit] Retrying request (attempt 2)');
          await delay(RETRY_DELAY_MS);
        }

        const response = await fetchWithTimeout(apiUrl, { method: 'POST', headers, body }, REQUEST_TIMEOUT_MS);

        if (!response.ok) {
          lastError = new Error(`HTTP ${response.status}: ${response.statusText}`);
          if (isRetryable(response.status)) {
            continue;
          }
          console.warn('[Genkit] Non-retryable HTTP error', lastError);
          return null;
        }

        const json: unknown = await response.json();
        let result: string;
        if (typeof json === 'object' && json !== null && 'result' in json) {
          result = String((json as Record<string, unknown>).result);
        } else {
          console.warn('[Genkit] Response missing expected "result" field, attempting direct parse');
          result = JSON.stringify(json);
        }

        const parsed = parseGenkitResponse(result);
        if (!parsed) {
          console.warn('[Genkit] Response failed validation, falling back.');
          return null;
        }

        return toGameQuestion(parsed, args.themeId, args.difficulty);
      } catch (error) {
        lastError = error;
        if (error instanceof DOMException && error.name === 'AbortError') {
          console.warn('[Genkit] Request timed out');
          continue;
        }
        if (error instanceof TypeError) {
          console.warn('[Genkit] Network error', error.message);
          continue;
        }
        console.warn('[Genkit] Unexpected error', error);
        return null;
      }
    }

    console.warn('[Genkit] All attempts failed', lastError);
    return null;
  }
}
