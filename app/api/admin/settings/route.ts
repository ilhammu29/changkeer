import { NextRequest, NextResponse } from 'next/server';
import { siteSettingsSchema, getFirstErrorMessage } from '@/lib/validation/schemas';
import { createAdminClient } from '@/lib/supabase/admin';
import { getSupabaseEnv } from '@/lib/supabase/env';
import { SEED_SITE_SETTINGS } from '@/lib/data/mock-seed';
import { revalidatePath } from 'next/cache';
import { verifyAdminOrUnauthorized } from '@/lib/auth/session';

export async function GET() {
  const unauth = await verifyAdminOrUnauthorized();
  if (unauth) return unauth;

  const { isConfigured } = getSupabaseEnv();

  if (!isConfigured) {
    return NextResponse.json({ success: true, settings: SEED_SITE_SETTINGS });
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('key', 'general')
      .single();

    if (error || !data) {
      return NextResponse.json({ success: true, settings: SEED_SITE_SETTINGS });
    }
    return NextResponse.json({ success: true, settings: data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const unauth = await verifyAdminOrUnauthorized();
  if (unauth) return unauth;

  try {
    const body = await req.json();
    const validation = siteSettingsSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: getFirstErrorMessage(validation.error) },
        { status: 400 }
      );
    }

    const { isConfigured } = getSupabaseEnv();
    const settingsData = validation.data;

    if (!isConfigured) {
      Object.assign(SEED_SITE_SETTINGS, {
        ...settingsData,
        updated_at: new Date().toISOString(),
      });
      return NextResponse.json({ success: true, settings: SEED_SITE_SETTINGS });
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('site_settings')
      .upsert(
        {
          key: 'general',
          site_name: settingsData.site_name,
          tagline: settingsData.tagline,
          contact_email: settingsData.contact_email,
          contact_phone: settingsData.contact_phone,
          social_instagram: settingsData.social_instagram,
          contact_address: settingsData.contact_address,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'key' }
      )
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    revalidatePath('/');
    revalidatePath('/hubungi-kami');

    return NextResponse.json({ success: true, settings: data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
