'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Search, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  Flame, 
  AlertCircle, 
  Eye, 
  UtensilsCrossed, 
  Package, 
  Bike,
  X,
  CreditCard,
  Printer,
  MessageCircle
} from 'lucide-react';
import { Order, OrderStatus, PaymentStatus } from '@/types';
import { ThermalReceiptModal } from '@/components/order/ThermalReceiptModal';
import { generateWhatsAppReceiptText, getWhatsAppUrl } from '@/lib/utils/whatsapp';

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isThermalOpen, setIsThermalOpen] = useState(false);

  const fetchOrders = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (typeFilter !== 'all') params.set('orderType', typeFilter);
      if (search) params.set('search', search);

      const res = await fetch(`/api/admin/orders?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (e) {
      console.error('Failed to fetch admin orders:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, typeFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, order_status: newStatus }),
      });
      if (res.ok) {
        fetchOrders();
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(prev => prev ? { ...prev, order_status: newStatus } : null);
        }
      }
    } catch (e) {
      console.error('Error updating status:', e);
    }
  };

  const handleUpdatePayment = async (orderId: string, newPaymentStatus: PaymentStatus) => {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, payment_status: newPaymentStatus }),
      });
      if (res.ok) {
        fetchOrders();
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(prev => prev ? { ...prev, payment_status: newPaymentStatus } : null);
        }
      }
    } catch (e) {
      console.error('Error updating payment:', e);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
            Manajemen Pesanan Cafe
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Kelola transaksi kasir, pesanan meja cafe, takeaway, dan pengantaran kurir.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchOrders}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-border hover:bg-neutral-50 text-foreground text-xs font-medium shadow-xs transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Segarkan Data</span>
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-border shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari No. Pesanan, Nama Pelanggan, atau No. HP..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-50 border border-border text-xs focus:outline-none focus:border-primary focus:bg-white"
          />
        </form>

        {/* Status & Type filters */}
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-neutral-50 border border-border text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-primary text-foreground"
          >
            <option value="all">Semua Status Seduhan</option>
            <option value="received">Diterima</option>
            <option value="brewing">Sedang Diseduh</option>
            <option value="ready">Siap Disajikan</option>
            <option value="completed">Selesai</option>
            <option value="cancelled">Dibatalkan</option>
          </select>

          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="bg-neutral-50 border border-border text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-primary text-foreground"
          >
            <option value="all">Semua Tipe Pesanan</option>
            <option value="dine_in">Dine-In (Meja Cafe)</option>
            <option value="takeaway">Takeaway (Bawa Pulang)</option>
            <option value="delivery">Delivery (Kurir)</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-border shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-muted-foreground">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <span>Memuat data pesanan...</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-xs text-muted-foreground">
            <ShoppingBag className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
            <p className="font-semibold text-foreground">Tidak ada data pesanan yang cocok.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50/80 border-b border-border text-muted-foreground uppercase tracking-wider font-mono text-[10px]">
                <tr>
                  <th className="px-5 py-3.5">Pesanan</th>
                  <th className="px-5 py-3.5">Pelanggan</th>
                  <th className="px-5 py-3.5">Tipe / Meja</th>
                  <th className="px-5 py-3.5">Total &amp; Bayar</th>
                  <th className="px-5 py-3.5">Status Seduhan</th>
                  <th className="px-5 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-neutral-50/60 transition-colors">
                    
                    {/* Order Number & Date */}
                    <td className="px-5 py-3.5">
                      <div className="font-mono font-bold text-foreground">
                        {order.order_number}
                      </div>
                      <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
                        {new Date(order.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} &bull;{' '}
                        {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-foreground">{order.customer_name}</div>
                      <div className="text-[10px] text-muted-foreground">{order.customer_phone}</div>
                    </td>

                    {/* Order Type */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 font-medium">
                        {order.order_type === 'dine_in' && (
                          <>
                            <UtensilsCrossed className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[11px] border border-emerald-200">
                              {order.table_number || 'Dine-In'}
                            </span>
                          </>
                        )}
                        {order.order_type === 'takeaway' && (
                          <>
                            <Package className="w-3.5 h-3.5 text-amber-600" />
                            <span className="text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded text-[11px] border border-amber-200">
                              Takeaway ({order.pickup_time})
                            </span>
                          </>
                        )}
                        {order.order_type === 'delivery' && (
                          <>
                            <Bike className="w-3.5 h-3.5 text-cyan-600" />
                            <span className="text-cyan-800 font-semibold bg-cyan-50 px-2 py-0.5 rounded text-[11px] border border-cyan-200">
                              Delivery
                            </span>
                          </>
                        )}
                      </div>
                    </td>

                    {/* Total & Payment */}
                    <td className="px-5 py-3.5">
                      <div className="font-mono font-bold text-foreground">
                        {formatRupiah(order.total_amount)}
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase ${
                            order.payment_status === 'paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {order.payment_status === 'paid' ? 'LUNAS' : 'BELUM'}
                        </span>
                        <span className="text-[10px] text-muted-foreground uppercase font-mono">
                          {order.payment_method}
                        </span>
                      </div>
                    </td>

                    {/* Status with Quick Dropdown */}
                    <td className="px-5 py-3.5">
                      <select
                        value={order.order_status}
                        onChange={e => handleUpdateStatus(order.id, e.target.value as OrderStatus)}
                        className={`text-xs font-semibold rounded-lg px-2 py-1 border focus:outline-none ${
                          order.order_status === 'brewing'
                            ? 'bg-amber-50 border-amber-300 text-amber-800'
                            : order.order_status === 'ready'
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                            : order.order_status === 'completed'
                            ? 'bg-neutral-100 border-neutral-300 text-neutral-800'
                            : order.order_status === 'cancelled'
                            ? 'bg-red-50 border-red-300 text-red-800'
                            : 'bg-white border-border text-foreground'
                        }`}
                      >
                        <option value="received">Diterima</option>
                        <option value="brewing">Sedang Diseduh</option>
                        <option value="ready">Siap Disajikan</option>
                        <option value="completed">Selesai</option>
                        <option value="cancelled">Dibatalkan</option>
                      </select>
                    </td>

                    {/* Action */}
                    <td className="px-5 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border hover:bg-neutral-100 text-foreground text-xs font-medium transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Rincian</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-border max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
                  DETAIL TRANSAKSI CAFE
                </span>
                <h3 className="font-serif text-lg font-bold text-foreground">
                  {selectedOrder.order_number}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-lg hover:bg-neutral-100 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              
              {/* Customer info */}
              <div className="p-3 rounded-xl bg-neutral-50 border border-border space-y-1">
                <div className="font-semibold text-foreground">{selectedOrder.customer_name}</div>
                <div className="text-muted-foreground">{selectedOrder.customer_email} &bull; {selectedOrder.customer_phone}</div>
                <div className="text-muted-foreground pt-1">
                  Penyajian: <strong>{selectedOrder.order_type.toUpperCase()}</strong> {selectedOrder.table_number && `(${selectedOrder.table_number})`}
                </div>
                {selectedOrder.delivery_address && (
                  <div className="text-muted-foreground pt-1 border-t border-border mt-1">
                    Alamat: {selectedOrder.delivery_address}
                  </div>
                )}
              </div>

              {/* Items */}
              <div>
                <h4 className="font-semibold text-foreground mb-2">Daftar Cangkir Seduhan:</h4>
                <div className="divide-y divide-border/60">
                  {selectedOrder.items?.map(item => (
                    <div key={item.id} className="py-2 flex justify-between gap-2">
                      <div>
                        <div className="font-medium text-foreground">{item.quantity}x {item.product_name}</div>
                        <div className="text-[10px] text-muted-foreground">
                          {item.serving_size === 'pot' ? 'Teapot' : 'Cup'} &bull; {item.temperature === 'hot' ? 'Panas' : 'Dingin'} &bull; Gula {item.sweetness_level}
                        </div>
                        {item.selected_addons && item.selected_addons.length > 0 && (
                          <div className="text-[10px] text-emerald-700">
                            + {item.selected_addons.map(a => a.name).join(', ')}
                          </div>
                        )}
                        {item.item_notes && (
                          <div className="text-[10px] italic text-neutral-500">
                            Catatan: {item.item_notes}
                          </div>
                        )}
                      </div>
                      <div className="font-mono font-medium">{formatRupiah(item.subtotal)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Breakdown */}
              <div className="pt-2 border-t border-border space-y-1 text-muted-foreground">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-foreground">{formatRupiah(selectedOrder.subtotal)}</span>
                </div>
                {selectedOrder.discount_amount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Diskon Voucher ({selectedOrder.voucher_code})</span>
                    <span className="font-mono">-{formatRupiah(selectedOrder.discount_amount)}</span>
                  </div>
                )}
                {selectedOrder.delivery_fee > 0 && (
                  <div className="flex justify-between">
                    <span>Ongkos Kirim</span>
                    <span className="font-mono text-foreground">{formatRupiah(selectedOrder.delivery_fee)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-sm text-foreground pt-2 border-t border-border">
                  <span>Total Tagihan</span>
                  <span className="font-mono text-base">{formatRupiah(selectedOrder.total_amount)}</span>
                </div>
              </div>

              {/* Payment toggle */}
              <div className="pt-3 border-t border-border flex items-center justify-between">
                <div>
                  <span className="block text-muted-foreground text-[11px]">Status Pembayaran Kasir:</span>
                  <span className={`font-mono font-bold uppercase text-xs ${
                    selectedOrder.payment_status === 'paid' ? 'text-emerald-700' : 'text-amber-700'
                  }`}>
                    {selectedOrder.payment_status === 'paid' ? 'LUNAS' : 'MENUNGGU PEMBAYARAN'}
                  </span>
                </div>

                {selectedOrder.payment_status === 'unpaid' ? (
                  <button
                    type="button"
                    onClick={() => handleUpdatePayment(selectedOrder.id, 'paid')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Tandai Lunas
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleUpdatePayment(selectedOrder.id, 'unpaid')}
                    className="px-3 py-1.5 rounded-lg bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Batal Lunas
                  </button>
                )}
              </div>

              {/* Thermal Print & WhatsApp Receipt Actions */}
              <div className="pt-3 border-t border-border grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIsThermalOpen(true)}
                  className="py-2 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Struk Thermal</span>
                </button>

                <a
                  href={getWhatsAppUrl(selectedOrder.customer_phone, generateWhatsAppReceiptText(selectedOrder))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Kirim ke WA</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Thermal Receipt Print Modal */}
      <ThermalReceiptModal
        order={selectedOrder}
        isOpen={isThermalOpen}
        onClose={() => setIsThermalOpen(false)}
      />
    </div>
  );
}
