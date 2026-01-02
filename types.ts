
export type SetType = 'warmup' | 'working';

export interface SetEntry {
  weight: number;
  reps: number;
  type: SetType;
  label: string;
}

export interface ExerciseLog {
  name: string;
  sets: SetEntry[];
}

export interface WorkoutSession {
  id: string;
  date: number; // timestamp
  dayName: string;
  exercises: ExerciseLog[];
}

export interface DayConfig {
  id: number;
  title: string;
  pool: string[];
}

export interface BestPerformance {
  weight: number;
  reps: number;
  volume: number;
}
