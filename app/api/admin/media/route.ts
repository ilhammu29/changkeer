import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getSupabaseEnv } from '@/lib/supabase/env';
import { getMediaAssets } from '@/lib/data/media';
import { MediaAsset } from '@/types';
import { verifyAdminOrUnauthorized } from '@/lib/auth/session';

export async function GET() {
  const unauth = await verifyAdminOrUnauthorized();
  if (unauth) return unauth;

  try {
    const assets = await getMediaAssets();
    return NextResponse.json({ success: true, assets });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const unauth = await verifyAdminOrUnauthorized();
  if (unauth) return unauth;

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const bucket = (formData.get('bucket') as string) || 'product-images';
    const altText = (formData.get('altText') as string) || '';

    if (!file) {
      return NextResponse.json({ success: false, error: 'File tidak ditemukan' }, { status: 400 });
    }

    // Validate MIME type
    const allowedMime = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!allowedMime.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Format file tidak didukung. Harap unggah JPEG, PNG, WebP, atau SVG.' },
        { status: 400 }
      );
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'Ukuran file terlalu besar. Maksimal 5MB.' },
        { status: 400 }
      );
    }

    const { isConfigured } = getSupabaseEnv();
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    if (!isConfigured) {
      // In dev fallback, create and track local mock asset
      const newAsset: MediaAsset = {
        id: `media-${Date.now()}`,
        bucket,
        file_path: `${bucket}/${fileName}`,
        file_name: fileName,
        file_size: file.size,
        mime_type: file.type,
        alt_text: altText || file.name,
        public_url: `/images/products/changkeer-lemongrass-ginger.jpg`,
        created_at: new Date().toISOString(),
      };
      return NextResponse.json({ success: true, asset: newAsset });
    }

    const supabase = await createServerSupabaseClient();
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json({ success: false, error: uploadError.message }, { status: 500 });
    }

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fileName);

    const { data: record, error: dbError } = await supabase
      .from('media_assets')
      .insert({
        bucket,
        file_path: `${bucket}/${fileName}`,
        file_name: fileName,
        file_size: file.size,
        mime_type: file.type,
        alt_text: altText,
        public_url: urlData.publicUrl,
      })
      .select()
      .single();

    if (dbError) {
      return NextResponse.json({ success: false, error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, asset: record });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const unauth = await verifyAdminOrUnauthorized();
  if (unauth) return unauth;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID media diperlukan' }, { status: 400 });
    }

    const { isConfigured } = getSupabaseEnv();
    if (!isConfigured) {
      return NextResponse.json({ success: true });
    }

    const supabase = await createServerSupabaseClient();
    const { data: asset, error: findError } = await supabase
      .from('media_assets')
      .select('*')
      .eq('id', id)
      .single();

    if (findError || !asset) {
      return NextResponse.json({ success: false, error: 'Media tidak ditemukan' }, { status: 404 });
    }

    // Remove from storage
    await supabase.storage.from(asset.bucket).remove([asset.file_name]);
    // Remove record from database
    await supabase.from('media_assets').delete().eq('id', id);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
