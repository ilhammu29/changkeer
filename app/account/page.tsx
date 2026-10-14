'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, 
  Clock, 
  Flame, 
  CheckCircle2, 
  ExternalLink, 
  Plus, 
  Ticket, 
  ShieldCheck, 
  ChevronRight, 
  Copy, 
  Check, 
  UtensilsCrossed, 
  Package, 
  Bike,
  Sparkles,
  Printer,
  MessageCircle,
  Coffee,
  Gift
} from 'lucide-react';
import { ClientLayout } from '@/components/client/ClientLayout';
import { Order, CustomerProfile } from '@/types';
import { generateWhatsAppReceiptText, getWhatsAppUrl } from '@/lib/utils/whatsapp';
import { ThermalReceiptModal } from '@/components/order/ThermalReceiptModal';

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function AccountPage() {
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active-orders' | 'history' | 'vouchers' | 'profile'>('active-orders');
  const [copiedVoucher, setCopiedVoucher] = useState<string | null>(null);
  const [selectedOrderForPrint, setSelectedOrderForPrint] = useState<Order | null>(null);

  useEffect(() => {
    // 1. Try reading customer session from cookie
    try {
      const match = document.cookie.match(/changkeer_customer_session=([^;]+)/);
      if (match) {
        const parsed = JSON.parse(decodeURIComponent(match[1]));
        if (parsed && parsed.email) {
          setProfile(parsed);
          try {
            localStorage.setItem('changkeer_customer_session', JSON.stringify(parsed));
          } catch {}
          fetchCustomerOrders(parsed.email);
          return;
        }
      }
    } catch (e) {
      console.warn('Failed to parse customer cookie:', e);
    }

    // 2. Try reading customer session from localStorage fallback
    try {
      const stored = localStorage.getItem('changkeer_customer_session');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.email) {
          setProfile(parsed);
          fetchCustomerOrders(parsed.email);
          return;
        }
      }
    } catch (e) {
      console.warn('Failed to parse customer localStorage:', e);
    }

    // If not logged in, redirect to login page
    window.location.href = '/login?redirect=/account';
  }, []);

  const fetchCustomerOrders = async (email: string) => {
    try {
      const res = await fetch(`/api/orders?email=${encodeURIComponent(email)}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (e) {
      console.error('Error fetching customer orders:', e);
    } finally {
      setLoading(false);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedVoucher(code);
    setTimeout(() => setCopiedVoucher(null), 2000);
  };

  const activeOrders = orders.filter(o => ['received', 'brewing', 'ready'].includes(o.order_status));
  const pastOrders = orders.filter(o => ['completed', 'cancelled'].includes(o.order_status));
  const completedOrders = orders.filter(o => o.order_status === 'completed');

  // Digital Stamp Card Logic (5-Stamp Cycle)
  const completedCount = completedOrders.length;
  const currentStamps = completedCount % 5;
  const isRewardReady = completedCount > 0 && (currentStamps === 0 || completedCount >= 5);
  const activeStampsDisplay = isRewardReady && currentStamps === 0 ? 5 : currentStamps;
  const stampsRemaining = 5 - activeStampsDisplay;

  if (loading && !profile) {
    return (
      <div className="min-h-screen bg-white text-neutral-900 flex items-center justify-center font-sans">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono uppercase tracking-widest text-neutral-500">Memuat Dashboard Pelanggan...</p>
        </div>
      </div>
    );
  }

  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  return (
    <ClientLayout 
      pageTitle="Dashboard &amp; Pesanan Pelanggan" 
      subtitle="Status Seduhan Real-time, Riwayat &amp; Voucher"
      bgClassName="bg-white"
    >
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-10 space-y-6 sm:space-y-10 bg-white font-sans">
        
        {/* Profile Header (Open layout, full circular avatar, responsive on mobile) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 sm:gap-6 pb-6 sm:pb-8 border-b border-neutral-100">
          <div className="flex items-center gap-4 sm:gap-6 min-w-0">
            {/* Full circular avatar */}
            <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-2xl sm:text-4xl shadow-sm ring-4 ring-neutral-100 shrink-0">
              {profile?.full_name ? profile.full_name[0].toUpperCase() : 'C'}
            </div>
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <h1 className="text-xl sm:text-3xl font-bold uppercase tracking-tight text-neutral-900 font-sans truncate">
                  {profile?.full_name || 'Pelanggan Changkeer'}
                </h1>
                <span className="text-[11px] sm:text-xs font-bold tracking-wider uppercase text-emerald-800 font-sans shrink-0">
                  Member Atelier
                </span>
              </div>
              <div className="text-xs sm:text-sm text-neutral-500 flex flex-wrap items-center gap-x-2 font-normal font-sans break-all">
                <span>{profile?.email}</span>
                {profile?.phone_number && <span className="text-neutral-300 hidden xs:inline">/</span>}
                {profile?.phone_number && <span>{profile.phone_number}</span>}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
            <Link
              href="/order"
              className="w-full sm:w-auto justify-center px-5 py-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold tracking-wider uppercase transition-colors flex items-center gap-2 cursor-pointer shadow-xs active:scale-98 font-sans"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Pesan Racikan Baru</span>
            </Link>
          </div>
        </div>

        {/* Metrics Summary (Open typography row, responsive grid) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pb-6 sm:pb-8 border-b border-neutral-100">
          <div>
            <span className="text-[10px] sm:text-[11px] font-sans font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
              Total Pesanan
            </span>
            <span className="text-2xl sm:text-3xl font-bold font-sans text-neutral-900">
              {orders.length}
            </span>
            <span className="text-xs text-neutral-500 block mt-0.5">Seduhan tercatat</span>
          </div>

          <div>
            <span className="text-[10px] sm:text-[11px] font-sans font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
              Seduhan Aktif
            </span>
            <span className="text-2xl sm:text-3xl font-bold font-sans text-emerald-700">
              {activeOrders.length}
            </span>
            <span className="text-xs text-neutral-500 block mt-0.5">Sedang diproses</span>
          </div>

          <div>
            <span className="text-[10px] sm:text-[11px] font-sans font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
              Stempel Terkumpul
            </span>
            <span className="text-2xl sm:text-3xl font-bold font-sans text-amber-800">
              {activeStampsDisplay} <span className="text-base text-neutral-400 font-normal">/ 5</span>
            </span>
            <span className="text-xs text-neutral-500 block mt-0.5">Progress cup gratis</span>
          </div>

          <div>
            <span className="text-[10px] sm:text-[11px] font-sans font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
              Tingkat Keanggotaan
            </span>
            <span className="text-2xl sm:text-3xl font-bold font-sans text-neutral-900">
              Silver
            </span>
            <span className="text-xs text-neutral-500 block mt-0.5">Atelier Tier</span>
          </div>
        </div>

        {/* =========================================================================
            FITUR 4: DIGITAL STAMP CARD (KARTU STEMPEL LOYALITAS TEH 5 SLOT - OPEN LAYOUT)
            ========================================================================= */}
        <div className="pb-6 sm:pb-8 border-b border-neutral-100 space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold font-sans uppercase tracking-wider text-amber-800">
                <Coffee className="w-4 h-4 text-amber-700" />
                <span>Kartu Stempel Loyalitas Atelier</span>
              </div>
              <h2 className="text-lg sm:text-2xl font-sans font-bold uppercase tracking-tight text-neutral-900">
                Kumpulkan 5 Stempel — Dapatkan 1 Cup Gratis
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 font-sans max-w-xl">
                Setiap 1 pesanan seduhan selesai dihitung sebagai 1 stempel. Nikmati racikan teh gratis saat kartu penuh.
              </p>
            </div>

            {isRewardReady && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-xs font-sans shrink-0">
                <Gift className="w-4 h-4" />
                <span>1 Cup Gratis Siap Diklaim!</span>
              </div>
            )}
          </div>

          {/* 5 Circular Stamp Graphic Slots - Scaled cleanly for all phone widths */}
          <div className="grid grid-cols-5 gap-1.5 sm:gap-4 lg:gap-6 pt-2">
            {[1, 2, 3, 4, 5].map((slotNumber) => {
              const isFilled = slotNumber <= activeStampsDisplay;
              const isRewardSlot = slotNumber === 5;

              return (
                <div
                  key={slotNumber}
                  className={`relative aspect-square max-w-[90px] mx-auto w-full rounded-full border-2 flex flex-col items-center justify-center p-1 sm:p-2 text-center transition-all ${
                    isFilled
                      ? isRewardSlot
                        ? 'border-amber-600 bg-amber-50 shadow-xs ring-2 sm:ring-4 ring-amber-100/50'
                        : 'border-neutral-900 bg-neutral-900 text-white shadow-xs ring-2 sm:ring-4 ring-neutral-100'
                      : isRewardSlot
                        ? 'border-dashed border-amber-400 bg-amber-50/30 text-amber-800'
                        : 'border-dashed border-neutral-200 bg-neutral-50 text-neutral-400'
                  }`}
                >
                  {isRewardSlot ? (
                    <div className="flex flex-col items-center">
                      <Gift className={`w-4 h-4 sm:w-6 sm:h-6 mb-0.5 ${isFilled ? 'text-amber-700' : 'text-amber-500'}`} />
                      <span className={`text-[8px] sm:text-[10px] font-sans font-bold uppercase ${isFilled ? 'text-amber-900' : 'text-amber-700'}`}>
                        {isFilled ? 'Klaim' : 'Gratis'}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Coffee className={`w-4 h-4 sm:w-5 sm:h-5 mb-0.5 ${isFilled ? 'text-white' : 'text-neutral-300'}`} />
                      <span className="text-[8px] sm:text-[10px] font-sans font-bold">
                        #{slotNumber}
                      </span>
                    </div>
                  )}

                  {isFilled && (
                    <div className="absolute -top-1 -right-1 sm:top-0 sm:right-0 w-3.5 h-3.5 sm:w-5 sm:h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px] shadow-xs">
                      <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Status Info & Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 text-xs font-sans">
            <div>
              <span className="font-bold text-neutral-900 block text-sm">
                {isRewardReady 
                  ? 'Selamat! Kartu Stempel Anda Penuh (5/5).' 
                  : `Progres Kartu: ${activeStampsDisplay} dari 5 Stempel.`}
              </span>
              <span className="text-neutral-500 text-xs font-normal">
                {isRewardReady 
                  ? 'Gunakan voucher GRATIS1CUP di kasir atau checkout belanja online.' 
                  : `Pesan ${stampsRemaining} seduhan teh lagi untuk membuka hadiah 1 cup racikan gratis.`}
              </span>
            </div>

            {isRewardReady ? (
              <button
                type="button"
                onClick={() => copyCode('GRATIS1CUP')}
                className="px-4 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-xs font-sans"
              >
                {copiedVoucher === 'GRATIS1CUP' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Kode Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Kode: GRATIS1CUP</span>
                  </>
                )}
              </button>
            ) : (
              <Link
                href="/order"
                className="px-4 py-2 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-900 font-bold text-xs uppercase tracking-wider transition-colors shrink-0 text-center font-sans"
              >
                Tambah Stempel
              </Link>
            )}
          </div>
        </div>

        {/* Tab Switcher (Fluid horizontal scroll on mobile) */}
        <div className="flex border-b border-neutral-200/80 gap-4 sm:gap-6 overflow-x-auto text-xs font-bold tracking-wider uppercase font-sans scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          <button
            type="button"
            onClick={() => setActiveTab('active-orders')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'active-orders'
                ? 'border-neutral-900 text-neutral-900 font-extrabold'
                : 'border-transparent text-neutral-400 hover:text-neutral-900'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Seduhan Diproses ({activeOrders.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'history'
                ? 'border-neutral-900 text-neutral-900 font-extrabold'
                : 'border-transparent text-neutral-400 hover:text-neutral-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Riwayat Selesai ({pastOrders.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('vouchers')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'vouchers'
                ? 'border-neutral-900 text-neutral-900 font-extrabold'
                : 'border-transparent text-neutral-400 hover:text-neutral-900'
            }`}
          >
            <Ticket className="w-4 h-4" />
            <span>Voucher Saya ({isRewardReady ? '3 Kupon' : '2 Kupon'})</span>
          </button>
        </div>

        {/* TAB 1: ACTIVE ORDERS LIVE TRACKER */}
        {activeTab === 'active-orders' && (
          <div className="space-y-6 sm:space-y-8">
            {activeOrders.length === 0 ? (
              <div className="py-12 sm:py-16 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-neutral-100 mx-auto flex items-center justify-center text-neutral-400">
                  <Flame className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-neutral-900 font-sans">Belum Ada Seduhan Aktif</h3>
                  <p className="text-xs text-neutral-500 mt-1 max-w-md mx-auto font-sans">
                    Anda belum memesan teh hari ini. Pilih racikan solar term favorit dan nikmati seduhan segar di meja cafe atau bawa pulang.
                  </p>
                </div>
                <Link
                  href="/order"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer shadow-sm font-sans"
                >
                  <Plus className="w-4 h-4" />
                  <span>Buka Katalog E-Commerce</span>
                </Link>
              </div>
            ) : (
              activeOrders.map((order) => {
                const step = order.order_status === 'received' ? 1 : order.order_status === 'brewing' ? 2 : 3;
                const waText = generateWhatsAppReceiptText(order, origin);
                const waUrl = getWhatsAppUrl('081234567890', waText);

                return (
                  <div key={order.id} className="pb-8 sm:pb-10 border-b border-neutral-100 last:border-b-0 space-y-4 sm:space-y-6">
                    
                    {/* Order Header */}
                    <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-neutral-100">
                      <div>
                        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                          <span className="font-mono text-sm sm:text-base font-bold text-neutral-900">
                            #{order.order_number}
                          </span>
                          <span className="text-xs font-bold font-sans uppercase text-emerald-800">
                            {order.order_status === 'received' ? 'Diterima' : order.order_status === 'brewing' ? 'Sedang Diseduh' : 'Siap Disajikan'}
                          </span>
                        </div>
                        <span className="text-[11px] sm:text-xs text-neutral-400 font-mono mt-0.5 block">
                          Waktu Pesan: {new Date(order.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] sm:text-xs text-neutral-400 uppercase font-mono block">Total Tagihan</span>
                        <span className="text-sm sm:text-base font-bold text-neutral-900 font-mono">{formatRupiah(order.total_amount)}</span>
                      </div>
                    </div>

                    {/* Visual Stepper Tracker (Reflow: Stacked horizontal bars on mobile, 3-col on desktop) */}
                    <div className="py-1 sm:py-2">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 text-left sm:text-center text-xs font-sans">
                        <div className={`p-3 rounded-xl border transition-all flex sm:flex-col items-center sm:justify-center gap-2.5 sm:gap-0.5 ${
                          step >= 1 ? 'border-neutral-900 bg-neutral-900 text-white font-bold' : 'border-neutral-200 bg-neutral-50 text-neutral-400'
                        }`}>
                          <span className="font-mono text-[10px] block opacity-80 shrink-0">LANGKAH 1</span>
                          <span>Diterima Kasir/Bar</span>
                        </div>
                        <div className={`p-3 rounded-xl border transition-all flex sm:flex-col items-center sm:justify-center gap-2.5 sm:gap-0.5 ${
                          step >= 2 ? 'border-neutral-900 bg-neutral-900 text-white font-bold' : 'border-neutral-200 bg-neutral-50 text-neutral-400'
                        }`}>
                          <span className="font-mono text-[10px] block opacity-80 shrink-0">LANGKAH 2</span>
                          <span>Sedang Diseduh Barista</span>
                        </div>
                        <div className={`p-3 rounded-xl border transition-all flex sm:flex-col items-center sm:justify-center gap-2.5 sm:gap-0.5 ${
                          step >= 3 ? 'border-neutral-900 bg-neutral-900 text-white font-bold' : 'border-neutral-200 bg-neutral-50 text-neutral-400'
                        }`}>
                          <span className="font-mono text-[10px] block opacity-80 shrink-0">LANGKAH 3</span>
                          <span>Siap Disajikan di Meja</span>
                        </div>
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="space-y-3 pt-2">
                      <span className="text-[10px] font-sans uppercase tracking-wider text-neutral-400 block font-bold">
                        Daftar Seduhan:
                      </span>
                      {(order.items || []).map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3.5 rounded-lg bg-neutral-50/70 border border-neutral-100 text-xs font-sans">
                          <div>
                            <span className="font-bold text-neutral-900 block">{item.product_name} x {item.quantity}</span>
                            <span className="text-[11px] text-neutral-500">
                              {item.temperature === 'hot' ? 'Hangat' : 'Dingin'}, Manis: {item.sweetness_level}
                              {item.selected_addons?.length ? `, +${item.selected_addons.map(a => a.name).join(', ')}` : ''}
                            </span>
                          </div>
                          <span className="font-mono font-bold text-neutral-900">{formatRupiah(item.subtotal)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Actions: WhatsApp Receipt, Thermal Print & Detail Link */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100">
                      <div className="flex items-center gap-2">
                        {/* WhatsApp Struk */}
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-200 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors font-sans"
                          title="Kirim Struk ke WA Barista"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-neutral-700" />
                          <span>Struk WA</span>
                        </a>

                        {/* Thermal Struk */}
                        <button
                          type="button"
                          onClick={() => setSelectedOrderForPrint(order)}
                          className="px-3.5 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-200 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer font-sans"
                          title="Cetak Struk Thermal Pos / Label Cup"
                        >
                          <Printer className="w-3.5 h-3.5 text-neutral-700" />
                          <span>Cetak Struk</span>
                        </button>
                      </div>

                      <Link
                        href={`/order/success/${order.id}`}
                        className="text-xs font-bold text-neutral-900 hover:underline flex items-center gap-1.5 font-sans"
                      >
                        <span>Buka Bukti Pesanan &amp; QR Meja</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 2: ORDER HISTORY */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            {pastOrders.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-neutral-300 mx-auto" />
                <h3 className="font-bold text-base text-neutral-900 font-sans">Belum Ada Riwayat Selesai</h3>
                <p className="text-xs text-neutral-500 font-sans">Pesanan yang telah selesai dinikmati akan tersimpan otomatis di sini.</p>
              </div>
            ) : (
              pastOrders.map((order) => {
                const waText = generateWhatsAppReceiptText(order, origin);
                const waUrl = getWhatsAppUrl('081234567890', waText);

                return (
                  <div key={order.id} className="py-4 border-b border-neutral-100 last:border-b-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-neutral-900">#{order.order_number}</span>
                        <span className="text-xs font-semibold uppercase text-neutral-600 font-sans">
                          {order.order_status === 'completed' ? 'Selesai' : 'Dibatalkan'}
                        </span>
                      </div>
                      <span className="text-xs text-neutral-600 block font-sans">
                        {(order.items || []).map(i => `${i.product_name} (${i.quantity}x)`).join(', ')}
                      </span>
                      <span className="text-[10px] text-neutral-400 block font-mono">
                        {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3">
                      <span className="text-sm font-bold text-neutral-900 font-mono">{formatRupiah(order.total_amount)}</span>
                      
                      <div className="flex items-center gap-2">
                        {/* WhatsApp Struk */}
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-neutral-700 transition-colors"
                          title="Kirim Struk ke WA"
                        >
                          <MessageCircle className="w-4 h-4 text-neutral-700" />
                        </a>

                        {/* Thermal Struk */}
                        <button
                          type="button"
                          onClick={() => setSelectedOrderForPrint(order)}
                          className="p-2 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-neutral-700 transition-colors cursor-pointer"
                          title="Cetak Struk Thermal"
                        >
                          <Printer className="w-4 h-4" />
                        </button>

                        <Link
                          href="/order"
                          className="px-3 py-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-100 text-neutral-900 text-xs font-bold uppercase tracking-wider transition-colors font-sans"
                        >
                          Pesan Lagi
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 3: VOUCHERS CATALOG */}
        {activeTab === 'vouchers' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Loyalty Reward Voucher (if available) */}
            {isRewardReady && (
              <div className="bg-gradient-to-br from-amber-50/50 to-white border border-amber-300 rounded-xl p-6 shadow-xs relative overflow-hidden">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-800 font-sans block">
                      Reward 5 Stempel — Gratis 1 Cup
                    </span>
                    <h4 className="text-base font-bold text-neutral-900 mt-2 font-sans">
                      Gratis 1 Cup Teh Herbal Pilihan
                    </h4>
                    <p className="text-xs text-neutral-500 mt-1 font-sans">
                      Klaim hadiah gratis 1 cup setelah mengumpulkan 5 stempel teh.
                    </p>
                  </div>
                  <Gift className="w-8 h-8 text-amber-700 shrink-0" />
                </div>

                <div className="mt-4 pt-4 border-t border-amber-200/80 flex items-center justify-between">
                  <div className="font-mono text-xs font-bold tracking-wider text-neutral-900 bg-white border border-neutral-200 px-3 py-1.5 rounded-lg">
                    GRATIS1CUP
                  </div>
                  <button
                    type="button"
                    onClick={() => copyCode('GRATIS1CUP')}
                    className="px-3.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer font-sans"
                  >
                    {copiedVoucher === 'GRATIS1CUP' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Kode</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Voucher 1: First Order */}
            <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs relative overflow-hidden">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 font-sans block">
                    Diskon 20% — Pelanggan Baru
                  </span>
                  <h4 className="text-base font-bold text-neutral-900 mt-2 font-sans">
                    Diskon 20% Pembelian Pertama
                  </h4>
                  <p className="text-xs text-neutral-500 mt-1 font-sans">
                    Gunakan kode ini saat checkout belanja online atau pesanan cafe pertama Anda.
                  </p>
                </div>
                <Ticket className="w-8 h-8 text-neutral-400 shrink-0" />
              </div>

              <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between">
                <div className="font-mono text-xs font-bold tracking-wider text-neutral-900 bg-neutral-100 px-3 py-1.5 rounded-lg">
                  CHANGKEERFIRST
                </div>
                <button
                  type="button"
                  onClick={() => copyCode('CHANGKEERFIRST')}
                  className="px-3.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer font-sans"
                >
                  {copiedVoucher === 'CHANGKEERFIRST' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Kode</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Voucher 2: Dine-In */}
            <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs relative overflow-hidden">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800 font-sans block">
                    Diskon 15% — Meja Cafe
                  </span>
                  <h4 className="text-base font-bold text-neutral-900 mt-2 font-sans">
                    Promo Santap Dine-in Meja Cafe
                  </h4>
                  <p className="text-xs text-neutral-500 mt-1 font-sans">
                    Potongan 15% untuk setiap pemesanan yang dinikmati langsung di meja cafe.
                  </p>
                </div>
                <UtensilsCrossed className="w-8 h-8 text-neutral-400 shrink-0" />
              </div>

              <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between">
                <div className="font-mono text-xs font-bold tracking-wider text-neutral-900 bg-neutral-100 px-3 py-1.5 rounded-lg">
                  CAFEDINEIN
                </div>
                <button
                  type="button"
                  onClick={() => copyCode('CAFEDINEIN')}
                  className="px-3.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer font-sans"
                >
                  {copiedVoucher === 'CAFEDINEIN' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Kode</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* Minimalist Footnote */}
      <footer className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center border-t border-neutral-200/60 mt-auto">
        <p className="text-[11px] font-sans text-neutral-400 tracking-wider uppercase font-medium">
          CHANGKEER BOTANICAL ATELIER — UNSWEETENED BY DEFAULT — PLASTIC-FREE
        </p>
      </footer>

      {/* Thermal Receipt Print Modal */}
      <ThermalReceiptModal
        order={selectedOrderForPrint}
        isOpen={Boolean(selectedOrderForPrint)}
        onClose={() => setSelectedOrderForPrint(null)}
      />

    </ClientLayout>
  );
}
