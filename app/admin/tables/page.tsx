'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  UtensilsCrossed, 
  Plus, 
  Trash2, 
  QrCode, 
  ExternalLink, 
  Copy, 
  Check, 
  X,
  AlertCircle
} from 'lucide-react';
import { CafeTable } from '@/types';

export default function AdminTablesPage() {
  const [tables, setTables] = useState<CafeTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form states
  const [tableNumber, setTableNumber] = useState('');
  const [capacity, setCapacity] = useState<number>(2);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchTables = async () => {
    try {
      const res = await fetch('/api/admin/tables');
      if (res.ok) {
        const data = await res.json();
        setTables(data);
      }
    } catch (e) {
      console.error('Failed to fetch tables:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handleCopyQrLink = (tableNum: string, id: string) => {
    const cleanNum = tableNum.replace(/\s+/g, '');
    const url = `${window.location.origin}/order?table=${encodeURIComponent(cleanNum)}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleActive = async (table: CafeTable) => {
    try {
      const res = await fetch('/api/admin/tables', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: table.id, is_active: !table.is_active }),
      });
      if (res.ok) {
        fetchTables();
      }
    } catch (e) {
      console.error('Error toggling table:', e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus meja ini?')) return;
    try {
      const res = await fetch(`/api/admin/tables?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchTables();
      }
    } catch (e) {
      console.error('Error deleting table:', e);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/admin/tables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table_number: tableNumber.trim(),
          capacity: Number(capacity),
          description: description.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menambahkan meja');
      }

      setModalOpen(false);
      setTableNumber('');
      setDescription('');
      fetchTables();
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
            Meja Cafe &amp; QR Code Meja
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Atur tata letak meja pengunjung, kapasitas duduk, dan tautan QR Code seduhan santap di tempat.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setTableNumber(`Meja 0${tables.length + 1}`);
            setCapacity(2);
            setDescription('');
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Meja Baru</span>
        </button>
      </div>

      {/* Tables Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-muted-foreground">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <span>Memuat data meja cafe...</span>
        </div>
      ) : tables.length === 0 ? (
        <div className="p-12 text-center bg-white border border-dashed border-border rounded-2xl text-muted-foreground text-xs">
          <UtensilsCrossed className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
          <p className="font-semibold text-foreground">Belum ada meja cafe yang terdaftar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tables.map(table => {
            const cleanNum = table.table_number.replace(/\s+/g, '');
            const orderLink = `/order?table=${encodeURIComponent(cleanNum)}`;

            return (
              <div
                key={table.id}
                className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between transition-all ${
                  table.is_active ? 'border-border' : 'border-neutral-200 opacity-60 bg-neutral-50'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <UtensilsCrossed className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-serif text-base font-bold text-foreground">
                          {table.table_number}
                        </h3>
                        <span className="text-[11px] text-muted-foreground font-mono">
                          Kapasitas: {table.capacity} Orang
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleActive(table)}
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase cursor-pointer ${
                        table.is_active
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-neutral-200 text-neutral-600'
                      }`}
                    >
                      {table.is_active ? 'Aktif' : 'Tutup'}
                    </button>
                  </div>

                  {table.description && (
                    <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                      {table.description}
                    </p>
                  )}

                  {/* QR Link Box */}
                  <div className="mt-4 p-3 rounded-xl bg-neutral-50 border border-border/80 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs truncate">
                      <QrCode className="w-4 h-4 text-primary shrink-0" />
                      <span className="font-mono text-[11px] text-muted-foreground truncate">
                        {orderLink}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleCopyQrLink(table.table_number, table.id)}
                        className="p-1.5 rounded-lg hover:bg-neutral-200 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        title="Salin Tautan QR"
                      >
                        {copiedId === table.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <Link
                        href={orderLink}
                        target="_blank"
                        className="p-1.5 rounded-lg hover:bg-neutral-200 text-muted-foreground hover:text-foreground transition-colors"
                        title="Buka Tampilan Pesanan Meja Ini"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Footer action */}
                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
                  <span className="text-[10px] font-mono text-muted-foreground">
                    ID: {table.id}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDelete(table.id)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Hapus Meja"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Table Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-border">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-serif text-lg font-bold text-foreground">
                Tambah Meja Cafe
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

            <form onSubmit={handleCreateSubmit} className="py-3 space-y-3.5 text-xs">
              <div>
                <label className="block text-foreground font-medium mb-1 uppercase tracking-wider text-[11px]">
                  Nomor / Nama Meja *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Meja 07 atau Bar 02"
                  value={tableNumber}
                  onChange={e => setTableNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-border focus:outline-none focus:border-primary font-semibold"
                />
              </div>

              <div>
                <label className="block text-foreground font-medium mb-1 uppercase tracking-wider text-[11px]">
                  Kapasitas Duduk (Orang) *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={20}
                  value={capacity}
                  onChange={e => setCapacity(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-border focus:outline-none focus:border-primary font-mono"
                />
              </div>

              <div>
                <label className="block text-foreground font-medium mb-1 uppercase tracking-wider text-[11px]">
                  Deskripsi Posisi / Area
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Area outdoor taman bambu"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-border focus:outline-none focus:border-primary"
                />
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
                  {submitting ? 'Menyimpan...' : 'Simpan Meja'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
