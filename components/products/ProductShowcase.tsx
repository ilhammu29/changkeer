'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Clock,
  Leaf,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';

interface ProductShowcaseItem {
  id: string;
  name: string;
  shortName: string;
  watermark: string;
  category: string;
  tagline: string;
  description: string;
  price: string;
  priceRaw: number;
  weight: string;
  image: string;
  tasteNotes: string[];
  brewing: string;
  benefits: string;
  slug: string;
  ringColor: string;
  glowColor: string;
  accentText: string;
}

const FEATURED_PRODUCTS: ProductShowcaseItem[] = [
  {
    id: 'jasmine-tea',
    name: 'JASMINE TEA',
    shortName: 'Jasmine Tea',
    watermark: 'JASMINE',
    category: 'TEH HERBAL ALAMI',
    tagline: 'Harmoni Daun Teh Pilihan & Kelopak Melati Utuh',
    description:
      'Terinspirasi tradisi teh herbal fungsional nusantara. Memadukan daun teh pilihan dengan kuntum melati utuh, pemanis alami gula sorgum rendah glikemik, serta madu hutan murni. 100% bebas mikroplastik.',
    price: 'Rp 45.000',
    priceRaw: 45000,
    weight: '250g Loose Leaf',
    image: '/images/products-nobg/jasmine-tea.png',
    tasteNotes: ['Harum Melati Alami', 'Manis Lembut Seimbang', 'Bebas Pahit Pekat'],
    brewing: '85-90°C • Seduh < 3 Menit',
    benefits: 'Menenangkan pikiran, menjaga kejernihan fokus tanpa memicu asam lambung.',
    slug: '/katalog/solar-term-jasmine-herbal-tea',
    ringColor: '#c49a45',
    glowColor: 'rgba(196, 154, 69, 0.18)',
    accentText: 'text-[#e5bf65]',
  },
  {
    id: 'english-breakfast-tea',
    name: 'ENGLISH BREAKFAST',
    shortName: 'English Breakfast',
    watermark: 'BREAKFAST',
    category: 'TEH HITAM BOTANIKAL',
    tagline: 'Karakter Teh Hitam Bold & Energi Bersih Tahan Lama',
    description:
      'Seduhan teh hitam berkarakter kaya rasa yang terinspirasi tradisi sarapan klasik. Diracik dengan dedikasi kearifan nusantara untuk stamina kerja harian tanpa crash atau debar jantung berlebih.',
    price: 'Rp 48.000',
    priceRaw: 48000,
    weight: '250g Loose Leaf',
    image: '/images/products-nobg/english-breakfast-tea.png',
    tasteNotes: ['Aroma Malted Hangat', 'Sentuhan Karamel Sorgum', 'Bold & Full-Bodied'],
    brewing: '95°C • Seduh < 3 Menit',
    benefits: 'Meningkatkan konsentrasi dan energi bersih stabil sepanjang pagi hingga siang.',
    slug: '/katalog/english-breakfast-tea',
    ringColor: '#a85b3b',
    glowColor: 'rgba(168, 91, 59, 0.18)',
    accentText: 'text-[#e88965]',
  },
  {
    id: 'vanilla-mint-tea',
    name: 'VANILLA MINT TEA',
    shortName: 'Vanilla Mint',
    watermark: 'VANILLA',
    category: 'TISANE HERBAL SEGAR',
    tagline: 'Sensasi Semilir Dingin Daun Mint & Kelembutan Vanilla Menenangkan',
    description:
      'Kombinasi harmonis antara sensasi sejuk segar daun mint alami dan kelembutan aroma polong vanilla alami nusantara. Melegakan pernapasan dan meredakan kepenatan aktivitas aktif harian.',
    price: 'Rp 48.000',
    priceRaw: 48000,
    weight: '250g Loose Leaf',
    image: '/images/products-nobg/vanilla-mint-tea.png',
    tasteNotes: ['Sensasi Semilir Dingin', 'Aroma Creamy Lembut', 'Napas Segar Alami'],
    brewing: '90°C • Seduh < 3 Menit',
    benefits: 'Melegakan saluran pernapasan dan menurunkan tingkat ketegangan setelah beraktivitas.',
    slug: '/katalog/vanilla-mint-tea',
    ringColor: '#4d8f78',
    glowColor: 'rgba(77, 143, 120, 0.18)',
    accentText: 'text-[#7ad1b2]',
  },
];

export function ProductShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev'>('next');
  const touchStartX = useRef<number | null>(null);

  const total = FEATURED_PRODUCTS.length;
  const current = FEATURED_PRODUCTS[currentIndex];

  const changeSlide = useCallback(
    (newIndex: number, direction: 'next' | 'prev') => {
      if (isAnimating || newIndex === currentIndex) return;
      setSlideDirection(direction);
      setIsAnimating(true);
      setCurrentIndex(newIndex);
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 450);
      return () => clearTimeout(timer);
    },
    [currentIndex, isAnimating]
  );

  const handleNext = useCallback(() => {
    const nextIdx = (currentIndex + 1) % total;
    changeSlide(nextIdx, 'next');
  }, [changeSlide, currentIndex, total]);

  const handlePrev = useCallback(() => {
    const prevIdx = (currentIndex - 1 + total) % total;
    changeSlide(prevIdx, 'prev');
  }, [changeSlide, currentIndex, total]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
    touchStartX.current = null;
  };

  return (
    <section
      className="relative w-full min-h-[82vh] lg:min-h-[88vh] flex flex-col justify-between pt-24 pb-12 lg:pt-28 lg:pb-16 bg-[#0c0b11] text-white overflow-hidden select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Atmosphere & Ambient Vignette */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Subtle radial ambient glow matching active product */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[140px] transition-all duration-1000 ease-out"
          style={{ background: current.glowColor }}
        />
        {/* Dark radial vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(12,11,17,0.85)_80%)]" />
      </div>

      {/* Top Subtle Sub-header */}
      <Container size="wide" className="relative z-10 mb-4 sm:mb-6">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 text-[11px] font-mono tracking-[0.25em] text-white/50 uppercase">
          <div className="flex items-center gap-3">
            <span className="text-white/80 font-bold">CHANGKEER</span>
            <span className="text-white/25">/</span>
            <span className="hidden sm:inline">KOLEKSI TEH BOTANIKAL</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-white/70">
              0{currentIndex + 1} <span className="text-white/30">/</span> 0{total}
            </span>
          </div>
        </div>
      </Container>

      {/* Main Showcase Stage (Reference: revisi-halaman_tentang_produk_v2.jpg) */}
      <div className="relative z-10 flex-1 flex items-center w-full my-auto">
        <Container size="wide" className="w-full">
          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center min-h-[460px] sm:min-h-[520px] lg:min-h-[560px]">
            {/* Giant Watermark Typography behind the product */}
            <div
              className={`absolute inset-0 flex items-center justify-center pointer-events-none -z-5 transition-opacity duration-700 ${
                isAnimating ? 'opacity-0' : 'opacity-100'
              }`}
              aria-hidden="true"
            >
              <span className="font-sans font-black text-[13vw] sm:text-[11vw] tracking-tighter text-white/[0.035] uppercase select-none leading-none">
                {current.watermark}
              </span>
            </div>

            {/* LEFT COLUMN: Tea Name & Minimal Information */}
            <div
              className={`lg:col-span-4 flex flex-col justify-center space-y-4 sm:space-y-5 text-left order-2 lg:order-1 transition-all duration-500 ease-out ${
                isAnimating
                  ? slideDirection === 'next'
                    ? 'opacity-30 -translate-x-3'
                    : 'opacity-30 translate-x-3'
                  : 'opacity-100 translate-x-0'
              }`}
            >
              {/* Category pill */}
              <div className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-mono tracking-[0.22em] uppercase text-white/60">
                <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
                <span>{current.category}</span>
              </div>

              {/* Title & Mobile Price Row */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white leading-tight">
                    {current.name}
                  </h1>
                  <p className="text-xs sm:text-sm text-white/75 font-normal leading-relaxed max-w-sm">
                    {current.tagline}
                  </p>
                </div>

                {/* Mobile-only Price Display */}
                <div className="lg:hidden text-right flex-shrink-0 pt-1">
                  <span className="text-[9px] font-mono tracking-widest text-white/40 uppercase block">
                    HARGA
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {current.price}
                  </div>
                  <span className="text-[10px] font-mono text-white/50">
                    {current.weight}
                  </span>
                </div>
              </div>

              {/* Description (concise, small font) */}
              <p className="text-xs text-white/60 leading-relaxed max-w-sm font-light">
                {current.description}
              </p>

              {/* Tasting notes chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {current.tasteNotes.map((note) => (
                  <span
                    key={note}
                    className="text-[10px] font-mono tracking-wider px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-white/75"
                  >
                    {note}
                  </span>
                ))}
              </div>

              {/* Catalog Link */}
              <div className="pt-2">
                <Link
                  href={current.slug}
                  className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-white/90 hover:text-white group transition-colors"
                >
                  <span className="border-b border-white/40 group-hover:border-white pb-0.5 transition-all">
                    Detail Racikan Lengkap
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </div>

            {/* CENTER COLUMN: Hero Product with Transparent Cutout & Accent Ring */}
            <div className="lg:col-span-4 flex items-center justify-center relative order-1 lg:order-2 my-2 sm:my-0">
              {/* Minimalist Graphic Accent Ring (Reference: revisi-halaman_tentang_produk_v2.jpg) */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] sm:w-[280px] lg:w-[320px] h-[220px] sm:h-[280px] lg:h-[320px] rounded-full border border-white/10 pointer-events-none -z-2 transition-all duration-700"
                style={{
                  boxShadow: `0 0 60px -10px ${current.glowColor}`,
                }}
              />
              <div
                className="absolute top-[38%] left-[58%] -translate-x-1/2 -translate-y-1/2 w-[90px] sm:w-[120px] h-[90px] sm:h-[120px] rounded-full border-2 pointer-events-none -z-1 opacity-75 transition-colors duration-700"
                style={{ borderColor: current.ringColor }}
              />

              {/* Mobile Arrow Controls overlay on sides of product */}
              <button
                type="button"
                onClick={handlePrev}
                className="lg:hidden absolute left-0 z-20 w-9 h-9 rounded-full border border-white/20 bg-black/60 backdrop-blur-md text-white flex items-center justify-center active:scale-90"
                aria-label="Varian sebelumnya"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="lg:hidden absolute right-0 z-20 w-9 h-9 rounded-full border border-white/20 bg-black/60 backdrop-blur-md text-white flex items-center justify-center active:scale-90"
                aria-label="Varian berikutnya"
              >
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Product Cutout Image with Smooth Carousel Transitions */}
              <div
                className={`relative w-[280px] sm:w-[340px] lg:w-[380px] h-[360px] sm:h-[430px] lg:h-[470px] flex items-center justify-center transition-all duration-500 ease-out transform ${
                  isAnimating
                    ? slideDirection === 'next'
                      ? 'opacity-20 scale-95 translate-x-4'
                      : 'opacity-20 scale-95 -translate-x-4'
                    : 'opacity-100 scale-100 translate-x-0'
                }`}
              >
                <Image
                  src={current.image}
                  alt={current.name}
                  fill
                  priority
                  sizes="(max-width: 640px) 280px, (max-width: 1024px) 340px, 380px"
                  className="object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.85)] filter hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
            </div>

            {/* RIGHT COLUMN: Price & Navigation Controls */}
            <div
              className={`lg:col-span-4 hidden lg:flex flex-col justify-center space-y-5 text-right order-3 transition-all duration-500 ease-out ${
                isAnimating
                  ? slideDirection === 'next'
                    ? 'opacity-30 translate-x-3'
                    : 'opacity-30 -translate-x-3'
                  : 'opacity-100 translate-x-0'
              }`}
            >
              {/* Price Block */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono tracking-[0.25em] text-white/50 uppercase block">
                  HARGA RESMI
                </span>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                  {current.price}
                </div>
                <div className="text-xs font-mono text-white/60 tracking-wider">
                  {current.weight}
                </div>
              </div>

              {/* Quick Specs / Brewing info */}
              <div className="space-y-2 text-xs text-white/65 lg:ml-auto max-w-xs">
                <div className="flex items-center gap-2 lg:justify-end">
                  <Clock className="w-3.5 h-3.5 text-white/50 flex-shrink-0" />
                  <span>{current.brewing}</span>
                </div>
                <div className="flex items-center gap-2 lg:justify-end">
                  <ShieldCheck className="w-3.5 h-3.5 text-white/50 flex-shrink-0" />
                  <span>100% Bebas Mikroplastik & Senna</span>
                </div>
                <div className="flex items-center gap-2 lg:justify-end">
                  <Leaf className="w-3.5 h-3.5 text-white/50 flex-shrink-0" />
                  <span>Pemanis Sorgum & Madu Murni</span>
                </div>
              </div>

              {/* Minimalist Navigation Arrow (Reference style) */}
              <div className="flex items-center gap-3 pt-3 lg:justify-end">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="w-11 h-11 rounded-full border border-white/20 bg-white/[0.04] hover:bg-white/15 text-white flex items-center justify-center transition-all duration-200 active:scale-90 cursor-pointer shadow-lg"
                  aria-label="Varian sebelumnya"
                  title="Produk Sebelumnya (←)"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="w-11 h-11 rounded-full border border-white/20 bg-white/[0.04] hover:bg-white/15 text-white flex items-center justify-center transition-all duration-200 active:scale-90 cursor-pointer shadow-lg"
                  aria-label="Varian berikutnya"
                  title="Produk Berikutnya (→)"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* BOTTOM SELECTOR: Minimalist Product Pills / Carousel Selector */}
      <Container size="wide" className="relative z-10 pt-4 sm:pt-6">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 border-t border-white/[0.08] pt-4">
          {FEATURED_PRODUCTS.map((prod, idx) => {
            const isActive = currentIndex === idx;
            return (
              <button
                key={prod.id}
                type="button"
                onClick={() => changeSlide(idx, idx > currentIndex ? 'next' : 'prev')}
                className={`group flex items-center gap-2.5 px-3.5 py-2 rounded-full text-xs transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-white text-black font-semibold shadow-md'
                    : 'bg-white/[0.04] hover:bg-white/[0.08] text-white/60 hover:text-white border border-white/[0.08]'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    isActive ? 'bg-black' : 'bg-white/40 group-hover:bg-white'
                  }`}
                />
                <span className="font-mono text-[11px] tracking-wider uppercase">
                  {prod.shortName}
                </span>
                <span
                  className={`text-[10px] font-mono ${
                    isActive ? 'text-black/70' : 'text-white/40'
                  }`}
                >
                  {prod.price}
                </span>
              </button>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
