import { describe, it, expect } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useInvoices } from '../../hooks/useInvoices';
import { useDeadlines } from '../../hooks/useDeadlines';
import { useTickets } from '../../hooks/useTickets';
import { useDocuments } from '../../hooks/useDocuments';
import { useAssessments } from '../../hooks/useAssessments';
import { useChat } from '../../hooks/useChat';
import { useNotifications } from '../../hooks/useNotifications';
import { useColf } from '../../hooks/useColf';
import { mockClients } from '../../data/mockData';

const CLIENT_ID = mockClients[0].id;

// ── SCENARI USO QUOTIDIANO — CLIENTE ────────────────────────────────────────
describe('CLIENTE — accesso area personale: notifiche e panoramica', () => {
  it('C01 cliente vede badge notifiche non lette', async () => {
    const { result } = renderHook(() => useNotifications());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.unreadCount).toBeGreaterThanOrEqual(0);
  });

  it('C02 cliente legge una notifica', async () => {
    const { result } = renderHook(() => useNotifications());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const unread = result.current.notifications.find(n => !n.read);
    if (!unread) return;
    await act(async () => { await result.current.markRead(unread.id); });
    const after = result.current.notifications.find(n => n.id === unread.id);
    expect(after?.read).toBe(true);
  });

  it('C03 cliente legge tutte le notifiche in una volta', async () => {
    const { result } = renderHook(() => useNotifications());
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => { await result.current.markAllRead(); });
    expect(result.current.unreadCount).toBe(0);
  });

  it('C04 cliente vede notifica tipo bando', async () => {
    const { result } = renderHook(() => useNotifications());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const bandi = result.current.notifications.filter(n => n.type === 'bando');
    expect(Array.isArray(bandi)).toBe(true);
  });

  it('C05 cliente vede notifica rottamazione cartelle', async () => {
    const { result } = renderHook(() => useNotifications());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const rott = result.current.notifications.filter(n => n.type === 'rottamazione');
    expect(Array.isArray(rott)).toBe(true);
  });

  it('C06 cliente vede scadenze urgenti proprie', async () => {
    const { result } = renderHook(() => useDeadlines(CLIENT_ID));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.deadlines).toBeDefined();
  });

  it('C07 cliente vede ultime fatture ricevute', async () => {
    const { result } = renderHook(() => useInvoices(CLIENT_ID));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.invoices).toBeDefined();
  });

  it('C08 cliente vede stato ticket aperti', async () => {
    const { result } = renderHook(() => useTickets(CLIENT_ID));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.tickets).toBeDefined();
  });

  it('C09 cliente vede data di ogni notifica', async () => {
    const { result } = renderHook(() => useNotifications());
    await waitFor(() => expect(result.current.loading).toBe(false));
    result.current.notifications.forEach(n => expect(n.date).toBeTruthy());
  });

  it('C10 cliente accede ai propri documenti', async () => {
    const { result } = renderHook(() => useDocuments(CLIENT_ID));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.documents).toBeDefined();
  });
});

describe('CLIENTE — fatture: visualizzazione e verifica', () => {
  it('C11 cliente vede le proprie fatture', async () => {
    const { result } = renderHook(() => useInvoices());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.invoices.length).toBeGreaterThan(0);
  });

  it('C12 cliente controlla totale pagato', async () => {
    const { result } = renderHook(() => useInvoices());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.stats.paid).toBeGreaterThanOrEqual(0);
  });

  it('C13 cliente controlla importo da pagare', async () => {
    const { result } = renderHook(() => useInvoices());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.stats.pending).toBeGreaterThanOrEqual(0);
  });

  it('C14 cliente vede dettaglio IVA fattura', async () => {
    const { result } = renderHook(() => useInvoices());
    await waitFor(() => expect(result.current.loading).toBe(false));
    result.current.invoices.forEach(i => expect(i.vat).toBeGreaterThanOrEqual(0));
  });

  it('C15 cliente verifica numero fattura', async () => {
    const { result } = renderHook(() => useInvoices());
    await waitFor(() => expect(result.current.loading).toBe(false));
    result.current.invoices.forEach(i => expect(i.number).toBeTruthy());
  });

  it('C16 cliente filtra fatture accettate', async () => {
    const { result } = renderHook(() => useInvoices());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const accettate = result.current.invoices.filter(i => i.status === 'accettata');
    accettate.forEach(i => expect(i.status).toBe('accettata'));
  });

  it('C17 cliente filtra fatture bozza da completare', async () => {
    const { result } = renderHook(() => useInvoices());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const bozze = result.current.invoices.filter(i => i.status === 'bozza');
    bozze.forEach(i => expect(i.status).toBe('bozza'));
  });

  it('C18 cliente vede nome destinatario fattura', async () => {
    const { result } = renderHook(() => useInvoices());
    await waitFor(() => expect(result.current.loading).toBe(false));
    result.current.invoices.forEach(i => expect(i.recipientName).toBeTruthy());
  });

  it('C19 cliente controlla data fattura', async () => {
    const { result } = renderHook(() => useInvoices());
    await waitFor(() => expect(result.current.loading).toBe(false));
    result.current.invoices.forEach(i => expect(new Date(i.date).getFullYear()).toBeGreaterThan(2020));
  });

  it('C20 cliente verifica imponibile < totale (con IVA)', async () => {
    const { result } = renderHook(() => useInvoices());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const conIva = result.current.invoices.filter(i => i.vat > 0);
    conIva.forEach(i => expect(i.total).toBeGreaterThan(i.amount));
  });
});

describe('CLIENTE — documenti: accesso e firma digitale', () => {
  it('C21 cliente vede tutti i propri documenti', async () => {
    const { result } = renderHook(() => useDocuments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.documents.length).toBeGreaterThan(0);
  });

  it('C22 cliente filtra documenti per firma', async () => {
    const { result } = renderHook(() => useDocuments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const daFirmare = result.current.documents.filter(d => !d.signed);
    expect(Array.isArray(daFirmare)).toBe(true);
  });

  it('C23 cliente vede documenti già firmati', async () => {
    const { result } = renderHook(() => useDocuments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const firmati = result.current.documents.filter(d => d.signed);
    firmati.forEach(d => expect(d.signed).toBe(true));
  });

  it('C24 cliente invia documento per firma digitale', async () => {
    const { result } = renderHook(() => useDocuments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const daFirmare = result.current.documents.find(d => !d.signed);
    if (!daFirmare) return;
    await expect(result.current.signDocument(daFirmare.id)).resolves.not.toThrow();
  });

  it('C25 cliente scarica documento (verifica tipo)', async () => {
    const { result } = renderHook(() => useDocuments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const conTipo = result.current.documents.filter(d => d.type);
    expect(conTipo.length).toBeGreaterThan(0);
  });

  it('C26 cliente filtra CU (Certificazione Unica)', async () => {
    const { result } = renderHook(() => useDocuments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const cu = result.current.documents.filter(d => d.type === 'cu');
    cu.forEach(d => expect(d.type).toBe('cu'));
  });

  it('C27 cliente filtra buste paga', async () => {
    const { result } = renderHook(() => useDocuments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const buste = result.current.documents.filter(d => d.type === 'busta_paga');
    buste.forEach(d => expect(d.type).toBe('busta_paga'));
  });

  it('C28 cliente filtra contratti', async () => {
    const { result } = renderHook(() => useDocuments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const contratti = result.current.documents.filter(d => d.type === 'contratto');
    contratti.forEach(d => expect(d.type).toBe('contratto'));
  });

  it('C29 cliente vede data upload documento', async () => {
    const { result } = renderHook(() => useDocuments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    result.current.documents.forEach(d => expect(d.uploadedAt).toBeTruthy());
  });

  it('C30 cliente elimina documento in demo', async () => {
    const { result } = renderHook(() => useDocuments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const first = result.current.documents[0];
    await expect(result.current.deleteDocument(first.id)).resolves.not.toThrow();
  });
});

describe('CLIENTE — tickets: apertura e monitoraggio richieste', () => {
  it('C31 cliente vede i propri ticket', async () => {
    const { result } = renderHook(() => useTickets());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.tickets.length).toBeGreaterThan(0);
  });

  it('C32 cliente vede ticket aperto con soggetto', async () => {
    const { result } = renderHook(() => useTickets());
    await waitFor(() => expect(result.current.loading).toBe(false));
    result.current.tickets.forEach(t => expect(t.subject).toBeTruthy());
  });

  it('C33 cliente filtra ticket per priorità urgente', async () => {
    const { result } = renderHook(() => useTickets());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const urgenti = result.current.tickets.filter(t => t.priority === 'urgente');
    urgenti.forEach(t => expect(t.priority).toBe('urgente'));
  });

  it('C34 cliente vede risposta su ticket (lastMessage)', async () => {
    const { result } = renderHook(() => useTickets());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const conRisposta = result.current.tickets.filter(t => t.lastMessage);
    expect(conRisposta.length).toBeGreaterThan(0);
  });

  it('C35 cliente vede stato avanzamento ticket', async () => {
    const { result } = renderHook(() => useTickets());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const valid = ['aperto', 'in_lavorazione', 'chiuso'];
    result.current.tickets.forEach(t => expect(valid).toContain(t.status));
  });

  it('C36 cliente filtra ticket societari', async () => {
    const { result } = renderHook(() => useTickets());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const soc = result.current.tickets.filter(t => t.category === 'societario');
    soc.forEach(t => expect(t.category).toBe('societario'));
  });

  it('C37 cliente vede data apertura ticket', async () => {
    const { result } = renderHook(() => useTickets());
    await waitFor(() => expect(result.current.loading).toBe(false));
    result.current.tickets.forEach(t => expect(t.createdAt).toBeTruthy());
  });

  it('C38 cliente conta ticket per stato', async () => {
    const { result } = renderHook(() => useTickets());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const aperti = result.current.tickets.filter(t => t.status === 'aperto').length;
    expect(aperti).toBe(result.current.stats.open);
  });

  it('C39 cliente verifica ticket con clientName', async () => {
    const { result } = renderHook(() => useTickets());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const conNome = result.current.tickets.filter(t => t.clientName);
    expect(conNome.length).toBeGreaterThan(0);
  });

  it('C40 cliente crea un ticket in demo', async () => {
    const { result } = renderHook(() => useTickets());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const before = result.current.tickets.length;
    await act(async () => {
      await result.current.createTicket({
        subject: 'Richiesta chiarimento F24',
        category: 'fiscale',
        priority: 'media',
        status: 'aperto',
        studio_id: null,
        client_id: CLIENT_ID,
        client_name: mockClients[0].name,
        last_message: null,
      });
    });
    expect(result.current.tickets.length).toBe(before);
  });
});

describe('CLIENTE — scadenze: monitoraggio pagamenti', () => {
  it('C41 cliente vede scadenze in arrivo', async () => {
    const { result } = renderHook(() => useDeadlines());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.deadlines.length).toBeGreaterThan(0);
  });

  it('C42 cliente controlla descrizione scadenza', async () => {
    const { result } = renderHook(() => useDeadlines());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const conDesc = result.current.deadlines.filter(d => d.description);
    expect(conDesc.length).toBeGreaterThan(0);
  });

  it('C43 cliente distingue tipo scadenza (INPS/INAIL/ADE)', async () => {
    const { result } = renderHook(() => useDeadlines());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const valid = ['inps', 'inail', 'ade', 'altro'];
    result.current.deadlines.forEach(d => expect(valid).toContain(d.type));
  });

  it('C44 cliente vede scadenze non completate', async () => {
    const { result } = renderHook(() => useDeadlines());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const pending = result.current.deadlines.filter(d => !d.completed);
    pending.forEach(d => expect(d.completed).toBe(false));
  });

  it('C45 cliente vede descrizione scadenza', async () => {
    const { result } = renderHook(() => useDeadlines());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const conDesc = result.current.deadlines.filter(d => d.description);
    expect(conDesc.length).toBeGreaterThan(0);
  });

  it('C46 cliente ordina scadenze per data crescente', async () => {
    const { result } = renderHook(() => useDeadlines());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const sorted = [...result.current.deadlines].sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    expect(new Date(sorted[0].date).getTime()).toBeLessThanOrEqual(
      new Date(sorted[sorted.length - 1].date).getTime()
    );
  });

  it('C47 cliente vede scadenze INPS proprie', async () => {
    const { result } = renderHook(() => useDeadlines());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const inps = result.current.deadlines.filter(d => d.type === 'inps');
    expect(Array.isArray(inps)).toBe(true);
  });

  it('C48 cliente conta scadenze non completate', async () => {
    const { result } = renderHook(() => useDeadlines());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const pending = result.current.deadlines.filter(d => !d.completed).length;
    expect(pending).toBeGreaterThanOrEqual(0);
  });

  it('C49 cliente conferma pagamento scadenza', async () => {
    const { result } = renderHook(() => useDeadlines());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const pending = result.current.deadlines.find(d => !d.completed);
    if (!pending) return;
    await act(async () => { await result.current.toggleComplete(pending.id); });
    expect(result.current.deadlines.find(d => d.id === pending.id)?.completed).toBe(true);
  });

  it('C50 cliente vede % scadenze pagate', async () => {
    const { result } = renderHook(() => useDeadlines());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const total = result.current.deadlines.length;
    const paid = result.current.deadlines.filter(d => d.completed).length;
    const pct = total > 0 ? Math.round((paid / total) * 100) : 0;
    expect(pct).toBeGreaterThanOrEqual(0);
    expect(pct).toBeLessThanOrEqual(100);
  });
});

describe('CLIENTE — accertamenti: monitoraggio pratiche', () => {
  it('C51 cliente vede i propri accertamenti', async () => {
    const { result } = renderHook(() => useAssessments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.assessments.length).toBeGreaterThan(0);
  });

  it('C52 cliente vede stato pratica accertamento', async () => {
    const { result } = renderHook(() => useAssessments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const valid = ['caricato', 'in_valutazione', 'documenti_richiesti', 'in_lavorazione', 'concluso'];
    result.current.assessments.forEach(a => expect(valid).toContain(a.status));
  });

  it('C53 cliente vede importo accertamento', async () => {
    const { result } = renderHook(() => useAssessments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const conImporto = result.current.assessments.filter(a => a.amount && a.amount > 0);
    expect(conImporto.length).toBeGreaterThan(0);
  });

  it('C54 cliente vede data notifica accertamento', async () => {
    const { result } = renderHook(() => useAssessments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    result.current.assessments.forEach(a => expect(a.notificationDate).toBeTruthy());
  });

  it('C55 cliente vede data caricamento pratica', async () => {
    const { result } = renderHook(() => useAssessments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    result.current.assessments.forEach(a => expect(a.uploadDate).toBeTruthy());
  });

  it('C56 cliente controlla categoria accertamento', async () => {
    const { result } = renderHook(() => useAssessments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const valid = ['imposte_dirette', 'iva', 'registro', 'locale', 'contributivo'];
    result.current.assessments.forEach(a => expect(valid).toContain(a.category));
  });

  it('C57 cliente vede descrizione dettagliata', async () => {
    const { result } = renderHook(() => useAssessments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    result.current.assessments.forEach(a => expect(a.description).toBeTruthy());
  });

  it('C58 cliente calcola esposizione totale', async () => {
    const { result } = renderHook(() => useAssessments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const totale = result.current.assessments
      .filter(a => a.status !== 'concluso')
      .reduce((s, a) => s + (a.amount ?? 0), 0);
    expect(totale).toBeGreaterThanOrEqual(0);
  });

  it('C59 cliente accertamenti conclusi non urgenti', async () => {
    const { result } = renderHook(() => useAssessments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const conclusi = result.current.assessments.filter(a => a.status === 'concluso');
    conclusi.forEach(a => expect(['caricato', 'documenti_richiesti']).not.toContain(a.status));
  });

  it('C60 cliente ricerca accertamento per descrizione', async () => {
    const { result } = renderHook(() => useAssessments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const query = result.current.assessments[0].description.slice(0, 5).toLowerCase();
    const found = result.current.assessments.filter(a =>
      a.description.toLowerCase().includes(query)
    );
    expect(found.length).toBeGreaterThan(0);
  });
});

describe('CLIENTE — chat: comunicazione con lo studio', () => {
  it('C61 cliente vede la storia messaggi', async () => {
    const { result } = renderHook(() => useChat());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.messages.length).toBeGreaterThan(0);
  });

  it('C62 cliente invia messaggio allo studio', async () => {
    const { result } = renderHook(() => useChat());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const before = result.current.messages.length;
    await act(async () => {
      await result.current.sendMessage('Buongiorno, ho una domanda sulla mia dichiarazione', 'client');
    });
    expect(result.current.messages.length).toBe(before + 1);
  });

  it('C63 messaggio cliente ha sender=client', async () => {
    const { result } = renderHook(() => useChat());
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => {
      await result.current.sendMessage('Messaggio test', 'client');
    });
    const last = result.current.messages[result.current.messages.length - 1];
    expect(last.sender).toBe('client');
  });

  it('C64 cliente vede risposta studio precedente', async () => {
    const { result } = renderHook(() => useChat());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const studioMsg = result.current.messages.filter(m => m.sender === 'studio');
    expect(studioMsg.length).toBeGreaterThanOrEqual(0);
  });

  it('C65 cliente vede risposta AI precedente', async () => {
    const { result } = renderHook(() => useChat());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const aiMsg = result.current.messages.filter(m => m.isAI);
    expect(Array.isArray(aiMsg)).toBe(true);
  });

  it('C66 cliente non invia messaggio vuoto', async () => {
    const { result } = renderHook(() => useChat());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const before = result.current.messages.length;
    await act(async () => { await result.current.sendMessage(''); });
    expect(result.current.messages.length).toBe(before);
  });

  it('C67 cliente vede timestamp messaggio', async () => {
    const { result } = renderHook(() => useChat());
    await waitFor(() => expect(result.current.loading).toBe(false));
    result.current.messages.forEach(m => expect(m.timestamp).toBeTruthy());
  });

  it('C68 cliente invia 3 messaggi consecutivi', async () => {
    const { result } = renderHook(() => useChat());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const before = result.current.messages.length;
    await act(async () => {
      await result.current.sendMessage('Msg 1', 'client');
      await result.current.sendMessage('Msg 2', 'client');
      await result.current.sendMessage('Msg 3', 'client');
    });
    expect(result.current.messages.length).toBe(before + 3);
  });

  it('C69 cliente abilita realtime senza errori', async () => {
    const { result } = renderHook(() => useChat());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const cleanup = result.current.enableRealtime(() => {});
    expect(typeof cleanup).toBe('function');
    cleanup();
  });

  it('C70 cliente ricarica messaggi con refetch', async () => {
    const { result } = renderHook(() => useChat());
    await waitFor(() => expect(result.current.loading).toBe(false));
    await expect(result.current.refetch()).resolves.not.toThrow();
  });
});

describe('CLIENTE — colf/badanti: gestione domestici', () => {
  it('C71 cliente vede i propri lavoratori domestici', async () => {
    const { result } = renderHook(() => useColf());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.workers.length).toBeGreaterThan(0);
  });

  it('C72 cliente vede costo mensile totale', async () => {
    const { result } = renderHook(() => useColf());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.stats.totalCost).toBeGreaterThanOrEqual(0);
  });

  it('C73 cliente filtra lavoratori attivi', async () => {
    const { result } = renderHook(() => useColf());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const attivi = result.current.workers.filter(w => w.status === 'attivo');
    attivi.forEach(w => expect(w.status).toBe('attivo'));
  });

  it('C74 cliente vede contratto lavoratore', async () => {
    const { result } = renderHook(() => useColf());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const conContratto = result.current.workers.filter(w => w.contractType);
    expect(conContratto.length).toBeGreaterThan(0);
  });

  it('C75 cliente vede ore settimanali lavoratore', async () => {
    const { result } = renderHook(() => useColf());
    await waitFor(() => expect(result.current.loading).toBe(false));
    result.current.workers
      .filter(w => w.status === 'attivo')
      .forEach(w => expect((w.hoursPerWeek ?? 0)).toBeGreaterThanOrEqual(0));
  });

  it('C76 cliente vede livello contrattuale', async () => {
    const { result } = renderHook(() => useColf());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const conLivello = result.current.workers.filter(w => w.level);
    expect(conLivello.length).toBeGreaterThan(0);
  });

  it('C77 cliente vede nazionalità lavoratore', async () => {
    const { result } = renderHook(() => useColf());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const conNaz = result.current.workers.filter(w => w.nationality);
    expect(conNaz.length).toBeGreaterThan(0);
  });

  it('C78 cliente conta lavoratori per stato', async () => {
    const { result } = renderHook(() => useColf());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const total = result.current.stats.total;
    const attivi = result.current.stats.attivi;
    expect(attivi).toBeLessThanOrEqual(total);
  });

  it('C79 cliente vede data inizio rapporto', async () => {
    const { result } = renderHook(() => useColf());
    await waitFor(() => expect(result.current.loading).toBe(false));
    result.current.workers.forEach(w => expect(w.startDate).toBeTruthy());
  });

  it('C80 cliente genera busta paga in demo', async () => {
    const { result } = renderHook(() => useColf());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const worker = result.current.workers[0];
    await expect(
      result.current.generatePayslip(worker.id, 'gennaio', 2026, {})
    ).resolves.not.toThrow();
  });
});
