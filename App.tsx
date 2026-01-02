
import React, { useState, useEffect } from 'react';
import { WorkoutSession, DayConfig } from './types';
import { APP_STORAGE_KEY } from './constants';
import Dashboard from './components/Dashboard';
import WorkoutSelection from './components/WorkoutSelection';
import ActiveWorkout from './components/ActiveWorkout';
import { History, Play, Trash2 } from 'lucide-react';

type View = 'DASHBOARD' | 'SELECTION' | 'ACTIVE' | 'HISTORY';

const App: React.FC = () => {
  const [view, setView] = useState<View>('DASHBOARD');
  const [history, setHistory] = useState<WorkoutSession[]>([]);
  const [selectedDay, setSelectedDay] = useState<DayConfig | null>(null);
  const [activeExercises, setActiveExercises] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(APP_STORAGE_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const saveHistory = (newHistory: WorkoutSession[]) => {
    setHistory(newHistory);
    localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(newHistory));
  };

  const deleteSession = (id: string, e: React.MouseEvent) => {
    // Stop propagation to prevent any potential parent click triggers
    e.stopPropagation();
    
    if (window.confirm('PERMANENT DELETION: Are you sure you want to wipe this session from the record?')) {
      const newHistory = history.filter(s => s.id !== id);
      saveHistory(newHistory);
    }
  };

  const startWorkoutSelection = () => setView('SELECTION');

  const startActiveWorkout = (day: DayConfig, exercises: string[]) => {
    setSelectedDay(day);
    setActiveExercises(exercises);
    setView('ACTIVE');
  };

  const finishWorkout = (session: WorkoutSession) => {
    const newHistory = [session, ...history];
    saveHistory(newHistory);
    setView('DASHBOARD');
  };

  return (
    <div className="min-h-screen max-w-lg mx-auto bg-slate-950 text-slate-100 flex flex-col relative pb-24 selection:bg-cyan-500/30">
      {/* Header */}
      <header className="p-6 flex justify-between items-center bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-900">
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-cyan-400 italic">VIBELIFT</h1>
          <p className="text-[10px] text-slate-500 font-bold tracking-[0.2em] uppercase">Senior Architect Edition</p>
        </div>
        <button 
          onClick={() => setView(view === 'HISTORY' ? 'DASHBOARD' : 'HISTORY')}
          className={`p-2 rounded-xl transition-all ${view === 'HISTORY' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-cyan-400'}`}
        >
          <History size={20} />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {view === 'DASHBOARD' && (
          <Dashboard 
            history={history} 
            onStart={startWorkoutSelection} 
            onExport={() => import('./utils/stats').then(m => m.exportToCSV(history))} 
          />
        )}
        
        {view === 'SELECTION' && (
          <WorkoutSelection 
            onBack={() => setView('DASHBOARD')}
            onStart={startActiveWorkout}
          />
        )}

        {view === 'ACTIVE' && selectedDay && (
          <ActiveWorkout 
            day={selectedDay}
            exerciseNames={activeExercises}
            history={history}
            onCancel={() => setView('DASHBOARD')}
            onFinish={finishWorkout}
          />
        )}

        {view === 'HISTORY' && (
           <div className="p-6 space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <button onClick={() => setView('DASHBOARD')} className="text-cyan-400 font-black text-[10px] uppercase tracking-[0.3em] mb-4 hover:opacity-80 transition-opacity">
                &larr; Return to Base
              </button>
              <h2 className="text-3xl font-black mb-8 tracking-tighter">Mission <span className="text-cyan-400">Logs</span></h2>
              <div className="space-y-4">
                {history.length === 0 && (
                  <div className="text-center py-20 border-2 border-dashed border-slate-900 rounded-[2.5rem]">
                    <p className="text-slate-600 font-bold italic">No history detected.</p>
                  </div>
                )}
                {history.map(session => (
                  <div key={session.id} className="bg-slate-900/40 p-6 rounded-[2rem] border border-slate-900 hover:border-slate-800 transition-colors shadow-xl">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <p className="font-black text-cyan-400 text-lg leading-none mb-1">{session.dayName}</p>
                        <p className="text-[10px] text-slate-600 uppercase font-black tracking-widest">{new Date(session.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                      <button 
                        type="button"
                        onClick={(e) => deleteSession(session.id, e)}
                        className="relative z-10 p-3 -mr-2 -mt-2 bg-slate-950/50 text-slate-700 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all active:scale-90"
                        title="Delete session"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="text-xs text-slate-400 space-y-2.5">
                      {session.exercises.map((ex, i) => (
                        <div key={i} className="flex justify-between items-center border-t border-slate-800/40 pt-2.5">
                          <span className="font-bold text-slate-300">{ex.name}</span>
                          <span className="text-[10px] font-black bg-slate-950 px-2 py-0.5 rounded text-slate-600 uppercase tracking-tighter">{ex.sets.filter(s => s.reps > 0 || s.weight > 0).length} Sets</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
           </div>
        )}
      </main>

      {/* Persistent Bottom Button */}
      {view === 'DASHBOARD' && (
        <div className="fixed bottom-0 left-0 right-0 p-6 flex justify-center pointer-events-none z-40">
          <button 
            onClick={startWorkoutSelection}
            className="pointer-events-auto bg-cyan-500 hover:bg-cyan-400 active:scale-95 transition-all text-slate-950 py-4 px-10 rounded-full font-black shadow-[0_0_20px_rgba(34,211,238,0.3)] flex items-center gap-3"
          >
            <Play fill="currentColor" size={20} />
            START WORKOUT
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
