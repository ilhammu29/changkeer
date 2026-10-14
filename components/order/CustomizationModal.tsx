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

export function CustomizationModal({ product, isOpen, onClose }: CustomizationModalProps) {
  const { addToCart, setIsCartOpen } = useCart();

  const [servingSize, setServingSize] = useState<'regular' | 'pot'>('regular');
  const [temperature, setTemperature] = useState<'hot' | 'iced'>('hot');
  const [sweetnessLevel, setSweetnessLevel] = useState<'0%' | '25%' | '50%' | '100%'>('0%');
  const [iceLevel, setIceLevel] = useState<'normal' | 'less' | 'none'>('normal');
  const [selectedAddons, setSelectedAddons] = useState<BotanicalAddon[]>([]);
  const [notes, setNotes] = useState('');
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !product) return null;

  const basePrice = product.price || 28000;
  const potExtra = servingSize === 'pot' ? 12000 : 0;
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const unitPrice = basePrice + potExtra + addonsTotal;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto font-sans select-none">
      {/* Soft Backdrop */}
      <div 
        className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white border border-neutral-200/90 text-neutral-900 rounded-xl shadow-2xl overflow-hidden z-10 my-8 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="relative p-6 border-b border-neutral-100 bg-[#FAFAF8]">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 border border-neutral-200 transition-colors z-10 cursor-pointer shadow-2xs"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex gap-4 items-start">
            {product.featured_image ? (
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-neutral-200 bg-white shrink-0">
                <Image
                  src={product.featured_image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : null}

            <div className="flex-1 pr-6">
              <span className="text-[10px] font-sans uppercase tracking-widest text-neutral-400 font-bold block mb-1">
                {product.category?.name || 'RACIKAN KHUSUS'}
              </span>
              <h3 className="font-sans font-black text-lg uppercase tracking-tight text-neutral-900 leading-snug">
                {product.name}
              </h3>
              <p className="text-xs font-sans text-neutral-500 mt-1 line-clamp-2">
                {product.tagline || product.description}
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Body Customization Controls */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs font-sans">
          
          {/* Temperature Options */}
          <div>
            <label className="block text-[10px] font-sans uppercase tracking-widest text-neutral-400 font-bold mb-2">
              Suhu Seduhan *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTemperature('hot')}
                className={`flex items-center justify-center gap-2 p-3 rounded-2xl border transition-all cursor-pointer ${
                  temperature === 'hot'
                    ? 'border-amber-600 bg-amber-50/70 text-amber-900 font-bold shadow-2xs'
                    : 'border-neutral-200 hover:border-neutral-300 text-neutral-700 bg-white'
                }`}
              >
                <Flame className="w-4 h-4 text-amber-600" />
                <span className="uppercase tracking-wider font-semibold">Hangat (90&deg;C)</span>
              </button>

              <button
                type="button"
                onClick={() => setTemperature('iced')}
                className={`flex items-center justify-center gap-2 p-3 rounded-2xl border transition-all cursor-pointer ${
                  temperature === 'iced'
                    ? 'border-sky-600 bg-sky-50/70 text-sky-900 font-bold shadow-2xs'
                    : 'border-neutral-200 hover:border-neutral-300 text-neutral-700 bg-white'
                }`}
              >
                <Snowflake className="w-4 h-4 text-sky-600" />
                <span className="uppercase tracking-wider font-semibold">Dingin (Cold Brew)</span>
              </button>
            </div>
          </div>

          {/* Sweetness Level */}
          <div>
            <label className="block text-[10px] font-sans uppercase tracking-widest text-neutral-400 font-bold mb-2">
              Tingkat Kemanisan *
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['0%', '25%', '50%', '100%'] as const).map(lvl => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSweetnessLevel(lvl)}
                  className={`py-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    sweetnessLevel === lvl
                      ? 'border-neutral-900 bg-neutral-900 text-white font-bold shadow-2xs'
                      : 'border-neutral-200 hover:border-neutral-300 text-neutral-700 bg-white'
                  }`}
                >
                  <span className="font-sans font-bold text-xs block">{lvl}</span>
                  <span className="text-[9px] uppercase tracking-wider block text-neutral-400 font-normal">
                    {lvl === '0%' ? 'Murni' : lvl === '25%' ? 'Less' : lvl === '50%' ? 'Medium' : 'Normal'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Botanical Add-ons */}
          <div>
            <label className="block text-[10px] font-sans uppercase tracking-widest text-neutral-400 font-bold mb-2">
              Botanical Infusions (Opsional)
            </label>
            <div className="space-y-2">
              {BOTANICAL_ADDONS.map(addon => {
                const isSelected = selectedAddons.some(a => a.id === addon.id);
                return (
                  <button
                    key={addon.id}
                    type="button"
                    onClick={() => toggleAddon(addon)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all cursor-pointer ${
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
                      <span className="font-medium">{addon.name}</span>
                    </div>
                    <span className="font-sans font-bold text-xs text-neutral-800">
                      +{formatRupiah(addon.price)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Special Barista Notes */}
          <div>
            <label className="block text-[10px] font-sans uppercase tracking-widest text-neutral-400 font-bold mb-1.5">
              Catatan Khusus untuk Barista (Opsional)
            </label>
            <input
              type="text"
              placeholder="Contoh: Pisahkan es batu, sajikan lebih panas..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full bg-[#FAFAF8] border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 font-sans"
              maxLength={150}
            />
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-neutral-100 bg-white flex items-center justify-between gap-4 font-sans">
          <div className="flex items-center border border-neutral-200 rounded-xl bg-neutral-50 overflow-hidden shadow-2xs">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-2 text-neutral-600 hover:bg-neutral-100 transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-3 py-2 font-sans text-xs font-bold text-neutral-900">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="px-3 py-2 text-neutral-600 hover:bg-neutral-100 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="flex-1 py-3 px-5 rounded-2xl bg-neutral-900 hover:bg-neutral-800 active:scale-98 text-white font-sans font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-between shadow-xs cursor-pointer"
          >
            <span>Tambah ke Keranjang</span>
            <span className="font-sans font-bold">{formatRupiah(totalPrice)}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
