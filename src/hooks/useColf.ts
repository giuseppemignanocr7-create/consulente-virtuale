import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { DbInsert, DbUpdate } from '../lib/supabase';
import { mockColfWorkers } from '../data/mockData';
import toast from 'react-hot-toast';

export function useColf(clientId?: string) {
  const [workers, setWorkers] = useState<typeof mockColfWorkers>([]);
  const [loading, setLoading] = useState(true);

  const fetchWorkers = useCallback(async () => {
    setLoading(true);
    if (!isSupabaseConfigured) {
      const filtered = clientId ? mockColfWorkers.filter(w => w.clientId === clientId) : mockColfWorkers;
      setWorkers(filtered);
      setLoading(false);
      return;
    }
    let query = supabase.from('colf_workers').select('*, colf_payslips(*)').order('full_name');
    if (clientId) query = query.eq('client_id', clientId);
    const { data, error } = await query;
    if (error) setWorkers(mockColfWorkers);
    else setWorkers((data ?? []) as unknown as typeof mockColfWorkers);
    setLoading(false);
  }, [clientId]);

  useEffect(() => { fetchWorkers(); }, [fetchWorkers]);

  const createWorker = async (payload: DbInsert<'colf_workers'>) => {
    if (!isSupabaseConfigured) { toast.success('Lavoratore registrato (demo)'); return; }
    const { error } = await supabase.from('colf_workers').insert([payload]);
    if (error) toast.error(error.message);
    else { toast.success('Lavoratore creato!'); fetchWorkers(); }
  };

  const updateWorker = async (id: string, payload: DbUpdate<'colf_workers'>) => {
    if (!isSupabaseConfigured) { toast.success('Lavoratore aggiornato (demo)'); return; }
    const { error } = await supabase.from('colf_workers').update(payload).eq('id', id);
    if (error) toast.error(error.message);
    else { toast.success('Aggiornato!'); fetchWorkers(); }
  };

  const generatePayslip = async (workerId: string, month: string, year: number, data: Partial<DbInsert<'colf_payslips'>>) => {
    if (!isSupabaseConfigured) { toast.success(`Busta paga ${month}/${year} generata (demo)`, { icon: '💰' }); return; }
    const { error } = await supabase.from('colf_payslips').insert([{ worker_id: workerId, month, year, ...data } as DbInsert<'colf_payslips'>]);
    if (error) toast.error(error.message);
    else toast.success(`Busta paga ${month}/${year} generata!`);
  };

  const terminateWorker = async (id: string) => {
    if (!isSupabaseConfigured) { toast('Cessazione registrata (demo)', { icon: '📝' }); return; }
    const { error } = await supabase.from('colf_workers').update({
      status: 'cessato',
      end_date: new Date().toISOString().split('T')[0],
    }).eq('id', id);
    if (error) toast.error(error.message);
    else { toast.success('Cessazione registrata'); fetchWorkers(); }
  };

  const stats = {
    total: workers.length,
    attivi: workers.filter(w => w.status === 'attivo').length,
    totalCost: workers.filter(w => w.status === 'attivo').reduce((s, w) => s + (w.grossSalary ?? 0), 0),
  };

  return { workers, loading, stats, refetch: fetchWorkers, createWorker, updateWorker, generatePayslip, terminateWorker };
}
