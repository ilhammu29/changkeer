'use client';

import React, { useState, useMemo } from 'react';
import { Product, Category } from '@/types';
import { ProductCard } from '@/components/products/ProductCard';
import { Search, SlidersHorizontal, PackageSearch } from 'lucide-react';

interface CatalogViewProps {
  products: Product[];
  categories: Category[];
}

export function CatalogView({ products, categories }: CatalogViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.tagline && p.tagline.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        p.ingredients.some((ing) => ing.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'all' || p.category_id === selectedCategory || p.category?.slug === selectedCategory;

      return matchesSearch && matchesCategory;
    }).sort((a, b) => {
      if (sortOrder === 'price-asc') return a.price - b.price;
      if (sortOrder === 'price-desc') return b.price - a.price;
      // Default: featured first
      if (a.is_featured && !b.is_featured) return -1;
      if (!a.is_featured && b.is_featured) return 1;
      return 0;
    });
  }, [products, searchQuery, selectedCategory, sortOrder]);

  return (
    <div className="space-y-8">
      {/* Search Bar & Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-surface p-4 sm:p-5 rounded-2xl border border-border shadow-xs">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari racikan herbal, bahan (melati, serai, mint, teh hitam)..."
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
          />
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="text-xs font-mono uppercase bg-background border border-border rounded-xl px-3.5 py-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="featured">Urutan: Kurasi Unggulan</option>
            <option value="price-asc">Harga: Terendah</option>
            <option value="price-desc">Harga: Tertinggi</option>
          </select>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`text-[11px] font-mono font-bold uppercase tracking-wider px-4 py-2 rounded-full transition-all cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'bg-surface border border-border text-foreground hover:bg-surface-hover'
          }`}
        >
          SEMUA VARIAN ({products.length})
        </button>

        {categories
          .filter((cat) => products.some((p) => p.category_id === cat.id || p.category?.slug === cat.slug))
          .map((cat) => {
          const count = products.filter(
            (p) => p.category_id === cat.id || p.category?.slug === cat.slug
          ).length;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`text-[11px] font-mono font-bold uppercase tracking-wider px-4 py-2 rounded-full transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'bg-surface border border-border text-foreground hover:bg-surface-hover'
              }`}
            >
              {cat.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Product Results Count */}
      <div className="text-xs font-mono text-muted-foreground">
        Menampilkan {filteredProducts.length} dari {products.length} racikan herbal tersedia
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-surface border border-border rounded-2xl p-12 text-center space-y-4 my-8 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-muted mx-auto flex items-center justify-center text-muted-foreground">
            <PackageSearch className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-base uppercase text-foreground">
              Tidak Ada Racikan yang Sesuai
            </h4>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Tidak ditemukan produk untuk kata kunci &quot;{searchQuery}&quot;. Coba gunakan kata kunci umum seperti &quot;melati&quot;, &quot;mint&quot;, atau reset filter kategori.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="inline-flex text-xs font-mono font-bold uppercase tracking-wider bg-primary text-primary-foreground px-5 py-2.5 rounded-full hover:bg-primary-hover transition-colors cursor-pointer"
          >
            RESET PENCARIAN
          </button>
        </div>
      )}
    </div>
  );
}
