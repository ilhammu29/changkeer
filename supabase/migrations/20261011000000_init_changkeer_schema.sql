-- ==============================================================================
-- CHANGKEER Database Schema & Security Architecture Migration
-- ==============================================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Helper trigger for automatic updated_at timestamp
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- 2. Tables Definition
-- ==============================================================================

-- 2.1 Admin Profiles
CREATE TABLE IF NOT EXISTS admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'editor')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trigger_admin_profiles_updated_at ON admin_profiles;
CREATE TRIGGER trigger_admin_profiles_updated_at
  BEFORE UPDATE ON admin_profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 2.2 Categories (for both products and articles)
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  type TEXT NOT NULL DEFAULT 'product' CHECK (type IN ('product', 'article')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_type ON categories(type);

-- 2.3 Products
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  tagline TEXT,
  description TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  ingredients JSONB NOT NULL DEFAULT '[]'::jsonb,
  brewing_guide JSONB NOT NULL DEFAULT '{"water_temp": "90-95°C", "steep_time": "3-5 Menit", "serving_size": "250ml", "notes": "Dapat diseduh ulang hingga 2 kali"}'::jsonb,
  characteristics JSONB NOT NULL DEFAULT '[]'::jsonb,
  packaging_info TEXT,
  price NUMERIC(12,2) NOT NULL DEFAULT 0,
  weight_grams INTEGER DEFAULT 50,
  featured_image TEXT,
  gallery JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);

DROP TRIGGER IF EXISTS trigger_products_updated_at ON products;
CREATE TRIGGER trigger_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 2.4 Articles (Media & Berita)
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  featured_image TEXT,
  author_name TEXT NOT NULL DEFAULT 'Tim CHANGKEER',
  read_time_minutes INTEGER NOT NULL DEFAULT 3,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  seo_title TEXT,
  seo_description TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category_id);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);

DROP TRIGGER IF EXISTS trigger_articles_updated_at ON articles;
CREATE TRIGGER trigger_articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 2.5 Page Contents (Structured Content Editor)
CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  sections JSONB NOT NULL DEFAULT '{}'::jsonb,
  seo_title TEXT,
  seo_description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);

DROP TRIGGER IF EXISTS trigger_pages_updated_at ON pages;
CREATE TRIGGER trigger_pages_updated_at
  BEFORE UPDATE ON pages
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 2.6 Media Assets (Media Library)
CREATE TABLE IF NOT EXISTS media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  alt_text TEXT,
  public_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_media_assets_bucket ON media_assets(bucket);

-- 2.7 Site Settings
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  site_name TEXT NOT NULL DEFAULT 'CHANGKEER',
  tagline TEXT NOT NULL DEFAULT 'More Than Tea. A Better You.',
  contact_email TEXT DEFAULT 'halo@changkeer.com',
  contact_phone TEXT DEFAULT '+62 812-3456-7890',
  contact_address TEXT DEFAULT 'Jl. Harmoni Alam No. 8, Bandung, Jawa Barat',
  social_instagram TEXT DEFAULT 'https://instagram.com/changkeer.tea',
  social_youtube TEXT DEFAULT 'https://youtube.com/@changkeer',
  social_tiktok TEXT DEFAULT 'https://tiktok.com/@changkeer',
  raw_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trigger_site_settings_updated_at ON site_settings;
CREATE TRIGGER trigger_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 2.8 Contact Messages
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_created ON contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_is_read ON contact_messages(is_read);

-- ==============================================================================
-- 3. Row Level Security (RLS) & Policies
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Helper security function: Check if current user is verified admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_profiles
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3.1 admin_profiles Policies
DROP POLICY IF EXISTS "Admins can view all admin profiles" ON admin_profiles;
CREATE POLICY "Admins can view all admin profiles"
  ON admin_profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

DROP POLICY IF EXISTS "Super admins can manage admin profiles" ON admin_profiles;
CREATE POLICY "Super admins can manage admin profiles"
  ON admin_profiles FOR ALL
  TO authenticated
  USING (id = auth.uid());

-- 3.2 categories Policies
DROP POLICY IF EXISTS "Public can view categories" ON categories;
CREATE POLICY "Public can view categories"
  ON categories FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins can manage categories" ON categories;
CREATE POLICY "Admins can manage categories"
  ON categories FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- 3.3 products Policies
DROP POLICY IF EXISTS "Public can view published products" ON products;
CREATE POLICY "Public can view published products"
  ON products FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

DROP POLICY IF EXISTS "Admins have full access to products" ON products;
CREATE POLICY "Admins have full access to products"
  ON products FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- 3.4 articles Policies
DROP POLICY IF EXISTS "Public can view published articles" ON articles;
CREATE POLICY "Public can view published articles"
  ON articles FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

DROP POLICY IF EXISTS "Admins have full access to articles" ON articles;
CREATE POLICY "Admins have full access to articles"
  ON articles FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- 3.5 pages Policies
DROP POLICY IF EXISTS "Public can view pages" ON pages;
CREATE POLICY "Public can view pages"
  ON pages FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins can manage pages" ON pages;
CREATE POLICY "Admins can manage pages"
  ON pages FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- 3.6 media_assets Policies
DROP POLICY IF EXISTS "Public can view media assets" ON media_assets;
CREATE POLICY "Public can view media assets"
  ON media_assets FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins can manage media assets" ON media_assets;
CREATE POLICY "Admins can manage media assets"
  ON media_assets FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- 3.7 site_settings Policies
DROP POLICY IF EXISTS "Public can view site settings" ON site_settings;
CREATE POLICY "Public can view site settings"
  ON site_settings FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins can manage site settings" ON site_settings;
CREATE POLICY "Admins can manage site settings"
  ON site_settings FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- 3.8 contact_messages Policies (STRICT SECURITY)
DROP POLICY IF EXISTS "Public can submit contact messages" ON contact_messages;
CREATE POLICY "Public can submit contact messages"
  ON contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Only admins can view contact messages" ON contact_messages;
CREATE POLICY "Only admins can view contact messages"
  ON contact_messages FOR SELECT
  TO authenticated
  USING (is_admin());

DROP POLICY IF EXISTS "Only admins can update or delete contact messages" ON contact_messages;
CREATE POLICY "Only admins can update or delete contact messages"
  ON contact_messages FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Only admins can delete contact messages" ON contact_messages;
CREATE POLICY "Only admins can delete contact messages"
  ON contact_messages FOR DELETE
  TO authenticated
  USING (is_admin());

-- ==============================================================================
-- 4. Storage Buckets & Policies Setup
-- ==============================================================================

-- Insert default public buckets into storage.buckets if not exists
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('product-images', 'product-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']),
  ('article-images', 'article-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']),
  ('site-media', 'site-media', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'video/mp4'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage RLS Policies
DROP POLICY IF EXISTS "Public Access for Public Buckets" ON storage.objects;
CREATE POLICY "Public Access for Public Buckets"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id IN ('product-images', 'article-images', 'site-media'));

DROP POLICY IF EXISTS "Admin Upload Access for Buckets" ON storage.objects;
CREATE POLICY "Admin Upload Access for Buckets"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id IN ('product-images', 'article-images', 'site-media')
    AND is_admin()
  );

DROP POLICY IF EXISTS "Admin Update Access for Buckets" ON storage.objects;
CREATE POLICY "Admin Update Access for Buckets"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id IN ('product-images', 'article-images', 'site-media')
    AND is_admin()
  );

DROP POLICY IF EXISTS "Admin Delete Access for Buckets" ON storage.objects;
CREATE POLICY "Admin Delete Access for Buckets"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id IN ('product-images', 'article-images', 'site-media')
    AND is_admin()
  );

-- ==============================================================================
-- 5. Seed Data (Categories, Initial Products, Articles, Pages, Settings)
-- ==============================================================================

-- Categories Seed (Deterministic RFC 4122 v4 UUIDs for foreign key stability)
INSERT INTO categories (id, name, slug, description, type)
VALUES
  ('c0000000-0000-4000-8000-000000000001', 'Spring Blends (Musim Semi)', 'spring-season', 'Racikan herbal aromatik & floral menyambut kebangkitan alam di musim semi.', 'product'),
  ('c0000000-0000-4000-8000-000000000002', 'Summer Blends (Musim Panas)', 'summer-season', 'Seduhan herba citrus dingin & menyegarkan penawar terik cuaca tropis.', 'product'),
  ('c0000000-0000-4000-8000-000000000003', 'Autumn Blends (Musim Gugur)', 'autumn-season', 'Sentuhan osmanthus, barley panggang & rempah hangat di musim hujan.', 'product'),
  ('c0000000-0000-4000-8000-000000000004', 'Winter Blends (Musim Dingin)', 'winter-season', 'Kedalaman kayu manis, jahe & buah longan menentramkan tubuh di hawa dingin.', 'product'),
  ('c0000000-0000-4000-8000-000000000010', 'Edukasi & Tradisi Teh', 'edukasi-tradisi', 'Wawasan seputar tanaman herbal nusantara, teknik seduh, dan filosofi hidup selaras alam.', 'article'),
  ('c0000000-0000-4000-8000-000000000011', 'Gaya Hidup Sehat', 'gaya-hidup-sehat', 'Inspirasi rutinitas harian bernutrisi dan kesadaran mind-body.', 'article')
ON CONFLICT (slug) DO NOTHING;

-- Products Seed (Database-generated gen_random_uuid() for primary keys, dynamic subqueries for foreign keys)
INSERT INTO products (
  name, slug, tagline, description, category_id,
  ingredients, brewing_guide, characteristics, packaging_info,
  price, weight_grams, featured_image, gallery, is_featured, status,
  seo_title, seo_description
)
VALUES
  (
    'CHANGKEER First Bloom',
    'start-of-spring',
    'Start of Spring (立春) • Light, floral and a little fruity.',
    'Racikan teh herbal fungsional First Bloom terinspirasi 24 Solar Terms (Start of Spring - 立春). Menggunakan racikan bahan alami pilihan tanpa pemutih dan bebas mikroplastik serta bebas daun senna keras.',
    (SELECT id FROM categories WHERE slug = 'spring-season'),
    '["Jasmine flowers","Dried pear","Goji"]'::jsonb,
    '{"water_temp":"80°C - 85°C","steep_time":"2-3 Menit","serving_size":"250ml - 300ml","notes":"Light, floral and a little fruity."}'::jsonb,
    '{"aroma":"Light, floral and a little fruity.","taste":"Harmonis & Alami (Hot or iced)","body":"Silky smooth","caffeine":"Bebas Senna & Alami Rendah Kafein"}'::jsonb,
    'Kemasan pouch eksklusif bebas mikroplastik (microplastic-free & bleach-free).',
    24000,
    50,
    '/images/products/start-of-spring.jpg',
    '["/images/products/start-of-spring.jpg","/images/products-nobg/start-of-spring.png"]'::jsonb,
    true,
    'published',
    'CHANGKEER First Bloom - Start of Spring Herbal Tea',
    'Teh herbal fungsional CHANGKEER First Bloom (Start of Spring). 100% alami tanpa daun senna & bebas mikroplastik.'
  ),
  (
    'CHANGKEER Rain Garden',
    'rain-water',
    'Rain Water (雨水) • Rose up front, soft ginger warmth.',
    'Racikan teh herbal fungsional Rain Garden terinspirasi 24 Solar Terms (Rain Water - 雨水). Menggunakan racikan bahan alami pilihan tanpa pemutih dan bebas mikroplastik serta bebas daun senna keras.',
    (SELECT id FROM categories WHERE slug = 'spring-season'),
    '["Rose buds","Ginger","Red dates"]'::jsonb,
    '{"water_temp":"90°C - 95°C","steep_time":"2-3 Menit","serving_size":"250ml - 300ml","notes":"Rose up front, soft ginger warmth."}'::jsonb,
    '{"aroma":"Rose up front, soft ginger warmth.","taste":"Harmonis & Alami (Best hot)","body":"Silky smooth","caffeine":"Bebas Senna & Alami Rendah Kafein"}'::jsonb,
    'Kemasan pouch eksklusif bebas mikroplastik (microplastic-free & bleach-free).',
    20000,
    50,
    '/images/products/rain-water.jpg',
    '["/images/products/rain-water.jpg","/images/products-nobg/rain-water.png"]'::jsonb,
    false,
    'published',
    'CHANGKEER Rain Garden - Rain Water Herbal Tea',
    'Teh herbal fungsional CHANGKEER Rain Garden (Rain Water). 100% alami tanpa daun senna & bebas mikroplastik.'
  ),
  (
    'CHANGKEER Green Wake',
    'awakening-of-insects',
    'Awakening of Insects (惊蛰) • Fresh and grassy, with a pandan finish.',
    'Racikan teh herbal fungsional Green Wake terinspirasi 24 Solar Terms (Awakening of Insects - 惊蛰). Menggunakan racikan bahan alami pilihan tanpa pemutih dan bebas mikroplastik serta bebas daun senna keras.',
    (SELECT id FROM categories WHERE slug = 'spring-season'),
    '["Mint","Lemongrass","Pandan"]'::jsonb,
    '{"water_temp":"80°C - 85°C","steep_time":"2-3 Menit","serving_size":"250ml - 300ml","notes":"Fresh and grassy, with a pandan finish."}'::jsonb,
    '{"aroma":"Fresh and grassy, with a pandan finish.","taste":"Harmonis & Alami (Best iced)","body":"Silky smooth","caffeine":"Bebas Senna & Alami Rendah Kafein"}'::jsonb,
    'Kemasan pouch eksklusif bebas mikroplastik (microplastic-free & bleach-free).',
    15000,
    50,
    '/images/products/awakening-of-insects.jpg',
    '["/images/products/awakening-of-insects.jpg","/images/products-nobg/awakening-of-insects.png"]'::jsonb,
    false,
    'published',
    'CHANGKEER Green Wake - Awakening of Insects Herbal Tea',
    'Teh herbal fungsional CHANGKEER Green Wake (Awakening of Insects). 100% alami tanpa daun senna & bebas mikroplastik.'
  ),
  (
    'CHANGKEER Even Day',
    'spring-equinox',
    'Spring Equinox (春分) • Half floral, half fruity.',
    'Racikan teh herbal fungsional Even Day terinspirasi 24 Solar Terms (Spring Equinox - 春分). Menggunakan racikan bahan alami pilihan tanpa pemutih dan bebas mikroplastik serta bebas daun senna keras.',
    (SELECT id FROM categories WHERE slug = 'spring-season'),
    '["Chrysanthemum","Rose buds","Goji"]'::jsonb,
    '{"water_temp":"80°C - 85°C","steep_time":"2-3 Menit","serving_size":"250ml - 300ml","notes":"Half floral, half fruity."}'::jsonb,
    '{"aroma":"Half floral, half fruity.","taste":"Harmonis & Alami (Hot or iced)","body":"Silky smooth","caffeine":"Bebas Senna & Alami Rendah Kafein"}'::jsonb,
    'Kemasan pouch eksklusif bebas mikroplastik (microplastic-free & bleach-free).',
    22000,
    50,
    '/images/products/spring-equinox.jpg',
    '["/images/products/spring-equinox.jpg","/images/products-nobg/spring-equinox.png"]'::jsonb,
    false,
    'published',
    'CHANGKEER Even Day - Spring Equinox Herbal Tea',
    'Teh herbal fungsional CHANGKEER Even Day (Spring Equinox). 100% alami tanpa daun senna & bebas mikroplastik.'
  ),
  (
    'CHANGKEER Clear Sky',
    'clear-and-bright',
    'Clear and Bright (清明) • Blue in the cup, purple once the lemon goes in.',
    'Racikan teh herbal fungsional Clear Sky terinspirasi 24 Solar Terms (Clear and Bright - 清明). Menggunakan racikan bahan alami pilihan tanpa pemutih dan bebas mikroplastik serta bebas daun senna keras.',
    (SELECT id FROM categories WHERE slug = 'spring-season'),
    '["Butterfly pea","Lemongrass","Lemon"]'::jsonb,
    '{"water_temp":"80°C - 85°C","steep_time":"2-3 Menit","serving_size":"250ml - 300ml","notes":"Blue in the cup, purple once the lemon goes in."}'::jsonb,
    '{"aroma":"Blue in the cup, purple once the lemon goes in.","taste":"Harmonis & Alami (Best iced)","body":"Silky smooth","caffeine":"Bebas Senna & Alami Rendah Kafein"}'::jsonb,
    'Kemasan pouch eksklusif bebas mikroplastik (microplastic-free & bleach-free).',
    18000,
    50,
    '/images/products/clear-and-bright.jpg',
    '["/images/products/clear-and-bright.jpg","/images/products-nobg/clear-and-bright.png"]'::jsonb,
    false,
    'published',
    'CHANGKEER Clear Sky - Clear and Bright Herbal Tea',
    'Teh herbal fungsional CHANGKEER Clear Sky (Clear and Bright). 100% alami tanpa daun senna & bebas mikroplastik.'
  ),
  (
    'CHANGKEER Barley Field',
    'grain-rain',
    'Grain Rain (谷雨) • Toasty and nutty, with a honeyed flower note.',
    'Racikan teh herbal fungsional Barley Field terinspirasi 24 Solar Terms (Grain Rain - 谷雨). Menggunakan racikan bahan alami pilihan tanpa pemutih dan bebas mikroplastik serta bebas daun senna keras.',
    (SELECT id FROM categories WHERE slug = 'spring-season'),
    '["Roasted barley","Osmanthus"]'::jsonb,
    '{"water_temp":"80°C - 85°C","steep_time":"2-3 Menit","serving_size":"250ml - 300ml","notes":"Toasty and nutty, with a honeyed flower note."}'::jsonb,
    '{"aroma":"Toasty and nutty, with a honeyed flower note.","taste":"Harmonis & Alami (Hot or iced)","body":"Silky smooth","caffeine":"Bebas Senna & Alami Rendah Kafein"}'::jsonb,
    'Kemasan pouch eksklusif bebas mikroplastik (microplastic-free & bleach-free).',
    20000,
    50,
    '/images/products/grain-rain.jpg',
    '["/images/products/grain-rain.jpg","/images/products-nobg/grain-rain.png"]'::jsonb,
    false,
    'published',
    'CHANGKEER Barley Field - Grain Rain Herbal Tea',
    'Teh herbal fungsional CHANGKEER Barley Field (Grain Rain). 100% alami tanpa daun senna & bebas mikroplastik.'
  ),
  (
    'CHANGKEER Hibiscus Sun',
    'start-of-summer',
    'Start of Summer (立夏) • Tart, ruby-red and very refreshing.',
    'Racikan teh herbal fungsional Hibiscus Sun terinspirasi 24 Solar Terms (Start of Summer - 立夏). Menggunakan racikan bahan alami pilihan tanpa pemutih dan bebas mikroplastik serta bebas daun senna keras.',
    (SELECT id FROM categories WHERE slug = 'summer-season'),
    '["Hibiscus","Orange peel","Mint"]'::jsonb,
    '{"water_temp":"80°C - 85°C","steep_time":"2-3 Menit","serving_size":"250ml - 300ml","notes":"Tart, ruby-red and very refreshing."}'::jsonb,
    '{"aroma":"Tart, ruby-red and very refreshing.","taste":"Harmonis & Alami (Best iced)","body":"Silky smooth","caffeine":"Bebas Senna & Alami Rendah Kafein"}'::jsonb,
    'Kemasan pouch eksklusif bebas mikroplastik (microplastic-free & bleach-free).',
    18000,
    50,
    '/images/products/start-of-summer.jpg',
    '["/images/products/start-of-summer.jpg","/images/products-nobg/start-of-summer.png"]'::jsonb,
    true,
    'published',
    'CHANGKEER Hibiscus Sun - Start of Summer Herbal Tea',
    'Teh herbal fungsional CHANGKEER Hibiscus Sun (Start of Summer). 100% alami tanpa daun senna & bebas mikroplastik.'
  ),
  (
    'CHANGKEER Pandan Lime',
    'grain-buds',
    'Grain Buds (小满) • Green and citrusy.',
    'Racikan teh herbal fungsional Pandan Lime terinspirasi 24 Solar Terms (Grain Buds - 小满). Menggunakan racikan bahan alami pilihan tanpa pemutih dan bebas mikroplastik serta bebas daun senna keras.',
    (SELECT id FROM categories WHERE slug = 'summer-season'),
    '["Pandan","Lemongrass","Lime leaf"]'::jsonb,
    '{"water_temp":"80°C - 85°C","steep_time":"2-3 Menit","serving_size":"250ml - 300ml","notes":"Green and citrusy."}'::jsonb,
    '{"aroma":"Green and citrusy.","taste":"Harmonis & Alami (Best iced)","body":"Silky smooth","caffeine":"Bebas Senna & Alami Rendah Kafein"}'::jsonb,
    'Kemasan pouch eksklusif bebas mikroplastik (microplastic-free & bleach-free).',
    15000,
    50,
    '/images/products/grain-buds.jpg',
    '["/images/products/grain-buds.jpg","/images/products-nobg/grain-buds.png"]'::jsonb,
    false,
    'published',
    'CHANGKEER Pandan Lime - Grain Buds Herbal Tea',
    'Teh herbal fungsional CHANGKEER Pandan Lime (Grain Buds). 100% alami tanpa daun senna & bebas mikroplastik.'
  ),
  (
    'CHANGKEER Mango Jasmine',
    'grain-in-ear',
    'Grain in Ear (芒种) • Ripe fruit with a jasmine lift.',
    'Racikan teh herbal fungsional Mango Jasmine terinspirasi 24 Solar Terms (Grain in Ear - 芒种). Menggunakan racikan bahan alami pilihan tanpa pemutih dan bebas mikroplastik serta bebas daun senna keras.',
    (SELECT id FROM categories WHERE slug = 'summer-season'),
    '["Dried mango","Jasmine flowers"]'::jsonb,
    '{"water_temp":"80°C - 85°C","steep_time":"2-3 Menit","serving_size":"250ml - 300ml","notes":"Ripe fruit with a jasmine lift."}'::jsonb,
    '{"aroma":"Ripe fruit with a jasmine lift.","taste":"Harmonis & Alami (Best iced)","body":"Silky smooth","caffeine":"Bebas Senna & Alami Rendah Kafein"}'::jsonb,
    'Kemasan pouch eksklusif bebas mikroplastik (microplastic-free & bleach-free).',
    26000,
    50,
    '/images/products/grain-in-ear.jpg',
    '["/images/products/grain-in-ear.jpg","/images/products-nobg/grain-in-ear.png"]'::jsonb,
    false,
    'published',
    'CHANGKEER Mango Jasmine - Grain in Ear Herbal Tea',
    'Teh herbal fungsional CHANGKEER Mango Jasmine (Grain in Ear). 100% alami tanpa daun senna & bebas mikroplastik.'
  ),
  (
    'CHANGKEER Longest Day',
    'summer-solstice',
    'Summer Solstice (夏至) • Bright, clean and cooling.',
    'Racikan teh herbal fungsional Longest Day terinspirasi 24 Solar Terms (Summer Solstice - 夏至). Menggunakan racikan bahan alami pilihan tanpa pemutih dan bebas mikroplastik serta bebas daun senna keras.',
    (SELECT id FROM categories WHERE slug = 'summer-season'),
    '["Chrysanthemum","Lemon","Mint"]'::jsonb,
    '{"water_temp":"80°C - 85°C","steep_time":"2-3 Menit","serving_size":"250ml - 300ml","notes":"Bright, clean and cooling."}'::jsonb,
    '{"aroma":"Bright, clean and cooling.","taste":"Harmonis & Alami (Best iced)","body":"Silky smooth","caffeine":"Bebas Senna & Alami Rendah Kafein"}'::jsonb,
    'Kemasan pouch eksklusif bebas mikroplastik (microplastic-free & bleach-free).',
    18000,
    50,
    '/images/products/summer-solstice.jpg',
    '["/images/products/summer-solstice.jpg","/images/products-nobg/summer-solstice.png"]'::jsonb,
    false,
    'published',
    'CHANGKEER Longest Day - Summer Solstice Herbal Tea',
    'Teh herbal fungsional CHANGKEER Longest Day (Summer Solstice). 100% alami tanpa daun senna & bebas mikroplastik.'
  ),
  (
    'CHANGKEER Cool Leaf',
    'minor-heat',
    'Minor Heat (小暑) • Minty and sharp.',
    'Racikan teh herbal fungsional Cool Leaf terinspirasi 24 Solar Terms (Minor Heat - 小暑). Menggunakan racikan bahan alami pilihan tanpa pemutih dan bebas mikroplastik serta bebas daun senna keras.',
    (SELECT id FROM categories WHERE slug = 'summer-season'),
    '["Mint","Lime leaf","Lemongrass"]'::jsonb,
    '{"water_temp":"80°C - 85°C","steep_time":"2-3 Menit","serving_size":"250ml - 300ml","notes":"Minty and sharp."}'::jsonb,
    '{"aroma":"Minty and sharp.","taste":"Harmonis & Alami (Best iced)","body":"Silky smooth","caffeine":"Bebas Senna & Alami Rendah Kafein"}'::jsonb,
    'Kemasan pouch eksklusif bebas mikroplastik (microplastic-free & bleach-free).',
    15000,
    50,
    '/images/products/minor-heat.jpg',
    '["/images/products/minor-heat.jpg","/images/products-nobg/minor-heat.png"]'::jsonb,
    false,
    'published',
    'CHANGKEER Cool Leaf - Minor Heat Herbal Tea',
    'Teh herbal fungsional CHANGKEER Cool Leaf (Minor Heat). 100% alami tanpa daun senna & bebas mikroplastik.'
  ),
  (
    'CHANGKEER Chrysanthemum Lemon',
    'major-heat',
    'Major Heat (大暑) • Our hot-season classic: mellow flowers, fresh citrus.',
    'Racikan teh herbal fungsional Chrysanthemum Lemon terinspirasi 24 Solar Terms (Major Heat - 大暑). Menggunakan racikan bahan alami pilihan tanpa pemutih dan bebas mikroplastik serta bebas daun senna keras.',
    (SELECT id FROM categories WHERE slug = 'summer-season'),
    '["Chrysanthemum","Lemon","Goji"]'::jsonb,
    '{"water_temp":"80°C - 85°C","steep_time":"2-3 Menit","serving_size":"250ml - 300ml","notes":"Our hot-season classic: mellow flowers, fresh citrus."}'::jsonb,
    '{"aroma":"Our hot-season classic: mellow flowers, fresh citrus.","taste":"Harmonis & Alami (Best iced)","body":"Silky smooth","caffeine":"Bebas Senna & Alami Rendah Kafein"}'::jsonb,
    'Kemasan pouch eksklusif bebas mikroplastik (microplastic-free & bleach-free).',
    20000,
    50,
    '/images/products/major-heat.jpg',
    '["/images/products/major-heat.jpg","/images/products-nobg/major-heat.png"]'::jsonb,
    false,
    'published',
    'CHANGKEER Chrysanthemum Lemon - Major Heat Herbal Tea',
    'Teh herbal fungsional CHANGKEER Chrysanthemum Lemon (Major Heat). 100% alami tanpa daun senna & bebas mikroplastik.'
  ),
  (
    'CHANGKEER Osmanthus Pear',
    'start-of-autumn',
    'Start of Autumn (立秋) • Apricot-scented flowers with soft pear.',
    'Racikan teh herbal fungsional Osmanthus Pear terinspirasi 24 Solar Terms (Start of Autumn - 立秋). Menggunakan racikan bahan alami pilihan tanpa pemutih dan bebas mikroplastik serta bebas daun senna keras.',
    (SELECT id FROM categories WHERE slug = 'autumn-season'),
    '["Osmanthus","Dried pear","Goji"]'::jsonb,
    '{"water_temp":"80°C - 85°C","steep_time":"2-3 Menit","serving_size":"250ml - 300ml","notes":"Apricot-scented flowers with soft pear."}'::jsonb,
    '{"aroma":"Apricot-scented flowers with soft pear.","taste":"Harmonis & Alami (Hot or iced)","body":"Silky smooth","caffeine":"Bebas Senna & Alami Rendah Kafein"}'::jsonb,
    'Kemasan pouch eksklusif bebas mikroplastik (microplastic-free & bleach-free).',
    26000,
    50,
    '/images/products/start-of-autumn.jpg',
    '["/images/products/start-of-autumn.jpg","/images/products-nobg/start-of-autumn.png"]'::jsonb,
    true,
    'published',
    'CHANGKEER Osmanthus Pear - Start of Autumn Herbal Tea',
    'Teh herbal fungsional CHANGKEER Osmanthus Pear (Start of Autumn). 100% alami tanpa daun senna & bebas mikroplastik.'
  ),
  (
    'CHANGKEER Late Rose',
    'end-of-heat',
    'End of Heat (处暑) • Rosy and tart, like fruit jam.',
    'Racikan teh herbal fungsional Late Rose terinspirasi 24 Solar Terms (End of Heat - 处暑). Menggunakan racikan bahan alami pilihan tanpa pemutih dan bebas mikroplastik serta bebas daun senna keras.',
    (SELECT id FROM categories WHERE slug = 'autumn-season'),
    '["Rose buds","Hibiscus","Dried apple"]'::jsonb,
    '{"water_temp":"80°C - 85°C","steep_time":"2-3 Menit","serving_size":"250ml - 300ml","notes":"Rosy and tart, like fruit jam."}'::jsonb,
    '{"aroma":"Rosy and tart, like fruit jam.","taste":"Harmonis & Alami (Hot or iced)","body":"Silky smooth","caffeine":"Bebas Senna & Alami Rendah Kafein"}'::jsonb,
    'Kemasan pouch eksklusif bebas mikroplastik (microplastic-free & bleach-free).',
    22000,
    50,
    '/images/products/end-of-heat.jpg',
    '["/images/products/end-of-heat.jpg","/images/products-nobg/end-of-heat.png"]'::jsonb,
    false,
    'published',
    'CHANGKEER Late Rose - End of Heat Herbal Tea',
    'Teh herbal fungsional CHANGKEER Late Rose (End of Heat). 100% alami tanpa daun senna & bebas mikroplastik.'
  ),
  (
    'CHANGKEER White Dew',
    'white-dew',
    'White Dew (白露) • Delicate and smooth. Try it with honey.',
    'Racikan teh herbal fungsional White Dew terinspirasi 24 Solar Terms (White Dew - 白露). Menggunakan racikan bahan alami pilihan tanpa pemutih dan bebas mikroplastik serta bebas daun senna keras.',
    (SELECT id FROM categories WHERE slug = 'autumn-season'),
    '["White chrysanthemum","Dried pear"]'::jsonb,
    '{"water_temp":"90°C - 95°C","steep_time":"2-3 Menit","serving_size":"250ml - 300ml","notes":"Delicate and smooth. Try it with honey."}'::jsonb,
    '{"aroma":"Delicate and smooth. Try it with honey.","taste":"Harmonis & Alami (Best hot)","body":"Silky smooth","caffeine":"Bebas Senna & Alami Rendah Kafein"}'::jsonb,
    'Kemasan pouch eksklusif bebas mikroplastik (microplastic-free & bleach-free).',
    22000,
    50,
    '/images/products/white-dew.jpg',
    '["/images/products/white-dew.jpg","/images/products-nobg/white-dew.png"]'::jsonb,
    false,
    'published',
    'CHANGKEER White Dew - White Dew Herbal Tea',
    'Teh herbal fungsional CHANGKEER White Dew (White Dew). 100% alami tanpa daun senna & bebas mikroplastik.'
  ),
  (
    'CHANGKEER Golden Hour',
    'autumn-equinox',
    'Autumn Equinox (秋分) • Toasty and golden.',
    'Racikan teh herbal fungsional Golden Hour terinspirasi 24 Solar Terms (Autumn Equinox - 秋分). Menggunakan racikan bahan alami pilihan tanpa pemutih dan bebas mikroplastik serta bebas daun senna keras.',
    (SELECT id FROM categories WHERE slug = 'autumn-season'),
    '["Osmanthus","Roasted barley","Orange peel"]'::jsonb,
    '{"water_temp":"80°C - 85°C","steep_time":"2-3 Menit","serving_size":"250ml - 300ml","notes":"Toasty and golden."}'::jsonb,
    '{"aroma":"Toasty and golden.","taste":"Harmonis & Alami (Hot or iced)","body":"Silky smooth","caffeine":"Bebas Senna & Alami Rendah Kafein"}'::jsonb,
    'Kemasan pouch eksklusif bebas mikroplastik (microplastic-free & bleach-free).',
    24000,
    50,
    '/images/products/autumn-equinox.jpg',
    '["/images/products/autumn-equinox.jpg","/images/products-nobg/autumn-equinox.png"]'::jsonb,
    false,
    'published',
    'CHANGKEER Golden Hour - Autumn Equinox Herbal Tea',
    'Teh herbal fungsional CHANGKEER Golden Hour (Autumn Equinox). 100% alami tanpa daun senna & bebas mikroplastik.'
  ),
  (
    'CHANGKEER First Rain',
    'cold-dew',
    'Cold Dew (寒露) • Warming ginger and naturally sweet dates, for the first wet evenings.',
    'Racikan teh herbal fungsional First Rain terinspirasi 24 Solar Terms (Cold Dew - 寒露). Menggunakan racikan bahan alami pilihan tanpa pemutih dan bebas mikroplastik serta bebas daun senna keras.',
    (SELECT id FROM categories WHERE slug = 'autumn-season'),
    '["Ginger","Goji","Red dates"]'::jsonb,
    '{"water_temp":"90°C - 95°C","steep_time":"2-3 Menit","serving_size":"250ml - 300ml","notes":"Warming ginger and naturally sweet dates, for the first wet evenings."}'::jsonb,
    '{"aroma":"Warming ginger and naturally sweet dates, for the first wet evenings.","taste":"Harmonis & Alami (Best hot)","body":"Silky smooth","caffeine":"Bebas Senna & Alami Rendah Kafein"}'::jsonb,
    'Kemasan pouch eksklusif bebas mikroplastik (microplastic-free & bleach-free).',
    20000,
    50,
    '/images/products/cold-dew.jpg',
    '["/images/products/cold-dew.jpg","/images/products-nobg/cold-dew.png"]'::jsonb,
    true,
    'published',
    'CHANGKEER First Rain - Cold Dew Herbal Tea',
    'Teh herbal fungsional CHANGKEER First Rain (Cold Dew). 100% alami tanpa daun senna & bebas mikroplastik.'
  ),
  (
    'CHANGKEER Ginger Rose',
    'frosts-descent',
    'Frost''s Descent (霜降) • Spiced and floral.',
    'Racikan teh herbal fungsional Ginger Rose terinspirasi 24 Solar Terms (Frost''s Descent - 霜降). Menggunakan racikan bahan alami pilihan tanpa pemutih dan bebas mikroplastik serta bebas daun senna keras.',
    (SELECT id FROM categories WHERE slug = 'autumn-season'),
    '["Ginger","Rose buds","Cinnamon"]'::jsonb,
    '{"water_temp":"90°C - 95°C","steep_time":"2-3 Menit","serving_size":"250ml - 300ml","notes":"Spiced and floral."}'::jsonb,
    '{"aroma":"Spiced and floral.","taste":"Harmonis & Alami (Best hot)","body":"Silky smooth","caffeine":"Bebas Senna & Alami Rendah Kafein"}'::jsonb,
    'Kemasan pouch eksklusif bebas mikroplastik (microplastic-free & bleach-free).',
    20000,
    50,
    '/images/products/frosts-descent.jpg',
    '["/images/products/frosts-descent.jpg","/images/products-nobg/frosts-descent.png"]'::jsonb,
    false,
    'published',
    'CHANGKEER Ginger Rose - Frost''s Descent Herbal Tea',
    'Teh herbal fungsional CHANGKEER Ginger Rose (Frost''s Descent). 100% alami tanpa daun senna & bebas mikroplastik.'
  ),
  (
    'CHANGKEER Spice Lantern',
    'start-of-winter',
    'Start of Winter (立冬) • Baked-apple warmth with a little clove.',
    'Racikan teh herbal fungsional Spice Lantern terinspirasi 24 Solar Terms (Start of Winter - 立冬). Menggunakan racikan bahan alami pilihan tanpa pemutih dan bebas mikroplastik serta bebas daun senna keras.',
    (SELECT id FROM categories WHERE slug = 'winter-season'),
    '["Cinnamon","Clove","Dried apple"]'::jsonb,
    '{"water_temp":"90°C - 95°C","steep_time":"2-3 Menit","serving_size":"250ml - 300ml","notes":"Baked-apple warmth with a little clove."}'::jsonb,
    '{"aroma":"Baked-apple warmth with a little clove.","taste":"Harmonis & Alami (Best hot)","body":"Silky smooth","caffeine":"Bebas Senna & Alami Rendah Kafein"}'::jsonb,
    'Kemasan pouch eksklusif bebas mikroplastik (microplastic-free & bleach-free).',
    22000,
    50,
    '/images/products/start-of-winter.jpg',
    '["/images/products/start-of-winter.jpg","/images/products-nobg/start-of-winter.png"]'::jsonb,
    true,
    'published',
    'CHANGKEER Spice Lantern - Start of Winter Herbal Tea',
    'Teh herbal fungsional CHANGKEER Spice Lantern (Start of Winter). 100% alami tanpa daun senna & bebas mikroplastik.'
  ),
  (
    'CHANGKEER Longan Nest',
    'minor-snow',
    'Minor Snow (小雪) • Caramel-sweet fruit, no sugar added.',
    'Racikan teh herbal fungsional Longan Nest terinspirasi 24 Solar Terms (Minor Snow - 小雪). Menggunakan racikan bahan alami pilihan tanpa pemutih dan bebas mikroplastik serta bebas daun senna keras.',
    (SELECT id FROM categories WHERE slug = 'winter-season'),
    '["Longan","Red dates","Goji"]'::jsonb,
    '{"water_temp":"90°C - 95°C","steep_time":"2-3 Menit","serving_size":"250ml - 300ml","notes":"Caramel-sweet fruit, no sugar added."}'::jsonb,
    '{"aroma":"Caramel-sweet fruit, no sugar added.","taste":"Harmonis & Alami (Best hot)","body":"Silky smooth","caffeine":"Bebas Senna & Alami Rendah Kafein"}'::jsonb,
    'Kemasan pouch eksklusif bebas mikroplastik (microplastic-free & bleach-free).',
    28000,
    50,
    '/images/products/minor-snow.jpg',
    '["/images/products/minor-snow.jpg","/images/products-nobg/minor-snow.png"]'::jsonb,
    false,
    'published',
    'CHANGKEER Longan Nest - Minor Snow Herbal Tea',
    'Teh herbal fungsional CHANGKEER Longan Nest (Minor Snow). 100% alami tanpa daun senna & bebas mikroplastik.'
  ),
  (
    'CHANGKEER Ginger Goji',
    'major-snow',
    'Major Snow (大雪) • The rainy-season favourite.',
    'Racikan teh herbal fungsional Ginger Goji terinspirasi 24 Solar Terms (Major Snow - 大雪). Menggunakan racikan bahan alami pilihan tanpa pemutih dan bebas mikroplastik serta bebas daun senna keras.',
    (SELECT id FROM categories WHERE slug = 'winter-season'),
    '["Ginger","Goji","Lemon"]'::jsonb,
    '{"water_temp":"90°C - 95°C","steep_time":"2-3 Menit","serving_size":"250ml - 300ml","notes":"The rainy-season favourite."}'::jsonb,
    '{"aroma":"The rainy-season favourite.","taste":"Harmonis & Alami (Best hot)","body":"Silky smooth","caffeine":"Bebas Senna & Alami Rendah Kafein"}'::jsonb,
    'Kemasan pouch eksklusif bebas mikroplastik (microplastic-free & bleach-free).',
    18000,
    50,
    '/images/products/major-snow.jpg',
    '["/images/products/major-snow.jpg","/images/products-nobg/major-snow.png"]'::jsonb,
    false,
    'published',
    'CHANGKEER Ginger Goji - Major Snow Herbal Tea',
    'Teh herbal fungsional CHANGKEER Ginger Goji (Major Snow). 100% alami tanpa daun senna & bebas mikroplastik.'
  ),
  (
    'CHANGKEER Solstice Cup',
    'winter-solstice',
    'Winter Solstice (冬至) • Deep, warm and gently floral.',
    'Racikan teh herbal fungsional Solstice Cup terinspirasi 24 Solar Terms (Winter Solstice - 冬至). Menggunakan racikan bahan alami pilihan tanpa pemutih dan bebas mikroplastik serta bebas daun senna keras.',
    (SELECT id FROM categories WHERE slug = 'winter-season'),
    '["Red dates","Ginger","Osmanthus"]'::jsonb,
    '{"water_temp":"90°C - 95°C","steep_time":"2-3 Menit","serving_size":"250ml - 300ml","notes":"Deep, warm and gently floral."}'::jsonb,
    '{"aroma":"Deep, warm and gently floral.","taste":"Harmonis & Alami (Best hot)","body":"Silky smooth","caffeine":"Bebas Senna & Alami Rendah Kafein"}'::jsonb,
    'Kemasan pouch eksklusif bebas mikroplastik (microplastic-free & bleach-free).',
    24000,
    50,
    '/images/products/winter-solstice.jpg',
    '["/images/products/winter-solstice.jpg","/images/products-nobg/winter-solstice.png"]'::jsonb,
    false,
    'published',
    'CHANGKEER Solstice Cup - Winter Solstice Herbal Tea',
    'Teh herbal fungsional CHANGKEER Solstice Cup (Winter Solstice). 100% alami tanpa daun senna & bebas mikroplastik.'
  ),
  (
    'CHANGKEER Red Date Warmth',
    'minor-cold',
    'Minor Cold (小寒) • Rich and mellow.',
    'Racikan teh herbal fungsional Red Date Warmth terinspirasi 24 Solar Terms (Minor Cold - 小寒). Menggunakan racikan bahan alami pilihan tanpa pemutih dan bebas mikroplastik serta bebas daun senna keras.',
    (SELECT id FROM categories WHERE slug = 'winter-season'),
    '["Red dates","Longan","Ginger"]'::jsonb,
    '{"water_temp":"90°C - 95°C","steep_time":"2-3 Menit","serving_size":"250ml - 300ml","notes":"Rich and mellow."}'::jsonb,
    '{"aroma":"Rich and mellow.","taste":"Harmonis & Alami (Best hot)","body":"Silky smooth","caffeine":"Bebas Senna & Alami Rendah Kafein"}'::jsonb,
    'Kemasan pouch eksklusif bebas mikroplastik (microplastic-free & bleach-free).',
    26000,
    50,
    '/images/products/minor-cold.jpg',
    '["/images/products/minor-cold.jpg","/images/products-nobg/minor-cold.png"]'::jsonb,
    false,
    'published',
    'CHANGKEER Red Date Warmth - Minor Cold Herbal Tea',
    'Teh herbal fungsional CHANGKEER Red Date Warmth (Minor Cold). 100% alami tanpa daun senna & bebas mikroplastik.'
  ),
  (
    'CHANGKEER Cinnamon Ember',
    'major-cold',
    'Major Cold (大寒) • Spicy-sweet, the last blend before spring.',
    'Racikan teh herbal fungsional Cinnamon Ember terinspirasi 24 Solar Terms (Major Cold - 大寒). Menggunakan racikan bahan alami pilihan tanpa pemutih dan bebas mikroplastik serta bebas daun senna keras.',
    (SELECT id FROM categories WHERE slug = 'winter-season'),
    '["Cinnamon","Ginger","Orange peel"]'::jsonb,
    '{"water_temp":"90°C - 95°C","steep_time":"2-3 Menit","serving_size":"250ml - 300ml","notes":"Spicy-sweet, the last blend before spring."}'::jsonb,
    '{"aroma":"Spicy-sweet, the last blend before spring.","taste":"Harmonis & Alami (Best hot)","body":"Silky smooth","caffeine":"Bebas Senna & Alami Rendah Kafein"}'::jsonb,
    'Kemasan pouch eksklusif bebas mikroplastik (microplastic-free & bleach-free).',
    18000,
    50,
    '/images/products/major-cold.jpg',
    '["/images/products/major-cold.jpg","/images/products-nobg/major-cold.png"]'::jsonb,
    false,
    'published',
    'CHANGKEER Cinnamon Ember - Major Cold Herbal Tea',
    'Teh herbal fungsional CHANGKEER Cinnamon Ember (Major Cold). 100% alami tanpa daun senna & bebas mikroplastik.'
  )
ON CONFLICT (slug) DO NOTHING;

-- Articles Seed (Database-generated gen_random_uuid(), dynamic subquery for category foreign key)
INSERT INTO articles (
  title, slug, excerpt, content, category_id,
  featured_image, author_name, read_time_minutes, is_featured, status,
  seo_title, seo_description, published_at
)
VALUES
  (
    'Seni Menyeduh Teh Herbal: Panduan Suhu dan Waktu untuk Ekstraksi Rasa Maksimal',
    'seni-menyeduh-teh-herbal-panduan-suhu-dan-waktu',
    'Setiap tanaman herbal memiliki sensitivitas berbeda terhadap temperatur air. Simak panduan lengkap agar aroma dan kebaikan alaminya tetap terjaga seutuhnya.',
    'Menyeduh teh herbal bukan sekadar menuang air panas ke dalam cangkir. Di balik secangkir seduhan yang nikmat, terdapat proses fisika dan kimia sederhana yang menentukan apakah minyak atsiri aromatik keluar dengan sempurna atau justru rusak oleh suhu berlebih.

### 1. Perbedaan Suhu: Daun Tipis vs Akar & Rimpang
Secara umum, bagian tanaman yang digunakan dapat dibagi menjadi dua kelompok:
- **Bunga dan Daun Halus (seperti Chamomile, Mint, Rosella):** Sebaiknya diseduh pada suhu antara 85°C hingga 90°C. Air yang baru mendidih sebaiknya didiamkan selama 1-2 menit sebelum dituangkan ke cangkir.
- **Rimpang dan Batang (seperti Jahe Merah, Serai, Kayu Manis):** Membutuhkan suhu 95°C hingga 100°C agar lapisan sel tanaman yang padat dapat melepaskan senyawa rasa dan kehangatannya.

### 2. Durasi Penyeduhan yang Tepat
Berbeda dari daun Camellia sinensis (teh hitam/hijau) yang bisa menjadi sangat pahit bila diseduh terlalu lama karena tanin tinggi, sebagian besar herbal tisane bebas tanin pahit. Rata-rata waktu seduh optimal adalah 4 hingga 6 menit dengan wadah tertutup.

Menutup cangkir saat proses penyeduhan sangat penting agar minyak esensial yang mudah menguap tidak hilang bersama uap air.',
    (SELECT id FROM categories WHERE slug = 'edukasi-tradisi'),
    '/images/articles/brewing-guide.jpg',
    'Master Blender CHANGKEER',
    4,
    true,
    'published',
    'Panduan Menyeduh Teh Herbal: Suhu dan Waktu Tepat | CHANGKEER',
    'Pelajari teknik menyeduh bunga, daun, dan rimpang herbal agar mendapatkan aroma dan rasa terbaik tanpa merusak kebaikan alaminya.',
    NOW() - INTERVAL '3 days'
  ),
  (
    'Eksplorasi Rempah Nusantara: Mengapa Jahe Merah dan Serai Menjadi Pasangan Abadi',
    'eksplorasi-rempah-nusantara-jahe-merah-dan-serai',
    'Kombinasi klasik jahe merah dan serai telah menemani masyarakat kepulauan nusantara selama berabad-abad. Berikut alasan ilmiah dan gastronominya.',
    'Di berbagai pelosok Indonesia, aroma rebusan jahe dan serai adalah penanda kenyamanan di malam hari. Namun di luar tradisi, secara gastronomi kedua bahan ini merupakan pasangan harmonis yang saling melengkapi.

Jahe merah memiliki karakter rasa yang tajam, pekat, dan pedas berkat kandungan gingerol dan shogaol. Di sisi lain, serai menyumbangkan senyawa citral yang memberikan aroma segar seperti lemon tanpa rasa masam.

Ketika disatukan dalam proporsi yang tepat, serai memotong ketajaman jahe sehingga rasa yang tertinggal di lidah terasa bersih, hangat, dan menenangkan.',
    (SELECT id FROM categories WHERE slug = 'edukasi-tradisi'),
    '/images/articles/herbs-exploration.jpg',
    'Tim Riset Botani CHANGKEER',
    5,
    true,
    'published',
    'Eksplorasi Rempah Nusantara: Harmoni Jahe Merah & Serai | CHANGKEER',
    'Mengenal karakter aromatik jahe merah dan serai wangi dalam tradisi minuman hangat nusantara.',
    NOW() - INTERVAL '7 days'
  )
ON CONFLICT (slug) DO NOTHING;

-- Page Contents Seed (Structured Content Editor)
INSERT INTO pages (slug, title, sections, seo_title, seo_description)
VALUES
  (
    'home',
    'Homepage',
    '{
      "hero": {
        "eyebrow": "SOLAR-TERM HERBAL REVOLUTION",
        "headline_line1": "MORE THAN TEA.",
        "headline_line2": "A BETTER YOU.",
        "subheadline": "Seduhan teh herbal fungsional murni tanpa kompromi. Diramu dari tanaman rempah, bunga, dan daun teh terbaik nusantara dengan gula sorgum & madu murni. 100% bebas mikroplastik & tanpa daun senna.",
        "primary_cta_text": "JELAJAHI KATALOG",
        "primary_cta_link": "/katalog",
        "secondary_cta_text": "TENTANG PRODUK",
        "secondary_cta_link": "/tentang-produk",
        "video_caption": "Saksikan ritual panen & racikan alami CHANGKEER"
      },
      "highlights": [
        {"title": "100% Bebas Mikroplastik", "desc": "Kemasan toxic-free & bleach-free tanpa pelepasan mikroplastik ke cangkir seduhan Anda."},
        {"title": "Bebas Daun Senna (Aman Harian)", "desc": "Formula herbal fungsional murni tanpa pencahar keras yang merusak ritme alami tubuh."},
        {"title": "Gula Sorgum & Madu Murni", "desc": "Alternatif pemanis sehat rendah glikemik untuk energi stabil dan kebugaran organ."},
        {"title": "Seduh Cepat < 3 Menit", "desc": "Kepraktisan grab-and-go modern dengan kenikmatan daun & kelopak bunga utuh bernutrisi."}
      ],
      "story_teaser": {
        "tag": "FILOSOFI KAMI",
        "title": "Kembali ke Ritme Alami Tubuh",
        "content": "Di era serba cepat di mana tubuh dipaksa terus berpacu dengan kafein dan stimulan sintetis, CHANGKEER lahir sebagai jeda yang bermakna. Kami percaya kekuatan sejati datang dari keseimbangan, bukan stimulasi berlebih.",
        "link_text": "Baca Kisah Selengkapnya",
        "link_url": "/tentang-kami"
      }
    }'::jsonb,
    'CHANGKEER - More Than Tea. A Better You.',
    'Website resmi teh herbal CHANGKEER. Racikan herbal murni nusantara untuk kebugaran harian, ketenangan pikiran, dan energi alami.'
  ),
  (
    'tentang-produk',
    'Tentang Produk',
    '{
      "intro": {
        "title": "Kemurnian Botani di Setiap Seduhan",
        "description": "Setiap varian CHANGKEER dirancang dengan menghormati karakteristik alami tanaman, menghasilkan profil rasa yang seimbang tanpa pemanis sintetis."
      },
      "quality_pillars": [
        {"title": "Bahan Baku Lokal Terpilih", "desc": "Bekerja sama langsung dengan petani tanaman herbal lokal yang menjaga kelestarian tanah."},
        {"title": "Pengeringan Higienis Suhu Terkendali", "desc": "Menjaga keutuhan minyak atsiri dan warna alami kelopak bunga."},
        {"title": "Kemasan Berkelanjutan", "desc": "Bahan ramah lingkungan bebas mikroplastik yang melindungi kesegaran daun tanpa merusak bumi."}
      ]
    }'::jsonb,
    'Tentang Produk CHANGKEER - Standar Kualitas & Komposisi Alami',
    'Pelajari standar racikan teh herbal CHANGKEER, proses pemilihan bahan baku lokal, dan cara penyajian terbaik.'
  ),
  (
    'tentang-kami',
    'Tentang Kami',
    '{
      "manifesto": {
        "title": "Lahir Dari Kejujuran: Warisan Tutup Cangkir Menuju CHANGKEER",
        "subtitle": "Kearifan tradisi teh herbal fungsional untuk gaya hidup sehat modern.",
        "paragraphs": [
          "CHANGKEER berakar dari inisiatif \"Tutup Cangkir\", sebuah pergerakan yang diprakarsai oleh Almaidah Chaerudin Putri, Annisha Humaira, Jogi Manaon Hutabarat, Johana Abigael Rumbiak, dan Keyla Putri Adisty.",
          "Kelahiran kami dilandasi oleh keprihatinan nyata terhadap industri teh: maraknya klaim detox berlebihan, kantong teh konvensional yang melepaskan miliaran partikel mikroplastik, penggunaan zat kimia pemutih (bleach), kadar gula sintetis berlebih, serta penyalahgunaan daun senna (daun jati cina) pencahar keras yang membahayakan tubuh.",
          "Kami menghadirkan standar baru yang berani: menyeduh daun teh utuh, kelopak bunga, dan rempah alami nusantara dengan formulasi solar-term herbal untuk organ tubuh, dipadukan pemanis ramah indeks glikemik seperti gula sorgum dan madu murni. Bebas mikroplastik, tanpa daun senna, dan siap dinikmati dalam waktu kurang dari 3 menit untuk ritme hidup aktif Anda."
        ]
      },
      "founders": [
        {"name": "Almaidah Chaerudin Putri", "role": "Co-Founder"},
        {"name": "Annisha Humaira", "role": "Co-Founder"},
        {"name": "Jogi Manaon Hutabarat", "role": "Co-Founder"},
        {"name": "Johana Abigael Rumbiak", "role": "Co-Founder"},
        {"name": "Keyla Putri Adisty", "role": "Co-Founder"}
      ],
      "values": [
        {"name": "Bebas Mikroplastik & Bleach", "desc": "Kemasan bebas plastik sintetis dan bebas pemutih kimiawi klorin demi keamanan kesehatan jangka panjang."},
        {"name": "100% Bebas Daun Senna", "desc": "Menolak keras penggunaan laksatif buatan agar teh aman dikonsumsi harian tanpa efek samping pencernaan."},
        {"name": "Pemanis Alami Rendah Glikemik", "desc": "Mengganti gula tebu rafinasi dengan kebaikan gula sorgum organik dan madu hutan murni nusantara."},
        {"name": "Penyajian Cepat < 3 Menit", "desc": "Kemudahan grab-and-go modern dengan ekstraksi rasa dan aroma botani maksimal secara instan."}
      ]
    }'::jsonb,
    'Tentang Kami - Filosofi, Pendiri & Integritas CHANGKEER',
    'Pelajari kisah pendiri CHANGKEER (Tutup Cangkir), komitmen bebas mikroplastik & daun senna, serta filosofi teh herbal fungsional.'
  ),
  (
    'hubungi-kami',
    'Hubungi Kami',
    '{
      "headline": "Terhubung Bersama Kami",
      "description": "Punya pertanyaan seputar produk, peluang kemitraan, atau ingin berbagi cerita secangkir teh? Kami siap mendengarkan.",
      "support_hours": "Senin - Sabtu: 09:00 - 17:00 WIB"
    }'::jsonb,
    'Hubungi Kami - Layanan Pelanggan & Kemitraan CHANGKEER',
    'Kirim pesan atau pertanyaan Anda kepada tim CHANGKEER. Kami siap membantu setiap kebutuhan Anda.'
  )
ON CONFLICT (slug) DO NOTHING;

-- Site Settings Seed
INSERT INTO site_settings (
  key, site_name, tagline, contact_email, contact_phone,
  contact_address, social_instagram, social_youtube, social_tiktok
)
VALUES
  (
    'general',
    'CHANGKEER',
    'More Than Tea. A Better You.',
    'halo@changkeer.com',
    '+62 812-3456-7890',
    'Jl. Harmoni Alam No. 8, Bandung, Jawa Barat, Indonesia',
    'https://instagram.com/changkeer.tea',
    'https://youtube.com/@changkeer',
    'https://tiktok.com/@changkeer'
  )
ON CONFLICT (key) DO NOTHING;
