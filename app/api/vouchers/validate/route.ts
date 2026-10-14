import { NextRequest, NextResponse } from 'next/server';
import { validateVoucherCode } from '@/lib/data/vouchers';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, subtotal } = body;

    if (!code) {
      return NextResponse.json(
        { isValid: false, message: 'Kode voucher harus diisi.' },
        { status: 400 }
      );
    }

    const result = await validateVoucherCode(code, Number(subtotal) || 0);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('API Error /api/vouchers/validate:', err);
    return NextResponse.json(
      { isValid: false, message: err.message || 'Terjadi kesalahan sistem' },
      { status: 500 }
    );
  }
}
