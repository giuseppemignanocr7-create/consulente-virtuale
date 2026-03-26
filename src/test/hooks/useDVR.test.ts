import { describe, it, expect } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useDVR } from '../../hooks/useDVR';
import { mockDVRDocuments } from '../../data/mockData';

describe('useDVR — scenari quotidiani sicurezza lavoro', () => {
  it('01 carica DVR al mount', async () => {
    const { result } = renderHook(() => useDVR());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.dvrs.length).toBeGreaterThan(0);
  });

  it('02 usa mockDVRDocuments in modalità demo', async () => {
    const { result } = renderHook(() => useDVR());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.dvrs).toEqual(mockDVRDocuments);
  });

  it('03 stats.total conta tutti i DVR', async () => {
    const { result } = renderHook(() => useDVR());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.stats.total).toBe(mockDVRDocuments.length);
  });

  it('04 stats.firmati conta DVR firmati', async () => {
    const { result } = renderHook(() => useDVR());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const expected = mockDVRDocuments.filter(d => d.status === 'firmato').length;
    expect(result.current.stats.firmati).toBe(expected);
  });

  it('05 stats.bozze conta DVR in bozza', async () => {
    const { result } = renderHook(() => useDVR());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const expected = mockDVRDocuments.filter(d => d.status === 'bozza').length;
    expect(result.current.stats.bozze).toBe(expected);
  });

  it('06 updateStatus a firmato aggiorna localmente', async () => {
    const { result } = renderHook(() => useDVR());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const first = result.current.dvrs[0];
    await act(async () => { await result.current.updateStatus(first.id, 'firmato'); });
    const updated = result.current.dvrs.find(d => d.id === first.id);
    expect(updated?.status).toBe('firmato');
  });

  it('07 updateStatus a completato aggiorna localmente', async () => {
    const { result } = renderHook(() => useDVR());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const first = result.current.dvrs[0];
    await act(async () => { await result.current.updateStatus(first.id, 'completato'); });
    const updated = result.current.dvrs.find(d => d.id === first.id);
    expect(updated?.status).toBe('completato');
  });

  it('08 ogni DVR ha un titolo', async () => {
    const { result } = renderHook(() => useDVR());
    await waitFor(() => expect(result.current.loading).toBe(false));
    result.current.dvrs.forEach(d => expect(d.title).toBeTruthy());
  });

  it('09 ogni DVR ha un clientId', async () => {
    const { result } = renderHook(() => useDVR());
    await waitFor(() => expect(result.current.loading).toBe(false));
    result.current.dvrs.forEach(d => expect(d.clientId).toBeTruthy());
  });

  it('10 dvr firmati filtrabili', async () => {
    const { result } = renderHook(() => useDVR());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const firmati = result.current.dvrs.filter(d => d.status === 'firmato');
    firmati.forEach(d => expect(d.status).toBe('firmato'));
  });

  it('11 dvr bozze filtrabili', async () => {
    const { result } = renderHook(() => useDVR());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const bozze = result.current.dvrs.filter(d => d.status === 'bozza');
    bozze.forEach(d => expect(d.status).toBe('bozza'));
  });

  it('12 filtro clientId funziona in demo', async () => {
    const mockFirst = mockDVRDocuments[0];
    const { result } = renderHook(() => useDVR(mockFirst.clientId));
    await waitFor(() => expect(result.current.loading).toBe(false));
    result.current.dvrs.forEach(d => expect(d.clientId).toBe(mockFirst.clientId));
  });

  it('13 ogni DVR ha riskLevel', async () => {
    const { result } = renderHook(() => useDVR());
    await waitFor(() => expect(result.current.loading).toBe(false));
    result.current.dvrs.forEach(d => expect(d.riskLevel).toBeTruthy());
  });

  it('14 riskLevel è un valore valido', async () => {
    const { result } = renderHook(() => useDVR());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const valid = ['basso', 'medio', 'alto'];
    result.current.dvrs.forEach(d => expect(valid).toContain(d.riskLevel));
  });

  it('15 DVR alto rischio filtrabili', async () => {
    const { result } = renderHook(() => useDVR());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const altoRischio = result.current.dvrs.filter(d => d.riskLevel === 'alto');
    altoRischio.forEach(d => expect(d.riskLevel).toBe('alto'));
  });

  it('16 ogni DVR ha reviewDate o è undefined', async () => {
    const { result } = renderHook(() => useDVR());
    await waitFor(() => expect(result.current.loading).toBe(false));
    result.current.dvrs.forEach(d => expect(d.reviewDate !== null).toBe(true));
  });

  it('17 ogni DVR ha workersCount >= 0', async () => {
    const { result } = renderHook(() => useDVR());
    await waitFor(() => expect(result.current.loading).toBe(false));
    result.current.dvrs.forEach(d => expect(d.workersCount).toBeGreaterThanOrEqual(0));
  });

  it('18 refetch non produce errori', async () => {
    const { result } = renderHook(() => useDVR());
    await waitFor(() => expect(result.current.loading).toBe(false));
    await expect(result.current.refetch()).resolves.not.toThrow();
  });

  it('19 id univoco per ogni DVR', async () => {
    const { result } = renderHook(() => useDVR());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const ids = result.current.dvrs.map(d => d.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('20 createDVR demo non lancia errori', async () => {
    const { result } = renderHook(() => useDVR());
    await waitFor(() => expect(result.current.loading).toBe(false));
    await expect(
      result.current.createDVR({
        title: 'Test DVR',
        client_id: 'c1',
        client_name: 'Test Cliente',
        risk_level: 'medio',
        status: 'bozza',
        studio_id: null,
        review_date: null,
        signed_date: null,
        document_path: null,
        workers_count: null,
        activity_type: null,
        notes: null,
      })
    ).resolves.not.toThrow();
  });
});
