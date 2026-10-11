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
import { ArrowLeft, ChevronRight } from 'lucide-react';

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
    <div className="py-8 sm:py-12 md:py-16 bg-background">
      <Container size="wide">
        {/* Navigation Breadcrumbs & Back Link */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-12">
          <Link
            href="/katalog"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>KEMBALI KE KATALOG</span>
          </Link>

          {/* Breadcrumb Trail */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground"
          >
            <Link href="/" className="hover:text-foreground transition-colors">
              BERANDA
            </Link>
            <ChevronRight className="w-3 h-3 text-border-strong" />
            <Link href="/katalog" className="hover:text-foreground transition-colors">
              KATALOG
            </Link>
            <ChevronRight className="w-3 h-3 text-border-strong" />
            <span className="text-foreground font-semibold truncate max-w-[200px]">
              {product.name}
            </span>
          </nav>
        </div>

        {/* Product Visual Showcase & Interactive Order Section */}
        <ProductDetailInteractive
          product={product}
          contactPhone={settings.contact_phone || '+62 812-3456-7890'}
        />

        {/* Brewing Guide Section */}
        {product.brewing_guide && (
          <div className="py-14 sm:py-18 border-b border-border">
            <BrewingGuideBox guide={product.brewing_guide} />
          </div>
        )}

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="pt-14 sm:pt-18">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
              <div className="space-y-1">
                <span className="text-[11px] font-mono font-bold tracking-[0.25em] uppercase text-accent block">
                  02 // EKSPLORASI BOTANI LAINNYA
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-foreground">
                  Racikan Sejenis
                </h2>
              </div>

              <Link
                href="/katalog"
                className="text-xs font-mono font-bold tracking-wider uppercase text-foreground hover:text-accent transition-colors self-start sm:self-auto border-b border-foreground pb-0.5"
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
