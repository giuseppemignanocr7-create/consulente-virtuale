import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { DbInsert, DbUpdate } from '../lib/supabase';
import { mockClients } from '../data/mockData';
import type { Client } from '../types';
import toast from 'react-hot-toast';

export function useClients(clientId?: string) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    setError(null);
    if (!isSupabaseConfigured) {
      setClients(mockClients);
      setLoading(false);
      return;
    }
    let query = supabase.from('clients').select('*').order('name');
    if (clientId) query = query.eq('id', clientId) as typeof query;
    const { data, error: err } = await query;
    if (err) { setError(err.message); setClients(mockClients); }
    else setClients((data ?? []) as unknown as Client[]);
    setLoading(false);
  }, [clientId]);

  useEffect(() => { fetchClients(); }, [fetchClients]);

  const createClient = async (payload: DbInsert<'clients'>) => {
    if (!isSupabaseConfigured) { toast('Demo: cliente aggiunto (solo mock)', { icon: '👤' }); return; }
    const { error: err } = await supabase.from('clients').insert([payload]);
    if (err) toast.error(err.message);
    else { toast.success('Cliente creato!'); fetchClients(); }
  };

  const updateClient = async (id: string, payload: DbUpdate<'clients'>) => {
    if (!isSupabaseConfigured) { toast('Demo: aggiornamento simulato', { icon: '✏️' }); return; }
    const { error: err } = await supabase.from('clients').update(payload).eq('id', id);
    if (err) toast.error(err.message);
    else { toast.success('Cliente aggiornato!'); fetchClients(); }
  };

  const deleteClient = async (id: string) => {
    if (!isSupabaseConfigured) { toast('Demo: eliminazione simulata', { icon: '🗑️' }); return; }
    const { error: err } = await supabase.from('clients').delete().eq('id', id);
    if (err) toast.error(err.message);
    else { toast.success('Cliente eliminato'); fetchClients(); }
  };

  return { clients, loading, error, refetch: fetchClients, createClient, updateClient, deleteClient };
}
