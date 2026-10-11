'use client';

import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import { siteSettingsSchema, SiteSettingsFormData, getFirstErrorMessage } from '@/lib/validation/schemas';

export default function AdminSettingsPage() {
  const [formData, setFormData] = useState<SiteSettingsFormData>({
    site_name: 'CHANGKEER',
    tagline: 'More Than Tea. A Better You.',
    contact_email: 'halo@changkeer.com',
    contact_phone: '+62 812-3456-7890',
    contact_address: 'Jl. Harmoni Alam No. 8, Bandung, Jawa Barat, Indonesia',
    social_instagram: 'https://instagram.com/changkeer.tea',
    social_youtube: 'https://youtube.com/@changkeer',
    social_tiktok: 'https://tiktok.com/@changkeer',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/admin/settings');
        const data = await res.json();
        if (data.success && data.settings) {
          setFormData({
            site_name: data.settings.site_name || 'CHANGKEER',
            tagline: data.settings.tagline || 'More Than Tea. A Better You.',
            contact_email: data.settings.contact_email || 'halo@changkeer.com',
            contact_phone: data.settings.contact_phone || '+62 812-3456-7890',
            contact_address:
              data.settings.contact_address ||
              'Jl. Harmoni Alam No. 8, Bandung, Jawa Barat, Indonesia',
            social_instagram:
              data.settings.social_instagram || 'https://instagram.com/changkeer.tea',
            social_youtube:
              data.settings.social_youtube || 'https://youtube.com/@changkeer',
            social_tiktok:
              data.settings.social_tiktok || 'https://tiktok.com/@changkeer',
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const validation = siteSettingsSchema.safeParse(formData);
    if (!validation.success) {
      setError(getFirstErrorMessage(validation.error));
      return;
    }

    setSaving(true);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Gagal menyimpan pengaturan');
      } else {
        setSuccess('Pengaturan situs berhasil diperbarui!');
      }
    } catch {
      setError('Terjadi kendala koneksi saat menyimpan pengaturan');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="pb-4 border-b border-border">
        <h1 className="text-2xl font-black uppercase tracking-tight text-foreground">
          PENGATURAN SITUS WEB
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Konfigurasi identitas global, informasi kontak, dan tautan media sosial CHANGKEER.
        </p>
      </div>

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

      {loading ? (
        <div className="p-12 text-center text-xs text-muted-foreground">
          Memuat pengaturan...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Brand Identity */}
          <div className="bg-surface p-6 rounded-lg border border-border space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-foreground pb-2 border-b border-border">
              IDENTITAS SITUS
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-foreground mb-1">
                  NAMA SITUS / BRAND <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.site_name}
                  onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 text-xs bg-background border border-border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-foreground mb-1">
                  TAGLINE UTAMA <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 text-xs bg-background border border-border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-surface p-6 rounded-lg border border-border space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-foreground pb-2 border-b border-border">
              KONTAK &amp; LAYANAN PELANGGAN
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-foreground mb-1">
                  EMAIL RESMI
                </label>
                <input
                  type="email"
                  value={formData.contact_email || ''}
                  onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-background border border-border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-foreground mb-1">
                  NOMOR TELEPON / WHATSAPP
                </label>
                <input
                  type="text"
                  value={formData.contact_phone || ''}
                  onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-background border border-border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-foreground mb-1">
                ALAMAT KANTOR &amp; STUDIO RACIKAN
              </label>
              <textarea
                rows={2}
                value={formData.contact_address || ''}
                onChange={(e) => setFormData({ ...formData, contact_address: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs bg-background border border-border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-surface p-6 rounded-lg border border-border space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-foreground pb-2 border-b border-border">
              JEJARING SOSIAL RESMI
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-foreground mb-1">
                  INSTAGRAM URL
                </label>
                <input
                  type="text"
                  value={formData.social_instagram || ''}
                  onChange={(e) => setFormData({ ...formData, social_instagram: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-background border border-border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-foreground mb-1">
                  YOUTUBE URL
                </label>
                <input
                  type="text"
                  value={formData.social_youtube || ''}
                  onChange={(e) => setFormData({ ...formData, social_youtube: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-background border border-border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-foreground mb-1">
                  TIKTOK URL
                </label>
                <input
                  type="text"
                  value={formData.social_tiktok || ''}
                  onChange={(e) => setFormData({ ...formData, social_tiktok: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-background border border-border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-8 py-3.5 text-xs font-bold uppercase tracking-widest bg-primary text-primary-foreground rounded-sm hover:bg-primary-hover active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Menyimpan...' : 'Simpan Pengaturan'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
