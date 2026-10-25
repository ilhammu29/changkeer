'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  AlertCircle,
} from 'lucide-react';
import {
  CheckCircleIcon,
  CheckIcon,
  BrewClockIcon,
  ThermalSlipIcon,
  WhatsAppIcon,
  CopyClipboardIcon,
  ArrowRightLineIcon,
  DiningTableIcon,
  TakeawayCupIcon,
  DeliveryBikeIcon,
  CashierCounterIcon,
  BankVaultIcon,
  CraftStarIcon
} from '@/components/icons';
import { Order, OrderStatus } from '@/types';
import { generateWhatsAppReceiptText, getWhatsAppUrl } from '@/lib/utils/whatsapp';
import { ThermalReceiptModal } from '@/components/order/ThermalReceiptModal';
import { DynamicQRISCard } from '@/components/order/DynamicQRISCard';

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

const STATUS_STEPS: { key: OrderStatus; label: string; desc: string }[] = [
  { key: 'received', label: 'Order Received', desc: 'Ticket received by barista counter' },
  { key: 'brewing', label: 'Brewing Now', desc: 'Pure herbs steeping at precise temperature' },
  { key: 'ready', label: 'Ready to Serve', desc: 'Tea ready for table delivery or bar pick-up' },
  { key: 'completed', label: 'Completed', desc: 'Enjoy your pure artisanal tea' },
];

export default function OrderSuccessPage({
  params,
}: {
  params?: Promise<{ id: string }> | { id: string };
}) {
  const routeParams = useParams();

  const [resolvedId, setResolvedId] = useState<string>(() => {
    if (routeParams?.id) {
      return Array.isArray(routeParams.id) ? routeParams.id[0] : routeParams.id;
    }
    if (params && 'id' in params) {
      return (params as { id: string }).id;
    }
    return '';
  });

  useEffect(() => {
    if (routeParams?.id) {
      const id = Array.isArray(routeParams.id) ? routeParams.id[0] : routeParams.id;
      setResolvedId(id);
    } else if (params) {
      if ('then' in params && typeof params.then === 'function') {
        params.then((p) => {
          if (p?.id) setResolvedId(p.id);
        });
      } else if ('id' in params) {
        setResolvedId((params as { id: string }).id);
      }
    }
  }, [routeParams, params]);

  const orderId = resolvedId || (routeParams?.id ? (Array.isArray(routeParams.id) ? routeParams.id[0] : routeParams.id) : '');

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [simulatingPay, setSimulatingPay] = useState(false);
  const [isThermalModalOpen, setIsThermalModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Fast client-side hydration from sessionStorage / localStorage
  useEffect(() => {
    if (!orderId) return;
    try {
      const stored =
        sessionStorage.getItem(`changkeer_order_${orderId}`) ||
        localStorage.getItem('changkeer_latest_order');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && (parsed.id === orderId || parsed.order_number === orderId)) {
          setOrder(parsed);
          setLoading(false);
        }
      }
    } catch {}
  }, [orderId]);

  const fetchOrder = async () => {
    if (!orderId) return;
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      if (!res.ok) {
        // If not ok and we don't already have local order, throw
        if (!order) throw new Error('Order not found');
        return;
      }
      const data = await res.json();
      setOrder(data);
    } catch (err: any) {
      if (!order) {
        setError(err.message || 'Failed to load order details');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }
    fetchOrder();

    // Auto-polling status every 4 seconds
    const interval = setInterval(() => {
      fetchOrder();
    }, 4000);

    return () => clearInterval(interval);
  }, [orderId]);

  const getCurrentStepIndex = (): number => {
    if (!order) return 0;
    const idx = STATUS_STEPS.findIndex(s => s.key === order.order_status);
    return idx === -1 ? 0 : idx;
  };

  const handleSimulatePayment = async () => {
    if (!order) return;
    setSimulatingPay(true);

    // Optimistically mark as paid in local state
    setOrder((prev) =>
      prev
        ? {
            ...prev,
            payment_status: 'paid',
            order_status: prev.order_status === 'received' ? 'brewing' : prev.order_status,
          }
        : null
    );

    try {
      const res = await fetch(`/api/orders/${order.id}/pay`, {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        if (data.order) {
          setOrder(data.order);
        } else {
          await fetchOrder();
        }
      }
    } catch (err) {
      console.error('Failed to simulate payment:', err);
    } finally {
      setSimulatingPay(false);
    }
  };

  const handleCopyLink = async () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] text-neutral-900 pt-36 pb-20 flex flex-col items-center justify-center font-sans">
        <div className="w-12 h-12 border-4 border-neutral-900 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-500">
          Loading Brew Receipt...
        </p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] text-neutral-900 pt-36 pb-20 flex flex-col items-center justify-center font-sans px-4">
        <div className="max-w-md w-full bg-white border border-neutral-200 p-8 rounded-xl text-center space-y-4 shadow-xs">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-lg font-bold">Order Not Found</h2>
          <p className="text-xs text-neutral-500">{error || 'Invalid or unregistered order ID.'}</p>
          <Link
            href="/order"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors font-sans"
          >
            Back to Menu
          </Link>
        </div>
      </div>
    );
  }

  const currentStep = getCurrentStepIndex();
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const waReceiptText = generateWhatsAppReceiptText(order, origin);
  const waUrl = getWhatsAppUrl('081234567890', waReceiptText);

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-neutral-900 pt-16 sm:pt-24 pb-32 font-sans select-none">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Top Success Notice */}
        <div className="text-center space-y-3 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-white border border-neutral-200 text-neutral-900 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircleIcon size={28} className="text-emerald-700" />
          </div>

          <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 font-sans">
            Order Successfully Placed
          </div>

          <h1 className="font-sans font-bold text-2xl sm:text-3xl uppercase tracking-tight text-neutral-900">
            Your Artisanal Blend is Being Prepared
          </h1>

          <p className="text-xs sm:text-sm text-neutral-500 font-sans">
            Ticket Number: <strong className="text-neutral-900 font-bold font-mono">#{order.order_number}</strong>
          </p>
        </div>

        {/* Live Stepper Tracker */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-4 sm:p-8 shadow-xs mb-6 sm:mb-8">
          <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-neutral-100 mb-4 sm:mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 font-sans">
              Real-time Brewing Status
            </h3>
            <span className="text-[11px] sm:text-xs text-neutral-400 font-sans">
              Auto-sync Barista KDS
            </span>
          </div>

          <div className="relative">
            {/* Connecting line */}
            <div className="absolute top-4 left-4 right-4 h-0.5 bg-neutral-200 -z-0 hidden sm:block" />

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-4 relative z-10">
              {STATUS_STEPS.map((step, idx) => {
                const isPassed = idx <= currentStep;
                const isCurrent = idx === currentStep;

                return (
                  <div key={step.key} className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-sans font-bold transition-all shrink-0 ${
                        isPassed
                          ? 'bg-neutral-900 text-white shadow-xs'
                          : 'bg-neutral-100 border border-neutral-200 text-neutral-400'
                      } ${isCurrent ? 'ring-4 ring-neutral-200' : ''}`}
                    >
                      {idx + 1}
                    </div>

                    <div className="min-w-0 flex-1 sm:flex-initial">
                      <div className={`text-xs font-bold leading-tight ${isPassed ? 'text-neutral-900' : 'text-neutral-400'}`}>
                        {step.label}
                      </div>
                      <div className="text-[10px] text-neutral-400 mt-0.5 line-clamp-1">
                        {step.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Payment QR Box (if QRIS) with Dynamic Locked Amount & Dual Mode */}
        {order.payment_method === 'qris' && (
          <div className="mb-6 sm:mb-8">
            <DynamicQRISCard
              amount={order.total_amount}
              orderNumber={order.order_number}
              customerName={order.customer_name}
              onSimulatePay={order.payment_status === 'unpaid' ? handleSimulatePayment : undefined}
              isSimulating={simulatingPay}
              paymentStatus={order.payment_status}
            />
          </div>
        )}

        {/* Cashier Counter Guidance Box */}
        {order.payment_method === 'cashier' && order.payment_status === 'unpaid' && (
          <div className="bg-white border border-amber-200/90 rounded-2xl p-5 sm:p-6 mb-6 sm:mb-8 shadow-xs font-sans">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0">
                <CashierCounterIcon size={20} />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-800">
                  Pay at Cashier Counter
                </span>
                <h4 className="font-bold text-sm text-neutral-900">
                  Please proceed to the brew bar counter
                </h4>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Present your ticket <strong className="text-neutral-900 font-mono">#{order.order_number}</strong> to the barista on duty and settle the payment of <strong className="text-neutral-900 font-bold">{formatRupiah(order.total_amount)}</strong> via cash or EDC debit.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Bank Transfer Guidance Box */}
        {order.payment_method === 'bank_transfer' && order.payment_status === 'unpaid' && (
          <div className="bg-white border border-blue-200/90 rounded-2xl p-5 sm:p-6 mb-6 sm:mb-8 shadow-xs font-sans space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-800 block">
                  Manual Bank Transfer
                </span>
                <h4 className="font-bold text-sm text-neutral-900 mt-0.5 flex items-center gap-2">
                  <BankVaultIcon size={16} />
                  <span>Bank Central Asia (BCA)</span>
                </h4>
              </div>
              <span className="text-xs font-mono font-extrabold text-neutral-900 bg-neutral-100 px-2.5 py-1 rounded-md">
                {formatRupiah(order.total_amount)}
              </span>
            </div>
            <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-[10px] text-neutral-400 block uppercase">Account Number:</span>
                <span className="font-bold text-neutral-900 text-sm">8280-192-349</span>
                <span className="text-[11px] text-neutral-500 block">a/n CHANGKEER ATELIER</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText('8280192349');
                }}
                className="px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Copy No. Rek
              </button>
            </div>
            <p className="text-[11px] text-neutral-500">
              After transferring, please confirm via WhatsApp with your proof of payment.
            </p>
          </div>
        )}

        {/* Digital Receipt Breakdown Box */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-4 sm:p-8 shadow-xs space-y-5 sm:space-y-6 mb-6 sm:mb-8">
          
          {/* Header & Mode Saji */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 sm:pb-5 border-b border-neutral-100">
            <div>
              <div className="text-[10px] font-sans uppercase tracking-wider text-neutral-400 font-bold">CUSTOMER:</div>
              <div className="text-sm font-bold text-neutral-900 font-sans">{order.customer_name}</div>
              <div className="text-xs text-neutral-500 font-sans mt-0.5 break-all">{order.customer_phone} / {order.customer_email}</div>
            </div>

            <div className="text-left sm:text-right">
              <div className="text-[10px] font-sans uppercase tracking-wider text-neutral-400 font-bold">DINING MODE:</div>
              <div className="text-xs font-bold text-neutral-900 flex items-center gap-1.5 sm:justify-end font-sans">
                {order.order_type === 'dine_in' && (
                  <>
                    <DiningTableIcon size={14} className="text-neutral-600" />
                    <span>Dine-in at {order.table_number || 'Cafe Table'}</span>
                  </>
                )}
                {order.order_type === 'takeaway' && (
                  <>
                    <TakeawayCupIcon size={14} className="text-neutral-600" />
                    <span>Takeaway ({order.pickup_time || 'ASAP'})</span>
                  </>
                )}
                {order.order_type === 'delivery' && (
                  <>
                    <DeliveryBikeIcon size={14} className="text-neutral-600" />
                    <span>Courier Delivery</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Delivery address info if applicable */}
          {order.order_type === 'delivery' && order.delivery_address && (
            <div className="p-3 sm:p-3.5 rounded-xl bg-[#FAFAF8] border border-neutral-200 text-xs font-sans">
              <span className="text-neutral-400 block text-[10px] uppercase font-sans tracking-wider font-bold">Delivery Address:</span>
              <p className="text-neutral-900 mt-0.5">{order.delivery_address}</p>
              {order.delivery_notes && (
                <p className="text-neutral-500 text-[11px] mt-1 italic">Note: &ldquo;{order.delivery_notes}&rdquo;</p>
              )}
            </div>
          )}

          {/* Items Table */}
          <div>
            <h4 className="text-xs font-sans font-bold uppercase tracking-wider text-neutral-500 mb-2.5 sm:mb-3">
              Artisanal Cup Details
            </h4>
            <div className="divide-y divide-neutral-100">
              {order.items?.map(item => (
                <div key={item.id} className="py-3 flex justify-between gap-3 text-xs font-sans">
                  <div>
                    <div className="font-bold text-neutral-900">{item.product_name}</div>
                    <div className="text-[11px] text-neutral-500 mt-0.5 font-normal">
                      {item.quantity}x, {item.temperature === 'hot' ? 'Hot' : 'Iced'}, Sweet: {item.sweetness_level}
                    </div>
                    {item.selected_addons && item.selected_addons.length > 0 && (
                      <div className="text-[10px] text-neutral-600 font-sans mt-0.5">
                        + {item.selected_addons.map(a => a.name).join(', ')}
                      </div>
                    )}
                    {item.item_notes && (
                      <div className="text-[10px] text-neutral-400 italic mt-0.5">
                        Note: &ldquo;{item.item_notes}&rdquo;
                      </div>
                    )}
                  </div>
                  <div className="font-mono font-bold text-neutral-900 text-right shrink-0">
                    {formatRupiah(item.subtotal)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="pt-4 border-t border-neutral-100 space-y-1.5 text-xs text-neutral-500 font-sans">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="text-neutral-900 font-bold font-mono">{formatRupiah(order.subtotal)}</span>
            </div>
            {order.discount_amount > 0 && (
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Promo Discount ({order.voucher_code}):</span>
                <span className="font-mono">-{formatRupiah(order.discount_amount)}</span>
              </div>
            )}
            {order.delivery_fee > 0 && (
              <div className="flex justify-between">
                <span>Delivery Fee:</span>
                <span className="text-neutral-900 font-bold font-mono">{formatRupiah(order.delivery_fee)}</span>
              </div>
            )}
            <div className="flex justify-between items-baseline pt-3 border-t border-neutral-200 text-sm font-bold text-neutral-900 font-sans">
              <span>Total Payment:</span>
              <span className="font-mono text-lg font-black text-neutral-900">
                {formatRupiah(order.total_amount)}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs pt-1 font-sans">
              <span>Payment Status:</span>
              <span
                className={`text-xs uppercase font-bold font-sans ${
                  order.payment_status === 'paid'
                    ? 'text-emerald-700'
                    : 'text-amber-800'
                }`}
              >
                {order.payment_status === 'paid' ? 'PAID' : 'AWAITING PAYMENT'}
              </span>
            </div>
          </div>

          {/* Receipt Actions: WhatsApp & Thermal Printer Buttons */}
          <div className="pt-4 border-t border-neutral-100 grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            
            {/* 1. WhatsApp Receipt Button */}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 sm:py-3 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 active:scale-98 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xs font-sans text-center"
              title="Send Receipt to WhatsApp Barista"
            >
              <WhatsAppIcon size={16} />
              <span className="truncate">Send Receipt to WhatsApp</span>
            </a>

            {/* 2. Thermal Printer Modal Button */}
            <button
              type="button"
              onClick={() => setIsThermalModalOpen(true)}
              className="py-2.5 sm:py-3 px-4 rounded-xl bg-white hover:bg-neutral-50 active:scale-98 border border-neutral-200 text-neutral-900 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer font-sans"
              title="Print Thermal Receipt / Cup Label"
            >
              <ThermalSlipIcon size={16} className="text-neutral-700" />
              <span className="truncate">Print Thermal Receipt (58/80mm)</span>
            </button>
          </div>

          {/* Copy Receipt Link */}
          <div className="pt-2 flex items-center justify-center">
            <button
              type="button"
              onClick={handleCopyLink}
              className="text-xs text-neutral-500 hover:text-neutral-900 flex items-center gap-1.5 transition-colors cursor-pointer font-sans"
            >
              {copiedLink ? (
                <>
                  <CheckIcon size={14} className="text-emerald-600 shrink-0" />
                  <span className="text-emerald-700 font-bold">Receipt Link Copied!</span>
                </>
              ) : (
                <>
                  <CopyClipboardIcon size={14} className="shrink-0" />
                  <span>Copy Receipt Link</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Quick Links */}
        <div className="mt-8 flex justify-center gap-6 text-xs text-neutral-500">
          <Link href="/order" className="hover:text-neutral-900 flex items-center gap-1.5 transition-colors font-bold uppercase tracking-wider">
            <span>Order Another Blend</span>
            <ArrowRightLineIcon size={14} />
          </Link>
          <Link href="/account" className="hover:text-neutral-900 flex items-center gap-1.5 transition-colors font-bold uppercase tracking-wider">
            <span>Open Account Dashboard</span>
            <ArrowRightLineIcon size={14} />
          </Link>
        </div>

      </div>

      {/* Thermal Receipt Preview & Print Modal */}
      <ThermalReceiptModal
        order={order}
        isOpen={isThermalModalOpen}
        onClose={() => setIsThermalModalOpen(false)}
      />
    </div>
  );
}
