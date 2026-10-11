import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { ArticlesView } from '@/components/articles/ArticlesView';
import { getPublishedArticles } from '@/lib/data/articles';
import { getCategories } from '@/lib/data/categories';

export const metadata: Metadata = {
  title: 'Media & Berita',
  description:
    'Wawasan dan edukasi seputar teh herbal, tradisi seduh nusantara, dan gaya hidup bernutrisi dari tim CHANGKEER.',
};

export default async function MediaBeritaPage() {
  const [articles, categories] = await Promise.all([
    getPublishedArticles(),
    getCategories('article'),
  ]);

  return (
    <div className="pb-16 sm:pb-24 bg-white font-sans text-foreground">
      {/* Section 1: Hero Banner with Background Image */}
      <section className="relative w-full py-16 sm:py-20 md:py-24 bg-neutral-950 overflow-hidden border-b border-border mb-12 sm:mb-16">
        <Image
          src="/images/assets/vanilla_mint_tea_produk.jpg"
          alt="Media & Berita CHANGKEER"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_35%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/92 via-black/75 to-black/40 pointer-events-none" />

        <Container size="wide" className="relative z-10">
          <div className="max-w-2xl space-y-3">
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] uppercase text-purple-300 block">
              ARSIP EDUKASI &amp; BERITA
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-sans font-black uppercase tracking-tight text-white leading-tight">
              MEDIA &amp; BERITA
            </h1>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed font-normal">
              Kumpulan artikel, eksplorasi tanaman herbal nusantara, dan panduan gaya hidup berkesadaran.
            </p>
          </div>
        </Container>
      </section>

      <Container size="wide">
        {/* Interactive Articles Grid */}
        <ArticlesView articles={articles} categories={categories} />
      </Container>
    </div>
  );
}
