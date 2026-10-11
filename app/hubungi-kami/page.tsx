import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { ContactForm } from '@/components/contact/ContactForm';
import { getSiteSettings } from '@/lib/data/settings';
import { Mail, Phone, MapPin, Clock, MessageSquareQuote } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Hubungi Kami',
  description:
    'Hubungi tim CHANGKEER untuk pertanyaan seputar produk, kemitraan kafe & reseller, atau informasi lainnya.',
};

export default async function HubungiKamiPage() {
  const settings = await getSiteSettings();

  return (
    <div className="pb-16 sm:pb-24">
      {/* Section 1: Hero Banner with Background Image */}
      <section className="relative w-full py-16 sm:py-20 md:py-24 bg-neutral-950 overflow-hidden border-b border-border mb-12 sm:mb-16">
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
          <div className="max-w-2xl space-y-3">
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] uppercase text-purple-300 block">
              PUSAT KOMUNIKASI
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white leading-tight">
              HUBUNGI KAMI
            </h1>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed font-normal">
              Kami menyambut setiap pertanyaan, masukan, dan peluang kemitraan dengan tangan terbuka.
            </p>
          </div>
        </Container>
      </section>

      <Container size="wide">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Contact Info & Support Hours */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-surface border border-border rounded-lg p-6 sm:p-8 space-y-6">
              <h3 className="text-lg font-bold uppercase tracking-tight text-foreground border-b border-border pb-3">
                INFORMASI RESMI
              </h3>

              <div className="space-y-6 text-xs">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-sm bg-muted text-accent">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-muted-foreground uppercase text-[10px] block">
                      EMAIL LAYANAN PELANGGAN
                    </span>
                    <a
                      href={`mailto:${settings.contact_email || 'halo@changkeer.com'}`}
                      className="font-bold text-foreground text-sm hover:underline"
                    >
                      {settings.contact_email || 'halo@changkeer.com'}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-sm bg-muted text-accent">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-muted-foreground uppercase text-[10px] block">
                      WHATSAPP &amp; TELEPON
                    </span>
                    <a
                      href={`tel:${settings.contact_phone || '+6281234567890'}`}
                      className="font-bold text-foreground text-sm hover:underline"
                    >
                      {settings.contact_phone || '+62 812-3456-7890'}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-sm bg-muted text-accent">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-muted-foreground uppercase text-[10px] block">
                      ALAMAT STUDIO RACIKAN
                    </span>
                    <p className="font-medium text-foreground text-xs leading-relaxed mt-0.5">
                      {settings.contact_address ||
                        'Jl. Harmoni Alam No. 8, Bandung, Jawa Barat, Indonesia'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-sm bg-muted text-accent">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-muted-foreground uppercase text-[10px] block">
                      JAM OPERASIONAL LAYANAN
                    </span>
                    <p className="font-medium text-foreground text-xs leading-relaxed mt-0.5">
                      Senin – Sabtu: 09:00 – 17:00 WIB (Hari Minggu Libur)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Note on Direct Database Inquiries */}
            <div className="p-6 rounded-md bg-accent-subtle/80 border border-border space-y-2">
              <div className="flex items-center gap-2 text-accent">
                <MessageSquareQuote className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  KOMITMEN PELAYANAN
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Setiap pesan yang Anda kirimkan tersimpan secara terenkripsi dan langsung masuk ke dashboard tim peninjau CHANGKEER. Kami merespons maksimal dalam kurun waktu 1x24 jam kerja.
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
