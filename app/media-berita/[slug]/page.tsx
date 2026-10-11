import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { getArticleBySlug, getPublishedArticles } from '@/lib/data/articles';
import { ArrowLeft, Clock, Calendar, User } from 'lucide-react';

interface ArticleDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = await getPublishedArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: ArticleDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article || article.status !== 'published') {
    return { title: 'Artikel Tidak Ditemukan' };
  }

  return {
    title: article.seo_title || article.title,
    description: article.seo_description || article.excerpt || undefined,
  };
}

export default async function ArticleDetailPage({
  params,
}: ArticleDetailPageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article || article.status !== 'published') {
    notFound();
  }

  const allArticles = await getPublishedArticles();
  const relatedArticles = allArticles
    .filter((a) => a.id !== article.id)
    .slice(0, 2);

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

  const imageSrc =
    article.featured_image || '/images/articles/brewing-guide.jpg';

  return (
    <div className="py-10 md:py-16">
      <Container size="narrow">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/media-berita"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>KEMBALI KE MEDIA &amp; BERITA</span>
          </Link>
        </div>

        {/* Article Header */}
        <header className="space-y-6 pb-10 border-b border-border">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface border border-border rounded-sm text-[10px] font-bold tracking-widest uppercase text-accent">
            {article.category?.name || 'EDUKASI TEH'}
          </div>

          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-foreground leading-[1.08]">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="text-base sm:text-xl text-muted-foreground leading-relaxed">
              {article.excerpt}
            </p>
          )}

          {/* Meta Bar */}
          <div className="flex flex-wrap items-center gap-6 text-xs text-muted-foreground pt-4 border-t border-border/60">
            <span className="flex items-center gap-1.5 font-medium">
              <User className="w-4 h-4 text-accent" />
              <span>{article.author_name}</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-4 h-4 text-accent" />
              <span>{formattedDate}</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Clock className="w-4 h-4 text-accent" />
              <span>{article.read_time_minutes} MENIT BACA</span>
            </span>
          </div>
        </header>

        {/* Featured Image */}
        <div className="relative aspect-[16/9] w-full my-10 rounded-lg overflow-hidden border border-border bg-muted shadow-sm">
          <Image
            src={imageSrc}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Article Body Content */}
        <article className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-foreground leading-relaxed text-sm sm:text-base">
          {article.content.split('\n\n').map((paragraph, idx) => {
            if (paragraph.startsWith('### ')) {
              return (
                <h3
                  key={idx}
                  className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-foreground pt-4"
                >
                  {paragraph.replace('### ', '')}
                </h3>
              );
            }
            if (paragraph.startsWith('- ')) {
              const items = paragraph.split('\n');
              return (
                <ul key={idx} className="list-disc pl-6 space-y-2 text-muted-foreground">
                  {items.map((item, i) => (
                    <li key={i}>{item.replace('- ', '')}</li>
                  ))}
                </ul>
              );
            }
            return (
              <p key={idx} className="text-foreground/90 leading-relaxed">
                {paragraph}
              </p>
            );
          })}
        </article>

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <div className="pt-20 mt-16 border-t border-border">
            <div className="mb-8">
              <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-muted-foreground block mb-1">
                BACAAN LAINNYA
              </span>
              <h2 className="text-2xl font-black uppercase tracking-tight text-foreground">
                ARTIKEL TERKAIT
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedArticles.map((rel) => (
                <ArticleCard key={rel.id} article={rel} />
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
