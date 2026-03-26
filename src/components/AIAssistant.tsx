import { useState } from 'react';
import { Bot, X, Send, Sparkles, Bell, TrendingUp, FileWarning, AlertCircle, ChevronRight, MessageSquare } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { mockAINotifications, mockChatHistory } from '../data/mockData';

const typeIcon: Record<string, React.ReactNode> = {
  rottamazione: <AlertCircle size={16} className="text-orange-600" />,
  bando: <TrendingUp size={16} className="text-emerald-600" />,
  legge: <Bell size={16} className="text-blue-600" />,
  scadenza: <AlertCircle size={16} className="text-rose-600" />,
  anomalia: <FileWarning size={16} className="text-amber-600" />,
};

const typeBg: Record<string, string> = {
  rottamazione: 'bg-orange-50 border-orange-100',
  bando: 'bg-emerald-50 border-emerald-100',
  legge: 'bg-blue-50 border-blue-100',
  scadenza: 'bg-rose-50 border-rose-100',
  anomalia: 'bg-amber-50 border-amber-100',
};

export default function AIAssistant() {
  const { aiPanelOpen, setAiPanelOpen, setUnreadAI } = useApp();
  const [tab, setTab] = useState<'chat' | 'notifiche'>('notifiche');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(mockChatHistory);
  const [notifications, setNotifications] = useState(mockAINotifications);

  const unread = notifications.filter(n => !n.read).length;

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now().toString(), sender: 'user' as const, text: input, timestamp: new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }) };
    const aiReply = { id: (Date.now() + 1).toString(), sender: 'ai' as const, text: '🤖 Sto analizzando la tua richiesta... (questa è una demo — in produzione rispondo con dati reali del tuo profilo fiscale e normativa aggiornata)', timestamp: new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg, aiReply]);
    setInput('');
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadAI(0);
  };

  if (!aiPanelOpen) return null;

  return (
    <div className="fixed top-0 right-0 h-screen w-full sm:w-96 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-l border-slate-200 dark:border-slate-800 shadow-2xl z-50 flex flex-col animate-enter">
      {/* Header */}
      <div className="bg-slate-900 px-5 py-4 flex items-center justify-between flex-shrink-0 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 opacity-90"></div>
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-xl backdrop-blur-md flex items-center justify-center border border-white/10 shadow-inner">
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-sm tracking-wide">AI Copilot</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <p className="text-indigo-100 text-[10px] font-medium">Attivo</p>
            </div>
          </div>
        </div>
        <button onClick={() => setAiPanelOpen(false)} className="relative z-10 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors">
          <X size={18} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex p-1 m-4 bg-slate-100 dark:bg-slate-800 rounded-xl flex-shrink-0">
        <button
          onClick={() => setTab('notifiche')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${tab === 'notifiche' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white'}`}
        >
          <Sparkles size={14} />
          Alert ({unread})
        </button>
        <button
          onClick={() => setTab('chat')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${tab === 'chat' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white'}`}
        >
          <MessageSquare size={14} />
          Chat
        </button>
      </div>

      {tab === 'notifiche' && (
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3 scrollbar-thin">
          <div className="flex justify-end">
             {unread > 0 && <button onClick={markAllRead} className="text-[10px] font-bold text-indigo-600 hover:underline uppercase tracking-wide">Segna letti</button>}
          </div>
          {notifications.map(n => (
            <div key={n.id} className={`p-4 rounded-xl border transition-all hover:shadow-md ${!n.read ? 'bg-white dark:bg-slate-800 border-indigo-100 dark:border-indigo-900 shadow-sm ring-1 ring-indigo-50 dark:ring-indigo-950' : 'bg-slate-50/50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700'}`}>
              <div className="flex gap-3">
                <div className={`p-2 rounded-lg h-fit ${typeBg[n.type]}`}>
                  {typeIcon[n.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className={`text-sm font-semibold leading-tight ${!n.read ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>{n.title}</h4>
                    {!n.read && <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0"></div>}
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed mb-3">{n.summary}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-medium text-slate-400">{n.date}</span>
                    {n.actionLabel && (
                      <button className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors bg-indigo-50 px-2 py-1 rounded-md">
                        {n.actionLabel} <ChevronRight size={10} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'chat' && (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin bg-slate-50/50 dark:bg-slate-950/50">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mr-2 flex-shrink-0 shadow-sm mt-1">
                    <Bot size={14} className="text-white" />
                  </div>
                )}
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-bl-none'}`}>
                  <p>{msg.text}</p>
                  <p className={`text-[10px] mt-1.5 text-right ${msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'}`}>{msg.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
            <div className="relative flex items-center">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Chiedi al Copilot..."
                className="w-full pl-4 pr-12 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-700 transition-all shadow-inner"
              />
              <button 
                onClick={handleSend} 
                className={`absolute right-2 p-2 rounded-lg transition-all ${input.trim() ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                disabled={!input.trim()}
              >
                <Send size={16} />
              </button>
            </div>
            <p className="text-[10px] text-slate-400 text-center mt-2 font-medium">Powered by Consulente Virtuale AI</p>
          </div>
        </>
      )}
    </div>
  );
}
