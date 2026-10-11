import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { ArrowUpRight, Sparkles, MapPin, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Changkeer',
  description:
    'An honest grab-and-go herbal tea from Jakarta. Sourced from Puncak, Garut, and Wonosobo, brewed plastic-free in under 3 minutes.',
};

export default function AboutChangkeerPage() {
  const teamMembers = [
    {
      num: '01',
      initials: 'AC',
      name: 'ALMAIDAH CHAERUDIN PUTRI',
      role: 'Co-founder',
      note: 'Championing honest daily hydration without synthetic shortcuts.',
    },
    {
      num: '02',
      initials: 'AH',
      name: 'ANNISHA HUMAIRA',
      role: 'Co-founder',
      note: 'Formulating whole-flower blends aligned with seasonal body rhythms.',
    },
    {
      num: '03',
      initials: 'JR',
      name: 'JOHANA ABIGAEL RUMBIAK',
      role: 'Co-founder',
      note: 'Shaping mindful, plastic-free rituals that fit active lifestyles.',
    },
    {
      num: '04',
      initials: 'KA',
      name: 'KEYLA PUTRI ADISTY',
      role: 'Co-founder',
      note: 'Fostering radical transparency and honest ingredient education.',
    },
    {
      num: '05',
      initials: 'NR',
      name: 'NURSOLEHA ROMADHONI',
      role: 'Co-founder',
      note: 'Partnering directly with local growers across Puncak, Garut & Wonosobo.',
    },
  ];

  return (
    <div className="pb-16 sm:pb-24 font-sans bg-white text-foreground">
      {/* 1. Hero Banner with Background Image */}
      <section className="relative w-full py-18 sm:py-24 md:py-28 bg-neutral-950 overflow-hidden border-b border-border mb-16 sm:mb-20">
        <Image
          src="/images/banners/about_changkeer_banner.jpg"
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

      {/* 2. Our Story: AN HONEST CHANGKEER, FROM INDONESIAN SOIL */}
      <section className="py-16 sm:py-20 border-b border-border/80 bg-white">
        <Container size="wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-[10px] font-mono font-bold tracking-[0.25em] uppercase text-primary block">
                OUR STORY
              </span>
              <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-foreground leading-snug">
                AN HONEST CHANGKEER, FROM INDONESIAN SOIL
              </h2>

              <div className="pt-2 flex flex-col gap-2.5">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-mono text-[11px] font-bold uppercase tracking-wider self-start">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Puncak · Garut · Wonosobo</span>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 text-muted-foreground font-mono text-[11px] font-semibold uppercase tracking-wider self-start border border-border/60">
                  <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                  <span>Plastic-Free · Zero Senna · Unsweetened Default</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-5 text-base sm:text-[17px] text-foreground/85 leading-relaxed font-normal">
              <p>
                <strong className="text-foreground font-bold">CHANGKEER</strong> is a grab-and-go herbal tea brand from Jakarta. We brew blends of whole flowers, dried fruit and spices sourced from growers in Puncak, Garut and Wonosobo, ready to enjoy in under 3 minutes.
              </p>
              <p>
                We started because most daily drinks are too sweet. Many &quot;detox&quot; teas on the market also contain senna, a laxative that isn&apos;t meant for daily use, and they come with exaggerated claims. On top of that, plenty of teabags are still made from nylon or plastic.
              </p>
              <p>
                That&apos;s why every Changkeer cup is unsweetened by default, with sorghum sugar or raw honey if you&apos;d like it sweeter. Our blends are brewed in unbleached paper or cotton muslin sachets, contain no senna, and every ingredient is clearly listed.
              </p>
              <p className="text-sm sm:text-base text-muted-foreground border-l-2 border-primary/50 pl-4 py-1 italic bg-neutral-50/70 rounded-r-lg">
                Our menu changes with the 24 solar terms of the traditional Chinese calendar, adapted to Jakarta&apos;s weather: warming blends in the rainy season, refreshing ones in the dry heat. The name Changkeer comes from <span className="font-semibold text-foreground not-italic">cangkir</span>, the Indonesian word for cup.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. The Team: Redesigned Architectural Showcase */}
      <section className="py-20 sm:py-24 border-b border-border/80 bg-white">
        <Container size="wide">
          {/* Section Header */}
          <div className="max-w-3xl mb-14 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>THE TEAM</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-foreground leading-tight">
              BEHIND EVERY CHANGKEER
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed pt-1 max-w-2xl">
              Five people who wanted a daily drink that&apos;s healthy, honest and easy to grab on a busy day, so we made one.
            </p>
          </div>

          {/* Redesigned 5-Member Architectural Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {teamMembers.map((member) => (
              <div
                key={member.num}
                className="group relative bg-white border border-border/80 rounded-2xl p-7 shadow-md hover:shadow-2xl transition-all duration-300 card-boundary flex flex-col justify-between space-y-6 hover:-translate-y-1"
              >
                {/* Top Row: Numeral & Circular Monogram Badge */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-2xl sm:text-3xl font-light text-primary/40 block group-hover:text-primary transition-colors">
                    {member.num}
                  </span>
                  <div className="w-11 h-11 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-mono font-bold text-xs text-primary shadow-2xs group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    {member.initials}
                  </div>
                </div>

                {/* Center Content: Full Name & Co-founder Pill */}
                <div className="space-y-2">
                  <h3 className="font-sans font-black text-base sm:text-lg uppercase tracking-tight text-foreground leading-snug group-hover:text-primary transition-colors">
                    {member.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold tracking-widest uppercase px-3 py-0.5 rounded-full bg-neutral-100 text-foreground border border-border/60">
                      {member.role}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                    {member.note}
                  </p>
                </div>

                {/* Bottom Border Accent */}
                <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                  <span>CHANGKEER FOUNDING TEAM</span>
                  <span className="text-primary font-bold">JAKARTA</span>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 4. Editorial Call To Action Banner */}
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
