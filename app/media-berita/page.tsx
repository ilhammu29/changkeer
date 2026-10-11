import React from 'react';
import type { Metadata } from 'next';
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
    <div className="py-12 md:py-20">
      <Container size="wide">
        {/* Header */}
        <div className="mb-12 pb-8 border-b border-border">
          <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-accent block mb-2">
            ARSIP EDUKASI &amp; BERITA
          </span>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-foreground">
            MEDIA &amp; BERITA
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-2xl">
            Kumpulan artikel, eksplorasi tanaman herbal nusantara, dan panduan gaya hidup berkesadaran.
          </p>
        </div>

        {/* Interactive Articles Grid */}
        <ArticlesView articles={articles} categories={categories} />
      </Container>
    </div>
  );
}
