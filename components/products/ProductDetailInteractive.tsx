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

  // Left Details Carousel State & Touch Handling
  const [detailSlide, setDetailSlide] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const detailTabs = [
    { label: '01 TITLE', title: 'Blend Identity' },
    { label: '02 NARRATIVE', title: 'Taste Philosophy' },
    { label: '03 INTEGRITY', title: 'Botanical Purity' },
    { label: '04 SENSORY', title: 'Sensory Profile' },
  ];

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 40) {
      setDetailSlide((prev) => Math.min(detailTabs.length - 1, prev + 1));
    } else if (diff < -40) {
      setDetailSlide((prev) => Math.max(0, prev - 1));
    }
    setTouchStartX(null);
  };

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

  // WhatsApp Order & Consultation messages (English)
  const orderMessage = `Hello CHANGKEER, I would like to order:\n\n• Blend: ${product.name}\n• Quantity: ${quantity} pcs\n• Estimated Total: ${formattedTotalPrice}\n\nPlease share stock availability & payment details. Thank you!`;
  const orderWhatsAppUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(orderMessage)}`;

  const consultMessage = `Hello CHANGKEER, I'd like to ask about the "${product.name}" blend. Is it suitable for my daily routine? Thank you.`;
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
    <div className="w-full bg-white text-foreground font-sans">
      {/* 3-Column Bespoke Product Layout: Left Details Carousel | Center Enlaraged Transparent Image | Right Raised Order */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start pb-16 border-b border-border/80">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: Carousel Detail Produk (Judul -> Geser ke Kanan -> Deskripsi dst) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 space-y-6 order-2 lg:order-1">
          {/* Carousel Step Navigation Bar */}
          <div className="flex items-center justify-between pb-2 border-b border-border/70">
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
              {detailTabs.map((tab, idx) => (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => setDetailSlide(idx)}
                  className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-md transition-all cursor-pointer whitespace-nowrap ${
                    detailSlide === idx
                      ? 'bg-primary text-white font-bold shadow-xs'
                      : 'text-muted-foreground hover:text-foreground hover:bg-neutral-100'
                  }`}
                  aria-label={`View ${tab.title}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Carousel Prev/Next Buttons */}
            <div className="flex items-center gap-1 shrink-0 pl-2">
              <button
                type="button"
                onClick={() => setDetailSlide((prev) => Math.max(0, prev - 1))}
                disabled={detailSlide === 0}
                className="w-7 h-7 rounded-full border border-border/80 flex items-center justify-center text-foreground hover:bg-muted disabled:opacity-25 transition-colors cursor-pointer"
                aria-label="Previous detail slide"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setDetailSlide((prev) => Math.min(detailTabs.length - 1, prev + 1))}
                disabled={detailSlide === detailTabs.length - 1}
                className="w-7 h-7 rounded-full border border-border/80 flex items-center justify-center text-foreground hover:bg-muted disabled:opacity-25 transition-colors cursor-pointer"
                aria-label="Next detail slide"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Carousel Slides Container */}
          <div
            className="relative min-h-[300px] overflow-hidden select-none"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* SLIDE 0: Title & Identity (Clean text, No Badge) */}
            {detailSlide === 0 && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="space-y-2">
                  <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-primary font-bold block">
                    {product.category?.name || 'HERBAL LOOSE-LEAF INFUSION'}
                  </span>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-sans font-black uppercase tracking-tight text-foreground leading-[1.12]">
                    {product.name}
                  </h1>
                  {product.tagline && (
                    <p className="text-xs sm:text-sm text-muted-foreground italic font-medium pt-0.5">
                      &ldquo;{product.tagline}&rdquo;
                    </p>
                  )}
                </div>

                <div className="pt-2 text-xs text-muted-foreground space-y-1.5 border-t border-border/60">
                  <p className="line-clamp-3 leading-relaxed">
                    {product.description}
                  </p>
                  <p className="font-mono text-[10px] text-muted-foreground uppercase pt-1">
                    NET WEIGHT: {product.weight_grams || 50}G &bull; 100% BOTANICAL INGREDIENTS
                  </p>
                </div>

                {/* Gesture hint & Next button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setDetailSlide(1)}
                    className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-primary hover:text-primary-hover transition-colors cursor-pointer"
                  >
                    <span>READ FULL DESCRIPTION</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* SLIDE 1: Description & Taste Philosophy (No "02 //" Headline) */}
            {detailSlide === 1 && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground font-semibold block">
                    DESCRIPTION &amp; TASTE PHILOSOPHY
                  </span>
                  <h3 className="text-lg sm:text-xl font-sans font-black uppercase tracking-tight text-foreground">
                    Artisanal Botanical Narrative
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-foreground/85 leading-relaxed">
                  {product.description}
                </p>

                <div className="pt-2 border-t border-border/60 text-xs text-muted-foreground">
                  <p className="italic leading-relaxed">
                    Fresh whole flowers, fruit and roots harvested at peak aromatic intensity, gently dried to preserve essential oils with zero synthetic additives.
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setDetailSlide(0)}
                    className="inline-flex items-center gap-1 text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>BACK TO TITLE</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDetailSlide(2)}
                    className="inline-flex items-center gap-1 text-xs font-mono font-bold uppercase tracking-wider text-primary hover:text-primary-hover cursor-pointer"
                  >
                    <span>BOTANICAL PURITY</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* SLIDE 2: Botanical Integrity & Standards */}
            {detailSlide === 2 && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground font-semibold block">
                    BOTANICAL PURITY &amp; STANDARDS
                  </span>
                  <h3 className="text-lg sm:text-xl font-sans font-black uppercase tracking-tight text-foreground">
                    Honest Quality Checklist
                  </h3>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center gap-2.5 text-foreground font-medium">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    <span>100% Microplastic-Free (Bleach-Free Paper &amp; Muslin Sachets)</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-foreground font-medium">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    <span>Senna-Free (Safe for Daily Habits Without Harsh Laxatives)</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-foreground font-medium">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    <span>Naturally Unsweetened by Default (Organic Sorghum &amp; Raw Honey)</span>
                  </div>
                  {product.weight_grams && (
                    <div className="flex items-center gap-2.5 text-foreground font-medium">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      <span>Net Weight: {product.weight_grams} grams (Ready in under 3 minutes)</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setDetailSlide(1)}
                    className="inline-flex items-center gap-1 text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>DESCRIPTION</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDetailSlide(3)}
                    className="inline-flex items-center gap-1 text-xs font-mono font-bold uppercase tracking-wider text-primary hover:text-primary-hover cursor-pointer"
                  >
                    <span>SENSORY PROFILE</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* SLIDE 3: Sensory Profile (Aroma, Taste, Caffeine, Body) */}
            {detailSlide === 3 && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground font-semibold block">
                    SENSORY TASTING NOTES
                  </span>
                  <h3 className="text-lg sm:text-xl font-sans font-black uppercase tracking-tight text-foreground">
                    Sensory Brew Profile
                  </h3>
                </div>

                {product.characteristics ? (
                  <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                    <div className="p-2.5 rounded-xl border border-border/70 space-y-0.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block font-semibold">AROMA</span>
                      <span className="font-bold text-foreground block">{product.characteristics.aroma || '-'}</span>
                    </div>
                    <div className="p-2.5 rounded-xl border border-border/70 space-y-0.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block font-semibold">TASTE</span>
                      <span className="font-bold text-foreground block">{product.characteristics.taste || '-'}</span>
                    </div>
                    <div className="p-2.5 rounded-xl border border-border/70 space-y-0.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block font-semibold">CAFFEINE</span>
                      <span className="font-bold text-foreground block">{product.characteristics.caffeine || 'Caffeine-Free'}</span>
                    </div>
                    <div className="p-2.5 rounded-xl border border-border/70 space-y-0.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block font-semibold">BODY</span>
                      <span className="font-bold text-foreground block">{product.characteristics.body || '-'}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">Balanced floral bouquet with naturally sweet finish.</p>
                )}

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setDetailSlide(2)}
                    className="inline-flex items-center gap-1 text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>BOTANICAL PURITY</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDetailSlide(0)}
                    className="inline-flex items-center gap-1 text-xs font-mono font-bold uppercase tracking-wider text-primary hover:text-primary-hover cursor-pointer"
                  >
                    <span>BACK TO START</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Share Button */}
          <div className="pt-2 border-t border-border/70">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">LINK COPIED</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>SHARE BLEND</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CENTER COLUMN: Gambar No Background Produk Diperbesar + Tombol Detail Foto */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center order-1 lg:order-2">
          <div className="relative w-full max-w-[400px] sm:max-w-[440px] lg:max-w-[480px] h-[360px] sm:h-[420px] lg:h-[460px] flex items-center justify-center group">
            {/* Ambient Radial Glow on White Background */}
            <div className="absolute inset-0 bg-radial from-primary/12 via-primary/5 to-transparent rounded-full blur-3xl pointer-events-none scale-110" />

            {/* Enlarger Transparent Product Cutout Image in Center */}
            <div className="relative w-full h-full flex items-center justify-center p-2 sm:p-4">
              <Image
                src={transparentImage}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 95vw, 42vw"
                className="object-contain drop-shadow-2xl transition-transform duration-700 ease-out group-hover:scale-105"
                priority
              />
            </div>

            {/* Subtle Base Shadow under the Product */}
            <div className="absolute bottom-2 sm:bottom-4 w-56 sm:w-64 h-6 bg-black/15 rounded-full blur-xl pointer-events-none" />
          </div>

          {/* Center Detail Button */}
          <button
            type="button"
            onClick={() => {
              setActiveModalIndex(0);
              setIsGalleryModalOpen(true);
            }}
            className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest uppercase bg-white border border-border/80 text-foreground px-6 py-3 rounded-full shadow-md hover:border-primary hover:text-primary active:scale-95 transition-all mt-4 cursor-pointer card-boundary group"
          >
            <Eye className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
            <span>VIEW GALLERY ({images.length})</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: Order Button & Stepper (Floating / Raised) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 space-y-6 order-3 lg:pl-4 lg:-mt-4">
          {/* Price Header */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground font-semibold block">
              OFFICIAL UNIT PRICE
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
          <div className="space-y-2 pt-1">
            <label className="text-[11px] font-mono font-bold tracking-wider uppercase text-foreground block">
              PACK QUANTITY
            </label>
            <div className="flex items-center gap-4">
              <div className="inline-flex items-center bg-white border border-border/80 rounded-xl p-1 shadow-md card-boundary">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-foreground hover:bg-muted disabled:opacity-30 transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
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
                  aria-label="Increase quantity"
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

          {/* Primary Action Button: Order via WhatsApp */}
          <div className="space-y-3 pt-3">
            <a
              href={orderWhatsAppUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full inline-flex items-center justify-center gap-2.5 text-xs font-mono font-bold tracking-widest uppercase bg-primary text-white px-7 py-4 rounded-xl hover:bg-primary-hover active:scale-[0.99] transition-all shadow-md cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>ORDER VIA WHATSAPP</span>
            </a>

            <a
              href={consultWhatsAppUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 text-xs font-mono font-bold tracking-widest uppercase bg-white border border-border/80 text-foreground px-6 py-3.5 rounded-xl hover:border-primary hover:text-primary transition-all shadow-md cursor-pointer card-boundary"
            >
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>CONSULT WITH CURATOR</span>
            </a>
          </div>

          {/* Trust Guarantees */}
          <div className="pt-4 border-t border-border/70 space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
              <span>100% Pure Botanical Blend (No Bleach)</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
              <span>Airtight Food-Grade Muslin Packaging</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* POP-UP SLIDE CAROUSEL MODAL */}
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
            className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl p-5 sm:p-7 flex flex-col space-y-4 font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-border/70">
              <div>
                <span className="text-[10px] font-mono tracking-widest uppercase text-primary font-bold block">
                  OFFICIAL PHOTO GALLERY
                </span>
                <h3 className="text-base sm:text-lg font-sans font-bold uppercase tracking-tight text-foreground">
                  {product.name}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsGalleryModalOpen(false)}
                className="w-9 h-9 rounded-full bg-muted/70 hover:bg-muted flex items-center justify-center text-foreground transition-colors cursor-pointer"
                aria-label="Close gallery"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Slide Stage with Aspect Ratio */}
            <div className="relative aspect-[4/3] w-full bg-muted/30 rounded-2xl overflow-hidden border border-border/60 flex items-center justify-center">
              <Image
                src={images[activeModalIndex]}
                alt={`${product.name} photo ${activeModalIndex + 1}`}
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
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={nextModalImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-border/80 text-foreground flex items-center justify-center hover:bg-white shadow-md transition-all active:scale-95 cursor-pointer"
                    aria-label="Next image"
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
