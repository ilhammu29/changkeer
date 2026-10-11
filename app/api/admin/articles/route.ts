import { NextRequest, NextResponse } from 'next/server';
import { articleSchema, getFirstErrorMessage } from '@/lib/validation/schemas';
import { createAdminClient } from '@/lib/supabase/admin';
import { getSupabaseEnv } from '@/lib/supabase/env';
import { SEED_ARTICLES } from '@/lib/data/mock-seed';
import { Article } from '@/types';
import { revalidatePath } from 'next/cache';
import { verifyAdminOrUnauthorized } from '@/lib/auth/session';

export async function GET() {
  const unauth = await verifyAdminOrUnauthorized();
  if (unauth) return unauth;

  const { isConfigured } = getSupabaseEnv();

  if (!isConfigured) {
    return NextResponse.json({ success: true, articles: SEED_ARTICLES });
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('articles')
      .select('*, category:categories(*)')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true, articles: data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const unauth = await verifyAdminOrUnauthorized();
    if (unauth) return unauth;

    const body = await req.json();
    const validation = articleSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: getFirstErrorMessage(validation.error) },
        { status: 400 }
      );
    }

    const { isConfigured } = getSupabaseEnv();
    const articleData = validation.data;

    if (!isConfigured) {
      const newArticle: Article = {
        ...articleData,
        id: `art-${Date.now()}`,
        excerpt: articleData.excerpt || null,
        category_id: articleData.category_id || null,
        category: null,
        featured_image: articleData.featured_image || null,
        seo_title: articleData.seo_title || null,
        seo_description: articleData.seo_description || null,
        published_at: articleData.status === 'published' ? new Date().toISOString() : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      SEED_ARTICLES.unshift(newArticle);
      return NextResponse.json({ success: true, article: newArticle });
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('articles')
      .insert({
        ...articleData,
        published_at: articleData.status === 'published' ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    revalidatePath('/');
    revalidatePath('/media-berita');

    return NextResponse.json({ success: true, article: data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const unauth = await verifyAdminOrUnauthorized();
    if (unauth) return unauth;

    const body = await req.json();
    const { id, ...dataToValidate } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID artikel wajib ada' }, { status: 400 });
    }

    const validation = articleSchema.safeParse(dataToValidate);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: getFirstErrorMessage(validation.error) },
        { status: 400 }
      );
    }

    const { isConfigured } = getSupabaseEnv();
    const articleData = validation.data;

    if (!isConfigured) {
      const idx = SEED_ARTICLES.findIndex((a) => a.id === id);
      if (idx !== -1) {
        SEED_ARTICLES[idx] = {
          ...SEED_ARTICLES[idx],
          ...articleData,
          updated_at: new Date().toISOString(),
        };
        return NextResponse.json({ success: true, article: SEED_ARTICLES[idx] });
      }
      return NextResponse.json({ success: false, error: 'Artikel tidak ditemukan' }, { status: 404 });
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('articles')
      .update({
        ...articleData,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    revalidatePath('/');
    revalidatePath('/media-berita');
    revalidatePath(`/media-berita/${articleData.slug}`);

    return NextResponse.json({ success: true, article: data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const unauth = await verifyAdminOrUnauthorized();
    if (unauth) return unauth;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID artikel diperlukan' }, { status: 400 });
    }

    const { isConfigured } = getSupabaseEnv();

    if (!isConfigured) {
      const idx = SEED_ARTICLES.findIndex((a) => a.id === id);
      if (idx !== -1) {
        SEED_ARTICLES.splice(idx, 1);
      }
      return NextResponse.json({ success: true });
    }

    const supabase = createAdminClient();
    const { error } = await supabase.from('articles').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    revalidatePath('/');
    revalidatePath('/media-berita');

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
