'use client';

import React, { useState } from 'react';
import { Leaf, Sparkles, Flame, RotateCw, Check } from 'lucide-react';
import {
  DRIED_FRUITS,
  DRIED_FLOWERS,
  SWEETENERS,
  AddOnItem,
} from '@/lib/data/solarTerms';

interface AtelierCategory {
  id: 'fruits' | 'flowers' | 'sweeteners';
  num: string;
  title: string;
  subtitle: string;
  icon: typeof Leaf;
  items: AddOnItem[];
  color: string;
  badgeColor: string;
  calloutTitle: string;
  calloutText: string;
  pairingBlend: string;
}

const CATEGORIES: AtelierCategory[] = [
  {
    id: 'fruits',
    num: 'ATELIER 01',
    title: 'Sun-Dried Fruits',
    subtitle: 'Dehydrated whole fruits for natural tartness & fruit depth',
    icon: Leaf,
    items: DRIED_FRUITS,
    color: 'amber',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    calloutTitle: 'SOMMELIER PAIRING & SYNERGY NOTE',
    calloutText:
      'Sun-dried fruits release wholesome natural fructose without processed sugar. Best paired with earthy autumn roots and winter cinnamon brews.',
    pairingBlend: 'Recommended with Major Cold & Autumn Harvest blends.',
  },
  {
    id: 'flowers',
    num: 'ATELIER 02',
    title: 'Dried Flowers',
    subtitle: 'Whole aromatic petals sourced from highland growers',
    icon: Sparkles,
    items: DRIED_FLOWERS,
    color: 'rose',
    badgeColor: 'bg-rose-50 text-rose-800 border-rose-200',
    calloutTitle: 'VOLATILE ESSENCE & INFUSION NOTE',
    calloutText:
      'Delicate highland flower petals steep optimally between 85°C–90°C. They release calming floral terpenes that elevate light jasmine and mint bases.',
    pairingBlend: 'Recommended with Spring Equinox & Pure Jasmine infusions.',
  },
  {
    id: 'sweeteners',
    num: 'ATELIER 03',
    title: 'Natural Sweeteners',
    subtitle: 'Unrefined traditional plant-based nectar & sorghum syrup',
    icon: Flame,
    items: SWEETENERS,
    color: 'emerald',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    calloutTitle: 'UNREFINED SWEETNESS STANDARD',
    calloutText:
      'All Changkeer cups are completely unsweetened by default. Add a touch of sorghum or raw wild honey for a comforting caramel note on rainy days.',
    pairingBlend: 'Recommended with Warming Ginger & Serai infusions.',
  },
];

export function BotanicalAddonsInteractive() {
  const [selectedId, setSelectedId] = useState<'fruits' | 'flowers' | 'sweeteners'>('fruits');
  const [spinningId, setSpinningId] = useState<string | null>(null);

  const handleSelect = (id: 'fruits' | 'flowers' | 'sweeteners') => {
    setSelectedId(id);
    // Trigger 360-degree rotation animation on click
    setSpinningId(id);
    setTimeout(() => {
      setSpinningId(null);
    }, 750);
  };

  const handleManualSpin = (e: React.MouseEvent, id: 'fruits' | 'flowers' | 'sweeteners') => {
    e.stopPropagation();
    setSelectedId(id);
    setSpinningId(id);
    setTimeout(() => {
      setSpinningId(null);
    }, 750);
  };

  return (
    <div className="font-sans space-y-10">
      {/* 360 Interactive Add-ons Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start perspective-[1200px]">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedId === cat.id;
          const isSpinning = spinningId === cat.id;
          const Icon = cat.icon;

          return (
            <div
              key={cat.id}
              className={`transition-all duration-500 ease-out flex flex-col ${
                isSelected
                  ? 'scale-102 sm:scale-106 z-20'
                  : 'scale-98 sm:scale-95 opacity-80 hover:opacity-100 z-10'
              }`}
            >
              {/* Cardbox Container with 360 degree 3D transform */}
              <div
                onClick={() => handleSelect(cat.id)}
                style={{
                  transformStyle: 'preserve-3d',
                  transform: isSpinning ? 'rotateY(360deg)' : 'rotateY(0deg)',
                  transition: 'transform 0.75s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                className={`relative rounded-3xl p-6 sm:p-7 shadow-md transition-all duration-300 cursor-pointer overflow-hidden border ${
                  isSelected
                    ? 'bg-white border-primary shadow-2xl ring-2 ring-primary/20'
                    : 'bg-white/95 border-border/80 hover:border-border hover:shadow-lg'
                }`}
              >
                {/* 360 Degree Badge Button at Top Right */}
                <button
                  type="button"
                  onClick={(e) => handleManualSpin(e, cat.id)}
                  title="Spin card 360°"
                  className={`absolute top-4 right-4 z-20 flex items-center gap-1 text-[9px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'bg-neutral-100 text-muted-foreground hover:bg-neutral-200 hover:text-foreground'
                  }`}
                >
                  <RotateCw className={`w-3 h-3 ${isSpinning ? 'animate-spin' : ''}`} />
                  <span>360°</span>
                </button>

                {/* Header */}
                <div className="border-b border-border/70 pb-4 pr-16 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-primary font-bold block">
                      {cat.num}
                    </span>
                    {isSelected && (
                      <span className="inline-flex items-center gap-0.5 text-[9px] font-mono uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded-full font-bold">
                        <Check className="w-2.5 h-2.5" /> Selected
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-foreground">
                    {cat.title}
                  </h3>
                  <p className="text-[11px] text-muted-foreground leading-snug">
                    {cat.subtitle}
                  </p>
                </div>

                {/* Ingredients List */}
                <div className="divide-y divide-border/60 text-xs sm:text-sm my-4">
                  {cat.items.map((item) => (
                    <div
                      key={item.name}
                      className="py-2.5 flex items-center justify-between gap-3 group/row hover:bg-neutral-50 -mx-2 px-2 rounded-lg transition-colors"
                    >
                      <div className="space-y-0.5">
                        <span className="font-bold text-foreground block">
                          {item.name}
                        </span>
                        <span className="text-[11px] text-muted-foreground block font-normal">
                          {item.noteOrTaste}
                        </span>
                      </div>
                      <span className="font-mono font-bold text-xs px-2.5 py-0.5 rounded-full bg-neutral-100 text-foreground shrink-0">
                        {item.price}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Bottom Active Indicator Bar */}
                <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5 text-primary" />
                    <span>Botanical Grade</span>
                  </span>
                  <span className="text-foreground font-bold">
                    {isSelected ? 'Active Focus' : 'Click to Focus'}
                  </span>
                </div>
              </div>

              {/* Connecting Line Leading to a Small Architectural Callout Box (Only on Selected Card) */}
              {isSelected && (
                <div className="mt-2 flex flex-col items-center animate-in fade-in slide-in-from-top-2 duration-300">
                  {/* Vertical connecting line */}
                  <div className="w-0.5 h-6 bg-primary" />
                  
                  {/* Small Architectural Callout Box */}
                  <div className="w-full bg-neutral-900 text-white rounded-2xl p-4 shadow-xl border border-neutral-800 space-y-1.5 relative">
                    {/* Top small accent connector notch */}
                    <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-neutral-900 border-t border-l border-neutral-800 rotate-45" />

                    <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-1.5">
                      <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-purple-300 font-bold block">
                        {cat.calloutTitle}
                      </span>
                      <span className="text-[9px] font-mono text-white/50">
                        ATELIER NOTE
                      </span>
                    </div>

                    <p className="text-xs text-white/90 leading-relaxed font-normal">
                      {cat.calloutText}
                    </p>

                    <div className="pt-1 flex items-center gap-1.5 text-[10px] font-mono text-amber-300">
                      <span>◈</span>
                      <span>{cat.pairingBlend}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
