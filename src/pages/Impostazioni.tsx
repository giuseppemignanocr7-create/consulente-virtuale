import { useState } from 'react';
import { Bell, Shield, User, CreditCard, Link, ChevronRight, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Impostazioni() {
  const [tab, setTab] = useState<'profilo' | 'notifiche' | 'sicurezza' | 'integrazioni' | 'abbonamento'>('profilo');

  const tabs = [
    { key: 'profilo', label: 'Profilo', icon: <User size={18} /> },
    { key: 'notifiche', label: 'Notifiche', icon: <Bell size={18} /> },
    { key: 'sicurezza', label: 'Sicurezza', icon: <Shield size={18} /> },
    { key: 'integrazioni', label: 'Integrazioni', icon: <Link size={18} /> },
    { key: 'abbonamento', label: 'Abbonamento', icon: <CreditCard size={18} /> },
  ] as const;

  return (
    <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
      {/* Sidebar */}
      <div className="w-full md:w-64 flex-shrink-0">
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="font-bold text-slate-900 dark:text-white">Impostazioni</h2>
          </div>
          <div className="p-2">
            {tabs.map(t => (
              <button 
                key={t.key} 
                onClick={() => setTab(t.key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  tab === t.key 
                    ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 shadow-sm' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span className={tab === t.key ? 'text-indigo-600' : 'text-slate-400'}>{t.icon}</span>
                {t.label}
                {tab === t.key && <ChevronRight size={14} className="ml-auto text-indigo-400" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-6">
        {tab === 'profilo' && <ProfiloSection />}
        {tab === 'notifiche' && <NotificheSection />}
        {tab === 'sicurezza' && <SicurezzaSection />}
        {tab === 'integrazioni' && <IntegrazioniSection />}
        {tab === 'abbonamento' && <AbbonamentoSection />}
      </div>
    </div>
  );
}

function ProfiloSection() {
  return (
    <div className="card p-8 animate-enter">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h3 className="font-bold text-xl text-slate-900 dark:text-white">Profilo Personale</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Gestisci le tue informazioni personali e aziendali</p>
        </div>
      </div>

      <div className="flex items-center gap-6 mb-8 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-3xl shadow-lg shadow-indigo-200">
          M
        </div>
        <div>
          <h4 className="font-bold text-lg text-slate-900 dark:text-white">Marco Rossi</h4>
          <p className="text-sm text-slate-500 font-medium">Partita IVA: 12345678901</p>
          <div className="flex gap-3 mt-3">
            <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-white px-3 py-1.5 rounded-lg border border-slate-200 hover:border-indigo-200 transition-colors shadow-sm">
              Cambia Foto
            </button>
            <button className="text-xs font-semibold text-rose-600 hover:text-rose-700 bg-white px-3 py-1.5 rounded-lg border border-slate-200 hover:border-rose-200 transition-colors shadow-sm">
              Rimuovi
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <FormField label="Nome" defaultValue="Marco" />
        <FormField label="Cognome" defaultValue="Rossi" />
        <FormField label="Email" defaultValue="marco@rossi.it" type="email" />
        <FormField label="Telefono" defaultValue="+39 333 1234567" />
        <FormField label="Codice Fiscale" defaultValue="RSSMRC85M01H501Z" />
        <FormField label="Partita IVA" defaultValue="12345678901" />
      </div>
      
      <div className="mb-8">
        <FormField label="Indirizzo Sede Legale" defaultValue="Via Roma 1, 20100 Milano" />
      </div>

      <div className="flex justify-end pt-6 border-t border-slate-100 dark:border-slate-800">
        <button onClick={() => toast.success('Profilo aggiornato con successo!')} className="btn btn-primary px-6">Salva Modifiche</button>
      </div>
    </div>
  );
}

function NotificheSection() {
  const [settings, setSettings] = useState({
    scadenzeMail: true, scadenzeApp: true, scadenze30: true, scadenze15: true, scadenze7: true, scadenze1: true,
    fattureSDI: true, nuoveDocumenti: true, ticketRisposta: true, aiAlert: true, aiLeggi: true, aiBandi: true,
  });
  const toggle = (k: keyof typeof settings) => setSettings(p => ({ ...p, [k]: !p[k] }));

  return (
    <div className="card p-8 animate-enter">
      <div className="mb-8">
        <h3 className="font-bold text-xl text-slate-900 dark:text-white">Preferenze Notifiche</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Decidi come e quando vuoi essere contattato</p>
      </div>

      <div className="space-y-8">
        <NotifGroup title="Scadenze & Adempimenti" desc="Avvisi relativi a scadenze fiscali e previdenziali">
          <Toggle label="Notifiche Email" desc="Ricevi un riepilogo via email" value={settings.scadenzeMail} onChange={() => toggle('scadenzeMail')} />
          <Toggle label="Notifiche In-App" desc="Badge e avvisi nella dashboard" value={settings.scadenzeApp} onChange={() => toggle('scadenzeApp')} />
          
          <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Anticipo Notifiche</p>
            <div className="flex flex-wrap gap-2">
              {(['scadenze30', 'scadenze15', 'scadenze7', 'scadenze1'] as const).map((k, i) => (
                <label key={k} className={`flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-lg cursor-pointer transition-all border ${settings[k] ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                  <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${settings[k] ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300'}`}>
                    {settings[k] && <Check size={10} className="text-white" />}
                  </div>
                  <input type="checkbox" className="hidden" checked={settings[k]} onChange={() => toggle(k)} />
                  {[30, 15, 7, 1][i]} giorni prima
                </label>
              ))}
            </div>
          </div>
        </NotifGroup>

        <div className="h-px bg-slate-100"></div>

        <NotifGroup title="Attività & Documenti" desc="Aggiornamenti su fatture e pratiche">
          <Toggle label="Stato Fatture SDI" desc="Notifica quando una fattura cambia stato (es. Consegnata)" value={settings.fattureSDI} onChange={() => toggle('fattureSDI')} />
          <Toggle label="Nuovi Documenti" desc="Quando lo studio carica un nuovo documento" value={settings.nuoveDocumenti} onChange={() => toggle('nuoveDocumenti')} />
          <Toggle label="Aggiornamento Ticket" desc="Risposte ai tuoi ticket di assistenza" value={settings.ticketRisposta} onChange={() => toggle('ticketRisposta')} />
        </NotifGroup>

        <div className="h-px bg-slate-100"></div>

        <NotifGroup title="AI Copilot" desc="Suggerimenti intelligenti e novità normative">
          <Toggle label="Alert AI Proattivi" desc="Suggerimenti su bandi e scadenze" value={settings.aiAlert} onChange={() => toggle('aiAlert')} />
          <Toggle label="Nuove Normative" desc="Leggi e circolari rilevanti per il tuo ATECO" value={settings.aiLeggi} onChange={() => toggle('aiLeggi')} />
        </NotifGroup>
      </div>

      <div className="flex justify-end pt-8 mt-8 border-t border-slate-100 dark:border-slate-800">
        <button onClick={() => toast.success('Preferenze notifiche salvate!')} className="btn btn-primary px-6">Salva Preferenze</button>
      </div>
    </div>
  );
}

function SicurezzaSection() {
  return (
    <div className="space-y-6 animate-enter">
      <div className="card p-8">
        <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-1">Sicurezza Account</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Gestisci la sicurezza del tuo account e i metodi di accesso</p>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-5 bg-emerald-50/50 border border-emerald-100 rounded-2xl">
            <div className="flex gap-4">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl h-fit">
                <Shield size={20} />
              </div>
              <div>
                <p className="font-bold text-emerald-900">Autenticazione a due fattori (2FA)</p>
                <p className="text-sm text-emerald-700 mt-0.5">Attiva tramite SMS al +39 333 ••••••7</p>
              </div>
            </div>
            <button onClick={() => toast.success('Gestione 2FA aperta')} className="btn bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50 text-xs font-semibold">Gestisci</button>
          </div>

          <div className="flex items-center justify-between p-5 bg-blue-50/50 border border-blue-100 rounded-2xl">
            <div className="flex gap-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl h-fit">
                <User size={20} />
              </div>
              <div>
                <p className="font-bold text-blue-900">Identità Digitale (SPID/CIE)</p>
                <p className="text-sm text-blue-700 mt-0.5">Collegato con Namirial ID</p>
              </div>
            </div>
            <button onClick={() => toast.success('Configurazione SPID/CIE avviata')} className="btn bg-white border border-blue-200 text-blue-700 hover:bg-blue-50 text-xs font-semibold">Configura</button>
          </div>
        </div>
      </div>

      <div className="card p-8">
        <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-6">Cambia Password</h4>
        <div className="space-y-4 max-w-md">
          <FormField label="Password Attuale" type="password" placeholder="••••••••" />
          <FormField label="Nuova Password" type="password" placeholder="••••••••" />
          <FormField label="Conferma Password" type="password" placeholder="••••••••" />
          <button onClick={() => toast.success('Password aggiornata con successo!')} className="btn btn-primary w-full">Aggiorna Password</button>
        </div>
      </div>
    </div>
  );
}

function IntegrazioniSection() {
  const integrations = [
    { name: 'Sistema di Interscambio (SDI)', desc: 'Invio e ricezione fatture elettroniche', status: 'connesso', logo: '🏛️', color: 'bg-blue-50 text-blue-700' },
    { name: 'Agenzia delle Entrate', desc: 'Cassetto fiscale, dichiarazioni, F24', status: 'connesso', logo: '🏦', color: 'bg-emerald-50 text-emerald-700' },
    { name: 'INPS — Gestione Separata', desc: 'Contributi, estratto conto', status: 'connesso', logo: '🛡️', color: 'bg-indigo-50 text-indigo-700' },
    { name: 'INAIL', desc: 'Autoliquidazione premi', status: 'da_connettere', logo: '⚕️', color: 'bg-orange-50 text-orange-700' },
    { name: 'TeamSystem Giada', desc: 'Sincronizzazione contabilità', status: 'da_connettere', logo: '💻', color: 'bg-rose-50 text-rose-700' },
    { name: 'Namirial — Firma Remota', desc: 'Firma digitale P7M e CAdES', status: 'connesso', logo: '✍️', color: 'bg-violet-50 text-violet-700' },
  ];

  return (
    <div className="card p-8 animate-enter">
      <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-1">Integrazioni Esterne</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Collega i servizi esterni per automatizzare il flusso di lavoro</p>
      
      <div className="grid gap-4">
        {integrations.map((intg, i) => (
          <div key={i} className="flex items-center justify-between p-5 border border-slate-100 dark:border-slate-800 rounded-2xl hover:border-indigo-100 dark:hover:border-indigo-900 hover:shadow-md transition-all group bg-white dark:bg-slate-900">
            <div className="flex items-center gap-5">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${intg.color}`}>
                {intg.logo}
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">{intg.name}</p>
                <p className="text-sm text-slate-500">{intg.desc}</p>
              </div>
            </div>
            {intg.status === 'connesso' ? (
              <span className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                Connesso
              </span>
            ) : (
              <button onClick={() => toast.success(`Connessione a ${intg.name} avviata`)} className="btn btn-secondary text-xs px-4">Connetti</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function AbbonamentoSection() {
  const plans = [
    { name: 'Forfettario', price: 29, features: ['Fatturazione elettronica SDI', 'Simulatore fiscale', 'Dichiarazione redditi', 'Scadenze INPS/INAIL', 'Supporto ticket'], current: true, color: 'blue', gradient: 'from-blue-500 to-cyan-500' },
    { name: 'Ditta Individuale', price: 49, features: ['Tutto Forfettario +', 'Contabilità semplificata', 'IVA trimestrale/mensile', 'Gestione colf', 'DVR 81/08'], current: false, color: 'indigo', gradient: 'from-indigo-500 to-violet-500' },
    { name: 'Società', price: 89, features: ['Tutto Ditta Ind. +', 'Contabilità ordinaria', 'Bilancio CEE', 'Gestione soci', 'Accertamenti tributari'], current: false, color: 'violet', gradient: 'from-violet-500 to-fuchsia-500' },
  ];

  return (
    <div className="space-y-8 animate-enter">
      <div className="card p-8 bg-slate-900 text-white border-none relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-lg uppercase tracking-wide">Piano Attivo</span>
              <span className="text-slate-400 text-sm">Rinnovo: 15/04/2026</span>
            </div>
            <h3 className="text-3xl font-bold">Regime Forfettario</h3>
            <p className="text-slate-400 mt-1">Accesso completo a tutti gli strumenti per il regime forfettario</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold">€29<span className="text-lg font-medium text-slate-400">/mese</span></p>
            <button className="mt-3 text-sm text-indigo-300 hover:text-white font-medium">Gestisci metodo di pagamento →</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map(p => (
          <div key={p.name} className={`card p-6 border-2 transition-all ${p.current ? 'border-indigo-500 shadow-lg shadow-indigo-100 ring-4 ring-indigo-50' : 'border-transparent hover:border-slate-200'}`}>
            <div className={`h-2 w-12 rounded-full bg-gradient-to-r ${p.gradient} mb-4`}></div>
            <h4 className="font-bold text-lg text-slate-900 dark:text-white">{p.name}</h4>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2 mb-6">€{p.price}<span className="text-sm font-normal text-slate-500">/mese</span></p>
            
            <div className="space-y-3 mb-8">
              {p.features.map(f => (
                <div key={f} className="flex items-start gap-3 text-sm text-slate-600">
                  <div className={`mt-0.5 min-w-[16px] h-4 rounded-full flex items-center justify-center ${p.current ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                    <Check size={10} strokeWidth={3} />
                  </div>
                  <span className="leading-tight">{f}</span>
                </div>
              ))}
            </div>
            
            <button onClick={() => !p.current && toast.success(`Richiesta upgrade a piano ${p.name} inviata!`)} className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all ${p.current ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-default' : 'bg-slate-900 text-white hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-200 dark:hover:shadow-indigo-900/30'}`}>
              {p.current ? 'Piano Attuale' : 'Passa a questo piano'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotifGroup({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-4">
        <h4 className="font-bold text-slate-900 dark:text-white">{title}</h4>
        <p className="text-sm text-slate-500 dark:text-slate-400">{desc}</p>
      </div>
      <div className="space-y-3 pl-4 border-l-2 border-slate-100">
        {children}
      </div>
    </div>
  );
}

function Toggle({ label, desc, value, onChange }: { label: string; desc: string; value: boolean; onChange: () => void }) {
  return (
    <div className="flex items-center justify-between group cursor-pointer" onClick={onChange}>
      <div>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-indigo-700 transition-colors">{label}</p>
        <p className="text-xs text-slate-500">{desc}</p>
      </div>
      <button className={`relative w-12 h-7 rounded-full transition-all duration-300 ease-in-out ${value ? 'bg-indigo-600' : 'bg-slate-200'}`}>
        <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform duration-300 ease-in-out ${value ? 'translate-x-5' : 'translate-x-0'}`}></div>
      </button>
    </div>
  );
}

function FormField({ label, defaultValue, type = 'text', placeholder }: { label: string; defaultValue?: string; type?: string; placeholder?: string }) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">{label}</label>
      <input 
        type={type} 
        defaultValue={defaultValue} 
        placeholder={placeholder}
        className="input w-full"
      />
    </div>
  );
}
