import { useState, useRef, useEffect } from 'react';
import { Bell, Menu, Bot, Search, Sun, Moon, Settings, LogOut, User, ChevronRight, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { useNotifications } from '../hooks/useNotifications';
import toast from 'react-hot-toast';

const titles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/studio': 'Dashboard Studio',
  '/clienti': 'Clienti',
  '/fatturazione': 'Fatturazione',
  '/simulatore': 'Simulatore',
  '/documenti': 'Documenti',
  '/accertamenti': 'Accertamenti',
  '/scadenze': 'Scadenze',
  '/tickets': 'Ticket',
  '/chat': 'Chat',
  '/colf': 'Colf',
  '/dvr': 'DVR',
  '/impostazioni': 'Impostazioni',
};

export default function Header() {
  const { aiPanelOpen, setAiPanelOpen, unreadAI, userName, role, darkMode, toggleDarkMode, setMobileSidebarOpen } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const title = titles[location.pathname] ?? 'Consulente Virtuale';

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { notifications, unreadCount: unreadNotifs, markRead: markReadHook, markAllRead: markAllReadHook } = useNotifications();
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markAllRead = () => {
    markAllReadHook();
    toast.success('Tutte le notifiche segnate come lette');
  };

  const markRead = (id: string) => { markReadHook(id); };

  const handleLogout = () => {
    setProfileOpen(false);
    toast.success('Disconnessione effettuata');
    navigate('/login');
  };

  const openCommandPalette = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
  };

  return (
    <header className="h-16 md:h-20 flex items-center justify-between px-4 md:px-8 flex-shrink-0 z-20 bg-slate-50/50 dark:bg-slate-950/50">
      <div className="flex items-center gap-3 md:gap-4">
        <button 
          onClick={() => setMobileSidebarOpen(true)} 
          className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Apri menu"
        >
          <Menu size={22} />
        </button>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{title}</h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium hidden sm:block">Benvenuto, {userName.split(' ')[0]}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        {/* Search bar */}
        <button 
          onClick={openCommandPalette}
          className="hidden md:flex items-center bg-white dark:bg-slate-800 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all w-56 lg:w-64 shadow-sm group"
        >
          <Search size={18} className="text-slate-400 mr-2 group-hover:text-indigo-500 transition-colors" />
          <span className="text-sm text-slate-400 flex-1 text-left">Cerca...</span>
          <kbd className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded-md border border-slate-200 dark:border-slate-600">⌘K</kbd>
        </button>

        {/* Mobile search */}
        <button 
          onClick={openCommandPalette}
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 shadow-sm"
          aria-label="Cerca"
        >
          <Search size={18} />
        </button>

        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 hover:border-amber-200 dark:hover:border-amber-700 transition-all shadow-sm"
          aria-label={darkMode ? 'Tema chiaro' : 'Tema scuro'}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* AI Copilot */}
        <button
          onClick={() => setAiPanelOpen(!aiPanelOpen)}
          className={`group relative flex items-center gap-2 px-3 py-2.5 rounded-2xl text-sm font-semibold transition-all shadow-sm border ${aiPanelOpen ? 'bg-indigo-600 text-white border-transparent shadow-indigo-200 dark:shadow-indigo-900/50' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400'}`}
        >
          <Bot size={18} className={aiPanelOpen ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'} />
          <span className="hidden sm:inline">Copilot</span>
          {unreadAI > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold border-2 border-slate-50 dark:border-slate-950">
              {unreadAI}
            </span>
          )}
        </button>

        <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700 mx-0.5 hidden sm:block"></div>

        {/* Notifications */}
        <div className="relative hidden sm:block" ref={notifRef}>
          <button 
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
            className={`relative w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-2xl border text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white transition-all shadow-sm ${notifOpen ? 'bg-indigo-50 dark:bg-indigo-950 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
            aria-label="Notifiche"
          >
            <Bell size={20} />
            {unreadNotifs > 0 && (
              <span className="absolute top-1.5 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {notifOpen && (
            <div className="absolute right-0 top-14 w-96 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl z-50 animate-enter overflow-hidden">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">Notifiche</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{unreadNotifs} non lette</p>
                </div>
                <div className="flex items-center gap-2">
                  {unreadNotifs > 0 && (
                    <button onClick={markAllRead} className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 px-2 py-1 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors">
                      Segna tutte lette
                    </button>
                  )}
                  <button onClick={() => setNotifOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                    <X size={16} />
                  </button>
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                {notifications.map(n => (
                  <div 
                    key={n.id} 
                    onClick={() => markRead(n.id)}
                    className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors ${!n.read ? 'bg-indigo-50/50 dark:bg-indigo-950/30' : ''}`}
                  >
                    <div className="flex gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!n.read ? 'bg-indigo-500' : 'bg-transparent'}`}></div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold ${!n.read ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>{n.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{n.summary}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{n.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-slate-100 dark:border-slate-800">
                <button 
                  onClick={() => { setNotifOpen(false); setAiPanelOpen(true); }}
                  className="w-full text-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 py-2 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors"
                >
                  Vedi tutte nel Copilot →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button 
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
            className={`flex items-center gap-3 pl-1 rounded-2xl transition-all ${profileOpen ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-950' : ''}`}
            aria-label="Profilo utente"
          >
            <div className={`w-10 h-10 md:w-11 md:h-11 rounded-2xl flex items-center justify-center text-white text-sm md:text-base font-bold shadow-lg shadow-indigo-100 dark:shadow-indigo-900/30 ${role === 'studio' ? 'bg-gradient-to-br from-indigo-500 to-violet-600' : 'bg-gradient-to-br from-blue-500 to-cyan-600'}`}>
              {userName.charAt(0)}
            </div>
          </button>

          {/* Profile Dropdown */}
          {profileOpen && (
            <div className="absolute right-0 top-14 w-72 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl z-50 animate-enter overflow-hidden">
              <div className="p-5 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg ${role === 'studio' ? 'bg-gradient-to-br from-indigo-500 to-violet-600' : 'bg-gradient-to-br from-blue-500 to-cyan-600'}`}>
                    {userName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{userName}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {role === 'client' ? 'marco@rossi.it' : 'studio@contiassociati.it'}
                    </p>
                    <span className={`inline-block mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wide ${role === 'studio' ? 'bg-violet-50 dark:bg-violet-950 text-violet-700 dark:text-violet-300' : 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300'}`}>
                      {role === 'client' ? 'Cliente' : 'Studio'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-2">
                <button 
                  onClick={() => { setProfileOpen(false); navigate('/impostazioni'); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <User size={18} className="text-slate-400" />
                  Il mio profilo
                  <ChevronRight size={14} className="ml-auto text-slate-300" />
                </button>
                <button 
                  onClick={() => { setProfileOpen(false); navigate('/impostazioni'); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <Settings size={18} className="text-slate-400" />
                  Impostazioni
                  <ChevronRight size={14} className="ml-auto text-slate-300" />
                </button>
                <button 
                  onClick={() => { toggleDarkMode(); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  {darkMode ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} className="text-slate-400" />}
                  {darkMode ? 'Tema chiaro' : 'Tema scuro'}
                </button>
              </div>

              <div className="p-2 border-t border-slate-100 dark:border-slate-800">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                >
                  <LogOut size={18} />
                  Esci dall'account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
