'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  ShoppingBag, 
  User, 
  LogOut, 
  Package, 
  ArrowLeft,
  UtensilsCrossed,
  Bike,
  Menu,
  X
} from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import { CustomerProfile, OrderType } from '@/types';

export function ClientHeader() {
  const pathname = usePathname();
  const { totalItemCount, setIsCartOpen, orderType, setOrderType } = useCart();
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // 1. Read from cookie
    try {
      const match = document.cookie.match(/changkeer_customer_session=([^;]+)/);
      if (match) {
        const parsed = JSON.parse(decodeURIComponent(match[1]));
        if (parsed?.email) {
          setCustomer(parsed);
          return;
        }
      }
    } catch (e) {
      console.warn('Cookie read warning:', e);
    }

    // 2. Read from localStorage fallback
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

  const isOrderPage = pathname.startsWith('/order');
  const isAccountPage = pathname.startsWith('/account');

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-neutral-200/90 shadow-2xs font-sans select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand & Client Portal Tag */}
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/" className="group flex items-center gap-3">
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-neutral-200 bg-white p-0.5 shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                <Image src="/images/logo_new.png" alt="CHANGKEER" fill className="object-contain" priority />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-xs sm:text-sm tracking-[0.18em] uppercase text-neutral-900 leading-none">
                  CHANGKEER
                </span>
                <span className="text-[9px] sm:text-[10px] font-mono tracking-wider uppercase text-neutral-500 font-semibold pt-0.5">
                  PORTAL PELANGGAN
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Tabs */}
            <nav className="hidden md:flex items-center space-x-1 pl-4 border-l border-neutral-200">
              <Link
                href="/order"
                className={`text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 ${
                  isOrderPage
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>Katalog E-Commerce</span>
              </Link>

              <Link
                href="/account"
                className={`text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 ${
                  isAccountPage
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Dashboard Akun</span>
              </Link>
            </nav>
          </div>

          {/* Right Action Tools: Order Mode, Cart, User Profile, Logout */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Order Mode Toggle (Dine-in / Takeaway / Delivery) */}
            <div className="hidden lg:flex items-center bg-neutral-100 p-1 rounded-xl border border-neutral-200 text-[11px] font-bold uppercase">
              <button
                type="button"
                onClick={() => setOrderType('dine_in')}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                  orderType === 'dine_in'
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                <UtensilsCrossed className="w-3 h-3" />
                <span>Meja Cafe</span>
              </button>
              <button
                type="button"
                onClick={() => setOrderType('takeaway')}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                  orderType === 'takeaway'
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                <Package className="w-3 h-3" />
                <span>Takeaway</span>
              </button>
              <button
                type="button"
                onClick={() => setOrderType('delivery')}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                  orderType === 'delivery'
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                <Bike className="w-3 h-3" />
                <span>Delivery</span>
              </button>
            </div>

            {/* Shopping Cart Button with Badge */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs active:scale-95"
              aria-label="Buka Keranjang Pesanan"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Keranjang</span>
              <span className="bg-white text-neutral-900 text-[10px] font-mono font-black w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                {totalItemCount}
              </span>
            </button>

            {/* Customer Status or Login Link */}
            {customer ? (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Link
                  href="/account"
                  className="hidden sm:flex items-center gap-2 py-1.5 px-3 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-800 text-xs font-semibold transition-colors"
                  title="Ke Halaman Akun"
                >
                  <div className="w-6 h-6 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-[10px]">
                    {customer.full_name ? customer.full_name[0].toUpperCase() : 'C'}
                  </div>
                  <span className="truncate max-w-[100px]">{customer.full_name.split(' ')[0]}</span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-2 sm:py-2 sm:px-2.5 rounded-xl border border-neutral-200 hover:border-red-300 hover:bg-red-50 text-neutral-600 hover:text-red-600 text-xs transition-colors cursor-pointer"
                  title="Keluar Akun"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="py-2 px-3.5 rounded-xl border border-neutral-200 hover:bg-neutral-100 text-neutral-900 text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Masuk
              </Link>
            )}

            {/* Link Back to Landing Page */}
            <Link
              href="/"
              className="hidden xl:inline-flex items-center gap-1.5 py-2 px-3 rounded-xl text-neutral-500 hover:text-neutral-900 text-xs font-semibold hover:bg-neutral-100 transition-colors"
              title="Kembali ke Landing Page Utama"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Web Utama</span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl border border-neutral-200 text-neutral-700 hover:bg-neutral-100 transition-colors"
              aria-label="Buka Menu Portal"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-white p-4 space-y-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col space-y-1">
            <Link
              href="/order"
              onClick={() => setMobileMenuOpen(false)}
              className={`p-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
                isOrderPage ? 'bg-neutral-900 text-white' : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Katalog E-Commerce</span>
            </Link>

            <Link
              href="/account"
              onClick={() => setMobileMenuOpen(false)}
              className={`p-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
                isAccountPage ? 'bg-neutral-900 text-white' : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Dashboard Akun</span>
            </Link>

            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-neutral-600 hover:bg-neutral-100"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Web Utama</span>
            </Link>
          </div>

          <div className="pt-2 border-t border-neutral-200 flex items-center justify-between">
            <div className="text-xs text-neutral-600 font-medium">
              {customer ? customer.full_name : 'Tamu'}
            </div>
            {customer && (
              <button
                type="button"
                onClick={handleLogout}
                className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
