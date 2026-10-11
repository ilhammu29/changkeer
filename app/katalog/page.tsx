import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { CatalogView } from '@/components/products/CatalogView';
import { getPublishedProducts } from '@/lib/data/products';
import { getCategories } from '@/lib/data/categories';

export const metadata: Metadata = {
  title: 'Katalog Produk',
  description:
    'Eksplorasi seluruh varian racikan teh herbal CHANGKEER. Temukan perpaduan rasa jahe merah, serai, rosella, chamomile, dan daun kelor alami.',
};

export default async function KatalogPage() {
  const [products, categories] = await Promise.all([
    getPublishedProducts(),
    getCategories('product'),
  ]);

  return (
    <div className="pb-16 sm:pb-24">
      {/* Section 1: Hero Banner with Background Image */}
      <section className="relative w-full py-16 sm:py-20 md:py-24 bg-neutral-950 overflow-hidden border-b border-border mb-12 sm:mb-16">
        <Image
          src="/images/assets/banner2.jpg"
          alt="Katalog CHANGKEER"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/92 via-black/75 to-black/40 pointer-events-none" />

        <Container size="wide" className="relative z-10">
          <div className="max-w-2xl space-y-3">
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] uppercase text-purple-300 block">
              KOLEKSI RESMI
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white leading-tight">
              KATALOG TEH HERBAL
            </h1>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed font-normal">
              Racikan botani murni tanpa kompromi. Pilih varian yang paling sesuai dengan ritme hari dan kebutuhan relaksasi Anda.
            </p>
          </div>
        </Container>
      </section>

      <Container size="wide">
        {/* Catalog Interactive View */}
        <CatalogView products={products} categories={categories} />
      </Container>
    </div>
  );
}
