'use client';

import React, { useState } from 'react';
import { contactFormSchema, ContactFormData, getFieldErrors } from '@/lib/validation/schemas';
import { CheckCircle2, AlertCircle, Send } from 'lucide-react';

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
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch {
      setServerError('Koneksi terputus. Pastikan perangkat Anda terhubung ke internet.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6 sm:p-10 shadow-sm">
      <div className="mb-8">
        <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-accent block mb-1">
          FORMULIR PERTANYAAN
        </span>
        <h3 className="text-2xl font-black uppercase tracking-tight text-foreground">
          KIRIM PESAN KEPADA KAMI
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          Isi formulir di bawah ini dengan lengkap. Tim kami akan merespons melalui email resmi.
        </p>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 rounded-md bg-accent-subtle/80 border border-border flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <h5 className="font-bold text-foreground">Pesan Berhasil Terkirim</h5>
            <p className="text-muted-foreground mt-0.5">{successMessage}</p>
          </div>
        </div>
      )}

      {serverError && (
        <div className="mb-6 p-4 rounded-md bg-red-50 border border-red-200 text-red-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <h5 className="font-bold">Gagal Mengirim</h5>
            <p className="mt-0.5">{serverError}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="block text-xs font-bold uppercase tracking-wider text-foreground mb-2"
            >
              NAMA LENGKAP <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Contoh: Rian Pratama"
              disabled={isLoading}
              className={`w-full px-4 py-3 text-xs bg-background border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors ${
                errors.name ? 'border-red-500' : 'border-border'
              }`}
            />
            {errors.name && (
              <p className="text-[11px] text-red-600 mt-1.5 font-medium">{errors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-bold uppercase tracking-wider text-foreground mb-2"
            >
              ALAMAT EMAIL <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Contoh: nama@domain.com"
              disabled={isLoading}
              className={`w-full px-4 py-3 text-xs bg-background border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors ${
                errors.email ? 'border-red-500' : 'border-border'
              }`}
            />
            {errors.email && (
              <p className="text-[11px] text-red-600 mt-1.5 font-medium">{errors.email}</p>
            )}
          </div>
        </div>

        {/* Subject Field */}
        <div>
          <label
            htmlFor="subject"
            className="block text-xs font-bold uppercase tracking-wider text-foreground mb-2"
          >
            SUBJEK PESAN <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Contoh: Pertanyaan Kemitraan Kafe &amp; Reseller"
            disabled={isLoading}
            className={`w-full px-4 py-3 text-xs bg-background border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors ${
              errors.subject ? 'border-red-500' : 'border-border'
            }`}
          />
          {errors.subject && (
            <p className="text-[11px] text-red-600 mt-1.5 font-medium">{errors.subject}</p>
          )}
        </div>

        {/* Message Field */}
        <div>
          <label
            htmlFor="message"
            className="block text-xs font-bold uppercase tracking-wider text-foreground mb-2"
          >
            ISI PESAN <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={formData.message}
            onChange={handleChange}
            placeholder="Tuliskan pesan, pertanyaan, atau rincian kebutuhan Anda secara lengkap..."
            disabled={isLoading}
            className={`w-full px-4 py-3 text-xs bg-background border rounded-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors ${
              errors.message ? 'border-red-500' : 'border-border'
            }`}
          />
          {errors.message && (
            <p className="text-[11px] text-red-600 mt-1.5 font-medium">{errors.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs font-bold tracking-widest uppercase bg-primary text-primary-foreground px-8 py-4 rounded-sm hover:bg-primary-hover active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              <span>SEDANG MENYIMPAN...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>KIRIM PESAN SEKARANG</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
