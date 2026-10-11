'use client';

import React, { useState, useCallback } from 'react';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { ArrowLeft, ArrowRight, RotateCw, Thermometer, Clock, GlassWater } from 'lucide-react';

const STEPS = [
  {
    num: '01',
    stepNumber: 1,
    angle: 0,
    title: 'Siapkan Air Panas 85°–95°C',
    time: '< 1 Menit',
    tag: 'SUHU OPTIMAL',
    icon: Thermometer,
    description:
      'Tuangkan 250ml – 300ml air panas berkualitas dengan suhu 85°–95°C ke dalam cangkir favorit Anda untuk membangunkan minyak atsiri alami botani tanpa merusak antioksidan polifenol daun teh.',
    tip: 'Hindari air mendidih 100°C mendidih bergolak agar kelopak melati tidak layu terpanggang.',
  },
  {
    num: '02',
    stepNumber: 2,
    angle: 120,
    title: 'Tutup Cangkir & Seduh < 3 Menit',
    time: '2–3 Menit',
    tag: 'EKSTRAKSI TERTUTUP',
    icon: Clock,
    description:
      'Masukkan kantung teh CHANGKEER lalu tutup cangkir rapat selama 2 hingga 3 menit. Penutupan menjaga uap esensial agar aroma botani terkonsentrasi optimal dan rasa manis alami sorgum terlarut merata.',
    tip: 'Kemasan bebas mikroplastik aman terendam air panas tanpa melepaskan partikel polimer sintetis.',
  },
  {
    num: '03',
    stepNumber: 3,
    angle: 240,
    title: 'Nikmati Hangat atau Dingin',
    time: 'Siap Dinikmati',
    tag: 'PENYAJIAN FLEKSIBEL',
    icon: GlassWater,
    description:
      'Nikmati selagi hangat untuk ketenangan batin dan melegakan tenggorokan, atau tuangkan ke atas pecahan es batu untuk sensasi kesegaran dingin instan yang membangkitkan stamina harian.',
    tip: 'Rasa manis lembut alami madu dan sorgum tetap seimbang baik disajikan hangat maupun dingin.',
  },
];

export function BrewingRitualCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [rotationDegree, setRotationDegree] = useState(0);

  const total = STEPS.length;
  const current = STEPS[activeIndex];

  const goToStep = useCallback((index: number, direction: 'next' | 'prev' = 'next') => {
    setActiveIndex(index);
    setRotationDegree((prev) => (direction === 'next' ? prev + 120 : prev - 120));
  }, []);

  const handleNext = () => {
    const nextIdx = (activeIndex + 1) % total;
    goToStep(nextIdx, 'next');
  };

  const handlePrev = () => {
    const prevIdx = (activeIndex - 1 + total) % total;
    goToStep(prevIdx, 'prev');
  };

  return (
    <section className="py-24 sm:py-28 lg:py-32 border-b border-border/40 bg-surface text-foreground overflow-hidden">
      <Container size="wide">
        {/* Section Heading (Medium Restrained Size) */}
        <Reveal>
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-16 sm:mb-20">
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] uppercase text-accent block">
              03 // RITUAL PENYAJIAN CEPAT
            </span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-foreground">
              3 Langkah Nikmat &lt; 3 Menit
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Ekstraksi rasa dan aroma botani maksimal tanpa ribet, menemani kesibukan aktif harian Anda.
            </p>
          </div>
        </Reveal>

        {/* 360° Circular Revolving Carousel Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center max-w-5xl mx-auto">
          {/* LEFT: 360-Degree Circular Dial Animation */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            <div className="relative w-[280px] sm:w-[340px] h-[280px] sm:h-[340px] flex items-center justify-center">
              {/* Outer Decorative Track */}
              <div className="absolute inset-0 rounded-full border border-border/60 pointer-events-none" />
              <div className="absolute inset-4 rounded-full border border-dashed border-border/40 pointer-events-none" />

              {/* Rotating 360° Circular Dial Component */}
              <div
                className="absolute inset-0 flex items-center justify-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ transform: `rotate(${rotationDegree}deg)` }}
              >
                {/* 3 Orbital Markers around 360 degrees (0°, 120°, 240°) */}
                {STEPS.map((step, idx) => {
                  const rad = ((idx * 120 - 90) * Math.PI) / 180;
                  const radius = 130; // distance from center in px
                  const x = radius * Math.cos(rad);
                  const y = radius * Math.sin(rad);

                  const isCurrent = activeIndex === idx;

                  return (
                    <button
                      key={step.num}
                      type="button"
                      onClick={() => {
                        if (idx !== activeIndex) {
                          goToStep(idx, idx > activeIndex ? 'next' : 'prev');
                        }
                      }}
                      className="absolute w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-transform duration-500 hover:scale-110 active:scale-95"
                      style={{
                        transform: `translate(${x}px, ${y}px) rotate(${-rotationDegree}deg)`,
                      }}
                      aria-label={`Pilih langkah ${step.num}`}
                    >
                      <div
                        className={`w-11 h-11 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 shadow-md ${
                          isCurrent
                            ? 'bg-primary text-primary-foreground ring-4 ring-primary/20 scale-110'
                            : 'bg-background text-muted-foreground border border-border hover:border-primary/60 hover:text-foreground'
                        }`}
                      >
                        {step.num}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Center Dial Hub: Active Step Details & Icon */}
              <div className="relative z-10 w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-background border border-border shadow-xl flex flex-col items-center justify-center p-4 text-center">
                <current.icon className="w-6 h-6 text-primary mb-1 transition-transform duration-500" />
                <span className="font-mono text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                  {current.num}
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mt-0.5">
                  {current.time}
                </span>
              </div>
            </div>

            {/* Orbital Stepper Indicators */}
            <div className="flex items-center gap-2 mt-8">
              {STEPS.map((step, idx) => (
                <button
                  key={step.num}
                  type="button"
                  onClick={() => goToStep(idx, idx > activeIndex ? 'next' : 'prev')}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    activeIndex === idx ? 'w-8 bg-primary' : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60'
                  }`}
                  aria-label={`Buka langkah ${step.num}`}
                />
              ))}
            </div>
          </div>

          {/* RIGHT: Active Step Content with Smooth Transition */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-mono tracking-widest uppercase font-semibold">
              <RotateCw className="w-3 h-3 animate-spin" style={{ animationDuration: '8s' }} />
              <span>{current.tag}</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-xs font-bold text-primary">LANGKAH {current.num}</span>
                <span className="text-muted-foreground text-xs">•</span>
                <span className="text-xs text-muted-foreground font-mono">{current.time}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-foreground leading-snug">
                {current.title}
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {current.description}
            </p>

            {/* Practical Brewer Tip */}
            <div className="p-4 rounded-xl bg-background border border-border/80 text-xs text-muted-foreground space-y-1">
              <span className="font-mono text-[10px] font-bold text-foreground uppercase tracking-wider block">
                TIPS PENYEDUHAN:
              </span>
              <p className="leading-relaxed">{current.tip}</p>
            </div>

            {/* Navigation Buttons for 360° Revolution */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handlePrev}
                className="w-10 h-10 rounded-full border border-border bg-background hover:bg-surface-hover text-foreground flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-xs"
                aria-label="Langkah sebelumnya (putar -120°)"
                title="Langkah Sebelumnya"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="w-10 h-10 rounded-full border border-border bg-background hover:bg-surface-hover text-foreground flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-xs"
                aria-label="Langkah berikutnya (putar +120°)"
                title="Langkah Berikutnya"
              >
                <ArrowRight className="w-4 h-4" />
              </button>

              <span className="text-xs font-mono text-muted-foreground tracking-wider pl-2">
                0{activeIndex + 1} / 0{total} • Putar Ritual
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
