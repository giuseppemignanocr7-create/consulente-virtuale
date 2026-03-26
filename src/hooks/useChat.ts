import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mockChatHistory } from '../data/mockData';
import toast from 'react-hot-toast';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'studio' | 'client';
  text: string;
  timestamp: string;
  isAI?: boolean;
}

export function useChat(clientId?: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    if (!isSupabaseConfigured) {
      setMessages(mockChatHistory as ChatMessage[]);
      setLoading(false);
      return;
    }
    let query = supabase
      .from('chat_messages')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(100);
    if (clientId) query = query.eq('client_id', clientId);
    const { data, error } = await query;
    if (error) setMessages(mockChatHistory as ChatMessage[]);
    else setMessages((data ?? []).map((m: Record<string, unknown>) => ({
      id: m.id as string,
      sender: m.sender_role as ChatMessage['sender'],
      text: m.text as string,
      timestamp: new Date(m.created_at as string).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }),
      isAI: m.is_ai as boolean,
    })));
    setLoading(false);
  }, [clientId]);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  const sendMessage = async (text: string, role: ChatMessage['sender'] = 'studio') => {
    if (!text.trim()) return;
    setSending(true);
    const tempMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      sender: role,
      text,
      timestamp: new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, tempMsg]);
    if (!isSupabaseConfigured) { setSending(false); return; }
    const { error } = await supabase.from('chat_messages').insert([{
      client_id: clientId ?? null,
      studio_id: null,
      sender_id: null,
      sender_name: null,
      sender_role: (role === 'user' ? 'client' : role) as 'client' | 'studio' | 'ai',
      text,
      is_ai: role === 'ai',
      read_at: null,
    }]);
    if (error) toast.error(error.message);
    else fetchMessages();
    setSending(false);
  };

  const enableRealtime = (onNew: (msg: ChatMessage) => void) => {
    if (!isSupabaseConfigured) return () => {};
    const channel = supabase
      .channel('chat_messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, payload => {
        const m = payload.new as Record<string, unknown>;
        onNew({
          id: m.id as string,
          sender: m.sender_role as ChatMessage['sender'],
          text: m.text as string,
          timestamp: new Date(m.created_at as string).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }),
          isAI: m.is_ai as boolean,
        });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  };

  return { messages, loading, sending, refetch: fetchMessages, sendMessage, enableRealtime };
}
