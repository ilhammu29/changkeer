import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { BrewingGuideBox } from '@/components/products/BrewingGuideBox';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductDetailInteractive } from '@/components/products/ProductDetailInteractive';
import { getProductBySlug, getPublishedProducts } from '@/lib/data/products';
import { getSiteSettings } from '@/lib/data/settings';

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
    title: product.seo_title || `${product.name} | CHANGKEER Herbal Tea`,
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

  const settings = await getSiteSettings();
  const allProducts = await getPublishedProducts();
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="pt-4 sm:pt-6 pb-16 sm:pb-24 bg-white text-foreground">
      <Container size="wide">
        {/* Product Visual Showcase & Interactive Order Section */}
        <ProductDetailInteractive
          product={product}
          contactPhone={settings.contact_phone || '+62 812-3456-7890'}
        />

        {/* Brewing Guide Section */}
        {product.brewing_guide && (
          <div className="py-14 sm:py-18 border-b border-border/80">
            <BrewingGuideBox guide={product.brewing_guide} />
          </div>
        )}

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="pt-14 sm:pt-18">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
              <div className="space-y-1">
                <span className="text-[11px] font-mono font-bold tracking-[0.25em] uppercase text-accent block">
                  EKSPLORASI BOTANI LAINNYA
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold uppercase tracking-tight text-foreground">
                  Racikan Sejenis
                </h2>
              </div>

              <Link
                href="/katalog"
                className="text-xs font-mono font-bold tracking-wider uppercase text-foreground hover:text-primary transition-colors self-start sm:self-auto border-b border-foreground pb-0.5"
              >
                LIHAT SEMUA KATALOG &rarr;
              </Link>
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
