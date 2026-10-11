import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Sparkles } from 'lucide-react';
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
    '/images/assets/jasmine_tea_produk.jpg';

  return (
    <article className="h-full">
      <Link
        href={`/katalog/${product.slug}`}
        className="block group relative aspect-[3/4] sm:aspect-[4/5] rounded-2xl overflow-hidden bg-white border border-border/70 shadow-md hover:shadow-2xl transition-all duration-500 font-sans card-boundary"
      >
        {/* Full Product Photo */}
        <Image
          src={imageSrc}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-106"
        />

        {/* Subtle Gradient Scrim at Bottom for Minimal Text */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none transition-opacity duration-300" />

        {/* Top Badges */}
        {product.is_featured && (
          <div className="absolute top-3.5 left-3.5 bg-black/40 backdrop-blur-md border border-white/20 text-white text-[9px] font-mono tracking-widest uppercase px-2.5 py-1 rounded-full flex items-center gap-1 font-semibold">
            <Sparkles className="w-2.5 h-2.5 text-amber-300" />
            <span>FEATURED</span>
          </div>
        )}

        {/* Top Right Quick Action Icon */}
        <div className="absolute top-3.5 right-3.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs text-black flex items-center justify-center shadow-md">
          <ArrowUpRight className="w-4 h-4" />
        </div>

        {/* Minimalist Card Text at Bottom */}
        <div className="absolute bottom-0 inset-x-0 p-5 flex flex-col justify-end space-y-1 text-white">
          <span className="text-[10px] font-mono tracking-[0.22em] uppercase text-white/70 block">
            {product.category?.name || 'HERBAL BLEND'}
          </span>

          <h3 className="font-sans font-black text-sm sm:text-base uppercase tracking-wide text-white group-hover:text-amber-200 transition-colors line-clamp-1 leading-snug">
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
    </article>
  );
}
