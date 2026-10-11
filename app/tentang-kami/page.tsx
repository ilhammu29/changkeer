import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { getPageContent } from '@/lib/data/pages';
import { ArrowUpRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Tentang Kami',
  description:
    'Filosofi dan nilai brand CHANGKEER. Mengangkat kekayaan botani nusantara untuk menemani gaya hidup sehat dan kesadaran diri.',
};

export default async function TentangKamiPage() {
  const pageData = await getPageContent('tentang-kami');

  const manifesto = pageData?.sections?.manifesto || {
    title: 'Harmoni Tradisi dan Gaya Hidup Modern',
    subtitle: 'Sebuah cangkir yang mengingatkan kita untuk bernapas lebih dalam.',
    paragraphs: [
      'CHANGKEER bermula dari sebuah kesadaran sederhana: minuman yang kita konsumsi sehari-hari harus memberi makan jiwa dan menyelaraskan tubuh, bukan sekadar memacu detak jantung.',
      'Kami mengangkat kekayaan botani nusantara ke dalam cangkir modern. Dari serai wangi di perbukitan Jawa Barat hingga jahe merah dan kelopak rosella tropis, setiap racikan kami lewati uji rasa berulang untuk memastikan pengalaman minum yang menenangkan.',
    ],
  };

  const values = pageData?.sections?.values || [
    {
      name: 'Integritas Botani',
      desc: 'Hanya menggunakan tanaman herbal murni tanpa tambahan perisa sintetis atau pewarna buatan.',
    },
    {
      name: 'Keberlanjutan Nyata',
      desc: 'Mendukung kemitraan pertanian lokal dan kantung teh biodegradable yang terurai alami.',
    },
    {
      name: 'Keseimbangan Hidup',
      desc: 'Membantu Anda menemukan ritme hidup yang lebih tenang, jernih, dan penuh kesadaran.',
    },
  ];

  const founders = [
    'Almaidah Chaerudin Putri',
    'Annisha Humaira',
    'Jogi Manaon Hutabarat',
    'Johana Abigael Rumbiak',
    'Keyla Putri Adisty',
  ];

  return (
    <div className="pb-16 sm:pb-24">
      {/* Editorial Intro with Background Image */}
      <section className="relative w-full py-16 sm:py-20 md:py-24 bg-neutral-950 overflow-hidden border-b border-border mb-16 sm:mb-20">
        <Image
          src="/images/assets/banner.jpg"
          alt="Filosofi CHANGKEER"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/92 via-black/75 to-black/40 pointer-events-none" />

        <Container size="wide" className="relative z-10">
          <div className="max-w-3xl space-y-3.5">
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] uppercase text-purple-300 block">
              IDENTITAS &amp; FILOSOFI
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white leading-tight">
              {manifesto.title}
            </h1>
            <p className="text-sm sm:text-base font-normal text-white/80 leading-relaxed pt-1">
              &quot;{manifesto.subtitle}&quot;
            </p>
          </div>
        </Container>
      </section>

      {/* Brand Narrative Section */}
      <section className="py-20 border-b border-border bg-surface">
        <Container size="wide">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground block">
                NARASI KAMI
              </span>
              <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-foreground">
                DARI TANAH SUBUR MENUJU CANGKIR ANDA
              </h2>
            </div>

            <div className="lg:col-span-7 space-y-6 text-base sm:text-lg text-muted-foreground leading-relaxed">
              {manifesto.paragraphs.map((p: string, idx: number) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Brand Values - Architectural Editorial Layout (No Cardboxes) */}
      <section className="py-20 border-b border-border bg-background">
        <Container size="wide">
          <div className="mb-14">
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] uppercase text-muted-foreground block mb-2">
              PRINSIP UTAMA
            </span>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-foreground">
              NILAI YANG KAMI PEGANG
            </h2>
          </div>

          {/* Architectural 3-Column Hairline Partition */}
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border border-y border-border">
            {values.map((v: any, idx: number) => (
              <div
                key={v.name}
                className="py-8 md:py-10 px-0 md:px-8 first:pl-0 last:pr-0 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-3">
                  <span className="font-mono text-3xl sm:text-4xl font-light text-primary/40 block">
                    0{idx + 1}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold uppercase tracking-tight text-foreground">
                    {v.name}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Authentic Founders & Initiators - Typographic Roster (No Cardboxes) */}
      <section className="py-20 border-b border-border bg-surface">
        <Container size="wide">
          <div className="mb-12">
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] uppercase text-accent block mb-2">
              INISIATOR &amp; TIM
            </span>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-foreground">
              DI BALIK CHANGKEER
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2 max-w-2xl leading-relaxed">
              Berawal dari inisiatif &ldquo;Tutup Cangkir&rdquo; untuk menghadirkan teh herbal berkelas yang sehat, bebas mikroplastik, tanpa zat pemutih, dan ramah gaya hidup aktif.
            </p>
          </div>

          {/* Clean Typographic Registry */}
          <div className="border-t border-border divide-y divide-border/70">
            {founders.map((name, idx) => (
              <div
                key={name}
                className="py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 group hover:bg-background/60 transition-colors px-2 sm:px-3 rounded-sm"
              >
                <div className="flex items-center gap-4 sm:gap-6">
                  <span className="font-mono text-xs font-semibold text-accent/70 w-6">
                    0{idx + 1}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold tracking-tight text-foreground uppercase group-hover:text-primary transition-colors">
                    {name}
                  </h3>
                </div>
                <div className="flex items-center gap-3 self-start sm:self-auto pl-10 sm:pl-0">
                  <span className="text-[10px] uppercase font-mono tracking-[0.2em] px-2.5 py-0.5 rounded-sm bg-background border border-border text-muted-foreground font-semibold">
                    CO-FOUNDER
                  </span>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground hidden md:inline">
                    CHANGKEER INITIATIVE
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Final Editorial Call to Action with Image Background */}
      <section className="py-20 bg-background">
        <Container size="wide">
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden min-h-[360px] sm:min-h-[400px] flex items-center p-8 sm:p-14 lg:p-16 border border-border/80 shadow-md">
            {/* Background Image */}
            <Image
              src="/images/assets/banner2.jpg"
              alt="Koleksi Teh Herbal CHANGKEER"
              fill
              sizes="100vw"
              className="object-cover object-center"
            />
            {/* Dark Scrim */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/92 via-black/80 to-black/55 pointer-events-none" />

            <div className="relative z-10 max-w-xl space-y-4 text-white">
              <span className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-purple-300 block">
                MEMULAI RITUAL ANDA
              </span>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white leading-tight">
                RASAKAN KESEIMBANGAN HARI INI
              </h3>
              <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
                Jelajahi varian racikan teh herbal CHANGKEER dan temukan rasa yang melengkapi keseharian Anda.
              </p>
              <div className="pt-2">
                <Link
                  href="/katalog"
                  className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase bg-white text-neutral-900 px-6 py-3 rounded-lg hover:bg-white/90 transition-all shadow-md active:scale-95"
                >
                  <span>TEMUKAN RACIKAN</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
