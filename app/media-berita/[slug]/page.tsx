import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { getArticleBySlug, getPublishedArticles } from '@/lib/data/articles';
import { ArrowLeft, Clock, Calendar, CheckCircle2 } from 'lucide-react';

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
    title: article.seo_title || `${article.title} — CHANGKEER Journal`,
    description: article.seo_description || article.excerpt || undefined,
  };
}

function renderFormattedText(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-bold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

function parseArticleBlocks(content: string) {
  const rawParagraphs = content.split(/\n\s*\n/);
  const blocks: Array<{
    type: 'heading' | 'list' | 'paragraph';
    text: string;
    items?: string[];
    isFirst?: boolean;
  }> = [];

  for (const raw of rawParagraphs) {
    const trimmed = raw.trim();
    if (!trimmed) continue;

    const lines = trimmed.split('\n');
    let currentParagraphLines: string[] = [];
    let currentListItems: string[] = [];

    const flushParagraph = () => {
      if (currentParagraphLines.length > 0) {
        blocks.push({ type: 'paragraph', text: currentParagraphLines.join(' ') });
        currentParagraphLines = [];
      }
    };

    const flushList = () => {
      if (currentListItems.length > 0) {
        blocks.push({ type: 'list', text: '', items: [...currentListItems] });
        currentListItems = [];
      }
    };

    for (const line of lines) {
      const lineTrimmed = line.trim();
      if (lineTrimmed.startsWith('### ')) {
        flushParagraph();
        flushList();
        blocks.push({ type: 'heading', text: lineTrimmed.replace('### ', '') });
      } else if (lineTrimmed.startsWith('- ') || lineTrimmed.startsWith('* ')) {
        flushParagraph();
        currentListItems.push(lineTrimmed.replace(/^[-*]\s+/, ''));
      } else {
        flushList();
        currentParagraphLines.push(lineTrimmed);
      }
    }

    flushParagraph();
    flushList();
  }

  let foundFirst = false;
  for (const b of blocks) {
    if (b.type === 'paragraph' && !foundFirst) {
      b.isFirst = true;
      foundFirst = true;
    }
  }

  return blocks;
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

  const blocks = parseArticleBlocks(article.content);

  return (
    <div className="py-12 md:py-20 bg-background text-foreground">
      <Container size="narrow">
        {/* Navigation Breadcrumb */}
        <div className="mb-10">
          <Link
            href="/media-berita"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>KEMBALI KE MEDIA &amp; BERITA</span>
          </Link>
        </div>

        {/* Editorial Article Header */}
        <header className="space-y-6 pb-8 border-b border-border/70">
          {/* Category Pill */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] uppercase text-accent px-3 py-1 rounded-md bg-accent/10 border border-accent/20">
              {article.category?.name || 'EDUKASI BOTANI'}
            </span>
            <span className="text-xs text-muted-foreground font-mono">•</span>
            <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
              CHANGKEER JOURNAL
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-foreground leading-[1.12]">
            {article.title}
          </h1>

          {/* Standfirst / Excerpt */}
          {article.excerpt && (
            <p className="text-base sm:text-xl text-muted-foreground leading-relaxed font-normal pt-1">
              {article.excerpt}
            </p>
          )}

          {/* Author Byline & Verification Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border/50 text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-full overflow-hidden bg-primary/10 border border-border shrink-0 flex items-center justify-center font-bold text-xs text-primary">
                CK
              </div>
              <div>
                <span className="font-bold text-foreground block text-xs">
                  {article.author_name}
                </span>
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                  Kurator Botani &amp; Tim Riset
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-[11px] font-mono text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-accent" />
                <span>{formattedDate}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-accent" />
                <span>{article.read_time_minutes} MIN BACA</span>
              </span>
            </div>
          </div>
        </header>

        {/* Featured Visual with Caption */}
        <figure className="my-10">
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-border/80 bg-muted shadow-sm">
            <Image
              src={imageSrc}
              alt={article.title}
              fill
              className="object-cover object-center"
              priority
            />
          </div>
          <figcaption className="mt-3 text-[11px] font-mono text-muted-foreground text-center">
            Dokumentasi Kurasi Riset Botani &amp; Tradisi Seduh — CHANGKEER Archive
          </figcaption>
        </figure>

        {/* Professional Editorial Article Body */}
        <article className="space-y-6 text-foreground/90 leading-[1.8] text-base sm:text-[17px]">
          {blocks.map((block, idx) => {
            if (block.type === 'heading') {
              return (
                <div key={idx} className="pt-6 pb-2">
                  <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-foreground pb-2 border-b border-border/60">
                    {block.text}
                  </h3>
                </div>
              );
            }

            if (block.type === 'list' && block.items) {
              return (
                <ul key={idx} className="space-y-3 my-5 pl-4 sm:pl-6 text-muted-foreground text-sm sm:text-base border-l-2 border-primary/30">
                  {block.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                      <span className="leading-relaxed">{renderFormattedText(item)}</span>
                    </li>
                  ))}
                </ul>
              );
            }

            // Paragraph
            if (block.isFirst) {
              return (
                <p
                  key={idx}
                  className="first-letter:float-left first-letter:text-5xl sm:first-letter:text-6xl first-letter:font-black first-letter:mr-3.5 first-letter:leading-none first-letter:text-primary leading-[1.85]"
                >
                  {renderFormattedText(block.text)}
                </p>
              );
            }

            return (
              <p key={idx} className="leading-[1.85]">
                {renderFormattedText(block.text)}
              </p>
            );
          })}
        </article>

        {/* Author Bio Box */}
        <div className="mt-16 p-6 sm:p-8 rounded-2xl bg-surface border border-border/80 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="relative w-12 h-12 rounded-full overflow-hidden border border-border shrink-0 bg-primary/10 flex items-center justify-center font-bold text-sm text-primary">
            CK
          </div>
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm uppercase tracking-wide text-foreground">
                {article.author_name}
              </h4>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-accent font-semibold px-2 py-0.5 rounded-full bg-accent/10">
                <CheckCircle2 className="w-3 h-3" />
                Penulis Terverifikasi
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Mendedikasikan diri pada eksplorasi botani nusantara, standar seduh higienis bebas mikroplastik, serta penyebarluasan kebiasaan minum teh yang menyehatkan tubuh dan menenangkan pikiran.
            </p>
          </div>
        </div>

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <div className="pt-16 mt-16 border-t border-border/80">
            <div className="mb-8">
              <span className="text-[11px] font-mono font-bold tracking-[0.25em] uppercase text-muted-foreground block mb-1">
                BACAAN LAINNYA
              </span>
              <h2 className="text-2xl font-black uppercase tracking-tight text-foreground">
                ARTIKEL TERKAIT
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
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
