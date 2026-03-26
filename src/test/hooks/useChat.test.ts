import { describe, it, expect } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useChat } from '../../hooks/useChat';
import { mockChatHistory } from '../../data/mockData';

describe('useChat — scenari quotidiani messaggistica', () => {
  it('01 carica messaggi al mount', async () => {
    const { result } = renderHook(() => useChat());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.messages.length).toBeGreaterThan(0);
  });

  it('02 usa mockChatHistory in modalità demo', async () => {
    const { result } = renderHook(() => useChat());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.messages.length).toBe(mockChatHistory.length);
  });

  it('03 sending è false al mount', async () => {
    const { result } = renderHook(() => useChat());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.sending).toBe(false);
  });

  it('04 sendMessage aggiunge messaggio localmente', async () => {
    const { result } = renderHook(() => useChat());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const before = result.current.messages.length;
    await act(async () => { await result.current.sendMessage('Ciao, ho bisogno di aiuto'); });
    expect(result.current.messages.length).toBe(before + 1);
  });

  it('05 sendMessage con testo vuoto non aggiunge messaggi', async () => {
    const { result } = renderHook(() => useChat());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const before = result.current.messages.length;
    await act(async () => { await result.current.sendMessage(''); });
    expect(result.current.messages.length).toBe(before);
  });

  it('06 sendMessage con solo spazi non aggiunge messaggi', async () => {
    const { result } = renderHook(() => useChat());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const before = result.current.messages.length;
    await act(async () => { await result.current.sendMessage('   '); });
    expect(result.current.messages.length).toBe(before);
  });

  it('07 messaggio inviato ha testo corretto', async () => {
    const { result } = renderHook(() => useChat());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const text = 'Test messaggio specifico';
    await act(async () => { await result.current.sendMessage(text); });
    const last = result.current.messages[result.current.messages.length - 1];
    expect(last.text).toBe(text);
  });

  it('08 messaggio inviato ha timestamp', async () => {
    const { result } = renderHook(() => useChat());
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => { await result.current.sendMessage('Test'); });
    const last = result.current.messages[result.current.messages.length - 1];
    expect(last.timestamp).toBeTruthy();
  });

  it('09 sender è studio di default', async () => {
    const { result } = renderHook(() => useChat());
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => { await result.current.sendMessage('Messaggio studio'); });
    const last = result.current.messages[result.current.messages.length - 1];
    expect(last.sender).toBe('studio');
  });

  it('10 sender può essere client', async () => {
    const { result } = renderHook(() => useChat());
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => { await result.current.sendMessage('Messaggio cliente', 'client'); });
    const last = result.current.messages[result.current.messages.length - 1];
    expect(last.sender).toBe('client');
  });

  it('11 sender può essere ai', async () => {
    const { result } = renderHook(() => useChat());
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => { await result.current.sendMessage('Risposta AI', 'ai'); });
    const last = result.current.messages[result.current.messages.length - 1];
    expect(last.sender).toBe('ai');
  });

  it('12 filtro clientId non produce errori', async () => {
    const { result } = renderHook(() => useChat('client-001'));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.messages).toBeDefined();
  });

  it('13 enableRealtime restituisce una funzione cleanup', async () => {
    const { result } = renderHook(() => useChat());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const cleanup = result.current.enableRealtime(() => {});
    expect(typeof cleanup).toBe('function');
  });

  it('14 ogni messaggio ha un id', async () => {
    const { result } = renderHook(() => useChat());
    await waitFor(() => expect(result.current.loading).toBe(false));
    result.current.messages.forEach(m => expect(m.id).toBeTruthy());
  });

  it('15 ogni messaggio ha un sender valido', async () => {
    const { result } = renderHook(() => useChat());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const valid = ['user', 'ai', 'studio', 'client'];
    result.current.messages.forEach(m => expect(valid).toContain(m.sender));
  });

  it('16 refetch non produce errori', async () => {
    const { result } = renderHook(() => useChat());
    await waitFor(() => expect(result.current.loading).toBe(false));
    await expect(result.current.refetch()).resolves.not.toThrow();
  });

  it('17 invio multipli messaggi in sequenza', async () => {
    const { result } = renderHook(() => useChat());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const before = result.current.messages.length;
    await act(async () => {
      await result.current.sendMessage('Primo messaggio');
      await result.current.sendMessage('Secondo messaggio');
    });
    expect(result.current.messages.length).toBe(before + 2);
  });

  it('18 messaggio AI non è isAI per sender studio', async () => {
    const { result } = renderHook(() => useChat());
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => { await result.current.sendMessage('Studio msg', 'studio'); });
    const last = result.current.messages[result.current.messages.length - 1];
    expect(last.isAI).toBeFalsy();
  });

  it('19 sendMessage con clientId nel contesto', async () => {
    const { result } = renderHook(() => useChat('client-999'));
    await waitFor(() => expect(result.current.loading).toBe(false));
    const before = result.current.messages.length;
    await act(async () => { await result.current.sendMessage('Ciao', 'client'); });
    expect(result.current.messages.length).toBe(before + 1);
  });

  it('20 storia messaggi è un array', async () => {
    const { result } = renderHook(() => useChat());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(Array.isArray(result.current.messages)).toBe(true);
  });
});
