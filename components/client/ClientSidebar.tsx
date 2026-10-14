'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  Package, 
  User, 
  ShoppingBag, 
  ArrowLeft, 
  LogOut, 
  UtensilsCrossed,
  Bike
} from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import { CustomerProfile, OrderType } from '@/types';

export function ClientSidebar() {
  const pathname = usePathname();
  const { totalItemCount, setIsCartOpen, orderType, setOrderType, tableNumber } = useCart();
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [isHovered, setIsHovered] = useState(false);

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

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/customer/logout', { method: 'POST' });
    } catch {}
    document.cookie = 'changkeer_customer_session=; Max-Age=0; path=/;';
    try {
      localStorage.removeItem('changkeer_customer_session');
    } catch {}
    window.location.href = '/login';
  };

  const navLinks = [
    {
      href: '/order',
      label: 'Katalog Seduhan',
      subtitle: 'Menu racikan botani',
      icon: Package,
      active: pathname.startsWith('/order'),
    },
    {
      href: '/account',
      label: 'Pesanan & Akun',
      subtitle: 'Riwayat, voucher & profil',
      icon: User,
      active: pathname.startsWith('/account'),
    },
  ];

  return (
    <>
      {/* =========================================================================
          DESKTOP COLLAPSIBLE HOVER SIDEBAR (w-[72px] -> w-64 on hover)
          No Badges, No Dots, Pure Plus Jakarta Sans
          ========================================================================= */}
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`hidden md:flex fixed top-0 left-0 bottom-0 z-40 bg-white border-r border-neutral-200/90 flex-col justify-between transition-all duration-300 ease-in-out select-none shadow-xs font-sans ${
          isHovered ? 'w-64 shadow-2xl' : 'w-[72px]'
        }`}
      >
        {/* Top: Logo & Brand (Clean, No dots) */}
        <div className="p-4 border-b border-neutral-100 flex items-center overflow-hidden">
          <Link href="/order" className="flex items-center gap-3 w-full">
            <div className="relative w-10 h-10 rounded-xl bg-white border border-neutral-200 p-0.5 shadow-2xs shrink-0 flex items-center justify-center">
              <Image 
                src="/images/logo_new.png" 
                alt="CHANGKEER" 
                fill 
                className="object-contain p-1" 
                priority 
              />
            </div>
            
            <div className={`flex flex-col whitespace-nowrap transition-opacity duration-200 ${
              isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}>
              <span className="font-bold text-sm tracking-tight text-neutral-900 leading-none">
                CHANGKEER
              </span>
              <span className="text-xs font-semibold text-neutral-500 mt-1">
                Brew Bar Atelier
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Main Navigation */}
        <div className="flex-1 py-4 px-2.5 space-y-1.5 overflow-hidden">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3.5 px-3 py-3 rounded-xl transition-all duration-200 ${
                  item.active
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
                title={item.label}
              >
                <div className="w-6 h-6 flex items-center justify-center shrink-0">
                  <Icon className={`w-5 h-5 ${item.active ? 'text-white' : 'text-neutral-700 group-hover:text-neutral-900'}`} />
                </div>

                <div className={`flex flex-col whitespace-nowrap transition-opacity duration-200 ${
                  isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}>
                  <span className="text-xs font-bold leading-tight">
                    {item.label}
                  </span>
                  <span className={`text-[11px] font-medium ${item.active ? 'text-neutral-300' : 'text-neutral-500'}`}>
                    {item.subtitle}
                  </span>
                </div>
              </Link>
            );
          })}

          {/* Quick Cart Trigger inside Sidebar (No floating circle badge) */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="w-full group flex items-center gap-3.5 px-3 py-3 rounded-xl text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-all duration-200 cursor-pointer"
            title="Keranjang Seduhan"
          >
            <div className="w-6 h-6 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-5 h-5 text-neutral-700 group-hover:text-neutral-900" />
            </div>

            <div className={`flex flex-col text-left whitespace-nowrap transition-opacity duration-200 ${
              isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}>
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold text-neutral-900 leading-tight">
                  Keranjang {totalItemCount > 0 ? `(${totalItemCount})` : ''}
                </span>
              </div>
              <span className="text-[11px] font-medium text-neutral-500">
                Buka rincian &amp; checkout
              </span>
            </div>
          </button>

          {/* Order Mode Switcher (Shown in Sidebar when Expanded) */}
          {isHovered && (
            <div className="pt-4 pb-2 px-3 transition-opacity duration-300">
              <span className="text-xs font-semibold text-neutral-400 block mb-2">
                Pilih Mode Pesanan
              </span>
              <div className="grid grid-cols-3 gap-1 p-1 bg-neutral-100 rounded-xl border border-neutral-200 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setOrderType('dine_in')}
                  className={`py-1.5 rounded-lg flex flex-col items-center gap-1 transition-all ${
                    orderType === 'dine_in'
                      ? 'bg-white text-neutral-900 shadow-2xs font-bold'
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                  title="Dine-in di Cafe"
                >
                  <UtensilsCrossed className="w-3.5 h-3.5" />
                  <span className="text-[11px]">Dine-in</span>
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('takeaway')}
                  className={`py-1.5 rounded-lg flex flex-col items-center gap-1 transition-all ${
                    orderType === 'takeaway'
                      ? 'bg-white text-neutral-900 shadow-2xs font-bold'
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                  title="Bawa Pulang (Takeaway)"
                >
                  <Package className="w-3.5 h-3.5" />
                  <span className="text-[11px]">Bungkus</span>
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('delivery')}
                  className={`py-1.5 rounded-lg flex flex-col items-center gap-1 transition-all ${
                    orderType === 'delivery'
                      ? 'bg-white text-neutral-900 shadow-2xs font-bold'
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                  title="Kirim ke Alamat"
                >
                  <Bike className="w-3.5 h-3.5" />
                  <span className="text-[11px]">Kirim</span>
                </button>
              </div>
              {orderType === 'dine_in' && (
                <div className="mt-2 text-xs text-neutral-500 text-center font-medium">
                  Posisi: <strong className="text-neutral-900 font-bold">{tableNumber || 'Meja 01'}</strong>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom: Return to Public Web & User Profile / Logout */}
        <div className="p-3 border-t border-neutral-100 space-y-2 overflow-hidden">
          
          {/* Back to Public Web Link */}
          <Link
            href="/"
            className="flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
            title="Kembali ke Landing Page Beranda"
          >
            <div className="w-6 h-6 flex items-center justify-center shrink-0">
              <ArrowLeft className="w-4 h-4 text-neutral-600" />
            </div>
            <span className={`text-xs font-semibold whitespace-nowrap transition-opacity duration-200 ${
              isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}>
              Kembali ke Beranda
            </span>
          </Link>

          {/* User Account / Logout */}
          <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
            <Link
              href="/account"
              className="flex items-center gap-3 overflow-hidden flex-1 group"
              title={customer?.email || 'Akun Saya'}
            >
              <div className="w-9 h-9 rounded-xl bg-neutral-900 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs">
                {(customer?.full_name || customer?.email || 'U')[0].toUpperCase()}
              </div>

              <div className={`flex flex-col whitespace-nowrap overflow-hidden transition-opacity duration-200 ${
                isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}>
                <span className="text-xs font-bold text-neutral-900 truncate">
                  {customer?.full_name || 'Pelanggan'}
                </span>
                <span className="text-[11px] font-medium text-neutral-500 truncate">
                  {customer?.email || 'Akun Changkeer'}
                </span>
              </div>
            </Link>

            {isHovered && (
              <button
                type="button"
                onClick={handleLogout}
                className="p-2 rounded-xl text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                title="Keluar dari Akun"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* =========================================================================
          MOBILE BOTTOM NAVIGATION DOCK (No floating badges, No dots, 44px+ touch targets)
          ========================================================================= */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200/90 pt-2 pb-[max(0.6rem,env(safe-area-inset-bottom,0.6rem))] px-2 shadow-lg select-none font-sans">
        <div className="grid grid-cols-4 items-center text-center">
          <Link
            href="/order"
            className={`min-h-[44px] flex flex-col items-center justify-center gap-0.5 py-1 px-1 rounded-xl transition-colors active:scale-95 ${
              pathname.startsWith('/order') ? 'text-neutral-900 font-bold bg-neutral-100/70' : 'text-neutral-500 font-medium hover:text-neutral-900'
            }`}
          >
            <Package className="w-5 h-5 shrink-0" />
            <span className="text-[10px] sm:text-[11px] font-semibold leading-tight">Katalog</span>
          </Link>

          <Link
            href="/account"
            className={`min-h-[44px] flex flex-col items-center justify-center gap-0.5 py-1 px-1 rounded-xl transition-colors active:scale-95 ${
              pathname.startsWith('/account') ? 'text-neutral-900 font-bold bg-neutral-100/70' : 'text-neutral-500 font-medium hover:text-neutral-900'
            }`}
          >
            <User className="w-5 h-5 shrink-0" />
            <span className="text-[10px] sm:text-[11px] font-semibold leading-tight">Akun</span>
          </Link>

          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="min-h-[44px] flex flex-col items-center justify-center gap-0.5 py-1 px-1 rounded-xl text-neutral-500 hover:text-neutral-900 cursor-pointer font-medium active:scale-95 transition-colors"
          >
            <ShoppingBag className="w-5 h-5 shrink-0" />
            <span className="text-[10px] sm:text-[11px] font-semibold leading-tight">
              Pesanan {totalItemCount > 0 ? `(${totalItemCount})` : ''}
            </span>
          </button>

          <Link
            href="/"
            className="min-h-[44px] flex flex-col items-center justify-center gap-0.5 py-1 px-1 rounded-xl text-neutral-500 hover:text-neutral-900 font-medium active:scale-95 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 shrink-0" />
            <span className="text-[10px] sm:text-[11px] font-semibold leading-tight">Beranda</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
