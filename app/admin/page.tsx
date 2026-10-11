import React from 'react';
import Link from 'next/link';
import {
  Package,
  FileText,
  Layers,
  MessageSquare,
  Plus,
  ArrowUpRight,
} from 'lucide-react';
import { getAllProductsAdmin } from '@/lib/data/products';
import { getAllArticlesAdmin } from '@/lib/data/articles';
import { getCategories } from '@/lib/data/categories';
import { getContactMessagesAdmin } from '@/lib/data/contact';
import { getSupabaseEnv } from '@/lib/supabase/env';

export default async function AdminDashboardPage() {
  const [products, articles, categories, messages] = await Promise.all([
    getAllProductsAdmin(),
    getAllArticlesAdmin(),
    getCategories(),
    getContactMessagesAdmin(),
  ]);

  const { isConfigured } = getSupabaseEnv();

  const publishedProducts = products.filter((p) => p.status === 'published').length;
  const draftProducts = products.filter((p) => p.status === 'draft').length;
  const publishedArticles = articles.filter((a) => a.status === 'published').length;
  const unreadMessages = messages.filter((m) => !m.is_read).length;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-surface border border-border p-6 sm:p-8 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1">
          <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-accent">
            IKHTISAR UTAMA
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-foreground">
            DASHBOARD CHANGKEER CMS
          </h1>
          <p className="text-xs text-muted-foreground">
            Status koneksi: {isConfigured ? 'Terkoneksi ke Supabase PostgreSQL' : 'Mode Pengembangan Lokal (Mock DB Aktif)'}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase bg-primary text-primary-foreground px-4 py-2.5 rounded-sm hover:bg-primary-hover shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>TAMBAH PRODUK</span>
          </Link>

          <Link
            href="/admin/articles/new"
            className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase border border-border bg-surface text-foreground px-4 py-2.5 rounded-sm hover:bg-surface-hover"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>TULIS ARTIKEL</span>
          </Link>
        </div>
      </div>

      {/* Real Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Products Stat */}
        <div className="p-6 rounded-lg bg-surface border border-border space-y-3 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold uppercase tracking-wider">PRODUK</span>
            <div className="p-2 rounded-sm bg-muted text-foreground">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-black text-foreground">{products.length}</div>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-medium">
              <span className="text-emerald-600 font-bold">{publishedProducts} Terbit</span>
              <span>•</span>
              <span>{draftProducts} Draft</span>
            </div>
          </div>
        </div>

        {/* Categories Stat */}
        <div className="p-6 rounded-lg bg-surface border border-border space-y-3 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold uppercase tracking-wider">KATEGORI</span>
            <div className="p-2 rounded-sm bg-muted text-foreground">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-black text-foreground">{categories.length}</div>
            <p className="text-[11px] text-muted-foreground font-medium">
              Kategori produk &amp; artikel terdaftar
            </p>
          </div>
        </div>

        {/* Articles Stat */}
        <div className="p-6 rounded-lg bg-surface border border-border space-y-3 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold uppercase tracking-wider">ARTIKEL</span>
            <div className="p-2 rounded-sm bg-muted text-foreground">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-black text-foreground">{articles.length}</div>
            <p className="text-[11px] text-emerald-600 font-bold">
              {publishedArticles} Artikel Terpublikasi
            </p>
          </div>
        </div>

        {/* Messages Stat */}
        <div className="p-6 rounded-lg bg-surface border border-border space-y-3 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold uppercase tracking-wider">PESAN MASUK</span>
            <div className="p-2 rounded-sm bg-muted text-foreground">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-black text-foreground">{messages.length}</div>
            <p className="text-[11px] font-bold text-amber-600">
              {unreadMessages} Belum Dibaca
            </p>
          </div>
        </div>
      </div>

      {/* Two-Column Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Products Table */}
        <div className="lg:col-span-7 bg-surface border border-border rounded-lg p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h3 className="font-bold text-sm uppercase tracking-wider text-foreground">
              KATALOG PRODUK TERBARU
            </h3>
            <Link
              href="/admin/products"
              className="text-xs font-bold uppercase tracking-wider text-accent hover:underline flex items-center gap-1"
            >
              <span>Semua Produk</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-border/60">
            {products.slice(0, 5).map((p) => (
              <div key={p.id} className="py-3 flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <div className="font-bold text-xs text-foreground line-clamp-1">
                    {p.name}
                  </div>
                  <div className="text-[11px] text-muted-foreground flex items-center gap-2">
                    <span>{p.category?.name || 'Herbal'}</span>
                    <span>•</span>
                    <span className="font-mono font-medium">
                      Rp {p.price.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm ${
                      p.status === 'published'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Inquiries */}
        <div className="lg:col-span-5 bg-surface border border-border rounded-lg p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <h3 className="font-bold text-sm uppercase tracking-wider text-foreground">
              PESAN &amp; INQUIRY TERBARU
            </h3>
            <Link
              href="/admin/messages"
              className="text-xs font-bold uppercase tracking-wider text-accent hover:underline flex items-center gap-1"
            >
              <span>Semua Pesan</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {messages.length > 0 ? (
            <div className="divide-y divide-border/60">
              {messages.slice(0, 4).map((msg) => (
                <div key={msg.id} className="py-3 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-foreground">{msg.name}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(msg.created_at).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                  <div className="text-xs font-medium text-foreground line-clamp-1">
                    {msg.subject}
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-1">
                    {msg.message}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-muted-foreground">
              Belum ada pesan masuk.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
