import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { BrewingGuideBox } from '@/components/products/BrewingGuideBox';
import { ClientLayout } from '@/components/client/ClientLayout';
import { ClientProductDetailInteractive } from '@/components/order/ClientProductDetailInteractive';
import { getProductBySlug, getPublishedProducts } from '@/lib/data/products';
import { getSiteSettings } from '@/lib/data/settings';
import { ArrowLeft, Sparkles, Plus } from 'lucide-react';

interface ClientProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ClientProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || product.status !== 'published') {
    return { title: 'Produk Tidak Ditemukan | CHANGKEER' };
  }

  return {
    title: `${product.name} | Pesan Khusus Atelier CHANGKEER`,
    description: product.seo_description || product.description || undefined,
  };
}

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export default async function ClientProductDetailPage({
  params,
}: ClientProductDetailPageProps) {
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
    <ClientLayout 
      pageTitle={product.name} 
      subtitle="Detail Racikan Botani &amp; Kustomisasi Saji"
    >
      <main className="flex-1 pt-3 sm:pt-4 pb-12 sm:pb-16 font-sans">
        <Container size="wide">
          
          {/* Breadcrumb Navigation - Compact & Lifted */}
          <div className="flex items-center gap-2 text-xs font-sans font-semibold uppercase tracking-wider text-neutral-400 mb-3 sm:mb-4">
            <Link href="/order" className="hover:text-neutral-900 flex items-center gap-1.5 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Katalog E-Commerce</span>
            </Link>
            <span>/</span>
            <span className="text-neutral-900 truncate max-w-[240px] font-bold">{product.name}</span>
          </div>

          {/* Interactive Client Product Showcase (Rich 3-Column Layout Matching Landing Page) */}
          <ClientProductDetailInteractive
            product={product}
            contactPhone={settings.contact_phone || '+62 812-3456-7890'}
          />

          {/* Brewing Guide Section */}
          {product.brewing_guide && (
            <div className="py-14 sm:py-18 border-t border-b border-neutral-200/80 my-12">
              <BrewingGuideBox guide={product.brewing_guide} />
            </div>
          )}

          {/* Related Products Section (Clean, No Badges, No Dots) */}
          {relatedProducts.length > 0 && (
            <div className="pt-6 sm:pt-10">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block">
                    Rekomendasi Barista
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
                    Seduhan Serupa
                  </h2>
                </div>

                <Link
                  href="/order"
                  className="text-xs font-bold uppercase tracking-wider text-neutral-900 hover:underline"
                >
                  Lihat Semua Menu &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProducts.map((rel) => {
                  const relImage = rel.featured_image || (rel.gallery && rel.gallery[0]) || '/images/products/start-of-spring.jpg';
                  return (
                    <Link
                      key={rel.id}
                      href={`/order/${rel.slug}`}
                      className="group bg-white border border-neutral-200/50 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                    >
                      <div className="relative aspect-[4/3] w-full bg-neutral-50 overflow-hidden rounded-t-xl">
                        <Image
                          src={relImage}
                          alt={rel.name}
                          fill
                          sizes="(max-width: 640px) 100vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
                            {rel.category?.name || 'Herbal Blend'}
                          </span>
                          <h3 className="text-base font-bold text-neutral-900 group-hover:text-neutral-700 transition-colors line-clamp-1 leading-snug">
                            {rel.name}
                          </h3>
                          <p className="text-xs text-neutral-500 mt-1 line-clamp-1 leading-relaxed font-normal">
                            {rel.tagline || rel.description}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
                          <span className="text-base font-bold text-neutral-900">
                            {formatRupiah(rel.price || 28000)}
                          </span>
                          <span className="px-3 py-1.5 rounded-lg bg-neutral-100 group-hover:bg-neutral-200 text-neutral-900 text-xs font-semibold tracking-wide transition-colors">
                            Pesan
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

        </Container>
      </main>

      {/* Footnote */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center border-t border-neutral-200/60 mt-auto">
        <p className="text-[11px] font-sans text-neutral-400 tracking-wider uppercase font-medium">
          CHANGKEER BOTANICAL ATELIER — UNSWEETENED BY DEFAULT — PLASTIC-FREE
        </p>
      </footer>
    </ClientLayout>
  );
}
