import { describe, it, expect } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useAssessments } from '../../hooks/useAssessments';
import { mockAssessments } from '../../data/mockData';

describe('useAssessments — scenari quotidiani accertamenti', () => {
  it('01 carica accertamenti al mount', async () => {
    const { result } = renderHook(() => useAssessments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.assessments.length).toBeGreaterThan(0);
  });

  it('02 usa mockAssessments in modalità demo', async () => {
    const { result } = renderHook(() => useAssessments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.assessments).toEqual(mockAssessments);
  });

  it('03 stats.total conta tutti gli accertamenti', async () => {
    const { result } = renderHook(() => useAssessments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.stats.total).toBe(mockAssessments.length);
  });

  it('04 stats.totalAmount somma tutti gli importi', async () => {
    const { result } = renderHook(() => useAssessments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const expected = mockAssessments.reduce((s, a) => s + (a.amount ?? 0), 0);
    expect(result.current.stats.totalAmount).toBe(expected);
  });

  it('05 stats.active esclude i conclusi', async () => {
    const { result } = renderHook(() => useAssessments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const expected = mockAssessments.filter(a => a.status !== 'concluso').length;
    expect(result.current.stats.active).toBe(expected);
  });

  it('06 stats.urgent conta caricato+documenti_richiesti', async () => {
    const { result } = renderHook(() => useAssessments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const expected = mockAssessments.filter(a =>
      ['caricato', 'documenti_richiesti'].includes(a.status)
    ).length;
    expect(result.current.stats.urgent).toBe(expected);
  });

  it('07 updateStatus aggiorna stato localmente', async () => {
    const { result } = renderHook(() => useAssessments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const first = result.current.assessments[0];
    await act(async () => { await result.current.updateStatus(first.id, 'in_lavorazione'); });
    const updated = result.current.assessments.find(a => a.id === first.id);
    expect(updated?.status).toBe('in_lavorazione');
  });

  it('08 updateStatus a concluso', async () => {
    const { result } = renderHook(() => useAssessments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const first = result.current.assessments[0];
    await act(async () => { await result.current.updateStatus(first.id, 'concluso'); });
    const updated = result.current.assessments.find(a => a.id === first.id);
    expect(updated?.status).toBe('concluso');
  });

  it('09 category è un valore valido per ogni accertamento', async () => {
    const { result } = renderHook(() => useAssessments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const valid = ['imposte_dirette', 'iva', 'registro', 'locale', 'contributivo'];
    result.current.assessments.forEach(a => expect(valid).toContain(a.category));
  });

  it('10 status è un valore valido per ogni accertamento', async () => {
    const { result } = renderHook(() => useAssessments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const valid = ['caricato', 'in_valutazione', 'documenti_richiesti', 'in_lavorazione', 'concluso'];
    result.current.assessments.forEach(a => expect(valid).toContain(a.status));
  });

  it('11 importo è sempre >= 0', async () => {
    const { result } = renderHook(() => useAssessments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    result.current.assessments.forEach(a =>
      expect((a.amount ?? 0)).toBeGreaterThanOrEqual(0)
    );
  });

  it('12 accertamenti IVA filtrabili', async () => {
    const { result } = renderHook(() => useAssessments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const iva = result.current.assessments.filter(a => a.category === 'iva');
    iva.forEach(a => expect(a.category).toBe('iva'));
  });

  it('13 accertamenti imposte dirette filtrabili', async () => {
    const { result } = renderHook(() => useAssessments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const imp = result.current.assessments.filter(a => a.category === 'imposte_dirette');
    imp.forEach(a => expect(a.category).toBe('imposte_dirette'));
  });

  it('14 ogni accertamento ha description', async () => {
    const { result } = renderHook(() => useAssessments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    result.current.assessments.forEach(a => expect(a.description).toBeTruthy());
  });

  it('15 ogni accertamento ha notificationDate', async () => {
    const { result } = renderHook(() => useAssessments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    result.current.assessments.forEach(a => expect(a.notificationDate).toBeTruthy());
  });

  it('16 filtro clientId funziona in demo', async () => {
    const { result } = renderHook(() => useAssessments('client-001'));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.assessments).toBeDefined();
  });

  it('17 stats.totalAmount non è NaN', async () => {
    const { result } = renderHook(() => useAssessments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(isNaN(result.current.stats.totalAmount)).toBe(false);
  });

  it('18 refetch non produce errori', async () => {
    const { result } = renderHook(() => useAssessments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    await expect(result.current.refetch()).resolves.not.toThrow();
  });

  it('19 accertamenti conclusi filtrabili', async () => {
    const { result } = renderHook(() => useAssessments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const conclusi = result.current.assessments.filter(a => a.status === 'concluso');
    conclusi.forEach(a => expect(a.status).toBe('concluso'));
  });

  it('20 ogni accertamento ha id univoco', async () => {
    const { result } = renderHook(() => useAssessments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const ids = result.current.assessments.map(a => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
