import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Euro, AlertTriangle, FileText, ArrowUpRight, Clock, Plus, FolderOpen, MessageSquare, Calendar } from 'lucide-react';
import { mockRevenue, mockDeadlines, mockInvoices } from '../../data/mockData';
import { useNavigate } from 'react-router-dom';

const fmt = (n: number) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);

export default function ClientDashboard() {
  const navigate = useNavigate();
  const ytd = mockRevenue.slice(0, 3).reduce((s, m) => s + m.fatturato, 0);
  const taxEstimate = Math.round(ytd * 0.78 * 0.15);
  const urgentDeadlines = mockDeadlines.filter(d => d.urgency === 'imminente' || d.urgency === 'scaduta');
  const recentInvoices = mockInvoices.slice(0, 4);

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        <KPICard 
          icon={<TrendingUp size={24} className="text-white" />} 
          iconBg="bg-blue-500"
          label="Fatturato YTD" 
          value={fmt(ytd)} 
          sub="+12% vs anno precedente" 
          trend="up"
        />
        <KPICard 
          icon={<Euro size={24} className="text-white" />} 
          iconBg="bg-indigo-500"
          label="Tasse Stimate" 
          value={fmt(taxEstimate)} 
          sub="Regime forfettario 15%" 
          trend="neutral"
        />
        <KPICard 
          icon={<FileText size={24} className="text-white" />} 
          iconBg="bg-violet-500"
          label="Fatture Emesse (Mar)" 
          value="8" 
          sub="3 in attesa di consegna" 
          trend="neutral"
        />
        <KPICard 
          icon={<AlertTriangle size={24} className="text-white" />} 
          iconBg="bg-rose-500"
          label="Scadenze Urgenti" 
          value={String(urgentDeadlines.length)} 
          sub="1 scaduta, 1 imminente" 
          trend="down"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="xl:col-span-2 card p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Andamento Fatturato</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Confronto entrate/uscite anno corrente</p>
            </div>
            <div className="flex gap-2">
               <span className="badge bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-800">Fatturato</span>
               <span className="badge bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-100 dark:border-indigo-800">Incassato</span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockRevenue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorFatturato" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorIncassato" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={v => `€${v/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                  formatter={(v) => fmt(Number(v))}
                />
                <Area type="monotone" dataKey="fatturato" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorFatturato)" />
                <Area type="monotone" dataKey="incassato" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorIncassato)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tax Forecast & Quick Actions */}
        <div className="space-y-8">
          <div className="card p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none">
            <h3 className="font-bold text-lg mb-1">Previsione Tasse</h3>
            <p className="text-slate-400 text-sm mb-6">Stima aggiornata in tempo reale</p>
            
            <div className="space-y-5">
              <TaxRow label="Imposta Sostitutiva (15%)" amount={fmt(taxEstimate)} pct={65} color="bg-blue-500" />
              <TaxRow label="INPS Gestione Separata" amount={fmt(Math.round(ytd * 0.78 * 0.2607))} pct={80} color="bg-indigo-500" />
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="flex justify-between items-end mb-4">
                <span className="text-sm text-slate-400">Totale Stimato</span>
                <span className="text-2xl font-bold">{fmt(taxEstimate + Math.round(ytd * 0.78 * 0.2607))}</span>
              </div>
              <button onClick={() => navigate('/simulatore')} className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                Simulazione Dettagliata <ArrowUpRight size={16} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <QuickAction icon={<Plus size={20} />} label="Nuova Fattura" onClick={() => navigate('/fatturazione')} color="bg-blue-600 text-white" />
            <QuickAction icon={<FolderOpen size={20} />} label="Carica Doc" onClick={() => navigate('/documenti')} color="bg-white text-slate-700 border border-slate-200 hover:border-indigo-300" />
            <QuickAction icon={<MessageSquare size={20} />} label="Ticket" onClick={() => navigate('/tickets')} color="bg-white text-slate-700 border border-slate-200 hover:border-indigo-300" />
            <QuickAction icon={<Calendar size={20} />} label="Scadenze" onClick={() => navigate('/scadenze')} color="bg-white text-slate-700 border border-slate-200 hover:border-indigo-300" />
          </div>
        </div>
      </div>

      {/* Bottom Lists */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Invoices */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900 dark:text-white">Ultime Fatture</h3>
            <button onClick={() => navigate('/fatturazione')} className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700">Vedi tutte</button>
          </div>
          <div className="space-y-1">
            {recentInvoices.map(inv => (
              <div key={inv.id} className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${inv.type === 'emessa' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                    {inv.type === 'emessa' ? 'FE' : 'FR'}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{inv.recipientName}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{inv.number} · {inv.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900 dark:text-white">{fmt(inv.total)}</p>
                  <StatusBadge status={inv.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Deadlines */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900 dark:text-white">Scadenze in Arrivo</h3>
            <button onClick={() => navigate('/scadenze')} className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-700">Vedi tutte</button>
          </div>
          <div className="space-y-3">
            {mockDeadlines.slice(0, 5).map(d => (
              <div key={d.id} className="flex items-center gap-4 p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-indigo-100 dark:hover:border-indigo-900 hover:shadow-sm transition-all bg-white dark:bg-slate-900">
                <div className={`w-1.5 h-12 rounded-full ${d.urgency === 'scaduta' ? 'bg-rose-500' : d.urgency === 'imminente' ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                <div className="flex-1">
                  <p className={`font-semibold text-sm ${d.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>{d.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide ${d.type === 'inps' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                      {d.type}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock size={12} /> {d.date}
                    </span>
                  </div>
                </div>
                {d.urgency === 'scaduta' && !d.completed && (
                   <AlertTriangle size={18} className="text-rose-500" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function KPICard({ icon, iconBg, label, value, sub, trend }: { icon: React.ReactNode; iconBg: string; label: string; value: string; sub: string; trend: 'up' | 'down' | 'neutral' }) {
  return (
    <div className="card p-6 hover:translate-y-[-2px] transition-transform">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-2xl ${iconBg} flex items-center justify-center shadow-lg shadow-blue-900/5`}>
          {icon}
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-lg ${trend === 'up' ? 'bg-emerald-50 text-emerald-700' : trend === 'down' ? 'bg-rose-50 text-rose-700' : 'bg-slate-100 text-slate-600'}`}>
          {trend === 'up' ? '↗ +12%' : trend === 'down' ? '↘ -5%' : '• Stable'}
        </span>
      </div>
      <p className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</p>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">{label}</p>
      <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 pt-3 border-t border-slate-50 dark:border-slate-800">{sub}</p>
    </div>
  );
}

function TaxRow({ label, amount, pct, color }: { label: string; amount: string; pct: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-slate-300">{label}</span>
        <span className="font-semibold text-white">{amount}</span>
      </div>
      <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }}></div>
      </div>
    </div>
  );
}

function QuickAction({ icon, label, onClick, color }: { icon: React.ReactNode; label: string; onClick: () => void; color: string }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center justify-center p-3 md:p-4 rounded-2xl gap-2 font-semibold text-xs md:text-sm transition-all shadow-sm hover:shadow-md ${color}`}>
      {icon}
      <span>{label}</span>
    </button>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    consegnata: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    accettata: 'bg-blue-50 text-blue-700 border-blue-100',
    inviata: 'bg-amber-50 text-amber-700 border-amber-100',
    bozza: 'bg-slate-100 text-slate-600 border-slate-200',
    rifiutata: 'bg-rose-50 text-rose-700 border-rose-100',
  };
  return <span className={`text-[10px] px-2 py-1 rounded-lg font-bold uppercase tracking-wide border ${styles[status] || styles.bozza}`}>{status}</span>;
}
