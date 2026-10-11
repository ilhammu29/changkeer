import { NextRequest, NextResponse } from 'next/server';
import { siteSettingsSchema, getFirstErrorMessage } from '@/lib/validation/schemas';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getSupabaseEnv } from '@/lib/supabase/env';
import { SEED_SITE_SETTINGS } from '@/lib/data/mock-seed';
import { revalidatePath } from 'next/cache';

export async function GET() {
  const { isConfigured } = getSupabaseEnv();

  if (!isConfigured) {
    return NextResponse.json({ success: true, settings: SEED_SITE_SETTINGS });
  }

  try {
    const supabase = await createServerSupabaseClient();
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

    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('site_settings')
      .upsert(
        {
          key: 'general',
          ...settingsData,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'key' }
      )
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    revalidatePath('/', 'layout');

    return NextResponse.json({ success: true, settings: data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
