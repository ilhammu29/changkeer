'use client';

import React, { useState, useEffect } from 'react';
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
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Check,
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard
} from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import { ClientLayout } from '@/components/client/ClientLayout';
import { PaymentMethod, OrderType } from '@/types';
import { safeParseCustomerSession } from '@/lib/auth/session-helpers';

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

  // Tabbed / Stepped State to prevent vertical sprawl
  const [activeTab, setActiveTab] = useState<'details' | 'payment'>('details');

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

  const isDetailsFilled = Boolean(
    customerName.trim() && 
    customerEmail.trim() && 
    customerPhone.trim() &&
    (orderType !== 'delivery' || deliveryAddress.trim())
  );

  const validateDetailsStep = (): boolean => {
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
      setFormError('Phone / WhatsApp number is required.');
      return false;
    }
    if (orderType === 'delivery' && !deliveryAddress.trim()) {
      setFormError('Delivery address is required for courier delivery.');
      return false;
    }
    return true;
  };

  const handleNextToPayment = (e: React.MouseEvent) => {
    e.preventDefault();
    if (validateDetailsStep()) {
      setActiveTab('payment');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
      setFormError('Your cart is empty');
      return;
    }

    if (!validateDetailsStep()) {
      setActiveTab('details');
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
        throw new Error(data.error || 'Failed to process order');
      }

      // Clear local cart
      clearCart();

      // Redirect to digital receipt & tracker
      router.push(`/order/success/${data.id || data.order_number}`);
    } catch (err: any) {
      console.error('Checkout error:', err);
      setFormError(err.message || 'A system error occurred while creating your order.');
      setSubmitting(false);
    }
  };

  // If cart is empty
  if (items.length === 0) {
    return (
      <ClientLayout pageTitle="Empty Bag" subtitle="Checkout">
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-md w-full text-center bg-white border border-neutral-200/90 p-8 rounded-3xl shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-neutral-100 border border-neutral-200 text-neutral-400 flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
            </div>
            <h2 className="font-sans font-bold text-xl uppercase tracking-tight text-neutral-900 mb-2">
              Bag is Empty
            </h2>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
              You haven&apos;t added any herbal tea blends to your bag yet. Please explore our menu to place an order.
            </p>
            <Link
              href="/order"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 font-bold text-xs tracking-wider uppercase transition-all shadow-xs cursor-pointer"
            >
              <span>Explore Tea Menu</span>
            </Link>
          </div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout 
      pageTitle="Checkout &amp; Payment" 
      subtitle="Review Order Details &amp; Payment Method"
    >
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-5 sm:py-8 font-sans">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-4 sm:mb-6 flex items-center gap-2 text-xs text-neutral-500 font-sans font-semibold uppercase tracking-wider">
          <Link href="/order" className="hover:text-neutral-900 flex items-center gap-1.5 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Tea Catalog</span>
          </Link>
        </div>

        {formError && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
            <span className="font-medium">{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* =========================================================================
              LEFT COLUMN: TABBED / STEPPED CHECKOUT (7 COLS)
              ========================================================================= */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Step Navigation Pill Tabs */}
            <div className="flex p-1.5 rounded-2xl bg-neutral-100 border border-neutral-200/80 gap-1.5 font-sans">
              <button
                type="button"
                onClick={() => setActiveTab('details')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  activeTab === 'details'
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  isDetailsFilled ? 'bg-emerald-600 text-white' : 'bg-neutral-900 text-white'
                }`}>
                  {isDetailsFilled ? <Check className="w-3 h-3 stroke-[3]" /> : '1'}
                </span>
                <span>1. Customer &amp; Dining Mode</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (validateDetailsStep()) {
                    setActiveTab('payment');
                  }
                }}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  activeTab === 'payment'
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[10px] font-bold">
                  2
                </span>
                <span>2. Payment &amp; Notes</span>
              </button>
            </div>

            {/* TAB 1 CONTENT: CUSTOMER INFO & ORDER SERVING MODE */}
            {activeTab === 'details' && (
              <div className="space-y-5">
                
                {/* 1. Customer Information Card */}
                <div className="bg-white border border-neutral-200/90 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                    <h3 className="font-sans font-bold text-sm sm:text-base uppercase tracking-tight text-neutral-900 flex items-center gap-2">
                      <User className="w-4 h-4 text-neutral-700" />
                      <span>Customer Contact Details</span>
                    </h3>
                    <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">Step 1/2</span>
                  </div>

                  <div className="space-y-3.5 text-xs font-sans">
                    <div>
                      <label className="block text-neutral-500 font-sans font-bold mb-1.5 uppercase tracking-wider text-[10px]">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={e => setCustomerName(e.target.value)}
                        placeholder="E.g. Jane Doe"
                        className="w-full bg-[#FAFAF8] border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 font-sans transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-neutral-500 font-sans font-bold mb-1.5 uppercase tracking-wider text-[10px]">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={customerEmail}
                          onChange={e => setCustomerEmail(e.target.value)}
                          placeholder="jane@example.com"
                          className="w-full bg-[#FAFAF8] border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 font-sans transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-500 font-sans font-bold mb-1.5 uppercase tracking-wider text-[10px]">
                          WhatsApp / Phone *
                        </label>
                        <input
                          type="tel"
                          required
                          value={customerPhone}
                          onChange={e => setCustomerPhone(e.target.value)}
                          placeholder="081234567890"
                          className="w-full bg-[#FAFAF8] border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 font-sans transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Order Mode & Location Card */}
                <div className="bg-white border border-neutral-200/90 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                    <h3 className="font-sans font-bold text-sm sm:text-base uppercase tracking-tight text-neutral-900 flex items-center gap-2">
                      <UtensilsCrossed className="w-4 h-4 text-neutral-700" />
                      <span>Cafe Dining Mode</span>
                    </h3>
                    <span className="text-[10px] font-mono text-emerald-700 font-bold uppercase">
                      {orderType === 'dine_in' ? 'Dine-In' : orderType === 'takeaway' ? 'Takeaway' : 'Delivery'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {(
                      [
                        { type: 'dine_in', label: 'Dine-In', icon: UtensilsCrossed, desc: 'Served at cafe table' },
                        { type: 'takeaway', label: 'Takeaway', icon: Package, desc: 'Pick up at brew bar' },
                        { type: 'delivery', label: 'Delivery', icon: Bike, desc: 'Courier delivery (+Rp 10K)' },
                      ] as const
                    ).map(({ type, label, icon: Icon, desc }) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setOrderType(type as OrderType)}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex sm:flex-col items-center sm:items-start justify-between sm:justify-between gap-3 ${
                          orderType === type
                            ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                            : 'border-neutral-200/80 hover:border-neutral-300 text-neutral-700 bg-[#FAFAF8]'
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
                          <span className="text-[9px] font-bold uppercase sm:hidden bg-white/20 px-2 py-0.5 rounded-md">Active</span>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Conditional location fields */}
                  {orderType === 'dine_in' && (
                    <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-neutral-200/80 space-y-2">
                      <label className="block text-[10px] font-sans font-bold uppercase tracking-wider text-neutral-500">
                        Select Cafe Table
                      </label>
                      <select
                        value={tableNumber}
                        onChange={e => setTableNumber(e.target.value)}
                        className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-neutral-900 focus:outline-none focus:border-neutral-900 font-sans cursor-pointer"
                      >
                        <option value="Meja 01">Table 01 (Indoor Window)</option>
                        <option value="Meja 02">Table 02 (Indoor Center)</option>
                        <option value="Meja 03">Table 03 (Botanical Lounge)</option>
                        <option value="Meja 04">Table 04 (Communal Table)</option>
                        <option value="Meja 05">Table 05 (Garden Terrace)</option>
                        <option value="Bar 06">Bar 06 (Counter Barista)</option>
                      </select>
                    </div>
                  )}

                  {orderType === 'takeaway' && (
                    <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-neutral-200/80 space-y-2">
                      <label className="block text-[10px] font-sans font-bold uppercase tracking-wider text-neutral-500">
                        Estimated Pickup Time
                      </label>
                      <select
                        value={pickupTime}
                        onChange={e => setPickupTime(e.target.value)}
                        className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-amber-800 focus:outline-none focus:border-neutral-900 font-sans cursor-pointer"
                      >
                        <option value="Segera">ASAP (5-10 Mins)</option>
                        <option value="15 Menit Lagi">In 15 Mins</option>
                        <option value="30 Menit Lagi">In 30 Mins</option>
                        <option value="45 Menit Lagi">In 45 Mins</option>
                        <option value="1 Jam Lagi">In 1 Hour</option>
                      </select>
                    </div>
                  )}

                  {orderType === 'delivery' && (
                    <div className="p-4 rounded-2xl bg-[#FAFAF8] border border-neutral-200/80 space-y-3">
                      <div>
                        <label className="block text-[10px] font-sans font-bold uppercase tracking-wider text-neutral-500 mb-1">
                          Complete Delivery Address *
                        </label>
                        <textarea
                          required
                          rows={2}
                          value={deliveryAddress}
                          onChange={e => setDeliveryAddress(e.target.value)}
                          placeholder="Street, Building/House Number, Floor, District, Landmark..."
                          className="w-full bg-white border border-neutral-200 rounded-xl p-3 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 font-sans"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-sans font-bold uppercase tracking-wider text-neutral-500 mb-1">
                          Special Driver Instructions (Optional)
                        </label>
                        <input
                          type="text"
                          value={deliveryNotes}
                          onChange={e => setDeliveryNotes(e.target.value)}
                          placeholder="E.g. Leave at lobby reception / security post..."
                          className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 font-sans"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Next Step CTA */}
                <button
                  type="button"
                  onClick={handleNextToPayment}
                  className="w-full py-3.5 px-6 rounded-2xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98 transition-all"
                >
                  <span>Continue to Payment &amp; Notes</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>

              </div>
            )}

            {/* TAB 2 CONTENT: PAYMENT METHOD & BARISTA NOTES */}
            {activeTab === 'payment' && (
              <div className="space-y-5">
                
                {/* 1. Payment Method Card */}
                <div className="bg-white border border-neutral-200/90 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                    <h3 className="font-sans font-bold text-sm sm:text-base uppercase tracking-tight text-neutral-900 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-neutral-700" />
                      <span>Payment Method</span>
                    </h3>
                    <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">Step 2/2</span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    {(
                      [
                        {
                          method: 'qris',
                          label: 'QRIS Real-Time (All E-Wallets & Banks)',
                          icon: QrCode,
                          badge: 'Recommended',
                          desc: 'Instant scan via GoPay, OVO, Dana, ShopeePay, BCA, Mandiri, BRI.',
                        },
                        {
                          method: 'cashier',
                          label: 'Pay at Cafe Counter / Bar Cashier',
                          icon: Wallet,
                          badge: 'Cash / EDC',
                          desc: 'Pay with cash or card directly when collecting your tea at the brew bar.',
                        },
                        {
                          method: 'bank_transfer',
                          label: 'Manual Bank Transfer',
                          icon: Building2,
                          badge: 'BCA Atelier',
                          desc: 'BCA 123-456-7890 a/n CHANGKEER ATELIER.',
                        },
                      ] as const
                    ).map(({ method, label, icon: Icon, badge, desc }) => (
                      <label
                        key={method}
                        className={`flex items-start gap-3.5 p-4 rounded-2xl border transition-all cursor-pointer ${
                          paymentMethod === method
                            ? 'border-neutral-900 bg-neutral-50 shadow-xs'
                            : 'border-neutral-200/80 hover:border-neutral-300 bg-white'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment_method"
                          value={method}
                          checked={paymentMethod === method}
                          onChange={() => setPaymentMethod(method as PaymentMethod)}
                          className="mt-1 text-neutral-900 focus:ring-neutral-900 cursor-pointer"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 font-bold text-neutral-900">
                              <Icon className="w-4 h-4 text-neutral-700" />
                              <span>{label}</span>
                            </div>
                            <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-neutral-200/70 text-neutral-700">
                              {badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-500 mt-0.5">{desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 2. Barista Notes Card */}
                <div className="bg-white border border-neutral-200/90 rounded-3xl p-5 sm:p-6 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-[10px] font-sans font-bold uppercase tracking-wider text-neutral-500">
                      Special Instructions for Barista (Optional)
                    </label>
                    <span className="text-[10px] text-neutral-400">Brewing Notes</span>
                  </div>

                  <textarea
                    rows={2}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="E.g. Extra hot, separate sweetener, bamboo straw..."
                    className="w-full bg-[#FAFAF8] border border-neutral-200 rounded-xl p-3 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 font-sans"
                  />

                  {/* Micro note suggestions */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {['Stronger Brew', 'Separate Sweetener', 'Less Ice', 'Extra Cup'].map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => setNotes(prev => prev ? `${prev}, ${chip}` : chip)}
                        className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[10px] font-semibold transition-colors cursor-pointer"
                      >
                        + {chip}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Navigation Back / Next CTA Row */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('details')}
                    className="py-3.5 px-5 rounded-2xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-800 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Details</span>
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3.5 px-6 rounded-2xl bg-neutral-900 hover:bg-neutral-800 active:scale-98 disabled:opacity-50 text-white font-sans font-bold text-xs uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {submitting ? (
                      <span>Processing Order...</span>
                    ) : (
                      <>
                        <span className="truncate">Pay Now &bull; {formatRupiah(totalAmount)}</span>
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                      </>
                    )}
                  </button>
                </div>

              </div>
            )}

          </div>

          {/* =========================================================================
              RIGHT COLUMN: ORDER SUMMARY & VOUCHER (5 COLS)
              ========================================================================= */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-6">
            
            <div className="bg-white border border-neutral-200/90 rounded-3xl p-5 sm:p-6 shadow-xs space-y-5 lg:sticky lg:top-24">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-neutral-100">
                <div>
                  <h3 className="font-sans font-bold text-sm sm:text-base uppercase tracking-tight text-neutral-900">
                    Order Summary ({totalItemCount})
                  </h3>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    Mode: {orderType === 'dine_in' ? `Dine-In (${tableNumber})` : orderType === 'takeaway' ? 'Takeaway' : 'Delivery'}
                  </span>
                </div>
                <Link
                  href="/order"
                  className="text-xs text-neutral-500 hover:text-neutral-900 font-bold uppercase tracking-wider"
                >
                  Edit
                </Link>
              </div>

              {/* Items List */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1 divide-y divide-neutral-100 scrollbar-thin">
                {items.map(item => (
                  <div key={item.cart_item_id} className="pt-3 first:pt-0 flex items-start justify-between gap-3 text-xs">
                    <div>
                      <div className="font-bold text-neutral-900 font-sans">
                        {item.product_name} <span className="text-neutral-400 font-normal">x{item.quantity}</span>
                      </div>
                      <div className="text-[11px] text-neutral-500 mt-0.5 font-sans">
                        {item.temperature === 'hot' ? 'Hot' : 'Iced (+2K)'} &bull; Sweet: {item.sweetness_level}
                        {item.selected_addons?.length ? ` &bull; +${item.selected_addons.map(a => a.name).join(', ')}` : ''}
                      </div>
                    </div>
                    <span className="font-mono font-bold text-neutral-900 shrink-0">
                      {formatRupiah(item.subtotal)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Voucher Input */}
              <div className="pt-3 border-t border-neutral-100">
                {appliedVoucher ? (
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                    <div className="flex items-center gap-2">
                      <Ticket className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <span className="font-bold uppercase tracking-wider font-mono">{appliedVoucher.code}</span>
                        <div className="text-[10px] text-emerald-700 font-sans">Saved {formatRupiah(discountAmount)}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeVoucher}
                      className="text-neutral-400 hover:text-red-600 text-xs font-bold font-sans cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="PROMO / VOUCHER CODE"
                        value={voucherCode}
                        onChange={e => setVoucherCode(e.target.value.toUpperCase())}
                        className="flex-1 min-w-0 bg-[#FAFAF8] border border-neutral-200 rounded-xl px-3 py-2 text-xs font-mono uppercase text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900"
                      />
                      <button
                        type="button"
                        onClick={handleApplyVoucher}
                        disabled={voucherLoading || !voucherCode.trim()}
                        className="px-3.5 py-2 bg-neutral-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 disabled:opacity-50 transition-colors shrink-0 cursor-pointer font-sans"
                      >
                        {voucherLoading ? '...' : 'Apply'}
                      </button>
                    </div>
                    {voucherError && (
                      <p className="text-[10px] text-red-600 pl-1 font-sans">{voucherError}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Price Calculation breakdown */}
              <div className="pt-3 border-t border-neutral-100 space-y-2 text-xs font-sans">
                <div className="flex justify-between text-neutral-500">
                  <span>Subtotal:</span>
                  <span className="text-neutral-900 font-bold font-mono">{formatRupiah(subtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Voucher Discount:</span>
                    <span className="font-bold font-mono">-{formatRupiah(discountAmount)}</span>
                  </div>
                )}

                {deliveryFee > 0 && (
                  <div className="flex justify-between text-neutral-500">
                    <span>Delivery Fee:</span>
                    <span className="text-neutral-900 font-bold font-mono">{formatRupiah(deliveryFee)}</span>
                  </div>
                )}

                <div className="flex justify-between items-baseline pt-3 border-t border-neutral-200 text-sm sm:text-base font-bold text-neutral-900 font-sans">
                  <span>Total Amount:</span>
                  <span className="font-mono font-bold text-lg sm:text-xl text-neutral-900">{formatRupiah(totalAmount)}</span>
                </div>
              </div>

              {/* Submit CTA */}
              {activeTab === 'details' ? (
                <button
                  type="button"
                  onClick={handleNextToPayment}
                  className="w-full py-3.5 px-4 rounded-2xl bg-neutral-900 hover:bg-neutral-800 active:scale-98 text-white font-sans font-bold text-xs uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Continue to Payment &rarr;</span>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 px-4 rounded-2xl bg-neutral-900 hover:bg-neutral-800 active:scale-98 disabled:opacity-50 text-white font-sans font-bold text-xs uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  {submitting ? (
                    <span>Processing Order...</span>
                  ) : (
                    <>
                      <span className="truncate">Pay Now &bull; {formatRupiah(totalAmount)}</span>
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                    </>
                  )}
                </button>
              )}

              <div className="flex items-center justify-center gap-2 text-[10px] font-sans text-neutral-400 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="leading-tight">Encrypted Transaction &bull; Direct Barista Dispatch</span>
              </div>

            </div>

          </div>

        </form>

      </div>
    </ClientLayout>
  );
}
