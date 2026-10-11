import React from 'react';
import { Thermometer, Timer, Coffee, Info } from 'lucide-react';
import { BrewingGuide } from '@/types';

interface BrewingGuideBoxProps {
  guide: BrewingGuide;
}

export function BrewingGuideBox({ guide }: BrewingGuideBoxProps) {
  return (
    <div className="bg-surface border border-border rounded-lg p-6 sm:p-8 space-y-6">
      <div className="border-b border-border pb-4">
        <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-muted-foreground">
          PANDUAN EKSTRAKSI
        </h4>
        <h3 className="text-xl font-black uppercase tracking-tight text-foreground mt-1">
          CARA PENYAJIAN SEMPURNA
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="flex items-start gap-3.5 p-4 rounded-md bg-muted/60">
          <div className="p-2.5 rounded-sm bg-surface text-accent shadow-sm">
            <Thermometer className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
              SUHU AIR
            </span>
            <span className="text-base font-extrabold text-foreground">
              {guide.water_temp || '90-95°C'}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3.5 p-4 rounded-md bg-muted/60">
          <div className="p-2.5 rounded-sm bg-surface text-accent shadow-sm">
            <Timer className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
              WAKTU SEDUH
            </span>
            <span className="text-base font-extrabold text-foreground">
              {guide.steep_time || '4-5 Menit'}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3.5 p-4 rounded-md bg-muted/60">
          <div className="p-2.5 rounded-sm bg-surface text-accent shadow-sm">
            <Coffee className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
              TAKIRAN AIR
            </span>
            <span className="text-base font-extrabold text-foreground">
              {guide.serving_size || '250ml'}
            </span>
          </div>
        </div>
      </div>

      {guide.notes && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-md bg-accent-subtle/70 border border-border text-xs text-foreground">
          <Info className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="font-semibold">Saran Penyajian:</strong> {guide.notes}
          </p>
        </div>
      )}
    </div>
  );
}
