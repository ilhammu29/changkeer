'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

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
      } z-40 w-full transition-all duration-300 ease-out ${
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
          {/* Official CHANGKEER Circular Logo & Brand */}
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border border-white/20 shadow-xs shrink-0 group-hover:scale-105 transition-transform duration-300">
              <Image
                src="/images/logo_changkeer.jpg"
                alt="Logo CHANGKEER"
                fill
                priority
                className="rounded-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span
                className={`font-black text-xs sm:text-sm tracking-[0.18em] uppercase leading-none transition-colors ${
                  isDarkPage ? 'text-white' : 'text-foreground'
                }`}
              >
                CHANGKEER
              </span>
              <span
                className={`text-[8px] sm:text-[9px] tracking-[0.24em] uppercase font-semibold mt-0.5 transition-colors ${
                  isDarkPage ? 'text-white/70' : 'text-muted-foreground'
                }`}
              >
                HERBAL CRAFT
              </span>
            </div>
          </Link>

          {/* Minimalist Horizontal Navigation (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-7">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[11px] font-semibold tracking-[0.18em] uppercase transition-colors py-2 relative ${
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
              className={`text-[11px] font-bold tracking-[0.16em] uppercase px-4 py-2 rounded-full transition-all flex items-center gap-1.5 shadow-xs active:scale-95 ${
                isDarkPage
                  ? 'bg-white text-black hover:bg-neutral-200'
                  : 'bg-primary text-primary-foreground hover:bg-primary-hover'
              }`}
            >
              <span>TEMUKAN TEH</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className={`lg:hidden p-2 rounded-full transition-colors ${
              isDarkPage
                ? 'text-white hover:bg-white/10'
                : 'text-foreground hover:bg-surface-hover'
            }`}
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Buka menu navigasi"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </Container>

      {/* Slide-over Sidebar Drawer & Backdrop */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Offcanvas Drawer */}
          <aside
            className="fixed top-0 right-0 bottom-0 w-72 sm:w-80 max-w-[85vw] bg-[#111019] text-white p-6 shadow-2xl flex flex-col justify-between border-l border-white/10 animate-in slide-in-from-right duration-300 z-50"
            aria-label="Sidebar Navigasi"
          >
            <div>
              {/* Sidebar Header with Circular Logo and Close Button */}
              <div className="flex items-center justify-between pb-5 border-b border-white/10">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5"
                >
                  <div className="relative w-7 h-7 rounded-full overflow-hidden border border-white/20 shadow-xs shrink-0">
                    <Image
                      src="/images/logo_changkeer.jpg"
                      alt="CHANGKEER"
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-extrabold text-xs tracking-[0.18em] uppercase text-white">
                      CHANGKEER
                    </span>
                    <span className="text-[8px] tracking-[0.2em] uppercase text-white/60">
                      HERBAL CRAFT
                    </span>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
                  aria-label="Tutup menu navigasi"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sidebar Navigation Links with Compact & Refined Typography */}
              <nav className="mt-5 flex flex-col space-y-1">
                {NAV_LINKS.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`text-xs font-medium tracking-[0.18em] uppercase py-2.5 px-2 rounded-sm flex items-center justify-between transition-colors border-b border-white/5 ${
                        active
                          ? 'text-white font-bold bg-white/5'
                          : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span>{link.name}</span>
                      {active && (
                        <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Sidebar Bottom Action */}
            <div className="pt-4">
              <Link
                href="/katalog"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center block text-[11px] font-bold tracking-[0.18em] uppercase py-2.5 rounded-full bg-white text-black hover:bg-neutral-200 transition-colors shadow-sm"
              >
                TEMUKAN TEH
              </Link>
            </div>
          </aside>
        </div>
      )}
    </header>
  );
}
