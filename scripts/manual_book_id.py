#!/usr/bin/env python3
"""
manual_book_id.py - Indonesian Operations Manual & System Architecture
Document Type: Corporate Technical Report & Operational Standard (A4 Portrait)
Editorial Standards:
- Pure white background, high-contrast dark text (#111827 / #1F2937), botanical green accent (#1B4332).
- Zero AI-slop visual boxes, zero badges, zero gradients, zero shadows.
- Clean structured tables for all 24 seasonal blends (Spring, Summer, Autumn, Winter).
- Linear transaction flow diagram (thin borders, clean arrows).
- Standard SOP procedure format (Procedure Name, Purpose, Steps 1-2-3, Important Notes).
- Official web logo (logo_new.png) and the 5 official Co-Founders.
- Zero asterisks (*), zero mention of OXID, zero user personal name.
"""

def generate_manual_book_id(assets: dict) -> str:
    founders = assets.get("founders", [])
    solar_terms = assets.get("solar_terms", [])
    logo_b64 = assets.get("logo", "")

    # Group the 24 products into 4 seasons
    seasons_meta = [
        {
            "id": "spring",
            "name": "Musim Semi (Spring / 春季)",
            "sub": "Titik Musim 01 s/d 06",
            "desc": "Karakter rasa floral segar, ringan, dan herba muda untuk pemulihan vitalitas serta detoksifikasi alami tubuh."
        },
        {
            "id": "summer",
            "name": "Musim Panas (Summer / 夏季)",
            "sub": "Titik Musim 07 s/d 12",
            "desc": "Karakter rasa dingin daun mint pegunungan, sitrus segar, dan bunga penyejuk untuk hidrasi aktif serta peredam panas tubuh."
        },
        {
            "id": "autumn",
            "name": "Musim Gugur (Autumn / 秋季)",
            "sub": "Titik Musim 13 s/d 18",
            "desc": "Karakter aroma manis kayu manis tropis, chamomile utuh, dan biji-bijian panggang untuk ketenangan saraf serta relaksasi malam."
        },
        {
            "id": "winter",
            "name": "Musim Dingin (Winter / 冬季)",
            "sub": "Titik Musim 19 s/d 24",
            "desc": "Karakter rempah hangat jahe merah tua, cengkih nusantara, dan madu hutan untuk menjaga imunitas serta sirkulasi darah."
        }
    ]

    # Generate Catalog Tables per Season
    catalog_sections_html = ""
    global_idx = 1
    for sm in seasons_meta:
        items = [t for t in solar_terms if t.get("season") == sm["id"]]
        table_rows = ""
        for it in items:
            ingr_str = ", ".join(it.get("ingredients", []))
            thumb_img = ""
            if it.get("thumb_b64"):
                thumb_img = f'<img src="{it["thumb_b64"]}" style="width: 28px; height: 28px; object-fit: cover; border: 1px solid #D1D5DB; vertical-align: middle; margin-right: 6px; display: inline-block;" alt="{it["term"]}">'
            
            # Map extraction parameters based on blend ingredients
            if "jasmine" in ingr_str.lower() or "green" in ingr_str.lower():
                brew_param = "82°C • 3.5 Menit"
            elif "ginger" in ingr_str.lower() or "cinnamon" in ingr_str.lower():
                brew_param = "98°C • 6.0 Menit"
            elif "chamomile" in ingr_str.lower() or "rose" in ingr_str.lower() or "hibiscus" in ingr_str.lower():
                brew_param = "92°C • 5.0 Menit"
            else:
                brew_param = "88°C • 4.0 Menit"

            table_rows += f"""
            <tr>
                <td style="text-align: center; font-weight: 600; color: #4B5563;">{global_idx:02d}</td>
                <td>
                    <div style="display: flex; align-items: center;">
                        {thumb_img}
                        <div>
                            <strong>{it.get('term')}</strong><br>
                            <span style="font-size: 8pt; color: #4B5563;">{it.get('termChinese')}</span>
                        </div>
                    </div>
                </td>
                <td style="font-weight: 600; color: #111827;">{it.get('blend')}</td>
                <td style="font-size: 8.5pt; color: #374151;">{ingr_str}</td>
                <td style="font-size: 8.5pt; text-align: center; color: #4B5563; white-space: nowrap;">{brew_param}</td>
                <td style="text-align: center; white-space: nowrap; font-size: 8.5pt; font-weight: 500;">
                    Panas {it.get('hotPrice')}<br>
                    <span style="color: #4B5563;">Dingin {it.get('icedPrice')}</span>
                </td>
                <td style="font-size: 8.5pt; color: #4B5563;">{it.get('note')}</td>
            </tr>
            """
            global_idx += 1

        catalog_sections_html += f"""
        <div style="margin-top: 14pt; page-break-inside: avoid;">
            <div style="font-size: 11pt; font-weight: 700; color: #1B4332; margin-bottom: 2pt; border-bottom: 1px solid #1B4332; padding-bottom: 3pt;">
                {sm['name']} — <span style="font-weight: 500; font-size: 9.5pt; color: #4B5563;">{sm['sub']}</span>
            </div>
            <p style="font-size: 9pt; color: #4B5563; margin-top: 3pt; margin-bottom: 6pt;">{sm['desc']}</p>
            <table class="editorial-table">
                <thead>
                    <tr>
                        <th style="width: 5%; text-align: center;">No</th>
                        <th style="width: 23%;">Titik Musim (Solar Term)</th>
                        <th style="width: 17%;">Nama Racikan</th>
                        <th style="width: 23%;">Komposisi Bahan</th>
                        <th style="width: 13%; text-align: center;">Standar Seduh</th>
                        <th style="width: 10%; text-align: center;">Harga</th>
                        <th style="width: 19%;">Profil Rasa &amp; Catatan</th>
                    </tr>
                </thead>
                <tbody>
                    {table_rows}
                </tbody>
            </table>
        </div>
        """

    # Generate Founders Rows for Cover and Introduction
    founders_rows = ""
    for idx, f in enumerate(founders, 1):
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
<title>CHANGKEER ATELIER — BUKU PANDUAN OPERASIONAL &amp; MANUAL SISTEM</title>
<style>
@page {{
    size: A4 portrait;
    margin: 22mm 20mm 22mm 20mm;
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
        content: "BUKU PANDUAN OPERASIONAL &amp; MANUAL SISTEM";
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
        font-size: 8pt;
        font-weight: 500;
        color: #4B5563;
    }}
    @bottom-left {{
        content: "Dokumen Resmi Operasional • Dewan Pendiri CHANGKEER";
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
        font-size: 8pt;
        color: #6B7280;
    }}
    @bottom-right {{
        content: "Halaman " counter(page) " dari " counter(pages);
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
        font-size: 8pt;
        font-weight: 600;
        color: #111827;
    }}
}}

@page:first {{
    margin: 20mm 20mm 18mm 20mm;
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
    font-size: 9.5pt;
    line-height: 1.55;
    color: #1F2937;
    background-color: #FFFFFF;
    margin: 0;
    padding: 0;
}}

/* Typography Hierarchy */
.chapter-num {{
    font-size: 9.5pt;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #1B4332;
    margin-bottom: 2pt;
}}

h1 {{
    font-size: 18pt;
    font-weight: 700;
    line-height: 1.25;
    color: #111827;
    margin-top: 0;
    margin-bottom: 8pt;
    border-bottom: 1.5px solid #1B4332;
    padding-bottom: 4pt;
    page-break-after: avoid;
}}

h2 {{
    font-size: 12pt;
    font-weight: 700;
    line-height: 1.35;
    color: #111827;
    margin-top: 14pt;
    margin-bottom: 5pt;
    page-break-after: avoid;
}}

h3 {{
    font-size: 10pt;
    font-weight: 700;
    line-height: 1.35;
    color: #1B4332;
    margin-top: 10pt;
    margin-bottom: 4pt;
    page-break-after: avoid;
}}

p {{
    margin-top: 0;
    margin-bottom: 7pt;
    text-align: justify;
    color: #1F2937;
}}

/* Standard Lists */
ul {{
    list-style-type: disc;
    margin-top: 3pt;
    margin-bottom: 8pt;
    padding-left: 18px;
}}

ul li {{
    margin-bottom: 3pt;
    line-height: 1.5;
    color: #1F2937;
}}

ol {{
    margin-top: 3pt;
    margin-bottom: 8pt;
    padding-left: 18px;
}}

ol li {{
    margin-bottom: 3pt;
    line-height: 1.5;
    color: #1F2937;
}}

/* Table Standards */
.editorial-table {{
    width: 100%;
    border-collapse: collapse;
    margin-top: 6pt;
    margin-bottom: 10pt;
    font-size: 9pt;
    page-break-inside: auto;
}}

.editorial-table thead {{
    display: table-header-group;
}}

.editorial-table tr {{
    page-break-inside: avoid;
}}

.editorial-table th {{
    background-color: #F9FAFB;
    color: #111827;
    font-weight: 700;
    text-align: left;
    padding: 6pt 7pt;
    border-top: 1px solid #D1D5DB;
    border-bottom: 1.5px solid #1B4332;
    border-left: 1px solid #E5E7EB;
    border-right: 1px solid #E5E7EB;
    font-size: 8.5pt;
}}

.editorial-table td {{
    padding: 5.5pt 7pt;
    border-bottom: 1px solid #E5E7EB;
    border-left: 1px solid #E5E7EB;
    border-right: 1px solid #E5E7EB;
    vertical-align: top;
    line-height: 1.4;
}}

.editorial-table tbody tr:nth-child(even) {{
    background-color: #FFFFFF;
}}

/* SOP Procedures */
.sop-block {{
    margin-top: 8pt;
    margin-bottom: 12pt;
    page-break-inside: avoid;
}}

.sop-title {{
    font-size: 10.5pt;
    font-weight: 700;
    color: #111827;
    margin-bottom: 2pt;
}}

.sop-purpose {{
    font-size: 9pt;
    color: #4B5563;
    font-style: italic;
    margin-bottom: 4pt;
}}

.sop-steps {{
    margin-top: 2pt;
    margin-bottom: 4pt;
    padding-left: 18px;
}}

.sop-note {{
    font-size: 8.5pt;
    color: #1F2937;
    background-color: #F9FAFB;
    border-left: 3px solid #1B4332;
    padding: 4pt 8pt;
    margin-top: 4pt;
}}

/* Linear Workflow Diagram */
.workflow-container {{
    display: table;
    width: 100%;
    table-layout: fixed;
    margin: 10pt 0 12pt 0;
}}

.workflow-node {{
    display: table-cell;
    vertical-align: middle;
    text-align: center;
    border: 1px solid #D1D5DB;
    background-color: #F9FAFB;
    padding: 7pt 5pt;
    font-size: 8pt;
    line-height: 1.3;
}}

.workflow-node-num {{
    font-weight: 700;
    font-size: 7.5pt;
    color: #1B4332;
    text-transform: uppercase;
    margin-bottom: 2pt;
}}

.workflow-node-title {{
    font-weight: 600;
    color: #111827;
}}

.workflow-arrow-cell {{
    display: table-cell;
    width: 18px;
    vertical-align: middle;
    text-align: center;
    font-size: 12pt;
    color: #6B7280;
    font-weight: bold;
}}

.page-break {{
    page-break-before: always;
}}
</style>
</head>
<body>

<!-- HALAMAN SAMPUL (COVER) -->
<div style="min-height: 245mm; display: flex; flex-direction: column; justify-content: space-between;">
    <div>
        <!-- Header Brand -->
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1.5px solid #1B4332; padding-bottom: 8pt; margin-bottom: 24pt;">
            <div style="display: flex; align-items: center;">
                <img src="{logo_b64}" style="height: 38px; width: auto; margin-right: 12pt; display: block;" alt="CHANGKEER Logo">
                <div>
                    <div style="font-size: 13pt; font-weight: 800; letter-spacing: 0.06em; color: #1B4332; text-transform: uppercase;">CHANGKEER ATELIER</div>
                    <div style="font-size: 8pt; color: #4B5563; text-transform: uppercase; letter-spacing: 0.05em;">Artisan Herbal Tea &amp; Botanical Laboratory</div>
                </div>
            </div>
            <div style="text-align: right; font-size: 8pt; color: #6B7280;">
                <div>DOKUMEN RESMI</div>
                <div style="font-weight: 700; color: #111827;">EDISI 2026</div>
            </div>
        </div>

        <!-- Judul Dokumen -->
        <div style="margin-top: 30pt; margin-bottom: 28pt;">
            <div style="font-size: 9pt; font-weight: 700; color: #1B4332; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 6pt;">
                DOKUMEN OPERASIONAL &amp; ARSITEKTUR TEKNOLOGI
            </div>
            <div style="font-size: 24pt; font-weight: 800; line-height: 1.2; color: #111827; margin-bottom: 10pt;">
                BUKU PANDUAN OPERASIONAL &amp; MANUAL SISTEM
            </div>
            <div style="font-size: 11pt; line-height: 1.45; color: #4B5563; max-width: 90%;">
                Standar Prosedur Operasional Gerai, Tata Kelola Transaksi Digital, Katalog Formula 24 Titik Musim Alam, dan Dokumentasi Arsitektur E-Commerce Cafe.
            </div>
        </div>

        <!-- Metadata Dokumen -->
        <div style="margin-top: 20pt; margin-bottom: 24pt;">
            <table class="editorial-table" style="width: 100%;">
                <thead>
                    <tr>
                        <th colspan="2" style="font-size: 9pt;">INFORMASI &amp; IDENTIFIKASI DOKUMEN</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="width: 32%; font-weight: 600; color: #374151;">Nomor / Kode Dokumen</td>
                        <td style="font-family: monospace; font-size: 9pt; color: #111827;">DOC-CKR-OPS-2026-V2</td>
                    </tr>
                    <tr>
                        <td style="font-weight: 600; color: #374151;">Klasifikasi &amp; Aksesibilitas</td>
                        <td>Dokumen Panduan Operasional Resmi (Internal Staf &amp; Dewan Evaluasi)</td>
                    </tr>
                    <tr>
                        <td style="font-weight: 600; color: #374151;">Versi Rilis &amp; Tanggal Efektif</td>
                        <td>Versi 2.1 (Revisi Editorial Komprehensif) — Oktober 2026</td>
                    </tr>
                    <tr>
                        <td style="font-weight: 600; color: #374151;">Entitas Penerbit</td>
                        <td>Dewan Pendiri CHANGKEER ATELIER (5 Co-Founders)</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- Tim Dewan Pendiri Resmi -->
    <div>
        <div style="font-size: 9.5pt; font-weight: 700; color: #1B4332; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4pt;">
            DEWAN PENDIRI CHANGKEER (THE 5 CO-FOUNDERS)
        </div>
        <table class="editorial-table">
            <thead>
                <tr>
                    <th style="width: 6%; text-align: center;">No</th>
                    <th style="width: 30%;">Nama Pendiri</th>
                    <th style="width: 16%;">Peran</th>
                    <th>Fokus Tanggung Jawab Operasional</th>
                </tr>
            </thead>
            <tbody>
                {founders_rows}
            </tbody>
        </table>

        <div style="font-size: 8pt; color: #6B7280; text-align: center; margin-top: 10pt; border-top: 1px solid #E5E7EB; padding-top: 6pt;">
            CHANGKEER ATELIER • Jawa Barat &amp; Jakarta, Indonesia • Seluruh Hak Cipta Dilindungi Undang-Undang.
        </div>
    </div>
</div>

<!-- DAFTAR ISI -->
<div class="page-break">
    <div class="chapter-num">Daftar Isi Eksekutif</div>
    <h1>Struktur Dokumen Panduan Operasional</h1>

    <p style="margin-bottom: 12pt;">
        Dokumen ini disusun sebagai panduan menyeluruh bagi seluruh staf gerai, barista, kasir, pengelola teknologi, serta evaluator akademik dan bisnis. Seluruh isi disajikan secara lugas, terstruktur, dan berbasis pembuktian teknis.
    </p>

    <table class="editorial-table">
        <thead>
            <tr>
                <th style="width: 12%; text-align: center;">Bab</th>
                <th style="width: 48%;">Judul Bab &amp; Ruang Lingkup Materi</th>
                <th style="width: 40%;">Ringkasan Pembahasan Utama</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td style="text-align: center; font-weight: 700; color: #1B4332;">BAB 01</td>
                <td><strong>Konsep, Identitas Bisnis &amp; Visi Usaha</strong></td>
                <td>Profil usaha, filosofi 24 Solar Terms (Jieqi), rasionalisasi tisane botani, dan struktur 5 Co-Founders.</td>
            </tr>
            <tr>
                <td style="text-align: center; font-weight: 700; color: #1B4332;">BAB 02</td>
                <td><strong>Arsitektur Sistem &amp; Ekosistem Teknologi</strong></td>
                <td>Alur kerja sistem, tumpukan teknologi modern, ketahanan sistem tanpa gangguan (dual-tier data store).</td>
            </tr>
            <tr>
                <td style="text-align: center; font-weight: 700; color: #1B4332;">BAB 03</td>
                <td><strong>Katalog Lengkap 24 Racikan Musim Alam</strong></td>
                <td>Tabel komprehensif formula 24 titik musim, suhu seduh, harga resmi, dan opsi kustomisasi seduhan.</td>
            </tr>
            <tr>
                <td style="text-align: center; font-weight: 700; color: #1B4332;">BAB 04</td>
                <td><strong>Tata Kelola Transaksi &amp; QRIS Dinamis</strong></td>
                <td>Diagram alur transaksi linear, validasi server-side anti-tampering, dan idempotensi pencegah dobel bayar.</td>
            </tr>
            <tr>
                <td style="text-align: center; font-weight: 700; color: #1B4332;">BAB 05</td>
                <td><strong>Standar Prosedur Operasional (SOP) Barista</strong></td>
                <td>Pembacaan monitor KDS, parameter suhu dan durasi seduh, takaran pemanis alami, dan sanitasi alat.</td>
            </tr>
            <tr>
                <td style="text-align: center; font-weight: 700; color: #1B4332;">BAB 06</td>
                <td><strong>Standar Prosedur Operasional (SOP) Kasir</strong></td>
                <td>Layanan pembayaran POS, matriks troubleshooting transaksi, prosedur refund, dan rekonsiliasi kas harian.</td>
            </tr>
            <tr>
                <td style="text-align: center; font-weight: 700; color: #1B4332;">BAB 07</td>
                <td><strong>Tata Kelola Toko &amp; Kamus Istilah Praktis</strong></td>
                <td>Pengelolaan stok menu kilat (/admin) dan kamus penjelasan istilah teknis dan herbal untuk orang awam.</td>
            </tr>
        </tbody>
    </table>
</div>

<!-- BAB 1 -->
<div class="page-break">
    <div class="chapter-num">Bab 01 • Konsep &amp; Identitas Usaha</div>
    <h1>Mengenal CHANGKEER &amp; Filosofi 24 Musim</h1>

    <h2>1.1 Profil Usaha dan Nilai Utama</h2>
    <p>
        <strong>CHANGKEER ATELIER</strong> adalah gerai seduhan teh herbal botani modern (<em>artisan herbal tea atelier</em>) yang memadukan kekayaan tanaman rempah kepulauan Indonesia dengan kearifan siklus 24 Titik Musim Alam (<em>Solar Terms / 24 Jieqi</em>). Berbeda dari kedai kopi komersial berkafein tinggi atau toko jamu konvensional yang belum terstandarisasi, CHANGKEER menghadirkan ruang hening yang nyaman bagi siapa saja yang mendambakan hidrasi sehat alami, terukur, dan menenangkan pikiran.
    </p>
    <p>
        Secara terminologi botani, seluruh seduhan di CHANGKEER termasuk ke dalam kategori <strong>Tisane</strong> (seduhan murni dari herba, rimpang, dan kelopak bunga asli utuh) tanpa daun teh hitam sintetis maupun zat perisa kimia pabrikan. Hal ini menjadikan setiap racikan ramah bagi lambung sensitif dan aman dinikmati kapan saja tanpa memicu kecemasan atau gangguan tidur.
    </p>

    <h2>1.2 Filosofi 24 Titik Musim Alam (Solar Terms)</h2>
    <p>
        Metabolisme tubuh manusia bereaksi secara biologis terhadap perubahan iklim dan cuaca sekitar. Ketika terik panas menyengat, tubuh memerlukan asupan herbal yang menyejukkan suhu organ dalam. Sebaliknya, saat musim hujan lebat berangin dingin, tubuh membutuhkan kehangatan minyak atsiri rimpang untuk memperlancar sirkulasi darah dan mencegah kelesuan fisik.
    </p>
    <p>
        CHANGKEER mengelompokkan 24 racikan resminya ke dalam 4 pilar musim utama:
    </p>
    <ul>
        <li><strong>Musim Semi (Spring / 春季):</strong> Formula berbasis bunga segar (floral) ringan yang membantu pemulihan vitalitas organ dan detoksifikasi alami setelah masa pasif.</li>
        <li><strong>Musim Panas (Summer / 夏季):</strong> Formula berbasis daun mint pegunungan, bunga telang, dan buah sitrus alami untuk mendinginkan suhu tubuh dan mencegah dehidrasi.</li>
        <li><strong>Musim Gugur (Autumn / 秋季):</strong> Formula berbasis bunga chamomile utuh, kayu manis tropis, dan buah pir kering untuk meredakan ketegangan stres dan meningkatkan kualitas istirahat.</li>
        <li><strong>Musim Dingin (Winter / 冬季):</strong> Formula berbasis jahe merah tua, cengkih, dan madu hutan murni untuk memberi kehangatan mendalam serta memperkuat daya tahan tubuh.</li>
    </ul>

    <h2>1.3 Urgensi Platform Digital Mandiri</h2>
    <p>
        Menyeduh teh herbal membutuhkan ketelitian tinggi pada parameter suhu air dan durasi ekstraksi. Apabila barista terdistraksi oleh pencatatan pesanan manual di secarik kertas bon atau penghitungan uang tunai yang lambat, mutu seduhan teh akan menurun drastis. Sistem aplikasi web mandiri CHANGKEER dibangun agar tamu dapat memesan leluasa lewat ponselnya di meja, sementara staf peracik dapat memusatkan 100% perhatian pada ketepatan seduhan di bar.
    </p>
</div>

<!-- BAB 2 -->
<div class="page-break">
    <div class="chapter-num">Bab 02 • Ekosistem Teknologi</div>
    <h1>Arsitektur Sistem &amp; Keandalan Digital</h1>

    <h2>2.1 Prinsip Kerja Sistem Terintegrasi</h2>
    <p>
        Sistem perangkat lunak CHANGKEER dirancang dengan pendekatan arsitektur web modern yang mengutamakan kecepatan akses, keamanan data transaksi perbankan, dan kemudahan pengoperasian di meja bar. Tamu dapat mengakses menu tanpa perlu mengunduh aplikasi berat dari toko aplikasi.
    </p>

    <h2>2.2 Tumpukan Teknologi Terpilih (Tech Stack)</h2>
    <table class="editorial-table">
        <thead>
            <tr>
                <th style="width: 24%;">Lapisan Sistem</th>
                <th style="width: 26%;">Teknologi Terpilih</th>
                <th>Alasan Pemilihan &amp; Manfaat Operasional</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Aplikasi Web Utama</strong></td>
                <td>Next.js 16 (React 19, App Router)</td>
                <td>Halaman terbuka sangat cepat di peramban seluler tamu tanpa memakan kuota internet besar; mendukung rendering cepat di sisi server.</td>
            </tr>
            <tr>
                <td><strong>Bahasa Pemrograman</strong></td>
                <td>TypeScript 5 (Strict Mode)</td>
                <td>Mencegah galat (bug) tipe data sejak tahap penulisan kode, khususnya pada kalkulasi harga, potongan voucher, dan parameter resep.</td>
            </tr>
            <tr>
                <td><strong>Tata Letak &amp; Antarmuka</strong></td>
                <td>Tailwind CSS</td>
                <td>Antarmuka ergonomis dengan hierarki visual terarah, bebas dari elemen dekoratif berlebihan, dan responsif di seluruh layar ponsel.</td>
            </tr>
            <tr>
                <td><strong>Basis Data &amp; Penyimpanan</strong></td>
                <td>PostgreSQL (via Supabase)</td>
                <td>Penyimpanan relasional dengan integritas data ACID dan Row-Level Security (RLS) untuk melindungi riwayat pesanan serta catatan finansial gerai.</td>
            </tr>
            <tr>
                <td><strong>Validasi Integritas Data</strong></td>
                <td>Skema Validasi Zod</td>
                <td>Menjamin setiap muatan data (payload) pesanan yang dikirim ke server sesuai dengan tipe data yang diizinkan sebelum diproses lebih lanjut.</td>
            </tr>
        </tbody>
    </table>

    <h2>2.3 Ketahanan Sistem Tanpa Gangguan (Dual-Tier Resilience)</h2>
    <p>
        Untuk melindungi kelancaran operasional dari risiko gangguan koneksi internet mendadak, sistem mengadopsi mekanisme penyimpanan lapis ganda (<em>dual-tier storage architecture</em>). Data pesanan aktif yang sedang diproses di meja barista tetap tersimpan aman pada memori cache lokal gerai, sehingga antrean seduhan dan pencetakan struk pembayaran tidak akan terputus kendati jaringan eksternal mengalami latensi tinggi.
    </p>
</div>

<!-- BAB 3 -->
<div class="page-break">
    <div class="chapter-num">Bab 03 • Katalog Formula</div>
    <h1>Katalog Lengkap 24 Racikan Musim Alam</h1>

    <p>
        Berikut adalah dokumentasi resmi komposisi bahan, standar parameter ekstraksi air panas, serta penetapan harga untuk seluruh 24 racikan herbal CHANGKEER ATELIER:
    </p>

    {catalog_sections_html}

    <div style="margin-top: 14pt; page-break-inside: avoid;">
        <h2>3.2 Standar Kustomisasi Seduhan</h2>
        <p>Setiap racikan dapat disesuaikan menurut kebutuhan spesifik tamu dengan acuan parameter resmi berikut:</p>
        <table class="editorial-table">
            <thead>
                <tr>
                    <th style="width: 25%;">Parameter Pilihan</th>
                    <th style="width: 35%;">Opsi Kustomisasi</th>
                    <th>Keterangan Operasional &amp; Biaya</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>Suhu Penyajian</strong></td>
                    <td>Hot Tea Pot / Iced Shaken Tea</td>
                    <td>Penyajian poci air panas keramik (standar menu) atau es kocok segar higienis (+Rp 2.000).</td>
                </tr>
                <tr>
                    <td><strong>Tingkat Kemanisan Alami</strong></td>
                    <td>0%, 30%, 50%, 75%, 100%</td>
                    <td>Menggunakan madu hutan murni atau nektar sorgum alami terukur jigger. Bebas pemanis buatan.</td>
                </tr>
                <tr>
                    <td><strong>Topping Bunga Kering</strong></td>
                    <td>Mawar, Krisan Emas, Telang, Melati, Osmanthus, Rosella (+Rp 3.000 – Rp 4.000)</td>
                    <td>Kelopak bunga kering utuh food-grade untuk memperkaya profil aroma aromatik dan ketenangan saraf.</td>
                </tr>
                <tr>
                    <td><strong>Topping Buah Kering</strong></td>
                    <td>Goji Berry, Angco, Longan, Pir, Apel, Mangga, Lemon, Kulit Jeruk (+Rp 2.000 – Rp 4.000)</td>
                    <td>Irisan buah kering dehidrasi alami tanpa pengawet untuk menambah rasa manis-segar buah alami.</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>

<!-- BAB 4 -->
<div class="page-break">
    <div class="chapter-num">Bab 04 • Keamanan Pembayaran</div>
    <h1>Tata Kelola Transaksi &amp; QRIS Dinamis</h1>

    <h2>4.1 Diagram Alur Transaksi Digital Gerai</h2>
    <p>
        Alur transaksi dirancang linear dari pemesanan mandiri oleh tamu hingga penyerahan cangkir seduhan di meja peracikan:
    </p>

    <div class="workflow-container">
        <div class="workflow-node">
            <div class="workflow-node-num">Langkah 1</div>
            <div class="workflow-node-title">Pelanggan Memilih Menu</div>
            <div style="font-size: 7.5pt; color: #4B5563; margin-top: 2pt;">Pilih racikan &amp; kustomisasi di peramban ponsel</div>
        </div>
        <div class="workflow-arrow-cell">&rarr;</div>
        <div class="workflow-node">
            <div class="workflow-node-num">Langkah 2</div>
            <div class="workflow-node-title">Sistem Menghitung Total</div>
            <div style="font-size: 7.5pt; color: #4B5563; margin-top: 2pt;">Server mengunci nominal &amp; cetak QRIS dinamis</div>
        </div>
        <div class="workflow-arrow-cell">&rarr;</div>
        <div class="workflow-node">
            <div class="workflow-node-num">Langkah 3</div>
            <div class="workflow-node-title">Pembayaran Diverifikasi</div>
            <div style="font-size: 7.5pt; color: #4B5563; margin-top: 2pt;">Server memvalidasi mutasi perbankan resmi</div>
        </div>
        <div class="workflow-arrow-cell">&rarr;</div>
        <div class="workflow-node">
            <div class="workflow-node-num">Langkah 4</div>
            <div class="workflow-node-title">Pesanan Masuk KDS</div>
            <div style="font-size: 7.5pt; color: #4B5563; margin-top: 2pt;">Tiket resep otomatis tampil di layar barista</div>
        </div>
        <div class="workflow-arrow-cell">&rarr;</div>
        <div class="workflow-node">
            <div class="workflow-node-num">Langkah 5</div>
            <div class="workflow-node-title">Barista Menyeduh</div>
            <div style="font-size: 7.5pt; color: #4B5563; margin-top: 2pt;">Ekstraksi presisi sesuai panduan resep</div>
        </div>
        <div class="workflow-arrow-cell">&rarr;</div>
        <div class="workflow-node">
            <div class="workflow-node-num">Langkah 6</div>
            <div class="workflow-node-title">Pesanan Diserahkan</div>
            <div style="font-size: 7.5pt; color: #4B5563; margin-top: 2pt;">Teh diantar &amp; status di KDS ditandai selesai</div>
        </div>
    </div>

    <h2>4.2 Perbandingan QRIS Statis vs QRIS Dinamis CHANGKEER</h2>
    <table class="editorial-table">
        <thead>
            <tr>
                <th style="width: 25%;">Parameter Evaluasi</th>
                <th style="width: 37%;">QRIS Statis (Kertas Cetak Biasa)</th>
                <th>QRIS Dinamis CHANGKEER</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Input Nominal Transaksi</strong></td>
                <td>Manual diketik oleh pelanggan; rentan salah input (kelebihan atau kekurangan nol).</td>
                <td>Otomatis terkunci di server; nominal tagihan pas persis tanpa perlu input angka manual.</td>
            </tr>
            <tr>
                <td><strong>Verifikasi Pembayaran</strong></td>
                <td>Staf kasir harus mengamati dan mencatat tangkapan layar (screenshot) HP pembeli.</td>
                <td>Diverifikasi otomatis oleh webhook server; status pesanan langsung berubah dalam 2 detik.</td>
            </tr>
            <tr>
                <td><strong>Risiko Pemalsuan Struk</strong></td>
                <td>Tinggi; rawan pemalsuan bukti transfer fiktif atau editan aplikasi.</td>
                <td>Nol; server hanya menerima mutasi dana yang tervalidasi langsung oleh gerbang pembayaran.</td>
            </tr>
        </tbody>
    </table>

    <h2>4.3 Validasi Sisi Server Anti-Kecurangan (Server-Side Anti-Tampering)</h2>
    <p>
        Banyak platform pemesanan web rentan dimanipulasi melalui modifikasi parameter pada peramban (inspect element). Pada sistem CHANGKEER, harga satuan menu <strong>tidak pernah diproses berdasarkan data dari ponsel tamu</strong>. Saat tombol pemesanan ditekan, server mencocokkan kembali setiap ID produk dengan basis data katalog pusat. Apabila terdeteksi ketidakcocokan nominal atau manipulasi data, pesanan otomatis digugurkan oleh gerbang keamanan.
    </p>

    <h2>4.4 Proteksi Saldo Terpotong Ganda (Idempotency Key)</h2>
    <p>
        Ketika jaringan internet tamu mengalami hambatan dan tombol bayar tertekan lebih dari satu kali, sistem mengaktifkan mekanisme <em>idempotency lock</em>. Setiap pesanan memiliki kode unik transaksi yang hanya dapat didebit satu kali pada gerbang perbankan, menjamin saldo pembeli tidak akan terpotong ganda.
    </p>
</div>

<!-- BAB 5 -->
<div class="page-break">
    <div class="chapter-num">Bab 05 • Prosedur Barista</div>
    <h1>Standar Prosedur Operasional (SOP) Barista di Bar</h1>

    <div class="sop-block">
        <div class="sop-title">SOP-BAR-01: Prosedur Penerimaan &amp; Pengelolaan Tiket KDS</div>
        <div class="sop-purpose">Tujuan: Menjamin seluruh pesanan diseduh sesuai urutan antrean tanpa tertukar dan tepat waktu.</div>
        <div style="font-weight: 600; font-size: 9pt; margin-top: 4pt;">Langkah Kerja:</div>
        <ol class="sop-steps">
            <li>Amati monitor sentuh KDS yang diletakkan pada stasiun peracikan teh.</li>
            <li>Identifikasi kartu tiket berstatus <strong>'Order Received' (Kuning)</strong> dan periksa detail: nomor meja, nama racikan, suhu seduh, dan tingkat kemanisan.</li>
            <li>Tekan tombol <strong>'Mulai Seduh'</strong> pada layar sentuh. Status tiket akan berganti menjadi <strong>'Brewing Now' (Biru)</strong> dan penghitung waktu ekstraksi otomatis berjalan.</li>
            <li>Setelah durasi ekstraksi selesai dan minuman tertuang ke dalam cangkir/poci, tekan tombol <strong>'Siap Disajikan'</strong> untuk memindahkan status menjadi <strong>'Ready' (Hijau)</strong>.</li>
        </ol>
        <div class="sop-note">
            <strong>Catatan Penting:</strong> Barista dilarang mendahulukan tiket pesanan yang baru masuk sebelum tiket antrean sebelumnya selesai, kecuali atas instruksi supervisor gerai.
        </div>
    </div>

    <h2>5.2 Standar Suhu Air &amp; Durasi Ekstraksi Seduhan</h2>
    <p>
        Karakter biokimia tiap tanaman herbal menuntut perlakuan suhu air yang berbeda guna menghindari rasa pahit tannin berlebih:
    </p>
    <table class="editorial-table">
        <thead>
            <tr>
                <th style="width: 28%;">Klasifikasi Bahan</th>
                <th style="width: 20%; text-align: center;">Suhu Air Ideal</th>
                <th style="width: 20%; text-align: center;">Durasi Seduh</th>
                <th>Instruksi Mutu Barista</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Bunga Segar &amp; Teh Hijau</strong></td>
                <td style="text-align: center; font-weight: 600;">80°C – 85°C</td>
                <td style="text-align: center;">3.5 – 4.0 Menit</td>
                <td>Gunakan ketel pengatur suhu digital; hindari air mendidih agar kelopak melati tidak layu hangus.</td>
            </tr>
            <tr>
                <td><strong>Kelopak Bunga Kering (Chamomile, Rosella)</strong></td>
                <td style="text-align: center; font-weight: 600;">90°C – 94°C</td>
                <td style="text-align: center;">5.0 Menit Penuh</td>
                <td>Pastikan seluruh kelopak terendam air panas secara merata hingga warna ekstrak keluar sempurna.</td>
            </tr>
            <tr>
                <td><strong>Rimpang Akar (Jahe Merah, Kunyit)</strong></td>
                <td style="text-align: center; font-weight: 600;">98°C – 100°C</td>
                <td style="text-align: center;">6.0 Menit Penuh</td>
                <td>Diperlukan air bersuhu mendidih penuh guna memecah dinding sel rimpang dan melepaskan minyak atsiri.</td>
            </tr>
            <tr>
                <td><strong>Biji-bijian &amp; Kulit Kayu Manis</strong></td>
                <td style="text-align: center; font-weight: 600;">95°C – 98°C</td>
                <td style="text-align: center;">5.5 Menit Penuh</td>
                <td>Tutup poci porselen rapat-rapat selama proses infusi agar uap aroma aromatik tidak menghilang.</td>
            </tr>
        </tbody>
    </table>

    <div class="sop-block">
        <div class="sop-title">SOP-BAR-02: Standar Penakaran Pemanis Alami Terukur</div>
        <div class="sop-purpose">Tujuan: Menjaga konsistensi rasa manis alami nektar sorgum atau madu hutan pada setiap cangkir.</div>
        <div style="font-weight: 600; font-size: 9pt; margin-top: 4pt;">Standar Takaran Jigger Barista:</div>
        <table class="editorial-table">
            <thead>
                <tr>
                    <th style="width: 25%;">Tingkat Kemanisan</th>
                    <th style="width: 25%;">Takaran Jigger (ml)</th>
                    <th>Karakter Profil Rasa pada Minuman</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>0% (Tanpa Pemanis)</strong></td>
                    <td>0 ml</td>
                    <td>Karakter botani murni tanpa kalori; profil herba terasa tajam dan otentik.</td>
                </tr>
                <tr>
                    <td><strong>30% (Sedikit Manis)</strong></td>
                    <td>7.5 ml</td>
                    <td>Sentuhan manis lembut di ujung lidah; aroma bunga tetap mendominasi cangkir.</td>
                </tr>
                <tr>
                    <td><strong>50% (Seimbang / Standar)</strong></td>
                    <td>12.5 ml</td>
                    <td>Standar rekomendasi atelier; keseimbangan sempurna antara rasa herba dan manis alami.</td>
                </tr>
                <tr>
                    <td><strong>75% (Cukup Manis)</strong></td>
                    <td>18.0 ml</td>
                    <td>Rasa manis lebih dominan, sangat cocok untuk varian seduhan asam sitrus dan es kocok.</td>
                </tr>
                <tr>
                    <td><strong>100% (Manis Penuh)</strong></td>
                    <td>25.0 ml</td>
                    <td>Manis penuh tanpa membuat tenggorokan gatal berkat kemurnian nektar alami.</td>
                </tr>
            </tbody>
        </table>
        <div class="sop-note">
            <strong>Catatan Penting:</strong> Barista dilarang memperkirakan takaran dengan insting. Selalu gunakan gelas ukur atau sendok jigger terkalibrasi.
        </div>
    </div>
</div>

<!-- BAB 6 -->
<div class="page-break">
    <div class="chapter-num">Bab 06 • Prosedur Kasir</div>
    <h1>Standar Prosedur Operasional (SOP) Kasir &amp; Rekonsiliasi</h1>

    <h2>6.1 Peran dan Tanggung Jawab Staf Kasir</h2>
    <p>
        Kendati sebagian besar transaksi dilakukan secara mandiri oleh tamu melalui pemindaian QRIS di meja, kasir gerai memegang peranan krusial dalam melayani tamu yang ingin membayar secara tunai, mengelola antrean pemesanan kasir (POS), memverifikasi kendala perbankan, dan menyusun laporan pembukuan penutupan gerai harian.
    </p>

    <h2>6.2 Matriks Penanganan Masalah Pembayaran (Troubleshooting)</h2>
    <table class="editorial-table">
        <thead>
            <tr>
                <th style="width: 25%;">Kondisi Masalah</th>
                <th style="width: 32%;">Penyebab Potensial</th>
                <th>Prosedur Solusi Staf Kasir</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Kode QRIS Sulit Dipindai</strong></td>
                <td>Kecerahan layar ponsel tamu terlalu rendah atau lensa kamera buram.</td>
                <td>Arahkan tamu menaikkan tingkat kecerahan layar ponsel hingga 100%. Jika tetap gagal, buatkan tiket baru melalui tablet kasir.</td>
            </tr>
            <tr>
                <td><strong>Saldo Terpotong, Status Belum Berubah</strong></td>
                <td>Latensi jaringan antarbank pada jam transaksi sibuk nasional.</td>
                <td>Minta tamu memperlihatkan bukti notifikasi transfer berhasil di aplikasi perbankannya. Kasir mencocokkan nomor referensi, lalu menekan tombol 'Validasi Manual' pada dasbor kasir.</td>
            </tr>
            <tr>
                <td><strong>Salah Pilih Menu oleh Pelanggan</strong></td>
                <td>Tamu terburu-buru saat menekan konfirmasi di keranjang ponsel.</td>
                <td>Jika barista belum menekan tombol 'Mulai Seduh', kasir berhak membatalkan pesanan di sistem dan menerbitkan pesanan pengganti yang benar.</td>
            </tr>
        </tbody>
    </table>

    <div class="sop-block">
        <div class="sop-title">SOP-CAS-01: Prosedur Rekonsiliasi Kas Harian (Closing Shift)</div>
        <div class="sop-purpose">Tujuan: Menjamin akurasi pencatatan antara uang fisik di laci kasir, mutasi QRIS, dan data penjualan sistem.</div>
        <div style="font-weight: 600; font-size: 9pt; margin-top: 4pt;">Langkah Kerja Closing Kasir:</div>
        <ol class="sop-steps">
            <li>Pada pukul 21.45 WIB, hentikan penerimaan pesanan baru dan cetak ringkasan laporan harian dari dasbor <code>/admin</code>.</li>
            <li>Keluarkan seluruh uang fisik dari laci kasir dan hitung secara teliti per pecahan uang kertas dan koin di hadapan supervisor saksi.</li>
            <li>Pisahkan modal awal kasir (kas kecil / float fund) sebesar Rp 500.000 ke dalam amplop modal kerja harian.</li>
            <li>Cocokkan total sisa uang tunai dengan angka 'Total Pendapatan Tunai' pada laporan sistem.</li>
            <li>Buka mutasi mutasi perbankan/QRIS pada portal merchant dan cocokkan dengan 'Total Pendapatan Digital'.</li>
            <li>Tandatangani Berita Acara Rekonsiliasi Harian bersama supervisor dan masukkan setoran kas ke dalam brankas gerai.</li>
        </ol>
        <div class="sop-note">
            <strong>Toleransi Selisih:</strong> Selisih kas fisik maksimum yang ditoleransi adalah Rp 0. Jika terdapat selisih lebih dari Rp 2.000, kasir dan supervisor wajib melakukan audit struk per pesanan.
        </div>
    </div>
</div>

<!-- BAB 7 -->
<div class="page-break">
    <div class="chapter-num">Bab 07 • Kamus Istilah</div>
    <h1>Tata Kelola Toko &amp; Kamus Istilah Praktis</h1>

    <h2>7.1 Pengelolaan Ketersediaan Menu Kilat (/admin)</h2>
    <p>
        Ketersediaan bahan baku herbal sangat dipengaruhi oleh musim panen perkebunan mitra di Wonosobo, Garut, dan Puncak. Apabila salah satu komponen botani habis mendadak di gerai, supervisor gerai berhak menonaktifkan racikan terkait melalui portal admin:
    </p>
    <ol>
        <li>Buka peramban aman gerai dan masuk ke alamat <code>/admin/inventory</code>.</li>
        <li>Cari nama racikan yang bahan bakunya habis.</li>
        <li>Geser sakelar toggle ketersediaan dari <strong>'Available'</strong> menjadi <strong>'Out of Stock'</strong>.</li>
        <li>Secara instan dalam waktu 1 detik, menu tersebut tidak akan bisa dipesan oleh tamu di meja, mencegah kekecewaan pelanggan.</li>
    </ol>

    <h2>7.2 Kamus Istilah Praktis untuk Orang Awam</h2>
    <p>
        Tabel berikut merangkum istilah teknis sistem informasi dan istilah botani yang digunakan di CHANGKEER ATELIER guna mempermudah pemahaman bagi staf baru maupun penguji bisnis:
    </p>
    <table class="editorial-table">
        <thead>
            <tr>
                <th style="width: 25%;">Istilah Teknis / Herbal</th>
                <th style="width: 35%;">Penjelasan Lugas untuk Orang Awam</th>
                <th>Contoh Kasus Nyata di Gerai CHANGKEER</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>QRIS Dinamis</strong></td>
                <td>Barcode pembayaran perbankan pintar yang langsung terisi nominal belanja pas tanpa perlu diketik manual.</td>
                <td>Tamu memindai barcode di meja dan layar HP langsung menampilkan angka pas Rp 32.500 tanpa risiko salah ketik.</td>
            </tr>
            <tr>
                <td><strong>KDS (Kitchen Display System)</strong></td>
                <td>Monitor antrean digital di meja bar pengganti secarik kertas bon pesanan yang rentan hilang atau basah.</td>
                <td>Layar sentuh di atas meja seduh yang memandu barista bahwa Meja 4 memesan Jasmine Tea manis 50%.</td>
            </tr>
            <tr>
                <td><strong>Idempotensi (Idempotency)</strong></td>
                <td>Mekanisme proteksi gerbang pembayaran yang menjamin saldo rekening tidak akan terpotong ganda saat tombol bayar tertekan berulang.</td>
                <td>Tamu menekan tombol konfirmasi bayar 3 kali saat internet lambat; sistem memastikan saldo bank hanya terdebet 1 kali.</td>
            </tr>
            <tr>
                <td><strong>Anti-Tampering Sisi Server</strong></td>
                <td>Sistem pertahanan keamanan yang mencegah pengguna nakal memodifikasi harga menu lewat celah kode di peramban ponselnya.</td>
                <td>Jika seseorang mencoba mengubah harga teh dari Rp 26.000 menjadi Rp 1.000, pesanan otomatis digugurkan oleh server.</td>
            </tr>
            <tr>
                <td><strong>Tisane Botani</strong></td>
                <td>Minuman seduhan murni dari dedaunan herbal, bunga asli, dan rempah alami tanpa menggunakan daun teh hitam sintetik.</td>
                <td>Seduhan bunga rosella merah menyegarkan atau chamomile madu yang bebas dari efek kafein penegang jantung.</td>
            </tr>
            <tr>
                <td><strong>Solar Terms (24 Jieqi)</strong></td>
                <td>Pembagian siklus musim alam menjadi 24 titik astronomis untuk menyesuaikan racikan teh dengan metabolisme tubuh.</td>
                <td>Menyajikan seduhan mint dingin menyegarkan di puncak panas terik musim panas (Summer Solstice / 夏至).</td>
            </tr>
        </tbody>
    </table>

    <div style="margin-top: 24pt; border-top: 1px solid #D1D5DB; padding-top: 10pt; text-align: center; font-size: 8.5pt; color: #4B5563;">
        <strong>DOKUMEN OPERASIONAL RESMI — CHANGKEER ATELIER</strong><br>
        Diterbitkan oleh Dewan Pendiri: Almaidah Chaerudin Putri, Annisha Humaira, Johana Abigael Rumbiak, Keyla Putri Adisty, Nursoleha Romadhoni.<br>
        Hak Cipta Dilindungi Undang-Undang. Hak Paten Merek &amp; Formula Resmi 2026.
    </div>
</div>

</body>
</html>
"""
    # Strict validation: strip asterisks if any remain
    clean_html = html.replace("*", "")
    return clean_html

if __name__ == "__main__":
    import sys
    sys.path.insert(0, "/home/ilhammu29/changkeer/scripts")
    from assets_loader import get_all_assets
    assets = get_all_assets()
    out = generate_manual_book_id(assets)
    print(f"Indonesian Manual Book generated. Total chars: {len(out)}")
