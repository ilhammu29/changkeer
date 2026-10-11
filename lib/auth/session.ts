import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getSupabaseEnv } from '@/lib/supabase/env';
import { AdminProfile } from '@/types';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function getCurrentAdmin(): Promise<{ user: any; profile: AdminProfile | null } | null> {
  const { isConfigured } = getSupabaseEnv();

  if (!isConfigured) {
    try {
      const cookieStore = await cookies();
      const session = cookieStore.get('changkeer_admin_session')?.value;
      if (session === 'dev_authorized') {
        return {
          user: {
            id: 'dev-admin-01',
            email: 'admin@changkeer.id',
          },
          profile: {
            id: 'dev-admin-01',
            email: 'admin@changkeer.id',
            full_name: 'Administrator CHANGKEER',
            role: 'super_admin',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        };
      }
    } catch {
      // In static build or contexts without cookie access
    }
    return null;
  }

  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return null;
    }

    const { data: profile, error: profileError } = await supabase
      .from('admin_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile || !['admin', 'super_admin'].includes(profile.role)) {
      return null;
    }

    return { user, profile };
  } catch (err) {
    console.error('Error fetching admin session:', err);
    return null;
  }
}

export async function verifyAdminOrUnauthorized(): Promise<NextResponse | null> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json(
      {
        success: false,
        error: 'Akses ditolak. Sesi administrator tidak sah atau telah berakhir.',
      },
      { status: 401 }
    );
  }
  return null;
}
