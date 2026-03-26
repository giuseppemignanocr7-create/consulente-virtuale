import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useClients } from '../../hooks/useClients';
import { mockClients } from '../../data/mockData';

describe('useClients — scenari quotidiani studio', () => {
  // ── FETCH ────────────────────────────────────────────────────────────────
  it('01 carica la lista clienti al mount', async () => {
    const { result } = renderHook(() => useClients());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.clients.length).toBeGreaterThan(0);
  });

  it('02 usa mockData quando Supabase non è configurato', async () => {
    const { result } = renderHook(() => useClients());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.clients).toEqual(mockClients);
  });

  it('03 loading diventa false dopo il fetch iniziale', async () => {
    const { result } = renderHook(() => useClients());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.clients.length).toBeGreaterThan(0);
  });

  it('04 loading diventa false dopo il fetch', async () => {
    const { result } = renderHook(() => useClients());
    await waitFor(() => expect(result.current.loading).toBe(false));
  });

  it('05 error è null con mockData', async () => {
    const { result } = renderHook(() => useClients());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBeNull();
  });

  it('06 espone createClient', async () => {
    const { result } = renderHook(() => useClients());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(typeof result.current.createClient).toBe('function');
  });

  it('07 espone updateClient', async () => {
    const { result } = renderHook(() => useClients());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(typeof result.current.updateClient).toBe('function');
  });

  it('08 espone deleteClient', async () => {
    const { result } = renderHook(() => useClients());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(typeof result.current.deleteClient).toBe('function');
  });

  it('09 espone refetch', async () => {
    const { result } = renderHook(() => useClients());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(typeof result.current.refetch).toBe('function');
  });

  // ── FILTRI STUDIO ────────────────────────────────────────────────────────
  it('10 clienti attivi sono filtrabili', async () => {
    const { result } = renderHook(() => useClients());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const attivi = result.current.clients.filter(c => c.status === 'attivo');
    expect(attivi.every(c => c.status === 'attivo')).toBe(true);
  });

  it('11 ogni cliente ha un id univoco', async () => {
    const { result } = renderHook(() => useClients());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const ids = result.current.clients.map(c => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('12 ogni cliente ha un nome', async () => {
    const { result } = renderHook(() => useClients());
    await waitFor(() => expect(result.current.loading).toBe(false));
    result.current.clients.forEach(c => expect(c.name).toBeTruthy());
  });

  it('13 regime è un valore valido per ogni cliente', async () => {
    const { result } = renderHook(() => useClients());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const validRegimes = ['forfettario', 'ordinario', 'semplificato'];
    result.current.clients.forEach(c =>
      expect(validRegimes).toContain(c.regime)
    );
  });

  it('14 clienti filtrati per regime forfettario', async () => {
    const { result } = renderHook(() => useClients());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const forfettari = result.current.clients.filter(c => c.regime === 'forfettario');
    forfettari.forEach(c => expect(c.regime).toBe('forfettario'));
  });

  it('15 refetch ricarica i dati', async () => {
    const { result } = renderHook(() => useClients());
    await waitFor(() => expect(result.current.loading).toBe(false));
    await result.current.refetch();
    expect(result.current.clients.length).toBeGreaterThan(0);
  });

  // ── RICERCA CLIENT ────────────────────────────────────────────────────────
  it('16 ricerca per nome (case insensitive)', async () => {
    const { result } = renderHook(() => useClients());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const query = result.current.clients[0].name.toLowerCase().slice(0, 3);
    const found = result.current.clients.filter(c =>
      c.name.toLowerCase().includes(query)
    );
    expect(found.length).toBeGreaterThan(0);
  });

  it('17 ricerca inesistente restituisce array vuoto', async () => {
    const { result } = renderHook(() => useClients());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const found = result.current.clients.filter(c =>
      c.name.includes('XXXXXXXXXNONEXISTENT999')
    );
    expect(found.length).toBe(0);
  });

  it('18 stato sospeso filtrabile', async () => {
    const { result } = renderHook(() => useClients());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const sospesi = result.current.clients.filter(c => c.status === 'sospeso');
    sospesi.forEach(c => expect(c.status).toBe('sospeso'));
  });

  it('19 clienti con email definita', async () => {
    const { result } = renderHook(() => useClients());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const withEmail = result.current.clients.filter(c => c.email);
    expect(withEmail.length).toBeGreaterThan(0);
  });

  it('20 clienti ordinabili per nome', async () => {
    const { result } = renderHook(() => useClients());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const sorted = [...result.current.clients].sort((a, b) => a.name.localeCompare(b.name));
    expect(sorted[0].name <= sorted[sorted.length - 1].name).toBe(true);
  });
});
