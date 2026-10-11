import { NextRequest, NextResponse } from 'next/server';
import { adminLoginSchema, getFirstErrorMessage } from '@/lib/validation/schemas';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getSupabaseEnv } from '@/lib/supabase/env';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = adminLoginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: getFirstErrorMessage(result.error) },
        { status: 400 }
      );
    }

    const { email, password } = result.data;
    const { isConfigured } = getSupabaseEnv();

    if (!isConfigured) {
      // Local dev mode fallback: allows local administrative access & testing
      if (email.toLowerCase().includes('admin') || password.length >= 6) {
        const cookieStore = await cookies();
        cookieStore.set('changkeer_admin_session', 'dev_authorized', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24, // 1 day
        });

        return NextResponse.json({
          success: true,
          message: 'Login berhasil dalam mode pengembang lokal.',
        });
      }

      return NextResponse.json(
        { success: false, error: 'Kredensial tidak valid.' },
        { status: 401 }
      );
    }

    // Remote Supabase Auth mode
    const supabase = await createServerSupabaseClient();
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      return NextResponse.json(
        { success: false, error: 'Email atau kata sandi tidak cocok.' },
        { status: 401 }
      );
    }

    // Verify admin role in admin_profiles using adminClient (bypasses RLS recursion)
    const { serviceKey } = getSupabaseEnv();
    const clientForProfile = serviceKey ? createAdminClient() : supabase;
    const { data: profile, error: profileError } = await clientForProfile
      .from('admin_profiles')
      .select('id, role')
      .eq('id', authData.user.id)
      .single();

    if (profileError || !profile || !['admin', 'super_admin'].includes(profile.role)) {
      // User is authenticated in Auth, but is NOT an authorized admin in admin_profiles
      await supabase.auth.signOut();
      return NextResponse.json(
        { success: false, error: 'Akun Anda tidak memiliki hak akses administrator.' },
        { status: 403 }
      );
    }

    const cookieStore = await cookies();
    cookieStore.set('changkeer_admin_session', 'dev_authorized', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
    });

    return NextResponse.json({
      success: true,
      user: { id: authData.user.id, email: authData.user.email, role: profile.role },
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan sistem saat autentikasi.' },
      { status: 500 }
    );
  }
}
