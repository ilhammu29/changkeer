#!/usr/bin/env python3
"""
presentation_id.py - Indonesian Project Presentation Deck (16:9 Landscape)
Document Type: Executive Business & Technical Project Presentation
Editorial Standards:
- Pure white background, high-contrast dark text (#111827 / #1F2937), botanical green accent (#1B4332).
- Zero AI-slop visual boxes, zero badges, zero gradients, zero shadows.
- 16:9 Landscape format (@page size: 297mm 167mm).
- Clean structured tables for 24 seasonal blends (4 Seasonal Slides: Spring, Summer, Autumn, Winter; 6 blends per slide).
- Linear transaction flow diagram (thin borders, clean arrows).
- Official web logo (logo_new.png) and the 5 official Co-Founders.
- Zero asterisks (*), zero mention of OXID, zero user personal name.
- Exactly 12 Slides = 12 Clean Landscape Pages with zero clipping.
"""

def generate_presentation_id(assets: dict) -> str:
    founders = assets.get("founders", [])
    solar = assets.get("solar_terms", [])
    logo_b64 = assets.get("logo", "")

    # Helper function to generate clean 6-item seasonal catalog table
    def render_6_table_id(items, start_idx=1):
        rows = ""
        for idx, it in enumerate(items, start_idx):
            ingr_str = ", ".join(it.get("ingredients", []))
            thumb_img = ""
            if it.get("thumb_b64"):
                thumb_img = f'<img src="{it["thumb_b64"]}" style="width: 24px; height: 24px; object-fit: cover; border: 1px solid #D1D5DB; vertical-align: middle; margin-right: 6px; display: inline-block;" alt="{it["term"]}">'

            # Extraction parameter
            if "jasmine" in ingr_str.lower() or "green" in ingr_str.lower():
                param = "82°C • 3.5 Menit"
            elif "ginger" in ingr_str.lower() or "cinnamon" in ingr_str.lower():
                param = "98°C • 6.0 Menit"
            elif "chamomile" in ingr_str.lower() or "rose" in ingr_str.lower() or "hibiscus" in ingr_str.lower():
                param = "92°C • 5.0 Menit"
            else:
                param = "88°C • 4.0 Menit"

            rows += f"""
            <tr>
                <td style="text-align: center; font-weight: 600; color: #4B5563; font-size: 8.5pt;">{idx:02d}</td>
                <td style="white-space: nowrap;">
                    <div style="display: flex; align-items: center;">
                        {thumb_img}
                        <div>
                            <strong>{it.get('term')}</strong><br>
                            <span style="font-size: 7.5pt; color: #4B5563;">{it.get('termChinese')}</span>
                        </div>
                    </div>
                </td>
                <td style="font-weight: 600; color: #111827; font-size: 8.5pt;">{it.get('blend')}</td>
                <td style="font-size: 8pt; color: #374151;">{ingr_str}</td>
                <td style="text-align: center; font-size: 8pt; color: #4B5563; white-space: nowrap;">{param}</td>
                <td style="text-align: center; font-size: 8pt; white-space: nowrap; font-weight: 600;">Panas {it.get('hotPrice')}<br><span style="color: #4B5563;">Dingin {it.get('icedPrice')}</span></td>
                <td style="font-size: 8pt; color: #4B5563;">{it.get('note')}</td>
            </tr>
            """
        return f"""
        <table class="editorial-table" style="font-size: 8.5pt; margin-top: 6pt; margin-bottom: 0;">
            <thead>
                <tr>
                    <th style="width: 4%; text-align: center;">No</th>
                    <th style="width: 22%;">Titik Musim (Solar Term)</th>
                    <th style="width: 17%;">Nama Racikan</th>
                    <th style="width: 24%;">Komposisi Bahan</th>
                    <th style="width: 13%; text-align: center;">Standar Seduh</th>
                    <th style="width: 9%; text-align: center;">Harga</th>
                    <th style="width: 21%;">Profil Rasa &amp; Catatan</th>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </table>
        """

    table_spring = render_6_table_id(solar[0:6], 1)
    table_summer = render_6_table_id(solar[6:12], 7)
    table_autumn = render_6_table_id(solar[12:18], 13)
    table_winter = render_6_table_id(solar[18:24], 19)

    # Founders Table Rows for Slide 12
    founders_rows = ""
    for f in founders:
        founders_rows += f"""
        <tr>
            <td style="text-align: center; font-weight: 600; color: #1B4332;">{f['num']}</td>
            <td><strong>{f['name']}</strong></td>
            <td style="color: #4B5563;">{f['role']}</td>
            <td>{f['focus_id']}</td>
        </tr>
        """

    html = f"""<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>CHANGKEER ATELIER — PRESENTASI PROYEK &amp; PENJELASAN SISTEM</title>
<style>
@page {{
    size: 297mm 167mm;
    margin: 10mm 15mm 10mm 15mm;
    @top-left {{
        content: "CHANGKEER ATELIER";
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
        font-size: 8pt;
        font-weight: 700;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        color: #1B4332;
    }}
    @top-right {{
        content: "PRESENTASI EKSEKUTIF PROYEK SISTEM E-COMMERCE CAFE";
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
        font-size: 8pt;
        font-weight: 500;
        color: #4B5563;
    }}
    @bottom-left {{
        content: "Dokumen Presentasi Resmi • Dewan Pendiri CHANGKEER";
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
        font-size: 7.5pt;
        color: #6B7280;
    }}
    @bottom-right {{
        content: "Halaman " counter(page) " dari " counter(pages);
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
        font-size: 7.5pt;
        font-weight: 600;
        color: #111827;
    }}
}}

@page:first {{
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
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
    font-size: 9pt;
    line-height: 1.45;
    color: #1F2937;
    background-color: #FFFFFF;
    margin: 0;
    padding: 0;
}}

.slide {{
    page-break-after: always;
    page-break-inside: avoid;
    height: 147mm;
    max-height: 147mm;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
}}

.slide-header {{
    border-bottom: 1.5px solid #1B4332;
    padding-bottom: 4pt;
    margin-bottom: 6pt;
}}

.slide-category {{
    font-size: 8pt;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #1B4332;
    margin-bottom: 1pt;
}}

.slide-title {{
    font-size: 15pt;
    font-weight: 800;
    line-height: 1.2;
    color: #111827;
}}

.slide-subtitle {{
    font-size: 8.5pt;
    color: #4B5563;
    margin-top: 2pt;
}}

.content-two-cols {{
    display: table;
    width: 100%;
    table-layout: fixed;
    margin-top: 4pt;
}}

.col-cell {{
    display: table-cell;
    vertical-align: top;
    padding: 0 8pt;
}}

.col-cell:first-child {{
    padding-left: 0;
    border-right: 1px solid #E5E7EB;
}}

.col-cell:last-child {{
    padding-right: 0;
}}

/* Editorial Table */
.editorial-table {{
    width: 100%;
    border-collapse: collapse;
    font-size: 8.5pt;
}}

.editorial-table th {{
    background-color: #F9FAFB;
    color: #111827;
    font-weight: 700;
    text-align: left;
    padding: 5pt 6pt;
    border-top: 1px solid #D1D5DB;
    border-bottom: 1.5px solid #1B4332;
    border-left: 1px solid #E5E7EB;
    border-right: 1px solid #E5E7EB;
    font-size: 8pt;
}}

.editorial-table td {{
    padding: 4.5pt 6pt;
    border-bottom: 1px solid #E5E7EB;
    border-left: 1px solid #E5E7EB;
    border-right: 1px solid #E5E7EB;
    vertical-align: middle;
    line-height: 1.35;
}}

/* Workflow Linear */
.workflow-row {{
    display: table;
    width: 100%;
    table-layout: fixed;
    margin: 8pt 0;
}}

.wf-box {{
    display: table-cell;
    vertical-align: middle;
    text-align: center;
    border: 1px solid #D1D5DB;
    background-color: #F9FAFB;
    padding: 6pt 4pt;
    font-size: 7.5pt;
    line-height: 1.3;
}}

.wf-num {{
    font-weight: 700;
    font-size: 7pt;
    color: #1B4332;
    text-transform: uppercase;
    margin-bottom: 1pt;
}}

.wf-title {{
    font-weight: 600;
    color: #111827;
}}

.wf-arrow {{
    display: table-cell;
    width: 14px;
    vertical-align: middle;
    text-align: center;
    font-size: 11pt;
    color: #6B7280;
    font-weight: bold;
}}

/* Lists */
ul {{
    list-style-type: disc;
    margin-top: 2pt;
    margin-bottom: 6pt;
    padding-left: 16px;
}}

ul li {{
    margin-bottom: 3pt;
    line-height: 1.4;
    color: #1F2937;
    font-size: 8.5pt;
}}
</style>
</head>
<body>

<!-- SLIDE 1: COVER SLIDE -->
<div class="slide">
    <div style="border-bottom: 1.5px solid #1B4332; padding-bottom: 6pt;">
        <div style="display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center;">
                <img src="{logo_b64}" style="height: 34px; width: auto; margin-right: 10pt; display: block;" alt="CHANGKEER Logo">
                <div>
                    <div style="font-size: 12pt; font-weight: 800; letter-spacing: 0.05em; color: #1B4332; text-transform: uppercase;">CHANGKEER ATELIER</div>
                    <div style="font-size: 7.5pt; color: #4B5563;">Artisan Herbal Tea &amp; Botanical Laboratory</div>
                </div>
            </div>
            <div style="text-align: right; font-size: 7.5pt; color: #6B7280;">
                <div>DOKUMEN RESMI</div>
                <div style="font-weight: 700; color: #111827;">EDISI PROYEK 2026</div>
            </div>
        </div>
    </div>

    <div style="margin: auto 0; padding: 10pt 0;">
        <div style="font-size: 8.5pt; font-weight: 700; color: #1B4332; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4pt;">
            PRESENTASI PROYEK &amp; PENJELASAN SISTEM
        </div>
        <div style="font-size: 21pt; font-weight: 800; line-height: 1.2; color: #111827; margin-bottom: 6pt;">
            Sistem E-Commerce Cafe Terintegrasi &amp; Katalog 24 Racikan Musim Alam
        </div>
        <div style="font-size: 10pt; color: #4B5563; max-width: 90%; line-height: 1.45;">
            Studi Kelayakan, Arsitektur Perangkat Lunak, Tata Kelola Transaksi QRIS Dinamis Server-Side, dan Standar Operasional Barista di Gerai CHANGKEER ATELIER.
        </div>
    </div>

    <div>
        <div style="font-size: 8pt; font-weight: 700; color: #1B4332; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 3pt;">
            DEWAN PENDIRI CHANGKEER (THE 5 CO-FOUNDERS)
        </div>
        <table class="editorial-table">
            <thead>
                <tr>
                    <th style="width: 5%; text-align: center;">No</th>
                    <th style="width: 28%;">Nama Pendiri</th>
                    <th style="width: 14%;">Peran</th>
                    <th>Fokus Tanggung Jawab Operasional</th>
                </tr>
            </thead>
            <tbody>
                {founders_rows}
            </tbody>
        </table>
        <div style="font-size: 7.5pt; color: #6B7280; text-align: center; margin-top: 6pt;">
            CHANGKEER ATELIER • Jawa Barat &amp; Jakarta, Indonesia • Hak Cipta Dilindungi Undang-Undang
        </div>
    </div>
</div>

<!-- SLIDE 2: LATAR BELAKANG & FILOSOFI -->
<div class="slide">
    <div class="slide-header">
        <div class="slide-category">Bagian 01 • Latar Belakang &amp; Konsep Usaha</div>
        <div class="slide-title">Konteks Industri &amp; Filosofi 24 Titik Musim Alam</div>
        <div class="slide-subtitle">Menghadirkan alternatif hidrasi botani sehat alami yang selaras dengan siklus biologis tubuh manusia.</div>
    </div>

    <div class="content-two-cols">
        <div class="col-cell" style="width: 50%;">
            <div style="font-size: 9.5pt; font-weight: 700; color: #1B4332; margin-bottom: 4pt;">Tantangan Industri Minuman Modern</div>
            <ul>
                <li><strong>Tingginya Konsumsi Gula Sintetik:</strong> Minuman kekinian didominasi pemanis buatan, sirup jagung fruktosa tinggi, dan krimer nabati yang berisiko pada kesehatan metabolik jangka panjang.</li>
                <li><strong>Ketergantungan Kafein:</strong> Kopi komersial seringkali memicu asam lambung dan kecemasan jika dikonsumsi berlebih saat bekerja.</li>
                <li><strong>Minimnya Ruang Hening:</strong> Kafe modern bising dan berorientasi transaksi cepat tanpa menghadirkan ketenangan bagi pikiran pengunjung.</li>
            </ul>
        </div>
        <div class="col-cell" style="width: 50%;">
            <div style="font-size: 9.5pt; font-weight: 700; color: #1B4332; margin-bottom: 4pt;">Solusi &amp; Filosofi 24 Musim CHANGKEER</div>
            <ul>
                <li><strong>Tisane Botani Murni 100%:</strong> Seduhan murni kelopak bunga utuh, dedaunan herbal, dan rempah rimpang tanpa daun teh hitam sintetis; 100% bebas kafein dan ramah lambung.</li>
                <li><strong>Sinkronisasi 24 Titik Musim (Solar Terms):</strong> 24 formula diselaraskan dengan ritme alam (Spring untuk detoks, Summer untuk pendingin suhu, Autumn untuk relaksasi, Winter untuk imunitas).</li>
                <li><strong>Pemanis Alami Terukur:</strong> Standar ekstraksi nektar sorgum murni dan madu hutan lokal terkalibrasi jigger mililiter.</li>
            </ul>
        </div>
    </div>

    <div style="border-top: 1px solid #E5E7EB; padding-top: 4pt; font-size: 8pt; color: #4B5563;">
        <strong>Komitmen Produk:</strong> Bebas perisa buatan, menggunakan bahan baku langsung dari perkebunan binaan di Wonosobo, Garut, dan Puncak.
    </div>
</div>

<!-- SLIDE 3: KONSEP SOLUSI & ARSITEKTUR LAYANAN -->
<div class="slide">
    <div class="slide-header">
        <div class="slide-category">Bagian 02 • Konsep Solusi Terintegrasi</div>
        <div class="slide-title">Arsitektur Layanan: Pengalaman Tamu &amp; Efisiensi Bar</div>
        <div class="slide-subtitle">Mengintegrasikan pemesanan mandiri nir-aplikasi dengan sistem tampilan dapur barista secara real-time.</div>
    </div>

    <div class="content-two-cols">
        <div class="col-cell" style="width: 50%;">
            <div style="font-size: 9.5pt; font-weight: 700; color: #1B4332; margin-bottom: 4pt;">Pemesanan Mandiri Tamu (Omnichannel Web)</div>
            <ul>
                <li><strong>Akses Tanpa Unduh:</strong> Tamu memindai kode QR di meja; aplikasi web terbuka langsung di peramban ponsel tanpa instalasi aplikasi.</li>
                <li><strong>Kustomisasi Presisi:</strong> Tamu dapat mengatur suhu penyajian (poci keramik / es kocok), tingkat manis alami (0% hingga 100%), serta topping bunga dan buah kering organik.</li>
                <li><strong>QRIS Dinamis Terkunci:</strong> Kode pembayaran langsung memuat nominal belanja pas tanpa risiko salah input oleh tamu.</li>
            </ul>
        </div>
        <div class="col-cell" style="width: 50%;">
            <div style="font-size: 9.5pt; font-weight: 700; color: #1B4332; margin-bottom: 4pt;">Operasional Stasiun Bar (Kitchen Display System)</div>
            <ul>
                <li><strong>Fokus Penuh pada Seduhan:</strong> Barista bebas dari tugas mencatat bon kertas atau menghitung kembalian uang tunai.</li>
                <li><strong>Manajemen Antrean FIFO:</strong> Tiket otomatis berurutan dengan penghitung waktu ekstraksi dan panduan suhu air presisi.</li>
                <li><strong>Pelacakan Status Real-Time:</strong> Status pesanan sinkron seketika antara layar barista dan layar ponsel tamu.</li>
            </ul>
        </div>
    </div>

    <div style="border-top: 1px solid #E5E7EB; padding-top: 4pt; font-size: 8pt; color: #4B5563;">
        <strong>Dampak Operasional:</strong> Menghilangkan antrean kasir hingga 70% dan meningkatkan konsistensi seduhan teh botani secara signifikan.
    </div>
</div>

<!-- SLIDE 4: KATALOG MUSIM SEMI (SPRING - TERM 01 S/D 06) -->
<div class="slide">
    <div class="slide-header">
        <div class="slide-category">Bagian 03 • Formula Botani Musiman (1/4)</div>
        <div class="slide-title">Katalog Musim Semi: Pemulihan Vitalitas &amp; Detoks Alami</div>
        <div class="slide-subtitle">Titik Musim 01 s/d 06 — Formula floral ringan berbasis melati, mawar, dan herba muda untuk regenerasi sel tubuh.</div>
    </div>

    <div>
        {table_spring}
    </div>

    <div style="border-top: 1px solid #E5E7EB; padding-top: 3pt; font-size: 7.5pt; color: #4B5563;">
        Penyajian: Poci air panas keramik standar atau es kocok segar (+Rp 2.000). Bebas perisa sintetik dan tanpa kafein.
    </div>
</div>

<!-- SLIDE 5: KATALOG MUSIM PANAS (SUMMER - TERM 07 S/D 12) -->
<div class="slide">
    <div class="slide-header">
        <div class="slide-category">Bagian 03 • Formula Botani Musiman (2/4)</div>
        <div class="slide-title">Katalog Musim Panas: Hidrasi Aktif &amp; Penyejuk Suhu Tubuh</div>
        <div class="slide-subtitle">Titik Musim 07 s/d 12 — Formula mint pegunungan, bunga telang, dan buah sitrus alami untuk pendingin organ dalam.</div>
    </div>

    <div>
        {table_summer}
    </div>

    <div style="border-top: 1px solid #E5E7EB; padding-top: 3pt; font-size: 7.5pt; color: #4B5563;">
        Penyajian: Poci air panas keramik standar atau es kocok segar (+Rp 2.000). Bebas perisa sintetik dan tanpa kafein.
    </div>
</div>

<!-- SLIDE 6: KATALOG MUSIM GUGUR (AUTUMN - TERM 13 S/D 18) -->
<div class="slide">
    <div class="slide-header">
        <div class="slide-category">Bagian 03 • Formula Botani Musiman (3/4)</div>
        <div class="slide-title">Katalog Musim Gugur: Ketenangan Saraf &amp; Restorasi Malam</div>
        <div class="slide-subtitle">Titik Musim 13 s/d 18 — Formula chamomile utuh, kayu manis tropis, dan buah pir kering untuk meredakan ketegangan pikiran.</div>
    </div>

    <div>
        {table_autumn}
    </div>

    <div style="border-top: 1px solid #E5E7EB; padding-top: 3pt; font-size: 7.5pt; color: #4B5563;">
        Penyajian: Poci air panas keramik standar atau es kocok segar (+Rp 2.000). Bebas perisa sintetik dan tanpa kafein.
    </div>
</div>

<!-- SLIDE 7: KATALOG MUSIM DINGIN (WINTER - TERM 19 S/D 24) -->
<div class="slide">
    <div class="slide-header">
        <div class="slide-category">Bagian 03 • Formula Botani Musiman (4/4)</div>
        <div class="slide-title">Katalog Musim Dingin: Kehangatan Mendalam &amp; Imunitas Rimpang</div>
        <div class="slide-subtitle">Titik Musim 19 s/d 24 — Formula jahe merah tua, cengkih nusantara, dan madu hutan untuk menjaga daya tahan tubuh.</div>
    </div>

    <div>
        {table_winter}
    </div>

    <div style="border-top: 1px solid #E5E7EB; padding-top: 3pt; font-size: 7.5pt; color: #4B5563;">
        Penyajian: Poci air panas keramik standar atau es kocok segar (+Rp 2.000). Bebas perisa sintetik dan tanpa kafein.
    </div>
</div>

<!-- SLIDE 8: CUSTOMER JOURNEY -->
<div class="slide">
    <div class="slide-header">
        <div class="slide-category">Bagian 04 • Alur Pengalaman Tamu</div>
        <div class="slide-title">Pengalaman Pelanggan (Customer Journey) di Gerai</div>
        <div class="slide-subtitle">Tahapan pengalaman tamu dari tiba di meja gerai hingga menikmati cangkir teh botani.</div>
    </div>

    <div class="workflow-row">
        <div class="wf-box">
            <div class="wf-num">Fase 1</div>
            <div class="wf-title">Pindai di Meja</div>
            <div style="color: #4B5563; margin-top: 1pt;">Buka katalog web via kamera HP tanpa aplikasi</div>
        </div>
        <div class="wf-arrow">&rarr;</div>
        <div class="wf-box">
            <div class="wf-num">Fase 2</div>
            <div class="wf-title">Pilih &amp; Kustom</div>
            <div style="color: #4B5563; margin-top: 1pt;">Pilih 24 racikan, atur suhu &amp; takaran manis</div>
        </div>
        <div class="wf-arrow">&rarr;</div>
        <div class="wf-box">
            <div class="wf-num">Fase 3</div>
            <div class="wf-title">Bayar QRIS</div>
            <div style="color: #4B5563; margin-top: 1pt;">Nominal terkunci pas; verifikasi server kilat</div>
        </div>
        <div class="wf-arrow">&rarr;</div>
        <div class="wf-box">
            <div class="wf-num">Fase 4</div>
            <div class="wf-title">Pantau Pesanan</div>
            <div style="color: #4B5563; margin-top: 1pt;">Lacak progres seduhan secara transparan</div>
        </div>
        <div class="wf-arrow">&rarr;</div>
        <div class="wf-box">
            <div class="wf-num">Fase 5</div>
            <div class="wf-title">Sajian Dihidangkan</div>
            <div style="color: #4B5563; margin-top: 1pt;">Nikmati seduhan hangat dalam poci keramik</div>
        </div>
    </div>

    <div style="margin-top: 6pt;">
        <table class="editorial-table">
            <thead>
                <tr>
                    <th style="width: 28%;">Parameter Evaluasi</th>
                    <th style="width: 36%;">Layanan Kafe Konvensional</th>
                    <th>Pendekatan Mandiri CHANGKEER</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>Waktu Tunggu Antrean</strong></td>
                    <td>Tamu harus berdiri di kasir 5-10 menit saat gerai ramai.</td>
                    <td>0 menit antre; tamu langsung duduk santai di meja dan memesan lewat HP.</td>
                </tr>
                <tr>
                    <td><strong>Kejelasan Informasi Resep</strong></td>
                    <td>Staf kasir seringkali tidak memahami detail komposisi herbal.</td>
                    <td>Katalog memuat profil rasa, manfaat biologis, dan bahan baku lengkap.</td>
                </tr>
                <tr>
                    <td><strong>Ketepatan Waktu Seduh</strong></td>
                    <td>Sering over-brewed (pahit) akibat barista lupa waktu.</td>
                    <td>Terstandarisasi dengan penghitung waktu digital otomatis di monitor KDS.</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>

<!-- SLIDE 9: ALUR TRANSAKSI & KEAMANAN -->
<div class="slide">
    <div class="slide-header">
        <div class="slide-category">Bagian 05 • Keamanan &amp; Tata Kelola Finansial</div>
        <div class="slide-title">Alur Transaksi &amp; Arsitektur Keamanan Anti-Kecurangan</div>
        <div class="slide-subtitle">Menjamin keabsahan pembayaran perbankan dan mencegah manipulasi harga dari perangkat luar.</div>
    </div>

    <div class="workflow-row">
        <div class="wf-box">
            <div class="wf-num">Tahap 1</div>
            <div class="wf-title">Kunci Total Belanja</div>
            <div style="color: #4B5563; margin-top: 1pt;">Server hitung nominal asli dari DB pusat</div>
        </div>
        <div class="wf-arrow">&rarr;</div>
        <div class="wf-box">
            <div class="wf-num">Tahap 2</div>
            <div class="wf-title">Generate QRIS</div>
            <div style="color: #4B5563; margin-top: 1pt;">QRIS dinamis memuat nominal rupiah pasti</div>
        </div>
        <div class="wf-arrow">&rarr;</div>
        <div class="wf-box">
            <div class="wf-num">Tahap 3</div>
            <div class="wf-title">Validasi Mutasi</div>
            <div style="color: #4B5563; margin-top: 1pt;">Webhook perbankan kirim sinyal settlement</div>
        </div>
        <div class="wf-arrow">&rarr;</div>
        <div class="wf-box">
            <div class="wf-num">Tahap 4</div>
            <div class="wf-title">Kirim Tiket KDS</div>
            <div style="color: #4B5563; margin-top: 1pt;">Pesanan sah otomatis masuk ke antrean bar</div>
        </div>
    </div>

    <div style="margin-top: 6pt;">
        <table class="editorial-table">
            <thead>
                <tr>
                    <th style="width: 25%;">Lapisan Keamanan</th>
                    <th style="width: 35%;">Mekanisme Teknis</th>
                    <th>Manfaat Operasional bagi Gerai</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>Server-Side Anti-Tampering</strong></td>
                    <td>Data harga dihitung murni di server; data harga dari HP tamu diabaikan.</td>
                    <td>Mencegah manipulasi harga lewat inspect element atau aplikasi modifikasi.</td>
                </tr>
                <tr>
                    <td><strong>Idempotency Key Protocol</strong></td>
                    <td>Satu pesanan hanya dapat didebit satu kali pada gerbang perbankan.</td>
                    <td>Mencegah saldo tamu terpotong ganda saat tombol ditekan berulang kali.</td>
                </tr>
                <tr>
                    <td><strong>Webhook Signature Check</strong></td>
                    <td>Verifikasi kriptografi token rahasia pada setiap notifikasi pembayaran.</td>
                    <td>Menolak mutasi fiktif atau simulasi transfer palsu dari pihak luar.</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>

<!-- SLIDE 10: OPERASIONAL BARISTA & KDS -->
<div class="slide">
    <div class="slide-header">
        <div class="slide-category">Bagian 06 • Standar Operasional Bar</div>
        <div class="slide-title">Operasional Barista &amp; Kitchen Display System (KDS)</div>
        <div class="slide-subtitle">Sistem pemantauan digital yang menjamin ketepatan suhu air, waktu seduh, dan takaran pemanis.</div>
    </div>

    <div class="content-two-cols">
        <div class="col-cell" style="width: 48%;">
            <div style="font-size: 9pt; font-weight: 700; color: #1B4332; margin-bottom: 4pt;">Siklus 3 Status Tiket KDS di Bar</div>
            <ul>
                <li><strong>Order Received (Kuning):</strong> Pesanan baru masuk dari tamu; barista memeriksa nomor meja dan resep racikan.</li>
                <li><strong>Brewing Now (Biru):</strong> Barista menekan 'Mulai Seduh'; penghitung waktu digital otomatis berjalan mundur.</li>
                <li><strong>Ready to Serve (Hijau):</strong> Seduhan selesai dan tertuang di cangkir; siap diantar ke meja tamu.</li>
            </ul>
        </div>
        <div class="col-cell" style="width: 52%;">
            <div style="font-size: 9pt; font-weight: 700; color: #1B4332; margin-bottom: 4pt;">Standar Suhu Air &amp; Waktu Ekstraksi</div>
            <table class="editorial-table">
                <thead>
                    <tr>
                        <th>Jenis Bahan</th>
                        <th style="text-align: center;">Suhu Air</th>
                        <th style="text-align: center;">Waktu</th>
                        <th>Keterangan Barista</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Bunga &amp; Teh Hijau</strong></td>
                        <td style="text-align: center; font-weight: 600;">80°C – 85°C</td>
                        <td style="text-align: center;">3.5 – 4 Menit</td>
                        <td>Mencegah rasa pahit tannin.</td>
                    </tr>
                    <tr>
                        <td><strong>Bunga Kering Utuh</strong></td>
                        <td style="text-align: center; font-weight: 600;">90°C – 94°C</td>
                        <td style="text-align: center;">5 Menit</td>
                        <td>Keluarkan warna alami seduhan.</td>
                    </tr>
                    <tr>
                        <td><strong>Rimpang Jahe/Kunyit</strong></td>
                        <td style="text-align: center; font-weight: 600;">98°C – 100°C</td>
                        <td style="text-align: center;">6 Menit</td>
                        <td>Pecah dinding sel minyak atsiri.</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <div style="border-top: 1px solid #E5E7EB; padding-top: 4pt; font-size: 8pt; color: #4B5563;">
        <strong>Standardisasi Rasa:</strong> Takaran pemanis alami diukur mutlak dengan jigger stainless steel (0ml, 7.5ml, 12.5ml, 18ml, 25ml).
    </div>
</div>

<!-- SLIDE 11: ARSITEKTUR TEKNOLOGI -->
<div class="slide">
    <div class="slide-header">
        <div class="slide-category">Bagian 07 • Tumpukan Teknologi &amp; Keandalan</div>
        <div class="slide-title">Ekosistem Perangkat Lunak &amp; Ketahanan Sistem</div>
        <div class="slide-subtitle">Dibangun dengan standar web modern untuk kecepatan tinggi, keamanan data, dan keandalan operasional.</div>
    </div>

    <div>
        <table class="editorial-table">
            <thead>
                <tr>
                    <th style="width: 22%;">Komponen Sistem</th>
                    <th style="width: 25%;">Teknologi Terpilih</th>
                    <th>Peran &amp; Nilai Tambah Operasional</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>Frontend &amp; Server Web</strong></td>
                    <td>Next.js 16 (App Router, React 19)</td>
                    <td>Rendering cepat di sisi server, mendukung akses instan di berbagai ponsel tamu tanpa memakan kuota besar.</td>
                </tr>
                <tr>
                    <td><strong>Bahasa Pemrograman</strong></td>
                    <td>TypeScript 5 (Strict Mode)</td>
                    <td>Menjamin keamanan tipe data (type-safety) dan mencegah galat logika pada kalkulasi transaksi keuangan gerai.</td>
                </tr>
                <tr>
                    <td><strong>Desain Antarmuka</strong></td>
                    <td>Tailwind CSS</td>
                    <td>Desain bersih dengan standar kontras visual tinggi, tata letak ergonomis, dan responsif sempurna di layar sentuh.</td>
                </tr>
                <tr>
                    <td><strong>Penyimpanan Basis Data</strong></td>
                    <td>PostgreSQL (via Supabase)</td>
                    <td>Integritas data transaksi tingkat perbankan dengan Row-Level Security (RLS) untuk keamanan data pelanggan.</td>
                </tr>
                <tr>
                    <td><strong>Validasi Integritas Data</strong></td>
                    <td>Skema Validasi Zod</td>
                    <td>Memverifikasi setiap permintaan HTTP sebelum masuk ke logika bisnis, mencegah input data cacat atau manipulasi.</td>
                </tr>
            </tbody>
        </table>
    </div>

    <div style="border-top: 1px solid #E5E7EB; padding-top: 4pt; font-size: 8pt; color: #4B5563;">
        <strong>Ketahanan Sistem:</strong> Dilengkapi penyimpanan cache memori lokal sehingga antrean di dapur dan pencetakan struk tetap berjalan mulus saat koneksi internet eksternal terganggu.
    </div>
</div>

<!-- SLIDE 12: STRUKTUR PENDIRI & PENUTUP -->
<div class="slide">
    <div class="slide-header">
        <div class="slide-category">Bagian 08 • Dewan Pendiri &amp; Komitmen</div>
        <div class="slide-title">Struktur Dewan Pendiri &amp; Komitmen Usaha</div>
        <div class="slide-subtitle">Sinergi kepemimpinan dan dedikasi operasional dalam menghadirkan tata kelola gerai teh modern yang akuntabel.</div>
    </div>

    <div>
        <div style="font-size: 8.5pt; font-weight: 700; color: #1B4332; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 3pt;">
            SUSUNAN DEWAN PENDIRI CHANGKEER (THE 5 CO-FOUNDERS)
        </div>
        <table class="editorial-table">
            <thead>
                <tr>
                    <th style="width: 5%; text-align: center;">No</th>
                    <th style="width: 28%;">Nama Pendiri</th>
                    <th style="width: 14%;">Peran</th>
                    <th>Fokus Tanggung Jawab Operasional</th>
                </tr>
            </thead>
            <tbody>
                {founders_rows}
            </tbody>
        </table>
    </div>

    <div style="margin-top: 8pt; border-top: 1.5px solid #1B4332; padding-top: 6pt;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="font-size: 8.5pt; color: #1F2937;">
                <strong>Kesimpulan Evaluasi:</strong> CHANGKEER ATELIER membuktikan bahwa tradisi herbal kepulauan nusantara dan filosofi 24 musim dapat ditransformasikan secara elegan menjadi bisnis kafe modern yang terstandarisasi, aman secara digital, dan berkelanjutan.
            </div>
            <div style="text-align: right; font-size: 8pt; color: #6B7280; white-space: nowrap; margin-left: 14pt;">
                <div>Diterbitkan Resmi: Oktober 2026</div>
                <div style="font-weight: 700; color: #111827;">CHANGKEER ATELIER</div>
            </div>
        </div>
    </div>
</div>

</body>
</html>
"""
    clean_html = html.replace("*", "")
    return clean_html

if __name__ == "__main__":
    import sys
    sys.path.insert(0, "/home/ilhammu29/changkeer/scripts")
    from assets_loader import get_all_assets
    assets = get_all_assets()
    out = generate_presentation_id(assets)
    print(f"Indonesian Presentation generated. Total chars: {len(out)}")
