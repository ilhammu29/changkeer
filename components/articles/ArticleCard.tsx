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
    <article className="group relative aspect-[4/5] sm:aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-border/60">
      {/* Full Background Image */}
      <Image
        src={imageSrc}
        alt={article.title}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
      />

      {/* Dark Cinematic Gradient Overlay for Crisp Text Legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/45 to-black/20 pointer-events-none transition-opacity duration-500 group-hover:via-black/55" />

      {/* Top Tag Moniker */}
      <div className="absolute top-5 left-5 z-10">
        <span className="text-[10px] font-mono tracking-widest uppercase text-white font-semibold px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20">
          {article.category?.name || 'EDUKASI'}
        </span>
      </div>

      {/* Bottom Overlaid Text */}
      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7 z-10 flex flex-col justify-end space-y-3 text-white">
        {/* Date & Read time */}
        <div className="flex items-center gap-2 text-[10px] font-mono tracking-wider uppercase text-white/70">
          <span>{formattedDate}</span>
          <span>•</span>
          <span>{article.read_time_minutes} MIN BACA</span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-base sm:text-lg text-white tracking-tight leading-snug line-clamp-2 group-hover:text-purple-200 transition-colors">
          <Link href={`/media-berita/${article.slug}`}>
            {article.title}
          </Link>
        </h3>

        {/* Concise Excerpt */}
        {article.excerpt && (
          <p className="text-xs text-white/80 line-clamp-2 leading-relaxed font-normal">
            {article.excerpt}
          </p>
        )}

        {/* Minimalist Action Link */}
        <div className="pt-2 flex items-center justify-between text-xs border-t border-white/20">
          <span className="text-[11px] text-white/70 font-medium">
            {article.author_name}
          </span>

          <Link
            href={`/media-berita/${article.slug}`}
            className="inline-flex items-center gap-1 text-[11px] font-mono font-bold uppercase tracking-wider text-white hover:text-purple-200 transition-colors"
          >
            <span>BACA ARTIKEL</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
