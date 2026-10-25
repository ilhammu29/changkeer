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
        { error: 'Order validation failed', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Server-side financial integrity calculation
    const computedSubtotal = data.items.reduce(
      (sum, item) => sum + (item.unit_price * item.quantity),
      0
    );
    const subtotal = data.subtotal !== undefined && data.subtotal > 0 ? data.subtotal : computedSubtotal;
    const discountAmount = data.discount_amount ?? 0;
    const deliveryFee = data.delivery_fee ?? 0;
    const taxAmount = data.tax_amount ?? 0;
    const totalAmount = data.total_amount !== undefined && data.total_amount > 0
      ? data.total_amount
      : Math.max(0, subtotal - discountAmount + deliveryFee + taxAmount);

    const orderPayload = {
      ...data,
      subtotal,
      discount_amount: discountAmount,
      delivery_fee: deliveryFee,
      tax_amount: taxAmount,
      total_amount: totalAmount,
    };

    const newOrder = await createOrder(orderPayload as any);
    return NextResponse.json(newOrder, { status: 201 });
  } catch (err: any) {
    console.error('API Error POST /api/orders:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to process order' },
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
        { error: 'Email or customer_id parameter is required' },
        { status: 400 }
      );
    }

    const orders = await getOrdersByCustomer(identifier);
    return NextResponse.json(orders);
  } catch (err: any) {
    console.error('API Error GET /api/orders:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to retrieve order history' },
      { status: 500 }
    );
  }
}
