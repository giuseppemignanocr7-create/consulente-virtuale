import { useState } from 'react';
import { Send, Phone, Video, MoreHorizontal, Search, Paperclip, CheckCheck, Smile } from 'lucide-react';
import { mockClients } from '../data/mockData';
import toast from 'react-hot-toast';

const conversations = mockClients.slice(0, 5).map((c, i) => ({
  id: c.id,
  name: c.name,
  lastMessage: ['Grazie per l\'aggiornamento!', 'Quando possiamo fare una call?', 'Ho caricato i documenti richiesti', 'La fattura è stata accettata da SDI ✓', 'Perfetto, attendo conferma'][i],
  time: [`${9 + i}:${i < 2 ? '0' + i * 5 : i * 5}`, '10:15', '11:30', 'Ieri', '2 giorni fa'][i],
  unread: [2, 0, 1, 0, 0][i],
  online: i < 2,
  avatarColor: ['bg-blue-500', 'bg-indigo-500', 'bg-violet-500', 'bg-emerald-500', 'bg-amber-500'][i],
}));

const initMessages = [
  { id: '1', sender: 'client', text: 'Buongiorno, ho una domanda riguardo alla mia dichiarazione dei redditi.', time: '10:30' },
  { id: '2', sender: 'studio', text: 'Buongiorno Marco! Certo, sono qui per aiutarti. Di cosa hai bisogno?', time: '10:32' },
  { id: '3', sender: 'client', text: 'Ho superato gli 80.000 euro di fatturato quest\'anno. Devo uscire dal forfettario?', time: '10:33' },
  { id: '4', sender: 'studio', text: 'Ottima domanda. La soglia per uscire dal regime forfettario è €85.000 annui. Con €80.000 sei ancora al sicuro per quest\'anno. Ti consiglio però di monitorare i prossimi mesi.', time: '10:35' },
  { id: '5', sender: 'ai', text: '🤖 AI: Aggiorno in tempo reale: con fatturato attuale €72.500 (YTD), la proiezione a fine anno è €96.667. Se il trend continua, potresti superare €85.000. Suggerisco di pianificare ora il passaggio.', time: '10:35' },
  { id: '6', sender: 'client', text: 'Interessante! Possiamo fare una simulazione per vedere cosa mi conviene?', time: '10:37' },
];

export default function Chat() {
  const [activeConv, setActiveConv] = useState(conversations[0]);
  const [messages, setMessages] = useState(initMessages);
  const [input, setInput] = useState('');
  const [searchQ, setSearchQ] = useState('');

  const filteredConvs = conversations.filter(c => 
    c.name.toLowerCase().includes(searchQ.toLowerCase()) || c.lastMessage.toLowerCase().includes(searchQ.toLowerCase())
  );

  const send = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'studio', text: input, time: new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }) }]);
    setInput('');
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 h-auto lg:h-[calc(100vh-8rem)]">
      {/* Conversations list */}
      <div className="w-full lg:w-80 lg:flex-shrink-0 card flex flex-col overflow-hidden max-h-[40vh] lg:max-h-none">
        <div className="p-5 border-b border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg text-slate-900 dark:text-white">Messaggi</h2>
            <div className="bg-indigo-50 text-indigo-600 text-xs font-bold px-2 py-1 rounded-lg">
              {conversations.reduce((acc, curr) => acc + curr.unread, 0)} Nuovi
            </div>
          </div>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              placeholder="Cerca conversazione..." 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-hide">
          {filteredConvs.map(conv => (
            <div 
              key={conv.id} 
              onClick={() => setActiveConv(conv)} 
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${activeConv.id === conv.id ? 'bg-indigo-50 dark:bg-indigo-950 border-indigo-100 dark:border-indigo-800 shadow-sm' : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800'}`}
            >
              <div className="relative flex-shrink-0">
                <div className={`w-12 h-12 rounded-full ${conv.avatarColor} flex items-center justify-center text-white font-bold text-sm shadow-sm`}>
                  {conv.name.charAt(0)}
                </div>
                {conv.online && <div className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-sm"></div>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <p className={`text-sm font-bold truncate ${activeConv.id === conv.id ? 'text-indigo-900' : 'text-slate-900'}`}>{conv.name}</p>
                  <span className={`text-[10px] font-medium ${activeConv.id === conv.id ? 'text-indigo-600' : 'text-slate-400'}`}>{conv.time}</span>
                </div>
                <p className={`text-xs truncate ${activeConv.id === conv.id ? 'text-indigo-700 font-medium' : 'text-slate-500'}`}>{conv.lastMessage}</p>
              </div>
              {conv.unread > 0 && (
                <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 shadow-md shadow-indigo-200">
                  {conv.unread}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat window */}
      <div className="flex-1 card flex flex-col overflow-hidden relative">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className={`w-10 h-10 rounded-full ${activeConv.avatarColor} flex items-center justify-center text-white font-bold shadow-md`}>
                {activeConv.name.charAt(0)}
              </div>
              {activeConv.online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>}
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">{activeConv.name}</p>
              <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                {activeConv.online ? <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> : <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>}
                {activeConv.online ? 'Online ora' : 'Offline'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => toast('Chiamata vocale avviata...', { icon: '📞' })} className="p-2.5 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors">
              <Phone size={20} />
            </button>
            <button onClick={() => toast('Videochiamata avviata...', { icon: '🎥' })} className="p-2.5 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors">
              <Video size={20} />
            </button>
            <button onClick={() => toast('Opzioni conversazione', { icon: '⚙️' })} className="p-2.5 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors">
              <MoreHorizontal size={20} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 dark:bg-slate-950/50">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'studio' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'ai' ? (
                <div className="max-w-lg w-full">
                  <div className="flex items-center gap-2 mb-2 justify-center">
                    <div className="h-px bg-indigo-100 flex-1"></div>
                    <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider bg-slate-50 px-2">AI Analysis</span>
                    <div className="h-px bg-indigo-100 flex-1"></div>
                  </div>
                  <div className="bg-indigo-50/80 border border-indigo-100 rounded-2xl p-4 shadow-sm backdrop-blur-sm">
                    <p className="text-sm text-indigo-800 leading-relaxed font-medium">{msg.text}</p>
                    <div className="flex items-center justify-end gap-1 mt-2">
                      <span className="text-[10px] text-indigo-400">{msg.time}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={`max-w-[75%] flex flex-col ${msg.sender === 'studio' ? 'items-end' : 'items-start'}`}>
                  <div 
                    className={`px-5 py-3.5 rounded-2xl shadow-sm text-sm leading-relaxed ${
                      msg.sender === 'studio' 
                        ? 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-br-none shadow-indigo-200' 
                        : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <div className="flex items-center gap-1 mt-1 px-1">
                    <span className="text-[10px] text-slate-400 font-medium">{msg.time}</span>
                    {msg.sender === 'studio' && <CheckCheck size={12} className="text-indigo-400" />}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-hide">
            {['Preso in carico', 'Ti ricontatto a breve', 'Documenti ricevuti', 'Appuntamento confermato'].map(q => (
              <button 
                key={q} 
                onClick={() => setInput(q)} 
                className="whitespace-nowrap px-3 py-1.5 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-full text-xs font-medium text-slate-600 hover:text-indigo-700 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
          
          <div className="flex items-end gap-3 bg-slate-50 dark:bg-slate-800 p-2 rounded-2xl border border-slate-200 dark:border-slate-700 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-300 transition-all shadow-inner">
            <div className="flex gap-1 pb-1 pl-1">
              <button onClick={() => toast('Seleziona un allegato', { icon: '📎' })} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-colors">
                <Paperclip size={20} />
              </button>
              <button onClick={() => toast('Emoji picker disponibile prossimamente', { icon: '😊' })} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-colors">
                <Smile size={20} />
              </button>
            </div>
            
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())}
              placeholder="Scrivi un messaggio..."
              className="flex-1 bg-transparent border-none outline-none text-sm p-2.5 max-h-32 resize-none placeholder:text-slate-400"
              rows={1}
            />
            
            <button 
              onClick={send} 
              className={`p-2.5 rounded-xl transition-all shadow-sm ${input.trim() ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
              disabled={!input.trim()}
            >
              <Send size={18} className={input.trim() ? 'translate-x-0.5' : ''} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
