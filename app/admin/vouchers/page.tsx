'use client';

import React, { useState, useEffect } from 'react';
import { 
  Ticket, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  X, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { Voucher, DiscountType } from '@/types';

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function AdminVouchersPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);

  // Form states
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<DiscountType>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [minSpend, setMinSpend] = useState<number>(30000);
  const [maxDiscount, setMaxDiscount] = useState<number>(15000);
  const [quota, setQuota] = useState<number>(100);
  const [validUntilDays, setValidUntilDays] = useState<number>(30);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchVouchers = async () => {
    try {
      const res = await fetch('/api/admin/vouchers');
      if (res.ok) {
        const data = await res.json();
        setVouchers(data);
      }
    } catch (e) {
      console.error('Error fetching vouchers:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const openCreateModal = () => {
    setEditingVoucher(null);
    setCode('');
    setTitle('');
    setDescription('');
    setDiscountType('percentage');
    setDiscountValue(10);
    setMinSpend(30000);
    setMaxDiscount(15000);
    setQuota(100);
    setValidUntilDays(30);
    setFormError('');
    setModalOpen(true);
  };

  const handleToggleActive = async (voucher: Voucher) => {
    try {
      const res = await fetch('/api/admin/vouchers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: voucher.id, is_active: !voucher.is_active }),
      });
      if (res.ok) {
        fetchVouchers();
      }
    } catch (e) {
      console.error('Error toggling voucher:', e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus voucher ini?')) return;
    try {
      const res = await fetch(`/api/admin/vouchers?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchVouchers();
      }
    } catch (e) {
      console.error('Error deleting voucher:', e);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    const now = new Date();
    const validFrom = now.toISOString();
    const validUntil = new Date(now.getTime() + validUntilDays * 24 * 60 * 60 * 1000).toISOString();

    const payload = {
      code: code.toUpperCase().trim(),
      title: title.trim(),
      description: description.trim() || undefined,
      discount_type: discountType,
      discount_value: Number(discountValue),
      min_spend: Number(minSpend),
      max_discount: discountType === 'percentage' && maxDiscount ? Number(maxDiscount) : undefined,
      quota: Number(quota),
      valid_from: validFrom,
      valid_until: validUntil,
      is_active: true,
    };

    try {
      const res = await fetch('/api/admin/vouchers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menyimpan voucher');
      }

      setModalOpen(false);
      fetchVouchers();
    } catch (err: any) {
      setFormError(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
            Voucher &amp; Promo Diskon Cafe
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Buat dan atur kode promo potongan harga untuk pelanggan atelier &amp; pesanan online.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Voucher Baru</span>
        </button>
      </div>

      {/* Vouchers Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-muted-foreground">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <span>Memuat data voucher...</span>
        </div>
      ) : vouchers.length === 0 ? (
        <div className="p-12 text-center bg-white border border-dashed border-border rounded-2xl text-muted-foreground text-xs">
          <Ticket className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
          <p className="font-semibold text-foreground">Belum ada voucher yang dibuat.</p>
          <p className="text-[11px] mt-0.5">Klik tombol &ldquo;Buat Voucher Baru&rdquo; untuk merilis promo.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {vouchers.map(v => (
            <div
              key={v.id}
              className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between transition-all ${
                v.is_active ? 'border-border' : 'border-neutral-200 opacity-60 bg-neutral-50'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="font-mono text-base font-extrabold text-primary tracking-wider bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      {v.code}
                    </span>
                    <h3 className="font-serif text-sm font-bold text-foreground mt-2.5">
                      {v.title}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleActive(v)}
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase cursor-pointer ${
                      v.is_active
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-neutral-200 text-neutral-600'
                    }`}
                  >
                    {v.is_active ? 'Aktif' : 'Nonaktif'}
                  </button>
                </div>

                {v.description && (
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    {v.description}
                  </p>
                )}

                {/* Specs */}
                <div className="mt-4 pt-3 border-t border-border/70 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Potongan:</span>
                    <span className="font-semibold text-foreground font-mono">
                      {v.discount_type === 'percentage'
                        ? `${v.discount_value}% ${v.max_discount ? `(Maks ${formatRupiah(v.max_discount)})` : ''}`
                        : formatRupiah(v.discount_value)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Minimal Belanja:</span>
                    <span className="font-semibold text-foreground font-mono">
                      {formatRupiah(v.min_spend)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Kuota Terpakai:</span>
                    <span className="font-semibold text-foreground font-mono">
                      {v.used_count} / {v.quota > 0 ? v.quota : 'Unlimited'}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-muted-foreground pt-1">
                    <span>Berlaku s/d:</span>
                    <span>{new Date(v.valid_until).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-5 pt-3 border-t border-border flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => handleDelete(v.id)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Hapus Voucher"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Voucher Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-border max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-serif text-lg font-bold text-foreground">
                Terbitkan Kode Voucher Baru
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg hover:bg-neutral-100 text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="my-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="py-3 space-y-3.5 text-xs">
              <div>
                <label className="block text-foreground font-medium mb-1 uppercase tracking-wider text-[11px]">
                  Kode Promo (Kapital) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: TEHBARU20"
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase())}
                  className="w-full uppercase font-mono px-3 py-2 rounded-xl bg-neutral-50 border border-border focus:outline-none focus:border-primary font-bold"
                />
              </div>

              <div>
                <label className="block text-foreground font-medium mb-1 uppercase tracking-wider text-[11px]">
                  Judul Promo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Diskon Sambut Musim Hujan 20%"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-border focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-foreground font-medium mb-1 uppercase tracking-wider text-[11px]">
                  Deskripsi Singkat
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Berlaku untuk semua seduhan signature cup & teapot"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-border focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-foreground font-medium mb-1 uppercase tracking-wider text-[11px]">
                    Tipe Diskon *
                  </label>
                  <select
                    value={discountType}
                    onChange={e => setDiscountType(e.target.value as DiscountType)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-border focus:outline-none focus:border-primary"
                  >
                    <option value="percentage">Persentase (%)</option>
                    <option value="fixed">Nominal Tetap (Rp)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-foreground font-medium mb-1 uppercase tracking-wider text-[11px]">
                    Besaran Potongan *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={discountValue}
                    onChange={e => setDiscountValue(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-border focus:outline-none focus:border-primary font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-foreground font-medium mb-1 uppercase tracking-wider text-[11px]">
                    Min. Belanja (Rp) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={minSpend}
                    onChange={e => setMinSpend(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-border focus:outline-none focus:border-primary font-mono"
                  />
                </div>

                {discountType === 'percentage' && (
                  <div>
                    <label className="block text-foreground font-medium mb-1 uppercase tracking-wider text-[11px]">
                      Maks. Diskon (Rp)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={maxDiscount}
                      onChange={e => setMaxDiscount(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-border focus:outline-none focus:border-primary font-mono"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-foreground font-medium mb-1 uppercase tracking-wider text-[11px]">
                    Kuota Penggunaan *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={quota}
                    onChange={e => setQuota(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-border focus:outline-none focus:border-primary font-mono"
                  />
                </div>

                <div>
                  <label className="block text-foreground font-medium mb-1 uppercase tracking-wider text-[11px]">
                    Masa Berlaku (Hari) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={validUntilDays}
                    onChange={e => setValidUntilDays(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-border focus:outline-none focus:border-primary font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-border flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border hover:bg-neutral-100 text-muted-foreground"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold"
                >
                  {submitting ? 'Menyimpan...' : 'Terbitkan Voucher'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
