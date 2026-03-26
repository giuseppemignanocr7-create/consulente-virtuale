import { describe, it, expect } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useTodos } from '../../hooks/useTodos';
import { mockTodos } from '../../data/mockData';

describe('useTodos — scenari quotidiani todo studio', () => {
  it('01 carica todos al mount', async () => {
    const { result } = renderHook(() => useTodos());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.todos.length).toBeGreaterThan(0);
  });

  it('02 usa mockTodos in modalità demo', async () => {
    const { result } = renderHook(() => useTodos());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.todos).toEqual(mockTodos);
  });

  it('03 stats.total corrisponde al numero di todos', async () => {
    const { result } = renderHook(() => useTodos());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.stats.total).toBe(mockTodos.length);
  });

  it('04 stats.completed conta completati', async () => {
    const { result } = renderHook(() => useTodos());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const expected = mockTodos.filter(t => t.completed).length;
    expect(result.current.stats.completed).toBe(expected);
  });

  it('05 stats.alta conta alta priorità non completati', async () => {
    const { result } = renderHook(() => useTodos());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const expected = mockTodos.filter(t => t.priority === 'alta' && !t.completed).length;
    expect(result.current.stats.alta).toBe(expected);
  });

  it('06 toggle inverte completed su un todo', async () => {
    const { result } = renderHook(() => useTodos());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const first = result.current.todos[0];
    const before = first.completed;
    await act(async () => { await result.current.toggle(first.id); });
    const after = result.current.todos.find(t => t.id === first.id);
    expect(after?.completed).toBe(!before);
  });

  it('07 toggle doppio ripristina stato originale', async () => {
    const { result } = renderHook(() => useTodos());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const first = result.current.todos[0];
    const before = first.completed;
    await act(async () => { await result.current.toggle(first.id); });
    await act(async () => { await result.current.toggle(first.id); });
    const after = result.current.todos.find(t => t.id === first.id);
    expect(after?.completed).toBe(before);
  });

  it('08 deleteTodo rimuove un todo dalla lista', async () => {
    const { result } = renderHook(() => useTodos());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const first = result.current.todos[0];
    const before = result.current.todos.length;
    await act(async () => { await result.current.deleteTodo(first.id); });
    expect(result.current.todos.length).toBe(before - 1);
  });

  it('09 priority è un valore valido per ogni todo', async () => {
    const { result } = renderHook(() => useTodos());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const valid = ['bassa', 'media', 'alta'];
    result.current.todos.forEach(t => expect(valid).toContain(t.priority));
  });

  it('10 ogni todo ha un titolo', async () => {
    const { result } = renderHook(() => useTodos());
    await waitFor(() => expect(result.current.loading).toBe(false));
    result.current.todos.forEach(t => expect(t.title).toBeTruthy());
  });

  it('11 filtro todos bassa priorità', async () => {
    const { result } = renderHook(() => useTodos());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const bassa = result.current.todos.filter(t => t.priority === 'bassa');
    bassa.forEach(t => expect(t.priority).toBe('bassa'));
  });

  it('12 filtro todos non completati', async () => {
    const { result } = renderHook(() => useTodos());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const pending = result.current.todos.filter(t => !t.completed);
    pending.forEach(t => expect(t.completed).toBe(false));
  });

  it('13 todos con scadenza filtrabili', async () => {
    const { result } = renderHook(() => useTodos());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const withDate = result.current.todos.filter(t => t.dueDate);
    expect(Array.isArray(withDate)).toBe(true);
  });

  it('14 id è univoco per ogni todo', async () => {
    const { result } = renderHook(() => useTodos());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const ids = result.current.todos.map(t => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('15 createTodo demo non lancia errori', async () => {
    const { result } = renderHook(() => useTodos());
    await waitFor(() => expect(result.current.loading).toBe(false));
    await expect(
      result.current.createTodo({ title: 'Test', completed: false, studio_id: null, client_id: null, client_name: null, description: null, due_date: null, priority: 'media' })
    ).resolves.not.toThrow();
  });

  it('16 stats non contiene NaN', async () => {
    const { result } = renderHook(() => useTodos());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(isNaN(result.current.stats.total)).toBe(false);
    expect(isNaN(result.current.stats.completed)).toBe(false);
    expect(isNaN(result.current.stats.alta)).toBe(false);
  });

  it('17 stats.completed <= stats.total', async () => {
    const { result } = renderHook(() => useTodos());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.stats.completed).toBeLessThanOrEqual(result.current.stats.total);
  });

  it('18 todos con clientId filtrabili', async () => {
    const { result } = renderHook(() => useTodos());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const withClient = result.current.todos.filter(t => t.clientId);
    expect(Array.isArray(withClient)).toBe(true);
  });

  it('19 refetch non produce errori', async () => {
    const { result } = renderHook(() => useTodos());
    await waitFor(() => expect(result.current.loading).toBe(false));
    await expect(result.current.refetch()).resolves.not.toThrow();
  });

  it('20 todos ordinabili per priorità', async () => {
    const { result } = renderHook(() => useTodos());
    await waitFor(() => expect(result.current.loading).toBe(false));
    const order: Record<string, number> = { alta: 0, media: 1, bassa: 2 };
    const sorted = [...result.current.todos].sort(
      (a, b) => order[a.priority] - order[b.priority]
    );
    expect(sorted[0].priority).toBe('alta');
  });
});
