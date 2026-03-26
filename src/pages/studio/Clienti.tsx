import { useState } from 'react';
import { Search, Plus, Mail, Phone, ExternalLink, Filter } from 'lucide-react';
import { useClients } from '../../hooks/useClients';
import type { Client } from '../../types';
import toast from 'react-hot-toast';

const packageLabel: Record<string, string> = { forfettario: 'Forfettario', ditta_individuale: 'Ditta Ind.', societa_capitali: 'SdC', societa_persone: 'SdP', enti_non_commerciali: 'ENC' };
const packageColor: Record<string, string> = { forfettario: 'bg-blue-50 text-blue-700 border-blue-100', ditta_individuale: 'bg-emerald-50 text-emerald-700 border-emerald-100', societa_capitali: 'bg-violet-50 text-violet-700 border-violet-100', societa_persone: 'bg-orange-50 text-orange-700 border-orange-100', enti_non_commerciali: 'bg-pink-50 text-pink-700 border-pink-100' };

export default function Clienti() {
  const [search, setSearch] = useState('');
  const { clients } = useClients();
  const [filter, setFilter] = useState('tutti');
  const [selected, setSelected] = useState<Client | null>(null);

  const filtered = clients.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.vatNumber.includes(search);
    const matchFilter = filter === 'tutti' || c.packageType === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 h-auto lg:h-[calc(100vh-8rem)]">
      {/* List */}
      <div className={`card flex flex-col overflow-hidden transition-all duration-300 ${selected ? 'w-full lg:w-7/12' : 'w-full'}`}>
        <div className="p-6 border-b border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Clienti</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{filtered.length} clienti attivi</p>
            </div>
            <button onClick={() => toast('Form nuovo cliente disponibile prossimamente', { icon: '👤' })} className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200">
              <Plus size={18} /> Nuovo Cliente
            </button>
          </div>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
                placeholder="Cerca per nome o P.IVA..." 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-700 transition-all" 
              />
            </div>
            <div className="relative">
              <Filter size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <select 
                value={filter} 
                onChange={e => setFilter(e.target.value)} 
                className="pl-10 pr-8 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-700 appearance-none cursor-pointer text-slate-700 dark:text-white font-medium"
              >
                <option value="tutti">Tutti i pacchetti</option>
                <option value="forfettario">Forfettario</option>
                <option value="ditta_individuale">Ditta Individuale</option>
                <option value="societa_capitali">Società di Capitali</option>
                <option value="societa_persone">Società di Persone</option>
                <option value="enti_non_commerciali">Enti Non Commerciali</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-hide">
          {filtered.map(c => (
            <div 
              key={c.id} 
              onClick={() => setSelected(c)} 
              className={`flex items-center p-4 rounded-xl cursor-pointer transition-all border ${selected?.id === c.id ? 'bg-indigo-50 dark:bg-indigo-950 border-indigo-200 dark:border-indigo-800 shadow-sm' : 'bg-white dark:bg-slate-800 border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:border-slate-100 dark:hover:border-slate-700'}`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-md ${selected?.id === c.id ? 'bg-indigo-600' : 'bg-gradient-to-br from-slate-400 to-slate-500'}`}>
                {c.name.charAt(0)}
              </div>
              <div className="ml-4 flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <p className={`text-sm font-bold truncate ${selected?.id === c.id ? 'text-indigo-900 dark:text-indigo-300' : 'text-slate-900 dark:text-white'}`}>{c.name}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-lg font-bold uppercase tracking-wide border ${packageColor[c.packageType]}`}>
                    {packageLabel[c.packageType]}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-slate-500 truncate font-medium">{c.vatNumber} · {c.ateco}</p>
                  <div className={`w-2 h-2 rounded-full ${c.status === 'attivo' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail panel */}
      {selected && (
        <div className="w-full lg:w-5/12 card overflow-hidden flex flex-col animate-enter">
          <div className="relative bg-gradient-to-br from-indigo-600 to-violet-700 p-8 text-white">
            <div className="absolute top-4 right-4">
              <button onClick={() => setSelected(null)} className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
                <span className="sr-only">Chiudi</span>
                ×
              </button>
            </div>
            <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-bold text-2xl mb-4 shadow-inner">
              {selected.name.charAt(0)}
            </div>
            <h2 className="text-2xl font-bold tracking-tight">{selected.name}</h2>
            <p className="text-indigo-100 font-medium mt-1 opacity-90">{selected.atecoDescription}</p>
            <div className="flex gap-2 mt-4">
              <span className="px-3 py-1 bg-white/20 rounded-lg text-xs font-semibold backdrop-blur-sm border border-white/10">
                {selected.ateco}
              </span>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-100 rounded-lg text-xs font-semibold backdrop-blur-sm border border-emerald-500/20">
                {selected.status.toUpperCase()}
              </span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-8 space-y-8">
            <Section title="Dati Fiscali">
              <div className="grid grid-cols-1 gap-4">
                <InfoCard label="Partita IVA" value={selected.vatNumber} />
                <InfoCard label="Codice Fiscale" value={selected.fiscalCode} />
                <InfoCard label="Regime Fiscale" value={selected.regime.charAt(0).toUpperCase() + selected.regime.slice(1)} />
                <InfoCard label="Pacchetto Servizi" value={packageLabel[selected.packageType]} />
              </div>
            </Section>

            <Section title="Contatti & Sede">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                  <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center text-indigo-600 shadow-sm"><Mail size={16} /></div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{selected.email}</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                  <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center text-indigo-600 shadow-sm"><Phone size={16} /></div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{selected.phone}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Indirizzo</p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{selected.address}</p>
                </div>
              </div>
            </Section>

            <div className="grid grid-cols-2 gap-4">
              <StatBox label="To-Do" value="3" color="bg-amber-50 text-amber-700" />
              <StatBox label="Scadenze" value="2" color="bg-rose-50 text-rose-700" />
              <StatBox label="Documenti" value="7" color="bg-blue-50 text-blue-700" />
              <StatBox label="Ticket" value="1" color="bg-violet-50 text-violet-700" />
            </div>

            <button onClick={() => toast.success('Scheda cliente completa aperta')} className="w-full py-3.5 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-sm hover:border-indigo-600 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2">
              <ExternalLink size={18} /> Apri Scheda Completa
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
        {title}
      </h3>
      {children}
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-semibold text-slate-900 dark:text-white">{value}</span>
    </div>
  );
}

function StatBox({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className={`rounded-2xl p-4 text-center ${color}`}>
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-xs font-bold uppercase tracking-wide opacity-80 mt-1">{label}</p>
    </div>
  );
}
