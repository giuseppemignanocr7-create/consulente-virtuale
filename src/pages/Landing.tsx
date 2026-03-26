import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  FileText, Calculator, ShieldCheck, Scale, Calendar, MessageSquare,
  Users, Bot, CheckCircle, ArrowRight, Star, Zap, Lock,
  TrendingUp, Bell, Globe, Building2, UserCheck, ChevronRight,
  BarChart3, FolderOpen, Clock, CreditCard, AlertTriangle,
  XCircle, MinusCircle, Scan, Smartphone, Video, Webhook, Palette,
  Rocket, Sparkles, Trophy, Shield, Database,
} from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const { setRole } = useApp();

  const enterAsClient = () => {
    setRole('client');
    navigate('/dashboard');
  };

  const enterAsStudio = () => {
    setRole('studio');
    navigate('/studio');
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* TOP NAV */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-200">
              <Scale size={18} className="text-white" />
            </div>
            <span className="font-black text-slate-900 text-lg tracking-tight">Consulente<span className="text-indigo-600">Virtuale</span></span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#funzionalita" className="hover:text-indigo-600 transition-colors">Funzionalità</a>
            <a href="#innovation" className="hover:text-indigo-600 transition-colors">Innovazione</a>
            <a href="#vs-concorrenti" className="hover:text-indigo-600 transition-colors">Vs Concorrenti</a>
            <a href="#roadmap" className="hover:text-indigo-600 transition-colors">Roadmap</a>
          </nav>
          <div className="flex items-center gap-3">
            <button
              onClick={enterAsClient}
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-semibold text-indigo-700 border-2 border-indigo-200 rounded-xl hover:bg-indigo-50 hover:border-indigo-400 transition-all"
            >
              <UserCheck size={16} /> Area Clienti
            </button>
            <button
              onClick={enterAsStudio}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-200 transition-all"
            >
              <Building2 size={16} /> Area Studio
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-600/15 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-indigo-200 text-sm font-semibold mb-8 backdrop-blur-sm">
              <Zap size={14} className="text-indigo-300" />
              Piattaforma digitale per consulenti del lavoro e i loro clienti
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight mb-6">
              Il tuo studio fiscale{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                sempre con te
              </span>
            </h1>

            <p className="text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto mb-12">
              Fatture, dichiarazioni, scadenze, buste paga, accertamenti e molto altro — tutto in un'unica piattaforma intelligente con AI integrata. Per lo studio e per i clienti.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={enterAsClient}
                className="group w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-white text-indigo-900 rounded-2xl font-bold text-lg hover:bg-indigo-50 transition-all shadow-2xl shadow-indigo-900/30 hover:scale-105"
              >
                <UserCheck size={22} />
                Accedi come Cliente
                <span className="text-xs font-normal bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">Demo gratuita</span>
              </button>
              <button
                onClick={enterAsStudio}
                className="group w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-lg transition-all shadow-2xl shadow-indigo-600/40 hover:scale-105 border border-indigo-400/30"
              >
                <Building2 size={22} />
                Accedi come Studio
                <span className="text-xs font-normal bg-white/20 px-2 py-0.5 rounded-full">Demo gratuita</span>
              </button>
            </div>

            <p className="mt-6 text-slate-500 text-sm">
              Nessuna registrazione richiesta · Accesso demo immediato · Dati di esempio inclusi
            </p>
          </div>

          {/* STATS ROW */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              { value: '15+', label: 'Moduli integrati' },
              { value: 'AI', label: 'Copilot incluso' },
              { value: '100%', label: 'Conforme GDPR' },
              { value: '24/7', label: 'Disponibile sempre' },
            ].map((s, i) => (
              <div key={i} className="text-center p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
                <p className="text-3xl font-black text-white mb-1">{s.value}</p>
                <p className="text-sm text-slate-400 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEMO BANNER */}
      <section className="bg-gradient-to-r from-amber-500 to-orange-500 py-4">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-white text-sm font-medium">
          <div className="flex items-center gap-2">
            <Star size={16} className="text-yellow-200" />
            <span>Stai esplorando la versione demo — tutti i dati sono simulati</span>
          </div>
          <div className="flex gap-3">
            <button onClick={enterAsClient} className="px-4 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg font-bold transition-colors flex items-center gap-1.5">
              <UserCheck size={14} /> Cliente Demo <ChevronRight size={14} />
            </button>
            <button onClick={enterAsStudio} className="px-4 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg font-bold transition-colors flex items-center gap-1.5">
              <Building2 size={14} /> Studio Demo <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* FUNZIONALITÀ */}
      <section id="funzionalita" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-indigo-600 font-bold text-sm uppercase tracking-widest">Funzionalità</span>
            <h2 className="text-4xl font-black text-slate-900 mt-2 mb-4">Tutto ciò di cui hai bisogno</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">Una suite completa per gestire ogni aspetto della consulenza del lavoro e fiscale, in modo digitale e intelligente.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50 transition-all group">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-sm ${f.bg}`}>
                  <f.icon size={22} className={f.iconColor} />
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2 group-hover:text-indigo-700 transition-colors">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">{f.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {f.tags.map((t, j) => (
                    <span key={j} className="text-[10px] font-semibold px-2.5 py-1 bg-slate-50 text-slate-600 border border-slate-100 rounded-lg uppercase tracking-wide">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INNOVATION LAB */}
      <section id="innovation" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-50 border border-violet-100 rounded-full text-violet-700 text-sm font-bold mb-4">
              <Sparkles size={16} /> Innovation Lab
            </div>
            <h2 className="text-4xl font-black text-slate-900 mt-2 mb-4">Tecnologia anni avanti</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">Funzionalità che nessun competitor italiano offre. Costruite con le architetture più avanzate del 2026.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {innovations.map((item, i) => (
              <div key={i} className={`relative rounded-2xl p-6 border-2 transition-all hover:shadow-xl hover:-translate-y-1 cursor-default ${
                item.tier === 1 ? 'border-emerald-100 bg-gradient-to-br from-emerald-50/60 to-white hover:border-emerald-300' :
                item.tier === 2 ? 'border-amber-100 bg-gradient-to-br from-amber-50/60 to-white hover:border-amber-300' :
                'border-violet-100 bg-gradient-to-br from-violet-50/60 to-white hover:border-violet-300'
              }`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${
                    item.tier === 1 ? 'bg-emerald-100 text-emerald-700' :
                    item.tier === 2 ? 'bg-amber-100 text-amber-700' :
                    'bg-violet-100 text-violet-700'
                  }`}>
                    <item.icon size={22} />
                  </div>
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest whitespace-nowrap ${
                    item.tier === 1 ? 'bg-emerald-100 text-emerald-700' :
                    item.tier === 2 ? 'bg-amber-100 text-amber-700' :
                    'bg-violet-100 text-violet-700'
                  }`}>{item.badge}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                {item.exclusive && (
                  <div className="mt-3 inline-flex items-center gap-1 text-[10px] font-black text-rose-600 bg-rose-50 border border-rose-100 px-2.5 py-1 rounded-full">
                    <Trophy size={10} /> ESCLUSIVA MONDIALE
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI COPILOT SECTION */}
      <section className="py-24 bg-gradient-to-br from-indigo-600 to-violet-700 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-400/10 rounded-full blur-3xl"></div>
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 border border-white/20 rounded-full text-sm font-semibold mb-6">
                <Bot size={16} className="text-indigo-200" /> AI Copilot integrato
              </div>
              <h2 className="text-4xl font-black mb-6 leading-tight">Il tuo consulente AI disponibile 24/7</h2>
              <p className="text-indigo-100 text-lg leading-relaxed mb-8">
                L'assistente intelligente analizza in autonomia la tua situazione fiscale, ti avvisa sulle scadenze critiche, identifica opportunità di risparmio e risponde alle tue domande in tempo reale.
              </p>
              <div className="space-y-4">
                {[
                  'Analisi autonoma della posizione fiscale',
                  'Alert automatici su scadenze e norme',
                  'Risposta a domande fiscali e lavoristiche',
                  'Identificazione opportunità di risparmio',
                  'Supporto per accertamenti e contenziosi',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-indigo-100">
                    <CheckCircle size={18} className="text-emerald-400 flex-shrink-0" />
                    <span className="text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
              <button onClick={enterAsClient} className="mt-10 flex items-center gap-2 px-6 py-3 bg-white text-indigo-700 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-lg">
                Prova l'AI Copilot <ArrowRight size={18} />
              </button>
            </div>
            <div className="space-y-4">
              {aiMessages.map((m, i) => (
                <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs px-4 py-3 rounded-2xl text-sm font-medium shadow-lg ${m.from === 'user' ? 'bg-white text-indigo-900 rounded-br-md' : 'bg-white/15 text-white border border-white/20 rounded-bl-md'}`}>
                    {m.from === 'ai' && (
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Bot size={12} className="text-indigo-300" />
                        <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wide">AI Copilot</span>
                      </div>
                    )}
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* VS CONCORRENTI */}
      <section id="vs-concorrenti" className="py-24 bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-sm font-bold mb-4">
              <Trophy size={16} className="text-yellow-400" /> Confronto diretto
            </div>
            <h2 className="text-4xl font-black mt-2 mb-4">Perché siamo diversi da tutti</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">Un confronto onesto con i principali software del mercato italiano. I numeri parlano chiaro.</p>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[720px]">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="p-5 text-left text-slate-400 font-semibold text-sm w-64">Funzionalità</th>
                  <th className="p-5 text-center bg-indigo-600/30 border-x border-indigo-500/40">
                    <span className="text-xs font-black text-indigo-300 uppercase tracking-widest">⭐ ConsulentaVirtuale</span>
                  </th>
                  <th className="p-5 text-center text-slate-500 text-xs font-bold uppercase tracking-wide">TeamSystem</th>
                  <th className="p-5 text-center text-slate-500 text-xs font-bold uppercase tracking-wide">Zucchetti</th>
                  <th className="p-5 text-center text-slate-500 text-xs font-bold uppercase tracking-wide">Fiscozen</th>
                  <th className="p-5 text-center text-slate-500 text-xs font-bold uppercase tracking-wide">Fatt. Cloud</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-5">
                      <p className="font-semibold text-white text-sm">{row.feature}</p>
                      {row.sub && <p className="text-xs text-slate-500 mt-0.5">{row.sub}</p>}
                    </td>
                    <td className="p-4 text-center bg-indigo-600/10 border-x border-indigo-500/20"><CompCell v={row.us} /></td>
                    <td className="p-4 text-center"><CompCell v={row.ts} /></td>
                    <td className="p-4 text-center"><CompCell v={row.zuc} /></td>
                    <td className="p-4 text-center"><CompCell v={row.fisco} /></td>
                    <td className="p-4 text-center"><CompCell v={row.fic} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-8 text-sm text-slate-400">
            <span className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-400" /> Incluso</span>
            <span className="flex items-center gap-2"><MinusCircle size={16} className="text-amber-400" /> Parziale / Modulo extra a pagamento</span>
            <span className="flex items-center gap-2"><XCircle size={16} className="text-rose-400/70" /> Non disponibile</span>
          </div>
        </div>
      </section>

      {/* COME FUNZIONA */}
      <section id="come-funziona" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-indigo-600 font-bold text-sm uppercase tracking-widest">Come funziona</span>
            <h2 className="text-4xl font-black text-slate-900 mt-2 mb-4">Inizia in 3 semplici passi</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="text-center relative">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-full h-0.5 bg-gradient-to-r from-indigo-200 to-transparent"></div>
                )}
                <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-xl shadow-indigo-200 mb-6 relative z-10">
                  <s.icon size={32} />
                </div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-6 bg-indigo-600 text-white text-xs font-black rounded-full flex items-center justify-center -mt-1">
                  {i + 1}
                </div>
                <h3 className="font-bold text-slate-900 text-xl mb-3">{s.title}</h3>
                <p className="text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PER CHI */}
      <section id="per-chi" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-indigo-600 font-bold text-sm uppercase tracking-widest">Per chi è pensato</span>
            <h2 className="text-4xl font-black text-slate-900 mt-2 mb-4">Due aree, un'unica piattaforma</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* CLIENT CARD */}
            <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-8 text-white">
                <UserCheck size={40} className="mb-4" />
                <h3 className="text-2xl font-black mb-2">Area Cliente</h3>
                <p className="text-blue-100">Per liberi professionisti, ditte individuali, aziende e privati che vogliono gestire in autonomia la propria posizione fiscale.</p>
              </div>
              <div className="p-8 space-y-3">
                {clientFeatures.map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle size={18} className="text-indigo-500 flex-shrink-0" />
                    <span className="text-slate-700 text-sm font-medium">{f}</span>
                  </div>
                ))}
                <button onClick={enterAsClient} className="mt-6 w-full py-3.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-200">
                  Accedi come Cliente Demo <ArrowRight size={18} />
                </button>
              </div>
            </div>

            {/* STUDIO CARD */}
            <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all group">
              <div className="bg-gradient-to-br from-violet-600 to-purple-700 p-8 text-white">
                <Building2 size={40} className="mb-4" />
                <h3 className="text-2xl font-black mb-2">Area Studio</h3>
                <p className="text-violet-100">Per studi di consulenza del lavoro e commercialisti che vogliono gestire l'intero portafoglio clienti da un'unica piattaforma.</p>
              </div>
              <div className="p-8 space-y-3">
                {studioFeatures.map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle size={18} className="text-violet-500 flex-shrink-0" />
                    <span className="text-slate-700 text-sm font-medium">{f}</span>
                  </div>
                ))}
                <button onClick={enterAsStudio} className="mt-6 w-full py-3.5 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-violet-200">
                  Accedi come Studio Demo <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROADMAP */}
      <section id="roadmap" className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-700 text-sm font-bold mb-4">
              <Rocket size={16} /> Roadmap 2026
            </div>
            <h2 className="text-4xl font-black text-slate-900 mt-2 mb-4">Cosa sta arrivando</h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">Ogni trimestre rilasciamo nuove funzionalità che ridefiniscono lo standard del mercato. Pubblicamente, senza sorprese.</p>
          </div>
          <div className="relative">
            <div className="absolute left-[18px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-emerald-400 via-indigo-500 to-slate-200 rounded-full"></div>
            <div className="space-y-8">
              {roadmap.map((q, i) => (
                <div key={i} className="relative pl-16">
                  <div className={`absolute left-0 w-9 h-9 rounded-full flex items-center justify-center border-4 border-white shadow-lg ${
                    q.status === 'done' ? 'bg-emerald-500' :
                    q.status === 'in_progress' ? 'bg-indigo-600 ring-4 ring-indigo-100' :
                    'bg-slate-200'
                  }`}>
                    {q.status === 'done' ? <CheckCircle size={16} className="text-white" /> :
                     q.status === 'in_progress' ? <Zap size={16} className="text-white" /> :
                     <Clock size={16} className="text-slate-500" />}
                  </div>
                  <div className={`rounded-2xl p-6 border-2 ${
                    q.status === 'done' ? 'bg-emerald-50 border-emerald-100' :
                    q.status === 'in_progress' ? 'bg-indigo-50 border-indigo-300 shadow-lg shadow-indigo-100' :
                    'bg-slate-50 border-slate-100'
                  }`}>
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className={`text-xs font-black px-3 py-1.5 rounded-xl uppercase tracking-widest ${
                        q.status === 'done' ? 'bg-emerald-100 text-emerald-700' :
                        q.status === 'in_progress' ? 'bg-indigo-100 text-indigo-700' :
                        'bg-slate-200 text-slate-600'
                      }`}>{q.quarter}</span>
                      <h3 className="font-black text-slate-900 text-lg">{q.title}</h3>
                      {q.status === 'in_progress' && (
                        <span className="ml-auto text-xs font-bold text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full animate-pulse">🚀 In corso ora</span>
                      )}
                      {q.status === 'done' && (
                        <span className="ml-auto text-xs font-bold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">✅ Completato</span>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.items.map((item, j) => (
                        <div key={j} className="flex items-center gap-2.5 text-sm">
                          {q.status === 'done'
                            ? <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
                            : <ChevronRight size={14} className={`flex-shrink-0 ${q.status === 'in_progress' ? 'text-indigo-500' : 'text-slate-300'}`} />
                          }
                          <span className={
                            q.status === 'done' ? 'text-emerald-800 font-medium' :
                            q.status === 'in_progress' ? 'text-indigo-900 font-semibold' :
                            'text-slate-500'
                          }>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* NORMATIVA */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900 mb-3">Conformità normativa garantita</h2>
            <p className="text-slate-500">Costantemente aggiornato con le ultime disposizioni fiscali e lavoristiche italiane</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {norme.map((n, i) => (
              <div key={i} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-center hover:border-indigo-200 transition-colors">
                <div className="text-2xl mb-2">{n.emoji}</div>
                <p className="font-bold text-slate-900 text-sm">{n.title}</p>
                <p className="text-xs text-slate-500 mt-1">{n.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 bg-gradient-to-br from-slate-900 to-indigo-950 text-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mb-6 shadow-2xl shadow-indigo-900">
            <Scale size={30} className="text-white" />
          </div>
          <h2 className="text-4xl font-black mb-4">Pronto a iniziare?</h2>
          <p className="text-slate-400 text-lg mb-10">Esplora subito la piattaforma in modalità demo. Nessuna registrazione, nessuna carta di credito.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={enterAsClient}
              className="flex items-center justify-center gap-3 px-8 py-4 bg-white text-indigo-900 rounded-2xl font-bold text-lg hover:bg-indigo-50 transition-all shadow-2xl hover:scale-105"
            >
              <UserCheck size={22} /> Accedi come Cliente
            </button>
            <button
              onClick={enterAsStudio}
              className="flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-lg transition-all shadow-2xl shadow-indigo-600/30 hover:scale-105 border border-indigo-400/30"
            >
              <Building2 size={22} /> Accedi come Studio
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
                <Scale size={15} className="text-white" />
              </div>
              <span className="font-black text-white text-base">Consulente<span className="text-indigo-400">Virtuale</span></span>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <span className="flex items-center gap-1.5"><Lock size={13} className="text-slate-500" /> Privacy Policy</span>
              <span className="flex items-center gap-1.5"><Globe size={13} className="text-slate-500" /> Termini di servizio</span>
              <span className="flex items-center gap-1.5"><ShieldCheck size={13} className="text-slate-500" /> GDPR Compliant</span>
            </div>
            <p className="text-xs text-slate-600">© 2026 ConsulenteLavoro SRL — P.IVA 01234567890</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function CompCell({ v }: { v: boolean | string }) {
  if (v === true) return <CheckCircle size={20} className="text-emerald-400 mx-auto" />;
  if (v === 'partial') return <MinusCircle size={20} className="text-amber-400 mx-auto" />;
  return <XCircle size={20} className="text-rose-500/50 mx-auto" />;
}

const innovations = [
  { icon: Bot, title: 'AI Copilot Autonomo', desc: 'Non solo un chatbot: analizza proattivamente la tua posizione fiscale, invia alert autonomi e suggerisce azioni concrete senza che tu chieda nulla.', badge: 'Disponibile ora', tier: 1, exclusive: false },
  { icon: Scan, title: 'OCR + AI Document Scanner', desc: "Fotografa uno scontrino o una fattura e l'AI estrae automaticamente tutti i dati strutturati in 2 secondi. Zero digitazione manuale.", badge: 'In sviluppo', tier: 2, exclusive: true },
  { icon: Database, title: 'Cassetto Fiscale Sync', desc: "Import automatico di tutti i dati fiscali dall'Agenzia delle Entrate via SPID. Dichiarazioni, F24, CU, 730 sempre sincronizzati senza sforzo.", badge: 'In sviluppo', tier: 2, exclusive: true },
  { icon: FileText, title: 'F24 Autopilot', desc: 'Il sistema genera e pre-compila automaticamente i modelli F24 basandosi sui calcoli già presenti. Approvi in un click, paghi con la tua banca.', badge: 'In sviluppo', tier: 2, exclusive: false },
  { icon: Shield, title: 'Blockchain Timestamp', desc: 'Ogni documento firmato ottiene un hash immutabile su blockchain pubblica. Prova legale inattaccabile, zero costo notarile.', badge: 'Roadmap Q3', tier: 3, exclusive: true },
  { icon: MessageSquare, title: 'WhatsApp & Telegram Bot', desc: 'Alert scadenze, messaggi urgenti e notifiche direttamente su WhatsApp o Telegram. Rispondi via messaggio senza aprire nessuna app.', badge: 'Roadmap Q2', tier: 2, exclusive: false },
  { icon: Video, title: 'Video Consultation', desc: 'Prenota una video chiamata col consulente direttamente in-app. Calendario disponibilità real-time, reminder automatici e registrazione opzionale.', badge: 'Roadmap Q2', tier: 2, exclusive: false },
  { icon: TrendingUp, title: 'Predictive Cash Flow AI', desc: "L'AI proietta i flussi di cassa per i prossimi 12 mesi basandosi su storico fatturato, scadenze fiscali e trend del settore ATECO.", badge: 'Roadmap Q3', tier: 3, exclusive: true },
  { icon: AlertTriangle, title: 'Client Risk Score', desc: "Punteggio di rischio per ogni cliente calcolato da AI: omissioni storiche, accertamenti pendenti, ritardi abituali. L'app avvisa prima che sia tardi.", badge: 'Roadmap Q3', tier: 3, exclusive: true },
  { icon: Webhook, title: 'API Gateway & SDK', desc: 'Connetti ConsulentaVirtuale a SAP, Oracle, qualsiasi banca o ERP aziendale. SDK disponibile in Python, Node.js, Java e PHP.', badge: 'Roadmap Q4', tier: 3, exclusive: false },
  { icon: Palette, title: 'White Label per Studi', desc: 'Lo studio personalizza colori, logo e dominio e revende la piattaforma ai propri clienti con il proprio brand. Revenue stream aggiuntivo immediato.', badge: 'Roadmap Q4', tier: 3, exclusive: false },
  { icon: Smartphone, title: 'Mobile PWA Offline-First', desc: 'App installabile su smartphone con funzionamento completamente offline, push notifications native e sincronizzazione automatica al rientro online.', badge: 'Roadmap Q4', tier: 3, exclusive: false },
];

const comparisonRows: Array<{ feature: string; sub?: string; us: boolean | string; ts: boolean | string; zuc: boolean | string; fisco: boolean | string; fic: boolean | string }> = [
  { feature: 'Portale cliente + studio unificato', sub: "Un'unica app per entrambi i ruoli", us: true, ts: false, zuc: false, fisco: false, fic: false },
  { feature: 'AI Copilot autonomo', sub: 'Non solo chatbot — agisce in autonomia', us: true, ts: false, zuc: false, fisco: 'partial', fic: false },
  { feature: 'Simulatore fiscale interattivo', sub: 'Forfettario vs Ordinario real-time', us: true, ts: false, zuc: false, fisco: 'partial', fic: false },
  { feature: 'DVR D.Lgs. 81/2008', sub: 'Redazione guidata + firma datore', us: true, ts: 'partial', zuc: 'partial', fisco: false, fic: false },
  { feature: 'Gestione colf e badanti', sub: 'CCNL Domestico, buste paga, INPS', us: true, ts: 'partial', zuc: 'partial', fisco: false, fic: false },
  { feature: 'Gestione accertamenti tributari', sub: 'Difesa, termini, upload atti', us: true, ts: 'partial', zuc: 'partial', fisco: false, fic: false },
  { feature: 'Chat + ticket studio-cliente', sub: 'Comunicazione in-app integrata', us: true, ts: false, zuc: false, fisco: false, fic: false },
  { feature: 'Firma digitale P7M (eIDAS)', sub: 'Valida legalmente per ogni documento', us: true, ts: true, zuc: true, fisco: false, fic: false },
  { feature: 'Fatturazione elettronica SDI', sub: 'XML FatturaPA, ciclo attivo + passivo', us: true, ts: true, zuc: true, fisco: false, fic: true },
  { feature: 'Dark mode & UX moderna', sub: 'Design system 2026, mobile-first', us: true, ts: false, zuc: false, fisco: true, fic: true },
  { feature: 'Zero installazione (web)', sub: 'Browser, nessun client desktop', us: true, ts: false, zuc: false, fisco: true, fic: true },
  { feature: 'Prova gratuita senza carta', sub: 'Demo immediata, nessuna registrazione', us: true, ts: false, zuc: false, fisco: true, fic: 'partial' },
  { feature: 'Prezzi trasparenti', sub: 'Nessun costo nascosto', us: true, ts: false, zuc: false, fisco: true, fic: true },
];

const roadmap = [
  {
    quarter: 'Q1 2026', title: 'Foundation AI', status: 'done',
    items: ['AI Copilot con alert autonomi', 'Simulatore fiscale real-time', 'Firma digitale P7M remota', 'Dashboard studio multi-cliente', 'Gestione DVR D.Lgs. 81/08', 'Dark mode & design system v2'],
  },
  {
    quarter: 'Q2 2026', title: 'Connected Intelligence', status: 'in_progress',
    items: ['OCR + AI Document Scanner', 'F24 Autopilot generation', 'WhatsApp / Telegram Bot', 'Video consultation booking', 'SDI real-time status tracker', 'Cassetto Fiscale Sync (SPID)'],
  },
  {
    quarter: 'Q3 2026', title: 'Predictive Engine', status: 'planned',
    items: ['Blockchain document timestamp', 'Predictive cash flow AI', 'Client risk score dashboard', 'AI contract generator', 'Regulatory AI feed (G.U.)', 'Multi-firm client sharing'],
  },
  {
    quarter: 'Q4 2026', title: 'Platform & Scale', status: 'planned',
    items: ['API Gateway + Webhook SDK', 'White label per studi', 'Mobile PWA offline-first', 'Banking integrations', 'ISO 27001 certification', 'EU AI Act compliance'],
  },
];

const features = [
  {
    icon: FileText, bg: 'bg-blue-50', iconColor: 'text-blue-600',
    title: 'Fatturazione Elettronica',
    desc: 'Emissione fatture XML in formato FatturaPA, invio SDI, gestione ciclo attivo e passivo, download PDF e riconciliazione automatica.',
    tags: ['XML FatturaPA', 'SDI', 'IVA'],
  },
  {
    icon: Calculator, bg: 'bg-indigo-50', iconColor: 'text-indigo-600',
    title: 'Simulatore Fiscale',
    desc: 'Confronto in tempo reale tra regime forfettario e ordinario. Calcolo IRPEF, INPS, imposta sostitutiva e netto disponibile con slider interattivo.',
    tags: ['Forfettario', 'Ordinario', 'ATECO'],
  },
  {
    icon: FolderOpen, bg: 'bg-violet-50', iconColor: 'text-violet-600',
    title: 'Gestione Documenti',
    desc: 'Archivio digitale di tutti i documenti fiscali e lavoristici. Firma digitale remota P7M (eIDAS), upload drag-and-drop, ricerca avanzata.',
    tags: ['Firma P7M', 'eIDAS', 'Archivio'],
  },
  {
    icon: Scale, bg: 'bg-slate-100', iconColor: 'text-slate-700',
    title: 'Accertamenti Tributari',
    desc: 'Gestione completa degli atti. Calcolo automatico dei termini di impugnazione (30/60gg), strategie difensive e modalità success fee.',
    tags: ['Contenzioso', 'CTP', 'Scadenze'],
  },
  {
    icon: Calendar, bg: 'bg-amber-50', iconColor: 'text-amber-600',
    title: 'Scadenze Fiscali',
    desc: 'Calendario completo di tutti gli adempimenti: IVA, INPS, IRPEF, Unico, 730. Alert automatici con priorità di urgenza configurabili.',
    tags: ['IVA', 'INPS', 'Unico'],
  },
  {
    icon: MessageSquare, bg: 'bg-teal-50', iconColor: 'text-teal-600',
    title: 'Chat & Ticket',
    desc: 'Comunicazione diretta con il consulente tramite chat in tempo reale e sistema di ticket con priorità. Notifiche push incluse.',
    tags: ['Chat', 'Ticket', 'Notifiche'],
  },
  {
    icon: Users, bg: 'bg-emerald-50', iconColor: 'text-emerald-600',
    title: 'Gestione Colf & Badanti',
    desc: 'Amministrazione rapporti di lavoro domestico. Buste paga, contributi INPS, TFR, CU annuali e comunicazioni obbligatorie.',
    tags: ['CCNL', 'INPS', 'Buste Paga'],
  },
  {
    icon: ShieldCheck, bg: 'bg-orange-50', iconColor: 'text-orange-600',
    title: 'DVR Sicurezza (D.Lgs. 81/08)',
    desc: 'Redazione guidata del Documento di Valutazione dei Rischi. Monitoraggio scadenze di revisione e firma digitale del datore di lavoro.',
    tags: ['D.Lgs. 81/08', 'RSPP', 'Firma'],
  },
  {
    icon: TrendingUp, bg: 'bg-rose-50', iconColor: 'text-rose-600',
    title: 'Dashboard Analitica',
    desc: 'KPI in tempo reale su fatturato, tasse stimate, scadenze urgenti e ticket aperti. Grafici interattivi con confronto anno precedente.',
    tags: ['KPI', 'Grafici', 'Report'],
  },
  {
    icon: Bell, bg: 'bg-pink-50', iconColor: 'text-pink-600',
    title: 'Notifiche Intelligenti',
    desc: 'Sistema di notifiche multicanale con priorità. Alert su scadenze imminenti, documenti richiesti, messaggi non letti e aggiornamenti normativi.',
    tags: ['Alert', 'Push', 'Email'],
  },
  {
    icon: BarChart3, bg: 'bg-cyan-50', iconColor: 'text-cyan-600',
    title: 'Gestione Clienti Studio',
    desc: 'Portafoglio clienti completo con schede anagrafiche, dati fiscali, storico pratiche, to-do operativo e distribuzione per regime.',
    tags: ['CRM', 'Portafoglio', 'Anagrafica'],
  },
  {
    icon: CreditCard, bg: 'bg-lime-50', iconColor: 'text-lime-700',
    title: 'Impostazioni & Integrazioni',
    desc: 'Configurazione profilo studio, notifiche personalizzate, autenticazione 2FA, SPID, integrazioni con software terzi e gestione abbonamento.',
    tags: ['SPID', '2FA', 'API'],
  },
];

const aiMessages = [
  { from: 'user', text: 'Quante tasse devo pagare quest\'anno?' },
  { from: 'ai', text: 'Basandomi sul tuo fatturato YTD di €48.600 in regime forfettario, la tua imposta sostitutiva sarà circa €5.688 (15%) più INPS €9.864. Totale stimato: €15.552.' },
  { from: 'user', text: 'C\'è qualche scadenza urgente questa settimana?' },
  { from: 'ai', text: '⚠️ Il versamento F24 INPS del 16/04 è tra 3 giorni. Ti consiglio di preparare il modello F24 entro domani. Vuoi che generi la bozza?' },
];

const steps = [
  {
    icon: UserCheck,
    title: 'Scegli il tuo accesso',
    desc: 'Entra come cliente per gestire la tua posizione fiscale, o come studio per gestire l\'intero portafoglio clienti.',
  },
  {
    icon: Bot,
    title: 'L\'AI analizza la tua situazione',
    desc: 'Il Copilot esamina automaticamente scadenze, documenti e posizione fiscale inviandoti alert personalizzati.',
  },
  {
    icon: CheckCircle,
    title: 'Gestisci tutto in un click',
    desc: 'Emetti fatture, firma documenti, rispondi ad accertamenti e comunica con il tuo consulente direttamente dalla piattaforma.',
  },
];

const clientFeatures = [
  'Dashboard con KPI fiscali in tempo reale',
  'Emissione e gestione fatture elettroniche',
  'Simulatore forfettario vs ordinario',
  'Archivio documenti con firma digitale',
  'Calendario scadenze con alert automatici',
  'Chat diretta con il consulente',
  'Gestione accertamenti tributari',
  'AI Copilot dedicato 24/7',
];

const studioFeatures = [
  'Gestione portafoglio clienti completo',
  'Dashboard operativa con to-do e ticket',
  'Redazione DVR (D.Lgs. 81/08)',
  'Amministrazione colf e badanti',
  'Reportistica e grafici avanzati',
  'Sistema notifiche multicanale',
  'Integrazioni software terzi',
  'AI Alert Studio per opportunità clienti',
];

const norme = [
  { emoji: '📊', title: 'Legge 190/2014', desc: 'Regime forfettario aggiornato' },
  { emoji: '🧾', title: 'D.Lgs. 127/2015', desc: 'Fatturazione elettronica' },
  { emoji: '⚖️', title: 'D.Lgs. 81/2008', desc: 'Sicurezza sul lavoro' },
  { emoji: '🏛️', title: 'D.Lgs. 218/1997', desc: 'Accertamento con adesione' },
  { emoji: '👨‍👩‍👧', title: 'CCNL Domestico', desc: 'Lavoro domestico' },
  { emoji: '🔐', title: 'GDPR 2016/679', desc: 'Protezione dei dati' },
  { emoji: '📋', title: 'DPR 917/1986', desc: 'TUIR aggiornato' },
  { emoji: '🏦', title: 'L. 160/2019', desc: 'Legge di bilancio 2020' },
];
