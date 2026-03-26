
import { Users, CheckSquare, AlertTriangle, MessageSquare, ArrowUpRight, Clock, TrendingUp, MoreHorizontal, Filter } from 'lucide-react';
import { useTodos } from '../../hooks/useTodos';
import { useClients } from '../../hooks/useClients';
import { useDeadlines } from '../../hooks/useDeadlines';
import { useTickets } from '../../hooks/useTickets';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import toast from 'react-hot-toast';

const packageLabel: Record<string, string> = {
  forfettario: 'Forfettario', ditta_individuale: 'Ditta Ind.', societa_capitali: 'SdC',
  societa_persone: 'SdP', enti_non_commerciali: 'ENC',
};
const packageColor: Record<string, string> = {
  forfettario: 'bg-blue-100 text-blue-700', ditta_individuale: 'bg-emerald-100 text-emerald-700',
  societa_capitali: 'bg-violet-100 text-violet-700', societa_persone: 'bg-orange-100 text-orange-700',
  enti_non_commerciali: 'bg-pink-100 text-pink-700',
};

const clientiPerPacchetto = [
  { name: 'Forfettario', count: 4, fill: '#3b82f6' },
  { name: 'Ditta Ind.', count: 1, fill: '#10b981' },
  { name: 'SdC', count: 1, fill: '#8b5cf6' },
  { name: 'SdP', count: 1, fill: '#f59e0b' },
  { name: 'ENC', count: 1, fill: '#ec4899' },
];

export default function StudioDashboard() {
  const navigate = useNavigate();
  const { todos, toggle: toggleTodoHook } = useTodos();
  const { clients } = useClients();
  const { deadlines } = useDeadlines();
  const { tickets } = useTickets();
  const pendingTodos = todos.filter(t => !t.completed);
  const urgentTickets = tickets.filter(t => t.priority === 'urgente' || t.priority === 'alta');
  const urgentDeadlines = deadlines.filter(d => d.urgency !== 'normale' && !d.completed);

  const toggleTodo = (id: string) => {
    const todo = todos.find(t => t.id === id);
    toggleTodoHook(id);
    if (todo && !todo.completed) toast.success(`"${todo.title}" completato`);
  };

  return (
    <div className="space-y-8">
      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StudioKPI 
          icon={<Users size={24} className="text-white" />} 
          iconBg="bg-indigo-500" 
          value={String(clients.length)} 
          label="Clienti Attivi" 
          sub="8 attivi, 1 sospeso" 
        />
        <StudioKPI 
          icon={<CheckSquare size={24} className="text-white" />} 
          iconBg="bg-emerald-500" 
          value={String(pendingTodos.length)} 
          label="Task Pendenti" 
          sub="2 in scadenza oggi" 
        />
        <StudioKPI 
          icon={<AlertTriangle size={24} className="text-white" />} 
          iconBg="bg-rose-500" 
          value={String(urgentDeadlines.length)} 
          label="Scadenze Urgenti" 
          sub="1 scaduta" 
        />
        <StudioKPI 
          icon={<MessageSquare size={24} className="text-white" />} 
          iconBg="bg-amber-500" 
          value={String(tickets.filter(t => t.status !== 'chiuso').length)} 
          label="Ticket Aperti" 
          sub={`${urgentTickets.length} alta priorità`} 
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Client List */}
        <div className="xl:col-span-2 card flex flex-col">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">Elenco Clienti</h3>
            <div className="flex gap-2">
              <button onClick={() => toast('Filtri clienti disponibili prossimamente', { icon: '🔍' })} className="btn btn-ghost p-2">
                <Filter size={18} />
              </button>
              <button onClick={() => navigate('/clienti')} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                Vedi tutti <ArrowUpRight size={16} />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                  <th className="px-6 py-3">Cliente</th>
                  <th className="px-6 py-3">Pacchetto</th>
                  <th className="px-6 py-3">Stato</th>
                  <th className="px-6 py-3 text-right">Azioni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {clients.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer group" onClick={() => navigate('/clienti')}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">{c.name}</p>
                          <p className="text-xs text-slate-500">{c.ateco}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge ${packageColor[c.packageType]} border border-current/10`}>
                        {packageLabel[c.packageType]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${c.status === 'attivo' ? 'text-emerald-700' : 'text-slate-500'}`}>
                        <span className={`w-2 h-2 rounded-full ${c.status === 'attivo' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                        {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={(e) => { e.stopPropagation(); toast('Opzioni cliente', { icon: '⚙️' }); }} className="text-slate-400 hover:text-indigo-600 transition-colors p-1 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Chart Card */}
          <div className="card p-6">
            <h3 className="font-bold text-slate-900 dark:text-white mb-6">Clienti per Pacchetto</h3>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={clientiPerPacchetto} layout="vertical" margin={{ left: 0, right: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fontWeight: 500, fill: '#64748b' }} axisLine={false} tickLine={false} width={80} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={24}>
                    {clientiPerPacchetto.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Alert Card */}
          <div className="card border-none bg-gradient-to-br from-indigo-600 to-violet-700 text-white p-6 shadow-xl shadow-indigo-200">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="bg-white/20 p-1.5 rounded-lg">
                <TrendingUp size={16} className="text-white" />
              </div>
              <span className="font-bold text-sm tracking-wide">AI ALERT STUDIO</span>
            </div>
            <p className="text-indigo-100 text-sm leading-relaxed mb-4">
              Nuova rottamazione-quinquies: <strong className="text-white">3 clienti eleggibili</strong> per un totale di €24.300 in cartelle.
            </p>
            <button onClick={() => { toast.success('Analisi rottamazione-quinquies avviata per 3 clienti'); navigate('/clienti'); }} className="w-full py-2.5 bg-white text-indigo-700 rounded-xl text-sm font-bold hover:bg-indigo-50 transition-colors shadow-sm">
              Analizza Clienti
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Todo List */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900 dark:text-white">To-Do Operativo</h3>
            <span className="badge bg-amber-50 text-amber-700 border-amber-100">
              {pendingTodos.length} in attesa
            </span>
          </div>
          <div className="space-y-1">
            {todos.slice(0, 5).map(t => (
              <div key={t.id} className="group flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                <button onClick={() => toggleTodo(t.id)} className={`mt-1 w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${t.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 group-hover:border-indigo-400'}`}>
                  {t.completed && <CheckSquare size={12} className="text-white" />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${t.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>{t.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{t.clientName}</p>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide ${
                    t.priority === 'alta' ? 'bg-rose-50 text-rose-700' : 
                    t.priority === 'media' ? 'bg-amber-50 text-amber-700' : 
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {t.priority}
                  </span>
                  {t.dueDate && (
                    <div className="flex items-center justify-end gap-1 mt-1 text-xs text-slate-400">
                      <Clock size={10} /> {t.dueDate}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tickets */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900 dark:text-white">Ticket Recenti</h3>
            <button onClick={() => navigate('/tickets')} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
              Vedi tutti
            </button>
          </div>
          <div className="space-y-3">
            {tickets.map(t => (
              <div key={t.id} onClick={() => navigate('/tickets')} className="flex items-center gap-4 p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-indigo-100 dark:hover:border-indigo-900 hover:shadow-sm transition-all bg-white dark:bg-slate-900 cursor-pointer">
                <div className={`w-2 h-12 rounded-full ${t.priority === 'urgente' ? 'bg-rose-500' : t.priority === 'alta' ? 'bg-amber-500' : 'bg-slate-300'}`}></div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">{t.subject}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{t.clientName} · {t.createdAt}</p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${
                  t.status === 'aperto' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 
                  t.status === 'in_lavorazione' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 
                  'bg-emerald-50 text-emerald-700 border border-emerald-100'
                }`}>
                  {t.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StudioKPI({ icon, iconBg, value, label, sub }: { icon: React.ReactNode; iconBg: string; value: string; label: string; sub: string }) {
  return (
    <div className="card p-6 hover:translate-y-[-2px] transition-transform">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-2xl ${iconBg} flex items-center justify-center shadow-md shadow-slate-200`}>
          {icon}
        </div>
        <button className="text-slate-300 hover:text-slate-600 transition-colors">
          <MoreHorizontal size={20} />
        </button>
      </div>
      <p className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</p>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">{label}</p>
      <p className="text-xs text-slate-400 dark:text-slate-500 mt-3 pt-3 border-t border-slate-50 dark:border-slate-800">{sub}</p>
    </div>
  );
}
