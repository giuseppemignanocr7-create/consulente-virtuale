import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard, FileText, Calculator, FolderOpen,
  Calendar, MessageSquare, MessageCircle, Users, Baby, ShieldCheck,
  Settings, ChevronLeft, ChevronRight, Building2, Scale, LogOut
} from 'lucide-react';

const clientNav = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/fatturazione', icon: FileText, label: 'Fatturazione' },
  { to: '/simulatore', icon: Calculator, label: 'Simulatore' },
  { to: '/documenti', icon: FolderOpen, label: 'Documenti' },
  { to: '/scadenze', icon: Calendar, label: 'Scadenze' },
  { to: '/accertamenti', icon: Scale, label: 'Accertamenti' },
  { to: '/tickets', icon: MessageSquare, label: 'Ticket' },
  { to: '/chat', icon: MessageCircle, label: 'Chat' },
];

const studioNav = [
  { to: '/studio', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/clienti', icon: Users, label: 'Clienti' },
  { to: '/fatturazione', icon: FileText, label: 'Fatturazione' },
  { to: '/scadenze', icon: Calendar, label: 'Scadenze' },
  { to: '/tickets', icon: MessageSquare, label: 'Ticket' },
  { to: '/chat', icon: MessageCircle, label: 'Messaggi' },
  { to: '/colf', icon: Baby, label: 'Colf' },
  { to: '/dvr', icon: ShieldCheck, label: 'DVR 81/08' },
  { to: '/accertamenti', icon: Scale, label: 'Accertamenti' },
];

export default function Sidebar() {
  const { role, setRole, sidebarOpen, setSidebarOpen, mobileSidebarOpen, setMobileSidebarOpen } = useApp();
  const navigate = useNavigate();
  const nav = role === 'client' ? clientNav : studioNav;

  const isExpanded = sidebarOpen;

  const handleNavClick = () => {
    if (mobileSidebarOpen) setMobileSidebarOpen(false);
  };

  return (
    <aside 
      className={`fixed top-0 left-0 h-screen bg-white/90 dark:bg-slate-900/95 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800 z-50 flex flex-col transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]
        ${mobileSidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full w-72'}
        lg:translate-x-0 ${isExpanded ? 'lg:w-72' : 'lg:w-20'}
      `}
      role="navigation"
      aria-label="Navigazione principale"
    >
      {/* Logo */}
      <div className="h-20 flex items-center px-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30 flex-shrink-0">
            <Building2 size={20} className="text-white" />
          </div>
          <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'w-auto opacity-100' : 'lg:w-0 lg:opacity-0 w-auto opacity-100'}`}>
            <p className="text-base font-bold text-slate-900 dark:text-white leading-none tracking-tight">Consulente</p>
            <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 leading-none mt-1">Virtuale</p>
          </div>
        </div>
      </div>

      {/* Role toggle */}
      <div className={`px-4 mb-6 transition-all duration-300 ${isExpanded ? 'opacity-100' : 'lg:opacity-0 lg:pointer-events-none lg:hidden opacity-100'}`}>
        <div className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl flex relative">
          <div 
            className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white dark:bg-slate-700 rounded-lg shadow-sm border border-slate-200/50 dark:border-slate-600/50 transition-all duration-300 ease-out ${role === 'client' ? 'left-1.5' : 'left-[calc(50%+1.5px)]'}`}
          />
          <button
            onClick={() => { setRole('client'); navigate('/dashboard'); handleNavClick(); }}
            className={`flex-1 relative z-10 text-xs font-semibold py-2 rounded-lg transition-colors ${role === 'client' ? 'text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
          >
            Cliente
          </button>
          <button
            onClick={() => { setRole('studio'); navigate('/studio'); handleNavClick(); }}
            className={`flex-1 relative z-10 text-xs font-semibold py-2 rounded-lg transition-colors ${role === 'studio' ? 'text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
          >
            Studio
          </button>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-4 space-y-1 scrollbar-hide" aria-label="Menu">
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={handleNavClick}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative ${
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white font-medium'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon 
                  size={22} 
                  strokeWidth={isActive ? 2.5 : 2}
                  className={`flex-shrink-0 transition-colors ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} 
                />
                <span className={`whitespace-nowrap transition-all duration-300 ${isExpanded ? 'opacity-100' : 'lg:opacity-0 lg:w-0 lg:overflow-hidden opacity-100'}`}>
                  {label}
                </span>
                {isActive && isExpanded && (
                  <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 hidden lg:block" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-4 mt-auto border-t border-slate-100 dark:border-slate-800">
        <NavLink
          to="/impostazioni"
          onClick={handleNavClick}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 mb-1 ${
              isActive ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white font-medium'
            }`
          }
        >
          <Settings size={22} className="flex-shrink-0" />
          <span className={`whitespace-nowrap transition-all duration-300 ${isExpanded ? 'opacity-100' : 'lg:opacity-0 lg:w-0 lg:overflow-hidden opacity-100'}`}>Impostazioni</span>
        </NavLink>
        <button
          onClick={() => { navigate('/login'); handleNavClick(); }}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 font-medium transition-all duration-200 group"
        >
          <LogOut size={22} className="flex-shrink-0 group-hover:text-red-600 transition-colors" />
          <span className={`whitespace-nowrap transition-all duration-300 ${isExpanded ? 'opacity-100' : 'lg:opacity-0 lg:w-0 lg:overflow-hidden opacity-100'}`}>Esci</span>
        </button>
      </div>

      {/* Collapse toggle - desktop only */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute -right-3 top-24 w-6 h-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full hidden lg:flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-200 shadow-sm transition-all z-50"
        aria-label={sidebarOpen ? 'Comprimi sidebar' : 'Espandi sidebar'}
      >
        {sidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </button>
    </aside>
  );
}
