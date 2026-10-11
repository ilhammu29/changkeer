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
