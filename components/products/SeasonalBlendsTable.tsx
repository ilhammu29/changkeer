'use client';

import React, { useState, useMemo } from 'react';
import { SolarTermBlend } from '@/lib/data/solarTerms';

interface SeasonalBlendsTableProps {
  blends: SolarTermBlend[];
}

type SeasonFilter = 'all' | 'spring' | 'summer' | 'autumn' | 'winter';

interface SeasonTab {
  id: SeasonFilter;
  label: string;
  chinese: string;
  symbol: string;
}

const TABS: SeasonTab[] = [
  { id: 'all', label: 'All Blends', chinese: '全', symbol: '✧' },
  { id: 'spring', label: 'Spring', chinese: '春', symbol: '🌸' },
  { id: 'summer', label: 'Summer', chinese: '夏', symbol: '☀️' },
  { id: 'autumn', label: 'Autumn', chinese: '秋', symbol: '🍂' },
  { id: 'winter', label: 'Winter', chinese: '冬', symbol: '❄️' },
];

export function SeasonalBlendsTable({ blends }: SeasonalBlendsTableProps) {
  const [activeSeason, setActiveSeason] = useState<SeasonFilter>('all');

  const filteredBlends = useMemo(() => {
    if (activeSeason === 'all') return blends;
    return blends.filter((b) => b.season === activeSeason);
  }, [blends, activeSeason]);

  return (
    <div className="bg-white border border-border/80 rounded-2xl overflow-hidden shadow-md card-boundary font-sans">
      {/* Category Tabs Header with Seasonal Symbols */}
      <div className="p-3.5 sm:p-5 border-b border-border/70 bg-neutral-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 w-full sm:w-auto -mx-1 px-1">
          {TABS.map((tab) => {
            const isActive = activeSeason === tab.id;
            const count =
              tab.id === 'all'
                ? blends.length
                : blends.filter((b) => b.season === tab.id).length;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSeason(tab.id)}
                className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all cursor-pointer ${
                  isActive
                    ? 'bg-neutral-900 text-white shadow-xs scale-102'
                    : 'bg-white border border-border/80 text-foreground hover:bg-neutral-100 hover:text-foreground'
                }`}
              >
                <span className="text-sm leading-none">{tab.symbol}</span>
                <span>{tab.label}</span>
                <span className="text-[11px] opacity-75 font-serif font-normal">
                  ({tab.chinese})
                </span>
                <span className="text-[10px] opacity-60 ml-0.5">
                  [{count}]
                </span>
              </button>
            );
          })}
        </div>

        <div className="text-[11px] font-mono text-muted-foreground hidden md:block">
          Showing {filteredBlends.length} of {blends.length} rotational blends
        </div>
      </div>

      {/* MOBILE RESPONSIVE CARD VIEW (block on mobile, hidden on md+) */}
      <div className="block md:hidden divide-y divide-border/60">
        {filteredBlends.map((item) => (
          <div
            key={item.term}
            className={`p-4 space-y-2.5 transition-colors ${
              item.isBrewingNow ? 'bg-primary/5' : 'bg-white'
            }`}
          >
            {/* Top Row: Solar Term & Season + Date */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm">
                  {item.season === 'spring' && '🌸'}
                  {item.season === 'summer' && '☀️'}
                  {item.season === 'autumn' && '🍂'}
                  {item.season === 'winter' && '❄️'}
                </span>
                <div>
                  <span className="font-extrabold text-xs uppercase text-foreground">
                    {item.term}
                  </span>
                  <span className="text-[11px] text-muted-foreground ml-1 font-serif">
                    ({item.termChinese})
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-neutral-100 text-muted-foreground">
                {item.starts}
              </span>
            </div>

            {/* Blend Name & Ingredients */}
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-foreground">
                {item.blend}
              </h4>
              <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5 leading-relaxed">
                {item.ingredients.join(', ')}
              </p>
            </div>

            {/* Bottom Row: Prices & Status */}
            <div className="pt-1 flex items-center justify-between gap-2 border-t border-border/40">
              <div className="flex items-center gap-3 font-mono text-xs">
                <span className="text-foreground">
                  <span className="text-muted-foreground text-[10px] uppercase block">Hot (350ml)</span>
                  <strong className="font-bold">{item.hotPrice}</strong>
                </span>
                <span className="text-foreground">
                  <span className="text-muted-foreground text-[10px] uppercase block">Iced (450ml)</span>
                  <strong className="font-bold">{item.icedPrice}</strong>
                </span>
              </div>

              <div>
                {item.isBrewingNow ? (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-primary px-2.5 py-1 rounded-full bg-primary/10">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    Now Brewing
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-muted-foreground">
                    Rotational
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP TABLE VIEW (hidden on mobile, block on md+) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-[700px] text-left text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="border-b border-border bg-neutral-100/50 text-foreground font-mono text-[11px] uppercase tracking-wider">
              <th className="py-3.5 px-4 sm:px-6 font-bold">Solar Term</th>
              <th className="py-3.5 px-3 sm:px-4 font-bold">Season</th>
              <th className="py-3.5 px-3 sm:px-4 font-bold">Starts</th>
              <th className="py-3.5 px-4 sm:px-6 font-bold">Seasonal Blend</th>
              <th className="py-3.5 px-3 sm:px-4 font-bold text-right">Hot (350ml)</th>
              <th className="py-3.5 px-4 sm:px-6 font-bold text-right">Iced (450ml)</th>
              <th className="py-3.5 px-4 sm:px-6 font-bold text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {filteredBlends.map((item) => (
              <tr
                key={item.term}
                className={`transition-colors ${
                  item.isBrewingNow
                    ? 'bg-primary/5 hover:bg-primary/10 font-medium'
                    : 'hover:bg-neutral-50/70'
                }`}
              >
                {/* Solar Term */}
                <td className="py-3.5 px-4 sm:px-6">
                  <span className="font-bold text-foreground block">
                    {item.term}
                  </span>
                  <span className="text-[11px] text-muted-foreground font-sans">
                    {item.termChinese}
                  </span>
                </td>

                {/* Season with Symbol */}
                <td className="py-3.5 px-3 sm:px-4 whitespace-nowrap">
                  <span className="text-xs font-mono text-foreground font-semibold flex items-center gap-1.5">
                    <span>
                      {item.season === 'spring' && '🌸'}
                      {item.season === 'summer' && '☀️'}
                      {item.season === 'autumn' && '🍂'}
                      {item.season === 'winter' && '❄️'}
                    </span>
                    <span className="capitalize">{item.seasonName}</span>
                  </span>
                </td>

                {/* Starts date */}
                <td className="py-3.5 px-3 sm:px-4 font-mono text-muted-foreground text-xs whitespace-nowrap">
                  {item.starts}
                </td>

                {/* Seasonal Blend Name */}
                <td className="py-3.5 px-4 sm:px-6">
                  <span className="font-bold text-foreground block">
                    {item.blend}
                  </span>
                  <span className="text-[11px] text-muted-foreground line-clamp-1">
                    {item.ingredients.slice(0, 3).join(', ')}
                  </span>
                </td>

                {/* Hot Price */}
                <td className="py-3.5 px-3 sm:px-4 font-mono font-semibold text-right text-foreground">
                  {item.hotPrice}
                </td>

                {/* Iced Price */}
                <td className="py-3.5 px-4 sm:px-6 font-mono font-semibold text-right text-foreground">
                  {item.icedPrice}
                </td>

                {/* Status without bulky badges */}
                <td className="py-3.5 px-4 sm:px-6 text-center whitespace-nowrap">
                  {item.isBrewingNow ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-primary">
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      Now Brewing
                    </span>
                  ) : (
                    <span className="text-xs font-mono text-muted-foreground">
                      Rotational
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="p-4 bg-neutral-50 border-t border-border/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary inline-block" />
          <strong className="text-foreground font-semibold">Now Brewing:</strong> Freshly brewed at the Jakarta brew bar this fortnight.
        </span>
        <span className="font-mono text-[11px]">
          All blends 100% caffeine-free · Plastic-free sachets
        </span>
      </div>
    </div>
  );
}
