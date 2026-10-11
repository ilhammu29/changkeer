'use client';

import React, { useEffect, useState } from 'react';

export function LoadingScreen() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    setMounted(true);

    try {
      const hasVisited = sessionStorage.getItem('ck_intro_shown');
      if (hasVisited) {
        return;
      }
    } catch {
      // If sessionStorage fails (e.g. strict privacy mode), do not block user
      return;
    }

    // Check prefers-reduced-motion
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      try {
        sessionStorage.setItem('ck_intro_shown', 'true');
      } catch {}
      return;
    }

    setVisible(true);

    // Sequence timing
    const fadeTimer = setTimeout(() => {
      setFading(true);
    }, 1500);

    const hideTimer = setTimeout(() => {
      setVisible(false);
      try {
        sessionStorage.setItem('ck_intro_shown', 'true');
      } catch {}
    }, 2200);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!mounted || !visible) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-between bg-background p-8 sm:p-12 transition-all duration-700 ease-in-out pointer-events-none select-none ${
        fading ? 'opacity-0 scale-[1.02] filter blur-[2px]' : 'opacity-100 scale-100'
      }`}
    >
      {/* Top Header Label */}
      <div className="w-full flex justify-between items-center text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] text-accent/80">
        <span>TUTUP CANGKIR</span>
        <span>EST. 2024</span>
      </div>

      {/* Center Wordmark Reveal */}
      <div className="flex flex-col items-center text-center max-w-xl mx-auto space-y-5">
        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.4em] text-primary/70 animate-in fade-in slide-in-from-bottom-2 duration-700">
          BOTANICAL HERBAL CRAFT
        </span>

        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-[0.25em] text-foreground leading-none animate-in fade-in zoom-in-95 duration-1000">
          CHANGKEER
        </h1>

        {/* Delicate Expanding Hairline */}
        <div className="w-24 sm:w-36 h-[1.5px] bg-primary/60 rounded-full transition-all duration-1000 ease-out" />

        <p className="text-xs sm:text-sm font-medium tracking-[0.25em] uppercase text-muted-foreground animate-in fade-in duration-1000 delay-300">
          MORE THAN TEA. A BETTER YOU.
        </p>
      </div>

      {/* Bottom Editorial Accent */}
      <div className="w-full flex justify-between items-center text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-accent/80">
        <span>MICROPLASTIC-FREE</span>
        <span>SOLAR-TERM INFUSION</span>
      </div>
    </div>
  );
}
