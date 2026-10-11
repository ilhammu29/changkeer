import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { CatalogView } from '@/components/products/CatalogView';
import { SeasonalWheelExplorer } from '@/components/products/SeasonalWheelExplorer';
import { getPublishedProducts } from '@/lib/data/products';
import { getCategories } from '@/lib/data/categories';
import {
  SOLAR_TERM_BLENDS,
  DRIED_FRUITS,
  DRIED_FLOWERS,
  SWEETENERS,
  HEALTH_CAUTIONS,
} from '@/lib/data/solarTerms';
import { Sparkles, Calendar, Coffee, AlertTriangle, Leaf, Flame } from 'lucide-react';

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
          src="/images/assets/banner2.jpg"
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
      <section className="my-16 sm:my-20">
        <Container size="wide">
          <div className="mb-8 space-y-1.5">
            <span className="text-[10px] font-mono font-bold tracking-[0.25em] uppercase text-primary block">
              SIGNATURE GRAB-AND-GO
            </span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-foreground">
              Always Brewing &amp; Ready in &lt; 3 Minutes
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Our core loose-leaf infusions crafted for effortless daily ritual.
            </p>
          </div>

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

          {/* 24 Solar Terms Table */}
          <div className="bg-white border border-border/80 rounded-2xl overflow-hidden shadow-md card-boundary">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border bg-neutral-100/70 text-foreground font-mono text-[11px] uppercase tracking-wider">
                    <th className="py-3.5 px-4 sm:px-6 font-bold">Solar Term</th>
                    <th className="py-3.5 px-3 sm:px-4 font-bold">Starts</th>
                    <th className="py-3.5 px-4 sm:px-6 font-bold">Seasonal Blend</th>
                    <th className="py-3.5 px-3 sm:px-4 font-bold text-right">Hot (350ml)</th>
                    <th className="py-3.5 px-4 sm:px-6 font-bold text-right">Iced (450ml)</th>
                    <th className="py-3.5 px-3 sm:px-4 font-bold text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {SOLAR_TERM_BLENDS.map((item) => (
                    <tr
                      key={item.term}
                      className={`transition-colors ${
                        item.isBrewingNow
                          ? 'bg-primary/5 hover:bg-primary/10 font-medium'
                          : 'hover:bg-neutral-50/70'
                      }`}
                    >
                      <td className="py-3.5 px-4 sm:px-6">
                        <span className="font-bold text-foreground block">
                          {item.term}
                        </span>
                        <span className="text-[11px] text-muted-foreground font-sans">
                          {item.termChinese}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 sm:px-4 font-mono text-muted-foreground text-xs whitespace-nowrap">
                        {item.starts}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6">
                        <span className="font-bold text-foreground">
                          {item.blend}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 sm:px-4 font-mono font-semibold text-right text-foreground">
                        {item.hotPrice}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 font-mono font-semibold text-right text-foreground">
                        {item.icedPrice}
                      </td>
                      <td className="py-3.5 px-3 sm:px-4 text-center whitespace-nowrap">
                        {item.isBrewingNow ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary text-primary-foreground font-bold shadow-2xs">
                            <Flame className="w-3 h-3 text-amber-300" />
                            Brewing Now
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                            Seasonal
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-neutral-50 border-t border-border/80 flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block" />
                <strong className="text-foreground font-semibold">Highlighted:</strong> blend brewing now at the brew bar.
              </span>
              <span className="font-mono text-[11px] hidden sm:inline">
                All blends 100% caffeine-free
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* 5. Add-ons & Customizations Atelier */}
      <section className="mb-12">
        <Container size="wide">
          <div className="max-w-2xl mb-12 space-y-2">
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] uppercase text-primary block">
              CUSTOMIZE YOUR CUP
            </span>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-foreground">
              Botanical Add-ons
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Enhance aroma, therapeutic depth, and natural sweetness with wholesome sun-dried botanicals.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Dried Fruits Card */}
            <div className="bg-white border border-border/80 rounded-2xl p-6 sm:p-7 shadow-md card-boundary space-y-5">
              <div className="border-b border-border/70 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold block">
                    CATEGORY 01
                  </span>
                  <h3 className="text-lg font-black uppercase tracking-tight text-foreground">
                    Dried Fruits
                  </h3>
                </div>
                <Leaf className="w-5 h-5 text-primary" />
              </div>

              <div className="divide-y divide-border/60 text-xs sm:text-sm">
                {DRIED_FRUITS.map((item) => (
                  <div key={item.name} className="py-2.5 flex items-center justify-between gap-3">
                    <div>
                      <span className="font-bold text-foreground block">{item.name}</span>
                      <span className="text-[11px] text-muted-foreground block">{item.noteOrTaste}</span>
                    </div>
                    <span className="font-mono font-bold text-primary shrink-0 text-xs">
                      {item.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dried Flowers Card */}
            <div className="bg-white border border-border/80 rounded-2xl p-6 sm:p-7 shadow-md card-boundary space-y-5">
              <div className="border-b border-border/70 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold block">
                    CATEGORY 02
                  </span>
                  <h3 className="text-lg font-black uppercase tracking-tight text-foreground">
                    Dried Flowers
                  </h3>
                </div>
                <Sparkles className="w-5 h-5 text-primary" />
              </div>

              <div className="divide-y divide-border/60 text-xs sm:text-sm">
                {DRIED_FLOWERS.map((item) => (
                  <div key={item.name} className="py-2.5 flex items-center justify-between gap-3">
                    <div>
                      <span className="font-bold text-foreground block">{item.name}</span>
                      <span className="text-[11px] text-muted-foreground block">{item.noteOrTaste}</span>
                    </div>
                    <span className="font-mono font-bold text-primary shrink-0 text-xs">
                      {item.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sweeteners Card */}
            <div className="bg-white border border-border/80 rounded-2xl p-6 sm:p-7 shadow-md card-boundary space-y-5 flex flex-col justify-between">
              <div className="space-y-5">
                <div className="border-b border-border/70 pb-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold block">
                      CATEGORY 03
                    </span>
                    <h3 className="text-lg font-black uppercase tracking-tight text-foreground">
                      Sweetener
                    </h3>
                  </div>
                  <Coffee className="w-5 h-5 text-primary" />
                </div>

                <div className="divide-y divide-border/60 text-xs sm:text-sm">
                  {SWEETENERS.map((item) => (
                    <div key={item.name} className="py-2.5 flex items-center justify-between gap-3">
                      <div>
                        <span className="font-bold text-foreground block">{item.name}</span>
                        <span className="text-[11px] text-muted-foreground block">{item.noteOrTaste}</span>
                      </div>
                      <span className="font-mono font-bold text-primary shrink-0 text-xs">
                        {item.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-100/80 border border-border/80 text-[11px] text-foreground space-y-1 mt-4">
                <span className="font-mono font-bold uppercase tracking-wider block text-primary">
                  SWEETNESS LEVEL FOR SWEETENED CUPS:
                </span>
                <p className="text-muted-foreground leading-relaxed">
                  Choose <strong className="text-foreground">less sweet</strong> or <strong className="text-foreground">normal</strong>. Strictly no refined white sugar on the menu.
                </p>
              </div>
            </div>
          </div>

          {/* Health & Safety Cautions Banner */}
          <div className="mt-8 p-6 sm:p-7 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs sm:text-sm text-amber-950 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-amber-800 font-mono font-bold uppercase tracking-wider text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              <span>HEALTH &amp; ALLERGY CAUTIONS</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-amber-900/90 leading-relaxed">
              {HEALTH_CAUTIONS.map((caution, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{caution}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
