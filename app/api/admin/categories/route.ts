import { NextRequest, NextResponse } from 'next/server';
import { categorySchema, getFirstErrorMessage } from '@/lib/validation/schemas';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getSupabaseEnv } from '@/lib/supabase/env';
import { SEED_CATEGORIES } from '@/lib/data/mock-seed';
import { Category } from '@/types';
import { revalidatePath } from 'next/cache';

export async function GET() {
  const { isConfigured } = getSupabaseEnv();

  if (!isConfigured) {
    return NextResponse.json({ success: true, categories: SEED_CATEGORIES });
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.from('categories').select('*').order('name');
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true, categories: data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = categorySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: getFirstErrorMessage(validation.error) },
        { status: 400 }
      );
    }

    const { isConfigured } = getSupabaseEnv();
    const catData = validation.data;

    if (!isConfigured) {
      const newCat: Category = {
        id: `cat-${Date.now()}`,
        name: catData.name,
        slug: catData.slug,
        description: catData.description || null,
        type: catData.type,
        created_at: new Date().toISOString(),
      };
      SEED_CATEGORIES.push(newCat);
      return NextResponse.json({ success: true, category: newCat });
    }

    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('categories')
      .insert(catData)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    revalidatePath('/katalog');
    revalidatePath('/media-berita');

    return NextResponse.json({ success: true, category: data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID kategori diperlukan' }, { status: 400 });
    }

    const { isConfigured } = getSupabaseEnv();

    if (!isConfigured) {
      const idx = SEED_CATEGORIES.findIndex((c) => c.id === id);
      if (idx !== -1) {
        SEED_CATEGORIES.splice(idx, 1);
      }
      return NextResponse.json({ success: true });
    }

    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from('categories').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    revalidatePath('/katalog');
    revalidatePath('/media-berita');

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
