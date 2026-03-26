import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mockTodos } from '../data/mockData';
import type { TodoItem } from '../types';
import toast from 'react-hot-toast';

export function useTodos() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTodos = useCallback(async () => {
    setLoading(true);
    if (!isSupabaseConfigured) { setTodos(mockTodos); setLoading(false); return; }
    const { data, error } = await supabase
      .from('todo_items')
      .select('*')
      .order('due_date', { ascending: true });
    if (error) setTodos(mockTodos);
    else setTodos((data ?? []) as unknown as TodoItem[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchTodos(); }, [fetchTodos]);

  const toggle = async (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    const completed = !todo.completed;
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed } : t));
    if (!isSupabaseConfigured) return;
    const { error } = await supabase.from('todo_items')
      .update({ completed, completed_at: completed ? new Date().toISOString() : null })
      .eq('id', id);
    if (error) { toast.error(error.message); fetchTodos(); }
  };

  const createTodo = async (payload: Partial<TodoItem>) => {
    if (!isSupabaseConfigured) { toast.success('Todo aggiunto!'); return; }
    const { error } = await supabase.from('todo_items').insert([payload as never]);
    if (error) toast.error(error.message);
    else { toast.success('Todo creato!'); fetchTodos(); }
  };

  const deleteTodo = async (id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
    if (!isSupabaseConfigured) return;
    await supabase.from('todo_items').delete().eq('id', id);
  };

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    alta: todos.filter(t => t.priority === 'alta' && !t.completed).length,
  };

  return { todos, loading, stats, refetch: fetchTodos, toggle, createTodo, deleteTodo };
}
