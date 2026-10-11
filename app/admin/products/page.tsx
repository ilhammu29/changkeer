'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Search, Edit, Trash2, ExternalLink, Sparkles } from 'lucide-react';
import { Product } from '@/types';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      if (data.success) {
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/products?id=${deleteId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== deleteId));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-foreground">
            MANAJEMEN PRODUK
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Kelola katalog teh herbal, harga, status draft/terbit, dan rincian formulasi.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase bg-primary text-primary-foreground px-5 py-3 rounded-sm hover:bg-primary-hover shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>TAMBAH PRODUK BARU</span>
        </Link>
      </div>

      {/* Filter and Search */}
      <div className="flex items-center gap-4 bg-surface p-4 rounded-md border border-border">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama racikan atau slug..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-background border border-border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface border border-border rounded-lg overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-xs text-muted-foreground">
            Memuat daftar produk...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-muted-foreground">
            Belum ada produk yang cocok.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-b border-border text-muted-foreground font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Produk</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Harga</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Featured</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filtered.map((prod) => (
                  <tr key={prod.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-sm bg-muted border border-border relative overflow-hidden shrink-0">
                          {prod.featured_image ? (
                            <Image
                              src={prod.featured_image}
                              alt={prod.name}
                              fill
                              className="object-contain p-1"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                              CK
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="font-bold text-foreground block">
                            {prod.name}
                          </span>
                          <span className="text-[10px] font-mono text-muted-foreground">
                            /{prod.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-muted-foreground font-medium">
                      {prod.category?.name || '-'}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                      Rp {prod.price.toLocaleString('id-ID')}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-sm ${
                          prod.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {prod.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {prod.is_featured ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-accent">
                          <Sparkles className="w-3 h-3" />
                          <span>Ya</span>
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-2">
                      <Link
                        href={`/katalog/${prod.slug}`}
                        target="_blank"
                        className="inline-p-1 text-muted-foreground hover:text-foreground p-1.5"
                        title="Lihat Halaman Publik"
                      >
                        <ExternalLink className="w-4 h-4 inline" />
                      </Link>

                      <Link
                        href={`/admin/products/${prod.id}/edit`}
                        className="inline-p-1 text-accent hover:opacity-80 p-1.5"
                        title="Edit Produk"
                      >
                        <Edit className="w-4 h-4 inline" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => setDeleteId(prod.id)}
                        className="text-red-600 hover:text-red-700 p-1.5 cursor-pointer"
                        title="Hapus Produk"
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

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-surface border border-border p-6 rounded-lg max-w-sm w-full space-y-4">
            <h4 className="font-bold text-base text-foreground uppercase tracking-tight">
              Konfirmasi Penghapusan
            </h4>
            <p className="text-xs text-muted-foreground">
              Apakah Anda yakin ingin menghapus produk ini dari database? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider border border-border rounded-sm hover:bg-muted"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-red-600 text-white rounded-sm hover:bg-red-700"
              >
                {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
