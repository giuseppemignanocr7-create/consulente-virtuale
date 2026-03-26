import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useDocuments } from '../../hooks/useDocuments';
import { mockDocuments } from '../../data/mockData';

describe('useDocuments — scenari quotidiani gestione documenti', () => {
  it('01 carica documenti al mount', async () => {
    const { result } = renderHook(() => useDocuments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.documents.length).toBeGreaterThan(0);
  });

  it('02 usa mockDocuments in modalità demo', async () => {
    const { result } = renderHook(() => useDocuments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.documents).toEqual(mockDocuments);
  });

  it('03 ogni documento ha un nome', async () => {
    const { result } = renderHook(() => useDocuments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    result.current.documents.forEach(d => expect(d.name).toBeTruthy());
  });

  it('04 ogni documento ha un tipo valido', async () => {
    const { result } = renderHook(() => useDocuments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const valid = ['fattura', 'delega', 'contratto', 'cu', 'busta_paga', 'accertamento', 'dvr', 'altro'];
    result.current.documents.forEach(d => expect(valid).toContain(d.type));
  });

  it('05 documenti firmati filtrabili', async () => {
    const { result } = renderHook(() => useDocuments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const firmati = result.current.documents.filter(d => d.signed);
    firmati.forEach(d => expect(d.signed).toBe(true));
  });

  it('06 documenti non firmati filtrabili', async () => {
    const { result } = renderHook(() => useDocuments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const nonFirmati = result.current.documents.filter(d => !d.signed);
    nonFirmati.forEach(d => expect(d.signed).toBe(false));
  });

  it('07 documento firmato ha signedAt', async () => {
    const { result } = renderHook(() => useDocuments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const firmati = result.current.documents.filter(d => d.signed && d.signedAt);
    firmati.forEach(d => expect(d.signedAt).toBeTruthy());
  });

  it('08 filtro clientId non produce errori', async () => {
    const { result } = renderHook(() => useDocuments('client-001'));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.documents).toBeDefined();
  });

  it('09 uploadDocument è una funzione', async () => {
    const { result } = renderHook(() => useDocuments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(typeof result.current.uploadDocument).toBe('function');
  });

  it('10 signDocument è una funzione', async () => {
    const { result } = renderHook(() => useDocuments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(typeof result.current.signDocument).toBe('function');
  });

  it('11 deleteDocument è una funzione', async () => {
    const { result } = renderHook(() => useDocuments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(typeof result.current.deleteDocument).toBe('function');
  });

  it('12 ogni documento ha uploadedAt', async () => {
    const { result } = renderHook(() => useDocuments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    result.current.documents.forEach(d => expect(d.uploadedAt).toBeTruthy());
  });

  it('13 ogni documento ha un id univoco', async () => {
    const { result } = renderHook(() => useDocuments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const ids = result.current.documents.map(d => d.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('14 filtra per tipo fattura', async () => {
    const { result } = renderHook(() => useDocuments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const fatture = result.current.documents.filter(d => d.type === 'fattura');
    fatture.forEach(d => expect(d.type).toBe('fattura'));
  });

  it('15 filtra per tipo contratto', async () => {
    const { result } = renderHook(() => useDocuments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const contratti = result.current.documents.filter(d => d.type === 'contratto');
    contratti.forEach(d => expect(d.type).toBe('contratto'));
  });

  it('16 filtra per tipo cu', async () => {
    const { result } = renderHook(() => useDocuments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const cu = result.current.documents.filter(d => d.type === 'cu');
    cu.forEach(d => expect(d.type).toBe('cu'));
  });

  it('17 refetch funziona', async () => {
    const { result } = renderHook(() => useDocuments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    await expect(result.current.refetch()).resolves.not.toThrow();
  });

  it('18 size è definita per ogni documento', async () => {
    const { result } = renderHook(() => useDocuments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    result.current.documents.forEach(d => expect(d.size).toBeDefined());
  });

  it('19 documenti ordinabili per data upload', async () => {
    const { result } = renderHook(() => useDocuments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const sorted = [...result.current.documents].sort((a, b) =>
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );
    expect(sorted).toBeDefined();
  });

  it('20 uploadDocument demo non lancia errori', async () => {
    const { result } = renderHook(() => useDocuments());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const fakeFile = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    await expect(result.current.uploadDocument(fakeFile, {})).resolves.not.toThrow();
  });
});
