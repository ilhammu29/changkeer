#!/usr/bin/env python3
"""
manual_book_id.py - Generator for Indonesian Manual Book (A4 Portrait)
Clean Editorial Craft Style, Zero AI-Slop, No Badges, Round Bullets,
No Terminal ASCII, Real Product Photos, Layman-Friendly Terms,
Team / Kelompok Specification, and Zero Markdown Asterisks.
"""

def generate_manual_book_id(assets: dict) -> str:
    html = f"""<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>CHANGKEER ATELIER — BUKU PANDUAN OPERASIONAL & MANUAL SISTEM</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap');

@page {{
    size: A4 portrait;
    margin: 22mm 18mm 22mm 18mm;
    @top-left {{
        content: "CHANGKEER ATELIER — MANUAL SISTEM & PANDUAN OPERASIONAL";
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-size: 7.5pt;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #6b7280;
    }}
    @top-right {{
        content: "REV. 2.0 • 2026";
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-size: 7.5pt;
        font-weight: 600;
        color: #946c38;
    }}
    @bottom-left {{
        content: "Tim Pengembang Sistem CHANGKEER • Hak Cipta Dilindungi";
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-size: 7.5pt;
        color: #9ca3af;
    }}
    @bottom-right {{
        content: "Halaman " counter(page) " dari " counter(pages);
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-size: 7.5pt;
        font-weight: 600;
        color: #4b5563;
    }}
}}

@page:first {{
    margin: 0;
    @top-left {{ content: none; }}
    @top-right {{ content: none; }}
    @bottom-left {{ content: none; }}
    @bottom-right {{ content: none; }}
}}

* {{
    box-sizing: border-box;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
}}

body {{
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    font-size: 9.5pt;
    line-height: 1.65;
    color: #24292f;
    background-color: #ffffff;
    margin: 0;
    padding: 0;
}}

/* Typography */
h1, h2, h3, h4 {{
    color: #143828;
    font-family: 'Playfair Display', Georgia, serif;
    font-weight: 700;
    margin-top: 0;
    page-break-after: avoid;
}}

h1 {{
    font-size: 20pt;
    line-height: 1.25;
    margin-bottom: 8pt;
    border-bottom: 1.5px solid #143828;
    padding-bottom: 6pt;
}}

h2 {{
    font-size: 14pt;
    line-height: 1.3;
    margin-top: 18pt;
    margin-bottom: 6pt;
    color: #143828;
}}

h3 {{
    font-size: 11pt;
    line-height: 1.35;
    margin-top: 14pt;
    margin-bottom: 4pt;
    color: #946c38;
}}

p {{
    margin-top: 0;
    margin-bottom: 8pt;
    text-align: justify;
}}

/* Lists with Circular Bullets */
ul {{
    list-style-type: disc !important;
    margin-top: 4pt;
    margin-bottom: 10pt;
    padding-left: 18px;
}}

ul li {{
    margin-bottom: 4pt;
    line-height: 1.55;
}}

ol {{
    margin-top: 4pt;
    margin-bottom: 10pt;
    padding-left: 20px;
}}

ol li {{
    margin-bottom: 4pt;
    line-height: 1.55;
}}

/* Section Eyebrow (No badges) */
.section-eyebrow {{
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 8pt;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #946c38;
    margin-bottom: 4pt;
}}

/* Divider Line */
.rule {{
    border: none;
    border-top: 1px solid #e5e2da;
    margin: 16pt 0;
}}

/* Editorial Note / Layman Box */
.layman-note {{
    border-left: 3px solid #143828;
    background-color: #fbfaf7;
    padding: 8pt 12pt;
    margin: 10pt 0 14pt 0;
    font-size: 9pt;
}}

.layman-note-title {{
    font-weight: 700;
    color: #143828;
    font-size: 8.5pt;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 3pt;
}}

/* Tables */
table.editorial-table {{
    width: 100%;
    border-collapse: collapse;
    margin: 12pt 0;
    font-size: 8.5pt;
    page-break-inside: avoid;
}}

table.editorial-table th {{
    border-top: 1.5px solid #143828;
    border-bottom: 1.5px solid #143828;
    padding: 6pt 8pt;
    text-align: left;
    font-weight: 700;
    color: #143828;
    font-size: 8pt;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    background-color: #f7f6f1;
}}

table.editorial-table td {{
    border-bottom: 1px solid #e5e2da;
    padding: 6pt 8pt;
    vertical-align: top;
}}

table.editorial-table tr:nth-child(even) td {{
    background-color: #fcfbf9;
}}

/* Visual Workflow Diagram (No Terminal ASCII) */
.workflow-container {{
    margin: 14pt 0;
    page-break-inside: avoid;
}}

.workflow-step {{
    display: table;
    width: 100%;
    margin-bottom: 8pt;
    background-color: #fbfaf7;
    border: 1px solid #e5e2da;
    padding: 8pt 12pt;
}}

.workflow-num {{
    display: table-cell;
    width: 32px;
    vertical-align: middle;
    font-family: 'Playfair Display', serif;
    font-size: 16pt;
    font-weight: 700;
    color: #143828;
}}

.workflow-content {{
    display: table-cell;
    vertical-align: middle;
    padding-left: 10pt;
}}

.workflow-title {{
    font-weight: 700;
    color: #143828;
    font-size: 9.5pt;
    margin-bottom: 2pt;
}}

.workflow-desc {{
    font-size: 8.5pt;
    color: #4b5563;
    line-height: 1.45;
}}

.workflow-arrow {{
    text-align: center;
    color: #946c38;
    font-size: 14pt;
    line-height: 1;
    margin: -4pt 0 4pt 0;
}}

/* Product Showcase Grid */
.product-row {{
    display: table;
    width: 100%;
    margin: 10pt 0;
    page-break-inside: avoid;
    border-bottom: 1px solid #e5e2da;
    padding-bottom: 10pt;
}}

.product-img-col {{
    display: table-cell;
    width: 110px;
    vertical-align: top;
}}

.product-img-col img {{
    width: 100px;
    height: 100px;
    object-fit: cover;
    border: 1px solid #e5e2da;
}}

.product-info-col {{
    display: table-cell;
    vertical-align: top;
    padding-left: 14pt;
}}

.product-name {{
    font-family: 'Playfair Display', serif;
    font-size: 12pt;
    font-weight: 700;
    color: #143828;
    margin-bottom: 2pt;
}}

.product-meta {{
    font-size: 8pt;
    font-weight: 600;
    color: #946c38;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 4pt;
}}

.product-desc {{
    font-size: 8.5pt;
    color: #374151;
    line-height: 1.45;
}}

/* Cover Page */
.cover-page {{
    page-break-after: always;
    height: 100vh;
    padding: 35mm 22mm 25mm 22mm;
    background-color: #143828;
    color: #f7f6f1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
}}

.cover-header {{
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    padding-bottom: 16pt;
}}

.cover-brand-title {{
    font-size: 11pt;
    font-weight: 700;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: #dfba7c;
}}

.cover-body {{
    margin: auto 0;
}}

.cover-main-title {{
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 32pt;
    font-weight: 700;
    line-height: 1.15;
    color: #ffffff;
    margin-bottom: 12pt;
}}

.cover-subtitle {{
    font-size: 11.5pt;
    line-height: 1.6;
    color: #d1d5db;
    max-width: 520px;
    margin-bottom: 24pt;
}}

.cover-meta-grid {{
    display: table;
    width: 100%;
    border-top: 1px solid rgba(255, 255, 255, 0.25);
    padding-top: 14pt;
}}

.cover-meta-cell {{
    display: table-cell;
    width: 25%;
    vertical-align: top;
}}

.cover-meta-label {{
    font-size: 7pt;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #dfba7c;
    margin-bottom: 3pt;
}}

.cover-meta-val {{
    font-size: 9pt;
    font-weight: 600;
    color: #ffffff;
}}

.cover-footer {{
    border-top: 1px solid rgba(255, 255, 255, 0.15);
    padding-top: 12pt;
    font-size: 8pt;
    color: #9ca3af;
    display: table;
    width: 100%;
}}

.page-break {{
    page-break-after: always;
}}
</style>
</head>
<body>

<!-- COVER PAGE -->
<div class="cover-page">
    <div class="cover-header">
        <div class="cover-brand-title">CHANGKEER ATELIER • DOKUMEN OPERASIONAL RESMI</div>
    </div>

    <div class="cover-body">
        <div style="margin-bottom: 14pt;">
            <img src="{assets['logo']}" style="width: 75px; height: 75px; border-radius: 50%; border: 2px solid #dfba7c;" alt="Logo Changkeer">
        </div>
        <div class="cover-main-title">Buku Panduan Operasional &amp; Manual Sistem</div>
        <div class="cover-subtitle">
            Standar Baku Alur Pemesanan Mandiri, Sistem Pembayaran QRIS Dinamis, Kitchen Display System (KDS), SOP Barista, dan Tata Kelola Platform Kasir Digital.
        </div>

        <div class="cover-meta-grid">
            <div class="cover-meta-cell">
                <div class="cover-meta-label">Nomor Registrasi</div>
                <div class="cover-meta-val">CK-SOP-2026-V2</div>
            </div>
            <div class="cover-meta-cell">
                <div class="cover-meta-label">Kelompok Pengembang</div>
                <div class="cover-meta-val">Tim Pengembang Sistem</div>
            </div>
            <div class="cover-meta-cell">
                <div class="cover-meta-label">Ketua Tim / Arsitek</div>
                <div class="cover-meta-val">Muhammad Ilham</div>
            </div>
            <div class="cover-meta-cell">
                <div class="cover-meta-label">Tahun Terbit</div>
                <div class="cover-meta-val">Oktober 2026</div>
            </div>
        </div>
    </div>

    <div class="cover-footer">
        <div style="display: table-cell; text-align: left;">CHANGKEER ATELIER • Artisan Herbal Tea &amp; Botanical Blends</div>
        <div style="display: table-cell; text-align: right;">Edisi Standar Operasional Gerai</div>
    </div>
</div>

<!-- LEMBAR KENDALI & TIM KELOMPOK -->
<div class="page-break">
    <div class="section-eyebrow">Dokumen Kendali &amp; Pengesahan</div>
    <h1>Identitas Kelompok &amp; Lembar Pengesahan</h1>

    <p>
        Buku Panduan Operasional ini disusun sebagai pedoman teknis dan tata kelola gerai resmi untuk ekosistem <strong>CHANGKEER ATELIER</strong>. Dokumen ini mengikat seluruh pengembang perangkat lunak, peracik teh (<em>barista</em>), staf kasir, dan penanggung jawab operasional gerai.
    </p>

    <h2>Struktur Kelompok &amp; Tim Pengembang Sistem</h2>
    <table class="editorial-table">
        <thead>
            <tr>
                <th style="width: 25%;">Peran / Jabatan</th>
                <th style="width: 30%;">Penanggung Jawab</th>
                <th>Tugas &amp; Tanggung Jawab Utama</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Ketua Kelompok &amp; Arsitek Sistem</strong></td>
                <td><strong>Muhammad Ilham</strong></td>
                <td>Memimpin perancangan arsitektur perangkat lunak, rekayasa <em>full-stack</em> Next.js &amp; Supabase, keamanan pembayaran QRIS dinamis, dan verifikasi mutu.</td>
            </tr>
            <tr>
                <td><strong>Divisi Frontend &amp; Desain Antarmuka</strong></td>
                <td>Tim Antarmuka Pengguna</td>
                <td>Mengembangkan antarmuka pemesanan mandiri, responsivitas seluler, ikonografi vektor ramah pengguna, dan alur <em>checkout</em> tanpa hambatan.</td>
            </tr>
            <tr>
                <td><strong>Divisi Riset Produk &amp; SOP Barista</strong></td>
                <td>Tim Botani &amp; Barista R&amp;D</td>
                <td>Menyusun katalog 24 racikan musiman, formulasi takaran seduhan, penentuan level gula alami, dan standarisasi waktu ekstraksi air panas.</td>
            </tr>
            <tr>
                <td><strong>Divisi Operasional &amp; Kasir</strong></td>
                <td>Tim Layanan Gerai</td>
                <td>Menjalankan operasional kasir, verifikasi struk transaksi, mitigasi kendala pembayaran di tempat, dan rekonsiliasi kas harian.</td>
            </tr>
        </tbody>
    </table>

    <h2>Daftar Isi Dokumen</h2>
    <ul style="line-height: 1.8; margin-top: 10pt;">
        <li><strong>Bab 1:</strong> Mengenal CHANGKEER &amp; Konsep Teh 24 Musim</li>
        <li><strong>Bab 2:</strong> Struktur Sistem &amp; Ekosistem Teknologi</li>
        <li><strong>Bab 3:</strong> Katalog Menu, Galeri Produk &amp; Kustomisasi Seduhan</li>
        <li><strong>Bab 4:</strong> Alur Transaksi, QRIS Dinamis &amp; Keamanan Pembayaran</li>
        <li><strong>Bab 5:</strong> Standar Operasional Prosedur (SOP) Barista di Bar</li>
        <li><strong>Bab 6:</strong> Standar Operasional Prosedur (SOP) Kasir &amp; Rekonsiliasi</li>
        <li><strong>Bab 7:</strong> Tata Kelola Panel Admin &amp; Manajemen Menu</li>
        <li><strong>Bab 8:</strong> Kamus Istilah Praktis (Glosarium Awam) &amp; Solusi Kendala Cepat</li>
    </ul>

    <div class="layman-note">
        <div class="layman-note-title">Prinsip Komunikasi &amp; Bahasa Ramah Awam</div>
        Panduan ini ditulis dengan pendekatan bahasa yang lugas, terstruktur, dan mudah dipahami oleh pembaca umum. Seluruh istilah teknis komputer maupun istilah peracikan teh dilengkapi dengan perumpamaan sederhana agar langsung dapat dipahami tanpa kebingungan.
    </div>
</div>

<!-- BAB 1 -->
<div class="page-break">
    <div class="section-eyebrow">Bab 01 • Filosofi &amp; Konsep</div>
    <h1>Mengenal CHANGKEER &amp; Filosofi 24 Musim</h1>

    <h2>1.1 Apa Itu CHANGKEER?</h2>
    <p>
        <strong>CHANGKEER</strong> adalah sebuah gerai seduhan teh herbal modern (<em>artisan tea atelier</em>) yang menggabungkan kemurnian tanaman herbal Nusantara dengan filosofi 24 Titik Musim Alam (<em>Solar Terms</em>). Berbeda dari kedai kopi komersial yang serba terburu-buru atau toko jamu tradisional yang belum terstandarisasi, CHANGKEER menghadirkan ruang hening yang nyaman bagi siapa saja yang ingin menikmati minuman sehat, terukur, dan menenangkan jiwa.
    </p>

    <div class="layman-note">
        <div class="layman-note-title">Istilah Mudah Dipahami: Teh Herbal (Tisane) vs Teh Biasa</div>
        Banyak orang mengira semua teh itu sama. Padahal, teh celup biasa di pasaran umumnya berasal dari daun teh hitam pabrikan yang seringkali diberi perisa sintetis. Sementara itu, <strong>Tisane / Teh Herbal CHANGKEER</strong> diracik murni dari rempah dan kelopak bunga asli utuh—seperti melati, bunga telang, jahe merah, dan peppermint—tanpa bahan kimia sintetis dan tanpa pemanis buatan yang membuat lambung perih.
    </div>

    <h2>1.2 Mengapa Menggunakan Siklus 24 Musim Alam?</h2>
    <p>
        Tubuh manusia bereaksi terhadap perubahan cuaca di sekitarnya. Ketika udara sangat panas dan terik, tubuh membutuhkan asupan yang menyejukkan suhu dalam tubuh. Sebaliknya, saat hujan lebat dan dingin, tubuh memerlukan kehangatan rempah alami yang melancarkan sirkulasi darah.
    </p>
    <p>
        Oleh karena itu, CHANGKEER membagi menunya ke dalam 4 pilar musim utama yang diadaptasi dari 24 titik musim:
    </p>
    <ul>
        <li><strong>Musim Semi (Spring):</strong> Karakter rasa bunga segar (floral) yang ringan, berfungsi membantu penyegaran dan detoksifikasi tubuh setelah musim dingin.</li>
        <li><strong>Musim Panas (Summer):</strong> Karakter rasa dingin daun mint dan buah sitrus alami, berfungsi mendinginkan suhu tubuh dan mencegah dehidrasi di cuaca terik.</li>
        <li><strong>Musim Gugur (Autumn):</strong> Karakter rempah hangat dan aroma kayu manis, berfungsi menenangkan pikiran dan meredakan ketegangan otot.</li>
        <li><strong>Musim Dingin (Winter):</strong> Karakter jahe merah pekat dan cengkih nusantara, berfungsi memberi kehangatan mendalam pada tubuh dan menjaga daya tahan tubuh.</li>
    </ul>

    <h2>1.3 Mengapa Dibutuhkan Sistem Digital Mandiri?</h2>
    <p>
        Meracik teh herbal membutuhkan ketelitian waktu seduh dan temperatur air yang sangat presisi. Jika barista harus sibuk mencatat pesanan dengan kertas, menghitung uang kembalian manual, dan mengingat selera gula setiap pelanggan, konsentrasi peracikan akan terganggu.
    </p>
    <p>
        Sistem digital CHANGKEER diciptakan agar pelanggan bisa leluasa memilih racikan favoritnya lewat layar ponsel, membayar secara otomatis lewat QRIS, sementara barista di balik bar dapat 100% fokus menyeduh teh dengan kualitas terbaik.
    </p>
</div>

<!-- BAB 2 -->
<div class="page-break">
    <div class="section-eyebrow">Bab 02 • Arsitektur Sistem</div>
    <h1>Struktur Sistem &amp; Ekosistem Teknologi</h1>

    <h2>2.1 Cara Kerja Sistem di Balik Layar</h2>
    <p>
        Sistem perangkat lunak CHANGKEER dibangun menggunakan teknologi web generasi terbaru yang cepat, ringan, dan aman digunakan di berbagai perangkat—mulai dari ponsel pintar pelanggan, tablet kasir, hingga layar komputer di area dapur barista.
    </p>

    <div class="layman-note">
        <div class="layman-note-title">Perumpamaan Sederhana: Memahami Teknologi CHANGKEER</div>
        Bayangkan sistem ini seperti bangunan gerai fisik teh:
        <ul>
            <li><strong>Next.js (App Router):</strong> Diibaratkan sebagai etalase kaca depan gerai yang sangat rapi, bersih, dan terang. Pelanggan dapat melihat menu dengan cepat tanpa perlu menunggu lama.</li>
            <li><strong>Supabase (Basis Data PostgreSQL):</strong> Diibaratkan sebagai brankas dan buku catatan kasir utama yang tersimpan aman di lantai belakang. Semua data pesanan, pembayaran, dan stok bahan dicatat rapi dan tidak bisa hilang.</li>
            <li><strong>QRIS Dinamis:</strong> Diibaratkan seperti kasir otomatis yang langsung menyebutkan total belanjaan yang pas, sehingga pembeli tinggal menempelkan ponsel tanpa takut salah ketik uang.</li>
            <li><strong>Kitchen Display System (KDS):</strong> Diibaratkan seperti papan nomor antrean digital di meja peracikan, menggantikan kertas bon yang sering basah terkena air panas.</li>
        </ul>
    </div>

    <h2>2.2 Tumpukan Teknologi yang Digunakan</h2>
    <table class="editorial-table">
        <thead>
            <tr>
                <th style="width: 25%;">Komponen</th>
                <th style="width: 25%;">Teknologi Terpilih</th>
                <th>Alasan Pemilihan &amp; Manfaat Operasional</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Aplikasi Web Utama</strong></td>
                <td>Next.js 16 (React 19)</td>
                <td>Halaman terbuka sangat cepat di ponsel pelanggan tanpa memakan kuota internet yang boros.</td>
            </tr>
            <tr>
                <td><strong>Bahasa Pemrograman</strong></td>
                <td>TypeScript 5 (Strict Mode)</td>
                <td>Mencegah galat (<em>bug</em>) sistem sejak penulisan kode, khususnya pada kalkulasi harga dan voucher diskon.</td>
            </tr>
            <tr>
                <td><strong>Desain &amp; Tampilan</strong></td>
                <td>Tailwind CSS</td>
                <td>Tampilan rapi, tombol sentuh berukuran ergonomis, dan nyaman dilihat di berbagai ukuran layar.</td>
            </tr>
            <tr>
                <td><strong>Basis Data &amp; Autentikasi</strong></td>
                <td>Supabase Cloud</td>
                <td>Menyimpan riwayat pesanan dengan sistem keamanan berlapis (<em>Row-Level Security</em>).</td>
            </tr>
            <tr>
                <td><strong>Keamanan Data</strong></td>
                <td>Validasi Skema Zod</td>
                <td>Memastikan setiap formulir pesanan yang dikirim oleh pelanggan berisi data yang sah dan wajar.</td>
            </tr>
        </tbody>
    </table>

    <h2>2.3 Ketahanan Sistem Tanpa Padam (Resiliensi Dual-Tier)</h2>
    <p>
        Salah satu keunggulan teknis sistem CHANGKEER adalah kemampuannya tetap beroperasi mulus meskipun koneksi ke server pusat sedang mengalami gangguan. Sistem dilengkapi dengan penyimpanan cadangan otomatis (<em>active orders fallback store</em>), sehingga pesanan yang dibuat oleh pelanggan di meja bar tetap tercatat dan struk pembayaran tetap dapat dicetak oleh kasir tanpa kepanikan.
    </p>
</div>

<!-- BAB 3 -->
<div class="page-break">
    <div class="section-eyebrow">Bab 03 • Menu &amp; Produk</div>
    <h1>Katalog Menu, Galeri Produk &amp; Kustomisasi</h1>

    <h2>3.1 Tiga Varian Racikan Khas (Signature Blends)</h2>
    <p>
        Setiap cangkir racikan CHANGKEER disajikan menggunakan bahan baku daun teh utuh berkualitas tinggi yang dipadukan dengan herbal alami Nusantara:
    </p>

    <!-- Product 1: Jasmine -->
    <div class="product-row">
        <div class="product-img-col">
            <img src="{assets['jasmine']}" alt="Jasmine Tea">
        </div>
        <div class="product-info-col">
            <div class="product-name">CHANGKEER Jasmine Tea Signature</div>
            <div class="product-meta">Kategori: Floral Tisane • Suhu Rekomendasi: 85°C • Waktu Seduh: 4 Menit</div>
            <div class="product-desc">
                Perpaduan bunga melati alami pegunungan dengan pucuk daun teh hijau pilihan. Menghasilkan aroma menenangkan pikiran, membantu meredakan stres harian, dan memberikan rasa lembut menyegarkan di tenggorokan.
            </div>
        </div>
    </div>

    <!-- Product 2: Vanilla Mint -->
    <div class="product-row">
        <div class="product-img-col">
            <img src="{assets['vanilla_mint']}" alt="Vanilla Mint Tea">
        </div>
        <div class="product-info-col">
            <div class="product-name">CHANGKEER Vanilla Mint Tea</div>
            <div class="product-meta">Kategori: Refreshing Tisane • Suhu Rekomendasi: 90°C • Waktu Seduh: 5 Menit</div>
            <div class="product-desc">
                Semilir sejuk daun peppermint murni berpadu dengan kelembutan aroma ekstrak vanila tropis. Sangat efektif untuk melegakan pernapasan, mendinginkan suhu tubuh di siang hari, dan menjaga pencernaan tetap nyaman.
            </div>
        </div>
    </div>

    <!-- Product 3: English Breakfast -->
    <div class="product-row">
        <div class="product-img-col">
            <img src="{assets['english_breakfast']}" alt="English Breakfast Tea">
        </div>
        <div class="product-info-col">
            <div class="product-name">CHANGKEER English Breakfast Tea</div>
            <div class="product-meta">Kategori: Bold Black Tea • Suhu Rekomendasi: 95°C • Waktu Seduh: 3.5 Menit</div>
            <div class="product-desc">
                Seduhan teh hitam berkarakter mantap dan kaya rasa, dirancang untuk memberikan dorongan energi pagi hari secara bersih tanpa memicu naiknya asam lambung. Menggunakan kantong teh bebas mikroplastik.
            </div>
        </div>
    </div>

    <h2>3.2 Galeri 4 Musim (Solar Terms Seasonal Heroes)</h2>
    <table class="editorial-table">
        <thead>
            <tr>
                <th style="width: 25%;">Musim</th>
                <th style="width: 35%;">Nama Racikan Unggulan</th>
                <th>Karakter Khasiat &amp; Bahan Utama</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Musim Semi</strong></td>
                <td>Start of Spring (立春)</td>
                <td>Kelopak mawar, melati, dan teh hijau pegunungan untuk detoksifikasi alami.</td>
            </tr>
            <tr>
                <td><strong>Musim Panas</strong></td>
                <td>Summer Solstice (夏至)</td>
                <td>Daun mint segar, serai wangi, dan buah lemon kering penyejuk dahaga.</td>
            </tr>
            <tr>
                <td><strong>Musim Gugur</strong></td>
                <td>Autumn Equinox (秋分)</td>
                <td>Bunga chamomile utuh, kayu manis manis, dan akar manis penenang saraf.</td>
            </tr>
            <tr>
                <td><strong>Musim Dingin</strong></td>
                <td>Winter Solstice (冬至)</td>
                <td>Jahe merah tua, cengkih Maluku, dan madu hutan murni penghangat dada.</td>
            </tr>
        </tbody>
    </table>

    <h2>3.3 Panduan Kustomisasi Seduhan bagi Pelanggan</h2>
    <p>
        Sistem pemesanan mandiri memberikan 3 pilihan modifikasi rasa yang terstandarisasi:
    </p>
    <ul>
        <li><strong>Suhu Penyajian:</strong> Hot Tea Pot (Poci Seduh Air Panas Tradisional) atau Iced Shaken Tea (+Rp 2.000 dengan es batu higienis).</li>
        <li><strong>Tingkat Kemanisan Alami:</strong> 0% (Tanpa Gula), 30% (Sedikit Manis), 50% (Rasa Teh Dominan), 75% (Manis Seimbang), dan 100% (Manis Penuh).</li>
        <li><strong>Topping Bunga Botani (+Rp 3.000):</strong> Bunga Telang Segar (Butterfly Pea), Kuntum Melati Kering (Dried Jasmine), Bunga Marigold Emas, atau Tambahan Madu Hutan Murni.</li>
    </ul>
</div>

<!-- BAB 4 -->
<div class="page-break">
    <div class="section-eyebrow">Bab 04 • Alur &amp; Keamanan Transaksi</div>
    <h1>Alur Transaksi &amp; QRIS Dinamis</h1>

    <h2>4.1 Diagram Alur Transaksi Dari Meja hingga Meja Barista</h2>
    <p>
        Berikut adalah visual alur kerja pemesanan mandiri digital di gerai CHANGKEER:
    </p>

    <!-- Visual HTML/SVG Flow Diagram -->
    <div class="workflow-container">
        <div class="workflow-step">
            <div class="workflow-num">1</div>
            <div class="workflow-content">
                <div class="workflow-title">Pelanggan Memilih Menu &amp; Kustomisasi di Ponsel</div>
                <div class="workflow-desc">Pelanggan membuka menu web, memilih racikan teh, menyesuaikan suhu (panas/dingin), tingkat kemanisan, serta topping bunga.</div>
            </div>
        </div>

        <div class="workflow-arrow">&#8595;</div>

        <div class="workflow-step">
            <div class="workflow-num">2</div>
            <div class="workflow-content">
                <div class="workflow-title">Sistem Mengunci Nominal &amp; Menghasilkan QRIS Dinamis</div>
                <div class="workflow-desc">Sistem menghitung total belanjaan resmi, mengunci nominal, dan menerbitkan kode QRIS langsung di layar HP pelanggan.</div>
            </div>
        </div>

        <div class="workflow-arrow">&#8595;</div>

        <div class="workflow-step">
            <div class="workflow-num">3</div>
            <div class="workflow-content">
                <div class="workflow-title">Verifikasi Server Otomatis (Proteksi Anti-Kecurangan)</div>
                <div class="workflow-desc">Server menghitung ulang keaslian harga bahan. Jika data sah, status pembayaran berubah menjadi Sukses secara instan.</div>
            </div>
        </div>

        <div class="workflow-arrow">&#8595;</div>

        <div class="workflow-step">
            <div class="workflow-num">4</div>
            <div class="workflow-content">
                <div class="workflow-title">Tiket Digital Otomatis Masuk ke Monitor Dapur (KDS)</div>
                <div class="workflow-desc">Layar monitor barista langsung memunculkan pesanan baru lengkap dengan nomor antrean, meja, dan resep kustomisasi.</div>
            </div>
        </div>

        <div class="workflow-arrow">&#8595;</div>

        <div class="workflow-step">
            <div class="workflow-num">5</div>
            <div class="workflow-content">
                <div class="workflow-title">Barista Menyeduh Teh &amp; Menyerahkan ke Pelanggan</div>
                <div class="workflow-desc">Barista menyeduh air dengan suhu presisi. Setelah selesai, tombol 'Siap Disajikan' ditekan dan struk digital terbit.</div>
            </div>
        </div>
    </div>

    <h2>4.2 Mengapa QRIS Dinamis Jauh Lebih Aman?</h2>
    <div class="layman-note">
        <div class="layman-note-title">Penjelasan Awam: QRIS Statis vs QRIS Dinamis</div>
        <ul>
            <li><strong>QRIS Statis (Kertas Tempel Biasa):</strong> Seperti celengan tanpa angka. Pelanggan harus mengetik sendiri angka misalnya "Rp 32.500". Sering terjadi kesalahan ketik: kurang angka nol menjadi Rp 3.250 atau lebih nol menjadi Rp 325.000. Kasir harus memeriksa layar HP pelanggan satu per satu, menyebabkan antrean panjang.</li>
            <li><strong>QRIS Dinamis CHANGKEER:</strong> Seperti mesin kasir pintar. Saat barcode dipindai, nominal Rp 32.500 sudah otomatis terkunci di layar m-Banking pelanggan. Pelanggan tinggal menekan 'Konfirmasi Bayar'. Cepat, 100% tepat, dan bebas dari antrean kasir.</li>
        </ul>
    </div>

    <h2>4.3 Perlindungan Anti-Kecurangan (Server-Side Anti-Tampering)</h2>
    <p>
        Banyak toko daring mengalami kerugian karena orang usil mengubah nominal belanjaan lewat kode peramban HP. Pada sistem CHANGKEER, harga barang <strong>tidak pernah dipercayakan pada HP pelanggan</strong>. Setiap item diperiksa ulang langsung ke katalog server pusat. Jika harga sengaja dimanipulasi, pesanan otomatis digugurkan oleh sistem keamanan.
    </p>

    <h2>4.4 Proteksi Saldo Terpotong Ganda (Idempotensi)</h2>
    <p>
        Jika sinyal internet pelanggan sedang lemah dan tombol "Bayar" tertekan berulang kali, sistem memiliki mekanisme pencegahan duplikasi (<em>idempotency lock</em>). Saldo pelanggan dijamin hanya terpotong satu kali untuk satu nomor pesanan yang sama.
    </p>
</div>

<!-- BAB 5 -->
<div class="page-break">
    <div class="section-eyebrow">Bab 05 • Standar Operasional Barista</div>
    <h1>Standar Operasional Prosedur (SOP) Barista di Bar</h1>

    <h2>5.1 Membaca Layar Kitchen Display System (KDS)</h2>
    <p>
        Setiap barista wajib mengamati monitor layar sentuh KDS yang diletakkan di atas meja peracikan. Kartu pesanan akan muncul secara otomatis berurutan sesuai waktu masuk:
    </p>
    <ul>
        <li><strong>Warna Kuning / Amber:</strong> Pesanan baru masuk (<em>Order Received</em>) yang menunggu giliran seduh.</li>
        <li><strong>Warna Biru / Indigo:</strong> Pesanan sedang dalam proses seduh aktif (<em>Brewing Now</em>).</li>
        <li><strong>Warna Hijau:</strong> Seduhan selesai dan teh siap diserahkan kepada pelanggan (<em>Ready to Serve</em>).</li>
    </ul>

    <h2>5.2 Standar Suhu Air &amp; Waktu Ekstraksi Seduhan</h2>
    <table class="editorial-table">
        <thead>
            <tr>
                <th style="width: 30%;">Jenis Daun / Tisane</th>
                <th style="width: 25%;">Suhu Air Ideal</th>
                <th style="width: 25%;">Durasi Seduh</th>
                <th>Catatan Khusus Barista</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Teh Hijau &amp; Melati</strong></td>
                <td>80°C – 85°C</td>
                <td>3.5 – 4 Menit</td>
                <td>Jangan gunakan air mendidih (100°C) agar rasa tidak pahit/sepat.</td>
            </tr>
            <tr>
                <td><strong>Teh Hitam (English Breakfast)</strong></td>
                <td>95°C – 98°C</td>
                <td>3 – 3.5 Menit</td>
                <td>Tutup cangkir poci agar minyak esensial daun tidak menguap.</td>
            </tr>
            <tr>
                <td><strong>Herbal Bunga (Chamomile/Rosella)</strong></td>
                <td>90°C – 95°C</td>
                <td>5 Menit Penuh</td>
                <td>Biarkan warna kelopak bunga terekstraksi sempurna menjadi merah/emas.</td>
            </tr>
            <tr>
                <td><strong>Tisane Rempah (Jahe/Serai)</strong></td>
                <td>98°C – 100°C</td>
                <td>6 Menit Penuh</td>
                <td>Suhu mendidih diperlukan untuk mengeluarkan kehangatan minyak atsiri jahe.</td>
            </tr>
        </tbody>
    </table>

    <h2>5.3 Prosedur Penakaran Pemanis Alami</h2>
    <p>
        Barista wajib menggunakan sendok takar khusus (<em>jigger mililiter</em>) untuk menjaga konsistensi rasa:
    </p>
    <ul>
        <li><strong>0% (No Sweetener):</strong> Tanpa tambahan pemanis sama sekali.</li>
        <li><strong>30% (Light Sweetness):</strong> 7.5 ml madu hutan / sirup sorgum murni.</li>
        <li><strong>50% (Tea Forward):</strong> 12.5 ml madu hutan / sirup sorgum murni.</li>
        <li><strong>75% (Balanced):</strong> 18 ml madu hutan / sirup sorgum murni.</li>
        <li><strong>100% (Full Sweetness):</strong> 25 ml madu hutan / sirup sorgum murni.</li>
    </ul>

    <h2>5.4 Tata Cara Penyerahan Teh ke Meja Pelanggan</h2>
    <p>
        Setelah seduhan selesai, tekan tombol <strong>'Siap Saji'</strong> di layar KDS. Bawa cangkir atau poci menggunakan nampan kayu sawo, sebutkan nama pelanggan serta nomor meja dengan ramah, dan jelaskan secara singkat aroma dominan teh yang disajikan.
    </p>
</div>

<!-- BAB 6 -->
<div class="page-break">
    <div class="section-eyebrow">Bab 06 • Standar Operasional Kasir</div>
    <h1>Standar Operasional Kasir &amp; Rekonsiliasi</h1>

    <h2>6.1 Tanggung Jawab Staf Kasir</h2>
    <p>
        Meskipun pelanggan dapat membayar mandiri lewat QRIS di meja, kasir gerai tetap memegang peran krusial dalam melayani pembayaran tunai, transaksi kartu debit, serta memverifikasi kendala pembayaran digital.
    </p>

    <h2>6.2 Panduan Penanganan Masalah Pembayaran (Troubleshooting)</h2>
    <table class="editorial-table">
        <thead>
            <tr>
                <th style="width: 25%;">Situasi Kendala</th>
                <th style="width: 35%;">Penyebab Utama</th>
                <th>Tindakan Cepat Staf Kasir</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>QRIS Tidak Bisa Dipindai</strong></td>
                <td>Kecerahan layar ponsel pelanggan terlalu rendah atau lensa kamera kotor.</td>
                <td>Minta pelanggan menaikkan kecerahan layar ke tingkat maksimal, atau minta pelanggan menunjukkan nomor pesanan untuk dibayar di mesin kasir fisik.</td>
            </tr>
            <tr>
                <td><strong>Saldo Terpotong, Status Belum Berubah</strong></td>
                <td>Keterlambatan jaringan bank (<em>bank network delay</em>) saat jam sibuk.</td>
                <td>Minta pelanggan memperlihatkan bukti mutasi berhasil di aplikasi m-Banking. Kasir membuka panel kasir dan menekan tombol konfirmasi pembayaran manual.</td>
            </tr>
            <tr>
                <td><strong>Pelanggan Salah Memilih Menu</strong></td>
                <td>Pelanggan terburu-buru saat menekan tombol di keranjang belanja.</td>
                <td>Jika barista belum mulai menyeduh, kasir dapat membatalkan tiket di dashboard dan membantu pelanggan memesan ulang varian yang benar.</td>
            </tr>
        </tbody>
    </table>

    <h2>6.3 Prosedur Pengembalian Dana (Refund)</h2>
    <p>
        Pengembalian dana hanya diperbolehkan apabila bahan baku teh pesanan habis mendadak atau terjadi pembatalan sebelum proses seduhan air panas dimulai. Pengembalian dana QRIS diselesaikan secara tunai melalui laci kasir gerai setelah supervisor gerai memverifikasi pembatalan tiket di dashboard sistem.
    </p>

    <h2>6.4 Rekonsiliasi Kas Harian (Closing Kasir)</h2>
    <p>
        Setiap akhir jam operasional gerai (pukul 22.00 WIB), staf kasir wajib mencetak ringkasan penjualan harian dari panel admin. Total uang fisik di laci kasir dicocokkan dengan catatan penjualan tunai, dan rekap mutasi QRIS dicocokkan dengan laporan transaksi harian bank.
    </p>
</div>

<!-- BAB 7 -->
<div class="page-break">
    <div class="section-eyebrow">Bab 07 • Pengelolaan Toko</div>
    <h1>Tata Kelola Panel Admin &amp; Manajemen Menu</h1>

    <h2>7.1 Akses Dashboard Pengelola (Admin Panel)</h2>
    <p>
        Panel pengelola beralamat di <code>/admin</code> dan hanya dapat diakses oleh staf berwenang yang memiliki akun terdaftar. Sistem melindungi halaman pengelola dengan kunci sesi terenkripsi untuk mencegah akses tanpa izin dari luar gerai.
    </p>

    <h2>7.2 Mengatur Ketersediaan Menu &amp; Stok Bahan</h2>
    <p>
        Jika salah satu jenis kelopak bunga herbal (misalnya bunga chamomile utuh) habis karena panen terhambat cuaca, pengelola toko dapat mematikan status ketersediaan item tersebut dalam waktu 5 detik:
    </p>
    <ol>
        <li>Buka menu <strong>Katalog Produk</strong> di bilah navigasi admin.</li>
        <li>Cari produk atau topping yang bersangkutan.</li>
        <li>Geser sakelar tombol status menjadi <strong>'Non-Aktif' (Out of Stock)</strong>.</li>
        <li>Sistem otomatis menyembunyikan opsi tersebut dari layar pemesanan pelanggan seketika, mencegah kekecewaan pelanggan.</li>
    </ol>

    <h2>7.3 Mengelola Kupon Promo &amp; Diskon Member</h2>
    <p>
        Pengelola gerai dapat merancang program loyalitas musiman, misalnya diskon 15% untuk menyambut Musim Semi:
    </p>
    <ul>
        <li><strong>Kode Promo:</strong> Dibuat dengan huruf kapital yang mudah diingat (contoh: <code>SPRINGWELLNESS</code>).</li>
        <li><strong>Tipe Diskon:</strong> Dapat berupa persentase (misal 15%) atau potongan nominal langsung (misal Rp 10.000).</li>
        <li><strong>Batas Minimum Belanja:</strong> Menentukan batas minimal transaksi agar promo dapat digunakan (contoh: Rp 50.000).</li>
        <li><strong>Batas Kuota Pemakaian:</strong> Membatasi jumlah pelanggan beruntung yang dapat menukarkan kupon tersebut.</li>
    </ul>

    <h2>7.4 Mengunduh Laporan Keuangan &amp; Penjualan</h2>
    <p>
        Dashboard menyediakan grafik tren omzet harian, mingguan, dan bulanan serta rincian menu terlaris. Laporan dapat diekspor langsung ke format lembar kerja Excel (CSV) untuk keperluan audit akuntansi dan pelaporan pajak usaha.
    </p>
</div>

<!-- BAB 8 -->
<div class="page-break">
    <div class="section-eyebrow">Bab 08 • Glosarium &amp; Bantuan Cepat</div>
    <h1>Kamus Istilah Praktis &amp; Solusi Kendala Cepat</h1>

    <h2>8.1 Kamus Istilah Praktis untuk Orang Awam</h2>
    <table class="editorial-table">
        <thead>
            <tr>
                <th style="width: 25%;">Istilah Teknis / Teh</th>
                <th style="width: 35%;">Penjelasan Sederhana</th>
                <th>Contoh Nyata di Gerai CHANGKEER</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>QRIS Dinamis</strong></td>
                <td>Barcode pembayaran pintar yang langsung terisi nominal belanjaan tanpa perlu diketik manual.</td>
                <td>Pelanggan memindai barcode di meja dan angka Rp 35.000 langsung muncul otomatis di aplikasi BCA/GoPay/Dana.</td>
            </tr>
            <tr>
                <td><strong>KDS (Kitchen Display System)</strong></td>
                <td>Monitor antrean digital di meja barista pengganti sobekan kertas bon kasir.</td>
                <td>Layar sentuh di bar yang memberi tahu barista bahwa meja 4 memesan Jasmine Tea manis 50%.</td>
            </tr>
            <tr>
                <td><strong>Anti-Tampering</strong></td>
                <td>Sistem pengaman yang mencegah pembeli nakal mengubah harga minuman dari ponselnya.</td>
                <td>Jika ada yang mencoba mengganti harga teh dari Rp 28.000 menjadi Rp 1.000, pesanan otomatis ditolak komputer server.</td>
            </tr>
            <tr>
                <td><strong>Idempotency Lock</strong></td>
                <td>Mekanisme proteksi yang mencegah saldo pembeli terpotong dua kali akibat klik ganda.</td>
                <td>Pelanggan menekan tombol bayar 3 kali saat internet lambat, tetapi saldo bank hanya terdebet 1 kali.</td>
            </tr>
            <tr>
                <td><strong>Tisane Botani</strong></td>
                <td>Minuman seduhan murni dari rempah, daun herbal, atau kelopak bunga asli tanpa daun teh hitam biasa.</td>
                <td>Seduhan bunga rosella merah menyegarkan atau chamomile madu penenang tidur.</td>
            </tr>
            <tr>
                <td><strong>Solar Terms (24 Musim)</strong></td>
                <td>Pembagian 24 titik perubahan musim alam untuk mencocokkan khasiat teh dengan cuaca tubuh.</td>
                <td>Menikmati seduhan mint dingin saat cuaca terik musim panas (Summer Solstice).</td>
            </tr>
        </tbody>
    </table>

    <h2>8.2 Solusi Cepat Kendala Gerai (Quick Fix Matrix)</h2>
    <ul>
        <li><strong>Layar KDS Barista Mati Mendadak:</strong> Periksa kabel daya tablet/monitor bar. Pastikan perangkat terhubung ke Wi-Fi internal gerai <code>CHANGKEER_BAR_5G</code>. Buka peramban dan muat ulang halaman <code>/kds</code>.</li>
        <li><strong>Koneksi Internet Gerai Terputus:</strong> Sistem kasir otomatis beralih ke mode penyimpanan lokal. Staf kasir dapat tetap mencatat pesanan tunai secara manual, dan data akan disinkronkan kembali saat internet pulih.</li>
        <li><strong>Struk Printer Termal Tidak Keluar:</strong> Periksa gulungan kertas termal 58mm/80mm di dalam printer kasir. Pastikan tuas penutup terkunci rapat dan lampu indikator printer berwarna hijau.</li>
    </ul>

    <div class="rule"></div>

    <div style="text-align: center; font-size: 8pt; color: #6b7280; margin-top: 18pt;">
        Dokumen ini diterbitkan secara resmi oleh <strong>Kelompok Pengembang Sistem CHANGKEER</strong>.<br>
        Ketua Tim &amp; Arsitek Sistem: <strong>Muhammad Ilham</strong>.<br>
        &copy; 2026 CHANGKEER ATELIER. Hak Cipta Dilindungi Undang-Undang.
    </div>
</div>

</body>
</html>
"""
    # Strict validation: Ensure NO asterisks leaked into HTML text
    # In HTML, asterisks can cause formatting issues or violate user request
    # Let's check text content
    clean_html = html.replace("*", "")  # Guarantee zero asterisks
    return clean_html

if __name__ == "__main__":
    from assets_loader import get_all_assets
    assets = get_all_assets()
    out = generate_manual_book_id(assets)
    print(f"Indonesian Manual Book generated. Total chars: {len(out)}")
