import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(product.price);

  const imageSrc =
    product.featured_image ||
    (product.gallery && product.gallery[0]) ||
    '/images/products/changkeer-lemongrass-ginger.jpg';

  return (
    <article className="group flex flex-col bg-surface border border-border rounded-md overflow-hidden transition-all duration-300 hover:border-border-strong hover:shadow-lg">
      {/* Image Container with Hover Scale */}
      <Link
        href={`/katalog/${product.slug}`}
        className="relative aspect-square w-full bg-muted overflow-hidden flex items-center justify-center p-6"
      >
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-surface/90 backdrop-blur-sm p-2 rounded-full border border-border text-foreground">
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </Link>

      {/* Info Content */}
      <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground block">
            {product.category?.name || 'RACIKAN HERBAL'}
          </span>

          <h3 className="font-bold text-base text-foreground tracking-tight group-hover:text-primary transition-colors line-clamp-1">
            <Link href={`/katalog/${product.slug}`}>
              {product.name}
            </Link>
          </h3>

          {product.tagline && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {product.tagline}
            </p>
          )}
        </div>

        {/* Footer Meta & Price */}
        <div className="pt-3 border-t border-border flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">
              HARGA RESMI
            </span>
            <span className="font-extrabold text-sm sm:text-base text-foreground">
              {formattedPrice}
            </span>
          </div>

          <Link
            href={`/katalog/${product.slug}`}
            className="text-xs font-bold tracking-wider uppercase text-foreground group-hover:text-primary flex items-center gap-1 underline underline-offset-4"
          >
            <span>DETAIL</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
