import React from 'react';
import { Thermometer, Timer, Coffee, Info } from 'lucide-react';
import { BrewingGuide } from '@/types';

interface BrewingGuideBoxProps {
  guide: BrewingGuide;
}

export function BrewingGuideBox({ guide }: BrewingGuideBoxProps) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
      <div className="border-b border-border/80 pb-4">
        <span className="text-[11px] font-mono font-bold tracking-[0.25em] uppercase text-accent block">
          PANDUAN EKSTRAKSI &amp; SEDUH
        </span>
        <h3 className="text-xl sm:text-2xl font-extrabold uppercase tracking-tight text-foreground mt-1">
          Cara Penyajian Sempurna (&lt; 3 Menit)
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="flex items-start gap-3.5 p-4 rounded-xl bg-muted/40 border border-border/60">
          <div className="p-2.5 rounded-lg bg-surface text-accent shadow-xs border border-border/40">
            <Thermometer className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground block">
              SUHU AIR
            </span>
            <span className="text-base font-extrabold text-foreground">
              {guide.water_temp || '85°C - 90°C'}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3.5 p-4 rounded-xl bg-muted/40 border border-border/60">
          <div className="p-2.5 rounded-lg bg-surface text-accent shadow-xs border border-border/40">
            <Timer className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground block">
              WAKTU SEDUH
            </span>
            <span className="text-base font-extrabold text-foreground">
              {guide.steep_time || '2-3 Menit'}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3.5 p-4 rounded-xl bg-muted/40 border border-border/60">
          <div className="p-2.5 rounded-lg bg-surface text-accent shadow-xs border border-border/40">
            <Coffee className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground block">
              TAKARAN AIR
            </span>
            <span className="text-base font-extrabold text-foreground">
              {guide.serving_size || '250ml - 300ml'}
            </span>
          </div>
        </div>
      </div>

      {guide.notes && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-accent-subtle/60 border border-accent/20 text-xs text-foreground">
          <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="font-semibold text-foreground">Saran Penyajian Praktis:</strong>{' '}
            <span className="text-muted-foreground">{guide.notes}</span>
          </p>
        </div>
      )}
    </div>
  );
}
