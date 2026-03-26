import { useState } from 'react';
import { Calendar, CheckCircle, Clock, AlertTriangle, AlertCircle, Bell, CheckSquare } from 'lucide-react';
import toast from 'react-hot-toast';
import { mockDeadlines } from '../data/mockData';

const typeColor: Record<string, string> = { inps: 'bg-blue-50 text-blue-700 border-blue-100', inail: 'bg-purple-50 text-purple-700 border-purple-100', ade: 'bg-orange-50 text-orange-700 border-orange-100', altro: 'bg-slate-50 text-slate-600 border-slate-200' };
const urgencyConfig = {
  normale: { color: 'bg-emerald-500', label: 'Regolare', textColor: 'text-emerald-700', bg: 'bg-emerald-50' },
  imminente: { color: 'bg-amber-500', label: 'Imminente', textColor: 'text-amber-700', bg: 'bg-amber-50' },
  scaduta: { color: 'bg-rose-500', label: 'Scaduta', textColor: 'text-rose-700', bg: 'bg-rose-50' },
};

export default function Scadenze() {
  const [deadlines, setDeadlines] = useState(mockDeadlines);
  const [filter, setFilter] = useState<'tutte' | 'urgenti' | 'completate'>('tutte');

  const toggle = (id: string) => {
    setDeadlines(prev => prev.map(d => d.id === id ? { ...d, completed: !d.completed } : d));
    const dl = deadlines.find(d => d.id === id);
    if (dl && !dl.completed) toast.success(`"${dl.title}" completata`);
  };

  const filtered = deadlines.filter(d => {
    if (filter === 'urgenti') return (d.urgency === 'imminente' || d.urgency === 'scaduta') && !d.completed;
    if (filter === 'completate') return d.completed;
    return true;
  });

  const stats = {
    scadute: deadlines.filter(d => d.urgency === 'scaduta' && !d.completed).length,
    imminenti: deadlines.filter(d => d.urgency === 'imminente' && !d.completed).length,
    completate: deadlines.filter(d => d.completed).length,
    totali: deadlines.length,
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Scadenze & Adempimenti</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Gestisci le tue scadenze fiscali e previdenziali</p>
        </div>
        
        {/* Filters */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
          {[
            { key: 'tutte', label: 'Tutte' },
            { key: 'urgenti', label: 'Urgenti' },
            { key: 'completate', label: 'Completate' },
          ].map(f => (
            <button 
              key={f.key} 
              onClick={() => setFilter(f.key as typeof filter)} 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === f.key ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Totali" value={stats.totali} color="text-slate-900" icon={<Calendar size={20} className="text-indigo-600"/>} />
        <StatCard label="Scadute" value={stats.scadute} color="text-rose-600" icon={<AlertCircle size={20} className="text-rose-600"/>} />
        <StatCard label="Imminenti" value={stats.imminenti} color="text-amber-600" icon={<Clock size={20} className="text-amber-600"/>} />
        <StatCard label="Completate" value={stats.completate} color="text-emerald-600" icon={<CheckCircle size={20} className="text-emerald-600"/>} />
      </div>

      {/* AI alert */}
      <div className="card bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white border-none relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="relative z-10 flex items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg flex-shrink-0">
            <Bell size={24} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-lg font-bold mb-1">Alert AI Attivi</p>
            <p className="text-indigo-100 text-sm leading-relaxed max-w-2xl">
              Il sistema monitora le tue scadenze e ti invia notifiche automatiche a -30, -15, -7 e -1 giorni.
            </p>
          </div>
          <button onClick={() => toast.success('Configurazione alert aperta')} className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl text-sm font-semibold transition-colors border border-white/10 whitespace-nowrap">
            Configura Alert
          </button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {filtered.map(d => {
          const u = urgencyConfig[d.urgency];
          return (
            <div key={d.id} className={`card p-5 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all ${d.completed ? 'opacity-60 bg-slate-50 dark:bg-slate-800/50' : ''}`}>
              <div className="flex items-start gap-5">
                <button 
                  onClick={() => toggle(d.id)} 
                  className={`mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${d.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 hover:border-indigo-400 text-transparent'}`}
                >
                  <CheckCircle size={16} strokeWidth={3} />
                </button>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                    <div>
                      <h3 className={`text-base font-bold ${d.completed ? 'text-slate-500 line-through decoration-slate-400' : 'text-slate-900 dark:text-white'}`}>{d.title}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{d.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border uppercase tracking-wide ${typeColor[d.type]}`}>
                        {d.type.toUpperCase()}
                      </span>
                      {d.clientName && (
                        <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                          👤 {d.clientName}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-3">
                    <div className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg font-bold uppercase tracking-wide ${u.bg} ${u.textColor}`}>
                      {d.urgency === 'scaduta' ? <AlertTriangle size={14} /> : d.urgency === 'imminente' ? <Clock size={14} /> : <CheckSquare size={14} />}
                      {u.label}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                      <Calendar size={14} />
                      <span>Scadenza: <span className="text-slate-700 dark:text-slate-300">{d.date}</span></span>
                    </div>
                    {!d.completed && (
                      <div className={`flex items-center gap-1.5 text-xs font-medium ${urgencyConfig[d.urgency].textColor}`}>
                        <Clock size={14} />
                        <span>{d.urgency === 'scaduta' ? 'Scaduta' : d.urgency === 'imminente' ? 'Entro 7 giorni' : 'Nei prossimi mesi'}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {filtered.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 border-dashed">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-emerald-400" />
            </div>
            <h3 className="text-slate-900 dark:text-white font-bold text-lg">Nessuna scadenza</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Non ci sono scadenze in questa categoria</p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, color, icon }: { label: string; value: number; color: string; icon: React.ReactNode }) {
  return (
    <div className="card p-5 flex items-center justify-between">
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">{label}</p>
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
      </div>
      <div className="p-3 bg-slate-50 rounded-xl">
        {icon}
      </div>
    </div>
  );
}
