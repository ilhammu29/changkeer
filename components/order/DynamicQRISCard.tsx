'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  QRISScanIcon, 
  CashierCounterIcon, 
  SecureShieldIcon, 
  BrewClockIcon, 
  CheckIcon, 
  CheckCircleIcon,
  CopyClipboardIcon, 
  DownloadTrayIcon,
  CraftStarIcon 
} from '@/components/icons';
import { generateDynamicQRIS, generateQRCodeDataUrl, DEFAULT_STATIC_QRIS } from '@/lib/utils/qris';

interface DynamicQRISCardProps {
  amount: number;
  orderNumber: string;
  customerName?: string;
  onSimulatePay?: () => void;
  isSimulating?: boolean;
  paymentStatus?: 'unpaid' | 'paid' | 'refunded';
}

function formatRupiah(amount: number): string {
  const safe = Number.isFinite(amount) ? amount : 0;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(safe);
}

export function DynamicQRISCard({
  amount,
  orderNumber,
  customerName,
  onSimulatePay,
  isSimulating = false,
  paymentStatus = 'unpaid',
}: DynamicQRISCardProps) {
  const [activeTab, setActiveTab] = useState<'dynamic' | 'static'>('dynamic');
  const [dynamicQrUrl, setDynamicQrUrl] = useState<string | null>(null);
  const [staticQrUrl, setStaticQrUrl] = useState<string | null>(null);
  const [dynamicPayload, setDynamicPayload] = useState<string>('');
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes countdown

  const safeAmount = Number.isFinite(amount) && amount > 0 ? amount : 10000;

  // 1. Generate Dynamic & Static QR Codes
  useEffect(() => {
    try {
      const dynPayload = generateDynamicQRIS(safeAmount);
      setDynamicPayload(dynPayload);

      generateQRCodeDataUrl(dynPayload, { width: 400, margin: 2 }).then((url) => {
        setDynamicQrUrl(url);
      });

      generateQRCodeDataUrl(DEFAULT_STATIC_QRIS, { width: 400, margin: 2 }).then((url) => {
        setStaticQrUrl(url);
      });
    } catch (err) {
      console.error('Failed to generate QRIS:', err);
    }
  }, [safeAmount]);

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
    const payloadToCopy = activeTab === 'dynamic' ? dynamicPayload : DEFAULT_STATIC_QRIS;
    if (!payloadToCopy) return;
    navigator.clipboard.writeText(payloadToCopy);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  const handleCopyAmount = () => {
    navigator.clipboard.writeText(String(safeAmount));
    setCopiedAmount(true);
    setTimeout(() => setCopiedAmount(false), 2000);
  };

  const currentQrUrl = activeTab === 'dynamic' ? (dynamicQrUrl || '/images/qris_base.jpeg') : (staticQrUrl || '/images/qris_base.jpeg');

  const handleDownloadQR = () => {
    if (!currentQrUrl) return;
    const a = document.createElement('a');
    a.href = currentQrUrl;
    a.download = `QRIS-${activeTab.toUpperCase()}-${orderNumber}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // If already paid
  if (paymentStatus === 'paid') {
    return (
      <div className="bg-white border border-emerald-200 rounded-3xl p-6 sm:p-8 shadow-sm font-sans max-w-md mx-auto text-center space-y-4 animate-in fade-in duration-300">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-xs">
          <CheckCircleIcon size={32} />
        </div>
        <div>
          <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-emerald-600 block">
            PAYMENT SETTLED
          </span>
          <h3 className="font-sans font-bold text-xl uppercase tracking-tight text-neutral-900 mt-1">
            Payment Confirmed
          </h3>
          <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
            Your QRIS payment of <strong className="text-neutral-900 font-bold">{formatRupiah(safeAmount)}</strong> has been verified. Your artisanal tea order is being steeped at the counter.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-neutral-200/90 rounded-3xl p-5 sm:p-7 shadow-sm font-sans max-w-md mx-auto space-y-5">
      
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
                {activeTab === 'dynamic' ? 'DYNAMIC' : 'MERCHANT'}
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] font-mono text-red-100 uppercase tracking-wider mt-1">
              NATIONAL PAYMENT STANDARD &bull; ASPI
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
            <span className="font-extrabold tracking-wide uppercase text-white">CHANGKEER ATELIER</span>
          </div>
          <div className="text-right">
            <span className="text-[9px] font-mono text-red-200 uppercase block">ORDER TICKET:</span>
            <span className="font-mono font-bold text-white">#{orderNumber}</span>
          </div>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="grid grid-cols-2 p-1 bg-neutral-100 rounded-xl text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('dynamic')}
          className={`py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'dynamic'
              ? 'bg-white text-neutral-900 shadow-xs'
              : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <QRISScanIcon size={16} className={activeTab === 'dynamic' ? 'text-neutral-900' : 'text-neutral-400'} />
          <span>Auto Amount</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('static')}
          className={`py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'static'
              ? 'bg-white text-neutral-900 shadow-xs'
              : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <CashierCounterIcon size={16} className={activeTab === 'static' ? 'text-neutral-900' : 'text-neutral-400'} />
          <span>Merchant Code</span>
        </button>
      </div>

      {/* QR Code Canvas Frame */}
      <div className="bg-[#FAFAF8] border border-neutral-200 rounded-2xl p-4 sm:p-5 text-center space-y-3.5 relative shadow-2xs">
        
        {/* Dynamic Amount Badge or Manual Amount Helper */}
        {activeTab === 'dynamic' ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold tracking-wider uppercase font-sans">
            <SecureShieldIcon size={14} className="text-emerald-600" />
            <span>Amount Locked: {formatRupiah(safeAmount)}</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs text-neutral-600">Exact Amount:</span>
            <span className="font-mono font-extrabold text-sm text-neutral-900">
              {formatRupiah(safeAmount)}
            </span>
            <button
              type="button"
              onClick={handleCopyAmount}
              className="px-2 py-0.5 rounded-md bg-neutral-200 hover:bg-neutral-300 text-[10px] font-bold uppercase tracking-wider text-neutral-700 transition-colors flex items-center gap-1 cursor-pointer"
            >
              {copiedAmount ? <CheckIcon size={12} className="text-emerald-600" /> : <CopyClipboardIcon size={12} />}
              <span>{copiedAmount ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        )}

        {/* The QR Image */}
        <div className="relative w-56 h-56 sm:w-60 sm:h-60 mx-auto bg-white p-3 rounded-2xl border border-neutral-200 shadow-sm flex items-center justify-center">
          {currentQrUrl ? (
            <div className="relative w-full h-full">
              <Image 
                src={currentQrUrl} 
                alt={`QRIS for ${formatRupiah(safeAmount)}`} 
                fill 
                unoptimized 
                className="object-contain"
                priority
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 text-neutral-400">
              <div className="w-6 h-6 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin" />
              <span className="text-xs font-mono">Generating QR Code...</span>
            </div>
          )}
        </div>

        {/* 15-Minute Expiry Timer */}
        <div className="flex items-center justify-center gap-2 text-xs text-neutral-500 font-sans pt-0.5">
          <BrewClockIcon size={14} className="text-amber-600 shrink-0" />
          <span>QRIS expires in:</span>
          <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
            {formattedTime}
          </span>
        </div>

        <p className="text-[11px] text-neutral-500 max-w-xs mx-auto leading-relaxed">
          {activeTab === 'dynamic'
            ? 'Open GoPay, OVO, Dana, ShopeePay, BCA, Livin Mandiri, BRImo, or any banking app to scan.'
            : 'If your banking app cannot scan auto-amount, scan this merchant code and enter the exact nominal.'}
        </p>
      </div>

      {/* Action Buttons: Download & Copy Payload */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={handleDownloadQR}
          disabled={!currentQrUrl}
          className="py-2.5 px-3 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-800 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          title="Download barcode image"
        >
          <DownloadTrayIcon size={15} />
          <span>Download QR</span>
        </button>

        <button
          type="button"
          onClick={handleCopyPayload}
          disabled={!dynamicPayload}
          className="py-2.5 px-3 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-800 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          title="Copy QR payload string"
        >
          {copiedPayload ? (
            <>
              <CheckIcon size={15} className="text-emerald-600" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <CopyClipboardIcon size={15} />
              <span>Copy Code</span>
            </>
          )}
        </button>
      </div>

      {/* Confirm Payment Button */}
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
              <span>Verifying Payment...</span>
            </>
          ) : (
            <>
              <CraftStarIcon size={16} className="text-amber-400 shrink-0" />
              <span>I Have Paid &bull; Confirm Payment</span>
            </>
          )}
        </button>
      )}

      {/* Supported Apps Footnote */}
      <div className="pt-2 border-t border-neutral-100 text-center space-y-1.5">
        <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block font-semibold">
          ACCEPTS ALL INDONESIAN QRIS APPS
        </span>
        <div className="flex flex-wrap items-center justify-center gap-1.5 text-[10px] font-bold text-neutral-600">
          <span className="px-2 py-0.5 bg-neutral-100 rounded">GoPay</span>
          <span className="px-2 py-0.5 bg-neutral-100 rounded">OVO</span>
          <span className="px-2 py-0.5 bg-neutral-100 rounded">Dana</span>
          <span className="px-2 py-0.5 bg-neutral-100 rounded">ShopeePay</span>
          <span className="px-2 py-0.5 bg-neutral-100 rounded">BCA</span>
          <span className="px-2 py-0.5 bg-neutral-100 rounded">Livin&apos;</span>
          <span className="px-2 py-0.5 bg-neutral-100 rounded">BRImo</span>
          <span className="px-2 py-0.5 bg-neutral-100 rounded">BNI</span>
        </div>
      </div>

    </div>
  );
}
