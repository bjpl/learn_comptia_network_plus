import type { DifficultyLevel } from '../../osi-types';

export const DIFFICULTY_LEVELS: DifficultyLevel[] = [
  {
    level: 1,
    name: 'Layer Builder',
    description: 'Interactive layer-by-layer builder with guidance',
    enabled: true,
  },
  {
    level: 2,
    name: 'Protocol Master',
    description: 'Advanced protocol and layer matching',
    enabled: true,
  },
  {
    level: 3,
    name: 'Real-World Examples',
    description: 'Learn with practical networking scenarios',
    enabled: true,
  },
  {
    level: 4,
    name: 'Quiz Mode',
    description: 'Test your layer knowledge with questions',
    enabled: true,
  },
  {
    level: 5,
    name: 'Export & Review',
    description: 'Generate study notes and review materials',
    enabled: true,
  },
];
