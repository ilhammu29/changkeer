'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowUpRight, Play, Sparkles } from 'lucide-react';
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
    video_caption?: string;
  };
}

export function Hero({ content }: HeroProps) {
  const [showVideoModal, setShowVideoModal] = useState(false);

  const eyebrow = content?.eyebrow || 'HERBAL TEA REVOLUTION';
  const line1 = content?.headline_line1 || 'MORE THAN TEA.';
  const line2 = content?.headline_line2 || 'A BETTER YOU.';
  const subheadline =
    content?.subheadline ||
    'Seduhan teh herbal murni tanpa kompromi. Diramu dari tanaman rempah dan kelopak bunga terbaik nusantara untuk energi jernih dan ketenangan sejati.';
  const primaryCtaText = content?.primary_cta_text || 'JELAJAHI KATALOG';
  const primaryCtaLink = content?.primary_cta_link || '/katalog';
  const secondaryCtaText = content?.secondary_cta_text || 'TENTANG PRODUK';
  const secondaryCtaLink = content?.secondary_cta_link || '/tentang-produk';
  const videoCaption =
    content?.video_caption || 'Saksikan ritual panen & racikan alami CHANGKEER';

  return (
    <section className="relative overflow-hidden pt-8 pb-20 md:py-16 lg:py-24 border-b border-border">
      {/* Background Subtle Geometric Grid & Lines */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-accent-subtle/50 blur-3xl opacity-70" />
        <div className="absolute top-0 right-1/4 w-[1px] h-full bg-border/40" />
        <div className="absolute top-0 left-1/4 w-[1px] h-full bg-border/40" />
      </div>

      <Container size="wide">
        {/* Eyebrow & Headline Header */}
        <div className="mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface border border-border rounded-sm text-[11px] font-bold tracking-[0.25em] uppercase text-muted-foreground mb-4">
            <Sparkles className="w-3 h-3 text-accent" />
            <span>{eyebrow}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tight text-foreground uppercase leading-[0.92] select-none">
            <span className="block">{line1}</span>
            <span className="block text-foreground/80">{line2}</span>
          </h1>
        </div>

        {/* Asymmetrical 3-Column Hero Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          {/* Left Column: Video Preview & Primary Messaging */}
          <div className="lg:col-span-4 order-2 lg:order-1 flex flex-col justify-between space-y-8">
            {/* Interactive Video Preview Card */}
            <div className="relative group overflow-hidden rounded-md border border-border bg-surface shadow-sm">
              <div className="relative aspect-video w-full bg-muted overflow-hidden">
                <Image
                  src="/images/video-poster.svg"
                  alt="Video Preview Panen & Racikan CHANGKEER"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority
                />
                <button
                  type="button"
                  onClick={() => setShowVideoModal(true)}
                  className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-lg cursor-pointer hover:bg-primary"
                  aria-label="Putar cuplikan video"
                >
                  <Play className="w-5 h-5 ml-1 fill-current" />
                </button>
              </div>
              <div className="p-4 bg-surface border-t border-border">
                <div className="flex items-center justify-between text-xs font-bold tracking-wider text-muted-foreground uppercase mb-1">
                  <span>PREVIEW FILM</span>
                  <span>01:45 MIN</span>
                </div>
                <p className="text-xs text-foreground font-medium">{videoCaption}</p>
              </div>
            </div>

            {/* Subheadline & CTA Actions */}
            <div className="space-y-6">
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-normal">
                {subheadline}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  href={primaryCtaLink}
                  className="inline-flex items-center justify-center gap-2 text-xs font-bold tracking-widest uppercase bg-primary text-primary-foreground px-7 py-4 rounded-sm hover:bg-primary-hover transition-all active:scale-[0.99] text-center"
                >
                  <span>{primaryCtaText}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>

                <Link
                  href={secondaryCtaLink}
                  className="inline-flex items-center justify-center text-xs font-bold tracking-widest uppercase border border-border bg-surface text-foreground px-7 py-4 rounded-sm hover:bg-surface-hover hover:border-border-strong transition-all active:scale-[0.99] text-center"
                >
                  <span>{secondaryCtaText}</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Center Column: Herbal Tea Canister Focal Point with Geometric Layers */}
          <div className="lg:col-span-5 order-1 lg:order-2 flex items-center justify-center relative py-6">
            {/* Geometric Graphic Layers Behind Canister */}
            <div className="absolute w-[320px] sm:w-[420px] h-[320px] sm:h-[420px] rounded-full border border-border/80 -z-10" />
            <div className="absolute w-[240px] sm:w-[320px] h-[240px] sm:h-[320px] rounded-full bg-accent-subtle/70 -z-10" />
            <div className="absolute w-[360px] sm:w-[460px] h-[480px] sm:h-[580px] border border-dashed border-border/60 rounded-[120px] -z-10" />

            {/* Main Canister Visual */}
            <div className="relative w-full max-w-[340px] sm:max-w-[420px] aspect-[3/4] animate-subtle-float">
              <Image
                src="/images/assets/jasmine_tea_produk.png"
                alt="Kemasan Teh Herbal CHANGKEER Botanical Canister"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </div>

          {/* Right Column: Product Label & Supporting Specs */}
          <div className="lg:col-span-3 order-3 flex flex-col justify-center space-y-6 bg-surface/70 backdrop-blur-sm p-6 sm:p-7 rounded-lg border border-border shadow-sm">
            <div className="border-b border-border pb-4">
              <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-accent">
                VARIAN UTAMA
              </span>
              <h3 className="text-lg font-black tracking-tight text-foreground uppercase mt-1">
                JASMINE BOTANICAL
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Solar-Term Herbal Infusion Series
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="font-bold tracking-wider uppercase text-muted-foreground block text-[10px]">
                  PROFIL RASA
                </span>
                <p className="text-foreground font-semibold mt-0.5">
                  Harum melati alami semerbak dengan manis lembut sorgum &amp; madu.
                </p>
              </div>

              <div>
                <span className="font-bold tracking-wider uppercase text-muted-foreground block text-[10px]">
                  KOMPOSISI ALAMI
                </span>
                <p className="text-foreground font-semibold mt-0.5">
                  Daun Teh Hijau, Bunga Melati Utuh, Gula Sorgum, Madu Alami.
                </p>
              </div>

              <div>
                <span className="font-bold tracking-wider uppercase text-muted-foreground block text-[10px]">
                  KEUNGGULAN KEMASAN
                </span>
                <p className="text-foreground font-semibold mt-0.5">
                  100% Bebas Bleach &amp; Bebas Mikroplastik // Tanpa Senna.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wider text-muted-foreground">PENYAJIAN</span>
              <span className="font-bold text-foreground">Praktis Kurang Dari 3 Menit</span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="pt-16 flex items-center justify-between border-t border-border/40 mt-12 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-bold">01 // INTRO</span>
            <span className="text-border-strong">•</span>
            <span className="uppercase tracking-widest text-[10px]">CHANGKEER BOTANICAL ARCHIVE</span>
          </div>

          <a
            href="#highlights"
            className="flex items-center gap-1.5 hover:text-foreground transition-colors uppercase font-bold tracking-widest text-[10px]"
          >
            <span>GULIR KE BAWAH</span>
            <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
          </a>
        </div>
      </Container>

      {/* Video Modal (Placeholder) */}
      {showVideoModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setShowVideoModal(false)}
        >
          <div
            className="relative w-full max-w-2xl bg-surface rounded-lg p-6 border border-border shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <h4 className="font-bold text-sm tracking-widest uppercase">
                PREVIEW: DOKUMENTER RACIKAN CHANGKEER
              </h4>
              <button
                type="button"
                onClick={() => setShowVideoModal(false)}
                className="text-muted-foreground hover:text-foreground text-sm font-bold uppercase p-1"
              >
                ✕ TUTUP
              </button>
            </div>
            <div className="mt-4 aspect-video bg-black flex items-center justify-center rounded-sm overflow-hidden relative">
              <video
                src="/videos/hero-video.mp4"
                controls
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              >
                Browser Anda tidak mendukung pemutar video HTML5.
              </video>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
