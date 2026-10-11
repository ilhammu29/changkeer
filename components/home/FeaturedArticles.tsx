import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { Article } from '@/types';
import { ArrowUpRight } from 'lucide-react';

interface FeaturedArticlesProps {
  articles: Article[];
}

export function FeaturedArticles({ articles }: FeaturedArticlesProps) {
  const displayArticles = articles.slice(0, 2);

  return (
    <section className="py-20 bg-background border-b border-border">
      <Container size="wide">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold tracking-[0.25em] uppercase text-muted-foreground mb-3">
              <span>03 // MEDIA &amp; EDUKASI</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-foreground">
              CATATAN TEH &amp; TRADISI
            </h2>
          </div>

          <Link
            href="/media-berita"
            className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-foreground hover:text-primary transition-colors border-b-2 border-foreground pb-1 self-start md:self-auto"
          >
            <span>BACA SEMUA ARTIKEL</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {displayArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </Container>
    </section>
  );
}
