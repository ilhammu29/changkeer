import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { ProductCard } from '@/components/products/ProductCard';
import { Product } from '@/types';
import { ArrowUpRight } from 'lucide-react';

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const displayProducts = products.slice(0, 4);

  return (
    <section className="py-20 bg-background border-b border-border">
      <Container size="wide">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold tracking-[0.25em] uppercase text-muted-foreground mb-3">
              <span>02 // KURASI TERBAIK</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-foreground">
              RACIKAN UNGGULAN
            </h2>
          </div>

          <Link
            href="/katalog"
            className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-foreground hover:text-primary transition-colors border-b-2 border-foreground pb-1 self-start md:self-auto"
          >
            <span>LIHAT SELURUH KATALOG</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </section>
  );
}
