import { NextRequest, NextResponse } from 'next/server';
import { getAllOrdersAdmin, updateOrderStatus, updatePaymentStatus } from '@/lib/data/orders';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || undefined;
    const orderType = searchParams.get('orderType') || undefined;
    const search = searchParams.get('search') || undefined;

    const orders = await getAllOrdersAdmin({ status, orderType, search });
    return NextResponse.json(orders);
  } catch (err: any) {
    console.error('API Error GET /api/admin/orders:', err);
    return NextResponse.json(
      { error: err.message || 'Gagal mengambil data pesanan admin' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, order_status, payment_status, payment_method } = body;

    if (!id) {
      return NextResponse.json({ error: 'Order ID wajib disertakan' }, { status: 400 });
    }

    let updatedOrder = null;

    if (order_status) {
      updatedOrder = await updateOrderStatus(id, order_status);
    }

    if (payment_status) {
      updatedOrder = await updatePaymentStatus(id, payment_status, payment_method);
    }

    if (!updatedOrder) {
      return NextResponse.json({ error: 'Pesanan tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (err: any) {
    console.error('API Error PATCH /api/admin/orders:', err);
    return NextResponse.json(
      { error: err.message || 'Gagal memperbarui status pesanan' },
      { status: 500 }
    );
  }
}
