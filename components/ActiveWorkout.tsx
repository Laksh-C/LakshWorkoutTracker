
import React, { useState, useMemo } from 'react';
import { DayConfig, WorkoutSession, ExerciseLog, SetEntry } from '../types';
import { getPreviousBest } from '../utils/stats';
import { CheckCircle, X, ChevronRight, Trophy } from 'lucide-react';

interface Props {
  day: DayConfig;
  exerciseNames: string[];
  history: WorkoutSession[];
  onCancel: () => void;
  onFinish: (session: WorkoutSession) => void;
}

const ActiveWorkout: React.FC<Props> = ({ day, exerciseNames, history, onCancel, onFinish }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  
  // Initialize with exactly 4 sets as required
  const initialLogs: ExerciseLog[] = useMemo(() => exerciseNames.map(name => ({
    name,
    sets: [
      { weight: 0, reps: 0, type: 'warmup', label: 'Warmup' },
      { weight: 0, reps: 0, type: 'working', label: 'Working Set 1' },
      { weight: 0, reps: 0, type: 'working', label: 'Working Set 2' },
      { weight: 0, reps: 0, type: 'working', label: 'Working Set 3' },
    ]
  })), [exerciseNames]);

  const [logs, setLogs] = useState<ExerciseLog[]>(initialLogs);

  const currentEx = logs[currentIdx];
  const previousBest = useMemo(() => getPreviousBest(currentEx.name, history), [currentEx.name, history]);

  const updateSet = (setIdx: number, field: keyof SetEntry, val: number) => {
    const newLogs = [...logs];
    // Safety check since we have fixed structure
    if (newLogs[currentIdx].sets[setIdx]) {
      (newLogs[currentIdx].sets[setIdx] as any)[field] = val;
    }
    setLogs(newLogs);
  };

  const nextExercise = () => {
    if (currentIdx < logs.length - 1) {
      setCurrentIdx(currentIdx + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevExercise = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleFinish = () => {
    const session: WorkoutSession = {
      id: Date.now().toString(),
      date: Date.now(),
      dayName: day.title,
      // Only keep exercises that have some input
      exercises: logs.filter(l => l.sets.some(s => s.reps > 0 || s.weight > 0))
    };
    onFinish(session);
  };

  return (
    <div className="flex flex-col min-h-full bg-slate-950 animate-in fade-in zoom-in-95 duration-300 pb-24">
      {/* Progress */}
      <div className="px-6 pt-2 flex gap-1.5 h-1">
        {logs.map((_, i) => (
          <div 
            key={i} 
            className={`h-full flex-1 rounded-full transition-all duration-500 ${
              i === currentIdx ? 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.6)]' : i < currentIdx ? 'bg-cyan-900/50' : 'bg-slate-900'
            }`} 
          />
        ))}
      </div>

      <header className="px-6 py-10 flex justify-between items-start">
        <div className="flex-1">
          <p className="text-[10px] font-black tracking-[0.3em] text-cyan-400 uppercase mb-2">
            STATION {currentIdx + 1} OF {logs.length}
          </p>
          <h2 className="text-3xl font-black leading-tight tracking-tight text-white">{currentEx.name}</h2>
        </div>
        <button onClick={onCancel} className="p-2.5 bg-slate-900 rounded-2xl text-slate-600 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </header>

      {/* Progressive Overload Insight */}
      <div className="px-6 mb-10">
        <div className="bg-slate-900/50 border border-slate-800 rounded-[2rem] p-6 flex items-center justify-between shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-[0.05] text-cyan-400">
            <Trophy size={60} />
          </div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="bg-cyan-500/10 p-3 rounded-2xl text-cyan-400 border border-cyan-500/20">
              <Trophy size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Target to Beat</p>
              <p className="text-xl font-black text-white">
                {previousBest ? (
                  <>
                    <span className="text-cyan-400">{previousBest.weight}lbs</span>
                    <span className="text-slate-500 mx-2">×</span>
                    <span>{previousBest.reps} reps</span>
                  </>
                ) : (
                  <span className="text-slate-400 italic font-bold">New Record Opportunity</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Strict 4-Set Inputs */}
      <div className="px-6 space-y-4">
        {currentEx.sets.map((set, sIdx) => {
          const isWarmup = set.type === 'warmup';
          return (
            <div 
              key={sIdx} 
              className={`rounded-[2rem] p-6 border transition-all duration-300 ${
                isWarmup 
                  ? 'bg-slate-900/30 border-slate-900' 
                  : 'bg-slate-900 border-slate-800 shadow-lg'
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                  isWarmup 
                    ? 'text-slate-500 border-slate-800 bg-slate-950/50' 
                    : 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5'
                }`}>
                  {set.label}
                </span>
                {!isWarmup && (
                  <span className="text-[10px] text-slate-600 font-bold uppercase tracking-tighter">Working Block</span>
                )}
              </div>
              
              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">LBS</label>
                  <input 
                    type="number" 
                    value={set.weight || ''}
                    onChange={(e) => updateSet(sIdx, 'weight', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 px-5 font-black text-2xl text-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all placeholder:text-slate-900"
                  />
                </div>

                <div className="flex-1 space-y-2">
                  <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">REPS</label>
                  <input 
                    type="number" 
                    value={set.reps || ''}
                    onChange={(e) => updateSet(sIdx, 'reps', parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 px-5 font-black text-2xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all placeholder:text-slate-900"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sticky Bottom Controls */}
      <footer className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto p-6 bg-slate-950/80 backdrop-blur-xl border-t border-slate-900 flex gap-4 z-50">
        {currentIdx > 0 ? (
          <button 
            onClick={prevExercise}
            className="flex-1 py-5 bg-slate-900 text-slate-400 rounded-full font-black text-xs uppercase tracking-[0.2em] transition-all hover:bg-slate-800 active:scale-95"
          >
            PREV
          </button>
        ) : null}

        {currentIdx < logs.length - 1 ? (
          <button 
            onClick={nextExercise}
            className="flex-[2] py-5 bg-cyan-500 text-slate-950 rounded-full font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-2xl shadow-cyan-500/20 transition-all active:scale-95"
          >
            NEXT STATION
            <ChevronRight size={16} strokeWidth={3} />
          </button>
        ) : (
          <button 
            onClick={handleFinish}
            className="flex-[2] py-5 bg-white text-slate-950 rounded-full font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-2xl transition-all active:scale-95"
          >
            <CheckCircle size={16} strokeWidth={3} />
            COMPLETE SESSION
          </button>
        )}
      </footer>
    </div>
  );
};

export default ActiveWorkout;
