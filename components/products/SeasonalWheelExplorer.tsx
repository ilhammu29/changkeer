'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import Image from 'next/image';
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  Sparkles,
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
  const defaultIdx = 16;
  const [selectedTermIndex, setSelectedTermIndex] = useState<number>(defaultIdx);
  const [hoveredTermIndex, setHoveredTermIndex] = useState<number | null>(null);

  // Initial state: circle alone without product; when clicked, expands and reveals product
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Shortest path rotation angle for the dial (aligns active term at 12 o'clock needle)
  const [rotationAngle, setRotationAngle] = useState<number>(
    -(defaultIdx * 15 + 7.5)
  );

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

  // Compute shortest angular path for continuous smooth dial rotation
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
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNextBlend();
      if (e.key === 'ArrowLeft') handlePrevBlend();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextBlend, handlePrevBlend]);

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
                Click the wheel to expand and reveal the blend.
              </span>
            ) : (
              <span className="text-foreground ml-1">
                Click any segment on the dial to rotate to that blend.
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

            {isExpanded && (
              <button
                onClick={() => setIsExpanded(false)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/80 hover:bg-white text-neutral-700 border border-neutral-200/80 text-xs font-medium transition-all duration-300 ml-1 cursor-pointer shadow-xs active:scale-95"
                title="Collapse to compact dial"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Compact View</span>
              </button>
            )}
          </div>
        </div>

        {/* ========================================================
            STAGE:
            - Lingkaran dulu tanpa produk (Initial State)
            - Ketika diklik, lingkaran membesar dan menampilkan produk di tengah
            - Kiri & kanan muncul TANPA CARDBOX:
              * Kiri: hanya harga untuk ice dan hot
              * Kanan: hanya judul dan simbol
            ======================================================== */}
        <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 xl:gap-16 pt-2">
          {/* ========================================================
              SISI KIRI: HANYA HARGA UNTUK ICE DAN HOT (TANPA CARDBOX)
              ======================================================== */}
          <div
            className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isExpanded
                ? 'w-full lg:w-48 xl:w-56 opacity-100 translate-x-0 pointer-events-auto'
                : 'w-0 opacity-0 -translate-x-8 pointer-events-none overflow-hidden max-h-0 lg:max-h-none'
            }`}
          >
            <div className="flex flex-col items-center lg:items-end text-center lg:text-right space-y-4 select-none">
              {/* Hot Price */}
              <div className="space-y-0.5">
                <span className="text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-muted-foreground block">
                  HOT · 350ML
                </span>
                <span className="text-3xl sm:text-4xl lg:text-5xl font-mono font-black text-foreground tracking-tight block">
                  {currentTerm.hotPrice}
                </span>
              </div>

              <div className="w-12 h-px bg-neutral-200/90 hidden lg:block" />

              {/* Iced Price */}
              <div className="space-y-0.5">
                <span className="text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-muted-foreground block">
                  ICED · 450ML
                </span>
                <span className="text-3xl sm:text-4xl lg:text-5xl font-mono font-black text-foreground tracking-tight block">
                  {currentTerm.icedPrice}
                </span>
              </div>

              {/* Order & Navigation Controls */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={handlePrevBlend}
                  className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer active:scale-95"
                  aria-label="Previous Blend"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>PREV</span>
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white font-mono text-[10px] font-bold uppercase tracking-wider shadow-xs active:scale-95 transition-all cursor-pointer"
                >
                  <span>ORDER</span>
                  <ArrowUpRight className="w-3 h-3 text-primary-foreground" />
                </a>
              </div>
            </div>
          </div>

          {/* ========================================================
              TENGAH: LINGKARAN MEMBESAR SAAT DIKLIK & MENAMPILKAN PRODUK
              - Sedikit kepotong transparan di bagian bawah
              - Lingkaran membesar saat diklik
              - Menampilkan produk cangkir besar di tengah saat diklik
              ======================================================== */}
          <div className="flex flex-col items-center justify-center shrink-0 relative my-2 lg:my-0">
            {/* The Cut-Off Translucent Circular Wheel Container */}
            <div
              className={`relative flex items-center justify-center aspect-square select-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isExpanded
                  ? 'w-[360px] sm:w-[450px] md:w-[490px] lg:w-[520px]'
                  : 'w-[310px] sm:w-[370px] md:w-[400px] cursor-pointer'
              }`}
              onClick={() => {
                if (!isExpanded) setIsExpanded(true);
              }}
            >
              {/* Glowing Season Aura Halo framing the wheel */}
              <div
                className="absolute -inset-3 sm:-inset-6 rounded-full blur-[30px] sm:blur-[42px] pointer-events-none -z-10 transition-all duration-1200 ease-in-out opacity-65"
                style={{
                  background: currentTerm.glowColor
                    .replace('0.25', '0.65')
                    .replace('0.35', '0.75'),
                }}
              />

              {/* Masked Wheel Container: Sedikit Kepotong Transparan di Bagian Bawah */}
              <div className="absolute inset-0 rounded-full overflow-hidden [mask-image:linear-gradient(to_bottom,black_0%,black_76%,rgba(0,0,0,0.35)_88%,transparent_100%)]">
                {/* 4-Season Photographic Background on the Circle */}
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
                        sizes="(max-width: 640px) 360px, (max-width: 1024px) 490px, 520px"
                        className="object-cover object-center filter brightness-[0.94] contrast-[1.08]"
                        priority
                      />
                      {/* Atmospheric overlays */}
                      <div className="absolute inset-0 bg-white/20 backdrop-blur-[0.5px]" />
                      <div className="absolute inset-0 bg-radial from-transparent via-black/10 to-black/35" />
                    </div>
                  );
                })}

                {/* Bottom soft gradient fade */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white/45 via-white/20 to-transparent pointer-events-none" />
              </div>

              {/* SVG Wheel Rotating Dial Layer (with bottom transparent gradient mask) */}
              <svg
                viewBox="0 0 400 400"
                className="w-full h-full overflow-visible relative z-10 select-none [mask-image:linear-gradient(to_bottom,black_0%,black_76%,rgba(0,0,0,0.35)_88%,transparent_100%)]"
                role="group"
                aria-label="24 Solar Terms Seasonal Wheel Calendar"
              >
                <defs>
                  {/* Center Hub Translucent Bottom Gradient */}
                  <linearGradient id="centerHubGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
                    <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.85" />
                    <stop offset="75%" stopColor="#FFFFFF" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.05" />
                  </linearGradient>
                </defs>

                {/* Rotating Segments Group (Rotates Smoothly to 12 o'clock needle) */}
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
                          fill={isSelected || isNow ? '#ffffff' : '#1D2A24'}
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

                {/* Non-Rotating Center Hub: Translucent Bottom */}
                <circle
                  cx={C}
                  cy={C}
                  r={RI - 4}
                  fill="url(#centerHubGradient)"
                  stroke="rgba(255, 255, 255, 0.85)"
                  strokeWidth="1.5"
                  className="drop-shadow-xs"
                />

                {/* Inner Ring Glow if Brewing Now */}
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
                  <circle cx="200" cy="5" r="2.2" fill="#FFFFFF" />
                </g>
              </svg>

              {/* ========================================================
                  CENTER CONTENT:
                  - SEBELUM DIKLIK: Lingkaran dulu tanpa produk (Clean Dial Hub)
                  - KETIKA DIKLIK: Menampilkan produk cangkir besar di tengah
                  ======================================================== */}
              {!isExpanded ? (
                // 1. Initial State: Tanpa Produk (Dial Hub Preview)
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center text-center select-none z-20 p-4 transition-all duration-700 animate-fade-in-scale group"
                  onClick={() => setIsExpanded(true)}
                >
                  <span
                    className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase transition-colors"
                    style={{
                      color: currentTerm.isBrewingNow ? '#B3305A' : '#6B7280',
                    }}
                  >
                    {currentTerm.isBrewingNow
                      ? 'NOW BREWING'
                      : currentTerm.seasonName.toUpperCase()}
                  </span>

                  <span
                    className="text-4xl sm:text-5xl font-serif font-black tracking-tight my-1.5 transition-transform group-hover:scale-110 duration-500"
                    style={{ color: currentTerm.ringColor }}
                  >
                    {currentTerm.termChinese}
                  </span>

                  <h3 className="text-base sm:text-lg font-sans font-black uppercase tracking-tight text-foreground">
                    {currentTerm.blend}
                  </h3>

                  <span className="text-[10px] sm:text-xs font-mono text-muted-foreground mt-0.5">
                    {currentTerm.term} · {currentTerm.starts}
                  </span>

                  <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-neutral-200/80 text-[10px] font-mono font-bold uppercase tracking-wider text-foreground shadow-2xs group-hover:bg-neutral-900 group-hover:text-white transition-all">
                    <Sparkles className="w-3 h-3 text-primary group-hover:text-amber-300" />
                    <span>Click to reveal blend</span>
                  </div>
                </div>
              ) : (
                // 2. Activated State: Menampilkan Produk Besar di Tengah Lingkaran
                <div
                  key={currentTerm.term}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 animate-fade-in-scale"
                >
                  {/* Glowing Season Halo behind cutout cup */}
                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] sm:w-[270px] md:w-[310px] h-[220px] sm:h-[270px] md:h-[310px] rounded-full blur-[45px] sm:blur-[60px] pointer-events-none -z-10 transition-all duration-1000 opacity-85"
                    style={{
                      background: currentTerm.glowColor
                        .replace('0.25', '0.65')
                        .replace('0.35', '0.75'),
                    }}
                  />

                  {/* Concentric Subtle Halo Ring */}
                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] sm:w-[220px] md:w-[250px] h-[180px] sm:h-[220px] md:h-[250px] rounded-full border border-white/70 pointer-events-none -z-10"
                    style={{
                      boxShadow: `0 0 45px -8px ${currentTerm.glowColor}`,
                    }}
                  />

                  {/* Large Cutout Product Cup Image */}
                  <div className="relative w-[210px] sm:w-[260px] md:w-[290px] lg:w-[320px] h-[220px] sm:h-[270px] md:h-[300px] lg:h-[330px] flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
                    <Image
                      src={currentTerm.image}
                      alt={currentTerm.blend}
                      fill
                      sizes="(max-width: 640px) 210px, (max-width: 1024px) 290px, 320px"
                      className="object-contain drop-shadow-[0_22px_36px_rgba(0,0,0,0.25)] hover:scale-105 transition-transform duration-500 pointer-events-auto"
                      priority
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ========================================================
              SISI KANAN: HANYA JUDUL DAN SIMBOL (TANPA CARDBOX)
              ======================================================== */}
          <div
            className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isExpanded
                ? 'w-full lg:w-48 xl:w-60 opacity-100 translate-x-0 pointer-events-auto'
                : 'w-0 opacity-0 translate-x-8 pointer-events-none overflow-hidden max-h-0 lg:max-h-none'
            }`}
          >
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-3 select-none">
              {/* Simbol: Chinese Glyph Symbol + Season info */}
              <div className="flex flex-col items-center lg:items-start gap-1">
                <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ backgroundColor: currentTerm.ringColor }}
                  />
                  <span>
                    {currentTerm.seasonName} · {currentTerm.term}
                  </span>
                  {currentTerm.isBrewingNow && (
                    <span className="text-[10px] font-bold text-[#B3305A] uppercase tracking-widest">
                      · BREWING
                    </span>
                  )}
                </div>

                {/* Large Chinese Glyph Symbol */}
                <div
                  className="text-5xl sm:text-6xl lg:text-7xl font-serif font-black tracking-tight select-none my-1 transition-colors duration-700 leading-none"
                  style={{ color: currentTerm.ringColor }}
                >
                  {currentTerm.termChinese}
                </div>
              </div>

              {/* Judul: Blend Title & Date */}
              <div className="space-y-1">
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-black uppercase tracking-tight text-foreground leading-tight">
                  {currentTerm.blend}
                </h3>
                <p className="text-xs sm:text-sm font-mono text-muted-foreground">
                  Starts {currentTerm.starts} · Term {(selectedTermIndex + 1).toString().padStart(2, '0')}/24
                </p>
              </div>

              {/* Next Navigation Control */}
              <div className="pt-2">
                <button
                  onClick={handleNextBlend}
                  className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer active:scale-95"
                  aria-label="Next Blend"
                >
                  <span>NEXT</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
