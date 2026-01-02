
import { DayConfig } from './types';

export const WORKOUT_SPLIT: DayConfig[] = [
  {
    id: 1,
    title: 'Day 1 (Chest/Back)',
    pool: ['Seated Machine Row', 'Lat Pulldown', 'Incline DB Chest Press', 'Pec Deck', 'Incline Smith Bench', 'Seated Chest Press', 'Low to High Cable Fly']
  },
  {
    id: 2,
    title: 'Day 2 (Shoulder/Arms)',
    pool: ['Tricep Pushdown Bar', 'Bicep Curl Rope', 'Incline DB Curl', 'Tricep OHP Cable', 'Cable Fly Shoulder', 'Machine Shoulder Press']
  },
  {
    id: 3,
    title: 'Day 3 (Legs)',
    pool: ['Seated Leg Press', 'Leg Curl', 'Quad Extension', 'RDL']
  },
  {
    id: 4,
    title: 'Day 4 (Upper)',
    pool: ['Incline DB Press', 'Seated Cable Row', 'Machine Shoulder Press', 'Lat Pulldown', 'Pec Deck', 'Low to High Cable Fly', 'Reverse Pec Deck', 'Incline DB Curl', 'Tricep Pushdown Bar', 'Preacher Curl', 'Tricep OHP Cable']
  },
  {
    id: 5,
    title: 'Day 5 (Legs)',
    pool: ['Smith Squat', 'Leg Press Seated', 'Leg Extension', 'Bulgarian Split Squat']
  }
];

export const APP_STORAGE_KEY = 'vibelift_history_v1';
