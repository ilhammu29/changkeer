import { cookies } from 'next/headers';
import { CustomerProfile } from '@/types';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getSupabaseEnv } from '@/lib/supabase/env';

import { safeParseCustomerSession } from './session-helpers';

export async function getCurrentCustomer(): Promise<CustomerProfile | null> {
  const { isConfigured } = getSupabaseEnv();

  // Check customer session cookie
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('changkeer_customer_session')?.value;
    const parsed = safeParseCustomerSession(sessionCookie);
    if (parsed && parsed.email) {
      return parsed;
    }
  } catch {
    // Cookie store unavailable
  }

  if (!isConfigured) {
    return null;
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: profile } = await supabase
      .from('customer_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profile) return profile as CustomerProfile;

    return {
      id: user.id,
      email: user.email || '',
      full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Pelanggan Changkeer',
      phone_number: user.user_metadata?.phone_number || null,
      default_address: null,
      avatar_url: user.user_metadata?.avatar_url || null,
      created_at: user.created_at,
      updated_at: user.created_at,
    };
  } catch (err) {
    console.error('Error getting customer session:', err);
    return null;
  }
}
