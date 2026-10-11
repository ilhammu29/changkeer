'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';

const NAV_LINKS = [
  { name: 'BERANDA', href: '/' },
  { name: 'TENTANG PRODUK', href: '/tentang-produk' },
  { name: 'KATALOG', href: '/katalog' },
  { name: 'TENTANG KAMI', href: '/tentang-kami' },
  { name: 'MEDIA & BERITA', href: '/media-berita' },
  { name: 'HUBUNGI KAMI', href: '/hubungi-kami' },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.scrollY > 20;
          setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Detect if current page uses dark cinematic atmosphere (Home & Tentang Produk)
  const isDarkPage = pathname === '/' || pathname === '/tentang-produk';

  // Check if current route is active
  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  // Hide public navbar on /admin routes
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <header
      className={`${
        isDarkPage ? 'fixed top-0 inset-x-0' : 'sticky top-0'
      } z-50 w-full transition-all duration-300 ease-out ${
        isDarkPage
          ? isScrolled
            ? 'bg-[#111216]/90 backdrop-blur-md border-b border-white/10 shadow-xl text-white'
            : 'bg-transparent border-b border-transparent text-white'
          : isScrolled
          ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-xs text-foreground'
          : 'bg-background/80 backdrop-blur-xs border-b border-transparent text-foreground'
      }`}
    >
      <Container size="wide">
        <div className="flex items-center justify-between h-20">
          {/* Logo on the left with CHANGKEER Brand Seal */}
          <Link href="/" className="group flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-md flex items-center justify-center font-bold text-sm transition-transform duration-300 group-hover:scale-105 border ${
                isDarkPage
                  ? 'bg-white/10 border-white/25 text-white backdrop-blur-sm'
                  : 'bg-primary border-primary text-primary-foreground shadow-xs'
              }`}
            >
              {/* Hexagon / Tea Ideogram Seal */}
              <span className="font-serif text-base tracking-normal">茶</span>
            </div>
            <div className="flex flex-col">
              <span
                className={`font-black text-xl tracking-[0.2em] uppercase leading-none transition-colors ${
                  isDarkPage ? 'text-white' : 'text-foreground'
                }`}
              >
                CHANGKEER
              </span>
              <span
                className={`text-[9px] tracking-[0.3em] uppercase font-semibold mt-1 transition-colors ${
                  isDarkPage ? 'text-white/70' : 'text-muted-foreground'
                }`}
              >
                HERBAL CRAFT
              </span>
            </div>
          </Link>

          {/* Minimalist Horizontal Navigation (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-8">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs font-semibold tracking-widest transition-colors py-2 relative ${
                    isDarkPage
                      ? active
                        ? 'text-white font-bold'
                        : 'text-white/75 hover:text-white'
                      : active
                      ? 'text-foreground font-bold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {link.name}
                  {active && (
                    <span
                      className={`absolute bottom-0 left-0 right-0 h-[2px] transition-colors ${
                        isDarkPage ? 'bg-white' : 'bg-foreground'
                      }`}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action / CTA Button */}
          <div className="hidden sm:flex items-center gap-4">
            <Link
              href="/katalog"
              className={`text-xs font-bold tracking-widest uppercase px-5 py-2.5 rounded-full transition-all flex items-center gap-1.5 shadow-sm active:scale-95 ${
                isDarkPage
                  ? 'bg-white text-black hover:bg-neutral-200'
                  : 'bg-primary text-primary-foreground hover:bg-primary-hover'
              }`}
            >
              <span>TEMUKAN TEH</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className={`lg:hidden p-2 rounded-md transition-colors ${
              isDarkPage
                ? 'text-white hover:bg-white/10'
                : 'text-foreground hover:bg-surface-hover'
            }`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Buka menu navigasi"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </Container>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className={`lg:hidden border-b px-6 py-6 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 ${
            isDarkPage
              ? 'bg-[#15131E] border-white/10 text-white'
              : 'bg-surface border-border text-foreground'
          }`}
        >
          <nav className="flex flex-col space-y-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm font-semibold tracking-wider py-2 border-b ${
                  isDarkPage
                    ? `border-white/10 ${
                        isActive(link.href) ? 'text-white font-bold' : 'text-white/70'
                      }`
                    : `border-border/40 ${
                        isActive(link.href) ? 'text-foreground font-bold' : 'text-muted-foreground'
                      }`
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4">
              <Link
                href="/katalog"
                onClick={() => setMobileMenuOpen(false)}
                className={`w-full text-center block text-xs font-bold tracking-widest uppercase py-3.5 rounded-full ${
                  isDarkPage
                    ? 'bg-white text-black hover:bg-neutral-200'
                    : 'bg-primary text-primary-foreground hover:bg-primary-hover'
                }`}
              >
                TEMUKAN TEH
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
