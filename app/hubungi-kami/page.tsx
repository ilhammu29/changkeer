import React from 'react';
import type { Metadata } from 'next';
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
    <div className="py-12 md:py-20">
      <Container size="wide">
        {/* Page Header */}
        <div className="mb-14 pb-8 border-b border-border">
          <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-accent block mb-2">
            PUSAT KOMUNIKASI
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-foreground">
            HUBUNGI KAMI
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-2xl">
            Kami menyambut setiap pertanyaan, masukan, dan peluang kemitraan dengan tangan terbuka.
          </p>
        </div>

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
