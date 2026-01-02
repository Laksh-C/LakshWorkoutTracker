
import React, { useState } from 'react';
import { WORKOUT_SPLIT } from '../constants';
import { DayConfig } from '../types';
import { ArrowLeft, CheckCircle2, Circle } from 'lucide-react';

interface Props {
  onBack: () => void;
  onStart: (day: DayConfig, exercises: string[]) => void;
}

const WorkoutSelection: React.FC<Props> = ({ onBack, onStart }) => {
  const [selectedDay, setSelectedDay] = useState<DayConfig | null>(null);
  const [activeExercises, setActiveExercises] = useState<string[]>([]);

  const handleDaySelect = (day: DayConfig) => {
    setSelectedDay(day);
    setActiveExercises(day.pool);
  };

  const toggleExercise = (ex: string) => {
    setActiveExercises(prev => 
      prev.includes(ex) ? prev.filter(item => item !== ex) : [...prev, ex]
    );
  };

  return (
    <div className="p-6 animate-in slide-in-from-right-4 duration-300 min-h-full">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-cyan-400 mb-10 transition-colors group">
        <ArrowLeft size={18} />
        <span className="font-black uppercase tracking-widest text-[10px]">Abandon Session</span>
      </button>

      <h2 className="text-4xl font-black mb-10 tracking-tighter">Choose Your <span className="text-cyan-400">Path.</span></h2>

      {!selectedDay ? (
        <div className="space-y-4">
          {WORKOUT_SPLIT.map(day => (
            <button
              key={day.id}
              onClick={() => handleDaySelect(day)}
              className="w-full text-left p-7 bg-slate-900/50 border border-slate-800 rounded-[2rem] hover:border-cyan-500/50 hover:bg-slate-900 transition-all group shadow-xl"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1 group-hover:text-cyan-400 transition-colors">Split {day.id}</p>
                  <p className="text-xl font-black">{day.title}</p>
                </div>
                <div className="h-10 w-10 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-700 group-hover:text-cyan-400 group-hover:border-cyan-500/30 transition-all">
                  <ChevronRight size={20} />
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-8 pb-10">
          <div className="bg-cyan-500/5 p-6 rounded-[2rem] border border-cyan-500/10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400 mb-1">Current Target</p>
            <p className="text-2xl font-black text-white leading-tight">{selectedDay.title}</p>
          </div>

          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4 px-2">Exercise Pipeline</h3>
            <div className="space-y-3">
              {selectedDay.pool.map(ex => {
                const isActive = activeExercises.includes(ex);
                return (
                  <button
                    key={ex}
                    onClick={() => toggleExercise(ex)}
                    className={`w-full flex items-center justify-between p-5 rounded-[1.5rem] border transition-all duration-200 ${
                      isActive 
                        ? 'bg-slate-900 border-cyan-500/30 shadow-lg shadow-cyan-500/5' 
                        : 'bg-slate-950 border-slate-900 text-slate-600 grayscale'
                    }`}
                  >
                    <span className={`font-black text-sm tracking-tight ${isActive ? 'text-slate-100' : 'text-slate-700'}`}>{ex}</span>
                    {isActive ? (
                      <CheckCircle2 size={20} className="text-cyan-400" />
                    ) : (
                      <Circle size={20} className="text-slate-900" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="sticky bottom-0 bg-slate-950 pt-4">
            <button
              onClick={() => onStart(selectedDay, activeExercises)}
              disabled={activeExercises.length === 0}
              className="w-full py-5 bg-cyan-500 disabled:bg-slate-900 disabled:text-slate-700 text-slate-950 rounded-full font-black text-lg shadow-2xl shadow-cyan-500/20 transition-all active:scale-95 uppercase tracking-widest"
            >
              INITIALIZE SESSION
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper for the component
function ChevronRight({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
  );
}

export default WorkoutSelection;
