'use client';

import React, { useState } from 'react';
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
  ShoppingBag,
  Flame,
  Snowflake,
} from 'lucide-react';
import { BOTANICAL_ADDONS } from '@/lib/data/mock-seed';
import { useCart } from '@/lib/context/CartContext';
import { SWEETNESS_OPTIONS, SWEETENER_TYPES } from './CustomizationModal';

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

interface ClientProductDetailInteractiveProps {
  product: Product;
  contactPhone: string;
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
  const [sweetness, setSweetness] = useState<'0%' | '30%' | '50%' | '75%' | '100%'>('0%');
  const [sweetenerType, setSweetenerType] = useState<'sorghum' | 'honey' | 'stevia'>('sorghum');
  const [iceLevel, setIceLevel] = useState<'less' | 'normal'>('normal');
  const [selectedAddons, setSelectedAddons] = useState<typeof BOTANICAL_ADDONS>([]);
  const [addonFilter, setAddonFilter] = useState<'all' | 'flower' | 'fruit'>('all');
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
  const iceExtra = temperature === 'iced' ? 2000 : 0;
  const sweetenerExtra = sweetness !== '0%' && sweetenerType === 'honey' ? 3000 : 0;
  const addonsTotal = selectedAddons.reduce((acc, a) => acc + a.price, 0);

  const unitPrice = basePrice + iceExtra + sweetenerExtra + addonsTotal;
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
      sweetener_type: sweetness !== '0%' ? sweetenerType : undefined,
      ice_level: temperature === 'iced' ? iceLevel : undefined,
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
            <span className="text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-neutral-400">
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

          {/* Heading + Tagline */}
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-neutral-900 leading-tight">
              {product.name}
            </h1>
            {product.tagline && (
              <p className="text-xs sm:text-sm text-neutral-500 font-medium">
                {product.tagline}
              </p>
            )}
          </div>

          {/* Interactive Information Carousel Tabs */}
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3">
            {/* Tabs Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {detailTabs.map((tab, idx) => (
                  <button
                    key={tab.label}
                    type="button"
                    onClick={() => setDetailSlide(idx)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase font-bold tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                      detailSlide === idx
                        ? 'bg-neutral-900 text-white shadow-2xs'
                        : 'text-neutral-400 hover:text-neutral-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1 shrink-0 ml-2">
                <button
                  type="button"
                  onClick={() => setDetailSlide((prev) => Math.max(0, prev - 1))}
                  disabled={detailSlide === 0}
                  className="w-6 h-6 rounded-md border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 disabled:opacity-30 cursor-pointer"
                >
                  <ChevronLeft className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => setDetailSlide((prev) => Math.min(detailTabs.length - 1, prev + 1))}
                  disabled={detailSlide === detailTabs.length - 1}
                  className="w-6 h-6 rounded-md border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 disabled:opacity-30 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Tab Slide Content */}
            <div className="text-xs leading-relaxed min-h-[90px]">
              {detailSlide === 0 && (
                <div>
                  <h4 className="font-bold text-xs text-neutral-900 mb-1 uppercase font-sans tracking-wide">
                    {detailTabs[0].title}
                  </h4>
                  <p className="text-neutral-600">
                    {product.description || 'Functional loose-leaf herbal blend inspired by Indonesian botanical heritage, brewed fresh in under 3 minutes.'}
                  </p>
                </div>
              )}

              {detailSlide === 1 && (
                <div>
                  <h4 className="font-bold text-xs text-neutral-900 mb-1 uppercase font-sans tracking-wide">
                    {detailTabs[1].title}
                  </h4>
                  <p className="text-neutral-600">
                    Every cup of Changkeer is unsweetened by default. We champion the authentic nuances of herbs, whole flowers, and sun-dried botanicals.
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
                      <span>100% Free of Senna Leaf &amp; Chemical Laxatives</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Microplastic-Free &amp; Chlorine-Free Sachet</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Low-GI Organic Sorghum Nectar &amp; Raw Forest Honey</span>
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
                      <span className="text-[10px] uppercase font-sans text-neutral-400 block font-bold">Brewing Character</span>
                      <span className="text-neutral-800 font-medium">Aromatic, soothing, delicately balanced on the palate</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-sans text-neutral-400 block font-bold">Serving Suggestion</span>
                      <span className="text-neutral-800 font-medium">Best enjoyed warm for relaxation or iced on sunny days</span>
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
            <div className="absolute bottom-3 w-44 sm:w-52 h-5 bg-neutral-900/10 rounded-full blur-xl pointer-events-none" />

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

          <button
            type="button"
            onClick={() => {
              setActiveModalIndex(0);
              setIsGalleryModalOpen(true);
            }}
            className="inline-flex items-center gap-2 text-xs font-sans font-bold tracking-wider uppercase bg-white border border-neutral-200 text-neutral-800 px-5 py-2 rounded-full shadow-xs hover:border-neutral-900 hover:text-neutral-900 active:scale-95 transition-all mt-2 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-neutral-700" />
            <span>View Photo Gallery ({images.length})</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: E-Commerce Order Configurator Cardbox */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 space-y-3.5 order-3 bg-white border border-neutral-200/80 rounded-2xl p-5 sm:p-6 shadow-md font-sans">
          
          {/* Price Header */}
          <div className="pb-3 border-b border-neutral-100 flex items-end justify-between">
            <div>
              <span className="text-[10px] font-sans font-bold tracking-wider uppercase text-neutral-400 block mb-0.5">
                Price
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

          {/* Serving Temperature (Hot vs Iced +2000) */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-sans font-bold tracking-wider uppercase text-neutral-500 block">
              Serving Temperature
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
                <span>Hot (90&deg;C)</span>
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
                <span>Iced (+Rp 2K)</span>
              </button>
            </div>
          </div>

          {/* Sweetness Level */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-sans font-bold tracking-wider uppercase text-neutral-500 block">
                Sweetness Level
              </label>
              <span className="text-[10px] font-sans text-neutral-400 font-medium">Default: Unsweetened</span>
            </div>
            <div className="grid grid-cols-5 gap-1 text-xs font-sans font-bold">
              {SWEETNESS_OPTIONS.map((opt) => (
                <button
                  key={opt.level}
                  type="button"
                  onClick={() => setSweetness(opt.level as any)}
                  className={`py-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                    sweetness === opt.level
                      ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs font-extrabold'
                      : 'bg-neutral-50/70 text-neutral-600 border-neutral-200/80 hover:bg-neutral-100 font-semibold'
                  }`}
                >
                  {opt.level}
                </button>
              ))}
            </div>
          </div>

          {/* Ice Level (only when Iced) */}
          {temperature === 'iced' && (
            <div className="space-y-1.5 animate-in fade-in duration-200">
              <label className="text-[11px] font-sans font-bold tracking-wider uppercase text-neutral-500 block">
                Ice Level
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs font-sans font-semibold">
                {[
                  { id: 'less', label: 'Less Ice', sub: 'Strong flavor' },
                  { id: 'normal', label: 'Normal Ice', sub: 'Crisp chill' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setIceLevel(item.id as any)}
                    className={`py-2 px-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      iceLevel === item.id
                        ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs font-bold'
                        : 'bg-neutral-50/70 text-neutral-600 border-neutral-200/80 hover:bg-neutral-100'
                    }`}
                  >
                    <span className="block font-bold">{item.label}</span>
                    <span className="text-[9px] opacity-75 font-normal block">{item.sub}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Natural Sweeteners (when Sweetness > 0%) */}
          {sweetness !== '0%' && (
            <div className="space-y-1.5 animate-in fade-in duration-200">
              <label className="text-[11px] font-sans font-bold tracking-wider uppercase text-neutral-500 block">
                Natural Sweetener
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-xs font-sans">
                {SWEETENER_TYPES.map((sw) => (
                  <button
                    key={sw.id}
                    type="button"
                    onClick={() => setSweetenerType(sw.id as any)}
                    className={`py-1.5 px-2 rounded-xl border text-center transition-all cursor-pointer truncate ${
                      sweetenerType === sw.id
                        ? 'bg-neutral-900 text-white border-neutral-900 font-bold shadow-xs'
                        : 'bg-neutral-50/70 text-neutral-700 border-neutral-200/80 hover:bg-neutral-100'
                    }`}
                  >
                    <span className="block truncate text-[11px] font-medium">{sw.name.split(' ')[1] || sw.name}</span>
                    <span className="block text-[9px] opacity-75">{sw.price > 0 ? '+3K' : 'Free'}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Botanical Add-ons (Bunga Kering & Buah Kering) */}
          <div className="space-y-2 pt-0.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-sans font-bold tracking-wider uppercase text-neutral-500 block">
                Tambahan Botani (Bunga &amp; Buah Kering)
              </label>
              <span className="text-[10px] font-sans text-neutral-400 font-medium">
                {selectedAddons.length > 0 ? `${selectedAddons.length} dipilih` : 'Opsional'}
              </span>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 p-0.5 bg-neutral-100 rounded-lg text-[10px] font-sans font-medium">
              <button
                type="button"
                onClick={() => setAddonFilter('all')}
                className={`flex-1 py-1 px-1.5 rounded-md transition-all text-center cursor-pointer ${
                  addonFilter === 'all'
                    ? 'bg-white text-neutral-900 shadow-2xs font-bold'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                Semua
              </button>
              <button
                type="button"
                onClick={() => setAddonFilter('flower')}
                className={`flex-1 py-1 px-1.5 rounded-md transition-all text-center cursor-pointer flex items-center justify-center gap-1 ${
                  addonFilter === 'flower'
                    ? 'bg-white text-rose-950 shadow-2xs font-bold'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                <span>🌸 Bunga</span>
                {selectedAddons.filter(a => a.category === 'flower').length > 0 && (
                  <span className="w-3.5 h-3.5 rounded-full bg-rose-600 text-white text-[8px] font-bold flex items-center justify-center">
                    {selectedAddons.filter(a => a.category === 'flower').length}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setAddonFilter('fruit')}
                className={`flex-1 py-1 px-1.5 rounded-md transition-all text-center cursor-pointer flex items-center justify-center gap-1 ${
                  addonFilter === 'fruit'
                    ? 'bg-white text-amber-950 shadow-2xs font-bold'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                <span>🍊 Buah</span>
                {selectedAddons.filter(a => a.category === 'fruit').length > 0 && (
                  <span className="w-3.5 h-3.5 rounded-full bg-amber-600 text-white text-[8px] font-bold flex items-center justify-center">
                    {selectedAddons.filter(a => a.category === 'fruit').length}
                  </span>
                )}
              </button>
            </div>

            <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
              {BOTANICAL_ADDONS
                .filter(addon => addonFilter === 'all' || addon.category === addonFilter)
                .map((addon) => {
                  const isSelected = selectedAddons.some(a => a.id === addon.id);
                  const isFruit = addon.category === 'fruit';

                  return (
                    <button
                      key={addon.id}
                      type="button"
                      onClick={() => handleToggleAddon(addon)}
                      className={`w-full py-2 px-2.5 rounded-xl border text-left text-xs font-sans flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                          : 'bg-neutral-50/70 text-neutral-700 border-neutral-200/80 hover:bg-neutral-100'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold truncate text-[11px]">{addon.name}</span>
                          <span className={`text-[8.5px] px-1 py-0.2 rounded font-medium shrink-0 ${
                            isSelected 
                              ? 'bg-neutral-800 text-neutral-200' 
                              : isFruit ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {isFruit ? 'Buah' : 'Bunga'}
                          </span>
                        </div>
                        {addon.note && (
                          <span className={`text-[9.5px] block truncate font-normal ${
                            isSelected ? 'text-neutral-300' : 'text-neutral-400'
                          }`}>
                            {addon.note}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-mono font-bold shrink-0">+{formatRupiah(addon.price)}</span>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Quantity Selector & Total Price */}
          <div className="pt-2.5 border-t border-neutral-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-sans uppercase text-neutral-400 block font-bold mb-1">
                Quantity
              </span>
              <div className="inline-flex items-center bg-neutral-50 border border-neutral-200/80 rounded-xl p-0.5 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-800 hover:bg-neutral-200 disabled:opacity-30 transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
                <span className="w-8 text-center font-mono font-bold text-sm text-neutral-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-800 hover:bg-neutral-200 transition-colors cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-sans uppercase text-neutral-400 block font-bold mb-0.5">
                Total Amount
              </span>
              <span className="text-xl sm:text-2xl font-mono font-extrabold text-neutral-900 tracking-tight">
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
              <span>{addedAnimation ? 'Added to Bag!' : 'Add to Bag'}</span>
            </button>

            <a
              href={`https://wa.me/${contactPhone.replace(/[^0-9]/g, '')}?text=Hello%20CHANGKEER,%20I%20am%20interested%20in%20${encodeURIComponent(product.name)}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2 rounded-xl border border-neutral-200/80 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-sans font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer text-center"
            >
              <MessageCircle className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
              <span>Ask Barista via WhatsApp</span>
            </a>
          </div>

          {/* Guarantees */}
          <div className="pt-2 border-t border-neutral-100 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 text-[11px] font-sans text-neutral-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="font-medium">100% Pure Botanicals</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="font-medium">Brewed &lt; 3 Mins</span>
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
                Photo Gallery &bull; {product.name} ({activeModalIndex + 1}/{images.length})
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
                  <span>Previous</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModalIndex((idx) => (idx === images.length - 1 ? 0 : idx + 1))}
                  className="px-3 sm:px-3.5 py-1.5 rounded-xl border border-neutral-200 hover:bg-neutral-100 text-xs font-bold uppercase flex items-center gap-1 cursor-pointer"
                >
                  <span>Next</span>
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
