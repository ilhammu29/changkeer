'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit, Trash2, ExternalLink } from 'lucide-react';
import { Article } from '@/types';

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchArticles = async () => {
    try {
      const res = await fetch('/api/admin/articles');
      const data = await res.json();
      if (data.success) {
        setArticles(data.articles || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/articles?id=${deleteId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setArticles((prev) => prev.filter((a) => a.id !== deleteId));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteId(null);
    }
  };

  const filtered = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-foreground">
            MANAJEMEN ARTIKEL &amp; BERITA
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Publikasikan tulisan edukasi teh herbal, liputan media, dan kabar terkini.
          </p>
        </div>

        <Link
          href="/admin/articles/new"
          className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase bg-primary text-primary-foreground px-5 py-3 rounded-sm hover:bg-primary-hover shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>TULIS ARTIKEL BARU</span>
        </Link>
      </div>

      <div className="flex items-center gap-4 bg-surface p-4 rounded-md border border-border">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul artikel atau slug..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-background border border-border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      </div>

      <div className="bg-surface border border-border rounded-lg overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-xs text-muted-foreground">
            Memuat daftar artikel...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-muted-foreground">
            Belum ada artikel yang cocok.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Artikel</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Penulis</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filtered.map((art) => (
                  <tr key={art.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        <span className="font-bold text-foreground block line-clamp-1">
                          {art.title}
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground">
                          /{art.slug}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-muted-foreground font-medium">
                      {art.category?.name || 'Edukasi'}
                    </td>

                    <td className="py-3.5 px-4 text-muted-foreground">
                      {art.author_name}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-sm ${
                          art.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {art.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-2">
                      <Link
                        href={`/media-berita/${art.slug}`}
                        target="_blank"
                        className="inline-p-1 text-muted-foreground hover:text-foreground p-1.5"
                        title="Buka Halaman Publik"
                      >
                        <ExternalLink className="w-4 h-4 inline" />
                      </Link>

                      <Link
                        href={`/admin/articles/${art.id}/edit`}
                        className="inline-p-1 text-accent hover:opacity-80 p-1.5"
                        title="Edit Artikel"
                      >
                        <Edit className="w-4 h-4 inline" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => setDeleteId(art.id)}
                        className="text-red-600 hover:text-red-700 p-1.5 cursor-pointer"
                        title="Hapus Artikel"
                      >
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-surface border border-border p-6 rounded-lg max-w-sm w-full space-y-4">
            <h4 className="font-bold text-base text-foreground uppercase tracking-tight">
              Konfirmasi Penghapusan
            </h4>
            <p className="text-xs text-muted-foreground">
              Apakah Anda yakin ingin menghapus artikel ini? Tindakan tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider border border-border rounded-sm hover:bg-muted"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-red-600 text-white rounded-sm hover:bg-red-700"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
