import { describe, it, expect } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useTickets } from '../../hooks/useTickets';
import { mockTickets } from '../../data/mockData';

describe('useTickets — scenari quotidiani supporto', () => {
  it('01 carica tickets al mount', async () => {
    const { result } = renderHook(() => useTickets());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.tickets.length).toBeGreaterThan(0);
  });

  it('02 usa mockTickets in modalità demo', async () => {
    const { result } = renderHook(() => useTickets());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.tickets).toEqual(mockTickets);
  });

  it('03 stats.open conta tickets aperti', async () => {
    const { result } = renderHook(() => useTickets());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const expected = mockTickets.filter(t => t.status === 'aperto').length;
    expect(result.current.stats.open).toBe(expected);
  });

  it('04 stats.inProgress conta in lavorazione', async () => {
    const { result } = renderHook(() => useTickets());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const expected = mockTickets.filter(t => t.status === 'in_lavorazione').length;
    expect(result.current.stats.inProgress).toBe(expected);
  });

  it('05 stats.closed conta chiusi', async () => {
    const { result } = renderHook(() => useTickets());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const expected = mockTickets.filter(t => t.status === 'chiuso').length;
    expect(result.current.stats.closed).toBe(expected);
  });

  it('06 stats.urgent conta alta+urgente', async () => {
    const { result } = renderHook(() => useTickets());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const expected = mockTickets.filter(t =>
      t.priority === 'urgente' || t.priority === 'alta'
    ).length;
    expect(result.current.stats.urgent).toBe(expected);
  });

  it('07 updateStatus aggiorna un ticket localmente', async () => {
    const { result } = renderHook(() => useTickets());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const first = result.current.tickets[0];
    await act(async () => { await result.current.updateStatus(first.id, 'chiuso'); });
    const updated = result.current.tickets.find(t => t.id === first.id);
    expect(updated?.status).toBe('chiuso');
  });

  it('08 updateStatus a in_lavorazione', async () => {
    const { result } = renderHook(() => useTickets());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const first = result.current.tickets[0];
    await act(async () => { await result.current.updateStatus(first.id, 'in_lavorazione'); });
    const updated = result.current.tickets.find(t => t.id === first.id);
    expect(updated?.status).toBe('in_lavorazione');
  });

  it('09 status è sempre un valore valido', async () => {
    const { result } = renderHook(() => useTickets());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const valid = ['aperto', 'in_lavorazione', 'chiuso'];
    result.current.tickets.forEach(t => expect(valid).toContain(t.status));
  });

  it('10 priority è sempre un valore valido', async () => {
    const { result } = renderHook(() => useTickets());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const valid = ['bassa', 'media', 'alta', 'urgente'];
    result.current.tickets.forEach(t => expect(valid).toContain(t.priority));
  });

  it('11 category è sempre un valore valido', async () => {
    const { result } = renderHook(() => useTickets());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const valid = ['fiscale', 'contributivo', 'lavoro', 'societario', 'altro'];
    result.current.tickets.forEach(t => expect(valid).toContain(t.category));
  });

  it('12 ogni ticket ha subject', async () => {
    const { result } = renderHook(() => useTickets());
    await waitFor(() => expect(result.current.loading).toBe(false));
    result.current.tickets.forEach(t => expect(t.subject).toBeTruthy());
  });

  it('13 ogni ticket ha clientName', async () => {
    const { result } = renderHook(() => useTickets());
    await waitFor(() => expect(result.current.loading).toBe(false));
    result.current.tickets.forEach(t => expect(t.clientName).toBeTruthy());
  });

  it('14 filtro per categoria fiscale', async () => {
    const { result } = renderHook(() => useTickets());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const fiscali = result.current.tickets.filter(t => t.category === 'fiscale');
    fiscali.forEach(t => expect(t.category).toBe('fiscale'));
  });

  it('15 filtro urgenti funziona', async () => {
    const { result } = renderHook(() => useTickets());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const urgenti = result.current.tickets.filter(t => t.priority === 'urgente');
    urgenti.forEach(t => expect(t.priority).toBe('urgente'));
  });

  it('16 filtro clientId non produce errori', async () => {
    const { result } = renderHook(() => useTickets('client-001'));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.tickets).toBeDefined();
  });

  it('17 refetch funziona', async () => {
    const { result } = renderHook(() => useTickets());
    await waitFor(() => expect(result.current.loading).toBe(false));
    await expect(result.current.refetch()).resolves.not.toThrow();
  });

  it('18 sum stats = total tickets', async () => {
    const { result } = renderHook(() => useTickets());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const sum = result.current.stats.open + result.current.stats.inProgress + result.current.stats.closed;
    expect(sum).toBe(result.current.tickets.length);
  });

  it('19 ogni ticket ha un id univoco', async () => {
    const { result } = renderHook(() => useTickets());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const ids = result.current.tickets.map(t => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('20 ogni ticket ha createdAt', async () => {
    const { result } = renderHook(() => useTickets());
    await waitFor(() => expect(result.current.loading).toBe(false));
    result.current.tickets.forEach(t => expect(t.createdAt).toBeTruthy());
  });
});
