import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { ContactForm } from '@/components/contact/ContactForm';
import { getSiteSettings } from '@/lib/data/settings';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with the Changkeer concierge for inquiries, seasonal blends, and wholesale opportunities.',
};

export default async function HubungiKamiPage() {
  const settings = await getSiteSettings();

  return (
    <div className="pb-20 bg-white text-foreground font-sans">
      {/* Section 1: Hero Banner with Background Image */}
      <section className="relative w-full py-16 sm:py-24 md:py-28 bg-neutral-950 overflow-hidden border-b border-border mb-12 sm:mb-16">
        <Image
          src="/images/banners/contact_us_banner.jpg"
          alt="Contact Changkeer Concierge"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/92 via-black/75 to-black/40 pointer-events-none" />

        <Container size="wide" className="relative z-10">
          <div className="max-w-2xl space-y-3.5">
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] uppercase text-purple-300 block">
              CONCIERGE &amp; ATELIER
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-black uppercase tracking-tight text-white leading-tight">
              Contact Us
            </h1>
            <p className="text-sm sm:text-base text-white/85 leading-relaxed font-normal">
              We welcome every inquiry, custom blend consultation, and partnership idea with care.
            </p>
          </div>
        </Container>
      </section>

      {/* Section 2: Contact Form & Coordinates with Translucent Season Background */}
      <section className="relative w-full py-8 sm:py-12 overflow-hidden">
        {/* Translucent Botanical Season Background */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <Image
            src="/images/seasons/spring.jpg"
            alt="Changkeer Seasonal Botanical Texture"
            fill
            sizes="100vw"
            className="object-cover object-center opacity-15"
          />
          <div className="absolute inset-0 bg-white/85 backdrop-blur-[1px]" />
        </div>

        <Container size="wide" className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Left Column: Bespoke Atelier & Concierge Information */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white/95 backdrop-blur-xs border border-border/80 rounded-3xl p-7 sm:p-9 space-y-6 shadow-md card-boundary">
                <div className="space-y-2 border-b border-border/70 pb-5">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-primary font-bold block">
                    CHANGKEER BOTANICAL ATELIER
                  </span>
                  <h3 className="text-xl sm:text-2xl font-sans font-extrabold uppercase tracking-tight text-foreground">
                    Official Coordinates
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                    Our grab-and-go brew bar and botanical studio is based in Jakarta, serving honest loose-leaf infusions ready in under three minutes.
                  </p>
                </div>

                {/* Atelier Channel List */}
                <div className="space-y-5 text-xs">
                  {/* Email */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-primary" />
                      <span>OFFICIAL CORRESPONDENCE</span>
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
                      <span>WHATSAPP &amp; PHONE CONCIERGE</span>
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
                        Active
                      </span>
                    </div>
                  </div>

                  {/* Studio Location */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      <span>BREW BAR &amp; STUDIO LOCATION</span>
                    </span>
                    <p className="font-normal text-muted-foreground text-xs leading-relaxed pl-5">
                      {settings.contact_address ||
                        'Jakarta, Indonesia · Real loose-leaf herbal tea grab-and-go'}
                    </p>
                  </div>

                  {/* Operating Hours */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      <span>SERVICE HOURS &amp; INQUIRIES</span>
                    </span>
                    <p className="font-normal text-muted-foreground text-xs leading-relaxed pl-5">
                      Monday – Saturday: 09:00 – 17:00 WIB (Closed on Sundays &amp; Public Holidays)
                    </p>
                  </div>
                </div>
              </div>

              {/* Atelier Commitment Card without Star Icons */}
              <div className="p-6 rounded-2xl bg-white/95 backdrop-blur-xs border border-border/80 shadow-md card-boundary space-y-2.5">
                <div className="text-primary">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider">
                    SERVICE PHILOSOPHY
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Every message is received directly by the Changkeer team. We ensure every consultation and partnership inquiry is addressed with full botanical care.
                </p>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
