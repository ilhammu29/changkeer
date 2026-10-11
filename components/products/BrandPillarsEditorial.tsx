'use client';

import React from 'react';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';

const PILLARS = [
  {
    num: '01',
    tag: 'ZERO PLASTIK',
    title: '100% Bebas Mikroplastik',
    description:
      'Kantong teh konvensional melepaskan miliaran partikel mikroplastik berbahaya ke dalam air panas saat diseduh. CHANGKEER menolak material sintetis dan menggunakan kemasan serat alami ramah lingkungan yang aman diseduh tanpa residu polimer beracun.',
  },
  {
    num: '02',
    tag: 'GUT SAFE',
    title: 'Bebas Daun Senna (Aman Harian Tanpa Laksatif)',
    description:
      'Banyak produk teh "detox" mengandalkan daun senna (daun jati cina) yang bersifat laksatif keras dan memicu iritasi dinding usus. Kami menolak keras bahan tersebut agar racikan aman dikonsumsi harian tanpa merusak keseimbangan flora pencernaan.',
  },
  {
    num: '03',
    tag: 'RENDAH GLIKEMIK',
    title: 'Gula Sorgum Organik & Madu Hutan Murni',
    description:
      'Mengeliminasi gula tebu rafinasi yang memicu lonjakan insulin. Kami memadukan gula sorgum bernutrisi rendah glikemik serta madu hutan murni nusantara untuk kelembutan rasa seimbang yang ramah bagi metabolisme tubuh.',
  },
  {
    num: '04',
    tag: 'GRAB & GO',
    title: 'Ekstraksi Cepat Kurang Dari 3 Menit',
    description:
      'Dirancang untuk ritme hidup aktif modern. Daun teh utuh dan kelopak botani segar terekstraksi optimal hanya dalam waktu kurang dari 3 menit, menghadirkan seduhan harum bernutrisi tanpa proses ritual yang memakan waktu.',
  },
];

export function BrandPillarsEditorial() {
  return (
    <section
      id="pillars"
      className="py-24 sm:py-28 lg:py-32 border-t border-border/30 bg-background text-foreground scroll-mt-20"
    >
      <Container size="wide">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* LEFT: Sticky Editorial Intro */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <Reveal>
              <div className="space-y-4">
                <span className="text-[11px] font-mono font-bold tracking-[0.25em] uppercase text-accent block">
                  KOMITMEN INTEGRITAS KAMI
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-foreground leading-tight">
                  Standar Kualitas Tanpa Kompromi
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-1">
                  Lahir dari evaluasi kritis terhadap industri teh konvensional yang kerap
                  mengabaikan kesehatan jangka panjang demi efisiensi produksi massal.
                </p>

                {/* Editorial Manifesto Badge */}
                <div className="pt-6 border-t border-border/40 mt-6">
                  <div className="flex items-center gap-2.5 text-[11px] font-mono text-muted-foreground tracking-wider uppercase">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    <span>Filosofi Botani Murni Nusantara</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* RIGHT: Typographic Editorial Rows (No Cardboxes, No Generic AI Slop) */}
          <div className="lg:col-span-7 divide-y divide-border/40 border-y border-border/40">
            {PILLARS.map((pillar, idx) => (
              <Reveal key={pillar.num} delayMs={idx * 80}>
                <div className="group py-8 sm:py-10 transition-colors duration-300 hover:bg-surface/50 sm:px-6 -mx-2 sm:-mx-6 rounded-xl">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 sm:gap-4 mb-3">
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono text-xs sm:text-sm font-bold text-primary tracking-widest">
                        {pillar.num}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold uppercase tracking-tight text-foreground group-hover:text-primary transition-colors">
                        {pillar.title}
                      </h3>
                    </div>

                    <span className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground self-start sm:self-auto shrink-0 px-2 py-0.5 rounded-sm bg-muted/60">
                      {pillar.tag}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xl pl-0 sm:pl-7">
                    {pillar.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
