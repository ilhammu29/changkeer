'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Search, 
  ShoppingBag, 
  Plus, 
  CheckCircle, 
  Check, 
  X, 
  Eye, 
  ChevronLeft, 
  ChevronRight,
  ArrowRight,
  Sparkles,
  Flame,
  Award
} from 'lucide-react';
import { Product, OrderType, CustomerProfile } from '@/types';
import { useCart } from '@/lib/context/CartContext';
import { ClientLayout } from '@/components/client/ClientLayout';
import { CustomizationModal } from '@/components/order/CustomizationModal';
import { safeParseCustomerSession } from '@/lib/auth/session-helpers';
import { SOLAR_TERM_BLENDS } from '@/lib/data/solarTerms';

interface OrderCatalogClientProps {
  initialProducts: Product[];
}

function toKebab(s: string) {
  return s.replace(/'s/g, 's').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

// Mini / Lite Carousel Signature Seasonal Products (All 24 Solar Terms with Transparent BG)
const MINI_SHOWCASE_ITEMS = SOLAR_TERM_BLENDS.map((blend) => {
  const slug = toKebab(blend.term);
  const priceNum = parseInt(blend.hotPrice.replace(/\D/g, '')) * 1000;
  return {
    id: slug,
    name: blend.blend.toUpperCase(),
    watermark: blend.watermark,
    price: priceNum,
    formattedPrice: `Rp ${blend.hotPrice.replace('K', '.000')}`,
    image: blend.image,
    ringColor: blend.ringColor,
    glowColor: blend.glowColor,
    tagline: `${blend.term} (${blend.termChinese}) • ${blend.ingredients.slice(0, 3).join(', ')}`,
    desc: blend.note,
    slug: slug,
  };
});

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

  // Mini Showcase Carousel States
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [carouselPaused, setCarouselPaused] = useState(false);
  const touchStartXRef = useRef<number | null>(null);

  const totalSlides = MINI_SHOWCASE_ITEMS.length;
  const currentSlide = MINI_SHOWCASE_ITEMS[carouselIndex];

  const nextSlide = useCallback(() => {
    setCarouselIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCarouselIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Auto-play carousel every 4.5 seconds
  useEffect(() => {
    if (carouselPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 4500);
    return () => clearInterval(timer);
  }, [nextSlide, carouselPaused]);

  // Check customer session
  useEffect(() => {
    try {
      const match = document.cookie.match(/changkeer_customer_session=([^;]+)/);
      if (match) {
        const parsed = safeParseCustomerSession(match[1]);
        if (parsed?.email) {
          setCustomer(parsed);
          return;
        }
      }
    } catch {}

    try {
      const stored = localStorage.getItem('changkeer_customer_session');
      if (stored) {
        const parsed = safeParseCustomerSession(stored);
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

  // Best Sellers (Featured Items)
  const bestSellerProducts = useMemo(() => {
    const featured = initialProducts.filter(p => p.is_featured);
    return featured.length >= 2 ? featured.slice(0, 2) : initialProducts.slice(0, 2);
  }, [initialProducts]);

  // Filter & sort all products
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

  // Add from carousel
  const handleAddFromCarousel = (e: React.MouseEvent) => {
    e.preventDefault();
    const matching = initialProducts.find(p => p.slug === currentSlide.slug || p.id === currentSlide.id);
    if (matching) {
      handleQuickAdd(matching, e);
    } else {
      addToCart({
        product_id: currentSlide.id,
        product_name: currentSlide.name,
        product_slug: currentSlide.slug,
        product_image: currentSlide.image,
        serving_size: 'regular',
        unit_price: currentSlide.price,
        quantity: 1,
        temperature: 'hot',
        sweetness_level: '0%',
        ice_level: 'none',
        selected_addons: [],
        item_notes: '',
      });
      setIsCartOpen(true);
    }
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
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex-1 font-sans space-y-10 sm:space-y-12">
        
        {/* =========================================================================
            SECTION 1: MINI PRODUCT SHOWCASE CAROUSEL (PROPERLY CENTERED & ENLARGED)
            ========================================================================= */}
        <div 
          className="relative rounded-3xl bg-neutral-950 text-white overflow-hidden p-6 sm:p-8 lg:p-10 min-h-[280px] sm:min-h-[320px] flex flex-col justify-between border border-neutral-800/80 shadow-xl select-none group"
          onMouseEnter={() => setCarouselPaused(true)}
          onMouseLeave={() => setCarouselPaused(false)}
          onTouchStart={(e) => { touchStartXRef.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            if (touchStartXRef.current === null) return;
            const diff = touchStartXRef.current - e.changedTouches[0].clientX;
            if (diff > 40) nextSlide();
            if (diff < -40) prevSlide();
            touchStartXRef.current = null;
          }}
        >
          {/* Ambient Colored Radial Glow */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] sm:w-[540px] h-[380px] sm:h-[540px] rounded-full blur-3xl pointer-events-none transition-all duration-1000 opacity-40"
            style={{ backgroundColor: currentSlide.glowColor }}
          />

          {/* Large Watermark in Background */}
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none">
            <span className="font-sans font-black text-7xl sm:text-9xl md:text-[13rem] uppercase tracking-widest text-white/[0.04] whitespace-nowrap transition-all duration-700">
              {currentSlide.watermark}
            </span>
          </div>

          {/* 3-Zone Balanced Grid: Left 3 cols | Center 6 cols (Prominent & Centered) | Right 3 cols */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center flex-1 my-auto">
            
            {/* Left Zone: Title & Info (3 cols on desktop) */}
            <div className="md:col-span-3 space-y-2 text-left order-2 md:order-1">
              <span className="text-xs font-mono tracking-widest text-neutral-400 block font-semibold">
                0{carouselIndex + 1} / 0{totalSlides}
              </span>
              
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase tracking-tight text-white leading-tight">
                {currentSlide.name}
              </h2>

              <p className="text-xs sm:text-sm text-neutral-300 font-normal leading-relaxed max-w-xs">
                {currentSlide.tagline}
              </p>

              <div className="pt-2">
                <Link
                  href={`/katalog/${currentSlide.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-300 hover:text-white transition-colors border-b border-white/20 pb-0.5"
                >
                  <span>Filosofi Racikan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Center Zone: Enlarged Transparent Product Image (6 cols - True Center) */}
            <div className="md:col-span-6 flex items-center justify-center relative py-2 sm:py-4 order-1 md:order-2">
              {/* Colored Ring Circle */}
              <div 
                className="w-48 h-48 sm:w-60 sm:h-60 lg:w-68 lg:h-68 rounded-full border border-dashed transition-all duration-700 opacity-60 absolute"
                style={{ borderColor: currentSlide.ringColor }}
              />
              
              {/* Enlarged Product Image */}
              <div className="relative w-52 h-52 sm:w-64 sm:h-64 lg:w-72 lg:h-72 flex items-center justify-center transition-all duration-500 ease-out group-hover:scale-105">
                <Image
                  src={currentSlide.image}
                  alt={currentSlide.name}
                  width={280}
                  height={280}
                  priority
                  className="object-contain max-h-52 sm:max-h-64 lg:max-h-72 drop-shadow-[0_16px_32px_rgba(0,0,0,0.7)]"
                />
              </div>
            </div>

            {/* Right Zone: Price & Quick Action (3 cols on desktop) */}
            <div className="md:col-span-3 flex md:flex-col items-center md:items-end justify-between md:justify-center gap-4 text-right order-3">
              <div>
                <span className="text-[10px] sm:text-xs font-mono text-neutral-400 uppercase tracking-wider block">Harga Racikan</span>
                <span className="text-xl sm:text-3xl font-extrabold font-mono text-white">
                  {currentSlide.formattedPrice}
                </span>
              </div>

              <button
                type="button"
                onClick={handleAddFromCarousel}
                className="px-5 py-2.5 sm:py-3 rounded-xl bg-white text-neutral-900 hover:bg-neutral-100 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-md active:scale-95 shrink-0 font-sans"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>+ Pesan Seduhan</span>
              </button>
            </div>

          </div>

          {/* Bottom Navigation: Dots & Arrow Controls */}
          <div className="relative z-10 flex items-center justify-between pt-4 mt-3 border-t border-white/10 text-xs">
            {/* Dots */}
            <div className="flex items-center gap-1.5 max-w-[150px] sm:max-w-xs md:max-w-md overflow-x-auto scrollbar-none py-1">
              {MINI_SHOWCASE_ITEMS.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCarouselIndex(idx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer shrink-0 ${
                    carouselIndex === idx ? 'w-5 sm:w-6 bg-white' : 'w-1.5 bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Pindah ke slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Prev/Next Arrows */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prevSlide}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Slide sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Slide berikutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* =========================================================================
            SECTION 2: BEST SELLER SECTION (LANDSCAPE CARDBOXES)
            Horizontal layout, compact & modern
            ========================================================================= */}
        <div className="space-y-4">
          <div className="flex items-end justify-between pb-2 border-b border-neutral-100">
            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase block">
                FAVORIT PELANGGAN
              </span>
              <h2 className="text-lg sm:text-2xl font-extrabold uppercase tracking-tight text-neutral-900">
                Best Seller Racikan Atelier
              </h2>
            </div>
            <span className="text-xs font-sans text-neutral-500 hidden sm:inline">
              Paling banyak diseduh minggu ini
            </span>
          </div>

          {/* 2 Landscape Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
            {bestSellerProducts.map((product) => {
              const isAdded = addedProductId === product.id;
              const formattedPrice = formatRupiah(product.price || 28000);
              const imageSrc = product.featured_image || (product.gallery && product.gallery[0]) || '/images/products/start-of-spring.jpg';

              return (
                <div
                  key={`bestseller-${product.id}`}
                  className="rounded-2xl bg-white border border-neutral-200/80 hover:border-neutral-400/90 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row overflow-hidden group"
                >
                  {/* Left: Landscape Image Box */}
                  <div className="relative w-full sm:w-44 sm:min-w-[176px] aspect-[16/10] sm:aspect-auto overflow-hidden bg-neutral-100 shrink-0">
                    <Image
                      src={imageSrc}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 200px"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-neutral-900/80 backdrop-blur-xs text-white text-[9px] font-bold uppercase tracking-wider">
                      Best Seller
                    </div>
                  </div>

                  {/* Right: Info & Actions */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono font-semibold tracking-wider uppercase text-neutral-400 block">
                        {product.category?.name || 'SIGNATURE'}
                      </span>
                      <h3 className="font-bold text-base text-neutral-900 group-hover:text-neutral-700 transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                        {product.tagline || product.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-neutral-100 flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[9px] font-mono uppercase text-neutral-400 block">Harga</span>
                        <span className="font-mono font-bold text-sm sm:text-base text-neutral-900">
                          {formattedPrice}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setCustomizingProduct(product)}
                          className="px-2.5 py-1.5 rounded-lg border border-neutral-200 hover:border-neutral-400 text-neutral-700 text-xs font-semibold transition-all hover:bg-neutral-50"
                        >
                          Atur
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleQuickAdd(product, e)}
                          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95 ${
                            isAdded ? 'bg-emerald-700 text-white' : 'bg-neutral-900 hover:bg-neutral-800 text-white'
                          }`}
                        >
                          {isAdded ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                          <span>{isAdded ? 'Masuk' : 'Pesan'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* =========================================================================
            SECTION 3: ALL BLENDS CATALOG (REFINED COMPACT PORTRAIT CARDBOXES)
            ========================================================================= */}
        <div className="space-y-5 pt-2">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-neutral-100">
            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase block">
                KATALOG LENGKAP
              </span>
              <h2 className="text-lg sm:text-2xl font-extrabold uppercase tracking-tight text-neutral-900">
                Seluruh Menu Seduhan
              </h2>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-sans font-bold text-neutral-400 uppercase tracking-wider">
                Urutkan:
              </span>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as any)}
                className="bg-white border border-neutral-200/90 rounded-xl px-3 py-1.5 text-xs font-semibold text-neutral-800 focus:outline-none focus:border-neutral-900 shadow-2xs cursor-pointer font-sans"
              >
                <option value="featured">Paling Populer</option>
                <option value="price-asc">Harga: Terendah</option>
                <option value="price-desc">Harga: Tertinggi</option>
              </select>
            </div>
          </div>

          {/* Search Bar & Category Chips */}
          <div className="space-y-3">
            <div className="relative max-w-md w-full">
              <input
                type="text"
                placeholder="Cari seduhan, bunga, rempah, atau khasiat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2 rounded-xl bg-white border border-neutral-200/90 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 shadow-2xs transition-all font-medium"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-0.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-sans scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.slug;
                const count = cat.slug === 'all' 
                  ? initialProducts.length 
                  : initialProducts.filter(p => p.category?.slug === cat.slug || p.category_id === cat.slug).length;

                return (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`px-3 py-1 rounded-full font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1.5 shrink-0 ${
                      isSelected
                        ? 'bg-neutral-900 text-white shadow-xs font-bold'
                        : 'bg-white border border-neutral-200/80 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-500'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Compact Portrait Product Grid (4 cols on lg, 3 cols on md, 2 cols on mobile) */}
          {filteredProducts.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <ShoppingBag className="w-10 h-10 text-neutral-300 mx-auto" />
              <h3 className="text-sm font-bold text-neutral-900 uppercase">Tidak Ada Seduhan Ditemukan</h3>
              <p className="text-xs text-neutral-500">Coba kata kunci lain atau reset filter kategori.</p>
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="px-3.5 py-1.5 rounded-lg bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-5">
              {filteredProducts.map((product) => {
                const isAdded = addedProductId === product.id;
                const formattedPrice = formatRupiah(product.price || 28000);
                const imageSrc = product.featured_image || (product.gallery && product.gallery[0]) || '/images/products/start-of-spring.jpg';

                return (
                  <div
                    key={product.id}
                    className="group relative rounded-2xl bg-white border border-neutral-200/70 hover:border-neutral-400/90 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden"
                  >
                    {/* Compact Image */}
                    <div>
                      <div className="relative aspect-[16/11] w-full overflow-hidden bg-neutral-100">
                        <Image
                          src={imageSrc}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 50vw, 25vw"
                          className="object-cover object-center group-hover:scale-105 transition-transform duration-400 ease-out"
                        />

                        {/* Quick View Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setCustomizingProduct(product);
                          }}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-neutral-800 flex items-center justify-center shadow-xs opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer"
                          title="Lihat Detail Seduhan"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Compact Card Body */}
                      <div className="p-3 sm:p-3.5 space-y-1.5">
                        <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-neutral-400 block truncate">
                          {product.category?.name || 'RACIKAN'}
                        </span>
                        
                        <h3 className="font-bold text-xs sm:text-sm text-neutral-900 group-hover:text-neutral-700 transition-colors line-clamp-1 leading-snug">
                          {product.name}
                        </h3>

                        <p className="text-[11px] text-neutral-500 line-clamp-2 leading-relaxed">
                          {product.tagline || product.description}
                        </p>
                      </div>
                    </div>

                    {/* Compact Card Footer */}
                    <div className="px-3 sm:px-3.5 pb-3 sm:pb-3.5 pt-2 border-t border-neutral-100 flex items-center justify-between gap-2">
                      <span className="font-mono font-bold text-xs sm:text-sm text-neutral-900 truncate">
                        {formattedPrice}
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setCustomizingProduct(product)}
                          className="px-2 py-1 rounded-lg border border-neutral-200 hover:border-neutral-400 text-neutral-700 text-[11px] font-semibold transition-all hover:bg-neutral-50"
                        >
                          Atur
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleQuickAdd(product, e)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer active:scale-95 ${
                            isAdded 
                              ? 'bg-emerald-700 text-white' 
                              : 'bg-neutral-900 hover:bg-neutral-800 text-white'
                          }`}
                        >
                          {isAdded ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                          <span className="hidden xs:inline">{isAdded ? 'Masuk' : 'Pesan'}</span>
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>

      </main>

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
