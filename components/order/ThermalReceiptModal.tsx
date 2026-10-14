'use client';

import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Check, 
  Copy, 
  Coffee, 
  Sparkles, 
  QrCode,
  Tag
} from 'lucide-react';
import { Order } from '@/types';

interface ThermalReceiptModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function ThermalReceiptModal({ order, isOpen, onClose }: ThermalReceiptModalProps) {
  const [printType, setPrintType] = useState<'pos-cashier' | 'cup-label'>('pos-cashier');

  if (!isOpen || !order) return null;

  const dateFormatted = new Date(order.created_at).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 overflow-y-auto font-sans select-none print:p-0 print:m-0 print:block">
      {/* Dimmed backdrop for screen only */}
      <div 
        className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs transition-opacity animate-in fade-in print:hidden"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-white border border-neutral-200 rounded-2xl shadow-2xl overflow-hidden z-10 my-4 sm:my-6 flex flex-col max-h-[92vh] print:max-h-none print:shadow-none print:border-none print:w-full print:m-0">
        
        {/* Top Control Bar (Hidden on Print) */}
        <div className="p-3 sm:p-4 border-b border-neutral-100 bg-[#FAFAF8] flex items-center justify-between print:hidden gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <button
              type="button"
              onClick={() => setPrintType('pos-cashier')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer truncate ${
                printType === 'pos-cashier'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Struk Kasir (80mm)
            </button>
            <button
              type="button"
              onClick={() => setPrintType('cup-label')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer truncate ${
                printType === 'cup-label'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Label Cup (58mm)
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-200/80 text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Receipt Preview (Printable Area) */}
        <div className="p-3 sm:p-6 overflow-y-auto flex-1 bg-neutral-100 flex justify-center print:p-0 print:bg-white print:overflow-visible">
          
          {/* =========================================================================
              POS CASHIER RECEIPT (80mm)
              ========================================================================= */}
          {printType === 'pos-cashier' ? (
            <div id="printable-thermal-receipt" className="w-[300px] max-w-full bg-white border border-neutral-200 p-4 sm:p-5 rounded-lg shadow-sm font-mono text-[11px] text-black leading-tight space-y-3 print:w-full print:border-none print:shadow-none print:p-0">
              
              {/* Header */}
              <div className="text-center space-y-1">
                <h3 className="font-bold text-sm tracking-widest uppercase">CHANGKEER ATELIER</h3>
                <p className="text-[10px] text-neutral-600">Pure Botanical Herbal Tea</p>
                <p className="text-[9px] text-neutral-500">Jl. Botanical Garden No. 24, Jakarta</p>
                <div className="border-b border-dashed border-neutral-400 pt-2" />
              </div>

              {/* Order Info */}
              <div className="space-y-1 text-[10px]">
                <div className="flex justify-between">
                  <span>No. Tiket:</span>
                  <span className="font-bold font-mono">#{order.order_number}</span>
                </div>
                <div className="flex justify-between">
                  <span>Waktu:</span>
                  <span>{dateFormatted}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pemesan:</span>
                  <span className="font-bold truncate max-w-[150px]">{order.customer_name}</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span>Mode Penyajian:</span>
                  <span className="font-bold px-1.5 py-0.5 bg-neutral-100 border border-neutral-300 rounded text-[9px] uppercase">
                    {order.order_type === 'dine_in'
                      ? order.table_number || 'DINE-IN'
                      : order.order_type === 'takeaway'
                        ? 'TAKEAWAY'
                        : 'DELIVERY'}
                  </span>
                </div>
                <div className="border-b border-dashed border-neutral-400 pt-2" />
              </div>

              {/* Items List */}
              <div className="space-y-2.5">
                {(order.items || []).map((item, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <div className="flex justify-between font-bold">
                      <span className="truncate max-w-[200px]">{item.product_name}</span>
                      <span>{item.quantity}x</span>
                    </div>
                    <div className="text-[9px] text-neutral-600 pl-2">
                      - {item.temperature === 'hot' ? 'HANGAT' : 'DINGIN'} | GULA: {item.sweetness_level}
                      {item.selected_addons?.length ? ` | +${item.selected_addons.map(a => a.name).join(', ')}` : ''}
                    </div>
                    {item.item_notes && (
                      <div className="text-[9px] text-neutral-500 italic pl-2">
                        &ldquo;{item.item_notes}&rdquo;
                      </div>
                    )}
                    <div className="text-right text-[10px] font-bold">
                      {formatRupiah(item.subtotal)}
                    </div>
                  </div>
                ))}
                <div className="border-b border-dashed border-neutral-400 pt-2" />
              </div>

              {/* Calculations */}
              <div className="space-y-1 text-[10px]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatRupiah(order.subtotal)}</span>
                </div>
                {order.discount_amount > 0 && (
                  <div className="flex justify-between">
                    <span>Diskon Voucher ({order.voucher_code}):</span>
                    <span>-{formatRupiah(order.discount_amount)}</span>
                  </div>
                )}
                {order.delivery_fee > 0 && (
                  <div className="flex justify-between">
                    <span>Ongkir Delivery:</span>
                    <span>{formatRupiah(order.delivery_fee)}</span>
                  </div>
                )}
                <div className="border-b border-neutral-900 pt-1" />
                <div className="flex justify-between text-xs font-bold pt-1">
                  <span>TOTAL:</span>
                  <span>{formatRupiah(order.total_amount)}</span>
                </div>
                <div className="flex justify-between text-[10px] pt-0.5">
                  <span>Metode:</span>
                  <span className="font-bold uppercase">{order.payment_method} ({order.payment_status === 'paid' ? 'LUNAS' : 'PENDING'})</span>
                </div>
                <div className="border-b border-dashed border-neutral-400 pt-2" />
              </div>

              {/* Footer */}
              <div className="text-center pt-2 space-y-1">
                <p className="text-[10px] font-bold">TERIMA KASIH TELAH MENYEDUH</p>
                <p className="text-[8px] text-neutral-500">Unsweetened By Default — Plastic-Free Packaging</p>
                <p className="text-[8px] text-neutral-400 font-mono">changkeer.vercel.app</p>
              </div>

            </div>
          ) : (
            /* =========================================================================
                CUP STICKER LABEL (58mm) - STIKER DITEMPEL DI CUP TEH
                ========================================================================= */
            <div id="printable-thermal-receipt" className="w-[240px] bg-white border border-neutral-300 p-4 rounded-lg shadow-sm font-mono text-[10px] text-black leading-tight space-y-2 print:w-full print:border-none print:shadow-none print:p-0">
              
              <div className="border-b-2 border-black pb-1.5 flex items-center justify-between">
                <span className="font-bold text-[11px]">CHANGKEER CUP</span>
                <span className="text-[9px] font-mono">#{order.order_number.slice(-4)}</span>
              </div>

              <div className="bg-black text-white p-1 text-center font-bold text-xs uppercase rounded">
                {order.order_type === 'dine_in' 
                  ? order.table_number || 'DINE-IN'
                  : order.order_type === 'takeaway'
                    ? 'TAKEAWAY'
                    : 'DELIVERY'}
              </div>

              <div className="text-[9px]">
                <div>Nama: <strong className="text-xs">{order.customer_name}</strong></div>
                <div>Jam: {dateFormatted.split(',')[1] || dateFormatted}</div>
              </div>

              <div className="border-b border-dashed border-neutral-400 pt-1" />

              {/* Rincian item per cup */}
              {(order.items || []).map((item, idx) => (
                <div key={idx} className="space-y-0.5 border-b border-neutral-200 pb-1.5 last:border-none">
                  <div className="font-bold text-[11px] leading-snug">
                    {item.product_name}
                  </div>
                  <div className="text-[10px] font-bold">
                    [{item.temperature === 'hot' ? 'HANGAT 🔥' : 'DINGIN ❄️'}] - GULA {item.sweetness_level}
                  </div>
                  {item.selected_addons?.length ? (
                    <div className="text-[9px] text-neutral-700">
                      +{item.selected_addons.map(a => a.name).join(', ')}
                    </div>
                  ) : null}
                  {item.item_notes ? (
                    <div className="text-[8px] italic text-neutral-600">
                      &ldquo;{item.item_notes}&rdquo;
                    </div>
                  ) : null}
                </div>
              ))}

              <div className="border-t border-dashed border-neutral-400 pt-1 text-center text-[8px] text-neutral-500">
                Freshly Brewed for Your Wellbeing
              </div>

            </div>
          )}

        </div>

        {/* Modal Action Buttons (Hidden on Print) */}
        <div className="p-4 border-t border-neutral-100 bg-white flex items-center justify-between gap-3 print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-600 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Tutup
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-98"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Struk Sekarang</span>
          </button>
        </div>

      </div>
    </div>
  );
}
