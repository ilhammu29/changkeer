import React from 'react';
import { Thermometer, Timer, Coffee, Info } from 'lucide-react';
import { BrewingGuide } from '@/types';

interface BrewingGuideBoxProps {
  guide: BrewingGuide;
}

export function BrewingGuideBox({ guide }: BrewingGuideBoxProps) {
  return (
    <div className="space-y-8 font-sans">
      <div className="border-b border-border/80 pb-4">
        <span className="text-[11px] font-mono font-bold tracking-[0.25em] uppercase text-primary block">
          PANDUAN EKSTRAKSI &amp; SEDUH
        </span>
        <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-foreground mt-1">
          Cara Penyajian Sempurna (&lt; 3 Menit)
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-full border border-primary/20 flex items-center justify-center text-primary shrink-0">
            <Thermometer className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground block">
              SUHU AIR
            </span>
            <span className="text-lg font-black text-foreground block">
              {guide.water_temp || '85°C - 90°C'}
            </span>
            <span className="text-[11px] text-muted-foreground block">
              Suhu optimal ekstraksi aromatik
            </span>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-full border border-primary/20 flex items-center justify-center text-primary shrink-0">
            <Timer className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground block">
              WAKTU SEDUH
            </span>
            <span className="text-lg font-black text-foreground block">
              {guide.steep_time || '2-3 Menit'}
            </span>
            <span className="text-[11px] text-muted-foreground block">
              Keseimbangan rasa tanpa sepat
            </span>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-full border border-primary/20 flex items-center justify-center text-primary shrink-0">
            <Coffee className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground block">
              TAKARAN AIR
            </span>
            <span className="text-lg font-black text-foreground block">
              {guide.serving_size || '250ml - 300ml'}
            </span>
            <span className="text-[11px] text-muted-foreground block">
              Satu kantong teh herbal murni
            </span>
          </div>
        </div>
      </div>

      {guide.notes && (
        <div className="pt-2 flex items-start gap-3 text-xs sm:text-sm text-foreground">
          <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="font-bold text-foreground">Saran Penyajian Praktis:</strong>{' '}
            <span className="text-muted-foreground">{guide.notes}</span>
          </p>
        </div>
      )}
    </div>
  );
}
