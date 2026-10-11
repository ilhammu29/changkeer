'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';

interface ProductShowcaseItem {
  id: string;
  name: string;
  shortName: string;
  watermark: string;
  price: string;
  image: string;
  ringColor: string;
  glowColor: string;
}

const FEATURED_PRODUCTS: ProductShowcaseItem[] = [
  {
    id: 'jasmine-tea',
    name: 'JASMINE TEA',
    shortName: 'Jasmine Tea',
    watermark: 'JASMINE',
    price: 'Rp 45.000',
    image: '/images/products-nobg/jasmine-tea.png',
    ringColor: '#c49a45',
    glowColor: 'rgba(196, 154, 69, 0.22)',
  },
  {
    id: 'english-breakfast-tea',
    name: 'ENGLISH BREAKFAST',
    shortName: 'English Breakfast',
    watermark: 'BREAKFAST',
    price: 'Rp 48.000',
    image: '/images/products-nobg/english-breakfast-tea.png',
    ringColor: '#a85b3b',
    glowColor: 'rgba(168, 91, 59, 0.22)',
  },
  {
    id: 'vanilla-mint-tea',
    name: 'VANILLA MINT TEA',
    shortName: 'Vanilla Mint',
    watermark: 'VANILLA',
    price: 'Rp 48.000',
    image: '/images/products-nobg/vanilla-mint-tea.png',
    ringColor: '#4d8f78',
    glowColor: 'rgba(77, 143, 120, 0.22)',
  },
];

export function ProductShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const total = FEATURED_PRODUCTS.length;
  const current = FEATURED_PRODUCTS[currentIndex];

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

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
      className="relative w-full min-h-[80vh] lg:min-h-[86vh] flex flex-col justify-between pt-20 pb-10 lg:pt-24 lg:pb-14 bg-[#0c0b11] text-white overflow-hidden select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Atmosphere & Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Dynamic radial glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] rounded-full blur-[150px] transition-all duration-1000 ease-out"
          style={{ background: current.glowColor }}
        />
        {/* Dark radial vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(12,11,17,0.9)_80%)]" />
      </div>

      {/* Main Stage: Minimalist Composition (Left: Title Only, Center: Large Product, Right: Price Only) */}
      <div className="relative z-10 flex-1 flex items-center w-full my-auto">
        <Container size="wide" className="w-full">
          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-4 items-center min-h-[480px] sm:min-h-[540px] lg:min-h-[600px]">
            {/* Giant Watermark Typography behind the product (smooth cross-fade) */}
            {FEATURED_PRODUCTS.map((prod, idx) => {
              const isActive = idx === currentIndex;
              return (
                <div
                  key={prod.id}
                  className={`absolute inset-0 flex items-center justify-center pointer-events-none -z-5 transition-opacity duration-700 ease-out ${
                    isActive ? 'opacity-100' : 'opacity-0'
                  }`}
                  aria-hidden="true"
                >
                  <span className="font-sans font-black text-[15vw] sm:text-[13vw] tracking-tighter text-white/[0.04] uppercase select-none leading-none">
                    {prod.watermark}
                  </span>
                </div>
              );
            })}

            {/* LEFT COLUMN: ONLY Product Title (smooth transition, no extra text/badges) */}
            <div className="lg:col-span-4 flex flex-col justify-center text-left order-2 lg:order-1 relative h-20 sm:h-24 lg:h-32">
              {FEATURED_PRODUCTS.map((prod, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <div
                    key={prod.id}
                    className={`absolute inset-x-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isActive
                        ? 'opacity-100 translate-y-0 pointer-events-auto'
                        : idx < currentIndex
                        ? 'opacity-0 -translate-y-8 pointer-events-none'
                        : 'opacity-0 translate-y-8 pointer-events-none'
                    }`}
                  >
                    <h1 className="text-2xl sm:text-3xl lg:text-5xl font-black uppercase tracking-tight text-white leading-tight">
                      {prod.name}
                    </h1>
                  </div>
                );
              })}
            </div>

            {/* CENTER COLUMN: Hero Product with Transparent Cutout & Halo Ring (Enlarged Size, No-glitch Animation) */}
            <div className="lg:col-span-4 flex items-center justify-center relative order-1 lg:order-2 my-2 sm:my-0">
              {/* Minimalist Graphic Accent Rings */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] sm:w-[320px] lg:w-[360px] h-[260px] sm:h-[320px] lg:h-[360px] rounded-full border border-white/10 pointer-events-none -z-2 transition-all duration-700"
                style={{
                  boxShadow: `0 0 70px -10px ${current.glowColor}`,
                }}
              />
              <div
                className="absolute top-[38%] left-[58%] -translate-x-1/2 -translate-y-1/2 w-[100px] sm:w-[130px] h-[100px] sm:h-[130px] rounded-full border-2 pointer-events-none -z-1 opacity-75 transition-colors duration-700"
                style={{ borderColor: current.ringColor }}
              />

              {/* Mobile Arrows Floating beside the Product */}
              <button
                type="button"
                onClick={handlePrev}
                className="lg:hidden absolute left-0 z-30 w-10 h-10 rounded-full border border-white/20 bg-black/60 backdrop-blur-md text-white flex items-center justify-center active:scale-90"
                aria-label="Varian sebelumnya"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="lg:hidden absolute right-0 z-30 w-10 h-10 rounded-full border border-white/20 bg-black/60 backdrop-blur-md text-white flex items-center justify-center active:scale-90"
                aria-label="Varian berikutnya"
              >
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Stacked Product Cutouts: Pre-mounted in DOM for 100% glitch-free smooth glide */}
              <div className="relative w-[320px] sm:w-[420px] lg:w-[480px] h-[400px] sm:h-[500px] lg:h-[580px] flex items-center justify-center">
                {FEATURED_PRODUCTS.map((prod, idx) => {
                  const isActive = idx === currentIndex;
                  return (
                    <div
                      key={prod.id}
                      className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        isActive
                          ? 'opacity-100 scale-100 translate-x-0 z-20 pointer-events-auto'
                          : idx < currentIndex
                          ? 'opacity-0 scale-95 -translate-x-14 z-10 pointer-events-none'
                          : 'opacity-0 scale-95 translate-x-14 z-10 pointer-events-none'
                      }`}
                    >
                      <div className="relative w-full h-full">
                        <Image
                          src={prod.image}
                          alt={prod.name}
                          fill
                          priority
                          sizes="(max-width: 640px) 320px, (max-width: 1024px) 420px, 480px"
                          className="object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.85)] filter hover:scale-105 transition-transform duration-700 ease-out"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT COLUMN: ONLY Price (smooth transition, no extra specs/badges) */}
            <div className="lg:col-span-4 flex flex-col justify-center text-left lg:text-right order-3 relative h-20 sm:h-24 lg:h-32">
              {FEATURED_PRODUCTS.map((prod, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <div
                    key={prod.id}
                    className={`absolute inset-x-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isActive
                        ? 'opacity-100 translate-y-0 pointer-events-auto'
                        : idx < currentIndex
                        ? 'opacity-0 -translate-y-8 pointer-events-none'
                        : 'opacity-0 translate-y-8 pointer-events-none'
                    }`}
                  >
                    <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                      {prod.price}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </div>

      {/* BOTTOM BAR: Carousel Selector Pills & Minimalist Desktop Arrow Controls */}
      <Container size="wide" className="relative z-10 pt-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/[0.08] pt-4">
          {/* Minimalist Prev Button (Desktop) */}
          <button
            type="button"
            onClick={handlePrev}
            className="hidden lg:flex w-10 h-10 rounded-full border border-white/20 bg-white/[0.04] hover:bg-white/15 text-white items-center justify-center transition-all duration-200 active:scale-90 cursor-pointer shadow-md"
            aria-label="Varian sebelumnya"
            title="Produk Sebelumnya (←)"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Minimalist Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {FEATURED_PRODUCTS.map((prod, idx) => {
              const isActive = currentIndex === idx;
              return (
                <button
                  key={prod.id}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`group flex items-center gap-2 px-4 py-2 rounded-full text-xs transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-white text-black font-bold shadow-md scale-105'
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
                </button>
              );
            })}
          </div>

          {/* Minimalist Next Button (Desktop) */}
          <button
            type="button"
            onClick={handleNext}
            className="hidden lg:flex w-10 h-10 rounded-full border border-white/20 bg-white/[0.04] hover:bg-white/15 text-white items-center justify-center transition-all duration-200 active:scale-90 cursor-pointer shadow-md"
            aria-label="Varian berikutnya"
            title="Produk Berikutnya (→)"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </Container>
    </section>
  );
}
