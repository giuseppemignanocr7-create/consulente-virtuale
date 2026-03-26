import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Building2, Eye, EyeOff, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const { setRole } = useApp();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [selected, setSelected] = useState<'client' | 'studio'>('client');

  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setRole(selected);
      toast.success(`Accesso effettuato come ${selected === 'client' ? 'Cliente' : 'Studio'}`);
      navigate(selected === 'studio' ? '/studio' : '/dashboard');
      setLoading(false);
    }, 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-blue-700 to-slate-900 opacity-90"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Building2 size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Consulente Virtuale</span>
          </div>
          <h1 className="text-5xl font-bold text-white leading-tight mb-6">
            Il futuro della <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-200">
              consulenza fiscale
            </span>
          </h1>
          <p className="text-blue-100/80 text-lg max-w-md leading-relaxed">
            Gestisci la tua attività, le scadenze e i documenti con l'aiuto dell'Intelligenza Artificiale. Semplice, veloce, sicuro.
          </p>
        </div>

        <div className="relative z-10 space-y-4">
          <FeatureRow text="Analisi fiscale in tempo reale" />
          <FeatureRow text="Gestione documenti automatizzata" />
          <FeatureRow text="Supporto AI 24/7" />
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-slate-900">
        <div className="w-full max-w-md space-y-8 animate-enter">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Bentornato</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Inserisci le tue credenziali per accedere</p>
          </div>

          {/* Role Switcher */}
          <div className="p-1 bg-slate-100 dark:bg-slate-800 rounded-xl flex">
            <button
              onClick={() => setSelected('client')}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                selected === 'client' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white'
              }`}
            >
              Cliente
            </button>
            <button
              onClick={() => setSelected('studio')}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                selected === 'studio' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white'
              }`}
            >
              Studio
            </button>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
              <input
                type="email"
                defaultValue={selected === 'client' ? 'marco@rossi.it' : 'studio@conti.it'}
                className="input h-12"
                placeholder="name@example.com"
                onKeyDown={handleKeyDown}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  defaultValue="demo1234"
                  className="input h-12 pr-10"
                  placeholder="••••••••"
                  onKeyDown={handleKeyDown}
                />
                <button
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button onClick={() => toast('Funzione disponibile prossimamente', { icon: '📧' })} className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
              Hai dimenticato la password?
            </button>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full btn btn-primary h-12 text-base font-semibold shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30 hover:shadow-indigo-300 transition-all disabled:opacity-70"
            >
              {loading ? 'Accesso in corso...' : <>Accedi <ArrowRight size={18} className="ml-2" /></>}
            </button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-slate-900 text-slate-500">oppure continua con</span>
              </div>
            </div>

            <button onClick={() => toast('Accesso SPID/CIE disponibile prossimamente', { icon: '🔐' })} className="w-full btn btn-secondary h-12 font-medium flex gap-2">
              <ShieldCheck size={18} className="text-indigo-600" /> SPID / CIE
            </button>
          </div>

          <p className="text-center text-sm text-slate-500 pt-4">
            Non hai un account?{' '}
            <button onClick={() => toast('Registrazione disponibile prossimamente', { icon: '📋' })} className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
              Richiedi consulenza
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

function FeatureRow({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 text-blue-100/90">
      <CheckCircle2 size={20} className="text-blue-400" />
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
}
