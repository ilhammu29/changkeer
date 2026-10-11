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
      className={`sticky top-0 z-50 w-full transition-all duration-300 ease-out ${
        isScrolled
          ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-xs'
          : 'bg-background/80 backdrop-blur-xs border-b border-transparent'
      }`}
    >
      <Container size="wide">
        <div className="flex items-center justify-between h-20">
          {/* Logo on the left */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm bg-primary text-primary-foreground flex items-center justify-center font-black tracking-tighter text-sm transition-transform duration-300 group-hover:scale-105">
              CK
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-[0.2em] uppercase text-foreground leading-none">
                CHANGKEER
              </span>
              <span className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground font-semibold mt-1">
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
                    active
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {link.name}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action / CTA */}
          <div className="hidden sm:flex items-center gap-4">
            <Link
              href="/katalog"
              className="text-xs font-bold tracking-widest uppercase bg-primary text-primary-foreground px-5 py-2.5 rounded-sm hover:bg-primary-hover transition-all flex items-center gap-1.5"
            >
              <span>TEMUKAN TEH</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="lg:hidden p-2 text-foreground hover:bg-surface-hover rounded-sm transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Buka menu navigasi"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </Container>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface border-b border-border px-6 py-6 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm font-semibold tracking-wider py-2 border-b border-border/40 ${
                  isActive(link.href) ? 'text-foreground font-bold' : 'text-muted-foreground'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4">
              <Link
                href="/katalog"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center block text-xs font-bold tracking-widest uppercase bg-primary text-primary-foreground py-3.5 rounded-sm"
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
