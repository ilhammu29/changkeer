'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Trash2 } from 'lucide-react';
import { ContactMessage } from '@/types';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/admin/messages');
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const toggleRead = async (msg: ContactMessage) => {
    const nextRead = !msg.is_read;
    try {
      await fetch('/api/admin/messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: msg.id, is_read: nextRead }),
      });
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, is_read: nextRead } : m))
      );
      if (selectedMessage?.id === msg.id) {
        setSelectedMessage({ ...selectedMessage, is_read: nextRead });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/messages?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        if (selectedMessage?.id === id) {
          setSelectedMessage(null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-border">
        <h1 className="text-2xl font-black uppercase tracking-tight text-foreground">
          PESAN &amp; INQUIRY MASUK
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Kelola pertanyaan publik, proposal kemitraan kafe, dan masukan konsumen.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Messages List */}
        <div className="lg:col-span-7 bg-surface border border-border rounded-lg overflow-hidden shadow-sm">
          <div className="p-4 border-b border-border bg-muted/40 font-bold text-xs uppercase tracking-wider text-foreground flex items-center justify-between">
            <span>DAFTAR PESAN ({messages.length})</span>
            <span className="text-[10px] text-amber-700 font-bold">
              {messages.filter((m) => !m.is_read).length} Belum Dibaca
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs text-muted-foreground">
              Memuat pesan...
            </div>
          ) : messages.length === 0 ? (
            <div className="p-12 text-center text-xs text-muted-foreground">
              Kotak masuk masih kosong.
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => setSelectedMessage(msg)}
                  className={`p-4 transition-colors cursor-pointer flex items-start justify-between gap-4 ${
                    selectedMessage?.id === msg.id
                      ? 'bg-muted/60'
                      : msg.is_read
                      ? 'hover:bg-muted/20'
                      : 'bg-accent-subtle/50 hover:bg-accent-subtle/80'
                  }`}
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs ${
                          msg.is_read ? 'font-medium text-foreground' : 'font-extrabold text-foreground'
                        }`}
                      >
                        {msg.name}
                      </span>
                      {!msg.is_read && (
                        <span className="w-2 h-2 rounded-full bg-accent shrink-0" />
                      )}
                    </div>
                    <div className="text-xs font-semibold text-foreground truncate">
                      {msg.subject}
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {msg.message}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {new Date(msg.created_at).toLocaleDateString('id-ID')}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleRead(msg);
                      }}
                      className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground"
                    >
                      {msg.is_read ? 'Tandai Belum' : 'Tandai Selesai'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Message Detail Panel */}
        <div className="lg:col-span-5 bg-surface border border-border rounded-lg p-6 space-y-6 shadow-sm">
          {selectedMessage ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <span className="text-[10px] font-bold uppercase tracking-wider text-accent">
                  DETAIL PESAN
                </span>
                <button
                  type="button"
                  onClick={() => handleDelete(selectedMessage.id)}
                  className="text-xs text-red-600 hover:text-red-700 font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus</span>
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                    PENGIRIM
                  </span>
                  <p className="font-bold text-sm text-foreground">{selectedMessage.name}</p>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="text-accent underline font-mono text-[11px]"
                  >
                    {selectedMessage.email}
                  </a>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                    SUBJEK
                  </span>
                  <p className="font-bold text-foreground text-sm">{selectedMessage.subject}</p>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                    WAKTU PENGIRIMAN
                  </span>
                  <p className="text-muted-foreground font-mono">
                    {new Date(selectedMessage.created_at).toLocaleString('id-ID')}
                  </p>
                </div>

                <div className="pt-2">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-2">
                    ISI PESAN LENGKAP
                  </span>
                  <div className="p-4 rounded-md bg-background border border-border text-foreground leading-relaxed whitespace-pre-wrap">
                    {selectedMessage.message}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 text-xs font-bold uppercase tracking-wider bg-primary text-primary-foreground rounded-sm hover:bg-primary-hover active:scale-[0.99]"
                >
                  <Mail className="w-4 h-4" />
                  <span>Balas Melalui Email Resmi</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center text-xs text-muted-foreground space-y-2">
              <Mail className="w-8 h-8 mx-auto text-muted-foreground/60" />
              <p className="font-semibold text-foreground">Belum ada pesan yang dipilih</p>
              <p className="text-[11px]">Pilih salah satu pesan di sisi kiri untuk membaca rinciannya.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
