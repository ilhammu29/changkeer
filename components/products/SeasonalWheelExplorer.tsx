'use client';

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Minimize2,
  ArrowUpRight,
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
  const defaultIdx = 16;
  const [selectedTermIndex, setSelectedTermIndex] = useState<number>(defaultIdx);
  const [hoveredTermIndex, setHoveredTermIndex] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Shortest path rotation angle for the dial
  const [rotationAngle, setRotationAngle] = useState<number>(
    -(defaultIdx * 15 + 7.5)
  );

  // Touch / Drag handling for product navigation
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

  // Compute shortest angular path for smooth dial rotation
  const computeShortestRotation = (currentAngle: number, targetIdx: number) => {
    const desiredRaw = -(targetIdx * 15 + 7.5);
    const currentMod = ((currentAngle % 360) + 360) % 360;
    const desiredMod = ((desiredRaw % 360) + 360) % 360;
    let delta = desiredMod - currentMod;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    return currentAngle + delta;
  };

  const handleSelectTerm = useCallback((idx: number) => {
    setSelectedTermIndex(idx);
    setIsExpanded(true);
    setRotationAngle((prev) => computeShortestRotation(prev, idx));
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
        handleSelectTerm(targetIdx);
      }
    },
    [handleSelectTerm]
  );

  const handleNextBlend = useCallback(() => {
    const nextSeasonIdx = (currentSeasonIndex + 1) % seasonBlends.length;
    const targetBlend = seasonBlends[nextSeasonIdx];
    const fullIdx = SOLAR_TERM_BLENDS.findIndex(
      (b) => b.term === targetBlend.term
    );
    if (fullIdx >= 0) handleSelectTerm(fullIdx);
  }, [currentSeasonIndex, seasonBlends, handleSelectTerm]);

  const handlePrevBlend = useCallback(() => {
    const prevSeasonIdx =
      (currentSeasonIndex - 1 + seasonBlends.length) % seasonBlends.length;
    const targetBlend = seasonBlends[prevSeasonIdx];
    const fullIdx = SOLAR_TERM_BLENDS.findIndex(
      (b) => b.term === targetBlend.term
    );
    if (fullIdx >= 0) handleSelectTerm(fullIdx);
  }, [currentSeasonIndex, seasonBlends, handleSelectTerm]);

  // Keyboard navigation
  useEffect(() => {
    if (!isExpanded) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNextBlend();
      if (e.key === 'ArrowLeft') handlePrevBlend();
      if (e.key === 'Escape') setIsExpanded(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded, handleNextBlend, handlePrevBlend]);

  // Touch / Drag events for mobile swiping
  const onDragStart = (clientX: number) => {
    startXRef.current = clientX;
    setIsDragging(true);
  };

  const onDragMove = (clientX: number) => {
    if (!isDragging || startXRef.current === null) return;
    setDragOffset(clientX - startXRef.current);
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
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-3">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-black uppercase tracking-tight text-foreground">
            Taste The 24 Solar Terms
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto font-normal">
            Every two weeks, a new seasonal blend arrives matched to Jakarta&apos;s climate.
            {!isExpanded ? (
              <span className="font-semibold text-primary ml-1">
                Click on the wheel to reveal the seasonal blend in the center.
              </span>
            ) : (
              <span className="text-foreground ml-1">
                Click any segment on the dial to rotate the wheel to that blend.
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
                  onClick={() =>
                    handleSelectSeason(
                      s.id as 'spring' | 'summer' | 'autumn' | 'winter'
                    )
                  }
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
                  <span className="text-[11px] opacity-75 font-serif">
                    {s.chinese}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================
            CENTERED INTERACTIVE SEASONAL WHEEL WITH DEAD-CENTER PRODUCT
            - Scales up smoothly on click ("agak membesar")
            - Dead-center product appearance with cutout image & price
            - Translucent bottom gradient ("lingkaran bagian bawah agak transparan")
            - Smooth rotation to active term ("lingkaran itu berputar smooth gitu")
            ======================================================== */}
        <div className="flex flex-col items-center justify-center w-full my-4">
          <div
            className={`relative flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isExpanded
                ? 'w-[360px] sm:w-[470px] md:w-[520px] lg:w-[540px]'
                : 'w-[320px] sm:w-[380px] md:w-[420px]'
            } aspect-square`}
          >
            {/* 1. Glowing Season Aura Halo framing the circle */}
            <div
              className="absolute -inset-3 sm:-inset-6 rounded-full blur-[28px] sm:blur-[36px] pointer-events-none -z-10 transition-all duration-1200 ease-in-out opacity-60"
              style={{
                background: currentTerm.glowColor
                  .replace('0.25', '0.65')
                  .replace('0.35', '0.75'),
              }}
            />

            {/* 2. 4-Season Photographic Background on the Circle (Smooth 1200ms Crossfade) */}
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
                      sizes="(max-width: 640px) 360px, (max-width: 1024px) 470px, 540px"
                      className="object-cover object-center filter brightness-[0.94] contrast-[1.08]"
                      priority
                    />
                    {/* Soft atmospheric overlay */}
                    <div className="absolute inset-0 bg-white/20 backdrop-blur-[0.5px]" />
                    <div className="absolute inset-0 bg-radial from-transparent via-black/10 to-black/35" />
                  </div>
                );
              })}

              {/* Bottom Translucency Gradient on Circle: "lingkaran bagian bawah agak transparan" */}
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white/40 via-white/15 to-transparent pointer-events-none" />
            </div>

            {/* 3. SVG Wheel Layer */}
            <svg
              viewBox="0 0 400 400"
              className="w-full h-full overflow-visible relative z-10 select-none"
              role="group"
              aria-label="24 Solar Terms Seasonal Wheel Calendar"
            >
              <defs>
                {/* Center Hub Translucent Bottom Gradient */}
                <linearGradient id="centerHubGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.96" />
                  <stop offset="42%" stopColor="#FFFFFF" stopOpacity="0.88" />
                  <stop offset="72%" stopColor="#FFFFFF" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.12" />
                </linearGradient>
              </defs>

              {/* ROTATING GROUP: 24 Segments Rotate Smoothly When Term is Clicked */}
              <g
                style={{
                  transform: `rotate(${rotationAngle}deg)`,
                  transformOrigin: '200px 200px',
                  transition: 'transform 900ms cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
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
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectTerm(i);
                      }}
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
                          isSelected || isNow ? '#ffffff' : '#1D2A24'
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
              </g>

              {/* NON-ROTATING CENTER HUB: Translucent Bottom ("lingkaran bagian bawah agak transparan") */}
              <circle
                cx={C}
                cy={C}
                r={RI - 4}
                fill="url(#centerHubGradient)"
                stroke="rgba(255, 255, 255, 0.85)"
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
                  r={RI - 8}
                  fill="none"
                  stroke="#B3305A"
                  strokeWidth="1.2"
                  strokeDasharray="4 3"
                  className="animate-spin-slow opacity-60 pointer-events-none"
                />
              )}

              {/* Top Pointer Needle indicating selected term at 12 o'clock */}
              <g className="pointer-events-none">
                <polygon
                  points="195,6 205,6 200,16"
                  fill={currentTerm.ringColor}
                  className="transition-colors duration-700"
                />
                <circle cx="200" cy="5" r="2" fill="#FFFFFF" />
              </g>
            </svg>

            {/* 4. DEAD-CENTER PRODUCT / CONTENT DISPLAY (HTML OVERLAY) */}
            <div
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full flex flex-col items-center justify-center text-center z-20 pointer-events-auto transition-all duration-700 ${
                isExpanded
                  ? 'w-[68%] h-[68%] p-2 sm:p-3'
                  : 'w-[64%] h-[64%] p-3 sm:p-4 cursor-pointer'
              }`}
              onClick={() => {
                if (!isExpanded) setIsExpanded(true);
              }}
            >
              {!isExpanded ? (
                // Compact Initial State Before Click
                <div className="flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-700 animate-fade-in-scale group">
                  <span
                    className="text-[9px] sm:text-[10px] font-mono font-bold tracking-[0.2em] uppercase transition-colors"
                    style={{
                      color: currentTerm.isBrewingNow ? '#B3305A' : '#6B7280',
                    }}
                  >
                    {currentTerm.isBrewingNow
                      ? 'NOW BREWING'
                      : `FROM ${currentTerm.starts.toUpperCase()}`}
                  </span>

                  <span
                    className="text-3xl sm:text-4xl md:text-5xl font-serif font-black tracking-tight my-1 transition-transform group-hover:scale-110 duration-500"
                    style={{ color: currentTerm.ringColor }}
                  >
                    {currentTerm.termChinese}
                  </span>

                  <h3 className="text-base sm:text-lg font-sans font-black uppercase tracking-tight text-foreground">
                    {currentTerm.blend}
                  </h3>

                  <p className="text-[10px] sm:text-xs font-mono text-muted-foreground mt-0.5">
                    {currentTerm.term} · {currentTerm.starts}
                  </p>

                  <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-neutral-200/80 text-[10px] font-mono font-semibold uppercase tracking-wider text-foreground shadow-2xs group-hover:bg-neutral-900 group-hover:text-white transition-all">
                    <Sparkles className="w-3 h-3 text-primary group-hover:text-amber-300" />
                    <span>Click to reveal blend</span>
                  </div>
                </div>
              ) : (
                // Full Expanded Product State Inside the Dead-Center of the Wheel
                <div
                  key={currentTerm.term}
                  className="relative flex flex-col items-center justify-between w-full h-full p-1 sm:p-2 transition-all duration-700 animate-fade-in-scale"
                  onTouchStart={(e) => onDragStart(e.touches[0].clientX)}
                  onTouchMove={(e) => onDragMove(e.touches[0].clientX)}
                  onTouchEnd={onDragEnd}
                  style={{
                    transform: isDragging
                      ? `translateX(${dragOffset}px)`
                      : undefined,
                  }}
                >
                  {/* Season Badge & Chinese Character */}
                  <div className="flex flex-col items-center gap-0.5 pt-0.5">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/95 border border-neutral-200/80 text-foreground text-[10px] sm:text-[11px] font-mono font-bold tracking-wider uppercase shadow-2xs">
                      <span
                        className="w-2 h-2 rounded-full inline-block"
                        style={{ backgroundColor: currentTerm.ringColor }}
                      />
                      <span>
                        {currentTerm.seasonName} · {currentTerm.term}
                      </span>
                      <span className="text-[10px] opacity-75 font-serif font-bold">
                        ({currentTerm.termChinese})
                      </span>
                    </div>
                  </div>

                  {/* Cutout Product Image with Glowing Season Aura */}
                  <div className="relative w-full flex-1 flex items-center justify-center my-0.5 min-h-[110px] sm:min-h-[140px]">
                    {/* Glowing season halo */}
                    <div
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130px] sm:w-[170px] md:w-[190px] h-[130px] sm:h-[170px] md:h-[190px] rounded-full blur-[35px] sm:blur-[45px] pointer-events-none -z-10 transition-all duration-1000 opacity-85"
                      style={{
                        background: currentTerm.glowColor
                          .replace('0.25', '0.6')
                          .replace('0.35', '0.7'),
                      }}
                    />

                    {/* Concentric subtle halo ring */}
                    <div
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100px] sm:w-[130px] md:w-[150px] h-[100px] sm:h-[130px] md:h-[150px] rounded-full border border-white/60 pointer-events-none -z-10"
                      style={{
                        boxShadow: `0 0 30px -5px ${currentTerm.glowColor}`,
                      }}
                    />

                    {/* Cutout Product Image */}
                    <div className="relative w-[100px] sm:w-[135px] md:w-[155px] h-[100px] sm:h-[135px] md:h-[155px] flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
                      <Image
                        src={currentTerm.image}
                        alt={currentTerm.blend}
                        fill
                        sizes="(max-width: 640px) 100px, (max-width: 1024px) 135px, 155px"
                        className="object-contain drop-shadow-[0_16px_28px_rgba(0,0,0,0.24)] filter hover:scale-105 transition-transform duration-500 pointer-events-none"
                        priority
                      />
                    </div>
                  </div>

                  {/* Title, Prices, & Actions */}
                  <div className="flex flex-col items-center gap-1 pb-1">
                    <h3 className="text-xs sm:text-sm md:text-base font-sans font-black uppercase tracking-tight text-foreground leading-tight">
                      {currentTerm.blend}
                    </h3>

                    {/* Hot & Iced Prices */}
                    <div className="flex items-center justify-center gap-1 font-mono text-[9px] sm:text-[10px] md:text-[11px] font-bold text-foreground">
                      <span className="px-2 py-0.5 rounded-full bg-white/95 border border-neutral-200/80 text-neutral-900 shadow-2xs">
                        Hot: {currentTerm.hotPrice}
                      </span>
                      <span className="text-muted-foreground/60">·</span>
                      <span className="px-2 py-0.5 rounded-full bg-white/95 border border-neutral-200/80 text-neutral-900 shadow-2xs">
                        Iced: {currentTerm.icedPrice}
                      </span>
                    </div>

                    {/* Chevrons and Order Button */}
                    <div className="flex items-center justify-center gap-2 mt-0.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrevBlend();
                        }}
                        className="w-6 h-6 rounded-full bg-white/90 hover:bg-white active:scale-95 text-neutral-800 flex items-center justify-center border border-neutral-200 shadow-2xs transition-all cursor-pointer"
                        aria-label="Previous Blend"
                        title="Previous blend"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>

                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-wider shadow-2xs active:scale-95 transition-all"
                      >
                        <span>ORDER</span>
                        <ArrowUpRight className="w-2.5 h-2.5 text-primary-foreground" />
                      </a>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNextBlend();
                        }}
                        className="w-6 h-6 rounded-full bg-white/90 hover:bg-white active:scale-95 text-neutral-800 flex items-center justify-center border border-neutral-200 shadow-2xs transition-all cursor-pointer"
                        aria-label="Next Blend"
                        title="Next blend"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Subtle minimize icon button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsExpanded(false);
                    }}
                    className="absolute top-0 right-0 w-6 h-6 rounded-full bg-white/90 hover:bg-white text-neutral-600 hover:text-neutral-900 border border-neutral-200 flex items-center justify-center shadow-2xs transition-all cursor-pointer active:scale-95"
                    title="Minimize view"
                    aria-label="Minimize view"
                  >
                    <Minimize2 className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
