'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  X, 
  ShoppingBag, 
  Plus, 
  Minus, 
  Trash2, 
  Ticket, 
  UtensilsCrossed, 
  Package, 
  Bike, 
  ArrowRight,
  Sparkles,
  AlertCircle,
  Flame,
  Snowflake,
  CheckCircle2
} from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import { OrderType } from '@/types';

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function CartDrawer() {
  const router = useRouter();
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    orderType,
    setOrderType,
    tableNumber,
    setTableNumber,
    pickupTime,
    setPickupTime,
    deliveryAddress,
    setDeliveryAddress,
    appliedVoucher,
    discountAmount,
    applyVoucher,
    removeVoucher,
    subtotal,
    deliveryFee,
    totalAmount,
    totalItemCount,
  } = useCart();

  const [voucherInput, setVoucherInput] = useState('');
  const [voucherError, setVoucherError] = useState('');
  const [voucherLoading, setVoucherLoading] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    setVoucherError('');
    if (!voucherInput.trim()) return;

    setVoucherLoading(true);
    try {
      const res = await fetch('/api/vouchers/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: voucherInput, subtotal }),
      });
      const data = await res.json();
      if (!res.ok || !data.isValid) {
        setVoucherError(data.message || 'Kode voucher tidak valid');
      } else {
        applyVoucher(data.voucher, data.discountAmount);
        setVoucherInput('');
      }
    } catch {
      setVoucherError('Gagal memvalidasi voucher. Coba lagi.');
    } finally {
      setVoucherLoading(false);
    }
  };

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    router.push('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans select-none">
      {/* Soft Dim Backdrop */}
      <div 
        className="absolute inset-0 bg-neutral-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white border-l border-neutral-200/90 text-neutral-900 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-neutral-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-neutral-100 text-neutral-900 border border-neutral-200 flex items-center justify-center shrink-0">
                <ShoppingBag className="w-5 h-5 text-neutral-800" />
              </div>
              <div>
                <h3 className="font-sans font-black text-sm sm:text-base uppercase tracking-tight text-neutral-900">
                  Keranjang Seduhan
                </h3>
                <p className="text-xs text-neutral-500 font-sans">
                  {totalItemCount} racikan dalam pesanan
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
              title="Tutup Keranjang"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Order Type Tabs */}
          <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-neutral-100 bg-[#FAFAF8]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-sans tracking-wider text-neutral-400 font-bold block">
                PILIH MODE PENYAJIAN:
              </span>
              <span className="text-[10px] font-sans text-neutral-500 font-bold">
                Cafe Brew Bar
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 p-1 bg-neutral-200/60 rounded-xl border border-neutral-200 text-xs font-bold">
              {(
                [
                  { type: 'dine_in', label: 'Dine-In', icon: UtensilsCrossed },
                  { type: 'takeaway', label: 'Takeaway', icon: Package },
                  { type: 'delivery', label: 'Delivery', icon: Bike },
                ] as const
              ).map(({ type, label, icon: Icon }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setOrderType(type as OrderType)}
                  className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    orderType === type
                      ? 'bg-neutral-900 text-white shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* Sub-inputs per order type */}
            {orderType === 'dine_in' && (
              <div className="mt-3 flex items-center justify-between gap-2 p-2.5 bg-white border border-neutral-200 rounded-xl">
                <span className="text-xs text-neutral-600 font-medium whitespace-nowrap">Pilih Meja:</span>
                <select
                  value={tableNumber}
                  onChange={e => setTableNumber(e.target.value)}
                  className="bg-transparent text-xs text-neutral-900 font-bold focus:outline-none cursor-pointer text-right"
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
              <div className="mt-3 flex items-center justify-between gap-2 p-2.5 bg-white border border-neutral-200 rounded-xl">
                <span className="text-xs text-neutral-600 font-medium whitespace-nowrap">Waktu Ambil:</span>
                <select
                  value={pickupTime}
                  onChange={e => setPickupTime(e.target.value)}
                  className="bg-transparent text-xs text-amber-700 font-bold focus:outline-none cursor-pointer text-right"
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
              <div className="mt-3">
                <input
                  type="text"
                  placeholder="Ketik Alamat Pengantaran Lengkap..."
                  value={deliveryAddress}
                  onChange={e => setDeliveryAddress(e.target.value)}
                  className="w-full bg-white border border-neutral-200 text-xs text-neutral-900 rounded-xl p-2.5 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900"
                />
              </div>
            )}
          </div>

          {/* Item List in Cart */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3 divide-y divide-neutral-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
                <div className="w-14 h-14 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-400">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-base text-neutral-900 font-sans">Keranjang Seduhan Kosong</h4>
                <p className="text-xs text-neutral-500 max-w-[240px] font-sans">
                  Pilih racikan botani herbal terbaik kami di katalog untuk mulai menyeduh.
                </p>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 px-5 py-2.5 rounded-lg bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer font-sans"
                >
                  Buka Katalog Seduhan
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.cart_item_id} className="pt-3 first:pt-0">
                  <div className="bg-[#FAFAF8] border border-neutral-200/90 rounded-2xl p-3.5 space-y-2.5">
                    <div className="flex gap-3">
                      {item.product_image ? (
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-neutral-200 bg-white shrink-0">
                          <Image
                            src={item.product_image}
                            alt={item.product_name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-neutral-200 flex items-center justify-center shrink-0">
                          <ShoppingBag className="w-5 h-5 text-neutral-400" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-xs uppercase tracking-tight text-neutral-900 truncate">
                            {item.product_name}
                          </h4>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.cart_item_id)}
                            className="text-neutral-400 hover:text-red-600 transition-colors p-1"
                            title="Hapus racikan"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Badges: Temp & Sweetness */}
                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-sans font-bold uppercase ${
                            item.temperature === 'hot' 
                              ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                              : 'bg-sky-100 text-sky-800 border border-sky-200'
                          }`}>
                            {item.temperature === 'hot' ? <Flame className="w-2.5 h-2.5" /> : <Snowflake className="w-2.5 h-2.5" />}
                            <span>{item.temperature === 'hot' ? 'Hangat' : 'Dingin'}</span>
                          </span>

                          <span className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200 text-[10px] font-sans font-bold">
                            Gula {item.sweetness_level}
                          </span>

                          {item.ice_level && item.temperature === 'iced' && (
                            <span className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200 text-[10px] font-sans font-bold">
                              Es {item.ice_level}
                            </span>
                          )}
                        </div>

                        {/* Add-ons list */}
                        {item.selected_addons && item.selected_addons.length > 0 && (
                          <div className="mt-1.5 text-[10px] text-neutral-500 font-sans">
                            + {item.selected_addons.map(a => a.name).join(', ')}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Stepper & Subtotal */}
                    <div className="pt-2 border-t border-neutral-200 flex items-center justify-between">
                      <div className="flex items-center border border-neutral-200 rounded-lg bg-white overflow-hidden shadow-2xs">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.cart_item_id, item.quantity - 1)}
                          className="px-2 py-1 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 py-1 text-xs font-sans font-bold text-neutral-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.cart_item_id, item.quantity + 1)}
                          className="px-2 py-1 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-sans font-black text-neutral-900">
                          {formatRupiah(item.subtotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Voucher & Checkout Actions */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-neutral-200 bg-white space-y-3.5 sm:space-y-4 pb-[max(1.25rem,env(safe-area-inset-bottom,1.25rem))]">
              
              {/* Voucher Box */}
              <div>
                {appliedVoucher ? (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                    <div className="flex items-center gap-2">
                      <Ticket className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <span className="font-bold uppercase tracking-wider font-sans">{appliedVoucher.code}</span>
                        <span className="block text-[11px] text-emerald-600 font-sans">
                          Hemat {formatRupiah(discountAmount)}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeVoucher}
                      className="text-neutral-400 hover:text-red-600 p-1 text-xs font-bold font-sans cursor-pointer"
                    >
                      Batal
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyVoucher} className="space-y-1">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          placeholder="Ketik Kode Promo..."
                          value={voucherInput}
                          onChange={e => setVoucherInput(e.target.value.toUpperCase())}
                          className="w-full pl-8 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-sans uppercase text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900"
                        />
                        <Ticket className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      </div>
                      <button
                        type="submit"
                        disabled={voucherLoading || !voucherInput.trim()}
                        className="px-3.5 sm:px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 disabled:opacity-50 transition-colors shrink-0 cursor-pointer font-sans"
                      >
                        {voucherLoading ? '...' : 'Klaim'}
                      </button>
                    </div>
                    {voucherError && (
                      <p className="text-[11px] text-red-600 pl-1 font-sans">{voucherError}</p>
                    )}
                  </form>
                )}
              </div>

              {/* Price Calculation breakdown */}
              <div className="space-y-1.5 text-xs border-t border-neutral-100 pt-3">
                <div className="flex justify-between text-neutral-500 font-sans">
                  <span>Subtotal Racikan:</span>
                  <span className="font-bold text-neutral-800">{formatRupiah(subtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-sans">
                    <span>Diskon Voucher:</span>
                    <span className="font-bold">-{formatRupiah(discountAmount)}</span>
                  </div>
                )}

                {deliveryFee > 0 && (
                  <div className="flex justify-between text-neutral-500 font-sans">
                    <span>Biaya Antar Delivery:</span>
                    <span className="font-bold text-neutral-800">{formatRupiah(deliveryFee)}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm sm:text-base font-black text-neutral-900 pt-2 border-t border-neutral-200 font-sans">
                  <span>Total Tagihan:</span>
                  <span className="text-neutral-900">{formatRupiah(totalAmount)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={handleProceedCheckout}
                  className="w-full py-3 sm:py-3.5 px-4 rounded-xl sm:rounded-2xl bg-neutral-900 hover:bg-neutral-800 active:scale-98 text-white font-sans font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <span className="truncate">Lanjut ke Kasir &amp; Checkout</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-2.5 px-4 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-600 text-xs font-bold uppercase tracking-wider transition-colors text-center cursor-pointer font-sans"
                >
                  Pilih Seduhan Lainnya
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
