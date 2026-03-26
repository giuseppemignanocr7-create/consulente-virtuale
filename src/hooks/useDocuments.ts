import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mockDocuments } from '../data/mockData';
import type { Document } from '../types';
import toast from 'react-hot-toast';

export function useDocuments(clientId?: string) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    if (!isSupabaseConfigured) {
      const filtered = clientId ? mockDocuments.filter(d => d.clientId === clientId) : mockDocuments;
      setDocuments(filtered);
      setLoading(false);
      return;
    }
    let query = supabase.from('documents').select('*').order('uploaded_at', { ascending: false });
    if (clientId) query = query.eq('client_id', clientId);
    const { data, error } = await query;
    if (error) setDocuments(mockDocuments);
    else setDocuments((data ?? []) as unknown as Document[]);
    setLoading(false);
  }, [clientId]);

  useEffect(() => { fetchDocuments(); }, [fetchDocuments]);

  const uploadDocument = async (file: File, metadata: Partial<Document>) => {
    if (!isSupabaseConfigured) {
      toast.success(`"${file.name}" caricato (demo)`);
      return;
    }
    const path = `documents/${Date.now()}_${file.name}`;
    const { error: uploadErr } = await supabase.storage.from('documents').upload(path, file);
    if (uploadErr) { toast.error(uploadErr.message); return; }
    const { data: urlData } = supabase.storage.from('documents').getPublicUrl(path);
    const { error } = await supabase.from('documents').insert([{
      ...metadata,
      name: file.name,
      size_kb: Math.round(file.size / 1024),
      storage_path: path,
      public_url: urlData.publicUrl,
      uploaded_at: new Date().toISOString(),
    } as never]);
    if (error) toast.error(error.message);
    else { toast.success('Documento caricato!'); fetchDocuments(); }
  };

  const signDocument = async (id: string) => {
    if (!isSupabaseConfigured) { toast.success('Documento inviato per firma digitale (demo)'); return; }
    const { error } = await supabase.from('documents').update({
      signed: true,
      signed_at: new Date().toISOString(),
      signature_id: `SIG-${Date.now()}`,
    } as never).eq('id', id);
    if (error) toast.error(error.message);
    else { toast.success('Documento firmato digitalmente!'); fetchDocuments(); }
  };

  const deleteDocument = async (id: string) => {
    if (!isSupabaseConfigured) { toast('Documento eliminato (demo)', { icon: '🗑️' }); return; }
    const { error } = await supabase.from('documents').delete().eq('id', id);
    if (error) toast.error(error.message);
    else { toast.success('Documento eliminato'); fetchDocuments(); }
  };

  return { documents, loading, refetch: fetchDocuments, uploadDocument, signDocument, deleteDocument };
}
