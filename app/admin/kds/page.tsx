'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Flame, 
  Clock, 
  CheckCircle2, 
  UtensilsCrossed, 
  Package, 
  Bike, 
  RefreshCw, 
  AlertCircle,
  Sparkles,
  ChevronRight,
  Volume2,
  VolumeX,
  Bell,
  Printer
} from 'lucide-react';
import { Order, OrderStatus } from '@/types';
import { ThermalReceiptModal } from '@/components/order/ThermalReceiptModal';

function getElapsedTime(dateStr: string): string {
  const diffSec = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diffSec < 60) return `${diffSec} dtk lalu`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} mnt lalu`;
  const diffHour = Math.floor(diffMin / 60);
  return `${diffHour} jam lalu`;
}

// Web Audio API Tea Bar Bell Chime Synthesizer
function playTeaBellChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;

    // First tone (A5 - 880Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, now);
    gain1.gain.setValueAtTime(0.35, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 1.2);

    // Second harmonic chime (E6 - 1320Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1320, now + 0.08);
    gain2.gain.setValueAtTime(0.28, now + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.08);
    osc2.stop(now + 1.5);
  } catch (e) {
    console.warn('Audio chime notice:', e);
  }
}

export default function BaristaKDSPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'active' | 'all' | 'ready' | 'completed'>('active');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [newOrderNotice, setNewOrderNotice] = useState<string | null>(null);
  const [selectedOrderForPrint, setSelectedOrderForPrint] = useState<Order | null>(null);

  const prevOrderIdsRef = useRef<Set<string>>(new Set());
  const isFirstLoadRef = useRef(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders');
      if (res.ok) {
        const data: Order[] = await res.json();
        
        // Detect if there's any new received order
        if (!isFirstLoadRef.current && soundEnabled) {
          const newReceivedOrders = data.filter(
            o => o.order_status === 'received' && !prevOrderIdsRef.current.has(o.id)
          );

          if (newReceivedOrders.length > 0) {
            playTeaBellChime();
            setNewOrderNotice(`🔔 ${newReceivedOrders.length} Pesanan Baru Masuk dari Meja/Kasir!`);
            setTimeout(() => setNewOrderNotice(null), 5000);
          }
        }

        // Update ID cache
        prevOrderIdsRef.current = new Set(data.map(o => o.id));
        isFirstLoadRef.current = false;
        setOrders(data);
      }
    } catch (e) {
      console.error('KDS fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // Auto-refresh polling every 5 seconds for live order reception
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [soundEnabled]);

  const handleUpdateStatus = async (orderId: string, nextStatus: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, order_status: nextStatus }),
      });
      if (res.ok) {
        fetchOrders();
      }
    } catch (e) {
      console.error('Failed to update status:', e);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'active') {
      return ['received', 'brewing', 'ready'].includes(order.order_status);
    }
    if (filter === 'ready') {
      return order.order_status === 'ready';
    }
    if (filter === 'completed') {
      return order.order_status === 'completed';
    }
    return true;
  });

  const activeCount = orders.filter(o => ['received', 'brewing', 'ready'].includes(o.order_status)).length;
  const brewingCount = orders.filter(o => o.order_status === 'brewing').length;

  return (
    <div className="space-y-6 font-sans select-none">
      
      {/* New Order Realtime Sound Notification Banner */}
      {newOrderNotice && (
        <div className="p-3.5 rounded-2xl bg-amber-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-between shadow-lg animate-bounce">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 animate-spin" />
            <span>{newOrderNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setNewOrderNotice(null)}
            className="text-[10px] bg-black/20 hover:bg-black/30 px-2 py-0.5 rounded-lg"
          >
            Tutup
          </button>
        </div>
      )}

      {/* KDS Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-mono uppercase font-bold tracking-wider mb-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-600" />
            <span>KITCHEN DISPLAY SYSTEM (KDS) &bull; REAL-TIME</span>
          </div>
          <h1 className="font-sans font-black text-2xl sm:text-3xl uppercase tracking-tight text-neutral-900">
            Layar Barista &amp; Antrean Seduhan
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5 font-normal">
            Pantau dan perbarui alur seduhan teh herbal real-time dari meja pelanggan cafe.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          
          {/* Sound Bell Toggle & Test Button */}
          <div className="flex items-center bg-white border border-neutral-200 rounded-xl p-1 shadow-2xs text-xs font-semibold">
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                soundEnabled 
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                  : 'text-neutral-400 hover:text-neutral-700'
              }`}
              title={soundEnabled ? 'Lonceng Bel Aktif' : 'Lonceng Bel Dimatikan (Mute)'}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-600" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span className="text-[11px] font-mono">{soundEnabled ? 'Bel: Aktif' : 'Mute'}</span>
            </button>

            <button
              type="button"
              onClick={playTeaBellChime}
              className="px-2.5 py-1.5 text-[11px] text-neutral-500 hover:text-neutral-900 font-mono transition-colors border-l border-neutral-100 ml-1 cursor-pointer"
              title="Uji coba suara lonceng barista"
            >
              Tes Bel
            </button>
          </div>

          {/* Brewing Counter Pill */}
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-neutral-200 shadow-2xs text-xs font-mono">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-neutral-900">{brewingCount} Diseduh</span>
            <span className="text-neutral-400">/ {activeCount} Antre</span>
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={fetchOrders}
            className="p-2.5 rounded-xl bg-white border border-neutral-200 hover:bg-neutral-100 text-neutral-700 transition-colors cursor-pointer shadow-2xs"
            title="Refresh Antrean"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(
          [
            { id: 'active', label: `Seduhan Aktif (${activeCount})` },
            { id: 'ready', label: 'Siap Disajikan' },
            { id: 'completed', label: 'Selesai' },
            { id: 'all', label: 'Semua Tiket' },
          ] as const
        ).map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              filter === tab.id
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Ticket Grid */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-3xl p-12 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-neutral-900">Semua Seduhan Selesai</h3>
          <p className="text-xs text-neutral-500">
            Tidak ada tiket pesanan dalam antrean saat ini. Lonceng akan berbunyi saat pesanan baru masuk.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredOrders.map(order => {
            const isUpdating = updatingId === order.id;

            return (
              <div
                key={order.id}
                className={`bg-white border-2 rounded-3xl overflow-hidden shadow-xs flex flex-col justify-between transition-all ${
                  order.order_status === 'received'
                    ? 'border-neutral-900 ring-2 ring-neutral-200'
                    : order.order_status === 'brewing'
                    ? 'border-amber-400'
                    : order.order_status === 'ready'
                    ? 'border-emerald-500 bg-emerald-50/20'
                    : 'border-neutral-200 opacity-75'
                }`}
              >
                {/* Ticket Top Header */}
                <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-[#FAFAF8]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-black text-neutral-900">
                        #{order.order_number}
                      </span>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        {getElapsedTime(order.created_at)}
                      </span>
                    </div>

                    {/* Order Mode Badge */}
                    <div className="flex items-center gap-1.5 mt-1 text-xs">
                      {order.order_type === 'dine_in' && (
                        <div className="flex items-center gap-1 font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-lg text-[10px] uppercase font-mono">
                          <UtensilsCrossed className="w-3 h-3 text-emerald-700" />
                          <span>{order.table_number || 'Meja Cafe'}</span>
                        </div>
                      )}
                      {order.order_type === 'takeaway' && (
                        <div className="flex items-center gap-1 font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-lg text-[10px] uppercase font-mono">
                          <Package className="w-3 h-3 text-amber-700" />
                          <span>Takeaway ({order.pickup_time || 'Segera'})</span>
                        </div>
                      )}
                      {order.order_type === 'delivery' && (
                        <div className="flex items-center gap-1 font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded-lg text-[10px] uppercase font-mono">
                          <Bike className="w-3 h-3 text-sky-700" />
                          <span>Delivery</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`text-[9px] font-mono px-2 py-1 rounded-lg uppercase font-bold tracking-wider ${
                      order.order_status === 'brewing'
                        ? 'bg-amber-500 text-white animate-pulse'
                        : order.order_status === 'ready'
                        ? 'bg-emerald-600 text-white'
                        : order.order_status === 'completed'
                        ? 'bg-neutral-200 text-neutral-700'
                        : 'bg-neutral-900 text-white'
                    }`}
                  >
                    {order.order_status === 'brewing'
                      ? 'Diseduh'
                      : order.order_status === 'ready'
                      ? 'Siap Saji'
                      : order.order_status === 'completed'
                      ? 'Selesai'
                      : 'Baru Masuk'}
                  </span>
                </div>

                {/* Customer name and notes */}
                <div className="p-4 border-b border-neutral-100 bg-white">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-500">
                      Pemesan: <strong className="text-neutral-900 font-bold">{order.customer_name}</strong>
                    </span>

                    {/* Quick Cup Label Print Button */}
                    <button
                      type="button"
                      onClick={() => setSelectedOrderForPrint(order)}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[10px] font-mono font-bold uppercase transition-colors cursor-pointer"
                      title="Cetak Label Stiker Cup (58mm)"
                    >
                      <Printer className="w-3 h-3 text-neutral-600" />
                      <span>Stiker Cup</span>
                    </button>
                  </div>

                  {order.notes && (
                    <div className="mt-2 p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] italic">
                      Catatan: &ldquo;{order.notes}&rdquo;
                    </div>
                  )}
                </div>

                {/* Items to Brew */}
                <div className="p-4 flex-1 space-y-2.5 bg-white">
                  {order.items?.map((item, idx) => (
                    <div key={item.id || idx} className="p-2.5 rounded-2xl bg-[#FAFAF8] border border-neutral-200 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-xs text-neutral-900">
                          {item.quantity}x {item.product_name}
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white border border-neutral-200 uppercase font-bold text-neutral-600">
                          {item.serving_size === 'pot' ? 'CERET' : 'CUP'}
                        </span>
                      </div>

                      {/* Barista Specifications */}
                      <div className="flex flex-wrap gap-1 text-[10px] pt-1">
                        <span
                          className={`px-1.5 py-0.5 rounded-md font-mono font-bold uppercase ${
                            item.temperature === 'hot'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-sky-100 text-sky-800 border border-sky-200'
                          }`}
                        >
                          {item.temperature === 'hot' ? 'HOT (Panas)' : 'ICED (Dingin)'}
                        </span>

                        <span className="px-1.5 py-0.5 rounded-md font-mono bg-neutral-100 text-neutral-700 border border-neutral-200 font-bold">
                          Gula: {item.sweetness_level}
                        </span>

                        {item.ice_level && item.temperature === 'iced' && (
                          <span className="px-1.5 py-0.5 rounded-md font-mono bg-neutral-100 text-neutral-700 border border-neutral-200 font-bold">
                            Es: {item.ice_level}
                          </span>
                        )}
                      </div>

                      {/* Add-ons */}
                      {item.selected_addons && item.selected_addons.length > 0 && (
                        <div className="text-[10px] text-neutral-600 font-mono pt-0.5">
                          + {item.selected_addons.map(a => a.name).join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Barista Action Buttons */}
                <div className="p-4 bg-[#FAFAF8] border-t border-neutral-100 flex items-center gap-2">
                  {order.order_status === 'received' && (
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => handleUpdateStatus(order.id, 'brewing')}
                      className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer active:scale-98"
                    >
                      <Flame className="w-4 h-4" />
                      <span>Mulai Seduh</span>
                    </button>
                  )}

                  {order.order_status === 'brewing' && (
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => handleUpdateStatus(order.id, 'ready')}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer active:scale-98"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Seduhan Siap Saji</span>
                    </button>
                  )}

                  {order.order_status === 'ready' && (
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => handleUpdateStatus(order.id, 'completed')}
                      className="w-full py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer active:scale-98"
                    >
                      <span>Selesaikan Pesanan</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}

                  {order.order_status === 'completed' && (
                    <div className="w-full text-center text-xs font-bold text-emerald-700 py-1 flex items-center justify-center gap-1.5 font-mono">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>SELESAI DINIKMATI</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Thermal Receipt Print Modal for Barista */}
      <ThermalReceiptModal
        order={selectedOrderForPrint}
        isOpen={Boolean(selectedOrderForPrint)}
        onClose={() => setSelectedOrderForPrint(null)}
      />

    </div>
  );
}
