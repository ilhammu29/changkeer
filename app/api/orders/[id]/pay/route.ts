import { NextRequest, NextResponse } from 'next/server';
import { updatePaymentStatus } from '@/lib/data/orders';

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(context.params);
    const { id } = resolvedParams;

    const body = await req.json().catch(() => ({}));
    const paymentMethod = body.payment_method;

    const updated = await updatePaymentStatus(id, 'paid', paymentMethod);
    if (!updated) {
      return NextResponse.json({ error: 'Pesanan tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Pembayaran berhasil dikonfirmasi.',
      order: updated,
    });
  } catch (err: any) {
    console.error('API Error POST /api/orders/[id]/pay:', err);
    return NextResponse.json(
      { error: err.message || 'Gagal memproses konfirmasi pembayaran' },
      { status: 500 }
    );
  }
}
