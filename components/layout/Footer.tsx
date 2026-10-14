'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { ArrowUpRight } from 'lucide-react';

export function Footer() {
  const pathname = usePathname();

  // Hide public footer on /admin, /account, /order, /checkout, /login, and /register routes
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/account') ||
    pathname.startsWith('/order') ||
    pathname.startsWith('/checkout') ||
    pathname === '/login' ||
    pathname === '/register'
  ) {
    return null;
  }

  return (
    <footer className="w-full bg-[#111113] text-neutral-200 border-t border-neutral-800/80 py-10 sm:py-12 mt-auto">
      <Container size="wide">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-neutral-800/80">
          {/* Brand Info */}
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/20 shrink-0 bg-white">
              <Image
                src="/images/logo_new.png"
                alt="CHANGKEER"
                fill
                className="object-contain p-0.5"
              />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-[0.2em] uppercase text-white block">
                CHANGKEER
              </span>
              <span className="text-[11px] text-neutral-400 tracking-wide font-normal">
                More Than Tea. A Better You.
              </span>
            </div>
          </div>

          {/* Clean Navigation Links */}
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold tracking-wider uppercase text-neutral-300">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/tentang-produk" className="hover:text-white transition-colors">
              About Product
            </Link>
            <Link href="/katalog" className="hover:text-white transition-colors">
              Blends &amp; Prices
            </Link>
            <Link href="/tentang-kami" className="hover:text-white transition-colors">
              About Changkeer
            </Link>
            <Link href="/media-berita" className="hover:text-white transition-colors">
              News
            </Link>
            <Link href="/hubungi-kami" className="hover:text-white transition-colors">
              Contact Us
            </Link>
          </nav>

          {/* Social & Admin Portal Minimal Link */}
          <div className="flex items-center gap-5 text-xs text-neutral-400 font-medium">
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
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-500 gap-3">
          <p>© {new Date().getFullYear()} CHANGKEER Botanical Craft. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <span>100% Herbal Infusions</span>
            <span>•</span>
            <span>Plastic-Free</span>
            <span>•</span>
            <span>Jakarta, Indonesia</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
