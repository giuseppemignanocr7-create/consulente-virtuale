import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mockAssessments } from '../data/mockData';
import type { TaxAssessment } from '../types';
import toast from 'react-hot-toast';

export function useAssessments(clientId?: string) {
  const [assessments, setAssessments] = useState<TaxAssessment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAssessments = useCallback(async () => {
    setLoading(true);
    if (!isSupabaseConfigured) {
      const filtered = clientId ? mockAssessments.filter(a => a.clientName?.includes('')) : mockAssessments;
      setAssessments(filtered);
      setLoading(false);
      return;
    }
    let query = supabase.from('tax_assessments').select('*').order('notification_date', { ascending: false });
    if (clientId) query = query.eq('client_id', clientId);
    const { data, error } = await query;
    if (error) setAssessments(mockAssessments);
    else setAssessments((data ?? []) as unknown as TaxAssessment[]);
    setLoading(false);
  }, [clientId]);

  useEffect(() => { fetchAssessments(); }, [fetchAssessments]);

  const updateStatus = async (id: string, status: TaxAssessment['status']) => {
    setAssessments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    if (!isSupabaseConfigured) { toast.success('Stato accertamento aggiornato'); return; }
    const { error } = await supabase.from('tax_assessments').update({ status }).eq('id', id);
    if (error) { toast.error(error.message); fetchAssessments(); }
    else toast.success('Stato aggiornato');
  };

  const createAssessment = async (payload: Partial<TaxAssessment>) => {
    if (!isSupabaseConfigured) { toast.success('Accertamento caricato (demo)'); return; }
    const { error } = await supabase.from('tax_assessments').insert([payload as never]);
    if (error) toast.error(error.message);
    else { toast.success('Accertamento creato!'); fetchAssessments(); }
  };

  const stats = {
    total: assessments.length,
    totalAmount: assessments.reduce((s, a) => s + (a.amount ?? 0), 0),
    active: assessments.filter(a => !['concluso'].includes(a.status)).length,
    urgent: assessments.filter(a => ['caricato', 'documenti_richiesti'].includes(a.status)).length,
  };

  return { assessments, loading, stats, refetch: fetchAssessments, updateStatus, createAssessment };
}
