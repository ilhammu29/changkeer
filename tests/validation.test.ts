import { describe, it, expect } from 'vitest';
import {
  contactFormSchema,
  productSchema,
  categorySchema,
  adminLoginSchema,
  articleSchema,
} from '../lib/validation/schemas';

describe('Validation Schemas Unit Tests', () => {
  it('validates correct contact form input', () => {
    const validData = {
      name: 'Rian Pratama',
      email: 'rian@example.com',
      subject: 'Pertanyaan Kemitraan Kafe',
      message: 'Halo tim CHANGKEER, kami tertarik menyajikan varian teh herbal Anda di kafe kami.',
    };
    const result = contactFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('rejects invalid email in contact form', () => {
    const invalidData = {
      name: 'Rian',
      email: 'not-an-email',
      subject: 'Pertanyaan',
      message: 'Pesan pengujian kontak dengan panjang cukup.',
    };
    const result = contactFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues?.[0] || (result.error as any).errors?.[0];
      expect(issue?.path[0]).toBe('email');
    }
  });

  it('rejects contact message shorter than 10 characters', () => {
    const invalidData = {
      name: 'Rian',
      email: 'rian@example.com',
      subject: 'Pertanyaan',
      message: 'Pendek',
    };
    const result = contactFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('validates product schema and defaults', () => {
    const validProduct = {
      name: 'CHANGKEER Lemongrass Ginger',
      slug: 'changkeer-lemongrass-ginger',
      price: 85000,
      status: 'published',
      brewing_guide: {
        water_temp: '95°C',
        steep_time: '4 Menit',
        serving_size: '250ml',
      },
    };
    const result = productSchema.safeParse(validProduct);
    expect(result.success).toBe(true);
  });

  it('rejects invalid slug with spaces or uppercase', () => {
    const invalidCategory = {
      name: 'Tisane Bunga',
      slug: 'Tisane Bunga 123',
      type: 'product',
    };
    const result = categorySchema.safeParse(invalidCategory);
    expect(result.success).toBe(false);
  });

  it('validates article schema', () => {
    const validArticle = {
      title: 'Judul Artikel Edukasi Teh',
      slug: 'judul-artikel-edukasi-teh',
      content: 'Ini adalah isi konten artikel edukasi teh herbal nusantara yang lengkap dan bermanfaat.',
      status: 'published' as const,
    };
    expect(articleSchema.safeParse(validArticle).success).toBe(true);
  });

  it('validates admin login credentials', () => {
    const validLogin = {
      email: 'admin@changkeer.com',
      password: 'password123',
    };
    expect(adminLoginSchema.safeParse(validLogin).success).toBe(true);

    const invalidLogin = {
      email: 'admin@changkeer.com',
      password: '123',
    };
    expect(adminLoginSchema.safeParse(invalidLogin).success).toBe(false);
  });
});
