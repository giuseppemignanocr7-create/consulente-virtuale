import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, LayoutDashboard, FileText, Calculator, FolderOpen, Calendar, MessageSquare, MessageCircle, Users, Baby, ShieldCheck, Settings, Scale, ArrowRight } from 'lucide-react';
import { mockClients, mockInvoices, mockDocuments } from '../data/mockData';

interface SearchResult {
  type: 'page' | 'client' | 'invoice' | 'document';
  label: string;
  sublabel: string;
  path: string;
  icon: React.ReactNode;
}

const pages: SearchResult[] = [
  { type: 'page', label: 'Dashboard', sublabel: 'Panoramica principale', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
  { type: 'page', label: 'Studio Dashboard', sublabel: 'Vista studio professionale', path: '/studio', icon: <LayoutDashboard size={18} /> },
  { type: 'page', label: 'Fatturazione', sublabel: 'Gestione fatture elettroniche', path: '/fatturazione', icon: <FileText size={18} /> },
  { type: 'page', label: 'Simulatore Fiscale', sublabel: 'Confronto regimi fiscali', path: '/simulatore', icon: <Calculator size={18} /> },
  { type: 'page', label: 'Documenti', sublabel: 'Archivio documenti e firma', path: '/documenti', icon: <FolderOpen size={18} /> },
  { type: 'page', label: 'Scadenze', sublabel: 'Calendario scadenze fiscali', path: '/scadenze', icon: <Calendar size={18} /> },
  { type: 'page', label: 'Ticket', sublabel: 'Assistenza e supporto', path: '/tickets', icon: <MessageSquare size={18} /> },
  { type: 'page', label: 'Chat', sublabel: 'Messaggi con lo studio', path: '/chat', icon: <MessageCircle size={18} /> },
  { type: 'page', label: 'Clienti', sublabel: 'Gestione clienti studio', path: '/clienti', icon: <Users size={18} /> },
  { type: 'page', label: 'Colf & Badanti', sublabel: 'Lavoro domestico', path: '/colf', icon: <Baby size={18} /> },
  { type: 'page', label: 'DVR 81/08', sublabel: 'Sicurezza sul lavoro', path: '/dvr', icon: <ShieldCheck size={18} /> },
  { type: 'page', label: 'Accertamenti', sublabel: 'Gestione accertamenti tributari', path: '/accertamenti', icon: <Scale size={18} /> },
  { type: 'page', label: 'Impostazioni', sublabel: 'Profilo e preferenze', path: '/impostazioni', icon: <Settings size={18} /> },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(prev => !prev);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const results = useMemo<SearchResult[]>(() => {
    if (!query.trim()) return pages;
    const q = query.toLowerCase();

    const pageResults = pages.filter(p => p.label.toLowerCase().includes(q) || p.sublabel.toLowerCase().includes(q));

    const clientResults: SearchResult[] = mockClients
      .filter(c => c.name.toLowerCase().includes(q) || c.fiscalCode?.toLowerCase().includes(q))
      .slice(0, 3)
      .map(c => ({ type: 'client', label: c.name, sublabel: `${c.regime} · ${c.packageType}`, path: '/clienti', icon: <Users size={18} /> }));

    const invoiceResults: SearchResult[] = mockInvoices
      .filter(i => i.recipientName.toLowerCase().includes(q) || i.number.toLowerCase().includes(q))
      .slice(0, 3)
      .map(i => ({ type: 'invoice', label: `${i.number} — ${i.recipientName}`, sublabel: `€${i.total} · ${i.status}`, path: '/fatturazione', icon: <FileText size={18} /> }));

    const docResults: SearchResult[] = mockDocuments
      .filter(d => d.name.toLowerCase().includes(q) || d.type.toLowerCase().includes(q))
      .slice(0, 3)
      .map(d => ({ type: 'document', label: d.name, sublabel: `${d.type} · ${d.uploadedAt}`, path: '/documenti', icon: <FolderOpen size={18} /> }));

    return [...pageResults, ...clientResults, ...invoiceResults, ...docResults];
  }, [query]);

  useEffect(() => { setSelectedIdx(0); }, [results]);

  const handleSelect = (result: SearchResult) => {
    navigate(result.path);
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIdx(i => Math.min(i + 1, results.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIdx(i => Math.max(i - 1, 0)); }
    if (e.key === 'Enter' && results[selectedIdx]) { handleSelect(results[selectedIdx]); }
  };

  if (!open) return null;

  const typeLabels: Record<string, string> = { page: 'Pagine', client: 'Clienti', invoice: 'Fatture', document: 'Documenti' };
  let lastType = '';

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]" onClick={() => setOpen(false)}>
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
      <div 
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-enter"
        onClick={e => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <Search size={20} className="text-slate-400 flex-shrink-0" />
          <input 
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Cerca pagine, clienti, fatture, documenti..."
            className="flex-1 bg-transparent text-slate-900 dark:text-slate-100 text-sm outline-none placeholder:text-slate-400"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto p-2">
          {results.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-slate-500">Nessun risultato per "<strong>{query}</strong>"</p>
            </div>
          ) : (
            results.map((r, i) => {
              const showHeader = r.type !== lastType;
              lastType = r.type;
              return (
                <div key={`${r.type}-${i}`}>
                  {showHeader && (
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 pt-3 pb-1">{typeLabels[r.type]}</p>
                  )}
                  <button
                    onClick={() => handleSelect(r)}
                    onMouseEnter={() => setSelectedIdx(i)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                      i === selectedIdx ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className={`flex-shrink-0 ${i === selectedIdx ? 'text-indigo-600' : 'text-slate-400'}`}>
                      {r.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${i === selectedIdx ? 'text-indigo-900 dark:text-indigo-200' : 'text-slate-700 dark:text-slate-300'}`}>{r.label}</p>
                      <p className="text-xs text-slate-400 truncate">{r.sublabel}</p>
                    </div>
                    {i === selectedIdx && <ArrowRight size={14} className="text-indigo-400 flex-shrink-0" />}
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3 text-[10px] text-slate-400">
            <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-[10px] font-bold">↑↓</kbd> Naviga</span>
            <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-[10px] font-bold">↵</kbd> Apri</span>
            <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-[10px] font-bold">ESC</kbd> Chiudi</span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium">{results.length} risultati</p>
        </div>
      </div>
    </div>
  );
}
