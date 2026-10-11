import { createPublicSupabaseClient } from '@/lib/supabase/server';
import { getSupabaseEnv } from '@/lib/supabase/env';
import { SEED_SITE_SETTINGS } from './mock-seed';
import { SiteSettings } from '@/types';

export async function getSiteSettings(): Promise<SiteSettings> {
  const { isConfigured } = getSupabaseEnv();

  if (!isConfigured) {
    return SEED_SITE_SETTINGS;
  }

  try {
    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('key', 'general')
      .single();

    if (error || !data) {
      return SEED_SITE_SETTINGS;
    }
    return data as SiteSettings;
  } catch (err) {
    console.error('Failed to get site settings:', err);
    return SEED_SITE_SETTINGS;
  }
}
