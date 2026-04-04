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
  {
    id: 'football-easy-3',
    prompt: 'Which of these players has never won the Ballon d\'Or?',
    difficulty: 'easy',
    options: [
      { text: 'Lionel Messi', isOddOneOut: false },
      { text: 'Cristiano Ronaldo', isOddOneOut: false },
      { text: 'Neymar Jr', isOddOneOut: true },
      { text: 'Luka Modrić', isOddOneOut: false },
    ],
  },
  {
    id: 'football-medium-3',
    prompt: 'Three stadiums hosted FIFA World Cup finals. Which did not?',
    difficulty: 'medium',
    options: [
      { text: 'Maracanã', isOddOneOut: false },
      { text: 'Wembley Stadium', isOddOneOut: false },
      { text: 'Camp Nou', isOddOneOut: true },
      { text: 'Lusail Stadium', isOddOneOut: false },
    ],
  },
  {
    id: 'football-hard-2',
    prompt: 'Which of these countries has never won the Copa América?',
    difficulty: 'hard',
    options: [
      { text: 'Uruguay', isOddOneOut: false },
      { text: 'Argentina', isOddOneOut: false },
      { text: 'Mexico', isOddOneOut: true },
      { text: 'Chile', isOddOneOut: false },
    ],
  },
  {
    id: 'football-hard-3',
    prompt: 'Identify the player who has not scored in a Champions League final.',
    difficulty: 'hard',
    options: [
      { text: 'Sergio Ramos', isOddOneOut: false },
      { text: 'Zinedine Zidane', isOddOneOut: false },
      { text: 'Gianluigi Buffon', isOddOneOut: true },
      { text: 'Steven Gerrard', isOddOneOut: false },
    ],
  },
  {
    id: 'football-expert-2',
    prompt: 'Which rule change was not part of the 2019 IFAB Laws of the Game revision?',
    difficulty: 'expert',
    options: [
      { text: 'Attackers banned from the defensive wall', isOddOneOut: false },
      { text: 'Goal kicks needn\'t leave the box', isOddOneOut: false },
      { text: 'VAR required for all professional leagues', isOddOneOut: true },
      { text: 'Substituted players leave at nearest line', isOddOneOut: false },
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
  {
    id: 'anime-easy-3',
    prompt: 'Three of these are mecha anime. Which is not?',
    difficulty: 'easy',
    options: [
      { text: 'Neon Genesis Evangelion', isOddOneOut: false },
      { text: 'Code Geass', isOddOneOut: false },
      { text: 'Death Note', isOddOneOut: true },
      { text: 'Gurren Lagann', isOddOneOut: false },
    ],
  },
  {
    id: 'anime-medium-3',
    prompt: 'Which anime was not produced by studio MAPPA?',
    difficulty: 'medium',
    options: [
      { text: 'Jujutsu Kaisen', isOddOneOut: false },
      { text: 'Attack on Titan: The Final Season', isOddOneOut: false },
      { text: 'Spy x Family', isOddOneOut: true },
      { text: 'Chainsaw Man', isOddOneOut: false },
    ],
  },
  {
    id: 'anime-hard-2',
    prompt: 'Three of these anime first aired before 2010. Which did not?',
    difficulty: 'hard',
    options: [
      { text: 'Naruto', isOddOneOut: false },
      { text: 'Bleach', isOddOneOut: false },
      { text: 'Sword Art Online', isOddOneOut: true },
      { text: 'Fullmetal Alchemist', isOddOneOut: false },
    ],
  },
  {
    id: 'anime-hard-3',
    prompt: 'Which of these anime was not animated by studio Bones?',
    difficulty: 'hard',
    options: [
      { text: 'Fullmetal Alchemist: Brotherhood', isOddOneOut: false },
      { text: 'My Hero Academia', isOddOneOut: false },
      { text: 'Cowboy Bebop', isOddOneOut: true },
      { text: 'Mob Psycho 100', isOddOneOut: false },
    ],
  },
  {
    id: 'anime-expert-2',
    prompt: 'Which of these anime has not been adapted from a light novel?',
    difficulty: 'expert',
    options: [
      { text: 'Sword Art Online', isOddOneOut: false },
      { text: 'Re:Zero', isOddOneOut: false },
      { text: 'Fullmetal Alchemist', isOddOneOut: true },
      { text: 'No Game No Life', isOddOneOut: false },
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
  {
    id: 'science-easy-3',
    prompt: 'Which of these is not a planet in our solar system?',
    difficulty: 'easy',
    options: [
      { text: 'Mars', isOddOneOut: false },
      { text: 'Jupiter', isOddOneOut: false },
      { text: 'Pluto', isOddOneOut: true },
      { text: 'Saturn', isOddOneOut: false },
    ],
  },
  {
    id: 'science-medium-3',
    prompt: 'Three of these scientists won a Nobel Prize in Physics. Who did not?',
    difficulty: 'medium',
    options: [
      { text: 'Albert Einstein', isOddOneOut: false },
      { text: 'Niels Bohr', isOddOneOut: false },
      { text: 'Nikola Tesla', isOddOneOut: true },
      { text: 'Richard Feynman', isOddOneOut: false },
    ],
  },
  {
    id: 'science-hard-2',
    prompt: 'Which particle is not classified as a lepton?',
    difficulty: 'hard',
    options: [
      { text: 'Electron', isOddOneOut: false },
      { text: 'Muon', isOddOneOut: false },
      { text: 'Pion', isOddOneOut: true },
      { text: 'Tau', isOddOneOut: false },
    ],
  },
  {
    id: 'science-hard-3',
    prompt: 'Three of these elements are lanthanides. Which is not?',
    difficulty: 'hard',
    options: [
      { text: 'Cerium', isOddOneOut: false },
      { text: 'Europium', isOddOneOut: false },
      { text: 'Zirconium', isOddOneOut: true },
      { text: 'Gadolinium', isOddOneOut: false },
    ],
  },
  {
    id: 'science-expert-2',
    prompt: 'Which phenomenon is not predicted by general relativity?',
    difficulty: 'expert',
    options: [
      { text: 'Gravitational lensing', isOddOneOut: false },
      { text: 'Frame-dragging', isOddOneOut: false },
      { text: 'Quantum tunneling', isOddOneOut: true },
      { text: 'Gravitational time dilation', isOddOneOut: false },
    ],
  },
];

const spaceExplorersQuestions: RawQuestion[] = [
  {
    id: 'space-explorers-easy-1',
    prompt: 'Three of these astronauts walked on the Moon. Who did not?',
    difficulty: 'easy',
    options: [
      { text: 'Neil Armstrong', isOddOneOut: false },
      { text: 'Buzz Aldrin', isOddOneOut: false },
      { text: 'Michael Collins', isOddOneOut: true },
      { text: 'Alan Shepard', isOddOneOut: false },
    ],
  },
  {
    id: 'space-explorers-easy-2',
    prompt: 'Which space agency is not a partner on the International Space Station?',
    difficulty: 'easy',
    options: [
      { text: 'NASA', isOddOneOut: false },
      { text: 'ESA', isOddOneOut: false },
      { text: 'CNSA', isOddOneOut: true },
      { text: 'JAXA', isOddOneOut: false },
    ],
  },
  {
    id: 'space-explorers-easy-3',
    prompt: 'Three of these are NASA space shuttle orbiters. Which is not?',
    difficulty: 'easy',
    options: [
      { text: 'Columbia', isOddOneOut: false },
      { text: 'Discovery', isOddOneOut: false },
      { text: 'Apollo', isOddOneOut: true },
      { text: 'Atlantis', isOddOneOut: false },
    ],
  },
  {
    id: 'space-explorers-medium-1',
    prompt: 'Which mission was not part of the Apollo program?',
    difficulty: 'medium',
    options: [
      { text: 'Apollo 11', isOddOneOut: false },
      { text: 'Apollo 13', isOddOneOut: false },
      { text: 'Gemini 4', isOddOneOut: true },
      { text: 'Apollo 17', isOddOneOut: false },
    ],
  },
  {
    id: 'space-explorers-medium-2',
    prompt: 'Three of these are moons of Jupiter. Which is not?',
    difficulty: 'medium',
    options: [
      { text: 'Europa', isOddOneOut: false },
      { text: 'Ganymede', isOddOneOut: false },
      { text: 'Titan', isOddOneOut: true },
      { text: 'Callisto', isOddOneOut: false },
    ],
  },
  {
    id: 'space-explorers-medium-3',
    prompt: 'Which rover was not designed to explore Mars?',
    difficulty: 'medium',
    options: [
      { text: 'Opportunity', isOddOneOut: false },
      { text: 'Spirit', isOddOneOut: false },
      { text: 'Yutu', isOddOneOut: true },
      { text: 'Curiosity', isOddOneOut: false },
    ],
  },
  {
    id: 'space-explorers-hard-1',
    prompt: 'Which spacecraft is not on a trajectory to leave the solar system?',
    difficulty: 'hard',
    options: [
      { text: 'Voyager 1', isOddOneOut: false },
      { text: 'Voyager 2', isOddOneOut: false },
      { text: 'Juno', isOddOneOut: true },
      { text: 'New Horizons', isOddOneOut: false },
    ],
  },
  {
    id: 'space-explorers-hard-2',
    prompt: 'Three of these astronauts commanded an Apollo mission. Who did not?',
    difficulty: 'hard',
    options: [
      { text: 'Jim Lovell', isOddOneOut: false },
      { text: 'Frank Borman', isOddOneOut: false },
      { text: 'John Glenn', isOddOneOut: true },
      { text: 'Alan Shepard', isOddOneOut: false },
    ],
  },
  {
    id: 'space-explorers-hard-3',
    prompt: 'Which telescope does not operate primarily in infrared wavelengths?',
    difficulty: 'hard',
    options: [
      { text: 'James Webb Space Telescope', isOddOneOut: false },
      { text: 'Spitzer Space Telescope', isOddOneOut: false },
      { text: 'Chandra X-ray Observatory', isOddOneOut: true },
      { text: 'Herschel Space Observatory', isOddOneOut: false },
    ],
  },
  {
    id: 'space-explorers-expert-1',
    prompt: 'Which propulsion method has not been used on an operational spacecraft?',
    difficulty: 'expert',
    options: [
      { text: 'Ion thruster', isOddOneOut: false },
      { text: 'Solar sail', isOddOneOut: false },
      { text: 'EmDrive', isOddOneOut: true },
      { text: 'Hall-effect thruster', isOddOneOut: false },
    ],
  },
  {
    id: 'space-explorers-expert-2',
    prompt: 'Three of these missions used a Venus gravity assist. Which did not?',
    difficulty: 'expert',
    options: [
      { text: 'Galileo', isOddOneOut: false },
      { text: 'MESSENGER', isOddOneOut: false },
      { text: 'Juno', isOddOneOut: true },
      { text: 'Cassini', isOddOneOut: false },
    ],
  },
];

const streetFoodsQuestions: RawQuestion[] = [
  {
    id: 'street-foods-easy-1',
    prompt: 'Three of these are traditional Japanese street foods. Which is not?',
    difficulty: 'easy',
    options: [
      { text: 'Takoyaki', isOddOneOut: false },
      { text: 'Yakitori', isOddOneOut: false },
      { text: 'Banh Mi', isOddOneOut: true },
      { text: 'Okonomiyaki', isOddOneOut: false },
    ],
  },
  {
    id: 'street-foods-easy-2',
    prompt: 'Which of these is not a Mexican street food?',
    difficulty: 'easy',
    options: [
      { text: 'Tacos al Pastor', isOddOneOut: false },
      { text: 'Elote', isOddOneOut: false },
      { text: 'Poutine', isOddOneOut: true },
      { text: 'Churros', isOddOneOut: false },
    ],
  },
  {
    id: 'street-foods-easy-3',
    prompt: 'Three of these are popular Indian street snacks. Which is not?',
    difficulty: 'easy',
    options: [
      { text: 'Samosa', isOddOneOut: false },
      { text: 'Pani Puri', isOddOneOut: false },
      { text: 'Empanada', isOddOneOut: true },
      { text: 'Vada Pav', isOddOneOut: false },
    ],
  },
  {
    id: 'street-foods-medium-1',
    prompt: 'Which street food did not originate in Southeast Asia?',
    difficulty: 'medium',
    options: [
      { text: 'Satay', isOddOneOut: false },
      { text: 'Halo-Halo', isOddOneOut: false },
      { text: 'Arepas', isOddOneOut: true },
      { text: 'Som Tam', isOddOneOut: false },
    ],
  },
  {
    id: 'street-foods-medium-2',
    prompt: 'Three of these are types of dumplings. Which is not?',
    difficulty: 'medium',
    options: [
      { text: 'Gyoza', isOddOneOut: false },
      { text: 'Momo', isOddOneOut: false },
      { text: 'Falafel', isOddOneOut: true },
      { text: 'Pierogi', isOddOneOut: false },
    ],
  },
  {
    id: 'street-foods-medium-3',
    prompt: 'Three of these are popular Middle Eastern street foods. Which is not?',
    difficulty: 'medium',
    options: [
      { text: 'Falafel', isOddOneOut: false },
      { text: 'Shawarma', isOddOneOut: false },
      { text: 'Currywurst', isOddOneOut: true },
      { text: 'Manakish', isOddOneOut: false },
    ],
  },
  {
    id: 'street-foods-hard-1',
    prompt: 'Which street food dish does not feature rice as a main ingredient?',
    difficulty: 'hard',
    options: [
      { text: 'Onigiri', isOddOneOut: false },
      { text: 'Jollof Rice', isOddOneOut: false },
      { text: 'Bunny Chow', isOddOneOut: true },
      { text: 'Nasi Goreng', isOddOneOut: false },
    ],
  },
  {
    id: 'street-foods-hard-2',
    prompt: 'Three of these street foods are traditionally deep-fried. Which is not?',
    difficulty: 'hard',
    options: [
      { text: 'Churros', isOddOneOut: false },
      { text: 'Beignets', isOddOneOut: false },
      { text: 'Crêpes', isOddOneOut: true },
      { text: 'Pakora', isOddOneOut: false },
    ],
  },
  {
    id: 'street-foods-hard-3',
    prompt: 'Which city is not widely considered a world capital of street food?',
    difficulty: 'hard',
    options: [
      { text: 'Bangkok', isOddOneOut: false },
      { text: 'Singapore', isOddOneOut: false },
      { text: 'Zurich', isOddOneOut: true },
      { text: 'Mexico City', isOddOneOut: false },
    ],
  },
  {
    id: 'street-foods-expert-1',
    prompt: 'Which of these flatbreads is not traditionally cooked in a tandoor oven?',
    difficulty: 'expert',
    options: [
      { text: 'Naan', isOddOneOut: false },
      { text: 'Tandoori Roti', isOddOneOut: false },
      { text: 'Tortilla', isOddOneOut: true },
      { text: 'Kulcha', isOddOneOut: false },
    ],
  },
  {
    id: 'street-foods-expert-2',
    prompt: 'Three of these sauces have chili peppers as a base. Which does not?',
    difficulty: 'expert',
    options: [
      { text: 'Sriracha', isOddOneOut: false },
      { text: 'Harissa', isOddOneOut: false },
      { text: 'Tzatziki', isOddOneOut: true },
      { text: 'Sambal', isOddOneOut: false },
    ],
  },
];

const worldHistoryQuestions: RawQuestion[] = [
  {
    id: 'world-history-easy-1',
    prompt: 'Three of these were Ancient Greek city-states. Which was not?',
    difficulty: 'easy',
    options: [
      { text: 'Athens', isOddOneOut: false },
      { text: 'Sparta', isOddOneOut: false },
      { text: 'Carthage', isOddOneOut: true },
      { text: 'Corinth', isOddOneOut: false },
    ],
  },
  {
    id: 'world-history-easy-2',
    prompt: 'Which of these was not an Axis power in World War II?',
    difficulty: 'easy',
    options: [
      { text: 'Germany', isOddOneOut: false },
      { text: 'Japan', isOddOneOut: false },
      { text: 'United Kingdom', isOddOneOut: true },
      { text: 'Italy', isOddOneOut: false },
    ],
  },
  {
    id: 'world-history-easy-3',
    prompt: 'Three of these figures are associated with the French Revolution. Who is not?',
    difficulty: 'easy',
    options: [
      { text: 'Robespierre', isOddOneOut: false },
      { text: 'Napoleon Bonaparte', isOddOneOut: false },
      { text: 'Otto von Bismarck', isOddOneOut: true },
      { text: 'Marie Antoinette', isOddOneOut: false },
    ],
  },
  {
    id: 'world-history-medium-1',
    prompt: 'Which event did not occur during the 18th century?',
    difficulty: 'medium',
    options: [
      { text: 'American Revolution', isOddOneOut: false },
      { text: 'French Revolution', isOddOneOut: false },
      { text: 'Russian Revolution', isOddOneOut: true },
      { text: 'Industrial Revolution begins', isOddOneOut: false },
    ],
  },
  {
    id: 'world-history-medium-2',
    prompt: 'Three of these explorers sailed for Spain. Who did not?',
    difficulty: 'medium',
    options: [
      { text: 'Christopher Columbus', isOddOneOut: false },
      { text: 'Ferdinand Magellan', isOddOneOut: false },
      { text: 'Vasco da Gama', isOddOneOut: true },
      { text: 'Hernán Cortés', isOddOneOut: false },
    ],
  },
  {
    id: 'world-history-medium-3',
    prompt: 'Which ancient wonder was not located in the Mediterranean region?',
    difficulty: 'medium',
    options: [
      { text: 'Colossus of Rhodes', isOddOneOut: false },
      { text: 'Lighthouse of Alexandria', isOddOneOut: false },
      { text: 'Hanging Gardens of Babylon', isOddOneOut: true },
      { text: 'Temple of Artemis at Ephesus', isOddOneOut: false },
    ],
  },
  {
    id: 'world-history-hard-1',
    prompt: 'Which treaty did not end a major European war?',
    difficulty: 'hard',
    options: [
      { text: 'Treaty of Versailles', isOddOneOut: false },
      { text: 'Treaty of Westphalia', isOddOneOut: false },
      { text: 'Treaty of Tordesillas', isOddOneOut: true },
      { text: 'Treaty of Utrecht', isOddOneOut: false },
    ],
  },
  {
    id: 'world-history-hard-2',
    prompt: 'Three of these dynasties ruled China. Which did not?',
    difficulty: 'hard',
    options: [
      { text: 'Tang Dynasty', isOddOneOut: false },
      { text: 'Song Dynasty', isOddOneOut: false },
      { text: 'Mughal Dynasty', isOddOneOut: true },
      { text: 'Qing Dynasty', isOddOneOut: false },
    ],
  },
  {
    id: 'world-history-hard-3',
    prompt: 'Which philosopher was not from Ancient Greece?',
    difficulty: 'hard',
    options: [
      { text: 'Socrates', isOddOneOut: false },
      { text: 'Plato', isOddOneOut: false },
      { text: 'Confucius', isOddOneOut: true },
      { text: 'Aristotle', isOddOneOut: false },
    ],
  },
  {
    id: 'world-history-expert-1',
    prompt: 'Three of these revolutions occurred in 1848. Which did not?',
    difficulty: 'expert',
    options: [
      { text: 'French February Revolution', isOddOneOut: false },
      { text: 'Hungarian Revolution', isOddOneOut: false },
      { text: 'Haitian Revolution', isOddOneOut: true },
      { text: 'German March Revolution', isOddOneOut: false },
    ],
  },
  {
    id: 'world-history-expert-2',
    prompt: 'Which work was not written during the Enlightenment era?',
    difficulty: 'expert',
    options: [
      { text: 'The Social Contract by Rousseau', isOddOneOut: false },
      { text: 'The Spirit of the Laws by Montesquieu', isOddOneOut: false },
      { text: 'Leviathan by Hobbes', isOddOneOut: true },
      { text: 'An Essay Concerning Human Understanding', isOddOneOut: false },
    ],
  },
];

const popMusicQuestions: RawQuestion[] = [
  {
    id: 'pop-music-easy-1',
    prompt: 'Three of these artists are members of BTS. Who is not?',
    difficulty: 'easy',
    options: [
      { text: 'Jungkook', isOddOneOut: false },
      { text: 'V', isOddOneOut: false },
      { text: 'G-Dragon', isOddOneOut: true },
      { text: 'RM', isOddOneOut: false },
    ],
  },
  {
    id: 'pop-music-easy-2',
    prompt: 'Which of these songs was not performed by Michael Jackson?',
    difficulty: 'easy',
    options: [
      { text: 'Thriller', isOddOneOut: false },
      { text: 'Billie Jean', isOddOneOut: false },
      { text: 'Purple Rain', isOddOneOut: true },
      { text: 'Beat It', isOddOneOut: false },
    ],
  },
  {
    id: 'pop-music-easy-3',
    prompt: 'Three of these are Taylor Swift albums. Which is not?',
    difficulty: 'easy',
    options: [
      { text: '1989', isOddOneOut: false },
      { text: 'Folklore', isOddOneOut: false },
      { text: 'Lemonade', isOddOneOut: true },
      { text: 'Midnights', isOddOneOut: false },
    ],
  },
  {
    id: 'pop-music-medium-1',
    prompt: 'Which artist was not part of a famous pop duo?',
    difficulty: 'medium',
    options: [
      { text: 'Sonny Bono', isOddOneOut: false },
      { text: 'Andrew Ridgeley', isOddOneOut: false },
      { text: 'Freddie Mercury', isOddOneOut: true },
      { text: 'John Oates', isOddOneOut: false },
    ],
  },
  {
    id: 'pop-music-medium-2',
    prompt: 'Three of these artists headlined the Super Bowl halftime show. Who has not?',
    difficulty: 'medium',
    options: [
      { text: 'Beyoncé', isOddOneOut: false },
      { text: 'Lady Gaga', isOddOneOut: false },
      { text: 'Adele', isOddOneOut: true },
      { text: 'Shakira', isOddOneOut: false },
    ],
  },
  {
    id: 'pop-music-medium-3',
    prompt: 'Which of these artists is not originally from the United Kingdom?',
    difficulty: 'medium',
    options: [
      { text: 'Adele', isOddOneOut: false },
      { text: 'Ed Sheeran', isOddOneOut: false },
      { text: 'Drake', isOddOneOut: true },
      { text: 'Dua Lipa', isOddOneOut: false },
    ],
  },
  {
    id: 'pop-music-hard-1',
    prompt: 'Three of these artists write most of their own hit songs. Who does not?',
    difficulty: 'hard',
    options: [
      { text: 'Billie Eilish', isOddOneOut: false },
      { text: 'Taylor Swift', isOddOneOut: false },
      { text: 'Britney Spears', isOddOneOut: true },
      { text: 'Lady Gaga', isOddOneOut: false },
    ],
  },
  {
    id: 'pop-music-hard-2',
    prompt: 'Which music festival does not take place in the United States?',
    difficulty: 'hard',
    options: [
      { text: 'Coachella', isOddOneOut: false },
      { text: 'Lollapalooza', isOddOneOut: false },
      { text: 'Glastonbury', isOddOneOut: true },
      { text: 'Bonnaroo', isOddOneOut: false },
    ],
  },
  {
    id: 'pop-music-hard-3',
    prompt: 'Which of these music genres did not originate in the United States?',
    difficulty: 'hard',
    options: [
      { text: 'Jazz', isOddOneOut: false },
      { text: 'Hip-Hop', isOddOneOut: false },
      { text: 'Reggae', isOddOneOut: true },
      { text: 'Rock and Roll', isOddOneOut: false },
    ],
  },
  {
    id: 'pop-music-expert-1',
    prompt: 'Which of these artists did not emerge from a talent competition show?',
    difficulty: 'expert',
    options: [
      { text: 'Kelly Clarkson', isOddOneOut: false },
      { text: 'One Direction', isOddOneOut: false },
      { text: 'Billie Eilish', isOddOneOut: true },
      { text: 'Fifth Harmony', isOddOneOut: false },
    ],
  },
  {
    id: 'pop-music-expert-2',
    prompt: 'Which record label is not one of the "Big Three" major labels?',
    difficulty: 'expert',
    options: [
      { text: 'Universal Music Group', isOddOneOut: false },
      { text: 'Sony Music', isOddOneOut: false },
      { text: 'Def Jam Recordings', isOddOneOut: true },
      { text: 'Warner Music Group', isOddOneOut: false },
    ],
  },
];

const questionMap: Record<string, RawQuestion[]> = {
  football: footballQuestions,
  anime: animeQuestions,
  science: scienceQuestions,
  'space-explorers': spaceExplorersQuestions,
  'street-foods': streetFoodsQuestions,
  'world-history': worldHistoryQuestions,
  'pop-music': popMusicQuestions,
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
