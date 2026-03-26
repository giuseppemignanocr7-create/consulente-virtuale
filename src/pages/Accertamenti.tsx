import { useState } from 'react';
import { Upload, Scale, AlertCircle, CheckCircle, Clock, ChevronRight, FileText, ShieldCheck } from 'lucide-react';
import { mockAssessments } from '../data/mockData';
import type { AssessmentCategory, AssessmentStatus } from '../types';
import toast from 'react-hot-toast';

const fmt = (n: number) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);

const catLabel: Record<AssessmentCategory, string> = { imposte_dirette: 'Imposte Dirette', iva: 'IVA', registro: 'Registro', locale: 'Tributi Locali', contributivo: 'Contributivo' };
const catColor: Record<AssessmentCategory, string> = { imposte_dirette: 'bg-rose-50 text-rose-700 border-rose-100', iva: 'bg-amber-50 text-amber-700 border-amber-100', registro: 'bg-violet-50 text-violet-700 border-violet-100', locale: 'bg-blue-50 text-blue-700 border-blue-100', contributivo: 'bg-emerald-50 text-emerald-700 border-emerald-100' };
const statusConfig: Record<AssessmentStatus, { label: string; color: string; icon: React.ReactNode }> = {
  caricato: { label: 'Caricato', color: 'bg-slate-100 text-slate-600 border-slate-200', icon: <Clock size={12} /> },
  in_valutazione: { label: 'In valutazione', color: 'bg-amber-50 text-amber-700 border-amber-100', icon: <Clock size={12} /> },
  documenti_richiesti: { label: 'Doc. Richiesti', color: 'bg-orange-50 text-orange-700 border-orange-100', icon: <AlertCircle size={12} /> },
  in_lavorazione: { label: 'In lavorazione', color: 'bg-blue-50 text-blue-700 border-blue-100', icon: <Clock size={12} /> },
  concluso: { label: 'Concluso', color: 'bg-emerald-50 text-emerald-700 border-emerald-100', icon: <CheckCircle size={12} /> },
};

export default function Accertamenti() {
  const [showNew, setShowNew] = useState(false);
  const [catFilter, setCatFilter] = useState<AssessmentCategory | null>(null);

  const filteredAssessments = catFilter 
    ? mockAssessments.filter(a => a.category === catFilter)
    : mockAssessments;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Hero banner */}
      <div className="card border-none bg-gradient-to-br from-slate-900 to-indigo-900 p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center flex-shrink-0 border border-white/20 shadow-lg">
            <Scale size={28} className="text-indigo-200" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">Accertamenti Tributari</h2>
            <p className="text-indigo-100 text-sm leading-relaxed max-w-2xl">
              Hai ricevuto un avviso? Caricalo subito: analizziamo la tua situazione, calcoliamo i termini di impugnazione e definiamo la migliore strategia difensiva.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <Badge text="Valutazione gratuita" />
              <Badge text="Calcolo termini automatico" />
              <Badge text="Success fee disponibile" />
            </div>
          </div>
          <button 
            onClick={() => setShowNew(true)} 
            className="btn bg-white text-indigo-900 hover:bg-indigo-50 font-bold px-6 py-3 shadow-lg shadow-indigo-900/20 whitespace-nowrap"
          >
            <Upload size={18} className="mr-2" /> Carica Atto
          </button>
        </div>
      </div>

      {/* Category quick access */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {(Object.entries(catLabel) as [AssessmentCategory, string][]).map(([k, v]) => (
          <button key={k} onClick={() => setCatFilter(catFilter === k ? null : k)} className={`card p-4 flex flex-col items-center justify-center text-center gap-2 hover:border-indigo-200 hover:shadow-md transition-all group border ${catFilter === k ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950 dark:border-indigo-700 shadow-md' : ''}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-transform group-hover:scale-110 ${catColor[k]}`}>
              {k === 'imposte_dirette' ? '📊' : k === 'iva' ? '🧾' : k === 'registro' ? '📋' : k === 'locale' ? '🏛️' : '🏦'}
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{v}</span>
          </button>
        ))}
      </div>

      {/* Existing assessments */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-lg px-1">Pratiche in corso</h3>
        <div className="grid gap-4">
          {filteredAssessments.map(a => {
            const s = statusConfig[a.status];
            const notifDate = new Date(a.notificationDate);
            const scadenza60 = new Date(notifDate); scadenza60.setDate(scadenza60.getDate() + 60);
            const scadenza30 = new Date(notifDate); scadenza30.setDate(scadenza30.getDate() + 30);
            
            return (
              <div key={a.id} className="card p-6 hover:border-indigo-200 transition-all">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm ${catColor[a.category]}`}>
                        {catLabel[a.category].includes('Dirette') ? '📊' : catLabel[a.category].includes('IVA') ? '🧾' : catLabel[a.category].includes('Locale') ? '🏛️' : '📋'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border uppercase tracking-wide ${catColor[a.category]}`}>
                            {catLabel[a.category]}
                          </span>
                          <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg border uppercase tracking-wide ${s.color}`}>
                            {s.icon} {s.label}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-slate-900 dark:text-white">{a.description}</h4>
                        {a.clientName && <p className="text-xs text-slate-500 font-medium mt-0.5">Cliente: {a.clientName}</p>}
                      </div>
                    </div>
                    
                    <div className="mt-6 grid grid-cols-3 gap-4">
                      <InfoPill label="Notifica" value={a.notificationDate} icon={<Clock size={14}/>} />
                      <InfoPill label="Termine 30gg" value={scadenza30.toISOString().split('T')[0]} urgent={new Date() > scadenza30} icon={<AlertCircle size={14}/>} />
                      <InfoPill label="Termine 60gg" value={scadenza60.toISOString().split('T')[0]} urgent={new Date() > scadenza60} icon={<Scale size={14}/>} />
                    </div>
                  </div>

                  <div className="flex flex-col justify-between items-end border-l border-slate-100 pl-6 min-w-[140px]">
                    <div className="text-right">
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Valore Contesa</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">{fmt(a.amount)}</p>
                    </div>
                    
                    {a.status === 'documenti_richiesti' ? (
                      <button onClick={() => toast('Caricamento documenti aggiuntivi', { icon: '📂' })} className="btn bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200 text-xs w-full mt-4">
                        Carica Doc <ChevronRight size={14} className="ml-1" />
                      </button>
                    ) : (
                      <button onClick={() => toast('Dettaglio pratica aperto', { icon: '📋' })} className="btn btn-secondary text-xs w-full mt-4">
                        Dettagli
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* New assessment modal */}
      {showNew && <AssessmentWizard onClose={() => setShowNew(false)} />}
    </div>
  );
}

function AssessmentWizard({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ category: 'imposte_dirette', notificationDate: '', amount: '', description: '' });

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-enter" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="bg-slate-900 p-6 text-white relative">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-bold text-lg">Carica Accertamento</h3>
            <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">×</button>
          </div>
          <div className="flex gap-2 mt-6">
            {[1, 2, 3, 4].map(s => (
              <div key={s} className={`flex-1 h-1 rounded-full transition-all duration-500 ${s <= step ? 'bg-indigo-500' : 'bg-slate-700'}`}></div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-2">
            <span>Tipo</span><span>Upload</span><span>Dettagli</span><span>Incarico</span>
          </div>
        </div>

        <div className="p-8">
          {step === 1 && (
            <div className="space-y-4 animate-enter">
              <p className="text-sm font-semibold text-slate-900">Seleziona la categoria dell'atto ricevuto:</p>
              <div className="grid gap-3">
                {(Object.entries(catLabel) as [AssessmentCategory, string][]).map(([k, v]) => (
                  <label key={k} className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all group ${form.category === k ? 'border-indigo-500 bg-indigo-50/50 shadow-sm' : 'border-slate-200 hover:border-indigo-300'}`}>
                    <input type="radio" name="cat" checked={form.category === k} onChange={() => setForm({ ...form, category: k })} className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500" />
                    <span className={`text-xs px-2.5 py-1 rounded-lg font-bold uppercase tracking-wide border ${catColor[k]}`}>{v}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-enter">
              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-10 text-center hover:border-indigo-400 hover:bg-slate-50 transition-colors cursor-pointer group">
                <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                  <FileText size={32} />
                </div>
                <p className="font-semibold text-slate-900">Clicca per caricare il PDF</p>
                <p className="text-xs text-slate-500 mt-1">o trascina il file qui (max 20MB)</p>
              </div>
              <div className="flex items-start gap-3 p-4 bg-blue-50 text-blue-700 rounded-xl border border-blue-100 text-xs leading-relaxed">
                <Clock size={16} className="flex-shrink-0 mt-0.5" />
                <p><strong>Importante:</strong> La data di notifica è fondamentale per il calcolo dei termini. Assicurati che sia leggibile nel documento.</p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5 animate-enter">
              <FormField 
                label="Data di notifica" 
                type="date" 
                value={form.notificationDate} 
                onChange={v => setForm({ ...form, notificationDate: v })} 
                alert={!form.notificationDate}
              />
              <FormField 
                label="Importo contestato (€)" 
                type="number" 
                value={form.amount} 
                onChange={v => setForm({ ...form, amount: v })} 
                placeholder="0.00" 
              />
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Descrizione</label>
                <textarea 
                  value={form.description} 
                  onChange={e => setForm({ ...form, description: e.target.value })} 
                  rows={3} 
                  className="w-full input py-3 min-h-[100px]" 
                  placeholder="Note aggiuntive..." 
                />
              </div>
              
              {form.notificationDate && (
                <div className="p-4 bg-rose-50 rounded-xl border border-rose-100 text-xs space-y-2">
                  <p className="font-bold text-rose-800 flex items-center gap-2"><Clock size={14}/> Scadenze Calcolate:</p>
                  <div className="flex justify-between text-rose-700">
                    <span>Accertamento con adesione</span>
                    <span className="font-mono font-semibold">+60gg</span>
                  </div>
                  <div className="flex justify-between text-rose-700">
                    <span>Ricorso CTP</span>
                    <span className="font-mono font-semibold">+60gg</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-enter">
              <h4 className="font-semibold text-slate-900">Modalità di Compenso</h4>
              <div className="grid gap-3">
                {[
                  { id: 'fisso', label: 'Compenso Fisso', desc: 'Tariffa oraria standard' },
                  { id: 'success', label: 'Success Fee', desc: '% sul risparmio ottenuto' },
                  { id: 'misto', label: 'Misto', desc: 'Fisso ridotto + Success fee' },
                ].map(opt => (
                  <label key={opt.id} className="flex items-start gap-4 p-4 border rounded-xl hover:border-indigo-400 cursor-pointer transition-colors bg-white">
                    <input type="radio" name="fee" className="mt-1 w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500" />
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{opt.label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600">
                <ShieldCheck size={16} className="text-indigo-600 flex-shrink-0" />
                <p>Riceverai un preventivo formale e la lettera di incarico da firmare digitalmente.</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-100 flex justify-between bg-slate-50">
          {step > 1 ? (
            <button onClick={() => setStep(step - 1)} className="btn btn-ghost px-4">Indietro</button>
          ) : (
            <div></div>
          )}
          
          {step < 4 ? (
            <button onClick={() => setStep(step + 1)} className="btn btn-primary bg-indigo-600 hover:bg-indigo-700 px-6">Avanti</button>
          ) : (
            <button onClick={() => { toast.success('Accertamento inviato con successo! Riceverai il preventivo a breve.'); onClose(); }} className="btn btn-primary bg-emerald-600 hover:bg-emerald-700 px-6 gap-2 shadow-lg shadow-emerald-200">
              <CheckCircle size={18} /> Conferma Invio
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Badge({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-1.5 text-xs font-medium bg-white/10 backdrop-blur-sm border border-white/10 px-3 py-1.5 rounded-lg text-indigo-50">
      <CheckCircle size={12} className="text-emerald-400" /> {text}
    </div>
  );
}

function InfoPill({ label, value, urgent, icon }: { label: string; value: string; urgent?: boolean; icon: React.ReactNode }) {
  return (
    <div className={`p-3 rounded-xl border ${urgent ? 'bg-rose-50 border-rose-100' : 'bg-slate-50 border-slate-100'}`}>
      <p className={`text-[10px] font-bold uppercase tracking-wide mb-1 flex items-center gap-1.5 ${urgent ? 'text-rose-600' : 'text-slate-400'}`}>
        {icon} {label}
      </p>
      <p className={`text-sm font-semibold ${urgent ? 'text-rose-900' : 'text-slate-700'}`}>{value}</p>
    </div>
  );
}

function FormField({ label, value, onChange, placeholder, type = 'text', alert }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; alert?: boolean }) {
  return (
    <div>
      <label className={`block text-xs font-bold uppercase tracking-wide mb-1.5 ${alert ? 'text-rose-500' : 'text-slate-500'}`}>
        {label} {alert && '*'}
      </label>
      <input 
        type={type} 
        value={value} 
        onChange={e => onChange(e.target.value)} 
        placeholder={placeholder} 
        className={`input ${alert ? 'border-rose-300 focus:ring-rose-200' : ''}`}
      />
    </div>
  );
}
