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
  {
    id: 'space-explorers',
    label: 'Space Explorers',
    description: 'Missions, rockets, and galaxies to unravel.',
    icon: 'planet',
    accentColor: '#9C6CFF',
    difficultyRamp: ['easy', 'medium', 'hard', 'expert', 'expert'],
  },
  {
    id: 'street-foods',
    label: 'Street Foods',
    description: 'Celebrating spicy bites and street eats worldwide.',
    icon: 'fast-food',
    accentColor: '#F07F52',
    difficultyRamp: ['easy', 'medium', 'medium', 'hard', 'expert'],
  },
  {
    id: 'world-history',
    label: 'World History',
    description: 'Empires, revolutions, and turning points of civilization.',
    icon: 'book',
    accentColor: '#6BBFB9',
    difficultyRamp: ['easy', 'easy', 'medium', 'hard', 'expert'],
  },
  {
    id: 'pop-music',
    label: 'Pop Music',
    description: 'Chart-toppers, iconic artists, and musical milestones.',
    icon: 'musical-notes',
    accentColor: '#E85D75',
    difficultyRamp: ['easy', 'easy', 'medium', 'hard', 'expert'],
  },
];

export const upcomingThemesPlaceholders: ThemeDefinition[] = [];

export const allThemes = [...coreThemes, ...upcomingThemesPlaceholders];
