'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Category } from '@/types';
import { categorySchema, getFirstErrorMessage } from '@/lib/validation/schemas';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'product' | 'article'>('product');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/admin/categories');
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    const generated = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setSlug(generated);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const validation = categorySchema.safeParse({ name, slug, description, type });
    if (!validation.success) {
      setError(getFirstErrorMessage(validation.error));
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, slug, description, type }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Gagal menambahkan kategori');
      } else {
        setSuccess('Kategori baru berhasil ditambahkan');
        setName('');
        setSlug('');
        setDescription('');
        fetchCategories();
      }
    } catch {
      setError('Terjadi kendala saat menyimpan kategori');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="pb-4 border-b border-border">
        <h1 className="text-2xl font-black uppercase tracking-tight text-foreground">
          MANAJEMEN KATEGORI
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Kelola taksonomi kategori untuk produk teh herbal dan artikel media.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Create Form */}
        <div className="lg:col-span-5 bg-surface border border-border rounded-lg p-6 space-y-4 shadow-sm">
          <h3 className="font-bold text-sm uppercase tracking-wider text-foreground pb-2 border-b border-border">
            TAMBAH KATEGORI BARU
          </h3>

          {error && (
            <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-foreground mb-1">
                TIPE KATEGORI <span className="text-red-500">*</span>
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-background border border-border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="product">Produk Teh Herbal</option>
                <option value="article">Artikel &amp; Berita</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-foreground mb-1">
                NAMA KATEGORI <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                placeholder="Contoh: Tisane Bunga &amp; Rempah"
                required
                className="w-full px-3 py-2 text-xs bg-background border border-border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-foreground mb-1">
                SLUG URL <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="tisane-bunga-rempah"
                required
                className="w-full px-3 py-2 text-xs bg-background border border-border rounded-sm font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-foreground mb-1">
                DESKRIPSI SINGKAT
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Deskripsi singkat seputar kelompok varian ini..."
                className="w-full px-3 py-2 text-xs bg-background border border-border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-1.5 py-3 text-xs font-bold uppercase tracking-wider bg-primary text-primary-foreground rounded-sm hover:bg-primary-hover active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? 'Menyimpan...' : 'Tambah Kategori'}</span>
            </button>
          </form>
        </div>

        {/* Existing Categories List */}
        <div className="lg:col-span-7 bg-surface border border-border rounded-lg overflow-hidden shadow-sm">
          <div className="p-4 border-b border-border bg-muted/40 font-bold text-xs uppercase tracking-wider text-foreground">
            DAFTAR KATEGORI AKTIF ({categories.length})
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs text-muted-foreground">
              Memuat data kategori...
            </div>
          ) : categories.length === 0 ? (
            <div className="p-12 text-center text-xs text-muted-foreground">
              Belum ada kategori yang dibuat.
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {categories.map((cat) => (
                <div key={cat.id} className="p-4 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-foreground">{cat.name}</span>
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-muted text-muted-foreground">
                        {cat.type}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground block">
                      /{cat.slug}
                    </span>
                    {cat.description && (
                      <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                        {cat.description}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(cat.id)}
                    className="text-muted-foreground hover:text-red-600 p-1 cursor-pointer"
                    title="Hapus Kategori"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
