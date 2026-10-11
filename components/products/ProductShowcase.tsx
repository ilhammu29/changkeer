'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  ArrowDown,
  ArrowUpRight,
  Check,
  ShieldCheck,
  Leaf,
  Clock,
  Sparkles,
  Plus,
  Minus,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';

interface ProductItem {
  id: string;
  name: string;
  shortName: string;
  subtitle: string;
  tagline: string;
  description: string;
  image: string;
  tasteProfile: string;
  benefits: string;
  ingredients: string[];
  brewing: string;
  badges: string[];
  slug: string;
  archGradient: string;
  accentGlow: string;
  accentRing: string;
}

const AUTHENTIC_PRODUCTS: ProductItem[] = [
  {
    id: 'jasmine-tea',
    name: 'CHANGKEER JASMINE TEA',
    shortName: 'Jasmine Tea',
    subtitle: 'SOLAR-TERM BOTANICAL INFUSION',
    tagline: 'Harmoni Daun Teh Pilihan & Kelopak Melati Utuh',
    description:
      'Terinspirasi dari tradisi teh herbal Tiongkok yang disederhanakan untuk ritme hidup aktif modern grab-and-go. Menggunakan daun teh pilihan, kuntum melati utuh, serta alternatif pemanis sehat gula sorgum dan madu murni. 100% bebas mikroplastik dan tanpa daun senna keras.',
    image: '/images/assets/jasmine_tea_produk.jpg',
    tasteProfile: 'Harum melati alami semerbak, rasa manis lembut seimbang tanpa rasa pahit pekat.',
    benefits:
      'Menenangkan pikiran, menjaga kejernihan fokus, serta melindungi sel tubuh dengan antioksidan polifenol alami tanpa efek lonjakan asam lambung.',
    ingredients: [
      'Daun Teh Hijau Pilihan (Camellia sinensis)',
      'Kuntum Bunga Melati Utuh (Jasminum sambac)',
      'Gula Sorgum Organik Rendah Glikemik',
      'Madu Hutan Murni Nusantara',
    ],
    brewing: 'Suhu 85-90°C • Waktu seduh < 3 Menit • 250-300ml Air • Nikmat disajikan hangat atau dengan es batu.',
    badges: ['100% Bebas Mikroplastik', 'Bebas Daun Senna', 'Pemanis Sorgum & Madu', 'Seduh < 3 Menit'],
    slug: '/katalog/solar-term-jasmine-herbal-tea',
    archGradient: 'from-[#4D4566]/50 via-[#2E2840]/40 to-[#181622]/70',
    accentGlow: 'bg-[#544D79]/25',
    accentRing: 'text-[#544D79]',
  },
  {
    id: 'english-breakfast-tea',
    name: 'CHANGKEER ENGLISH BREAKFAST',
    shortName: 'English Breakfast',
    subtitle: 'CLASSIC ROBUST BOTANICAL CRAFT',
    tagline: 'Racikan Teh Hitam Berkarakter Kuat & Pemanis Rendah Glikemik',
    description:
      'Seduhan teh hitam berkarakter bold dan kaya rasa yang terinspirasi tradisi sarapan klasik, diracik dengan dedikasi kearifan nusantara. Menghadirkan dorongan energi bersih tahan lama tanpa lonjakan asam lambung atau crash. Dikemas bebas mikroplastik dengan gula sorgum dan madu murni. 100% bebas daun senna.',
    image: '/images/assets/english_breakfast_tea_produk.jpg',
    tasteProfile: 'Aroma malted tea hangat mendalam dengan sentuhan rasa manis karamel sorgum yang lembut.',
    benefits:
      'Meningkatkan konsentrasi dan stamina kerja pagi hari secara stabil tanpa memicu debar jantung berlebih.',
    ingredients: [
      'Daun Teh Hitam Pilihan Nusantara (Camellia sinensis var. assamica)',
      'Pemanis Alami Gula Sorgum Organik',
      'Madu Hutan Murni Nusantara',
    ],
    brewing: 'Suhu 95°C • Waktu seduh < 3 Menit • 250-300ml Air • Sempurna dinikmati murni atau dengan susu nabati.',
    badges: ['100% Bebas Mikroplastik', 'Bebas Daun Senna', 'Energi Bersih Tahan Lama', 'Seduh < 3 Menit'],
    slug: '/katalog/english-breakfast-tea',
    archGradient: 'from-[#5A453B]/50 via-[#362720]/40 to-[#181622]/70',
    accentGlow: 'bg-[#6E5448]/25',
    accentRing: 'text-[#8C6B5B]',
  },
  {
    id: 'vanilla-mint-tea',
    name: 'CHANGKEER VANILLA MINT TEA',
    shortName: 'Vanilla Mint',
    subtitle: 'REFRESHING BOTANICAL HARMONY',
    tagline: 'Sensasi Semilir Dingin Daun Mint & Kelembutan Vanilla Menenangkan',
    description:
      'Kombinasi harmonis antara sensasi sejuk segar daun mint alami dan kelembutan aroma vanilla alami. Dirancang untuk meredakan kepenatan harian, menyegarkan saluran pernapasan, dan menjaga relaksasi tanpa efek samping pencernaan. Dikemas dalam kantung bebas mikroplastik dengan alternatif pemanis sehat sorgum dan madu murni.',
    image: '/images/assets/vanilla_mint_tea_produk.jpg',
    tasteProfile: 'Sensasi dingin menyegarkan di lidah berpadu aroma manis creamy vanilla yang lembut menenangkan.',
    benefits:
      'Melegakan pernapasan, menurunkan tingkat stres setelah beraktivitas, serta menyegarkan napas secara alami.',
    ingredients: [
      'Daun Teh Pilihan (Camellia sinensis)',
      'Daun Mint Kering Alami (Mentha piperita)',
      'Ekstrak Polong Vanilla Alami',
      'Gula Sorgum Rendah Kalori',
      'Madu Hutan Alami',
    ],
    brewing: 'Suhu 90°C • Waktu seduh < 3 Menit • 250-300ml Air • Ekstra segar bila dinikmati dingin dengan es batu.',
    badges: ['100% Bebas Mikroplastik', 'Bebas Daun Senna', 'Menyejukkan Pernapasan', 'Seduh < 3 Menit'],
    slug: '/katalog/vanilla-mint-tea',
    archGradient: 'from-[#3B544E]/50 via-[#21332F]/40 to-[#181622]/70',
    accentGlow: 'bg-[#4D6D65]/25',
    accentRing: 'text-[#4D6D65]',
  },
];

export function ProductShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string>('ingredients');

  const total = AUTHENTIC_PRODUCTS.length;
  const current = AUTHENTIC_PRODUCTS[currentIndex];

  const handleNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % total);
    setTimeout(() => setIsTransitioning(false), 400);
  }, [isTransitioning, total]);

  const handlePrev = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + total) % total);
    setTimeout(() => setIsTransitioning(false), 400);
  }, [isTransitioning, total]);

  // Keyboard navigation
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

  const toggleAccordion = (section: string) => {
    setOpenAccordion((prev) => (prev === section ? '' : section));
  };

  return (
    <section className="relative w-full pt-24 pb-16 lg:pt-28 lg:pb-24 bg-[#111216] text-white overflow-hidden select-none">
      {/* Dynamic Ambient Background Glows */}
      <div
        className={`absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full blur-[140px] pointer-events-none transition-all duration-1000 -z-10 ${current.accentGlow}`}
      />
      <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full bg-[#544D79]/15 blur-[120px] pointer-events-none -z-10" />

      <Container size="wide">
        {/* Main Exhibition Showcase: 3-Column Asymmetrical Reference 4 Layout */}
        <div className="relative rounded-3xl border border-white/10 bg-[#16151E]/90 backdrop-blur-xl p-6 sm:p-10 lg:p-12 shadow-2xl">
          {/* Top Bar of the Exhibition Frame */}
          <div className="flex items-center justify-between pb-6 mb-6 sm:pb-8 sm:mb-8 border-b border-white/10 text-xs text-white/60">
            <div className="flex items-center gap-3 sm:gap-6">
              <span className="font-mono uppercase tracking-[0.2em] sm:tracking-[0.25em] text-white/80 font-bold text-[11px] sm:text-xs">
                CHANGKEER EXHIBITION
              </span>
              <span className="hidden sm:inline text-white/30">•</span>
              <span className="hidden sm:inline font-mono tracking-widest uppercase">
                SOLAR-TERM BOTANICALS
              </span>
            </div>

            {/* Mobile Arrows & Stepper Dots */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-1.5 lg:hidden">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="w-8 h-8 rounded-full border border-white/20 bg-white/5 text-white flex items-center justify-center active:scale-90"
                  aria-label="Produk Sebelumnya"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono text-xs text-white/70 px-1 font-bold">
                  0{currentIndex + 1}/0{total}
                </span>
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-8 h-8 rounded-full border border-white/20 bg-white/5 text-white flex items-center justify-center active:scale-90"
                  aria-label="Produk Berikutnya"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Stepper Dots (Ref 4 style top center/right pill indicator) */}
              <div className="hidden sm:flex items-center gap-2">
                {AUTHENTIC_PRODUCTS.map((prod, idx) => (
                  <button
                    key={prod.id}
                    type="button"
                    onClick={() => {
                      if (currentIndex !== idx) {
                        setIsTransitioning(true);
                        setCurrentIndex(idx);
                        setTimeout(() => setIsTransitioning(false), 400);
                      }
                    }}
                    className={`h-2 transition-all duration-300 rounded-full cursor-pointer ${
                      currentIndex === idx ? 'w-8 bg-white' : 'w-2 bg-white/30 hover:bg-white/60'
                    }`}
                    aria-label={`Pilih produk ${prod.shortName}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* 3-Column Asymmetrical Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* COLUMN 1 (LEFT): Product Title, Highlights & Primary CTA */}
            <div
              className={`lg:col-span-4 space-y-6 transition-all duration-500 ${
                isTransitioning ? 'opacity-40 -translate-x-2' : 'opacity-100 translate-x-0'
              }`}
            >
              {/* Category Eyebrow */}
              <div className="inline-flex items-center gap-2 text-[10px] font-mono tracking-[0.3em] uppercase text-white/60">
                <Sparkles className="w-3.5 h-3.5 text-accent-subtle" />
                <span>{current.subtitle}</span>
              </div>

              {/* Expressive Editorial Product Title with Reference 4 Style Oval Scribble */}
              <div className="space-y-3">
                <div className="relative inline-block">
                  {/* Reference 4 Stylized Oval Accent Outline */}
                  <span className="relative z-10 px-3 py-1 font-mono text-xs uppercase tracking-widest text-[#9EE4B8] font-bold">
                    HERBAL Tisane
                  </span>
                  <svg
                    className="absolute inset-0 w-full h-full text-[#4E8765] stroke-current fill-none -translate-y-0.5"
                    viewBox="0 0 140 40"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M 10,20 C 10,6 130,6 130,20 C 130,34 10,34 10,20 Z"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-5xl font-black uppercase tracking-tight text-white leading-tight break-words">
                  {current.name}
                </h1>

                <p className="text-sm font-medium text-white/75 italic">
                  {current.tagline}
                </p>
              </div>

              {/* Price / Specification Badge */}
              <div className="flex items-baseline gap-3 pt-1">
                <span className="font-mono text-2xl sm:text-3xl font-black text-white tracking-tight">
                  250g Loose Leaf
                </span>
                <span className="text-xs text-white/50 font-mono tracking-wider">
                  / SEDUH &lt; 3 MENIT
                </span>
              </div>

              {/* Narrative Excerpt */}
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-normal">
                {current.description}
              </p>

              {/* Reference 4 Style High-Contrast Pill CTA */}
              <div className="pt-2">
                <Link
                  href={current.slug}
                  className="inline-flex items-center justify-center gap-2.5 text-xs font-bold tracking-widest uppercase bg-white text-black hover:bg-neutral-200 px-8 py-4 rounded-full transition-all duration-300 active:scale-95 shadow-xl cursor-pointer"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>JELAJAHI DI KATALOG</span>
                  <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>
            </div>

            {/* COLUMN 2 (CENTER): Iconic Architectural Arch Window with Authentic Product Photo */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center relative my-4 lg:my-0">
              {/* Distinctive Reference 4 Arch Window Backdrop */}
              <div
                className={`relative w-full max-w-[340px] sm:max-w-[380px] h-[480px] sm:h-[540px] rounded-t-[140px] sm:rounded-t-[180px] rounded-b-3xl bg-gradient-to-b ${current.archGradient} border border-white/15 backdrop-blur-md shadow-2xl flex items-center justify-center p-4 sm:p-6 overflow-hidden transition-all duration-700`}
              >
                {/* Floating Authentic Detail Badge 1 (Top Right - Reference 4 style chip) */}
                <div className="absolute top-8 right-2 sm:right-4 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-[9px] sm:text-[10px] font-medium text-white shadow-xl animate-subtle-float">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#9EE4B8] flex-shrink-0" />
                  <span>100% Bebas Mikroplastik</span>
                </div>

                {/* Floating Authentic Detail Badge 2 (Bottom Left - Reference 4 style chip) */}
                <div
                  className="absolute bottom-16 left-2 sm:left-4 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-[9px] sm:text-[10px] font-medium text-white shadow-xl animate-subtle-float"
                  style={{ animationDelay: '1.5s' }}
                >
                  <Leaf className="w-3.5 h-3.5 text-[#9EE4B8] flex-shrink-0" />
                  <span>Gula Sorgum &amp; Madu</span>
                </div>

                {/* Authentic Packaging Product Photograph (896x1200 Unclipped Natural Composition) */}
                <div
                  className={`relative w-full h-[90%] max-h-[460px] rounded-2xl overflow-hidden transition-all duration-500 ease-out transform ${
                    isTransitioning ? 'opacity-30 scale-95 blur-xs' : 'opacity-100 scale-100'
                  }`}
                >
                  <Image
                    src={current.image}
                    alt={`Kemasan Resmi ${current.name} CHANGKEER`}
                    fill
                    sizes="(max-width: 768px) 320px, 380px"
                    priority
                    className="object-contain object-center drop-shadow-[0_20px_30px_rgba(0,0,0,0.6)] transition-transform duration-700 hover:scale-105"
                  />
                </div>

                {/* Downward Scroll Indicator Circle (Reference 4 arch bottom control) */}
                <a
                  href="#pillars"
                  className="absolute bottom-3 z-20 w-9 h-9 rounded-full border border-white/30 bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/25 hover:border-white transition-all active:scale-95 shadow-md"
                  aria-label="Gulir ke rincian komitmen dan seduh"
                  title="Gulir ke Rincian"
                >
                  <ArrowDown className="w-4 h-4 animate-bounce" />
                </a>
              </div>
            </div>

            {/* COLUMN 3 (RIGHT): Navigation Controls & Interactive Expandable Accordion Menu */}
            <div className="lg:col-span-4 space-y-6">
              {/* Top Navigation Arrows & Counter (Exact Reference 4 Placement) */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="font-mono text-sm tracking-widest text-white/50">
                  <span className="font-bold text-white text-lg">0{currentIndex + 1}</span>
                  <span> / 0{total}</span>
                </div>

                {/* Left & Right Arrow Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="w-10 h-10 rounded-full border border-white/25 bg-white/5 hover:bg-white/20 text-white flex items-center justify-center transition-all duration-200 active:scale-90 cursor-pointer shadow-md"
                    aria-label="Lihat produk sebelumnya (Panah Kiri)"
                    title="Produk Sebelumnya (Keyboard: ←)"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-10 h-10 rounded-full border border-white/25 bg-white/5 hover:bg-white/20 text-white flex items-center justify-center transition-all duration-200 active:scale-90 cursor-pointer shadow-md"
                    aria-label="Lihat produk berikutnya (Panah Kanan)"
                    title="Produk Berikutnya (Keyboard: →)"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Reference 4 Style Accordion List */}
              <div className="space-y-3 pt-2">
                {/* 1. Description / Profil Rasa */}
                <div className="border border-white/10 rounded-2xl bg-white/5 overflow-hidden transition-colors">
                  <button
                    type="button"
                    onClick={() => toggleAccordion('description')}
                    className="w-full p-4 flex items-center justify-between text-left cursor-pointer hover:bg-white/5 transition-colors"
                  >
                    <span className="text-xs font-bold uppercase tracking-wider text-white">
                      Description &amp; Profil Rasa
                    </span>
                    {openAccordion === 'description' ? (
                      <Minus className="w-4 h-4 text-white/70" />
                    ) : (
                      <Plus className="w-4 h-4 text-white/70" />
                    )}
                  </button>
                  {openAccordion === 'description' && (
                    <div className="px-4 pb-4 text-xs text-white/75 leading-relaxed space-y-2 border-t border-white/5 pt-3 animate-in fade-in duration-200">
                      <p>{current.tasteProfile}</p>
                      <p className="text-[11px] text-white/60">{current.description}</p>
                    </div>
                  )}
                </div>

                {/* 2. Manfaat & Fungsionalitas Organ */}
                <div className="border border-white/10 rounded-2xl bg-white/5 overflow-hidden transition-colors">
                  <button
                    type="button"
                    onClick={() => toggleAccordion('benefits')}
                    className="w-full p-4 flex items-center justify-between text-left cursor-pointer hover:bg-white/5 transition-colors"
                  >
                    <span className="text-xs font-bold uppercase tracking-wider text-white">
                      Khasiat &amp; Manfaat Organ
                    </span>
                    {openAccordion === 'benefits' ? (
                      <Minus className="w-4 h-4 text-white/70" />
                    ) : (
                      <Plus className="w-4 h-4 text-white/70" />
                    )}
                  </button>
                  {openAccordion === 'benefits' && (
                    <div className="px-4 pb-4 text-xs text-white/75 leading-relaxed border-t border-white/5 pt-3 animate-in fade-in duration-200">
                      <p>{current.benefits}</p>
                    </div>
                  )}
                </div>

                {/* 3. Komposisi Alami (Ingredients) - Open by Default */}
                <div className="border border-white/10 rounded-2xl bg-white/5 overflow-hidden transition-colors">
                  <button
                    type="button"
                    onClick={() => toggleAccordion('ingredients')}
                    className="w-full p-4 flex items-center justify-between text-left cursor-pointer hover:bg-white/5 transition-colors"
                  >
                    <span className="text-xs font-bold uppercase tracking-wider text-white">
                      Komposisi Alami (Ingredients)
                    </span>
                    {openAccordion === 'ingredients' ? (
                      <Minus className="w-4 h-4 text-white/70" />
                    ) : (
                      <Plus className="w-4 h-4 text-white/70" />
                    )}
                  </button>
                  {openAccordion === 'ingredients' && (
                    <div className="px-4 pb-4 space-y-2 border-t border-white/5 pt-3 animate-in fade-in duration-200">
                      <p className="text-[11px] text-white/50 mb-2 font-mono uppercase tracking-wider">
                        100% BOTANICAL TANPA PERISA SINTETIS:
                      </p>
                      <div className="space-y-1.5">
                        {current.ingredients.map((ing) => (
                          <div key={ing} className="flex items-start gap-2 text-xs text-white/90">
                            <Check className="w-3.5 h-3.5 text-[#9EE4B8] flex-shrink-0 mt-0.5" />
                            <span>{ing}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. Panduan Seduh Cepat (< 3 Menit) */}
                <div className="border border-white/10 rounded-2xl bg-white/5 overflow-hidden transition-colors">
                  <button
                    type="button"
                    onClick={() => toggleAccordion('brewing')}
                    className="w-full p-4 flex items-center justify-between text-left cursor-pointer hover:bg-white/5 transition-colors"
                  >
                    <span className="text-xs font-bold uppercase tracking-wider text-white">
                      Petunjuk Seduh (&lt; 3 Menit)
                    </span>
                    {openAccordion === 'brewing' ? (
                      <Minus className="w-4 h-4 text-white/70" />
                    ) : (
                      <Plus className="w-4 h-4 text-white/70" />
                    )}
                  </button>
                  {openAccordion === 'brewing' && (
                    <div className="px-4 pb-4 text-xs text-white/75 leading-relaxed border-t border-white/5 pt-3 space-y-2 animate-in fade-in duration-200">
                      <div className="flex items-center gap-2 text-white font-medium">
                        <Clock className="w-4 h-4 text-accent-subtle" />
                        <span>{current.brewing}</span>
                      </div>
                      <p className="text-[11px] text-white/60">
                        Kantung sachet biodegradable bebas klorin dan bebas mikroplastik. Tutup cangkir saat menyeduh untuk mengunci minyak atsiri alami.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
