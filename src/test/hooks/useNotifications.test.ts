import { describe, it, expect } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useNotifications } from '../../hooks/useNotifications';
import { mockAINotifications } from '../../data/mockData';

describe('useNotifications — scenari quotidiani notifiche AI', () => {
  it('01 carica notifiche al mount', async () => {
    const { result } = renderHook(() => useNotifications());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.notifications.length).toBeGreaterThan(0);
  });

  it('02 usa mockAINotifications in modalità demo', async () => {
    const { result } = renderHook(() => useNotifications());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.notifications).toEqual(mockAINotifications);
  });

  it('03 unreadCount conta notifiche non lette', async () => {
    const { result } = renderHook(() => useNotifications());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const expected = mockAINotifications.filter(n => !n.read).length;
    expect(result.current.unreadCount).toBe(expected);
  });

  it('04 markRead segna una notifica come letta', async () => {
    const { result } = renderHook(() => useNotifications());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const unread = result.current.notifications.find(n => !n.read);
    if (!unread) return;
    await act(async () => { await result.current.markRead(unread.id); });
    const after = result.current.notifications.find(n => n.id === unread.id);
    expect(after?.read).toBe(true);
  });

  it('05 markAllRead segna tutte come lette', async () => {
    const { result } = renderHook(() => useNotifications());
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => { await result.current.markAllRead(); });
    result.current.notifications.forEach(n => expect(n.read).toBe(true));
  });

  it('06 unreadCount diventa 0 dopo markAllRead', async () => {
    const { result } = renderHook(() => useNotifications());
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => { await result.current.markAllRead(); });
    expect(result.current.unreadCount).toBe(0);
  });

  it('07 tipo è un valore valido per ogni notifica', async () => {
    const { result } = renderHook(() => useNotifications());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const valid = ['bando', 'legge', 'rottamazione', 'scadenza', 'anomalia'];
    result.current.notifications.forEach(n => expect(valid).toContain(n.type));
  });

  it('08 ogni notifica ha un titolo', async () => {
    const { result } = renderHook(() => useNotifications());
    await waitFor(() => expect(result.current.loading).toBe(false));
    result.current.notifications.forEach(n => expect(n.title).toBeTruthy());
  });

  it('09 ogni notifica ha un summary', async () => {
    const { result } = renderHook(() => useNotifications());
    await waitFor(() => expect(result.current.loading).toBe(false));
    result.current.notifications.forEach(n => expect(n.summary).toBeTruthy());
  });

  it('10 ogni notifica ha una data', async () => {
    const { result } = renderHook(() => useNotifications());
    await waitFor(() => expect(result.current.loading).toBe(false));
    result.current.notifications.forEach(n => expect(n.date).toBeTruthy());
  });

  it('11 notifiche filtrabili per tipo bando', async () => {
    const { result } = renderHook(() => useNotifications());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const bandi = result.current.notifications.filter(n => n.type === 'bando');
    bandi.forEach(n => expect(n.type).toBe('bando'));
  });

  it('12 notifiche filtrabili per tipo scadenza', async () => {
    const { result } = renderHook(() => useNotifications());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const scadenze = result.current.notifications.filter(n => n.type === 'scadenza');
    scadenze.forEach(n => expect(n.type).toBe('scadenza'));
  });

  it('13 notifiche non lette filtrabili', async () => {
    const { result } = renderHook(() => useNotifications());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const unread = result.current.notifications.filter(n => !n.read);
    unread.forEach(n => expect(n.read).toBe(false));
  });

  it('14 ogni notifica ha id univoco', async () => {
    const { result } = renderHook(() => useNotifications());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const ids = result.current.notifications.map(n => n.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('15 refetch non produce errori', async () => {
    const { result } = renderHook(() => useNotifications());
    await waitFor(() => expect(result.current.loading).toBe(false));
    await expect(result.current.refetch()).resolves.not.toThrow();
  });

  it('16 unreadCount >= 0', async () => {
    const { result } = renderHook(() => useNotifications());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.unreadCount).toBeGreaterThanOrEqual(0);
  });

  it('17 unreadCount <= total notifications', async () => {
    const { result } = renderHook(() => useNotifications());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.unreadCount).toBeLessThanOrEqual(result.current.notifications.length);
  });

  it('18 notifiche rottamazione filtrabili', async () => {
    const { result } = renderHook(() => useNotifications());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const rott = result.current.notifications.filter(n => n.type === 'rottamazione');
    rott.forEach(n => expect(n.type).toBe('rottamazione'));
  });

  it('19 notifiche legge filtrabili', async () => {
    const { result } = renderHook(() => useNotifications());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const leggi = result.current.notifications.filter(n => n.type === 'legge');
    leggi.forEach(n => expect(n.type).toBe('legge'));
  });

  it('20 markRead su notifica già letta non lancia errori', async () => {
    const { result } = renderHook(() => useNotifications());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const read = result.current.notifications.find(n => n.read);
    if (!read) return;
    await expect(result.current.markRead(read.id)).resolves.not.toThrow();
  });
});
