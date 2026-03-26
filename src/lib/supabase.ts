import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl    = import.meta.env.VITE_SUPABASE_URL      ?? '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// ── Type helpers ────────────────────────────────────────────────────────────
type Tables = Database['public']['Tables'];
export type DbRow<T extends keyof Tables>    = Tables[T]['Row'];
export type DbInsert<T extends keyof Tables> = Tables[T]['Insert'];
export type DbUpdate<T extends keyof Tables> = Tables[T]['Update'];

// ── Safe query runner: returns data or null, never throws ────────────────────
export async function runQuery<T>(
  fn: () => Promise<{ data: T | null; error: { message: string } | null }>
): Promise<{ data: T | null; error: string | null }> {
  try {
    const { data, error } = await fn();
    return { data: data ?? null, error: error?.message ?? null };
  } catch (e) {
    return { data: null, error: e instanceof Error ? e.message : 'Errore sconosciuto' };
  }
}
