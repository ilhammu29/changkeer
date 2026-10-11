import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getSupabaseEnv } from '@/lib/supabase/env';
import { SEED_PRODUCTS } from './mock-seed';
import { Product } from '@/types';

export async function getPublishedProducts(categorySlug?: string): Promise<Product[]> {
  const { isConfigured } = getSupabaseEnv();

  if (!isConfigured) {
    if (categorySlug) {
      return SEED_PRODUCTS.filter(p => p.status === 'published' && p.category?.slug === categorySlug);
    }
    return SEED_PRODUCTS.filter(p => p.status === 'published');
  }

  try {
    const supabase = await createServerSupabaseClient();
    let query = supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('status', 'published')
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false });

    if (categorySlug) {
      // Find category first
      const { data: cat } = await supabase.from('categories').select('id').eq('slug', categorySlug).single();
      if (cat) {
        query = query.eq('category_id', cat.id);
      }
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching published products:', error);
      return SEED_PRODUCTS;
    }
    return (data as Product[]) || [];
  } catch (err) {
    console.error('Failed to get products:', err);
    return SEED_PRODUCTS;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { isConfigured } = getSupabaseEnv();

  if (!isConfigured) {
    const found = SEED_PRODUCTS.find(p => p.slug === slug);
    return found || null;
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      // Fallback
      const found = SEED_PRODUCTS.find(p => p.slug === slug);
      return found || null;
    }
    return data as Product;
  } catch (err) {
    console.error('Failed to get product by slug:', err);
    return SEED_PRODUCTS.find(p => p.slug === slug) || null;
  }
}

export async function getAllProductsAdmin(): Promise<Product[]> {
  const { isConfigured } = getSupabaseEnv();

  if (!isConfigured) {
    return SEED_PRODUCTS;
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(*)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching admin products:', error);
      return SEED_PRODUCTS;
    }
    return (data as Product[]) || [];
  } catch (err) {
    console.error('Failed to get admin products:', err);
    return SEED_PRODUCTS;
  }
}
