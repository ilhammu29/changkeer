import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getSupabaseEnv } from '@/lib/supabase/env';
import { cookies } from 'next/headers';

export async function POST() {
  const { isConfigured } = getSupabaseEnv();

  const cookieStore = await cookies();
  cookieStore.delete('changkeer_admin_session');

  if (isConfigured) {
    try {
      const supabase = await createServerSupabaseClient();
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
  }

  return NextResponse.json({ success: true });
}
