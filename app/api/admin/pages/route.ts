import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getSupabaseEnv } from '@/lib/supabase/env';
import { SEED_PAGES } from '@/lib/data/mock-seed';
import { revalidatePath } from 'next/cache';
import { verifyAdminOrUnauthorized } from '@/lib/auth/session';

export async function GET(req: NextRequest) {
  const unauth = await verifyAdminOrUnauthorized();
  if (unauth) return unauth;

  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');
  const { isConfigured } = getSupabaseEnv();

  if (!isConfigured) {
    if (slug) {
      return NextResponse.json({ success: true, page: SEED_PAGES[slug] || null });
    }
    return NextResponse.json({ success: true, pages: Object.values(SEED_PAGES) });
  }

  try {
    const supabase = await createServerSupabaseClient();
    if (slug) {
      const { data, error } = await supabase.from('pages').select('*').eq('slug', slug).single();
      if (error) {
        return NextResponse.json({ success: true, page: SEED_PAGES[slug] || null });
      }
      return NextResponse.json({ success: true, page: data });
    }

    const { data, error } = await supabase.from('pages').select('*');
    if (error) {
      return NextResponse.json({ success: true, pages: Object.values(SEED_PAGES) });
    }
    return NextResponse.json({ success: true, pages: data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const unauth = await verifyAdminOrUnauthorized();
  if (unauth) return unauth;

  try {
    const body = await req.json();
    const { slug, sections, seo_title, seo_description } = body;

    if (!slug) {
      return NextResponse.json({ success: false, error: 'Slug halaman diperlukan' }, { status: 400 });
    }

    const { isConfigured } = getSupabaseEnv();

    if (!isConfigured) {
      if (SEED_PAGES[slug]) {
        SEED_PAGES[slug] = {
          ...SEED_PAGES[slug],
          sections: sections || SEED_PAGES[slug].sections,
          seo_title: seo_title || SEED_PAGES[slug].seo_title,
          seo_description: seo_description || SEED_PAGES[slug].seo_description,
          updated_at: new Date().toISOString(),
        };
      }
      return NextResponse.json({ success: true, page: SEED_PAGES[slug] });
    }

    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('pages')
      .upsert(
        {
          slug,
          sections,
          seo_title,
          seo_description,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'slug' }
      )
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    revalidatePath('/');
    revalidatePath(`/${slug}`);

    return NextResponse.json({ success: true, page: data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
