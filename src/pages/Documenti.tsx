import { useState } from 'react';
import { Upload, Shield, Eye, Download, CheckCircle, Clock, FolderOpen, PenTool, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDocuments } from '../hooks/useDocuments';
import type { DocumentType } from '../types';

const typeLabel: Record<DocumentType, string> = { fattura: 'Fattura', delega: 'Delega', contratto: 'Contratto', cu: 'Cert. Unica', busta_paga: 'Busta Paga', accertamento: 'Accertamento', dvr: 'DVR', altro: 'Altro' };
const typeColor: Record<DocumentType, string> = { fattura: 'bg-blue-50 text-blue-700 border-blue-100', delega: 'bg-violet-50 text-violet-700 border-violet-100', contratto: 'bg-emerald-50 text-emerald-700 border-emerald-100', cu: 'bg-orange-50 text-orange-700 border-orange-100', busta_paga: 'bg-teal-50 text-teal-700 border-teal-100', accertamento: 'bg-rose-50 text-rose-700 border-rose-100', dvr: 'bg-amber-50 text-amber-700 border-amber-100', altro: 'bg-slate-50 text-slate-600 border-slate-200' };
const typeIcon: Record<DocumentType, React.ReactNode> = { fattura: <FileText size={16}/>, delega: <FileText size={16}/>, contratto: <FileText size={16}/>, cu: <FileText size={16}/>, busta_paga: <FileText size={16}/>, accertamento: <FileText size={16}/>, dvr: <Shield size={16}/>, altro: <FolderOpen size={16}/> };

export default function Documenti() {
  const [filter, setFilter] = useState<DocumentType | 'tutti'>('tutti');
  const [showSignWizard, setShowSignWizard] = useState(false);
  const { documents } = useDocuments();
  const [showUpload, setShowUpload] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const filtered = documents.filter(d => filter === 'tutti' || d.type === filter);

  return (
    <div className="space-y-8">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Documenti</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Gestisci, firma e archivia i tuoi documenti</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => toast('Galleria template disponibile prossimamente', { icon: '📁' })} className="btn btn-secondary gap-2 px-4 rounded-xl">
            <FolderOpen size={18} /> Template
          </button>
          <button onClick={() => setShowSignWizard(true)} className="btn btn-secondary gap-2 px-4 rounded-xl text-violet-700 hover:bg-violet-50 hover:border-violet-200 border-violet-100">
            <PenTool size={18} /> Firma P7M
          </button>
          <button onClick={() => setShowUpload(true)} className="btn btn-primary gap-2 px-5 rounded-xl">
            <Upload size={18} /> Carica
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 pb-2">
        {(['tutti', 'delega', 'contratto', 'cu', 'busta_paga', 'accertamento', 'dvr'] as const).map(f => (
          <button 
            key={f} 
            onClick={() => setFilter(f)} 
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f ? 'bg-slate-900 dark:bg-indigo-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-slate-300 hover:text-slate-700 dark:hover:text-white'}`}
          >
            {f === 'tutti' ? 'Tutti i documenti' : typeLabel[f]}
          </button>
        ))}
      </div>

      {/* Documents grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map(doc => (
          <div key={doc.id} className="card p-5 hover:border-indigo-200 transition-all hover:shadow-md flex flex-col h-full group">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${typeColor[doc.type].split(' ')[0]} ${typeColor[doc.type].split(' ')[1]}`}>
                {typeIcon[doc.type]}
              </div>
              <span className={`text-[10px] px-2.5 py-1 rounded-lg font-bold uppercase tracking-wide border ${typeColor[doc.type]}`}>
                {typeLabel[doc.type]}
              </span>
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 dark:text-white leading-tight mb-2 line-clamp-2 group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">{doc.name}</h3>
              <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                <span>{doc.size}</span>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <span>{doc.uploadedAt}</span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-50 flex items-center justify-between">
              {doc.signed ? (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                  <CheckCircle size={14} /> Firmato {doc.signedAt}
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100">
                  <Clock size={14} /> Da firmare
                </div>
              )}
              
              <div className="flex gap-1">
                <button onClick={() => toast('Anteprima documento aperta', { icon: '👁️' })} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Visualizza">
                  <Eye size={18} />
                </button>
                <button onClick={() => toast.success('Download avviato')} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Scarica">
                  <Download size={18} />
                </button>
                {!doc.signed && (
                  <button onClick={() => setShowSignWizard(true)} className="p-2 text-violet-600 hover:bg-violet-50 rounded-lg transition-colors" title="Firma ora">
                    <PenTool size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-enter" onClick={() => setShowUpload(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl p-6 overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">Carica Documento</h3>
              <button onClick={() => setShowUpload(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors">×</button>
            </div>
            
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); }}
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${dragOver ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-indigo-400 hover:bg-slate-50'}`}
            >
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Upload size={20} />
              </div>
              <p className="text-sm font-semibold text-slate-900">Trascina qui il file</p>
              <p className="text-xs text-slate-500 mt-1 mb-4">oppure selezionalo dal computer</p>
              <button onClick={() => toast('Seleziona un file dal computer', { icon: '📂' })} className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm">
                Sfoglia file
              </button>
              <p className="text-[10px] text-slate-400 mt-4 font-medium uppercase tracking-wide">PDF, XML, P7M · Max 20 MB</p>
            </div>

            <div className="mt-6">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Categoria Documento</label>
              <div className="relative">
                <select className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 font-medium">
                  {Object.entries(typeLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>
            </div>

            <button onClick={() => { toast.success('Documento caricato con successo!'); setShowUpload(false); }} className="w-full mt-6 btn btn-primary py-3 rounded-xl">
              Carica Documento
            </button>
          </div>
        </div>
      )}

      {/* Firma Wizard */}
      {showSignWizard && <FirmaWizard documents={documents} onClose={() => setShowSignWizard(false)} />}
    </div>
  );
}

function FirmaWizard({ onClose, documents }: { onClose: () => void; documents: { id: string; name: string; signed: boolean; uploadedAt: string; size: string }[] }) {
  const [step, setStep] = useState(1);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-enter" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="bg-slate-900 p-6 text-white relative">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Shield size={20} className="text-violet-400" />
              <h3 className="font-bold text-lg">Firma Digitale Remota</h3>
            </div>
            <button onClick={onClose} className="text-white/50 hover:text-white text-2xl leading-none">×</button>
          </div>
          <p className="text-slate-400 text-sm">Validità legale eIDAS (CAdES .p7m)</p>
          
          <div className="flex gap-2 mt-6">
            {[1, 2, 3].map(s => (
              <div key={s} className={`flex-1 h-1 rounded-full transition-all duration-500 ${s <= step ? 'bg-violet-500' : 'bg-slate-700'}`}></div>
            ))}
          </div>
        </div>

        <div className="p-8">
          {step === 1 && (
            <div className="space-y-4 animate-enter">
              <p className="text-sm font-semibold text-slate-900 mb-2">Seleziona documento da firmare</p>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2 scrollbar-thin">
                {documents.filter(d => !d.signed).map(doc => (
                  <label key={doc.id} className="flex items-center gap-4 p-3 border border-slate-200 rounded-xl hover:border-violet-400 hover:bg-violet-50/30 cursor-pointer transition-all group">
                    <input type="radio" name="doc" className="w-4 h-4 text-violet-600 border-slate-300 focus:ring-violet-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900 group-hover:text-violet-900">{doc.name}</p>
                      <p className="text-xs text-slate-500">{doc.uploadedAt} · {doc.size}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-5 animate-enter">
              <div className="p-4 bg-violet-50 rounded-xl border border-violet-100 flex gap-3">
                <Shield size={20} className="text-violet-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-violet-900">Autenticazione Forte Richiesta</p>
                  <p className="text-xs text-violet-700 mt-1 leading-relaxed">
                    Per apporre la firma digitale qualificata è necessario verificare la tua identità tramite OTP inviato al tuo numero certificato.
                  </p>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Numero Cellulare</label>
                <input type="text" defaultValue="+39 333 ••••••7" disabled className="input bg-slate-50 text-slate-500 border-slate-200" />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Provider Firma</label>
                <div className="relative">
                  <select className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-violet-500 text-slate-700 font-medium">
                    <option>Namirial — Firma Remota</option>
                    <option>Aruba PEC — Firma Digitale</option>
                    <option>InfoCert — GoSign</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                </div>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-6 animate-enter">
              {!otpSent ? (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-violet-50 rounded-full flex items-center justify-center mx-auto mb-4 text-violet-600">
                    <PenTool size={28} />
                  </div>
                  <p className="text-slate-600 mb-6">Clicca per ricevere il codice OTP via SMS e completare la firma.</p>
                  <button onClick={() => setOtpSent(true)} className="w-full btn btn-primary bg-violet-600 hover:bg-violet-700 py-3 rounded-xl shadow-lg shadow-violet-200">
                    Invia OTP via SMS
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex flex-col items-center mb-6">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-3">
                      <CheckCircle size={24} />
                    </div>
                    <p className="text-sm font-medium text-emerald-700">OTP Inviato con successo</p>
                    <p className="text-xs text-slate-400 mt-1">Controlla il numero +39 333 ••••••7</p>
                  </div>
                  
                  <div>
                    <label className="block text-center text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Inserisci Codice OTP</label>
                    <input 
                      value={otp} 
                      onChange={e => setOtp(e.target.value)} 
                      placeholder="0 0 0 0 0 0" 
                      maxLength={6} 
                      className="w-full text-center text-3xl font-mono tracking-[0.5em] py-3 border-b-2 border-slate-200 focus:border-violet-600 outline-none bg-transparent transition-colors placeholder:text-slate-200" 
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-100 flex justify-between bg-slate-50">
          {step > 1 ? (
            <button onClick={() => setStep(step - 1)} className="btn btn-ghost px-4">Indietro</button>
          ) : (
            <div></div>
          )}
          
          {step < 3 ? (
            <button onClick={() => setStep(step + 1)} className="btn btn-primary bg-violet-600 hover:bg-violet-700 px-6">Avanti</button>
          ) : (
            otp.length === 6 ? (
              <button onClick={() => { toast.success('Documento firmato digitalmente!'); onClose(); }} className="btn btn-primary bg-emerald-600 hover:bg-emerald-700 px-6 gap-2 shadow-lg shadow-emerald-200">
                <CheckCircle size={18} /> Conferma e Firma
              </button>
            ) : (
              <button disabled className="btn btn-secondary bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed px-6">Inserisci OTP</button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
