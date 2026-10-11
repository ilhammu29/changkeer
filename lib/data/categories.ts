import { createPublicSupabaseClient } from '@/lib/supabase/server';
import { getSupabaseEnv } from '@/lib/supabase/env';
import { SEED_CATEGORIES } from './mock-seed';
import { Category, CategoryType } from '@/types';

export async function getCategories(type?: CategoryType): Promise<Category[]> {
  const { isConfigured } = getSupabaseEnv();

  if (!isConfigured) {
    if (type) {
      return SEED_CATEGORIES.filter(c => c.type === type);
    }
    return SEED_CATEGORIES;
  }

  try {
    const supabase = createPublicSupabaseClient();
    let query = supabase.from('categories').select('*').order('name');
    if (type) {
      query = query.eq('type', type);
    }
    const { data, error } = await query;
    if (error) {
      console.error('Error fetching categories:', error);
      return type ? SEED_CATEGORIES.filter(c => c.type === type) : SEED_CATEGORIES;
    }
    return (data as Category[]) || [];
  } catch (err) {
    console.error('Failed to get categories:', err);
    return type ? SEED_CATEGORIES.filter(c => c.type === type) : SEED_CATEGORIES;
  }
}
