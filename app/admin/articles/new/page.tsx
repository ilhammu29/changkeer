import React from 'react';
import { ArticleForm } from '@/components/admin/ArticleForm';
import { getCategories } from '@/lib/data/categories';

export default async function NewArticlePage() {
  const categories = await getCategories('article');

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-border">
        <h1 className="text-2xl font-black uppercase tracking-tight text-foreground">
          TULIS ARTIKEL BARU
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Tuliskan artikel edukasi teh herbal atau wawasan seputar gaya hidup sehat.
        </p>
      </div>

      <ArticleForm categories={categories} />
    </div>
  );
}
