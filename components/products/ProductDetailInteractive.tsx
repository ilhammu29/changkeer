'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Product } from '@/types';
import {
  Minus,
  Plus,
  Share2,
  Check,
  CheckCircle2,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  MessageCircle,
  Sparkles,
} from 'lucide-react';

interface ProductDetailInteractiveProps {
  product: Product;
  contactPhone: string;
}

const NOBG_MAP: Record<string, string> = {
  'solar-term-jasmine-herbal-tea': '/images/products-nobg/jasmine-tea.png',
  'jasmine-tea': '/images/products-nobg/jasmine-tea.png',
  'english-breakfast-tea': '/images/products-nobg/english-breakfast-tea.png',
  'vanilla-mint-tea': '/images/products-nobg/vanilla-mint-tea.png',
};

export function ProductDetailInteractive({
  product,
  contactPhone,
}: ProductDetailInteractiveProps) {
  // Extract all available images without duplicates for the popup carousel
  const rawImages = [
    product.featured_image,
    ...(product.gallery || []),
  ].filter(Boolean) as string[];

  const images = rawImages.length > 0
    ? Array.from(new Set(rawImages))
    : ['/images/assets/jasmine_tea_produk.jpg'];

  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);

  // Popup Slide Carousel Modal States
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [activeModalIndex, setActiveModalIndex] = useState(0);

  // No-background transparent center image
  const transparentImage =
    NOBG_MAP[product.slug] || '/images/products-nobg/jasmine-tea.png';

  // Formatted Unit & Total Prices
  const formattedUnitPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(product.price);

  const totalPrice = product.price * quantity;
  const formattedTotalPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(totalPrice);

  // Clean phone number for WhatsApp
  const cleanPhone = contactPhone.replace(/[^0-9]/g, '');
  const targetPhone = cleanPhone.startsWith('0')
    ? '62' + cleanPhone.slice(1)
    : cleanPhone.startsWith('62')
    ? cleanPhone
    : '6281234567890';

  // WhatsApp Order & Consultation messages
  const orderMessage = `Halo CHANGKEER, saya ingin memesan racikan teh herbal resmi:\n\n• Produk: ${product.name}\n• Jumlah: ${quantity} pcs\n• Estimasi Total: ${formattedTotalPrice}\n\nMohon informasi ketersediaan stok & nomor rekening pembayaran resmi. Terima kasih!`;
  const orderWhatsAppUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(orderMessage)}`;

  const consultMessage = `Halo CHANGKEER, saya ingin berkonsultasi mengenai racikan teh "${product.name}". Apakah cocok untuk rutinitas saya? Terima kasih.`;
  const consultWhatsAppUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(consultMessage)}`;

  const handleShare = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // ignore
    }
  };

  // Keyboard navigation for modal popup carousel
  const nextModalImage = useCallback(() => {
    setActiveModalIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevModalImage = useCallback(() => {
    setActiveModalIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (!isGalleryModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsGalleryModalOpen(false);
      if (e.key === 'ArrowRight') nextModalImage();
      if (e.key === 'ArrowLeft') prevModalImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGalleryModalOpen, nextModalImage, prevModalImage]);

  return (
    <div className="w-full bg-white text-foreground">
      {/* 3-Column Bespoke Product Layout: Left Details | Center Transparent Image | Right Floating Order */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center pb-16 border-b border-border/80">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: Detail Produk (Spesifikasi & Narasi) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 space-y-6 order-2 lg:order-1">
          <div className="space-y-2">
            <span className="text-[10px] font-mono tracking-widest uppercase text-primary font-bold px-3 py-1 rounded-full bg-primary/10 border border-primary/20 inline-block">
              {product.category?.name || 'RACIKAN HERBAL ASLI'}
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold uppercase tracking-tight text-foreground leading-[1.15]">
              {product.name}
            </h1>
            {product.tagline && (
              <p className="text-xs sm:text-sm font-serif italic text-muted-foreground pt-0.5">
                &ldquo;{product.tagline}&rdquo;
              </p>
            )}
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          {/* Botanical Integrity Specs */}
          <div className="space-y-2.5 pt-2 border-t border-border/70 text-xs">
            <div className="flex items-center gap-2 text-foreground font-medium">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
              <span>100% Bebas Mikroplastik (Bleach-Free)</span>
            </div>
            <div className="flex items-center gap-2 text-foreground font-medium">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
              <span>Bebas Daun Senna (Aman Harian Tanpa Laksatif)</span>
            </div>
            <div className="flex items-center gap-2 text-foreground font-medium">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
              <span>Gula Sorgum Organik &amp; Madu Rendah Glikemik</span>
            </div>
            {product.weight_grams && (
              <div className="flex items-center gap-2 text-foreground font-medium">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>Netto: {product.weight_grams} gram (Seduh Cepat &lt; 3 Menit)</span>
              </div>
            )}
          </div>

          {/* Taste Characteristics */}
          {product.characteristics && (
            <div className="pt-4 border-t border-border/70 space-y-2 text-xs">
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground font-semibold block">
                PROFIL SENSORIK
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                {product.characteristics.aroma && (
                  <div>
                    <span className="font-semibold text-foreground">Aroma:</span>{' '}
                    <span className="text-muted-foreground">{product.characteristics.aroma}</span>
                  </div>
                )}
                {product.characteristics.taste && (
                  <div>
                    <span className="font-semibold text-foreground">Rasa:</span>{' '}
                    <span className="text-muted-foreground">{product.characteristics.taste}</span>
                  </div>
                )}
                {product.characteristics.caffeine && (
                  <div>
                    <span className="font-semibold text-foreground">Kafein:</span>{' '}
                    <span className="text-muted-foreground">{product.characteristics.caffeine}</span>
                  </div>
                )}
                {product.characteristics.body && (
                  <div>
                    <span className="font-semibold text-foreground">Karakter:</span>{' '}
                    <span className="text-muted-foreground">{product.characteristics.body}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Share Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">TAUTAN TERSALIN</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>BAGIKAN PRODUK</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CENTER COLUMN: Gambar No Background Produk di Tengah + Tombol Detail Visual */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center order-1 lg:order-2">
          <div className="relative w-full max-w-[340px] sm:max-w-[380px] aspect-[4/5] flex items-center justify-center group">
            {/* Subtle Ambient Radial Light behind product on white background */}
            <div className="absolute inset-0 bg-radial from-primary/10 via-primary/5 to-transparent rounded-full blur-2xl pointer-events-none" />

            {/* Transparent Product Image in Center */}
            <div className="relative w-full h-full flex items-center justify-center p-4">
              <Image
                src={transparentImage}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 90vw, 35vw"
                className="object-contain drop-shadow-2xl transition-transform duration-700 ease-out group-hover:scale-105"
                priority
              />
            </div>

            {/* Subtle Base Shadow under the Product */}
            <div className="absolute bottom-6 w-48 h-5 bg-black/15 rounded-full blur-lg pointer-events-none" />
          </div>

          {/* Tombol Detail di Tengah (Membuka Popup Slide Carousel Gambar Produk) */}
          <button
            type="button"
            onClick={() => {
              setActiveModalIndex(0);
              setIsGalleryModalOpen(true);
            }}
            className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest uppercase bg-white border border-border/80 text-foreground px-6 py-3 rounded-full shadow-xs hover:border-primary hover:text-primary active:scale-95 transition-all mt-4 cursor-pointer card-boundary group"
          >
            <Eye className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
            <span>DETAIL FOTO ({images.length})</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: Tombol Order & Jumlah (Floating Seamless Tanpa Cardbox/Transparan) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 space-y-6 order-3 lg:pl-4">
          {/* Price Header */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground font-semibold block">
              HARGA RESMI SATUAN
            </span>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-mono font-black text-primary">
                {formattedUnitPrice}
              </span>
              <span className="text-xs font-mono text-muted-foreground uppercase">
                / {product.weight_grams ? `${product.weight_grams}g` : 'Pack'}
              </span>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="space-y-2 pt-2">
            <label className="text-[11px] font-mono font-bold tracking-wider uppercase text-foreground block">
              JUMLAH KEMASAN
            </label>
            <div className="flex items-center gap-4">
              <div className="inline-flex items-center bg-white border border-border/80 rounded-xl p-1 shadow-xs card-boundary">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-foreground hover:bg-muted disabled:opacity-30 transition-colors cursor-pointer"
                  aria-label="Kurangi jumlah"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <span className="w-12 text-center font-mono font-bold text-base text-foreground">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-foreground hover:bg-muted transition-colors cursor-pointer"
                  aria-label="Tambah jumlah"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Subtotal Display */}
              <div className="text-xs font-mono">
                <span className="text-muted-foreground block text-[10px] uppercase">SUBTOTAL</span>
                <span className="font-bold text-sm text-foreground">{formattedTotalPrice}</span>
              </div>
            </div>
          </div>

          {/* Primary Action Button: Pesan via WhatsApp */}
          <div className="space-y-3 pt-4">
            <a
              href={orderWhatsAppUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full inline-flex items-center justify-center gap-2.5 text-xs font-mono font-bold tracking-widest uppercase bg-primary text-white px-7 py-4 rounded-xl hover:bg-primary-hover active:scale-[0.99] transition-all shadow-sm cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>PESAN VIA WHATSAPP</span>
            </a>

            <a
              href={consultWhatsAppUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 text-xs font-mono font-bold tracking-widest uppercase bg-white border border-border/80 text-foreground px-6 py-3.5 rounded-xl hover:border-primary hover:text-primary transition-all shadow-xs cursor-pointer card-boundary"
            >
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>KONSULTASI RACIKAN DULU</span>
            </a>
          </div>

          {/* Trust Guarantees */}
          <div className="pt-4 border-t border-border/70 space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
              <span>Garansi 100% Produk Herbal Asli Tanpa Pemutih</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
              <span>Kemasan Kedap Udara &amp; Higienis Food-Grade</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* POP-UP SLIDE CAROUSEL MODAL (Simple, Elegan, Tidak Terpotong) */}
      {/* ========================================================================= */}
      {isGalleryModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setIsGalleryModalOpen(false)}
        >
          {/* Modal Container */}
          <div
            className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl p-5 sm:p-7 flex flex-col space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-border/70">
              <div>
                <span className="text-[10px] font-mono tracking-widest uppercase text-primary font-bold block">
                  GALERI FOTO RESMI
                </span>
                <h3 className="text-base sm:text-lg font-serif font-bold uppercase tracking-tight text-foreground">
                  {product.name}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsGalleryModalOpen(false)}
                className="w-9 h-9 rounded-full bg-muted/70 hover:bg-muted flex items-center justify-center text-foreground transition-colors cursor-pointer"
                aria-label="Tutup galeri"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Slide Stage with Aspect Ratio */}
            <div className="relative aspect-[4/3] w-full bg-muted/30 rounded-2xl overflow-hidden border border-border/60 flex items-center justify-center">
              <Image
                src={images[activeModalIndex]}
                alt={`${product.name} foto ${activeModalIndex + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 672px"
                className="object-cover object-center transition-all duration-300"
                priority
              />

              {/* Navigation Chevrons */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevModalImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-border/80 text-foreground flex items-center justify-center hover:bg-white shadow-md transition-all active:scale-95 cursor-pointer"
                    aria-label="Foto sebelumnya"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={nextModalImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-border/80 text-foreground flex items-center justify-center hover:bg-white shadow-md transition-all active:scale-95 cursor-pointer"
                    aria-label="Foto berikutnya"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Counter Badge */}
              <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-md text-white text-[10px] font-mono px-3 py-1 rounded-full">
                {activeModalIndex + 1} / {images.length}
              </div>
            </div>

            {/* Thumbnails Row */}
            {images.length > 1 && (
              <div className="flex items-center gap-2.5 overflow-x-auto pt-1 pb-1">
                {images.map((img, idx) => (
                  <button
                    key={img + idx}
                    type="button"
                    onClick={() => setActiveModalIndex(idx)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      activeModalIndex === idx
                        ? 'border-primary ring-2 ring-primary/20 scale-105'
                        : 'border-border/80 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
