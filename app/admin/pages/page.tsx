'use client';

import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import { PageContent } from '@/types';

export default function AdminPagesPage() {
  const [pages, setPages] = useState<PageContent[]>([]);
  const [selectedSlug, setSelectedSlug] = useState('home');
  const [currentPage, setCurrentPage] = useState<PageContent | null>(null);
  const [sectionsJson, setSectionsJson] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDesc, setSeoDesc] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const selectPage = (p: PageContent) => {
    setCurrentPage(p);
    setSelectedSlug(p.slug);
    setSectionsJson(JSON.stringify(p.sections, null, 2));
    setSeoTitle(p.seo_title || '');
    setSeoDesc(p.seo_description || '');
    setError(null);
    setSuccess(null);
  };

  useEffect(() => {
    async function loadPages() {
      try {
        const res = await fetch('/api/admin/pages');
        const data = await res.json();
        if (data.success && data.pages && data.pages.length > 0) {
          setPages(data.pages);
          const first = data.pages[0];
          setCurrentPage(first);
          setSelectedSlug(first.slug);
          setSectionsJson(JSON.stringify(first.sections, null, 2));
          setSeoTitle(first.seo_title || '');
          setSeoDesc(first.seo_description || '');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadPages();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    let parsedSections: any;
    try {
      parsedSections = JSON.parse(sectionsJson);
    } catch {
      setError('Format JSON pada bagian sections tidak valid. Pastikan tanda kurung dan petik dua sesuai.');
      return;
    }

    setSaving(true);

    try {
      const res = await fetch('/api/admin/pages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: selectedSlug,
          sections: parsedSections,
          seo_title: seoTitle,
          seo_description: seoDesc,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Gagal menyimpan konten halaman');
      } else {
        setSuccess(`Konten halaman ${currentPage?.title || selectedSlug} berhasil diperbarui!`);
      }
    } catch {
      setError('Terjadi kendala saat menyimpan data ke server');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-border">
        <h1 className="text-2xl font-black uppercase tracking-tight text-foreground">
          EDITOR KONTEN HALAMAN
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Kelola teks, tagline, dan struktur visual halaman utama tanpa merusak layout React.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Page Selector Sidebar */}
        <div className="lg:col-span-4 bg-surface border border-border rounded-lg p-4 space-y-2 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block px-2 pb-2 border-b border-border">
            PILIH HALAMAN
          </span>

          {loading ? (
            <div className="p-4 text-xs text-muted-foreground">Memuat daftar halaman...</div>
          ) : (
            pages.map((p) => (
              <button
                key={p.slug}
                type="button"
                onClick={() => selectPage(p)}
                className={`w-full text-left px-3.5 py-3 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-colors cursor-pointer ${
                  selectedSlug === p.slug
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                <span>{p.title}</span>
                <span className="font-mono text-[10px] opacity-70">/{p.slug}</span>
              </button>
            ))
          )}
        </div>

        {/* Content Editor */}
        <div className="lg:col-span-8 bg-surface border border-border rounded-lg p-6 sm:p-8 space-y-6 shadow-sm">
          {error && (
            <div className="p-4 rounded-md bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-4 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {currentPage && (
            <form onSubmit={handleSave} className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="font-bold text-sm uppercase tracking-wider text-foreground">
                  EDIT KONTEN: {currentPage.title}
                </h3>
                <span className="text-xs font-mono text-muted-foreground">/{currentPage.slug}</span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-foreground mb-1">
                  SEO TITLE HALAMAN
                </label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-background border border-border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-foreground mb-1">
                  SEO DESCRIPTION
                </label>
                <textarea
                  rows={2}
                  value={seoDesc}
                  onChange={(e) => setSeoDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-background border border-border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase text-foreground">
                    STRUKTUR SECTIONS (JSON EDITOR)
                  </label>
                  <span className="text-[10px] text-muted-foreground">
                    Mendukung edit teks headline, highlights, &amp; narasi
                  </span>
                </div>
                <textarea
                  rows={14}
                  value={sectionsJson}
                  onChange={(e) => setSectionsJson(e.target.value)}
                  className="w-full p-4 text-xs font-mono bg-background border border-border rounded-sm text-foreground leading-relaxed focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-8 py-3.5 text-xs font-bold uppercase tracking-widest bg-primary text-primary-foreground rounded-sm hover:bg-primary-hover active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Menyimpan...' : 'Simpan Konten Halaman'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
