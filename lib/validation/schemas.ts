import { z } from 'zod';

export function getFirstErrorMessage(error: any): string {
  if (!error) return 'Invalid input';
  const issue = error.issues?.[0] || error.errors?.[0];
  return issue?.message || 'Invalid input';
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
  name: z.string().trim().min(2, { message: 'Name must have at least 2 characters' }).max(100),
  email: z.string().trim().email({ message: 'Invalid email address format' }),
  subject: z.string().trim().min(3, { message: 'Subject must have at least 3 characters' }).max(150),
  message: z.string().trim().min(10, { message: 'Message must have at least 10 characters' }).max(2000),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export const adminLoginSchema = z.object({
  email: z.string().trim().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

export type AdminLoginData = z.infer<typeof adminLoginSchema>;

export const categorySchema = z.object({
  name: z.string().trim().min(2, { message: 'Category name is required' }),
  slug: z.string().trim().min(2, { message: 'Slug is required' }).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: 'Slug must consist of lowercase letters and hyphens (-) without spaces' }),
  description: z.string().optional().nullable(),
  type: z.enum(['product', 'article']),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

export const productSchema = z.object({
  name: z.string().trim().min(3, { message: 'Product name is required' }),
  slug: z.string().trim().min(3, { message: 'Slug is required' }).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: 'Slug must consist of lowercase letters and hyphens (-) without spaces' }),
  tagline: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  category_id: z.string().uuid().optional().nullable(),
  ingredients: z.array(z.string()).default([]),
  brewing_guide: z.object({
    water_temp: z.string().default('90°C'),
    steep_time: z.string().default('3-5 Mins'),
    serving_size: z.string().default('250ml'),
    notes: z.string().optional().default(''),
  }).default({
    water_temp: '90°C',
    steep_time: '3-5 Mins',
    serving_size: '250ml',
    notes: '',
  }),
  characteristics: z.record(z.string(), z.string()).default({}),
  packaging_info: z.string().optional().nullable(),
  price: z.number().min(0, { message: 'Price cannot be negative' }),
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
  title: z.string().trim().min(5, { message: 'Article title must be at least 5 characters' }),
  slug: z.string().trim().min(3, { message: 'Slug is required' }).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: 'Slug must consist of lowercase letters and hyphens (-) without spaces' }),
  excerpt: z.string().optional().nullable(),
  content: z.string().trim().min(20, { message: 'Article content must be at least 20 characters' }),
  category_id: z.string().uuid().optional().nullable(),
  featured_image: z.string().optional().nullable(),
  author_name: z.string().default('CHANGKEER Team'),
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
  product_name: z.string().min(1, { message: 'Product name is required' }),
  product_slug: z.string().min(1),
  product_image: z.string().optional().nullable(),
  serving_size: z.enum(['regular', 'pot']).default('regular'),
  temperature: z.enum(['hot', 'iced']),
  sweetness_level: z.string().default('0%'),
  sweetener_type: z.enum(['sorghum', 'honey', 'stevia']).optional(),
  ice_level: z.string().optional().default('normal'),
  selected_addons: z.array(z.object({
    id: z.string(),
    name: z.string(),
    price: z.number().min(0),
  })).default([]),
  unit_price: z.number().min(0),
  quantity: z.number().int().min(1, { message: 'Quantity must be at least 1' }),
  subtotal: z.number().min(0).optional(),
  item_notes: z.string().max(200).optional().default(''),
});

export const checkoutSchema = z.object({
  customer_name: z.string().trim().min(2, { message: 'Customer name must be at least 2 characters' }).max(100),
  customer_email: z.string().trim().email({ message: 'Invalid email address' }),
  customer_phone: z.string().trim().min(8, { message: 'Phone / WhatsApp number must be at least 8 digits' }).max(20),
  order_type: z.enum(['dine_in', 'takeaway', 'delivery']),
  table_number: z.string().optional().nullable(),
  pickup_time: z.string().optional().nullable(),
  delivery_address: z.string().optional().nullable(),
  delivery_notes: z.string().optional().nullable(),
  subtotal: z.number().min(0).optional(),
  discount_amount: z.number().min(0).optional().default(0),
  delivery_fee: z.number().min(0).optional().default(0),
  tax_amount: z.number().min(0).optional().default(0),
  total_amount: z.number().min(0).optional(),
  voucher_id: z.string().optional().nullable(),
  voucher_code: z.string().optional().nullable(),
  payment_method: z.enum(['qris', 'cashier', 'bank_transfer']),
  notes: z.string().max(500).optional().nullable(),
  items: z.array(orderItemInputSchema).min(1, { message: 'Shopping cart cannot be empty' }),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

export const voucherSchema = z.object({
  code: z.string().trim().min(3, { message: 'Voucher code must be at least 3 characters' }).toUpperCase(),
  title: z.string().trim().min(3, { message: 'Promo title must be at least 3 characters' }),
  description: z.string().optional().nullable(),
  discount_type: z.enum(['percentage', 'fixed']),
  discount_value: z.number().min(1, { message: 'Discount value must be greater than 0' }),
  min_spend: z.number().min(0).default(0),
  max_discount: z.number().min(0).optional().nullable(),
  quota: z.number().int().min(1).default(100),
  valid_from: z.string().default(() => new Date().toISOString()),
  valid_until: z.string().default(() => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()),
  is_active: z.boolean().default(true),
});

export type VoucherFormData = z.infer<typeof voucherSchema>;

export const customerAuthSchema = z.object({
  email: z.string().trim().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  full_name: z.string().trim().min(2, { message: 'Name must be at least 2 characters' }).optional(),
  phone_number: z.string().trim().min(8).optional().nullable(),
});

export type CustomerAuthData = z.infer<typeof customerAuthSchema>;

