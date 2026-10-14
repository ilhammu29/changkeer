'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ShoppingBag, 
  User, 
  UtensilsCrossed, 
  Package, 
  Bike,
  ChevronDown
} from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import { CustomerProfile, OrderType } from '@/types';

interface ClientNavbarProps {
  pageTitle?: string;
  subtitle?: string;
}

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function ClientNavbar({ pageTitle, subtitle }: ClientNavbarProps) {
  const pathname = usePathname();
  const { 
    totalItemCount, 
    subtotal, 
    setIsCartOpen, 
    orderType, 
    setOrderType, 
    tableNumber,
    setTableNumber 
  } = useCart();

  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [modeDropdownOpen, setModeDropdownOpen] = useState(false);

  useEffect(() => {
    try {
      const match = document.cookie.match(/changkeer_customer_session=([^;]+)/);
      if (match) {
        const parsed = JSON.parse(decodeURIComponent(match[1]));
        if (parsed?.email) {
          setCustomer(parsed);
          return;
        }
      }
    } catch {}

    try {
      const stored = localStorage.getItem('changkeer_customer_session');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.email) {
          setCustomer(parsed);
        }
      }
    } catch {}
  }, []);

  const getOrderTypeLabel = () => {
    switch (orderType) {
      case 'dine_in':
        return `Dine-in (${tableNumber || 'Meja 01'})`;
      case 'takeaway':
        return 'Takeaway';
      case 'delivery':
        return 'Delivery';
      default:
        return 'Pilih Mode';
    }
  };

  const getOrderTypeIcon = () => {
    switch (orderType) {
      case 'dine_in':
        return UtensilsCrossed;
      case 'takeaway':
        return Package;
      case 'delivery':
        return Bike;
      default:
        return UtensilsCrossed;
    }
  };

  const ModeIcon = getOrderTypeIcon();

  const displayTitle = pageTitle || (
    pathname.startsWith('/order/') 
      ? 'Detail Racikan Botani' 
      : pathname.startsWith('/order') 
        ? 'Katalog Seduhan Khusus' 
        : pathname.startsWith('/account') 
          ? 'Dashboard & Pesanan Pelanggan' 
          : pathname.startsWith('/checkout')
            ? 'Checkout & Pembayaran'
            : 'Portal Pelanggan'
  );

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-neutral-200/90 font-sans select-none">
      <div className="w-full px-4 sm:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Left: Page Title & Breadcrumb (No dots, No badge, Truncated on Mobile) */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 mr-2 sm:mr-4">
            <div className="flex flex-col min-w-0">
              <h1 className="text-sm sm:text-base md:text-lg font-bold text-neutral-900 leading-tight tracking-tight truncate">
                {displayTitle}
              </h1>
              {subtitle && (
                <span className="text-[11px] sm:text-xs font-medium text-neutral-500 mt-0.5 truncate hidden sm:block">
                  {subtitle}
                </span>
              )}
            </div>
          </div>

          {/* Right: Order Mode Selector & Cart Trigger (Responsive, No overflow) */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            
            {/* Quick Order Mode Dropdown (Desktop/Tablet) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setModeDropdownOpen(!modeDropdownOpen)}
                className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200/80 border border-neutral-200/80 text-neutral-900 text-xs font-semibold tracking-wide transition-all cursor-pointer"
                title="Ganti Mode Pesanan"
              >
                <ModeIcon className="w-3.5 h-3.5 text-neutral-700" />
                <span>{getOrderTypeLabel()}</span>
                <ChevronDown className="w-3 h-3 text-neutral-500" />
              </button>

              {modeDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-20" 
                    onClick={() => setModeDropdownOpen(false)} 
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-neutral-200 rounded-2xl shadow-xl py-2 z-30 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-neutral-400">
                      Mode Sajian Cafe
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => {
                        setOrderType('dine_in');
                        setModeDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between hover:bg-neutral-50 transition-colors ${
                        orderType === 'dine_in' ? 'font-bold text-neutral-900 bg-neutral-100/70' : 'font-medium text-neutral-600'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <UtensilsCrossed className="w-4 h-4 text-neutral-600" />
                        <span>Dine-in di Cafe</span>
                      </div>
                      {orderType === 'dine_in' && <span className="text-xs font-semibold text-neutral-900">Aktif</span>}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setOrderType('takeaway');
                        setModeDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between hover:bg-neutral-50 transition-colors ${
                        orderType === 'takeaway' ? 'font-bold text-neutral-900 bg-neutral-100/70' : 'font-medium text-neutral-600'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-neutral-600" />
                        <span>Takeaway (Bungkus)</span>
                      </div>
                      {orderType === 'takeaway' && <span className="text-xs font-semibold text-neutral-900">Aktif</span>}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setOrderType('delivery');
                        setModeDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between hover:bg-neutral-50 transition-colors ${
                        orderType === 'delivery' ? 'font-bold text-neutral-900 bg-neutral-100/70' : 'font-medium text-neutral-600'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Bike className="w-4 h-4 text-neutral-600" />
                        <span>Delivery (Kirim)</span>
                      </div>
                      {orderType === 'delivery' && <span className="text-xs font-semibold text-neutral-900">Aktif</span>}
                    </button>

                    {orderType === 'dine_in' && (
                      <div className="mt-2 pt-2 border-t border-neutral-100 px-3.5">
                        <label className="text-[11px] font-semibold text-neutral-500 block mb-1">Pilih Nomor Meja</label>
                        <select
                          value={tableNumber}
                          onChange={(e) => setTableNumber(e.target.value)}
                          className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl p-2 font-bold text-neutral-900"
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
                  </div>
                </>
              )}
            </div>

            {/* Shopping Cart Trigger (Responsive Label) */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-2 rounded-xl bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-900 transition-all shadow-2xs active:scale-98 cursor-pointer shrink-0"
              title="Buka Keranjang Pesanan"
            >
              <ShoppingBag className="w-4 h-4 text-neutral-800 shrink-0" />
              <span className="text-xs font-semibold text-neutral-900">
                <span className="hidden sm:inline">Pesanan </span>
                {totalItemCount > 0 ? `(${totalItemCount})` : ''}
              </span>
              {subtotal > 0 && (
                <span className="hidden md:inline text-xs font-bold text-neutral-900 pl-1 border-l border-neutral-200">
                  {formatRupiah(subtotal)}
                </span>
              )}
            </button>

            {/* Customer Avatar */}
            <Link
              href="/account"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white flex items-center justify-center text-xs font-bold shadow-2xs transition-transform hover:scale-105 shrink-0"
              title={customer?.email || 'Akun Saya'}
            >
              {(customer?.full_name || customer?.email || 'U')[0].toUpperCase()}
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
}
