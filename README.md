# CHANGKEER | FULL-STACK WEBSITE, CMS & DEPLOYMENT

> **"MORE THAN TEA. A BETTER YOU."**  
> Platform web editorial modern untuk produk teh herbal nusantara CHANGKEER dengan Content Management System (CMS), database Supabase PostgreSQL dengan Row-Level Security (RLS), dan deployment Vercel.

---

## 1. Ikhtisar Arsitektur Proyek

CHANGKEER dirancang dengan pendekatan modular, type-safe (TypeScript strict mode), dan secure-by-design:

- **Frontend & Public Website**: Next.js App Router (React 19, ISR 60s, Server Components).
- **Styling & Design Tokens**: Tailwind CSS v4 dengan centralized semantic tokens (`globals.css`) untuk warna netral, tipografi, radius, dan spasi yang dapat diubah terpusat saat referensi warna final diberikan.
- **Backend & Database**: Supabase PostgreSQL dengan skema tabel terelasi, Row-Level Security (RLS) least privilege, dan Supabase Storage buckets.
- **CMS Admin Portal**: Terletak di `/admin` dengan dashboard statistik nyata, CRUD produk, kategori, artikel, structured page content editor, media library, pengaturan situs, dan pengelolaan pesan pelanggan.
- **Validation**: Schema-driven validation menggunakan Zod baik pada client maupun server routes.
- **Security**: Service Role Key tidak pernah bocor ke client bundle. Akses mutasi dan pembacaan pesan pelanggan dibatasi secara ketat hanya untuk admin terotentikasi.

---

## 2. Struktur Modular Proyek

```text
changkeer/
├── app/
│   ├── (public)/                 # Halaman Publik
│   │   ├── page.tsx              # / (Beranda: Hero Asimetris, Brand Highlights, Featured Products, Story Teaser)
│   │   ├── tentang-produk/       # /tentang-produk (Story, Bahan baku, Standar ekstraksi)
│   │   ├── katalog/              # /katalog & /katalog/[slug] (Filter, pencarian, detail produk)
│   │   ├── tentang-kami/         # /tentang-kami (Filosofi, nilai brand autentik)
│   │   ├── media-berita/         # /media-berita & /media-berita/[slug] (Edukasi, draft guard)
│   │   └── hubungi-kami/         # /hubungi-kami (Formulir kontak & info resmi)
│   ├── admin/                    # CMS Administrator
│   │   ├── layout.tsx            # Admin sidebar & portal shell
│   │   ├── page.tsx              # Dashboard statistik database nyata
│   │   ├── login/                # Autentikasi Admin (Supabase Auth)
│   │   ├── products/             # CRUD Produk & Slugs
│   │   ├── categories/           # CRUD Kategori (Produk & Artikel)
│   │   ├── articles/             # CRUD Artikel & Status Draft/Publish
│   │   ├── pages/                # Structured Content Editor (Home, About, etc.)
│   │   ├── media/                # Media Library & Berkas Storage
│   │   ├── messages/             # Manajemen Pesan Masuk Pelanggan
│   │   └── settings/             # Pengaturan Global Website
│   ├── api/                      # Route Handlers (Contact, Admin APIs)
│   ├── globals.css               # Centralized Semantic Design Tokens
│   └── layout.tsx                # Root layout & Metadata
├── components/
│   ├── home/                     # Hero, Highlights, Story, Featured
│   ├── products/                 # ProductCard, CatalogView, BrewingGuideBox
│   ├── articles/                 # ArticleCard, ArticlesView
│   ├── contact/                  # ContactForm dengan Zod
│   ├── admin/                    # ProductForm, ArticleForm
│   ├── layout/                   # Navbar & Footer
│   └── ui/                       # Container, Button, Badge
├── lib/
│   ├── auth/                     # Authorization helpers
│   ├── data/                     # Data access & Resilient Mock Seed fallback
│   ├── supabase/                 # Client, Server (cookies), Admin, Env helper
│   └── validation/               # Zod Schemas (Product, Article, Contact, Settings)
├── public/                       # Aset vektor SVG & placeholder visual
├── supabase/
│   └── migrations/               # SQL Migration lengkap (Schema, RLS, Storage)
├── types/                        # TypeScript Domain Types
├── .env.example
└── README.md
```

---

## 3. Centralized Design Tokens (Penggantian Warna Terpusat)

Warna final belum ditetapkan. Semua komponen UI merujuk pada semantic CSS variables di `app/globals.css`. Ketika referensi palet warna final diberikan oleh tim desain, Anda hanya perlu memperbarui nilai variabel berikut di `app/globals.css`:

```css
:root {
  --background: #fcfcfb;
  --foreground: #111211;
  --surface: #ffffff;
  --surface-hover: #f5f6f4;
  --primary: #151a16;
  --primary-foreground: #f8faf8;
  --primary-hover: #262e27;
  --accent: #2e3a2f;
  --accent-foreground: #ffffff;
  --accent-subtle: #edf1ed;
  --muted: #f2f3f1;
  --muted-foreground: #676e67;
  --border: #e3e6e2;
  --border-strong: #c2c7c1;
  --ring: #2e3a2f;
}
```

---

## 4. Database Setup & Supabase Migrations

Berkas migrasi SQL lengkap berada pada:
`supabase/migrations/20261011000000_init_changkeer_schema.sql`

Migrasi ini secara otomatis menyiapkan:
1. Tabel: `admin_profiles`, `categories`, `products`, `articles`, `pages`, `media_assets`, `site_settings`, `contact_messages`.
2. Row Level Security (RLS) di seluruh tabel:
   - Produk & artikel publik hanya menampilkan baris dengan `status = 'published'`.
   - Pesan masuk (`contact_messages`) hanya dapat dibaca dan dihapus oleh admin terverifikasi.
3. Storage Buckets: `product-images`, `article-images`, `site-media` dengan kebijakan otorisasi upload khusus admin.
4. Data awal (Seed Data): varian teh herbal (Lemongrass Ginger, Rosella Mint, Chamomile Lavender, Moringa Green), artikel edukasi seduh, struktur konten beranda, dan kontak resmi.

### Cara Menjalankan Migrasi ke Project Supabase Baru:
1. Buka SQL Editor di dashboard Supabase project Anda.
2. Salin isi berkas `supabase/migrations/20261011000000_init_changkeer_schema.sql`.
3. Klik **Run**.

### Cara Menetapkan Super Admin Pertama:
1. Buka menu **Authentication -> Users** di Supabase console dan buat akun pengguna baru dengan email Anda (misal `admin@changkeer.com`).
2. Catat User UID yang dihasilkan (contoh: `abc-123-uuid`).
3. Jalankan query SQL berikut di SQL Editor:
```sql
INSERT INTO admin_profiles (id, email, full_name, role)
VALUES ('abc-123-uuid', 'admin@changkeer.com', 'Super Admin CHANGKEER', 'super_admin');
```

---

## 5. Menjalankan Aplikasi Secara Lokal

1. Salin berkas environment:
   ```bash
   cp .env.example .env.local
   ```
2. Jalankan server pengembang:
   ```bash
   npm run dev
   ```
3. Buka peramban di `http://localhost:3000`.

*Catatan: Selama URL Supabase belum diisi, aplikasi secara otomatis berjalan menggunakan resilient data layer bawaan sehingga seluruh halaman publik dan alur CMS dapat diuji secara lancar.*

---

## 6. Pengujian & Kualitas Kode

- **TypeScript Typecheck**:
  ```bash
  npm run typecheck
  ```
- **Linting**:
  ```bash
  npm run lint
  ```
- **Production Build**:
  ```bash
  npm run build
  ```
- **Automated Tests**:
  ```bash
  npm run test
  ```
