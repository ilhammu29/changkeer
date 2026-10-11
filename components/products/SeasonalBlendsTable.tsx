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
      <div className="p-4 sm:p-5 border-b border-border/70 bg-neutral-50/70 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
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
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all cursor-pointer ${
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

      {/* Product Table without Extra Badges */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm border-collapse">
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
