import { NextRequest, NextResponse } from 'next/server';
import { getOrderById } from '@/lib/data/orders';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(context.params);
    const { id } = resolvedParams;

    const order = await getOrderById(id);
    if (!order) {
      return NextResponse.json({ error: 'Pesanan tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (err: any) {
    console.error('API Error GET /api/orders/[id]:', err);
    return NextResponse.json(
      { error: err.message || 'Gagal mengambil detail pesanan' },
      { status: 500 }
    );
  }
}
