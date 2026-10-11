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
  Sparkles,
  Leaf,
  CheckCircle2,
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
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#08090C] text-white font-sans selection:bg-white selection:text-black">
      {/* ========================================================================= */}
      {/* LEFT SECTION: INFORMATION & BRAND ATELIER (FULL SCREEN HALF) */}
      {/* ========================================================================= */}
      <div className="relative w-full lg:w-[52%] xl:w-[55%] flex flex-col justify-between p-8 sm:p-12 lg:p-16 xl:p-20 border-b lg:border-b-0 lg:border-r border-white/10 bg-[#060709] overflow-hidden min-h-[460px] lg:min-h-screen">
        {/* Background Editorial Visual with Subtle Botanical Overlay */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <Image
            src="/images/seasons/spring.jpg"
            alt="CHANGKEER Botanical Background"
            fill
            priority
            className="object-cover opacity-20 scale-105 filter saturate-50 blur-[1px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060709] via-[#060709]/80 to-[#060709]/90" />
          <div className="absolute inset-0 bg-radial from-transparent via-[#060709]/60 to-[#060709]" />
        </div>

        {/* Ambient Botanical Glows */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Branding */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border border-white/20 shadow-lg bg-white p-1 shrink-0">
              <Image
                src="/images/logo_new.png"
                alt="CHANGKEER"
                fill
                className="object-contain p-1"
              />
            </div>
            <div>
              <span className="text-sm font-black uppercase tracking-[0.22em] text-white block leading-none">
                CHANGKEER
              </span>
              <span className="text-[10px] text-white/50 uppercase tracking-[0.25em] font-mono font-semibold mt-1 block">
                BOTANICAL ATELIER CMS
              </span>
            </div>
          </div>

          <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono uppercase tracking-wider text-white/70">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>SISTEM TERPROTEKSI</span>
          </div>
        </div>

        {/* Center Editorial Manifesto & Features */}
        <div className="relative z-10 my-auto py-12 lg:py-16 space-y-8 max-w-xl">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest uppercase text-emerald-400/90">
              <Leaf className="w-3.5 h-3.5" />
              <span>ATELIER OPERATIONS & CURATION PORTAL</span>
            </div>
            <h1 className="text-2xl sm:text-3xl xl:text-4xl font-extrabold uppercase tracking-tight text-white leading-[1.15]">
              Harmoni Racikan Botani & Tata Kelola Terpadu
            </h1>
            <p className="text-xs sm:text-sm text-white/65 leading-relaxed font-normal pt-1">
              Portal kendali sentral untuk merawat katalog teh herbal Nusantara, menerbitkan jurnal botani, mengelola inventaris media, dan memantau pesan kemitraan dalam satu ekosistem atelier.
            </p>
          </div>

          {/* 3 Value Pillars */}
          <div className="space-y-3.5 pt-2">
            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-sm">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5 text-emerald-400">
                <Leaf className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h2 className="text-xs font-bold uppercase tracking-wide text-white">
                  Katalog Botani Dinamis
                </h2>
                <p className="text-[11px] text-white/55 leading-relaxed">
                  Pembaruan instan racikan 4 musim, harga, panduan seduh, dan botanical add-ons tanpa hambatan.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-sm">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0 mt-0.5 text-purple-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h2 className="text-xs font-bold uppercase tracking-wide text-white">
                  Autentikasi Aman & Enkripsi
                </h2>
                <p className="text-[11px] text-white/55 leading-relaxed">
                  Didukung Supabase Auth dengan otorisasi berbasis peran (RBAC) dan penguncian sesi aman.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-sm">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 mt-0.5 text-amber-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h2 className="text-xs font-bold uppercase tracking-wide text-white">
                  Sinkronisasi Real-Time
                </h2>
                <p className="text-[11px] text-white/55 leading-relaxed">
                  Revalidasi jalur otomatis memastikan setiap perubahan konten langsung tersaji di website publik.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Origin Tag */}
        <div className="relative z-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] font-mono text-white/40 uppercase tracking-wider">
          <span>CHANGKEER BOTANICAL ATELIER © 2026</span>
          <span>PUNCAK · GARUT · WONOSOBO</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RIGHT SECTION: FULL-SCREEN LOGIN FORM (NO CARDBOX) */}
      {/* ========================================================================= */}
      <div className="w-full lg:w-[48%] xl:w-[45%] flex flex-col justify-between p-8 sm:p-12 lg:p-16 xl:p-20 bg-[#0B0C10] relative z-10 min-h-[500px]">
        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-white/60 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>KEMBALI KE WEBSITE</span>
          </Link>

          <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 border border-white/10 px-2.5 py-1 rounded-md">
            PORTAL CMS
          </span>
        </div>

        {/* Center Form Container */}
        <div className="my-auto py-10 space-y-8 max-w-md w-full mx-auto">
          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
              Masuk ke Dashboard
            </h2>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed font-normal">
              Masukkan email dan kata sandi administrator Anda untuk mengakses panel kendali CHANGKEER.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 text-xs flex items-start gap-3 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-bold text-red-300">Autentikasi Gagal</p>
                <p className="text-white/80">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
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
                  placeholder="admin@changkeer.id"
                  required
                  autoFocus
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-3.5 text-xs bg-white/[0.04] border border-white/15 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-white focus:bg-white/[0.06] transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-[11px] font-mono font-bold uppercase tracking-wider text-white/70"
                >
                  KATA SANDI
                </label>
              </div>
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
                  className="w-full pl-10 pr-11 py-3.5 text-xs bg-white/[0.04] border border-white/15 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-white focus:bg-white/[0.06] transition-all"
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
              className="w-full inline-flex items-center justify-center gap-2 text-xs font-mono font-extrabold tracking-widest uppercase bg-white text-black py-4 rounded-xl hover:bg-neutral-200 active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer shadow-xl mt-2"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>MEMVERIFIKASI KREDENSIAL...</span>
                </>
              ) : (
                <span>MASUK KE DASHBOARD CMS</span>
              )}
            </button>
          </form>

          {/* Quick Notice */}
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-white/50 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-white/70">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Kredensial Default Terkonfirmasi</span>
            </div>
            <p className="font-mono text-[10px] text-white/60">
              Email: <code className="text-white">admin@changkeer.id</code> · Sandi: <code className="text-white">admin123</code>
            </p>
          </div>
        </div>

        {/* Bottom Security Info */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[10px] font-mono text-white/40 uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span>Supabase Auth · 256-Bit TLS Encryption</span>
          </div>
          <span>Akses Terbatas Administrator</span>
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
          MEMUAT PORTAL ADMINISTRATOR...
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
