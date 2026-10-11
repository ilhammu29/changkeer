import { Category, Product, Article, PageContent, SiteSettings } from '@/types';

export const SEED_CATEGORIES: Category[] = [
  {
    id: 'c0000000-0000-4000-8000-000000000001',
    name: 'Signature Herbal Infusion',
    slug: 'signature-herbal',
    description: 'Racikan daun herbal murni pilihan dengan cita rasa seimbang dan kaya antioksidan.',
    type: 'product',
    created_at: new Date().toISOString(),
  },
  {
    id: 'c0000000-0000-4000-8000-000000000002',
    name: 'Artisan Tisane & Flora',
    slug: 'artisan-tisane',
    description: 'Perpaduan kelopak bunga kering organik dan rempah tropis aromatik.',
    type: 'product',
    created_at: new Date().toISOString(),
  },

  {
    id: 'c0000000-0000-4000-8000-000000000010',
    name: 'Edukasi & Tradisi Teh',
    slug: 'edukasi-tradisi',
    description: 'Wawasan seputar tanaman herbal nusantara, teknik seduh, dan filosofi hidup selaras alam.',
    type: 'article',
    created_at: new Date().toISOString(),
  },
  {
    id: 'c0000000-0000-4000-8000-000000000011',
    name: 'Gaya Hidup Sehat',
    slug: 'gaya-hidup-sehat',
    description: 'Inspirasi rutinitas harian bernutrisi dan kesadaran mind-body.',
    type: 'article',
    created_at: new Date().toISOString(),
  },
];

export const SEED_PRODUCTS: Product[] = [
  {
    id: 'b0000000-0000-4000-8000-000000000001',
    name: 'CHANGKEER Jasmine Tea',
    slug: 'solar-term-jasmine-herbal-tea',
    tagline: 'Daun Teh Utuh & Bunga Melati Asli dengan Gula Sorgum & Madu',
    description: 'Racikan teh herbal fungsional terinspirasi tradisi teh Tiongkok yang disederhanakan untuk gaya hidup modern grab-and-go. Menggunakan daun teh pilihan dan kuntum melati utuh dengan pemanis alami gula sorgum serta madu murni. Bebas kantong teh pemutih dan 100% bebas mikroplastik. Tidak mengandung daun senna keras sehingga sangat aman untuk dikonsumsi harian.',
    category_id: 'c0000000-0000-4000-8000-000000000001',
    category: SEED_CATEGORIES[0],
    ingredients: [
      'Daun Teh Hijau Pilihan (Camellia sinensis)',
      'Kuntum Bunga Melati Utuh (Jasminum sambac)',
      'Pemanis Alami Gula Sorgum Organik',
      'Madu Hutan Murni Nusantara',
    ],
    brewing_guide: {
      water_temp: '85°C - 90°C',
      steep_time: '2-3 Menit',
      serving_size: '250ml - 300ml air panas',
      notes: 'Dirancang praktis untuk penyajian cepat di bawah 3 menit tanpa ampas mengganggu.',
    },
    characteristics: {
      aroma: 'Bunga melati segar semerbak alami',
      taste: 'Manis lembut seimbang tanpa rasa pahit berlebih',
      body: 'Silky smooth',
      caffeine: 'Sangat Rendah (< 10mg)',
    },
    packaging_info: 'Kemasan botol & sachet eksklusif bebas mikroplastik (microplastic-free & toxic-free packaging).',
    price: 49000,
    weight_grams: 50,
    featured_image: '/images/assets/jasmine_tea_produk.jpg',
    gallery: [
      '/images/assets/jasmine_tea_produk.jpg',
      '/images/assets/jasmine_tea_produk.png',
      '/images/assets/biji_teh_jasmine_tea.png',
      '/images/assets/bungkus_teh.png',
    ],
    is_featured: true,
    status: 'published',
    seo_title: 'CHANGKEER Jasmine Tea - Teh Herbal Melati Alami',
    seo_description: 'Nikmati teh herbal melati CHANGKEER dengan daun teh utuh, gula sorgum, dan madu murni. Bebas kantong teh pemutih dan bebas mikroplastik.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'b0000000-0000-4000-8000-000000000002',
    name: 'CHANGKEER English Breakfast Tea',
    slug: 'english-breakfast-tea',
    tagline: 'Racikan Teh Hitam Kuat & Berkarakter dengan Pemanis Alami Rendah Glikemik',
    description: 'Seduhan teh hitam berkarakter bold dan kaya rasa yang terinspirasi tradisi sarapan klasik, diracik dengan dedikasi kearifan nusantara. Menghadirkan dorongan energi alami yang bersih tanpa menyebabkan lonjakan asam lambung. Menggunakan kantong teh bebas mikroplastik dan bebas pemutih kimiawi (bleach-free), dipermanis secara seimbang dengan gula sorgum dan madu hutan murni. 100% bebas daun senna, aman dikonsumsi harian untuk mengawali hari aktif Anda.',
    category_id: 'c0000000-0000-4000-8000-000000000001',
    category: SEED_CATEGORIES[0],
    ingredients: [
      'Daun Teh Hitam Pilihan Nusantara (Camellia sinensis var. assamica)',
      'Pemanis Alami Gula Sorgum Organik',
      'Madu Hutan Murni Nusantara',
    ],
    brewing_guide: {
      water_temp: '95°C',
      steep_time: '2-3 Menit',
      serving_size: '250ml - 300ml air panas',
      notes: 'Penyajian instan praktis kurang dari 3 menit untuk gaya hidup modern yang serba cepat.',
    },
    characteristics: {
      aroma: 'Aroma malted tea hangat dan mendalam',
      taste: 'Kuat, gurih, dengan rasa manis karamel sorgum lembut',
      body: 'Full-bodied & rich',
      caffeine: 'Sedang (~25mg, energi stabil tanpa crash)',
    },
    packaging_info: 'Kemasan ramah lingkungan bebas mikroplastik dan bebas zat kimia pemutih (microplastic-free & bleach-free).',
    price: 49000,
    weight_grams: 50,
    featured_image: '/images/assets/english_breakfast_tea_produk.jpg',
    gallery: [
      '/images/assets/english_breakfast_tea_produk.jpg',
      '/images/assets/banner.jpg',
    ],
    is_featured: true,
    status: 'published',
    seo_title: 'CHANGKEER English Breakfast Tea - Teh Hitam Herbal Nusantara',
    seo_description: 'Teh hitam klasik berenergi bersih CHANGKEER dengan daun teh utuh, gula sorgum dan madu murni. Bebas mikroplastik dan tanpa daun senna.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'b0000000-0000-4000-8000-000000000003',
    name: 'CHANGKEER Vanilla Mint Tea',
    slug: 'vanilla-mint-tea',
    tagline: 'Kesegaran Dingin Daun Mint Alami Berpadu Aroma Vanilla Lembut Menenangkan',
    description: 'Kombinasi harmonis antara semilir dingin daun mint pegunungan dan kelembutan aroma vanilla alami. Dirancang untuk meredakan ketegangan pikiran dan menyegarkan sistem pernapasan setelah aktivitas padat. Tanpa kandungan daun senna yang keras, aman untuk lambung dan pencernaan. Dikemas dalam kantung bebas mikroplastik dengan alternatif pemanis sehat gula sorgum dan madu.',
    category_id: 'c0000000-0000-4000-8000-000000000002',
    category: SEED_CATEGORIES[1],
    ingredients: [
      'Daun Teh Pilihan (Camellia sinensis)',
      'Daun Mint Kering Alami (Mentha piperita)',
      'Ekstrak Polong Vanilla Organik',
      'Gula Sorgum Rendah Kalori',
      'Madu Murni Alami',
    ],
    brewing_guide: {
      water_temp: '90°C',
      steep_time: '2-3 Menit',
      serving_size: '250ml - 300ml air panas atau dingin',
      notes: 'Dapat dinikmati hangat atau ditambahkan es batu untuk kesegaran ganda kurang dari 3 menit.',
    },
    characteristics: {
      aroma: 'Mint segar semilir berpadu vanilla manis lembut',
      taste: 'Dingin menyegarkan di tenggorokan dengan sentuhan manis vanilla creamy',
      body: 'Medium-crisp',
      caffeine: 'Rendah (< 10mg)',
    },
    packaging_info: 'Kemasan eksklusif bebas racun & mikroplastik (non-toxic teabag).',
    price: 49000,
    weight_grams: 50,
    featured_image: '/images/assets/vanilla_mint_tea_produk.jpg',
    gallery: [
      '/images/assets/vanilla_mint_tea_produk.jpg',
      '/images/assets/banner2.jpg',
    ],
    is_featured: true,
    status: 'published',
    seo_title: 'CHANGKEER Vanilla Mint Tea - Teh Herbal Dingin Segar & Lembut',
    seo_description: 'Segarkan hari Anda dengan perpaduan daun mint alami dan aroma manis vanilla dari CHANGKEER. Bebas mikroplastik dan aman tanpa daun senna.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const SEED_ARTICLES: Article[] = [
  {
    id: 'a0000000-0000-4000-8000-000000000001',
    title: 'Seni Menyeduh Teh Herbal: Panduan Suhu dan Waktu untuk Ekstraksi Rasa Maksimal',
    slug: 'seni-menyeduh-teh-herbal-panduan-suhu-dan-waktu',
    excerpt: 'Setiap tanaman herbal memiliki sensitivitas berbeda terhadap temperatur air. Simak panduan lengkap agar aroma dan kebaikan alaminya tetap terjaga seutuhnya.',
    content: `Menyeduh teh herbal bukan sekadar menuang air panas ke dalam cangkir. Di balik secangkir seduhan yang nikmat, terdapat proses fisika dan kimia sederhana yang menentukan apakah minyak atsiri aromatik keluar dengan sempurna atau justru rusak oleh suhu berlebih.

### 1. Perbedaan Suhu: Daun Tipis vs Akar & Rimpang
Secara umum, bagian tanaman yang digunakan dapat dibagi menjadi dua kelompok:
- **Bunga dan Daun Halus (seperti Chamomile, Mint, Rosella):** Sebaiknya diseduh pada suhu antara 85°C hingga 90°C. Air yang baru mendidih sebaiknya didiamkan selama 1-2 menit sebelum dituangkan ke cangkir.
- **Rimpang dan Batang (seperti Jahe Merah, Serai, Kayu Manis):** Membutuhkan suhu 95°C hingga 100°C agar lapisan sel tanaman yang padat dapat melepaskan senyawa rasa dan kehangatannya.

### 2. Durasi Penyeduhan yang Tepat
Berbeda dari daun Camellia sinensis (teh hitam/hijau) yang bisa menjadi sangat pahit bila diseduh terlalu lama karena tanin tinggi, sebagian besar herbal tisane bebas tanin pahit. Rata-rata waktu seduh optimal adalah 4 hingga 6 menit dengan wadah tertutup.

Menutup cangkir saat proses penyeduhan sangat penting agar minyak esensial yang mudah menguap tidak hilang bersama uap air.`,
    category_id: 'c0000000-0000-4000-8000-000000000010',
    category: SEED_CATEGORIES[3],
    featured_image: '/images/articles/berita-1.jpg',
    author_name: 'Master Blender CHANGKEER',
    read_time_minutes: 4,
    is_featured: true,
    status: 'published',
    seo_title: 'Panduan Menyeduh Teh Herbal: Suhu dan Waktu Tepat | CHANGKEER',
    seo_description: 'Pelajari teknik menyeduh bunga, daun, dan rimpang herbal agar mendapatkan aroma dan rasa terbaik tanpa merusak kebaikan alaminya.',
    published_at: '2026-10-08T10:00:00Z',
    created_at: '2026-10-08T10:00:00Z',
    updated_at: '2026-10-08T10:00:00Z',
  },
  {
    id: 'a0000000-0000-4000-8000-000000000002',
    title: 'Eksplorasi Rempah Nusantara: Mengapa Jahe Merah dan Serai Menjadi Pasangan Abadi',
    slug: 'eksplorasi-rempah-nusantara-jahe-merah-dan-serai',
    excerpt: 'Kombinasi klasik jahe merah dan serai telah menemani masyarakat kepulauan nusantara selama berabad-abad. Berikut alasan gastronominya.',
    content: `Di berbagai pelosok Indonesia, aroma rebusan jahe dan serai adalah penanda kenyamanan di malam hari. Namun di luar tradisi, secara gastronomi kedua bahan ini merupakan pasangan harmonis yang saling melengkapi.

Jahe merah memiliki karakter rasa yang tajam, pekat, dan hangat berkat kandungan alami gingerol dan shogaol. Di sisi lain, serai wangi menyumbangkan senyawa citral aromatik yang memberikan wangi segar sitrus tanpa keasaman buah.

Ketika disatukan dalam proporsi yang terukur, serai memotong ketajaman jahe sehingga rasa yang tertinggal di lidah terasa bersih, hangat, dan menenangkan.`,
    category_id: 'c0000000-0000-4000-8000-000000000010',
    category: SEED_CATEGORIES[3],
    featured_image: '/images/articles/berita-2.jpg',
    author_name: 'Tim Riset Botani CHANGKEER',
    read_time_minutes: 5,
    is_featured: true,
    status: 'published',
    seo_title: 'Eksplorasi Rempah Nusantara: Harmoni Jahe Merah & Serai | CHANGKEER',
    seo_description: 'Mengenal karakter aromatik jahe merah dan serai wangi dalam tradisi minuman hangat nusantara.',
    published_at: '2026-10-04T10:00:00Z',
    created_at: '2026-10-04T10:00:00Z',
    updated_at: '2026-10-04T10:00:00Z',
  },
];

export const SEED_PAGES: Record<string, PageContent> = {
  home: {
    id: 'page-home',
    slug: 'home',
    title: 'Beranda CHANGKEER',
    sections: {
      hero: {
        eyebrow: 'HERBAL TEA REVOLUTION',
        headline_line1: 'MORE THAN TEA.',
        headline_line2: 'A BETTER YOU.',
        subheadline: 'Seduhan teh herbal murni tanpa kompromi. Diramu dari tanaman rempah dan kelopak bunga terbaik nusantara untuk energi jernih dan ketenangan sejati.',
        primary_cta_text: 'JELAJAHI KATALOG',
        primary_cta_link: '/katalog',
        secondary_cta_text: 'TENTANG PRODUK',
        secondary_cta_link: '/tentang-produk',
        video_caption: 'Saksikan dedikasi racikan alami CHANGKEER',
      },
      highlights: [
        { title: '100% Bebas Mikroplastik', desc: 'Kemasan toxic-free & bleach-free tanpa pelepasan mikroplastik ke cangkir seduhan Anda.' },
        { title: 'Bebas Daun Senna (Aman Harian)', desc: 'Formula herbal fungsional murni tanpa pencahar keras yang merusak ritme alami tubuh.' },
        { title: 'Gula Sorgum & Madu Murni', desc: 'Alternatif pemanis sehat rendah glikemik untuk energi stabil dan kebugaran organ.' },
        { title: 'Seduh Cepat < 3 Menit', desc: 'Kepraktisan grab-and-go modern dengan kenikmatan daun & kelopak bunga utuh bernutrisi.' },
      ],
      story_teaser: {
        tag: 'OUR PHILOSOPHY',
        title: 'A PAUSE IN EVERY CHANGKEER',
        content:
          'Busy days run on caffeine and sugar. Changkeer is meant to be a pause between them: a warm or iced cup that tastes good and lets you slow down for a moment.',
        content_secondary:
          'Our blends take no shortcuts. We use real flowers, fruit and spices, with no artificial flavours, no senna, and no white sugar by default. Just an honest cup that fits into your everyday routine.',
        quote: '“Tea-rrific Every Season”',
        link_text: 'ABOUT CHANGKEER',
        link_url: '/tentang-kami',
      },
    },
    seo_title: 'CHANGKEER - More Than Tea. A Better You.',
    seo_description: 'Website resmi teh herbal CHANGKEER. Racikan herbal murni nusantara untuk kebugaran harian dan ketenangan sejati.',
    updated_at: new Date().toISOString(),
  },
  'tentang-produk': {
    id: 'page-tentang-produk',
    slug: 'tentang-produk',
    title: 'Tentang Produk CHANGKEER',
    sections: {
      intro: {
        title: 'Kemurnian Botani di Setiap Seduhan',
        description: 'Setiap varian CHANGKEER dirancang dengan menghormati karakteristik alami tanaman herbal, menghasilkan profil rasa yang seimbang tanpa pemanis tambahan.',
      },
      quality_pillars: [
        { title: 'Bahan Baku Terpilih', desc: 'Bekerja sama langsung dengan petani tanaman herbal lokal yang menjaga kelestarian tanah.' },
        { title: 'Pengeringan Suhu Terkendali', desc: 'Menjaga keutuhan minyak atsiri aromatik dan warna alami kelopak bunga.' },
        { title: 'Kemasan Berkelanjutan', desc: 'Material ramah lingkungan yang mengunci kesegaran daun secara optimal.' },
      ],
    },
    seo_title: 'Tentang Produk CHANGKEER - Standar Kualitas & Komposisi Alami',
    seo_description: 'Pelajari standar racikan teh herbal CHANGKEER, proses pemilihan bahan baku lokal, dan cara penyajian terbaik.',
    updated_at: new Date().toISOString(),
  },
  'tentang-kami': {
    id: 'page-tentang-kami',
    slug: 'tentang-kami',
    title: 'About Changkeer',
    sections: {
      story: {
        title: 'AN HONEST CHANGKEER, FROM INDONESIAN SOIL',
        paragraphs: [
          'CHANGKEER is a grab-and-go herbal tea brand from Jakarta. We brew blends of whole flowers, dried fruit and spices sourced from growers in Puncak, Garut and Wonosobo, ready to enjoy in under 3 minutes.',
          'We started because most daily drinks are too sweet. Many "detox" teas on the market also contain senna, a laxative that isn\'t meant for daily use, and they come with exaggerated claims. On top of that, plenty of teabags are still made from nylon or plastic.',
          'That\'s why every Changkeer cup is unsweetened by default, with sorghum sugar or raw honey if you\'d like it sweeter. Our blends are brewed in unbleached paper or cotton muslin sachets, contain no senna, and every ingredient is clearly listed.',
          'Our menu changes with the 24 solar terms of the traditional Chinese calendar, adapted to Jakarta\'s weather: warming blends in the rainy season, refreshing ones in the dry heat. The name Changkeer comes from cangkir, the Indonesian word for cup.',
        ],
      },
      team: {
        tag: 'THE TEAM',
        title: 'BEHIND EVERY CHANGKEER',
        subtitle:
          'Five people who wanted a daily drink that\'s healthy, honest and easy to grab on a busy day, so we made one.',
        members: [
          { number: '01', name: 'ALMAIDAH CHAERUDIN PUTRI', role: 'Co-founder' },
          { number: '02', name: 'ANNISHA HUMAIRA', role: 'Co-founder' },
          { number: '03', name: 'JOHANA ABIGAEL RUMBIAK', role: 'Co-founder' },
          { number: '04', name: 'KEYLA PUTRI ADISTY', role: 'Co-founder' },
          { number: '05', name: 'NURSOLEHA ROMADHONI', role: 'Co-founder' },
        ],
      },
    },
    seo_title: 'About Changkeer - Our Story & The Team',
    seo_description: 'An honest grab-and-go herbal tea from Jakarta. Sourced from Puncak, Garut, and Wonosobo, brewed plastic-free in under 3 minutes.',
    updated_at: new Date().toISOString(),
  },
  'hubungi-kami': {
    id: 'page-hubungi-kami',
    slug: 'hubungi-kami',
    title: 'Hubungi Kami',
    sections: {
      headline: 'Terhubung Bersama Kami',
      description: 'Punya pertanyaan seputar produk, peluang kemitraan, atau ingin berbagi cerita secangkir teh? Kami siap mendengarkan.',
      support_hours: 'Senin - Sabtu: 09:00 - 17:00 WIB',
    },
    seo_title: 'Hubungi Kami - Layanan Pelanggan & Kemitraan CHANGKEER',
    seo_description: 'Kirim pesan atau pertanyaan Anda kepada tim CHANGKEER. Kami siap membantu setiap kebutuhan Anda.',
    updated_at: new Date().toISOString(),
  },
};

export const SEED_SITE_SETTINGS: SiteSettings = {
  id: 'settings-general',
  key: 'general',
  site_name: 'CHANGKEER',
  tagline: 'More Than Tea. A Better You.',
  contact_email: 'halo@changkeer.com',
  contact_phone: '+62 812-3456-7890',
  contact_address: 'Jl. Harmoni Alam No. 8, Bandung, Jawa Barat, Indonesia',
  social_instagram: 'https://instagram.com/changkeer.tea',
  social_youtube: 'https://youtube.com/@changkeer',
  social_tiktok: 'https://tiktok.com/@changkeer',
  raw_json: {},
  updated_at: new Date().toISOString(),
};
