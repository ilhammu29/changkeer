'use client';

import React from 'react';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { ShieldCheck, HeartPulse, Sparkles, Zap } from 'lucide-react';

const PILLARS = [
  {
    num: '01',
    tag: 'ZERO PLASTIK',
    title: '100% Bebas Mikroplastik',
    icon: ShieldCheck,
    description:
      'Kantong teh konvensional melepaskan miliaran partikel mikroplastik berbahaya ke dalam air panas saat diseduh. CHANGKEER menolak material sintetis dan menggunakan kemasan serat alami ramah lingkungan yang aman diseduh tanpa residu polimer beracun.',
  },
  {
    num: '02',
    tag: 'GUT SAFE',
    title: 'Bebas Daun Senna (Aman Harian)',
    icon: HeartPulse,
    description:
      'Banyak produk teh "detox" mengandalkan daun senna (daun jati cina) yang bersifat laksatif keras dan memicu iritasi dinding usus. Kami menolak keras bahan tersebut agar racikan aman dikonsumsi harian tanpa merusak keseimbangan flora pencernaan.',
  },
  {
    num: '03',
    tag: 'RENDAH GLIKEMIK',
    title: 'Gula Sorgum Organik & Madu Hutan Murni',
    icon: Sparkles,
    description:
      'Mengeliminasi gula tebu rafinasi yang memicu lonjakan insulin. Kami memadukan gula sorgum bernutrisi rendah glikemik serta madu hutan murni nusantara untuk kelembutan rasa seimbang yang ramah bagi metabolisme tubuh.',
  },
  {
    num: '04',
    tag: 'GRAB & GO',
    title: 'Ekstraksi Cepat Kurang Dari 3 Menit',
    icon: Zap,
    description:
      'Dirancang untuk ritme hidup aktif modern. Daun teh utuh dan kelopak botani segar terekstraksi optimal hanya dalam waktu kurang dari 3 menit, menghadirkan seduhan harum bernutrisi tanpa proses ritual yang memakan waktu.',
  },
];

export function BrandPillarsEditorial() {
  return (
    <section
      id="pillars"
      className="py-24 sm:py-32 bg-white text-foreground border-t border-border/60 scroll-mt-20 overflow-hidden"
    >
      <Container size="wide">
        {/* Section Heading */}
        <Reveal>
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-16 sm:mb-24">
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] uppercase text-accent block">
              KOMITMEN INTEGRITAS KAMI
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold uppercase tracking-tight text-foreground">
              Standar Kualitas Tanpa Kompromi
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Lahir dari evaluasi kritis terhadap industri teh konvensional yang kerap
              mengabaikan kesehatan jangka panjang demi efisiensi produksi massal.
            </p>
          </div>
        </Reveal>

        {/* Tree Branching Timeline (Pohon Cabang Bergantian) */}
        <div className="relative max-w-5xl mx-auto">
          {/* Central Tree Trunk Spine */}
          <div className="absolute top-4 bottom-4 left-6 md:left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b from-primary/10 via-primary/50 to-primary/10 pointer-events-none" />

          <div className="space-y-12 sm:space-y-16">
            {PILLARS.map((pillar, idx) => {
              const isLeft = idx % 2 === 0;
              const Icon = pillar.icon;

              return (
                <div key={pillar.num} className="relative">
                  <Reveal delayMs={idx * 120}>
                    <div
                      className={`flex flex-col md:flex-row items-center ${
                        isLeft ? 'md:flex-row-reverse' : ''
                      }`}
                    >
                      {/* Empty Spacer Column on Desktop */}
                      <div className="hidden md:block w-1/2" />

                      {/* Branch Node on Central Trunk */}
                      <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-20 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-white border-2 border-primary text-primary font-mono text-xs font-bold flex items-center justify-center shadow-xs">
                          {pillar.num}
                        </div>
                      </div>

                      {/* Content Card (Branches to Left or Right) */}
                      <div
                        className={`w-full md:w-1/2 pl-16 md:pl-0 ${
                          isLeft ? 'md:pr-14 md:text-right' : 'md:pl-14 md:text-left'
                        }`}
                      >
                        <div className="bg-white border border-border/80 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all duration-300 card-boundary group hover:border-primary/50">
                          {/* Tag & Icon Row */}
                          <div
                            className={`flex items-center gap-2.5 mb-3.5 ${
                              isLeft ? 'md:justify-end' : 'md:justify-start'
                            }`}
                          >
                            <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
                              <Icon className="w-4 h-4" />
                            </span>
                            <span className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground font-semibold px-2.5 py-0.5 rounded-full bg-muted/80">
                              {pillar.tag}
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className="text-base sm:text-lg font-bold uppercase tracking-tight text-foreground mb-2 group-hover:text-primary transition-colors">
                            {pillar.title}
                          </h3>

                          {/* Description */}
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            {pillar.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
