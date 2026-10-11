'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { Product } from '@/types';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // If products is empty, provide fallback
  const displayProducts = products?.length ? products : [];

  const updateScrollButtons = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 20);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 20);

    // Calculate approx active slide index
    const cardWidth = el.firstElementChild
      ? (el.firstElementChild as HTMLElement).clientWidth + 24
      : 340;
    const index = Math.round(el.scrollLeft / cardWidth);
    setActiveIndex(Math.min(Math.max(index, 0), displayProducts.length - 1));
  }, [displayProducts.length]);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    el.addEventListener('scroll', updateScrollButtons, { passive: true });
    updateScrollButtons();
    return () => el.removeEventListener('scroll', updateScrollButtons);
  }, [updateScrollButtons]);

  // Smooth scroll handler
  const scroll = (direction: 'left' | 'right') => {
    const el = carouselRef.current;
    if (!el) return;

    const scrollAmount = el.clientWidth * 0.75;
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const scrollToIndex = (index: number) => {
    const el = carouselRef.current;
    if (!el || !el.children[index]) return;

    const targetChild = el.children[index] as HTMLElement;
    el.scrollTo({
      left: targetChild.offsetLeft - el.offsetLeft,
      behavior: 'smooth',
    });
  };

  // Auto-glide carousel effect with pause on hover
  useEffect(() => {
    if (isPaused || displayProducts.length <= 1) return;

    const interval = setInterval(() => {
      const el = carouselRef.current;
      if (!el) return;

      if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 20) {
        // Loop back to start
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scroll('right');
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [isPaused, displayProducts.length]);

  return (
    <section className="py-24 sm:py-32 lg:py-36 bg-background border-b border-border overflow-hidden">
      <Container size="wide">
        <Reveal>
          {/* Section Header with Refined Medium Headline and Navigation */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div className="space-y-2">
              <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-accent block">
                02 // KURASI BOTANI TERBAIK
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase tracking-tight text-foreground">
                Racikan Unggulan
              </h2>
            </div>

            <div className="flex items-center gap-4 self-start md:self-auto">
              {/* Carousel Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scroll('left')}
                  disabled={!canScrollLeft}
                  className={`w-9 h-9 rounded-full border border-border flex items-center justify-center transition-all ${
                    canScrollLeft
                      ? 'bg-surface text-foreground hover:bg-surface-hover shadow-xs cursor-pointer active:scale-90'
                      : 'bg-muted/40 text-muted-foreground/40 cursor-not-allowed opacity-50'
                  }`}
                  aria-label="Geser ke produk sebelumnya"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => scroll('right')}
                  disabled={!canScrollRight}
                  className={`w-9 h-9 rounded-full border border-border flex items-center justify-center transition-all ${
                    canScrollRight
                      ? 'bg-surface text-foreground hover:bg-surface-hover shadow-xs cursor-pointer active:scale-90'
                      : 'bg-muted/40 text-muted-foreground/40 cursor-not-allowed opacity-50'
                  }`}
                  aria-label="Geser ke produk berikutnya"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="h-4 w-[1px] bg-border hidden sm:block" />

              {/* View All Catalog Link */}
              <Link
                href="/katalog"
                className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-foreground hover:text-primary transition-colors border-b border-foreground pb-0.5"
              >
                <span>SEMUA PRODUK</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </Reveal>

        {/* Smooth Animated Products Carousel */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          className="relative -mx-4 sm:-mx-6 px-4 sm:px-6"
        >
          <div
            ref={carouselRef}
            className="flex gap-5 sm:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory py-4 no-scrollbar cursor-grab active:cursor-grabbing"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {displayProducts.map((product) => {
              const formattedPrice = new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                maximumFractionDigits: 0,
              }).format(product.price);

              const imageSrc =
                product.featured_image ||
                (product.gallery && product.gallery[0]) ||
                '/images/assets/jasmine_tea_produk.jpg';

              return (
                <div
                  key={product.id}
                  className="w-[260px] sm:w-[310px] md:w-[350px] shrink-0 snap-start"
                >
                  <Link
                    href={`/katalog/${product.slug}`}
                    className="block group relative aspect-[3/4] sm:aspect-[4/5] rounded-2xl overflow-hidden bg-muted border border-border/60 shadow-xs hover:shadow-xl transition-all duration-500"
                  >
                    {/* Full Product Photo */}
                    <Image
                      src={imageSrc}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 260px, (max-width: 768px) 310px, 350px"
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-106"
                    />

                    {/* Subtle Gradient Scrim at Bottom for Minimal Text */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none transition-opacity duration-300" />

                    {/* Top Right Quick Action Icon */}
                    <div className="absolute top-3.5 right-3.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs text-black flex items-center justify-center shadow-md">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>

                    {/* Minimalist Card Text at Bottom */}
                    <div className="absolute bottom-0 inset-x-0 p-5 flex flex-col justify-end space-y-1 text-white">
                      <span className="text-[10px] font-mono tracking-[0.22em] uppercase text-white/70 block">
                        {product.category?.name || 'RACIKAN BOTANI'}
                      </span>

                      <h3 className="font-extrabold text-sm sm:text-base uppercase tracking-wide text-white group-hover:text-amber-200 transition-colors line-clamp-1 leading-snug">
                        {product.name}
                      </h3>

                      <div className="pt-1 flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-semibold text-white/95 tracking-wide">
                          {formattedPrice}
                        </span>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-white/60 group-hover:text-white transition-colors">
                          Lihat Detail &rarr;
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Dots Indicator for Carousel Navigation */}
          {displayProducts.length > 1 && (
            <div className="flex justify-center items-center gap-1.5 mt-8">
              {displayProducts.map((p, idx) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => scrollToIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeIndex === idx
                      ? 'w-7 bg-foreground'
                      : 'w-1.5 bg-border-strong/40 hover:bg-border-strong'
                  }`}
                  aria-label={`Buka produk nomor ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
