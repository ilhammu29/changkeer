'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';

const NAV_LINKS = [
  { name: 'HOME', href: '/' },
  { name: 'ABOUT PRODUCT', href: '/tentang-produk' },
  { name: 'BLENDS & PRICES', href: '/katalog' },
  { name: 'ABOUT CHANGKEER', href: '/tentang-kami' },
  { name: 'NEWS', href: '/media-berita' },
  { name: 'CONTACT US', href: '/hubungi-kami' },
];

export function Navbar() {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Prevent body scroll when sidebar drawer is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  // Auto-close mobile sidebar when window is resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
      } z-40 w-full transition-all duration-300 ease-out font-sans ${
        isDarkPage
          ? isScrolled
            ? 'bg-[#111216]/90 backdrop-blur-md border-b border-white/10 shadow-xl text-white'
            : 'bg-transparent border-b border-transparent text-white'
          : isScrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-border shadow-xs text-foreground'
          : 'bg-white/90 backdrop-blur-xs border-b border-transparent text-foreground'
      }`}
    >
      <Container size="wide">
        <div className="flex items-center justify-between h-20">
          {/* Official CHANGKEER Logo & Brand */}
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-white/20 shadow-xs shrink-0 bg-white group-hover:scale-105 transition-transform duration-300">
              <Image
                src="/images/logo_new.png"
                alt="CHANGKEER Logo"
                fill
                priority
                className="object-contain p-0.5"
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
          <nav className="hidden lg:flex items-center space-x-5 xl:space-x-7">
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

          {/* Right Action: CTA & Mobile Sidebar Toggle */}
          <div className="flex items-center gap-3">
            <Link
              href="/katalog"
              className={`hidden sm:inline-flex text-[11px] font-bold tracking-[0.16em] uppercase px-4 py-2 rounded-full transition-all items-center gap-1.5 shadow-xs active:scale-95 ${
                isDarkPage
                  ? 'bg-white text-black hover:bg-neutral-200'
                  : 'bg-primary text-primary-foreground hover:bg-primary-hover'
              }`}
            >
              <span>EXPLORE BLENDS</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>

            {/* Mobile / Tablet Hamburger Menu Toggle (Hidden on Desktop) */}
            <button
              type="button"
              className={`lg:hidden inline-flex items-center gap-2 px-3.5 py-2 rounded-full border transition-all cursor-pointer ${
                isDarkPage
                  ? 'border-white/20 text-white hover:bg-white/10 active:scale-95'
                  : 'border-border/80 text-foreground hover:bg-neutral-100 active:scale-95'
              }`}
              onClick={() => setSidebarOpen(true)}
              aria-label="Open Mobile Menu"
            >
              <Menu className="w-4 h-4" />
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase">
                MENU
              </span>
            </button>
          </div>
        </div>
      </Container>

      {/* Slide-over Sidebar Drawer & Backdrop (Mobile & Tablet Only) */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />

          {/* Offcanvas Sidebar Drawer */}
          <aside
            className="fixed top-0 right-0 bottom-0 w-80 sm:w-96 max-w-[88vw] bg-[#111019] text-white p-7 sm:p-8 shadow-2xl flex flex-col justify-between border-l border-white/10 animate-in slide-in-from-right duration-300 z-50 font-sans"
            aria-label="Sidebar Navigation Menu"
          >
            <div>
              {/* Sidebar Header with Circular Logo and Close Button */}
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <Link
                  href="/"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3"
                >
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/20 shadow-xs shrink-0 bg-white">
                    <Image
                      src="/images/logo_new.png"
                      alt="CHANGKEER"
                      fill
                      className="object-contain p-0.5"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-extrabold text-xs tracking-[0.18em] uppercase text-white">
                      CHANGKEER
                    </span>
                    <span className="text-[8px] tracking-[0.2em] uppercase text-white/60">
                      HERBAL CRAFT &bull; JAKARTA
                    </span>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Brand Micro Narrative */}
              <div className="pt-4 pb-2 text-[11px] text-white/60 leading-relaxed font-sans">
                Real loose-leaf blends following the 24 solar terms. Freshly brewed &amp; ready in under 3 minutes.
              </div>

              {/* Sidebar Navigation Links */}
              <nav className="mt-4 flex flex-col space-y-1.5">
                {NAV_LINKS.map((link, idx) => {
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`text-xs font-bold tracking-[0.18em] uppercase py-3 px-3.5 rounded-xl flex items-center justify-between transition-all group ${
                        active
                          ? 'text-white bg-white/10 shadow-xs'
                          : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <span className="text-[10px] font-mono text-white/40 group-hover:text-primary transition-colors">
                          0{idx + 1}
                        </span>
                        <span>{link.name}</span>
                      </span>
                      {active ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      ) : (
                        <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition-opacity" />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Sidebar Bottom Action & Info */}
            <div className="pt-6 border-t border-white/10 space-y-3">
              <Link
                href="/katalog"
                onClick={() => setSidebarOpen(false)}
                className="w-full text-center block text-[11px] font-bold tracking-[0.18em] uppercase py-3 rounded-xl bg-white text-black hover:bg-neutral-200 transition-colors shadow-sm"
              >
                EXPLORE BLENDS &amp; PRICES
              </Link>
              <div className="text-[10px] font-mono text-white/50 text-center uppercase tracking-wider">
                Unsweetened by default &bull; Plastic-free
              </div>
            </div>
          </aside>
        </div>
      )}
    </header>
  );
}
