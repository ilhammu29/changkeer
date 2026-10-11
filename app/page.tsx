import React from 'react';
import { Hero } from '@/components/home/Hero';
import { BrandHighlights } from '@/components/home/BrandHighlights';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { BrandStoryTeaser } from '@/components/home/BrandStoryTeaser';
import { FeaturedArticles } from '@/components/home/FeaturedArticles';
import { getPageContent } from '@/lib/data/pages';
import { getPublishedProducts } from '@/lib/data/products';
import { getPublishedArticles } from '@/lib/data/articles';

export default async function HomePage() {
  const [pageData, products, articles] = await Promise.all([
    getPageContent('home'),
    getPublishedProducts(),
    getPublishedArticles(),
  ]);

  return (
    <>
      <Hero content={pageData?.sections?.hero} />
      <BrandHighlights highlights={pageData?.sections?.highlights} />
      <FeaturedProducts products={products} />
      <BrandStoryTeaser story={pageData?.sections?.story_teaser} />
      <FeaturedArticles articles={articles} />
    </>
  );
}
