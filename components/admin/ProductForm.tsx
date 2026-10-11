'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { productSchema, ProductFormData, getFieldErrors } from '@/lib/validation/schemas';
import { Product, Category } from '@/types';
import { AlertCircle, CheckCircle2, ArrowLeft, Upload } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface ProductFormProps {
  initialData?: Product;
  categories: Category[];
}

export function ProductForm({ initialData, categories }: ProductFormProps) {
  const router = useRouter();
  const isEditing = Boolean(initialData?.id);

  const [formData, setFormData] = useState<ProductFormData>({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    tagline: initialData?.tagline || '',
    description: initialData?.description || '',
    category_id: initialData?.category_id || undefined,
    ingredients: initialData?.ingredients || [],
    brewing_guide: {
      water_temp: initialData?.brewing_guide?.water_temp || '90-95°C',
      steep_time: initialData?.brewing_guide?.steep_time || '4-5 Menit',
      serving_size: initialData?.brewing_guide?.serving_size || '250ml',
      notes: initialData?.brewing_guide?.notes || '',
    },
    characteristics: (initialData?.characteristics as Record<string, string>) || {
      aroma: '',
      taste: '',
      body: '',
      caffeine: 'Bebas Kafein (0mg)',
    },
    packaging_info: initialData?.packaging_info || '',
    price: initialData?.price || 0,
    weight_grams: initialData?.weight_grams || 50,
    featured_image: initialData?.featured_image || '/images/products/changkeer-lemongrass-ginger.jpg',
    gallery: initialData?.gallery || [],
    is_featured: initialData?.is_featured || false,
    status: initialData?.status || 'draft',
    seo_title: initialData?.seo_title || '',
    seo_description: initialData?.seo_description || '',
  });

  const [ingredientsText, setIngredientsText] = useState(
    (initialData?.ingredients || []).join('\n')
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    setImageUploadError(null);

    const data = new FormData();
    data.append('file', file);
    data.append('bucket', 'product-images');
    data.append('altText', formData.name || file.name);

    try {
      const res = await fetch('/api/admin/media', {
        method: 'POST',
        body: data,
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setImageUploadError(json.error || 'Gagal mengunggah foto');
      } else {
        setFormData((prev) => ({
          ...prev,
          featured_image: json.asset.public_url,
        }));
      }
    } catch {
      setImageUploadError('Kendala koneksi saat mengunggah foto');
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Auto-generate slug from name if not manually modified
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData((prev) => {
      const shouldAutoSlug = !isEditing && (!prev.slug || prev.slug === generateSlug(prev.name));
      return {
        ...prev,
        name: val,
        slug: shouldAutoSlug ? generateSlug(val) : prev.slug,
      };
    });
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    // Parse ingredients from newline
    const parsedIngredients = ingredientsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const dataToValidate: ProductFormData = {
      ...formData,
      ingredients: parsedIngredients,
      price: Number(formData.price),
      weight_grams: formData.weight_grams ? Number(formData.weight_grams) : null,
    };

    const validation = productSchema.safeParse(dataToValidate);
    if (!validation.success) {
      setErrors(getFieldErrors(validation.error));
      setServerError('Harap periksa kembali isian formulir yang ditandai merah.');
      return;
    }

    setIsLoading(true);

    try {
      const payload = isEditing
        ? { id: initialData?.id, ...dataToValidate }
        : dataToValidate;

      const res = await fetch('/api/admin/products', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setServerError(json.error || 'Gagal menyimpan produk.');
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push('/admin/products');
          router.refresh();
        }, 800);
      }
    } catch {
      setServerError('Terjadi kendala koneksi saat menyimpan produk.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Produk</span>
        </Link>
        <span className="text-xs font-mono text-muted-foreground">
          {isEditing ? `ID: ${initialData?.id}` : 'Racikan Baru'}
        </span>
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
          <span>Produk berhasil disimpan! Mengalihkan...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Core Product Info */}
        <div className="bg-surface p-6 rounded-lg border border-border space-y-5">
          <h3 className="font-bold text-sm uppercase tracking-wider text-foreground pb-2 border-b border-border">
            1. INFORMASI UTAMA PRODUK
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-foreground mb-1">
                NAMA PRODUK <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={handleNameChange}
                placeholder="CHANGKEER Lemongrass Ginger Vitality"
                required
                className="w-full px-3.5 py-2.5 text-xs bg-background border border-border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
              {errors.name && <p className="text-[11px] text-red-600 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-foreground mb-1">
                SLUG URL <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="lemongrass-ginger-vitality"
                required
                className="w-full px-3.5 py-2.5 text-xs bg-background border border-border rounded-sm font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
              {errors.slug && <p className="text-[11px] text-red-600 mt-1">{errors.slug}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-foreground mb-1">
                KATEGORI PRODUK
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
                STATUS PUBLIKASI
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3.5 py-2.5 text-xs bg-background border border-border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="draft">Draft (Hanya Admin)</option>
                <option value="published">Published (Tampil Publik)</option>
                <option value="archived">Archived (Diarsipkan)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-foreground mb-1">
              TAGLINE SINGKAT
            </label>
            <input
              type="text"
              value={formData.tagline || ''}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              placeholder="Kehangatan Jahe Merah &amp; Kesegaran Serai Wangi Alami"
              className="w-full px-3.5 py-2.5 text-xs bg-background border border-border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-foreground mb-1">
              DESKRIPSI LENGKAP
            </label>
            <textarea
              rows={4}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Tuliskan latar belakang, karakteristik racikan, dan keunikan produk..."
              className="w-full px-3.5 py-2.5 text-xs bg-background border border-border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="is_featured"
              checked={formData.is_featured}
              onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
              className="rounded-sm border-border text-primary focus:ring-ring"
            />
            <label htmlFor="is_featured" className="text-xs font-semibold text-foreground cursor-pointer">
              Tandai sebagai Produk Unggulan (Tampil di Hero/Homepage)
            </label>
          </div>
        </div>

        {/* Pricing & Packaging */}
        <div className="bg-surface p-6 rounded-lg border border-border space-y-5">
          <h3 className="font-bold text-sm uppercase tracking-wider text-foreground pb-2 border-b border-border">
            2. HARGA &amp; KEMASAN
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-foreground mb-1">
                HARGA (RUPIAH) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                required
                min={0}
                className="w-full px-3.5 py-2.5 text-xs bg-background border border-border rounded-sm text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-foreground mb-1">
                BERAT BERSIH (GRAM)
              </label>
              <input
                type="number"
                value={formData.weight_grams || 50}
                onChange={(e) => setFormData({ ...formData, weight_grams: Number(e.target.value) })}
                min={1}
                className="w-full px-3.5 py-2.5 text-xs bg-background border border-border rounded-sm text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-foreground mb-1">
                JENIS KEMASAN
              </label>
              <input
                type="text"
                value={formData.packaging_info || ''}
                onChange={(e) => setFormData({ ...formData, packaging_info: e.target.value })}
                placeholder="Kotak tabung 15 kantung piramida"
                className="w-full px-3.5 py-2.5 text-xs bg-background border border-border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>
        </div>

        {/* Ingredients & Brewing */}
        <div className="bg-surface p-6 rounded-lg border border-border space-y-5">
          <h3 className="font-bold text-sm uppercase tracking-wider text-foreground pb-2 border-b border-border">
            3. KOMPOSISI &amp; PANDUAN SEDUH
          </h3>

          <div>
            <label className="block text-xs font-bold uppercase text-foreground mb-1">
              DAFTAR KOMPOSISI BAHAN ALAMI (Satu baris per bahan)
            </label>
            <textarea
              rows={4}
              value={ingredientsText}
              onChange={(e) => setIngredientsText(e.target.value)}
              placeholder="Serai Wangi Kering&#10;Jahe Merah Iris&#10;Daun Pandan Organik&#10;Secang Serut"
              className="w-full px-3.5 py-2.5 text-xs bg-background border border-border rounded-sm font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-foreground mb-1">
                SUHU AIR
              </label>
              <input
                type="text"
                value={formData.brewing_guide.water_temp}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    brewing_guide: { ...formData.brewing_guide, water_temp: e.target.value },
                  })
                }
                placeholder="90-95°C"
                className="w-full px-3.5 py-2.5 text-xs bg-background border border-border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-foreground mb-1">
                DURASI SEDUH
              </label>
              <input
                type="text"
                value={formData.brewing_guide.steep_time}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    brewing_guide: { ...formData.brewing_guide, steep_time: e.target.value },
                  })
                }
                placeholder="4-5 Menit"
                className="w-full px-3.5 py-2.5 text-xs bg-background border border-border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-foreground mb-1">
                TAKIRAN AIR
              </label>
              <input
                type="text"
                value={formData.brewing_guide.serving_size}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    brewing_guide: { ...formData.brewing_guide, serving_size: e.target.value },
                  })
                }
                placeholder="250ml"
                className="w-full px-3.5 py-2.5 text-xs bg-background border border-border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>
        </div>

        {/* Media & SEO */}
        <div className="bg-surface p-6 rounded-lg border border-border space-y-5">
          <h3 className="font-bold text-sm uppercase tracking-wider text-foreground pb-2 border-b border-border">
            4. GAMBAR &amp; METADATA SEO
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase text-foreground">
                FOTO UTAMA PRODUK
              </label>
              <span className="text-[10px] text-muted-foreground font-mono">
                PNG, JPG, WebP (Maks. 5MB)
              </span>
            </div>

            {/* Visual Thumbnail Preview */}
            {formData.featured_image && (
              <div className="flex items-center gap-4 p-3.5 bg-neutral-50 border border-border rounded-xl">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-border shrink-0 bg-white">
                  <Image
                    src={formData.featured_image}
                    alt={formData.name || 'Preview produk'}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-mono font-bold text-foreground truncate">
                    {formData.featured_image}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Foto produk aktif yang akan tampil di katalog dan halaman detail.
                  </p>
                </div>
              </div>
            )}

            {imageUploadError && (
              <p className="text-xs text-red-600 font-semibold">{imageUploadError}</p>
            )}

            {/* Direct Upload Button & Fallback URL Input */}
            <div className="flex flex-col sm:flex-row gap-3">
              <label className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-all active:scale-95 shrink-0 shadow-xs">
                <Upload className="w-4 h-4" />
                <span>{isUploadingImage ? 'Mengunggah...' : 'Unggah Foto Langsung'}</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/svg+xml"
                  onChange={handleImageUpload}
                  disabled={isUploadingImage}
                  className="hidden"
                />
              </label>

              <input
                type="text"
                value={formData.featured_image || ''}
                onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                placeholder="Atau masukkan URL gambar /images/products/..."
                className="flex-1 px-3.5 py-2.5 text-xs bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
              />
            </div>
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
                placeholder="CHANGKEER Lemongrass Ginger - Teh Herbal Hangat"
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
                placeholder="Deskripsi ringkas untuk cuplikan mesin pencari..."
                className="w-full px-3.5 py-2.5 text-xs bg-background border border-border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            href="/admin/products"
            className="px-6 py-3 text-xs font-bold uppercase tracking-wider border border-border rounded-sm hover:bg-muted"
          >
            Batal
          </Link>

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-8 py-3.5 text-xs font-bold uppercase tracking-widest bg-primary text-primary-foreground rounded-sm hover:bg-primary-hover active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? 'Menyimpan...' : isEditing ? 'Perbarui Produk' : 'Simpan Produk Baru'}
          </button>
        </div>
      </form>
    </div>
  );
}
