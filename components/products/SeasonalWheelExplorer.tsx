'use client';

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Coffee,
  Compass,
  ArrowRight,
  Minimize2,
} from 'lucide-react';
import {
  SOLAR_TERM_BLENDS,
  SEASONS_CONFIG,
  type SolarTermBlend,
} from '@/lib/data/solarTerms';
import { SeasonalCanvas3D } from './SeasonalCanvas3D';

// Wheel Geometry Constants
const C = 200;
const RO = 194;
const RI = 136;
const RL = 165;

const polarToCartesian = (r: number, aDeg: number): [number, number] => {
  const rad = (aDeg * Math.PI) / 180;
  return [C + r * Math.cos(rad), C + r * Math.sin(rad)];
};

const getArcPath = (i: number): string => {
  const a0 = -90 + i * 15 + 0.6;
  const a1 = -90 + (i + 1) * 15 - 0.6;
  const [x0, y0] = polarToCartesian(RO, a0);
  const [x1, y1] = polarToCartesian(RO, a1);
  const [x2, y2] = polarToCartesian(RI, a1);
  const [x3, y3] = polarToCartesian(RI, a0);
  return `M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${RO} ${RO} 0 0 1 ${x1.toFixed(
    2
  )} ${y1.toFixed(2)} L ${x2.toFixed(2)} ${y2.toFixed(2)} A ${RI} ${RI} 0 0 0 ${x3.toFixed(
    2
  )} ${y3.toFixed(2)} Z`;
};

const getLabelCoords = (i: number): [number, number] => {
  const mid = -90 + i * 15 + 7.5;
  return polarToCartesian(RL, mid);
};

export function SeasonalWheelExplorer() {
  // Default to term 16: Cold Dew (First Rain) which is currently brewing
  const [selectedTermIndex, setSelectedTermIndex] = useState<number>(16);
  const [hoveredTermIndex, setHoveredTermIndex] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Swipe / Drag handling for product navigation
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const startXRef = useRef<number | null>(null);

  const currentTerm: SolarTermBlend =
    SOLAR_TERM_BLENDS[selectedTermIndex] || SOLAR_TERM_BLENDS[0];
  const activeSeason = currentTerm.season;

  // Blends belonging to the currently selected season (6 blends)
  const seasonBlends = useMemo(
    () => SOLAR_TERM_BLENDS.filter((b) => b.season === activeSeason),
    [activeSeason]
  );

  const currentSeasonIndex = useMemo(() => {
    const idx = seasonBlends.findIndex((b) => b.term === currentTerm.term);
    return idx >= 0 ? idx : 0;
  }, [seasonBlends, currentTerm.term]);

  const activeSeasonConfig = useMemo(
    () => SEASONS_CONFIG.find((s) => s.id === activeSeason) || SEASONS_CONFIG[0],
    [activeSeason]
  );

  const handleSelectTerm = useCallback((idx: number) => {
    setSelectedTermIndex(idx);
    setIsExpanded(true);
  }, []);

  const handleSelectSeason = useCallback(
    (seasonId: 'spring' | 'summer' | 'autumn' | 'winter') => {
      const firstTermIdx = SOLAR_TERM_BLENDS.findIndex(
        (b) => b.season === seasonId && b.isBrewingNow
      );
      const targetIdx =
        firstTermIdx >= 0
          ? firstTermIdx
          : SOLAR_TERM_BLENDS.findIndex((b) => b.season === seasonId);
      if (targetIdx >= 0) {
        setSelectedTermIndex(targetIdx);
        setIsExpanded(true);
      }
    },
    []
  );

  const handleNextBlend = useCallback(() => {
    const nextSeasonIdx = (currentSeasonIndex + 1) % seasonBlends.length;
    const targetBlend = seasonBlends[nextSeasonIdx];
    const fullIdx = SOLAR_TERM_BLENDS.findIndex(
      (b) => b.term === targetBlend.term
    );
    if (fullIdx >= 0) setSelectedTermIndex(fullIdx);
  }, [currentSeasonIndex, seasonBlends]);

  const handlePrevBlend = useCallback(() => {
    const prevSeasonIdx =
      (currentSeasonIndex - 1 + seasonBlends.length) % seasonBlends.length;
    const targetBlend = seasonBlends[prevSeasonIdx];
    const fullIdx = SOLAR_TERM_BLENDS.findIndex(
      (b) => b.term === targetBlend.term
    );
    if (fullIdx >= 0) setSelectedTermIndex(fullIdx);
  }, [currentSeasonIndex, seasonBlends]);

  // Keyboard navigation
  useEffect(() => {
    if (!isExpanded) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNextBlend();
      if (e.key === 'ArrowLeft') handlePrevBlend();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded, handleNextBlend, handlePrevBlend]);

  // Touch / Drag events for product
  const onDragStart = (clientX: number) => {
    startXRef.current = clientX;
    setIsDragging(true);
  };

  const onDragMove = (clientX: number) => {
    if (!isDragging || startXRef.current === null) return;
    const diff = clientX - startXRef.current;
    setDragOffset(diff * 0.4);
  };

  const onDragEnd = () => {
    if (!isDragging || startXRef.current === null) return;
    if (dragOffset < -35) {
      handleNextBlend();
    } else if (dragOffset > 35) {
      handlePrevBlend();
    }
    startXRef.current = null;
    setIsDragging(false);
    setDragOffset(0);
  };

  // WhatsApp prefilled order link
  const orderMessage = `Hello Changkeer, I would like to order the seasonal blend: ${currentTerm.blend} (${currentTerm.termChinese} ${currentTerm.term}) - Hot: ${currentTerm.hotPrice} / Iced: ${currentTerm.icedPrice}.`;
  const whatsappUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(
    orderMessage
  )}`;

  return (
    <section className="relative w-full py-12 sm:py-16 md:py-20 bg-white border-b border-border/80 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-8 sm:mb-12">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-mono font-bold tracking-[0.2em] uppercase">
              <Compass className="w-3.5 h-3.5" />
              <span>SEASONAL WHEEL CATEGORY</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-sans font-black uppercase tracking-tight text-foreground">
              Taste The 24 Solar Terms
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Every two weeks, a new seasonal blend arrives matched to Jakarta&apos;s climate.
              {!isExpanded ? (
                <span className="font-semibold text-primary ml-1">
                  Click on the wheel or select a season below to explore blends.
                </span>
              ) : (
                <span className="text-foreground ml-1">
                  Click segments on the wheel to switch blends or swipe through the products.
                </span>
              )}
            </p>
          </div>

          {/* Action buttons & Season Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {SEASONS_CONFIG.map((s) => {
              const isSeasonActive = activeSeason === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => handleSelectSeason(s.id as 'spring' | 'summer' | 'autumn' | 'winter')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all shadow-xs cursor-pointer ${
                    isSeasonActive
                      ? 'bg-neutral-900 text-white ring-2 ring-neutral-900/30 font-bold scale-105'
                      : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ backgroundColor: s.color }}
                  />
                  <span>{s.name}</span>
                  <span className="text-[10px] opacity-75 font-serif">
                    {s.chinese}
                  </span>
                </button>
              );
            })}

            {isExpanded && (
              <button
                onClick={() => setIsExpanded(false)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 text-xs font-medium transition-colors ml-1 cursor-pointer"
                title="Collapse view and re-center the wheel"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Center View</span>
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Interactive Stage: Smooth Layout Transition between Center & Split Screen */}
        <div
          className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isExpanded
              ? 'grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center'
              : 'flex flex-col items-center justify-center max-w-xl mx-auto'
          }`}
        >
          {/* ========================================================
              LEFT COLUMN (or CENTER): THE 24 SOLAR TERMS WHEEL WITH 3D BACKGROUND
              ======================================================== */}
          <div
            className={`w-full flex flex-col items-center justify-center relative transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isExpanded ? 'lg:col-span-5' : 'max-w-md'
            }`}
          >
            {/* 3D Three.js Object Canvas Background positioned behind the wheel */}
            <div className="absolute -inset-8 sm:-inset-14 md:-inset-18 pointer-events-none -z-10 overflow-hidden">
              <SeasonalCanvas3D season={activeSeason} />
            </div>

            {/* SVG Wheel Wrapper */}
            <div className="relative w-full max-w-[340px] sm:max-w-[400px] aspect-square flex items-center justify-center drop-shadow-sm">
              <svg
                viewBox="0 0 400 400"
                className="w-full h-full overflow-visible transition-transform duration-500 ease-out"
                role="group"
                aria-label="24 Solar Terms Seasonal Wheel Calendar"
              >
                {/* 24 Segments */}
                {SOLAR_TERM_BLENDS.map((term, i) => {
                  const isSelected = selectedTermIndex === i;
                  const isHovered = hoveredTermIndex === i;
                  const isNow = term.isBrewingNow;
                  const [lx, ly] = getLabelCoords(i);
                  const seasonCfg = SEASONS_CONFIG.find(
                    (s) => s.id === term.season
                  );
                  const baseFill = isNow ? '#B3305A' : seasonCfg?.color || '#888';

                  return (
                    <g
                      key={term.term}
                      onClick={() => handleSelectTerm(i)}
                      onMouseEnter={() => setHoveredTermIndex(i)}
                      onMouseLeave={() => setHoveredTermIndex(null)}
                      className="cursor-pointer outline-none focus:outline-none transition-transform"
                      tabIndex={0}
                      role="button"
                      aria-label={`${term.term} (${term.termChinese}): ${term.blend}`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleSelectTerm(i);
                        }
                      }}
                    >
                      {/* Segment Arc */}
                      <path
                        d={getArcPath(i)}
                        fill={baseFill}
                        fillOpacity={isSelected ? 1 : isHovered ? 0.78 : 0.42}
                        stroke={
                          isSelected
                            ? '#111827'
                            : isNow
                            ? '#B3305A'
                            : '#ffffff'
                        }
                        strokeWidth={isSelected ? 2.5 : 1.5}
                        className="transition-all duration-200"
                      />
                      {/* Chinese Character Label */}
                      <text
                        x={lx}
                        y={ly}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill={
                          isSelected || isNow
                            ? '#ffffff'
                            : '#1D2A24'
                        }
                        fontSize={11.5}
                        fontWeight={isSelected || isNow ? 700 : 500}
                        className="font-serif select-none pointer-events-none transition-colors"
                      >
                        {term.termChinese}
                      </text>
                    </g>
                  );
                })}

                {/* Center Hub */}
                <circle
                  cx={C}
                  cy={C}
                  r={RI - 8}
                  fill="#FFFFFF"
                  stroke="#E5E7EB"
                  strokeWidth="1.5"
                  className="drop-shadow-xs cursor-pointer"
                  onClick={() => {
                    if (!isExpanded) setIsExpanded(true);
                  }}
                />

                {/* Inner Ring Glow if Selected is Brewing Now */}
                {currentTerm.isBrewingNow && (
                  <circle
                    cx={C}
                    cy={C}
                    r={RI - 12}
                    fill="none"
                    stroke="#B3305A"
                    strokeWidth="1.2"
                    strokeDasharray="4 3"
                    className="animate-spin-slow opacity-60"
                  />
                )}

                {/* Center Text Group */}
                <g
                  className="cursor-pointer select-none"
                  onClick={() => {
                    if (!isExpanded) setIsExpanded(true);
                  }}
                >
                  {/* Status / Timing */}
                  <text
                    x={C}
                    y={150}
                    textAnchor="middle"
                    fill={currentTerm.isBrewingNow ? '#B3305A' : '#6B7280'}
                    fontSize={10}
                    fontWeight={700}
                    letterSpacing="0.14em"
                    className="font-mono uppercase"
                  >
                    {currentTerm.isBrewingNow
                      ? 'NOW BREWING'
                      : `FROM ${currentTerm.starts.toUpperCase()}`}
                  </text>

                  {/* Chinese Glyph */}
                  <text
                    x={C}
                    y={186}
                    textAnchor="middle"
                    fill={currentTerm.isBrewingNow ? '#B3305A' : '#111827'}
                    fontSize={26}
                    fontWeight={700}
                    className="font-serif"
                  >
                    {currentTerm.termChinese}
                  </text>

                  {/* Blend Name */}
                  <text
                    x={C}
                    y={216}
                    textAnchor="middle"
                    fill="#111827"
                    fontSize={17}
                    fontWeight={800}
                    className="font-sans"
                  >
                    {currentTerm.blend}
                  </text>

                  {/* Term Details */}
                  <text
                    x={C}
                    y={238}
                    textAnchor="middle"
                    fill="#6B7280"
                    fontSize={11}
                    fontWeight={500}
                    className="font-mono"
                  >
                    {currentTerm.term} · {currentTerm.starts}
                  </text>

                  {/* Micro Interaction Hint */}
                  <text
                    x={C}
                    y={258}
                    textAnchor="middle"
                    fill="#9CA3AF"
                    fontSize={9.5}
                    fontWeight={500}
                    className="font-mono uppercase tracking-widest"
                  >
                    {isExpanded ? 'Season Cycle' : 'Click to explore →'}
                  </text>
                </g>
              </svg>
            </div>

            {/* Wheel Legend */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs text-muted-foreground mt-4">
              <span className="inline-flex items-center gap-1.5">
                <i className="w-2.5 h-2.5 rounded-full bg-[#7DAE77]" />
                Spring
              </span>
              <span className="inline-flex items-center gap-1.5">
                <i className="w-2.5 h-2.5 rounded-full bg-[#E2849B]" />
                Summer
              </span>
              <span className="inline-flex items-center gap-1.5">
                <i className="w-2.5 h-2.5 rounded-full bg-[#E2AA3E]" />
                Autumn
              </span>
              <span className="inline-flex items-center gap-1.5">
                <i className="w-2.5 h-2.5 rounded-full bg-[#88A2B5]" />
                Winter
              </span>
              <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
                <i className="w-2.5 h-2.5 rounded-full bg-[#B3305A]" />
                Brewing now
              </span>
            </div>

            {/* Call to action when centered */}
            {!isExpanded && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsExpanded(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider transition-all hover:gap-3 shadow-md hover:shadow-lg cursor-pointer"
                >
                  <span>Explore {activeSeasonConfig.name} Blends</span>
                  <ArrowRight className="w-4 h-4 text-primary" />
                </button>
              </div>
            )}
          </div>

          {/* ========================================================
              RIGHT COLUMN: REVISED MINIMALIST PRODUCT DISPLAY (NO CARDBOX)
              Pure Transparent Product Cutout with Season Aura, Symbol, Title, & Price
              ======================================================== */}
          {isExpanded && (
            <div className="lg:col-span-7 w-full flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-right-8 duration-700 ease-out py-6 lg:py-2">
              <div
                key={currentTerm.term}
                className="relative flex flex-col items-center justify-center w-full max-w-md transition-all duration-500 ease-out"
                onTouchStart={(e) => onDragStart(e.touches[0].clientX)}
                onTouchMove={(e) => onDragMove(e.touches[0].clientX)}
                onTouchEnd={onDragEnd}
                onMouseDown={(e) => onDragStart(e.clientX)}
                onMouseMove={(e) => onDragMove(e.clientX)}
                onMouseUp={onDragEnd}
                style={{
                  transform: isDragging ? `translateX(${dragOffset}px)` : undefined,
                }}
              >
                {/* 1. SIMBOL (Season Badge + Solar Term Chinese Glyph Symbol) */}
                <div className="flex flex-col items-center gap-1.5 mb-2 sm:mb-3 animate-in fade-in slide-in-from-top-3 duration-500">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200/80 text-foreground text-xs font-mono font-bold tracking-wider uppercase shadow-2xs">
                    <span
                      className="w-2.5 h-2.5 rounded-full inline-block"
                      style={{ backgroundColor: currentTerm.ringColor }}
                    />
                    <span>
                      {currentTerm.seasonName} · {currentTerm.term}
                    </span>
                    <span className="text-muted-foreground font-mono">
                      ({currentTerm.starts})
                    </span>
                  </div>

                  {/* Elegant Large Chinese Glyph Symbol */}
                  <div
                    className="text-4xl sm:text-5xl font-serif font-black tracking-tight select-none mt-1 transition-colors duration-500"
                    style={{ color: currentTerm.ringColor }}
                  >
                    {currentTerm.termChinese}
                  </div>
                </div>

                {/* 2. GAMBAR PRODUK TANPA BACKGROUND DENGAN AURA SESUAI SEASON */}
                <div className="relative w-full flex items-center justify-center my-2 sm:my-3 min-h-[260px] sm:min-h-[300px]">
                  {/* Dynamic Glowing Season Aura behind cutout image */}
                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] sm:w-[300px] md:w-[340px] h-[240px] sm:h-[300px] md:h-[340px] rounded-full blur-[65px] sm:blur-[85px] pointer-events-none -z-1 transition-all duration-1000 ease-out opacity-75"
                    style={{
                      background: currentTerm.glowColor
                        .replace('0.25', '0.55')
                        .replace('0.35', '0.65'),
                    }}
                  />

                  {/* Concentric Subtle Halo Rings matching season */}
                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] sm:w-[270px] md:w-[300px] h-[220px] sm:h-[270px] md:h-[300px] rounded-full border border-neutral-200/80 pointer-events-none -z-1 transition-all duration-700"
                    style={{
                      boxShadow: `0 0 50px -10px ${currentTerm.glowColor}`,
                    }}
                  />
                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140px] sm:w-[170px] md:w-[190px] h-[140px] sm:h-[170px] md:h-[190px] rounded-full border-2 pointer-events-none -z-1 opacity-50 transition-colors duration-700"
                    style={{ borderColor: currentTerm.ringColor }}
                  />

                  {/* Cutout Product Image (No Background) with Smooth Float & Hover */}
                  <div className="relative w-[200px] sm:w-[250px] md:w-[280px] h-[240px] sm:h-[290px] md:h-[320px] flex items-center justify-center animate-in zoom-in-95 duration-500">
                    <Image
                      src={currentTerm.image}
                      alt={currentTerm.blend}
                      fill
                      sizes="(max-width: 640px) 200px, (max-width: 1024px) 250px, 280px"
                      className="object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.2)] filter hover:scale-105 transition-transform duration-500 ease-out pointer-events-none"
                      priority
                    />
                  </div>
                </div>

                {/* 3. JUDUL PRODUK */}
                <div className="space-y-1 mt-1 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-sans font-black uppercase tracking-tight text-foreground leading-tight">
                    {currentTerm.blend}
                  </h3>
                  {currentTerm.isBrewingNow && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#B3305A] text-white text-[10px] font-mono font-bold uppercase tracking-wider shadow-xs">
                      <Sparkles className="w-3 h-3" />
                      <span>Brewing Now</span>
                    </span>
                  )}
                </div>

                {/* 4. HARGA PRODUK */}
                <div className="mt-3 flex items-center justify-center gap-2.5 font-mono text-sm sm:text-base font-bold text-foreground animate-in fade-in slide-in-from-bottom-3 duration-500">
                  <span className="px-3.5 py-1 rounded-full bg-neutral-100 border border-neutral-200/80 text-neutral-900 shadow-2xs">
                    Hot: {currentTerm.hotPrice}{' '}
                    <span className="text-[11px] font-normal text-muted-foreground">
                      (350ml)
                    </span>
                  </span>
                  <span className="text-muted-foreground/60">·</span>
                  <span className="px-3.5 py-1 rounded-full bg-neutral-100 border border-neutral-200/80 text-neutral-900 shadow-2xs">
                    Iced: {currentTerm.icedPrice}{' '}
                    <span className="text-[11px] font-normal text-muted-foreground">
                      (450ml)
                    </span>
                  </span>
                </div>

                {/* Minimalist Controls: Prev/Next & Stepper Dots */}
                <div className="flex items-center justify-center gap-4 mt-5">
                  <button
                    onClick={handlePrevBlend}
                    className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 active:scale-95 text-neutral-800 flex items-center justify-center transition-all cursor-pointer border border-neutral-200/80 shadow-2xs"
                    aria-label="Previous Blend"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {/* Stepper Dots */}
                  <div className="flex items-center gap-1.5">
                    {seasonBlends.map((blend) => {
                      const isActive = blend.term === currentTerm.term;
                      return (
                        <button
                          key={blend.term}
                          onClick={() => {
                            const fullIdx = SOLAR_TERM_BLENDS.findIndex(
                              (b) => b.term === blend.term
                            );
                            if (fullIdx >= 0) setSelectedTermIndex(fullIdx);
                          }}
                          className={`transition-all duration-300 rounded-full cursor-pointer ${
                            isActive
                              ? 'w-6 h-2 bg-neutral-900'
                              : 'w-2 h-2 bg-neutral-300 hover:bg-neutral-400'
                          }`}
                          aria-label={`Go to ${blend.blend}`}
                        />
                      );
                    })}
                  </div>

                  <button
                    onClick={handleNextBlend}
                    className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 active:scale-95 text-neutral-800 flex items-center justify-center transition-all cursor-pointer border border-neutral-200/80 shadow-2xs"
                    aria-label="Next Blend"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Clean WhatsApp Order CTA */}
                <div className="mt-4">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm hover:shadow-md cursor-pointer hover:gap-2.5"
                  >
                    <Coffee className="w-3.5 h-3.5 text-primary" />
                    <span>Order This Blend</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
