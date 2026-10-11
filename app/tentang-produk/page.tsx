import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { ProductShowcase } from '@/components/products/ProductShowcase';
import { ProductCard } from '@/components/products/ProductCard';
import { Reveal } from '@/components/ui/Reveal';
import { getPublishedProducts } from '@/lib/data/products';
import { Leaf, ShieldCheck, Clock, Recycle, ArrowUpRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Tentang Produk',
  description:
    'Standar racikan teh herbal fungsional CHANGKEER. Pelajari 3 varian utama, kemurnian bahan baku tanpa daun senna, kemasan bebas mikroplastik, dan ritual seduh kurang dari 3 menit.',
};

export default async function TentangProdukPage() {
  const products = await getPublishedProducts();

  const ingredientsShowcase = [
    {
      name: 'Daun Teh Hijau & Hitam Utuh (Camellia sinensis)',
      origin: 'Kebun Teh Pegunungan Nusantara',
      notes: 'Dipetik pada pucuk optimal untuk mempertahankan antioksidan polifenol alami tanpa sensasi rasa pahit pekat.',
    },
    {
      name: 'Kuntum Bunga Melati Utuh (Jasminum sambac)',
      origin: 'Sentra Melati Tradisional Jawa',
      notes: 'Kelopak melati segar utuh yang melepaskan aroma wangi menenangkan alami tanpa perisa esens sintetis.',
    },
    {
      name: 'Daun Spearmint & Peppermint (Mentha)',
      origin: 'Dataran Tinggi Sejuk',
      notes: 'Memberikan hembusan sensasi dingin bersih alami yang melegakan pernapasan dan menyegarkan fokus.',
    },
    {
      name: 'Gula Sorgum Organik Rendah Glikemik',
      origin: 'Petani Sorgum Lestari',
      notes: 'Pemanis alami bernutrisi alternatif pengganti gula tebu rafinasi, ramah bagi metabolisme tubuh.',
    },
    {
      name: 'Madu Hutan Murni Nusantara',
      origin: 'Hutan Tropis Alami',
      notes: 'Madu mentah tanpa pasteurisasi berlebih untuk melengkapi kelembutan rasa dan daya tahan tubuh.',
    },
    {
      name: 'Polong Vanilla Alami (Vanilla planifolia)',
      origin: 'Perkebunan Vanilla Nusantara',
      notes: 'Menyumbangkan aroma manis lembut yang menenangkan pikiran dan meredakan kepenatan harian.',
    },
  ];

  return (
    <div className="w-full bg-[#0c0b11]">
      {/* 1. Main Exhibition Showcase (Reference-driven Minimalist Carousel) */}
      <ProductShowcase />

      {/* 2. 4 Core Pillars of Brand Integrity from PDF */}
      <section id="pillars" className="py-20 border-t border-border/20 bg-background text-foreground scroll-mt-20">
        <Container size="wide">
          <Reveal>
            <div className="max-w-2xl mb-12">
              <span className="text-[11px] font-mono font-bold tracking-[0.25em] uppercase text-accent block mb-2">
                02 // KOMITMEN INTEGRITAS KAMI
              </span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-foreground">
                STANDAR KUALITAS TANPA KOMPROMI
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                Lahir dari evaluasi kritis terhadap industri teh konvensional yang kerap mengabaikan kesehatan jangka panjang konsumen.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4 p-6 rounded-2xl bg-surface border border-border shadow-xs">
              <div className="w-10 h-10 rounded-sm bg-primary text-primary-foreground flex items-center justify-center">
                <Recycle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold uppercase tracking-tight text-foreground">
                100% Bebas Mikroplastik
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Kantong teh konvensional melepaskan miliaran partikel mikroplastik berbahaya ke air panas. CHANGKEER menggunakan kemasan bebas mikroplastik dan ramah lingkungan.
              </p>
            </div>

            <div className="space-y-4 p-6 rounded-2xl bg-surface border border-border shadow-xs">
              <div className="w-10 h-10 rounded-sm bg-primary text-primary-foreground flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold uppercase tracking-tight text-foreground">
                Bebas Daun Senna (Aman Harian)
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Banyak merek teh &quot;detox&quot; mengandalkan daun senna (daun jati cina) yang bersifat laksatif keras. Kami menolak bahan tersebut agar aman dikonsumsi harian tanpa merusak usus.
              </p>
            </div>

            <div className="space-y-4 p-6 rounded-2xl bg-surface border border-border shadow-xs">
              <div className="w-10 h-10 rounded-sm bg-primary text-primary-foreground flex items-center justify-center">
                <Leaf className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold uppercase tracking-tight text-foreground">
                Gula Sorgum &amp; Madu Murni
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Mengganti gula tebu rafinasi berlebih dengan alternatif alami bernutrisi: gula sorgum rendah glikemik dan madu hutan murni nusantara.
              </p>
            </div>

            <div className="space-y-4 p-6 rounded-2xl bg-surface border border-border shadow-xs">
              <div className="w-10 h-10 rounded-sm bg-primary text-primary-foreground flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold uppercase tracking-tight text-foreground">
                Penyajian Cepat &lt; 3 Menit
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Dirancang untuk gaya hidup aktif modern grab-and-go. Ekstraksi optimal daun teh dan kelopak bunga dicapai hanya dalam hitungan kurang dari 3 menit.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. Universal Brewing Ritual */}
      <section className="py-20 border-b border-border bg-surface text-foreground">
        <Container size="wide">
          <Reveal>
            <div className="max-w-2xl mx-auto text-center space-y-3 mb-16">
              <span className="text-[11px] font-mono font-bold tracking-[0.25em] uppercase text-accent block">
                03 // RITUAL PENYAJIAN CEPAT
              </span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-foreground">
                3 LANGKAH NIKMAT &lt; 3 MENIT
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Ekstraksi rasa dan aroma botani maksimal tanpa ribet, menemani kesibukan harian Anda.
              </p>
            </div>
          </Reveal>

          <Reveal delayMs={100}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-2xl bg-background border border-border text-center space-y-3 shadow-xs">
                <span className="font-mono text-3xl font-black text-primary">01</span>
                <h4 className="font-bold text-base uppercase tracking-tight text-foreground">
                  Siapkan Air Panas 85-95°C
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Tuangkan 250ml - 300ml air panas berkualitas ke dalam cangkir favorit Anda untuk mengaktifkan aroma minyak atsiri alami.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-background border border-border text-center space-y-3 shadow-xs">
                <span className="font-mono text-3xl font-black text-primary">02</span>
                <h4 className="font-bold text-base uppercase tracking-tight text-foreground">
                  Tutup Cangkir &amp; Seduh &lt; 3 Menit
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Masukkan kantung teh CHANGKEER. Tutup cangkir selama 2 hingga 3 menit agar aroma harum botani terkonsentrasi sempurna.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-background border border-border text-center space-y-3 shadow-xs">
                <span className="font-mono text-3xl font-black text-primary">03</span>
                <h4 className="font-bold text-base uppercase tracking-tight text-foreground">
                  Nikmati Hangat atau Dingin
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Nikmati selagi hangat untuk ketenangan batin, atau tambahkan es batu untuk kesegaran ganda di siang hari yang terik.
                </p>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* 4. Raw Ingredients Explorer */}
      <section className="py-20 border-b border-border bg-background text-foreground">
        <Container size="wide">
          <Reveal>
            <div className="mb-12 max-w-2xl">
              <span className="text-[11px] font-mono font-bold tracking-[0.25em] uppercase text-accent block mb-2">
                04 // EKSPLORASI BOTANI ALAMI
              </span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-foreground">
                BAHAN BAKU PILIHAN NUSANTARA
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                Kami menggunakan tanaman herbal murni, kelopak bunga asli, dan rempah bermutu tinggi untuk menjamin khasiat organ dan kesegaran rasa.
              </p>
            </div>
          </Reveal>

          <Reveal delayMs={100}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ingredientsShowcase.map((item) => (
                <div
                  key={item.name}
                  className="p-6 rounded-2xl bg-surface border border-border flex flex-col justify-between space-y-4 hover:border-border-strong transition-colors"
                >
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-accent block mb-1">
                      ASAL: {item.origin}
                    </span>
                    <h4 className="font-bold text-base text-foreground leading-snug">
                      {item.name}
                    </h4>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.notes}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      {/* 5. Catalog Link */}
      <section className="py-20 bg-surface text-foreground">
        <Container size="wide">
          <Reveal>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
              <div>
                <span className="text-[11px] font-mono font-bold tracking-[0.25em] uppercase text-accent block mb-2">
                  05 // SELURUH KOLEKSI
                </span>
                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-foreground">
                  KATALOG TEH HERBAL CHANGKEER
                </h2>
              </div>
              <Link
                href="/katalog"
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-foreground hover:text-primary underline underline-offset-4"
              >
                <span>BUKA KATALOG LENGKAP</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>

          <Reveal delayMs={100}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.slice(0, 3).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </Reveal>
        </Container>
      </section>
    </div>
  );
}
