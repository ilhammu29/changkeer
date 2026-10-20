'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { SOLAR_TERM_BLENDS } from '@/lib/data/solarTerms';

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

function toKebab(s: string) {
  return s.replace(/'s/g, 's').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const FEATURED_PRODUCTS: ProductShowcaseItem[] = SOLAR_TERM_BLENDS.map((b) => ({
  id: toKebab(b.term),
  name: b.blend.toUpperCase(),
  shortName: b.blend,
  watermark: b.watermark,
  price: `Rp ${b.hotPrice.replace('K', '.000')}`,
  image: b.image,
  ringColor: b.ringColor,
  glowColor: b.glowColor,
}));

export function ProductShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const startXRef = useRef<number | null>(null);

  const total = FEATURED_PRODUCTS.length;
  const current = FEATURED_PRODUCTS[currentIndex];

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Automatic slide transition every 4.5 seconds (paused when interacting/hovering)
  useEffect(() => {
    if (isPaused || isDragging) return;

    const interval = setInterval(() => {
      handleNext();
    }, 4500);

    return () => clearInterval(interval);
  }, [handleNext, isPaused, isDragging]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // Gesture drag & swipe handling (supports both mouse and touch)
  const onDragStart = (clientX: number) => {
    startXRef.current = clientX;
    setIsDragging(true);
    setIsPaused(true);
  };

  const onDragMove = (clientX: number) => {
    if (!isDragging || startXRef.current === null) return;
    const diff = clientX - startXRef.current;
    // dampen drag offset
    setDragOffset(diff * 0.4);
  };

  const onDragEnd = () => {
    if (!isDragging || startXRef.current === null) return;

    if (dragOffset < -35) {
      handleNext();
    } else if (dragOffset > 35) {
      handlePrev();
    }

    startXRef.current = null;
    setIsDragging(false);
    setDragOffset(0);

    // Resume auto-play after short delay
    setTimeout(() => {
      setIsPaused(false);
    }, 2000);
  };

  return (
    <section
      className="relative w-full min-h-[calc(100vh-5rem)] max-h-[860px] flex flex-col justify-center pt-20 pb-8 bg-[#0c0b11] text-white overflow-hidden select-none cursor-grab active:cursor-grabbing"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        if (!isDragging) setIsPaused(false);
      }}
      onTouchStart={(e) => onDragStart(e.touches[0].clientX)}
      onTouchMove={(e) => onDragMove(e.touches[0].clientX)}
      onTouchEnd={onDragEnd}
      onMouseDown={(e) => onDragStart(e.clientX)}
      onMouseMove={(e) => onDragMove(e.clientX)}
      onMouseUp={onDragEnd}
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
      <div className="relative z-10 flex items-center w-full my-auto">
        <Container size="wide" className="w-full">
          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-4 items-center min-h-[420px] sm:min-h-[480px] lg:min-h-[520px]">
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
            <div className="lg:col-span-4 flex flex-col justify-center text-left order-2 lg:order-1 relative h-20 sm:h-24 lg:h-32 pointer-events-none">
              {FEATURED_PRODUCTS.map((prod, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <div
                    key={prod.id}
                    className={`absolute inset-x-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isActive
                        ? 'opacity-100 translate-y-0'
                        : idx < currentIndex
                        ? 'opacity-0 -translate-y-8'
                        : 'opacity-0 translate-y-8'
                    }`}
                  >
                    <h1 className="text-2xl sm:text-3xl lg:text-5xl font-black uppercase tracking-tight text-white leading-tight">
                      {prod.name}
                    </h1>
                  </div>
                );
              })}
            </div>

            {/* CENTER COLUMN: Hero Product with Transparent Cutout & Halo Ring (Automatic Slide + Draggable) */}
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

              {/* Stacked Product Cutouts: Pre-mounted in DOM with Auto-Glide and Interactive Drag */}
              <div
                className="relative w-[300px] sm:w-[380px] lg:w-[440px] xl:w-[460px] h-[360px] sm:h-[440px] lg:h-[480px] xl:h-[520px] flex items-center justify-center transition-transform duration-200"
                style={{
                  transform: isDragging ? `translateX(${dragOffset}px)` : undefined,
                }}
              >
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
                      <div className="relative w-full h-full pointer-events-none">
                        <Image
                          src={prod.image}
                          alt={prod.name}
                          fill
                          priority
                          sizes="(max-width: 640px) 300px, (max-width: 1024px) 380px, 440px"
                          className="object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.85)] filter hover:scale-105 transition-transform duration-700 ease-out"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT COLUMN: ONLY Price (smooth transition, no extra specs/badges) */}
            <div className="lg:col-span-4 flex flex-col justify-center text-left lg:text-right order-3 relative h-20 sm:h-24 lg:h-32 pointer-events-none">
              {FEATURED_PRODUCTS.map((prod, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <div
                    key={prod.id}
                    className={`absolute inset-x-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isActive
                        ? 'opacity-100 translate-y-0'
                        : idx < currentIndex
                        ? 'opacity-0 -translate-y-8'
                        : 'opacity-0 translate-y-8'
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
    </section>
  );
}
