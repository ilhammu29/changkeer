import { describe, it, expect } from 'vitest';
import { validateVoucherCode } from '@/lib/data/vouchers';
import { createOrder, getOrderById, updateOrderStatus, updatePaymentStatus } from '@/lib/data/orders';
import { checkoutSchema, voucherSchema } from '@/lib/validation/schemas';
import { BOTANICAL_ADDONS } from '@/lib/data/mock-seed';
import { generateDynamicQRIS, calculateCRC16 } from '@/lib/utils/qris';

describe('Voucher Validation System', () => {
  it('validates a valid percentage voucher with min spend met', async () => {
    // CHANGKEERFIRST is 20% max 25000 min 40000
    const result = await validateVoucherCode('CHANGKEERFIRST', 50000);
    expect(result.isValid).toBe(true);
    expect(result.discountAmount).toBe(10000); // 20% of 50000
    expect(result.voucher?.code).toBe('CHANGKEERFIRST');
  });

  it('caps the percentage discount at max_discount limit', async () => {
    // 20% of 200,000 is 40,000, but capped at 25,000
    const result = await validateVoucherCode('CHANGKEERFIRST', 200000);
    expect(result.isValid).toBe(true);
    expect(result.discountAmount).toBe(25000);
  });

  it('rejects voucher if subtotal is below min_spend', async () => {
    const result = await validateVoucherCode('CHANGKEERFIRST', 25000);
    expect(result.isValid).toBe(false);
    expect(result.discountAmount).toBe(0);
    expect(result.message).toContain('Minimal belanja');
  });

  it('validates fixed discount voucher correctly', async () => {
    // ATELIER10K is fixed 10000 min 50000
    const result = await validateVoucherCode('ATELIER10K', 60000);
    expect(result.isValid).toBe(true);
    expect(result.discountAmount).toBe(10000);
  });

  it('rejects non-existent voucher code', async () => {
    const result = await validateVoucherCode('INVALIDCODE123', 100000);
    expect(result.isValid).toBe(false);
    expect(result.message).toContain('tidak ditemukan');
  });
});

describe('Orders and Checkout Flow', () => {
  it('validates valid checkout payload with Zod schema', () => {
    const validPayload = {
      customer_name: 'Dewi Lestari',
      customer_email: 'dewi@example.com',
      customer_phone: '08123456789',
      order_type: 'dine_in',
      table_number: 'Meja 03',
      subtotal: 58000,
      discount_amount: 10000,
      delivery_fee: 0,
      tax_amount: 0,
      total_amount: 48000,
      payment_method: 'qris',
      items: [
        {
          cart_item_id: 'cart-1',
          product_id: 'prod-1',
          product_name: 'CHANGKEER First Bloom',
          product_slug: 'start-of-spring',
          serving_size: 'regular',
          temperature: 'hot',
          sweetness_level: '0%',
          selected_addons: [BOTANICAL_ADDONS[0]],
          unit_price: 32000,
          quantity: 1,
          subtotal: 32000,
        },
      ],
    };

    const parsed = checkoutSchema.safeParse(validPayload);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.total_amount).toBe(48000);
      expect(parsed.data.subtotal).toBe(58000);
      expect(parsed.data.discount_amount).toBe(10000);
    }
  });

  it('creates an order, retrieves it, and updates its status', async () => {
    const created = await createOrder({
      customer_name: 'Test Customer',
      customer_email: 'test@example.com',
      customer_phone: '081122334455',
      order_type: 'dine_in',
      table_number: 'Meja 01',
      subtotal: 28000,
      discount_amount: 0,
      delivery_fee: 0,
      tax_amount: 0,
      total_amount: 28000,
      payment_method: 'qris',
      items: [
        {
          cart_item_id: 'test-item-1',
          product_id: 'prod-01',
          product_name: 'Artisan Chamomile Tea',
          product_slug: 'chamomile-tea',
          serving_size: 'regular',
          temperature: 'hot',
          sweetness_level: '0%',
          selected_addons: [],
          unit_price: 28000,
          quantity: 1,
          subtotal: 28000,
        },
      ],
    });

    expect(created.id).toBeDefined();
    expect(created.order_number).toMatch(/^CK-/);
    expect(created.order_status).toBe('received');
    expect(created.payment_status).toBe('unpaid');

    // Retrieve order by ID
    const retrieved = await getOrderById(created.id);
    expect(retrieved).not.toBeNull();
    expect(retrieved?.id).toBe(created.id);

    // Update status to brewing
    const brewing = await updateOrderStatus(created.id, 'brewing');
    expect(brewing?.order_status).toBe('brewing');

    // Confirm payment
    const paid = await updatePaymentStatus(created.id, 'paid');
    expect(paid?.payment_status).toBe('paid');
    expect(paid?.paid_at).toBeDefined();
  });

  it('generates valid dynamic QRIS with locked amount and verified CRC', () => {
    const dynamicString = generateDynamicQRIS(25000);

    expect(dynamicString).toContain('010212'); // dynamic indicator
    expect(dynamicString).toContain('540525000'); // Tag 54: length 05, value 25000
    expect(dynamicString).toContain('ID1026598652240'); // NMID

    // Verify CRC
    const rawData = dynamicString.slice(0, -4);
    const checksum = dynamicString.slice(-4);
    expect(calculateCRC16(rawData)).toBe(checksum);
  });
});
