import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Article } from '@/types';

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const imageSrc =
    article.featured_image || '/images/articles/brewing-guide.jpg';

  const formattedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : new Date(article.created_at).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });

  return (
    <article className="group flex flex-col bg-surface/50 hover:bg-surface border border-border/70 hover:border-border-strong rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-md">
      {/* Visual Frame */}
      <Link
        href={`/media-berita/${article.slug}`}
        className="relative aspect-[16/10] w-full bg-muted overflow-hidden block"
      >
        <Image
          src={imageSrc}
          alt={article.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </Link>

      {/* Editorial Content */}
      <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between space-y-4">
        <div className="space-y-3">
          {/* Subtle Monospaced Metadata */}
          <div className="flex items-center gap-2 text-[10px] font-mono tracking-wider uppercase text-muted-foreground font-semibold">
            <span className="text-accent">{article.category?.name || 'EDUKASI'}</span>
            <span>•</span>
            <span>{formattedDate}</span>
            <span>•</span>
            <span>{article.read_time_minutes} MIN</span>
          </div>

          {/* Minimalist Luxury Headline */}
          <h3 className="font-bold text-base sm:text-lg text-foreground tracking-tight group-hover:text-primary transition-colors line-clamp-2 leading-snug">
            <Link href={`/media-berita/${article.slug}`}>
              {article.title}
            </Link>
          </h3>

          {/* Clean Excerpt */}
          {article.excerpt && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed font-normal">
              {article.excerpt}
            </p>
          )}
        </div>

        {/* Minimalist Bottom Row */}
        <div className="pt-4 border-t border-border/50 flex items-center justify-between text-xs">
          <span className="text-[11px] text-muted-foreground font-medium">
            {article.author_name}
          </span>

          <Link
            href={`/media-berita/${article.slug}`}
            className="inline-flex items-center gap-1 text-[11px] font-mono font-bold uppercase tracking-wider text-foreground group-hover:text-primary transition-colors"
          >
            <span>BACA</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
