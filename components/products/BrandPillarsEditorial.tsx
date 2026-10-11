'use client';

import React from 'react';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { ShieldCheck, HeartPulse, Sparkles, Zap } from 'lucide-react';

const PILLARS = [
  {
    num: '01',
    tag: 'ZERO PLASTICS',
    title: '100% Microplastic-Free',
    icon: ShieldCheck,
    description:
      'Conventional tea bags leach billions of synthetic plastic particles into hot water. Changkeer strictly uses plastic-free paper or muslin sachets, safeguarding your daily steep from polymer residues.',
  },
  {
    num: '02',
    tag: 'GUT INTEGRITY',
    title: 'Zero Senna & No "Detox" Gimmicks',
    icon: HeartPulse,
    description:
      'We reject senna and harsh laxatives. Every blend is made without deceptive detox claims, keeping your digestion balanced and naturally nurtured for daily habitual enjoyment.',
  },
  {
    num: '03',
    tag: 'NATURAL ROOTS',
    title: 'Unsweetened by Default & Pure Add-ons',
    icon: Sparkles,
    description:
      'Every cup is unsweetened by default. Sweeten consciously with low-glycemic organic sorghum sugar, palm sugar syrup, stevia leaf, or raw Indonesian forest honey—never refined white sugar.',
  },
  {
    num: '04',
    tag: 'GRAB & GO',
    title: 'Brewed & Ready in Under Three Minutes',
    icon: Zap,
    description:
      'Crafted for active modern lives. Whole botanical leaves and fresh petals infuse completely in under three minutes, delivering rich, calming flavor without prolonged waiting.',
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
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] uppercase text-primary block">
              OUR INTEGRITY COMMITMENT
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold uppercase tracking-tight text-foreground">
              Uncompromising Quality Standards
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xl mx-auto">
              Rooted in our belief that a healthier daily drink must also be an honest one, with full ingredient disclosure on every cup.
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
