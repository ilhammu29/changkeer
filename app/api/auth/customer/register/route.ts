import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getSupabaseEnv } from '@/lib/supabase/env';
import { cookies } from 'next/headers';
import { CustomerProfile } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, full_name, phone_number } = body;

    if (!email || !full_name) {
      return NextResponse.json({ error: 'Nama lengkap dan email wajib diisi' }, { status: 400 });
    }

    if (password && password.length < 6) {
      return NextResponse.json({ error: 'Kata sandi minimal 6 karakter' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = full_name.trim();

    let profile: CustomerProfile = {
      id: `cust-${Date.now().toString(36)}`,
      email: cleanEmail,
      full_name: cleanName,
      phone_number: phone_number ? phone_number.trim() : null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { isConfigured } = getSupabaseEnv();

    // Synchronize user to Supabase Auth with auto-confirmed status
    if (isConfigured && password) {
      try {
        const adminClient = createAdminClient();
        const { data: created, error: createErr } = await adminClient.auth.admin.createUser({
          email: cleanEmail,
          password,
          email_confirm: true,
          user_metadata: {
            full_name: cleanName,
            phone_number: phone_number ? phone_number.trim() : null,
          },
        });

        if (created?.user) {
          profile.id = created.user.id;
        } else if (createErr?.message?.toLowerCase().includes('already')) {
          // If already registered, update password so they can login immediately
          const { data: usersList } = await adminClient.auth.admin.listUsers();
          const existing = usersList?.users?.find(u => u.email?.toLowerCase() === cleanEmail);
          if (existing) {
            profile.id = existing.id;
            await adminClient.auth.admin.updateUserById(existing.id, {
              password,
              user_metadata: {
                full_name: cleanName,
                phone_number: phone_number ? phone_number.trim() : null,
              },
            });
          }
        }
      } catch (sbErr) {
        console.warn('Supabase register sync warning:', sbErr);
      }
    }

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set('changkeer_customer_session', encodeURIComponent(JSON.stringify(profile)), {
      path: '/',
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
    });

    return NextResponse.json({ success: true, profile }, { status: 201 });
  } catch (err: any) {
    console.error('Customer register error:', err);
    return NextResponse.json({ error: err.message || 'Gagal membuat akun' }, { status: 500 });
  }
}
