import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { DbInsert } from '../lib/supabase';
import { mockDVRDocuments } from '../data/mockData';
import toast from 'react-hot-toast';

export function useDVR(clientId?: string) {
  const [dvrs, setDvrs] = useState<typeof mockDVRDocuments>([]);
  const [loading, setLoading] = useState(true);

  const fetchDVRs = useCallback(async () => {
    setLoading(true);
    if (!isSupabaseConfigured) {
      const filtered = clientId ? mockDVRDocuments.filter(d => d.clientId === clientId) : mockDVRDocuments;
      setDvrs(filtered);
      setLoading(false);
      return;
    }
    let query = supabase.from('dvr_documents').select('*').order('created_at', { ascending: false });
    if (clientId) query = query.eq('client_id', clientId);
    const { data, error } = await query;
    if (error) setDvrs(mockDVRDocuments);
    else setDvrs((data ?? []) as unknown as typeof mockDVRDocuments);
    setLoading(false);
  }, [clientId]);

  useEffect(() => { fetchDVRs(); }, [fetchDVRs]);

  const createDVR = async (payload: DbInsert<'dvr_documents'>) => {
    if (!isSupabaseConfigured) { toast.success('DVR generato (demo)'); return; }
    const { error } = await supabase.from('dvr_documents').insert([payload]);
    if (error) toast.error(error.message);
    else { toast.success('DVR creato!'); fetchDVRs(); }
  };

  const updateStatus = async (id: string, status: 'bozza' | 'completato' | 'firmato' | 'scaduto') => {
    setDvrs(prev => prev.map(d => d.id === id ? { ...d, status } : d));
    if (!isSupabaseConfigured) { toast(`DVR ${status}`, { icon: '📋' }); return; }
    const { error } = await supabase.from('dvr_documents').update({ status }).eq('id', id);
    if (error) { toast.error(error.message); fetchDVRs(); }
  };

  const stats = {
    total: dvrs.length,
    firmati: dvrs.filter(d => d.status === 'firmato').length,
    inScadenza: dvrs.filter(d => d.status === 'completato').length,
    bozze: dvrs.filter(d => d.status === 'bozza').length,
  };

  return { dvrs, loading, stats, refetch: fetchDVRs, createDVR, updateStatus };
}
