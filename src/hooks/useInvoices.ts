import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { DbInsert, DbUpdate } from '../lib/supabase';
import { mockInvoices } from '../data/mockData';
import type { Invoice } from '../types';
import toast from 'react-hot-toast';

export function useInvoices(clientId?: string) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    setError(null);
    if (!isSupabaseConfigured) {
      const filtered = clientId ? mockInvoices.filter(i => i.id.startsWith(clientId.slice(0, 4))) : mockInvoices;
      setInvoices(filtered);
      setLoading(false);
      return;
    }
    let query = supabase.from('invoices').select('*').order('date', { ascending: false });
    if (clientId) query = query.eq('client_id', clientId);
    const { data, error: err } = await query;
    if (err) { setError(err.message); setInvoices(mockInvoices); }
    else setInvoices((data ?? []) as unknown as Invoice[]);
    setLoading(false);
  }, [clientId]);

  useEffect(() => { fetchInvoices(); }, [fetchInvoices]);

  const createInvoice = async (payload: DbInsert<'invoices'>) => {
    if (!isSupabaseConfigured) { toast('Demo: fattura creata (solo mock)', { icon: '📄' }); return; }
    const { error: err } = await supabase.from('invoices').insert([payload]);
    if (err) toast.error(err.message);
    else { toast.success('Fattura creata!'); fetchInvoices(); }
  };

  const updateInvoice = async (id: string, payload: DbUpdate<'invoices'>) => {
    if (!isSupabaseConfigured) { toast('Demo: aggiornamento simulato', { icon: '✏️' }); return; }
    const { error: err } = await supabase.from('invoices').update(payload).eq('id', id);
    if (err) toast.error(err.message);
    else { toast.success('Fattura aggiornata!'); fetchInvoices(); }
  };

  const stats = {
    total: invoices.reduce((s, i) => s + i.total, 0),
    paid: invoices.filter(i => i.status === 'accettata').reduce((s, i) => s + i.total, 0),
    pending: invoices.filter(i => ['inviata', 'consegnata'].includes(i.status)).reduce((s, i) => s + i.total, 0),
    count: invoices.length,
  };

  return { invoices, loading, error, stats, refetch: fetchInvoices, createInvoice, updateInvoice };
}
