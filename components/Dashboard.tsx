
import React, { useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Cell } from 'recharts';
import { WorkoutSession } from '../types';
import { getWeeklyVolumeData } from '../utils/stats';
import { Zap, Activity, Download, ChevronRight } from 'lucide-react';

interface Props {
  history: WorkoutSession[];
  onStart: () => void;
  onExport: () => void;
}

const Dashboard: React.FC<Props> = ({ history, onStart, onExport }) => {
  const chartData = useMemo(() => getWeeklyVolumeData(history), [history]);
  
  const lastWorkout = history[0];
  const totalVolume = useMemo(() => {
    if (!lastWorkout) return 0;
    return lastWorkout.exercises.reduce((exAcc, ex) => {
        return exAcc + ex.sets.reduce((sAcc, s) => sAcc + (s.weight * s.reps), 0);
    }, 0);
  }, [lastWorkout]);

  return (
    <div className="p-6 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Volume Chart */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
            <Activity size={14} className="text-cyan-400" />
            Performance Volume
          </h2>
          <span className="text-[10px] font-bold bg-cyan-500/10 text-cyan-400 px-2 py-1 rounded-full border border-cyan-500/20">LBS</span>
        </div>
        
        <div className="h-44 w-full bg-slate-900/40 rounded-[2.5rem] p-6 border border-slate-900/80 shadow-inner">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <Bar dataKey="volume" radius={[6, 6, 6, 6]}>
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={index === chartData.length - 1 ? '#22d3ee' : '#1e293b'} 
                  />
                ))}
              </Bar>
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#475569', fontSize: 10, fontWeight: 700}} 
              />
              <Tooltip 
                cursor={{fill: 'rgba(255,255,255,0.02)'}}
                contentStyle={{backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', fontSize: '12px'}}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Latest Stats */}
      <section className="bg-slate-900 rounded-[2.5rem] p-7 border border-slate-800 relative overflow-hidden group shadow-2xl">
        <div className="absolute -top-4 -right-4 p-4 opacity-[0.03] group-hover:scale-110 transition-transform text-cyan-400">
          <Zap size={120} />
        </div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6">Last Activity</h3>
        {lastWorkout ? (
          <div className="space-y-6">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-100 tracking-tighter">{lastWorkout.dayName.split(' ')[1]}</span>
              <span className="text-slate-500 font-bold text-xs uppercase tracking-widest">{new Date(lastWorkout.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-950/50 p-4 rounded-3xl border border-slate-800/50">
                <p className="text-[10px] text-slate-600 font-black uppercase mb-1 tracking-wider">Volume</p>
                <p className="text-2xl font-black text-cyan-400">{totalVolume.toLocaleString()}<span className="text-xs ml-1 opacity-50">lbs</span></p>
              </div>
              <div className="bg-slate-950/50 p-4 rounded-3xl border border-slate-800/50">
                <p className="text-[10px] text-slate-600 font-black uppercase mb-1 tracking-wider">Exercises</p>
                <p className="text-2xl font-black text-white">{lastWorkout.exercises.length}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-slate-500 italic text-sm">Waiting for your first lift...</p>
          </div>
        )}
      </section>

      {/* Tools */}
      <section className="space-y-3">
         <button 
           onClick={onExport}
           className="w-full flex items-center justify-between p-6 bg-slate-900/30 border border-slate-900 rounded-[2rem] hover:bg-slate-900 hover:border-slate-800 transition-all group"
         >
           <div className="flex items-center gap-5">
             <div className="p-3.5 rounded-2xl bg-cyan-500/10 text-cyan-500 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all">
               <Download size={20} />
             </div>
             <div className="text-left">
               <p className="font-black text-slate-200 uppercase text-xs tracking-widest">Export History</p>
               <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">Generate CSV Data</p>
             </div>
           </div>
           <ChevronRight size={18} className="text-slate-700 group-hover:text-cyan-400 transition-colors" />
         </button>
      </section>
    </div>
  );
};

export default Dashboard;
