'use client';

import React, { useState } from 'react';
import { contactFormSchema, ContactFormData, getFieldErrors } from '@/lib/validation/schemas';
import { CheckCircle2, AlertCircle, Send, Sparkles } from 'lucide-react';

const SUBJECT_PRESETS = [
  'Konsultasi Racikan Teh',
  'Peluang Kemitraan Kafe',
  'Pesanan Khusus / Hampers',
  'Pertanyaan Bahan & Kualitas',
];

export function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSelectPreset = (preset: string) => {
    setFormData((prev) => ({ ...prev, subject: preset }));
    if (errors.subject) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.subject;
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setSuccessMessage(null);

    // Client-side Zod validation
    const validation = contactFormSchema.safeParse(formData);
    if (!validation.success) {
      setErrors(getFieldErrors(validation.error));
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setServerError(data.error || 'Gagal mengirim pesan. Silakan coba lagi.');
      } else {
        setSuccessMessage(data.message);
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
      }
    } catch {
      setServerError('Terjadi gangguan jaringan. Silakan coba sesaat lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border border-border/80 rounded-3xl p-7 sm:p-10 lg:p-12 shadow-sm card-boundary">
      <div className="mb-8 space-y-2">
        <div className="flex items-center gap-2 text-primary text-[11px] font-mono tracking-widest uppercase font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>KORESPONDENSI RESMI</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-serif font-bold uppercase tracking-tight text-foreground">
          Kirimkan Pesan Anda
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Tuliskan kebutuhan atau pertanyaan Anda. Tim kurator CHANGKEER akan meninjau dan membalas dalam kurun waktu 1x24 jam kerja.
        </p>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 rounded-xl bg-primary/10 border border-primary/20 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="text-xs">
            <h5 className="font-bold text-foreground">Pesan Berhasil Terkirim</h5>
            <p className="text-muted-foreground mt-0.5">{successMessage}</p>
          </div>
        </div>
      )}

      {serverError && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <h5 className="font-bold">Gagal Mengirim</h5>
            <p className="mt-0.5">{serverError}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="block text-[11px] font-mono font-bold uppercase tracking-wider text-foreground mb-2"
            >
              NAMA LENGKAP <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nama Anda"
              disabled={isLoading}
              className={`w-full px-4 py-3 text-xs bg-white border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-colors ${
                errors.name ? 'border-red-500' : 'border-border/80'
              }`}
            />
            {errors.name && (
              <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-[11px] font-mono font-bold uppercase tracking-wider text-foreground mb-2"
            >
              ALAMAT EMAIL <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="nama@domain.com"
              disabled={isLoading}
              className={`w-full px-4 py-3 text-xs bg-white border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-colors ${
                errors.email ? 'border-red-500' : 'border-border/80'
              }`}
            />
            {errors.email && (
              <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.email}</p>
            )}
          </div>
        </div>

        {/* Subject Presets & Input */}
        <div>
          <label
            htmlFor="subject"
            className="block text-[11px] font-mono font-bold uppercase tracking-wider text-foreground mb-2"
          >
            SUBJEK PESAN <span className="text-red-500">*</span>
          </label>

          {/* Quick preset chips */}
          <div className="flex flex-wrap gap-2 mb-3">
            {SUBJECT_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`text-[10px] font-mono uppercase tracking-wider px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  formData.subject === preset
                    ? 'bg-primary text-white border-primary shadow-xs'
                    : 'bg-muted/60 border-border/70 text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>

          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Ketik atau pilih subjek pesan di atas"
            disabled={isLoading}
            className={`w-full px-4 py-3 text-xs bg-white border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-colors ${
              errors.subject ? 'border-red-500' : 'border-border/80'
            }`}
          />
          {errors.subject && (
            <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.subject}</p>
          )}
        </div>

        {/* Message Field */}
        <div>
          <label
            htmlFor="message"
            className="block text-[11px] font-mono font-bold uppercase tracking-wider text-foreground mb-2"
          >
            ISI PESAN ATAU KEBUTUHAN <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={formData.message}
            onChange={handleChange}
            placeholder="Jelaskan kebutuhan Anda secara rinci..."
            disabled={isLoading}
            className={`w-full px-4 py-3 text-xs bg-white border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-colors resize-y ${
              errors.message ? 'border-red-500' : 'border-border/80'
            }`}
          />
          {errors.message && (
            <p className="text-[11px] text-red-600 mt-1 font-medium">{errors.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full inline-flex items-center justify-center gap-2 text-xs font-mono font-bold tracking-widest uppercase bg-primary text-white px-8 py-4 rounded-xl hover:bg-primary-hover active:scale-[0.99] transition-all shadow-sm cursor-pointer disabled:opacity-60"
        >
          {isLoading ? (
            <span>MENGIRIM PESAN...</span>
          ) : (
            <>
              <span>KIRIM PESAN SEKARANG</span>
              <Send className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
