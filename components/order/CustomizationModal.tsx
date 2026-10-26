'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Plus, Minus, Flame, Snowflake, Check, ShoppingBag, Leaf, Sparkles } from 'lucide-react';
import { Product, BotanicalAddon } from '@/types';
import { BOTANICAL_ADDONS } from '@/lib/data/mock-seed';
import { useCart } from '@/lib/context/CartContext';

interface CustomizationModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export const SWEETNESS_OPTIONS = [
  {
    level: '0%',
    title: 'Unsweetened',
    subtitle: 'Pure artisanal tea, zero added sweetener',
  },
  {
    level: '30%',
    title: 'Light Sweetness',
    subtitle: 'Gentle touch of sweetness, preserves floral tea notes',
  },
  {
    level: '50%',
    title: 'Bold Tea & Moderate',
    subtitle: 'Strong brew character with gentle sweetness',
  },
  {
    level: '75%',
    title: 'Harmonious Balance',
    subtitle: 'Equal balance of robust tea & sweetness',
  },
  {
    level: '100%',
    title: 'Classic Sweetness',
    subtitle: 'Full sweetness for a rich, comforting cup',
  },
] as const;

export const SWEETENER_TYPES = [
  {
    id: 'sorghum',
    name: 'Organic Sorghum Nectar',
    desc: 'Low GI, unrefined natural caramel notes',
    price: 0,
  },
  {
    id: 'honey',
    name: 'Pure Wild Forest Honey',
    desc: 'Rich floral nectar, natural antioxidants',
    price: 3000,
  },
  {
    id: 'stevia',
    name: 'Natural Stevia Leaf',
    desc: 'Zero-calorie, 100% plant-based sweetness',
    price: 0,
  },
] as const;

/**
 * High-definition botanical SVG thumbnail component matching artisanal herbal craftsmanship.
 */
function BotanicalThumbnail({ addon }: { addon: BotanicalAddon }) {
  const isFruit = addon.category === 'fruit';

  switch (addon.id) {
    case 'addon-1': // Dried Rose Buds
      return (
        <svg viewBox="0 0 40 40" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="8" fill="#1A1114" />
          <circle cx="20" cy="20" r="14" fill="#381017" opacity="0.6" />
          {/* Rose Petals Cluster */}
          <path d="M16 23C13 20 13 15 17 13C21 11 25 14 24 18C23 22 19 25 16 23Z" fill="#991B1B" />
          <path d="M22 24C26 22 27 16 23 13C19 10 15 13 17 17C19 21 21 25 22 24Z" fill="#BE123C" />
          <path d="M19 14C17 16 17 19 20 20C22 21 24 18 22 16C21 14 20 13 19 14Z" fill="#E11D48" />
          <path d="M19 23C17 25 15 28 13 29M20 24C21 26 23 28 25 29M19 22V28" stroke="#4D7C0F" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'addon-2': // Golden Chrysanthemum
      return (
        <svg viewBox="0 0 40 40" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="8" fill="#1A1710" />
          <circle cx="20" cy="20" r="13" fill="#3D2E12" opacity="0.6" />
          {/* Chrysanthemum rays */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <ellipse
              key={deg}
              cx="20"
              cy="20"
              rx="2.5"
              ry="8.5"
              fill="#F59E0B"
              transform={`rotate(${deg} 20 20)`}
              opacity="0.85"
            />
          ))}
          <circle cx="20" cy="20" r="4.5" fill="#B45309" />
          <circle cx="20" cy="20" r="2.5" fill="#FDE68A" />
        </svg>
      );
    case 'addon-3': // Butterfly Pea (Telang)
      return (
        <svg viewBox="0 0 40 40" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="8" fill="#101524" />
          <circle cx="20" cy="20" r="13" fill="#1E2A4A" opacity="0.6" />
          <path d="M14 20C12 14 18 11 21 13C25 15 27 21 24 25C21 28 16 25 14 20Z" fill="#1E40AF" />
          <path d="M17 19C15 15 19 13 22 15C24 17 25 21 23 23C21 25 18 23 17 19Z" fill="#3B82F6" />
          <ellipse cx="20" cy="19" rx="2" ry="3.5" fill="#93C5FD" opacity="0.9" />
          <path d="M19 25C18 28 17 30 15 31" stroke="#365314" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'addon-4': // Jasmine Bloom
      return (
        <svg viewBox="0 0 40 40" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="8" fill="#131916" />
          <circle cx="20" cy="20" r="13" fill="#1D2A24" opacity="0.6" />
          {[0, 72, 144, 216, 288].map((deg) => (
            <ellipse
              key={deg}
              cx="20"
              cy="20"
              rx="3"
              ry="8"
              fill="#F8FAFC"
              transform={`rotate(${deg} 20 20)`}
            />
          ))}
          <circle cx="20" cy="20" r="3.5" fill="#FEF08A" />
          <circle cx="20" cy="20" r="1.5" fill="#65A30D" />
        </svg>
      );
    case 'addon-5': // Golden Osmanthus
      return (
        <svg viewBox="0 0 40 40" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="8" fill="#1C1810" />
          <circle cx="20" cy="20" r="13" fill="#3D3016" opacity="0.6" />
          {/* Small 4-petal osmanthus florets */}
          <g transform="translate(14, 13) scale(0.65)">
            <ellipse cx="10" cy="6" rx="2" ry="4" fill="#F59E0B" />
            <ellipse cx="10" cy="14" rx="2" ry="4" fill="#F59E0B" />
            <ellipse cx="6" cy="10" rx="4" ry="2" fill="#F59E0B" />
            <ellipse cx="14" cy="10" rx="4" ry="2" fill="#F59E0B" />
            <circle cx="10" cy="10" r="2" fill="#D97706" />
          </g>
          <g transform="translate(8, 20) scale(0.55)">
            <ellipse cx="10" cy="6" rx="2" ry="4" fill="#FBBF24" />
            <ellipse cx="10" cy="14" rx="2" ry="4" fill="#FBBF24" />
            <ellipse cx="6" cy="10" rx="4" ry="2" fill="#FBBF24" />
            <ellipse cx="14" cy="10" rx="4" ry="2" fill="#FBBF24" />
            <circle cx="10" cy="10" r="2" fill="#D97706" />
          </g>
          <g transform="translate(20, 21) scale(0.55)">
            <ellipse cx="10" cy="6" rx="2" ry="4" fill="#FBBF24" />
            <ellipse cx="10" cy="14" rx="2" ry="4" fill="#FBBF24" />
            <ellipse cx="6" cy="10" rx="4" ry="2" fill="#FBBF24" />
            <ellipse cx="14" cy="10" rx="4" ry="2" fill="#FBBF24" />
            <circle cx="10" cy="10" r="2" fill="#D97706" />
          </g>
        </svg>
      );
    case 'addon-6': // Organic Hibiscus (Rosella)
      return (
        <svg viewBox="0 0 40 40" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="8" fill="#1C1014" />
          <circle cx="20" cy="20" r="13" fill="#3D121F" opacity="0.6" />
          <path d="M20 10C16 14 13 19 14 25C15 28 17 30 20 30C23 30 25 28 26 25C27 19 24 14 20 10Z" fill="#9F1239" />
          <path d="M17 14C14 18 13 22 16 26M23 14C26 18 27 22 24 26" stroke="#E11D48" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M20 10V18" stroke="#F43F5E" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'addon-7': // Goji Berries
      return (
        <svg viewBox="0 0 40 40" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="8" fill="#1C1210" />
          <circle cx="20" cy="20" r="13" fill="#3E1D16" opacity="0.6" />
          <ellipse cx="17" cy="18" rx="4" ry="7" fill="#DC2626" transform="rotate(-20 17 18)" />
          <ellipse cx="23" cy="21" rx="3.5" ry="6.5" fill="#EA580C" transform="rotate(25 23 21)" />
          <ellipse cx="15.5" cy="16" rx="1" ry="2.5" fill="#FECACA" opacity="0.7" transform="rotate(-20 15.5 16)" />
          <ellipse cx="22" cy="19.5" rx="0.8" ry="2.2" fill="#FED7AA" opacity="0.7" transform="rotate(25 22 19.5)" />
        </svg>
      );
    case 'addon-8': // Red Dates / Jujube
      return (
        <svg viewBox="0 0 40 40" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="8" fill="#191311" />
          <circle cx="20" cy="20" r="13" fill="#3D211A" opacity="0.6" />
          <ellipse cx="20" cy="20" rx="7.5" ry="11" fill="#78350F" transform="rotate(-15 20 20)" />
          <path d="M17 13C16 16 17 21 16 26M21 12C22 17 21 23 23 27" stroke="#92400E" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
          <ellipse cx="18" cy="16" rx="1.5" ry="4" fill="#B45309" opacity="0.7" transform="rotate(-15 18 16)" />
        </svg>
      );
    case 'addon-9': // Dried Longan
      return (
        <svg viewBox="0 0 40 40" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="8" fill="#1A1610" />
          <circle cx="20" cy="20" r="13" fill="#3A2D16" opacity="0.6" />
          <circle cx="20" cy="20" r="9" fill="#B45309" />
          <circle cx="20" cy="20" r="7" fill="#D97706" opacity="0.9" />
          <circle cx="21" cy="18" r="3" fill="#FBBF24" opacity="0.7" />
        </svg>
      );
    case 'addon-10': // Dried Pear Slice
      return (
        <svg viewBox="0 0 40 40" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="8" fill="#1A1810" />
          <circle cx="20" cy="20" r="13" fill="#3D361B" opacity="0.6" />
          <path d="M20 11C16 11 15 15 14 19C12 23 14 28 20 28C26 28 28 23 26 19C25 15 24 11 20 11Z" fill="#EAB308" opacity="0.85" />
          <circle cx="20" cy="21" r="2" fill="#713F12" />
          <path d="M20 9V11" stroke="#4D7C0F" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'addon-11': // Dried Apple Crisp
      return (
        <svg viewBox="0 0 40 40" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="8" fill="#1C1510" />
          <circle cx="20" cy="20" r="13" fill="#3E2B18" opacity="0.6" />
          <circle cx="20" cy="20" r="10" fill="#F59E0B" opacity="0.85" />
          <circle cx="20" cy="20" r="4.5" fill="#1C1510" />
          {/* Star core */}
          {[0, 72, 144, 216, 288].map((deg) => (
            <ellipse
              key={deg}
              cx="20"
              cy="20"
              rx="1"
              ry="2.5"
              fill="#FDE68A"
              transform={`rotate(${deg} 20 20)`}
            />
          ))}
        </svg>
      );
    case 'addon-12': // Dried Mango
      return (
        <svg viewBox="0 0 40 40" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="8" fill="#1C150E" />
          <circle cx="20" cy="20" r="13" fill="#422914" opacity="0.6" />
          <path d="M12 25C15 28 24 28 28 22C29 17 26 13 22 12C16 11 13 17 12 25Z" fill="#EA580C" />
          <path d="M14 23C17 26 23 25 26 21" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'addon-13': // Dried Lemon Slice
      return (
        <svg viewBox="0 0 40 40" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="8" fill="#1A180E" />
          <circle cx="20" cy="20" r="13" fill="#3D3716" opacity="0.6" />
          <circle cx="20" cy="20" r="10.5" stroke="#CA8A04" strokeWidth="2" fill="#EAB308" />
          <circle cx="20" cy="20" r="8" fill="#FEF08A" />
          {/* Segments */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <line
              key={deg}
              x1="20"
              y1="20"
              x2="20"
              y2="12.5"
              stroke="#CA8A04"
              strokeWidth="1.2"
              transform={`rotate(${deg} 20 20)`}
            />
          ))}
          <circle cx="20" cy="20" r="1.5" fill="#CA8A04" />
        </svg>
      );
    case 'addon-14': // Sun-Dried Orange Peel
    default:
      return (
        <svg viewBox="0 0 40 40" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="8" fill={isFruit ? '#1C150E' : '#1A1114'} />
          <circle cx="20" cy="20" r="13" fill={isFruit ? '#422914' : '#381017'} opacity="0.6" />
          {isFruit ? (
            <path d="M13 24C15 28 22 29 27 23C28 17 23 12 18 13C14 14 12 19 13 24Z" fill="#F97316" />
          ) : (
            <path d="M16 23C13 20 14 15 18 13C22 11 25 14 24 18C23 22 19 25 16 23Z" fill="#F43F5E" />
          )}
          <circle cx="20" cy="20" r="3" fill="#FEF08A" opacity="0.6" />
        </svg>
      );
  }
}

export function CustomizationModal({ product, isOpen, onClose }: CustomizationModalProps) {
  const { addToCart, setIsCartOpen } = useCart();

  const [servingSize, setServingSize] = useState<'regular' | 'pot'>('regular');
  const [temperature, setTemperature] = useState<'hot' | 'iced'>('hot');
  const [iceLevel, setIceLevel] = useState<'less' | 'normal'>('normal');
  const [sweetnessLevel, setSweetnessLevel] = useState<'0%' | '30%' | '50%' | '75%' | '100%'>('0%');
  const [sweetenerType, setSweetenerType] = useState<'sorghum' | 'honey' | 'stevia'>('sorghum');
  const [selectedAddons, setSelectedAddons] = useState<BotanicalAddon[]>([]);
  const [addonFilter, setAddonFilter] = useState<'all' | 'flower' | 'fruit'>('all');
  const [notes, setNotes] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const basePrice = product.price || 20000;
  const potExtra = servingSize === 'pot' ? 12000 : 0;
  const iceExtra = temperature === 'iced' ? 2000 : 0;
  const sweetenerExtra = sweetnessLevel !== '0%' && sweetenerType === 'honey' ? 3000 : 0;
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);

  const unitPrice = basePrice + potExtra + iceExtra + sweetenerExtra + addonsTotal;
  const totalPrice = unitPrice * quantity;

  const toggleAddon = (addon: BotanicalAddon) => {
    setSelectedAddons((prev) => {
      const exists = prev.some((a) => a.id === addon.id);
      if (exists) {
        return prev.filter((a) => a.id !== addon.id);
      } else {
        return [...prev, addon];
      }
    });
  };

  const handleAddToCart = () => {
    addToCart({
      product_id: product.id,
      product_name: product.name,
      product_slug: product.slug,
      product_image: product.featured_image || null,
      serving_size: servingSize,
      temperature,
      sweetness_level: sweetnessLevel,
      sweetener_type: sweetnessLevel !== '0%' ? sweetenerType : undefined,
      ice_level: temperature === 'iced' ? iceLevel : undefined,
      selected_addons: selectedAddons,
      unit_price: unitPrice,
      quantity,
      item_notes: notes.trim() || undefined,
    });
    onClose();
    setIsCartOpen(true);
  };

  const activeSweetness = SWEETNESS_OPTIONS.find((o) => o.level === sweetnessLevel) || SWEETNESS_OPTIONS[0];

  // Resolve category / seasonal badge
  const categoryBadge = product.category?.name?.toUpperCase() || 'AUTUMN BLENDS (MUSIM GUGUR)';

  // Resolve product image for the visual showcase column
  const showcaseImage = product.featured_image || '/images/products/cold-dew.jpg';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto font-sans select-none animate-in fade-in duration-200">
      {/* Luxury Dark Backdrop with Blur */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Split Modal Container (Matched to pop_up_custom_order.png) */}
      <div className="relative w-full max-w-[960px] bg-[#121619] border border-[#272E34] text-white rounded-[22px] sm:rounded-[24px] shadow-2xl overflow-hidden z-10 flex flex-col md:flex-row max-h-[92vh] md:h-[660px] lg:h-[690px] animate-in zoom-in-95 duration-200">
        
        {/* =========================================================================
            LEFT COLUMN: ATMOSPHERIC ARTISANAL PHOTOGRAPHY & BRAND STORY
            ========================================================================= */}
        <div className="relative w-full md:w-[40%] lg:w-[42%] min-h-[240px] sm:min-h-[280px] md:min-h-full bg-[#0D1012] shrink-0 flex flex-col justify-between overflow-hidden">
          {/* Full-bleed photography */}
          <div className="absolute inset-0">
            <Image
              src={showcaseImage}
              alt={product.name}
              fill
              priority
              className="object-cover object-center scale-105"
            />
            {/* Deep Cinematic Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#121619] via-[#121619]/40 to-black/25 pointer-events-none" />
          </div>

          {/* Top-Left Floating Badge */}
          <div className="relative z-10 p-5 sm:p-6">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-white text-[11px] sm:text-xs font-medium tracking-wide shadow-md">
              <Leaf className="w-3.5 h-3.5 text-white/90" />
              <span>Herbal Drink</span>
            </div>
          </div>

          {/* Bottom Poetic Narrative Overlay */}
          <div className="relative z-10 p-6 sm:p-7 md:p-8 mt-auto">
            {/* Gold Accent Divider Bar */}
            <div className="w-7 h-[2px] bg-[#D4A373] mb-3 rounded-full" />

            <h3 className="font-serif italic text-lg sm:text-xl text-white font-normal leading-snug tracking-wide">
              Tradisional. Alami. Menyehatkan.
            </h3>
            
            <p className="text-[11.5px] sm:text-xs text-neutral-300/90 leading-relaxed font-sans font-light mt-2 max-w-xs sm:max-w-sm">
              Perpaduan jahe dan rempah alami untuk menjaga daya tahan tubuh dan menghangatkan badan, terutama di musim dingin.
            </p>
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN: CUSTOMIZATION CONTROLS & LUXURY SELECTIONS
            ========================================================================= */}
        <div className="flex-1 flex flex-col bg-[#121619] text-white relative min-w-0">
          
          {/* Header Bar */}
          <div className="pt-5 px-5 sm:pt-6 sm:px-7 md:pt-7 md:px-8 pb-3 border-b border-[#1E252B] shrink-0">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 pr-2">
                <span className="text-[10px] sm:text-[10.5px] font-mono tracking-[0.14em] text-neutral-400 font-bold uppercase block truncate">
                  {categoryBadge}
                </span>
                <h2 className="font-serif text-xl sm:text-2xl md:text-[26px] font-medium text-white uppercase tracking-normal mt-1 leading-tight truncate">
                  {product.name}
                </h2>
                <p className="text-[11.5px] sm:text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                  {product.tagline || product.description || 'Cold Dew (寒露) • Warming ginger and naturally sweet dates, for the first wet evenings.'}
                </p>
              </div>

              {/* Minimal Clean Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer shrink-0 -mt-1 -mr-1"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Customization Body */}
          <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6 md:px-8 md:py-6 space-y-6 text-xs font-sans">
            
            {/* -------------------------------------------------------------
                SECTION 1: SERVING TEMPERATURE
                ------------------------------------------------------------- */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#23292F] border border-[#323B44] text-neutral-200 text-[10px] font-bold flex items-center justify-center shrink-0">
                    1
                  </span>
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    SERVING TEMPERATURE
                  </span>
                </div>
                <span className="text-[10.5px] text-neutral-400 font-medium">
                  {temperature === 'iced' ? '+Rp 2.000' : 'No extra charge'}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 pl-7 mb-3">
                Pilih suhu penyajian yang sesuai dengan selera Anda.
              </p>

              <div className="grid grid-cols-2 gap-3 pl-0 sm:pl-7">
                {/* Hot Card */}
                <button
                  type="button"
                  onClick={() => setTemperature('hot')}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
                    temperature === 'hot'
                      ? 'border-[#C5A376] bg-[#191D21] ring-1 ring-[#C5A376]/25 text-white'
                      : 'border-[#262D33] bg-[#15191C]/80 hover:border-neutral-700 text-neutral-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <Flame className={`w-4 h-4 shrink-0 ${temperature === 'hot' ? 'text-[#D4A373]' : 'text-neutral-500'}`} />
                    <div className="min-w-0">
                      <span className="text-xs font-bold tracking-wide uppercase block truncate text-white">
                        HOT (90&deg;C)
                      </span>
                      <span className="text-[10px] text-neutral-400 block truncate mt-0.5">
                        Hangat, menenangkan (Free)
                      </span>
                    </div>
                  </div>

                  {/* Radio Indicator */}
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                    temperature === 'hot' ? 'border-[#D4A373]' : 'border-neutral-600'
                  }`}>
                    {temperature === 'hot' && <div className="w-2 h-2 rounded-full bg-[#D4A373]" />}
                  </div>
                </button>

                {/* Iced Card */}
                <button
                  type="button"
                  onClick={() => setTemperature('iced')}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
                    temperature === 'iced'
                      ? 'border-[#C5A376] bg-[#191D21] ring-1 ring-[#C5A376]/25 text-white'
                      : 'border-[#262D33] bg-[#15191C]/80 hover:border-neutral-700 text-neutral-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <Snowflake className={`w-4 h-4 shrink-0 ${temperature === 'iced' ? 'text-sky-400' : 'text-neutral-500'}`} />
                    <div className="min-w-0">
                      <span className="text-xs font-bold tracking-wide uppercase block truncate text-white">
                        ICED (+RP 2,000)
                      </span>
                      <span className="text-[10px] text-neutral-400 block truncate mt-0.5">
                        Segar dengan sensasi kristal
                      </span>
                    </div>
                  </div>

                  {/* Radio Indicator */}
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                    temperature === 'iced' ? 'border-[#D4A373]' : 'border-neutral-600'
                  }`}>
                    {temperature === 'iced' && <div className="w-2 h-2 rounded-full bg-[#D4A373]" />}
                  </div>
                </button>
              </div>

              {/* Sub-option: Ice Level (Shown when Iced is Selected) */}
              {temperature === 'iced' && (
                <div className="mt-3 pl-0 sm:pl-7 animate-in fade-in duration-200">
                  <div className="p-3 rounded-xl bg-[#15191C] border border-[#262D33] space-y-2">
                    <span className="text-[10.5px] font-mono uppercase tracking-wider text-neutral-400 font-semibold block">
                      Tingkat Kepadatan Es (Ice Level):
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'less' as const, label: 'Less Ice', note: 'Rasa teh lebih pekat' },
                        { id: 'normal' as const, label: 'Normal Ice', note: 'Kesejukan kristal optimal' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setIceLevel(item.id)}
                          className={`py-2 px-3 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between ${
                            iceLevel === item.id
                              ? 'border-[#C5A376] bg-[#1E2328] text-white'
                              : 'border-[#262D33] bg-[#121619] text-neutral-400 hover:text-white'
                          }`}
                        >
                          <div>
                            <span className="text-xs font-bold block">{item.label}</span>
                            <span className="text-[9.5px] text-neutral-400 block">{item.note}</span>
                          </div>
                          {iceLevel === item.id && <Check className="w-3.5 h-3.5 text-[#D4A373]" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* -------------------------------------------------------------
                SECTION 2: SWEETNESS LEVEL
                ------------------------------------------------------------- */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#23292F] border border-[#323B44] text-neutral-200 text-[10px] font-bold flex items-center justify-center shrink-0">
                    2
                  </span>
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    SWEETNESS LEVEL
                  </span>
                </div>
                <span className="text-[10.5px] text-neutral-400 font-medium">
                  Default: Unsweetened
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 pl-7 mb-3">
                Tingkat kemanisan sesuai selera Anda.
              </p>

              {/* 5 Sweetness Buttons Grid */}
              <div className="grid grid-cols-5 gap-2 pl-0 sm:pl-7">
                {SWEETNESS_OPTIONS.map((opt) => {
                  const isSelected = sweetnessLevel === opt.level;
                  const shortName = opt.title.split(' ')[0].toUpperCase();

                  return (
                    <button
                      key={opt.level}
                      type="button"
                      onClick={() => setSweetnessLevel(opt.level as any)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-[62px] ${
                        isSelected
                          ? 'border-[#C5A376] bg-[#191D21] text-white ring-1 ring-[#C5A376]/25'
                          : 'border-[#262D33] bg-[#15191C]/70 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className={`font-mono font-bold text-xs ${isSelected ? 'text-white' : 'text-neutral-300'}`}>
                          {opt.level}
                        </span>
                        <div className={`w-2.5 h-2.5 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-[#D4A373] bg-[#D4A373]' : 'border-neutral-600'
                        }`} />
                      </div>
                      <span className={`text-[9px] uppercase tracking-wider font-semibold truncate block ${
                        isSelected ? 'text-white' : 'text-neutral-500'
                      }`}>
                        {shortName}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Dark Forest Green Subtitle Pill (Identical to Screenshot) */}
              <div className="mt-2.5 ml-0 sm:ml-7 p-2.5 sm:py-2.5 sm:px-3 rounded-xl bg-[#12221E] border border-[#1B3830] text-neutral-200 text-[11px] flex items-center gap-2.5">
                <Leaf className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">
                  <strong className="text-white font-semibold">{activeSweetness.title}:</strong>{' '}
                  <span className="text-neutral-300">{activeSweetness.subtitle}</span>
                </span>
              </div>

              {/* Natural Sweetener Type (Shown when Sweetness > 0%) */}
              {sweetnessLevel !== '0%' && (
                <div className="mt-3 pl-0 sm:pl-7 animate-in fade-in duration-200">
                  <span className="text-[10.5px] font-mono uppercase tracking-wider text-neutral-400 font-semibold block mb-2">
                    Sumber Pemanis Alami (Natural Sweetener):
                  </span>
                  <div className="space-y-2">
                    {SWEETENER_TYPES.map((sw) => {
                      const isSelected = sweetenerType === sw.id;
                      return (
                        <button
                          key={sw.id}
                          type="button"
                          onClick={() => setSweetenerType(sw.id)}
                          className={`w-full flex items-center justify-between p-2.5 sm:p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[#C5A376] bg-[#191D21] text-white ring-1 ring-[#C5A376]/25'
                              : 'border-[#262D33] bg-[#15191C]/70 hover:border-neutral-700 text-neutral-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 pr-2">
                            <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                              isSelected ? 'border-[#D4A373]' : 'border-neutral-600'
                            }`}>
                              {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-[#D4A373]" />}
                            </div>
                            <div className="min-w-0">
                              <span className="font-semibold text-xs text-white block truncate">{sw.name}</span>
                              <span className="text-[10px] text-neutral-400 block truncate">{sw.desc}</span>
                            </div>
                          </div>
                          <span className="font-mono font-bold text-xs text-neutral-200 shrink-0 ml-2">
                            {sw.price > 0 ? `+${formatRupiah(sw.price)}` : 'Included'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* -------------------------------------------------------------
                SECTION 3: BOTANICAL FLOWER & FRUIT INFUSIONS
                ------------------------------------------------------------- */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#23292F] border border-[#323B44] text-neutral-200 text-[10px] font-bold flex items-center justify-center shrink-0">
                    3
                  </span>
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    BOTANICAL FLOWER INFUSIONS
                  </span>
                </div>
                <span className="text-[10.5px] text-neutral-400 font-medium">
                  {selectedAddons.length > 0 ? `${selectedAddons.length} dipilih` : 'Optional (Select multi)'}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 pl-7 mb-3">
                Tambahkan sentuhan bunga pilihan untuk pengalaman yang lebih istimewa.
              </p>

              {/* Filter Tabs for Bunga Kering & Buah Kering */}
              <div className="flex items-center gap-1.5 mb-3 ml-0 sm:ml-7 p-1 bg-[#161B1E] border border-[#262D33] rounded-xl">
                <button
                  type="button"
                  onClick={() => setAddonFilter('all')}
                  className={`flex-1 py-1 px-2 rounded-lg text-[10.5px] font-sans font-medium transition-all text-center cursor-pointer ${
                    addonFilter === 'all'
                      ? 'bg-[#232A30] text-white font-bold border border-white/10 shadow-xs'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Semua ({BOTANICAL_ADDONS.length})
                </button>
                <button
                  type="button"
                  onClick={() => setAddonFilter('flower')}
                  className={`flex-1 py-1 px-2 rounded-lg text-[10.5px] font-sans font-medium transition-all text-center cursor-pointer flex items-center justify-center gap-1 ${
                    addonFilter === 'flower'
                      ? 'bg-[#232A30] text-white font-bold border border-white/10 shadow-xs'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <span>🌸 Bunga Kering</span>
                  {selectedAddons.filter((a) => a.category === 'flower').length > 0 && (
                    <span className="w-4 h-4 rounded-full bg-rose-500/80 text-white text-[9px] font-bold flex items-center justify-center">
                      {selectedAddons.filter((a) => a.category === 'flower').length}
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setAddonFilter('fruit')}
                  className={`flex-1 py-1 px-2 rounded-lg text-[10.5px] font-sans font-medium transition-all text-center cursor-pointer flex items-center justify-center gap-1 ${
                    addonFilter === 'fruit'
                      ? 'bg-[#232A30] text-white font-bold border border-white/10 shadow-xs'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <span>🍊 Buah Kering</span>
                  {selectedAddons.filter((a) => a.category === 'fruit').length > 0 && (
                    <span className="w-4 h-4 rounded-full bg-amber-500/80 text-white text-[9px] font-bold flex items-center justify-center">
                      {selectedAddons.filter((a) => a.category === 'fruit').length}
                    </span>
                  )}
                </button>
              </div>

              {/* Addons List matching pop_up_custom_order.png card style */}
              <div className="space-y-2 ml-0 sm:ml-7 max-h-56 overflow-y-auto pr-1">
                {BOTANICAL_ADDONS.filter(
                  (addon) => addonFilter === 'all' || addon.category === addonFilter
                ).map((addon) => {
                  const isSelected = selectedAddons.some((a) => a.id === addon.id);

                  return (
                    <button
                      key={addon.id}
                      type="button"
                      onClick={() => toggleAddon(addon)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#C5A376] bg-[#1A1F23] text-white ring-1 ring-[#C5A376]/25'
                          : 'border-[#262D33] bg-[#15191C] hover:border-neutral-700 text-neutral-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        {/* Checkbox square */}
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                            isSelected
                              ? 'bg-[#C5A376] border-[#C5A376] text-neutral-900'
                              : 'border-neutral-600 bg-transparent'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>

                        {/* Botanical Thumbnail */}
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg overflow-hidden shrink-0 border border-white/5 bg-[#0F1316]">
                          <BotanicalThumbnail addon={addon} />
                        </div>

                        {/* Name and note */}
                        <div className="min-w-0">
                          <span className="font-medium text-xs text-neutral-200 block truncate">
                            {addon.name}
                          </span>
                          {addon.note && (
                            <span className="text-[10px] text-neutral-400 block truncate font-normal">
                              {addon.note}
                            </span>
                          )}
                        </div>
                      </div>

                      <span className="font-mono font-bold text-xs text-neutral-200 shrink-0 ml-2">
                        +{formatRupiah(addon.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* -------------------------------------------------------------
                SECTION 4: BARISTA NOTES (OPTIONAL)
                ------------------------------------------------------------- */}
            <div className="pt-1">
              <label className="block text-[10.5px] font-mono uppercase tracking-wider text-neutral-400 font-semibold mb-1.5 ml-0 sm:ml-7">
                Catatan Khusus Barista (Opsional)
              </label>
              <div className="ml-0 sm:ml-7">
                <input
                  type="text"
                  placeholder="Contoh: Pisahkan es batu, seduh ekstra panas..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#15191C] border border-[#262D33] rounded-xl px-3.5 py-2.5 text-xs text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-[#C5A376] font-sans"
                  maxLength={150}
                />
              </div>
            </div>

          </div>

          {/* =========================================================================
              BOTTOM ACTION BAR: QUANTITY PILL & WARM HONEY ADD TO BAG CTA
              ========================================================================= */}
          <div className="p-4 sm:p-5 md:p-6 border-t border-[#1E252B] bg-[#121619] flex items-center gap-3 shrink-0">
            {/* Quantity Selector Capsule */}
            <div className="flex items-center justify-between border border-[#283038] rounded-xl bg-[#171C20] px-2 py-1.5 min-w-[104px]">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="p-1.5 text-neutral-400 hover:text-white disabled:opacity-30 transition-colors cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-xs font-bold text-white px-2">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="p-1.5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Warm Camel Gold ADD TO BAG CTA Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 py-3.5 px-5 sm:px-6 rounded-xl bg-[#D4B78F] hover:bg-[#C8AA80] active:scale-[0.99] text-neutral-900 font-sans font-bold text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-between shadow-lg cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-neutral-900 stroke-[2.2]" />
                <span>ADD TO BAG</span>
              </span>
              <span className="font-mono font-bold text-neutral-900">
                {formatRupiah(totalPrice)}
              </span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
