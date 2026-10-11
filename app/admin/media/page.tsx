'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Upload, Copy, Check, AlertCircle } from 'lucide-react';
import { MediaAsset } from '@/types';

export default function AdminMediaPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [altText, setAltText] = useState('');
  const [bucket, setBucket] = useState('product-images');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMedia = async () => {
    try {
      const res = await fetch('/api/admin/media');
      const data = await res.json();
      if (data.success) {
        setAssets(data.assets || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setError(null);
    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('bucket', bucket);
    formData.append('altText', altText);

    try {
      const res = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Gagal mengunggah media');
      } else {
        setSelectedFile(null);
        setAltText('');
        fetchMedia();
      }
    } catch {
      setError('Terjadi kendala saat mengunggah media');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="pb-4 border-b border-border">
        <h1 className="text-2xl font-black uppercase tracking-tight text-foreground">
          MEDIA LIBRARY
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Kelola berkas visual produk, artikel, dan aset multimedia situs web.
        </p>
      </div>

      {/* Upload Zone */}
      <div className="bg-surface border border-border rounded-lg p-6 space-y-4 shadow-sm">
        <h3 className="font-bold text-sm uppercase tracking-wider text-foreground">
          UNGGAH BERKAS MEDIA BARU
        </h3>

        {error && (
          <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleUpload} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase text-foreground mb-1">
              PILIH GAMBAR (JPEG, PNG, WEBP, SVG)
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/svg+xml"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              required
              className="w-full text-xs text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-xs file:font-bold file:uppercase file:bg-primary file:text-primary-foreground hover:file:bg-primary-hover cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-foreground mb-1">
              BUCKET TUJUAN
            </label>
            <select
              value={bucket}
              onChange={(e) => setBucket(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-background border border-border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="product-images">product-images</option>
              <option value="article-images">article-images</option>
              <option value="site-media">site-media</option>
            </select>
          </div>

          <div>
            <button
              type="submit"
              disabled={isUploading || !selectedFile}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 text-xs font-bold uppercase tracking-wider bg-primary text-primary-foreground rounded-sm hover:bg-primary-hover active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>{isUploading ? 'Mengunggah...' : 'Unggah File'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Media Grid */}
      <div className="bg-surface border border-border rounded-lg p-6 space-y-4 shadow-sm">
        <h3 className="font-bold text-sm uppercase tracking-wider text-foreground pb-2 border-b border-border">
          ASET TERSIMPAN ({assets.length})
        </h3>

        {loading ? (
          <div className="p-12 text-center text-xs text-muted-foreground">
            Memuat media...
          </div>
        ) : assets.length === 0 ? (
          <div className="p-12 text-center text-xs text-muted-foreground">
            Belum ada berkas media di perpustakaan.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className="group bg-background border border-border rounded-md overflow-hidden flex flex-col justify-between"
              >
                <div className="relative aspect-square w-full bg-muted flex items-center justify-center p-4">
                  <Image
                    src={asset.public_url}
                    alt={asset.alt_text || asset.file_name}
                    fill
                    className="object-contain p-2"
                  />
                </div>

                <div className="p-3 border-t border-border space-y-2">
                  <div className="space-y-0.5">
                    <span className="font-bold text-xs text-foreground block truncate">
                      {asset.file_name}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground block">
                      {asset.bucket}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(asset.public_url, asset.id)}
                    className="w-full py-1.5 px-2 bg-surface border border-border rounded-sm text-[11px] font-semibold text-foreground flex items-center justify-center gap-1.5 hover:bg-muted transition-colors cursor-pointer"
                  >
                    {copiedId === asset.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>Salin URL</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
