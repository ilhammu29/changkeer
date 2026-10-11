import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface HighlightItem {
  title: string;
  desc: string;
}

interface BrandHighlightsProps {
  highlights?: HighlightItem[];
}

export function BrandHighlights({ highlights: _highlights }: BrandHighlightsProps) {
  return (
    <section id="highlights" className="w-full bg-surface border-b border-border py-24 sm:py-32 lg:py-36 scroll-mt-20 overflow-hidden">
      <Container size="wide">
        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
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

            {/* Right: Tentang Kami (Headline Sedang + Deskripsi Singkat Font Kecil) */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-6 lg:pl-4">
              <div className="space-y-2">
                <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-accent block">
                  01 // TENTANG KAMI
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase tracking-tight text-foreground leading-[1.15]">
                  Tradisi Seduh Alami untuk Kejernihan Hidup Modern
                </h2>
              </div>

              {/* Deskripsi Singkat dengan Font Kecil & Halus */}
              <div className="space-y-3.5 text-xs sm:text-sm text-muted-foreground leading-relaxed font-normal">
                <p>
                  CHANGKEER lahir dari dedikasi menghadirkan jeda yang menenangkan di tengah ritme keseharian yang serba cepat. Kami meracik daun teh utuh, kelopak bunga melati, dan rempah alami nusantara tanpa pemutih kimiawi maupun kantong plastik berbahaya.
                </p>
                <p>
                  Setiap racikan dipermanis lembut dengan gula sorgum alami dan madu hutan murni rendah glikemik. Tanpa daun senna keras, sangat aman dan nyaman dikonsumsi setiap hari untuk menjaga hidrasi serta ketenangan pikiran Anda.
                </p>
              </div>

              {/* 3 Karakter Kunci Font Kecil */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
                <div className="p-3 rounded-lg bg-background border border-border/60 space-y-1">
                  <div className="flex items-center gap-1.5 text-primary">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-foreground">
                      Bahan Utuh
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-normal">
                    Kuntum melati &amp; daun teh utuh tanpa perisa sintetis.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-background border border-border/60 space-y-1">
                  <div className="flex items-center gap-1.5 text-primary">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-foreground">
                      Pemanis Alami
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-normal">
                    Gula sorgum &amp; madu murni rendah glikemik.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-background border border-border/60 space-y-1">
                  <div className="flex items-center gap-1.5 text-primary">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-foreground">
                      Seduh Cepat
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-normal">
                    Format praktis &lt; 3 menit siap minum kapan saja.
                  </p>
                </div>
              </div>

              {/* Action Link */}
              <div className="pt-2">
                <Link
                  href="/tentang-kami"
                  className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase bg-primary text-primary-foreground px-6 py-3 rounded-full hover:bg-primary-hover transition-all shadow-sm active:scale-95"
                >
                  <span>PELAJARI FILOSOFI KAMI</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
