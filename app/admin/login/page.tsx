'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminLoginSchema, getFirstErrorMessage } from '@/lib/validation/schemas';
import { Lock, Mail, ShieldCheck, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validation = adminLoginSchema.safeParse({ email, password });
    if (!validation.success) {
      setError(getFirstErrorMessage(validation.error));
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Email atau kata sandi tidak sesuai.');
      } else {
        router.push('/admin');
        router.refresh();
      }
    } catch {
      setError('Gagal menghubungi server. Silakan coba kembali.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-md space-y-8 bg-surface p-8 sm:p-10 rounded-xl border border-border shadow-xl">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-sm bg-primary text-primary-foreground flex items-center justify-center font-black tracking-tighter text-lg mx-auto">
            CK
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight text-foreground">
            CHANGKEER CMS
          </h2>
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
            PORTAL MANAJEMEN KONTEN &amp; PRODUK
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-md bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Akses Ditolak</p>
              <p className="mt-0.5">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5"
            >
              EMAIL ADMIN
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@changkeer.com"
                required
                disabled={isLoading}
                className="w-full pl-10 pr-4 py-3 text-xs bg-background border border-border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5"
            >
              KATA SANDI
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                disabled={isLoading}
                className="w-full pl-10 pr-4 py-3 text-xs bg-background border border-border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center gap-2 text-xs font-bold tracking-widest uppercase bg-primary text-primary-foreground py-3.5 rounded-sm hover:bg-primary-hover active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>MASUK KE DASHBOARD</span>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-border text-center space-y-2">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
            <ShieldCheck className="w-3.5 h-3.5 text-accent" />
            <span>Autentikasi Terenkripsi Supabase Auth</span>
          </div>
          <p className="text-[10px] text-muted-foreground/80">
            Pendaftaran publik dinonaktifkan. Akun admin hanya dapat dibuat oleh Super Admin melalui console terverifikasi.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="text-xs text-foreground font-semibold hover:underline"
            >
              ← Kembali ke Beranda Publik
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
