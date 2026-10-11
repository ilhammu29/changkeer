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
    link_text?: string;
    link_url?: string;
  };
}

export function BrandStoryTeaser({ story }: BrandStoryTeaserProps) {
  const tag = story?.tag || 'FILOSOFI KAMI';
  const title = story?.title || 'Kembali ke Ritme Alami Tubuh';
  const content =
    story?.content ||
    'Di era modern di mana tubuh dipaksa terus berpacu dengan stimulan sintetis, CHANGKEER hadir sebagai jeda yang bermakna. Kami percaya kekuatan sejati lahir dari keseimbangan alami, kemurnian botani nusantara, dan kejernihan pikiran.';
  const linkText = story?.link_text || 'Baca Kisah Selengkapnya';
  const linkUrl = story?.link_url || '/tentang-kami';

  return (
    <section id="filosofi" className="py-20 sm:py-24 lg:py-28 bg-surface border-b border-border overflow-hidden">
      <Container size="wide">
        <Reveal>
          {/* Full Image Banner with Overlay Content */}
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden min-h-[480px] sm:min-h-[520px] lg:min-h-[560px] flex items-center justify-center p-8 sm:p-14 lg:p-16 border border-border/80 shadow-md">
            {/* Full Background Image */}
            <Image
              src="/images/assets/banner2.jpg"
              alt="CHANGKEER Signature Botanical Craft"
              fill
              sizes="100vw"
              className="object-cover object-center"
              priority
            />

            {/* Dark Cinematic Gradient Overlay for Maximum Legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/75 to-black/60 pointer-events-none" />
            <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/60 pointer-events-none" />

            {/* Content Overlaid on Image */}
            <div className="relative z-10 max-w-2xl mx-auto text-center flex flex-col items-center space-y-6">
              <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] uppercase text-purple-300 font-semibold block">
                {tag}
              </span>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase tracking-tight text-white leading-tight">
                {title}
              </h2>

              <div className="space-y-3 text-xs sm:text-sm text-white/85 leading-relaxed font-normal max-w-xl">
                <p>{content}</p>
                <p className="text-white/75">
                  Racikan kami dirancang tanpa jalan pintas kimiawi. Setiap kuntum bunga dan helai daun mempertahankan esensi fungsional aslinya, menemani ritual sehari-hari Anda dengan kehangatan rasa yang jujur dan menyegarkan.
                </p>
              </div>

              {/* Brand Philosophy Accent Quote */}
              <blockquote className="text-xs sm:text-sm font-serif italic text-white/90 tracking-wide border-y border-white/20 py-2 px-6">
                &ldquo;More Than Tea. A Better You.&rdquo;
              </blockquote>

              {/* Action Button: Reduced Roundedness (rounded-lg instead of rounded-full) */}
              <div className="pt-2">
                <Link
                  href={linkUrl}
                  className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase bg-white text-neutral-900 px-6 py-3 rounded-lg hover:bg-white/90 transition-all shadow-md active:scale-95"
                >
                  <span>{linkText}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
