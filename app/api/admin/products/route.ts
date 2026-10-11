import { NextRequest, NextResponse } from 'next/server';
import { productSchema, getFirstErrorMessage } from '@/lib/validation/schemas';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getSupabaseEnv } from '@/lib/supabase/env';
import { SEED_PRODUCTS } from '@/lib/data/mock-seed';
import { Product } from '@/types';
import { revalidatePath } from 'next/cache';

export async function GET() {
  const { isConfigured } = getSupabaseEnv();

  if (!isConfigured) {
    return NextResponse.json({ success: true, products: SEED_PRODUCTS });
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(*)')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, products: data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = productSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: getFirstErrorMessage(validation.error) },
        { status: 400 }
      );
    }

    const { isConfigured } = getSupabaseEnv();
    const productData = validation.data;

    if (!isConfigured) {
      const newProduct: Product = {
        ...productData,
        id: `prod-${Date.now()}`,
        tagline: productData.tagline || null,
        description: productData.description || null,
        category_id: productData.category_id || null,
        category: null,
        packaging_info: productData.packaging_info || null,
        weight_grams: productData.weight_grams || 50,
        featured_image: productData.featured_image || null,
        seo_title: productData.seo_title || null,
        seo_description: productData.seo_description || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      SEED_PRODUCTS.unshift(newProduct);
      return NextResponse.json({ success: true, product: newProduct });
    }

    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('products')
      .insert({
        ...productData,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // Revalidate public catalog and home paths
    revalidatePath('/');
    revalidatePath('/katalog');
    revalidatePath('/tentang-produk');

    return NextResponse.json({ success: true, product: data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...dataToValidate } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Product ID wajib disertakan' }, { status: 400 });
    }

    const validation = productSchema.safeParse(dataToValidate);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: getFirstErrorMessage(validation.error) },
        { status: 400 }
      );
    }

    const { isConfigured } = getSupabaseEnv();
    const productData = validation.data;

    if (!isConfigured) {
      const idx = SEED_PRODUCTS.findIndex((p) => p.id === id);
      if (idx !== -1) {
        SEED_PRODUCTS[idx] = {
          ...SEED_PRODUCTS[idx],
          ...productData,
          updated_at: new Date().toISOString(),
        };
        return NextResponse.json({ success: true, product: SEED_PRODUCTS[idx] });
      }
      return NextResponse.json({ success: false, error: 'Produk tidak ditemukan' }, { status: 404 });
    }

    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('products')
      .update({
        ...productData,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    revalidatePath('/');
    revalidatePath('/katalog');
    revalidatePath(`/katalog/${productData.slug}`);

    return NextResponse.json({ success: true, product: data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID produk diperlukan' }, { status: 400 });
    }

    const { isConfigured } = getSupabaseEnv();

    if (!isConfigured) {
      const idx = SEED_PRODUCTS.findIndex((p) => p.id === id);
      if (idx !== -1) {
        SEED_PRODUCTS.splice(idx, 1);
      }
      return NextResponse.json({ success: true });
    }

    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    revalidatePath('/');
    revalidatePath('/katalog');

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
