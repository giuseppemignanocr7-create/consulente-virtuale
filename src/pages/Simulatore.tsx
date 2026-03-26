import { useState, useMemo } from 'react';
import { TrendingDown, TrendingUp, Info } from 'lucide-react';
import { mockAtecoList } from '../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const fmt = (n: number) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);

const IRPEF_SCAGLIONI = [
  { max: 28000, rate: 0.23 }, { max: 50000, rate: 0.35 }, { max: Infinity, rate: 0.43 },
];

function calcIRPEF(reddito: number): number {
  let tax = 0; let prev = 0;
  for (const s of IRPEF_SCAGLIONI) {
    if (reddito <= prev) break;
    const taxable = Math.min(reddito, s.max) - prev;
    tax += taxable * s.rate;
    prev = s.max;
  }
  return tax;
}

export default function Simulatore() {
  const [fatturato, setFatturato] = useState(45000);
  const [atecoIdx, setAtecoIdx] = useState(6);
  const [isNuovaAttivita, setIsNuovaAttivita] = useState(false);
  const [costiOrdinario, setCostiOrdinario] = useState(8000);
  const [addRegionale] = useState(1.73);

  const ateco = mockAtecoList[atecoIdx];
  const coeff = ateco.coefficient;
  const aliquotaForf = isNuovaAttivita ? 0.05 : 0.15;

  const sim = useMemo(() => {
    // FORFETTARIO
    const redditoForf = fatturato * coeff;
    const inpsForf = redditoForf * 0.2607;
    const impostaSostitutiva = redditoForf * aliquotaForf;
    const nettoforf = fatturato - inpsForf - impostaSostitutiva;

    // ORDINARIO
    const redditoOrd = fatturato - costiOrdinario;
    const inpsOrd = redditoOrd * 0.2607;
    const redditoImponibile = Math.max(0, redditoOrd - inpsOrd * 0.5);
    const irpef = calcIRPEF(redditoImponibile);
    const addizionale = redditoImponibile * (addRegionale / 100);
    const irap = redditoOrd * 0.039;
    const totTasseOrd = irpef + addizionale + irap + inpsOrd;
    const nettoOrd = fatturato - costiOrdinario - totTasseOrd;

    return { redditoForf, inpsForf, impostaSostitutiva, nettoforf, redditoOrd, inpsOrd, irpef, addizionale, irap, totTasseOrd, nettoOrd };
  }, [fatturato, coeff, aliquotaForf, costiOrdinario, addRegionale]);

  const convieneForf = sim.nettoforf > sim.nettoOrd;

  const chartData = [
    { name: 'Forfettario', 'Netto Disponibile': Math.round(sim.nettoforf), 'Tasse Totali': Math.round(sim.inpsForf + sim.impostaSostitutiva) },
    { name: 'Ordinario', 'Netto Disponibile': Math.round(Math.max(0, sim.nettoOrd)), 'Tasse Totali': Math.round(sim.totTasseOrd) },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Simulatore Fiscale</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Confronta in tempo reale regime forfettario vs ordinario</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Input Parameters */}
        <div className="xl:col-span-4 space-y-6">
          <div className="card p-6">
            <h3 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-indigo-600 rounded-full"></span>
              Parametri
            </h3>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Fatturato Annuo</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">€</span>
                  <input 
                    type="number" 
                    value={fatturato} 
                    onChange={e => setFatturato(Number(e.target.value))} 
                    className="input pl-8 font-semibold text-slate-900" 
                  />
                </div>
                <input 
                  type="range" 
                  min={5000} 
                  max={150000} 
                  step={1000} 
                  value={fatturato} 
                  onChange={e => setFatturato(Number(e.target.value))} 
                  className="w-full mt-3 accent-indigo-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer" 
                />
                <div className="flex justify-between text-[10px] font-medium text-slate-400 mt-1">
                  <span>€5k</span>
                  <span>€150k</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Codice ATECO</label>
                <select 
                  value={atecoIdx} 
                  onChange={e => setAtecoIdx(Number(e.target.value))} 
                  className="input appearance-none"
                >
                  {mockAtecoList.map((a, i) => (
                    <option key={i} value={i}>{a.code} — {a.description}</option>
                  ))}
                </select>
                <div className="mt-3 flex items-center gap-2 text-xs p-3 bg-blue-50 text-blue-800 rounded-xl border border-blue-100">
                  <Info size={14} className="flex-shrink-0" />
                  <div>
                    Coeff. redditività: <strong className="font-bold">{(coeff * 100).toFixed(0)}%</strong>
                    <div className="text-blue-600/80">Imponibile: {fmt(fatturato * coeff)}</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800/50">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">Nuova attività</p>
                  <p className="text-xs text-slate-500">Aliquota 5% (start-up)</p>
                </div>
                <button 
                  onClick={() => setIsNuovaAttivita(!isNuovaAttivita)} 
                  className={`relative w-12 h-7 rounded-full transition-colors duration-200 ease-in-out ${isNuovaAttivita ? 'bg-indigo-600' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform duration-200 ease-in-out ${isNuovaAttivita ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Costi Deducibili (Ordinario)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">€</span>
                  <input 
                    type="number" 
                    value={costiOrdinario} 
                    onChange={e => setCostiOrdinario(Number(e.target.value))} 
                    className="input pl-8" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results & Chart */}
        <div className="xl:col-span-8 space-y-6">
          {/* Verdict Banner */}
          <div className={`card border-none p-6 text-white relative overflow-hidden ${convieneForf ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gradient-to-r from-emerald-600 to-teal-600'}`}>
            <div className="relative z-10 flex items-start gap-4">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                {convieneForf ? <TrendingDown size={28} /> : <TrendingUp size={28} />}
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1">
                  Ti conviene il regime {convieneForf ? 'Forfettario' : 'Ordinario'}
                </h3>
                <p className="text-blue-100 text-sm leading-relaxed max-w-xl">
                  {convieneForf
                    ? `Il forfettario ti permette di risparmiare ${fmt(sim.nettoforf - Math.max(0, sim.nettoOrd))} all'anno rispetto al regime ordinario.`
                    : `L'ordinario ti permette di risparmiare ${fmt(Math.max(0, sim.nettoOrd) - sim.nettoforf)} all'anno grazie alla deducibilità dei costi.`
                  }
                </p>
              </div>
            </div>
            {fatturato > 85000 && (
              <div className="relative z-10 mt-4 inline-flex items-center gap-2 px-4 py-2 bg-rose-500/20 border border-rose-200/20 rounded-lg text-sm font-medium text-rose-100">
                <Info size={16} /> Attenzione: soglia forfettario €85.000 superata
              </div>
            )}
          </div>

          {/* Cards Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RegimeCard 
              title="Regime Forfettario" 
              color="blue" 
              netto={sim.nettoforf}
              rows={[
                { label: `Imposta sost. ${(aliquotaForf * 100).toFixed(0)}%`, value: fmt(sim.impostaSostitutiva) },
                { label: 'INPS (26,07%)', value: fmt(sim.inpsForf) },
                { label: 'IVA', value: '– esente –', muted: true },
                { label: 'Totale Tasse', value: fmt(sim.inpsForf + sim.impostaSostitutiva), bold: true },
              ]} 
            />
            <RegimeCard 
              title="Regime Ordinario" 
              color="emerald" 
              netto={Math.max(0, sim.nettoOrd)}
              rows={[
                { label: 'IRPEF (scaglioni)', value: fmt(sim.irpef) },
                { label: `Addizionale Reg.`, value: fmt(sim.addizionale) },
                { label: 'INPS', value: fmt(sim.inpsOrd) },
                { label: 'Totale Tasse', value: fmt(sim.totTasseOrd), bold: true },
              ]} 
            />
          </div>

          {/* Chart */}
          <div className="card p-6">
            <h3 className="font-bold text-slate-900 dark:text-white mb-6">Analisi Visiva</h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barGap={8}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 13, fontWeight: 600, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={v => `€${(v / 1000).toFixed(0)}k`} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(v) => fmt(Number(v))}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="Netto Disponibile" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
                  <Bar dataKey="Tasse Totali" fill="#f43f5e" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-slate-400 max-w-2xl mx-auto">
        ⚠️ Questa simulazione è fornita a titolo indicativo e non costituisce parere professionale. I valori reali dipendono da deduzioni, detrazioni, situazione familiare e altri fattori specifici. Rif. Legge 190/2014 e TUIR.
      </p>
    </div>
  );
}

function RegimeCard({ title, color, rows, netto }: { title: string; color: string; rows: { label: string; value: string; bold?: boolean; muted?: boolean }[]; netto: number }) {
  const styles: Record<string, { badge: string; border: string }> = {
    blue: { badge: 'bg-blue-100 text-blue-700', border: 'border-blue-100' },
    emerald: { badge: 'bg-emerald-100 text-emerald-700', border: 'border-emerald-100' },
  };
  const s = styles[color];
  const fmt2 = (n: number) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);

  return (
    <div className={`card p-6 border-t-4 ${color === 'blue' ? 'border-t-blue-500' : 'border-t-emerald-500'}`}>
      <div className="flex items-center justify-between mb-6">
        <h4 className="font-bold text-slate-900 dark:text-white">{title}</h4>
        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide ${s.badge}`}>
          {color === 'blue' ? 'Flat Tax' : 'Progressivo'}
        </span>
      </div>
      
      <div className="space-y-3 mb-6">
        {rows.map((r, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className={r.bold ? 'font-semibold text-slate-700' : 'text-slate-500'}>{r.label}</span>
            <span className={`${r.bold ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-300'} ${r.muted ? 'text-slate-400 italic' : ''}`}>{r.value}</span>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Netto Disponibile Annuo</p>
        <div className="flex items-baseline gap-1">
          <span className={`text-2xl font-bold ${color === 'blue' ? 'text-blue-600' : 'text-emerald-600'}`}>{fmt2(netto)}</span>
          <span className="text-sm text-slate-400 font-medium">/ anno</span>
        </div>
      </div>
    </div>
  );
}
