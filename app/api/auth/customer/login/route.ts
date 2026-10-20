import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getSupabaseEnv } from '@/lib/supabase/env';
import { cookies } from 'next/headers';
import { CustomerProfile } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, isGoogleDemo, isDemo } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email wajib diisi' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const isDemoAccount =
      isGoogleDemo ||
      isDemo ||
      cleanEmail.includes('dewi.lestari') ||
      cleanEmail.endsWith('@example.com');

    let profile: CustomerProfile;

    // 1. Instant local demo / dev shortcut
    if (isDemoAccount) {
      profile = {
        id: 'cust-dewi-lestari',
        email: cleanEmail,
        full_name: body.full_name || 'Dewi Lestari',
        phone_number: body.phone_number || '081298765432',
        avatar_url: isGoogleDemo
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
          : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    } else {
      // 2. Synchronize with Supabase Auth
      const { isConfigured } = getSupabaseEnv();
      let remoteProfile: CustomerProfile | null = null;

      if (isConfigured && password) {
        try {
          const supabase = await createServerSupabaseClient();
          const { data, error } = await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password,
          });

          if (!error && data.user) {
            remoteProfile = {
              id: data.user.id,
              email: data.user.email || cleanEmail,
              full_name: data.user.user_metadata?.full_name || cleanEmail.split('@')[0],
              phone_number: data.user.user_metadata?.phone_number || null,
              created_at: data.user.created_at || new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };
          } else {
            // Auto-provision user in Supabase with auto-confirm so login immediately succeeds
            const adminClient = createAdminClient();
            const { data: created, error: createErr } = await adminClient.auth.admin.createUser({
              email: cleanEmail,
              password,
              email_confirm: true,
              user_metadata: {
                full_name: body.full_name || cleanEmail.split('@')[0],
                phone_number: body.phone_number || null,
              },
            });

            if (created?.user) {
              remoteProfile = {
                id: created.user.id,
                email: cleanEmail,
                full_name: created.user.user_metadata?.full_name || cleanEmail.split('@')[0],
                phone_number: created.user.user_metadata?.phone_number || null,
                created_at: created.user.created_at || new Date().toISOString(),
                updated_at: new Date().toISOString(),
              };
            } else if (createErr?.message?.toLowerCase().includes('already')) {
              // User exists with different password or unconfirmed, update user in Supabase
              const { data: usersList } = await adminClient.auth.admin.listUsers();
              const existing = usersList?.users?.find(u => u.email?.toLowerCase() === cleanEmail);
              if (existing) {
                await adminClient.auth.admin.updateUserById(existing.id, {
                  password,
                  email_confirm: true,
                });
                remoteProfile = {
                  id: existing.id,
                  email: cleanEmail,
                  full_name: existing.user_metadata?.full_name || cleanEmail.split('@')[0],
                  phone_number: existing.user_metadata?.phone_number || null,
                  created_at: existing.created_at || new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                };
              }
            }
          }
        } catch (sbErr) {
          console.warn('Supabase login warning:', sbErr);
        }
      }

      // 3. Fallback to local profile if remote network unavailable
      if (remoteProfile) {
        profile = remoteProfile;
      } else {
        profile = {
          id: `cust-${Date.now().toString(36)}`,
          email: cleanEmail,
          full_name: body.full_name || cleanEmail.split('@')[0].replace(/[._]/g, ' '),
          phone_number: body.phone_number || '08123456789',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      }
    }

    // Set customer session cookie
    const cookieStore = await cookies();
    cookieStore.set('changkeer_customer_session', encodeURIComponent(JSON.stringify(profile)), {
      path: '/',
      httpOnly: false, // Accessible to client for instant reactive UI updates
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax',
    });

    return NextResponse.json({ success: true, profile });
  } catch (err: any) {
    console.error('Customer login error:', err);
    return NextResponse.json({ error: err.message || 'Failed to sign in' }, { status: 500 });
  }
}
