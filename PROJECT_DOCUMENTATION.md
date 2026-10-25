# Dokumentasi Komprehensif Sistem CHANGKEER
### Platform E-Commerce, Brew Bar POS & Manajemen Operasional Teh Herbal

---

## 1. Latar Belakang & Tujuan Proyek

### 1.1 Latar Belakang
CHANGKEER lahir dari kebutuhan untuk menghadirkan pengalaman menikmati teh herbal nusantara yang modern, presisi, dan terkurasi. Berbeda dengan kedai kopi komersial yang serba terburu-buru atau toko jamu tradisional yang belum terstandarisasi, CHANGKEER memosisikan diri sebagai *artisan tea atelier*. Setiap racikan teh diseduh menggunakan suhu air, waktu ekstraksi (*steeping time*), dan takaran bahan botani yang presisi berdasarkan siklus 24 Musim Alam (*Solar Terms*).

Untuk mewujudkan pengalaman tersebut ke ranah digital, sistem CHANGKEER dibangun sebagai platform terpadu yang menjembatani interaksi pelanggan (baik yang memesan langsung di meja bar, bungkus bawa pulang, maupun pesan antar) dengan tim barista di balik bar peracikan.

### 1.2 Tujuan Utama Sistem
1. **Mempermudah Pemesanan Mandiri (*Self-Service Ordering*)**: Pelanggan dapat memesan langsung dari ponsel tanpa harus mengantre lama di kasir, baik saat duduk di meja (*dine-in*), pesan ambil (*takeaway*), maupun pengiriman (*delivery*).
2. **Menyediakan Kustomisasi Seduhan Presisi**: Memberikan kebebasan kepada pelanggan untuk menyesuaikan temperatur (panas/dingin), tingkat kemanisan botani (0% hingga 100%), jenis pemanis alami (nektar sorgum, madu hutan, stevia), dan tambahan kelopak bunga (*botanical flower toppings*).
3. **Sistem Pembayaran Nasional Terintegrasi (QRIS Dinamis)**: Memungkinkan transaksi cashless instan menggunakan semua aplikasi m-Banking dan e-Wallet di Indonesia dengan nominal yang terkunci otomatis, serta opsi pembayaran kasir dan transfer manual.
4. **Digitalisasi Alur Kerja Barista (*Kitchen Display System & POS*)**: Menggantikan nota kertas yang mudah hilang dengan sistem tiket digital real-time, pencetakan struk termal standar kasir 58/80mm, dan notifikasi WhatsApp langsung ke barista.
5. **Pengelolaan Konten Mandiri (Headless CMS)**: Memudahkan tim manajemen untuk memperbarui katalog produk, stok, artikel edukasi, kupon diskon, dan pengaturan operasional tanpa menyentuh kode program.

---

## 2. Fungsi Utama Sistem

Sistem CHANGKEER beroperasi melalui tiga antarmuka utama yang saling terhubung:

```
┌─────────────────────────────────────────────────────────────┐
│                    EKOSISTEM CHANGKEER                      │
└─────────────────────────────────────────────────────────────┘
                               │
       ┌───────────────────────┼───────────────────────┐
       ▼                       ▼                       ▼
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│  PELANGGAN   │       │   BARISTA    │       │  MANAJEMEN   │
│  (Front-End) │       │ (KDS & Slip) │       │  (Admin CMS) │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ • Menu 24    │       │ • Antrean    │       │ • CRUD       │
│   Musim      │       │   Tiket Real-│       │   Produk     │
│ • Kustomisasi│       │   time       │ • Manajemen  │
│   Seduhan    │       │ • Cetak Struk│   Voucher    │
│ • QRIS Auto- │       │   Termal     │ • Rekap      │
│   Nominal    │       │ • Update     │   Pesanan    │
│ • Lacak      │       │   Status     │ • Media &    │
│   Status     │       │   Seduhan    │   Artikel    │
└──────────────┘       └──────────────┘       └──────────────┘
```

1. **Antarmuka Pelanggan (*Customer Experience*)**:
   - Eksplorasi katalog 24 varian racikan teh musiman dengan deskripsi filosofis dan profil sensori.
   - Simulasi harga real-time berdasarkan ukuran porsi, es, pemanis, dan *add-ons*.
   - Checkout 1-halaman yang intuitif dengan kalkulasi ongkir dan voucher promo otomatis.
   - Halaman pelacakan status seduhan live dengan QRIS dinamis dan struk digital.

2. **Antarmuka Operasional Bar (*Kitchen Display System & POS*)**:
   - Tampilan antrean pesanan masuk (*incoming orders*) yang diperbarui otomatis setiap beberapa detik.
   - Modal pencetakan struk termal ukuran standar 80mm (struk kasir) dan 58mm (label cangkir kedap air).
   - Pengubah status pesanan: *Received* → *Brewing* → *Ready to Serve* → *Completed*.

3. **Portal Manajemen (*Admin Dashboard*)**:
   - Pemantauan metrik penjualan: omzet, total pesanan aktif, rata-rata nilai transaksi, dan produk terlaris.
   - Pengaturan promo voucher berbatas kuota, periode waktu, dan minimal belanja.
   - Pengaturan profil toko, rekening bank resmi, dan integrasi WhatsApp.

---

## 3. Fitur-Fitur Unggulan

### 3.1 Katalog 24 Racikan Musiman (*Solar Terms Blends*)
Katalog teh disusun berdasarkan siklus 24 pembagian musim tradisional Asia Timur yang diadaptasi dengan rempah botani tropis Nusantara:
- **Musim Semi (*Spring*)**: *Start of Spring*, *Rain Water*, *Insects Awaken*, *Spring Equinox*, *Pure Brightness*, *Grain Rain*. Karakter: floral, segar, ringan, detoksifikasi.
- **Musim Panas (*Summer*)**: *Start of Summer*, *Small Full*, *Grain in Ear*, *Summer Solstice*, *Minor Heat*, *Major Heat*. Karakter: pendingin tubuh, minty, fruity, hidrasi.
- **Musim Gugur (*Autumn*)**: *Start of Autumn*, *End of Heat*, *White Dew*, *Autumn Equinox*, *Cold Dew*, *Frost Descent*. Karakter: earthy, roasted, kayu manis, menenangkan pernapasan.
- **Musim Dingin (*Winter*)**: *Start of Winter*, *Light Snow*, *Heavy Snow*, *Winter Solstice*, *Moderate Cold*, *Severe Cold*. Karakter: jahe merah, kapulaga, cengkih, menghangatkan tubuh.

Setiap produk dilengkapi panduan suhu seduh (misal 90°C), durasi seduh (3–5 menit), dan takaran saji.

### 3.2 Modal Kustomisasi Seduhan (*Artisanal Brew Customizer*)
Pelanggan dapat menentukan racikan cangkir teh sesuai kebutuhan tubuh mereka:
- **Porsi Saji**: *Regular Cup* (Standar) atau *Artisan Pot* (Teko Keramik 600ml untuk berbagi, +Rp 12.000).
- **Temperatur**: *Hot Steeping* (Seduhan Panas Tradisional) atau *Iced Cold Brew* (Seduhan Dingin Segar, +Rp 2.000).
- **Tingkat Kemanisan (*Sweetness Level*)**:
  - `0%` (Tanpa Gula / Murni Karakter Teh)
  - `30%` (Manis Lembut, aroma bunga teh tetap dominan)
  - `50%` (Rasa teh kuat berpadu manis sedang)
  - `75%` (Keseimbangan harmonis antara teh dan manis)
  - `100%` (Rasa manis klasik yang nyaman)
- **Pilihan Pemanis Alami**:
  - *Organic Sorghum Nectar* (Indeks glikemik rendah, aroma karamel alami, tanpa biaya tambahan)
  - *Pure Wild Forest Honey* (Madu murni kaya antioksidan, +Rp 3.000)
  - *Natural Stevia Leaf* (0 kalori nabati murni, tanpa biaya tambahan)
- **Pilihan Topping Botani (*Botanical Flower Add-ons*)**:
  - *Dried Rose Buds Organic* (+Rp 3.000)
  - *Golden Chrysanthemum* (+Rp 3.000)
  - *Butterfly Pea Flower* (+Rp 3.000)
  - *Whole Jasmine Bloom* (+Rp 4.000)
  - *Golden Osmanthus* (+Rp 4.000)

### 3.3 Engine QRIS Dinamis & Fleksibilitas Pembayaran
Sistem pembayaran CHANGKEER dirancang khusus untuk pasar Indonesia:
- **QRIS Dinamis Otomatis**:
  - Mengonversi barcode statis merchant (`CHANGKEER ATELIER`, NMID: `ID1026598652240`) menjadi QRIS dinamis berstandar EMVCo MPM / ASPI.
  - Memasukkan nominal transaksi secara otomatis pada Tag `54` dan menghitung ulang kode integritas **CRC16-CCITT**.
  - Saat pelanggan memindai barcode menggunakan BCA, Mandiri Livin', GoPay, Dana, OVO, atau ShopeePay, nominal pembayaran langsung terkunci dan tidak perlu diketik manual.
- **Dual-Mode Switcher**:
  - Jika aplikasi perbankan tertentu mengalami kendala saat membaca QR dinamis hasil modifikasi, pelanggan dapat langsung beralih ke tab **Merchant QRIS (Manual)**. Tab ini menampilkan kode asli merchant beserta tombol 1-klik untuk menyalin nominal persis (*Copy Amount*).
- **Metode Alternatif**:
  - *Pay at Cashier Counter*: Pelanggan cukup memperlihatkan nomor tiket ke kasir untuk membayar tunai atau kartu debit EDC.
  - *Manual Bank Transfer*: Rekening resmi BCA dengan panduan konfirmasi via WhatsApp.

### 3.4 Pelacak Status Seduhan Real-Time (*Live Brew Tracker*)
Setelah pesanan dibuat, layar otomatis menampilkan halaman pelacakan dengan stepper 4 fase:
1. **Order Received**: Tiket berhasil masuk ke sistem bar.
2. **Brewing Now**: Barista sedang menakar rempah dan menyeduh air pada suhu yang tepat.
3. **Ready to Serve**: Minuman telah siap di meja saji atau siap diantar ke meja pelanggan.
4. **Completed**: Pesanan telah selesai dinikmati.

Halaman ini melakukan sinkronisasi otomatis (*polling*) ke server setiap 4 detik untuk memperbarui status tanpa perlu merefresh halaman.

### 3.5 Cetak Struk Termal POS & Label Cangkir (*Dual Thermal Printing*)
Fitur cetak terintegrasi langsung dengan peramban (*window.print*):
- **Struk Kasir 80mm**: Memuat identitas *Changkeer Atelier*, nomor tiket, rincian item, catatan seduhan, rincian biaya, barcode QRIS kecil, dan ucapan terima kasih.
- **Label Cangkir 58mm**: Format stiker ringkas yang ditempel pada badan cangkir atau botol teh, berisi nama menu, kustomisasi es/gula/topping, nomor meja, dan nama pemesan.

---

## 4. Alur Kerja & Standard Operating Procedure (SOP)

### 4.1 SOP Alur Pemesanan Pelanggan (*Customer Journey*)

```
[ Pelanggan Datang / Buka Web ]
              │
              ▼
    [ Pilih Varian Teh ]
              │
              ▼
[ Atur Temperatur, Porsi, Gula, Topping ]
              │
              ▼
      [ Masuk Keranjang ]
              │
              ▼
     [ Halaman Checkout ]
   1. Isi Nama & WhatsApp
   2. Pilih Meja / Ambil / Kirim
   3. Pilih QRIS / Kasir / Transfer
              │
              ▼
      [ Buat Pesanan ]
              │
              ▼
[ Halaman Pembayaran & Struk ]
   • Scan QRIS (Nominal Terkunci)
   • Klik "Confirm Payment"
              │
              ▼
   [ Barista Meracik Teh ]
```

1. **Memulai Pesanan**: Pelanggan memindai QR di meja bar atau membuka website CHANGKEER di ponsel.
2. **Kustomisasi**: Pelanggan memilih varian teh musiman, menentukan suhu panas/dingin, tingkat kemanisan, jenis pemanis, dan tambahan topping.
3. **Pemeriksaan Keranjang**: Pelanggan memeriksa daftar pesanan di keranjang geser (*Cart Drawer*) dan memastikan jumlah serta catatan khusus sudah sesuai.
4. **Pengisian Data Checkout**:
   - Pelanggan mengisi Nama Lengkap dan Nomor WhatsApp.
   - Memilih mode saji: *Dine-in* (wajib isi nomor meja), *Takeaway* (pilih perkiraan waktu ambil), atau *Delivery* (masukkan alamat lengkap).
   - Memasukkan kode promo voucher jika memiliki kupon diskon.
   - Memilih metode pembayaran: QRIS (direkomendasikan), Bayar di Kasir, atau Transfer BCA.
5. **Penyelesaian Transaksi**:
   - Pelanggan menekan tombol **Place Order & Pay**.
   - Halaman dialihkan ke tanda terima digital. Pelanggan membuka aplikasi m-Banking/e-Wallet, memindai QRIS, dan menekan tombol konfirmasi.

---

### 4.2 SOP Barista & Kru Dapur (*Kitchen Display System*)

1. **Penerimaan Tiket Masuk**:
   - Barista memantau layar KDS (`/admin/kds` atau daftar pesanan di `/admin/orders`).
   - Setiap pesanan baru yang berstatus `received` akan muncul di kolom paling atas dengan tanda nomor meja atau label *Takeaway*.
2. **Pemeriksaan Pembayaran**:
   - Jika metode pembayaran adalah **QRIS** dan status sudah `paid`, barista dapat langsung mulai meracik.
   - Jika metode pembayaran adalah **Cashier**, barista meminta pelanggan menunjukkan nomor tiket, menerima uang tunai / gesek EDC, lalu mengubah status pembayaran menjadi `paid` melalui tombol di dashboard.
3. **Proses Peracikan (*Steeping Protocol*)**:
   - Barista mengubah status pesanan menjadi `brewing`.
   - Menimbang daun teh dan rempah sesuai panduan gramasi menu (misal 5g daun per 250ml air).
   - Mengatur pemanas air pada suhu yang sesuai (85°C untuk teh hijau/bunga halus, 90–95°C untuk herbal akar/kayu manis).
   - Menambahkan pemanis alami yang dipilih (sorgum/madu hutan/stevia) dan topping kelopak bunga di akhir penyajian.
4. **Pencetakan Label**:
   - Jika pesanan berupa *takeaway* atau *delivery*, barista menekan tombol **Print Cup Label (58mm)** dan menempelkan stiker di badan cangkir agar pesanan tidak tertukar.
5. **Penyerahan Pesanan**:
   - Setelah minuman siap, barista mengubah status menjadi `ready`.
   - Mengantarkan cangkir ke nomor meja pelanggan atau memanggil nama pelanggan untuk *takeaway*.
   - Saat cangkir diterima pelanggan, status ditandai sebagai `completed`.

---

### 4.3 SOP Verifikasi Pembayaran & Rekonsiliasi Keuangan

1. **Rekonsiliasi Harian QRIS**:
   - Setiap akhir jam operasional (*closing shift*), supervisor kasir mencocokkan total transaksi QRIS yang tercatat di dashboard CHANGKEER dengan mutasi masuk pada aplikasi DANA Bisnis / Dashboard Merchant ASPI.
2. **Penanganan Transaksi Gantung (*Pending / Unsettled*)**:
   - Jika saldo pelanggan sudah terpotong di aplikasi bank tetapi status di web masih `unpaid`, pelanggan diminta menunjukkan mutasi rekening / bukti struk digital perbankan.
   - Kasir melakukan verifikasi nominal dan nomor referensi RRN, lalu menekan tombol manual konfirmasi di dashboard kasir.
3. **Pembatalan & Pengembalian Dana (*Void / Refund*)**:
   - Pembatalan hanya dapat dilakukan sebelum status pesanan berubah menjadi `brewing`.
   - Pengembalian dana dilakukan oleh supervisor toko melalui transfer kembali ke rekening pelanggan atau uang tunai di kasir dengan mencatat alasan pembatalan di dashboard.

---

## 5. Arsitektur Teknologi & Rekayasa Keamanan

### 5.1 Tumpukan Teknologi (*Tech Stack*)

| Lapisan | Komponen Teknologi | Alasan Pemilihan |
|---|---|---|
| **Framework Web** | Next.js 16 (App Router) | Arsitektur modern dengan *Server Components*, rute API terintegrasi, dan kompilasi cepat Turbopack. |
| **Bahasa Pemrograman** | TypeScript 5 (Strict Mode) | Memberikan keamanan tipe penuh (*end-to-end type safety*) pada model data pesanan dan kalkulasi keuangan. |
| **Library Antarmuka** | React 19 | Render komponen reaktif, pembaruan status optimistik (*optimistic updates*), dan manajemen state yang efisien. |
| **Desain & Styling** | Tailwind CSS v4 | Utilitas CSS modern tanpa file konfigurasi berat, menggunakan *CSS variables* terpusat untuk tema dan responsivitas mobile. |
| **Basis Data Utama** | Supabase (PostgreSQL 15) | Relasi data terstruktur, *Row-Level Security* (RLS) bawaan, dan kemudahan skalabilitas cloud. |
| **Validasi Skema** | Zod v4 | Validasi struktur data yang ketat pada input formulir dan payload API server-side. |
| **Engine Barcode** | `qrcode` + EMVCo MPM Converter | Pustaka rendering QR kode murni tanpa ketergantungan pihak ketiga, menghasilkan format PNG base64 instan. |
| **Pengujian Otomatis** | Vitest | Eksekusi unit test cepat untuk memastikan perhitungan voucher, skema checkout, dan integritas CRC16 QRIS selalu valid. |

---

### 5.2 Arsitektur Ketahanan Data Ganda (*Dual-Tier Resilient Persistence*)

Platform Vercel mengeksekusi rute API menggunakan *serverless container* yang tidak berbagi memori (*stateless*). Untuk memastikan pesanan pelanggan **tidak pernah hilang atau memunculkan error 404** bahkan sebelum tabel database native dimigrasi, CHANGKEER menerapkan sistem penyimpanan berlapis:

```
                  ┌───────────────────────────────┐
                  │    POST /api/orders (Buat)    │
                  └──────────────┬────────────────┘
                                 │
         ┌───────────────────────┴───────────────────────┐
         ▼                                               ▼
┌─────────────────────────────────┐             ┌─────────────────────────────────┐
│     Tingkat 1: Native Supabase  │             │   Tingkat 2: Resilient Fallback │
│          Tabel `orders`         │             │      Tabel `site_settings`      │
├─────────────────────────────────┤             ├─────────────────────────────────┤
│ Berjalan jika skema tabel SQL   │             │ Otomatis aktif jika tabel       │
│ sudah dibuat di PostgreSQL.     │             │ `orders` belum ada. Data aman   │
│                                 │             │ tersimpan dalam JSON terenkripsi│
│                                 │             │ lintas container Vercel.        │
└─────────────────────────────────┘             └─────────────────────────────────┘
                                 │
                                 ▼
                ┌─────────────────────────────────┐
                │    Tingkat 3: Client Storage    │
                │ `sessionStorage` & `localStorage`│
                ├─────────────────────────────────┤
                │ Data pesanan langsung dicache di│
                │ peramban pelanggan untuk render │
                │ instan tanpa jeda loading.      │
                └─────────────────────────────────┘
```

---

### 5.3 Audit Keamanan Transaksi (*Security Safeguards*)

1. **Pencegahan Manipulasi Harga (*Anti Price-Tampering*)**:
   - Client **tidak diizinkan** menentukan total harga sendiri.
   - Server membaca setiap item pesanan, mencocokkannya dengan harga katalog resmi (`SEED_PRODUCTS`), lalu menghitung ulang biaya es (+2.000), porsi teko (+12.000), madu (+3.000), dan topping botani secara matematis di server.
   - Percobaan manipulasi payload JSON (misal mengubah harga menjadi Rp 1) akan otomatis digantikan oleh harga valid dari server.
2. **Validasi Voucher Sisi Server**:
   - Kode voucher divalidasi ulang di backend terhadap subtotal riil, kuota pemakaian, batas minimal belanja, dan tanggal kedaluwarsa.
3. **Idempotensi Pembayaran**:
   - Rute konfirmasi bayar (`POST /api/orders/[id]/pay`) memeriksa status pesanan terlebih dahulu. Jika pesanan sudah berstatus `paid`, transaksi tidak akan diproses ulang untuk mencegah mutasi ganda. Pesanan yang berstatus `cancelled` secara ketat ditolak untuk dibayar.
4. **Algoritma QRIS Dinamis & CRC16-CCITT**:
   - Format QRIS mengikuti spesifikasi Bank Indonesia (ASPI).
   - Tag `01` diubah dari `11` (statis) ke `12` (dinamis).
   - Tag `54` disisipkan dengan panjang karakter dan nominal yang presisi.
   - Checksum dihitung ulang menggunakan algoritma polinomial `0x1021` dengan nilai awal `0xFFFF`.

---

### 5.4 Sistem Ikon Vektor Mandiri (*Bespoke Icon Craft*)

Untuk menjaga identitas visual yang bersih dan eksklusif, CHANGKEER menghindari penggunaan ikon-ikon umum bawaan generator AI yang sering kali memiliki garis miring tak beraturan dan kode vektor yang berantakan.

Sistem ikon CHANGKEER dirancang khusus menggunakan standar baku:
- **Grid Vektor**: Koordinat tetap `24×24` piksel.
- **Ketebalan Garis (*Stroke Width*)**: Konsisten `1.75px` untuk outline dan `2px` untuk aksen utama.
- **Karakter Garis**: Ujung membulat (*round caps*) dan sambungan halus (*round joins*).
- **Fleksibilitas Warna**: Memanfaatkan `currentColor` murni sehingga warna ikon mengikuti hierarki tipografi Tailwind CSS.
- **Ikon Khusus yang Dirancang**:
  - `TeaCupIcon`: Cangkir teh keramik dengan lengkung uap herbal.
  - `TeaLeafIcon`: Daun teh botani dengan tulang daun presisi.
  - `WarmVaporIcon` & `IceCrystalIcon`: Penanda suhu seduhan panas dan es kubus dingin.
  - `QRISScanIcon`: Target scan QR nasional berbingkai rapi.
  - `CashierCounterIcon`: Mesin kasir brew bar.
  - `BankVaultIcon`: Pilar perbankan untuk transfer BCA.
  - `SecureShieldIcon` & `CheckCircleIcon`: Simbol keamanan transaksi dan verifikasi bayar.
  - `BrewClockIcon`: Jam seduh dengan sapuan 15 menit.
  - `DiningTableIcon`, `TakeawayCupIcon`, `DeliveryBikeIcon`: Representasi mode pemesanan.
  - `ThermalSlipIcon`: Kertas struk kasir dengan gerigi potongan.

---

## 6. Panduan Menjalankan & Deployment

### 6.1 Variabel Lingkungan (*Environment Variables*)
Buat berkas `.env.local` pada direktori utama dengan konfigurasi berikut:

```env
# Supabase Database & Auth Configuration
NEXT_PUBLIC_SUPABASE_URL=https://cbguxxexmrhoaenpkoss.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...

# Base URL Website
NEXT_PUBLIC_SITE_URL=https://changkeer.vercel.app
```

### 6.2 Perintah Operasional (*Development & Testing*)

```bash
# 1. Menjalankan server pengembangan lokal
npm run dev

# 2. Menjalankan rangkaian unit test otomatis
npm test

# 3. Menjalankan pengecekan tipe data TypeScript
npm run typecheck

# 4. Melakukan kompilasi build produksi Next.js
npm run build
```

### 6.3 Skema Database Supabase (*Opsional untuk Native PostgreSQL*)
Jika ingin mengaktifkan tabel native di Supabase SQL Editor, jalankan migrasi berkas:
[`supabase/migrations/20261014000000_ecommerce_cafe_schema.sql`](file:///home/ilhammu29/changkeer/supabase/migrations/20261014000000_ecommerce_cafe_schema.sql).

---

## 7. Kesimpulan & Rencana Pengembangan Masa Depan

Sistem CHANGKEER telah berhasil mewujudkan digitalisasi penuh untuk operasional *tea atelier* modern. Dengan memadukan kemudahan pemesanan digital pelanggan, fleksibilitas pembayaran QRIS nasional, ketahanan backend serverless, serta estetika visual botani yang tenang, platform ini siap mendukung ekspansi bisnis baik untuk satu gerai utama maupun jaringan kedai di masa depan.

**Peluang Pengembangan Berikutnya**:
1. **Program Loyalitas Berbasis Stempel Digital (*Digital Stamp Loyalty*)**: Menghitung akumulasi cangkir yang dibeli pelanggan untuk ditukarkan dengan seduhan gratis otomatis di akun pelanggan.
2. **Integrasi Webhook Otomatis Perbankan/PJP**: Bekerja sama langsung dengan aggregator pembayaran (seperti Midtrans atau Xendit) untuk verifikasi status QRIS secara instan tanpa perlu simulasi konfirmasi manual.
3. **Pemesanan Multi-Meja dengan Meja Terkunci (*Table QR Permanent Mapping*)**: QR code akrilik permanen di setiap meja yang otomatis mengunci nomor meja pelanggan tanpa perlu diketik manual.

---
*Dokumentasi ini disusun secara resmi untuk tim pengembang, manajemen operasional, dan staf peracik CHANGKEER.*
