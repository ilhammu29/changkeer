'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { adminLoginSchema, getFirstErrorMessage } from '@/lib/validation/schemas';
import {
  Lock,
  Mail,
  ShieldCheck,
  AlertCircle,
  ArrowLeft,
  Eye,
  EyeOff,
} from 'lucide-react';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
        setError(data.error || 'Email atau kata sandi tidak cocok.');
      } else {
        router.push(redirectTarget);
        router.refresh();
      }
    } catch {
      setError('Gagal menghubungi server autentikasi. Silakan coba kembali.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen max-h-screen overflow-hidden w-full flex flex-col lg:flex-row bg-[#08090C] text-white font-sans selection:bg-white selection:text-black">
      {/* ========================================================================= */}
      {/* LEFT HALF: INFORMATION & BOTANICAL ATELIER (SEASON BACKGROUND) */}
      {/* ========================================================================= */}
      <div className="relative w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-14 border-b lg:border-b-0 lg:border-r border-white/10 bg-[#050608] shrink-0 lg:shrink h-1/3 sm:h-2/5 lg:h-full">
        {/* Background Autumn Season Visual */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <Image
            src="/images/seasons/autumn.jpg"
            alt="CHANGKEER Autumn Season"
            fill
            priority
            className="object-cover opacity-25 filter saturate-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050608] via-[#050608]/80 to-[#050608]/90" />
        </div>

        {/* Ambient Warm Botanical Glow */}
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/20 shadow-md bg-white p-0.5 shrink-0">
            <Image
              src="/images/logo_new.png"
              alt="CHANGKEER"
              fill
              className="object-contain p-0.5"
            />
          </div>
          <div>
            <span className="text-xs font-black uppercase tracking-[0.22em] text-white block leading-none">
              CHANGKEER
            </span>
            <span className="text-[9px] text-white/50 uppercase tracking-[0.22em] font-mono mt-0.5 block">
              BOTANICAL ATELIER CMS
            </span>
          </div>
        </div>

        {/* Narrative Manifesto (Simple, Clean, No clutter) */}
        <div className="relative z-10 my-auto py-4 sm:py-6 space-y-2.5 max-w-lg">
          <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-amber-300/90 block">
            PORTAL ADMINISTRATOR
          </span>
          <h1 className="text-xl sm:text-2xl xl:text-3xl font-extrabold uppercase tracking-tight text-white leading-tight">
            Harmoni Seduhan Herbal Nusantara
          </h1>
          <p className="text-xs sm:text-sm text-white/65 leading-relaxed font-normal">
            Pusat kendali terpadu untuk merawat katalog teh racikan 24 musim, menerbitkan jurnal botani, dan mengelola operasional atelier CHANGKEER.
          </p>
        </div>

        {/* Origin Footer */}
        <div className="relative z-10 text-[10px] font-mono text-white/40 uppercase tracking-wider flex items-center justify-between">
          <span>CHANGKEER © 2026</span>
          <span>PUNCAK · GARUT · WONOSOBO</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RIGHT HALF: SIMPLE LOGIN FORM (FULL SCREEN HALF, ZERO CARDBOX, NO OVERFLOW) */}
      {/* ========================================================================= */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-14 bg-[#0A0B0F] relative z-10 flex-1 lg:h-full overflow-y-auto">
        {/* Top Back Nav */}
        <div className="flex items-center justify-between shrink-0">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-white/60 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>KEMBALI KE WEBSITE</span>
          </Link>

          <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 border border-white/10 px-2 py-0.5 rounded-md">
            CMS PORTAL
          </span>
        </div>

        {/* Center Simple Form (Compact, fits perfectly without scrolling) */}
        <div className="my-auto py-4 sm:py-6 space-y-5 max-w-sm w-full mx-auto">
          {/* Header */}
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
              Masuk ke Dashboard
            </h2>
            <p className="text-xs text-white/60 leading-relaxed font-normal">
              Masukkan email dan kata sandi administrator Anda.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-red-300">Autentikasi Gagal</p>
                <p className="text-white/80">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-[10px] font-mono font-bold uppercase tracking-wider text-white/70"
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
                  placeholder="admin@changkeer.id"
                  required
                  autoFocus
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-3 text-xs bg-white/[0.04] border border-white/15 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-white focus:bg-white/[0.06] transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-[10px] font-mono font-bold uppercase tracking-wider text-white/70"
              >
                KATA SANDI
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  disabled={isLoading}
                  className="w-full pl-10 pr-11 py-3 text-xs bg-white/[0.04] border border-white/15 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-white focus:bg-white/[0.06] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer p-1"
                  aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 text-xs font-mono font-extrabold tracking-widest uppercase bg-white text-black py-3.5 rounded-xl hover:bg-neutral-200 active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer shadow-lg mt-1"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>MEMVERIFIKASI...</span>
                </>
              ) : (
                <span>MASUK KE DASHBOARD</span>
              )}
            </button>
          </form>

          {/* Simple default credentials reminder */}
          <div className="pt-1 text-center">
            <span className="text-[10px] font-mono text-white/45">
              Email: <code className="text-white/80">admin@changkeer.id</code> · Sandi: <code className="text-white/80">admin123</code>
            </span>
          </div>
        </div>

        {/* Bottom Security Info */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-white/40 uppercase tracking-wider shrink-0">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span>Supabase Auth · Terenkripsi</span>
          </div>
          <span>Akses Terbatas</span>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#08090C] text-white flex items-center justify-center font-mono text-xs">
          MEMUAT...
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
