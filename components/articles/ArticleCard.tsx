import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, ArrowUpRight } from 'lucide-react';
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
        month: 'long',
        year: 'numeric',
      })
    : new Date(article.created_at).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

  return (
    <article className="group flex flex-col bg-surface border border-border rounded-md overflow-hidden transition-all duration-300 hover:border-border-strong hover:shadow-lg">
      <Link
        href={`/media-berita/${article.slug}`}
        className="relative aspect-[16/10] w-full bg-muted overflow-hidden"
      >
        <Image
          src={imageSrc}
          alt={article.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 bg-surface/90 backdrop-blur-sm text-foreground text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-sm">
          {article.category?.name || 'EDUKASI'}
        </div>
      </Link>

      <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{article.read_time_minutes} MENIT BACA</span>
            </span>
            <span>•</span>
            <span>{formattedDate}</span>
          </div>

          <h3 className="font-bold text-lg text-foreground tracking-tight group-hover:text-primary transition-colors line-clamp-2">
            <Link href={`/media-berita/${article.slug}`}>
              {article.title}
            </Link>
          </h3>

          {article.excerpt && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {article.excerpt}
            </p>
          )}
        </div>

        <div className="pt-4 border-t border-border flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground">
            {article.author_name}
          </span>

          <Link
            href={`/media-berita/${article.slug}`}
            className="text-xs font-bold uppercase tracking-wider text-foreground group-hover:text-primary flex items-center gap-1"
          >
            <span>BACA ARTIKEL</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
