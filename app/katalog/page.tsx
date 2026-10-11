import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { CatalogView } from '@/components/products/CatalogView';
import { SeasonalWheelExplorer } from '@/components/products/SeasonalWheelExplorer';
import { SeasonalBlendsTable } from '@/components/products/SeasonalBlendsTable';
import { BotanicalAddonsInteractive } from '@/components/products/BotanicalAddonsInteractive';
import { getPublishedProducts } from '@/lib/data/products';
import { getCategories } from '@/lib/data/categories';
import {
  SOLAR_TERM_BLENDS,
  HEALTH_CAUTIONS,
} from '@/lib/data/solarTerms';
import { Calendar, AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blends & Prices',
  description:
    'Changkeer caffeine-free herbal infusions following the 24 solar terms. Hot cup 350 ml · Iced cup 450 ml. Freshly brewed in under three minutes.',
};

export default async function BlendsAndPricesPage() {
  const [products, categories] = await Promise.all([
    getPublishedProducts(),
    getCategories('product'),
  ]);

  return (
    <div className="pb-20 sm:pb-28 bg-white font-sans text-foreground">
      {/* 1. Hero Banner with Background Image */}
      <section className="relative w-full py-18 sm:py-24 md:py-28 bg-neutral-950 overflow-hidden border-b border-border">
        <Image
          src="/images/banners/blends_prices_banner.jpg"
          alt="Changkeer Blends & Prices"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/92 via-black/75 to-black/40 pointer-events-none" />

        <Container size="wide" className="relative z-10">
          <div className="max-w-3xl space-y-3.5">
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] uppercase text-purple-300 block">
              SEASONAL BOTANICAL CALENDAR
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-black uppercase tracking-tight text-white leading-tight">
              Blends &amp; Prices
            </h1>
            <p className="text-sm sm:text-base text-white/85 leading-relaxed font-normal max-w-2xl">
              All blends are caffeine-free herbal infusions. Hot cup 350 ml · Iced cup 450 ml.
              Prices in Rupiah; every cup is unsweetened by default.
            </p>
          </div>
        </Container>
      </section>

      {/* 2. Interactive 24 Solar Terms Seasonal Wheel Explorer & Carousel */}
      <SeasonalWheelExplorer />

      {/* 3. Interactive Signature Grab-and-Go Catalog */}
      <section className="my-12 sm:my-16">
        <Container size="wide">
          <CatalogView products={products} categories={categories} />
        </Container>
      </section>

      {/* 4. The 24 Solar Terms Seasonal Menu */}
      <section className="py-16 sm:py-20 border-t border-b border-border/80 bg-neutral-50/60 mb-20 sm:mb-24">
        <Container size="wide">
          <div className="max-w-3xl space-y-3 mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-mono font-bold uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5" />
              <span>THE 24 SOLAR TERMS CALENDAR</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-foreground">
              A New Blend Every Two Weeks
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-foreground/80 leading-relaxed font-normal pt-1">
              <p>
                The traditional Chinese year is divided into 24 solar terms of about 15 days each.
                Changkeer serves one blend per solar term, so a new blend arrives roughly every two weeks.
                Start dates are approximate and can shift by one day from year to year.
              </p>
              <p>
                Jakarta has no frost or snow, so each blend is matched to local weather: warming ginger,
                dates and spice through the rainy months (around Oct–Mar), cooling flowers and citrus in the dry heat (around Apr–Sep).
              </p>
            </div>
          </div>

          {/* 24 Solar Terms Table with Category Tabs & Symbols */}
          <SeasonalBlendsTable blends={SOLAR_TERM_BLENDS} />
        </Container>
      </section>

      {/* 5. Add-ons & Customizations Atelier */}
      <section className="mb-16 sm:mb-20">
        <Container size="wide">
          <div className="max-w-2xl mb-10 sm:mb-14 space-y-2.5">
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] uppercase text-primary block">
              CUSTOMIZE YOUR CUP · THE BOTANICAL ATELIER
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-foreground">
              Botanical Add-ons
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-normal">
              Enhance aroma, therapeutic depth, and natural sweetness with wholesome sun-dried botanicals and unrefined sweeteners.
            </p>
          </div>

          {/* 360 Interactive Botanical Add-ons with Connected Callout Box */}
          <BotanicalAddonsInteractive />

          {/* Health & Safety Cautions Banner (Luxury Redesign) */}
          <div className="mt-10 sm:mt-12 p-7 sm:p-8 rounded-3xl bg-amber-50/80 border border-amber-200/90 shadow-xs relative overflow-hidden">
            <div className="flex items-center gap-2.5 text-amber-900 font-mono font-bold uppercase tracking-wider text-xs mb-4">
              <div className="w-7 h-7 rounded-full bg-amber-200/70 text-amber-800 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-amber-800" />
              </div>
              <span>HEALTH &amp; ALLERGY CAUTIONS</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-amber-950 leading-relaxed">
              {HEALTH_CAUTIONS.map((caution, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-2xl bg-white/80 border border-amber-200/70 shadow-2xs flex items-start gap-2.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                  <span className="font-medium">{caution}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
