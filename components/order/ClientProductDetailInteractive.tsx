'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Product } from '@/types';
import {
  Minus,
  Plus,
  Share2,
  Check,
  CheckCircle2,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  MessageCircle,
  Sparkles,
  ShoppingBag,
  Flame,
  Snowflake,
} from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import { BOTANICAL_ADDONS } from '@/lib/data/mock-seed';

interface ClientProductDetailInteractiveProps {
  product: Product;
  contactPhone: string;
}

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function ClientProductDetailInteractive({
  product,
  contactPhone,
}: ClientProductDetailInteractiveProps) {
  const { addToCart, setIsCartOpen } = useCart();

  const rawImages = [
    product.featured_image,
    ...(product.gallery || []),
  ].filter(Boolean) as string[];

  const images = rawImages.length > 0
    ? Array.from(new Set(rawImages))
    : ['/images/products/start-of-spring.jpg'];

  const [quantity, setQuantity] = useState(1);
  const [temperature, setTemperature] = useState<'hot' | 'iced'>('hot');
  const [sweetness, setSweetness] = useState<'0%' | '25%' | '50%' | '100%'>('0%');
  const [iceLevel, setIceLevel] = useState<'none' | 'less' | 'normal'>('normal');
  const [selectedAddons, setSelectedAddons] = useState<typeof BOTANICAL_ADDONS>([]);
  const [copied, setCopied] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Popup Slide Carousel Modal States
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [activeModalIndex, setActiveModalIndex] = useState(0);

  // Left Details Carousel State
  const [detailSlide, setDetailSlide] = useState(0);

  const detailTabs = [
    { label: '01 TITLE', title: 'Blend Identity' },
    { label: '02 NARRATIVE', title: 'Taste Philosophy' },
    { label: '03 INTEGRITY', title: 'Botanical Purity' },
    { label: '04 SENSORY', title: 'Sensory Profile' },
  ];

  const transparentImage = `/images/products-nobg/${product.slug}.png`;

  const basePrice = product.price || 28000;
  const addonsTotal = selectedAddons.reduce((acc, a) => acc + a.price, 0);
  const unitPrice = basePrice + addonsTotal;
  const totalPrice = unitPrice * quantity;

  const formattedUnitPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(unitPrice);

  const formattedTotalPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(totalPrice);

  const handleToggleAddon = (addon: typeof BOTANICAL_ADDONS[0]) => {
    if (selectedAddons.some(a => a.id === addon.id)) {
      setSelectedAddons(selectedAddons.filter(a => a.id !== addon.id));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const handleAddToCart = () => {
    addToCart({
      product_id: product.id,
      product_name: product.name,
      product_slug: product.slug,
      product_image: product.featured_image || null,
      serving_size: 'regular',
      unit_price: unitPrice,
      quantity,
      temperature,
      sweetness_level: sweetness,
      ice_level: temperature === 'iced' ? iceLevel : 'none',
      selected_addons: selectedAddons,
      item_notes: '',
    });

    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      setIsCartOpen(true);
    }, 400);
  };

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="font-sans text-neutral-900 select-none">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* ========================================================================= */}
        {/* LEFT COLUMN: Blend Philosophy & Sensory Tabs */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 space-y-4 order-2 lg:order-1">
          {/* Top Category and Share */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-sans font-bold tracking-[0.2em] uppercase text-neutral-400">
              {product.category?.name || 'SIGNATURE BLEND'}
            </span>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-xs font-sans font-semibold tracking-wider uppercase text-neutral-600 hover:text-neutral-900 transition-colors py-1 px-3 rounded-lg border border-neutral-200/80 bg-white hover:bg-neutral-50 shadow-xs cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600 font-bold">Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>

          {/* Heading */}
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-sans font-extrabold uppercase tracking-tight text-neutral-900 leading-tight">
              {product.name}
            </h1>
            {product.tagline && (
              <p className="text-xs sm:text-sm font-sans font-medium text-neutral-500 leading-relaxed">
                {product.tagline}
              </p>
            )}
          </div>

          {/* Carousel Tabs Navigation */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-2 border-b border-neutral-200/80 pb-2 overflow-x-auto text-[11px] font-sans font-bold uppercase tracking-wider scrollbar-none">
              {detailTabs.map((tab, idx) => (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => setDetailSlide(idx)}
                  className={`pb-1 transition-all cursor-pointer whitespace-nowrap ${
                    detailSlide === idx
                      ? 'border-b-2 border-neutral-900 text-neutral-900 font-extrabold'
                      : 'border-transparent text-neutral-400 hover:text-neutral-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Slide Content */}
            <div className="bg-[#FAFAF8] border border-neutral-200/80 rounded-xl p-4 min-h-[140px] text-xs font-sans leading-relaxed space-y-2.5 shadow-2xs">
              {detailSlide === 0 && (
                <div>
                  <h4 className="font-bold text-xs text-neutral-900 mb-1 uppercase font-sans tracking-wide">
                    {detailTabs[0].title}
                  </h4>
                  <p className="text-neutral-600">
                    {product.description || 'Racikan teh herbal fungsional terinspirasi tradisi botani nusantara yang diseduh segar di bawah 3 menit.'}
                  </p>
                </div>
              )}

              {detailSlide === 1 && (
                <div>
                  <h4 className="font-bold text-xs text-neutral-900 mb-1 uppercase font-sans tracking-wide">
                    {detailTabs[1].title}
                  </h4>
                  <p className="text-neutral-600">
                    Setiap cangkir Changkeer bebas dari pemanis berlebih secara default. Kami mengutamakan cita rasa asli tanaman herbal, kelopak bunga mekar utuh, dan rempah kering pilihan.
                  </p>
                </div>
              )}

              {detailSlide === 2 && (
                <div>
                  <h4 className="font-bold text-xs text-neutral-900 mb-1 uppercase font-sans tracking-wide">
                    {detailTabs[2].title}
                  </h4>
                  <ul className="space-y-1.5 text-neutral-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>100% Bebas Daun Senna &amp; Pencahar Kimia</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Bebas Mikroplastik &amp; Pemutih Klorin</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Pilihan Gula Sorgum Rendah Glikemik &amp; Madu</span>
                    </li>
                  </ul>
                </div>
              )}

              {detailSlide === 3 && (
                <div>
                  <h4 className="font-bold text-xs text-neutral-900 mb-1 uppercase font-sans tracking-wide">
                    {detailTabs[3].title}
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-[10px] uppercase font-sans text-neutral-400 block font-bold">Karakter Seduhan</span>
                      <span className="text-neutral-800 font-medium">Aromatik segar, menenangkan, rasa seimbang di tenggorokan</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-sans text-neutral-400 block font-bold">Saran Penyajian</span>
                      <span className="text-neutral-800 font-medium">Nikmat hangat saat relaksasi atau dingin saat cuaca terik</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CENTER COLUMN: Enlarged Product Image Showcase & Gallery Button */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center order-1 lg:order-2 pt-1">
          <div className="relative w-full max-w-[320px] sm:max-w-[360px] h-[280px] sm:h-[320px] lg:h-[350px] flex items-center justify-center group">
            {/* Ambient Base Shadow under Product */}
            <div className="absolute bottom-3 w-44 sm:w-52 h-5 bg-neutral-900/10 rounded-full blur-xl pointer-events-none" />

            {/* Product Cutout Image */}
            <div className="relative w-full h-full flex items-center justify-center p-2">
              <Image
                src={transparentImage}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 95vw, 40vw"
                className="object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-700 ease-out"
                priority
              />
            </div>
          </div>

          {/* View Gallery Button */}
          <button
            type="button"
            onClick={() => {
              setActiveModalIndex(0);
              setIsGalleryModalOpen(true);
            }}
            className="inline-flex items-center gap-2 text-xs font-sans font-bold tracking-wider uppercase bg-white border border-neutral-200 text-neutral-800 px-5 py-2 rounded-full shadow-xs hover:border-neutral-900 hover:text-neutral-900 active:scale-95 transition-all mt-2 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-neutral-700" />
            <span>Lihat Galeri Foto ({images.length})</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: E-Commerce Order Configurator Cardbox (Plus Jakarta Sans) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 space-y-3.5 order-3 bg-white border border-neutral-200/80 rounded-2xl p-5 sm:p-6 shadow-md font-sans">
          
          {/* Price Header */}
          <div className="pb-3 border-b border-neutral-100 flex items-end justify-between">
            <div>
              <span className="text-[10px] font-sans font-bold tracking-wider uppercase text-neutral-400 block mb-0.5">
                Harga Seduhan
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-sans font-extrabold text-neutral-900 tracking-tight">
                  {formattedUnitPrice}
                </span>
                <span className="text-xs font-sans font-semibold text-neutral-500">
                  / {temperature === 'hot' ? 'Hot 350ml' : 'Iced 450ml'}
                </span>
              </div>
            </div>
            <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">
              Fresh Brew
            </span>
          </div>

          {/* Suhu Penyajian (Hot vs Iced) */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-sans font-bold tracking-wider uppercase text-neutral-500 block">
              Suhu Penyajian
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTemperature('hot')}
                className={`py-2 px-3 rounded-xl border text-xs font-sans font-bold uppercase tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  temperature === 'hot'
                    ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                    : 'bg-neutral-50/70 text-neutral-700 border-neutral-200/80 hover:bg-neutral-100'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>Hangat (Hot)</span>
              </button>

              <button
                type="button"
                onClick={() => setTemperature('iced')}
                className={`py-2 px-3 rounded-xl border text-xs font-sans font-bold uppercase tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  temperature === 'iced'
                    ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                    : 'bg-neutral-50/70 text-neutral-700 border-neutral-200/80 hover:bg-neutral-100'
                }`}
              >
                <Snowflake className="w-3.5 h-3.5 text-sky-400" />
                <span>Dingin (Iced)</span>
              </button>
            </div>
          </div>

          {/* Tingkat Kemanisan */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-sans font-bold tracking-wider uppercase text-neutral-500 block">
                Tingkat Manis
              </label>
              <span className="text-[10px] font-sans text-neutral-400 font-medium">Default: Tanpa Pemanis</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 text-xs font-sans font-bold">
              {(['0%', '25%', '50%', '100%'] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setSweetness(level)}
                  className={`py-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                    sweetness === level
                      ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs font-extrabold'
                      : 'bg-neutral-50/70 text-neutral-600 border-neutral-200/80 hover:bg-neutral-100 font-semibold'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Es Batu (hanya jika Iced) */}
          {temperature === 'iced' && (
            <div className="space-y-1.5 animate-in fade-in duration-200">
              <label className="text-[11px] font-sans font-bold tracking-wider uppercase text-neutral-500 block">
                Jumlah Es
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-xs font-sans font-semibold">
                {[
                  { id: 'none', label: 'Tanpa Es' },
                  { id: 'less', label: 'Sedikit Es' },
                  { id: 'normal', label: 'Normal' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setIceLevel(item.id as any)}
                    className={`py-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                      iceLevel === item.id
                        ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs font-bold'
                        : 'bg-neutral-50/70 text-neutral-600 border-neutral-200/80 hover:bg-neutral-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Botanical Add-ons */}
          <div className="space-y-1.5 pt-0.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-sans font-bold tracking-wider uppercase text-neutral-500 block">
                Tambahan Botani Alami
              </label>
              <span className="text-[10px] font-sans text-neutral-400 font-medium">Opsional</span>
            </div>
            <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
              {BOTANICAL_ADDONS.map((addon) => {
                const isSelected = selectedAddons.some(a => a.id === addon.id);
                return (
                  <button
                    key={addon.id}
                    type="button"
                    onClick={() => handleToggleAddon(addon)}
                    className={`w-full py-1.5 px-3 rounded-xl border text-left text-xs font-sans flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                        : 'bg-neutral-50/70 text-neutral-700 border-neutral-200/80 hover:bg-neutral-100'
                    }`}
                  >
                    <span className="font-semibold truncate max-w-[140px] sm:max-w-[200px]">{addon.name}</span>
                    <span className="text-[11px] font-bold shrink-0">+{formatRupiah(addon.price)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity Selector & Total Price */}
          <div className="pt-2.5 border-t border-neutral-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-sans uppercase text-neutral-400 block font-bold mb-1">
                Jumlah Cangkir
              </span>
              <div className="inline-flex items-center bg-neutral-50 border border-neutral-200/80 rounded-xl p-0.5 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-800 hover:bg-neutral-200 disabled:opacity-30 transition-colors cursor-pointer"
                  title="Kurangi"
                >
                  <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
                <span className="w-8 text-center font-sans font-bold text-sm text-neutral-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-800 hover:bg-neutral-200 transition-colors cursor-pointer"
                  title="Tambah"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-sans uppercase text-neutral-400 block font-bold mb-0.5">
                Total Pesanan
              </span>
              <span className="text-xl sm:text-2xl font-sans font-extrabold text-neutral-900 tracking-tight">
                {formattedTotalPrice}
              </span>
            </div>
          </div>

          {/* Primary Action Button: Add to Cart */}
          <div className="pt-1 space-y-2">
            <button
              type="button"
              onClick={handleAddToCart}
              className={`w-full py-3 rounded-xl font-sans font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer active:scale-98 ${
                addedAnimation
                  ? 'bg-emerald-600 text-white'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4 shrink-0" />
              <span>{addedAnimation ? 'Berhasil Ditambahkan!' : 'Tambah ke Keranjang'}</span>
            </button>

            <a
              href={`https://wa.me/${contactPhone.replace(/[^0-9]/g, '')}?text=Halo%20Changkeer,%20saya%20tertarik%20dengan%20racikan%20${encodeURIComponent(product.name)}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2 rounded-xl border border-neutral-200/80 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-sans font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer text-center"
            >
              <MessageCircle className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
              <span>Tanya Barista via WhatsApp</span>
            </a>
          </div>

          {/* Guarantees - 1 row compact */}
          <div className="pt-2 border-t border-neutral-100 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 text-[11px] font-sans text-neutral-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="font-medium">100% Herbal Alami</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="font-medium">Seduh &lt; 3 Menit</span>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* POP-UP GALLERY MODAL */}
      {/* ========================================================================= */}
      {isGalleryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in">
          <div className="relative max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl p-4 sm:p-6 space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-neutral-200">
              <span className="font-bold text-xs uppercase tracking-wider text-neutral-900 truncate pr-2">
                Galeri Foto {product.name} ({activeModalIndex + 1}/{images.length})
              </span>
              <button
                type="button"
                onClick={() => setIsGalleryModalOpen(false)}
                className="p-1 rounded-full hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-[4/3] w-full rounded-xl sm:rounded-2xl overflow-hidden bg-neutral-100">
              <Image
                src={images[activeModalIndex]}
                alt={`${product.name} - ${activeModalIndex + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 640px"
                className="object-cover"
              />
            </div>

            {images.length > 1 && (
              <div className="flex items-center justify-between pt-1 sm:pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModalIndex((idx) => (idx === 0 ? images.length - 1 : idx - 1))}
                  className="px-3 sm:px-3.5 py-1.5 rounded-xl border border-neutral-200 hover:bg-neutral-100 text-xs font-bold uppercase flex items-center gap-1 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Sebelumnya</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModalIndex((idx) => (idx === images.length - 1 ? 0 : idx + 1))}
                  className="px-3 sm:px-3.5 py-1.5 rounded-xl border border-neutral-200 hover:bg-neutral-100 text-xs font-bold uppercase flex items-center gap-1 cursor-pointer"
                >
                  <span>Selanjutnya</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
