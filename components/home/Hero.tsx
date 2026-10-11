'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowDown,
  ArrowUpRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';

interface HeroProps {
  content?: {
    eyebrow?: string;
    headline_line1?: string;
    headline_line2?: string;
    subheadline?: string;
    primary_cta_text?: string;
    primary_cta_link?: string;
    secondary_cta_text?: string;
    secondary_cta_link?: string;
  };
}

const HERO_TEA_HIGHLIGHTS = [
  {
    tag: 'VARIAN RESMI 01',
    name: 'CHANGKEER JASMINE TEA',
    desc: 'Harmoni daun teh hijau pilihan dan kuntum melati utuh dengan gula sorgum & madu murni.',
    link: '/katalog/solar-term-jasmine-herbal-tea',
  },
  {
    tag: 'VARIAN RESMI 02',
    name: 'CHANGKEER ENGLISH BREAKFAST',
    desc: 'Racikan teh hitam berkarakter kuat untuk dorongan energi bersih alami tanpa asam lambung.',
    link: '/katalog/english-breakfast-tea',
  },
  {
    tag: 'VARIAN RESMI 03',
    name: 'CHANGKEER VANILLA MINT TEA',
    desc: 'Semilir sejuk daun mint alami berpadu aroma manis vanilla untuk relaksasi pernapasan.',
    link: '/katalog/vanilla-mint-tea',
  },
];

export function Hero({ content }: HeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);

  const eyebrow = content?.eyebrow || 'SOLAR-TERM HERBAL REVOLUTION';
  const line1 = content?.headline_line1 || 'MORE THAN TEA.';
  const line2 = content?.headline_line2 || 'A BETTER YOU.';
  const subheadline =
    content?.subheadline ||
    'Seduhan teh herbal fungsional murni tanpa kompromi. Diramu dari tanaman rempah, bunga, dan daun teh nusantara. 100% bebas mikroplastik & tanpa daun senna.';
  const primaryCtaText = content?.primary_cta_text || 'JELAJAHI KATALOG';
  const primaryCtaLink = content?.primary_cta_link || '/katalog';
  const secondaryCtaText = content?.secondary_cta_text || 'TENTANG PRODUK';
  const secondaryCtaLink = content?.secondary_cta_link || '/tentang-produk';

  useEffect(() => {
    // Check user preference for reduced motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.matches) {
      setReducedMotion(true);
      if (videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }

    const videoEl = videoRef.current;
    if (videoEl && !motionQuery.matches) {
      videoEl.play().catch(() => {
        setIsPlaying(false);
      });
    }
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleNextHighlight = () => {
    setHighlightIndex((prev) => (prev + 1) % HERO_TEA_HIGHLIGHTS.length);
  };

  const handlePrevHighlight = () => {
    setHighlightIndex((prev) => (prev - 1 + HERO_TEA_HIGHLIGHTS.length) % HERO_TEA_HIGHLIGHTS.length);
  };

  const currentHighlight = HERO_TEA_HIGHLIGHTS[highlightIndex];

  return (
    <section className="relative w-full h-[100svh] min-h-[640px] flex items-center justify-center overflow-hidden bg-black select-none">
      {/* Background Video Layer (Full-Bleed 100svh) */}
      <div className="absolute inset-0 w-full h-full -z-20 overflow-hidden bg-black">
        {/* High-Resolution Poster Image as permanent backdrop */}
        <Image
          src="/images/hero/hero-video-poster.jpg"
          alt="CHANGKEER Cinematic Tea Craft"
          fill
          priority
          className="object-cover object-center"
        />

        {!reducedMotion && (
          <video
            ref={videoRef}
            src="/videos/hero-video.mp4"
            poster="/images/hero/hero-video-poster.jpg"
            autoPlay
            loop
            muted
            playsInline
            onLoadedData={() => setVideoLoaded(true)}
            className={`w-full h-full object-cover object-center transition-opacity duration-700 ${
              videoLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}
      </div>

      {/* Subtle Cinematic Vignette (Preserving footage brilliance while ensuring crisp legibility) */}
      <div className="absolute inset-0 bg-radial from-black/10 via-black/40 to-black/75 -z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50 -z-10 pointer-events-none" />

      {/* Bottom Gentle Fade into Page Content */}
      <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-background via-background/40 to-transparent -z-10 pointer-events-none" />

      {/* Left Navigation Arrow (<) - Matching Reference 3 */}
      <button
        type="button"
        onClick={handlePrevHighlight}
        className="hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border border-white/20 bg-black/30 backdrop-blur-md text-white/80 hover:text-white hover:bg-white/15 hover:border-white/50 items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer shadow-lg"
        aria-label="Varian teh sebelumnya"
        title="Varian Sebelumnya"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Right Navigation Arrow (>) - Matching Reference 3 */}
      <button
        type="button"
        onClick={handleNextHighlight}
        className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border border-white/20 bg-black/30 backdrop-blur-md text-white/80 hover:text-white hover:bg-white/15 hover:border-white/50 items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer shadow-lg"
        aria-label="Varian teh berikutnya"
        title="Varian Berikutnya"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Center Cinematic Editorial Hero Composition */}
      <Container size="wide" className="relative z-10 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center space-y-5 sm:space-y-6 pt-16 sm:pt-12">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] sm:text-xs font-semibold tracking-[0.3em] uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-accent-subtle" />
            <span>{eyebrow}</span>
          </div>

          {/* Balanced Harmonious Headline (Reference 3 Inspired) */}
          <div className="space-y-1 sm:space-y-2">
            <div className="font-serif text-3xl sm:text-5xl lg:text-6xl text-white font-medium tracking-wide drop-shadow-md">
              CHA (茶)
            </div>
            <h1 className="text-xl sm:text-3xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight drop-shadow-md">
              <span className="block">{line1}</span>
              <span className="block text-white/85 text-lg sm:text-2xl md:text-4xl">{line2}</span>
            </h1>
          </div>

          {/* Concise Subheadline Prose */}
          <p className="max-w-xl mx-auto text-xs sm:text-sm md:text-base text-white/85 leading-relaxed font-normal drop-shadow-sm px-2">
            {subheadline}
          </p>

          {/* Interactive Tea Highlight Capsule */}
          <div className="inline-flex max-w-full flex-wrap justify-center items-center gap-1.5 sm:gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-white/90 text-[10px] sm:text-xs">
            <span className="font-mono text-accent-subtle font-bold tracking-widest text-[9px] sm:text-[10px]">
              {currentHighlight.tag}:
            </span>
            <Link
              href={currentHighlight.link}
              className="font-bold tracking-wider hover:text-accent-subtle transition-colors underline underline-offset-2"
            >
              {currentHighlight.name}
            </Link>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
            <Link
              href={primaryCtaLink}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs font-bold tracking-widest uppercase bg-white text-black hover:bg-neutral-200 px-8 py-4 rounded-full transition-all duration-300 active:scale-95 text-center shadow-xl cursor-pointer"
            >
              <span>{primaryCtaText}</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>

            <Link
              href={secondaryCtaLink}
              className="w-full sm:w-auto inline-flex items-center justify-center text-xs font-bold tracking-widest uppercase bg-white/15 hover:bg-white/25 text-white border border-white/30 backdrop-blur-md px-8 py-4 rounded-full transition-all duration-300 active:scale-95 text-center cursor-pointer"
            >
              <span>{secondaryCtaText}</span>
            </Link>
          </div>
        </div>
      </Container>

      {/* Bottom Center Controls & Scroll Indicator (Exact match to Reference 3 circular buttons) */}
      <div className="absolute bottom-6 sm:bottom-8 inset-x-0 flex flex-col items-center justify-center gap-3 z-20 pointer-events-auto">
        {/* Play/Pause & Audio Mute Buttons in circular outline styling */}
        {!reducedMotion && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={togglePlay}
              className="w-10 h-10 rounded-full border border-white/30 bg-black/35 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/20 hover:border-white transition-all active:scale-90 cursor-pointer shadow-md"
              aria-label={isPlaying ? 'Jeda video' : 'Putar video'}
              title={isPlaying ? 'Jeda video' : 'Putar video'}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>

            <button
              type="button"
              onClick={toggleMute}
              className="w-10 h-10 rounded-full border border-white/30 bg-black/35 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/20 hover:border-white transition-all active:scale-90 cursor-pointer shadow-md"
              aria-label={isMuted ? 'Aktifkan suara' : 'Bisukan suara'}
              title={isMuted ? 'Aktifkan suara' : 'Bisukan suara'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        )}

        {/* Subtle Scroll Down Prompt */}
        <a
          href="#highlights"
          className="flex items-center gap-1.5 text-white/60 hover:text-white transition-colors text-[10px] font-mono tracking-[0.25em] uppercase pt-1"
          aria-label="Gulir ke bagian konten berikutnya"
        >
          <span>EKSPLORASI</span>
          <ArrowDown className="w-3 h-3 animate-bounce" />
        </a>
      </div>
    </section>
  );
}
