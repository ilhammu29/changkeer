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
CREATE POLICY "Admins can view all admin profiles"
  ON admin_profiles FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Super admins can manage admin profiles"
  ON admin_profiles FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_profiles
      WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

-- 3.2 categories Policies
CREATE POLICY "Public can view categories"
  ON categories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage categories"
  ON categories FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- 3.3 products Policies
CREATE POLICY "Public can view published products"
  ON products FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "Admins have full access to products"
  ON products FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- 3.4 articles Policies
CREATE POLICY "Public can view published articles"
  ON articles FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "Admins have full access to articles"
  ON articles FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- 3.5 pages Policies
CREATE POLICY "Public can view pages"
  ON pages FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage pages"
  ON pages FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- 3.6 media_assets Policies
CREATE POLICY "Public can view media assets"
  ON media_assets FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage media assets"
  ON media_assets FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- 3.7 site_settings Policies
CREATE POLICY "Public can view site settings"
  ON site_settings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage site settings"
  ON site_settings FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- 3.8 contact_messages Policies (STRICT SECURITY)
CREATE POLICY "Public can submit contact messages"
  ON contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Only admins can view contact messages"
  ON contact_messages FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Only admins can update or delete contact messages"
  ON contact_messages FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

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
CREATE POLICY "Public Access for Public Buckets"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id IN ('product-images', 'article-images', 'site-media'));

CREATE POLICY "Admin Upload Access for Buckets"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id IN ('product-images', 'article-images', 'site-media')
    AND is_admin()
  );

CREATE POLICY "Admin Update Access for Buckets"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id IN ('product-images', 'article-images', 'site-media')
    AND is_admin()
  );

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

-- Categories Seed
INSERT INTO categories (id, name, slug, description, type)
VALUES
  ('c0000000-0000-0000-0000-000000000001', 'Signature Herbal Infusion', 'signature-herbal', 'Racikan daun herbal murni pilihan dengan cita rasa seimbang dan kaya antioksidan.', 'product'),
  ('c0000000-0000-0000-0000-000000000002', 'Artisan Tisane & Flora', 'artisan-tisane', 'Perpaduan kelopak bunga kering organik dan rempah tropis aromatik.', 'product'),
  ('c0000000-0000-0000-0000-000000000003', 'Wellness & Vitality', 'wellness-vitality', 'Formula fungsional alami untuk kesegaran tubuh dan kejernihan pikiran.', 'product'),
  ('c0000000-0000-0000-0000-000000000010', 'Edukasi & Tradisi Teh', 'edukasi-tradisi', 'Wawasan seputar tanaman herbal nusantara, teknik seduh, dan filosofi hidup selaras alam.', 'article'),
  ('c0000000-0000-0000-0000-000000000011', 'Gaya Hidup Sehat', 'gaya-hidup-sehat', 'Inspirasi rutinitas harian bernutrisi dan kesadaran mind-body.', 'article')
ON CONFLICT (slug) DO NOTHING;

-- Products Seed
INSERT INTO products (
  id, name, slug, tagline, description, category_id,
  ingredients, brewing_guide, characteristics, packaging_info,
  price, weight_grams, featured_image, gallery, is_featured, status,
  seo_title, seo_description
)
VALUES
  (
    'p0000000-0000-0000-0000-000000000000',
    'CHANGKEER Solar-Term Jasmine Herbal Tea',
    'solar-term-jasmine-herbal-tea',
    'Daun Teh Utuh & Bunga Melati Asli dengan Gula Sorgum & Madu',
    'Racikan teh herbal fungsional terinspirasi tradisi teh Tiongkok yang disederhanakan untuk gaya hidup modern grab-and-go. Menggunakan daun teh pilihan dan kuntum melati utuh dengan pemanis alami gula sorgum serta madu murni. Bebas kantong teh pemutih dan 100% bebas mikroplastik. Tidak mengandung daun senna keras sehingga sangat aman untuk dikonsumsi harian.',
    'c0000000-0000-0000-0000-000000000001',
    '["Daun Teh Hijau Pilihan (Camellia sinensis)", "Kuntum Bunga Melati Utuh (Jasminum sambac)", "Pemanis Alami Gula Sorgum Organik", "Madu Hutan Murni Nusantara"]'::jsonb,
    '{"water_temp": "85°C - 90°C", "steep_time": "2-3 Menit", "serving_size": "250ml - 300ml air panas", "notes": "Dirancang praktis untuk penyajian cepat di bawah 3 menit tanpa ampas mengganggu."}'::jsonb,
    '{"aroma": "Bunga melati segar semerbak alami", "taste": "Manis lembut seimbang tanpa rasa pahit berlebih", "body": "Silky smooth", "caffeine": "Sangat Rendah (< 10mg)"}'::jsonb,
    'Kemasan botol & sachet eksklusif bebas mikroplastik (microplastic-free & toxic-free packaging).',
    49000,
    50,
    '/images/assets/jasmine_tea_produk.png',
    '["/images/assets/jasmine_tea_produk.png", "/images/assets/biji_teh_jasmine_tea.png", "/images/assets/bungkus_teh.png"]'::jsonb,
    true,
    'published',
    'CHANGKEER Solar-Term Jasmine Herbal Tea - Teh Herbal Melati Alami',
    'Nikmati teh herbal melati CHANGKEER dengan daun teh utuh, gula sorgum, dan madu murni. Bebas kantong teh pemutih dan bebas mikroplastik.'
  ),
  (
    'p0000000-0000-0000-0000-000000000001',
    'CHANGKEER Lemongrass Ginger Vitality',
    'lemongrass-ginger-vitality',
    'Kehangatan Jahe Merah & Kesegaran Serai Wangi Alami',
    'Perpaduan serai wangi pilihan dan jahe merah organik dari lereng pegunungan. Menghadirkan rasa pedas hangat yang lembut dengan aroma sitrus menyegarkan. Sempurna untuk mengembalikan energi tubuh setelah hari yang panjang tanpa kandungan kafein.',
    'c0000000-0000-0000-0000-000000000001',
    '["Serai Wangi Kering (Cymbopogon citratus)", "Jahe Merah Iris (Zingiber officinale var. rubrum)", "Daun Pandan Organik", "Secang Serut"]'::jsonb,
    '{"water_temp": "95°C", "steep_time": "4-5 Menit", "serving_size": "250ml air panas", "notes": "Tambahkan satu sendok madu hutan murni untuk sensasi kehangatan yang lebih kaya."}'::jsonb,
    '{"aroma": "Sitrus segar dengan aksen rempah hangat", "taste": "Sedikit pedas lembut, bersih di tenggorokan", "body": "Medium-rich", "caffeine": "Bebas Kafein (0mg)"}'::jsonb,
    'Kotak tabung silinder ramah lingkungan isi 15 kantung teh piramida biodegradable (bebas mikroplastik).',
    85000,
    60,
    '/images/products/changkeer-lemongrass-ginger.jpg',
    '["/images/products/changkeer-lemongrass-ginger.jpg", "/images/products/changkeer-brewing.jpg"]'::jsonb,
    true,
    'published',
    'CHANGKEER Lemongrass Ginger Vitality - Teh Herbal Hangat Alami',
    'Nikmati perpaduan serai wangi dan jahe merah organik CHANGKEER. Racikan herbal murni bebas kafein untuk mengembalikan kebugaran harian.'
  ),
  (
    'p0000000-0000-0000-0000-000000000002',
    'CHANGKEER Rosella Mint Refresh',
    'rosella-mint-refresh',
    'Kesegaran Asam Alami Bunga Rosella Berpadu Daun Mint Dingin',
    'Kuntum bunga rosella merah kaya vitamin C berpadu dengan daun mint pegunungan. Menghasilkan seduhan berwarna merah delima berkilau dengan rasa asam segar yang membangkitkan fokus seketika.',
    'c0000000-0000-0000-0000-000000000002',
    '["Kelopak Rosella Merah Utuh (Hibiscus sabdariffa)", "Daun Spearmint Kering (Mentha spicata)", "Kulit Jeruk Purut"]'::jsonb,
    '{"water_temp": "90°C", "steep_time": "3-4 Menit", "serving_size": "250ml air panas atau dingin", "notes": "Sangat nikmat disajikan dingin dengan es batu di cuaca terik."}'::jsonb,
    '{"aroma": "Floral segar dengan hembusan mint dingin", "taste": "Asam segar seimbang dengan sentuhan manis alami", "body": "Light-crisp", "caffeine": "Bebas Kafein (0mg)"}'::jsonb,
    'Pouch foil kedap udara dengan zipper isi 50g daun & bunga utuh (loose leaf).',
    78000,
    50,
    '/images/products/changkeer-rosella-mint.jpg',
    '["/images/products/changkeer-rosella-mint.jpg"]'::jsonb,
    true,
    'published',
    'CHANGKEER Rosella Mint Refresh - Tisane Bunga Rosella & Mint',
    'Seduhan tisane merah delima dari kelopak rosella utuh dan daun mint segar. Bebas kafein, menyegarkan hari Anda.'
  ),
  (
    'p0000000-0000-0000-0000-000000000003',
    'CHANGKEER Chamomile Lavender Serenity',
    'chamomile-lavender-serenity',
    'Relaksasi Alami Tanpa Kafein Menjelang Istirahat Malam',
    'Perpaduan lembut bunga chamomile utuh Jerman dan kuntum lavender liar. Menghadirkan aroma manis menenangkan yang dirancang untuk menemani ritual malam Anda, meredakan ketegangan, dan menyambut tidur yang berkualitas.',
    'c0000000-0000-0000-0000-000000000003',
    '["Bunga Chamomile Utuh (Matricaria chamomilla)", "Kuntum Lavender Kering (Lavandula angustifolia)", "Daun Lemon Balm"]'::jsonb,
    '{"water_temp": "85-90°C", "steep_time": "5-6 Menit", "serving_size": "250ml air panas", "notes": "Nikmati 30-45 menit sebelum beristirahat di ruangan redup yang tenang."}'::jsonb,
    '{"aroma": "Bunga apel manis berpadu aroma herba lavender", "taste": "Sangat lembut, menenangkan, tidak pahit", "body": "Silky-smooth", "caffeine": "Bebas Kafein (0mg)"}'::jsonb,
    'Kotak silinder premium isi 15 piramida kantung teh biodegradable.',
    92000,
    45,
    '/images/products/changkeer-chamomile-lavender.jpg',
    '["/images/products/changkeer-chamomile-lavender.jpg"]'::jsonb,
    true,
    'published',
    'CHANGKEER Chamomile Lavender Serenity - Teh Herbal Relaksasi Malam',
    'Temukan ketenangan malam bersama racikan chamomile dan lavender murni CHANGKEER. Relaksasi alami sebelum istirahat.'
  ),
  (
    'p0000000-0000-0000-0000-000000000004',
    'CHANGKEER Moringa Green Harmony',
    'moringa-green-harmony',
    'Daun Kelor Superfood & Teh Hijau Jawa Berkualitas Tinggi',
    'Kombinasi daun kelor muda yang dikeringkan pada suhu rendah untuk mempertahankan nutrisi alami, dipadukan dengan daun teh hijau pegunungan Jawa. Menghadirkan rasa earthy yang bersih dan menyegarkan.',
    'c0000000-0000-0000-0000-000000000003',
    '["Daun Kelor Kering Rendah Suhu (Moringa oleifera)", "Teh Hijau Pucuk Pilihan (Camellia sinensis)", "Melati Putih"]'::jsonb,
    '{"water_temp": "80°C", "steep_time": "2-3 Menit", "serving_size": "250ml air panas", "notes": "Hindari menggunakan air mendidih langsung agar rasa tetap manis dan tidak pekat."}'::jsonb,
    '{"aroma": "Earthy alami dengan wangi melati samar", "taste": "Rasa hijau segar, umami ringan, bersih di lidah", "body": "Light-medium", "caffeine": "Kafein Rendah (~15mg)"}'::jsonb,
    'Pouch ziplock isi 20 sachet piramida ramah lingkungan.',
    89000,
    50,
    '/images/products/changkeer-moringa-green.jpg',
    '["/images/products/changkeer-moringa-green.jpg"]'::jsonb,
    true,
    'published',
    'CHANGKEER Moringa Green Harmony - Teh Hijau & Kelor Pilihan',
    'Perpaduan nutrisi daun kelor muda dan teh hijau pegunungan berpadu harum melati. Seimbang dan menyehatkan.'
  )
ON CONFLICT (slug) DO NOTHING;

-- Articles Seed
INSERT INTO articles (
  id, title, slug, excerpt, content, category_id,
  featured_image, author_name, read_time_minutes, is_featured, status,
  seo_title, seo_description, published_at
)
VALUES
  (
    'a0000000-0000-0000-0000-000000000001',
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
    'c0000000-0000-0000-0000-000000000010',
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
    'a0000000-0000-0000-0000-000000000002',
    'Eksplorasi Rempah Nusantara: Mengapa Jahe Merah dan Serai Menjadi Pasangan Abadi',
    'eksplorasi-rempah-nusantara-jahe-merah-dan-serai',
    'Kombinasi klasik jahe merah dan serai telah menemani masyarakat kepulauan nusantara selama berabad-abad. Berikut alasan ilmiah dan gastronominya.',
    'Di berbagai pelosok Indonesia, aroma rebusan jahe dan serai adalah penanda kenyamanan di malam hari. Namun di luar tradisi, secara gastronomi kedua bahan ini merupakan pasangan harmonis yang saling melengkapi.

Jahe merah memiliki karakter rasa yang tajam, pekat, dan pedas berkat kandungan gingerol dan shogaol. Di sisi lain, serai menyumbangkan senyawa citral yang memberikan aroma segar seperti lemon tanpa rasa masam.

Ketika disatukan dalam proporsi yang tepat, serai memotong ketajaman jahe sehingga rasa yang tertinggal di lidah terasa bersih, hangat, dan menenangkan.',
    'c0000000-0000-0000-0000-000000000010',
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
        "eyebrow": "HERBAL TEA REVOLUTION",
        "headline_line1": "MORE THAN TEA.",
        "headline_line2": "A BETTER YOU.",
        "subheadline": "Seduhan teh herbal murni tanpa kompromi. Diramu dari tanaman rempah dan kelopak bunga terbaik nusantara untuk energi jernih dan ketenangan sejati.",
        "primary_cta_text": "JELAJAHI KATALOG",
        "primary_cta_link": "/katalog",
        "secondary_cta_text": "TENTANG PRODUK",
        "secondary_cta_link": "/tentang-produk",
        "video_caption": "Saksikan ritual panen & racikan alami CHANGKEER"
      },
      "highlights": [
        {"title": "100% Tanaman Alami", "desc": "Bebas perisa buatan, pewarna sintetis, dan bahan pengawet."},
        {"title": "Bebas Kafein Murni", "desc": "Energi stabil tanpa lonjakan degup jantung atau crash."},
        {"title": "Piramida Biodegradable", "desc": "Kantung teh ramah lingkungan tanpa mikroplastik berbahaya."}
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
        "description": "Setiap varian CHANGKEER dirancang dengan menghormati karakteristik alami tanaman, menghasilkan profil rasa yang seimbang tanpa pemanis tambahan."
      },
      "quality_pillars": [
        {"title": "Bahan Baku Lokal Terpilih", "desc": "Bekerja sama langsung dengan petani tanaman herbal lokal yang menjaga kelestarian tanah."},
        {"title": "Pengeringan Higienis Suhu Terkendali", "desc": "Menjaga keutuhan minyak atsiri dan warna alami kelopak bunga."},
        {"title": "Kemasan Berkelanjutan", "desc": "Bahan ramah lingkungan yang melindungi kesegaran daun tanpa merusak bumi."}
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
        "title": "Harmoni Tradisi dan Gaya Hidup Modern",
        "subtitle": "Sebuah cangkir yang mengingatkan kita untuk bernapas lebih dalam.",
        "paragraphs": [
          "CHANGKEER bermula dari sebuah kesadaran sederhana: minuman yang kita konsumsi sehari-hari harus memberi makan jiwa dan menyelaraskan tubuh, bukan sekadar memacu detak jantung.",
          "Kami mengangkat kekayaan botani nusantara ke dalam cangkir modern. Dari serai wangi di perbukitan Jawa Barat hingga jahe merah dan kelopak rosella tropis, setiap racikan kami lewati uji rasa berulang untuk memastikan pengalaman minum yang menenangkan."
        ]
      },
      "values": [
        {"name": "Integritas Bahan", "desc": "Hanya menggunakan tanaman herbal murni tanpa tambahan perisa kimiawi."},
        {"name": "Keberlanjutan", "desc": "Mendukung ekosistem pertanian ramah lingkungan dan kemasan biodegradable."},
        {"name": "Keseimbangan", "desc": "Membantu Anda menemukan ritme hidup yang lebih tenang dan fokus."}
      ]
    }'::jsonb,
    'Tentang Kami - Filosofi & Cerita CHANGKEER',
    'Mengenal visi, nilai, dan filosofi teh herbal CHANGKEER dalam menemani gaya hidup seimbang masyarakat modern.'
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
