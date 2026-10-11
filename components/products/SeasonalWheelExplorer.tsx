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

  // Swipe / Drag handling for carousel
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
      // Find the first term of that season or currently brewing if in that season
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

  // Touch / Drag events
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
                  Click on the wheel or select a season below to view blends.
                </span>
              ) : (
                <span className="text-foreground ml-1">
                  Click segments on the wheel to switch blends or swipe through the carousel.
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

        {/* Dynamic Interactive Stage: Transitions between Center Layout and Split Screen */}
        <div
          className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isExpanded
              ? 'grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center'
              : 'flex flex-col items-center justify-center max-w-xl mx-auto'
          }`}
        >
          {/* ========================================================
              THE 24 SOLAR TERMS WHEEL (Left when expanded, Center initially)
              ======================================================== */}
          <div
            className={`w-full flex flex-col items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isExpanded ? 'lg:col-span-5' : 'max-w-md'
            }`}
          >
            {/* SVG Wheel Wrapper */}
            <div className="relative w-full max-w-[360px] sm:max-w-[420px] aspect-square flex items-center justify-center drop-shadow-sm">
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
              SEASONAL PRODUCT CAROUSEL (Appears on the Right upon click)
              ======================================================== */}
          {isExpanded && (
            <div className="lg:col-span-7 w-full animate-in fade-in slide-in-from-right-6 duration-500 ease-out">
              <div
                className="relative bg-[#0c0b11] text-white rounded-3xl p-6 sm:p-8 lg:p-10 overflow-hidden shadow-2xl border border-white/10 card-boundary flex flex-col justify-between min-h-[520px] sm:min-h-[560px]"
                onTouchStart={(e) => onDragStart(e.touches[0].clientX)}
                onTouchMove={(e) => onDragMove(e.touches[0].clientX)}
                onTouchEnd={onDragEnd}
                onMouseDown={(e) => onDragStart(e.clientX)}
                onMouseMove={(e) => onDragMove(e.clientX)}
                onMouseUp={onDragEnd}
              >
                {/* Background Atmosphere & Radial Glow matching current blend season */}
                <div className="absolute inset-0 pointer-events-none -z-1 overflow-hidden">
                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full blur-[140px] transition-all duration-1000 ease-out opacity-85"
                    style={{ background: currentTerm.glowColor }}
                  />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_25%,rgba(12,11,17,0.92)_85%)]" />
                </div>

                {/* Giant Watermark Typography behind product */}
                <div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none -z-1 overflow-hidden"
                  aria-hidden="true"
                >
                  <span className="font-sans font-black text-[22vw] sm:text-[18vw] lg:text-[10vw] tracking-tighter text-white/[0.04] uppercase select-none leading-none">
                    {currentTerm.watermark}
                  </span>
                </div>

                {/* 1. CAROUSEL TOP BAR */}
                <div className="relative z-10 flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: currentTerm.ringColor }}
                    />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-white/90">
                      {currentTerm.seasonName} · {currentTerm.termChinese} {currentTerm.term}
                    </span>
                    <span className="text-xs text-white/50 font-mono">
                      (Starts {currentTerm.starts})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {currentTerm.isBrewingNow && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#B3305A] text-white text-[10px] font-mono font-bold uppercase tracking-wider shadow-sm animate-pulse">
                        <Sparkles className="w-3 h-3" />
                        <span>Now Brewing</span>
                      </span>
                    )}
                    <span className="text-xs font-mono text-white/60">
                      {String(currentSeasonIndex + 1).padStart(2, '0')} / {String(seasonBlends.length).padStart(2, '0')}
                    </span>
                  </div>
                </div>

                {/* 2. CAROUSEL MAIN STAGE: Centered Product with Left Title & Right Price */}
                <div
                  className="relative z-10 my-auto py-6 sm:py-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center transition-transform duration-200"
                  style={{
                    transform: isDragging ? `translateX(${dragOffset}px)` : undefined,
                  }}
                >
                  {/* Left Column: Blend Title & Flavor Notes */}
                  <div className="md:col-span-5 space-y-3 text-left">
                    <span className="text-[11px] font-mono tracking-widest uppercase text-white/60 block">
                      SEASONAL INFUSION
                    </span>
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white leading-tight">
                      {currentTerm.blend}
                    </h3>
                    <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-normal">
                      {currentTerm.note}
                    </p>

                    {/* Ingredients Chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {currentTerm.ingredients.map((ing) => (
                        <span
                          key={ing}
                          className="px-2.5 py-1 rounded-full bg-white/10 text-white/90 text-[11px] font-medium border border-white/5"
                        >
                          {ing}
                        </span>
                      ))}
                    </div>

                    <div className="text-[11px] font-mono text-white/50 pt-0.5">
                      Recommended: <span className="text-white/80">{currentTerm.temperature}</span> · Caffeine-Free
                    </div>
                  </div>

                  {/* Center Column: High Quality Transparent Product Cutout with Halo Rings */}
                  <div className="md:col-span-4 flex items-center justify-center relative min-h-[220px] sm:min-h-[260px]">
                    {/* Concentric Halo Rings */}
                    <div
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] sm:w-[250px] h-[220px] sm:h-[250px] rounded-full border border-white/10 pointer-events-none -z-1 transition-all duration-700"
                      style={{
                        boxShadow: `0 0 65px -10px ${currentTerm.glowColor}`,
                      }}
                    />
                    <div
                      className="absolute top-[42%] left-[56%] -translate-x-1/2 -translate-y-1/2 w-[90px] sm:w-[110px] h-[90px] sm:h-[110px] rounded-full border-2 pointer-events-none -z-1 opacity-70 transition-colors duration-700"
                      style={{ borderColor: currentTerm.ringColor }}
                    />

                    {/* Cutout Image */}
                    <div className="relative w-[180px] sm:w-[220px] lg:w-[240px] h-[220px] sm:h-[260px] lg:h-[280px]">
                      <Image
                        src={currentTerm.image}
                        alt={currentTerm.blend}
                        fill
                        sizes="(max-width: 640px) 180px, 240px"
                        className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.85)] filter hover:scale-105 transition-transform duration-500 ease-out"
                        priority
                      />
                    </div>
                  </div>

                  {/* Right Column: Pricing & Quick WhatsApp Order */}
                  <div className="md:col-span-3 flex flex-col justify-center items-start md:items-end text-left md:text-right space-y-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-white/60 block">
                        HOT (350ML)
                      </span>
                      <div className="text-2xl sm:text-3xl font-black text-white tracking-tight font-mono">
                        {currentTerm.hotPrice}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-white/60 block">
                        ICED (450ML)
                      </span>
                      <div className="text-xl sm:text-2xl font-black text-white/90 tracking-tight font-mono">
                        {currentTerm.icedPrice}
                      </div>
                    </div>

                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-white text-neutral-950 hover:bg-neutral-100 font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:scale-102 cursor-pointer mt-2"
                    >
                      <Coffee className="w-3.5 h-3.5 text-primary" />
                      <span>Order Cup</span>
                    </a>
                  </div>
                </div>

                {/* 3. CAROUSEL FOOTER CONTROLS */}
                <div className="relative z-10 flex items-center justify-between gap-4 pt-4 border-t border-white/10 mt-auto">
                  {/* Prev Button */}
                  <button
                    onClick={handlePrevBlend}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer border border-white/10"
                    aria-label="Previous Blend"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {/* Dot Indicators for Season Blends */}
                  <div className="flex items-center gap-2">
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
                              ? 'w-7 h-2.5 bg-white'
                              : 'w-2.5 h-2.5 bg-white/30 hover:bg-white/60'
                          }`}
                          aria-label={`Go to ${blend.blend}`}
                        />
                      );
                    })}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={handleNextBlend}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer border border-white/10"
                    aria-label="Next Blend"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
