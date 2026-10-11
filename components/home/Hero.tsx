'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowDown, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Container } from '@/components/ui/Container';

interface HeroProps {
  content?: Record<string, unknown>;
}

export function Hero({ content: _content }: HeroProps = {}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Check user preference for reduced motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.matches) {
      setReducedMotion(true);
      if (videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
      return;
    }

    // Ensure robust inline autoplay on modern browsers
    const video = videoRef.current;
    if (video) {
      video.defaultMuted = true;
      video.muted = true;
      video.playsInline = true;
      video.setAttribute('playsinline', 'true');
      video.setAttribute('webkit-playsinline', 'true');

      const handleCanPlay = () => {
        video.play().catch(() => {
          setIsPlaying(false);
        });
      };

      video.addEventListener('canplay', handleCanPlay);

      // Attempt immediate play
      video.play().catch(() => {
        setIsPlaying(false);
      });

      return () => {
        video.removeEventListener('canplay', handleCanPlay);
      };
    }
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <section className="relative w-full h-[100svh] min-h-[580px] flex items-center justify-center overflow-hidden bg-[#0c0b11] select-none">
      {/* Background Video Layer (Full-Bleed 100svh using video-3.mp4) */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-[#0c0b11]">
        {reducedMotion ? (
          <Image
            src="/images/hero/hero-video-poster.jpg"
            alt="CHANGKEER Cinematic Tea Craft"
            fill
            priority
            className="object-cover object-center"
          />
        ) : (
          <video
            ref={videoRef}
            src="/videos/video-3.mp4"
            poster="/images/hero/hero-video-poster.jpg"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover object-center animate-hero-video-enter"
          >
            <source src="/videos/video-3.mp4" type="video/mp4" />
          </video>
        )}
      </div>

      {/* Subtle Cinematic Vignette */}
      <div className="absolute inset-0 bg-radial from-transparent via-black/15 to-black/50 z-10 pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-background via-background/40 to-transparent z-10 pointer-events-none" />

      {/* Center Hero Heading 1 (Appears First, Then Dissolves as Video Enters) */}
      <Container size="wide" className="relative z-20 px-4 sm:px-6 pointer-events-none">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center justify-center">
          <h1 className="font-serif sm:font-sans font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl uppercase tracking-[0.22em] sm:tracking-[0.28em] text-white leading-none drop-shadow-2xl animate-hero-heading-sequence select-none">
            CHANGKEER
          </h1>
        </div>
      </Container>

      {/* Bottom Discreet Controls & Scroll Prompt */}
      <div className="absolute bottom-6 sm:bottom-8 inset-x-0 flex flex-col items-center justify-center gap-3 z-20 pointer-events-auto">
        {!reducedMotion && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={togglePlay}
              className="w-10 h-10 rounded-full border border-white/30 bg-black/35 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/20 hover:border-white transition-all active:scale-90 cursor-pointer shadow-md"
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
              title={isPlaying ? 'Pause video' : 'Play video'}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>

            <button
              type="button"
              onClick={toggleMute}
              className="w-10 h-10 rounded-full border border-white/30 bg-black/35 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/20 hover:border-white transition-all active:scale-90 cursor-pointer shadow-md"
              aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
              title={isMuted ? 'Unmute audio' : 'Mute audio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        )}

        <a
          href="#highlights"
          className="flex items-center gap-1.5 text-white/60 hover:text-white transition-colors text-[10px] font-mono tracking-[0.25em] uppercase pt-1"
          aria-label="Scroll down to exploration"
        >
          <span>EXPLORE</span>
          <ArrowDown className="w-3 h-3 animate-bounce" />
        </a>
      </div>
    </section>
  );
}
