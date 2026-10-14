'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Flame,
  Ticket,
  UtensilsCrossed,
  Package,
  Layers,
  FileText,
  FileEdit,
  Image as ImageIcon,
  MessageSquare,
  Settings,
  ExternalLink,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
} from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: any;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const ADMIN_NAV_SECTIONS: NavSection[] = [
  {
    title: 'OPERASIONAL',
    items: [
      { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      { name: 'Pesanan Cafe', href: '/admin/orders', icon: ShoppingBag },
      { name: 'KDS Barista', href: '/admin/kds', icon: Flame },
    ],
  },
  {
    title: 'KATALOG & CAFE',
    items: [
      { name: 'Produk Herbal', href: '/admin/products', icon: Package },
      { name: 'Kategori', href: '/admin/categories', icon: Layers },
      { name: 'Meja Cafe & QR', href: '/admin/tables', icon: UtensilsCrossed },
      { name: 'Voucher Promo', href: '/admin/vouchers', icon: Ticket },
    ],
  },
  {
    title: 'KONTEN & SISTEM',
    items: [
      { name: 'Artikel & Berita', href: '/admin/articles', icon: FileText },
      { name: 'Konten Halaman', href: '/admin/pages', icon: FileEdit },
      { name: 'Media Library', href: '/admin/media', icon: ImageIcon },
      { name: 'Pesan Masuk', href: '/admin/messages', icon: MessageSquare },
      { name: 'Pengaturan', href: '/admin/settings', icon: Settings },
    ],
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(pathname !== '/admin/login');
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (pathname === '/admin/login') {
      setCheckingAuth(false);
      return;
    }

    async function checkAuth() {
      try {
        const res = await fetch('/api/admin/auth/session');
        const data = await res.json();
        if (!data.authenticated) {
          router.push(`/admin/login?redirect=${encodeURIComponent(pathname)}`);
        } else {
          setCheckingAuth(false);
        }
      } catch {
        router.push('/admin/login');
      }
    }

    checkAuth();
  }, [pathname, router]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // If on login page, don't show admin shell
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground font-sans">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono">
            MEMERIKSA SESI ADMINISTRATOR...
          </p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    router.push('/admin/login');
  };

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <div className="h-screen max-h-screen bg-neutral-50 flex flex-col md:flex-row font-sans text-foreground overflow-hidden">
      {/* ========================================================================= */}
      {/* DESKTOP SIDEBAR (EXPANDABLE & COLLAPSIBLE TO ICON MODE, FIXED VIEWPORT HEIGHT) */}
      {/* ========================================================================= */}
      <aside
        className={`hidden md:flex flex-col justify-between shrink-0 bg-white border-r border-border/80 transition-all duration-300 ease-in-out z-30 h-full max-h-full overflow-hidden ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="flex flex-col flex-1 min-h-0">
          {/* Header */}
          <div
            className={`h-16 shrink-0 border-b border-border/70 flex items-center transition-all ${
              collapsed ? 'justify-center px-2' : 'justify-between px-5'
            }`}
          >
            {collapsed ? (
              <button
                type="button"
                onClick={() => setCollapsed(false)}
                className="relative w-10 h-10 rounded-xl hover:bg-neutral-100 flex items-center justify-center transition-all group cursor-pointer"
                title="Perlebar Sidebar (Klik untuk membuka)"
                aria-label="Expand sidebar"
              >
                <div className="relative w-7 h-7 rounded-full overflow-hidden border border-border shadow-xs group-hover:scale-105 transition-transform bg-white">
                  <Image
                    src="/images/logo_new.png"
                    alt="CHANGKEER"
                    fill
                    className="object-contain p-0.5"
                  />
                </div>
                <div className="absolute inset-0 bg-neutral-900/80 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <PanelLeftOpen className="w-4 h-4" />
                </div>
              </button>
            ) : (
              <>
                <Link
                  href="/admin"
                  className="flex items-center gap-2.5 overflow-hidden group"
                  title="CHANGKEER CMS"
                >
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border border-border shadow-xs shrink-0 bg-white group-hover:scale-105 transition-transform">
                    <Image
                      src="/images/logo_new.png"
                      alt="CHANGKEER"
                      fill
                      className="object-contain p-0.5"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-extrabold text-xs tracking-widest uppercase text-foreground leading-none">
                      CHANGKEER
                    </span>
                    <span className="text-[9px] font-mono font-bold tracking-widest text-primary uppercase mt-0.5">
                      CMS PORTAL
                    </span>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={() => setCollapsed(true)}
                  className="w-7 h-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-neutral-100 flex items-center justify-center transition-colors cursor-pointer"
                  title="Perkecil Sidebar"
                  aria-label="Collapse sidebar"
                >
                  <PanelLeftClose className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          {/* Navigation Items (Organized by Section, Compact & No scrollbar in icon mode) */}
          <nav
            className={`flex-1 min-h-0 ${
              collapsed
                ? 'overflow-hidden flex flex-col items-center justify-start space-y-0.5 p-2 pt-2'
                : 'overflow-y-auto space-y-3 p-3 scrollbar-none'
            }`}
          >
            {ADMIN_NAV_SECTIONS.map((section, sIdx) => (
              <div key={section.title || sIdx} className="space-y-0.5">
                {!collapsed && (
                  <div className="text-[9px] font-mono font-bold uppercase tracking-wider text-muted-foreground/60 px-3 pt-1 pb-0.5">
                    {section.title}
                  </div>
                )}
                {section.items.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={collapsed ? item.name : undefined}
                      className={`flex items-center rounded-xl text-xs font-semibold tracking-wide transition-all group ${
                        collapsed
                          ? 'justify-center w-9 h-9 shrink-0'
                          : 'gap-2.5 px-3 py-1.5 w-full'
                      } ${
                        active
                          ? 'bg-neutral-900 text-white font-bold shadow-xs'
                          : 'text-muted-foreground hover:bg-neutral-100 hover:text-foreground'
                      }`}
                    >
                      <Icon
                        className={`shrink-0 transition-transform ${
                          collapsed ? 'w-4 h-4 group-hover:scale-110' : 'w-4 h-4'
                        }`}
                      />
                      {!collapsed && <span className="truncate text-xs">{item.name}</span>}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Footer Sidebar Actions (Docked at bottom, compact in icon mode) */}
        <div
          className={`shrink-0 border-t border-border/70 bg-white ${
            collapsed
              ? 'p-2 flex flex-col items-center space-y-1'
              : 'p-3 space-y-1.5'
          }`}
        >
          <Link
            href="/"
            target="_blank"
            title={collapsed ? 'Lihat Website Publik' : undefined}
            className={`flex items-center rounded-xl text-xs font-semibold text-muted-foreground hover:bg-neutral-100 hover:text-foreground transition-colors ${
              collapsed
                ? 'justify-center w-10 h-10 shrink-0'
                : 'justify-between px-3.5 py-2.5'
            }`}
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 shrink-0" />
              {!collapsed && <span>Lihat Website</span>}
            </span>
            {!collapsed && (
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded-md bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                Live
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            title={collapsed ? 'Keluar (Logout)' : undefined}
            className={`flex items-center rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer ${
              collapsed
                ? 'justify-center w-10 h-10 shrink-0'
                : 'w-full gap-2 px-3.5 py-2.5'
            }`}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Keluar (Logout)</span>}
          </button>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* MAIN CONTENT AREA & RESPONSIVE HEADER (SCROLLS INDEPENDENTLY) */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 h-full max-h-full overflow-y-auto">
        <header className="h-16 shrink-0 bg-white border-b border-border/80 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Drawer Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-lg text-foreground hover:bg-neutral-100 transition-colors"
              aria-label="Open Admin Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Desktop Quick Toggle when collapsed */}
            {collapsed && (
              <button
                type="button"
                onClick={() => setCollapsed(false)}
                className="hidden md:inline-flex items-center gap-1.5 text-xs font-mono font-bold text-muted-foreground hover:text-foreground px-2.5 py-1.5 rounded-lg border border-border/60 hover:bg-neutral-100 transition-colors cursor-pointer"
                title="Perlebar Sidebar"
              >
                <PanelLeftOpen className="w-4 h-4 text-primary" />
                <span>EXPAND SIDEBAR</span>
              </button>
            )}

            <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
              PANEL ADMINISTRATOR · CHANGKEER CMS
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-foreground hidden sm:inline">
                Admin Aktif
              </span>
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer Backdrop */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />
            <aside className="fixed top-0 bottom-0 left-0 w-72 bg-white p-6 shadow-2xl flex flex-col justify-between border-r border-border animate-in slide-in-from-left duration-200 h-screen max-h-screen overflow-hidden">
              <div className="space-y-6 flex flex-col flex-1 min-h-0">
                <div className="flex items-center justify-between border-b border-border/70 pb-4 shrink-0">
                  <div className="flex items-center gap-2.5">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border border-border shrink-0 bg-white">
                      <Image
                        src="/images/logo_new.png"
                        alt="CHANGKEER"
                        fill
                        className="object-contain p-0.5"
                      />
                    </div>
                    <div>
                      <span className="font-extrabold text-xs tracking-widest uppercase text-foreground block">
                        CHANGKEER
                      </span>
                      <span className="text-[9px] font-mono font-bold text-primary uppercase">
                        CMS PORTAL
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-neutral-100 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-3 flex-1 min-h-0 overflow-y-auto pr-1">
                  {ADMIN_NAV_SECTIONS.map((section, sIdx) => (
                    <div key={section.title || sIdx} className="space-y-1">
                      <div className="text-[9px] font-mono font-bold uppercase tracking-wider text-muted-foreground/60 px-3 pt-1 pb-0.5">
                        {section.title}
                      </div>
                      {section.items.map((item) => {
                        const active = isActive(item.href);
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-colors ${
                              active
                                ? 'bg-neutral-900 text-white font-bold'
                                : 'text-muted-foreground hover:bg-neutral-100 hover:text-foreground'
                            }`}
                          >
                            <Icon className="w-4 h-4 shrink-0" />
                            <span>{item.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  ))}
                </nav>
              </div>

              <div className="pt-4 border-t border-border/70 space-y-2">
                <Link
                  href="/"
                  target="_blank"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:bg-neutral-100 hover:text-foreground"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Lihat Website</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar (Logout)</span>
                </button>
              </div>
            </aside>
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

