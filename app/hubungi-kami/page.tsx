import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { ContactForm } from '@/components/contact/ContactForm';
import { getSiteSettings } from '@/lib/data/settings';
import { Mail, Phone, MapPin, Clock, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Hubungi Kami',
  description:
    'Hubungi tim CHANGKEER untuk pertanyaan seputar produk, kemitraan kafe & reseller, atau informasi lainnya.',
};

export default async function HubungiKamiPage() {
  const settings = await getSiteSettings();

  return (
    <div className="pb-20 bg-white text-foreground">
      {/* Section 1: Hero Banner with Background Image */}
      <section className="relative w-full py-16 sm:py-24 md:py-28 bg-neutral-950 overflow-hidden border-b border-border mb-12 sm:mb-16">
        <Image
          src="/images/assets/english_breakfast_tea_produk.jpg"
          alt="Hubungi Kami CHANGKEER"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_35%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/92 via-black/75 to-black/40 pointer-events-none" />

        <Container size="wide" className="relative z-10">
          <div className="max-w-2xl space-y-3.5">
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] uppercase text-purple-300 block">
              PUSAT KOMUNIKASI
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold uppercase tracking-tight text-white leading-tight">
              HUBUNGI KAMI
            </h1>
            <p className="text-sm sm:text-base text-white/85 leading-relaxed font-normal">
              Kami menyambut setiap pertanyaan, konsultasi racikan, dan peluang kemitraan dengan tangan terbuka.
            </p>
          </div>
        </Container>
      </section>

      <Container size="wide">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Bespoke Atelier & Concierge Information */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-border/80 rounded-3xl p-7 sm:p-9 space-y-6 shadow-sm card-boundary">
              <div className="space-y-2 border-b border-border/70 pb-5">
                <span className="text-[10px] font-mono tracking-widest uppercase text-primary font-bold block">
                  ATELIER BOTANI CHANGKEER
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-bold uppercase tracking-tight text-foreground">
                  Koordinat Resmi
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                  Studio racikan kami berpusat di dataran tinggi Bandung, didedikasikan untuk menghadirkan kebaikan botani murni langsung ke meja Anda.
                </p>
              </div>

              {/* Atelier Channel List */}
              <div className="space-y-5 text-xs">
                {/* Email */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-primary" />
                    <span>EMAIL KORESPONDENSI</span>
                  </span>
                  <a
                    href={`mailto:${settings.contact_email || 'halo@changkeer.com'}`}
                    className="font-bold text-sm text-foreground hover:text-primary transition-colors block pl-5"
                  >
                    {settings.contact_email || 'halo@changkeer.com'}
                  </a>
                </div>

                {/* WhatsApp Concierge */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-primary" />
                    <span>CONCIERGE WHATSAPP &amp; TELEPON</span>
                  </span>
                  <div className="pl-5 flex items-center gap-2">
                    <a
                      href={`https://wa.me/${(settings.contact_phone || '+6281234567890').replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-sm text-foreground hover:text-primary transition-colors"
                    >
                      {settings.contact_phone || '+62 812-3456-7890'}
                    </a>
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                      Aktif
                    </span>
                  </div>
                </div>

                {/* Studio Location */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    <span>ALAMAT STUDIO RACIKAN</span>
                  </span>
                  <p className="font-normal text-muted-foreground text-xs leading-relaxed pl-5">
                    {settings.contact_address ||
                      'Jl. Harmoni Alam No. 8, Bandung, Jawa Barat, Indonesia'}
                  </p>
                </div>

                {/* Operating Hours */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    <span>JAM LAYANAN SEDUH &amp; KONSULTASI</span>
                  </span>
                  <p className="font-normal text-muted-foreground text-xs leading-relaxed pl-5">
                    Senin – Sabtu: 09:00 – 17:00 WIB (Minggu &amp; Hari Libur Nasional Tutup)
                  </p>
                </div>
              </div>
            </div>

            {/* Atelier Commitment Card */}
            <div className="p-6 rounded-2xl bg-white border border-border/80 shadow-sm card-boundary space-y-2.5">
              <div className="flex items-center gap-2 text-primary">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider">
                  FILOSOFI PELAYANAN
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Setiap pesan Anda dibaca langsung oleh tim peracik botani CHANGKEER. Kami memastikan setiap konsultasi formula dan pertanyaan kemitraan dijawab dengan dedikasi penuh dan kejujuran rasa.
              </p>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </Container>
    </div>
  );
}
