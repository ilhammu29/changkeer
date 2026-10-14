import { createPublicSupabaseClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { getSupabaseEnv } from '@/lib/supabase/env';
import { SEED_VOUCHERS } from './mock-seed';
import { Voucher } from '@/types';

// In-memory store for local development without DB connection
let memoryVouchers: Voucher[] = [...SEED_VOUCHERS];

export async function getActiveVouchers(): Promise<Voucher[]> {
  const { isConfigured } = getSupabaseEnv();

  if (!isConfigured) {
    const now = new Date();
    return memoryVouchers.filter(v => v.is_active && new Date(v.valid_until) >= now);
  }

  try {
    const supabase = createPublicSupabaseClient();
    const nowIso = new Date().toISOString();
    const { data, error } = await supabase
      .from('vouchers')
      .select('*')
      .eq('is_active', true)
      .lte('valid_from', nowIso)
      .gte('valid_until', nowIso)
      .order('discount_value', { ascending: false });

    if (error || !data) {
      console.warn('Fallback to local memory vouchers:', error?.message);
      return memoryVouchers.filter(v => v.is_active);
    }
    return data as Voucher[];
  } catch (err) {
    console.error('Failed to get active vouchers:', err);
    return memoryVouchers.filter(v => v.is_active);
  }
}

export async function getAllVouchersAdmin(): Promise<Voucher[]> {
  const { isConfigured } = getSupabaseEnv();

  if (!isConfigured) {
    return memoryVouchers;
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('vouchers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      console.warn('Fallback to local memory vouchers for admin:', error?.message);
      return memoryVouchers;
    }
    return data as Voucher[];
  } catch (err) {
    console.error('Failed to get all vouchers for admin:', err);
    return memoryVouchers;
  }
}

export async function validateVoucherCode(code: string, subtotal: number): Promise<{
  isValid: boolean;
  voucher?: Voucher;
  discountAmount: number;
  message?: string;
}> {
  if (!code || !code.trim()) {
    return { isValid: false, discountAmount: 0, message: 'Kode voucher kosong' };
  }

  const cleanCode = code.trim().toUpperCase();
  const allVouchers = await getAllVouchersAdmin();
  const voucher = allVouchers.find(v => v.code.toUpperCase() === cleanCode);

  if (!voucher) {
    return { isValid: false, discountAmount: 0, message: 'Kode voucher tidak ditemukan.' };
  }

  if (!voucher.is_active) {
    return { isValid: false, discountAmount: 0, message: 'Voucher sudah tidak aktif.' };
  }

  const now = new Date();
  if (new Date(voucher.valid_from) > now) {
    return { isValid: false, discountAmount: 0, message: 'Voucher belum dapat digunakan.' };
  }

  if (new Date(voucher.valid_until) < now) {
    return { isValid: false, discountAmount: 0, message: 'Voucher telah kedaluwarsa.' };
  }

  if (voucher.quota > 0 && voucher.used_count >= voucher.quota) {
    return { isValid: false, discountAmount: 0, message: 'Kuota penggunaan voucher telah habis.' };
  }

  if (subtotal < voucher.min_spend) {
    const minFormatted = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(voucher.min_spend);
    return {
      isValid: false,
      discountAmount: 0,
      message: `Minimal belanja untuk voucher ini adalah ${minFormatted}.`,
    };
  }

  let discountAmount = 0;
  if (voucher.discount_type === 'percentage') {
    discountAmount = Math.round((subtotal * voucher.discount_value) / 100);
    if (voucher.max_discount && voucher.max_discount > 0) {
      discountAmount = Math.min(discountAmount, voucher.max_discount);
    }
  } else {
    discountAmount = Math.min(subtotal, voucher.discount_value);
  }

  return {
    isValid: true,
    voucher,
    discountAmount,
    message: `Voucher "${voucher.code}" berhasil diterapkan! Hemat ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(discountAmount)}.`,
  };
}

export async function createVoucher(data: Omit<Voucher, 'id' | 'used_count' | 'created_at' | 'updated_at'>): Promise<Voucher> {
  const newVoucher: Voucher = {
    ...data,
    id: `v-${Date.now().toString(36)}`,
    code: data.code.toUpperCase().trim(),
    used_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { isConfigured } = getSupabaseEnv();
  if (!isConfigured) {
    memoryVouchers.unshift(newVoucher);
    return newVoucher;
  }

  try {
    const supabase = createAdminClient();
    const { data: inserted, error } = await supabase
      .from('vouchers')
      .insert(newVoucher)
      .select()
      .single();

    if (error || !inserted) {
      console.warn('Failed to insert voucher to Supabase, saving to memory:', error?.message);
      memoryVouchers.unshift(newVoucher);
      return newVoucher;
    }
    return inserted as Voucher;
  } catch (err) {
    console.error('Error inserting voucher:', err);
    memoryVouchers.unshift(newVoucher);
    return newVoucher;
  }
}

export async function updateVoucher(id: string, updates: Partial<Voucher>): Promise<Voucher | null> {
  const { isConfigured } = getSupabaseEnv();

  const idx = memoryVouchers.findIndex(v => v.id === id);
  if (idx !== -1) {
    memoryVouchers[idx] = {
      ...memoryVouchers[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };
  }

  if (!isConfigured) {
    return memoryVouchers[idx] || null;
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('vouchers')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      return memoryVouchers[idx] || null;
    }
    return data as Voucher;
  } catch (err) {
    console.error('Error updating voucher:', err);
    return memoryVouchers[idx] || null;
  }
}

export async function deleteVoucher(id: string): Promise<boolean> {
  memoryVouchers = memoryVouchers.filter(v => v.id !== id);

  const { isConfigured } = getSupabaseEnv();
  if (!isConfigured) return true;

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from('vouchers').delete().eq('id', id);
    return !error;
  } catch (err) {
    console.error('Error deleting voucher:', err);
    return true;
  }
}
