import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
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
    'Di era serba cepat di mana tubuh dipaksa terus berpacu dengan stimulan sintetis, CHANGKEER hadir sebagai jeda yang bermakna. Kami percaya kekuatan sejati lahir dari keseimbangan, bukan stimulasi berlebih.';
  const linkText = story?.link_text || 'Baca Kisah Selengkapnya';
  const linkUrl = story?.link_url || '/tentang-kami';

  return (
    <section className="py-24 bg-surface border-b border-border">
      <Container size="wide">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Editorial Header */}
          <div className="lg:col-span-5 space-y-4">
            <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-accent block">
              {tag}
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-foreground leading-[1.05]">
              {title}
            </h2>
          </div>

          {/* Right Narrative & Action */}
          <div className="lg:col-span-7 space-y-8 lg:pl-8">
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-normal">
              {content}
            </p>

            <div className="pt-2">
              <Link
                href={linkUrl}
                className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase bg-primary text-primary-foreground px-6 py-3.5 rounded-sm hover:bg-primary-hover transition-all"
              >
                <span>{linkText}</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
