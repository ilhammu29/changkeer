'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ShoppingBag, 
  ArrowLeft, 
  UtensilsCrossed, 
  Package, 
  Bike, 
  QrCode, 
  Wallet, 
  Building2, 
  CheckCircle2, 
  Ticket, 
  AlertCircle,
  Clock,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import { ClientLayout } from '@/components/client/ClientLayout';
import { PaymentMethod, OrderType } from '@/types';

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    clearCart,
    orderType,
    setOrderType,
    tableNumber,
    setTableNumber,
    pickupTime,
    setPickupTime,
    deliveryAddress,
    setDeliveryAddress,
    deliveryNotes,
    setDeliveryNotes,
    appliedVoucher,
    discountAmount,
    applyVoucher,
    removeVoucher,
    subtotal,
    deliveryFee,
    totalAmount,
    totalItemCount,
  } = useCart();

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('qris');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Voucher state
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherLoading, setVoucherLoading] = useState(false);
  const [voucherError, setVoucherError] = useState('');

  // Auto-fill from customer session
  React.useEffect(() => {
    try {
      const match = document.cookie.match(/changkeer_customer_session=([^;]+)/);
      if (match) {
        const parsed = JSON.parse(decodeURIComponent(match[1]));
        if (parsed?.email) {
          setCustomerEmail(parsed.email);
          if (parsed.full_name) setCustomerName(parsed.full_name);
          if (parsed.phone_number) setCustomerPhone(parsed.phone_number);
          return;
        }
      }
    } catch {}

    try {
      const stored = localStorage.getItem('changkeer_customer_session');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.email) {
          setCustomerEmail(parsed.email);
          if (parsed.full_name) setCustomerName(parsed.full_name);
          if (parsed.phone_number) setCustomerPhone(parsed.phone_number);
        }
      }
    } catch {}
  }, []);

  const handleApplyVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    setVoucherError('');
    if (!voucherCode.trim()) return;

    setVoucherLoading(true);
    try {
      const res = await fetch('/api/vouchers/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: voucherCode, subtotal }),
      });
      const data = await res.json();
      if (!res.ok || !data.isValid) {
        setVoucherError(data.message || 'Kode voucher tidak valid');
      } else {
        applyVoucher(data.voucher, data.discountAmount);
        setVoucherCode('');
      }
    } catch {
      setVoucherError('Gagal memvalidasi voucher');
    } finally {
      setVoucherLoading(false);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (items.length === 0) {
      setFormError('Keranjang Anda kosong');
      return;
    }
    if (!customerName.trim()) {
      setFormError('Nama lengkap wajib diisi.');
      return;
    }
    if (!customerEmail.trim()) {
      setFormError('Alamat email wajib diisi.');
      return;
    }
    if (!customerPhone.trim()) {
      setFormError('Nomor telepon / WhatsApp wajib diisi.');
      return;
    }

    if (orderType === 'delivery' && !deliveryAddress.trim()) {
      setFormError('Alamat pengiriman wajib diisi untuk pesanan delivery.');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        customer_name: customerName.trim(),
        customer_email: customerEmail.trim(),
        customer_phone: customerPhone.trim(),
        order_type: orderType,
        table_number: orderType === 'dine_in' ? tableNumber : null,
        pickup_time: orderType === 'takeaway' ? pickupTime : null,
        delivery_address: orderType === 'delivery' ? deliveryAddress.trim() : null,
        delivery_notes: orderType === 'delivery' ? deliveryNotes.trim() : null,
        subtotal,
        discount_amount: discountAmount,
        delivery_fee: deliveryFee,
        tax_amount: 0,
        total_amount: totalAmount,
        voucher_id: appliedVoucher?.id || null,
        voucher_code: appliedVoucher?.code || null,
        payment_method: paymentMethod,
        notes: notes.trim() || null,
        items,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Gagal memproses pesanan');
      }

      // Clear local cart
      clearCart();

      // Redirect to digital receipt & tracker
      router.push(`/order/success/${data.id || data.order_number}`);
    } catch (err: any) {
      console.error('Checkout error:', err);
      setFormError(err.message || 'Terjadi kesalahan sistem saat membuat pesanan.');
      setSubmitting(false);
    }
  };

  // If cart is empty
  if (items.length === 0) {
    return (
      <ClientLayout pageTitle="Keranjang Kosong" subtitle="Kasir &amp; Checkout">
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-md w-full text-center bg-white border border-neutral-200 p-8 rounded-3xl shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-neutral-100 border border-neutral-200 text-neutral-400 flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
            </div>
            <h2 className="font-sans font-black text-xl uppercase tracking-tight text-neutral-900 mb-2">
              Keranjang Belum Terisi
            </h2>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
              Anda belum menambahkan racikan teh ke keranjang. Silakan pilih menu di katalog untuk melanjutkan pesanan.
            </p>
            <Link
              href="/order"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 font-bold text-xs tracking-wider uppercase transition-all shadow-xs cursor-pointer"
            >
              <span>Buka Menu Seduhan</span>
            </Link>
          </div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout 
      pageTitle="Kasir &amp; Pembayaran" 
      subtitle="Konfirmasi Rincian Pesanan &amp; Pembayaran Cafe"
    >
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-5 sm:py-10">
        
        {/* Breadcrumb */}
        <div className="mb-4 sm:mb-6 flex items-center gap-2 text-xs text-neutral-500 font-sans font-semibold uppercase tracking-wider">
          <Link href="/order" className="hover:text-neutral-900 flex items-center gap-1.5 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Katalog Seduhan</span>
          </Link>
        </div>

        {formError && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* Left Form Column (7 Cols) */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            
            {/* 1. Customer Information */}
            <div className="bg-white border border-neutral-200/90 rounded-2xl p-4 sm:p-6 shadow-xs">
              <h3 className="font-sans font-black text-base uppercase tracking-tight text-neutral-900 mb-4 flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-neutral-900 text-white text-xs font-sans flex items-center justify-center font-bold">1</span>
                <span>Informasi Pemesan</span>
              </h3>

              <div className="space-y-3.5 sm:space-y-4 text-xs font-sans">
                <div>
                  <label className="block text-neutral-500 font-sans font-bold mb-1.5 uppercase tracking-wider text-[10px]">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full bg-[#FAFAF8] border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 font-sans"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                  <div>
                    <label className="block text-neutral-500 font-sans font-bold mb-1.5 uppercase tracking-wider text-[10px]">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={e => setCustomerEmail(e.target.value)}
                      placeholder="budi@example.com"
                      className="w-full bg-[#FAFAF8] border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-500 font-sans font-bold mb-1.5 uppercase tracking-wider text-[10px]">
                      WhatsApp / No. HP *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={e => setCustomerPhone(e.target.value)}
                      placeholder="081234567890"
                      className="w-full bg-[#FAFAF8] border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 font-sans"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Order Mode & Location */}
            <div className="bg-white border border-neutral-200/90 rounded-2xl p-4 sm:p-6 shadow-xs">
              <h3 className="font-sans font-black text-base uppercase tracking-tight text-neutral-900 mb-4 flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-neutral-900 text-white text-xs font-sans flex items-center justify-center font-bold">2</span>
                <span>Pilihan Penyajian Cafe</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 mb-4">
                {(
                  [
                    { type: 'dine_in', label: 'Dine-In', icon: UtensilsCrossed, desc: 'Disajikan di meja cafe' },
                    { type: 'takeaway', label: 'Takeaway', icon: Package, desc: 'Bawa pulang (siap ambil)' },
                    { type: 'delivery', label: 'Delivery', icon: Bike, desc: 'Kirim kurir (+Rp 10.000)' },
                  ] as const
                ).map(({ type, label, icon: Icon, desc }) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setOrderType(type as OrderType)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex sm:flex-col items-center sm:items-start justify-between sm:justify-between gap-3 ${
                      orderType === type
                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                        : 'border-neutral-200 hover:border-neutral-300 text-neutral-700 bg-[#FAFAF8]'
                    }`}
                  >
                    <div className="flex sm:flex-col items-center sm:items-start gap-2.5 sm:gap-0">
                      <Icon className="w-4 h-4 sm:mb-2 shrink-0" />
                      <div>
                        <div className="font-bold text-xs">{label}</div>
                        <div className={`text-[10px] mt-0.5 ${orderType === type ? 'text-neutral-300' : 'text-neutral-400'}`}>
                          {desc}
                        </div>
                      </div>
                    </div>
                    {orderType === type && (
                      <span className="text-[10px] font-bold uppercase sm:hidden bg-white/20 px-2 py-0.5 rounded">Aktif</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Conditional location fields */}
              {orderType === 'dine_in' && (
                <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-neutral-200 space-y-2">
                  <label className="block text-[10px] font-sans font-bold uppercase tracking-wider text-neutral-500">
                    Nomor Meja Cafe
                  </label>
                  <select
                    value={tableNumber}
                    onChange={e => setTableNumber(e.target.value)}
                    className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs font-bold text-neutral-900 focus:outline-none focus:border-neutral-900 font-sans"
                  >
                    <option value="Meja 01">Meja 01 (Indoor Window)</option>
                    <option value="Meja 02">Meja 02 (Indoor Center)</option>
                    <option value="Meja 03">Meja 03 (Botanical Lounge)</option>
                    <option value="Meja 04">Meja 04 (Communal Table)</option>
                    <option value="Meja 05">Meja 05 (Garden Terrace)</option>
                    <option value="Bar 06">Bar 06 (Counter Barista)</option>
                  </select>
                </div>
              )}

              {orderType === 'takeaway' && (
                <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-neutral-200 space-y-2">
                  <label className="block text-[10px] font-sans font-bold uppercase tracking-wider text-neutral-500">
                    Perkiraan Waktu Pengambilan
                  </label>
                  <select
                    value={pickupTime}
                    onChange={e => setPickupTime(e.target.value)}
                    className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs font-bold text-amber-700 focus:outline-none focus:border-neutral-900 font-sans"
                  >
                    <option value="Segera">Segera (5-10 Menit)</option>
                    <option value="15 Menit Lagi">15 Menit Lagi</option>
                    <option value="30 Menit Lagi">30 Menit Lagi</option>
                    <option value="45 Menit Lagi">45 Menit Lagi</option>
                    <option value="1 Jam Lagi">1 Jam Lagi</option>
                  </select>
                </div>
              )}

              {orderType === 'delivery' && (
                <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-neutral-200 space-y-3">
                  <div>
                    <label className="block text-[10px] font-sans font-bold uppercase tracking-wider text-neutral-500 mb-1">
                      Alamat Pengiriman Lengkap *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={deliveryAddress}
                      onChange={e => setDeliveryAddress(e.target.value)}
                      placeholder="Jalan, Nomor Rumah, RT/RW, Kecamatan, Patokan lokasi..."
                      className="w-full bg-white border border-neutral-200 rounded-xl p-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-sans font-bold uppercase tracking-wider text-neutral-500 mb-1">
                      Catatan Pengantaran (Opsional)
                    </label>
                    <input
                      type="text"
                      value={deliveryNotes}
                      onChange={e => setDeliveryNotes(e.target.value)}
                      placeholder="Contoh: Titipkan di satpam cluster..."
                      className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 font-sans"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 3. Payment Method */}
            <div className="bg-white border border-neutral-200/90 rounded-2xl p-4 sm:p-6 shadow-xs">
              <h3 className="font-sans font-black text-base uppercase tracking-tight text-neutral-900 mb-4 flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-neutral-900 text-white text-xs font-sans flex items-center justify-center font-bold">3</span>
                <span>Metode Pembayaran</span>
              </h3>

              <div className="space-y-3 text-xs">
                {(
                  [
                    {
                      method: 'qris',
                      label: 'QRIS Real-Time (Semua E-Wallet & Mobile Banking)',
                      icon: QrCode,
                      desc: 'Scan instan via GoPay, OVO, Dana, BCA, Mandiri, BRI.',
                    },
                    {
                      method: 'cashier',
                      label: 'Bayar Langsung di Kasir / Bar',
                      icon: Wallet,
                      desc: 'Bayar tunai atau kartu EDC saat mengambil seduhan di bar cafe.',
                    },
                    {
                      method: 'bank_transfer',
                      label: 'Transfer Bank Manual',
                      icon: Building2,
                      desc: 'BCA 123-456-7890 a/n CHANGKEER ATELIER.',
                    },
                  ] as const
                ).map(({ method, label, icon: Icon, desc }) => (
                  <label
                    key={method}
                    className={`flex items-start gap-3.5 p-4 rounded-2xl border transition-all cursor-pointer ${
                      paymentMethod === method
                        ? 'border-neutral-900 bg-neutral-50'
                        : 'border-neutral-200 hover:border-neutral-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value={method}
                      checked={paymentMethod === method}
                      onChange={() => setPaymentMethod(method as PaymentMethod)}
                      className="mt-0.5 text-neutral-900 focus:ring-neutral-900 cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 font-bold text-neutral-900">
                        <Icon className="w-4 h-4 text-neutral-700" />
                        <span>{label}</span>
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-0.5">{desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* 4. Notes */}
            <div className="bg-white border border-neutral-200/90 rounded-2xl p-4 sm:p-6 shadow-xs">
              <label className="block text-[10px] font-sans font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                Catatan Tambahan untuk Barista (Opsional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Contoh: Seduhan dibuat lebih kental, pisahkan pemanis..."
                className="w-full bg-[#FAFAF8] border border-neutral-200 rounded-xl p-3 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 font-sans"
              />
            </div>

          </div>

          {/* Right Summary Column (5 Cols) */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-6">
            
            <div className="bg-white border border-neutral-200/90 rounded-2xl p-4 sm:p-6 shadow-xs space-y-5 sm:space-y-6 lg:sticky lg:top-24">
              <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-neutral-100">
                <h3 className="font-sans font-black text-sm sm:text-base uppercase tracking-tight text-neutral-900">
                  Ringkasan Pesanan ({totalItemCount})
                </h3>
                <Link
                  href="/order"
                  className="text-xs text-neutral-500 hover:text-neutral-900 font-bold uppercase tracking-wider"
                >
                  Ubah
                </Link>
              </div>

              {/* Items List */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1 divide-y divide-neutral-100">
                {items.map(item => (
                  <div key={item.cart_item_id} className="pt-3 first:pt-0 flex items-start justify-between gap-3 text-xs">
                    <div>
                      <div className="font-bold text-neutral-900 font-sans">
                        {item.product_name} <span className="text-neutral-400 font-normal">x{item.quantity}</span>
                      </div>
                      <div className="text-[11px] text-neutral-500 mt-0.5 font-sans">
                        {item.temperature === 'hot' ? 'Hangat' : 'Dingin'} &bull; Gula: {item.sweetness_level}
                        {item.selected_addons?.length ? ` &bull; +${item.selected_addons.map(a => a.name).join(', ')}` : ''}
                      </div>
                    </div>
                    <span className="font-sans font-bold text-neutral-900 shrink-0">
                      {formatRupiah(item.subtotal)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Voucher Section */}
              <div className="pt-3 sm:pt-4 border-t border-neutral-100">
                {appliedVoucher ? (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                    <div className="flex items-center gap-2">
                      <Ticket className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <span className="font-bold uppercase tracking-wider font-sans">{appliedVoucher.code}</span>
                        <div className="text-[10px] text-emerald-700 font-sans">Hemat {formatRupiah(discountAmount)}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeVoucher}
                      className="text-neutral-400 hover:text-red-600 text-xs font-bold font-sans cursor-pointer"
                    >
                      Batal
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="KODE PROMO / VOUCHER"
                        value={voucherCode}
                        onChange={e => setVoucherCode(e.target.value.toUpperCase())}
                        className="flex-1 min-w-0 bg-[#FAFAF8] border border-neutral-200 rounded-xl px-3 py-2 text-xs font-sans uppercase text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900"
                      />
                      <button
                        type="button"
                        onClick={handleApplyVoucher}
                        disabled={voucherLoading || !voucherCode.trim()}
                        className="px-3 sm:px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 disabled:opacity-50 transition-colors shrink-0 cursor-pointer font-sans"
                      >
                        {voucherLoading ? '...' : 'Gunakan'}
                      </button>
                    </div>
                    {voucherError && (
                      <p className="text-[10px] text-red-600 pl-1 font-sans">{voucherError}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Price Calculation breakdown */}
              <div className="pt-3 sm:pt-4 border-t border-neutral-100 space-y-2 text-xs font-sans">
                <div className="flex justify-between text-neutral-500">
                  <span>Subtotal:</span>
                  <span className="text-neutral-900 font-bold">{formatRupiah(subtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Diskon Voucher:</span>
                    <span className="font-bold">-{formatRupiah(discountAmount)}</span>
                  </div>
                )}

                {deliveryFee > 0 && (
                  <div className="flex justify-between text-neutral-500">
                    <span>Biaya Antar:</span>
                    <span className="text-neutral-900 font-bold">{formatRupiah(deliveryFee)}</span>
                  </div>
                )}

                <div className="flex justify-between items-baseline pt-3 border-t border-neutral-200 text-sm sm:text-base font-black text-neutral-900 font-sans">
                  <span>Total Tagihan:</span>
                  <span className="font-sans font-black text-lg sm:text-xl text-neutral-900">{formatRupiah(totalAmount)}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl bg-neutral-900 hover:bg-neutral-800 active:scale-98 disabled:opacity-50 text-white font-sans font-bold text-xs uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                {submitting ? (
                  <span>Memproses Pesanan...</span>
                ) : (
                  <>
                    <span className="truncate">Bayar Sekarang &bull; {formatRupiah(totalAmount)}</span>
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] font-sans text-neutral-400 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="leading-tight">Transaksi Terenkripsi &amp; Terhubung ke Kitchen Barista</span>
              </div>

            </div>

          </div>

        </form>

      </div>
    </ClientLayout>
  );
}
