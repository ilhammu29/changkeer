import { Order } from '@/types';

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function generateWhatsAppReceiptText(order: Order, origin?: string): string {
  const dateFormatted = new Date(order.created_at).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const orderTypeLabel = 
    order.order_type === 'dine_in' 
      ? `DINE-IN (${order.table_number || 'Meja Cafe'})` 
      : order.order_type === 'takeaway' 
        ? `TAKEAWAY (Ambil: ${order.pickup_time || 'Segera'})` 
        : `DELIVERY (Kirim: ${order.delivery_address || '-'})`;

  const itemsList = (order.items || []).map((item, idx) => {
    const tempText = item.temperature === 'hot' ? 'Hangat' : 'Dingin';
    const sweetText = item.sweetness_level;
    const addons = item.selected_addons && item.selected_addons.length > 0 
      ? `\n   + Tambahan: ${item.selected_addons.map(a => a.name).join(', ')}` 
      : '';
    const notes = item.item_notes ? `\n   Catatan: "${item.item_notes}"` : '';

    return `${idx + 1}. *${item.product_name}* (${item.quantity}x)
   - Suhu: ${tempText} | Gula: ${sweetText}${addons}${notes}
   - Subtotal: ${formatRupiah(item.subtotal)}`;
  }).join('\n\n');

  const discountLine = order.discount_amount > 0 
    ? `\nDiskon Promo: -${formatRupiah(order.discount_amount)} (${order.voucher_code || ''})` 
    : '';

  const deliveryLine = order.delivery_fee > 0 
    ? `\nOngkir Delivery: +${formatRupiah(order.delivery_fee)}` 
    : '';

  const trackUrl = origin 
    ? `${origin}/order/success/${order.id}` 
    : `https://changkeer.vercel.app/order/success/${order.id}`;

  return `🍵 *STRUK PESANAN CHANGKEER BREW BAR*
No. Tiket: *#${order.order_number}*
Pemesan: ${order.customer_name} (${order.customer_phone})
Mode Saji: *${orderTypeLabel}*
Waktu: ${dateFormatted} WIB
-----------------------------------------
*RINCIAN SEDUHAN:*
${itemsList}
-----------------------------------------
Subtotal: ${formatRupiah(order.subtotal)}${discountLine}${deliveryLine}
*TOTAL PEMBAYARAN: ${formatRupiah(order.total_amount)}*
Metode: ${order.payment_method.toUpperCase()} (${order.payment_status === 'paid' ? 'LUNAS ✅' : 'MENUNGGU PEMBAYARAN ⏳'})
-----------------------------------------
🔗 *Lacak Status Seduhan Real-time:*
${trackUrl}

Mohon diseduh ya Barista, terima kasih! 🙏`;
}

export function getWhatsAppUrl(phone: string, text: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const standardPhone = cleanPhone.startsWith('0') 
    ? `62${cleanPhone.slice(1)}` 
    : cleanPhone.startsWith('62') 
      ? cleanPhone 
      : `62${cleanPhone}`;

  return `https://wa.me/${standardPhone}?text=${encodeURIComponent(text)}`;
}
