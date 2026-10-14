import { z } from 'zod';

export function getFirstErrorMessage(error: any): string {
  if (!error) return 'Input tidak valid';
  const issue = error.issues?.[0] || error.errors?.[0];
  return issue?.message || 'Input tidak valid';
}

export function getFieldErrors(error: any): Record<string, string> {
  const result: Record<string, string> = {};
  if (!error) return result;
  const issues = error.issues || error.errors || [];
  issues.forEach((issue: any) => {
    const key = issue.path?.join('.') || (issue.path?.[0] as string) || 'root';
    result[key] = issue.message;
  });
  return result;
}

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, { message: 'Nama harus memiliki minimal 2 karakter' }).max(100),
  email: z.string().trim().email({ message: 'Format alamat email tidak valid' }),
  subject: z.string().trim().min(3, { message: 'Subjek pesan harus memiliki minimal 3 karakter' }).max(150),
  message: z.string().trim().min(10, { message: 'Pesan harus memiliki minimal 10 karakter' }).max(2000),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export const adminLoginSchema = z.object({
  email: z.string().trim().email({ message: 'Email tidak valid' }),
  password: z.string().min(6, { message: 'Kata sandi minimal 6 karakter' }),
});

export type AdminLoginData = z.infer<typeof adminLoginSchema>;

export const categorySchema = z.object({
  name: z.string().trim().min(2, { message: 'Nama kategori wajib diisi' }),
  slug: z.string().trim().min(2, { message: 'Slug wajib diisi' }).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: 'Format slug harus berupa huruf kecil dan tanda hubung (-) tanpa spasi' }),
  description: z.string().optional().nullable(),
  type: z.enum(['product', 'article']),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

export const productSchema = z.object({
  name: z.string().trim().min(3, { message: 'Nama produk wajib diisi' }),
  slug: z.string().trim().min(3, { message: 'Slug wajib diisi' }).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: 'Format slug harus berupa huruf kecil dan tanda hubung (-) tanpa spasi' }),
  tagline: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  category_id: z.string().uuid().optional().nullable(),
  ingredients: z.array(z.string()).default([]),
  brewing_guide: z.object({
    water_temp: z.string().default('90°C'),
    steep_time: z.string().default('3-5 Menit'),
    serving_size: z.string().default('250ml'),
    notes: z.string().optional().default(''),
  }).default({
    water_temp: '90°C',
    steep_time: '3-5 Menit',
    serving_size: '250ml',
    notes: '',
  }),
  characteristics: z.record(z.string(), z.string()).default({}),
  packaging_info: z.string().optional().nullable(),
  price: z.number().min(0, { message: 'Harga minimal 0' }),
  weight_grams: z.number().min(1).optional().nullable(),
  featured_image: z.string().optional().nullable(),
  gallery: z.array(z.string()).default([]),
  is_featured: z.boolean().default(false),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  seo_title: z.string().optional().nullable(),
  seo_description: z.string().optional().nullable(),
});

export type ProductFormData = z.infer<typeof productSchema>;

export const articleSchema = z.object({
  title: z.string().trim().min(5, { message: 'Judul artikel wajib diisi minimal 5 karakter' }),
  slug: z.string().trim().min(3, { message: 'Slug wajib diisi' }).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: 'Format slug harus berupa huruf kecil dan tanda hubung (-) tanpa spasi' }),
  excerpt: z.string().optional().nullable(),
  content: z.string().trim().min(20, { message: 'Konten artikel minimal 20 karakter' }),
  category_id: z.string().uuid().optional().nullable(),
  featured_image: z.string().optional().nullable(),
  author_name: z.string().default('Tim CHANGKEER'),
  read_time_minutes: z.number().min(1).default(3),
  is_featured: z.boolean().default(false),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  seo_title: z.string().optional().nullable(),
  seo_description: z.string().optional().nullable(),
  published_at: z.string().optional().nullable(),
});

export type ArticleFormData = z.infer<typeof articleSchema>;

export const siteSettingsSchema = z.object({
  site_name: z.string().trim().min(2),
  tagline: z.string().trim().min(3),
  contact_email: z.string().email().optional().nullable().or(z.literal('')),
  contact_phone: z.string().optional().nullable(),
  contact_address: z.string().optional().nullable(),
  social_instagram: z.string().optional().nullable(),
  social_youtube: z.string().optional().nullable(),
  social_tiktok: z.string().optional().nullable(),
});

export type SiteSettingsFormData = z.infer<typeof siteSettingsSchema>;

// ============================================================================
// E-COMMERCE & CAFE BREW BAR ORDERING SCHEMAS
// ============================================================================

export const orderItemInputSchema = z.object({
  product_id: z.string().optional().nullable(),
  product_name: z.string().min(1, { message: 'Nama produk harus ada' }),
  product_slug: z.string().min(1),
  product_image: z.string().optional().nullable(),
  serving_size: z.enum(['regular', 'pot']).default('regular'),
  temperature: z.enum(['hot', 'iced']),
  sweetness_level: z.enum(['0%', '25%', '50%', '100%']).default('0%'),
  ice_level: z.enum(['normal', 'less', 'none']).optional().default('normal'),
  selected_addons: z.array(z.object({
    id: z.string(),
    name: z.string(),
    price: z.number().min(0),
  })).default([]),
  unit_price: z.number().min(0),
  quantity: z.number().int().min(1, { message: 'Kuantitas minimal 1' }),
  item_notes: z.string().max(200).optional().default(''),
});

export const checkoutSchema = z.object({
  customer_name: z.string().trim().min(2, { message: 'Nama pemesan minimal 2 karakter' }).max(100),
  customer_email: z.string().trim().email({ message: 'Alamat email tidak valid' }),
  customer_phone: z.string().trim().min(8, { message: 'Nomor WhatsApp / telepon minimal 8 digit' }).max(20),
  order_type: z.enum(['dine_in', 'takeaway', 'delivery']),
  table_number: z.string().optional().nullable(),
  pickup_time: z.string().optional().nullable(),
  delivery_address: z.string().optional().nullable(),
  delivery_notes: z.string().optional().nullable(),
  payment_method: z.enum(['qris', 'cashier', 'bank_transfer']),
  voucher_code: z.string().optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
  items: z.array(orderItemInputSchema).min(1, { message: 'Keranjang belanja tidak boleh kosong' }),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

export const voucherSchema = z.object({
  code: z.string().trim().min(3, { message: 'Kode voucher minimal 3 karakter' }).toUpperCase(),
  title: z.string().trim().min(3, { message: 'Judul promo minimal 3 karakter' }),
  description: z.string().optional().nullable(),
  discount_type: z.enum(['percentage', 'fixed']),
  discount_value: z.number().min(1, { message: 'Nilai diskon harus lebih dari 0' }),
  min_spend: z.number().min(0).default(0),
  max_discount: z.number().min(0).optional().nullable(),
  quota: z.number().int().min(1).default(100),
  valid_from: z.string().default(() => new Date().toISOString()),
  valid_until: z.string().default(() => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()),
  is_active: z.boolean().default(true),
});

export type VoucherFormData = z.infer<typeof voucherSchema>;

export const customerAuthSchema = z.object({
  email: z.string().trim().email({ message: 'Email tidak valid' }),
  password: z.string().min(6, { message: 'Kata sandi minimal 6 karakter' }),
  full_name: z.string().trim().min(2, { message: 'Nama minimal 2 karakter' }).optional(),
  phone_number: z.string().trim().min(8).optional().nullable(),
});

export type CustomerAuthData = z.infer<typeof customerAuthSchema>;

