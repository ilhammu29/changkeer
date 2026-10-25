import { NextRequest, NextResponse } from 'next/server';
import { updatePaymentStatus, getOrderById } from '@/lib/data/orders';

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(context.params);
    const { id } = resolvedParams;

    const body = await req.json().catch(() => ({}));
    const paymentMethod = body.payment_method;

    // 1. Verify existence before modifying
    const existing = await getOrderById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // 2. Idempotent early-return if already marked as paid
    if (existing.payment_status === 'paid') {
      return NextResponse.json({
        success: true,
        message: 'Payment already verified.',
        order: existing,
      });
    }

    // 3. Prevent paying cancelled orders
    if (existing.order_status === 'cancelled') {
      return NextResponse.json(
        { error: 'Cannot complete payment on a cancelled order.' },
        { status: 400 }
      );
    }

    const updated = await updatePaymentStatus(id, 'paid', paymentMethod);
    if (!updated) {
      return NextResponse.json({ error: 'Order could not be updated' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Payment successfully confirmed.',
      order: updated,
    });
  } catch (err: any) {
    console.error('API Error POST /api/orders/[id]/pay:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to process payment confirmation' },
      { status: 500 }
    );
  }
}
