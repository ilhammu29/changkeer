'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Plus, Minus, Flame, Snowflake, Sparkles, Check } from 'lucide-react';
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
    desc: 'Zero-calorie, 100% plant-based',
    price: 0,
  },
] as const;

export function CustomizationModal({ product, isOpen, onClose }: CustomizationModalProps) {
  const { addToCart, setIsCartOpen } = useCart();

  const [servingSize, setServingSize] = useState<'regular' | 'pot'>('regular');
  const [temperature, setTemperature] = useState<'hot' | 'iced'>('hot');
  const [iceLevel, setIceLevel] = useState<'less' | 'normal'>('normal');
  const [sweetnessLevel, setSweetnessLevel] = useState<'0%' | '30%' | '50%' | '75%' | '100%'>('0%');
  const [sweetenerType, setSweetenerType] = useState<'sorghum' | 'honey' | 'stevia'>('sorghum');
  const [selectedAddons, setSelectedAddons] = useState<BotanicalAddon[]>([]);
  const [notes, setNotes] = useState('');
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !product) return null;

  const basePrice = product.price || 28000;
  const potExtra = servingSize === 'pot' ? 12000 : 0;
  const iceExtra = temperature === 'iced' ? 2000 : 0;
  const sweetenerExtra = sweetnessLevel !== '0%' && sweetenerType === 'honey' ? 3000 : 0;
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);

  const unitPrice = basePrice + potExtra + iceExtra + sweetenerExtra + addonsTotal;
  const totalPrice = unitPrice * quantity;

  const toggleAddon = (addon: BotanicalAddon) => {
    setSelectedAddons(prev => {
      const exists = prev.some(a => a.id === addon.id);
      if (exists) {
        return prev.filter(a => a.id !== addon.id);
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-sans select-none">
      {/* Soft Backdrop */}
      <div 
        className="fixed inset-0 bg-neutral-900/50 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white border border-neutral-200 text-neutral-900 rounded-2xl shadow-2xl overflow-hidden z-10 my-6 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="relative p-5 sm:p-6 border-b border-neutral-100 bg-[#FAFAF8]">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 border border-neutral-200 transition-colors z-10 cursor-pointer shadow-2xs"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex gap-4 items-start">
            {product.featured_image ? (
              <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-neutral-200 bg-white shrink-0">
                <Image
                  src={product.featured_image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : null}

            <div className="flex-1 pr-6">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold block mb-1">
                {product.category?.name || 'SIGNATURE BLEND'}
              </span>
              <h3 className="font-sans font-black text-base sm:text-lg uppercase tracking-tight text-neutral-900 leading-snug">
                {product.name}
              </h3>
              <p className="text-xs font-sans text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                {product.tagline || product.description}
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Body Customization Controls */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs font-sans">
          
          {/* 1. Temperature Options */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 font-bold">
                1. Serving Temperature *
              </label>
              <span className="text-[10px] text-neutral-400 font-medium">
                {temperature === 'iced' ? 'Iced (+Rp 2,000)' : 'No extra charge'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setTemperature('hot')}
                className={`flex flex-col items-start p-3 rounded-xl border transition-all cursor-pointer text-left ${
                  temperature === 'hot'
                    ? 'border-amber-600 bg-amber-50/80 text-amber-950 font-bold shadow-2xs ring-1 ring-amber-600'
                    : 'border-neutral-200 hover:border-neutral-300 text-neutral-700 bg-white'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Flame className="w-4 h-4 text-amber-600" />
                  <span className="uppercase tracking-wider font-bold text-xs">Hot (90&deg;C)</span>
                </div>
                <span className="text-[10px] font-normal text-neutral-500">
                  Warm, calming steeping (Free)
                </span>
              </button>

              <button
                type="button"
                onClick={() => setTemperature('iced')}
                className={`flex flex-col items-start p-3 rounded-xl border transition-all cursor-pointer text-left ${
                  temperature === 'iced'
                    ? 'border-sky-600 bg-sky-50/80 text-sky-950 font-bold shadow-2xs ring-1 ring-sky-600'
                    : 'border-neutral-200 hover:border-neutral-300 text-neutral-700 bg-white'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <div className="flex items-center gap-1.5">
                    <Snowflake className="w-4 h-4 text-sky-600" />
                    <span className="uppercase tracking-wider font-bold text-xs">Iced (+Rp 2,000)</span>
                  </div>
                </div>
                <span className="text-[10px] font-normal text-neutral-500">
                  Crisp chill with crystal ice
                </span>
              </button>
            </div>
          </div>

          {/* 2. Ice Level (Only when Iced is chosen) */}
          {temperature === 'iced' && (
            <div className="animate-in fade-in duration-200">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 font-bold mb-2">
                2. Ice Level *
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  {
                    id: 'less' as const,
                    label: 'Less Ice',
                    desc: 'Stronger tea flavor, slow dilution',
                  },
                  {
                    id: 'normal' as const,
                    label: 'Normal Ice',
                    desc: 'Optimal crisp, refreshing chill',
                  },
                ].map((item) => {
                  const isSelected = iceLevel === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setIceLevel(item.id)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                          : 'border-neutral-200 hover:border-neutral-300 text-neutral-700 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs">{item.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <span className={`text-[10px] block leading-tight ${isSelected ? 'text-neutral-300' : 'text-neutral-400'}`}>
                        {item.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. Sugar / Sweetness Level */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 font-bold">
                {temperature === 'iced' ? '3' : '2'}. Sweetness Level *
              </label>
              <span className="text-[10px] text-neutral-400 font-medium">Default: Unsweetened</span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {SWEETNESS_OPTIONS.map((opt) => (
                <button
                  key={opt.level}
                  type="button"
                  onClick={() => setSweetnessLevel(opt.level as any)}
                  className={`py-2 rounded-xl border text-center transition-all cursor-pointer ${
                    sweetnessLevel === opt.level
                      ? 'border-neutral-900 bg-neutral-900 text-white font-bold shadow-2xs'
                      : 'border-neutral-200 hover:border-neutral-300 text-neutral-700 bg-white'
                  }`}
                >
                  <span className="font-mono font-bold text-xs block">{opt.level}</span>
                  <span className="text-[9px] uppercase tracking-wider block opacity-75 font-medium truncate px-0.5">
                    {opt.title.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
            
            {/* Active Sweetness Subtitle Description */}
            <div className="mt-2 p-2.5 rounded-xl bg-neutral-50 border border-neutral-200/80 text-neutral-600 text-[11px] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
              <span>
                <strong>{SWEETNESS_OPTIONS.find(o => o.level === sweetnessLevel)?.title}:</strong>{' '}
                {SWEETNESS_OPTIONS.find(o => o.level === sweetnessLevel)?.subtitle}
              </span>
            </div>
          </div>

          {/* 4. Natural Sweetener Source (Shown when Sweetness > 0%) */}
          {sweetnessLevel !== '0%' && (
            <div className="animate-in fade-in duration-200">
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 font-bold">
                  {temperature === 'iced' ? '4' : '3'}. Natural Sweetener Type
                </label>
                <span className="text-[10px] text-emerald-700 font-semibold">100% Unrefined &amp; Pure</span>
              </div>
              <div className="space-y-2">
                {SWEETENER_TYPES.map((sw) => {
                  const isSelected = sweetenerType === sw.id;
                  return (
                    <button
                      key={sw.id}
                      type="button"
                      onClick={() => setSweetenerType(sw.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-neutral-900 bg-neutral-50/80 text-neutral-900 font-semibold'
                          : 'border-neutral-200 hover:border-neutral-300 text-neutral-700 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                          isSelected ? 'border-neutral-900 bg-neutral-900 text-white' : 'border-neutral-300 bg-white'
                        }`}>
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <div>
                          <span className="font-bold text-xs text-neutral-900 block">{sw.name}</span>
                          <span className="text-[10px] text-neutral-500 block">{sw.desc}</span>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-xs text-neutral-800">
                        {sw.price > 0 ? `+${formatRupiah(sw.price)}` : 'Included'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 5. Botanical Flower Infusion Toppings */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 font-bold">
                {temperature === 'iced' ? (sweetnessLevel !== '0%' ? '5' : '4') : (sweetnessLevel !== '0%' ? '4' : '3')}. Botanical Flower Infusions
              </label>
              <span className="text-[10px] text-neutral-400 font-medium">Optional (Select multi)</span>
            </div>
            <div className="space-y-2">
              {BOTANICAL_ADDONS.map(addon => {
                const isSelected = selectedAddons.some(a => a.id === addon.id);
                return (
                  <button
                    key={addon.id}
                    type="button"
                    onClick={() => toggleAddon(addon)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-neutral-900 bg-neutral-50 text-neutral-900 font-semibold'
                        : 'border-neutral-200 hover:border-neutral-300 text-neutral-700 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-neutral-900 border-neutral-900 text-white' : 'border-neutral-300 bg-white'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <span className="font-medium text-xs text-neutral-900">{addon.name}</span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-xs text-neutral-800">
                      +{formatRupiah(addon.price)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6. Special Barista Notes */}
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-500 font-bold mb-1.5">
              Special Barista Instructions (Optional)
            </label>
            <input
              type="text"
              placeholder="E.g. Separate ice crystals, extra hot brew..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full bg-[#FAFAF8] border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 font-sans"
              maxLength={150}
            />
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-neutral-100 bg-white flex items-center justify-between gap-3 font-sans">
          <div className="flex items-center border border-neutral-200 rounded-xl bg-neutral-50 overflow-hidden shadow-2xs">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="px-3 py-2 text-neutral-600 hover:bg-neutral-100 disabled:opacity-30 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-3 py-2 font-mono text-xs font-bold text-neutral-900">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="px-3 py-2 text-neutral-600 hover:bg-neutral-100 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="flex-1 py-3 px-5 rounded-xl bg-neutral-900 hover:bg-neutral-800 active:scale-98 text-white font-sans font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-between shadow-xs cursor-pointer"
          >
            <span>Add to Bag</span>
            <span className="font-mono font-bold">{formatRupiah(totalPrice)}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
