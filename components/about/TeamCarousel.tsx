'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface TeamMember {
  num: string;
  initials: string;
  name: string;
  role: string;
  note: string;
}

interface TeamCarouselProps {
  members: TeamMember[];
}

export function TeamCarousel({ members }: TeamCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % members.length);
  }, [members.length]);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + members.length) % members.length);
  }, [members.length]);

  // Continuous Auto-looping carousel
  useEffect(() => {
    if (isPaused || members.length <= 1) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused, members.length, nextSlide]);

  // Calculate relative position for each card in the circular loop
  const getCardPosition = (index: number) => {
    const total = members.length;
    let diff = (index - activeIndex) % total;
    if (diff < -Math.floor(total / 2)) diff += total;
    if (diff > Math.floor(total / 2)) diff -= total;
    return diff; // 0 = active center, -1 = left, +1 = right, others = background
  };

  return (
    <div
      className="relative font-sans py-6 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Stage: 3D Perspective Container */}
      <div className="relative min-h-[380px] sm:min-h-[420px] flex items-center justify-center overflow-hidden px-4">
        {members.map((member, idx) => {
          const position = getCardPosition(idx);
          const isCenter = position === 0;
          const isLeft = position === -1;
          const isRight = position === 1;
          const isVisible = Math.abs(position) <= 1;

          // Compute transform styles for smooth looping
          let transformStyle = 'translate3d(0, 0, 0) scale(0.8)';
          let opacity = '0';
          let zIndex = 0;

          if (isCenter) {
            transformStyle = 'translate3d(0, 0, 0) scale(1.08)';
            opacity = '1';
            zIndex = 30;
          } else if (isLeft) {
            transformStyle = 'translate3d(-85%, 0, 0) scale(0.92)';
            opacity = '0.65';
            zIndex = 20;
          } else if (isRight) {
            transformStyle = 'translate3d(85%, 0, 0) scale(0.92)';
            opacity = '0.65';
            zIndex = 20;
          } else {
            transformStyle = position < 0 
              ? 'translate3d(-150%, 0, 0) scale(0.7)'
              : 'translate3d(150%, 0, 0) scale(0.7)';
            opacity = '0';
            zIndex = 10;
          }

          return (
            <div
              key={member.num}
              onClick={() => {
                if (isLeft) prevSlide();
                if (isRight) nextSlide();
              }}
              style={{
                transform: transformStyle,
                opacity: isVisible ? opacity : '0',
                zIndex,
                pointerEvents: isVisible ? 'auto' : 'none',
              }}
              className={`absolute w-full max-w-sm sm:max-w-md transition-all duration-700 ease-out cursor-pointer ${
                isCenter ? 'cursor-default' : 'hover:opacity-90'
              }`}
            >
              <div
                className={`rounded-3xl p-5 sm:p-8 flex flex-col justify-between space-y-5 sm:space-y-6 transition-all duration-700 ${
                  isCenter
                    ? 'bg-white border-2 border-primary shadow-2xl ring-4 ring-primary/10'
                    : 'bg-white/90 backdrop-blur-xs border border-border/80 shadow-md'
                }`}
              >
                {/* Top Row: Numeral & Circular Monogram Badge */}
                <div className="flex items-center justify-between border-b border-border/60 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs uppercase tracking-widest text-primary font-bold">
                      FOUNDER {member.num}
                    </span>
                    {isCenter && (
                      <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                        ACTIVE
                      </span>
                    )}
                  </div>

                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center font-mono font-bold text-xs shadow-2xs transition-all duration-500 ${
                      isCenter
                        ? 'bg-primary text-primary-foreground scale-110 shadow-md'
                        : 'bg-primary/10 text-primary border border-primary/20'
                    }`}
                  >
                    {member.initials}
                  </div>
                </div>

                {/* Center Content: Full Name & Role */}
                <div className="space-y-2.5">
                  <span className="text-[10px] font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-neutral-100 text-foreground border border-border/60 inline-block">
                    {member.role}
                  </span>

                  <h3
                    className={`font-sans font-black uppercase tracking-tight leading-snug transition-colors ${
                      isCenter
                        ? 'text-lg sm:text-xl text-foreground'
                        : 'text-base sm:text-lg text-foreground/80'
                    }`}
                  >
                    {member.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-1">
                    {member.note}
                  </p>
                </div>

                {/* Bottom Border Accent */}
                <div className="pt-3 border-t border-border/60 flex items-center justify-between text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                  <span>CHANGKEER FOUNDING TEAM</span>
                  <span className="text-primary font-bold">JAKARTA</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Controls & Loop Indicators */}
      <div className="mt-8 flex items-center justify-center gap-6">
        {/* Previous Button */}
        <button
          type="button"
          onClick={prevSlide}
          className="w-10 h-10 rounded-full bg-white border border-border/80 text-foreground hover:bg-neutral-100 flex items-center justify-center shadow-xs transition-all active:scale-95 cursor-pointer"
          aria-label="Previous team member"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Dynamic Dot Indicators */}
        <div className="flex items-center gap-1.5">
          {members.map((m, idx) => (
            <button
              key={m.num}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className="p-2 flex items-center justify-center cursor-pointer group focus:outline-none"
              aria-label={`Go to slide ${idx + 1}`}
            >
              <span
                className={`h-2 rounded-full transition-all duration-300 block ${
                  activeIndex === idx
                    ? 'w-8 bg-foreground shadow-xs'
                    : 'w-2 bg-neutral-300 group-hover:bg-neutral-500'
                }`}
              />
            </button>
          ))}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={nextSlide}
          className="w-10 h-10 rounded-full bg-white border border-border/80 text-foreground hover:bg-neutral-100 flex items-center justify-center shadow-xs transition-all active:scale-95 cursor-pointer"
          aria-label="Next team member"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
