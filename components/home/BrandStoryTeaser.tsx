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
    <section className="py-24 sm:py-32 lg:py-36 bg-surface border-b border-border overflow-hidden">
      <Container size="wide">
        <Reveal>
          {/* New Editorial Card Layout with Authentic Trio Banner */}
          <div className="rounded-3xl bg-background border border-border/80 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Visual Frame with Trio Product Photo */}
            <div className="lg:col-span-6 relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto lg:min-h-[440px] w-full overflow-hidden bg-muted group">
              <Image
                src="/images/assets/banner2.jpg"
                alt="CHANGKEER Signature Trio Infusions"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-104"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent lg:hidden" />
            </div>

            {/* Editorial Content with Tasteful Medium Headline */}
            <div className="lg:col-span-6 p-7 sm:p-10 lg:p-12 xl:p-14 flex flex-col justify-center space-y-5">
              <div className="space-y-2">
                <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.25em] uppercase text-accent font-semibold block">
                  03 // {tag}
                </span>

                {/* Medium-Sized Headline (Not Too Huge) */}
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold uppercase tracking-tight text-foreground leading-[1.2]">
                  {title}
                </h2>
              </div>

              {/* Concise Narrative with Small & Refined Font */}
              <div className="space-y-3 text-xs sm:text-[13px] text-muted-foreground leading-relaxed font-normal">
                <p>{content}</p>
                <p>
                  Racikan kami dirancang tanpa jalan pintas kimiawi. Setiap kuntum bunga dan helai daun mempertahankan esensi fungsional aslinya, menemani ritual sehari-hari Anda dengan kehangatan rasa yang jujur dan menyegarkan.
                </p>
              </div>

              {/* Brand Philosophy Accent Quote */}
              <blockquote className="border-l-2 border-primary/60 pl-3.5 py-1 text-xs font-serif italic text-foreground/80">
                &ldquo;More Than Tea. A Better You.&rdquo;
              </blockquote>

              {/* Action Button */}
              <div className="pt-2">
                <Link
                  href={linkUrl}
                  className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase bg-primary text-primary-foreground px-6 py-3 rounded-full hover:bg-primary-hover transition-all shadow-xs active:scale-95"
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
