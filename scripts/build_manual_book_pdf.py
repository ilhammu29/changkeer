import os
import weasyprint

def generate_manual_book_html():
    html_content = """<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>CHANGKEER — Buku Panduan Operasional & Manual Sistem</title>
<style>
  @page {
    size: A4 portrait;
    margin: 24mm 18mm 24mm 18mm;
    @top-left {
      content: "CHANGKEER ATELIER";
      font-family: 'Georgia', serif;
      font-size: 8pt;
      font-weight: bold;
      letter-spacing: 0.15em;
      color: #71717A;
      border-bottom: 0.5pt solid #E4E4E7;
      padding-bottom: 4mm;
    }
    @top-right {
      content: "BUKU PANDUAN OPERASIONAL & MANUAL SISTEM";
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 7.5pt;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #A1A1AA;
      border-bottom: 0.5pt solid #E4E4E7;
      padding-bottom: 4mm;
    }
    @bottom-left {
      content: "DOKUMEN RAHASIA INTERNAL • STANDAR OPERASIONAL PROSEDUR";
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 7pt;
      font-weight: 600;
      letter-spacing: 0.05em;
      color: #A1A1AA;
      border-top: 0.5pt solid #E4E4E7;
      padding-top: 4mm;
    }
    @bottom-right {
      content: "Halaman " counter(page) " dari " counter(pages);
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 7.5pt;
      font-weight: bold;
      color: #52525B;
      border-top: 0.5pt solid #E4E4E7;
      padding-top: 4mm;
    }
  }

  @page:first {
    margin: 0;
    @top-left { content: none; }
    @top-right { content: none; }
    @bottom-left { content: none; }
    @bottom-right { content: none; }
  }

  body {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    font-size: 9.5pt;
    line-height: 1.55;
    color: #18181B;
    background-color: #FFFFFF;
    margin: 0;
    padding: 0;
  }

  /* Cover Page Styling */
  .cover-page {
    page-break-after: always;
    width: 210mm;
    height: 297mm;
    box-sizing: border-box;
    padding: 30mm 24mm 24mm 24mm;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: linear-gradient(175deg, #18181B 0%, #1F1F23 60%, #111113 100%);
    color: #FFFFFF;
    position: relative;
    overflow: hidden;
  }

  .cover-page::before {
    content: "";
    position: absolute;
    top: -60mm;
    right: -60mm;
    width: 140mm;
    height: 140mm;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(180, 83, 9, 0.25) 0%, rgba(0,0,0,0) 70%);
  }

  .cover-header {
    position: relative;
    z-index: 2;
  }

  .cover-badge {
    display: inline-block;
    padding: 4px 12px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 999px;
    font-size: 8pt;
    font-family: system-ui, sans-serif;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #FBBF24;
    background-color: rgba(255, 255, 255, 0.05);
    margin-bottom: 20mm;
  }

  .cover-title {
    font-family: 'Georgia', serif;
    font-size: 32pt;
    font-weight: normal;
    letter-spacing: -0.02em;
    line-height: 1.15;
    margin: 0 0 8mm 0;
    color: #FFFFFF;
  }

  .cover-title span {
    display: block;
    font-family: system-ui, sans-serif;
    font-size: 13pt;
    font-weight: 300;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #D4D4D8;
    margin-top: 4mm;
  }

  .cover-divider {
    width: 25mm;
    height: 2pt;
    background-color: #D97706;
    margin: 8mm 0 10mm 0;
  }

  .cover-desc {
    font-size: 10.5pt;
    font-weight: 300;
    line-height: 1.6;
    color: #A1A1AA;
    max-width: 140mm;
    margin-bottom: 15mm;
  }

  .cover-footer {
    position: relative;
    z-index: 2;
    border-top: 1px solid rgba(255, 255, 255, 0.15);
    padding-top: 8mm;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }

  .meta-col {
    font-size: 8.5pt;
    color: #D4D4D8;
  }

  .meta-col strong {
    color: #FFFFFF;
    font-weight: 600;
  }

  .meta-label {
    font-size: 7.5pt;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #71717A;
    display: block;
    margin-bottom: 1.5mm;
  }

  /* Document Control Page */
  .doc-control {
    page-break-after: always;
    padding-top: 5mm;
  }

  h1, h2, h3, h4 {
    color: #18181B;
    margin-top: 0;
  }

  h1 {
    font-family: 'Georgia', serif;
    font-size: 18pt;
    font-weight: normal;
    letter-spacing: -0.01em;
    border-bottom: 1.5pt solid #18181B;
    padding-bottom: 3mm;
    margin-bottom: 6mm;
  }

  .chapter-header {
    page-break-before: always;
    padding-top: 4mm;
  }

  .chapter-number {
    font-size: 8pt;
    font-family: system-ui, sans-serif;
    font-weight: bold;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #B45309;
    display: block;
    margin-bottom: 2mm;
  }

  h2 {
    font-size: 13pt;
    font-weight: 700;
    letter-spacing: -0.01em;
    margin-top: 8mm;
    margin-bottom: 3.5mm;
    color: #18181B;
    display: flex;
    align-items: center;
  }

  h2::before {
    content: "";
    display: inline-block;
    width: 3.5mm;
    height: 3.5mm;
    background-color: #B45309;
    margin-right: 2.5mm;
    border-radius: 1px;
  }

  h3 {
    font-size: 10.5pt;
    font-weight: 600;
    margin-top: 5mm;
    margin-bottom: 2.5mm;
    color: #27272A;
  }

  p {
    margin: 0 0 3.5mm 0;
    text-align: justify;
    text-justify: inter-word;
  }

  ul, ol {
    margin: 0 0 4mm 0;
    padding-left: 5mm;
  }

  li {
    margin-bottom: 1.5mm;
  }

  /* Table of Contents */
  .toc-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 4mm;
  }

  .toc-row {
    display: flex;
    align-items: baseline;
    margin-bottom: 2.5mm;
    font-size: 9.5pt;
  }

  .toc-title {
    font-weight: 600;
    color: #18181B;
    flex-shrink: 0;
  }

  .toc-dots {
    flex-grow: 1;
    border-bottom: 1pt dotted #D4D4D8;
    margin: 0 3mm;
  }

  .toc-page {
    font-family: monospace;
    font-weight: bold;
    color: #71717A;
  }

  /* Clean Tables */
  table.data-table {
    width: 100%;
    border-collapse: collapse;
    margin: 4mm 0 6mm 0;
    font-size: 8.5pt;
    page-break-inside: avoid;
  }

  table.data-table th, table.data-table td {
    padding: 2.5mm 3mm;
    border: 0.5pt solid #E4E4E7;
    text-align: left;
    vertical-align: top;
  }

  table.data-table th {
    background-color: #F4F4F5;
    font-weight: bold;
    text-transform: uppercase;
    font-size: 7.5pt;
    letter-spacing: 0.05em;
    color: #27272A;
    border-bottom: 1.5pt solid #D4D4D8;
  }

  table.data-table tr:nth-child(even) {
    background-color: #FAFAFA;
  }

  /* Callout Boxes */
  .callout {
    border-radius: 3mm;
    padding: 3.5mm 4mm;
    margin: 4mm 0 5mm 0;
    font-size: 8.5pt;
    line-height: 1.45;
    page-break-inside: avoid;
  }

  .callout-title {
    font-weight: bold;
    font-size: 8.5pt;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    margin-bottom: 1.5mm;
  }

  .callout-info {
    background-color: #EFF6FF;
    border: 0.8pt solid #BFDBFE;
    color: #1E3A8A;
  }

  .callout-info .callout-title {
    color: #1D4ED8;
  }

  .callout-warning {
    background-color: #FFFBEB;
    border: 0.8pt solid #FDE68A;
    color: #78350F;
  }

  .callout-warning .callout-title {
    color: #B45309;
  }

  .callout-success {
    background-color: #F0FDF4;
    border: 0.8pt solid #BBF7D0;
    color: #064E3B;
  }

  .callout-success .callout-title {
    color: #047857;
  }

  /* Workflow Steps */
  .step-box {
    background-color: #FDFDFD;
    border: 0.6pt solid #E4E4E7;
    border-left: 2.5pt solid #18181B;
    border-radius: 2mm;
    padding: 3mm 4mm;
    margin-bottom: 3.5mm;
    page-break-inside: avoid;
  }

  .step-num {
    font-size: 8pt;
    font-weight: bold;
    color: #71717A;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    display: block;
    margin-bottom: 1mm;
  }

  .step-title {
    font-size: 9.5pt;
    font-weight: 700;
    color: #18181B;
    margin-bottom: 1mm;
  }

  code {
    font-family: monospace;
    font-size: 8pt;
    background-color: #F4F4F5;
    padding: 1px 4px;
    border-radius: 3px;
    border: 0.5pt solid #E4E4E7;
  }
</style>
</head>
<body>

<!-- ========================================================================= -->
<!-- COVER PAGE                                                                -->
<!-- ========================================================================= -->
<div class="cover-page">
  <div class="cover-header">
    <div class="cover-badge">Dokumen Resmi Operasional &bull; SOP</div>
    <div class="cover-title">
      CHANGKEER ATELIER
      <span>Buku Panduan Operasional &amp; Manual Sistem</span>
    </div>
    <div class="cover-divider"></div>
    <div class="cover-desc">
      Panduan Lengkap Standar Operasional Prosedur (SOP) Seduhan Teh Herbal 24 Musim, Alur Pemesanan Mandiri, Sistem Pembayaran QRIS Dinamis, Kitchen Display System (KDS), dan Tata Kelola Platform Kasir Digital.
    </div>
  </div>

  <div class="cover-footer">
    <div class="meta-col">
      <span class="meta-label">Nomor Registrasi Dokumen</span>
      <strong>CK-SOP-OPS-2026-V1.2</strong>
    </div>
    <div class="meta-col">
      <span class="meta-label">Klasifikasi Kerahasiaan</span>
      <strong>Internal Confidential</strong>
    </div>
    <div class="meta-col">
      <span class="meta-label">Terbitan &amp; Revisi</span>
      <strong>Oktober 2026 &bull; Rev 1.2</strong>
    </div>
    <div class="meta-col">
      <span class="meta-label">Otoritas Penyusun</span>
      <strong>Tim Pengembang &amp; Operasional</strong>
    </div>
  </div>
</div>

<!-- ========================================================================= -->
<!-- LEMBAR PENGESAHAN & DAFTAR ISI                                            -->
<!-- ========================================================================= -->
<div class="doc-control">
  <h1>Lembar Kendali Dokumen</h1>
  <p>
    Buku Panduan Operasional ini mengikat seluruh jajaran kru peracik teh (*barista*), staf kasir (*counter cashier*), supervisor gerai, dan administrator sistem CHANGKEER. Setiap prosedur yang tercantum di dalamnya merupakan standar baku pelayanan dan manajemen kualitas gerai.
  </p>

  <table class="data-table" style="margin-top: 4mm; margin-bottom: 8mm;">
    <thead>
      <tr>
        <th style="width: 25%;">Peran</th>
        <th style="width: 35%;">Penanggung Jawab</th>
        <th style="width: 20%;">Tanggal Pengesahan</th>
        <th style="width: 20%;">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Master Blender / R&amp;D</strong></td>
        <td>Tim Riset Botani CHANGKEER</td>
        <td>24 Oktober 2026</td>
        <td><span style="color: #047857; font-weight: bold;">Disetujui</span></td>
      </tr>
      <tr>
        <td><strong>Kepala Operasional Gerai</strong></td>
        <td>Supervisor Barista &amp; Floor</td>
        <td>25 Oktober 2026</td>
        <td><span style="color: #047857; font-weight: bold;">Disetujui</span></td>
      </tr>
      <tr>
        <td><strong>Arsitek Sistem &amp; Digital</strong></td>
        <td>Lead Software Engineer</td>
        <td>26 Oktober 2026</td>
        <td><span style="color: #047857; font-weight: bold;">Berlaku Efektif</span></td>
      </tr>
    </tbody>
  </table>

  <h1>Daftar Isi Manual</h1>
  <div style="margin-top: 4mm;">
    <div class="toc-row">
      <span class="toc-title">BAB 1: Profil Brand &amp; Filosofi Seduhan 24 Musim</span>
      <span class="toc-dots"></span>
      <span class="toc-page">Hal 3</span>
    </div>
    <div class="toc-row">
      <span class="toc-title">BAB 2: Arsitektur Ekosistem &amp; Tumpukan Teknologi</span>
      <span class="toc-dots"></span>
      <span class="toc-page">Hal 5</span>
    </div>
    <div class="toc-row">
      <span class="toc-title">BAB 3: Panduan Operasional Pemesanan Pelanggan (Self-Ordering)</span>
      <span class="toc-dots"></span>
      <span class="toc-page">Hal 7</span>
    </div>
    <div class="toc-row">
      <span class="toc-title">BAB 4: Panduan Sistem Pembayaran &amp; QRIS Dinamis</span>
      <span class="toc-dots"></span>
      <span class="toc-page">Hal 9</span>
    </div>
    <div class="toc-row">
      <span class="toc-title">BAB 5: SOP Barista &amp; Kru Dapur (Kitchen Display System)</span>
      <span class="toc-dots"></span>
      <span class="toc-page">Hal 11</span>
    </div>
    <div class="toc-row">
      <span class="toc-title">BAB 6: SOP Kasir, Rekonsiliasi Keuangan, &amp; Void / Refund</span>
      <span class="toc-dots"></span>
      <span class="toc-page">Hal 13</span>
    </div>
    <div class="toc-row">
      <span class="toc-title">BAB 7: Panduan Administrator CMS &amp; Pengelolaan Menu</span>
      <span class="toc-dots"></span>
      <span class="toc-page">Hal 15</span>
    </div>
    <div class="toc-row">
      <span class="toc-title">BAB 8: Penanganan Kendala (Troubleshooting &amp; FAQ)</span>
      <span class="toc-dots"></span>
      <span class="toc-page">Hal 16</span>
    </div>
  </div>
</div>

<!-- ========================================================================= -->
<!-- BAB 1                                                                     -->
<!-- ========================================================================= -->
<div class="chapter-header">
  <span class="chapter-number">Bab 1</span>
  <h1>Profil Brand &amp; Filosofi Seduhan 24 Musim</h1>

  <p>
    CHANGKEER berakar dari dedikasi terhadap kekayaan botani Nusantara yang diselaraskan dengan kalender tradisional 24 Musim Alam (*Solar Terms*). Kami meyakini bahwa tubuh manusia memiliki ritme alami yang membutuhkan nutrisi herbal berbeda di setiap perubahan iklim dan cuaca.
  </p>

  <h2>1.1 Prinsip Dasar Ekstraksi Suhu &amp; Waktu</h2>
  <p>
    Kualitas secangkir teh herbal tidak hanya ditentukan oleh kualitas daunnya, melainkan juga presisi perlakuan suhu air dan durasi ekstraksinya (*steeping duration*). Air yang terlalu panas dapat merusak minyak atsiri pada bunga yang lembut, sedangkan air yang kurang panas tidak mampu mengekstraksi manfaat rimpang dan kulit kayu.
  </p>

  <div class="callout callout-info">
    <div class="callout-title">Standar Parameter Seduh CHANGKEER</div>
    <strong>Kategori Bunga Halus (Melati, Krisan, Mawar, Osmanthus):</strong> 80°C – 85°C selama 3 menit.<br>
    <strong>Kategori Daun &amp; Rempah Seimbang:</strong> 90°C selama 3 – 4 menit.<br>
    <strong>Kategori Rimpang &amp; Kayu Manis (Jahe Merah, Kapulaga, Secang):</strong> 95°C selama 4 – 5 menit.
  </div>

  <h2>1.2 Matriks 24 Racikan Teh Musiman</h2>
  <p>
    Berikut adalah referensi resmi 24 varian teh musiman yang menjadi standar menu pada sistem CHANGKEER:
  </p>

  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 20%;">Musim</th>
        <th style="width: 25%;">Nama Racikan</th>
        <th style="width: 35%;">Komposisi Botani Utama</th>
        <th style="width: 20%;">Karakter Rasa</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td rowspan="6"><strong>MUSIM SEMI<br>(Spring)</strong><br><small style="color: #71717A;">Detoksifikasi &amp; Pembaruan</small></td>
        <td>Start of Spring</td>
        <td>Teh Hijau Pucuk, Bunga Melati, Daun Mint</td>
        <td>Floral, rumput segar, sejuk</td>
      </tr>
      <tr>
        <td>Rain Water</td>
        <td>Bunga Telang, Serai Wangi, Pandan</td>
        <td>Earthy lembut, aroma pandan manis</td>
      </tr>
      <tr>
        <td>Insects Awaken</td>
        <td>Daun Murbei, Jahe Muda, Lemon Kering</td>
        <td>Zesty, pedas hangat ringan</td>
      </tr>
      <tr>
        <td>Spring Equinox</td>
        <td>Teh Putih, Bunga Krisan Kuning, Goji Berry</td>
        <td>Manis alami lembut, jernih</td>
      </tr>
      <tr>
        <td>Pure Brightness</td>
        <td>Peppermint, Bunga Chamomile, Adas Manis</td>
        <td>Menenangkan, herba segar</td>
      </tr>
      <tr>
        <td>Grain Rain</td>
        <td>Beras Merah Sangrai, Daun Salam, Mawar</td>
        <td>Toasted, floral nutty, gurih</td>
      </tr>

      <tr>
        <td rowspan="6"><strong>MUSIM PANAS<br>(Summer)</strong><br><small style="color: #71717A;">Pendingin Tubuh &amp; Hidrasi</small></td>
        <td>Start of Summer</td>
        <td>Bunga Rosella Ungu, Jeruk Nipis Kering, Stevia</td>
        <td>Asam segar buah, ruby merah</td>
      </tr>
      <tr>
        <td>Small Full</td>
        <td>Biji Teratai, Akar Alang-alang, Krisan Putih</td>
        <td>Pereda panas dalam, madu ringan</td>
      </tr>
      <tr>
        <td>Grain in Ear</td>
        <td>Kumis Kucing, Daun Pandan, Bunga Osmanthus</td>
        <td>Aroma aprikot lembut, diuretik alami</td>
      </tr>
      <tr>
        <td>Summer Solstice</td>
        <td>Daun Mint Peppermint, Timun Kering, Serai</td>
        <td>Sangat menyegarkan, pendingin instan</td>
      </tr>
      <tr>
        <td>Minor Heat</td>
        <td>Teh Oolong Ringan, Kulit Jeruk Purut, Madu</td>
        <td>Citrus seimbang, pekat aromatik</td>
      </tr>
      <tr>
        <td>Major Heat</td>
        <td>Bunga Telang, Rosella, Ekstrak Daun Stevia</td>
        <td>Ungu pekat, asam manis pelepas dahaga</td>
      </tr>

      <tr>
        <td rowspan="6"><strong>MUSIM GUGUR<br>(Autumn)</strong><br><small style="color: #71717A;">Penenang &amp; Pernapasan</small></td>
        <td>Start of Autumn</td>
        <td>Bunga Osmanthus Emas, Teh Hitam Jawa, Pir Kering</td>
        <td>Aroma madu buah pir, hangat menenangkan</td>
      </tr>
      <tr>
        <td>End of Heat</td>
        <td>Akar Manis (Licorice), Daun Mint, Jahe Putih</td>
        <td>Manis alami di tenggorokan, melegakan</td>
      </tr>
      <tr>
        <td>White Dew</td>
        <td>Teh Hijau Sangrai, Bunga Melati Hutan</td>
        <td>Harum tahan lama, membersihkan pikiran</td>
      </tr>
      <tr>
        <td>Autumn Equinox</td>
        <td>Kayu Manis Jawa, Cengkih, Daun Salam Manis</td>
        <td>Spicy manis berkarakter klasik</td>
      </tr>
      <tr>
        <td>Cold Dew</td>
        <td>Bunga Krisan Liar, Kulit Jeruk Manis, Kapulaga</td>
        <td>Hangat herbal, menepis hawa lembap</td>
      </tr>
      <tr>
        <td>Frost Descent</td>
        <td>Jahe Merah Panggang, Batang Serai, Gula Aren</td>
        <td>Hangat mendalam, relaksasi otot</td>
      </tr>

      <tr>
        <td rowspan="6"><strong>MUSIM DINGIN<br>(Winter)</strong><br><small style="color: #71717A;">Peningkat Imun &amp; Daya Tubuh</small></td>
        <td>Start of Winter</td>
        <td>Kayu Secang, Jahe Merah, Kapulaga Jawa</td>
        <td>Merah menyala, aromatik rempah keraton</td>
      </tr>
      <tr>
        <td>Light Snow</td>
        <td>Temulawak Iris, Kunyit, Madu Hutan Murni</td>
        <td>Pembersih pencernaan, tonik tubuh</td>
      </tr>
      <tr>
        <td>Heavy Snow</td>
        <td>Lada Hitam Lampung, Cengkih, Jahe Emprit</td>
        <td>Pedas rempah kuat, menghangatkan dada</td>
      </tr>
      <tr>
        <td>Winter Solstice</td>
        <td>Biji Adas, Kayu Manis, Pekak (Kembang Lawang)</td>
        <td>Aroma manis rempah pekat eksotis</td>
      </tr>
      <tr>
        <td>Moderate Cold</td>
        <td>Kencur Panggang, Daun Mint, Gula Kelapa</td>
        <td>Melegakan batuk dan kelelahan vokal</td>
      </tr>
      <tr>
        <td>Severe Cold</td>
        <td>Kombinasi 7 Rempah Mahakarya CHANGKEER</td>
        <td>Kompleks, pemulihan energi penuh</td>
      </tr>
    </tbody>
  </table>
</div>

<!-- ========================================================================= -->
<!-- BAB 2                                                                     -->
<!-- ========================================================================= -->
<div class="chapter-header">
  <span class="chapter-number">Bab 2</span>
  <h1>Arsitektur Ekosistem &amp; Tumpukan Teknologi</h1>

  <p>
    CHANGKEER dibangun dengan filosofi rekayasa perangkat lunak modern: *type-safe*, *modular*, dan *resilient-by-design*. Sistem tidak boleh macet hanya karena gangguan koneksi jaringan sementara atau keterlambatan migrasi database.
  </p>

  <h2>2.1 Diagram Alur Ekosistem</h2>
  <div style="background-color: #FAFAFA; border: 0.8pt solid #E4E4E7; border-radius: 3mm; padding: 4mm; margin-bottom: 5mm; font-family: monospace; font-size: 8pt; line-height: 1.4;">
    [PELANGGAN (Mobile Web)] &mdash;&gt; [Next.js App Router (Vercel Edge)]<br>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│<br>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▼<br>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[Server-Side Price Validation Engine]<br>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│<br>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▼<br>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;┌───────────────────────────┴───────────────────────────┐<br>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▼                                                       ▼<br>
    [Supabase Native SQL (Tingkat 1)]            [Site Settings Fallback (Tingkat 2)]<br>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│                                                       │<br>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└───────────────────────────┬───────────────────────────┘<br>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│<br>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;▼<br>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[BARISTA KDS &amp; PRINTER THERMAL]
  </div>

  <h2>2.2 Tumpukan Teknologi Teruji</h2>
  <ul>
    <li><strong>Next.js 16 (Turbopack) &amp; React 19:</strong> Menggunakan arsitektur App Router dengan Server Components untuk efisiensi transfer data nirkabel dan waktu muat halaman sub-detik pada koneksi seluler.</li>
    <li><strong>TypeScript 5 (Strict Mode):</strong> Menjamin integritas tipe data pemesanan, kustomisasi rasa, dan kalkulasi keuangan dari antarmuka pengguna hingga lapisan database.</li>
    <li><strong>Tailwind CSS v4:</strong> Tokenisasi desain terpusat pada file <code>globals.css</code>, menghasilkan antarmuka ringan tanpa ketergantungan JavaScript berat.</li>
    <li><strong>Supabase PostgreSQL 15 &amp; RLS:</strong> Menampung seluruh data transaksi dengan proteksi Row-Level Security (RLS) berprinsip *least privilege*.</li>
    <li><strong>Engine QRIS EMVCo MPM:</strong> Modul konversi string barcode murni dengan algoritma Cyclic Redundancy Check (CRC16-CCITT polinomial <code>0x1021</code>).</li>
    <li><strong>Sistem Ikon Vektor Bespoke:</strong> Modul ikon SVG mandiri pada <code>components/icons/</code> berstandar grid 24×24px seragam.</li>
  </ul>

  <h2>2.3 Dual-Tier Resilient Persistence (Ketahanan Serverless)</h2>
  <p>
    Pada platform cloud modern seperti Vercel, serverless function berjalan di lingkungan *stateless* tanpa memori bersama. CHANGKEER menerapkan sistem penyimpanan data bertingkat:
  </p>
  <div class="step-box">
    <span class="step-num">Tingkat 1 &bull; Database Utama PostgreSQL</span>
    <div class="step-title">Penyimpanan Terstruktur Native</div>
    Sistem memprioritaskan penyimpanan langsung ke tabel relasional <code>orders</code> dan <code>order_items</code> jika skema SQL telah aktif di Supabase.
  </div>
  <div class="step-box">
    <span class="step-num">Tingkat 2 &bull; Fallback Cross-Lambda Store</span>
    <div class="step-title">Penyimpanan JSON Terenkripsi pada Site Settings</div>
    Jika tabel native belum terbuat, sistem otomatis mencadangkan seluruh data pesanan ke record <code>active_orders_store</code> di tabel <code>site_settings</code>. Seluruh instance serverless dapat membaca dan memutasi status pembayaran secara tersinkronisasi tanpa error 404.
  </div>
  <div class="step-box">
    <span class="step-num">Tingkat 3 &bull; Instant Client Hydration</span>
    <div class="step-title">Cache Lokal Peramban Pelanggan</div>
    Data pesanan yang baru dibuat langsung dicatat ke <code>sessionStorage</code> dan <code>localStorage</code> peramban pelanggan. Tanda terima digital terbuka seketika tanpa kedipan layar (*zero latency*).
  </div>
</div>

<!-- ========================================================================= -->
<!-- BAB 3                                                                     -->
<!-- ========================================================================= -->
<div class="chapter-header">
  <span class="chapter-number">Bab 3</span>
  <h1>Panduan Pemesanan Pelanggan (Self-Ordering)</h1>

  <p>
    Alur pemesanan dirancang agar pelanggan dapat memesan tanpa merasa terintimidasi oleh kompleksitas racikan herbal. Seluruh kalkulasi harga bersifat transparan dan diperbarui otomatis di layar.
  </p>

  <h2>3.1 Aturan Kustomisasi Seduhan &amp; Struktur Biaya</h2>
  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 25%;">Komponen Seduh</th>
        <th style="width: 35%;">Pilihan yang Tersedia</th>
        <th style="width: 20%;">Penyesuaian Biaya</th>
        <th style="width: 20%;">Catatan Barista</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Porsi Saji</strong></td>
        <td>Single Cup (250ml)<br>Artisan Pot (600ml Teko)</td>
        <td>Rp 0<br>+Rp 12.000</td>
        <td>Teko dilengkapi saringan keramik dan cangkir ganda</td>
      </tr>
      <tr>
        <td><strong>Temperatur</strong></td>
        <td>Hot Steeping (Seduhan Panas)<br>Iced Cold Brew (Seduhan Dingin)</td>
        <td>Rp 0<br>+Rp 2.000</td>
        <td>Seduhan dingin menggunakan es batu kristal higienis</td>
      </tr>
      <tr>
        <td><strong>Tingkat Kemanisan</strong></td>
        <td>0% (Unsweetened)<br>30% (Light Sweetness)<br>50% (Bold Tea &amp; Moderate)<br>75% (Harmonious Balance)<br>100% (Classic Sweetness)</td>
        <td>Rp 0<br>Rp 0<br>Rp 0<br>Rp 0<br>Rp 0</td>
        <td>0% dianjurkan untuk penikmat karakter murni bunga</td>
      </tr>
      <tr>
        <td><strong>Pilihan Pemanis</strong></td>
        <td>Organic Sorghum Nectar<br>Natural Stevia Leaf<br>Pure Wild Forest Honey</td>
        <td>Rp 0<br>Rp 0<br>+Rp 3.000</td>
        <td>Sorgum memiliki indeks glikemik rendah dan aroma karamel</td>
      </tr>
      <tr>
        <td><strong>Topping Botani</strong></td>
        <td>Dried Rose Buds<br>Golden Chrysanthemum<br>Butterfly Pea Flower<br>Whole Jasmine Bloom<br>Golden Osmanthus</td>
        <td>+Rp 3.000<br>+Rp 3.000<br>+Rp 3.000<br>+Rp 4.000<br>+Rp 4.000</td>
        <td>Ditaburkan di atas seduhan tepat sebelum disajikan</td>
      </tr>
    </tbody>
  </table>

  <h2>3.2 Mode Saji &amp; Validasi Data</h2>
  <div class="step-box">
    <span class="step-num">Mode 1 &bull; Dine-in (Duduk di Meja Bar)</span>
    <div class="step-title">Wajib Mencantumkan Nomor Meja</div>
    Pelanggan memasukkan nomor meja (misal: "Meja 04" atau "Bar Seat 2"). Barista akan mengantarkan pesanan langsung ke meja yang tertera pada tiket.
  </div>
  <div class="step-box">
    <span class="step-num">Mode 2 &bull; Takeaway (Bungkus Bawa Pulang)</span>
    <div class="step-title">Pilihan Estimasi Waktu Pengambilan</div>
    Pilihan waktu: ASAP (Segera ~10-15 menit), 20 menit, 30 menit, atau 45 menit. Cangkir akan dikemas dengan tutup anti-tumpah dan label nama.
  </div>
  <div class="step-box">
    <span class="step-num">Mode 3 &bull; Delivery (Kurir Pengantaran)</span>
    <div class="step-title">Biaya Kurir Flat &amp; Alamat Lengkap</div>
    Sistem menerapkan biaya antar flat Rp 10.000. Pelanggan wajib mengisi alamat lengkap dan catatan patokan kurir.
  </div>
</div>

<!-- ========================================================================= -->
<!-- BAB 4                                                                     -->
<!-- ========================================================================= -->
<div class="chapter-header">
  <span class="chapter-number">Bab 4</span>
  <h1>Panduan Sistem Pembayaran &amp; QRIS Dinamis</h1>

  <p>
    CHANGKEER mengadopsi standar Quick Response Code Indonesian Standard (QRIS) Nasional untuk mewujudkan transaksi nirkontak yang cepat dan aman.
  </p>

  <h2>4.1 Mekanisme QRIS Dinamis (Auto-Nominal Lock)</h2>
  <p>
    Secara tradisional, barcode QRIS statis mewajibkan pembeli mengetik nominal belanja sendiri di aplikasi bank. Hal ini kerap memicu salah ketik nominal, antrean panjang di bar, dan kebingungan barista.
  </p>
  <p>
    Sistem CHANGKEER memodifikasi string payload dasar merchant (NMID: <code>ID1026598652240</code>) secara matematis pada saat pesanan dibuat:
  </p>
  <ol>
    <li>Mengubah kode inisiasi Tag <code>01</code> dari <code>11</code> (statis) menjadi <code>12</code> (dinamis).</li>
    <li>Menyisipkan Tag <code>54</code> berformat <code>54[panjang][nominal]</code> (contoh Rp 58.000 menjadi <code>540558000</code>) sebelum kode negara Tag <code>5802ID</code>.</li>
    <li>Menghitung ulang nilai checksum Tag <code>6304</code> di bagian akhir string menggunakan algoritma CRC16-CCITT standar Bank Indonesia.</li>
  </ol>

  <h2>4.2 Fitur Dual-Mode (Mitigasi Kompatibilitas Bank)</h2>
  <div class="callout callout-warning">
    <div class="callout-title">PENTING: Kompatibilitas Aplikasi Mobile Banking</div>
    Sebagian kecil aplikasi mobile banking lama (seperti BCA Mobile versi terdahulu) membatasi scan QR dinamis hasil modifikasi pihak ketiga dan memunculkan notifikasi *"QR Code Tidak Valid"*.
  </div>
  <p>
    Untuk mencegah pelanggan terhambat bayar, kartu pembayaran CHANGKEER menyediakan **Dual-Mode Switcher**:
  </p>
  <ul>
    <li><strong>Tab 1 &bull; Auto Amount (QRIS Dinamis):</strong> Nominal otomatis terkunci. Ideal untuk GoPay, OVO, Dana, ShopeePay, Mandiri Livin', BRImo, dan BNI.</li>
    <li><strong>Tab 2 &bull; Merchant Code (QRIS Asli Merchant):</strong> Menampilkan barcode asli merchant yang 100% diterima oleh seluruh aplikasi perbankan di Indonesia. Disediakan tombol 1-klik <strong>Copy Amount</strong> agar pelanggan tinggal menempel nominal tanpa mengetik manual.</li>
  </ul>

  <h2>4.3 Alur Konfirmasi Pembayaran</h2>
  <div class="step-box">
    <span class="step-num">Langkah Transaksi</span>
    <div class="step-title">Instruksi Pembayaran Pelanggan</div>
    1. Buka aplikasi m-Banking atau e-Wallet di ponsel.<br>
    2. Arahkan kamera pemindai ke kode QRIS di layar.<br>
    3. Periksa nama merchant (<strong>OXID PROJECT / CHANGKEER</strong>) dan nominal pembayaran.<br>
    4. Masukkan PIN transaksi di aplikasi bank hingga saldo terpotong.<br>
    5. Kembali ke layar web CHANGKEER dan ketuk tombol <strong>"I Have Paid &bull; Confirm Payment"</strong>. Layar akan otomatis berubah hijau bertuliskan *Payment Confirmed* dan tiket seduhan langsung masuk ke antrean barista.
  </div>
</div>

<!-- ========================================================================= -->
<!-- BAB 5                                                                     -->
<!-- ========================================================================= -->
<div class="chapter-header">
  <span class="chapter-number">Bab 5</span>
  <h1>SOP Barista &amp; Kru Dapur (Kitchen Display System)</h1>

  <p>
    Barista CHANGKEER bertanggung jawab penuh atas konsistensi rasa, estetika penyajian, dan ketepatan waktu penyajian setiap cangkir teh.
  </p>

  <h2>5.1 Alur Kerja Barista di Layar KDS</h2>
  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 20%;">Status KDS</th>
        <th style="width: 30%;">Tindakan Wajib Barista</th>
        <th style="width: 25%;">Perubahan di Layar</th>
        <th style="width: 25%;">Target Durasi</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Received</strong><br>(Tiket Baru)</td>
        <td>Cek kelunasan pembayaran. Jika QRIS <code>paid</code>, segera siapkan daun teh dan panaskan teko seduh.</td>
        <td>Layar KDS berkedip kuning, nomor tiket muncul paling atas.</td>
        <td>Maksimal 1 menit sejak pesanan masuk</td>
      </tr>
      <tr>
        <td><strong>Brewing</strong><br>(Dalam Seduhan)</td>
        <td>Tekan tombol "Start Brewing". Timbang daun (5g per 250ml), atur timer seduh digital sesuai menu.</td>
        <td>Kartu pesanan berubah biru, status pelanggan menunjukkan "Sedang Diseduh".</td>
        <td>3 – 5 menit sesuai panduan menu</td>
      </tr>
      <tr>
        <td><strong>Ready to Serve</strong><br>(Siap Saji)</td>
        <td>Saring daun teh, tambahkan pemanis alami dan topping bunga. Tuang ke cangkir/teko keramik. Tekan "Ready".</td>
        <td>Kartu berubah hijau. Muncul suara notifikasi bar siap antar.</td>
        <td>Maksimal 1 menit setelah seduhan selesai</td>
      </tr>
      <tr>
        <td><strong>Completed</strong><br>(Selesai)</td>
        <td>Antarkan cangkir ke nomor meja pelanggan atau panggil nama untuk Takeaway. Tekan "Complete".</td>
        <td>Tiket diarsipkan ke rekap penjualan harian.</td>
        <td>Selesai</td>
      </tr>
    </tbody>
  </table>

  <div class="callout callout-success">
    <div class="callout-title">Standar Kualitas Penyajian Barista</div>
    1. Pastikan cangkir keramik telah dihangatkan (*pre-heated*) dengan air panas sebelum diisi seduhan teh.<br>
    2. Topping kelopak bunga (mawar, krisan, melati) wajib diletakkan mengapung di bagian atas seduhan secara simetris.<br>
    3. Untuk pesanan Takeaway, tempelkan label termal 58mm di bagian tengah badan cangkir dengan posisi tegak lurus.
  </div>
</div>

<!-- ========================================================================= -->
<!-- BAB 6                                                                     -->
<!-- ========================================================================= -->
<div class="chapter-header">
  <span class="chapter-number">Bab 6</span>
  <h1>SOP Kasir, Rekonsiliasi, &amp; Void / Refund</h1>

  <h2>6.1 Prosedur Pembayaran di Meja Kasir (Cashier Settlement)</h2>
  <p>
    Bagi pelanggan yang memilih metode <strong>Pay at Cashier Counter</strong> pada saat checkout:
  </p>
  <ol>
    <li>Pelanggan mendatangi meja kasir dan memperlihatkan nomor tiket di layar ponselnya (contoh: <code>#CK-261026-849</code>).</li>
    <li>Kasir mencari nomor tiket tersebut di halaman daftar pesanan (<code>/admin/orders</code>).</li>
    <li>Kasir menyebutkan rincian pesanan dan total nominal yang wajib dibayar.</li>
    <li>Kasir menerima uang tunai (dan memberikan uang kembalian) atau mengarahkan mesin gesek EDC debit.</li>
    <li>Setelah pembayaran lunas, kasir menekan tombol <strong>"Tandai Lunas / Mark Paid"</strong> di dashboard. Status pesanan seketika berubah menjadi <code>brewing</code> di layar KDS barista.</li>
  </ol>

  <h2>6.2 Pencetakan Struk Termal POS (80mm &amp; 58mm)</h2>
  <p>
    Sistem CHANGKEER dilengkapi generator cetak termal langsung:
  </p>
  <ul>
    <li><strong>Struk Transaksi 80mm:</strong> Dicetak untuk pelanggan yang membutuhkan bukti pembayaran fisik atau nota perusahaan.</li>
    <li><strong>Label Cangkir 58mm:</strong> Dicetak khusus untuk ditempel pada cangkir Takeaway atau kantong kurir pengantaran.</li>
  </ul>

  <h2>6.3 Rekonsiliasi Harian Kasir (End of Day Closing)</h2>
  <p>
    Setiap akhir shift operasional (pukul 22.00 WIB):
  </p>
  <ol>
    <li>Kasir mengunduh rekap transaksi harian melalui dashboard manajemen.</li>
    <li>Mencocokkan total penerimaan QRIS di sistem dengan riwayat mutasi masuk aplikasi DANA Bisnis merchant.</li>
    <li>Menghitung fisik uang tunai di laci kasir (*cash drawer*) dan mencocokkannya dengan total metode bayar *Cashier*.</li>
    <li>Menandatangani berita acara serah terima kas harian bersama supervisor gerai.</li>
  </ol>

  <div class="callout callout-warning">
    <div class="callout-title">Prosedur Pembatalan Pesanan (Void / Refund)</div>
    1. Pembatalan hanya diizinkan apabila status pesanan masih <code>received</code> (belum masuk proses seduh).<br>
    2. Apabila pembayaran sudah masuk via QRIS dan terjadi pembatalan bahan baku kosong, kasir wajib melakukan transfer pengembalian dana penuh (*refund 100%*) ke rekening pelanggan dalam kurun waktu maksimal 15 menit dan mencatat nomor mutasi pengembalian di dashboard admin.
  </div>
</div>

<!-- ========================================================================= -->
<!-- BAB 7                                                                     -->
<!-- ========================================================================= -->
<div class="chapter-header">
  <span class="chapter-number">Bab 7</span>
  <h1>Panduan Administrator CMS &amp; Pengelolaan Menu</h1>

  <p>
    Panel Administrator CHANGKEER terletak pada tautan privat <code>/admin</code> yang dilindungi autentikasi sesi berbasis cookie dan Supabase Auth.
  </p>

  <h2>7.1 Modul Manajemen Produk &amp; Penyesuaian Harga</h2>
  <ul>
    <li><strong>Memperbarui Status Stok Menu:</strong> Jika salah satu bahan botani habis (misal bunga krisan habis), administrator dapat mengubah status racikan terkait menjadi <code>draft</code> atau memperbarui catatan ketersediaan di katalog.</li>
    <li><strong>Penyesuaian Harga Dasar:</strong> Harga dasar yang diubah di CMS secara otomatis diterapkan ke seluruh alur checkout dan perhitungan keamanan backend anti-tampering.</li>
  </ul>

  <h2>7.2 Pengaturan Voucher &amp; Promo Diskon</h2>
  <p>
    Administrator dapat membuat kupon promosi dengan parameter:
  </p>
  <ul>
    <li><code>Tipe Diskon</code>: Persentase (misal 20%) atau Potongan Tetap (misal Rp 10.000).</li>
    <li><code>Minimal Belanja</code>: Batas bawah subtotal keranjang agar voucher dapat diterapkan.</li>
    <li><code>Batas Diskon Maksimal (Cap)</code>: Perlindungan margin laba gerai (misal diskon 20% maksimal potongan Rp 25.000).</li>
    <li><code>Kuota Pemakaian</code>: Batas total berapa kali kupon dapat diklaim pelanggan.</li>
  </ul>
</div>

<!-- ========================================================================= -->
<!-- BAB 8                                                                     -->
<!-- ========================================================================= -->
<div class="chapter-header">
  <span class="chapter-number">Bab 8</span>
  <h1>Penanganan Masalah (Troubleshooting &amp; FAQ)</h1>

  <h2>8.1 Matriks Penanganan Gangguan Operasional Gerai</h2>
  <table class="data-table">
    <thead>
      <tr>
        <th style="width: 25%;">Gejala Masalah</th>
        <th style="width: 35%;">Kemungkinan Penyebab</th>
        <th style="width: 40%;">Langkah Solusi Cepat</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>QRIS Tidak Bisa di-Scan Bank Tertentu</strong></td>
        <td>Aplikasi m-Banking pelanggan menolak format barcode dinamis modifikasi.</td>
        <td>Minta pelanggan mengetuk tab <strong>"Merchant Code"</strong> pada layar QRIS, lalu ketuk tombol <strong>"Copy Amount"</strong> untuk menempel nominal manual di m-Banking.</td>
      </tr>
      <tr>
        <td><strong>Saldo Pelanggan Terpotong tapi Status Masih Unpaid</strong></td>
        <td>Keterlambatan jaringan seluler pelanggan saat mengirim request konfirmasi bayar.</td>
        <td>Minta pelanggan menunjukkan bukti debet di mutasi rekening bank. Kasir memeriksa nama merchant <strong>OXID PROJECT</strong>, lalu menekan tombol manual konfirmasi di dashboard kasir.</td>
      </tr>
      <tr>
        <td><strong>Printer Termal Kasir Tidak Merespons</strong></td>
        <td>Kabel USB/Bluetooth printer terputus atau kertas termal habis/terpasang terbalik.</td>
        <td>Periksa indikator lampu printer. Pastikan sisi licin kertas termal menghadap ke atas pemanas roll. Refresh halaman browser kasir.</td>
      </tr>
      <tr>
        <td><strong>Koneksi Internet Gerai Terputus</strong></td>
        <td>Gangguan provider internet WiFi gerai.</td>
        <td>Alihkan koneksi tablet kasir KDS ke tethering darurat ponsel supervisor. Sistem CHANGKEER ringan dan dapat beroperasi normal di jaringan seluler 4G.</td>
      </tr>
    </tbody>
  </table>

  <div style="margin-top: 15mm; border-top: 1pt solid #E4E4E7; padding-top: 5mm; text-align: center; font-size: 8pt; color: #A1A1AA;">
    &copy; 2026 CHANGKEER ATELIER. Dikelola oleh OXID PROJECT INDONESIA.<br>
    Dokumen ini dicetak secara resmi dan sah sebagai pegangan operasional standar.
  </div>
</div>

</body>
</html>
"""
    return html_content

def main():
    html_file = "/tmp/CHANGKEER_MANUAL_BOOK.html"
    pdf_dest1 = "/home/ilhammu29/changkeer/docs/CHANGKEER_MANUAL_BOOK.pdf"
    pdf_dest2 = "/home/ilhammu29/changkeer/CHANGKEER_MANUAL_BOOK.pdf"
    pdf_dest3 = "/home/ilhammu29/CHANGKEER_MANUAL_BOOK.pdf"

    content = generate_manual_book_html()
    with open(html_file, "w", encoding="utf-8") as f:
        f.write(content)
    
    print("HTML Manual Book generated. Rendering PDF via WeasyPrint...")
    doc = weasyprint.HTML(filename=html_file)
    doc.write_pdf(pdf_dest1)
    
    # Copy to root and home directory for convenience
    import shutil
    shutil.copyfile(pdf_dest1, pdf_dest2)
    shutil.copyfile(pdf_dest1, pdf_dest3)

    size = os.path.getsize(pdf_dest1)
    print(f"Success! PDF generated at {pdf_dest1} (Size: {size:,} bytes)")

if __name__ == "__main__":
    main()
