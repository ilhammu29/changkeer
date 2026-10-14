import { NextRequest, NextResponse } from 'next/server';
import { createOrder, getOrdersByCustomer } from '@/lib/data/orders';
import { checkoutSchema } from '@/lib/validation/schemas';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate with Zod
    const parsed = checkoutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validasi data pesanan gagal', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const newOrder = await createOrder(parsed.data as any);
    return NextResponse.json(newOrder, { status: 201 });
  } catch (err: any) {
    console.error('API Error POST /api/orders:', err);
    return NextResponse.json(
      { error: err.message || 'Gagal memproses pesanan' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const customerId = searchParams.get('customer_id');

    const identifier = customerId || email;
    if (!identifier) {
      return NextResponse.json(
        { error: 'Parameter email atau customer_id diperlukan' },
        { status: 400 }
      );
    }

    const orders = await getOrdersByCustomer(identifier);
    return NextResponse.json(orders);
  } catch (err: any) {
    console.error('API Error GET /api/orders:', err);
    return NextResponse.json(
      { error: err.message || 'Gagal mengambil riwayat pesanan' },
      { status: 500 }
    );
  }
}
