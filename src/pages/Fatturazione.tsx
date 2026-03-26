import { useState } from 'react';
import { Plus, Search, Download, Send, Eye, FileText, CheckCircle, XCircle, Clock, AlertCircle, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import { useInvoices } from '../hooks/useInvoices';
import type { Invoice, InvoiceStatus } from '../types';

const fmt = (n: number) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(n);

const statusConfig: Record<InvoiceStatus, { label: string; color: string; icon: React.ReactNode }> = {
  bozza: { label: 'Bozza', color: 'bg-slate-100 text-slate-600 border-slate-200', icon: <Clock size={12} /> },
  inviata: { label: 'Inviata SDI', color: 'bg-amber-50 text-amber-700 border-amber-100', icon: <Send size={12} /> },
  consegnata: { label: 'Consegnata', color: 'bg-emerald-50 text-emerald-700 border-emerald-100', icon: <CheckCircle size={12} /> },
  accettata: { label: 'Accettata', color: 'bg-blue-50 text-blue-700 border-blue-100', icon: <CheckCircle size={12} /> },
  rifiutata: { label: 'Rifiutata', color: 'bg-rose-50 text-rose-700 border-rose-100', icon: <XCircle size={12} /> },
  scartata: { label: 'Scartata SDI', color: 'bg-rose-50 text-rose-700 border-rose-100', icon: <AlertCircle size={12} /> },
};

export default function Fatturazione() {
  const { invoices } = useInvoices();
  const [tab, setTab] = useState<'emesse' | 'ricevute'>('emesse');
  const [search, setSearch] = useState('');
  const [showWizard, setShowWizard] = useState(false);
  const [selectedInv, setSelectedInv] = useState<Invoice | null>(null);

  const filtered = invoices.filter(i =>
    (tab === 'emesse' ? i.type === 'emessa' : i.type === 'ricevuta') &&
    (i.recipientName.toLowerCase().includes(search.toLowerCase()) || i.number.toLowerCase().includes(search.toLowerCase()))
  );

  const totale = filtered.reduce((s, i) => s + i.total, 0);

  return (
    <div className="space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Fatturazione Elettronica</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Gestisci le tue fatture emesse e ricevute</p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <TabBtn active={tab === 'emesse'} onClick={() => setTab('emesse')}>Emesse</TabBtn>
            <TabBtn active={tab === 'ricevute'} onClick={() => setTab('ricevute')}>Ricevute</TabBtn>
          </div>
          <button onClick={() => setShowWizard(true)} className="btn btn-primary px-5 gap-2 rounded-xl">
            <Plus size={18} /> Nuova Fattura
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          label="Totale Periodo" 
          value={fmt(totale)} 
          icon={<FileText size={20} className="text-indigo-600" />}
          color="text-slate-900" 
          trend="+12% vs mese prec."
        />
        <StatCard 
          label="Consegnate" 
          value={String(filtered.filter(i => i.status === 'consegnata' || i.status === 'accettata').length)} 
          icon={<CheckCircle size={20} className="text-emerald-600" />}
          color="text-emerald-600" 
          trend="Ottimo stato"
        />
        <StatCard 
          label="In Attesa / Errore" 
          value={String(filtered.filter(i => i.status === 'inviata' || i.status === 'bozza' || i.status === 'scartata').length)} 
          icon={<AlertCircle size={20} className="text-amber-600" />}
          color="text-amber-600" 
          trend="2 azioni richieste"
        />
      </div>

      {/* Main Table Card */}
      <div className="card flex flex-col">
        {/* Toolbar */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              placeholder="Cerca per numero, destinatario, P.IVA..." 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-700 transition-all" 
            />
          </div>
          <button onClick={() => toast('Filtri avanzati disponibili prossimamente', { icon: '🔍' })} className="btn btn-secondary px-4 gap-2 rounded-xl">
            <Filter size={18} /> Filtri
          </button>
          <button onClick={() => toast.success('Export CSV avviato')} className="btn btn-secondary px-4 gap-2 rounded-xl sm:ml-auto">
            <Download size={18} /> Export
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                <th className="px-6 py-4">Numero</th>
                <th className="px-6 py-4">{tab === 'emesse' ? 'Destinatario' : 'Fornitore'}</th>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4 text-right">Importo</th>
                <th className="px-6 py-4 text-center">Stato SDI</th>
                <th className="px-6 py-4 text-center">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(inv => {
                const s = statusConfig[inv.status];
                return (
                  <tr key={inv.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                          <FileText size={16} />
                        </div>
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">{inv.number}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{inv.recipientName}</span>
                        <span className="text-xs text-slate-400 font-mono mt-0.5">{inv.recipientVat}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600 dark:text-slate-400">{inv.date}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{fmt(inv.total)}</span>
                        {inv.vat > 0 && <span className="text-xs text-slate-400">IVA: {fmt(inv.vat)}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg font-medium border ${s.color}`}>
                          {s.icon} {s.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setSelectedInv(inv)} className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors" title="Vedi Dettagli">
                          <Eye size={18} />
                        </button>
                        <button onClick={() => toast.success('Download XML avviato')} className="p-2 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors" title="Scarica XML/PDF">
                          <Download size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText size={32} className="text-slate-300" />
              </div>
              <h3 className="text-slate-900 dark:text-white font-medium">Nessuna fattura trovata</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Prova a cambiare i filtri di ricerca</p>
            </div>
          )}
        </div>
      </div>

      {/* Wizard Modal */}
      {showWizard && <InvoiceWizard onClose={() => setShowWizard(false)} />}

      {/* Detail Modal */}
      {selectedInv && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-enter" onClick={() => setSelectedInv(null)}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl p-0 overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="bg-slate-50 dark:bg-slate-800 p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg text-slate-900">Fattura {selectedInv.number}</h3>
                <p className="text-sm text-slate-500 mt-1">{selectedInv.date}</p>
              </div>
              <span className={`text-xs px-3 py-1 rounded-lg font-medium border ${statusConfig[selectedInv.status].color}`}>
                {statusConfig[selectedInv.status].label}
              </span>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Dati Intestatario</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-500">Ragione Sociale</span>
                    <span className="text-sm font-medium text-slate-900">{selectedInv.recipientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-500">P.IVA / C.F.</span>
                    <span className="text-sm font-medium text-slate-900 font-mono">{selectedInv.recipientVat}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <DetailRow label="Imponibile" value={fmt(selectedInv.amount)} />
                <DetailRow label="IVA" value={fmt(selectedInv.vat)} />
                <div className="flex justify-between pt-3 border-t border-slate-100 items-end">
                  <span className="font-medium text-slate-700">Totale Documento</span>
                  <span className="font-bold text-2xl text-slate-900">{fmt(selectedInv.total)}</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
              <button onClick={() => toast.success('Download XML avviato')} className="flex-1 btn btn-secondary py-2.5">XML</button>
              <button onClick={() => toast.success('Download PDF avviato')} className="flex-1 btn btn-secondary py-2.5">PDF</button>
              <button onClick={() => setSelectedInv(null)} className="flex-1 btn btn-primary py-2.5">Chiudi</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InvoiceWizard({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ recipient: '', vat: '', amount: '', description: '', date: new Date().toISOString().split('T')[0] });

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-enter" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-slate-900 p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">×</button>
          </div>
          <h3 className="font-bold text-xl mb-1">Nuova Fattura</h3>
          <p className="text-slate-400 text-sm">Compila i dati per generare il documento XML</p>
          
          <div className="flex gap-2 mt-6">
            {[1, 2, 3].map(s => (
              <div key={s} className={`flex-1 h-1 rounded-full transition-all duration-500 ${s <= step ? 'bg-indigo-500' : 'bg-slate-700'}`}></div>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="p-8">
          {step === 1 && (
            <div className="space-y-5 animate-enter">
              <h4 className="font-semibold text-slate-900">Dati Destinatario</h4>
              <FormField label="Ragione Sociale *" value={form.recipient} onChange={v => setForm({ ...form, recipient: v })} placeholder="Es. Azienda SRL" />
              <FormField label="Partita IVA / C.F. *" value={form.vat} onChange={v => setForm({ ...form, vat: v })} placeholder="Es. 12345678901" />
              <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex gap-3">
                <div className="mt-0.5 text-indigo-600"><Search size={16} /></div>
                <p className="text-xs text-indigo-800 leading-relaxed">
                  L'AI verificherà automaticamente la P.IVA nel registro VIES e recupererà l'indirizzo PEC o il Codice Destinatario SDI.
                </p>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-5 animate-enter">
              <h4 className="font-semibold text-slate-900">Dettagli Documento</h4>
              <FormField label="Descrizione *" value={form.description} onChange={v => setForm({ ...form, description: v })} placeholder="Es. Consulenza mese corrente" />
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Importo (€) *" value={form.amount} onChange={v => setForm({ ...form, amount: v })} placeholder="0.00" type="number" />
                <FormField label="Data *" value={form.date} onChange={v => setForm({ ...form, date: v })} type="date" />
              </div>
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex gap-3">
                <div className="mt-0.5 text-emerald-600"><CheckCircle size={16} /></div>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Regime Forfettario applicato: Nessuna IVA verrà calcolata. Bollo virtuale €2,00 aggiunto se importo &gt; €77,47.
                </p>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-6 animate-enter">
              <h4 className="font-semibold text-slate-900">Riepilogo e Invio</h4>
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-3">
                <DetailRow label="Destinatario" value={form.recipient || '-'} />
                <DetailRow label="P.IVA" value={form.vat || '-'} />
                <div className="h-px bg-slate-200 my-2"></div>
                <DetailRow label="Descrizione" value={form.description || '-'} />
                <DetailRow label="Data" value={form.date} />
                <div className="flex justify-between items-end pt-2">
                  <span className="font-medium text-slate-600">Totale</span>
                  <span className="font-bold text-xl text-slate-900">{form.amount ? fmt(parseFloat(form.amount)) : '€ 0,00'}</span>
                </div>
              </div>
              <div className="p-4 bg-slate-900 text-slate-300 text-xs rounded-xl flex gap-3 items-center">
                <Send size={16} className="text-indigo-400" />
                Il documento verrà firmato digitalmente e inviato allo SDI.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 flex justify-between">
          {step > 1 ? (
            <button onClick={() => setStep(step - 1)} className="btn btn-ghost">Indietro</button>
          ) : (
            <div></div>
          )}
          {step < 3 ? (
            <button onClick={() => setStep(step + 1)} className="btn btn-primary px-6">Avanti</button>
          ) : (
            <button onClick={() => { toast.success('Fattura inviata allo SDI con successo!'); onClose(); }} className="btn btn-primary bg-emerald-600 hover:bg-emerald-700 px-6 gap-2">
              <Send size={16} /> Invia Fattura
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button 
      onClick={onClick} 
      className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${active ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
    >
      {children}
    </button>
  );
}

function StatCard({ label, value, color, icon, trend }: { label: string; value: string; color: string; icon: React.ReactNode; trend: string }) {
  return (
    <div className="card p-5 hover:border-indigo-100 transition-colors">
      <div className="flex justify-between items-start">
        <div className="p-2.5 bg-slate-50 rounded-xl">{icon}</div>
        <span className="text-[10px] font-bold px-2 py-1 bg-slate-50 text-slate-600 rounded-lg">{trend}</span>
      </div>
      <p className={`text-2xl font-bold mt-4 ${color}`}>{value}</p>
      <p className="text-xs text-slate-500 font-medium mt-1">{label}</p>
    </div>
  );
}

function FormField({ label, value, onChange, placeholder, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">{label}</label>
      <input 
        type={type} 
        value={value} 
        onChange={e => onChange(e.target.value)} 
        placeholder={placeholder} 
        className="input"
      />
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-medium text-slate-900">{value}</span>
    </div>
  );
}
