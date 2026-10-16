import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs/promises';
import path from 'path';
import { createAdminClient } from '@/lib/supabase/admin';
import { getSupabaseEnv } from '@/lib/supabase/env';
import { safeParseCustomerSession } from '@/lib/auth/session-helpers';

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('changkeer_customer_session')?.value;
    const headerSession = req.headers.get('x-customer-session');

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const type = (formData.get('type') as string) || 'avatar'; // 'avatar' | 'banner'
    const bodySession = formData.get('customer_session') as string | null;

    // Validate customer session via cookie, header, or formData
    const currentCustomer =
      safeParseCustomerSession(sessionCookie) ||
      safeParseCustomerSession(headerSession) ||
      safeParseCustomerSession(bodySession);

    if (!currentCustomer || !currentCustomer.email) {
      return NextResponse.json(
        { success: false, error: 'Sesi pelanggan tidak ditemukan. Harap masuk terlebih dahulu.' },
        { status: 401 }
      );
    }

    // Refresh/persist cookie if needed
    try {
      cookieStore.set('changkeer_customer_session', encodeURIComponent(JSON.stringify(currentCustomer)), {
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      });
    } catch {}

    if (!file) {
      return NextResponse.json({ success: false, error: 'File gambar wajib diunggah' }, { status: 400 });
    }

    // 1. Strict 5MB size limit check
    if (file.size > MAX_UPLOAD_BYTES) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      return NextResponse.json(
        { success: false, error: `Ukuran gambar terlalu besar (${sizeMB}MB). Maksimal ukuran file adalah 5MB.` },
        { status: 400 }
      );
    }

    // 2. Validate MIME type & file extension
    const allowedMime = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const allowedExts = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
    const ext = file.name.split('.').pop()?.toLowerCase() || 'webp';
    const mime = file.type ? file.type.toLowerCase() : '';

    const isAllowed = allowedMime.includes(mime) || allowedExts.includes(ext);
    if (!isAllowed) {
      return NextResponse.json(
        { success: false, error: 'Format gambar tidak didukung. Harap unggah file JPEG, PNG, atau WebP.' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const safeExt = ext === 'jpeg' ? 'jpg' : (allowedExts.includes(ext) ? ext : 'webp');
    const cleanFileName = `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${safeExt}`;

    const { isConfigured, serviceKey } = getSupabaseEnv();

    // Strategy 1: Supabase Storage (Priority for online production / Vercel)
    if (isConfigured && serviceKey) {
      try {
        const supabase = createAdminClient();
        const candidateBuckets = ['customer-media', 'site-media', 'product-images'];

        for (const bucket of candidateBuckets) {
          try {
            const { error: uploadError } = await supabase.storage
              .from(bucket)
              .upload(cleanFileName, buffer, {
                contentType: file.type || 'image/jpeg',
                upsert: true,
              });

            if (!uploadError) {
              const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(cleanFileName);
              return NextResponse.json({
                success: true,
                publicUrl: urlData.publicUrl,
                size: file.size,
                type,
                storage: 'supabase',
                bucket,
              });
            } else {
              console.warn(`Supabase bucket ${bucket} upload error:`, uploadError.message);
            }
          } catch (bucketErr) {
            console.warn(`Supabase bucket ${bucket} exception:`, bucketErr);
          }
        }
      } catch (storageErr) {
        console.warn('Supabase storage client exception:', storageErr);
      }
    }

    // Strategy 2: Local Disk Storage (For local dev or VPS/cPanel with writable filesystem)
    try {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'profiles');
      await fs.mkdir(uploadDir, { recursive: true });
      await fs.writeFile(path.join(uploadDir, cleanFileName), buffer);

      const publicUrl = `/uploads/profiles/${cleanFileName}`;
      return NextResponse.json({
        success: true,
        publicUrl,
        size: file.size,
        type,
        storage: 'local-disk',
      });
    } catch (fsErr) {
      console.warn('Local disk write failed (e.g. read-only serverless filesystem):', fsErr);
    }

    // Strategy 3: Infallible Base64 Data URL Fallback
    // Guaranteed to work on Vercel read-only serverless, ephemeral containers, or restricted environments
    const base64 = buffer.toString('base64');
    const mimeType = file.type || (safeExt === 'jpg' ? 'image/jpeg' : `image/${safeExt}`);
    const dataUrl = `data:${mimeType};base64,${base64}`;

    return NextResponse.json({
      success: true,
      publicUrl: dataUrl,
      size: file.size,
      type,
      storage: 'inline-base64',
    });
  } catch (error: any) {
    console.error('Customer media upload error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Terjadi kesalahan sistem saat mengunggah gambar' },
      { status: 500 }
    );
  }
}
