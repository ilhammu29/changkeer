'use client';

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Coffee,
  ArrowRight,
  Minimize2,
} from 'lucide-react';
import {
  SOLAR_TERM_BLENDS,
  SEASONS_CONFIG,
  type SolarTermBlend,
} from '@/lib/data/solarTerms';

export const SEASON_BACKGROUNDS = [
  { id: 'spring', name: 'Spring', image: '/images/seasons/spring.jpg' },
  { id: 'summer', name: 'Summer', image: '/images/seasons/summer.jpg' },
  { id: 'autumn', name: 'Autumn', image: '/images/seasons/autumn.jpg' },
  { id: 'winter', name: 'Winter', image: '/images/seasons/winter.jpg' },
] as const;

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
    <section className="relative w-full py-16 sm:py-20 md:py-28 border-b border-border/80 overflow-hidden select-none bg-white">
      {/* ========================================================
          FULL SECTION DYNAMIC 4-SEASON BACKGROUND LAYER (Smooth 1200ms Crossfade)
          ======================================================== */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {SEASON_BACKGROUNDS.map((bg) => {
          const isActive = activeSeason === bg.id;
          return (
            <div
              key={bg.id}
              className={`absolute inset-0 transition-all duration-1200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isActive
                  ? 'opacity-100 scale-100'
                  : 'opacity-0 scale-105 pointer-events-none'
              }`}
            >
              <Image
                src={bg.image}
                alt={`${bg.name} season background atmosphere`}
                fill
                sizes="100vw"
                className="object-cover object-center filter brightness-[0.92] contrast-[1.08]"
                priority
              />
              {/* Ethereal luxury veil: white translucent wash with gradient fade */}
              <div className="absolute inset-0 bg-white/75 backdrop-blur-[1.5px]" />
              <div className="absolute inset-0 bg-gradient-to-b from-white via-white/40 to-white" />
            </div>
          );
        })}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header: Centered & Clean (No Badge) */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-black uppercase tracking-tight text-foreground">
            Taste The 24 Solar Terms
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto font-normal">
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

          {/* Centered Season Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
            {SEASONS_CONFIG.map((s) => {
              const isSeasonActive = activeSeason === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => handleSelectSeason(s.id as 'spring' | 'summer' | 'autumn' | 'winter')}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-500 shadow-xs cursor-pointer ${
                    isSeasonActive
                      ? 'bg-neutral-900 text-white ring-2 ring-neutral-900/30 font-bold scale-105'
                      : 'bg-white/80 hover:bg-white text-neutral-800 border border-neutral-200/80'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ backgroundColor: s.color }}
                  />
                  <span>{s.name}</span>
                  <span className="text-[11px] opacity-75 font-serif">{s.chinese}</span>
                </button>
              );
            })}

            {isExpanded && (
              <button
                onClick={() => setIsExpanded(false)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/80 hover:bg-white text-neutral-700 border border-neutral-200/80 text-xs font-medium transition-all duration-300 ml-1 cursor-pointer shadow-xs"
                title="Collapse view and re-center the wheel"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Center View</span>
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Interactive Stage: Smooth Interpolated Layout Movement */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-14 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]">
          {/* ========================================================
              WHEEL CONTAINER: Centered Initially, Transitions to Left Smoothly
              ======================================================== */}
          <div
            className={`flex flex-col items-center justify-center relative transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isExpanded
                ? 'w-full lg:w-[420px] shrink-0'
                : 'w-full max-w-md mx-auto'
            }`}
          >
            {/* Seasonal Wheel with Dynamic 4-Season Background Layer */}
            <div className="relative w-full flex items-center justify-center">
              <div className="relative w-full max-w-[340px] sm:max-w-[400px] aspect-square flex items-center justify-center drop-shadow-md">
                {/* Glowing Season Aura Halo framing the circle */}
                <div
                  className="absolute -inset-3 sm:-inset-5 rounded-full blur-[26px] pointer-events-none -z-10 transition-all duration-1200 ease-in-out opacity-55"
                  style={{
                    background: currentTerm.glowColor.replace('0.25', '0.65').replace('0.35', '0.75'),
                  }}
                />

                {/* 4-Season Photographic Background on the Circle (Smooth 1200ms Crossfade) */}
                <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none z-0 shadow-inner">
                  {SEASON_BACKGROUNDS.map((bg) => {
                    const isActive = activeSeason === bg.id;
                    return (
                      <div
                        key={bg.id}
                        className={`absolute inset-0 transition-all duration-1200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                          isActive
                            ? 'opacity-100 scale-100'
                            : 'opacity-0 scale-105 pointer-events-none'
                        }`}
                      >
                        <Image
                          src={bg.image}
                          alt={`${bg.name} season background`}
                          fill
                          sizes="(max-width: 640px) 340px, 400px"
                          className="object-cover object-center filter brightness-[0.94] contrast-[1.08]"
                          priority
                        />
                        {/* Soft atmospheric overlay */}
                        <div className="absolute inset-0 bg-white/20 backdrop-blur-[0.5px]" />
                        <div className="absolute inset-0 bg-radial from-transparent via-black/10 to-black/35" />
                      </div>
                    );
                  })}
                </div>

                {/* SVG Wheel overlay on top of the seasonal background */}
                <svg
                  viewBox="0 0 400 400"
                  className="w-full h-full overflow-visible transition-transform duration-700 ease-out relative z-10"
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
                          className="transition-all duration-300"
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
                    fillOpacity="0.88"
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
            </div>

            {/* Wheel Legend */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs text-muted-foreground mt-4 relative z-10">
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
              <div className="mt-6 text-center relative z-10">
                <button
                  onClick={() => setIsExpanded(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 hover:gap-3 shadow-md hover:shadow-lg cursor-pointer"
                >
                  <span>Explore {activeSeasonConfig.name} Blends</span>
                  <ArrowRight className="w-4 h-4 text-primary" />
                </button>
              </div>
            )}
          </div>

          {/* ========================================================
              RIGHT COLUMN: PURE TRANSPARENT PRODUCT DISPLAY (NO CARDBOX)
              Smooth 1000ms Continuous Slide-In with Season Aura
              ======================================================== */}
          <div
            className={`transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isExpanded
                ? 'w-full lg:flex-1 opacity-100 translate-x-0 scale-100 max-h-[900px] visible pointer-events-auto'
                : 'w-0 lg:w-0 opacity-0 translate-x-12 scale-95 max-h-0 invisible pointer-events-none overflow-hidden'
            }`}
          >
            <div className="w-full flex flex-col items-center justify-center text-center py-6 lg:py-2">
              <div
                key={currentTerm.term}
                className="relative flex flex-col items-center justify-center w-full max-w-md transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] animate-fade-in-scale"
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
                <div className="flex flex-col items-center gap-1.5 mb-2 sm:mb-3 transition-all duration-700 ease-out animate-fade-in-scale">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/90 border border-neutral-200/80 text-foreground text-xs font-mono font-bold tracking-wider uppercase shadow-2xs">
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
                    className="text-4xl sm:text-5xl font-serif font-black tracking-tight select-none mt-1 transition-colors duration-700"
                    style={{ color: currentTerm.ringColor }}
                  >
                    {currentTerm.termChinese}
                  </div>
                </div>

                {/* 2. GAMBAR PRODUK TANPA BACKGROUND DENGAN AURA SESUAI SEASON */}
                <div className="relative w-full flex items-center justify-center my-3 sm:my-4 min-h-[260px] sm:min-h-[300px]">
                  {/* Dynamic Glowing Season Aura behind cutout image */}
                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] sm:w-[320px] md:w-[360px] h-[260px] sm:h-[320px] md:h-[360px] rounded-full blur-[70px] sm:blur-[90px] pointer-events-none -z-10 transition-all duration-1200 ease-out opacity-85"
                    style={{
                      background: currentTerm.glowColor
                        .replace('0.25', '0.55')
                        .replace('0.35', '0.65'),
                    }}
                  />

                  {/* Concentric Subtle Halo Rings matching season */}
                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] sm:w-[270px] md:w-[310px] h-[220px] sm:h-[270px] md:h-[310px] rounded-full border border-neutral-200/80 pointer-events-none -z-10 transition-all duration-1000"
                    style={{
                      boxShadow: `0 0 55px -10px ${currentTerm.glowColor}`,
                    }}
                  />
                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140px] sm:w-[170px] md:w-[190px] h-[140px] sm:h-[170px] md:h-[190px] rounded-full border-2 pointer-events-none -z-10 opacity-50 transition-colors duration-1000"
                    style={{ borderColor: currentTerm.ringColor }}
                  />

                  {/* Cutout Product Image (No Background) with Smooth Float */}
                  <div className="relative w-[210px] sm:w-[260px] md:w-[290px] h-[250px] sm:h-[300px] md:h-[330px] flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
                    <Image
                      src={currentTerm.image}
                      alt={currentTerm.blend}
                      fill
                      sizes="(max-width: 640px) 210px, (max-width: 1024px) 260px, 290px"
                      className="object-contain drop-shadow-[0_22px_38px_rgba(0,0,0,0.22)] filter hover:scale-105 transition-transform duration-700 ease-out pointer-events-none"
                      priority
                    />
                  </div>
                </div>

                {/* 3. JUDUL PRODUK */}
                <div className="space-y-1 mt-1 transition-all duration-700 animate-in fade-in slide-in-from-bottom-3">
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
                <div className="mt-3 flex items-center justify-center gap-2.5 font-mono text-sm sm:text-base font-bold text-foreground transition-all duration-700 animate-in fade-in slide-in-from-bottom-4">
                  <span className="px-3.5 py-1.5 rounded-full bg-white/90 border border-neutral-200/80 text-neutral-900 shadow-2xs">
                    Hot: {currentTerm.hotPrice}{' '}
                    <span className="text-[11px] font-normal text-muted-foreground">
                      (350ml)
                    </span>
                  </span>
                  <span className="text-muted-foreground/60">·</span>
                  <span className="px-3.5 py-1.5 rounded-full bg-white/90 border border-neutral-200/80 text-neutral-900 shadow-2xs">
                    Iced: {currentTerm.icedPrice}{' '}
                    <span className="text-[11px] font-normal text-muted-foreground">
                      (450ml)
                    </span>
                  </span>
                </div>

                {/* Minimalist Navigation Controls: Prev/Next & Stepper Dots */}
                <div className="flex items-center justify-center gap-4 mt-6">
                  <button
                    onClick={handlePrevBlend}
                    className="w-10 h-10 rounded-full bg-white/90 hover:bg-white active:scale-95 text-neutral-800 flex items-center justify-center transition-all cursor-pointer border border-neutral-200/80 shadow-2xs"
                    aria-label="Previous Blend"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {/* Stepper Dots */}
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
                          className={`transition-all duration-500 rounded-full cursor-pointer ${
                            isActive
                              ? 'w-7 h-2 bg-neutral-900'
                              : 'w-2 h-2 bg-neutral-300 hover:bg-neutral-400'
                          }`}
                          aria-label={`Go to ${blend.blend}`}
                        />
                      );
                    })}
                  </div>

                  <button
                    onClick={handleNextBlend}
                    className="w-10 h-10 rounded-full bg-white/90 hover:bg-white active:scale-95 text-neutral-800 flex items-center justify-center transition-all cursor-pointer border border-neutral-200/80 shadow-2xs"
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
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer hover:gap-3"
                  >
                    <Coffee className="w-3.5 h-3.5 text-primary" />
                    <span>Order This Blend</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
