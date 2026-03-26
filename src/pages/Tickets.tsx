import { useState } from 'react';
import { Plus, MessageSquare, Clock, CheckCircle, AlertCircle, Send, User, MoreHorizontal, Paperclip } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTickets } from '../hooks/useTickets';
import type { Ticket } from '../types';

const priorityColor: Record<string, string> = { bassa: 'bg-slate-100 text-slate-600', media: 'bg-amber-50 text-amber-700', alta: 'bg-orange-50 text-orange-700', urgente: 'bg-rose-50 text-rose-700' };
const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
  aperto: { color: 'bg-amber-50 text-amber-700 border-amber-100', icon: <Clock size={12} /> },
  in_lavorazione: { color: 'bg-blue-50 text-blue-700 border-blue-100', icon: <AlertCircle size={12} /> },
  chiuso: { color: 'bg-emerald-50 text-emerald-700 border-emerald-100', icon: <CheckCircle size={12} /> },
};
const catLabel: Record<string, string> = { fiscale: '📊 Fiscale', contributivo: '🏦 Contributivo', lavoro: '👔 Lavoro', societario: '🏢 Societario', altro: '📎 Altro' };

export default function Tickets() {
  const { tickets } = useTickets();
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [newMsg, setNewMsg] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [newForm, setNewForm] = useState({ subject: '', category: 'fiscale', message: '' });

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 h-auto lg:h-[calc(100vh-8rem)]">
      {/* List */}
      <div className="w-full lg:w-4/12 card flex flex-col overflow-hidden max-h-[50vh] lg:max-h-none">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Ticket</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{tickets.length} richieste</p>
          </div>
          <button onClick={() => setShowNew(true)} className="btn btn-primary p-2.5 rounded-xl shadow-md shadow-indigo-200">
            <Plus size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-hide">
          {tickets.map(t => {
            const s = statusConfig[t.status];
            return (
              <div 
                key={t.id} 
                onClick={() => setSelected(t)} 
                className={`p-4 rounded-xl cursor-pointer transition-all border ${selected?.id === t.id ? 'bg-indigo-50 dark:bg-indigo-950 border-indigo-200 dark:border-indigo-800 shadow-sm' : 'bg-white dark:bg-slate-800 border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:border-slate-100 dark:hover:border-slate-700'}`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded-lg font-bold uppercase tracking-wide border ${s.color}`}>
                    {t.status.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-slate-400">{t.createdAt}</span>
                </div>
                <h3 className={`font-bold text-sm mb-1 line-clamp-1 ${selected?.id === t.id ? 'text-indigo-900 dark:text-indigo-300' : 'text-slate-900 dark:text-white'}`}>{t.subject}</h3>
                <p className="text-xs text-slate-500 mb-3 line-clamp-2">{t.lastMessage}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                      {t.clientName.charAt(0)}
                    </div>
                    <span className="text-xs font-medium text-slate-600 truncate max-w-[100px]">{t.clientName}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${priorityColor[t.priority]}`}>
                    {t.priority.toUpperCase()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail / Chat */}
      <div className="flex-1 card flex flex-col overflow-hidden relative">
        {selected ? (
          <>
            {/* Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between bg-white dark:bg-slate-900 z-10">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">{selected.subject}</h2>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border uppercase tracking-wide ${statusConfig[selected.status].color}`}>
                    {selected.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <span className="flex items-center gap-1"><User size={14}/> {selected.clientName}</span>
                  <span>•</span>
                  <span>{catLabel[selected.category]}</span>
                  <span>•</span>
                  <span className={`${priorityColor[selected.priority]} px-2 rounded-md text-xs font-medium`}>{selected.priority}</span>
                </div>
              </div>
              <button onClick={() => toast('Opzioni ticket', { icon: '⚙️' })} className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                <MoreHorizontal size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
              <div className="flex justify-start">
                <div className="flex gap-3 max-w-[80%]">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-xs font-bold text-slate-600 mt-1">
                    {selected.clientName.charAt(0)}
                  </div>
                  <div>
                    <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none p-4 shadow-sm">
                      <p className="text-sm text-slate-800 leading-relaxed">{selected.lastMessage}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium ml-1 mt-1 block">{selected.createdAt}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <div className="flex flex-row-reverse gap-3 max-w-[80%]">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex-shrink-0 flex items-center justify-center text-xs font-bold text-white mt-1">
                    SC
                  </div>
                  <div className="text-right">
                    <div className="bg-indigo-600 text-white rounded-2xl rounded-tr-none p-4 shadow-sm shadow-indigo-200">
                      <p className="text-sm leading-relaxed">Abbiamo preso in carico la sua richiesta. Un consulente le risponderà il prima possibile.</p>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium mr-1 mt-1 block">{selected.createdAt}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-2 flex items-center gap-3 shadow-sm">
                  <div className="w-5 h-5 rounded-full bg-indigo-200 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs">🤖</span>
                  </div>
                  <p className="text-xs text-indigo-800 font-medium">
                    <strong>AI Suggerimento:</strong> {selected.category === 'fiscale' ? 'Verifica i documenti fiscali allegati e la normativa.' : 'Richiedi documentazione integrativa.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Input */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
              <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-hide">
                {['Preso in carico', 'Richiesta documenti', 'In lavorazione', 'Risolto'].map(q => (
                  <button key={q} onClick={() => { setNewMsg(q); toast.success(`Risposta rapida: "${q}"`); }} className="whitespace-nowrap px-3 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 transition-colors">
                    {q}
                  </button>
                ))}
              </div>
              <div className="flex gap-3 items-end bg-slate-50 p-2 rounded-2xl border border-slate-200 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-300 transition-all">
                <button onClick={() => toast('Seleziona un allegato', { icon: '📎' })} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors">
                  <Paperclip size={20} />
                </button>
                <textarea 
                  value={newMsg} 
                  onChange={e => setNewMsg(e.target.value)} 
                  placeholder="Scrivi una risposta..." 
                  className="flex-1 bg-transparent border-none outline-none text-sm p-2 max-h-32 resize-none placeholder:text-slate-400"
                  rows={1}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      setNewMsg('');
                    }
                  }}
                />
                <button 
                  onClick={() => { if (newMsg.trim()) { toast.success('Messaggio inviato'); } setNewMsg(''); }} 
                  className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm transition-colors"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <MessageSquare size={40} className="text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Nessun ticket selezionato</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-xs mt-2">Seleziona un ticket dalla lista a sinistra per visualizzare i dettagli e rispondere.</p>
          </div>
        )}
      </div>

      {/* New ticket modal */}
      {showNew && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-enter" onClick={() => setShowNew(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">Nuovo Ticket</h3>
              <button onClick={() => setShowNew(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-2xl leading-none">×</button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Oggetto *</label>
                <input 
                  value={newForm.subject} 
                  onChange={e => setNewForm({ ...newForm, subject: e.target.value })} 
                  placeholder="Breve descrizione del problema" 
                  className="input" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Categoria</label>
                <div className="relative">
                  <select 
                    value={newForm.category} 
                    onChange={e => setNewForm({ ...newForm, category: e.target.value })} 
                    className="input appearance-none"
                  >
                    {Object.entries(catLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Messaggio *</label>
                <textarea 
                  value={newForm.message} 
                  onChange={e => setNewForm({ ...newForm, message: e.target.value })} 
                  rows={4} 
                  placeholder="Descrivi dettagliatamente la tua richiesta..." 
                  className="input min-h-[120px] py-3" 
                />
              </div>
            </div>
            <div className="p-6 bg-slate-50 dark:bg-slate-800 border-t border-slate-100 dark:border-slate-800 flex gap-3">
              <button onClick={() => setShowNew(false)} className="flex-1 btn btn-secondary">Annulla</button>
              <button onClick={() => { toast.success('Ticket aperto con successo!'); setShowNew(false); }} className="flex-1 btn btn-primary">Apri Ticket</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
