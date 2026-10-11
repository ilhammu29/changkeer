import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { ArrowUpRight } from 'lucide-react';

interface BrandStoryTeaserProps {
  story?: {
    tag?: string;
    title?: string;
    content?: string;
    content_secondary?: string;
    quote?: string;
    link_text?: string;
    link_url?: string;
  };
}

export function BrandStoryTeaser({ story }: BrandStoryTeaserProps) {
  const tag = story?.tag || 'OUR PHILOSOPHY';
  const title = story?.title || 'A PAUSE IN EVERY CHANGKEER';
  const paragraph1 =
    story?.content ||
    'Busy days run on caffeine and sugar. Changkeer is meant to be a pause between them: a warm or iced cup that tastes good and lets you slow down for a moment.';
  const paragraph2 =
    story?.content_secondary ||
    'Our blends take no shortcuts. We use real flowers, fruit and spices, with no artificial flavours, no senna, and no white sugar by default. Just an honest cup that fits into your everyday routine.';
  const quote = story?.quote || '“Tea-rrific Every Season”';
  const linkText = story?.link_text || 'ABOUT CHANGKEER';
  const linkUrl = story?.link_url || '/tentang-kami';

  return (
    <section id="filosofi" className="py-24 sm:py-32 lg:py-36 bg-surface border-b border-border overflow-hidden">
      <Container size="wide">
        <Reveal>
          {/* Full Image Banner with Overlay Content - Enlarged Layout */}
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden min-h-[560px] sm:min-h-[620px] lg:min-h-[660px] flex items-center justify-center p-8 sm:p-14 lg:p-20 border border-border/80 shadow-lg">
            {/* Full Background Image */}
            <Image
              src="/images/assets/banner2.jpg"
              alt="CHANGKEER Signature Botanical Craft"
              fill
              sizes="100vw"
              className="object-cover object-center scale-102"
              priority
            />

            {/* Dark Cinematic Gradient Overlay for Maximum Legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/75 to-black/60 pointer-events-none" />
            <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/60 pointer-events-none" />

            {/* Content Overlaid on Image - Enlarged Typography */}
            <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center space-y-7 sm:space-y-8">
              <span className="text-xs sm:text-sm font-mono tracking-[0.3em] uppercase text-purple-300 font-bold block">
                {tag}
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-tight">
                {title}
              </h2>

              <div className="space-y-4 text-sm sm:text-base lg:text-lg text-white/90 leading-relaxed font-normal max-w-2xl">
                <p>{paragraph1}</p>
                <p className="text-white/80">{paragraph2}</p>
              </div>

              {/* Brand Philosophy Accent Quote */}
              <blockquote className="text-sm sm:text-base lg:text-lg font-serif italic text-white/95 tracking-wide border-y border-white/20 py-3.5 px-8">
                &ldquo;{quote.replace(/^["“]|["”]$/g, '')}&rdquo;
              </blockquote>

              {/* Action Button: Reduced Roundedness */}
              <div className="pt-2">
                <Link
                  href={linkUrl}
                  className="inline-flex items-center gap-2.5 text-xs sm:text-sm font-bold tracking-widest uppercase bg-white text-neutral-900 px-7 py-3.5 rounded-xl hover:bg-white/90 transition-all shadow-md active:scale-95"
                >
                  <span>{linkText}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
