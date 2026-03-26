import { useState } from 'react';
import { Plus, Baby, Euro, Calendar, FileText, User, CreditCard, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { useColf } from '../hooks/useColf';

const fmt = (n: number) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(n);

const mockBuste = [
  { id: '1', lavoratore: 'Maria Esposito', mese: 'Marzo 2026', oreLavorate: 130, lordo: 1228.50, contributiInps: 282.56, netto: 945.94, stato: 'calcolata' },
  { id: '2', lavoratore: 'Ana Popescu', mese: 'Marzo 2026', oreLavorate: 87, lordo: 761.25, contributiInps: 175.09, netto: 586.16, stato: 'calcolata' },
  { id: '3', lavoratore: 'Maria Esposito', mese: 'Febbraio 2026', oreLavorate: 120, lordo: 1134.00, contributiInps: 260.82, netto: 873.18, stato: 'inviata' },
];

export default function Colf() {
  const { workers } = useColf();
  const [tab, setTab] = useState<'lavoratori' | 'buste' | 'adempimenti'>('lavoratori');
  const [showNew, setShowNew] = useState(false);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Gestione Colf & Badanti</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Amministrazione rapporti di lavoro domestico</p>
        </div>
        
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
          {[
            { key: 'lavoratori' as const, label: 'Lavoratori', icon: <User size={16}/> },
            { key: 'buste' as const, label: 'Buste Paga', icon: <CreditCard size={16}/> },
            { key: 'adempimenti' as const, label: 'Adempimenti', icon: <ShieldCheck size={16}/> },
          ].map(t => (
            <button 
              key={t.key} 
              onClick={() => setTab(t.key)} 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${tab === t.key ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white'}`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'lavoratori' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button onClick={() => setShowNew(true)} className="btn btn-primary px-5 gap-2 rounded-xl">
              <Plus size={18} /> Nuovo Rapporto
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {workers.map(c => (
              <div key={c.id} className="card p-6 hover:border-indigo-200 transition-all group">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-emerald-100">
                      {(c.fullName ?? '?').charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 group-hover:text-emerald-700 transition-colors">{c.fullName}</h3>
                      <p className="text-sm text-slate-500">{c.clientName}</p>
                    </div>
                  </div>
                  <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-1 rounded-lg font-bold uppercase tracking-wide">
                    {c.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                  <InfoItem icon={<User size={14} />} label="Livello" value={`Livello ${c.level}`} />
                  <InfoItem icon={<Calendar size={14} />} label="Orario" value={`${c.hoursPerWeek} ore/sett`} />
                  <InfoItem icon={<Euro size={14} />} label="Lordo mensile" value={fmt(c.grossSalary ?? 0)} />
                  <InfoItem icon={<Calendar size={14} />} label="Assunzione" value={c.startDate} />
                </div>
                
                <div className="flex gap-3 mt-6 pt-4 border-t border-slate-50">
                  <button onClick={() => toast('Contratto di lavoro aperto', { icon: '📄' })} className="flex-1 btn btn-secondary text-xs py-2">📄 Contratto</button>
                  <button onClick={() => setTab('buste')} className="flex-1 btn btn-secondary text-xs py-2">💼 Buste</button>
                  <button onClick={() => toast('Procedura di cessazione avviata', { icon: '⚠️' })} className="flex-1 btn btn-secondary text-xs py-2 text-rose-600 hover:bg-rose-50 hover:border-rose-200">Cessazione</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'buste' && (
        <div className="card flex flex-col overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Buste Paga Recenti</h3>
            <button onClick={() => toast.success('Calcolo busta paga avviato')} className="btn btn-primary bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-sm rounded-xl gap-2 shadow-sm shadow-emerald-200">
              <Plus size={16} /> Calcola Busta
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs font-semibold text-slate-500 border-b border-slate-100 bg-slate-50/50 uppercase tracking-wide">
                  <th className="px-6 py-4">Lavoratore</th>
                  <th className="px-6 py-4">Competenza</th>
                  <th className="px-6 py-4">Ore</th>
                  <th className="px-6 py-4">Lordo</th>
                  <th className="px-6 py-4">Netto</th>
                  <th className="px-6 py-4">Stato</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockBuste.map(b => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                          <Baby size={16} />
                        </div>
                        <span className="font-semibold text-slate-900 text-sm">{b.lavoratore}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{b.mese}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">{b.oreLavorate}h</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{fmt(b.lordo)}</td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-emerald-700 text-sm">{fmt(b.netto)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wide border ${b.stato === 'inviata' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                        {b.stato}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => toast.success('Download busta paga PDF avviato')} className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline">Scarica PDF</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'adempimenti' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: 'Versamento trimestrale INPS', desc: 'Q1 2026 — Contributi colf e badanti', scad: '10/04/2026', importo: 1847.28, status: 'da_pagare', color: 'amber' },
              { title: 'Comunicazione Assunzione', desc: 'Obbligatoria entro 24h dall\'assunzione', scad: 'Immediata', importo: 0, status: 'completata', color: 'emerald' },
              { title: 'CU Colf 2026', desc: 'Certificazione Unica anno 2025', scad: '31/03/2026', importo: 0, status: 'inviata', color: 'emerald' },
              { title: 'TFR Annuale', desc: 'Accantonamento TFR anno corrente', scad: '31/12/2026', importo: 234.50, status: 'in_corso', color: 'blue' },
            ].map((item, i) => (
              <div key={i} className="card p-6 border-l-4 hover:shadow-md transition-all" style={{ borderLeftColor: `var(--color-${item.color}-500)` }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-${item.color}-50 text-${item.color}-600`}>
                      <FileText size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{item.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wide bg-${item.color}-50 text-${item.color}-700 border border-${item.color}-100`}>
                    {item.status.replace('_', ' ')}
                  </span>
                </div>
                
                <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                    <Calendar size={14} /> Scadenza: <span className="text-slate-700">{item.scad}</span>
                  </span>
                  {item.importo > 0 && <span className="font-bold text-slate-900 text-lg">{fmt(item.importo)}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New worker modal */}
      {showNew && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-enter" onClick={() => setShowNew(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">Nuovo Rapporto Domestico</h3>
              <button onClick={() => setShowNew(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-2xl leading-none">×</button>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-5">
                {[['Nome lavoratore', 'text'], ['Codice fiscale', 'text'], ['Data assunzione', 'date'], ['Ore settimanali', 'number'], ['Paga oraria (€)', 'number'], ['Datore di lavoro', 'text']].map(([label, type], i) => (
                  <div key={i}>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">{label}</label>
                    <input type={type} className="input" />
                  </div>
                ))}
              </div>
              
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex gap-3 text-xs text-blue-700 leading-relaxed">
                <FileText size={16} className="flex-shrink-0 mt-0.5" />
                <p>Verrà generato automaticamente il contratto di assunzione secondo il CCNL Lavoro Domestico e la comunicazione obbligatoria INPS/INAIL.</p>
              </div>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-800 border-t border-slate-100 dark:border-slate-800 flex gap-3">
              <button onClick={() => setShowNew(false)} className="flex-1 btn btn-secondary">Annulla</button>
              <button onClick={() => { toast.success('Rapporto di lavoro domestico registrato!'); setShowNew(false); }} className="flex-1 btn btn-primary">Registra Rapporto</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-slate-400">{icon}</span>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{label}</p>
        <p className="text-sm font-semibold text-slate-700">{value}</p>
      </div>
    </div>
  );
}
