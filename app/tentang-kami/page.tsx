import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
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

  return (
    <div className="py-12 md:py-20">
      {/* Editorial Intro */}
      <section className="pb-20 border-b border-border">
        <Container size="wide">
          <div className="max-w-4xl space-y-6">
            <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-accent block">
              01 // IDENTITAS &amp; FILOSOFI
            </span>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-foreground leading-[0.95]">
              {manifesto.title}
            </h1>
            <p className="text-lg sm:text-2xl font-light text-foreground/80 leading-relaxed pt-2">
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

      {/* Brand Values */}
      <section className="py-20 border-b border-border bg-background">
        <Container size="wide">
          <div className="mb-14">
            <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-muted-foreground block mb-2">
              02 // PRINSIP UTAMA
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-foreground">
              NILAI YANG KAMI PEGANG
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v: any, idx: number) => (
              <div
                key={v.name}
                className="p-8 rounded-lg bg-surface border border-border space-y-4 hover:border-border-strong transition-colors"
              >
                <div className="w-10 h-10 rounded-sm bg-accent text-accent-foreground flex items-center justify-center font-bold text-xs">
                  0{idx + 1}
                </div>
                <h3 className="text-xl font-bold uppercase tracking-tight text-foreground">
                  {v.name}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Authentic Founders & Initiators */}
      <section className="py-20 border-b border-border bg-surface">
        <Container size="wide">
          <div className="mb-14">
            <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-accent block mb-2">
              03 // INISIATOR &amp; TIM
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-foreground">
              DI BALIK CHANGKEER
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-2xl">
              Berawal dari inisiatif &ldquo;Tutup Cangkir&rdquo; untuk menghadirkan teh herbal berkelas yang sehat, bebas mikroplastik, tanpa zat pemutih, dan ramah gaya hidup aktif.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              'Almaidah Chaerudin Putri',
              'Annisha Humaira',
              'Jogi Manaon Hutabarat',
              'Johana Abigael Rumbiak',
              'Keyla Putri Adisty',
            ].map((name, idx) => (
              <div
                key={name}
                className="p-6 rounded-lg bg-background border border-border flex flex-col justify-between hover:border-border-strong transition-all"
              >
                <div>
                  <span className="text-[10px] font-mono text-muted-foreground block mb-3">
                    {`0${idx + 1} // CO-FOUNDER`}
                  </span>
                  <h3 className="text-sm font-bold tracking-tight text-foreground uppercase">
                    {name}
                  </h3>
                </div>
                <div className="pt-6 border-t border-border/60 mt-6">
                  <span className="text-[10px] uppercase tracking-wider text-accent font-semibold">
                    CHANGKEER INITIATIVE
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Final Editorial Call to Action */}
      <section className="py-20 bg-surface">
        <Container size="wide">
          <div className="p-10 sm:p-16 rounded-xl bg-primary text-primary-foreground flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary-foreground/60">
                MEMULAI RITUAL ANDA
              </span>
              <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-tight">
                RASAKAN KESEIMBANGAN HARI INI
              </h3>
              <p className="text-sm text-primary-foreground/80 leading-relaxed">
                Jelajahi varian racikan teh herbal CHANGKEER dan temukan rasa yang melengkapi keseharian Anda.
              </p>
            </div>

            <Link
              href="/katalog"
              className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase bg-primary-foreground text-primary px-8 py-4 rounded-sm hover:opacity-95 transition-opacity flex-shrink-0"
            >
              <span>TEMUKAN RACIKAN</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
