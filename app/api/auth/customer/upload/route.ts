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

    const { isConfigured } = getSupabaseEnv();

    // 3. Fallback to Local disk storage under public/uploads/profiles
    if (!isConfigured) {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'profiles');
      await fs.mkdir(uploadDir, { recursive: true });
      await fs.writeFile(path.join(uploadDir, cleanFileName), buffer);

      const publicUrl = `/uploads/profiles/${cleanFileName}`;
      return NextResponse.json({
        success: true,
        publicUrl,
        size: file.size,
        type,
        message: 'Gambar berhasil diunggah dan disimpan ke server lokal.',
      });
    }

    // 4. Supabase Storage upload
    try {
      const supabase = createAdminClient();
      const bucket = 'customer-media';

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(cleanFileName, buffer, {
          contentType: file.type,
          upsert: true,
        });

      if (uploadError) {
        // Fallback to local disk if bucket is not yet created
        console.warn('Supabase storage bucket upload failed, falling back to local disk:', uploadError);
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'profiles');
        await fs.mkdir(uploadDir, { recursive: true });
        await fs.writeFile(path.join(uploadDir, cleanFileName), buffer);
        return NextResponse.json({
          success: true,
          publicUrl: `/uploads/profiles/${cleanFileName}`,
          size: file.size,
          type,
        });
      }

      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(cleanFileName);
      return NextResponse.json({
        success: true,
        publicUrl: urlData.publicUrl,
        size: file.size,
        type,
      });
    } catch (storageErr) {
      console.warn('Storage error fallback:', storageErr);
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'profiles');
      await fs.mkdir(uploadDir, { recursive: true });
      await fs.writeFile(path.join(uploadDir, cleanFileName), buffer);
      return NextResponse.json({
        success: true,
        publicUrl: `/uploads/profiles/${cleanFileName}`,
        size: file.size,
        type,
      });
    }

  } catch (error: any) {
    console.error('Customer media upload error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Terjadi kesalahan sistem saat mengunggah gambar' },
      { status: 500 }
    );
  }
}
