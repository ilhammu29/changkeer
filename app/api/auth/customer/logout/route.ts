import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getSupabaseEnv } from '@/lib/supabase/env';

export async function POST() {
  try {
    const { isConfigured } = getSupabaseEnv();
    if (isConfigured) {
      try {
        const supabase = await createServerSupabaseClient();
        await supabase.auth.signOut();
      } catch {
        // Ignore
      }
    }

    const cookieStore = await cookies();
    cookieStore.delete('changkeer_customer_session');

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
