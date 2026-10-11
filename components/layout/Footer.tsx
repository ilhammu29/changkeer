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
    <footer className="w-full bg-primary text-primary-foreground border-t border-primary-foreground/10 py-10 sm:py-12 mt-auto">
      <Container size="wide">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-primary-foreground/10">
          {/* Brand Info */}
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/20 shrink-0">
              <Image
                src="/images/logo_changkeer.jpg"
                alt="CHANGKEER"
                fill
                className="rounded-full object-cover"
              />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-[0.2em] uppercase text-primary-foreground block">
                CHANGKEER
              </span>
              <span className="text-[11px] text-primary-foreground/70 tracking-wide font-normal">
                More Than Tea. A Better You.
              </span>
            </div>
          </div>

          {/* Clean Navigation Links */}
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold tracking-wider uppercase">
            <Link href="/" className="hover:text-primary-foreground/70 transition-colors">
              Beranda
            </Link>
            <Link href="/tentang-produk" className="hover:text-primary-foreground/70 transition-colors">
              Tentang Produk
            </Link>
            <Link href="/katalog" className="hover:text-primary-foreground/70 transition-colors">
              Katalog
            </Link>
            <Link href="/tentang-kami" className="hover:text-primary-foreground/70 transition-colors">
              Tentang Kami
            </Link>
            <Link href="/media-berita" className="hover:text-primary-foreground/70 transition-colors">
              Media &amp; Berita
            </Link>
            <Link href="/hubungi-kami" className="hover:text-primary-foreground/70 transition-colors">
              Hubungi Kami
            </Link>
          </nav>

          {/* Social & Admin Portal Minimal Link */}
          <div className="flex items-center gap-5 text-xs text-primary-foreground/80 font-medium">
            <a
              href="https://instagram.com/changkeer.tea"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <span>Instagram</span>
              <ArrowUpRight className="w-3 h-3 opacity-70" />
            </a>
            <span>•</span>
            <Link
              href="/admin"
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <span>CMS Admin</span>
              <ArrowUpRight className="w-3 h-3 opacity-70" />
            </Link>
          </div>
        </div>

        {/* Minimal Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-primary-foreground/50 gap-3">
          <p>© {new Date().getFullYear()} CHANGKEER Botanical Craft. Hak Cipta Dilindungi.</p>
          <div className="flex items-center gap-4">
            <span>100% Herbal Asli</span>
            <span>•</span>
            <span>Bebas Mikroplastik</span>
            <span>•</span>
            <span>Bandung, Indonesia</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
