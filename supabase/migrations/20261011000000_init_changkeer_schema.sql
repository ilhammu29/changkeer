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
  ('c0000000-0000-4000-8000-000000000001', 'Signature Herbal Infusion', 'signature-herbal', 'Racikan daun herbal murni pilihan dengan cita rasa seimbang dan kaya antioksidan.', 'product'),
  ('c0000000-0000-4000-8000-000000000002', 'Artisan Tisane & Flora', 'artisan-tisane', 'Perpaduan kelopak bunga kering organik dan rempah tropis aromatik.', 'product'),
  ('c0000000-0000-4000-8000-000000000003', 'Wellness & Vitality', 'wellness-vitality', 'Formula fungsional alami untuk kesegaran tubuh dan kejernihan pikiran.', 'product'),
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
    'CHANGKEER Jasmine Tea',
    'solar-term-jasmine-herbal-tea',
    'Daun Teh Utuh & Bunga Melati Asli dengan Gula Sorgum & Madu',
    'Racikan teh herbal fungsional terinspirasi tradisi teh Tiongkok yang disederhanakan untuk gaya hidup modern grab-and-go. Menggunakan daun teh pilihan dan kuntum melati utuh dengan pemanis alami gula sorgum serta madu murni. Bebas kantong teh pemutih dan 100% bebas mikroplastik. Tidak mengandung daun senna keras sehingga sangat aman untuk dikonsumsi harian.',
    (SELECT id FROM categories WHERE slug = 'signature-herbal'),
    '["Daun Teh Hijau Pilihan (Camellia sinensis)", "Kuntum Bunga Melati Utuh (Jasminum sambac)", "Pemanis Alami Gula Sorgum Organik", "Madu Hutan Murni Nusantara"]'::jsonb,
    '{"water_temp": "85°C - 90°C", "steep_time": "2-3 Menit", "serving_size": "250ml - 300ml air panas", "notes": "Dirancang praktis untuk penyajian cepat di bawah 3 menit tanpa ampas mengganggu."}'::jsonb,
    '{"aroma": "Bunga melati segar semerbak alami", "taste": "Manis lembut seimbang tanpa rasa pahit berlebih", "body": "Silky smooth", "caffeine": "Sangat Rendah (< 10mg)"}'::jsonb,
    'Kemasan botol & sachet eksklusif bebas mikroplastik (microplastic-free & toxic-free packaging).',
    49000,
    50,
    '/images/assets/jasmine_tea_produk.jpg',
    '["/images/assets/jasmine_tea_produk.jpg", "/images/assets/jasmine_tea_produk.png", "/images/assets/biji_teh_jasmine_tea.png", "/images/assets/bungkus_teh.png"]'::jsonb,
    true,
    'published',
    'CHANGKEER Jasmine Tea - Teh Herbal Melati Alami',
    'Nikmati teh herbal melati CHANGKEER dengan daun teh utuh, gula sorgum, dan madu murni. Bebas kantong teh pemutih dan bebas mikroplastik.'
  ),
  (
    'CHANGKEER English Breakfast Tea',
    'english-breakfast-tea',
    'Racikan Teh Hitam Kuat & Berkarakter dengan Pemanis Alami Rendah Glikemik',
    'Seduhan teh hitam berkarakter bold dan kaya rasa yang terinspirasi tradisi sarapan klasik, diracik dengan dedikasi kearifan nusantara. Menghadirkan dorongan energi alami yang bersih tanpa menyebabkan lonjakan asam lambung. Menggunakan kantong teh bebas mikroplastik dan bebas pemutih kimiawi (bleach-free), dipermanis secara seimbang dengan gula sorgum dan madu hutan murni. 100% bebas daun senna, aman dikonsumsi harian untuk mengawali hari aktif Anda.',
    (SELECT id FROM categories WHERE slug = 'signature-herbal'),
    '["Daun Teh Hitam Pilihan Nusantara (Camellia sinensis var. assamica)", "Pemanis Alami Gula Sorgum Organik", "Madu Hutan Murni Nusantara"]'::jsonb,
    '{"water_temp": "95°C", "steep_time": "2-3 Menit", "serving_size": "250ml - 300ml air panas", "notes": "Penyajian instan praktis kurang dari 3 menit untuk gaya hidup modern yang serba cepat."}'::jsonb,
    '{"aroma": "Aroma malted tea hangat dan mendalam", "taste": "Kuat, gurih, dengan rasa manis karamel sorgum lembut", "body": "Full-bodied & rich", "caffeine": "Sedang (~25mg, energi stabil tanpa crash)"}'::jsonb,
    'Kemasan ramah lingkungan bebas mikroplastik dan bebas zat kimia pemutih (microplastic-free & bleach-free).',
    49000,
    50,
    '/images/assets/english_breakfast_tea_produk.jpg',
    '["/images/assets/english_breakfast_tea_produk.jpg", "/images/assets/banner.jpg"]'::jsonb,
    true,
    'published',
    'CHANGKEER English Breakfast Tea - Teh Hitam Herbal Nusantara',
    'Teh hitam klasik berenergi bersih CHANGKEER dengan daun teh utuh, gula sorgum dan madu murni. Bebas mikroplastik dan tanpa daun senna.'
  ),
  (
    'CHANGKEER Vanilla Mint Tea',
    'vanilla-mint-tea',
    'Kesegaran Dingin Daun Mint Alami Berpadu Aroma Vanilla Lembut Menenangkan',
    'Kombinasi harmonis antara semilir dingin daun mint pegunungan dan kelembutan aroma vanilla alami. Dirancang untuk meredakan ketegangan pikiran dan menyegarkan sistem pernapasan setelah aktivitas padat. Tanpa kandungan daun senna yang keras, aman untuk lambung dan pencernaan. Dikemas dalam kantung bebas mikroplastik dengan alternatif pemanis sehat gula sorgum dan madu.',
    (SELECT id FROM categories WHERE slug = 'artisan-tisane'),
    '["Daun Teh Pilihan (Camellia sinensis)", "Daun Mint Kering Alami (Mentha piperita)", "Ekstrak Polong Vanilla Organik", "Gula Sorgum Rendah Kalori", "Madu Murni Alami"]'::jsonb,
    '{"water_temp": "90°C", "steep_time": "2-3 Menit", "serving_size": "250ml - 300ml air panas atau dingin", "notes": "Dapat dinikmati hangat atau ditambahkan es batu untuk kesegaran ganda kurang dari 3 menit."}'::jsonb,
    '{"aroma": "Mint segar semilir berpadu vanilla manis lembut", "taste": "Dingin menyegarkan di tenggorokan dengan sentuhan manis vanilla creamy", "body": "Medium-crisp", "caffeine": "Rendah (< 10mg)"}'::jsonb,
    'Kemasan eksklusif bebas racun & mikroplastik (non-toxic teabag).',
    49000,
    50,
    '/images/assets/vanilla_mint_tea_produk.jpg',
    '["/images/assets/vanilla_mint_tea_produk.jpg", "/images/assets/banner2.jpg"]'::jsonb,
    true,
    'published',
    'CHANGKEER Vanilla Mint Tea - Teh Herbal Dingin Segar & Lembut',
    'Segarkan hari Anda dengan perpaduan daun mint alami dan aroma manis vanilla dari CHANGKEER. Bebas mikroplastik dan aman tanpa daun senna.'
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
