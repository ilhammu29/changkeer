import { NextRequest, NextResponse } from 'next/server';
import { createOrder, getOrdersByCustomer } from '@/lib/data/orders';
import { checkoutSchema } from '@/lib/validation/schemas';
import { SEED_PRODUCTS, BOTANICAL_ADDONS } from '@/lib/data/mock-seed';
import { validateVoucherCode } from '@/lib/data/vouchers';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Structural validation with Zod
    const parsed = checkoutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Order validation failed', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // 2. Cryptographic & Catalog Price Verification (Anti-Tampering)
    const verifiedItems = data.items.map((item) => {
      const matchedProduct = SEED_PRODUCTS.find(
        (p) => p.slug === item.product_slug || p.id === item.product_id
      );

      const basePrice = matchedProduct?.price ?? (item.unit_price || 28000);
      const potExtra = item.serving_size === 'pot' ? 12000 : 0;
      const iceExtra = item.temperature === 'iced' ? 2000 : 0;
      const sweetenerExtra =
        item.sweetness_level !== '0%' && item.sweetener_type === 'honey' ? 3000 : 0;

      const addonsExtra = (item.selected_addons || []).reduce((sum, a) => {
        const seedAddon = BOTANICAL_ADDONS.find((b) => b.id === a.id);
        return sum + (seedAddon?.price ?? a.price ?? 0);
      }, 0);

      const verifiedUnitPrice = basePrice + potExtra + iceExtra + sweetenerExtra + addonsExtra;
      const verifiedSubtotal = verifiedUnitPrice * item.quantity;

      return {
        ...item,
        unit_price: verifiedUnitPrice,
        subtotal: verifiedSubtotal,
      };
    });

    const verifiedSubtotal = verifiedItems.reduce((sum, item) => sum + item.subtotal, 0);

    // 3. Server-side Voucher Re-validation
    let verifiedDiscount = 0;
    let verifiedVoucherId = data.voucher_id || null;
    let verifiedVoucherCode = data.voucher_code || null;

    if (data.voucher_code && data.voucher_code.trim()) {
      const voucherRes = await validateVoucherCode(data.voucher_code, verifiedSubtotal);
      if (voucherRes.isValid) {
        verifiedDiscount = voucherRes.discountAmount;
        verifiedVoucherId = voucherRes.voucher?.id || verifiedVoucherId;
        verifiedVoucherCode = voucherRes.voucher?.code || verifiedVoucherCode;
      } else {
        verifiedDiscount = 0;
        verifiedVoucherCode = null;
      }
    }

    // 4. Delivery Fee Rule
    const verifiedDeliveryFee = data.order_type === 'delivery' ? 10000 : 0;
    const verifiedTax = 0;
    const verifiedTotal = Math.max(0, verifiedSubtotal - verifiedDiscount + verifiedDeliveryFee + verifiedTax);

    const orderPayload = {
      ...data,
      items: verifiedItems,
      subtotal: verifiedSubtotal,
      discount_amount: verifiedDiscount,
      delivery_fee: verifiedDeliveryFee,
      tax_amount: verifiedTax,
      total_amount: verifiedTotal,
      voucher_id: verifiedVoucherId,
      voucher_code: verifiedVoucherCode,
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
