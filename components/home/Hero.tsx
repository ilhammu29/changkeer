'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowDown, ArrowUpRight, Play, Pause, Volume2, VolumeX, Sparkles } from 'lucide-react';
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

export function Hero({ content }: HeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const eyebrow = content?.eyebrow || 'SOLAR-TERM HERBAL REVOLUTION';
  const line1 = content?.headline_line1 || 'MORE THAN TEA.';
  const line2 = content?.headline_line2 || 'A BETTER YOU.';
  const subheadline =
    content?.subheadline ||
    'Seduhan teh herbal fungsional murni tanpa kompromi. Diramu dari tanaman rempah, bunga, dan daun teh terbaik nusantara dengan gula sorgum & madu murni. 100% bebas mikroplastik & tanpa daun senna.';
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
      // Attempt autoplay muted
      videoEl.play().catch(() => {
        // Autoplay policy prevented playback, keep poster visible
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

  return (
    <section className="relative w-full min-h-[100svh] flex flex-col justify-between overflow-hidden">
      {/* Background Video Layer */}
      <div className="absolute inset-0 w-full h-full -z-20 overflow-hidden bg-black">
        {/* Fallback Static Poster Image for instant paint / SEO / reduced motion */}
        <Image
          src="/images/hero/hero-video-poster.jpg"
          alt="CHANGKEER Cinematic Tea Craft"
          fill
          priority
          className={`object-cover object-center transition-opacity duration-1000 ${
            videoLoaded && !reducedMotion ? 'opacity-0' : 'opacity-100'
          }`}
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
            className="w-full h-full object-cover object-center"
          />
        )}
      </div>

      {/* Cinematic Vignette & Readability Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/60 -z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-primary/25 mix-blend-multiply -z-10 pointer-events-none" />
      {/* Bottom smooth bleed into page background */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-background via-background/60 to-transparent -z-10 pointer-events-none" />

      {/* Top spacer so hero content doesn't collide with navbar */}
      <div className="h-20 sm:h-24 w-full" />

      {/* Main Editorial Hero Content */}
      <Container size="wide" className="relative z-10 py-12 md:py-16 my-auto">
        <div className="max-w-4xl space-y-6">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] sm:text-xs font-bold tracking-[0.28em] uppercase shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-accent-subtle" />
            <span>{eyebrow}</span>
          </div>

          {/* Monumental Editorial Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tight text-white uppercase leading-[0.9] select-none drop-shadow-md">
            <span className="block">{line1}</span>
            <span className="block text-white/90">{line2}</span>
          </h1>

          {/* Subheadline Prose */}
          <p className="max-w-2xl text-sm sm:text-base md:text-lg text-white/85 leading-relaxed font-normal pt-2 drop-shadow-sm">
            {subheadline}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
            <Link
              href={primaryCtaLink}
              className="inline-flex items-center justify-center gap-2 text-xs font-bold tracking-widest uppercase bg-primary text-primary-foreground px-8 py-4 rounded-sm hover:bg-primary-hover transition-all duration-300 active:scale-[0.99] text-center shadow-lg"
            >
              <span>{primaryCtaText}</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>

            <Link
              href={secondaryCtaLink}
              className="inline-flex items-center justify-center text-xs font-bold tracking-widest uppercase bg-white/15 hover:bg-white/25 text-white border border-white/30 backdrop-blur-md px-8 py-4 rounded-sm transition-all duration-300 active:scale-[0.99] text-center"
            >
              <span>{secondaryCtaText}</span>
            </Link>
          </div>
        </div>
      </Container>

      {/* Bottom Editorial Bar: Brand Truths & Smooth Scroll Indicator */}
      <div className="relative z-10 border-t border-white/15 bg-black/30 backdrop-blur-sm text-white/80 py-4">
        <Container size="wide">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            {/* Left: Brand Truths from PDF */}
            <div className="flex items-center gap-3 text-[10px] sm:text-xs font-mono uppercase tracking-widest text-white/70">
              <span className="font-bold text-white">01 // INTRO</span>
              <span className="text-white/30">•</span>
              <span>100% BEBAS MIKROPLASTIK</span>
              <span className="hidden md:inline text-white/30">•</span>
              <span className="hidden md:inline">BEBAS DAUN SENNA</span>
              <span className="hidden lg:inline text-white/30">•</span>
              <span className="hidden lg:inline">SEDUH &lt; 3 MENIT</span>
            </div>

            {/* Right: Controls & Scroll Link */}
            <div className="flex items-center gap-5">
              {/* Video Play/Pause & Sound Controls */}
              {!reducedMotion && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="p-1.5 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
                    aria-label={isPlaying ? 'Jeda video' : 'Putar video'}
                    title={isPlaying ? 'Jeda video' : 'Putar video'}
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  </button>

                  <button
                    type="button"
                    onClick={toggleMute}
                    className="p-1.5 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors"
                    aria-label={isMuted ? 'Aktifkan suara' : 'Bisukan suara'}
                    title={isMuted ? 'Aktifkan suara' : 'Bisukan suara'}
                  >
                    {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}

              {/* Smooth Scroll Target */}
              <a
                href="#highlights"
                className="flex items-center gap-1.5 text-white font-bold tracking-widest uppercase text-[10px] hover:text-white/80 transition-colors"
              >
                <span>GULIR KE BAWAH</span>
                <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
              </a>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
