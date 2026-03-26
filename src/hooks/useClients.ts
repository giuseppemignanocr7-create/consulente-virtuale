import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mockClients } from '../data/mockData';
import type { Client } from '../types';
import toast from 'react-hot-toast';

export function useClients() {
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
    const { data, error: err } = await supabase
      .from('clients')
      .select('*')
      .order('name');
    if (err) { setError(err.message); setClients(mockClients); }
    else setClients((data ?? []) as unknown as Client[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchClients(); }, [fetchClients]);

  const createClient = async (payload: Partial<Client>) => {
    if (!isSupabaseConfigured) { toast('Demo: cliente aggiunto (solo mock)', { icon: '👤' }); return; }
    const { error: err } = await supabase.from('clients').insert([payload as never]);
    if (err) toast.error(err.message);
    else { toast.success('Cliente creato!'); fetchClients(); }
  };

  const updateClient = async (id: string, payload: Partial<Client>) => {
    if (!isSupabaseConfigured) { toast('Demo: aggiornamento simulato', { icon: '✏️' }); return; }
    const { error: err } = await supabase.from('clients').update(payload as never).eq('id', id);
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
