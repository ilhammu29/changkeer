import React from 'react';
import type { Metadata } from 'next';
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
    <div className="py-12 md:py-20">
      <Container size="wide">
        {/* Page Header */}
        <div className="mb-12 pb-8 border-b border-border">
          <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-accent block mb-2">
            KOLEKSI RESMI
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-foreground">
            KATALOG TEH HERBAL
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-2xl">
            Racikan botani murni tanpa kompromi. Pilih varian yang paling sesuai dengan ritme hari dan kebutuhan relaksasi Anda.
          </p>
        </div>

        {/* Catalog Interactive View */}
        <CatalogView products={products} categories={categories} />
      </Container>
    </div>
  );
}
