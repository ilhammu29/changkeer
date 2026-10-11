'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { ArrowUpRight } from 'lucide-react';

export function Footer() {
  const pathname = usePathname();

  // Hide public footer on /admin routes
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="w-full bg-primary text-primary-foreground border-t border-border/20 pt-20 pb-12 mt-auto">
      <Container size="wide">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 pb-16 border-b border-primary-foreground/10">
          {/* Brand Manifesto & Info */}
          <div className="lg:col-span-5 flex flex-col justify-between pr-0 lg:pr-8">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="relative w-9 h-9 rounded-full overflow-hidden border border-white/20 shadow-xs shrink-0">
                  <Image
                    src="/images/logo_changkeer.jpg"
                    alt="CHANGKEER"
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <span className="font-extrabold text-xl tracking-[0.2em] uppercase text-primary-foreground">
                  CHANGKEER
                </span>
              </div>
              <p className="text-sm text-primary-foreground/80 leading-relaxed max-w-md font-normal mb-8">
                More Than Tea. A Better You. Dedikasi kami dalam menghadirkan racikan herbal murni dari daun, bunga, dan rempah nusantara untuk menemani kejernihan hidup Anda.
              </p>
            </div>

            <div className="space-y-2 text-xs text-primary-foreground/60">
              <p>Jl. Harmoni Alam No. 8, Bandung, Jawa Barat</p>
              <p>Email: halo@changkeer.com | WhatsApp: +62 812-3456-7890</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-primary-foreground/40 mb-6">
              NAVIGASI
            </h4>
            <ul className="space-y-3.5 text-xs font-semibold tracking-wider uppercase">
              <li>
                <Link href="/" className="hover:text-primary-foreground/70 transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/tentang-produk" className="hover:text-primary-foreground/70 transition-colors">
                  Tentang Produk
                </Link>
              </li>
              <li>
                <Link href="/katalog" className="hover:text-primary-foreground/70 transition-colors">
                  Katalog Teh
                </Link>
              </li>
              <li>
                <Link href="/tentang-kami" className="hover:text-primary-foreground/70 transition-colors">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/media-berita" className="hover:text-primary-foreground/70 transition-colors">
                  Media &amp; Berita
                </Link>
              </li>
              <li>
                <Link href="/hubungi-kami" className="hover:text-primary-foreground/70 transition-colors">
                  Hubungi Kami
                </Link>
              </li>
            </ul>
          </div>

          {/* Socials & Legal */}
          <div className="lg:col-span-4">
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-primary-foreground/40 mb-6">
              KOMUNITAS &amp; JEJARING
            </h4>
            <ul className="space-y-3.5 text-xs font-semibold tracking-wider uppercase mb-8">
              <li>
                <a
                  href="https://instagram.com/changkeer.tea"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:text-primary-foreground/70 transition-colors"
                >
                  <span>Instagram @changkeer.tea</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </li>
              <li>
                <a
                  href="https://youtube.com/@changkeer"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:text-primary-foreground/70 transition-colors"
                >
                  <span>YouTube Channel</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </li>
              <li>
                <a
                  href="https://tiktok.com/@changkeer"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:text-primary-foreground/70 transition-colors"
                >
                  <span>TikTok Official</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </li>
            </ul>

            <div className="p-4 rounded-sm bg-surface/5 border border-primary-foreground/10 text-xs">
              <span className="font-bold block mb-1 text-primary-foreground/90">PORTAL PENGELOLA</span>
              <p className="text-[11px] text-primary-foreground/60 mb-2">
                Akses CMS pengelolaan konten dan produk CHANGKEER.
              </p>
              <Link
                href="/admin"
                className="inline-flex items-center gap-1 text-[11px] font-bold tracking-wider uppercase text-primary-foreground underline hover:opacity-80"
              >
                <span>Masuk ke CMS Admin</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-primary-foreground/50 gap-4">
          <p>© 2026 CHANGKEER Botanical. Hak Cipta Dilindungi.</p>
          <div className="flex items-center space-x-6 text-[11px]">
            <span>100% Herbal Asli</span>
            <span>•</span>
            <span>Bebas Perisa Buatan</span>
            <span>•</span>
            <span>Bandung, Indonesia</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
