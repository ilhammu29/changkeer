import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { Article } from '@/types';
import { ArrowUpRight } from 'lucide-react';

interface FeaturedArticlesProps {
  articles: Article[];
}

export function FeaturedArticles({ articles }: FeaturedArticlesProps) {
  const displayArticles = articles.slice(0, 2);

  return (
    <section className="py-24 sm:py-32 lg:py-36 bg-background border-b border-border overflow-hidden">
      <Container size="wide">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="space-y-2">
              <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-accent block">
                04 // MEDIA &amp; EDUKASI
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase tracking-tight text-foreground">
                Catatan Teh &amp; Tradisi
              </h2>
            </div>

            <Link
              href="/media-berita"
              className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-foreground hover:text-primary transition-colors border-b border-foreground pb-0.5 self-start md:self-auto"
            >
              <span>BACA SEMUA ARTIKEL</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {displayArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
