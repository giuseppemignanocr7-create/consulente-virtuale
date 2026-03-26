import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useColf } from '../../hooks/useColf';
import { mockColfWorkers } from '../../data/mockData';

describe('useColf — scenari quotidiani gestione colf/badanti', () => {
  it('01 carica lavoratori al mount', async () => {
    const { result } = renderHook(() => useColf());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.workers.length).toBeGreaterThan(0);
  });

  it('02 usa mockColfWorkers in modalità demo', async () => {
    const { result } = renderHook(() => useColf());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.workers).toEqual(mockColfWorkers);
  });

  it('03 stats.total conta tutti i lavoratori', async () => {
    const { result } = renderHook(() => useColf());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.stats.total).toBe(mockColfWorkers.length);
  });

  it('04 stats.attivi conta lavoratori attivi', async () => {
    const { result } = renderHook(() => useColf());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const expected = mockColfWorkers.filter(w => w.status === 'attivo').length;
    expect(result.current.stats.attivi).toBe(expected);
  });

  it('05 stats.totalCost somma solo attivi', async () => {
    const { result } = renderHook(() => useColf());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const expected = mockColfWorkers
      .filter(w => w.status === 'attivo')
      .reduce((s, w) => s + (w.grossSalary ?? 0), 0);
    expect(result.current.stats.totalCost).toBe(expected);
  });

  it('06 stato lavoratore è un valore valido', async () => {
    const { result } = renderHook(() => useColf());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const valid = ['attivo', 'sospeso', 'cessato'];
    result.current.workers.forEach(w => expect(valid).toContain(w.status));
  });

  it('07 ogni lavoratore ha nome', async () => {
    const { result } = renderHook(() => useColf());
    await waitFor(() => expect(result.current.loading).toBe(false));
    result.current.workers.forEach(w => expect(w.fullName).toBeTruthy());
  });

  it('08 lavoratori attivi filtrabili', async () => {
    const { result } = renderHook(() => useColf());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const attivi = result.current.workers.filter(w => w.status === 'attivo');
    attivi.forEach(w => expect(w.status).toBe('attivo'));
  });

  it('09 lavoratori cessati filtrabili', async () => {
    const { result } = renderHook(() => useColf());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const cessati = result.current.workers.filter(w => w.status === 'cessato');
    cessati.forEach(w => expect(w.status).toBe('cessato'));
  });

  it('10 filtro clientId funziona in demo', async () => {
    const firstClientId = mockColfWorkers[0].clientId;
    const { result } = renderHook(() => useColf(firstClientId));
    await waitFor(() => expect(result.current.loading).toBe(false));
    result.current.workers.forEach(w => expect(w.clientId).toBe(firstClientId));
  });

  it('11 ogni lavoratore ha startDate', async () => {
    const { result } = renderHook(() => useColf());
    await waitFor(() => expect(result.current.loading).toBe(false));
    result.current.workers.forEach(w => expect(w.startDate).toBeTruthy());
  });

  it('12 grossSalary >= 0 per attivi', async () => {
    const { result } = renderHook(() => useColf());
    await waitFor(() => expect(result.current.loading).toBe(false));
    result.current.workers
      .filter(w => w.status === 'attivo')
      .forEach(w => expect((w.grossSalary ?? 0)).toBeGreaterThanOrEqual(0));
  });

  it('13 id univoco per ogni lavoratore', async () => {
    const { result } = renderHook(() => useColf());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const ids = result.current.workers.map(w => w.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('14 createWorker è una funzione', async () => {
    const { result } = renderHook(() => useColf());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(typeof result.current.createWorker).toBe('function');
  });

  it('15 updateWorker è una funzione', async () => {
    const { result } = renderHook(() => useColf());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(typeof result.current.updateWorker).toBe('function');
  });

  it('16 terminateWorker è una funzione', async () => {
    const { result } = renderHook(() => useColf());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(typeof result.current.terminateWorker).toBe('function');
  });

  it('17 generatePayslip è una funzione', async () => {
    const { result } = renderHook(() => useColf());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(typeof result.current.generatePayslip).toBe('function');
  });

  it('18 stats.totalCost non è NaN', async () => {
    const { result } = renderHook(() => useColf());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(isNaN(result.current.stats.totalCost)).toBe(false);
  });

  it('19 refetch non produce errori', async () => {
    const { result } = renderHook(() => useColf());
    await waitFor(() => expect(result.current.loading).toBe(false));
    await expect(result.current.refetch()).resolves.not.toThrow();
  });

  it('20 terminateWorker demo non lancia errori', async () => {
    const { result } = renderHook(() => useColf());
    await waitFor(() => expect(result.current.loading).toBe(false));
    await expect(result.current.terminateWorker('fake-id')).resolves.not.toThrow();
  });
});
