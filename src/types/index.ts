export type UserRole = 'client' | 'studio' | 'admin';
export type Regime = 'forfettario' | 'ordinario' | 'semplificato';
export type PackageType = 'forfettario' | 'ditta_individuale' | 'societa_persone' | 'societa_capitali' | 'enti_non_commerciali';
export type InvoiceStatus = 'bozza' | 'inviata' | 'consegnata' | 'accettata' | 'rifiutata' | 'scartata';
export type TicketStatus = 'aperto' | 'in_lavorazione' | 'chiuso';
export type TicketCategory = 'fiscale' | 'contributivo' | 'lavoro' | 'societario' | 'altro';
export type DeadlineUrgency = 'normale' | 'imminente' | 'scaduta';
export type DocumentType = 'fattura' | 'delega' | 'contratto' | 'cu' | 'busta_paga' | 'accertamento' | 'dvr' | 'altro';
export type AssessmentCategory = 'imposte_dirette' | 'iva' | 'registro' | 'locale' | 'contributivo';
export type AssessmentStatus = 'caricato' | 'in_valutazione' | 'documenti_richiesti' | 'in_lavorazione' | 'concluso';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Client {
  id: string;
  name: string;
  fiscalCode: string;
  vatNumber: string;
  ateco: string;
  atecoDescription: string;
  regime: Regime;
  packageType: PackageType;
  email: string;
  phone: string;
  address: string;
  startDate: string;
  status: 'attivo' | 'sospeso' | 'cessato';
}

export interface Invoice {
  id: string;
  number: string;
  date: string;
  clientName: string;
  recipientName: string;
  recipientVat: string;
  amount: number;
  vat: number;
  total: number;
  status: InvoiceStatus;
  type: 'emessa' | 'ricevuta';
}

export interface Deadline {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'inps' | 'inail' | 'ade' | 'altro';
  urgency: DeadlineUrgency;
  completed: boolean;
  clientId?: string;
  clientName?: string;
}

export interface Ticket {
  id: string;
  subject: string;
  category: TicketCategory;
  status: TicketStatus;
  priority: 'bassa' | 'media' | 'alta' | 'urgente';
  clientId: string;
  clientName: string;
  createdAt: string;
  lastMessage: string;
}

export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  size: string;
  uploadedAt: string;
  signed: boolean;
  signedAt?: string;
  clientId?: string;
}

export interface TodoItem {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
  clientId?: string;
  clientName?: string;
  priority: 'bassa' | 'media' | 'alta';
}

export interface TaxAssessment {
  id: string;
  category: AssessmentCategory;
  status: AssessmentStatus;
  notificationDate: string;
  uploadDate: string;
  amount: number;
  description: string;
  clientName?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'studio' | 'client';
  text: string;
  timestamp: string;
  isAI?: boolean;
}

export interface AtecoCode {
  code: string;
  description: string;
  coefficient: number;
}

export interface MonthlyRevenue {
  month: string;
  fatturato: number;
  incassato: number;
}

export interface AINotification {
  id: string;
  type: 'bando' | 'legge' | 'rottamazione' | 'scadenza' | 'anomalia';
  title: string;
  summary: string;
  date: string;
  read: boolean;
  actionLabel?: string;
}
