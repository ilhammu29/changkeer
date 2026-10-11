import { NextRequest, NextResponse } from 'next/server';
import { contactFormSchema, getFirstErrorMessage } from '@/lib/validation/schemas';
import { saveContactMessage } from '@/lib/data/contact';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = contactFormSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: getFirstErrorMessage(result.error),
        },
        { status: 400 }
      );
    }

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined;

    const saveResult = await saveContactMessage(result.data, ip);

    if (!saveResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: saveResult.error || 'Gagal menyimpan pesan',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Pesan Anda berhasil diterima oleh tim CHANGKEER. Kami akan meninjau pesan Anda secepatnya.',
    });
  } catch (err: any) {
    console.error('Contact API error:', err);
    return NextResponse.json(
      {
        success: false,
        error: 'Terjadi kendala pada server. Silakan coba kembali sesaat lagi.',
      },
      { status: 500 }
    );
  }
}
