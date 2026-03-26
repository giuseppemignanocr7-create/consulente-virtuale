import type { Client, Invoice, Deadline, Ticket, Document, TodoItem, TaxAssessment, MonthlyRevenue, AINotification, AtecoCode } from '../types';

export const mockClients: Client[] = [
  { id: '1', name: 'Marco Rossi', fiscalCode: 'RSSMRC85M01H501Z', vatNumber: '12345678901', ateco: '62.01.00', atecoDescription: 'Produzione di software', regime: 'forfettario', packageType: 'forfettario', email: 'marco@rossi.it', phone: '+39 333 1234567', address: 'Via Roma 1, Milano', startDate: '2024-01-15', status: 'attivo' },
  { id: '2', name: 'Laura Bianchi', fiscalCode: 'BNCLRA90A41F205X', vatNumber: '98765432109', ateco: '69.20.00', atecoDescription: 'Contabilità e consulenza fiscale', regime: 'forfettario', packageType: 'forfettario', email: 'laura@bianchi.it', phone: '+39 340 9876543', address: 'Via Garibaldi 22, Roma', startDate: '2023-06-01', status: 'attivo' },
  { id: '3', name: 'Tech Solutions SRL', fiscalCode: '12345678901', vatNumber: '12345678901', ateco: '62.02.00', atecoDescription: 'Consulenza informatica', regime: 'ordinario', packageType: 'societa_capitali', email: 'info@techsolutions.it', phone: '+39 02 1234567', address: 'Corso Buenos Aires 15, Milano', startDate: '2022-03-10', status: 'attivo' },
  { id: '4', name: 'Giuseppe Verdi', fiscalCode: 'VRDGPP78H15L219K', vatNumber: '11223344556', ateco: '43.21.01', atecoDescription: 'Installazione impianti elettrici', regime: 'ordinario', packageType: 'ditta_individuale', email: 'giuseppe@verdi.it', phone: '+39 347 5551234', address: 'Via Dante 8, Napoli', startDate: '2023-09-20', status: 'attivo' },
  { id: '5', name: 'Rossi & Neri SNC', fiscalCode: '99887766554', vatNumber: '99887766554', ateco: '47.11.40', atecoDescription: 'Commercio al dettaglio', regime: 'semplificato', packageType: 'societa_persone', email: 'info@rossineri.it', phone: '+39 06 7654321', address: 'Piazza Venezia 3, Roma', startDate: '2024-02-01', status: 'attivo' },
  { id: '6', name: 'ASD Sportiva Romana', fiscalCode: '88776655443', vatNumber: '88776655443', ateco: '93.19.10', atecoDescription: 'Enti sportivi', regime: 'ordinario', packageType: 'enti_non_commerciali', email: 'info@asdsportiva.it', phone: '+39 06 1112233', address: 'Via dello Sport 5, Roma', startDate: '2024-05-01', status: 'attivo' },
  { id: '7', name: 'Anna Colombo', fiscalCode: 'CLMNNA92D55F205M', vatNumber: '55443322110', ateco: '74.10.21', atecoDescription: 'Attività di design grafico', regime: 'forfettario', packageType: 'forfettario', email: 'anna@colombo.it', phone: '+39 351 4443322', address: 'Via Torino 45, Torino', startDate: '2025-01-10', status: 'attivo' },
  { id: '8', name: 'Paolo Ferrari', fiscalCode: 'FRRPLA80B20H501Q', vatNumber: '66778899001', ateco: '71.12.10', atecoDescription: 'Attività degli studi di ingegneria', regime: 'forfettario', packageType: 'forfettario', email: 'paolo@ferrari.it', phone: '+39 329 8887766', address: 'Viale Europa 12, Bologna', startDate: '2024-11-01', status: 'sospeso' },
];

export const mockInvoices: Invoice[] = [
  { id: '1', number: 'FE-2026/001', date: '2026-03-15', clientName: 'Marco Rossi', recipientName: 'ABC SRL', recipientVat: '11111111111', amount: 3000, vat: 0, total: 3000, status: 'consegnata', type: 'emessa' },
  { id: '2', number: 'FE-2026/002', date: '2026-03-10', clientName: 'Marco Rossi', recipientName: 'XYZ SPA', recipientVat: '22222222222', amount: 5500, vat: 0, total: 5500, status: 'consegnata', type: 'emessa' },
  { id: '3', number: 'FE-2026/003', date: '2026-03-05', clientName: 'Marco Rossi', recipientName: 'DEF SRL', recipientVat: '33333333333', amount: 2200, vat: 0, total: 2200, status: 'accettata', type: 'emessa' },
  { id: '4', number: 'FR-2026/001', date: '2026-03-01', clientName: 'Marco Rossi', recipientName: 'Fornitore SRL', recipientVat: '44444444444', amount: 800, vat: 176, total: 976, status: 'consegnata', type: 'ricevuta' },
  { id: '5', number: 'FE-2026/004', date: '2026-02-28', clientName: 'Marco Rossi', recipientName: 'GHI SPA', recipientVat: '55555555555', amount: 4800, vat: 0, total: 4800, status: 'inviata', type: 'emessa' },
  { id: '6', number: 'FE-2026/005', date: '2026-02-20', clientName: 'Marco Rossi', recipientName: 'LMN SRL', recipientVat: '66666666666', amount: 1500, vat: 0, total: 1500, status: 'bozza', type: 'emessa' },
];

export const mockRevenue: MonthlyRevenue[] = [
  { month: 'Gen', fatturato: 8500, incassato: 7200 },
  { month: 'Feb', fatturato: 12700, incassato: 10500 },
  { month: 'Mar', fatturato: 10700, incassato: 8800 },
  { month: 'Apr', fatturato: 15200, incassato: 13100 },
  { month: 'Mag', fatturato: 9800, incassato: 9200 },
  { month: 'Giu', fatturato: 18500, incassato: 16300 },
  { month: 'Lug', fatturato: 14200, incassato: 12800 },
  { month: 'Ago', fatturato: 6500, incassato: 5900 },
  { month: 'Set', fatturato: 16800, incassato: 14500 },
  { month: 'Ott', fatturato: 19200, incassato: 17600 },
  { month: 'Nov', fatturato: 13400, incassato: 11800 },
  { month: 'Dic', fatturato: 21000, incassato: 19500 },
];

export const mockDeadlines: Deadline[] = [
  { id: '1', title: 'F24 - Versamento IVA mensile', description: 'Versamento IVA mese di febbraio', date: '2026-03-16', type: 'ade', urgency: 'imminente', completed: false },
  { id: '2', title: 'INPS - Contributi Gestione Separata', description: 'Versamento primo acconto contributi INPS', date: '2026-06-30', type: 'inps', urgency: 'normale', completed: false },
  { id: '3', title: 'INAIL - Autoliquidazione', description: 'Pagamento premio INAIL o prima rata', date: '2026-02-16', type: 'inail', urgency: 'scaduta', completed: false },
  { id: '4', title: 'Dichiarazione Redditi PF', description: 'Scadenza invio modello Redditi PF', date: '2026-11-30', type: 'ade', urgency: 'normale', completed: false },
  { id: '5', title: 'F24 - Saldo IRPEF + Primo Acconto', description: 'Versamento saldo e primo acconto IRPEF', date: '2026-06-30', type: 'ade', urgency: 'normale', completed: false },
  { id: '6', title: 'CU - Invio Certificazione Unica', description: 'Invio telematico CU ad AdE', date: '2026-03-17', type: 'ade', urgency: 'imminente', completed: true },
];

export const mockTickets: Ticket[] = [
  { id: '1', subject: 'Richiesta apertura P.IVA', category: 'fiscale', status: 'aperto', priority: 'alta', clientId: '7', clientName: 'Anna Colombo', createdAt: '2026-03-20', lastMessage: 'Vorrei aprire la P.IVA come designer freelance' },
  { id: '2', subject: 'Errore fattura elettronica SDI', category: 'fiscale', status: 'in_lavorazione', priority: 'urgente', clientId: '1', clientName: 'Marco Rossi', createdAt: '2026-03-18', lastMessage: 'La fattura FE-2026/004 risulta scartata, codice errore 00305' },
  { id: '3', subject: 'Consulenza passaggio regime', category: 'fiscale', status: 'aperto', priority: 'media', clientId: '2', clientName: 'Laura Bianchi', createdAt: '2026-03-15', lastMessage: 'Sto per superare gli €85.000, conviene passare all\'ordinario?' },
  { id: '4', subject: 'Assunzione collaboratore domestico', category: 'lavoro', status: 'in_lavorazione', priority: 'media', clientId: '3', clientName: 'Tech Solutions SRL', createdAt: '2026-03-12', lastMessage: 'Servono contratto colf e comunicazione INPS' },
  { id: '5', subject: 'Richiesta DVR aggiornato', category: 'altro', status: 'aperto', priority: 'bassa', clientId: '5', clientName: 'Rossi & Neri SNC', createdAt: '2026-03-10', lastMessage: 'Ci serve il DVR aggiornato per il punto vendita' },
];

export const mockDocuments: Document[] = [
  { id: '1', name: 'Delega INPS - Rossi Marco.p7m', type: 'delega', size: '245 KB', uploadedAt: '2026-03-15', signed: true, signedAt: '2026-03-15' },
  { id: '2', name: 'CU 2026 - Rossi Marco.pdf', type: 'cu', size: '180 KB', uploadedAt: '2026-03-10', signed: false },
  { id: '3', name: 'Contratto Assunzione Colf.pdf', type: 'contratto', size: '320 KB', uploadedAt: '2026-03-08', signed: false },
  { id: '4', name: 'Incarico Professionale - Bianchi.p7m', type: 'delega', size: '198 KB', uploadedAt: '2026-03-05', signed: true, signedAt: '2026-03-06' },
  { id: '5', name: 'DVR - Rossi Neri SNC.pdf', type: 'dvr', size: '1.2 MB', uploadedAt: '2026-02-28', signed: true, signedAt: '2026-03-01' },
  { id: '6', name: 'Busta Paga Febbraio - Colf.pdf', type: 'busta_paga', size: '95 KB', uploadedAt: '2026-03-01', signed: false },
  { id: '7', name: 'Accertamento AdE n.123456.pdf', type: 'accertamento', size: '2.1 MB', uploadedAt: '2026-02-20', signed: false },
];

export const mockTodos: TodoItem[] = [
  { id: '1', title: 'Inviare F24 IVA marzo', description: 'Preparare F24 per IVA mensile Tech Solutions', completed: false, dueDate: '2026-03-16', clientId: '3', clientName: 'Tech Solutions SRL', priority: 'alta' },
  { id: '2', title: 'Registrare fatture febbraio', description: 'Completare registrazione fatture mese precedente', completed: true, dueDate: '2026-03-10', clientId: '1', clientName: 'Marco Rossi', priority: 'media' },
  { id: '3', title: 'Preparare CU collaboratori', description: 'Certificazione Unica per collaboratori 2025', completed: false, dueDate: '2026-03-17', clientId: '5', clientName: 'Rossi & Neri SNC', priority: 'alta' },
  { id: '4', title: 'Consulenza passaggio regime', description: 'Analisi convenienza forfettario vs ordinario', completed: false, dueDate: '2026-03-25', clientId: '2', clientName: 'Laura Bianchi', priority: 'media' },
  { id: '5', title: 'Iscrizione INPS Gestione Separata', description: 'Completare iscrizione per nuova P.IVA', completed: false, dueDate: '2026-03-30', clientId: '7', clientName: 'Anna Colombo', priority: 'alta' },
  { id: '6', title: 'Redazione DVR', description: 'Completare documento valutazione rischi', completed: false, dueDate: '2026-04-15', clientId: '5', clientName: 'Rossi & Neri SNC', priority: 'bassa' },
];

export const mockAssessments: TaxAssessment[] = [
  { id: '1', category: 'imposte_dirette', status: 'in_lavorazione', notificationDate: '2026-02-10', uploadDate: '2026-02-20', amount: 18500, description: 'Avviso accertamento IRPEF anno 2023 - redditi non dichiarati', clientName: 'Marco Rossi' },
  { id: '2', category: 'iva', status: 'documenti_richiesti', notificationDate: '2026-01-15', uploadDate: '2026-01-22', amount: 4200, description: 'Avviso IVA 2022 - operazioni inesistenti contestate', clientName: 'Tech Solutions SRL' },
  { id: '3', category: 'contributivo', status: 'caricato', notificationDate: '2026-03-01', uploadDate: '2026-03-05', amount: 2800, description: 'Cartella INPS contributi non versati 2021-2022' },
  { id: '4', category: 'locale', status: 'concluso', notificationDate: '2025-11-01', uploadDate: '2025-11-10', amount: 950, description: 'Avviso IMU 2022 - ravvedimento operoso applicato', clientName: 'Giuseppe Verdi' },
];

export const mockAINotifications: AINotification[] = [
  { id: '1', type: 'rottamazione', title: 'Rottamazione-quinquies: nuova proroga', summary: 'L\'Agenzia della Riscossione ha prorogato i termini di adesione al 30 settembre 2026. 3 tuoi clienti hanno cartelle potenzialmente eleggibili per un totale di €24.300.', date: '2026-03-22', read: false, actionLabel: 'Analizza clienti' },
  { id: '2', type: 'bando', title: 'Nuovo bando MIMIT - Transizione 5.0', summary: 'Pubblicato bando per digitalizzazione PMI con contributi fino al 45%. Compatibile con 4 clienti per settore ATECO. Scadenza: 31/07/2026.', date: '2026-03-21', read: false, actionLabel: 'Vedi clienti idonei' },
  { id: '3', type: 'legge', title: 'Circolare AdE 8/E/2026', summary: 'Nuovi chiarimenti sul regime forfettario: chiarificata la modalità di calcolo del superamento soglia €85.000 in corso d\'anno. Impatta su 5 tuoi clienti vicini alla soglia.', date: '2026-03-20', read: false, actionLabel: 'Leggi circolare' },
  { id: '4', type: 'scadenza', title: 'Scadenza CU tra 2 giorni', summary: 'Il 17/03/2026 scade il termine per l\'invio telematico delle Certificazioni Uniche. Hai 3 clienti con CU ancora da trasmettere.', date: '2026-03-15', read: true, actionLabel: 'Gestisci CU' },
  { id: '5', type: 'bando', title: 'Bando Regione Lombardia - Lavoro 4.0', summary: 'Nuovi incentivi per assunzioni in ambito digitale. Fino a €8.000 per assunzione. Scadenza: 15/05/2026. Applicabile a 2 clienti lombardi.', date: '2026-03-19', read: true, actionLabel: 'Dettagli bando' },
  { id: '6', type: 'anomalia', title: 'Anomalia rilevata su fattura #5', summary: 'La fattura FE-2026/004 di Marco Rossi risulta in stato "inviata" da 23 giorni senza notifica SDI. Verifico lo stato sul portale.', date: '2026-03-18', read: false, actionLabel: 'Controlla fattura' },
];

export const mockAtecoList: AtecoCode[] = [
  { code: '01-03', description: 'Agricoltura, silvicoltura e pesca', coefficient: 0.40 },
  { code: '10-11', description: 'Industrie alimentari e delle bevande', coefficient: 0.40 },
  { code: '41-42-43', description: 'Costruzioni e attività immobiliari', coefficient: 0.86 },
  { code: '45-46-47', description: 'Commercio ingrosso e dettaglio', coefficient: 0.40 },
  { code: '55-56', description: 'Attività dei servizi di alloggio e ristorazione', coefficient: 0.40 },
  { code: '62.01', description: 'Produzione di software', coefficient: 0.78 },
  { code: '62.02', description: 'Consulenza nel settore informatico', coefficient: 0.78 },
  { code: '69.10', description: 'Attività degli studi legali', coefficient: 0.78 },
  { code: '69.20', description: 'Attività contabilità, consulenza fiscale', coefficient: 0.78 },
  { code: '70.22', description: 'Consulenza imprenditoriale e di management', coefficient: 0.78 },
  { code: '71.12', description: 'Attività degli studi di ingegneria', coefficient: 0.78 },
  { code: '73.11', description: 'Agenzie pubblicitarie', coefficient: 0.78 },
  { code: '74.10', description: 'Attività di design specializzato', coefficient: 0.78 },
  { code: '85', description: 'Istruzione', coefficient: 0.78 },
  { code: '86-87-88', description: 'Sanità e assistenza sociale', coefficient: 0.78 },
  { code: '90-91-92-93', description: 'Attività artistiche, sportive, intrattenimento', coefficient: 0.67 },
  { code: 'Altre', description: 'Altre attività economiche', coefficient: 0.67 },
];

export const mockChatHistory = [
  { id: '1', sender: 'user' as const, text: 'Come calcolo i contributi INPS per quest\'anno?', timestamp: '10:32' },
  { id: '2', sender: 'ai' as const, text: 'Sei iscritto alla **Gestione Separata INPS**. Per il 2026 l\'aliquota è **26,07%** sul reddito imponibile.\n\nIl tuo reddito stimato: €72.500 × 78% (coeff. ATECO 62.01) = **€56.550** imponibile\n\nContributi totali: €56.550 × 26,07% = **€14.742,19**\n\n📌 Scadenza acconto (40%): **30/06/2026** → €5.896,88\n📌 Scadenza saldo (60%): **30/11/2026** → €8.845,31\n\n*Rif. Art. 2, c. 26, L. 335/1995*', timestamp: '10:32' },
  { id: '3', sender: 'user' as const, text: 'Prepara il promemoria per queste scadenze', timestamp: '10:33' },
  { id: '4', sender: 'ai' as const, text: '✅ Ho creato 2 promemoria nelle scadenze:\n- **30/06/2026** – INPS acconto €5.896,88\n- **30/11/2026** – INPS saldo €8.845,31\n\nRiceverai notifiche a -30, -15, -7 e -1 giorni. Vuoi anche che prepari le bozze degli F24?', timestamp: '10:33' },
];
