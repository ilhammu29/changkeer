#!/usr/bin/env python3
"""
manual_book_id.py - Indonesian Manual Book (A4 Portrait)
Featuring:
- Official Web Logo (logo_new.png)
- The 5 Co-Founders from the website About page
- Complete 24 Seasonal Products Catalog with compact, simple images
- High Contrast, Pristine Professional Typography, Zero AI-slop, No Badges, Round Bullets
- Zero mention of user's personal name
- Zero mention of OXID
- Zero asterisks
"""

def generate_manual_book_id(assets: dict) -> str:
    founders = assets.get("founders", [])
    solar_terms = assets.get("solar_terms", [])
    logo_b64 = assets.get("logo", "")

    # Group the 24 products by season
    seasons = [
        {"id": "spring", "name": "Musim Semi (Spring)", "desc": "Karakter rasa bunga segar (floral), ringan, dan herba muda untuk penyegaran serta detoksifikasi tubuh."},
        {"id": "summer", "name": "Musim Panas (Summer)", "desc": "Karakter rasa dingin daun mint, sitrus alami, dan bunga penyejuk suhu tubuh di tengah cuaca terik."},
        {"id": "autumn", "name": "Musim Gugur (Autumn)", "desc": "Karakter aroma manis kayu manis, chamomile, dan biji-bijian panggang untuk ketenangan saraf."},
        {"id": "winter", "name": "Musim Dingin (Winter)", "desc": "Karakter rempah hangat jahe merah tua, cengkih, dan madu hutan untuk menjaga daya tahan tubuh."}
    ]

    # Generate 24 products HTML
    catalog_html = ""
    for s in seasons:
        s_items = [b for b in solar_terms if b.get("season") == s["id"]]
        catalog_html += f"""
        <div style="margin-top: 14pt; page-break-inside: avoid;">
            <div style="font-family: 'Playfair Display', serif; font-size: 13pt; font-weight: 700; color: #143828; border-bottom: 1px solid #143828; padding-bottom: 3pt; margin-bottom: 6pt;">
                {s['name']}
            </div>
            <p style="font-size: 8.5pt; color: #4a5568; margin-bottom: 8pt;">{s['desc']}</p>
            <div style="display: table; width: 100%; table-layout: fixed;">
        """
        # Split 6 items into 2 rows of 3 columns
        for row_idx in range(0, len(s_items), 2):
            catalog_html += '<div style="display: table-row;">'
            for col_idx in range(2):
                if row_idx + col_idx < len(s_items):
                    item = s_items[row_idx + col_idx]
                    ingr_str = ", ".join(item.get("ingredients", []))
                    catalog_html += f"""
                    <div style="display: table-cell; width: 50%; vertical-align: top; padding: 6pt; border: 1px solid #e2e8f0; background: #ffffff;">
                        <div style="display: table; width: 100%;">
                            <div style="display: table-cell; width: 58px; vertical-align: top;">
                                <img src="{item.get('thumb_b64', '')}" style="width: 52px; height: 52px; object-fit: cover; border: 1px solid #cbd5e1; display: block;" alt="{item.get('term')}">
                            </div>
                            <div style="display: table-cell; vertical-align: top; padding-left: 8pt;">
                                <div style="font-family: 'Playfair Display', serif; font-size: 9.5pt; font-weight: 700; color: #143828;">
                                    {item.get('term')} <span style="font-family: sans-serif; font-size: 8.5pt; color: #946c38;">({item.get('termChinese')})</span>
                                </div>
                                <div style="font-size: 8pt; font-weight: 600; color: #946c38; text-transform: uppercase;">
                                    {item.get('blend')} • Hot {item.get('hotPrice')} / Ice {item.get('icedPrice')}
                                </div>
                                <div style="font-size: 8pt; color: #2d3748; margin-top: 2pt; line-height: 1.35;">
                                    <strong>Bahan:</strong> {ingr_str}
                                </div>
                                <div style="font-size: 7.5pt; color: #4a5568; margin-top: 1pt; font-style: italic;">
                                    "{item.get('note')}"
                                </div>
                            </div>
                        </div>
                    </div>
                    """
                else:
                    catalog_html += '<div style="display: table-cell; width: 50%;"></div>'
            catalog_html += '</div>'
        catalog_html += '</div></div>'

    # Founders Table Rows
    founders_rows = ""
    for f in founders:
        founders_rows += f"""
        <tr>
            <td style="text-align: center; font-weight: 700; color: #143828;">{f['num']}</td>
            <td><strong>{f['name']}</strong></td>
            <td>{f['role']}</td>
            <td>{f['focus_id']}</td>
        </tr>
        """

    html = f"""<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>CHANGKEER ATELIER — BUKU PANDUAN OPERASIONAL &amp; MANUAL SISTEM</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap');

@page {{
    size: A4 portrait;
    margin: 20mm 18mm 20mm 18mm;
    @top-left {{
        content: "CHANGKEER ATELIER — BUKU PANDUAN OPERASIONAL &amp; MANUAL SISTEM";
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-size: 7.5pt;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #4a5568;
    }}
    @top-right {{
        content: "EDISI RESMI 2026";
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-size: 7.5pt;
        font-weight: 700;
        color: #946c38;
    }}
    @bottom-left {{
        content: "Dewan Pendiri CHANGKEER • Hak Cipta Dilindungi Undang-Undang";
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-size: 7.5pt;
        color: #718096;
    }}
    @bottom-right {{
        content: "Halaman " counter(page) " dari " counter(pages);
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-size: 7.5pt;
        font-weight: 700;
        color: #143828;
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
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 9.5pt;
    line-height: 1.6;
    color: #1a202c;
    background-color: #ffffff;
    margin: 0;
    padding: 0;
}}

h1, h2, h3, h4 {{
    color: #143828;
    font-family: 'Playfair Display', Georgia, serif;
    font-weight: 700;
    margin-top: 0;
    page-break-after: avoid;
}}

h1 {{
    font-size: 19pt;
    line-height: 1.25;
    margin-bottom: 8pt;
    border-bottom: 2px solid #143828;
    padding-bottom: 5pt;
}}

h2 {{
    font-size: 13pt;
    line-height: 1.3;
    margin-top: 16pt;
    margin-bottom: 6pt;
    color: #143828;
}}

h3 {{
    font-size: 10.5pt;
    line-height: 1.35;
    margin-top: 12pt;
    margin-bottom: 4pt;
    color: #946c38;
}}

p {{
    margin-top: 0;
    margin-bottom: 7pt;
    text-align: justify;
    color: #2d3748;
}}

ul {{
    list-style-type: disc !important;
    margin-top: 3pt;
    margin-bottom: 8pt;
    padding-left: 18px;
}}

ul li {{
    margin-bottom: 3pt;
    line-height: 1.5;
    color: #2d3748;
}}

ol {{
    margin-top: 3pt;
    margin-bottom: 8pt;
    padding-left: 18px;
}}

ol li {{
    margin-bottom: 3pt;
    line-height: 1.5;
    color: #2d3748;
}}

.section-label {{
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 8pt;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #946c38;
    margin-bottom: 3pt;
}}

.rule {{
    border: none;
    border-top: 1px solid #e2e8f0;
    margin: 14pt 0;
}}

.layman-box {{
    border-left: 3.5px solid #143828;
    background-color: #f8fafc;
    border-right: 1px solid #e2e8f0;
    border-top: 1px solid #e2e8f0;
    border-bottom: 1px solid #e2e8f0;
    padding: 8pt 11pt;
    margin: 9pt 0;
    font-size: 8.5pt;
}}

.layman-box-title {{
    font-weight: 700;
    color: #143828;
    font-size: 8.5pt;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 3pt;
}}

table.editorial-table {{
    width: 100%;
    border-collapse: collapse;
    margin: 10pt 0;
    font-size: 8.5pt;
    page-break-inside: avoid;
}}

table.editorial-table th {{
    border-top: 2px solid #143828;
    border-bottom: 1.5px solid #143828;
    padding: 6pt 8pt;
    text-align: left;
    font-weight: 700;
    color: #143828;
    font-size: 8pt;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    background-color: #f1f5f9;
}}

table.editorial-table td {{
    border-bottom: 1px solid #e2e8f0;
    padding: 5.5pt 8pt;
    vertical-align: top;
    color: #2d3748;
}}

table.editorial-table tr:nth-child(even) td {{
    background-color: #f8fafc;
}}

/* Workflow Step Box */
.workflow-step {{
    display: table;
    width: 100%;
    margin-bottom: 6pt;
    background-color: #f8fafc;
    border: 1px solid #cbd5e1;
    padding: 6pt 10pt;
    page-break-inside: avoid;
}}

.workflow-num {{
    display: table-cell;
    width: 28px;
    vertical-align: middle;
    font-family: 'Playfair Display', serif;
    font-size: 15pt;
    font-weight: 700;
    color: #143828;
}}

.workflow-content {{
    display: table-cell;
    vertical-align: middle;
    padding-left: 8pt;
}}

.workflow-title {{
    font-weight: 700;
    color: #143828;
    font-size: 9pt;
    margin-bottom: 1pt;
}}

.workflow-desc {{
    font-size: 8pt;
    color: #4a5568;
    line-height: 1.35;
}}

.workflow-arrow {{
    text-align: center;
    color: #946c38;
    font-size: 12pt;
    line-height: 1;
    margin: -3pt 0 3pt 0;
}}

/* Cover Page */
.cover-page {{
    page-break-after: always;
    height: 100vh;
    padding: 32mm 22mm 24mm 22mm;
    background-color: #143828;
    color: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
}}

.cover-header {{
    border-bottom: 1px solid rgba(255, 255, 255, 0.25);
    padding-bottom: 14pt;
}}

.cover-brand-title {{
    font-size: 10pt;
    font-weight: 700;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #dfba7c;
}}

.cover-main-title {{
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 30pt;
    font-weight: 700;
    line-height: 1.15;
    color: #ffffff;
    margin-bottom: 10pt;
}}

.cover-subtitle {{
    font-size: 11pt;
    line-height: 1.55;
    color: #e2e8f0;
    max-width: 520px;
    margin-bottom: 20pt;
}}

.cover-meta-grid {{
    display: table;
    width: 100%;
    border-top: 1px solid rgba(255, 255, 255, 0.25);
    padding-top: 12pt;
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
    font-size: 8.5pt;
    font-weight: 600;
    color: #ffffff;
}}

.cover-footer {{
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    padding-top: 10pt;
    font-size: 8pt;
    color: #cbd5e1;
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
        <div class="cover-brand-title">CHANGKEER ATELIER • DOKUMEN SISTEM &amp; OPERASIONAL RESMI</div>
    </div>

    <div>
        <div style="margin-bottom: 12pt;">
            <img src="{logo_b64}" style="width: 70px; height: 70px; border-radius: 50%; border: 2.5px solid #dfba7c; background: #ffffff;" alt="Logo Changkeer Web">
        </div>
        <div class="cover-main-title">Buku Panduan Operasional &amp; Manual Sistem</div>
        <div class="cover-subtitle">
            Standar Prosedur Operasional (SOP) Seduhan Teh Herbal 24 Musim, Alur Pemesanan Mandiri, Pembayaran Otomatis QRIS Dinamis, Kitchen Display System (KDS), dan Manajemen Platform Kasir Digital.
        </div>

        <div class="cover-meta-grid">
            <div class="cover-meta-cell">
                <div class="cover-meta-label">Nomor Dokumen</div>
                <div class="cover-meta-val">CK-SOP-2026-V3</div>
            </div>
            <div class="cover-meta-cell">
                <div class="cover-meta-label">Kelompok Pendiri</div>
                <div class="cover-meta-val">5 Co-Founders</div>
            </div>
            <div class="cover-meta-cell">
                <div class="cover-meta-label">Entitas Usaha</div>
                <div class="cover-meta-val">CHANGKEER ATELIER</div>
            </div>
            <div class="cover-meta-cell">
                <div class="cover-meta-label">Tahun Rilis</div>
                <div class="cover-meta-val">Oktober 2026</div>
            </div>
        </div>
    </div>

    <div class="cover-footer">
        <div style="display: table-cell; text-align: left;">CHANGKEER ATELIER • Artisan Herbal Tea &amp; Botanical Blends</div>
        <div style="display: table-cell; text-align: right;">Edisi Standar Operasional Gerai</div>
    </div>
</div>

<!-- HALAMAN TIM PENDIRI (FOUNDERS) & DAFTAR ISI -->
<div class="page-break">
    <div class="section-label">Dokumen Kendali &amp; Pengesahan</div>
    <h1>Dewan Pendiri &amp; Struktur Organisasi</h1>

    <p>
        Buku Panduan Operasional ini mengikat seluruh jajaran operasional, staf peracik teh (<em>barista</em>), staf kasir (<em>cashier counter</em>), dan pengelola teknis di seluruh gerai fisik CHANGKEER ATELIER. Dokumen ini disahkan oleh lima pendiri resmi CHANGKEER.
    </p>

    <h2>Dewan Pendiri CHANGKEER (The 5 Co-Founders)</h2>
    <table class="editorial-table">
        <thead>
            <tr>
                <th style="width: 8%;">No</th>
                <th style="width: 32%;">Nama Pendiri</th>
                <th style="width: 18%;">Jabatan</th>
                <th>Bidang Fokus &amp; Tanggung Jawab Utama</th>
            </tr>
        </thead>
        <tbody>
            {founders_rows}
        </tbody>
    </table>

    <h2>Daftar Isi Dokumen</h2>
    <ul style="line-height: 1.7; margin-top: 8pt;">
        <li><strong>Bab 1:</strong> Mengenal CHANGKEER &amp; Filosofi 24 Titik Musim Alam (Solar Terms)</li>
        <li><strong>Bab 2:</strong> Arsitektur Ekosistem Sistem &amp; Keandalan Teknologi Web</li>
        <li><strong>Bab 3:</strong> Katalog Lengkap 24 Racikan Musim, Bahan Botani &amp; Kustomisasi</li>
        <li><strong>Bab 4:</strong> Alur Transaksi, QRIS Dinamis &amp; Keamanan Finansial</li>
        <li><strong>Bab 5:</strong> Standar Operasional Prosedur (SOP) Barista di Meja Seduh</li>
        <li><strong>Bab 6:</strong> Standar Operasional Prosedur (SOP) Kasir &amp; Rekonsiliasi Harian</li>
        <li><strong>Bab 7:</strong> Tata Kelola Menu &amp; Panel Pengelola (Admin Dashboard)</li>
        <li><strong>Bab 8:</strong> Kamus Istilah Praktis untuk Orang Awam &amp; Matriks Bantuan Cepat</li>
    </ul>

    <div class="layman-box">
        <div class="layman-box-title">Prinsip Aksesibilitas Bahasa &amp; Kejelasan Dokumen</div>
        Dokumen ini disusun menggunakan prinsip bahasa lugas, sistematis, dan bebas istilah membingungkan. Setiap konsep teknologi komputer maupun istilah peracikan teh herbal dilengkapi dengan perumpamaan dunia nyata agar mudah dipahami secara intuitif oleh penguji akademis, penilai bisnis, maupun staf gerai baru.
    </div>
</div>

<!-- BAB 1 -->
<div class="page-break">
    <div class="section-label">Bab 01 • Konsep &amp; Visi Usaha</div>
    <h1>Mengenal CHANGKEER &amp; Filosofi 24 Musim</h1>

    <h2>1.1 Apa Itu CHANGKEER ATELIER?</h2>
    <p>
        <strong>CHANGKEER</strong> adalah sebuah gerai seduhan teh herbal botani modern (<em>artisan herbal tea atelier</em>) yang memadukan kekayaan tanaman rempah kepulauan Indonesia dengan kearifan siklus 24 Titik Musim Alam (<em>Solar Terms</em>). Berbeda dari kedai kopi komersial yang bising atau toko jamu konvensional yang belum terstandarisasi, CHANGKEER menghadirkan ruang hening yang nyaman bagi siapa saja yang ingin menikmati hidrasi sehat alami, terukur, dan menenangkan pikiran.
    </p>

    <div class="layman-box">
        <div class="layman-box-title">Istilah Mudah Dipahami: Teh Herbal (Tisane) vs Teh Biasa</div>
        Banyak orang mengira semua teh itu sama. Padahal, teh celup biasa di pasaran umumnya berasal dari daun teh hitam pabrikan yang seringkali diberi perisa sintetik. Sementara itu, <strong>Tisane / Teh Herbal CHANGKEER</strong> diracik murni dari rempah dan kelopak bunga asli utuh—seperti melati, bunga telang, jahe merah, dan peppermint—tanpa bahan kimia sintetis dan tanpa pemanis buatan yang membuat lambung perih.
    </div>

    <h2>1.2 Mengapa Menyelaraskan Teh dengan 24 Musim Alam?</h2>
    <p>
        Metabolisme tubuh manusia bereaksi secara alami terhadap fluktuasi iklim di sekitarnya. Ketika cuaca terik dan panas menyengat, tubuh memerlukan asupan herbal yang menyejukkan suhu dalam tubuh. Sebaliknya, saat musim hujan lebat dan berangin dingin, tubuh membutuhkan kehangatan minyak atsiri alami untuk meredakan kekakuan otot dan menjaga sirkulasi darah.
    </p>
    <p>
        CHANGKEER menyusun racikannya ke dalam 4 pilar musim utama:
    </p>
    <ul>
        <li><strong>Musim Semi (Spring):</strong> Karakter bunga segar (floral) yang ringan, berfungsi membantu pemulihan vitalitas dan detoksifikasi alami tubuh.</li>
        <li><strong>Musim Panas (Summer):</strong> Karakter daun mint pegunungan dan buah sitrus alami, berfungsi mendinginkan suhu tubuh dan mencegah dehidrasi.</li>
        <li><strong>Musim Gugur (Autumn):</strong> Karakter bunga chamomile utuh dan kayu manis tropis, berfungsi menenangkan pikiran dan meredakan ketegangan stres.</li>
        <li><strong>Musim Dingin (Winter):</strong> Karakter jahe merah tua dan cengkih nusantara, berfungsi memberi kehangatan mendalam dan menjaga daya tahan tubuh.</li>
    </ul>

    <h2>1.3 Mengapa Dibutuhkan Platform Digital Mandiri?</h2>
    <p>
        Menyeduh teh botani membutuhkan ketepatan suhu air dan waktu ekstraksi yang sangat ketat. Jika barista harus terganggu oleh urusan mencatat pesanan di secarik kertas bon atau menghitung uang kembalian manual, kualitas seduhan teh akan menurun drastis. Sistem digital CHANGKEER diciptakan agar tamu dapat memesan leluasa lewat ponselnya, sementara barista dapat mendedikasikan 100% konsentrasinya untuk menyeduh teh terbaik.
    </p>
</div>

<!-- BAB 2 -->
<div class="page-break">
    <div class="section-label">Bab 02 • Ekosistem Teknologi</div>
    <h1>Arsitektur Sistem &amp; Keandalan Digital</h1>

    <h2>2.1 Cara Kerja Sistem di Balik Layar</h2>
    <p>
        Sistem perangkat lunak CHANGKEER dibangun menggunakan teknologi web generasi modern yang ringan, cepat, dan aman digunakan di berbagai perangkat—mulai dari ponsel pintar tamu, tablet kasir, hingga monitor dapur barista.
    </p>

    <div class="layman-box">
        <div class="layman-box-title">Perumpamaan Sederhana: Memahami Teknologi CHANGKEER</div>
        Bayangkan sistem ini seperti bangunan fisik gerai teh:
        <ul>
            <li><strong>Next.js (App Router):</strong> Diibaratkan sebagai etalase kaca depan gerai yang sangat rapi, bersih, dan terang. Pelanggan dapat membuka menu dengan cepat tanpa perlu menunggu lama atau memasang aplikasi berat.</li>
            <li><strong>Supabase (PostgreSQL Database):</strong> Diibaratkan sebagai brankas dan buku catatan kasir utama yang tersimpan aman di ruang belakang. Seluruh riwayat transaksi, resep seduhan, dan laporan kas dicatat rapi dan tidak bisa dimanipulasi.</li>
            <li><strong>QRIS Dinamis:</strong> Diibaratkan seperti kasir otomatis yang langsung menyebutkan total belanjaan yang pas, sehingga pembeli tinggal menempelkan ponsel tanpa takut salah ketik nominal transfer.</li>
            <li><strong>Kitchen Display System (KDS):</strong> Diibaratkan seperti papan nomor antrean digital di meja peracikan, menggantikan sobekan kertas bon yang sering basah terkena air panas.</li>
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

    <h2>2.3 Ketahanan Sistem Tanpa Gangguan (Dual-Tier Resilience)</h2>
    <p>
        Untuk melindungi gerai dari kendala mati internet tiba-tiba, sistem dilengkapi dengan penyimpanan cadangan otomatis (<em>active orders fallback store</em>). Pesanan di meja tetap tercatat dan struk pembayaran kasir tetap dapat dicetak dengan mulus.
    </p>
</div>

<!-- BAB 3: KATALOG 24 PRODUK LENGKAP -->
<div class="page-break">
    <div class="section-label">Bab 03 • Katalog Produk Lengkap</div>
    <h1>Katalog Lengkap 24 Racikan Musim Alam</h1>

    <p>
        Berikut adalah dokumentasi visual dan komposisi lengkap 24 racikan teh musiman (<em>Solar Terms</em>) yang dikurasi secara resmi oleh kelima Co-Founder CHANGKEER:
    </p>

    {catalog_html}

    <h2>3.2 Panduan Kustomisasi Seduhan Terstandarisasi</h2>
    <table class="editorial-table">
        <thead>
            <tr>
                <th style="width: 25%;">Kategori Pilihan</th>
                <th style="width: 35%;">Opsi Kustomisasi</th>
                <th>Keterangan Rasa &amp; Biaya Tambahan</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Suhu Penyajian</strong></td>
                <td>Hot Tea Pot / Iced Shaken Tea</td>
                <td>Poci seduh air panas tradisional (standar) atau es kocok segar (+Rp 2.000 menggunakan es batu higienis).</td>
            </tr>
            <tr>
                <td><strong>Tingkat Kemanisan Alami</strong></td>
                <td>0%, 30%, 50%, 75%, 100%</td>
                <td>Menggunakan nektar sorgum murni atau madu hutan mentah. 0% bebas gula, 50% teh lebih dominan, 100% manis penuh.</td>
            </tr>
            <tr>
                <td><strong>Topping Kelopak Bunga</strong></td>
                <td>Telang, Melati, Marigold, Madu (+Rp 3.000)</td>
                <td>Bunga telang (warna ungu memikat), melati kering (aroma wangi rileks), marigold emas (antioksidan tinggi), atau madu hutan murni.</td>
            </tr>
        </tbody>
    </table>
</div>

<!-- BAB 4 -->
<div class="page-break">
    <div class="section-label">Bab 04 • Alur &amp; Keamanan Transaksi</div>
    <h1>Alur Transaksi &amp; QRIS Dinamis</h1>

    <h2>4.1 Diagram Alur Kerja Transaksi Digital Gerai</h2>
    <p>
        Alur transaksi digital CHANGKEER dari saat tamu duduk di meja hingga minuman disajikan di meja:
    </p>

    <div class="workflow-step">
        <div class="workflow-num">1</div>
        <div class="workflow-content">
            <div class="workflow-title">Pelanggan Memilih Menu &amp; Kustomisasi di Ponsel</div>
            <div class="workflow-desc">Pelanggan membuka katalog web via kamera HP, memilih racikan 24 musim, mengatur suhu, tingkat kemanisan, dan topping botani.</div>
        </div>
    </div>
    <div class="workflow-arrow">&#8595;</div>

    <div class="workflow-step">
        <div class="workflow-num">2</div>
        <div class="workflow-content">
            <div class="workflow-title">Sistem Mengunci Nominal &amp; Menghasilkan QRIS Dinamis</div>
            <div class="workflow-desc">Server menghitung total belanjaan resmi, mengunci angka rupiah ke dalam kode QRIS dinamis berstandar nasional ASPI.</div>
        </div>
    </div>
    <div class="workflow-arrow">&#8595;</div>

    <div class="workflow-step">
        <div class="workflow-num">3</div>
        <div class="workflow-content">
            <div class="workflow-title">Verifikasi Server Otomatis (Proteksi Anti-Kecurangan)</div>
            <div class="workflow-desc">Server memeriksa keaslian harga menu. Jika data sah, pembayaran langsung dikonfirmasi berhasil dalam hitungan detik.</div>
        </div>
    </div>
    <div class="workflow-arrow">&#8595;</div>

    <div class="workflow-step">
        <div class="workflow-num">4</div>
        <div class="workflow-content">
            <div class="workflow-title">Tiket Digital Masuk Otomatis ke Monitor Dapur (KDS)</div>
            <div class="workflow-desc">Monitor barista memunculkan kartu pesanan baru secara berurutan, lengkap dengan takaran gula dan resep seduhannya.</div>
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

    <h2>4.2 Mengapa QRIS Dinamis Jauh Lebih Aman?</h2>
    <div class="layman-box">
        <div class="layman-box-title">Penjelasan Awam: QRIS Statis Kertas vs QRIS Dinamis CHANGKEER</div>
        <ul>
            <li><strong>QRIS Statis (Kertas Tempel Biasa):</strong> Seperti celengan tanpa angka. Pelanggan harus mengetik sendiri angka misalnya "Rp 32.500". Sering terjadi salah ketik: kurang nol menjadi Rp 3.250 atau lebih nol menjadi Rp 325.000. Kasir harus memeriksa layar HP pelanggan satu per satu, menyebabkan antrean panjang.</li>
            <li><strong>QRIS Dinamis CHANGKEER:</strong> Seperti mesin kasir pintar. Saat barcode dipindai, nominal Rp 32.500 sudah otomatis terkunci di layar m-Banking pelanggan. Pelanggan tinggal menekan 'Konfirmasi Bayar'. Cepat, 100% tepat, dan bebas dari antrean kasir.</li>
        </ul>
    </div>

    <h2>4.3 Perlindungan Anti-Kecurangan (Server-Side Anti-Tampering)</h2>
    <p>
        Banyak toko daring mengalami kerugian karena orang usil mengubah nominal belanjaan lewat celah kode peramban HP. Pada sistem CHANGKEER, harga barang <strong>tidak pernah dipercayakan pada HP pelanggan</strong>. Setiap item diperiksa ulang langsung ke katalog server pusat. Jika harga sengaja dimanipulasi, pesanan otomatis digugurkan oleh sistem keamanan.
    </p>

    <h2>4.4 Proteksi Saldo Terpotong Ganda (Idempotensi)</h2>
    <p>
        Jika sinyal internet pelanggan sedang lemah dan tombol "Bayar" tertekan berulang kali, sistem memiliki mekanisme pencegahan duplikasi (<em>idempotency lock</em>). Saldo pelanggan dijamin hanya terpotong satu kali untuk satu nomor pesanan yang sama.
    </p>
</div>

<!-- BAB 5 -->
<div class="page-break">
    <div class="section-label">Bab 05 • Standar Operasional Barista</div>
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
                <th>Catatan Kualitas Barista</th>
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
</div>

<!-- BAB 6 -->
<div class="page-break">
    <div class="section-label">Bab 06 • Standar Operasional Kasir</div>
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
                <td>Keterlambatan jaringan bank saat jam sibuk.</td>
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

<!-- BAB 7 & BAB 8 -->
<div class="page-break">
    <div class="section-label">Bab 07 &amp; 08 • Panel Pengelola &amp; Glosarium</div>
    <h1>Tata Kelola Toko &amp; Kamus Istilah Praktis</h1>

    <h2>7.1 Pengaturan Menu &amp; Stok Bahan Cepat</h2>
    <p>
        Jika salah satu jenis kelopak bunga herbal (misalnya bunga chamomile utuh) habis karena panen terhambat cuaca, pengelola toko dapat mematikan status ketersediaan item tersebut dalam waktu 5 detik melalui panel <code>/admin</code> dengan menggeser sakelar menjadi <strong>'Out of Stock'</strong>.
    </p>

    <h2>7.2 Kamus Istilah Praktis untuk Orang Awam</h2>
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

    <div class="rule"></div>

    <div style="text-align: center; font-size: 8pt; color: #4a5568; margin-top: 16pt;">
        Dokumen ini diterbitkan secara resmi oleh <strong>Dewan Pendiri CHANGKEER ATELIER</strong>.<br>
        Almaidah Chaerudin Putri • Annisha Humaira • Johana Abigael Rumbiak • Keyla Putri Adisty • Nursoleha Romadhoni.<br>
        &copy; 2026 CHANGKEER ATELIER. Hak Cipta Dilindungi Undang-Undang.
    </div>
</div>

</body>
</html>
"""
    clean_html = html.replace("*", "")
    return clean_html

if __name__ == "__main__":
    from assets_loader import get_all_assets
    assets = get_all_assets()
    out = generate_manual_book_id(assets)
    print(f"Indonesian Manual Book generated. Total chars: {len(out)}")
