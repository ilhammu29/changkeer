import React from 'react';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';

interface HighlightItem {
  title: string;
  desc: string;
}

interface BrandHighlightsProps {
  highlights?: HighlightItem[];
}

export function BrandHighlights({ highlights: _highlights }: BrandHighlightsProps) {
  return (
    <section id="highlights" className="w-full bg-surface border-b border-border py-16 sm:py-20 lg:py-24 scroll-mt-20 overflow-hidden">
      <Container size="wide">
        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Left: Foto Produk Asli CHANGKEER */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/5] sm:aspect-square lg:aspect-[4/5] w-full max-w-md mx-auto rounded-2xl overflow-hidden bg-background border border-border/80 shadow-md group">
                <Image
                  src="/images/assets/jasmine_tea_produk.jpg"
                  alt="CHANGKEER Jasmine Tea Authentic Brew"
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  priority
                />

                {/* Subtle Gradient Scrim at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                {/* Microplastic-free Badge Overlay */}
                <div className="absolute bottom-5 left-5 right-5 bg-surface/95 backdrop-blur-md p-3.5 rounded-xl border border-white/20 shadow-lg flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-mono tracking-[0.25em] uppercase text-muted-foreground font-semibold">
                      STANDAR KEMASAN
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                      100% Bebas Mikroplastik
                    </span>
                  </div>
                  <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                    Bleach-Free
                  </span>
                </div>
              </div>

              {/* Decorative Subtle Background Aura */}
              <div className="absolute -top-10 -left-10 w-48 h-48 bg-accent/10 rounded-full blur-3xl pointer-events-none -z-10" />
            </div>

            {/* Right: Tentang Kami (Heading Sedang + Deskripsi Rapi) */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-4 lg:pl-4">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold uppercase tracking-wide text-foreground leading-snug">
                Tradisi Seduh Alami untuk Kejernihan Hidup Modern
              </h2>

              {/* Deskripsi Singkat Font Bersih & Rapi */}
              <div className="space-y-3.5 text-xs sm:text-sm text-muted-foreground leading-relaxed font-normal">
                <p>
                  CHANGKEER lahir dari dedikasi menghadirkan jeda yang menenangkan di tengah ritme keseharian yang serba cepat. Kami meracik daun teh utuh, kelopak bunga melati, dan rempah alami nusantara tanpa pemutih kimiawi maupun kantong plastik berbahaya.
                </p>
                <p>
                  Setiap racikan dipermanis lembut dengan gula sorgum alami dan madu hutan murni rendah glikemik. Bebas daun senna keras sehingga sangat aman dan nyaman dikonsumsi setiap hari untuk menjaga hidrasi alami serta ketenangan pikiran Anda.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
