import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { ProductShowcase } from '@/components/products/ProductShowcase';
import { BrandPillarsEditorial } from '@/components/products/BrandPillarsEditorial';
import { BrewingRitualCarousel } from '@/components/products/BrewingRitualCarousel';
import { Reveal } from '@/components/ui/Reveal';
import { getPublishedProducts } from '@/lib/data/products';
import { ArrowUpRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Product',
  description:
    'Changkeer functional loose-leaf herbal teas. 100% microplastic-free packaging, zero-senna gut safety, and fast-brew rituals in under three minutes.',
};

export default async function TentangProdukPage() {
  const products = await getPublishedProducts();

  return (
    <div className="w-full bg-[#0c0b11]">
      {/* 1. Main Minimalist Product Showcase (Title Only on Left, Enlarged Product in Center, Price Only on Right) */}
      <ProductShowcase />

      {/* 2. Brand Pillars (Editorial Manifesto Layout, No Cardboxes, No Generic AI Slop) */}
      <BrandPillarsEditorial />

      {/* 3. Universal Brewing Ritual (Interactive 360-Degree Circular Revolving Carousel) */}
      <BrewingRitualCarousel />

      {/* 4. Catalog Collection (Cards match Homepage FeaturedProducts style exactly) */}
      <section className="py-24 sm:py-28 lg:py-32 bg-background text-foreground border-t border-border/40">
        <Container size="wide">
          <Reveal>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 gap-6">
              <div className="space-y-2">
                <span className="text-[11px] font-mono font-bold tracking-[0.25em] uppercase text-accent block">
                  COLLECTION OVERVIEW
                </span>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-foreground">
                  Changkeer Signature Herbal Blends
                </h2>
              </div>
              <Link
                href="/katalog"
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-foreground hover:text-primary transition-colors border-b border-foreground pb-0.5 self-start sm:self-auto"
              >
                <span>Open Blends &amp; Prices</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Reveal>

          {/* Cards matching the Homepage FeaturedProducts design exactly */}
          <Reveal delayMs={100}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {products.slice(0, 3).map((product) => {
                const formattedPrice = new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  maximumFractionDigits: 0,
                }).format(product.price);

                const imageSrc =
                  product.featured_image ||
                  (product.gallery && product.gallery[0]) ||
                  '/images/products/start-of-spring.jpg';

                return (
                  <div key={product.id} className="w-full">
                    <Link
                      href={`/katalog/${product.slug}`}
                      className="block group relative aspect-[3/4] sm:aspect-[4/5] rounded-2xl overflow-hidden bg-muted border border-border/60 shadow-xs hover:shadow-xl transition-all duration-500"
                    >
                      {/* Full Product Photo */}
                      <Image
                        src={imageSrc}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-106"
                      />

                      {/* Subtle Gradient Scrim at Bottom */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none transition-opacity duration-300" />

                      {/* Top Right Quick Action Icon */}
                      <div className="absolute top-3.5 right-3.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs text-black flex items-center justify-center shadow-md">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>

                      {/* Minimalist Card Text at Bottom */}
                      <div className="absolute bottom-0 inset-x-0 p-5 flex flex-col justify-end space-y-1 text-white">
                        <span className="text-[10px] font-mono tracking-[0.22em] uppercase text-white/70 block">
                          {product.category?.name || 'HERBAL BLEND'}
                        </span>

                        <h3 className="font-extrabold text-sm sm:text-base uppercase tracking-wide text-white group-hover:text-amber-200 transition-colors line-clamp-1 leading-snug">
                          {product.name}
                        </h3>

                        <div className="pt-1 flex items-center justify-between">
                          <span className="text-xs sm:text-sm font-semibold text-white/95 tracking-wide">
                            {formattedPrice}
                          </span>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-white/60 group-hover:text-white transition-colors">
                            View Details &rarr;
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </Container>
      </section>
    </div>
  );
}
