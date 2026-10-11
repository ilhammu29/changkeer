import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getSupabaseEnv } from '@/lib/supabase/env';
import { AdminProfile } from '@/types';

export async function getCurrentAdmin(): Promise<{ user: any; profile: AdminProfile | null } | null> {
  const { isConfigured } = getSupabaseEnv();

  if (!isConfigured) {
    // When Supabase is not yet configured with remote credentials,
    // we return null to enforce security guard until credentials are provided.
    return null;
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return null;
    }

    const { data: profile, error: profileError } = await supabase
      .from('admin_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return null;
    }

    return { user, profile };
  } catch (err) {
    console.error('Error fetching admin session:', err);
    return null;
  }
}
