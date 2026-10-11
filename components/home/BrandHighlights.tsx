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
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Decorative Subtle Background Aura */}
              <div className="absolute -top-10 -left-10 w-48 h-48 bg-accent/10 rounded-full blur-3xl pointer-events-none -z-10" />
            </div>

            {/* Right: Tentang Kami (Heading Sedang + Deskripsi Rapi) */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-4 lg:pl-4">
              <span className="text-[10px] font-mono font-bold tracking-[0.25em] uppercase text-primary block">
                ABOUT CHANGKEER
              </span>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold uppercase tracking-wide text-foreground leading-snug">
                Grab-and-Go Herbal Tea from Jakarta · Ready in &lt; 3 Minutes
              </h2>

              {/* Clean English Narrative */}
              <div className="space-y-3.5 text-xs sm:text-sm text-muted-foreground leading-relaxed font-normal">
                <p>
                  Changkeer is a grab-and-go herbal tea brand from Jakarta. We serve real loose-leaf blends of flowers, fruit and roots, freshly brewed and ready in under three minutes.
                </p>
                <p>
                  Our menu follows the 24 solar terms of the traditional Chinese calendar, so a new seasonal blend arrives about every two weeks: warming ginger and dates in the rainy months, cooling chrysanthemum and citrus in the dry heat.
                </p>
                <p>
                  Every cup is unsweetened by default, brewed from plastic-free paper or muslin sachets, and made without senna or &quot;detox&quot; claims. We list every ingredient, because a healthier daily drink should also be an honest one.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
