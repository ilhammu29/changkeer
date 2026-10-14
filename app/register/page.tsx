'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Lock, User, Phone, ArrowRight, AlertCircle, Eye, EyeOff, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';

function CustomerRegisterForm() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const completeRegister = (profile: any) => {
    try {
      document.cookie = `changkeer_customer_session=${encodeURIComponent(
        JSON.stringify(profile)
      )}; path=/; max-age=604800; SameSite=Lax`;
      localStorage.setItem('changkeer_customer_session', JSON.stringify(profile));
    } catch (e) {
      console.warn('Cookie/localStorage set warning:', e);
    }
    window.location.href = '/account';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    if (password.length < 6) {
      setError('Kata sandi minimal 6 karakter.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/customer/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName.trim(),
          email: email.trim(),
          phone_number: phone.trim(),
          password,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Gagal membuat akun.');
        setLoading(false);
      } else {
        completeRegister(data.profile);
      }
    } catch {
      setError('Gagal menghubungi server pendaftaran.');
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/customer/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'pengguna.baru@gmail.com',
          full_name: 'Penikmat Teh Baru',
          isGoogleDemo: true,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Gagal daftar dengan Google.');
        setLoading(false);
      } else {
        completeRegister(data.profile);
      }
    } catch {
      setError('Terjadi kendala autentikasi Google.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen lg:h-screen lg:max-h-screen w-full bg-white text-neutral-900 font-sans overflow-y-auto lg:overflow-hidden flex flex-col lg:flex-row select-none">
      
      {/* ========================================================================= */}
      {/* SISI KIRI: INFORMASI SIMPLE & ELEGAN (DESKTOP ONLY) */}
      {/* ========================================================================= */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-5/12 bg-[#F9F8F5] border-r border-neutral-200/80 p-10 lg:p-12 xl:p-14 flex-col justify-between shrink-0 h-full">
        
        {/* Top: Back Link & Logo */}
        <div className="space-y-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-600 hover:text-neutral-900 transition-colors py-1.5 px-3 rounded-full hover:bg-black/5 w-fit"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Beranda</span>
          </Link>

          <div className="flex items-center gap-3 pt-2">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-neutral-200 bg-white p-1 shadow-xs shrink-0">
              <Image src="/images/logo_new.png" alt="CHANGKEER" fill className="object-contain" priority />
            </div>
            <div>
              <span className="font-black text-sm tracking-[0.2em] uppercase text-neutral-900 block leading-tight font-sans">
                CHANGKEER
              </span>
              <span className="text-[10px] font-sans tracking-wider uppercase text-neutral-500 font-semibold">
                Botanical Atelier
              </span>
            </div>
          </div>
        </div>

        {/* Middle: Brand Narrative & Key Highlights */}
        <div className="my-auto py-6 lg:py-0 space-y-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 text-white text-[10px] font-sans font-bold tracking-[0.2em] uppercase">
            <Sparkles className="w-3 h-3" />
            <span>EXCLUSIVE MEMBER BENEFITS</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-neutral-900 leading-tight font-sans">
            Mulai Perjalanan <br className="hidden sm:inline" />
            <span className="text-neutral-500">Seduhan Anda.</span>
          </h2>

          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-md font-normal font-sans">
            Daftarkan diri Anda untuk menikmati voucher potongan harga perdana, kemudahan pesan via meja cafe, dan pengumpulan poin loyalitas di Changkeer.
          </p>

          <div className="space-y-2.5 pt-2">
            <div className="flex items-center gap-2.5 text-xs text-neutral-700 font-medium font-sans">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Voucher Diskon Perdana Khusus Member Baru</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-neutral-700 font-medium font-sans">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Simpan Riwayat Racikan &amp; Customization Favorit</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-neutral-700 font-medium font-sans">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Pelacakan Status Pesanan Cafe Real-Time</span>
            </div>
          </div>
        </div>

        {/* Bottom: Minimalist note */}
        <div className="pt-4 border-t border-neutral-200/60">
          <p className="text-[10px] font-sans text-neutral-400 tracking-widest uppercase font-semibold">
            ATELIER BREW BAR JAKARTA &bull; OPEN DAILY 08:00 - 22:00
          </p>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SISI KANAN: FORM REGISTRASI (BACKGROUND PUTIH, PAS LAYOUT) */}
      {/* ========================================================================= */}
      <div className="w-full lg:w-7/12 xl:w-7/12 bg-white px-5 py-8 sm:p-10 lg:p-12 xl:p-16 flex flex-col justify-center items-center min-h-screen lg:h-full overflow-y-auto lg:overflow-hidden">
        <div className="w-full max-w-sm sm:max-w-md mx-auto space-y-4">
          
          {/* Mobile-only Header: Back link & Logo */}
          <div className="lg:hidden flex items-center justify-between pb-3 border-b border-neutral-100">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali</span>
            </Link>
            <div className="flex items-center gap-2">
              <div className="relative w-6 h-6 rounded-full overflow-hidden border border-neutral-200 bg-white">
                <Image src="/images/logo_new.png" alt="CHANGKEER" fill className="object-contain" priority />
              </div>
              <span className="font-black text-xs tracking-wider uppercase text-neutral-900 font-sans">CHANGKEER</span>
            </div>
          </div>

          {/* Header */}
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-neutral-500 block mb-1">
              REGISTRASI PELANGGAN
            </span>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-900 font-sans">
              Daftar Akun Baru
            </h1>
            <p className="text-xs text-neutral-500 mt-1 font-normal">
              Lengkapi data singkat berikut untuk bergabung menjadi member.
            </p>
          </div>

          {/* Error Notice */}
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* Google Quick Sign Up */}
          <button
            type="button"
            onClick={handleGoogleRegister}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-800 text-xs font-semibold flex items-center justify-center gap-3 transition-colors shadow-xs cursor-pointer active:scale-98"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Daftar Cepat dengan Google</span>
          </button>

          {/* Divider */}
          <div className="relative my-2.5 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200" />
            </div>
            <span className="relative bg-white px-3 text-[10px] text-neutral-400 uppercase tracking-widest font-mono">
              atau isi data diri
            </span>
          </div>

          {/* Compact Form */}
          <form onSubmit={handleSubmit} className="space-y-3 text-xs font-sans">
            <div>
              <label className="block text-neutral-700 font-semibold mb-1 uppercase tracking-wider text-[11px]">
                Nama Lengkap *
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  required
                  placeholder="Contoh: Dewi Lestari"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full bg-[#FAFAF8] border border-neutral-200 rounded-xl pl-10 pr-3.5 py-2.5 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:bg-white focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 font-sans transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-neutral-700 font-semibold mb-1 uppercase tracking-wider text-[11px]">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="email"
                    required
                    placeholder="nama@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-[#FAFAF8] border border-neutral-200 rounded-xl pl-10 pr-3 py-2.5 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:bg-white focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 font-sans transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1 uppercase tracking-wider text-[11px]">
                  No. Telepon / WA *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="tel"
                    required
                    placeholder="08123456789"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-[#FAFAF8] border border-neutral-200 rounded-xl pl-10 pr-3 py-2.5 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:bg-white focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 font-sans transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-neutral-700 font-semibold mb-1 uppercase tracking-wider text-[11px]">
                  Kata Sandi *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Min 6 karakter"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-[#FAFAF8] border border-neutral-200 rounded-xl pl-10 pr-9 py-2.5 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:bg-white focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 font-sans transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer"
                    aria-label={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1 uppercase tracking-wider text-[11px]">
                  Ulangi Sandi *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="Konfirmasi"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full bg-[#FAFAF8] border border-neutral-200 rounded-xl pl-10 pr-9 py-2.5 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:bg-white focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 font-sans transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer"
                    aria-label={showConfirmPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#111113] hover:bg-neutral-800 text-white font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer mt-2 active:scale-98"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Buat Akun Sekarang</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Switch to Login */}
          <div className="text-center text-xs text-neutral-500 pt-1">
            Sudah memiliki akun Changkeer?{' '}
            <Link href="/login" className="text-neutral-900 font-bold hover:underline">
              Masuk di Sini
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="h-screen w-full bg-white" />}>
      <CustomerRegisterForm />
    </Suspense>
  );
}
