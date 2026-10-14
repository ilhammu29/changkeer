'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Search, 
  ShoppingBag, 
  Plus, 
  CheckCircle,
  SlidersHorizontal,
  ArrowRight,
  Check
} from 'lucide-react';
import { Product, OrderType, CustomerProfile } from '@/types';
import { useCart } from '@/lib/context/CartContext';
import { ClientLayout } from '@/components/client/ClientLayout';
import { CustomizationModal } from '@/components/order/CustomizationModal';

interface OrderCatalogClientProps {
  initialProducts: Product[];
}

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function OrderCatalogClient({ initialProducts }: OrderCatalogClientProps) {
  const searchParams = useSearchParams();
  const { 
    setOrderType, 
    setTableNumber, 
    setIsCartOpen, 
    addToCart
  } = useCart();

  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);
  const [detectedTableFromUrl, setDetectedTableFromUrl] = useState<string | null>(null);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  // Check customer session
  useEffect(() => {
    try {
      const match = document.cookie.match(/changkeer_customer_session=([^;]+)/);
      if (match) {
        const parsed = JSON.parse(decodeURIComponent(match[1]));
        if (parsed?.email) {
          setCustomer(parsed);
          return;
        }
      }
    } catch {}

    try {
      const stored = localStorage.getItem('changkeer_customer_session');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.email) {
          setCustomer(parsed);
        }
      }
    } catch {}
  }, []);

  // Check URL table param e.g. /order?table=03 or /order?table=Meja 03
  useEffect(() => {
    const tableParam = searchParams.get('table');
    if (tableParam) {
      const cleanTable = tableParam.toLowerCase().startsWith('meja') 
        ? tableParam 
        : `Meja ${tableParam.padStart(2, '0')}`;
      
      setOrderType('dine_in');
      setTableNumber(cleanTable);
      setDetectedTableFromUrl(cleanTable);
    }
  }, [searchParams, setOrderType, setTableNumber]);

  // Extract unique categories
  const categories = useMemo(() => [
    { slug: 'all', name: 'Semua Produk' },
    ...Array.from(
      new Map(
        initialProducts
          .filter(p => p.category)
          .map(p => [p.category!.slug, { slug: p.category!.slug, name: p.category!.name }])
      ).values()
    ),
  ], [initialProducts]);

  // Filter & sort products
  const filteredProducts = useMemo(() => {
    return initialProducts.filter(p => {
      const matchesSearch = 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.tagline && p.tagline.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.ingredients && p.ingredients.some(i => i.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchesCategory = 
        selectedCategory === 'all' || 
        p.category_id === selectedCategory || 
        p.category?.slug === selectedCategory;

      return matchesSearch && matchesCategory;
    }).sort((a, b) => {
      if (sortOrder === 'price-asc') return (a.price || 0) - (b.price || 0);
      if (sortOrder === 'price-desc') return (b.price || 0) - (a.price || 0);
      if (a.is_featured && !b.is_featured) return -1;
      if (!a.is_featured && b.is_featured) return 1;
      return 0;
    });
  }, [initialProducts, searchQuery, selectedCategory, sortOrder]);

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart({
      product_id: product.id,
      product_name: product.name,
      product_slug: product.slug,
      product_image: product.featured_image || null,
      serving_size: 'regular',
      unit_price: product.price || 28000,
      quantity: 1,
      temperature: 'hot',
      sweetness_level: '0%',
      ice_level: 'none',
      selected_addons: [],
      item_notes: '',
    });

    setAddedProductId(product.id);
    setTimeout(() => {
      setAddedProductId(null);
      setIsCartOpen(true);
    }, 350);
  };

  return (
    <ClientLayout 
      pageTitle="Katalog Seduhan Khusus" 
      subtitle="Eksplorasi Racikan Teh dan Daun Botani Asli"
    >
      {/* Table Welcome Banner if QR Scanned */}
      {detectedTableFromUrl && (
        <div className="bg-emerald-50 border-b border-emerald-200 py-2.5 px-4 text-center sticky top-16 z-20 backdrop-blur-md">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-emerald-800 font-medium">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Terhubung ke <strong>{detectedTableFromUrl}</strong>. Pesanan akan disajikan langsung ke meja Anda.</span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-5 sm:py-8 flex-1 font-sans">
        
        {/* Box Pertama: Section 1 dengan Background Banner Bebas */}
        <div className="relative mb-6 sm:mb-8 rounded-xl sm:rounded-2xl overflow-hidden min-h-[180px] sm:min-h-[220px] flex flex-col justify-end p-5 sm:p-8 shadow-md">
          <Image
            src="/images/assets/banner2.jpg"
            alt="Changkeer Botanical Banner"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/50 to-neutral-950/20" />
          
          <div className="relative z-10 max-w-2xl space-y-1.5 sm:space-y-2 text-white">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-amber-300 block">
              Changkeer Atelier E-Commerce
            </span>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Selamat Datang, {customer?.full_name ? customer.full_name.split(' ')[0] : 'Pencinta Teh'}
            </h2>

            <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-normal pt-0.5 max-w-xl line-clamp-3 sm:line-clamp-none">
              Pilih seduhan herbal alami untuk dinikmati langsung di bar cafe atau dipesan secara online. Setiap daun diseduh pada temperatur ideal untuk mengekstrak antioksidan murni.
            </p>
          </div>
        </div>

        {/* Filters, Search & Categories Row */}
        <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 items-stretch sm:items-center justify-between">
            
            {/* Search Input with Boundary Shadow */}
            <div className="relative flex-1 max-w-md w-full">
              <input
                type="text"
                placeholder="Cari seduhan, bahan herbal, atau manfaat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-neutral-200/80 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 shadow-sm focus:shadow-md transition-all font-medium"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* Sorting Dropdown with Boundary Shadow */}
            <div className="flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto">
              <span className="text-[11px] font-semibold text-neutral-400 sm:hidden">Urutkan:</span>
              <div className="flex items-center gap-2 flex-1 sm:flex-none justify-end">
                <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as any)}
                  className="bg-white border border-neutral-200/80 rounded-xl px-3 py-2 text-xs font-semibold text-neutral-800 focus:outline-none focus:border-neutral-900 shadow-sm cursor-pointer w-full sm:w-auto"
                >
                  <option value="featured">Rekomendasi Barista</option>
                  <option value="price-asc">Harga Terendah</option>
                  <option value="price-desc">Harga Tertinggi</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Filter Pills (Fluid Horizontal Scroll with Edge-to-Edge bleed on mobile) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
            {categories.map((cat) => (
              <button
                key={cat.slug}
                type="button"
                onClick={() => setSelectedCategory(cat.slug)}
                className={`text-xs font-semibold px-4 py-2 rounded-lg whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  selectedCategory === cat.slug
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200/80 shadow-sm hover:shadow-md'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid with Boundary Shadow */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white border border-neutral-100 rounded-xl p-12 text-center space-y-3 shadow-md">
            <h3 className="font-bold text-base text-neutral-900">Seduhan Tidak Ditemukan</h3>
            <p className="text-xs text-neutral-500">
              Tidak ada produk yang cocok dengan kata kunci &ldquo;{searchQuery}&rdquo;.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-4 px-5 py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors cursor-pointer shadow-sm"
            >
              Reset Pencarian
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map(product => {
              const displayPrice = product.price || 28000;
              const imageSrc = product.featured_image || (product.gallery && product.gallery[0]) || '/images/assets/jasmine_tea_produk.jpg';
              const isAdded = addedProductId === product.id;

              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-xl overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-md hover:shadow-xl border border-neutral-200/50"
                >
                  <Link href={`/order/${product.slug}`} className="block">
                    {/* Clean Image Container */}
                    <div className="relative aspect-[4/3] w-full bg-neutral-50 overflow-hidden rounded-t-xl">
                      <Image
                        src={imageSrc}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    </div>

                    {/* Product Typography & Content (No Badges, No Dots) */}
                    <div className="p-4 pb-2">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
                        {product.category?.name || 'Herbal Blend'}
                      </span>
                      <h3 className="text-base font-bold text-neutral-900 group-hover:text-neutral-700 transition-colors line-clamp-1 leading-snug">
                        {product.name}
                      </h3>
                      <p className="text-xs text-neutral-500 mt-1 line-clamp-1 leading-relaxed font-normal">
                        {product.tagline || product.description}
                      </p>
                    </div>
                  </Link>

                  {/* Card Bottom: Clean Price & Neat Action Button */}
                  <div className="p-4 pt-3 border-t border-neutral-100 bg-white flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-semibold text-neutral-400 block leading-tight">
                        Porsi Saji
                      </span>
                      <span className="text-base font-bold text-neutral-900">
                        {formatRupiah(displayPrice)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleQuickAdd(product, e)}
                      className={`px-3.5 sm:px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer shadow-xs active:scale-95 flex items-center gap-1.5 shrink-0 ${
                        isAdded
                          ? 'bg-emerald-600 text-white'
                          : 'bg-neutral-900 hover:bg-neutral-800 text-white'
                      }`}
                      title={`Tambah ${product.name} ke Keranjang`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Ditambahkan</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5 stroke-[2]" />
                          <span>Tambah</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* Footnote */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center border-t border-neutral-200 mt-auto">
        <p className="text-xs font-medium text-neutral-400">
          CHANGKEER Botanical Atelier — Unsweetened By Default — Plastic-Free
        </p>
      </footer>

      {/* Customization Modal */}
      {customizingProduct && (
        <CustomizationModal
          product={customizingProduct}
          isOpen={Boolean(customizingProduct)}
          onClose={() => setCustomizingProduct(null)}
        />
      )}
    </ClientLayout>
  );
}
