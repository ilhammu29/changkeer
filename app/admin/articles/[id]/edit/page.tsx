import React from 'react';
import { notFound } from 'next/navigation';
import { ArticleForm } from '@/components/admin/ArticleForm';
import { getAllArticlesAdmin } from '@/lib/data/articles';
import { getCategories } from '@/lib/data/categories';

export const dynamic = 'force-dynamic';

interface EditArticlePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params;
  const [articles, categories] = await Promise.all([
    getAllArticlesAdmin(),
    getCategories('article'),
  ]);

  const article = articles.find((a) => a.id === id);

  if (!article) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-border">
        <h1 className="text-2xl font-black uppercase tracking-tight text-foreground">
          EDIT ARTIKEL: {article.title}
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Perbarui teks, gambar, atau ubah status tayang.
        </p>
      </div>

      <ArticleForm initialData={article} categories={categories} />
    </div>
  );
}
