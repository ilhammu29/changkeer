#!/usr/bin/env python3
"""
presentation_id.py - Indonesian Presentation Deck (A4 Landscape)
Featuring:
- Official Web Logo (logo_new.png)
- The 5 Co-Founders from the website About page (Zero mention of user's personal name)
- Complete 24 Seasonal Products Showcase with simple, compact images (Terms 01-12 & Terms 13-24)
- High Contrast, Pristine Professional Typography, Zero AI-slop, No Badges, Round Bullets
- Zero mention of OXID
- Zero asterisks
- Exact 11 Slides = 11 Landscape Pages
"""

def generate_presentation_id(assets: dict) -> str:
    founders = assets.get("founders", [])
    solar = assets.get("solar_terms", [])
    logo_b64 = assets.get("logo", "")

    def render_12_grid_id(items):
        html = '<div style="display: table; width: 100%; table-layout: fixed; margin-top: 5pt;">'
        for row_idx in range(0, len(items), 6):
            html += '<div style="display: table-row;">'
            for col_idx in range(6):
                if row_idx + col_idx < len(items):
                    it = items[row_idx + col_idx]
                    ingr = ", ".join(it.get('ingredients', [])[:2])
                    html += f'''
                    <div style="display: table-cell; width: 16.66%; vertical-align: top; padding: 4.5pt; border: 1px solid #cbd5e1; background: #ffffff; text-align: center;">
                        <img src="{it['thumb_b64']}" style="width: 44px; height: 44px; object-fit: cover; border: 1px solid #94a3b8; margin: 0 auto 3pt auto; display: block;" alt="{it['term']}">
                        <div style="font-family: 'Playfair Display', serif; font-size: 8pt; font-weight: 700; color: #143828; line-height: 1.15;">{it['term']}</div>
                        <div style="font-size: 7.2pt; color: #946c38; font-weight: 600;">{it['blend']} ({it['termChinese']})</div>
                        <div style="font-size: 6.8pt; color: #334155; margin-top: 1.5pt; line-height: 1.2;">Hot {it['hotPrice']} / Ice {it['icedPrice']}</div>
                        <div style="font-size: 6.5pt; color: #64748b; margin-top: 1pt; font-style: italic;">{ingr}</div>
                    </div>
                    '''
                else:
                    html += '<div style="display: table-cell; width: 16.66%;"></div>'
            html += '</div>'
        html += '</div>'
        return html

    grid_spring_summer = render_12_grid_id(solar[:12])
    grid_autumn_winter = render_12_grid_id(solar[12:])

    # Founders Table Rows for Slide 11
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
<title>CHANGKEER ATELIER — PRESENTASI PROYEK &amp; PENJELASAN SISTEM</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap');

@page {{
    size: A4 landscape;
    margin: 0;
}}

* {{
    box-sizing: border-box;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
}}

body {{
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 9pt;
    line-height: 1.5;
    color: #1a202c;
    background-color: #ffffff;
    margin: 0;
    padding: 0;
}}

.slide {{
    width: 297mm;
    height: 210mm;
    max-height: 210mm;
    box-sizing: border-box;
    page-break-after: always;
    page-break-inside: avoid;
    overflow: hidden;
    padding: 12mm 20mm 10mm 20mm;
    position: relative;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}}

.slide-header {{
    display: table;
    width: 100%;
    border-bottom: 1.5px solid #143828;
    padding-bottom: 4pt;
    margin-bottom: 6pt;
}}

.slide-header-left {{
    display: table-cell;
    font-size: 7.5pt;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #946c38;
}}

.slide-header-right {{
    display: table-cell;
    text-align: right;
    font-size: 7.5pt;
    font-weight: 700;
    color: #143828;
}}

.slide-footer {{
    display: table;
    width: 100%;
    border-top: 1px solid #cbd5e1;
    padding-top: 4pt;
    margin-top: 6pt;
    font-size: 7.5pt;
    color: #64748b;
}}

.slide-footer-left {{
    display: table-cell;
    text-align: left;
}}

.slide-footer-right {{
    display: table-cell;
    text-align: right;
    font-weight: 700;
    color: #143828;
}}

h1, h2, h3 {{
    font-family: 'Playfair Display', Georgia, serif;
    font-weight: 700;
    color: #143828;
    margin: 0;
}}

.slide-title {{
    font-size: 18pt;
    line-height: 1.15;
    margin-bottom: 2pt;
}}

.slide-subtitle {{
    font-size: 9pt;
    color: #4a5568;
    margin-bottom: 6pt;
}}

p {{
    margin-top: 0;
    margin-bottom: 5pt;
    text-align: justify;
    color: #2d3748;
}}

ul {{
    list-style-type: disc !important;
    margin-top: 2pt;
    margin-bottom: 5pt;
    padding-left: 16px;
}}

ul li {{
    margin-bottom: 2.5pt;
    line-height: 1.4;
    color: #2d3748;
}}

.col-container {{
    display: table;
    width: 100%;
    table-layout: fixed;
}}

.col-2 {{
    display: table-cell;
    width: 50%;
    vertical-align: top;
    padding-right: 10pt;
}}

.col-2:last-child {{
    padding-right: 0;
    padding-left: 10pt;
}}

.col-3 {{
    display: table-cell;
    width: 33.33%;
    vertical-align: top;
    padding-right: 8pt;
}}

.col-3:last-child {{
    padding-right: 0;
}}

.layman-box {{
    border-left: 3.5px solid #143828;
    background-color: #f8fafc;
    border-right: 1px solid #e2e8f0;
    border-top: 1px solid #e2e8f0;
    border-bottom: 1px solid #e2e8f0;
    padding: 6pt 10pt;
    margin: 5pt 0;
    font-size: 8.5pt;
}}

.layman-box-title {{
    font-weight: 700;
    color: #143828;
    font-size: 8pt;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 2pt;
}}

table.slide-table {{
    width: 100%;
    border-collapse: collapse;
    font-size: 8pt;
    margin: 5pt 0;
}}

table.slide-table th {{
    border-top: 1.5px solid #143828;
    border-bottom: 1.5px solid #143828;
    padding: 4pt 6pt;
    text-align: left;
    font-weight: 700;
    color: #143828;
    font-size: 7.5pt;
    text-transform: uppercase;
    background-color: #f1f5f9;
}}

table.slide-table td {{
    border-bottom: 1px solid #cbd5e1;
    padding: 4pt 6pt;
    vertical-align: top;
    color: #2d3748;
}}

.h-workflow {{
    display: table;
    width: 100%;
    margin: 8pt 0;
    table-layout: fixed;
}}

.h-step {{
    display: table-cell;
    vertical-align: top;
    padding: 6pt 8pt;
    background-color: #f8fafc;
    border: 1px solid #cbd5e1;
}}

.h-step-num {{
    font-family: 'Playfair Display', serif;
    font-size: 13pt;
    font-weight: 700;
    color: #143828;
    margin-bottom: 2pt;
}}

.h-step-title {{
    font-weight: 700;
    font-size: 8pt;
    color: #143828;
    margin-bottom: 2pt;
}}

.h-step-desc {{
    font-size: 7.5pt;
    color: #4a5568;
    line-height: 1.35;
}}

.h-arrow {{
    display: table-cell;
    width: 18px;
    vertical-align: middle;
    text-align: center;
    color: #946c38;
    font-size: 12pt;
}}

/* Cover Slide */
.slide-cover {{
    background-color: #143828;
    color: #ffffff;
    padding: 18mm 20mm 14mm 20mm;
    max-height: 210mm;
    overflow: hidden;
    page-break-after: always;
    page-break-inside: avoid;
}}

.cover-title-big {{
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 27pt;
    font-weight: 700;
    line-height: 1.15;
    color: #ffffff;
    margin-bottom: 6pt;
}}

.cover-tagline {{
    font-size: 11pt;
    color: #e2e8f0;
    max-width: 620px;
    line-height: 1.45;
    margin-bottom: 14pt;
}}

.cover-team-box {{
    display: table;
    width: 100%;
    border-top: 1px solid rgba(255, 255, 255, 0.25);
    padding-top: 10pt;
}}

.cover-team-cell {{
    display: table-cell;
    width: 25%;
    vertical-align: top;
}}

.cover-team-lbl {{
    font-size: 7pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: #dfba7c;
    margin-bottom: 2pt;
}}

.cover-team-val {{
    font-size: 8.5pt;
    font-weight: 600;
    color: #ffffff;
}}
</style>
</head>
<body>

<!-- SLIDE 1: COVER -->
<div class="slide slide-cover">
    <div>
        <div style="font-size: 8.5pt; font-weight: 700; letter-spacing: 0.25em; text-transform: uppercase; color: #dfba7c; margin-bottom: 12pt;">
            CHANGKEER ATELIER • PRESENTASI PROYEK &amp; PENJELASAN SISTEM
        </div>
        <div style="margin-bottom: 10pt;">
            <img src="{logo_b64}" style="width: 58px; height: 58px; border-radius: 50%; border: 2px solid #dfba7c; background: #ffffff;" alt="Logo Changkeer Web">
        </div>
        <div class="cover-title-big">Digitalisasi Seduhan Teh Herbal 24 Musim</div>
        <div class="cover-tagline">
            Platform Pemesanan Mandiri, Pembayaran Otomatis QRIS Dinamis, Kitchen Display System (KDS), dan Manajemen Gerai Terpadu.
        </div>
    </div>

    <div class="cover-team-box">
        <div class="cover-team-cell">
            <div class="cover-team-lbl">Kelompok Pendiri</div>
            <div class="cover-team-val">5 Co-Founders</div>
        </div>
        <div class="cover-team-cell">
            <div class="cover-team-lbl">Inisiator Proyek</div>
            <div class="cover-team-val">Dewan Pendiri CHANGKEER</div>
        </div>
        <div class="cover-team-cell">
            <div class="cover-team-lbl">Institusi / Gerai</div>
            <div class="cover-team-val">CHANGKEER ATELIER</div>
        </div>
        <div class="cover-team-cell">
            <div class="cover-team-lbl">Tahun Sidang / Rilis</div>
            <div class="cover-team-val">Oktober 2026</div>
        </div>
    </div>
</div>

<!-- SLIDE 2: LATAR BELAKANG -->
<div class="slide">
    <div class="slide-header">
        <div class="slide-header-left">01 / Latar Belakang &amp; Permasalahan</div>
        <div class="slide-header-right">CHANGKEER ATELIER</div>
    </div>

    <div>
        <div class="slide-title">Tantangan Operasional di Industri Minuman Teh</div>
        <div class="slide-subtitle">Mengapa kedai teh modern membutuhkan transformasi digital dari sistem kasir konvensional?</div>

        <div class="col-container">
            <div class="col-2">
                <h3 style="margin-bottom: 4pt;">Masalah Nyata di Lapangan (Metode Tradisional)</h3>
                <ul>
                    <li><strong>Antrean Kasir Panjang &amp; Melelahkan:</strong> Tamu harus berdiri lama di kasir hanya untuk memilih racikan teh dan membayar, merusak kenyamanan bersantai.</li>
                    <li><strong>Risiko Salah Transfer pada QRIS Kertas:</strong> Menggunakan QRIS statis mewajibkan tamu mengetik nominal manual; sering terjadi salah ketik nol (kurang atau berlebih).</li>
                    <li><strong>Kertas Bon Rusak di Meja Seduh:</strong> Nota kertas mudah basah terkena uap air panas atau hilang, menyebabkan pesanan tertukar dan waktu seduh tidak akurat.</li>
                    <li><strong>Ketiadaan Standarisasi Racikan:</strong> Rasa teh berubah-ubah bergantung pada barista yang bertugas karena tidak ada panduan takaran digital yang baku.</li>
                </ul>
            </div>
            <div class="col-2">
                <div class="layman-box">
                    <div class="layman-box-title">Analogi Sederhana: Kekacauan di Balik Bar</div>
                    Bayangkan seorang barista sedang menjaga suhu air 85°C untuk melati. Tiba-tiba kasir berteriak memesan teh manis tanpa es, sementara kertas bon di depannya basah terkena tumpahan air. Barista lupa waktu seduh, dan teh menjadi sangat pahit serta sepat. Inilah masalah yang diselesaikan sistem digital CHANGKEER.
                </div>
                <div class="layman-box">
                    <div class="layman-box-title">Tujuan Utama Solusi Kami</div>
                    Menghilangkan 100% kertas bon di dapur, meniadakan kesalahan transfer uang, dan memberikan kendali penuh kepada pelanggan untuk memesan langsung dari kursi mereka.
                </div>
            </div>
        </div>
    </div>

    <div class="slide-footer">
        <div class="slide-footer-left">Dewan Pendiri CHANGKEER ATELIER</div>
        <div class="slide-footer-right">Slide 02</div>
    </div>
</div>

<!-- SLIDE 3: SOLUSI PRODUK & 24 MUSIM -->
<div class="slide">
    <div class="slide-header">
        <div class="slide-header-left">02 / Konsep Solusi &amp; Filosofi Produk</div>
        <div class="slide-header-right">CHANGKEER ATELIER</div>
    </div>

    <div>
        <div class="slide-title">Solusi CHANGKEER: Artisan Tea Berbasis 24 Musim</div>
        <div class="slide-subtitle">Menyelaraskan metabolisme tubuh manusia dengan ritme cuaca alam Nusantara.</div>

        <div class="col-container">
            <div class="col-2">
                <p>
                    <strong>CHANGKEER</strong> menghadirkan pengalaman menikmati seduhan botani alami Nusantara yang dipadukan dengan kearifan siklus 24 Musim Alam (<em>Solar Terms</em>). Setiap racikan disesuaikan dengan kebutuhan tubuh saat cuaca tertentu.
                </p>
                <div class="layman-box">
                    <div class="layman-box-title">Istilah Awam: Apa Itu Tisane Herbal?</div>
                    Tisane adalah minuman seduhan murni dari dedaunan pilihan, rempah, dan kelopak bunga utuh (seperti mawar, melati, bunga telang, mint, jahe merah). Berbeda dengan teh celup pabrikan yang sering memakai perisa sintetik, Tisane CHANGKEER 100% alami, bebas bahan pengawet, dan aman untuk lambung.
                </div>
            </div>
            <div class="col-2">
                <table class="slide-table">
                    <thead>
                        <tr>
                            <th>Musim</th>
                            <th>Karakter Rasa</th>
                            <th>Fungsi Utama Bagi Tubuh</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Musim Semi</strong></td>
                            <td>Bunga segar (Floral)</td>
                            <td>Menyegarkan pikiran &amp; membantu detoksifikasi alami.</td>
                        </tr>
                        <tr>
                            <td><strong>Musim Panas</strong></td>
                            <td>Mint &amp; Lemon dingin</td>
                            <td>Mendinginkan suhu tubuh &amp; hidrasi di cuaca terik.</td>
                        </tr>
                        <tr>
                            <td><strong>Musim Gugur</strong></td>
                            <td>Chamomile &amp; Kayu Manis</td>
                            <td>Menenangkan sistem saraf &amp; meredakan stres.</td>
                        </tr>
                        <tr>
                            <td><strong>Musim Dingin</strong></td>
                            <td>Jahe Merah &amp; Cengkih</td>
                            <td>Memberi kehangatan mendalam &amp; daya tahan tubuh.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <div class="slide-footer">
        <div class="slide-footer-left">Dewan Pendiri CHANGKEER ATELIER</div>
        <div class="slide-footer-right">Slide 03</div>
    </div>
</div>

<!-- SLIDE 4: GALERI 24 PRODUK (SEMI & PANAS) -->
<div class="slide">
    <div class="slide-header">
        <div class="slide-header-left">03 / Galeri 24 Racikan Musim Alam (Bagian I)</div>
        <div class="slide-header-right">CHANGKEER ATELIER</div>
    </div>

    <div>
        <div class="slide-title">Racikan Musim Semi &amp; Musim Panas (Terms 01–12)</div>
        <div class="slide-subtitle">12 varian botani segar dengan gambar simpel, komposisi bahan pilihan, dan kalibrasi harga resmi.</div>

        {grid_spring_summer}
    </div>

    <div class="slide-footer">
        <div class="slide-footer-left">Dewan Pendiri CHANGKEER ATELIER</div>
        <div class="slide-footer-right">Slide 04</div>
    </div>
</div>

<!-- SLIDE 5: GALERI 24 PRODUK (GUGUR & DINGIN) -->
<div class="slide">
    <div class="slide-header">
        <div class="slide-header-left">04 / Galeri 24 Racikan Musim Alam (Bagian II)</div>
        <div class="slide-header-right">CHANGKEER ATELIER</div>
    </div>

    <div>
        <div class="slide-title">Racikan Musim Gugur &amp; Musim Dingin (Terms 13–24)</div>
        <div class="slide-subtitle">12 varian rempah hangat dan bunga menenangkan untuk memulihkan energi serta daya tahan tubuh.</div>

        {grid_autumn_winter}
    </div>

    <div class="slide-footer">
        <div class="slide-footer-left">Dewan Pendiri CHANGKEER ATELIER</div>
        <div class="slide-footer-right">Slide 05</div>
    </div>
</div>

<!-- SLIDE 6: PENGALAMAN PELANGGAN -->
<div class="slide">
    <div class="slide-header">
        <div class="slide-header-left">05 / Fitur Pengguna &amp; Kustomisasi</div>
        <div class="slide-header-right">CHANGKEER ATELIER</div>
    </div>

    <div>
        <div class="slide-title">Pemesanan Mandiri &amp; Kustomisasi Rasa</div>
        <div class="slide-subtitle">Memberikan kebebasan personalisasi tanpa harus repot mengantre di meja kasir.</div>

        <div class="col-container">
            <div class="col-2">
                <h3 style="margin-bottom: 4pt;">Alur Pemesanan di Ponsel Pelanggan</h3>
                <ul>
                    <li><strong>Buka Menu Tanpa Pasang Aplikasi:</strong> Pelanggan cukup memindai QR meja menggunakan kamera HP bawaan untuk langsung membuka katalog.</li>
                    <li><strong>Pilihan Suhu Penyajian:</strong> Poci Seduh Hangat (Hot Clay Pot) atau Es Kocok Segar (+Rp 2.000).</li>
                    <li><strong>Level Gula Alami (5 Pilihan):</strong> 0% (Tanpa Gula), 30% (Sedikit Manis), 50% (Rasa Teh Kuat), 75% (Manis Seimbang), dan 100% (Manis Penuh).</li>
                    <li><strong>Topping Bunga Botani (+Rp 3.000):</strong> Bunga Telang, Melati Kering, Marigold Emas, atau Madu Hutan.</li>
                </ul>
            </div>
            <div class="col-2">
                <div class="layman-box">
                    <div class="layman-box-title">Mengapa Kustomisasi Sangat Disukai Pelanggan?</div>
                    Setiap orang memiliki kondisi kesehatan berbeda: penderita diabetes membutuhkan teh 0% tanpa gula, orang flu butuh madu hutan ekstra, dan penyuka kesegaran menginginkan es batu dengan bunga telang berkilau ungu. Sistem CHANGKEER memfasilitasi semua kebutuhan tersebut dalam hitungan detik.
                </div>
            </div>
        </div>
    </div>

    <div class="slide-footer">
        <div class="slide-footer-left">Dewan Pendiri CHANGKEER ATELIER</div>
        <div class="slide-footer-right">Slide 06</div>
    </div>
</div>

<!-- SLIDE 7: ALUR WORKFLOW & QRIS DINAMIS -->
<div class="slide">
    <div class="slide-header">
        <div class="slide-header-left">06 / Alur Transaksi &amp; QRIS Dinamis</div>
        <div class="slide-header-right">CHANGKEER ATELIER</div>
    </div>

    <div>
        <div class="slide-title">Diagram Alur Transaksi Dari Meja ke Dapur Bar</div>
        <div class="slide-subtitle">Otomasi penuh dari pemilihan menu, penerbitan barcode QRIS, hingga serah terima cangkir.</div>

        <div class="h-workflow">
            <div class="h-step">
                <div class="h-step-num">1</div>
                <div class="h-step-title">Pilih Menu di HP</div>
                <div class="h-step-desc">Pelanggan memilih teh, suhu, level gula &amp; topping bunga.</div>
            </div>
            <div class="h-arrow">&#8594;</div>
            <div class="h-step">
                <div class="h-step-num">2</div>
                <div class="h-step-title">QRIS Dinamis</div>
                <div class="h-step-desc">Sistem mengunci nominal total belanjaan resmi.</div>
            </div>
            <div class="h-arrow">&#8594;</div>
            <div class="h-step">
                <div class="h-step-num">3</div>
                <div class="h-step-title">Cek Keamanan</div>
                <div class="h-step-desc">Server memverifikasi harga dan status pembayaran.</div>
            </div>
            <div class="h-arrow">&#8594;</div>
            <div class="h-step">
                <div class="h-step-num">4</div>
                <div class="h-step-title">Tiket KDS Bar</div>
                <div class="h-step-desc">Monitor barista memunculkan pesanan baru seketika.</div>
            </div>
            <div class="h-arrow">&#8594;</div>
            <div class="h-step">
                <div class="h-step-num">5</div>
                <div class="h-step-title">Teh Disajikan</div>
                <div class="h-step-desc">Barista menyeduh teh presisi &amp; menyerahkan cangkir.</div>
            </div>
        </div>

        <div class="layman-box">
            <div class="layman-box-title">Penjelasan Awam: Keunggulan QRIS Dinamis CHANGKEER</div>
            Pada QRIS kertas biasa, pembeli harus mengetik sendiri Rp 28.000. Jika salah ketik menjadi Rp 2.800, gerai merugi. Di CHANGKEER, barcode yang muncul di layar HP sudah otomatis terisi angka Rp 28.000 secara terkunci. Pembeli tinggal klik konfirmasi di aplikasi m-Banking mereka.
        </div>
    </div>

    <div class="slide-footer">
        <div class="slide-footer-left">Dewan Pendiri CHANGKEER ATELIER</div>
        <div class="slide-footer-right">Slide 07</div>
    </div>
</div>

<!-- SLIDE 8: KEAMANAN PEMBAYARAN -->
<div class="slide">
    <div class="slide-header">
        <div class="slide-header-left">07 / Keamanan Finansial Gerai</div>
        <div class="slide-header-right">CHANGKEER ATELIER</div>
    </div>

    <div>
        <div class="slide-title">Proteksi Finansial &amp; Pencegahan Kecurangan</div>
        <div class="slide-subtitle">Perlindungan ganda untuk menjaga integritas transaksi gerai dan rasa aman pelanggan.</div>

        <div class="col-container">
            <div class="col-2">
                <h3 style="margin-bottom: 4pt;">1. Server-Side Anti-Tampering</h3>
                <p>
                    Semua harga barang, biaya es batu (+Rp 2.000), dan topping bunga dihitung ulang langsung di komputer server pusat, bukan di HP pelanggan.
                </p>
                <div class="layman-box">
                    <div class="layman-box-title">Analogi: Kasir Komputer yang Teliti</div>
                    Jika ada pembeli usil yang mencoba mengutak-atik kode di HP-nya agar teh Rp 35.000 berubah menjadi Rp 1.000, komputer server kasir pusat langsung mendeteksi perbedaan tersebut dan menolak pesanan seketika.
                </div>
            </div>
            <div class="col-2">
                <h3 style="margin-bottom: 4pt;">2. Idempotensi (Anti-Potong Dobel)</h3>
                <p>
                    Saat jaringan internet pelanggan lambat dan tombol "Bayar" tertekan berkali-kali, sistem mengunci nomor pesanan sehingga hanya diproses 1 kali.
                </p>
                <div class="layman-box">
                    <div class="layman-box-title">Analogi: Mesin Tiket yang Adil</div>
                    Menjamin uang pembeli di rekening bank tidak akan pernah terpotong dua kali meskipun tombol bayar terpencet berkali-kali secara tidak sengaja.
                </div>
            </div>
        </div>
    </div>

    <div class="slide-footer">
        <div class="slide-footer-left">Dewan Pendiri CHANGKEER ATELIER</div>
        <div class="slide-footer-right">Slide 08</div>
    </div>
</div>

<!-- SLIDE 9: KITCHEN DISPLAY SYSTEM -->
<div class="slide">
    <div class="slide-header">
        <div class="slide-header-left">08 / Operasional Barista &amp; KDS</div>
        <div class="slide-header-right">CHANGKEER ATELIER</div>
    </div>

    <div>
        <div class="slide-title">Kitchen Display System (KDS): Barista Tanpa Kertas</div>
        <div class="slide-subtitle">Mengubah meja peracikan menjadi stasiun seduhan teh presisi yang rapi dan higienis.</div>

        <div class="col-container">
            <div class="col-2">
                <h3 style="margin-bottom: 4pt;">Manfaat Operasional KDS bagi Barista</h3>
                <ul>
                    <li><strong>Pesanan Tersusun Kronologis:</strong> Tiket yang masuk lebih awal otomatis berada di urutan terdepan, mencegah pesanan tertukar.</li>
                    <li><strong>Kode Status Visual Terang:</strong> Warna kuning (menunggu), biru (sedang diseduh), dan hijau (siap disajikan).</li>
                    <li><strong>Resep Kustomisasi Jelas:</strong> Menampilkan takaran gula (ml) dan jenis kelopak bunga secara detail.</li>
                    <li><strong>Bebas Kertas Bon Berserakan:</strong> Meja barista tetap bersih, kering, dan tertata rapi.</li>
                </ul>
            </div>
            <div class="col-2">
                <table class="slide-table">
                    <thead>
                        <tr>
                            <th>Varian Seduhan</th>
                            <th>Suhu Air Baku</th>
                            <th>Waktu Seduh Standar</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Teh Hijau &amp; Melati</td>
                            <td>80°C – 85°C</td>
                            <td>3.5 – 4 Menit (Lembut)</td>
                        </tr>
                        <tr>
                            <td>Teh Hitam Pekat</td>
                            <td>95°C – 98°C</td>
                            <td>3.5 Menit (Mantap)</td>
                        </tr>
                        <tr>
                            <td>Herbal Bunga Rosella</td>
                            <td>90°C – 95°C</td>
                            <td>5 Menit (Ekstraksi Penuh)</td>
                        </tr>
                        <tr>
                            <td>Tisane Jahe Merah</td>
                            <td>98°C – 100°C</td>
                            <td>6 Menit (Minyak Atsiri)</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <div class="slide-footer">
        <div class="slide-footer-left">Dewan Pendiri CHANGKEER ATELIER</div>
        <div class="slide-footer-right">Slide 09</div>
    </div>
</div>

<!-- SLIDE 10: TEKNOLOGI & EFISIENSI -->
<div class="slide">
    <div class="slide-header">
        <div class="slide-header-left">09 / Fondasi Teknologi &amp; Keandalan</div>
        <div class="slide-header-right">CHANGKEER ATELIER</div>
    </div>

    <div>
        <div class="slide-title">Arsitektur Perangkat Lunak Generasi Baru</div>
        <div class="slide-subtitle">Dibangun dengan fondasi web modern untuk kecepatan tinggi dan ketahanan operasional gerai.</div>

        <div class="col-container">
            <div class="col-3">
                <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; padding: 8pt;">
                    <div style="font-weight: 700; color: #143828; font-size: 9.5pt; margin-bottom: 2pt;">Next.js 16 &amp; React 19</div>
                    <div style="font-size: 8pt; color: #334155;">Halaman katalog terbuka sekejap di HP pengunjung tanpa membebani kuota data.</div>
                </div>
            </div>
            <div class="col-3">
                <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; padding: 8pt;">
                    <div style="font-weight: 700; color: #143828; font-size: 9.5pt; margin-bottom: 2pt;">Supabase Cloud &amp; RLS</div>
                    <div style="font-size: 8pt; color: #334155;">Basis data PostgreSQL terenkripsi dengan proteksi hak akses ketat di setiap baris data.</div>
                </div>
            </div>
            <div class="col-3">
                <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; padding: 8pt;">
                    <div style="font-weight: 700; color: #143828; font-size: 9.5pt; margin-bottom: 2pt;">Resiliensi Dual-Tier</div>
                    <div style="font-size: 8pt; color: #334155;">Jika internet gerai terganggu, sistem beralih ke penyimpanan lokal agar kasir tetap berjalan.</div>
                </div>
            </div>
        </div>

        <div class="layman-box" style="margin-top: 10pt;">
            <div class="layman-box-title">Dampak Positif Pada Efisiensi Bisnis Gerai</div>
            Mengurangi waktu tunggu pemesanan hingga 65%, menekan kesalahan pembuatan minuman hingga mendekati 0%, serta menghemat biaya pengadaan kertas bon secara berkelanjutan.
        </div>
    </div>

    <div class="slide-footer">
        <div class="slide-footer-left">Dewan Pendiri CHANGKEER ATELIER</div>
        <div class="slide-footer-right">Slide 10</div>
    </div>
</div>

<!-- SLIDE 11: TIM FOUNDERS & PENUTUP -->
<div class="slide">
    <div class="slide-header">
        <div class="slide-header-left">10 / Dewan Pendiri &amp; Penutup</div>
        <div class="slide-header-right">CHANGKEER ATELIER</div>
    </div>

    <div>
        <div class="slide-title">Dewan Pendiri CHANGKEER &amp; Sesi Tanya Jawab</div>
        <div class="slide-subtitle">Lima pendiri yang merumuskan visi hidrasi botani Nusantara yang berintegritas.</div>

        <div class="col-container">
            <div class="col-2">
                <h3 style="margin-bottom: 4pt;">Roster Dewan Pendiri (5 Co-Founders)</h3>
                <table class="slide-table">
                    <thead>
                        <tr>
                            <th style="width: 10%;">No</th>
                            <th style="width: 45%;">Nama Co-Founder</th>
                            <th>Fokus Utama</th>
                        </tr>
                    </thead>
                    <tbody>
                        {founders_rows}
                    </tbody>
                </table>
            </div>
            <div class="col-2">
                <div class="layman-box">
                    <div class="layman-box-title">Kesimpulan Akhir</div>
                    CHANGKEER membuktikan bahwa warisan teh herbal Nusantara dapat dipadukan secara harmonis dengan teknologi digital mutakhir. Sistem ini siap diimplementasikan secara komersial di gerai fisik.
                </div>
                <div style="text-align: center; margin-top: 12pt;">
                    <div style="font-family: 'Playfair Display', serif; font-size: 15pt; font-weight: 700; color: #143828; margin-bottom: 2pt;">
                        Terima Kasih Atas Perhatian Anda
                    </div>
                    <div style="font-size: 8.5pt; color: #4a5568;">
                        Kami membuka sesi diskusi, evaluasi, dan tanya jawab.
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="slide-footer">
        <div class="slide-footer-left">CHANGKEER ATELIER • Seluruh Hak Cipta Dilindungi Undang-Undang</div>
        <div class="slide-footer-right">Slide 11</div>
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
    out = generate_presentation_id(assets)
    print(f"Indonesian Presentation generated. Total chars: {len(out)}")
