import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mockTickets } from '../data/mockData';
import type { Ticket } from '../types';
import toast from 'react-hot-toast';

export function useTickets(clientId?: string) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    if (!isSupabaseConfigured) {
      const filtered = clientId ? mockTickets.filter(t => t.clientId === clientId) : mockTickets;
      setTickets(filtered);
      setLoading(false);
      return;
    }
    let query = supabase.from('tickets').select('*').order('updated_at', { ascending: false });
    if (clientId) query = query.eq('client_id', clientId);
    const { data, error } = await query;
    if (error) setTickets(mockTickets);
    else setTickets((data ?? []) as unknown as Ticket[]);
    setLoading(false);
  }, [clientId]);

  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  const createTicket = async (payload: Partial<Ticket>) => {
    if (!isSupabaseConfigured) { toast.success('Ticket aperto con successo!'); return; }
    const { error } = await supabase.from('tickets').insert([payload as never]);
    if (error) toast.error(error.message);
    else { toast.success('Ticket aperto!'); fetchTickets(); }
  };

  const updateStatus = async (id: string, status: Ticket['status']) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    if (!isSupabaseConfigured) { toast(`Ticket ${status === 'chiuso' ? 'chiuso' : 'aggiornato'}`, { icon: '🎫' }); return; }
    const { error } = await supabase.from('tickets').update({ status }).eq('id', id);
    if (error) { toast.error(error.message); fetchTickets(); }
  };

  const stats = {
    open: tickets.filter(t => t.status === 'aperto').length,
    inProgress: tickets.filter(t => t.status === 'in_lavorazione').length,
    urgent: tickets.filter(t => t.priority === 'urgente' || t.priority === 'alta').length,
    closed: tickets.filter(t => t.status === 'chiuso').length,
  };

  return { tickets, loading, stats, refetch: fetchTickets, createTicket, updateStatus };
}
