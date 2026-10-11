import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { ArrowUpRight, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Changkeer',
  description:
    'Grab-and-go herbal tea brand from Jakarta. Real loose-leaf blends of flowers, fruit and roots following the 24 solar terms.',
};

export default function AboutChangkeerPage() {
  const beliefs = [
    {
      title: 'Taste First',
      desc: "If it isn't nice to drink, it won't become a habit.",
      badge: 'FLAVOR & HABIT',
    },
    {
      title: "Say What's Inside",
      desc: 'Every ingredient is listed, with cautions where they apply.',
      badge: 'RADICAL HONESTY',
    },
    {
      title: 'Local Where We Can',
      desc: 'Flowers, ginger and honey come from growers in Puncak, Garut and Wonosobo.',
      badge: 'INDONESIAN TERROIR',
    },
  ];

  const founders = [
    { name: 'Almaidah Chaerudin Putri', role: 'Co-Founder', focus: 'Brand & Operational Direction' },
    { name: 'Annisha Humaira', role: 'Co-Founder', focus: 'Botanical Formulation & Research' },
    { name: 'Johana Abigael Rumbiak', role: 'Co-Founder', focus: 'Creative Design & Visual Identity' },
    { name: 'Keyla Putri Adisty', role: 'Co-Founder', focus: 'Community & Customer Experience' },
    { name: 'Nursoleha Romadhoni', role: 'Co-Founder', focus: 'Supply Chain & Sourcing Stewardship' },
  ];

  return (
    <div className="pb-16 sm:pb-24 font-sans bg-white text-foreground">
      {/* 1. Hero Banner with Background Image */}
      <section className="relative w-full py-18 sm:py-24 md:py-28 bg-neutral-950 overflow-hidden border-b border-border mb-16 sm:mb-20">
        <Image
          src="/images/assets/banner.jpg"
          alt="About Changkeer Botanical Craft"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/92 via-black/75 to-black/40 pointer-events-none" />

        <Container size="wide" className="relative z-10">
          <div className="max-w-3xl space-y-3.5">
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] uppercase text-purple-300 block">
              JAKARTA BOTANICAL TEAS
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-tight">
              About Changkeer
            </h1>
            <p className="text-sm sm:text-base font-normal text-white/85 leading-relaxed pt-1 max-w-2xl">
              Real loose-leaf blends of flowers, fruit and roots, freshly brewed and ready in under three minutes.
            </p>
          </div>
        </Container>
      </section>

      {/* 2. Narrative: Brand Origin & The 24 Solar Terms */}
      <section className="py-16 sm:py-20 border-b border-border/80 bg-white">
        <Container size="wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-[10px] font-mono font-bold tracking-[0.25em] uppercase text-primary block">
                OUR STORY &amp; ORIGIN
              </span>
              <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-foreground leading-snug">
                FROM CANGKIR TO THE 24 SOLAR TERMS
              </h2>
              <div className="pt-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-mono text-[11px] font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Plastic-Free Paper &amp; Muslin Sachets</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6 text-base sm:text-lg text-foreground/80 leading-relaxed font-normal">
              <p>
                <strong className="text-foreground font-bold">Changkeer</strong> is a grab-and-go herbal tea brand from Jakarta. We serve real loose-leaf blends of flowers, fruit and roots, freshly brewed and ready in under three minutes.
              </p>
              <p>
                Our menu follows the 24 solar terms of the traditional Chinese calendar, so a new seasonal blend arrives about every two weeks: warming ginger and dates in the rainy months, cooling chrysanthemum and citrus in the dry heat.
              </p>
              <p>
                Every cup is unsweetened by default, brewed from plastic-free paper or muslin sachets, and made without senna or &quot;detox&quot; claims. We list every ingredient, because a healthier daily drink should also be an honest one.
              </p>
              <p className="text-sm sm:text-base text-muted-foreground border-l-2 border-primary/40 pl-4 italic">
                The name comes from <span className="font-semibold text-foreground">cangkir</span>, Indonesian for cup, with a nod to the Chinese tea traditions behind our calendar.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. Brand Pillars: What We Believe (Hairline Partition Layout) */}
      <section className="py-20 border-b border-border/80 bg-white">
        <Container size="wide">
          <div className="max-w-2xl mb-14 space-y-2">
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] uppercase text-primary block">
              CORE PRINCIPLES
            </span>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-foreground">
              What We Believe
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/80 border-y border-border/80">
            {beliefs.map((b, idx) => (
              <div
                key={b.title}
                className="py-8 md:py-10 px-0 md:px-8 first:pl-0 last:pr-0 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-3xl sm:text-4xl font-light text-primary/40 block">
                      0{idx + 1}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-neutral-100 text-muted-foreground font-semibold">
                      {b.badge}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold uppercase tracking-tight text-foreground">
                    {b.title}
                  </h3>
                </div>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {b.desc}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 4. The Founders: Bespoke Luxury Roster */}
      <section className="py-20 sm:py-24 border-b border-border/80 bg-white">
        <Container size="wide">
          <div className="max-w-3xl mb-12 space-y-2">
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] uppercase text-primary block">
              FOUNDING STEWARDS
            </span>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-foreground">
              The Founders
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-1">
              United by the vision to replace microplastics and harsh laxatives with honest, fast-brewed loose-leaf botanicals.
            </p>
          </div>

          {/* Luxury Registry Rows */}
          <div className="border-t border-border/80 divide-y divide-border/60">
            {founders.map((f, idx) => {
              const initials = f.name
                .split(' ')
                .slice(0, 2)
                .map((w) => w[0])
                .join('');

              return (
                <div
                  key={f.name}
                  className="py-5 sm:py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:bg-neutral-50/70 transition-colors px-3 sm:px-4 rounded-xl"
                >
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="w-10 h-10 rounded-full border border-primary/20 bg-primary/5 text-primary font-mono text-xs font-bold flex items-center justify-center shrink-0">
                      {initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-muted-foreground/60">
                          0{idx + 1}
                        </span>
                        <h3 className="text-base sm:text-lg font-bold tracking-tight text-foreground uppercase group-hover:text-primary transition-colors">
                          {f.name}
                        </h3>
                      </div>
                      <span className="text-xs text-muted-foreground block pt-0.5 sm:pl-7">
                        {f.focus}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-start sm:self-auto pl-14 sm:pl-0">
                    <span className="text-[10px] uppercase font-mono tracking-[0.2em] px-3 py-1 rounded-full bg-white border border-border/80 text-foreground font-bold shadow-2xs">
                      {f.role}
                    </span>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground hidden lg:inline">
                      CHANGKEER ATELIER
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* 5. Editorial Call To Action Banner */}
      <section className="py-20 bg-white">
        <Container size="wide">
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden min-h-[360px] sm:min-h-[400px] flex items-center p-8 sm:p-14 lg:p-16 border border-border/80 shadow-md">
            <Image
              src="/images/assets/banner2.jpg"
              alt="CHANGKEER Herbal Tea Collection"
              fill
              sizes="100vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/92 via-black/80 to-black/55 pointer-events-none" />

            <div className="relative z-10 max-w-xl space-y-4 text-white">
              <span className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-purple-300 block">
                BEGIN YOUR DAILY RITUAL
              </span>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white leading-tight">
                Taste the Seasonal Balance Today
              </h3>
              <p className="text-xs sm:text-sm text-white/85 leading-relaxed font-normal">
                Explore our 24 solar terms rotational menu, signature grab-and-go cups, and bespoke botanical add-ons.
              </p>
              <div className="pt-2">
                <Link
                  href="/katalog"
                  className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase bg-white text-neutral-900 px-6 py-3 rounded-lg hover:bg-white/90 transition-all shadow-md active:scale-95"
                >
                  <span>EXPLORE BLENDS &amp; PRICES</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
