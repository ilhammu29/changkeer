import { createPublicSupabaseClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getSupabaseEnv } from '@/lib/supabase/env';
import { SEED_ARTICLES } from './mock-seed';
import { Article } from '@/types';

export async function getPublishedArticles(categorySlug?: string): Promise<Article[]> {
  const { isConfigured } = getSupabaseEnv();

  if (!isConfigured) {
    if (categorySlug) {
      return SEED_ARTICLES.filter(a => a.status === 'published' && a.category?.slug === categorySlug);
    }
    return SEED_ARTICLES.filter(a => a.status === 'published');
  }

  try {
    const supabase = createPublicSupabaseClient();
    let query = supabase
      .from('articles')
      .select('*, category:categories(*)')
      .eq('status', 'published')
      .order('is_featured', { ascending: false })
      .order('published_at', { ascending: false });

    if (categorySlug) {
      const { data: cat } = await supabase.from('categories').select('id').eq('slug', categorySlug).single();
      if (cat) {
        query = query.eq('category_id', cat.id);
      }
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching articles:', error);
      return SEED_ARTICLES;
    }
    return (data as Article[]) || [];
  } catch (err) {
    console.error('Failed to get articles:', err);
    return SEED_ARTICLES;
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const { isConfigured } = getSupabaseEnv();

  if (!isConfigured) {
    return SEED_ARTICLES.find(a => a.slug === slug) || null;
  }

  try {
    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase
      .from('articles')
      .select('*, category:categories(*)')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      return SEED_ARTICLES.find(a => a.slug === slug) || null;
    }
    return data as Article;
  } catch (err) {
    console.error('Failed to get article by slug:', err);
    return SEED_ARTICLES.find(a => a.slug === slug) || null;
  }
}

export async function getAllArticlesAdmin(): Promise<Article[]> {
  const { isConfigured } = getSupabaseEnv();

  if (!isConfigured) {
    return SEED_ARTICLES;
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('articles')
      .select('*, category:categories(*)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching admin articles:', error);
      return SEED_ARTICLES;
    }
    return (data as Article[]) || [];
  } catch (err) {
    console.error('Failed to get admin articles:', err);
    return SEED_ARTICLES;
  }
}
