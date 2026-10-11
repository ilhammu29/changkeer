import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getSupabaseEnv } from '@/lib/supabase/env';
import { SEED_PAGES } from './mock-seed';
import { PageContent } from '@/types';

export async function getPageContent(slug: string): Promise<PageContent | null> {
  const { isConfigured } = getSupabaseEnv();

  if (!isConfigured) {
    return SEED_PAGES[slug] || null;
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      return SEED_PAGES[slug] || null;
    }
    return data as PageContent;
  } catch (err) {
    console.error(`Failed to get page content for ${slug}:`, err);
    return SEED_PAGES[slug] || null;
  }
}
