'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { Container } from '@/components/ui/Container';

interface ProductItem {
  id: string;
  name: string;
  subtitle: string;
  tagline: string;
  description: string;
  image: string;
  tasteProfile: string;
  ingredients: string[];
  brewing: string;
  badges: string[];
  slug: string;
  colorAccent: string;
}

const AUTHENTIC_PRODUCTS: ProductItem[] = [
  {
    id: 'jasmine-tea',
    name: 'JASMINE TEA',
    subtitle: 'SOLAR-TERM BOTANICAL INFUSION',
    tagline: 'Harmoni Daun Teh Pilihan & Kelopak Melati Utuh',
    description:
      'Terinspirasi dari tradisi teh Tiongkok yang disederhanakan untuk gaya hidup modern grab-and-go. Menggunakan daun teh pilihan, kuntum melati utuh, serta alternatif pemanis sehat gula sorgum dan madu murni. Bebas kantong pemutih kimiawi dan 100% bebas mikroplastik. Tidak mengandung daun senna keras sehingga aman untuk organ tubuh dan dikonsumsi setiap hari.',
    image: '/images/assets/jasmine_tea_produk.jpg',
    tasteProfile: 'Harum melati alami semerbak, rasa manis lembut seimbang tanpa rasa pahit berlebih.',
    ingredients: [
      'Daun Teh Hijau Pilihan (Camellia sinensis)',
      'Kuntum Bunga Melati Utuh (Jasminum sambac)',
      'Gula Sorgum Organik Rendah Glikemik',
      'Madu Hutan Murni Nusantara',
    ],
    brewing: 'Suhu 85-90°C • Waktu seduh < 3 Menit • 250-300ml Air',
    badges: ['100% Bebas Mikroplastik', 'Bebas Daun Senna', 'Bleach-Free Sachet', 'Gula Sorgum & Madu'],
    slug: '/katalog/solar-term-jasmine-herbal-tea',
    colorAccent: 'from-[#544D79]/10 to-[#8C849A]/5',
  },
  {
    id: 'english-breakfast-tea',
    name: 'ENGLISH BREAKFAST TEA',
    subtitle: 'CLASSIC ROBUST BOTANICAL CRAFT',
    tagline: 'Racikan Teh Hitam Berkarakter Kuat dengan Energi Bersih Alami',
    description:
      'Seduhan teh hitam berkarakter bold dan kaya rasa yang terinspirasi tradisi sarapan klasik, diracik dengan dedikasi kearifan nusantara. Menghadirkan dorongan energi bersih tahan lama tanpa lonjakan asam lambung atau crash. Dikemas bebas mikroplastik dengan pemanis alami gula sorgum dan madu murni. 100% bebas daun senna, aman dikonsumsi harian.',
    image: '/images/assets/english_breakfast_tea_produk.jpg',
    tasteProfile: 'Aroma malted tea hangat mendalam dengan sentuhan rasa manis karamel sorgum yang lembut.',
    ingredients: [
      'Daun Teh Hitam Pilihan Nusantara (Camellia sinensis var. assamica)',
      'Pemanis Alami Gula Sorgum Organik',
      'Madu Hutan Murni Nusantara',
    ],
    brewing: 'Suhu 95°C • Waktu seduh < 3 Menit • 250-300ml Air',
    badges: ['100% Bebas Mikroplastik', 'Bebas Daun Senna', 'Energi Stabil Tahan Lama', 'Gula Sorgum & Madu'],
    slug: '/katalog/english-breakfast-tea',
    colorAccent: 'from-[#6E5448]/10 to-[#544D79]/5',
  },
  {
    id: 'vanilla-mint-tea',
    name: 'VANILLA MINT TEA',
    subtitle: 'REFRESHING BOTANICAL HARMONY',
    tagline: 'Sensasi Semilir Dingin Daun Mint & Kelembutan Vanilla Menenangkan',
    description:
      'Kombinasi harmonis antara sensasi sejuk segar daun mint alami dan kelembutan aroma vanilla lembut. Dirancang untuk meredakan kepenatan harian, menyegarkan saluran pernapasan, dan menjaga relaksasi tanpa efek samping pencernaan. Bebas kantong plastik beracun dengan pemanis alami sorgum dan madu murni.',
    image: '/images/assets/vanilla_mint_tea_produk.jpg',
    tasteProfile: 'Sensasi dingin menyegarkan di lidah berpadu aroma manis creamy vanilla yang lembut.',
    ingredients: [
      'Daun Teh Pilihan (Camellia sinensis)',
      'Daun Mint Kering Alami (Mentha piperita)',
      'Ekstrak Polong Vanilla Organik',
      'Gula Sorgum Rendah Kalori',
      'Madu Hutan Alami',
    ],
    brewing: 'Suhu 90°C • Waktu seduh < 3 Menit • Nikmat Hangat atau Dingin dengan Es',
    badges: ['100% Bebas Mikroplastik', 'Bebas Daun Senna', 'Menyejukkan Pernapasan', 'Bleach-Free'],
    slug: '/katalog/vanilla-mint-tea',
    colorAccent: 'from-[#4D6D65]/10 to-[#544D79]/5',
  },
];

export function ProductShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const total = AUTHENTIC_PRODUCTS.length;
  const current = AUTHENTIC_PRODUCTS[currentIndex];

  const handleNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % total);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, total]);

  const handlePrev = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + total) % total);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning, total]);

  // Keyboard navigation listener (ArrowLeft / ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  return (
    <section className="relative w-full py-12 md:py-20 overflow-hidden bg-background">
      <Container size="wide">
        {/* Showcase Header Bar: Brand Indicator, Progress Counter & Navigation Arrows */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 border-b border-border gap-4">
          <div className="space-y-1">
            <span className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.3em] uppercase text-accent">
              01 // AUTHENTIC SHOWCASE
            </span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-foreground">
              3 KARYA UTAMA BOTANI CHANGKEER
            </h2>
          </div>

          <div className="flex items-center gap-6 self-end sm:self-auto">
            {/* Position Indicator (1/3, 2/3, 3/3) */}
            <div className="flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground">
              <span className="font-bold text-foreground text-base">
                0{currentIndex + 1}
              </span>
              <span>/</span>
              <span>0{total}</span>
            </div>

            {/* Navigation Buttons (Left / Right) */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                className="w-11 h-11 rounded-full border border-border bg-surface hover:bg-surface-hover hover:border-border-strong text-foreground flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer shadow-xs"
                aria-label="Lihat produk sebelumnya (Panah Kiri)"
                title="Produk Sebelumnya (Keyboard: ←)"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="w-11 h-11 rounded-full bg-primary hover:bg-primary-hover text-primary-foreground flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer shadow-sm"
                aria-label="Lihat produk berikutnya (Panah Kanan)"
                title="Produk Berikutnya (Keyboard: →)"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Rounded-Corner Panel with Smooth Clipping Transition */}
        <div className="relative mt-8 rounded-3xl border border-border/80 bg-surface shadow-md overflow-hidden transition-all duration-700 ease-out">
          {/* Subtle Dynamic Ambient Gradient */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${current.colorAccent} pointer-events-none transition-all duration-700 -z-10`}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px] lg:min-h-[640px] items-stretch">
            {/* Left Frame: Editorial Product Photography (896x1200 asset) */}
            <div className="lg:col-span-5 relative bg-muted/40 p-6 sm:p-10 flex items-center justify-center overflow-hidden border-b lg:border-b-0 lg:border-r border-border/60">
              {/* Geometric Layer Accent */}
              <div className="absolute w-[280px] sm:w-[360px] h-[280px] sm:h-[360px] rounded-full border border-border/60 -z-10" />
              <div className="absolute w-[220px] sm:w-[280px] h-[220px] sm:h-[280px] rounded-full bg-accent-subtle/50 blur-2xl -z-10" />

              <div
                className={`relative w-full max-w-[320px] sm:max-w-[360px] aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 ease-out transform ${
                  isTransitioning ? 'opacity-40 scale-95 filter blur-xs' : 'opacity-100 scale-100'
                }`}
              >
                <Image
                  src={current.image}
                  alt={`Kemasan Asli ${current.name} CHANGKEER`}
                  fill
                  sizes="(max-width: 768px) 100vw, 420px"
                  className="object-cover object-center transition-transform duration-700 hover:scale-105"
                  priority
                />
              </div>

              {/* Watermark / Badge Tag */}
              <div className="absolute top-6 left-6 inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-surface/90 backdrop-blur-sm border border-border text-[10px] font-mono font-bold tracking-widest uppercase text-accent">
                <Sparkles className="w-3 h-3 text-accent" />
                <span>VARIAN RESMI</span>
              </div>
            </div>

            {/* Right Frame: Deep Editorial Information & Facts */}
            <div
              className={`lg:col-span-7 p-8 sm:p-12 lg:p-14 flex flex-col justify-between space-y-8 transition-all duration-500 ease-out ${
                isTransitioning ? 'opacity-40 translate-x-2' : 'opacity-100 translate-x-0'
              }`}
            >
              <div className="space-y-6">
                {/* Series Eyebrow */}
                <div className="flex items-center gap-3">
                  <span className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.3em] uppercase text-accent">
                    {current.subtitle}
                  </span>
                  <span className="h-[1px] flex-1 bg-border/60" />
                </div>

                {/* Main Product Title */}
                <div className="space-y-2">
                  <h3 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-foreground leading-[0.95]">
                    {current.name}
                  </h3>
                  <p className="text-sm sm:text-base font-semibold text-primary">
                    {current.tagline}
                  </p>
                </div>

                {/* Narrative Description */}
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-normal">
                  {current.description}
                </p>

                {/* Flavor & Ingredients Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-border/70">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-accent block">
                      PROFIL RASA
                    </span>
                    <p className="text-xs font-medium text-foreground leading-relaxed">
                      {current.tasteProfile}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-accent block">
                      PANDUAN SEDUH
                    </span>
                    <p className="text-xs font-medium text-foreground leading-relaxed flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                      <span>{current.brewing}</span>
                    </p>
                  </div>
                </div>

                {/* Natural Ingredients List */}
                <div className="space-y-2 pt-2 border-t border-border/70">
                  <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-accent block">
                    KOMPOSISI ALAMI PILIHAN
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {current.ingredients.map((ing) => (
                      <div key={ing} className="flex items-center gap-2 text-foreground/90 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        <span>{ing}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quality Badges */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {current.badges.map((badge) => (
                    <span
                      key={badge}
                      className="inline-flex items-center text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-sm bg-muted text-muted-foreground border border-border"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Actions & Stepper Dots */}
              <div className="pt-6 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Interactive Stepper Pills */}
                <div className="flex items-center gap-2">
                  {AUTHENTIC_PRODUCTS.map((prod, idx) => (
                    <button
                      key={prod.id}
                      type="button"
                      onClick={() => {
                        if (currentIndex !== idx) {
                          setIsTransitioning(true);
                          setCurrentIndex(idx);
                          setTimeout(() => setIsTransitioning(false), 500);
                        }
                      }}
                      className={`h-2 transition-all duration-300 rounded-full cursor-pointer ${
                        currentIndex === idx
                          ? 'w-10 bg-primary'
                          : 'w-2 bg-border-strong/50 hover:bg-border-strong'
                      }`}
                      aria-label={`Pilih produk ${prod.name}`}
                    />
                  ))}
                </div>

                {/* Action Link */}
                <Link
                  href={current.slug}
                  className="inline-flex items-center justify-center gap-2 text-xs font-bold tracking-widest uppercase bg-primary text-primary-foreground px-6 py-3.5 rounded-sm hover:bg-primary-hover transition-all active:scale-[0.99] text-center"
                >
                  <span>DETAIL PRODUK</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
