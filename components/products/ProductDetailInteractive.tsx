'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/types';
import {
  Check,
  ShieldCheck,
  Sparkles,
  Minus,
  Plus,
  Share2,
  CheckCircle2,
  Leaf,
  Clock,
} from 'lucide-react';

interface ProductDetailInteractiveProps {
  product: Product;
  contactPhone: string;
}

export function ProductDetailInteractive({
  product,
  contactPhone,
}: ProductDetailInteractiveProps) {
  // Extract all available images without duplicates
  const rawImages = [
    product.featured_image,
    ...(product.gallery || []),
  ].filter(Boolean) as string[];

  const images = rawImages.length > 0
    ? Array.from(new Set(rawImages))
    : ['/images/assets/jasmine_tea_produk.jpg'];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);

  // Formatted Unit Price
  const formattedUnitPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(product.price);

  // Formatted Total Price
  const totalPrice = product.price * quantity;
  const formattedTotalPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(totalPrice);

  // Clean phone number for WhatsApp
  const cleanPhone = contactPhone.replace(/[^0-9]/g, '');
  const targetPhone = cleanPhone.startsWith('0')
    ? '62' + cleanPhone.slice(1)
    : cleanPhone.startsWith('62')
    ? cleanPhone
    : '6281234567890';

  // Pre-filled WhatsApp Order Message
  const orderMessage = `Halo CHANGKEER, saya ingin memesan racikan teh herbal resmi:\n\n• Produk: ${product.name}\n• Jumlah: ${quantity} pcs\n• Estimasi Total: ${formattedTotalPrice}\n\nMohon informasi ketersediaan stok & nomor rekening pembayaran resmi. Terima kasih!`;
  const orderWhatsAppUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(orderMessage)}`;

  // Pre-filled Consultation Message
  const consultMessage = `Halo CHANGKEER, saya ingin berkonsultasi mengenai varian racikan teh "${product.name}". Apakah cocok untuk rutinitas saya? Terima kasih.`;
  const consultWhatsAppUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(consultMessage)}`;

  const handleShare = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start pb-16 border-b border-border">
      {/* LEFT COLUMN: Interactive Visual Gallery */}
      <div className="lg:col-span-6 space-y-4">
        {/* Main Display Frame */}
        <div className="relative aspect-[4/3] sm:aspect-[4/3] w-full rounded-2xl bg-muted/40 border border-border/80 overflow-hidden shadow-sm flex items-center justify-center p-6 group">
          <Image
            src={images[activeImageIndex]}
            alt={`${product.name} visual`}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain p-6 sm:p-10 transition-all duration-500 ease-out group-hover:scale-105"
            priority
          />

          {/* Badges Overlay */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.is_featured && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-mono uppercase tracking-widest font-bold shadow-xs">
                <Sparkles className="w-3 h-3 text-accent" />
                RACIKAN UNGGULAN
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-background/80 backdrop-blur-md border border-border text-[9px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
              <ShieldCheck className="w-3 h-3 text-accent" />
              100% BEBAS MIKROPLASTIK
            </span>
          </div>

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 right-4 px-2.5 py-1 rounded-full bg-background/80 backdrop-blur-md border border-border text-[10px] font-mono text-muted-foreground font-medium">
              {activeImageIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnail Selector Strip */}
        {images.length > 1 && (
          <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar">
            {images.map((img, idx) => {
              const isActive = activeImageIndex === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'border-primary ring-2 ring-primary/30 shadow-md scale-102 bg-surface'
                      : 'border-border/80 bg-muted/30 opacity-70 hover:opacity-100 hover:border-border-strong'
                  }`}
                  aria-label={`Lihat gambar produk ke-${idx + 1}`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    fill
                    sizes="80px"
                    className="object-contain p-1.5"
                  />
                </button>
              );
            })}
          </div>
        )}

        {/* Key Health & Integrity Badges */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-surface border border-border/80 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent-subtle/80 flex items-center justify-center shrink-0 text-accent">
              <Leaf className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-foreground block uppercase tracking-wide">
                Bebas Daun Senna
              </span>
              <span className="text-[10px] text-muted-foreground leading-tight block">
                Aman harian tanpa efek pencahar agresif.
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-surface border border-border/80 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent-subtle/80 flex items-center justify-center shrink-0 text-accent">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-foreground block uppercase tracking-wide">
                Seduh Cepat &lt; 3 Menit
              </span>
              <span className="text-[10px] text-muted-foreground leading-tight block">
                Praktis dinikmati kapan saja tanpa repot.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Product Specifications & Functional Ordering */}
      <div className="lg:col-span-6 space-y-6">
        {/* Header & Titles */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase">
              <span className="font-bold text-accent">
                {product.category?.name || 'RACIKAN HERBAL'}
              </span>
              <span className="text-border-strong">•</span>
              <span className="text-muted-foreground">
                {product.weight_grams ? `NETTO ${product.weight_grams}G` : 'KEMASAN RESMI'}
              </span>
            </div>

            {/* Share Link Button */}
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1 rounded-md border border-border hover:bg-surface"
              title="Salin tautan produk"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                  <span className="text-green-600 font-semibold">Tersalin!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Bagikan</span>
                </>
              )}
            </button>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase tracking-tight text-foreground leading-tight">
            {product.name}
          </h1>

          {product.tagline && (
            <p className="text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
              {product.tagline}
            </p>
          )}
        </div>

        {/* Pricing & Interactive Order Box */}
        <div className="p-6 rounded-2xl bg-surface border border-border shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-border/80 pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block font-semibold">
                HARGA PER KEMASAN
              </span>
              <span className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                {formattedUnitPrice}
              </span>
            </div>

            {/* Quantity Stepper */}
            <div className="flex items-center gap-3 self-start sm:self-auto">
              <span className="text-xs font-mono uppercase text-muted-foreground font-semibold">
                JUMLAH:
              </span>
              <div className="inline-flex items-center border border-border rounded-lg bg-background p-1 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="w-8 h-8 rounded-md flex items-center justify-center text-foreground hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Kurangi jumlah"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center font-bold text-sm font-mono text-foreground">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                  className="w-8 h-8 rounded-md flex items-center justify-center text-foreground hover:bg-muted transition-colors"
                  aria-label="Tambah jumlah"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Subtotal preview if quantity > 1 */}
          {quantity > 1 && (
            <div className="flex items-center justify-between text-xs font-mono px-1">
              <span className="text-muted-foreground uppercase">Subtotal ({quantity} kemasan):</span>
              <span className="font-bold text-foreground text-sm">{formattedTotalPrice}</span>
            </div>
          )}

          {/* WhatsApp Direct Order CTA Button */}
          <div className="space-y-2.5">
            <a
              href={orderWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl font-bold uppercase tracking-wider text-xs sm:text-sm bg-[#25D366] text-white hover:bg-[#1EBE5D] active:scale-[0.99] transition-all shadow-sm shadow-[#25D366]/20 cursor-pointer"
            >
              {/* WhatsApp Icon */}
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 00-3.48-8.413z" />
              </svg>
              <span>PESAN VIA WHATSAPP RESMI</span>
            </a>

            <a
              href={consultWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-xs border border-border bg-background hover:bg-muted text-foreground transition-colors text-center cursor-pointer"
            >
              <span>KONSULTASI RACIKAN TEH</span>
            </a>
          </div>

          <div className="flex items-center justify-center gap-4 text-[10px] font-mono text-muted-foreground pt-1">
            <span className="flex items-center gap-1">
              <Check className="w-3 h-3 text-accent" /> Stok Resmi Terjamin
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Check className="w-3 h-3 text-accent" /> Pengiriman Higienis
            </span>
          </div>
        </div>

        {/* Description Section */}
        {product.description && (
          <div className="space-y-2 pt-2">
            <h3 className="text-xs font-mono font-bold tracking-widest uppercase text-accent">
              FILOSOFI &amp; DESKRIPSI RACIKAN
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>
        )}

        {/* Natural Ingredients List */}
        {product.ingredients && product.ingredients.length > 0 && (
          <div className="space-y-3 pt-3 border-t border-border">
            <h3 className="text-xs font-mono font-bold tracking-widest uppercase text-accent">
              KOMPOSISI ALAMI PILIHAN
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {product.ingredients.map((ing, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 p-2 rounded-lg bg-surface border border-border/60 text-muted-foreground"
                >
                  <Check className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                  <span className="font-medium text-foreground">{ing}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Sensory Profile & Characteristics */}
        {product.characteristics && Object.keys(product.characteristics).length > 0 && (
          <div className="p-5 rounded-2xl bg-muted/40 border border-border space-y-3">
            <h4 className="text-[11px] font-mono font-bold tracking-widest uppercase text-foreground">
              PROFIL SENSORI &amp; KARAKTERISTIK SEDUH
            </h4>
            <div className="grid grid-cols-2 gap-4 text-xs">
              {Object.entries(product.characteristics).map(([key, val]) => (
                <div key={key} className="space-y-0.5">
                  <span className="text-[10px] font-mono uppercase font-bold text-muted-foreground block">
                    {key}
                  </span>
                  <span className="font-semibold text-foreground text-xs sm:text-sm">
                    {val}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Packaging Integrity Info */}
        {product.packaging_info && (
          <div className="p-4 rounded-xl bg-accent-subtle/50 border border-accent/20 text-xs text-foreground flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-accent shrink-0 mt-0.5" />
            <p className="leading-relaxed text-muted-foreground">
              <strong className="text-foreground font-semibold">Integritas Kemasan:</strong>{' '}
              {product.packaging_info}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
