import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mockDeadlines } from '../data/mockData';
import type { Deadline } from '../types';
import toast from 'react-hot-toast';

export function useDeadlines(clientId?: string) {
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDeadlines = useCallback(async () => {
    setLoading(true);
    if (!isSupabaseConfigured) {
      const filtered = clientId ? mockDeadlines.filter(d => d.clientId === clientId) : mockDeadlines;
      setDeadlines(filtered);
      setLoading(false);
      return;
    }
    let query = supabase.from('deadlines').select('*').order('due_date');
    if (clientId) query = query.eq('client_id', clientId);
    const { data, error } = await query;
    if (error) setDeadlines(mockDeadlines);
    else setDeadlines((data ?? []) as unknown as Deadline[]);
    setLoading(false);
  }, [clientId]);

  useEffect(() => { fetchDeadlines(); }, [fetchDeadlines]);

  const toggleComplete = async (id: string) => {
    const deadline = deadlines.find(d => d.id === id);
    if (!deadline) return;
    const newCompleted = !deadline.completed;
    setDeadlines(prev => prev.map(d => d.id === id ? { ...d, completed: newCompleted } : d));
    if (!isSupabaseConfigured) {
      toast(newCompleted ? 'Scadenza completata' : 'Scadenza riaperta', { icon: newCompleted ? '✅' : '↩️' });
      return;
    }
    const { error } = await supabase.from('deadlines').update({ completed: newCompleted, completed_at: newCompleted ? new Date().toISOString() : null } as never).eq('id', id);
    if (error) { toast.error(error.message); fetchDeadlines(); }
    else toast(newCompleted ? 'Scadenza completata!' : 'Scadenza riaperta', { icon: newCompleted ? '✅' : '↩️' });
  };

  const createDeadline = async (payload: Partial<Deadline>) => {
    if (!isSupabaseConfigured) { toast('Demo: scadenza aggiunta (mock)', { icon: '📅' }); return; }
    const { error } = await supabase.from('deadlines').insert([payload as never]);
    if (error) toast.error(error.message);
    else { toast.success('Scadenza creata!'); fetchDeadlines(); }
  };

  const upcoming = deadlines.filter(d => !d.completed && d.urgency !== 'normale');
  const overdue = deadlines.filter(d => !d.completed && d.urgency === 'scaduta');

  return { deadlines, loading, upcoming, overdue, refetch: fetchDeadlines, toggleComplete, createDeadline };
}
