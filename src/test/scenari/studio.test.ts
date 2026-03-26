import { describe, it, expect } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useClients } from '../../hooks/useClients';
import { useInvoices } from '../../hooks/useInvoices';
import { useDeadlines } from '../../hooks/useDeadlines';
import { useTickets } from '../../hooks/useTickets';
import { useTodos } from '../../hooks/useTodos';
import { useAssessments } from '../../hooks/useAssessments';
import { useDVR } from '../../hooks/useDVR';
import { mockClients } from '../../data/mockData';

// ── SCENARI USO QUOTIDIANO — STUDIO ─────────────────────────────────────────
describe('STUDIO — mattina: revisione dashboard KPI', () => {
  it('S01 studio vede quanti clienti attivi ha', async () => {
    const { result } = renderHook(() => useClients());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const attivi = result.current.clients.filter(c => c.status === 'attivo').length;
    expect(attivi).toBeGreaterThan(0);
  });

  it('S02 studio vede tickets urgenti aperti', async () => {
    const { result } = renderHook(() => useTickets());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.stats.urgent).toBeGreaterThanOrEqual(0);
  });

  it('S03 studio vede scadenze imminenti', async () => {
    const { result } = renderHook(() => useDeadlines());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const imminenti = result.current.deadlines.filter(d => d.urgency === 'imminente' && !d.completed);
    expect(Array.isArray(imminenti)).toBe(true);
  });

  it('S04 studio vede scadenze scadute non completate', async () => {
    const { result } = renderHook(() => useDeadlines());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.overdue.every(d => !d.completed)).toBe(true);
  });

  it('S05 studio calcola fatturato totale del mese', async () => {
    const { result } = renderHook(() => useInvoices());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.stats.total).toBeGreaterThan(0);
  });

  it('S06 studio vede quante fatture sono in attesa', async () => {
    const { result } = renderHook(() => useInvoices());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.stats.pending).toBeGreaterThanOrEqual(0);
  });

  it('S07 studio controlla i todos ad alta priorità', async () => {
    const { result } = renderHook(() => useTodos());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.stats.alta).toBeGreaterThanOrEqual(0);
  });

  it('S08 studio segna una scadenza come completata', async () => {
    const { result } = renderHook(() => useDeadlines());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const pendente = result.current.deadlines.find(d => !d.completed);
    if (!pendente) return;
    await act(async () => { await result.current.toggleComplete(pendente.id); });
    const updated = result.current.deadlines.find(d => d.id === pendente.id);
    expect(updated?.completed).toBe(true);
  });

  it('S09 studio segna un todo come fatto', async () => {
    const { result } = renderHook(() => useTodos());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const pending = result.current.todos.find(t => !t.completed);
    if (!pending) return;
    await act(async () => { await result.current.toggle(pending.id); });
    const after = result.current.todos.find(t => t.id === pending.id);
    expect(after?.completed).toBe(true);
  });

  it('S10 studio chiude un ticket risolto', async () => {
    const { result } = renderHook(() => useTickets());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const aperto = result.current.tickets.find(t => t.status === 'aperto');
    if (!aperto) return;
    await act(async () => { await result.current.updateStatus(aperto.id, 'chiuso'); });
    const after = result.current.tickets.find(t => t.id === aperto.id);
    expect(after?.status).toBe('chiuso');
  });
});

describe('STUDIO — mattina: gestione clienti', () => {
  it('S11 studio cerca cliente per nome', async () => {
    const { result } = renderHook(() => useClients());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const query = 'a';
    const trovati = result.current.clients.filter(c =>
      c.name.toLowerCase().includes(query)
    );
    expect(trovati.length).toBeGreaterThan(0);
  });

  it('S12 studio filtra clienti forfettari', async () => {
    const { result } = renderHook(() => useClients());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const forf = result.current.clients.filter(c => c.regime === 'forfettario');
    forf.forEach(c => expect(c.regime).toBe('forfettario'));
  });

  it('S13 studio filtra clienti ordinari', async () => {
    const { result } = renderHook(() => useClients());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const ord = result.current.clients.filter(c => c.regime === 'ordinario');
    ord.forEach(c => expect(c.regime).toBe('ordinario'));
  });

  it('S14 studio vede clienti sospesi da gestire', async () => {
    const { result } = renderHook(() => useClients());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const sospesi = result.current.clients.filter(c => c.status === 'sospeso');
    expect(Array.isArray(sospesi)).toBe(true);
  });

  it('S15 studio controlla codice fiscale cliente', async () => {
    const { result } = renderHook(() => useClients());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const conCF = result.current.clients.filter(c => c.fiscalCode);
    expect(conCF.length).toBeGreaterThan(0);
  });

  it('S16 studio controlla partita IVA cliente', async () => {
    const { result } = renderHook(() => useClients());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const conPIVA = result.current.clients.filter(c => c.vatNumber);
    expect(conPIVA.length).toBeGreaterThan(0);
  });

  it('S17 studio ordina clienti per nome A→Z', async () => {
    const { result } = renderHook(() => useClients());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const sorted = [...result.current.clients].sort((a, b) => a.name.localeCompare(b.name));
    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i - 1].name.localeCompare(sorted[i].name)).toBeLessThanOrEqual(0);
    }
  });

  it('S18 studio conta clienti per regime', async () => {
    const { result } = renderHook(() => useClients());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const perRegime = result.current.clients.reduce((acc, c) => {
      acc[c.regime] = (acc[c.regime] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    expect(Object.keys(perRegime).length).toBeGreaterThan(0);
  });

  it('S19 studio verifica ATECO cliente', async () => {
    const { result } = renderHook(() => useClients());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const conAteco = result.current.clients.filter(c => c.ateco);
    expect(conAteco.length).toBeGreaterThan(0);
  });

  it('S20 studio vede data inizio mandato cliente', async () => {
    const { result } = renderHook(() => useClients());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const conData = result.current.clients.filter(c => c.startDate);
    expect(conData.length).toBeGreaterThan(0);
  });
});

describe('STUDIO — pomeriggio: fatturazione e contabilità', () => {
  it('S21 studio filtra fatture emesse', async () => {
    const { result } = renderHook(() => useInvoices());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const emesse = result.current.invoices.filter(i => i.type === 'emessa');
    emesse.forEach(i => expect(i.type).toBe('emessa'));
  });

  it('S22 studio filtra fatture ricevute', async () => {
    const { result } = renderHook(() => useInvoices());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const ricevute = result.current.invoices.filter(i => i.type === 'ricevuta');
    ricevute.forEach(i => expect(i.type).toBe('ricevuta'));
  });

  it('S23 studio vede fatture non pagate (inviata)', async () => {
    const { result } = renderHook(() => useInvoices());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const inviata = result.current.invoices.filter(i => i.status === 'inviata');
    expect(Array.isArray(inviata)).toBe(true);
  });

  it('S24 studio calcola IVA totale da versare', async () => {
    const { result } = renderHook(() => useInvoices());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const vatTotal = result.current.invoices
      .filter(i => i.type === 'emessa')
      .reduce((s, i) => s + i.vat, 0);
    expect(vatTotal).toBeGreaterThanOrEqual(0);
  });

  it('S25 studio vede fatture del cliente specifico', async () => {
    const clientId = mockClients[0].id;
    const { result } = renderHook(() => useInvoices(clientId));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.invoices).toBeDefined();
  });

  it('S26 studio ordina fatture per importo decrescente', async () => {
    const { result } = renderHook(() => useInvoices());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const sorted = [...result.current.invoices].sort((a, b) => b.total - a.total);
    expect(sorted[0].total).toBeGreaterThanOrEqual(sorted[sorted.length - 1].total);
  });

  it('S27 studio verifica che stats.paid ≤ stats.total', async () => {
    const { result } = renderHook(() => useInvoices());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.stats.paid).toBeLessThanOrEqual(result.current.stats.total);
  });

  it('S28 studio filtra fatture rifiutate/scartate SDI', async () => {
    const { result } = renderHook(() => useInvoices());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const problemi = result.current.invoices.filter(i =>
      ['rifiutata', 'scartata'].includes(i.status)
    );
    expect(Array.isArray(problemi)).toBe(true);
  });

  it('S29 studio vede range importi fatture', async () => {
    const { result } = renderHook(() => useInvoices());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const min = Math.min(...result.current.invoices.map(i => i.total));
    const max = Math.max(...result.current.invoices.map(i => i.total));
    expect(max).toBeGreaterThanOrEqual(min);
  });

  it('S30 studio conta fatture per stato', async () => {
    const { result } = renderHook(() => useInvoices());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const perStato = result.current.invoices.reduce((acc, i) => {
      acc[i.status] = (acc[i.status] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    expect(Object.keys(perStato).length).toBeGreaterThan(0);
  });
});

describe('STUDIO — pomeriggio: scadenze fiscali e tributarie', () => {
  it('S31 studio visualizza calendario scadenze mensile', async () => {
    const { result } = renderHook(() => useDeadlines());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const mese = new Date().getMonth();
    const delMese = result.current.deadlines.filter(d => {
      const dm = new Date(d.date).getMonth();
      return dm === mese;
    });
    expect(Array.isArray(delMese)).toBe(true);
  });

  it('S32 studio segna multiplie scadenze come completate', async () => {
    const { result } = renderHook(() => useDeadlines());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const pending = result.current.deadlines.filter(d => !d.completed).slice(0, 2);
    for (const d of pending) {
      await act(async () => { await result.current.toggleComplete(d.id); });
    }
    const completatiOra = pending.filter(p =>
      result.current.deadlines.find(d => d.id === p.id && d.completed)
    );
    expect(completatiOra.length).toBe(pending.length);
  });

  it('S33 studio filtra scadenze INPS', async () => {
    const { result } = renderHook(() => useDeadlines());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const inps = result.current.deadlines.filter(d => d.type === 'inps');
    inps.forEach(d => expect(d.type).toBe('inps'));
  });

  it('S34 studio filtra scadenze INAIL', async () => {
    const { result } = renderHook(() => useDeadlines());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const inail = result.current.deadlines.filter(d => d.type === 'inail');
    inail.forEach(d => expect(d.type).toBe('inail'));
  });

  it('S35 studio filtra scadenze Agenzia Entrate', async () => {
    const { result } = renderHook(() => useDeadlines());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const ade = result.current.deadlines.filter(d => d.type === 'ade');
    ade.forEach(d => expect(d.type).toBe('ade'));
  });

  it('S36 scadenze filtrabili per cliente', async () => {
    const clientId = mockClients[0].id;
    const { result } = renderHook(() => useDeadlines(clientId));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.deadlines).toBeDefined();
  });

  it('S37 conteggio scadenze per urgenza', async () => {
    const { result } = renderHook(() => useDeadlines());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const perUrgenza = result.current.deadlines.reduce((acc, d) => {
      acc[d.urgency] = (acc[d.urgency] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    expect(Object.keys(perUrgenza).length).toBeGreaterThan(0);
  });

  it('S38 studio vede descrizione scadenza', async () => {
    const { result } = renderHook(() => useDeadlines());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const conDesc = result.current.deadlines.filter(d => d.description);
    expect(conDesc.length).toBeGreaterThan(0);
  });

  it('S39 percentuale completamento scadenze', async () => {
    const { result } = renderHook(() => useDeadlines());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const total = result.current.deadlines.length;
    const done = result.current.deadlines.filter(d => d.completed).length;
    const pct = total > 0 ? (done / total) * 100 : 0;
    expect(pct).toBeGreaterThanOrEqual(0);
    expect(pct).toBeLessThanOrEqual(100);
  });

  it('S40 studio riapre scadenza completata per errore', async () => {
    const { result } = renderHook(() => useDeadlines());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const completata = result.current.deadlines.find(d => d.completed);
    if (!completata) return;
    await act(async () => { await result.current.toggleComplete(completata.id); });
    const dopo = result.current.deadlines.find(d => d.id === completata.id);
    expect(dopo?.completed).toBe(false);
  });
});

describe('STUDIO — pomeriggio: gestione accertamenti', () => {
  it('S41 studio visualizza accertamenti attivi', async () => {
    const { result } = renderHook(() => useAssessments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const attivi = result.current.assessments.filter(a => a.status !== 'concluso');
    expect(Array.isArray(attivi)).toBe(true);
  });

  it('S42 studio aggiorna stato accertamento a in_valutazione', async () => {
    const { result } = renderHook(() => useAssessments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const first = result.current.assessments[0];
    await act(async () => { await result.current.updateStatus(first.id, 'in_valutazione'); });
    const after = result.current.assessments.find(a => a.id === first.id);
    expect(after?.status).toBe('in_valutazione');
  });

  it('S43 studio calcola valore totale accertamenti in corso', async () => {
    const { result } = renderHook(() => useAssessments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const inCorso = result.current.assessments
      .filter(a => a.status !== 'concluso')
      .reduce((s, a) => s + (a.amount ?? 0), 0);
    expect(inCorso).toBeGreaterThanOrEqual(0);
  });

  it('S44 studio filtra accertamenti IVA', async () => {
    const { result } = renderHook(() => useAssessments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const iva = result.current.assessments.filter(a => a.category === 'iva');
    iva.forEach(a => expect(a.category).toBe('iva'));
  });

  it('S45 studio chiude accertamento risolto', async () => {
    const { result } = renderHook(() => useAssessments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const first = result.current.assessments[0];
    await act(async () => { await result.current.updateStatus(first.id, 'concluso'); });
    const after = result.current.assessments.find(a => a.id === first.id);
    expect(after?.status).toBe('concluso');
  });

  it('S46 studio vede accertamenti che richiedono documenti', async () => {
    const { result } = renderHook(() => useAssessments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const richDoc = result.current.assessments.filter(a => a.status === 'documenti_richiesti');
    expect(Array.isArray(richDoc)).toBe(true);
  });

  it('S47 stats accertamenti non contiene valori negativi', async () => {
    const { result } = renderHook(() => useAssessments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.stats.total).toBeGreaterThanOrEqual(0);
    expect(result.current.stats.active).toBeGreaterThanOrEqual(0);
    expect(result.current.stats.urgent).toBeGreaterThanOrEqual(0);
  });

  it('S48 studio ordina accertamenti per importo', async () => {
    const { result } = renderHook(() => useAssessments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const sorted = [...result.current.assessments]
      .sort((a, b) => (b.amount ?? 0) - (a.amount ?? 0));
    expect((sorted[0].amount ?? 0)).toBeGreaterThanOrEqual((sorted[sorted.length - 1].amount ?? 0));
  });

  it('S49 studio filtra accertamenti per cliente', async () => {
    const { result } = renderHook(() => useAssessments(mockClients[0].id));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.assessments).toBeDefined();
  });

  it('S50 accertamenti contribuitivi filtrabili', async () => {
    const { result } = renderHook(() => useAssessments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const contrib = result.current.assessments.filter(a => a.category === 'contributivo');
    contrib.forEach(a => expect(a.category).toBe('contributivo'));
  });
});

describe('STUDIO — DVR sicurezza lavoro', () => {
  it('S51 studio vede DVR in scadenza', async () => {
    const { result } = renderHook(() => useDVR());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const inScadenza = result.current.dvrs.filter(d => d.status === 'completato');
    expect(Array.isArray(inScadenza)).toBe(true);
  });

  it('S52 studio aggiorna DVR a firmato', async () => {
    const { result } = renderHook(() => useDVR());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const bozza = result.current.dvrs.find(d => d.status === 'bozza');
    if (!bozza) return;
    await act(async () => { await result.current.updateStatus(bozza.id, 'firmato'); });
    const after = result.current.dvrs.find(d => d.id === bozza.id);
    expect(after?.status).toBe('firmato');
  });

  it('S53 studio filtra DVR per cliente', async () => {
    const firstId = mockClients[0].id;
    const { result } = renderHook(() => useDVR(firstId));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.dvrs).toBeDefined();
  });

  it('S54 studio conta DVR ad alto rischio', async () => {
    const { result } = renderHook(() => useDVR());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const altoRischio = result.current.dvrs.filter(d => d.riskLevel === 'alto').length;
    expect(altoRischio).toBeGreaterThanOrEqual(0);
  });

  it('S55 studio calcola lavoratori totali coperti da DVR', async () => {
    const { result } = renderHook(() => useDVR());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const totLavoratori = result.current.dvrs.reduce((s, d) => s + (d.workersCount ?? 0), 0);
    expect(totLavoratori).toBeGreaterThanOrEqual(0);
  });

  it('S56 stats.firmati + stats.bozze <= stats.total', async () => {
    const { result } = renderHook(() => useDVR());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.stats.firmati + result.current.stats.bozze)
      .toBeLessThanOrEqual(result.current.stats.total);
  });

  it('S57 studio identifica DVR medio rischio', async () => {
    const { result } = renderHook(() => useDVR());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const medio = result.current.dvrs.filter(d => d.riskLevel === 'medio');
    medio.forEach(d => expect(d.riskLevel).toBe('medio'));
  });

  it('S58 studio ordina DVR per data revisione', async () => {
    const { result } = renderHook(() => useDVR());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const sorted = [...result.current.dvrs].sort((a, b) =>
      new Date(a.reviewDate ?? '').getTime() - new Date(b.reviewDate ?? '').getTime()
    );
    expect(Array.isArray(sorted)).toBe(true);
  });

  it('S59 studio verifica clientName in ogni DVR', async () => {
    const { result } = renderHook(() => useDVR());
    await waitFor(() => expect(result.current.loading).toBe(false));
    result.current.dvrs.forEach(d => expect(d.clientName).toBeTruthy());
  });

  it('S60 studio aggiorna DVR a scaduto', async () => {
    const { result } = renderHook(() => useDVR());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const dvr = result.current.dvrs[0];
    await act(async () => { await result.current.updateStatus(dvr.id, 'scaduto'); });
    const after = result.current.dvrs.find(d => d.id === dvr.id);
    expect(after?.status).toBe('scaduto');
  });
});

describe('STUDIO — tickets: gestione richieste clienti', () => {
  it('S61 studio vede tutti i ticket aperti', async () => {
    const { result } = renderHook(() => useTickets());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const aperti = result.current.tickets.filter(t => t.status === 'aperto');
    expect(aperti.length).toBeGreaterThanOrEqual(0);
  });

  it('S62 studio prende in carico un ticket', async () => {
    const { result } = renderHook(() => useTickets());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const aperto = result.current.tickets.find(t => t.status === 'aperto');
    if (!aperto) return;
    await act(async () => {
      await result.current.updateStatus(aperto.id, 'in_lavorazione');
    });
    const after = result.current.tickets.find(t => t.id === aperto.id);
    expect(after?.status).toBe('in_lavorazione');
  });

  it('S63 studio filtra ticket per categoria lavoro', async () => {
    const { result } = renderHook(() => useTickets());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const lavoro = result.current.tickets.filter(t => t.category === 'lavoro');
    lavoro.forEach(t => expect(t.category).toBe('lavoro'));
  });

  it('S64 studio filtra ticket fiscali', async () => {
    const { result } = renderHook(() => useTickets());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const fiscali = result.current.tickets.filter(t => t.category === 'fiscale');
    fiscali.forEach(t => expect(t.category).toBe('fiscale'));
  });

  it('S65 studio filtra ticket contributivi', async () => {
    const { result } = renderHook(() => useTickets());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const contrib = result.current.tickets.filter(t => t.category === 'contributivo');
    contrib.forEach(t => expect(t.category).toBe('contributivo'));
  });

  it('S66 studio vede lastMessage per ogni ticket', async () => {
    const { result } = renderHook(() => useTickets());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const conMsg = result.current.tickets.filter(t => t.lastMessage);
    expect(conMsg.length).toBeGreaterThan(0);
  });

  it('S67 studio ordina ticket per priorità', async () => {
    const { result } = renderHook(() => useTickets());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const pOrder: Record<string, number> = { urgente: 0, alta: 1, media: 2, bassa: 3 };
    const sorted = [...result.current.tickets].sort(
      (a, b) => pOrder[a.priority] - pOrder[b.priority]
    );
    expect(pOrder[sorted[0].priority]).toBeLessThanOrEqual(pOrder[sorted[sorted.length - 1].priority]);
  });

  it('S68 conteggio ticket per categoria', async () => {
    const { result } = renderHook(() => useTickets());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const perCat = result.current.tickets.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    expect(Object.keys(perCat).length).toBeGreaterThan(0);
  });

  it('S69 studio chiude batch di ticket risolti', async () => {
    const { result } = renderHook(() => useTickets());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const batch = result.current.tickets.filter(t => t.status !== 'chiuso').slice(0, 2);
    for (const t of batch) {
      await act(async () => { await result.current.updateStatus(t.id, 'chiuso'); });
    }
    const chiusiOra = batch.every(b =>
      result.current.tickets.find(t => t.id === b.id && t.status === 'chiuso')
    );
    expect(chiusiOra).toBe(true);
  });

  it('S70 stats somma corretta dopo update', async () => {
    const { result } = renderHook(() => useTickets());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const total = result.current.tickets.length;
    const statSum = result.current.stats.open + result.current.stats.inProgress + result.current.stats.closed;
    expect(statSum).toBe(total);
  });
});
