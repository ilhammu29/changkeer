'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Download, 
  Copy, 
  Check, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  RefreshCw,
  QrCode
} from 'lucide-react';
import { generateDynamicQRIS, generateQRCodeDataUrl } from '@/lib/utils/qris';

interface DynamicQRISCardProps {
  amount: number;
  orderNumber: string;
  customerName?: string;
  onSimulatePay?: () => void;
  isSimulating?: boolean;
}

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function DynamicQRISCard({
  amount,
  orderNumber,
  customerName,
  onSimulatePay,
  isSimulating = false,
}: DynamicQRISCardProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [dynamicPayload, setDynamicPayload] = useState<string>('');
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes countdown

  // 1. Generate Dynamic QRIS on mount or when amount changes
  useEffect(() => {
    try {
      const payload = generateDynamicQRIS(amount);
      setDynamicPayload(payload);

      generateQRCodeDataUrl(payload, { width: 400, margin: 2 }).then((url) => {
        setQrDataUrl(url);
      });
    } catch (err) {
      console.error('Failed to generate dynamic QRIS:', err);
    }
  }, [amount]);

  // 2. 15-Minute Expiry Countdown Timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const handleCopyPayload = () => {
    if (!dynamicPayload) return;
    navigator.clipboard.writeText(dynamicPayload);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  const handleDownloadQR = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `QRIS-DYNAMIC-${orderNumber}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="bg-white border border-neutral-200/90 rounded-3xl p-5 sm:p-8 shadow-sm font-sans max-w-md mx-auto space-y-6">
      
      {/* Official Indonesian QRIS Header Card */}
      <div className="bg-gradient-to-r from-red-600 via-red-700 to-rose-700 text-white rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-xs">
        <div className="absolute right-0 top-0 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-start justify-between relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xl sm:text-2xl tracking-tighter text-white font-sans drop-shadow-xs">
                QRIS
              </span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/20">
                DINAMIS
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] font-mono text-red-100 uppercase tracking-wider mt-1">
              STANDAR PEMBAYARAN NASIONAL
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono uppercase tracking-wider text-red-200 block">
              GPN &bull; ASPI
            </span>
            <span className="text-[11px] font-bold tracking-wider text-white">
              NMID: ID1026598652240
            </span>
          </div>
        </div>

        {/* Merchant & Order Details */}
        <div className="pt-3 mt-3 border-t border-white/20 flex items-center justify-between text-xs">
          <div>
            <span className="text-[9px] font-mono text-red-200 uppercase block">MERCHANT:</span>
            <span className="font-extrabold tracking-wide uppercase text-white">OXID PROJECT / CHANGKEER</span>
          </div>
          <div className="text-right">
            <span className="text-[9px] font-mono text-red-200 uppercase block">ORDER TICKET:</span>
            <span className="font-mono font-bold text-white">#{orderNumber}</span>
          </div>
        </div>
      </div>

      {/* QR Code Canvas Frame with Dynamic Locked Amount */}
      <div className="bg-[#FAFAF8] border border-neutral-200 rounded-2xl p-4 sm:p-6 text-center space-y-3 relative shadow-2xs">
        
        {/* Dynamic Amount Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold tracking-wider uppercase font-sans">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Nominal Otomatis Terkunci: {formatRupiah(amount)}</span>
        </div>

        {/* The QR Image */}
        <div className="relative w-56 h-56 sm:w-64 sm:h-64 mx-auto bg-white p-3 rounded-2xl border border-neutral-200 shadow-sm flex items-center justify-center">
          {qrDataUrl ? (
            <div className="relative w-full h-full">
              <Image 
                src={qrDataUrl} 
                alt={`Dynamic QRIS for ${formatRupiah(amount)}`} 
                fill 
                unoptimized 
                className="object-contain"
                priority
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 text-neutral-400">
              <RefreshCw className="w-6 h-6 animate-spin text-neutral-400" />
              <span className="text-xs font-mono">Generating Dynamic QR...</span>
            </div>
          )}
        </div>

        {/* 15-Minute Expiry Timer */}
        <div className="flex items-center justify-center gap-2 text-xs text-neutral-500 font-sans pt-1">
          <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>QRIS berlaku selama:</span>
          <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
            {formattedTime}
          </span>
        </div>

        <p className="text-[11px] text-neutral-500 max-w-xs mx-auto leading-relaxed">
          Buka aplikasi GoPay, OVO, BCA, Livin Mandiri, BRImo, Dana, ShopeePay, atau m-Banking Anda, lalu scan QR di atas.
        </p>
      </div>

      {/* Action Buttons: Download & Copy Payload */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={handleDownloadQR}
          disabled={!qrDataUrl}
          className="py-2.5 px-3 rounded-xl border border-neutral-300 hover:bg-neutral-50 text-neutral-800 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          title="Download gambar barcode QRIS"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Unduh QR</span>
        </button>

        <button
          type="button"
          onClick={handleCopyPayload}
          disabled={!dynamicPayload}
          className="py-2.5 px-3 rounded-xl border border-neutral-300 hover:bg-neutral-50 text-neutral-800 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          title="Salin teks payload string QRIS"
        >
          {copiedPayload ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Tersalin!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Salin Kode</span>
            </>
          )}
        </button>
      </div>

      {/* Confirm Payment / Simulator Button */}
      {onSimulatePay && (
        <button
          type="button"
          onClick={onSimulatePay}
          disabled={isSimulating}
          className="w-full py-3.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-98"
        >
          {isSimulating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Memverifikasi Pembayaran...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Saya Sudah Membayar &bull; Konfirmasi</span>
            </>
          )}
        </button>
      )}

      {/* Supported Banks & E-Wallets Footnote */}
      <div className="pt-2 border-t border-neutral-100 text-center space-y-1.5">
        <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block font-semibold">
          MENERIMA SEMUA APLIKASI QRIS INDONESIA
        </span>
        <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] font-bold text-neutral-600">
          <span className="px-2 py-0.5 bg-neutral-100 rounded">GoPay</span>
          <span className="px-2 py-0.5 bg-neutral-100 rounded">OVO</span>
          <span className="px-2 py-0.5 bg-neutral-100 rounded">Dana</span>
          <span className="px-2 py-0.5 bg-neutral-100 rounded">ShopeePay</span>
          <span className="px-2 py-0.5 bg-neutral-100 rounded">BCA</span>
          <span className="px-2 py-0.5 bg-neutral-100 rounded">Mandiri</span>
          <span className="px-2 py-0.5 bg-neutral-100 rounded">BRI</span>
          <span className="px-2 py-0.5 bg-neutral-100 rounded">BNI</span>
        </div>
      </div>

    </div>
  );
}
