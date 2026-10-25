import { createPublicSupabaseClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getSupabaseEnv } from '@/lib/supabase/env';
import { SEED_ORDERS } from './mock-seed';
import { Order, OrderItem, OrderStatus, PaymentStatus, OrderType, PaymentMethod, CartItem } from '@/types';

// In-memory store for local cache & development
let memoryOrders: Order[] = [...SEED_ORDERS];

const FALLBACK_STORE_KEY = 'active_orders_store';

function generateUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function generateOrderNumber(): string {
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  return `CK-${dateStr}-${randomSuffix}`;
}

/**
 * Fetch orders from the resilient Supabase `site_settings` fallback store
 */
async function readFallbackOrders(): Promise<Order[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('site_settings')
      .select('raw_json')
      .eq('key', FALLBACK_STORE_KEY)
      .maybeSingle();

    if (error || !data || !data.raw_json || !Array.isArray(data.raw_json.orders)) {
      return memoryOrders;
    }

    const fallbackOrders = data.raw_json.orders as Order[];
    
    // Merge into memoryOrders for fast lookups
    fallbackOrders.forEach((fo) => {
      const idx = memoryOrders.findIndex((m) => m.id === fo.id || m.order_number === fo.order_number);
      if (idx !== -1) {
        memoryOrders[idx] = fo;
      } else {
        memoryOrders.unshift(fo);
      }
    });

    return fallbackOrders;
  } catch (err) {
    console.warn('Failed to read orders from fallback store:', err);
    return memoryOrders;
  }
}

/**
 * Save orders array to the resilient Supabase `site_settings` fallback store
 */
async function writeFallbackOrders(orders: Order[]): Promise<boolean> {
  try {
    const supabase = createAdminClient();
    const sliceToSave = orders.slice(0, 200); // keep most recent 200 orders

    const { error } = await supabase
      .from('site_settings')
      .upsert(
        {
          key: FALLBACK_STORE_KEY,
          site_name: 'CHANGKEER',
          tagline: 'Resilient Orders Store',
          raw_json: { orders: sliceToSave, updated_at: new Date().toISOString() },
        },
        { onConflict: 'key' }
      );

    if (error) {
      console.warn('Failed to write to fallback orders store:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Error saving to fallback orders store:', err);
    return false;
  }
}

export interface CreateOrderPayload {
  customer_id?: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  order_type: OrderType;
  table_number?: string | null;
  pickup_time?: string | null;
  delivery_address?: string | null;
  delivery_notes?: string | null;
  subtotal: number;
  discount_amount?: number;
  delivery_fee?: number;
  tax_amount?: number;
  total_amount: number;
  voucher_id?: string | null;
  voucher_code?: string | null;
  payment_method: PaymentMethod;
  notes?: string | null;
  items: CartItem[];
}

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const orderId = generateUUID();
  const orderNumber = generateOrderNumber();
  const now = new Date().toISOString();

  const computedSubtotal = payload.items.reduce(
    (sum, item) => sum + (item.unit_price * item.quantity),
    0
  );
  const subtotal = payload.subtotal !== undefined && payload.subtotal > 0 ? payload.subtotal : computedSubtotal;
  const discountAmount = payload.discount_amount || 0;
  const deliveryFee = payload.delivery_fee || 0;
  const taxAmount = payload.tax_amount || 0;
  const totalAmount = payload.total_amount !== undefined && payload.total_amount > 0
    ? payload.total_amount
    : Math.max(0, subtotal - discountAmount + deliveryFee + taxAmount);

  const orderItems: OrderItem[] = payload.items.map((item) => ({
    id: generateUUID(),
    order_id: orderId,
    product_id: item.product_id || null,
    product_name: item.product_name,
    product_slug: item.product_slug,
    product_image: item.product_image || null,
    serving_size: item.serving_size || 'regular',
    temperature: item.temperature,
    sweetness_level: item.sweetness_level || '0%',
    ice_level: item.ice_level || 'normal',
    selected_addons: item.selected_addons || [],
    unit_price: item.unit_price,
    quantity: item.quantity,
    subtotal: item.subtotal !== undefined ? item.subtotal : item.unit_price * item.quantity,
    item_notes: item.item_notes || null,
    created_at: now,
  }));

  const initialPaymentStatus: PaymentStatus = 'unpaid';
  const initialOrderStatus: OrderStatus = 'received';

  const newOrder: Order = {
    id: orderId,
    order_number: orderNumber,
    customer_id: payload.customer_id || null,
    customer_name: payload.customer_name,
    customer_email: payload.customer_email,
    customer_phone: payload.customer_phone,
    order_type: payload.order_type,
    table_number: payload.order_type === 'dine_in' ? (payload.table_number || 'Meja 01') : null,
    pickup_time: payload.order_type === 'takeaway' ? (payload.pickup_time || 'Segera') : null,
    delivery_address: payload.order_type === 'delivery' ? (payload.delivery_address || null) : null,
    delivery_notes: payload.order_type === 'delivery' ? (payload.delivery_notes || null) : null,
    subtotal,
    discount_amount: discountAmount,
    delivery_fee: deliveryFee,
    tax_amount: taxAmount,
    total_amount: totalAmount,
    voucher_id: payload.voucher_id || null,
    voucher_code: payload.voucher_code || null,
    payment_method: payload.payment_method,
    payment_status: initialPaymentStatus,
    order_status: initialOrderStatus,
    notes: payload.notes || null,
    paid_at: null,
    completed_at: null,
    created_at: now,
    updated_at: now,
    items: orderItems,
  };

  // 1. Cache immediately in local memory
  memoryOrders.unshift(newOrder);

  const { isConfigured } = getSupabaseEnv();
  if (!isConfigured) {
    return newOrder;
  }

  // 2. Try inserting into native Supabase `orders` table
  try {
    const supabase = createAdminClient();
    const { items, ...orderRecord } = newOrder;

    const { data: insertedOrder, error: orderError } = await supabase
      .from('orders')
      .insert(orderRecord)
      .select()
      .maybeSingle();

    if (!orderError && insertedOrder) {
      if (orderItems.length > 0) {
        await supabase.from('order_items').insert(orderItems);
      }
      return {
        ...(insertedOrder as Order),
        items: orderItems,
      };
    }
  } catch (err) {
    console.warn('Native orders table insert failed, falling back to resilient store:', err);
  }

  // 3. Fallback: Save to Supabase `site_settings` active_orders_store (cross-lambda persistence)
  try {
    const existing = await readFallbackOrders();
    const updated = [newOrder, ...existing.filter((o) => o.id !== newOrder.id && o.order_number !== newOrder.order_number)];
    await writeFallbackOrders(updated);
  } catch (err) {
    console.warn('Fallback store write failed:', err);
  }

  return newOrder;
}

export async function getOrderById(id: string): Promise<Order | null> {
  const { isConfigured } = getSupabaseEnv();

  // 1. Check local memory first
  const foundMemory = memoryOrders.find((o) => o.id === id || o.order_number === id);

  if (!isConfigured) {
    return foundMemory || null;
  }

  // 2. Try native Supabase `orders` table
  try {
    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .or(`id.eq.${id},order_number.eq.${id}`)
      .maybeSingle();

    if (!error && data) {
      return data as Order;
    }
  } catch {
    // Table might not exist or failed
  }

  // 3. Try reading from resilient fallback store in Supabase
  try {
    const fallbackOrders = await readFallbackOrders();
    const foundFallback = fallbackOrders.find((o) => o.id === id || o.order_number === id);
    if (foundFallback) {
      return foundFallback;
    }
  } catch (err) {
    console.warn('Failed to query fallback store for order:', err);
  }

  return foundMemory || null;
}

export async function getOrdersByCustomer(customerEmailOrId: string): Promise<Order[]> {
  const { isConfigured } = getSupabaseEnv();
  const qLower = customerEmailOrId.toLowerCase();

  const filterMemory = memoryOrders.filter(
    (o) => o.customer_email.toLowerCase() === qLower || o.customer_id === customerEmailOrId
  );

  if (!isConfigured) {
    return filterMemory;
  }

  try {
    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .or(`customer_email.eq.${customerEmailOrId},customer_id.eq.${customerEmailOrId}`)
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return data as Order[];
    }
  } catch {
    // Native table failed
  }

  // Query fallback store
  try {
    const fallbackOrders = await readFallbackOrders();
    const filteredFallback = fallbackOrders.filter(
      (o) => o.customer_email.toLowerCase() === qLower || o.customer_id === customerEmailOrId
    );
    if (filteredFallback.length > 0) {
      return filteredFallback;
    }
  } catch (err) {
    console.warn('Fallback customer orders query failed:', err);
  }

  return filterMemory;
}

export async function getAllOrdersAdmin(filter?: {
  status?: string;
  orderType?: string;
  search?: string;
}): Promise<Order[]> {
  const { isConfigured } = getSupabaseEnv();

  // Try native table first
  if (isConfigured) {
    try {
      const supabase = createAdminClient();
      let query = supabase
        .from('orders')
        .select('*, items:order_items(*)')
        .order('created_at', { ascending: false });

      if (filter?.status && filter.status !== 'all') {
        query = query.eq('order_status', filter.status);
      }
      if (filter?.orderType && filter.orderType !== 'all') {
        query = query.eq('order_type', filter.orderType);
      }
      if (filter?.search) {
        query = query.or(`order_number.ilike.%${filter.search}%,customer_name.ilike.%${filter.search}%,customer_phone.ilike.%${filter.search}%`);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return data as Order[];
      }
    } catch {
      // Table failed
    }
  }

  // Fallback to resilient store
  let list = await readFallbackOrders();
  if (filter?.status && filter.status !== 'all') {
    list = list.filter((o) => o.order_status === filter.status);
  }
  if (filter?.orderType && filter.orderType !== 'all') {
    list = list.filter((o) => o.order_type === filter.orderType);
  }
  if (filter?.search) {
    const q = filter.search.toLowerCase();
    list = list.filter(
      (o) =>
        o.order_number.toLowerCase().includes(q) ||
        o.customer_name.toLowerCase().includes(q) ||
        o.customer_phone.includes(q)
    );
  }

  return list;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order | null> {
  const now = new Date().toISOString();

  // 1. Update in-memory
  const idx = memoryOrders.findIndex((o) => o.id === orderId || o.order_number === orderId);
  if (idx !== -1) {
    memoryOrders[idx] = {
      ...memoryOrders[idx],
      order_status: status,
      completed_at: status === 'completed' ? now : memoryOrders[idx].completed_at,
      updated_at: now,
    };
  }

  const { isConfigured } = getSupabaseEnv();
  if (!isConfigured) {
    return memoryOrders[idx] || null;
  }

  // 2. Try native table
  try {
    const supabase = createAdminClient();
    const updatePayload: Record<string, any> = {
      order_status: status,
      updated_at: now,
    };
    if (status === 'completed') {
      updatePayload.completed_at = now;
    }

    const { data, error } = await supabase
      .from('orders')
      .update(updatePayload)
      .or(`id.eq.${orderId},order_number.eq.${orderId}`)
      .select('*, items:order_items(*)')
      .maybeSingle();

    if (!error && data) {
      return data as Order;
    }
  } catch {
    // Native update failed
  }

  // 3. Fallback: Update in resilient store
  try {
    const fallbackOrders = await readFallbackOrders();
    const fIdx = fallbackOrders.findIndex((o) => o.id === orderId || o.order_number === orderId);
    if (fIdx !== -1) {
      fallbackOrders[fIdx] = {
        ...fallbackOrders[fIdx],
        order_status: status,
        completed_at: status === 'completed' ? now : fallbackOrders[fIdx].completed_at,
        updated_at: now,
      };
      await writeFallbackOrders(fallbackOrders);
      return fallbackOrders[fIdx];
    }
  } catch (err) {
    console.warn('Fallback update order status failed:', err);
  }

  return memoryOrders[idx] || null;
}

export async function updatePaymentStatus(
  orderId: string,
  paymentStatus: PaymentStatus,
  paymentMethod?: PaymentMethod
): Promise<Order | null> {
  const now = new Date().toISOString();

  // 1. Update in-memory
  const idx = memoryOrders.findIndex((o) => o.id === orderId || o.order_number === orderId);
  if (idx !== -1) {
    memoryOrders[idx] = {
      ...memoryOrders[idx],
      payment_status: paymentStatus,
      paid_at: paymentStatus === 'paid' ? now : memoryOrders[idx].paid_at,
      payment_method: paymentMethod || memoryOrders[idx].payment_method,
      order_status:
        paymentStatus === 'paid' && memoryOrders[idx].order_status === 'received'
          ? 'brewing'
          : memoryOrders[idx].order_status,
      updated_at: now,
    };
  }

  const { isConfigured } = getSupabaseEnv();
  if (!isConfigured) {
    return memoryOrders[idx] || null;
  }

  // 2. Try native table
  try {
    const supabase = createAdminClient();
    const updatePayload: Record<string, any> = {
      payment_status: paymentStatus,
      updated_at: now,
    };
    if (paymentStatus === 'paid') {
      updatePayload.paid_at = now;
      updatePayload.order_status = 'brewing';
    }
    if (paymentMethod) {
      updatePayload.payment_method = paymentMethod;
    }

    const { data, error } = await supabase
      .from('orders')
      .update(updatePayload)
      .or(`id.eq.${orderId},order_number.eq.${orderId}`)
      .select('*, items:order_items(*)')
      .maybeSingle();

    if (!error && data) {
      return data as Order;
    }
  } catch {
    // Native update failed
  }

  // 3. Fallback: Update in resilient store
  try {
    const fallbackOrders = await readFallbackOrders();
    const fIdx = fallbackOrders.findIndex((o) => o.id === orderId || o.order_number === orderId);
    if (fIdx !== -1) {
      fallbackOrders[fIdx] = {
        ...fallbackOrders[fIdx],
        payment_status: paymentStatus,
        paid_at: paymentStatus === 'paid' ? now : fallbackOrders[fIdx].paid_at,
        payment_method: paymentMethod || fallbackOrders[fIdx].payment_method,
        order_status:
          paymentStatus === 'paid' && fallbackOrders[fIdx].order_status === 'received'
            ? 'brewing'
            : fallbackOrders[fIdx].order_status,
        updated_at: now,
      };
      await writeFallbackOrders(fallbackOrders);
      return fallbackOrders[fIdx];
    }
  } catch (err) {
    console.warn('Fallback update payment status failed:', err);
  }

  return memoryOrders[idx] || null;
}
