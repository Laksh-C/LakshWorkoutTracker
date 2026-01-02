
import { WorkoutSession, BestPerformance, SetEntry } from '../types';

/**
 * Returns the heaviest Weight/Rep combo from the Working Sets of the most recent 
 * completion of the exercise.
 */
export const getPreviousBest = (exerciseName: string, history: WorkoutSession[]): BestPerformance | null => {
  // 1. Find the MOST RECENT session containing this exercise
  const recentSessionWithExercise = history.find(session => 
    session.exercises.some(ex => ex.name === exerciseName)
  );

  if (!recentSessionWithExercise) return null;

  const exercise = recentSessionWithExercise.exercises.find(ex => ex.name === exerciseName);
  if (!exercise) return null;

  // 2. Filter for working sets only
  const workingSets = exercise.sets.filter(s => s.type === 'working');
  
  if (workingSets.length === 0) return null;

  // 3. Find the set with the highest volume (weight * reps)
  let best: BestPerformance | null = null;
  workingSets.forEach(set => {
    const volume = set.weight * set.reps;
    if (!best || volume > best.volume) {
      best = { weight: set.weight, reps: set.reps, volume };
    }
  });

  return best;
};

export const calculateSessionVolume = (session: WorkoutSession): number => {
  return session.exercises.reduce((total, ex) => {
    return total + ex.sets.reduce((setTotal, set) => setTotal + (set.weight * set.reps), 0);
  }, 0);
};

export const getWeeklyVolumeData = (history: WorkoutSession[]) => {
  const weeks: Record<string, number> = {};
  const now = new Date();
  
  for (let i = 0; i < 6; i++) {
    const d = new Date();
    d.setDate(now.getDate() - (i * 7));
    const weekLabel = `W${6-i}`;
    weeks[weekLabel] = 0;
  }

  history.forEach(session => {
    const date = new Date(session.date);
    const diff = now.getTime() - date.getTime();
    const weekAgo = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
    if (weekAgo < 6) {
      const label = `W${6 - weekAgo}`;
      weeks[label] = (weeks[label] || 0) + calculateSessionVolume(session);
    }
  });

  return Object.entries(weeks).map(([name, volume]) => ({ name, volume })).reverse();
};

export const exportToCSV = (history: WorkoutSession[]) => {
  let csv = 'Date,Day,Exercise,Set Type,Label,Weight (lbs),Reps\n';
  history.forEach(session => {
    const dateStr = new Date(session.date).toLocaleDateString();
    session.exercises.forEach(ex => {
      ex.sets.forEach(set => {
        csv += `${dateStr},${session.dayName},"${ex.name}",${set.type},${set.label},${set.weight},${set.reps}\n`;
      });
    });
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `vibelift_export_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
