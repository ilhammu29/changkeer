'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
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
    <div className="min-h-screen bg-[#0D0E12] text-white flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Ambient Botanical Glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-7 bg-[#16171F]/90 backdrop-blur-xl p-8 sm:p-10 rounded-3xl border border-white/10 shadow-2xl relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="relative w-14 h-14 rounded-full overflow-hidden border border-white/20 shadow-md mx-auto bg-white p-1">
            <Image
              src="/images/logo_new.png"
              alt="CHANGKEER"
              fill
              className="object-contain p-1"
            />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg sm:text-xl font-black uppercase tracking-[0.2em] text-white">
              CHANGKEER CMS
            </h2>
            <p className="text-[10px] text-white/60 uppercase tracking-[0.22em] font-mono font-semibold">
              ADMINISTRATIVE ATELIER PORTAL
            </p>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-red-300">Akses Ditolak</p>
              <p className="mt-0.5 text-white/80">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-[11px] font-mono font-bold uppercase tracking-wider text-white/70"
            >
              EMAIL ADMINISTRATOR
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@changkeer.com"
                required
                disabled={isLoading}
                className="w-full pl-10 pr-4 py-3 text-xs bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/35 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-[11px] font-mono font-bold uppercase tracking-wider text-white/70"
            >
              KATA SANDI
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                disabled={isLoading}
                className="w-full pl-10 pr-4 py-3 text-xs bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/35 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center gap-2 text-xs font-extrabold tracking-widest uppercase bg-white text-black py-3.5 rounded-xl hover:bg-neutral-200 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer shadow-lg"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>MASUK KE DASHBOARD</span>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-white/10 text-center space-y-2.5">
          <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-white/50 uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
            <span>Supabase Auth · 256-bit AES Encryption</span>
          </div>
          <p className="text-[10px] text-white/40 leading-relaxed font-sans">
            Akses dibatasi hanya untuk personel resmi CHANGKEER.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="text-xs text-white/75 hover:text-white font-semibold transition-colors"
            >
              ← Kembali ke Beranda Publik
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
