import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const labels: Record<string, string> = {
  dashboard: 'Dashboard',
  studio: 'Studio Dashboard',
  clienti: 'Clienti',
  fatturazione: 'Fatturazione',
  simulatore: 'Simulatore Fiscale',
  documenti: 'Documenti',
  accertamenti: 'Accertamenti',
  scadenze: 'Scadenze',
  tickets: 'Ticket',
  chat: 'Chat',
  colf: 'Colf & Badanti',
  dvr: 'DVR 81/08',
  impostazioni: 'Impostazioni',
};

export default function Breadcrumb() {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);

  if (segments.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm mb-6">
      <Link 
        to="/dashboard" 
        className="flex items-center gap-1 text-slate-400 hover:text-indigo-600 transition-colors"
        aria-label="Home"
      >
        <Home size={14} />
      </Link>
      {segments.map((seg, i) => {
        const path = '/' + segments.slice(0, i + 1).join('/');
        const isLast = i === segments.length - 1;
        const label = labels[seg] || seg;

        return (
          <span key={path} className="flex items-center gap-1.5">
            <ChevronRight size={12} className="text-slate-300" />
            {isLast ? (
              <span className="font-semibold text-slate-900 dark:text-slate-100">{label}</span>
            ) : (
              <Link to={path} className="text-slate-400 hover:text-indigo-600 transition-colors">
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
