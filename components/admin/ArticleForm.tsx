'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { articleSchema, ArticleFormData, getFieldErrors } from '@/lib/validation/schemas';
import { Article, Category } from '@/types';
import { AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface ArticleFormProps {
  initialData?: Article;
  categories: Category[];
}

export function ArticleForm({ initialData, categories }: ArticleFormProps) {
  const router = useRouter();
  const isEditing = Boolean(initialData?.id);

  const [formData, setFormData] = useState<ArticleFormData>({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    excerpt: initialData?.excerpt || '',
    content: initialData?.content || '',
    category_id: initialData?.category_id || undefined,
    featured_image: initialData?.featured_image || '/images/articles/brewing-guide.jpg',
    author_name: initialData?.author_name || 'Tim CHANGKEER',
    read_time_minutes: initialData?.read_time_minutes || 3,
    is_featured: initialData?.is_featured || false,
    status: initialData?.status || 'draft',
    seo_title: initialData?.seo_title || '',
    seo_description: initialData?.seo_description || '',
    published_at: initialData?.published_at || undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData((prev) => {
      const generated = val
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      const shouldAutoSlug = !isEditing && (!prev.slug || prev.slug === generated);
      return {
        ...prev,
        title: val,
        slug: shouldAutoSlug ? generated : prev.slug,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const validation = articleSchema.safeParse(formData);
    if (!validation.success) {
      setErrors(getFieldErrors(validation.error));
      setServerError('Harap periksa isian yang bertanda merah.');
      return;
    }

    setIsLoading(true);

    try {
      const payload = isEditing
        ? { id: initialData?.id, ...formData }
        : formData;

      const res = await fetch('/api/admin/articles', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setServerError(json.error || 'Gagal menyimpan artikel.');
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push('/admin/articles');
          router.refresh();
        }, 800);
      }
    } catch {
      setServerError('Kendala koneksi saat menyimpan artikel.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <Link
          href="/admin/articles"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Artikel</span>
        </Link>
      </div>

      {serverError && (
        <div className="p-4 rounded-md bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Artikel berhasil disimpan! Mengalihkan...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-surface p-6 rounded-lg border border-border space-y-5">
          <h3 className="font-bold text-sm uppercase tracking-wider text-foreground pb-2 border-b border-border">
            1. INFORMASI ARTIKEL
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-foreground mb-1">
                JUDUL ARTIKEL <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="Seni Menyeduh Teh Herbal: Panduan Suhu dan Waktu"
                required
                className="w-full px-3.5 py-2.5 text-xs bg-background border border-border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
              {errors.title && <p className="text-[11px] text-red-600 mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-foreground mb-1">
                SLUG URL <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="seni-menyeduh-teh-herbal"
                required
                className="w-full px-3.5 py-2.5 text-xs bg-background border border-border rounded-sm font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
              {errors.slug && <p className="text-[11px] text-red-600 mt-1">{errors.slug}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-foreground mb-1">
                KATEGORI
              </label>
              <select
                value={formData.category_id || ''}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value || null })}
                className="w-full px-3.5 py-2.5 text-xs bg-background border border-border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="">-- Pilih Kategori --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-foreground mb-1">
                NAMA PENULIS
              </label>
              <input
                type="text"
                value={formData.author_name}
                onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                placeholder="Tim CHANGKEER"
                className="w-full px-3.5 py-2.5 text-xs bg-background border border-border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-foreground mb-1">
                STATUS PUBLIKASI
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3.5 py-2.5 text-xs bg-background border border-border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="draft">Draft (Tertutup)</option>
                <option value="published">Published (Tayang Publik)</option>
                <option value="archived">Archived (Diarsipkan)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-foreground mb-1">
              RINGKASAN / EXCERPT
            </label>
            <textarea
              rows={2}
              value={formData.excerpt || ''}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="Deskripsi pembuka yang memikat perhatian pembaca..."
              className="w-full px-3.5 py-2.5 text-xs bg-background border border-border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-foreground mb-1">
              ISI KONTEN LENGKAP (Mendukung Markdown &amp; Paragraf) <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={12}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Tuliskan isi artikel Anda di sini..."
              required
              className="w-full px-3.5 py-2.5 text-xs bg-background border border-border rounded-sm font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
            {errors.content && <p className="text-[11px] text-red-600 mt-1">{errors.content}</p>}
          </div>
        </div>

        {/* Media & SEO */}
        <div className="bg-surface p-6 rounded-lg border border-border space-y-5">
          <h3 className="font-bold text-sm uppercase tracking-wider text-foreground pb-2 border-b border-border">
            2. GAMBAR UTAMA &amp; SEO
          </h3>

          <div>
            <label className="block text-xs font-bold uppercase text-foreground mb-1">
              URL GAMBAR UTAMA
            </label>
            <input
              type="text"
              value={formData.featured_image || ''}
              onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
              placeholder="/images/articles/brewing-guide.jpg"
              className="w-full px-3.5 py-2.5 text-xs bg-background border border-border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-foreground mb-1">
                SEO TITLE
              </label>
              <input
                type="text"
                value={formData.seo_title || ''}
                onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                placeholder="Panduan Lengkap Menyeduh Teh | CHANGKEER"
                className="w-full px-3.5 py-2.5 text-xs bg-background border border-border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-foreground mb-1">
                SEO DESCRIPTION
              </label>
              <input
                type="text"
                value={formData.seo_description || ''}
                onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                placeholder="Ringkasan untuk mesin pencari..."
                className="w-full px-3.5 py-2.5 text-xs bg-background border border-border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            href="/admin/articles"
            className="px-6 py-3 text-xs font-bold uppercase tracking-wider border border-border rounded-sm hover:bg-muted"
          >
            Batal
          </Link>

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-8 py-3.5 text-xs font-bold uppercase tracking-widest bg-primary text-primary-foreground rounded-sm hover:bg-primary-hover active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? 'Menyimpan...' : isEditing ? 'Perbarui Artikel' : 'Publikasikan Artikel'}
          </button>
        </div>
      </form>
    </div>
  );
}
