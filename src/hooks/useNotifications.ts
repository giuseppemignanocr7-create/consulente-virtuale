import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mockAINotifications as mockNotifications } from '../data/mockData';
import type { AINotification } from '../types';

export function useNotifications() {
  const [notifications, setNotifications] = useState<AINotification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    if (!isSupabaseConfigured) { setNotifications(mockNotifications); setLoading(false); return; }
    const { data, error } = await supabase
      .from('ai_notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);
    if (error) setNotifications(mockNotifications);
    else setNotifications((data ?? []) as unknown as AINotification[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  const markRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    if (!isSupabaseConfigured) return;
    await supabase.from('ai_notifications').update({ read: true, read_at: new Date().toISOString() } as never).eq('id', id);
  };

  const markAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    if (!isSupabaseConfigured) return;
    await supabase.from('ai_notifications').update({ read: true, read_at: new Date().toISOString() } as never).eq('read', false);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return { notifications, loading, unreadCount, markRead, markAllRead, refetch: fetchNotifications };
}
