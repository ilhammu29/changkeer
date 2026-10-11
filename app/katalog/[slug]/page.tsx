import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { BrewingGuideBox } from '@/components/products/BrewingGuideBox';
import { ProductCard } from '@/components/products/ProductCard';
import { getProductBySlug, getPublishedProducts } from '@/lib/data/products';
import { ArrowLeft, Check, Sparkles, Shield } from 'lucide-react';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = await getPublishedProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || product.status !== 'published') {
    return { title: 'Produk Tidak Ditemukan' };
  }

  return {
    title: product.seo_title || product.name,
    description: product.seo_description || product.description || undefined,
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || product.status !== 'published') {
    notFound();
  }

  const allProducts = await getPublishedProducts();
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 3);

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
    <div className="py-10 md:py-16">
      <Container size="wide">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/katalog"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>KEMBALI KE KATALOG</span>
          </Link>
        </div>

        {/* Product Hero Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start pb-20 border-b border-border">
          {/* Left Column: Product Visual Showcase */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square w-full rounded-lg bg-surface border border-border p-8 overflow-hidden shadow-sm flex items-center justify-center">
              <Image
                src={imageSrc}
                alt={product.name}
                fill
                className="object-contain p-8"
                priority
              />

              {product.is_featured && (
                <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-sm flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-accent" />
                  <span>RACIKAN PILIHAN</span>
                </div>
              )}
            </div>

            {/* Gallery Thumbnails if available */}
            {product.gallery && product.gallery.length > 1 && (
              <div className="flex gap-3">
                {product.gallery.map((img, i) => (
                  <div
                    key={i}
                    className="relative w-20 h-20 rounded-md border border-border bg-surface overflow-hidden p-2"
                  >
                    <Image
                      src={img}
                      alt={`${product.name} visual ${i + 1}`}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Information, Specs, Ingredients */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
                  {product.category?.name || 'RACIKAN HERBAL'}
                </span>
                <span className="text-border-strong">•</span>
                <span className="text-xs font-mono uppercase text-muted-foreground">
                  {product.weight_grams ? `NETTO ${product.weight_grams}G` : 'KEMASAN RESMI'}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-foreground leading-[1.05]">
                {product.name}
              </h1>

              {product.tagline && (
                <p className="text-base sm:text-lg text-muted-foreground font-medium">
                  {product.tagline}
                </p>
              )}
            </div>

            {/* Pricing Section */}
            <div className="p-6 rounded-md bg-surface border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                  HARGA RESMI
                </span>
                <span className="text-2xl sm:text-3xl font-black text-foreground">
                  {formattedPrice}
                </span>
              </div>

              <Link
                href="/hubungi-kami"
                className="inline-flex items-center justify-center text-xs font-bold tracking-widest uppercase bg-primary text-primary-foreground px-8 py-4 rounded-sm hover:bg-primary-hover transition-all text-center"
              >
                PESAN / HUBUNGI KAMI
              </Link>
            </div>

            {/* Description */}
            {product.description && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold tracking-wider uppercase text-foreground">
                  DESKRIPSI RACIKAN
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Ingredients */}
            {product.ingredients && product.ingredients.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-border">
                <h3 className="text-xs font-bold tracking-wider uppercase text-foreground">
                  KOMPOSISI ALAMI
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {product.ingredients.map((ing, i) => (
                    <li key={i} className="flex items-start gap-2 text-muted-foreground">
                      <Check className="w-3.5 h-3.5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="font-medium text-foreground">{ing}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Characteristics Box */}
            {product.characteristics && Object.keys(product.characteristics).length > 0 && (
              <div className="p-5 rounded-md bg-muted/60 border border-border space-y-3">
                <h4 className="text-[11px] font-bold tracking-wider uppercase text-foreground">
                  PROFIL SENSORI &amp; KARAKTERISTIK
                </h4>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  {Object.entries(product.characteristics).map(([key, val]) => (
                    <div key={key}>
                      <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                        {key}
                      </span>
                      <span className="font-semibold text-foreground">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Packaging Info */}
            {product.packaging_info && (
              <div className="text-xs text-muted-foreground flex items-start gap-2 pt-2">
                <Shield className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                <p>{product.packaging_info}</p>
              </div>
            )}
          </div>
        </div>

        {/* Brewing Guide Section */}
        {product.brewing_guide && (
          <div className="py-16 border-b border-border">
            <BrewingGuideBox guide={product.brewing_guide} />
          </div>
        )}

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="pt-16">
            <div className="mb-8">
              <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-muted-foreground block mb-1">
                EKSPLORASI LAINNYA
              </span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-foreground">
                RACIKAN TERKAIT
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
