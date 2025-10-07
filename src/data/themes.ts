import type { ThemeDefinition } from '@/types/game';

export const coreThemes: ThemeDefinition[] = [
  {
    id: 'football',
    label: 'World Football',
    description: 'Kits, clubs, tactics, and international legends.',
    icon: 'football',
    accentColor: '#FF8C42',
    difficultyRamp: ['easy', 'easy', 'medium', 'hard', 'expert'],
  },
  {
    id: 'anime',
    label: 'Anime Universe',
    description: 'Series lore, mangaka trivia, and iconic characters.',
    icon: 'sparkles',
    accentColor: '#FF6FB5',
    difficultyRamp: ['easy', 'easy', 'medium', 'hard', 'expert'],
  },
  {
    id: 'science',
    label: 'Science & Discovery',
    description: 'Breakthroughs, inventors, and scientific oddities.',
    icon: 'flask',
    accentColor: '#F5A25D',
    difficultyRamp: ['easy', 'medium', 'hard', 'hard', 'expert'],
  },
];

export const upcomingThemesPlaceholders: ThemeDefinition[] = [
  {
    id: 'space-explorers',
    label: 'Space Explorers',
    description: 'Coming soon: missions, rockets, and galaxies to unravel.',
    icon: 'planet',
    accentColor: '#9C6CFF',
    difficultyRamp: ['easy', 'medium', 'hard', 'expert', 'expert'],
    comingSoon: true,
  },
  {
    id: 'street-foods',
    label: 'Street Foods',
    description: 'Planned expansion celebrating spicy bites worldwide.',
    icon: 'fast-food',
    accentColor: '#F07F52',
    difficultyRamp: ['easy', 'medium', 'medium', 'hard', 'expert'],
    comingSoon: true,
  },
];

export const allThemes = [...coreThemes, ...upcomingThemesPlaceholders];
