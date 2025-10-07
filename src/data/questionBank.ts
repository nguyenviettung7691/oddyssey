import { randomUUID } from '@/utils/id';
import type { DifficultyLevel, GameQuestion } from '@/types/game';

interface RawQuestion {
  id: string;
  prompt: string;
  difficulty: DifficultyLevel;
  options: Array<{ text: string; isOddOneOut: boolean }>;
}

const footballQuestions: RawQuestion[] = [
  {
    id: 'football-easy-1',
    prompt: 'Which kit color does not belong to FC Barcelona\'s traditional home strip?',
    difficulty: 'easy',
    options: [
      { text: 'Deep blue', isOddOneOut: false },
      { text: 'Claret red', isOddOneOut: false },
      { text: 'Golden yellow', isOddOneOut: true },
      { text: 'Navy stripes', isOddOneOut: false },
    ],
  },
  {
    id: 'football-easy-2',
    prompt: 'Spot the odd one out among legendary strikers.',
    difficulty: 'easy',
    options: [
      { text: 'Thierry Henry', isOddOneOut: false },
      { text: 'Ronaldo Nazario', isOddOneOut: false },
      { text: 'Iker Casillas', isOddOneOut: true },
      { text: 'Didier Drogba', isOddOneOut: false },
    ],
  },
  {
    id: 'football-medium-1',
    prompt: 'Three of these clubs have won the UEFA Champions League multiple times. Which has not?',
    difficulty: 'medium',
    options: [
      { text: 'A.C. Milan', isOddOneOut: false },
      { text: 'Nottingham Forest', isOddOneOut: false },
      { text: 'Olympique Lyonnais', isOddOneOut: true },
      { text: 'Real Madrid', isOddOneOut: false },
    ],
  },
  {
    id: 'football-medium-2',
    prompt: 'Choose the tactical formation not commonly associated with a three-at-the-back system.',
    difficulty: 'medium',
    options: [
      { text: '3-4-3', isOddOneOut: false },
      { text: '3-5-2', isOddOneOut: false },
      { text: '4-2-3-1', isOddOneOut: true },
      { text: '3-1-4-2', isOddOneOut: false },
    ],
  },
  {
    id: 'football-hard-1',
    prompt: 'Identify the club that does not play in the Bundesliga.',
    difficulty: 'hard',
    options: [
      { text: 'Borussia Dortmund', isOddOneOut: false },
      { text: 'RB Leipzig', isOddOneOut: false },
      { text: 'FC Cincinnati', isOddOneOut: true },
      { text: 'Bayer Leverkusen', isOddOneOut: false },
    ],
  },
  {
    id: 'football-expert-1',
    prompt: 'Which football law element is not part of the offside offense criteria?',
    difficulty: 'expert',
    options: [
      { text: 'Being in line with the second-last defender', isOddOneOut: false },
      { text: 'Gaining advantage from a rebound', isOddOneOut: false },
      { text: 'Receiving the ball directly from a throw-in', isOddOneOut: true },
      { text: 'Interfering with an opponent', isOddOneOut: false },
    ],
  },
];

const animeQuestions: RawQuestion[] = [
  {
    id: 'anime-easy-1',
    prompt: 'Which of these is not a Studio Ghibli film?',
    difficulty: 'easy',
    options: [
      { text: 'Spirited Away', isOddOneOut: false },
      { text: 'Your Name', isOddOneOut: true },
      { text: 'Howl\'s Moving Castle', isOddOneOut: false },
      { text: 'Princess Mononoke', isOddOneOut: false },
    ],
  },
  {
    id: 'anime-easy-2',
    prompt: 'Three protagonists wield swords as their primary weapon. Who does not?',
    difficulty: 'easy',
    options: [
      { text: 'Ichigo Kurosaki', isOddOneOut: false },
      { text: 'Roronoa Zoro', isOddOneOut: false },
      { text: 'Light Yagami', isOddOneOut: true },
      { text: 'Tanjiro Kamado', isOddOneOut: false },
    ],
  },
  {
    id: 'anime-medium-1',
    prompt: 'Identify the series that did not originate from Shonen Jump.',
    difficulty: 'medium',
    options: [
      { text: 'Jujutsu Kaisen', isOddOneOut: false },
      { text: 'My Hero Academia', isOddOneOut: false },
      { text: 'Attack on Titan', isOddOneOut: true },
      { text: 'Black Clover', isOddOneOut: false },
    ],
  },
  {
    id: 'anime-medium-2',
    prompt: 'Three composers scored major shonen soundtracks. Who is the outlier?',
    difficulty: 'medium',
    options: [
      { text: 'Yuki Hayashi', isOddOneOut: false },
      { text: 'Hiroyuki Sawano', isOddOneOut: false },
      { text: 'Hans Zimmer', isOddOneOut: true },
      { text: 'Shiro Sagisu', isOddOneOut: false },
    ],
  },
  {
    id: 'anime-hard-1',
    prompt: 'Find the anime that premiered after 2015.',
    difficulty: 'hard',
    options: [
      { text: 'Mob Psycho 100', isOddOneOut: true },
      { text: 'Haikyuu!!', isOddOneOut: false },
      { text: 'JoJo\'s Bizarre Adventure: Stardust Crusaders', isOddOneOut: false },
      { text: 'Hunter x Hunter (2011)', isOddOneOut: false },
    ],
  },
  {
    id: 'anime-expert-1',
    prompt: 'Three of these creators won the Tezuka Osamu Cultural Prize. Which did not?',
    difficulty: 'expert',
    options: [
      { text: 'Naoki Urasawa', isOddOneOut: false },
      { text: 'Rumiko Takahashi', isOddOneOut: false },
      { text: 'Eiichiro Oda', isOddOneOut: true },
      { text: 'Kazuhiro Fujita', isOddOneOut: false },
    ],
  },
];

const scienceQuestions: RawQuestion[] = [
  {
    id: 'science-easy-1',
    prompt: 'Which of these is not considered a noble gas?',
    difficulty: 'easy',
    options: [
      { text: 'Helium', isOddOneOut: false },
      { text: 'Neon', isOddOneOut: false },
      { text: 'Oxygen', isOddOneOut: true },
      { text: 'Argon', isOddOneOut: false },
    ],
  },
  {
    id: 'science-easy-2',
    prompt: 'Three inventions transformed electricity usage. Which did not?',
    difficulty: 'easy',
    options: [
      { text: 'Alternating current motor', isOddOneOut: false },
      { text: 'LED lighting', isOddOneOut: false },
      { text: 'Steam turbine', isOddOneOut: true },
      { text: 'Lithium-ion battery', isOddOneOut: false },
    ],
  },
  {
    id: 'science-medium-1',
    prompt: 'Spot the scientist who did not publish on the theory of evolution.',
    difficulty: 'medium',
    options: [
      { text: 'Charles Darwin', isOddOneOut: false },
      { text: 'Alfred Russel Wallace', isOddOneOut: false },
      { text: 'Jean-Baptiste Lamarck', isOddOneOut: false },
      { text: 'Gregor Mendel', isOddOneOut: true },
    ],
  },
  {
    id: 'science-medium-2',
    prompt: 'Select the spacecraft that did not explore Mars.',
    difficulty: 'medium',
    options: [
      { text: 'Viking 1', isOddOneOut: false },
      { text: 'Curiosity rover', isOddOneOut: false },
      { text: 'Cassini-Huygens', isOddOneOut: true },
      { text: 'Perseverance rover', isOddOneOut: false },
    ],
  },
  {
    id: 'science-hard-1',
    prompt: 'Three fields fall under classical mechanics. Which does not?',
    difficulty: 'hard',
    options: [
      { text: 'Kinematics', isOddOneOut: false },
      { text: 'Dynamics', isOddOneOut: false },
      { text: 'Thermodynamics', isOddOneOut: true },
      { text: 'Statics', isOddOneOut: false },
    ],
  },
  {
    id: 'science-expert-1',
    prompt: 'Which concept is not part of the Standard Model of particle physics?',
    difficulty: 'expert',
    options: [
      { text: 'Higgs boson', isOddOneOut: false },
      { text: 'W and Z bosons', isOddOneOut: false },
      { text: 'Graviton', isOddOneOut: true },
      { text: 'Gluons', isOddOneOut: false },
    ],
  },
];

const questionMap: Record<string, RawQuestion[]> = {
  football: footballQuestions,
  anime: animeQuestions,
  science: scienceQuestions,
};

export function getFallbackQuestion(
  themeId: string,
  difficulty: DifficultyLevel,
  excludedIds: Set<string>,
): GameQuestion | null {
  const pool = questionMap[themeId]?.filter(
    (question) => question.difficulty === difficulty && !excludedIds.has(question.id),
  );

  const available = pool && pool.length > 0
    ? pool
    : questionMap[themeId]?.filter((question) => !excludedIds.has(question.id));

  if (!available || available.length === 0) {
    return null;
  }

  const selection = available[Math.floor(Math.random() * available.length)];
  const oddOptionIndex = selection.options.findIndex((option) => option.isOddOneOut);

  if (oddOptionIndex === -1) {
    return null;
  }

  const options = selection.options.map((option, index) => ({
    id: `${selection.id}-option-${index}`,
    text: option.text,
    isOddOneOut: option.isOddOneOut,
  }));

  return {
    id: selection.id,
    seed: randomUUID(),
    prompt: selection.prompt,
    themeId,
    difficulty: selection.difficulty,
    options,
    oddOptionId: `${selection.id}-option-${oddOptionIndex}`,
    source: 'fallback',
    generatedAt: new Date().toISOString(),
  };
}
