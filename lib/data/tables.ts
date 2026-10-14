import { createPublicSupabaseClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getSupabaseEnv } from '@/lib/supabase/env';
import { SEED_CAFE_TABLES } from './mock-seed';
import { CafeTable } from '@/types';

let memoryTables: CafeTable[] = [...SEED_CAFE_TABLES];

export async function getCafeTables(): Promise<CafeTable[]> {
  const { isConfigured } = getSupabaseEnv();

  if (!isConfigured) {
    return memoryTables.filter(t => t.is_active);
  }

  try {
    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase
      .from('cafe_tables')
      .select('*')
      .eq('is_active', true)
      .order('table_number', { ascending: true });

    if (error || !data) {
      console.warn('Fallback to local memory tables:', error?.message);
      return memoryTables.filter(t => t.is_active);
    }
    return data as CafeTable[];
  } catch (err) {
    console.error('Failed to get cafe tables:', err);
    return memoryTables.filter(t => t.is_active);
  }
}

export async function getAllCafeTablesAdmin(): Promise<CafeTable[]> {
  const { isConfigured } = getSupabaseEnv();

  if (!isConfigured) {
    return memoryTables;
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('cafe_tables')
      .select('*')
      .order('table_number', { ascending: true });

    if (error || !data) {
      return memoryTables;
    }
    return data as CafeTable[];
  } catch (err) {
    console.error('Failed to get cafe tables admin:', err);
    return memoryTables;
  }
}

export async function createCafeTable(data: { table_number: string; capacity?: number; description?: string }): Promise<CafeTable> {
  const newTable: CafeTable = {
    id: `tab-${Date.now().toString(36)}`,
    table_number: data.table_number.trim(),
    capacity: data.capacity || 2,
    description: data.description || '',
    is_active: true,
    created_at: new Date().toISOString(),
  };

  const { isConfigured } = getSupabaseEnv();
  if (!isConfigured) {
    memoryTables.push(newTable);
    return newTable;
  }

  try {
    const supabase = createAdminClient();
    const { data: inserted, error } = await supabase
      .from('cafe_tables')
      .insert(newTable)
      .select()
      .single();

    if (error || !inserted) {
      memoryTables.push(newTable);
      return newTable;
    }
    return inserted as CafeTable;
  } catch (err) {
    console.error('Error creating cafe table:', err);
    memoryTables.push(newTable);
    return newTable;
  }
}

export async function updateCafeTable(id: string, updates: Partial<CafeTable>): Promise<CafeTable | null> {
  const idx = memoryTables.findIndex(t => t.id === id);
  if (idx !== -1) {
    memoryTables[idx] = { ...memoryTables[idx], ...updates };
  }

  const { isConfigured } = getSupabaseEnv();
  if (!isConfigured) {
    return memoryTables[idx] || null;
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('cafe_tables')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      return memoryTables[idx] || null;
    }
    return data as CafeTable;
  } catch (err) {
    console.error('Error updating cafe table:', err);
    return memoryTables[idx] || null;
  }
}

export async function deleteCafeTable(id: string): Promise<boolean> {
  memoryTables = memoryTables.filter(t => t.id !== id);

  const { isConfigured } = getSupabaseEnv();
  if (!isConfigured) return true;

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from('cafe_tables').delete().eq('id', id);
    return !error;
  } catch (err) {
    console.error('Error deleting table:', err);
    return true;
  }
}
