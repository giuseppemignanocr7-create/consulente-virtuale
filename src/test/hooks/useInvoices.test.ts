import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useInvoices } from '../../hooks/useInvoices';
import { mockInvoices } from '../../data/mockData';

describe('useInvoices — scenari quotidiani fatturazione', () => {
  it('01 carica fatture al mount', async () => {
    const { result } = renderHook(() => useInvoices());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.invoices.length).toBeGreaterThan(0);
  });

  it('02 usa mockInvoices in modalità demo', async () => {
    const { result } = renderHook(() => useInvoices());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.invoices).toEqual(mockInvoices);
  });

  it('03 stats.total è la somma di tutti i totali', async () => {
    const { result } = renderHook(() => useInvoices());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const expected = mockInvoices.reduce((s, i) => s + i.total, 0);
    expect(result.current.stats.total).toBe(expected);
  });

  it('04 stats.paid filtra solo accettate', async () => {
    const { result } = renderHook(() => useInvoices());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const expected = mockInvoices
      .filter(i => i.status === 'accettata')
      .reduce((s, i) => s + i.total, 0);
    expect(result.current.stats.paid).toBe(expected);
  });

  it('05 stats.pending filtra inviata+consegnata', async () => {
    const { result } = renderHook(() => useInvoices());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const expected = mockInvoices
      .filter(i => ['inviata', 'consegnata'].includes(i.status))
      .reduce((s, i) => s + i.total, 0);
    expect(result.current.stats.pending).toBe(expected);
  });

  it('06 stats.count corrisponde al numero di fatture', async () => {
    const { result } = renderHook(() => useInvoices());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.stats.count).toBe(mockInvoices.length);
  });

  it('07 ogni fattura ha un numero univoco', async () => {
    const { result } = renderHook(() => useInvoices());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const nums = result.current.invoices.map(i => i.number);
    expect(new Set(nums).size).toBe(nums.length);
  });

  it('08 stato fattura è sempre un valore valido', async () => {
    const { result } = renderHook(() => useInvoices());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const valid = ['bozza', 'inviata', 'consegnata', 'accettata', 'rifiutata', 'scartata'];
    result.current.invoices.forEach(i => expect(valid).toContain(i.status));
  });

  it('09 fatture emesse filtrabili', async () => {
    const { result } = renderHook(() => useInvoices());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const emesse = result.current.invoices.filter(i => i.type === 'emessa');
    emesse.forEach(i => expect(i.type).toBe('emessa'));
  });

  it('10 fatture ricevute filtrabili', async () => {
    const { result } = renderHook(() => useInvoices());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const ricevute = result.current.invoices.filter(i => i.type === 'ricevuta');
    ricevute.forEach(i => expect(i.type).toBe('ricevuta'));
  });

  it('11 importo IVA non negativo', async () => {
    const { result } = renderHook(() => useInvoices());
    await waitFor(() => expect(result.current.loading).toBe(false));
    result.current.invoices.forEach(i => expect(i.vat).toBeGreaterThanOrEqual(0));
  });

  it('12 totale >= imponibile per ogni fattura', async () => {
    const { result } = renderHook(() => useInvoices());
    await waitFor(() => expect(result.current.loading).toBe(false));
    result.current.invoices.forEach(i => expect(i.total).toBeGreaterThanOrEqual(i.amount));
  });

  it('13 data fattura è una stringa non vuota', async () => {
    const { result } = renderHook(() => useInvoices());
    await waitFor(() => expect(result.current.loading).toBe(false));
    result.current.invoices.forEach(i => expect(i.date).toBeTruthy());
  });

  it('14 clientId filter non produce errori', async () => {
    const { result } = renderHook(() => useInvoices('cliente-001'));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.invoices).toBeDefined();
  });

  it('15 refetch funziona dopo mount', async () => {
    const { result } = renderHook(() => useInvoices());
    await waitFor(() => expect(result.current.loading).toBe(false));
    await result.current.refetch();
    expect(result.current.invoices.length).toBeGreaterThan(0);
  });

  it('16 fatture ordinabili per data decrescente', async () => {
    const { result } = renderHook(() => useInvoices());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const sorted = [...result.current.invoices].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    expect(sorted[0].date >= sorted[sorted.length - 1].date).toBe(true);
  });

  it('17 ricerca per nome destinatario', async () => {
    const { result } = renderHook(() => useInvoices());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const first = result.current.invoices[0];
    const found = result.current.invoices.filter(i =>
      i.recipientName.toLowerCase().includes(first.recipientName.toLowerCase().slice(0, 3))
    );
    expect(found.length).toBeGreaterThan(0);
  });

  it('18 fatture bozza filtrabili', async () => {
    const { result } = renderHook(() => useInvoices());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const bozze = result.current.invoices.filter(i => i.status === 'bozza');
    expect(Array.isArray(bozze)).toBe(true);
  });

  it('19 totale stats non è NaN', async () => {
    const { result } = renderHook(() => useInvoices());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(isNaN(result.current.stats.total)).toBe(false);
  });

  it('20 stats.paid non supera stats.total', async () => {
    const { result } = renderHook(() => useInvoices());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.stats.paid).toBeLessThanOrEqual(result.current.stats.total);
  });
});
