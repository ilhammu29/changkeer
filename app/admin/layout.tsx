'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Layers,
  FileText,
  FileEdit,
  Image as ImageIcon,
  MessageSquare,
  Settings,
  ExternalLink,
  LogOut,
} from 'lucide-react';

const ADMIN_NAV = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Produk', href: '/admin/products', icon: Package },
  { name: 'Kategori', href: '/admin/categories', icon: Layers },
  { name: 'Artikel & Berita', href: '/admin/articles', icon: FileText },
  { name: 'Konten Halaman', href: '/admin/pages', icon: FileEdit },
  { name: 'Media Library', href: '/admin/media', icon: ImageIcon },
  { name: 'Pesan Masuk', href: '/admin/messages', icon: MessageSquare },
  { name: 'Pengaturan', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = React.useState(pathname !== '/admin/login');

  React.useEffect(() => {
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

  // If on login page, don't show admin shell
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
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
    <div className="min-h-screen bg-muted/30 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-surface border-r border-border flex flex-col justify-between shrink-0">
        <div>
          {/* Header */}
          <div className="h-16 border-b border-border flex items-center justify-between px-6">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-sm bg-primary text-primary-foreground flex items-center justify-center font-black text-xs">
                CK
              </div>
              <div>
                <span className="font-black text-sm tracking-widest uppercase text-foreground">
                  CHANGKEER
                </span>
                <span className="block text-[9px] font-bold tracking-widest text-accent uppercase">
                  CMS PORTAL
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {ADMIN_NAV.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-sm text-xs font-semibold tracking-wide transition-colors ${
                    active
                      ? 'bg-primary text-primary-foreground font-bold shadow-sm'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Sidebar Actions */}
        <div className="p-4 border-t border-border space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-sm text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Lihat Website</span>
            </span>
            <span className="text-[10px] uppercase font-mono">Live</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-sm text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-6 sm:px-8">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              PANEL ADMINISTRATOR
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-semibold text-foreground">Admin Aktif</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
