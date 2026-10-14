import { createPublicSupabaseClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getSupabaseEnv } from '@/lib/supabase/env';
import { SEED_ORDERS } from './mock-seed';
import { Order, OrderItem, OrderStatus, PaymentStatus, OrderType, PaymentMethod, CartItem } from '@/types';

// In-memory store for local development without DB connection
let memoryOrders: Order[] = [...SEED_ORDERS];

function generateOrderNumber(): string {
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  return `CK-${dateStr}-${randomSuffix}`;
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
  discount_amount: number;
  delivery_fee: number;
  tax_amount: number;
  total_amount: number;
  voucher_id?: string | null;
  voucher_code?: string | null;
  payment_method: PaymentMethod;
  notes?: string | null;
  items: CartItem[];
}

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const orderId = `ord-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  const orderNumber = generateOrderNumber();
  const now = new Date().toISOString();

  const orderItems: OrderItem[] = payload.items.map((item, idx) => ({
    id: `item-${Date.now().toString(36)}-${idx}`,
    order_id: orderId,
    product_id: item.product_id,
    product_name: item.product_name,
    product_slug: item.product_slug,
    product_image: item.product_image || null,
    serving_size: item.serving_size,
    temperature: item.temperature,
    sweetness_level: item.sweetness_level,
    ice_level: item.ice_level || null,
    selected_addons: item.selected_addons || [],
    unit_price: item.unit_price,
    quantity: item.quantity,
    subtotal: item.subtotal,
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
    subtotal: payload.subtotal,
    discount_amount: payload.discount_amount || 0,
    delivery_fee: payload.delivery_fee || 0,
    tax_amount: payload.tax_amount || 0,
    total_amount: payload.total_amount,
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

  const { isConfigured } = getSupabaseEnv();
  if (!isConfigured) {
    memoryOrders.unshift(newOrder);
    return newOrder;
  }

  try {
    const supabase = createAdminClient();
    const { items, ...orderRecord } = newOrder;

    const { data: insertedOrder, error: orderError } = await supabase
      .from('orders')
      .insert(orderRecord)
      .select()
      .single();

    if (orderError || !insertedOrder) {
      console.warn('Failed to insert order into Supabase, saving to memory:', orderError?.message);
      memoryOrders.unshift(newOrder);
      return newOrder;
    }

    if (orderItems.length > 0) {
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.warn('Failed to insert order items into Supabase:', itemsError?.message);
      }
    }

    return {
      ...(insertedOrder as Order),
      items: orderItems,
    };
  } catch (err) {
    console.error('Error creating order in Supabase:', err);
    memoryOrders.unshift(newOrder);
    return newOrder;
  }
}

export async function getOrderById(id: string): Promise<Order | null> {
  const { isConfigured } = getSupabaseEnv();

  const foundMemory = memoryOrders.find(o => o.id === id || o.order_number === id);

  if (!isConfigured) {
    return foundMemory || null;
  }

  try {
    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .or(`id.eq.${id},order_number.eq.${id}`)
      .single();

    if (error || !data) {
      return foundMemory || null;
    }

    return data as Order;
  } catch (err) {
    console.error('Failed to get order by id:', err);
    return foundMemory || null;
  }
}

export async function getOrdersByCustomer(customerEmailOrId: string): Promise<Order[]> {
  const { isConfigured } = getSupabaseEnv();

  const filterMemory = memoryOrders.filter(
    o => o.customer_email.toLowerCase() === customerEmailOrId.toLowerCase() || o.customer_id === customerEmailOrId
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

    if (error || !data) {
      return filterMemory;
    }

    return data as Order[];
  } catch (err) {
    console.error('Failed to get customer orders:', err);
    return filterMemory;
  }
}

export async function getAllOrdersAdmin(filter?: {
  status?: string;
  orderType?: string;
  search?: string;
}): Promise<Order[]> {
  const { isConfigured } = getSupabaseEnv();

  let list = [...memoryOrders];
  if (filter?.status && filter.status !== 'all') {
    list = list.filter(o => o.order_status === filter.status);
  }
  if (filter?.orderType && filter.orderType !== 'all') {
    list = list.filter(o => o.order_type === filter.orderType);
  }
  if (filter?.search) {
    const q = filter.search.toLowerCase();
    list = list.filter(
      o =>
        o.order_number.toLowerCase().includes(q) ||
        o.customer_name.toLowerCase().includes(q) ||
        o.customer_phone.includes(q)
    );
  }

  if (!isConfigured) {
    return list;
  }

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
    if (error || !data) {
      console.warn('Fallback to memory orders for admin:', error?.message);
      return list;
    }
    return data as Order[];
  } catch (err) {
    console.error('Failed to get admin orders from Supabase:', err);
    return list;
  }
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order | null> {
  const idx = memoryOrders.findIndex(o => o.id === orderId || o.order_number === orderId);
  const now = new Date().toISOString();
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
      .single();

    if (error || !data) {
      return memoryOrders[idx] || null;
    }
    return data as Order;
  } catch (err) {
    console.error('Error updating order status:', err);
    return memoryOrders[idx] || null;
  }
}

export async function updatePaymentStatus(
  orderId: string,
  paymentStatus: PaymentStatus,
  paymentMethod?: PaymentMethod
): Promise<Order | null> {
  const idx = memoryOrders.findIndex(o => o.id === orderId || o.order_number === orderId);
  const now = new Date().toISOString();
  if (idx !== -1) {
    memoryOrders[idx] = {
      ...memoryOrders[idx],
      payment_status: paymentStatus,
      paid_at: paymentStatus === 'paid' ? now : memoryOrders[idx].paid_at,
      payment_method: paymentMethod || memoryOrders[idx].payment_method,
      order_status: paymentStatus === 'paid' && memoryOrders[idx].order_status === 'received' ? 'brewing' : memoryOrders[idx].order_status,
      updated_at: now,
    };
  }

  const { isConfigured } = getSupabaseEnv();
  if (!isConfigured) {
    return memoryOrders[idx] || null;
  }

  try {
    const supabase = createAdminClient();
    const updatePayload: Record<string, any> = {
      payment_status: paymentStatus,
      updated_at: now,
    };
    if (paymentStatus === 'paid') {
      updatePayload.paid_at = now;
    }
    if (paymentMethod) {
      updatePayload.payment_method = paymentMethod;
    }

    const { data, error } = await supabase
      .from('orders')
      .update(updatePayload)
      .or(`id.eq.${orderId},order_number.eq.${orderId}`)
      .select('*, items:order_items(*)')
      .single();

    if (error || !data) {
      return memoryOrders[idx] || null;
    }
    return data as Order;
  } catch (err) {
    console.error('Error updating payment status:', err);
    return memoryOrders[idx] || null;
  }
}
