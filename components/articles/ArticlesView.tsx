'use client';

import React, { useState, useMemo } from 'react';
import { Article, Category } from '@/types';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { Search, BookOpen } from 'lucide-react';

interface ArticlesViewProps {
  articles: Article[];
  categories: Category[];
}

export function ArticlesView({ articles, categories }: ArticlesViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredArticles = useMemo(() => {
    return articles.filter((a) => {
      const matchesSearch =
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (a.excerpt && a.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
        a.content.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'all' ||
        a.category_id === selectedCategory ||
        a.category?.slug === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [articles, searchQuery, selectedCategory]);

  return (
    <div className="space-y-8">
      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-surface/60 p-4 sm:p-5 rounded-2xl border border-border/80 shadow-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari artikel, topik, atau kata kunci..."
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`text-xs font-mono font-bold uppercase tracking-wider px-4 py-2 rounded-xl transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'bg-background border border-border/80 text-foreground hover:bg-surface-hover'
            }`}
          >
            SEMUA
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`text-xs font-mono font-bold uppercase tracking-wider px-4 py-2 rounded-xl transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'bg-background border border-border/80 text-foreground hover:bg-surface-hover'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-lg p-12 text-center space-y-4 my-8">
          <div className="w-12 h-12 rounded-full bg-muted mx-auto flex items-center justify-center text-muted-foreground">
            <BookOpen className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-base uppercase text-foreground">
              Tidak Ada Artikel Ditemukan
            </h4>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Tidak ada artikel yang cocok dengan &quot;{searchQuery}&quot;. Coba ubah kata kunci atau pilih semua kategori.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
