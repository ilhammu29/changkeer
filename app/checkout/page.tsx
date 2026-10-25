'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ToteBagIcon, 
  ArrowLeftLineIcon, 
  DiningTableIcon, 
  TakeawayCupIcon, 
  DeliveryBikeIcon, 
  QRISScanIcon, 
  CashierCounterIcon, 
  BankVaultIcon, 
  CheckIcon, 
  PromoTicketIcon, 
  SecureShieldIcon, 
  CraftStarIcon,
  TeaCupIcon 
} from '@/components/icons';
import { useCart } from '@/lib/context/CartContext';
import { ClientLayout } from '@/components/client/ClientLayout';
import { PaymentMethod, OrderType } from '@/types';
import { safeParseCustomerSession } from '@/lib/auth/session-helpers';

function formatRupiah(amount: number): string {
  const safe = Number.isFinite(amount) ? amount : 0;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(safe);
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
  useEffect(() => {
    try {
      const match = document.cookie.match(/changkeer_customer_session=([^;]+)/);
      if (match) {
        const parsed = safeParseCustomerSession(match[1]);
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
        const parsed = safeParseCustomerSession(stored);
        if (parsed?.email) {
          setCustomerEmail(parsed.email);
          if (parsed.full_name) setCustomerName(parsed.full_name);
          if (parsed.phone_number) setCustomerPhone(parsed.phone_number);
        }
      }
    } catch {}
  }, []);

  const validateCheckout = (): boolean => {
    setFormError('');
    if (!customerName.trim()) {
      setFormError('Customer full name is required.');
      return false;
    }
    if (!customerEmail.trim()) {
      setFormError('Customer email address is required.');
      return false;
    }
    if (!customerPhone.trim()) {
      setFormError('WhatsApp / Phone number is required.');
      return false;
    }
    if (orderType === 'dine_in' && !tableNumber.trim()) {
      setFormError('Table number is required for Dine-in orders.');
      return false;
    }
    if (orderType === 'delivery' && !deliveryAddress.trim()) {
      setFormError('Delivery address is required for courier delivery.');
      return false;
    }
    return true;
  };

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
        setVoucherError(data.message || 'Invalid promo code');
      } else {
        applyVoucher(data.voucher, data.discountAmount);
        setVoucherCode('');
      }
    } catch {
      setVoucherError('Failed to validate promo code. Please try again.');
    } finally {
      setVoucherLoading(false);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (items.length === 0) {
      setFormError('Your cart is empty. Please select tea blends to order.');
      return;
    }

    if (!validateCheckout()) {
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        customer_name: customerName.trim(),
        customer_email: customerEmail.trim(),
        customer_phone: customerPhone.trim(),
        order_type: orderType,
        table_number: orderType === 'dine_in' ? (tableNumber.trim() || 'Meja 01') : null,
        pickup_time: orderType === 'takeaway' ? (pickupTime || 'ASAP') : null,
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
        throw new Error(data.error || 'Failed to process order');
      }

      // Clear local cart
      clearCart();

      // Cache order locally for instant client-side hydration
      try {
        localStorage.setItem('changkeer_latest_order', JSON.stringify(data));
        if (data.id) sessionStorage.setItem(`changkeer_order_${data.id}`, JSON.stringify(data));
        if (data.order_number) sessionStorage.setItem(`changkeer_order_${data.order_number}`, JSON.stringify(data));
      } catch {}

      // Redirect to digital receipt & payment screen
      router.push(`/order/success/${data.id || data.order_number}`);
    } catch (err: any) {
      console.error('Checkout error:', err);
      setFormError(err.message || 'A system error occurred while creating your order.');
      setSubmitting(false);
    }
  };

  // If bag is empty
  if (items.length === 0) {
    return (
      <ClientLayout pageTitle="Empty Bag" subtitle="Checkout">
        <div className="flex-1 flex items-center justify-center p-8 font-sans">
          <div className="max-w-md w-full text-center bg-white border border-neutral-200/90 p-8 rounded-3xl shadow-xs space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
              <ToteBagIcon size={32} />
            </div>
            <div>
              <h2 className="font-bold text-xl uppercase tracking-tight text-neutral-900">
                Your Bag is Empty
              </h2>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1 leading-relaxed">
                You haven&apos;t added any herbal tea blends yet. Explore our seasonal 24-solar terms catalog to place an order.
              </p>
            </div>
            <Link
              href="/order"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 font-bold text-xs tracking-wider uppercase transition-all shadow-xs cursor-pointer"
            >
              <span>Explore Menu</span>
            </Link>
          </div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout 
      pageTitle="Order Checkout" 
      subtitle="Complete your order & select payment method"
    >
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-10 font-sans">
        
        {/* Top Back Link */}
        <div className="mb-6 flex items-center justify-between">
          <Link 
            href="/order" 
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeftLineIcon size={16} />
            <span>Back to Tea Menu</span>
          </Link>
          <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest font-semibold">
            SECURE CHECKOUT &bull; CHANGKEER BREW BAR
          </span>
        </div>

        {formError && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-3 animate-in fade-in duration-200">
            <div className="w-2 h-2 rounded-full bg-rose-600 shrink-0" />
            <span className="font-semibold">{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* ========================================================================= */}
          {/* LEFT COLUMN: Customer Information, Dining Mode & Payment Method (7 COLS) */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Customer Contact Details */}
            <div className="bg-white border border-neutral-200/90 rounded-3xl p-5 sm:p-7 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <h3 className="font-bold text-sm uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-neutral-900 text-white text-[10px] flex items-center justify-center font-bold">1</span>
                  <span>Customer Contact</span>
                </h3>
                <span className="text-[10px] font-mono text-neutral-400 uppercase">Required</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-[#FAFAF8] focus:bg-white focus:border-neutral-900 focus:outline-hidden text-xs transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                    WhatsApp / Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g. 081234567890"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-[#FAFAF8] focus:bg-white focus:border-neutral-900 focus:outline-hidden text-xs transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="e.g. john@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-[#FAFAF8] focus:bg-white focus:border-neutral-900 focus:outline-hidden text-xs transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* 2. Fulfillment / Dining Option */}
            <div className="bg-white border border-neutral-200/90 rounded-3xl p-5 sm:p-7 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <h3 className="font-bold text-sm uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-neutral-900 text-white text-[10px] flex items-center justify-center font-bold">2</span>
                  <span>Dining &amp; Fulfillment Mode</span>
                </h3>
              </div>

              {/* 3 Pills */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setOrderType('dine_in')}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                    orderType === 'dine_in'
                      ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                      : 'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700'
                  }`}
                >
                  <DiningTableIcon size={18} className={orderType === 'dine_in' ? 'text-white' : 'text-neutral-600'} />
                  <span className="text-xs font-bold uppercase tracking-wider">Dine-in</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOrderType('takeaway')}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                    orderType === 'takeaway'
                      ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                      : 'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700'
                  }`}
                >
                  <TakeawayCupIcon size={18} className={orderType === 'takeaway' ? 'text-white' : 'text-neutral-600'} />
                  <span className="text-xs font-bold uppercase tracking-wider">Takeaway</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOrderType('delivery')}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                    orderType === 'delivery'
                      ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                      : 'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700'
                  }`}
                >
                  <DeliveryBikeIcon size={18} className={orderType === 'delivery' ? 'text-white' : 'text-neutral-600'} />
                  <span className="text-xs font-bold uppercase tracking-wider">Delivery</span>
                </button>
              </div>

              {/* Contextual fields based on mode */}
              <div className="pt-2 text-xs">
                {orderType === 'dine_in' && (
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                      Table Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      placeholder="e.g. Table 03, Bar Seat A"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-[#FAFAF8] focus:bg-white focus:border-neutral-900 focus:outline-hidden text-xs transition-colors"
                    />
                  </div>
                )}

                {orderType === 'takeaway' && (
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                      Estimated Pickup Schedule
                    </label>
                    <select
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-[#FAFAF8] focus:bg-white focus:border-neutral-900 focus:outline-hidden text-xs transition-colors cursor-pointer"
                    >
                      <option value="ASAP">ASAP (Immediate Brewing ~10-15 Mins)</option>
                      <option value="20 Mins">In 20 Minutes</option>
                      <option value="30 Mins">In 30 Minutes</option>
                      <option value="45 Mins">In 45 Minutes</option>
                    </select>
                  </div>
                )}

                {orderType === 'delivery' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                        Complete Delivery Address *
                      </label>
                      <textarea
                        required
                        rows={2}
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder="Street name, building/house number, unit/apartment number, landmarks..."
                        className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 bg-[#FAFAF8] focus:bg-white focus:border-neutral-900 focus:outline-hidden text-xs transition-colors resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                        Courier Note (Optional)
                      </label>
                      <input
                        type="text"
                        value={deliveryNotes}
                        onChange={(e) => setDeliveryNotes(e.target.value)}
                        placeholder="e.g. Leave with security, ring bell twice"
                        className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 bg-[#FAFAF8] focus:bg-white focus:border-neutral-900 focus:outline-hidden text-xs transition-colors"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 3. Payment Method Selection */}
            <div className="bg-white border border-neutral-200/90 rounded-3xl p-5 sm:p-7 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <h3 className="font-bold text-sm uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-neutral-900 text-white text-[10px] flex items-center justify-center font-bold">3</span>
                  <span>Payment Method</span>
                </h3>
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold uppercase">
                  Zero Fee
                </span>
              </div>

              <div className="space-y-3">
                
                {/* Method 1: QRIS */}
                <div
                  onClick={() => setPaymentMethod('qris')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    paymentMethod === 'qris'
                      ? 'border-neutral-900 bg-[#FAFAF8] ring-2 ring-neutral-900/10 shadow-xs'
                      : 'border-neutral-200 hover:border-neutral-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center shrink-0">
                      <QRISScanIcon size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs uppercase tracking-wider text-neutral-900">
                          QRIS (Auto-Locked Nominal)
                        </span>
                        <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-neutral-900 text-white">
                          RECOMMENDED
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        Scan with GoPay, OVO, Dana, ShopeePay, BCA, Livin Mandiri, or any bank app.
                      </p>
                    </div>
                  </div>

                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                    paymentMethod === 'qris' ? 'border-neutral-900 bg-neutral-900' : 'border-neutral-300'
                  }`}>
                    {paymentMethod === 'qris' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>

                {/* Method 2: Cashier */}
                <div
                  onClick={() => setPaymentMethod('cashier')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    paymentMethod === 'cashier'
                      ? 'border-neutral-900 bg-[#FAFAF8] ring-2 ring-neutral-900/10 shadow-xs'
                      : 'border-neutral-200 hover:border-neutral-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0">
                      <CashierCounterIcon size={20} />
                    </div>
                    <div>
                      <span className="font-bold text-xs uppercase tracking-wider text-neutral-900 block">
                        Pay at Brew Bar Cashier
                      </span>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        Pay via cash, debit card, or EDC machine directly to the barista.
                      </p>
                    </div>
                  </div>

                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                    paymentMethod === 'cashier' ? 'border-neutral-900 bg-neutral-900' : 'border-neutral-300'
                  }`}>
                    {paymentMethod === 'cashier' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>

                {/* Method 3: Bank Transfer */}
                <div
                  onClick={() => setPaymentMethod('bank_transfer')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    paymentMethod === 'bank_transfer'
                      ? 'border-neutral-900 bg-[#FAFAF8] ring-2 ring-neutral-900/10 shadow-xs'
                      : 'border-neutral-200 hover:border-neutral-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center shrink-0">
                      <BankVaultIcon size={20} />
                    </div>
                    <div>
                      <span className="font-bold text-xs uppercase tracking-wider text-neutral-900 block">
                        Manual BCA Bank Transfer
                      </span>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        Transfer to BCA 8280-192-349 and upload proof via WhatsApp.
                      </p>
                    </div>
                  </div>

                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                    paymentMethod === 'bank_transfer' ? 'border-neutral-900 bg-neutral-900' : 'border-neutral-300'
                  }`}>
                    {paymentMethod === 'bank_transfer' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>

              </div>
            </div>

            {/* 4. Special Brewing Notes (Optional) */}
            <div className="bg-white border border-neutral-200/90 rounded-3xl p-5 sm:p-7 shadow-xs">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                Special Steeping or Custom Request (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Please separate ice into a small cup, extra hot steeping..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-[#FAFAF8] focus:bg-white focus:border-neutral-900 focus:outline-hidden text-xs transition-colors"
              />
            </div>

          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: Sticky Order Summary & Pay Action Button (5 COLS)           */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
            
            <div className="bg-white border border-neutral-200/90 rounded-3xl p-5 sm:p-7 shadow-xs space-y-5">
              
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <h3 className="font-bold text-sm uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                  <TeaCupIcon size={16} />
                  <span>Order Summary</span>
                </h3>
                <span className="text-xs font-mono font-bold text-neutral-500">
                  {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'}
                </span>
              </div>

              {/* Items List */}
              <div className="divide-y divide-neutral-100 max-h-72 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.cart_item_id} className="py-3 flex justify-between gap-3 text-xs">
                    <div>
                      <h4 className="font-bold text-neutral-900">{item.product_name}</h4>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        {item.quantity}x &bull; {item.serving_size === 'pot' ? 'Artisan Pot' : 'Single Cup'} &bull; {item.temperature === 'hot' ? 'Hot' : 'Iced'}
                      </p>
                      {item.sweetness_level !== '0%' && (
                        <p className="text-[10px] text-neutral-500 mt-0.5">
                          Sweet: {item.sweetness_level} ({item.sweetener_type})
                        </p>
                      )}
                      {item.selected_addons && item.selected_addons.length > 0 && (
                        <p className="text-[10px] text-neutral-600 mt-0.5">
                          + {item.selected_addons.map((a) => a.name).join(', ')}
                        </p>
                      )}
                    </div>
                    <span className="font-mono font-bold text-neutral-900 text-right shrink-0">
                      {formatRupiah(item.subtotal)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Promo Voucher Box */}
              <div className="pt-3 border-t border-neutral-100 space-y-2">
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400">
                  Promo / Gift Code
                </label>
                
                {appliedVoucher ? (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-emerald-800">
                      <PromoTicketIcon size={16} />
                      <span className="font-mono font-bold">{appliedVoucher.code}</span>
                      <span className="text-[11px]">(-{formatRupiah(discountAmount)})</span>
                    </div>
                    <button
                      type="button"
                      onClick={removeVoucher}
                      className="text-[11px] font-bold text-red-600 hover:text-red-800 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value)}
                      placeholder="e.g. CHANGKEERFIRST"
                      className="flex-1 px-3 py-2 rounded-xl border border-neutral-200 bg-[#FAFAF8] focus:bg-white focus:border-neutral-900 focus:outline-hidden text-xs uppercase font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleApplyVoucher}
                      disabled={voucherLoading || !voucherCode.trim()}
                      className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {voucherLoading ? 'Checking...' : 'Apply'}
                    </button>
                  </div>
                )}
                {voucherError && (
                  <p className="text-[11px] text-red-600 font-medium">{voucherError}</p>
                )}
              </div>

              {/* Financial Calculation Breakdown */}
              <div className="pt-3 border-t border-neutral-100 space-y-2 text-xs text-neutral-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-mono font-bold text-neutral-900">{formatRupiah(subtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Discount:</span>
                    <span className="font-mono">-{formatRupiah(discountAmount)}</span>
                  </div>
                )}

                {orderType === 'delivery' && (
                  <div className="flex justify-between">
                    <span>Courier Delivery Fee:</span>
                    <span className="font-mono font-bold text-neutral-900">{formatRupiah(deliveryFee)}</span>
                  </div>
                )}

                <div className="flex justify-between items-baseline pt-3 border-t border-neutral-200 text-neutral-900">
                  <span className="text-sm font-bold uppercase tracking-tight">Total Payment:</span>
                  <span className="font-mono text-xl font-black text-neutral-900">
                    {formatRupiah(totalAmount)}
                  </span>
                </div>
              </div>

              {/* Primary Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 px-6 rounded-2xl bg-neutral-900 hover:bg-neutral-800 active:scale-98 text-white font-bold text-xs uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <CraftStarIcon size={16} className="text-amber-400 shrink-0" />
                    <span>Place Order &bull; {formatRupiah(totalAmount)}</span>
                  </>
                )}
              </button>

              {/* Security Reassurance */}
              <div className="pt-1 flex items-center justify-center gap-2 text-[11px] text-neutral-400 text-center font-sans">
                <SecureShieldIcon size={14} className="text-emerald-600" />
                <span>Encrypted Transaction &bull; National Standard QRIS</span>
              </div>

            </div>

          </div>

        </form>

      </div>
    </ClientLayout>
  );
}
