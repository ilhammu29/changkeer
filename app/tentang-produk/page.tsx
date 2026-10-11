import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { ProductCard } from '@/components/products/ProductCard';
import { getPublishedProducts } from '@/lib/data/products';
import { getPageContent } from '@/lib/data/pages';
import { Leaf, Thermometer, Package, ArrowUpRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Tentang Produk',
  description:
    'Standar racikan teh herbal alami CHANGKEER. Pelajari kemurnian bahan baku, teknik pengeringan higienis, dan panduan penyajian tanpa klaim berlebih.',
};

export default async function TentangProdukPage() {
  const [products, pageData] = await Promise.all([
    getPublishedProducts(),
    getPageContent('tentang-produk'),
  ]);

  const intro = pageData?.sections?.intro || {
    title: 'Kemurnian Botani di Setiap Seduhan',
    description:
      'Setiap varian CHANGKEER dirancang dengan menghormati karakteristik alami tanaman herbal, menghasilkan profil rasa yang seimbang tanpa pemanis sintetis.',
  };

  const ingredientsShowcase = [
    {
      name: 'Jahe Merah (Zingiber officinale var. rubrum)',
      origin: 'Lereng Pegunungan Jawa Barat',
      notes: 'Dipanen pada usia optimal untuk mendapatkan aroma rempah hangat dan sensasi nyaman di tenggorokan.',
    },
    {
      name: 'Serai Wangi (Cymbopogon citratus)',
      origin: 'Perbukitan Alami Priangan',
      notes: 'Mengandung minyak sitral murni yang memberikan aroma sitrus segar alami tanpa rasa asam buah.',
    },
    {
      name: 'Bunga Rosella (Hibiscus sabdariffa)',
      origin: 'Dataran Tropis Nusantara',
      notes: 'Kelopak bunga utuh yang menghasilkan seduhan merah delima berkilau dengan rasa asam menyegarkan.',
    },
    {
      name: 'Bunga Chamomile Utuh (Matricaria chamomilla)',
      origin: 'Petani Mitra Terverifikasi',
      notes: 'Kuntum bunga utuh bebas tangkai berlebih untuk aroma manis apel yang menenangkan pikiran.',
    },
    {
      name: 'Daun Spearmint Kering (Mentha spicata)',
      origin: 'Dataran Tinggi Sejuk',
      notes: 'Dipetik saat embun pagi untuk mempertahankan sensasi dingin bersih pada setiap tegukan.',
    },
    {
      name: 'Daun Kelor Muda (Moringa oleifera)',
      origin: 'Kebun Organik Berkelanjutan',
      notes: 'Dikeringkan pada suhu rendah untuk menjaga warna hijau alami dan rasa umami nabati yang lembut.',
    },
  ];

  return (
    <div className="py-12 md:py-20">
      {/* Editorial Header */}
      <section className="pb-16 border-b border-border">
        <Container size="wide">
          <div className="max-w-4xl space-y-4">
            <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-accent block">
              01 // STANDAR KUALITAS &amp; BAHAN
            </span>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-foreground leading-[0.95]">
              {intro.title}
            </h1>
            <p className="text-base sm:text-xl text-muted-foreground leading-relaxed pt-2">
              {intro.description}
            </p>
          </div>
        </Container>
      </section>

      {/* Philosophy & Craftsmanship Section */}
      <section className="py-20 border-b border-border bg-surface">
        <Container size="wide">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-sm bg-accent text-accent-foreground flex items-center justify-center">
                <Leaf className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold uppercase tracking-tight text-foreground">
                Bahan Baku Nabati Utuh
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Kami menghindari serbuk limbah industri atau perisa esens sintetis. CHANGKEER hanya menggunakan potongan daun, kelopak bunga, dan irisan rimpang utuh agar minyak esensial alami tetap terkunci hingga waktu penyeduhan.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-10 h-10 rounded-sm bg-accent text-accent-foreground flex items-center justify-center">
                <Thermometer className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold uppercase tracking-tight text-foreground">
                Pengeringan Higienis Terkontrol
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Setiap panenan dikeringkan dalam ruangan tertutup dengan kontrol suhu dan sirkulasi udara stabil, mencegah kontaminasi debu lingkungan serta menjaga profil rasa alami dari pemanasan berlebih.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-10 h-10 rounded-sm bg-accent text-accent-foreground flex items-center justify-center">
                <Package className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold uppercase tracking-tight text-foreground">
                Kemasan Bertanggung Jawab
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Kantung piramida kami menggunakan serat pati nabati yang dapat terurai secara alami (biodegradable). Bebas lem beracun dan bebas pelepasan mikroplastik ke dalam air seduhan panas Anda.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Ingredients Showcase */}
      <section className="py-20 border-b border-border bg-background">
        <Container size="wide">
          <div className="mb-12">
            <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-muted-foreground block mb-2">
              02 // EKSPLORASI BOTANI
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-foreground">
              BAHAN BAKU PILIHAN
            </h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
              Kami bekerja sama dengan kelompok tani lokal yang mempraktikkan budidaya ramah lingkungan untuk memastikan integritas setiap helai tanaman.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ingredientsShowcase.map((item) => (
              <div
                key={item.name}
                className="p-6 rounded-md bg-surface border border-border flex flex-col justify-between space-y-4 hover:border-border-strong transition-colors"
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
        </Container>
      </section>

      {/* Universal Brewing Ritual */}
      <section className="py-20 border-b border-border bg-surface">
        <Container size="wide">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-accent block">
              03 // RITUAL PENYAJIAN
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-foreground">
              3 LANGKAH MENIKMATI KEMURNIAN
            </h2>
            <p className="text-sm text-muted-foreground">
              Dapatkan ekstraksi minyak aromatik terbaik dengan langkah sederhana ini.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-lg bg-background border border-border text-center space-y-3">
              <span className="font-mono text-2xl font-black text-accent">01</span>
              <h4 className="font-bold text-base uppercase tracking-tight text-foreground">
                Air Bersih 90-95°C
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Gunakan air mineral berkualitas. Setelah mendidih, diamkan sekitar 1 menit agar suhu mencapai titik ideal tanpa merusak aroma herbal.
              </p>
            </div>

            <div className="p-8 rounded-lg bg-background border border-border text-center space-y-3">
              <span className="font-mono text-2xl font-black text-accent">02</span>
              <h4 className="font-bold text-base uppercase tracking-tight text-foreground">
                Seduh Dalam Wadah Tertutup
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Masukkan 1 kantung piramida ke dalam 250ml air. Tutup cangkir selama 4-5 menit agar minyak atsiri aromatik tidak menguap ke udara.
              </p>
            </div>

            <div className="p-8 rounded-lg bg-background border border-border text-center space-y-3">
              <span className="font-mono text-2xl font-black text-accent">03</span>
              <h4 className="font-bold text-base uppercase tracking-tight text-foreground">
                Nikmati Selagi Hangat
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Hirup aromanya perlahan sebelum tegukan pertama. Anda dapat menyeduh ulang kantung teh hingga 2 kali dengan waktu ekstraksi lebih lama.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Featured Products Showcase */}
      <section className="py-20 bg-background">
        <Container size="wide">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-muted-foreground block mb-2">
                04 // PRODUK KAMI
              </span>
              <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-foreground">
                VARIAN TEH HERBAL CHANGKEER
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
