import { useState } from 'react';
import { ShieldCheck, Plus, FileText, CheckCircle, AlertTriangle, Clock, MoreHorizontal, Search, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDVR } from '../hooks/useDVR';

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  valido: { label: 'Valido', color: 'bg-emerald-50 text-emerald-700 border-emerald-100', icon: <CheckCircle size={14} /> },
  firmato: { label: 'Firmato', color: 'bg-emerald-50 text-emerald-700 border-emerald-100', icon: <CheckCircle size={14} /> },
  completato: { label: 'Completato', color: 'bg-blue-50 text-blue-700 border-blue-100', icon: <CheckCircle size={14} /> },
  scaduto: { label: 'Scaduto', color: 'bg-rose-50 text-rose-700 border-rose-100', icon: <AlertTriangle size={14} /> },
  bozza: { label: 'In redazione', color: 'bg-amber-50 text-amber-700 border-amber-100', icon: <Clock size={14} /> },
};

export default function DVR() {
  const { dvrs, stats } = useDVR();
  const [showNew, setShowNew] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Banner */}
      <div className="card bg-gradient-to-r from-amber-500 to-orange-600 p-8 text-white border-none relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <ShieldCheck size={24} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Sicurezza sul Lavoro (D.Lgs. 81/08)</h2>
          </div>
          <p className="text-orange-50 text-sm leading-relaxed max-w-2xl mb-6">
            Gestione centralizzata dei Documenti di Valutazione dei Rischi. Monitora scadenze, aggiornamenti normativi e adempimenti obbligatori per i tuoi clienti.
          </p>
          <div className="flex flex-wrap gap-3">
            <Badge text="Redazione guidata" />
            <Badge text="Aggiornamento automatico" />
            <Badge text="Firma P7M integrata" />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          label="DVR Gestiti" 
          value={String(stats.total)} 
          icon={<FileText size={20} className="text-indigo-600" />}
          color="text-slate-900" 
        />
        <StatCard 
          label="In Scadenza" 
          value={String(stats.inScadenza)} 
          icon={<AlertTriangle size={20} className="text-rose-600" />}
          color="text-rose-600" 
        />
        <StatCard 
          label="Conformi" 
          value={String(stats.firmati)} 
          icon={<CheckCircle size={20} className="text-emerald-600" />}
          color="text-emerald-600" 
        />
      </div>

      {/* Actions & List */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              placeholder="Cerca cliente o settore..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-amber-500 text-slate-700 dark:text-white font-medium"
            />
          </div>
          <button onClick={() => setShowNew(true)} className="btn btn-primary bg-amber-600 hover:bg-amber-700 text-white gap-2 px-6 rounded-xl shadow-lg shadow-amber-200">
            <Plus size={18} /> Nuovo DVR
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {dvrs.map(dvr => {
            const s = statusConfig[dvr.status] ?? statusConfig.bozza;
            return (
              <div key={dvr.id} onClick={() => setSelectedId(dvr.id)} className={`card p-6 hover:border-amber-200 hover:shadow-md transition-all cursor-pointer group flex flex-col h-full ${selectedId === dvr.id ? 'border-amber-300 shadow-md' : ''}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-orange-100">
                    {(dvr.clientName ?? dvr.title).charAt(0)}
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); toast('Opzioni DVR', { icon: '⚙️' }); }} className="text-slate-300 hover:text-slate-600 transition-colors">
                    <MoreHorizontal size={20} />
                  </button>
                </div>
                
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1 group-hover:text-amber-700 transition-colors">{dvr.clientName ?? dvr.title}</h4>
                  <p className="text-xs text-slate-500 font-medium mb-4">{dvr.title}</p>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide border ${s.color}`}>
                      {s.icon} {s.label}
                    </span>
                    <span className="text-xs text-slate-500 font-medium bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                      👷 {dvr.workersCount ?? '—'} lav.
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    <span className="text-[10px] font-medium bg-slate-50 text-slate-600 px-2 py-1 rounded-md border border-slate-100">v{dvr.version}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-50 flex items-center justify-between mt-auto">
                  <p className="text-xs text-slate-400 font-medium">Rev. {dvr.reviewDate}</p>
                  <div className="flex gap-2">
                    <button onClick={(e) => { e.stopPropagation(); toast('Anteprima DVR aperta', { icon: '📄' }); }} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
                      <FileText size={18} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); toast.success('Download DVR avviato'); }} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                      <Download size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legal info */}
      <div className="card bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 p-6">
        <h4 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
          <FileText size={16} className="text-slate-400" />
          Riferimenti Normativi
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
          {[
            'D.Lgs. 81/2008 — Testo Unico Sicurezza sul Lavoro',
            'Art. 17 D.Lgs. 81/2008 — Obblighi non delegabili del datore di lavoro',
            'Art. 28 D.Lgs. 81/2008 — Oggetto della valutazione dei rischi',
            'D.Lgs. 106/2009 — Disposizioni integrative e correttive',
            'Accordo Stato-Regioni 21/12/2011 — Formazione sicurezza',
            'D.Lgs. 231/2001 — Responsabilità amministrativa degli enti',
          ].map((ref, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
              <CheckCircle size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
              <span>{ref}</span>
            </div>
          ))}
        </div>
      </div>

      {/* New DVR modal */}
      {showNew && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-enter" onClick={() => setShowNew(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">Nuovo DVR</h3>
              <button onClick={() => setShowNew(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-2xl leading-none">×</button>
            </div>
            
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Cliente</label>
                <div className="relative">
                  <select className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-amber-500 text-slate-700 font-medium">
                    <option>Rossi & Neri SNC</option>
                    <option>Tech Solutions SRL</option>
                    <option>ASD Sportiva Romana</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Settore Attività</label>
                <input placeholder="Es. Commercio al dettaglio" className="input" />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">N° Lavoratori</label>
                  <input type="number" placeholder="Es. 5" className="input" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Data Redazione</label>
                  <input type="date" className="input" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Tipologie di Rischio</label>
                <div className="flex flex-wrap gap-2">
                  {['Scivolamento', 'Incendio', 'Elettrico', 'Videoterminali', 'Chimico', 'Rumore', 'Ergonomia', 'Stress lavoro correlato'].map(r => (
                    <label key={r} className="flex items-center gap-2 text-xs bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-200 px-3 py-2 rounded-lg cursor-pointer transition-all">
                      <input type="checkbox" className="w-3.5 h-3.5 text-amber-600 border-slate-300 rounded focus:ring-amber-500" />
                      <span className="text-slate-700 font-medium">{r}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3 text-xs text-amber-800 leading-relaxed">
                <ShieldCheck size={16} className="flex-shrink-0 mt-0.5 text-amber-600" />
                <p>Il DVR sarà redatto secondo gli standard D.Lgs. 81/2008 e predisposto per la firma digitale (P7M) del datore di lavoro e RSPP.</p>
              </div>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-800 border-t border-slate-100 dark:border-slate-800 flex gap-3">
              <button onClick={() => setShowNew(false)} className="flex-1 btn btn-secondary">Annulla</button>
              <button onClick={() => { toast.success('DVR generato con successo!'); setShowNew(false); }} className="flex-1 btn btn-primary bg-amber-600 hover:bg-amber-700 text-white border-none shadow-lg shadow-amber-200 dark:shadow-amber-900/30">Genera DVR</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color, icon }: { label: string; value: string; color: string; icon: React.ReactNode }) {
  return (
    <div className="card p-5 flex items-center justify-between hover:border-amber-200 transition-colors">
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

function Badge({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-1.5 text-xs font-medium bg-white/20 backdrop-blur-sm border border-white/10 px-3 py-1.5 rounded-lg text-white">
      <CheckCircle size={12} className="text-white" /> {text}
    </div>
  );
}
