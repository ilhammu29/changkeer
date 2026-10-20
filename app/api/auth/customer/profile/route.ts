import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getSupabaseEnv } from '@/lib/supabase/env';
import { CustomerProfile } from '@/types';
import { safeParseCustomerSession } from '@/lib/auth/session-helpers';

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const cookieStore = await cookies();
    
    // 1. Get current session from cookie, header, or body payload
    const sessionCookie = cookieStore.get('changkeer_customer_session')?.value;
    const headerSession = req.headers.get('x-customer-session');
    const bodySession = body.customer_session;

    const currentProfile: CustomerProfile | null =
      safeParseCustomerSession(sessionCookie) ||
      safeParseCustomerSession(headerSession) ||
      safeParseCustomerSession(typeof bodySession === 'string' ? bodySession : JSON.stringify(bodySession));

    if (!currentProfile || !currentProfile.email) {
      return NextResponse.json({ error: 'Customer session not found. Please sign in first.' }, { status: 401 });
    }

    // 2. Prepare updated profile
    const updatedProfile: CustomerProfile & Record<string, any> = {
      ...currentProfile,
      full_name: (body.full_name !== undefined ? body.full_name : currentProfile.full_name)?.trim() || 'Changkeer Patron',
      phone_number: body.phone_number !== undefined ? body.phone_number?.trim() || null : currentProfile.phone_number,
      default_address: body.default_address !== undefined ? body.default_address?.trim() || null : currentProfile.default_address,
      avatar_url: body.avatar_url !== undefined ? body.avatar_url : currentProfile.avatar_url,
      banner_url: body.banner_url !== undefined ? body.banner_url : (currentProfile as any).banner_url,
      bio: body.bio !== undefined ? body.bio?.trim() || null : (currentProfile as any).bio,
      preferred_temperature: body.preferred_temperature || (currentProfile as any).preferred_temperature || 'hot',
      preferred_sweetness: body.preferred_sweetness || (currentProfile as any).preferred_sweetness || '0%',
      updated_at: new Date().toISOString(),
    };

    // 3. Update Supabase if configured and user is authenticated
    const { isConfigured } = getSupabaseEnv();
    if (isConfigured) {
      try {
        const supabase = await createServerSupabaseClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          // Update customer_profiles table
          await supabase
            .from('customer_profiles')
            .update({
              full_name: updatedProfile.full_name,
              phone_number: updatedProfile.phone_number,
              default_address: updatedProfile.default_address,
              avatar_url: updatedProfile.avatar_url,
              updated_at: updatedProfile.updated_at,
            })
            .eq('id', user.id);

          // Update user metadata
          await supabase.auth.updateUser({
            data: {
              full_name: updatedProfile.full_name,
              phone_number: updatedProfile.phone_number,
              avatar_url: updatedProfile.avatar_url,
            },
          });
        }
      } catch (err) {
        console.warn('Supabase profile update warning (non-fatal):', err);
      }
    }

    // 4. Update session cookie
    cookieStore.set('changkeer_customer_session', encodeURIComponent(JSON.stringify(updatedProfile)), {
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return NextResponse.json({
      success: true,
      message: 'Profil berhasil diperbarui',
      profile: updatedProfile,
    });
  } catch (error: any) {
    console.error('Error updating customer profile:', error);
    return NextResponse.json(
      { error: error.message || 'Terjadi kesalahan sistem saat memperbarui profil' },
      { status: 500 }
    );
  }
}
