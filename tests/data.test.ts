import { describe, it, expect } from 'vitest';
import { getPublishedProducts, getProductBySlug } from '../lib/data/products';
import { getPublishedArticles, getArticleBySlug } from '../lib/data/articles';
import { saveContactMessage } from '../lib/data/contact';

describe('Data Access & Security Guard Tests', () => {
  it('public products query only returns published products', async () => {
    const products = await getPublishedProducts();
    expect(products.length).toBeGreaterThan(0);
    products.forEach((p) => {
      expect(p.status).toBe('published');
    });
  });

  it('getProductBySlug retrieves valid published product', async () => {
    const product = await getProductBySlug('lemongrass-ginger-vitality');
    expect(product).not.toBeNull();
    expect(product?.name).toContain('Lemongrass Ginger');
  });

  it('public articles query only returns published articles', async () => {
    const articles = await getPublishedArticles();
    expect(articles.length).toBeGreaterThan(0);
    articles.forEach((a) => {
      expect(a.status).toBe('published');
    });

    const single = await getArticleBySlug(articles[0].slug);
    expect(single).not.toBeNull();
  });

  it('saves contact messages safely', async () => {
    const res = await saveContactMessage({
      name: 'Budi Santoso',
      email: 'budi@example.com',
      subject: 'Uji Pengiriman',
      message: 'Halo, ini adalah pengujian pesan kontak untuk validasi sistem.',
    });
    expect(res.success).toBe(true);
  });
});
