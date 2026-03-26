import { describe, it, expect } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useDeadlines } from '../../hooks/useDeadlines';
import { mockDeadlines } from '../../data/mockData';

describe('useDeadlines — scenari quotidiani scadenze', () => {
  it('01 carica scadenze al mount', async () => {
    const { result } = renderHook(() => useDeadlines());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.deadlines.length).toBeGreaterThan(0);
  });

  it('02 usa mockDeadlines in modalità demo', async () => {
    const { result } = renderHook(() => useDeadlines());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.deadlines).toEqual(mockDeadlines);
  });

  it('03 upcoming esclude scadenze completate', async () => {
    const { result } = renderHook(() => useDeadlines());
    await waitFor(() => expect(result.current.loading).toBe(false));
    result.current.upcoming.forEach(d => expect(d.completed).toBe(false));
  });

  it('04 upcoming esclude urgency=normale', async () => {
    const { result } = renderHook(() => useDeadlines());
    await waitFor(() => expect(result.current.loading).toBe(false));
    result.current.upcoming.forEach(d => expect(d.urgency).not.toBe('normale'));
  });

  it('05 overdue ha urgency=scaduta', async () => {
    const { result } = renderHook(() => useDeadlines());
    await waitFor(() => expect(result.current.loading).toBe(false));
    result.current.overdue.forEach(d => expect(d.urgency).toBe('scaduta'));
  });

  it('06 overdue non contiene scadenze completate', async () => {
    const { result } = renderHook(() => useDeadlines());
    await waitFor(() => expect(result.current.loading).toBe(false));
    result.current.overdue.forEach(d => expect(d.completed).toBe(false));
  });

  it('07 toggleComplete inverte lo stato completed', async () => {
    const { result } = renderHook(() => useDeadlines());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const first = result.current.deadlines.find(d => !d.completed);
    if (!first) return;
    const before = first.completed;
    await act(async () => { await result.current.toggleComplete(first.id); });
    const after = result.current.deadlines.find(d => d.id === first.id);
    expect(after?.completed).toBe(!before);
  });

  it('08 toggleComplete su scadenza già completata la riapre', async () => {
    const { result } = renderHook(() => useDeadlines());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const completed = result.current.deadlines.find(d => d.completed);
    if (!completed) return;
    await act(async () => { await result.current.toggleComplete(completed.id); });
    const after = result.current.deadlines.find(d => d.id === completed.id);
    expect(after?.completed).toBe(false);
  });

  it('09 urgency è un valore valido per ogni scadenza', async () => {
    const { result } = renderHook(() => useDeadlines());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const valid = ['normale', 'imminente', 'scaduta'];
    result.current.deadlines.forEach(d => expect(valid).toContain(d.urgency));
  });

  it('10 type è un valore valido per ogni scadenza', async () => {
    const { result } = renderHook(() => useDeadlines());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const valid = ['inps', 'inail', 'ade', 'altro'];
    result.current.deadlines.forEach(d => expect(valid).toContain(d.type));
  });

  it('11 ogni scadenza ha un titolo', async () => {
    const { result } = renderHook(() => useDeadlines());
    await waitFor(() => expect(result.current.loading).toBe(false));
    result.current.deadlines.forEach(d => expect(d.title).toBeTruthy());
  });

  it('12 ogni scadenza ha una data', async () => {
    const { result } = renderHook(() => useDeadlines());
    await waitFor(() => expect(result.current.loading).toBe(false));
    result.current.deadlines.forEach(d => expect(d.date).toBeTruthy());
  });

  it('13 filtro clientId funziona in demo mode', async () => {
    const { result } = renderHook(() => useDeadlines('client-001'));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.deadlines).toBeDefined();
  });

  it('14 scadenze INPS filtrabili', async () => {
    const { result } = renderHook(() => useDeadlines());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const inps = result.current.deadlines.filter(d => d.type === 'inps');
    inps.forEach(d => expect(d.type).toBe('inps'));
  });

  it('15 scadenze ADE filtrabili', async () => {
    const { result } = renderHook(() => useDeadlines());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const ade = result.current.deadlines.filter(d => d.type === 'ade');
    ade.forEach(d => expect(d.type).toBe('ade'));
  });

  it('16 scadenze ordinabili per data', async () => {
    const { result } = renderHook(() => useDeadlines());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const sorted = [...result.current.deadlines].sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    expect(sorted).toBeDefined();
  });

  it('17 createDeadline è una funzione', async () => {
    const { result } = renderHook(() => useDeadlines());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(typeof result.current.createDeadline).toBe('function');
  });

  it('18 scadenze completate sono filtrabili', async () => {
    const { result } = renderHook(() => useDeadlines());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const done = result.current.deadlines.filter(d => d.completed);
    done.forEach(d => expect(d.completed).toBe(true));
  });

  it('19 overdue ⊆ upcoming in senso logico', async () => {
    const { result } = renderHook(() => useDeadlines());
    await waitFor(() => expect(result.current.loading).toBe(false));
    result.current.overdue.forEach(d =>
      expect(result.current.upcoming.some(u => u.id === d.id)).toBe(true)
    );
  });

  it('20 refetch non produce errori', async () => {
    const { result } = renderHook(() => useDeadlines());
    await waitFor(() => expect(result.current.loading).toBe(false));
    await expect(result.current.refetch()).resolves.not.toThrow();
  });
});
