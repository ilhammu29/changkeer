import { Category, Product, Article, PageContent, SiteSettings } from '@/types';

export const SEED_CATEGORIES: Category[] = [
  {
    id: "c0000000-0000-4000-8000-000000000001",
    name: "Spring Blends",
    slug: "spring-season",
    description: "Aromatic & floral herbal blends welcoming nature's awakening in spring.",
    type: "product",
    created_at: new Date().toISOString(),
  },
  {
    id: "c0000000-0000-4000-8000-000000000002",
    name: "Summer Blends",
    slug: "summer-season",
    description: "Crisp & cooling citrus herbal teas designed for hot summer days.",
    type: "product",
    created_at: new Date().toISOString(),
  },
  {
    id: "c0000000-0000-4000-8000-000000000003",
    name: "Autumn Blends",
    slug: "autumn-season",
    description: "Notes of osmanthus, roasted barley & comforting warm spices for autumn rain.",
    type: "product",
    created_at: new Date().toISOString(),
  },
  {
    id: "c0000000-0000-4000-8000-000000000004",
    name: "Winter Blends",
    slug: "winter-season",
    description: "Deep cinnamon, ginger & longan to soothe the body during cold weather.",
    type: "product",
    created_at: new Date().toISOString(),
  },
  {
    id: "c0000000-0000-4000-8000-000000000010",
    name: "Tea Education & Heritage",
    slug: "edukasi-tradisi",
    description: "Insights into Indonesian herbal botanicals, brewing techniques, and living in harmony with nature.",
    type: "article",
    created_at: new Date().toISOString(),
  },
  {
    id: "c0000000-0000-4000-8000-000000000011",
    name: "Mindful Living",
    slug: "gaya-hidup-sehat",
    description: "Inspiration for nourishing daily routines and mind-body balance.",
    type: "article",
    created_at: new Date().toISOString(),
  },
];

export const SEED_PRODUCTS: Product[] = [
  {
    "id": "b0000000-0000-4000-8000-000000000001",
    "name": "CHANGKEER First Bloom",
    "slug": "start-of-spring",
    "tagline": "Start of Spring (立春) • Light, floral and a little fruity.",
    "description": "Racikan teh herbal fungsional First Bloom terinspirasi kearifan 24 Solar Terms (Start of Spring - 立春). Memadukan racikan jasmine flowers, dried pear, goji dengan rasa seimbang alami. 100% bebas kantong pemutih dan bebas mikroplastik serta tanpa daun senna keras, sangat aman dan nyaman dinikmati setiap hari.",
    "category_id": "c0000000-0000-4000-8000-000000000001",
    "category": {
      "id": "c0000000-0000-4000-8000-000000000001",
      "name": "Spring Blends (Musim Semi)",
      "slug": "spring-season",
      "description": "Racikan herbal selaras musim Spring.",
      "type": "product",
      "created_at": "2026-10-20T07:40:53.919Z"
    },
    "ingredients": [
      "Jasmine flowers",
      "Dried pear",
      "Goji"
    ],
    "brewing_guide": {
      "water_temp": "80°C - 85°C (Cocok Dingin/Es)",
      "steep_time": "2-3 Menit",
      "serving_size": "250ml - 300ml air murni",
      "notes": "Light, floral and a little fruity. Dirancang praktis untuk penyajian cepat di bawah 3 menit tanpa ampas mengganggu."
    },
    "characteristics": {
      "aroma": "Light, floral and a little fruity.",
      "taste": "Alami & Segar (Hot or iced)",
      "body": "Silky smooth",
      "caffeine": "Bebas Senna & Rendah Kafein"
    },
    "packaging_info": "Kemasan botol & pouch eksklusif bebas mikroplastik (microplastic-free & bleach-free).",
    "price": 24000,
    "weight_grams": 50,
    "featured_image": "/images/products/start-of-spring.jpg",
    "gallery": [
      "/images/products/start-of-spring.jpg",
      "/images/products-nobg/start-of-spring.png"
    ],
    "is_featured": true,
    "status": "published",
    "seo_title": "CHANGKEER First Bloom - Start of Spring Herbal Tea",
    "seo_description": "Teh herbal fungsional CHANGKEER First Bloom (Start of Spring). 100% alami tanpa daun senna & bebas mikroplastik.",
    "created_at": "2026-10-20T07:40:53.920Z",
    "updated_at": "2026-10-20T07:40:53.920Z"
  },
  {
    "id": "b0000000-0000-4000-8000-000000000002",
    "name": "CHANGKEER Rain Garden",
    "slug": "rain-water",
    "tagline": "Rain Water (雨水) • Rose up front, soft ginger warmth.",
    "description": "Racikan teh herbal fungsional Rain Garden terinspirasi kearifan 24 Solar Terms (Rain Water - 雨水). Memadukan racikan rose buds, ginger, red dates dengan rasa seimbang alami. 100% bebas kantong pemutih dan bebas mikroplastik serta tanpa daun senna keras, sangat aman dan nyaman dinikmati setiap hari.",
    "category_id": "c0000000-0000-4000-8000-000000000001",
    "category": {
      "id": "c0000000-0000-4000-8000-000000000001",
      "name": "Spring Blends (Musim Semi)",
      "slug": "spring-season",
      "description": "Racikan herbal selaras musim Spring.",
      "type": "product",
      "created_at": "2026-10-20T07:40:53.920Z"
    },
    "ingredients": [
      "Rose buds",
      "Ginger",
      "Red dates"
    ],
    "brewing_guide": {
      "water_temp": "90°C - 95°C (Seduh Panas)",
      "steep_time": "2-3 Menit",
      "serving_size": "250ml - 300ml air murni",
      "notes": "Rose up front, soft ginger warmth. Dirancang praktis untuk penyajian cepat di bawah 3 menit tanpa ampas mengganggu."
    },
    "characteristics": {
      "aroma": "Rose up front, soft ginger warmth.",
      "taste": "Alami & Segar (Best hot)",
      "body": "Silky smooth",
      "caffeine": "Bebas Senna & Rendah Kafein"
    },
    "packaging_info": "Kemasan botol & pouch eksklusif bebas mikroplastik (microplastic-free & bleach-free).",
    "price": 20000,
    "weight_grams": 50,
    "featured_image": "/images/products/rain-water.jpg",
    "gallery": [
      "/images/products/rain-water.jpg",
      "/images/products-nobg/rain-water.png"
    ],
    "is_featured": false,
    "status": "published",
    "seo_title": "CHANGKEER Rain Garden - Rain Water Herbal Tea",
    "seo_description": "Teh herbal fungsional CHANGKEER Rain Garden (Rain Water). 100% alami tanpa daun senna & bebas mikroplastik.",
    "created_at": "2026-10-20T07:40:53.920Z",
    "updated_at": "2026-10-20T07:40:53.920Z"
  },
  {
    "id": "b0000000-0000-4000-8000-000000000003",
    "name": "CHANGKEER Green Wake",
    "slug": "awakening-of-insects",
    "tagline": "Awakening of Insects (惊蛰) • Fresh and grassy, with a pandan finish.",
    "description": "Racikan teh herbal fungsional Green Wake terinspirasi kearifan 24 Solar Terms (Awakening of Insects - 惊蛰). Memadukan racikan mint, lemongrass, pandan dengan rasa seimbang alami. 100% bebas kantong pemutih dan bebas mikroplastik serta tanpa daun senna keras, sangat aman dan nyaman dinikmati setiap hari.",
    "category_id": "c0000000-0000-4000-8000-000000000001",
    "category": {
      "id": "c0000000-0000-4000-8000-000000000001",
      "name": "Spring Blends (Musim Semi)",
      "slug": "spring-season",
      "description": "Racikan herbal selaras musim Spring.",
      "type": "product",
      "created_at": "2026-10-20T07:40:53.920Z"
    },
    "ingredients": [
      "Mint",
      "Lemongrass",
      "Pandan"
    ],
    "brewing_guide": {
      "water_temp": "80°C - 85°C (Cocok Dingin/Es)",
      "steep_time": "2-3 Menit",
      "serving_size": "250ml - 300ml air murni",
      "notes": "Fresh and grassy, with a pandan finish. Dirancang praktis untuk penyajian cepat di bawah 3 menit tanpa ampas mengganggu."
    },
    "characteristics": {
      "aroma": "Fresh and grassy, with a pandan finish.",
      "taste": "Alami & Segar (Best iced)",
      "body": "Silky smooth",
      "caffeine": "Bebas Senna & Rendah Kafein"
    },
    "packaging_info": "Kemasan botol & pouch eksklusif bebas mikroplastik (microplastic-free & bleach-free).",
    "price": 15000,
    "weight_grams": 50,
    "featured_image": "/images/products/awakening-of-insects.jpg",
    "gallery": [
      "/images/products/awakening-of-insects.jpg",
      "/images/products-nobg/awakening-of-insects.png"
    ],
    "is_featured": false,
    "status": "published",
    "seo_title": "CHANGKEER Green Wake - Awakening of Insects Herbal Tea",
    "seo_description": "Teh herbal fungsional CHANGKEER Green Wake (Awakening of Insects). 100% alami tanpa daun senna & bebas mikroplastik.",
    "created_at": "2026-10-20T07:40:53.920Z",
    "updated_at": "2026-10-20T07:40:53.920Z"
  },
  {
    "id": "b0000000-0000-4000-8000-000000000004",
    "name": "CHANGKEER Even Day",
    "slug": "spring-equinox",
    "tagline": "Spring Equinox (春分) • Half floral, half fruity.",
    "description": "Racikan teh herbal fungsional Even Day terinspirasi kearifan 24 Solar Terms (Spring Equinox - 春分). Memadukan racikan chrysanthemum, rose buds, goji dengan rasa seimbang alami. 100% bebas kantong pemutih dan bebas mikroplastik serta tanpa daun senna keras, sangat aman dan nyaman dinikmati setiap hari.",
    "category_id": "c0000000-0000-4000-8000-000000000001",
    "category": {
      "id": "c0000000-0000-4000-8000-000000000001",
      "name": "Spring Blends (Musim Semi)",
      "slug": "spring-season",
      "description": "Racikan herbal selaras musim Spring.",
      "type": "product",
      "created_at": "2026-10-20T07:40:53.920Z"
    },
    "ingredients": [
      "Chrysanthemum",
      "Rose buds",
      "Goji"
    ],
    "brewing_guide": {
      "water_temp": "80°C - 85°C (Cocok Dingin/Es)",
      "steep_time": "2-3 Menit",
      "serving_size": "250ml - 300ml air murni",
      "notes": "Half floral, half fruity. Dirancang praktis untuk penyajian cepat di bawah 3 menit tanpa ampas mengganggu."
    },
    "characteristics": {
      "aroma": "Half floral, half fruity.",
      "taste": "Alami & Segar (Hot or iced)",
      "body": "Silky smooth",
      "caffeine": "Bebas Senna & Rendah Kafein"
    },
    "packaging_info": "Kemasan botol & pouch eksklusif bebas mikroplastik (microplastic-free & bleach-free).",
    "price": 22000,
    "weight_grams": 50,
    "featured_image": "/images/products/spring-equinox.jpg",
    "gallery": [
      "/images/products/spring-equinox.jpg",
      "/images/products-nobg/spring-equinox.png"
    ],
    "is_featured": false,
    "status": "published",
    "seo_title": "CHANGKEER Even Day - Spring Equinox Herbal Tea",
    "seo_description": "Teh herbal fungsional CHANGKEER Even Day (Spring Equinox). 100% alami tanpa daun senna & bebas mikroplastik.",
    "created_at": "2026-10-20T07:40:53.920Z",
    "updated_at": "2026-10-20T07:40:53.920Z"
  },
  {
    "id": "b0000000-0000-4000-8000-000000000005",
    "name": "CHANGKEER Clear Sky",
    "slug": "clear-and-bright",
    "tagline": "Clear and Bright (清明) • Blue in the cup, purple once the lemon goes in.",
    "description": "Racikan teh herbal fungsional Clear Sky terinspirasi kearifan 24 Solar Terms (Clear and Bright - 清明). Memadukan racikan butterfly pea, lemongrass, lemon dengan rasa seimbang alami. 100% bebas kantong pemutih dan bebas mikroplastik serta tanpa daun senna keras, sangat aman dan nyaman dinikmati setiap hari.",
    "category_id": "c0000000-0000-4000-8000-000000000001",
    "category": {
      "id": "c0000000-0000-4000-8000-000000000001",
      "name": "Spring Blends (Musim Semi)",
      "slug": "spring-season",
      "description": "Racikan herbal selaras musim Spring.",
      "type": "product",
      "created_at": "2026-10-20T07:40:53.920Z"
    },
    "ingredients": [
      "Butterfly pea",
      "Lemongrass",
      "Lemon"
    ],
    "brewing_guide": {
      "water_temp": "80°C - 85°C (Cocok Dingin/Es)",
      "steep_time": "2-3 Menit",
      "serving_size": "250ml - 300ml air murni",
      "notes": "Blue in the cup, purple once the lemon goes in. Dirancang praktis untuk penyajian cepat di bawah 3 menit tanpa ampas mengganggu."
    },
    "characteristics": {
      "aroma": "Blue in the cup, purple once the lemon goes in.",
      "taste": "Alami & Segar (Best iced)",
      "body": "Silky smooth",
      "caffeine": "Bebas Senna & Rendah Kafein"
    },
    "packaging_info": "Kemasan botol & pouch eksklusif bebas mikroplastik (microplastic-free & bleach-free).",
    "price": 18000,
    "weight_grams": 50,
    "featured_image": "/images/products/clear-and-bright.jpg",
    "gallery": [
      "/images/products/clear-and-bright.jpg",
      "/images/products-nobg/clear-and-bright.png"
    ],
    "is_featured": false,
    "status": "published",
    "seo_title": "CHANGKEER Clear Sky - Clear and Bright Herbal Tea",
    "seo_description": "Teh herbal fungsional CHANGKEER Clear Sky (Clear and Bright). 100% alami tanpa daun senna & bebas mikroplastik.",
    "created_at": "2026-10-20T07:40:53.920Z",
    "updated_at": "2026-10-20T07:40:53.920Z"
  },
  {
    "id": "b0000000-0000-4000-8000-000000000006",
    "name": "CHANGKEER Barley Field",
    "slug": "grain-rain",
    "tagline": "Grain Rain (谷雨) • Toasty and nutty, with a honeyed flower note.",
    "description": "Racikan teh herbal fungsional Barley Field terinspirasi kearifan 24 Solar Terms (Grain Rain - 谷雨). Memadukan racikan roasted barley, osmanthus dengan rasa seimbang alami. 100% bebas kantong pemutih dan bebas mikroplastik serta tanpa daun senna keras, sangat aman dan nyaman dinikmati setiap hari.",
    "category_id": "c0000000-0000-4000-8000-000000000001",
    "category": {
      "id": "c0000000-0000-4000-8000-000000000001",
      "name": "Spring Blends (Musim Semi)",
      "slug": "spring-season",
      "description": "Racikan herbal selaras musim Spring.",
      "type": "product",
      "created_at": "2026-10-20T07:40:53.920Z"
    },
    "ingredients": [
      "Roasted barley",
      "Osmanthus"
    ],
    "brewing_guide": {
      "water_temp": "80°C - 85°C (Cocok Dingin/Es)",
      "steep_time": "2-3 Menit",
      "serving_size": "250ml - 300ml air murni",
      "notes": "Toasty and nutty, with a honeyed flower note. Dirancang praktis untuk penyajian cepat di bawah 3 menit tanpa ampas mengganggu."
    },
    "characteristics": {
      "aroma": "Toasty and nutty, with a honeyed flower note.",
      "taste": "Alami & Segar (Hot or iced)",
      "body": "Silky smooth",
      "caffeine": "Bebas Senna & Rendah Kafein"
    },
    "packaging_info": "Kemasan botol & pouch eksklusif bebas mikroplastik (microplastic-free & bleach-free).",
    "price": 20000,
    "weight_grams": 50,
    "featured_image": "/images/products/grain-rain.jpg",
    "gallery": [
      "/images/products/grain-rain.jpg",
      "/images/products-nobg/grain-rain.png"
    ],
    "is_featured": false,
    "status": "published",
    "seo_title": "CHANGKEER Barley Field - Grain Rain Herbal Tea",
    "seo_description": "Teh herbal fungsional CHANGKEER Barley Field (Grain Rain). 100% alami tanpa daun senna & bebas mikroplastik.",
    "created_at": "2026-10-20T07:40:53.920Z",
    "updated_at": "2026-10-20T07:40:53.920Z"
  },
  {
    "id": "b0000000-0000-4000-8000-000000000007",
    "name": "CHANGKEER Hibiscus Sun",
    "slug": "start-of-summer",
    "tagline": "Start of Summer (立夏) • Tart, ruby-red and very refreshing.",
    "description": "Racikan teh herbal fungsional Hibiscus Sun terinspirasi kearifan 24 Solar Terms (Start of Summer - 立夏). Memadukan racikan hibiscus, orange peel, mint dengan rasa seimbang alami. 100% bebas kantong pemutih dan bebas mikroplastik serta tanpa daun senna keras, sangat aman dan nyaman dinikmati setiap hari.",
    "category_id": "c0000000-0000-4000-8000-000000000002",
    "category": {
      "id": "c0000000-0000-4000-8000-000000000002",
      "name": "Summer Blends (Musim Panas)",
      "slug": "summer-season",
      "description": "Racikan herbal selaras musim Summer.",
      "type": "product",
      "created_at": "2026-10-20T07:40:53.920Z"
    },
    "ingredients": [
      "Hibiscus",
      "Orange peel",
      "Mint"
    ],
    "brewing_guide": {
      "water_temp": "80°C - 85°C (Cocok Dingin/Es)",
      "steep_time": "2-3 Menit",
      "serving_size": "250ml - 300ml air murni",
      "notes": "Tart, ruby-red and very refreshing. Dirancang praktis untuk penyajian cepat di bawah 3 menit tanpa ampas mengganggu."
    },
    "characteristics": {
      "aroma": "Tart, ruby-red and very refreshing.",
      "taste": "Alami & Segar (Best iced)",
      "body": "Silky smooth",
      "caffeine": "Bebas Senna & Rendah Kafein"
    },
    "packaging_info": "Kemasan botol & pouch eksklusif bebas mikroplastik (microplastic-free & bleach-free).",
    "price": 18000,
    "weight_grams": 50,
    "featured_image": "/images/products/start-of-summer.jpg",
    "gallery": [
      "/images/products/start-of-summer.jpg",
      "/images/products-nobg/start-of-summer.png"
    ],
    "is_featured": true,
    "status": "published",
    "seo_title": "CHANGKEER Hibiscus Sun - Start of Summer Herbal Tea",
    "seo_description": "Teh herbal fungsional CHANGKEER Hibiscus Sun (Start of Summer). 100% alami tanpa daun senna & bebas mikroplastik.",
    "created_at": "2026-10-20T07:40:53.920Z",
    "updated_at": "2026-10-20T07:40:53.920Z"
  },
  {
    "id": "b0000000-0000-4000-8000-000000000008",
    "name": "CHANGKEER Pandan Lime",
    "slug": "grain-buds",
    "tagline": "Grain Buds (小满) • Green and citrusy.",
    "description": "Racikan teh herbal fungsional Pandan Lime terinspirasi kearifan 24 Solar Terms (Grain Buds - 小满). Memadukan racikan pandan, lemongrass, lime leaf dengan rasa seimbang alami. 100% bebas kantong pemutih dan bebas mikroplastik serta tanpa daun senna keras, sangat aman dan nyaman dinikmati setiap hari.",
    "category_id": "c0000000-0000-4000-8000-000000000002",
    "category": {
      "id": "c0000000-0000-4000-8000-000000000002",
      "name": "Summer Blends (Musim Panas)",
      "slug": "summer-season",
      "description": "Racikan herbal selaras musim Summer.",
      "type": "product",
      "created_at": "2026-10-20T07:40:53.920Z"
    },
    "ingredients": [
      "Pandan",
      "Lemongrass",
      "Lime leaf"
    ],
    "brewing_guide": {
      "water_temp": "80°C - 85°C (Cocok Dingin/Es)",
      "steep_time": "2-3 Menit",
      "serving_size": "250ml - 300ml air murni",
      "notes": "Green and citrusy. Dirancang praktis untuk penyajian cepat di bawah 3 menit tanpa ampas mengganggu."
    },
    "characteristics": {
      "aroma": "Green and citrusy.",
      "taste": "Alami & Segar (Best iced)",
      "body": "Silky smooth",
      "caffeine": "Bebas Senna & Rendah Kafein"
    },
    "packaging_info": "Kemasan botol & pouch eksklusif bebas mikroplastik (microplastic-free & bleach-free).",
    "price": 15000,
    "weight_grams": 50,
    "featured_image": "/images/products/grain-buds.jpg",
    "gallery": [
      "/images/products/grain-buds.jpg",
      "/images/products-nobg/grain-buds.png"
    ],
    "is_featured": false,
    "status": "published",
    "seo_title": "CHANGKEER Pandan Lime - Grain Buds Herbal Tea",
    "seo_description": "Teh herbal fungsional CHANGKEER Pandan Lime (Grain Buds). 100% alami tanpa daun senna & bebas mikroplastik.",
    "created_at": "2026-10-20T07:40:53.920Z",
    "updated_at": "2026-10-20T07:40:53.920Z"
  },
  {
    "id": "b0000000-0000-4000-8000-000000000009",
    "name": "CHANGKEER Mango Jasmine",
    "slug": "grain-in-ear",
    "tagline": "Grain in Ear (芒种) • Ripe fruit with a jasmine lift.",
    "description": "Racikan teh herbal fungsional Mango Jasmine terinspirasi kearifan 24 Solar Terms (Grain in Ear - 芒种). Memadukan racikan dried mango, jasmine flowers dengan rasa seimbang alami. 100% bebas kantong pemutih dan bebas mikroplastik serta tanpa daun senna keras, sangat aman dan nyaman dinikmati setiap hari.",
    "category_id": "c0000000-0000-4000-8000-000000000002",
    "category": {
      "id": "c0000000-0000-4000-8000-000000000002",
      "name": "Summer Blends (Musim Panas)",
      "slug": "summer-season",
      "description": "Racikan herbal selaras musim Summer.",
      "type": "product",
      "created_at": "2026-10-20T07:40:53.920Z"
    },
    "ingredients": [
      "Dried mango",
      "Jasmine flowers"
    ],
    "brewing_guide": {
      "water_temp": "80°C - 85°C (Cocok Dingin/Es)",
      "steep_time": "2-3 Menit",
      "serving_size": "250ml - 300ml air murni",
      "notes": "Ripe fruit with a jasmine lift. Dirancang praktis untuk penyajian cepat di bawah 3 menit tanpa ampas mengganggu."
    },
    "characteristics": {
      "aroma": "Ripe fruit with a jasmine lift.",
      "taste": "Alami & Segar (Best iced)",
      "body": "Silky smooth",
      "caffeine": "Bebas Senna & Rendah Kafein"
    },
    "packaging_info": "Kemasan botol & pouch eksklusif bebas mikroplastik (microplastic-free & bleach-free).",
    "price": 26000,
    "weight_grams": 50,
    "featured_image": "/images/products/grain-in-ear.jpg",
    "gallery": [
      "/images/products/grain-in-ear.jpg",
      "/images/products-nobg/grain-in-ear.png"
    ],
    "is_featured": false,
    "status": "published",
    "seo_title": "CHANGKEER Mango Jasmine - Grain in Ear Herbal Tea",
    "seo_description": "Teh herbal fungsional CHANGKEER Mango Jasmine (Grain in Ear). 100% alami tanpa daun senna & bebas mikroplastik.",
    "created_at": "2026-10-20T07:40:53.920Z",
    "updated_at": "2026-10-20T07:40:53.920Z"
  },
  {
    "id": "b0000000-0000-4000-8000-000000000010",
    "name": "CHANGKEER Longest Day",
    "slug": "summer-solstice",
    "tagline": "Summer Solstice (夏至) • Bright, clean and cooling.",
    "description": "Racikan teh herbal fungsional Longest Day terinspirasi kearifan 24 Solar Terms (Summer Solstice - 夏至). Memadukan racikan chrysanthemum, lemon, mint dengan rasa seimbang alami. 100% bebas kantong pemutih dan bebas mikroplastik serta tanpa daun senna keras, sangat aman dan nyaman dinikmati setiap hari.",
    "category_id": "c0000000-0000-4000-8000-000000000002",
    "category": {
      "id": "c0000000-0000-4000-8000-000000000002",
      "name": "Summer Blends (Musim Panas)",
      "slug": "summer-season",
      "description": "Racikan herbal selaras musim Summer.",
      "type": "product",
      "created_at": "2026-10-20T07:40:53.920Z"
    },
    "ingredients": [
      "Chrysanthemum",
      "Lemon",
      "Mint"
    ],
    "brewing_guide": {
      "water_temp": "80°C - 85°C (Cocok Dingin/Es)",
      "steep_time": "2-3 Menit",
      "serving_size": "250ml - 300ml air murni",
      "notes": "Bright, clean and cooling. Dirancang praktis untuk penyajian cepat di bawah 3 menit tanpa ampas mengganggu."
    },
    "characteristics": {
      "aroma": "Bright, clean and cooling.",
      "taste": "Alami & Segar (Best iced)",
      "body": "Silky smooth",
      "caffeine": "Bebas Senna & Rendah Kafein"
    },
    "packaging_info": "Kemasan botol & pouch eksklusif bebas mikroplastik (microplastic-free & bleach-free).",
    "price": 18000,
    "weight_grams": 50,
    "featured_image": "/images/products/summer-solstice.jpg",
    "gallery": [
      "/images/products/summer-solstice.jpg",
      "/images/products-nobg/summer-solstice.png"
    ],
    "is_featured": false,
    "status": "published",
    "seo_title": "CHANGKEER Longest Day - Summer Solstice Herbal Tea",
    "seo_description": "Teh herbal fungsional CHANGKEER Longest Day (Summer Solstice). 100% alami tanpa daun senna & bebas mikroplastik.",
    "created_at": "2026-10-20T07:40:53.920Z",
    "updated_at": "2026-10-20T07:40:53.920Z"
  },
  {
    "id": "b0000000-0000-4000-8000-000000000011",
    "name": "CHANGKEER Cool Leaf",
    "slug": "minor-heat",
    "tagline": "Minor Heat (小暑) • Minty and sharp.",
    "description": "Racikan teh herbal fungsional Cool Leaf terinspirasi kearifan 24 Solar Terms (Minor Heat - 小暑). Memadukan racikan mint, lime leaf, lemongrass dengan rasa seimbang alami. 100% bebas kantong pemutih dan bebas mikroplastik serta tanpa daun senna keras, sangat aman dan nyaman dinikmati setiap hari.",
    "category_id": "c0000000-0000-4000-8000-000000000002",
    "category": {
      "id": "c0000000-0000-4000-8000-000000000002",
      "name": "Summer Blends (Musim Panas)",
      "slug": "summer-season",
      "description": "Racikan herbal selaras musim Summer.",
      "type": "product",
      "created_at": "2026-10-20T07:40:53.920Z"
    },
    "ingredients": [
      "Mint",
      "Lime leaf",
      "Lemongrass"
    ],
    "brewing_guide": {
      "water_temp": "80°C - 85°C (Cocok Dingin/Es)",
      "steep_time": "2-3 Menit",
      "serving_size": "250ml - 300ml air murni",
      "notes": "Minty and sharp. Dirancang praktis untuk penyajian cepat di bawah 3 menit tanpa ampas mengganggu."
    },
    "characteristics": {
      "aroma": "Minty and sharp.",
      "taste": "Alami & Segar (Best iced)",
      "body": "Silky smooth",
      "caffeine": "Bebas Senna & Rendah Kafein"
    },
    "packaging_info": "Kemasan botol & pouch eksklusif bebas mikroplastik (microplastic-free & bleach-free).",
    "price": 15000,
    "weight_grams": 50,
    "featured_image": "/images/products/minor-heat.jpg",
    "gallery": [
      "/images/products/minor-heat.jpg",
      "/images/products-nobg/minor-heat.png"
    ],
    "is_featured": false,
    "status": "published",
    "seo_title": "CHANGKEER Cool Leaf - Minor Heat Herbal Tea",
    "seo_description": "Teh herbal fungsional CHANGKEER Cool Leaf (Minor Heat). 100% alami tanpa daun senna & bebas mikroplastik.",
    "created_at": "2026-10-20T07:40:53.920Z",
    "updated_at": "2026-10-20T07:40:53.920Z"
  },
  {
    "id": "b0000000-0000-4000-8000-000000000012",
    "name": "CHANGKEER Chrysanthemum Lemon",
    "slug": "major-heat",
    "tagline": "Major Heat (大暑) • Our hot-season classic: mellow flowers, fresh citrus.",
    "description": "Racikan teh herbal fungsional Chrysanthemum Lemon terinspirasi kearifan 24 Solar Terms (Major Heat - 大暑). Memadukan racikan chrysanthemum, lemon, goji dengan rasa seimbang alami. 100% bebas kantong pemutih dan bebas mikroplastik serta tanpa daun senna keras, sangat aman dan nyaman dinikmati setiap hari.",
    "category_id": "c0000000-0000-4000-8000-000000000002",
    "category": {
      "id": "c0000000-0000-4000-8000-000000000002",
      "name": "Summer Blends (Musim Panas)",
      "slug": "summer-season",
      "description": "Racikan herbal selaras musim Summer.",
      "type": "product",
      "created_at": "2026-10-20T07:40:53.920Z"
    },
    "ingredients": [
      "Chrysanthemum",
      "Lemon",
      "Goji"
    ],
    "brewing_guide": {
      "water_temp": "80°C - 85°C (Cocok Dingin/Es)",
      "steep_time": "2-3 Menit",
      "serving_size": "250ml - 300ml air murni",
      "notes": "Our hot-season classic: mellow flowers, fresh citrus. Dirancang praktis untuk penyajian cepat di bawah 3 menit tanpa ampas mengganggu."
    },
    "characteristics": {
      "aroma": "Our hot-season classic: mellow flowers, fresh citrus.",
      "taste": "Alami & Segar (Best iced)",
      "body": "Silky smooth",
      "caffeine": "Bebas Senna & Rendah Kafein"
    },
    "packaging_info": "Kemasan botol & pouch eksklusif bebas mikroplastik (microplastic-free & bleach-free).",
    "price": 20000,
    "weight_grams": 50,
    "featured_image": "/images/products/major-heat.jpg",
    "gallery": [
      "/images/products/major-heat.jpg",
      "/images/products-nobg/major-heat.png"
    ],
    "is_featured": false,
    "status": "published",
    "seo_title": "CHANGKEER Chrysanthemum Lemon - Major Heat Herbal Tea",
    "seo_description": "Teh herbal fungsional CHANGKEER Chrysanthemum Lemon (Major Heat). 100% alami tanpa daun senna & bebas mikroplastik.",
    "created_at": "2026-10-20T07:40:53.920Z",
    "updated_at": "2026-10-20T07:40:53.920Z"
  },
  {
    "id": "b0000000-0000-4000-8000-000000000013",
    "name": "CHANGKEER Osmanthus Pear",
    "slug": "start-of-autumn",
    "tagline": "Start of Autumn (立秋) • Apricot-scented flowers with soft pear.",
    "description": "Racikan teh herbal fungsional Osmanthus Pear terinspirasi kearifan 24 Solar Terms (Start of Autumn - 立秋). Memadukan racikan osmanthus, dried pear, goji dengan rasa seimbang alami. 100% bebas kantong pemutih dan bebas mikroplastik serta tanpa daun senna keras, sangat aman dan nyaman dinikmati setiap hari.",
    "category_id": "c0000000-0000-4000-8000-000000000003",
    "category": {
      "id": "c0000000-0000-4000-8000-000000000003",
      "name": "Autumn Blends (Musim Gugur)",
      "slug": "autumn-season",
      "description": "Racikan herbal selaras musim Autumn.",
      "type": "product",
      "created_at": "2026-10-20T07:40:53.920Z"
    },
    "ingredients": [
      "Osmanthus",
      "Dried pear",
      "Goji"
    ],
    "brewing_guide": {
      "water_temp": "80°C - 85°C (Cocok Dingin/Es)",
      "steep_time": "2-3 Menit",
      "serving_size": "250ml - 300ml air murni",
      "notes": "Apricot-scented flowers with soft pear. Dirancang praktis untuk penyajian cepat di bawah 3 menit tanpa ampas mengganggu."
    },
    "characteristics": {
      "aroma": "Apricot-scented flowers with soft pear.",
      "taste": "Alami & Segar (Hot or iced)",
      "body": "Silky smooth",
      "caffeine": "Bebas Senna & Rendah Kafein"
    },
    "packaging_info": "Kemasan botol & pouch eksklusif bebas mikroplastik (microplastic-free & bleach-free).",
    "price": 26000,
    "weight_grams": 50,
    "featured_image": "/images/products/start-of-autumn.jpg",
    "gallery": [
      "/images/products/start-of-autumn.jpg",
      "/images/products-nobg/start-of-autumn.png"
    ],
    "is_featured": true,
    "status": "published",
    "seo_title": "CHANGKEER Osmanthus Pear - Start of Autumn Herbal Tea",
    "seo_description": "Teh herbal fungsional CHANGKEER Osmanthus Pear (Start of Autumn). 100% alami tanpa daun senna & bebas mikroplastik.",
    "created_at": "2026-10-20T07:40:53.920Z",
    "updated_at": "2026-10-20T07:40:53.920Z"
  },
  {
    "id": "b0000000-0000-4000-8000-000000000014",
    "name": "CHANGKEER Late Rose",
    "slug": "end-of-heat",
    "tagline": "End of Heat (处暑) • Rosy and tart, like fruit jam.",
    "description": "Racikan teh herbal fungsional Late Rose terinspirasi kearifan 24 Solar Terms (End of Heat - 处暑). Memadukan racikan rose buds, hibiscus, dried apple dengan rasa seimbang alami. 100% bebas kantong pemutih dan bebas mikroplastik serta tanpa daun senna keras, sangat aman dan nyaman dinikmati setiap hari.",
    "category_id": "c0000000-0000-4000-8000-000000000003",
    "category": {
      "id": "c0000000-0000-4000-8000-000000000003",
      "name": "Autumn Blends (Musim Gugur)",
      "slug": "autumn-season",
      "description": "Racikan herbal selaras musim Autumn.",
      "type": "product",
      "created_at": "2026-10-20T07:40:53.920Z"
    },
    "ingredients": [
      "Rose buds",
      "Hibiscus",
      "Dried apple"
    ],
    "brewing_guide": {
      "water_temp": "80°C - 85°C (Cocok Dingin/Es)",
      "steep_time": "2-3 Menit",
      "serving_size": "250ml - 300ml air murni",
      "notes": "Rosy and tart, like fruit jam. Dirancang praktis untuk penyajian cepat di bawah 3 menit tanpa ampas mengganggu."
    },
    "characteristics": {
      "aroma": "Rosy and tart, like fruit jam.",
      "taste": "Alami & Segar (Hot or iced)",
      "body": "Silky smooth",
      "caffeine": "Bebas Senna & Rendah Kafein"
    },
    "packaging_info": "Kemasan botol & pouch eksklusif bebas mikroplastik (microplastic-free & bleach-free).",
    "price": 22000,
    "weight_grams": 50,
    "featured_image": "/images/products/end-of-heat.jpg",
    "gallery": [
      "/images/products/end-of-heat.jpg",
      "/images/products-nobg/end-of-heat.png"
    ],
    "is_featured": false,
    "status": "published",
    "seo_title": "CHANGKEER Late Rose - End of Heat Herbal Tea",
    "seo_description": "Teh herbal fungsional CHANGKEER Late Rose (End of Heat). 100% alami tanpa daun senna & bebas mikroplastik.",
    "created_at": "2026-10-20T07:40:53.920Z",
    "updated_at": "2026-10-20T07:40:53.920Z"
  },
  {
    "id": "b0000000-0000-4000-8000-000000000015",
    "name": "CHANGKEER White Dew",
    "slug": "white-dew",
    "tagline": "White Dew (白露) • Delicate and smooth. Try it with honey.",
    "description": "Racikan teh herbal fungsional White Dew terinspirasi kearifan 24 Solar Terms (White Dew - 白露). Memadukan racikan white chrysanthemum, dried pear dengan rasa seimbang alami. 100% bebas kantong pemutih dan bebas mikroplastik serta tanpa daun senna keras, sangat aman dan nyaman dinikmati setiap hari.",
    "category_id": "c0000000-0000-4000-8000-000000000003",
    "category": {
      "id": "c0000000-0000-4000-8000-000000000003",
      "name": "Autumn Blends (Musim Gugur)",
      "slug": "autumn-season",
      "description": "Racikan herbal selaras musim Autumn.",
      "type": "product",
      "created_at": "2026-10-20T07:40:53.920Z"
    },
    "ingredients": [
      "White chrysanthemum",
      "Dried pear"
    ],
    "brewing_guide": {
      "water_temp": "90°C - 95°C (Seduh Panas)",
      "steep_time": "2-3 Menit",
      "serving_size": "250ml - 300ml air murni",
      "notes": "Delicate and smooth. Try it with honey. Dirancang praktis untuk penyajian cepat di bawah 3 menit tanpa ampas mengganggu."
    },
    "characteristics": {
      "aroma": "Delicate and smooth. Try it with honey.",
      "taste": "Alami & Segar (Best hot)",
      "body": "Silky smooth",
      "caffeine": "Bebas Senna & Rendah Kafein"
    },
    "packaging_info": "Kemasan botol & pouch eksklusif bebas mikroplastik (microplastic-free & bleach-free).",
    "price": 22000,
    "weight_grams": 50,
    "featured_image": "/images/products/white-dew.jpg",
    "gallery": [
      "/images/products/white-dew.jpg",
      "/images/products-nobg/white-dew.png"
    ],
    "is_featured": false,
    "status": "published",
    "seo_title": "CHANGKEER White Dew - White Dew Herbal Tea",
    "seo_description": "Teh herbal fungsional CHANGKEER White Dew (White Dew). 100% alami tanpa daun senna & bebas mikroplastik.",
    "created_at": "2026-10-20T07:40:53.920Z",
    "updated_at": "2026-10-20T07:40:53.920Z"
  },
  {
    "id": "b0000000-0000-4000-8000-000000000016",
    "name": "CHANGKEER Golden Hour",
    "slug": "autumn-equinox",
    "tagline": "Autumn Equinox (秋分) • Toasty and golden.",
    "description": "Racikan teh herbal fungsional Golden Hour terinspirasi kearifan 24 Solar Terms (Autumn Equinox - 秋分). Memadukan racikan osmanthus, roasted barley, orange peel dengan rasa seimbang alami. 100% bebas kantong pemutih dan bebas mikroplastik serta tanpa daun senna keras, sangat aman dan nyaman dinikmati setiap hari.",
    "category_id": "c0000000-0000-4000-8000-000000000003",
    "category": {
      "id": "c0000000-0000-4000-8000-000000000003",
      "name": "Autumn Blends (Musim Gugur)",
      "slug": "autumn-season",
      "description": "Racikan herbal selaras musim Autumn.",
      "type": "product",
      "created_at": "2026-10-20T07:40:53.920Z"
    },
    "ingredients": [
      "Osmanthus",
      "Roasted barley",
      "Orange peel"
    ],
    "brewing_guide": {
      "water_temp": "80°C - 85°C (Cocok Dingin/Es)",
      "steep_time": "2-3 Menit",
      "serving_size": "250ml - 300ml air murni",
      "notes": "Toasty and golden. Dirancang praktis untuk penyajian cepat di bawah 3 menit tanpa ampas mengganggu."
    },
    "characteristics": {
      "aroma": "Toasty and golden.",
      "taste": "Alami & Segar (Hot or iced)",
      "body": "Silky smooth",
      "caffeine": "Bebas Senna & Rendah Kafein"
    },
    "packaging_info": "Kemasan botol & pouch eksklusif bebas mikroplastik (microplastic-free & bleach-free).",
    "price": 24000,
    "weight_grams": 50,
    "featured_image": "/images/products/autumn-equinox.jpg",
    "gallery": [
      "/images/products/autumn-equinox.jpg",
      "/images/products-nobg/autumn-equinox.png"
    ],
    "is_featured": false,
    "status": "published",
    "seo_title": "CHANGKEER Golden Hour - Autumn Equinox Herbal Tea",
    "seo_description": "Teh herbal fungsional CHANGKEER Golden Hour (Autumn Equinox). 100% alami tanpa daun senna & bebas mikroplastik.",
    "created_at": "2026-10-20T07:40:53.920Z",
    "updated_at": "2026-10-20T07:40:53.920Z"
  },
  {
    "id": "b0000000-0000-4000-8000-000000000017",
    "name": "CHANGKEER First Rain",
    "slug": "cold-dew",
    "tagline": "Cold Dew (寒露) • Warming ginger and naturally sweet dates, for the first wet evenings.",
    "description": "Racikan teh herbal fungsional First Rain terinspirasi kearifan 24 Solar Terms (Cold Dew - 寒露). Memadukan racikan ginger, goji, red dates dengan rasa seimbang alami. 100% bebas kantong pemutih dan bebas mikroplastik serta tanpa daun senna keras, sangat aman dan nyaman dinikmati setiap hari.",
    "category_id": "c0000000-0000-4000-8000-000000000003",
    "category": {
      "id": "c0000000-0000-4000-8000-000000000003",
      "name": "Autumn Blends (Musim Gugur)",
      "slug": "autumn-season",
      "description": "Racikan herbal selaras musim Autumn.",
      "type": "product",
      "created_at": "2026-10-20T07:40:53.921Z"
    },
    "ingredients": [
      "Ginger",
      "Goji",
      "Red dates"
    ],
    "brewing_guide": {
      "water_temp": "90°C - 95°C (Seduh Panas)",
      "steep_time": "2-3 Menit",
      "serving_size": "250ml - 300ml air murni",
      "notes": "Warming ginger and naturally sweet dates, for the first wet evenings. Dirancang praktis untuk penyajian cepat di bawah 3 menit tanpa ampas mengganggu."
    },
    "characteristics": {
      "aroma": "Warming ginger and naturally sweet dates, for the first wet evenings.",
      "taste": "Alami & Segar (Best hot)",
      "body": "Silky smooth",
      "caffeine": "Bebas Senna & Rendah Kafein"
    },
    "packaging_info": "Kemasan botol & pouch eksklusif bebas mikroplastik (microplastic-free & bleach-free).",
    "price": 20000,
    "weight_grams": 50,
    "featured_image": "/images/products/cold-dew.jpg",
    "gallery": [
      "/images/products/cold-dew.jpg",
      "/images/products-nobg/cold-dew.png"
    ],
    "is_featured": true,
    "status": "published",
    "seo_title": "CHANGKEER First Rain - Cold Dew Herbal Tea",
    "seo_description": "Teh herbal fungsional CHANGKEER First Rain (Cold Dew). 100% alami tanpa daun senna & bebas mikroplastik.",
    "created_at": "2026-10-20T07:40:53.921Z",
    "updated_at": "2026-10-20T07:40:53.921Z"
  },
  {
    "id": "b0000000-0000-4000-8000-000000000018",
    "name": "CHANGKEER Ginger Rose",
    "slug": "frosts-descent",
    "tagline": "Frost's Descent (霜降) • Spiced and floral.",
    "description": "Racikan teh herbal fungsional Ginger Rose terinspirasi kearifan 24 Solar Terms (Frost's Descent - 霜降). Memadukan racikan ginger, rose buds, cinnamon dengan rasa seimbang alami. 100% bebas kantong pemutih dan bebas mikroplastik serta tanpa daun senna keras, sangat aman dan nyaman dinikmati setiap hari.",
    "category_id": "c0000000-0000-4000-8000-000000000003",
    "category": {
      "id": "c0000000-0000-4000-8000-000000000003",
      "name": "Autumn Blends (Musim Gugur)",
      "slug": "autumn-season",
      "description": "Racikan herbal selaras musim Autumn.",
      "type": "product",
      "created_at": "2026-10-20T07:40:53.921Z"
    },
    "ingredients": [
      "Ginger",
      "Rose buds",
      "Cinnamon"
    ],
    "brewing_guide": {
      "water_temp": "90°C - 95°C (Seduh Panas)",
      "steep_time": "2-3 Menit",
      "serving_size": "250ml - 300ml air murni",
      "notes": "Spiced and floral. Dirancang praktis untuk penyajian cepat di bawah 3 menit tanpa ampas mengganggu."
    },
    "characteristics": {
      "aroma": "Spiced and floral.",
      "taste": "Alami & Segar (Best hot)",
      "body": "Silky smooth",
      "caffeine": "Bebas Senna & Rendah Kafein"
    },
    "packaging_info": "Kemasan botol & pouch eksklusif bebas mikroplastik (microplastic-free & bleach-free).",
    "price": 20000,
    "weight_grams": 50,
    "featured_image": "/images/products/frosts-descent.jpg",
    "gallery": [
      "/images/products/frosts-descent.jpg",
      "/images/products-nobg/frosts-descent.png"
    ],
    "is_featured": false,
    "status": "published",
    "seo_title": "CHANGKEER Ginger Rose - Frost's Descent Herbal Tea",
    "seo_description": "Teh herbal fungsional CHANGKEER Ginger Rose (Frost's Descent). 100% alami tanpa daun senna & bebas mikroplastik.",
    "created_at": "2026-10-20T07:40:53.921Z",
    "updated_at": "2026-10-20T07:40:53.921Z"
  },
  {
    "id": "b0000000-0000-4000-8000-000000000019",
    "name": "CHANGKEER Spice Lantern",
    "slug": "start-of-winter",
    "tagline": "Start of Winter (立冬) • Baked-apple warmth with a little clove.",
    "description": "Racikan teh herbal fungsional Spice Lantern terinspirasi kearifan 24 Solar Terms (Start of Winter - 立冬). Memadukan racikan cinnamon, clove, dried apple dengan rasa seimbang alami. 100% bebas kantong pemutih dan bebas mikroplastik serta tanpa daun senna keras, sangat aman dan nyaman dinikmati setiap hari.",
    "category_id": "c0000000-0000-4000-8000-000000000004",
    "category": {
      "id": "c0000000-0000-4000-8000-000000000004",
      "name": "Winter Blends (Musim Dingin)",
      "slug": "winter-season",
      "description": "Racikan herbal selaras musim Winter.",
      "type": "product",
      "created_at": "2026-10-20T07:40:53.921Z"
    },
    "ingredients": [
      "Cinnamon",
      "Clove",
      "Dried apple"
    ],
    "brewing_guide": {
      "water_temp": "90°C - 95°C (Seduh Panas)",
      "steep_time": "2-3 Menit",
      "serving_size": "250ml - 300ml air murni",
      "notes": "Baked-apple warmth with a little clove. Dirancang praktis untuk penyajian cepat di bawah 3 menit tanpa ampas mengganggu."
    },
    "characteristics": {
      "aroma": "Baked-apple warmth with a little clove.",
      "taste": "Alami & Segar (Best hot)",
      "body": "Silky smooth",
      "caffeine": "Bebas Senna & Rendah Kafein"
    },
    "packaging_info": "Kemasan botol & pouch eksklusif bebas mikroplastik (microplastic-free & bleach-free).",
    "price": 22000,
    "weight_grams": 50,
    "featured_image": "/images/products/start-of-winter.jpg",
    "gallery": [
      "/images/products/start-of-winter.jpg",
      "/images/products-nobg/start-of-winter.png"
    ],
    "is_featured": true,
    "status": "published",
    "seo_title": "CHANGKEER Spice Lantern - Start of Winter Herbal Tea",
    "seo_description": "Teh herbal fungsional CHANGKEER Spice Lantern (Start of Winter). 100% alami tanpa daun senna & bebas mikroplastik.",
    "created_at": "2026-10-20T07:40:53.921Z",
    "updated_at": "2026-10-20T07:40:53.921Z"
  },
  {
    "id": "b0000000-0000-4000-8000-000000000020",
    "name": "CHANGKEER Longan Nest",
    "slug": "minor-snow",
    "tagline": "Minor Snow (小雪) • Caramel-sweet fruit, no sugar added.",
    "description": "Racikan teh herbal fungsional Longan Nest terinspirasi kearifan 24 Solar Terms (Minor Snow - 小雪). Memadukan racikan longan, red dates, goji dengan rasa seimbang alami. 100% bebas kantong pemutih dan bebas mikroplastik serta tanpa daun senna keras, sangat aman dan nyaman dinikmati setiap hari.",
    "category_id": "c0000000-0000-4000-8000-000000000004",
    "category": {
      "id": "c0000000-0000-4000-8000-000000000004",
      "name": "Winter Blends (Musim Dingin)",
      "slug": "winter-season",
      "description": "Racikan herbal selaras musim Winter.",
      "type": "product",
      "created_at": "2026-10-20T07:40:53.921Z"
    },
    "ingredients": [
      "Longan",
      "Red dates",
      "Goji"
    ],
    "brewing_guide": {
      "water_temp": "90°C - 95°C (Seduh Panas)",
      "steep_time": "2-3 Menit",
      "serving_size": "250ml - 300ml air murni",
      "notes": "Caramel-sweet fruit, no sugar added. Dirancang praktis untuk penyajian cepat di bawah 3 menit tanpa ampas mengganggu."
    },
    "characteristics": {
      "aroma": "Caramel-sweet fruit, no sugar added.",
      "taste": "Alami & Segar (Best hot)",
      "body": "Silky smooth",
      "caffeine": "Bebas Senna & Rendah Kafein"
    },
    "packaging_info": "Kemasan botol & pouch eksklusif bebas mikroplastik (microplastic-free & bleach-free).",
    "price": 28000,
    "weight_grams": 50,
    "featured_image": "/images/products/minor-snow.jpg",
    "gallery": [
      "/images/products/minor-snow.jpg",
      "/images/products-nobg/minor-snow.png"
    ],
    "is_featured": false,
    "status": "published",
    "seo_title": "CHANGKEER Longan Nest - Minor Snow Herbal Tea",
    "seo_description": "Teh herbal fungsional CHANGKEER Longan Nest (Minor Snow). 100% alami tanpa daun senna & bebas mikroplastik.",
    "created_at": "2026-10-20T07:40:53.921Z",
    "updated_at": "2026-10-20T07:40:53.921Z"
  },
  {
    "id": "b0000000-0000-4000-8000-000000000021",
    "name": "CHANGKEER Ginger Goji",
    "slug": "major-snow",
    "tagline": "Major Snow (大雪) • The rainy-season favourite.",
    "description": "Racikan teh herbal fungsional Ginger Goji terinspirasi kearifan 24 Solar Terms (Major Snow - 大雪). Memadukan racikan ginger, goji, lemon dengan rasa seimbang alami. 100% bebas kantong pemutih dan bebas mikroplastik serta tanpa daun senna keras, sangat aman dan nyaman dinikmati setiap hari.",
    "category_id": "c0000000-0000-4000-8000-000000000004",
    "category": {
      "id": "c0000000-0000-4000-8000-000000000004",
      "name": "Winter Blends (Musim Dingin)",
      "slug": "winter-season",
      "description": "Racikan herbal selaras musim Winter.",
      "type": "product",
      "created_at": "2026-10-20T07:40:53.921Z"
    },
    "ingredients": [
      "Ginger",
      "Goji",
      "Lemon"
    ],
    "brewing_guide": {
      "water_temp": "90°C - 95°C (Seduh Panas)",
      "steep_time": "2-3 Menit",
      "serving_size": "250ml - 300ml air murni",
      "notes": "The rainy-season favourite. Dirancang praktis untuk penyajian cepat di bawah 3 menit tanpa ampas mengganggu."
    },
    "characteristics": {
      "aroma": "The rainy-season favourite.",
      "taste": "Alami & Segar (Best hot)",
      "body": "Silky smooth",
      "caffeine": "Bebas Senna & Rendah Kafein"
    },
    "packaging_info": "Kemasan botol & pouch eksklusif bebas mikroplastik (microplastic-free & bleach-free).",
    "price": 18000,
    "weight_grams": 50,
    "featured_image": "/images/products/major-snow.jpg",
    "gallery": [
      "/images/products/major-snow.jpg",
      "/images/products-nobg/major-snow.png"
    ],
    "is_featured": false,
    "status": "published",
    "seo_title": "CHANGKEER Ginger Goji - Major Snow Herbal Tea",
    "seo_description": "Teh herbal fungsional CHANGKEER Ginger Goji (Major Snow). 100% alami tanpa daun senna & bebas mikroplastik.",
    "created_at": "2026-10-20T07:40:53.921Z",
    "updated_at": "2026-10-20T07:40:53.921Z"
  },
  {
    "id": "b0000000-0000-4000-8000-000000000022",
    "name": "CHANGKEER Solstice Cup",
    "slug": "winter-solstice",
    "tagline": "Winter Solstice (冬至) • Deep, warm and gently floral.",
    "description": "Racikan teh herbal fungsional Solstice Cup terinspirasi kearifan 24 Solar Terms (Winter Solstice - 冬至). Memadukan racikan red dates, ginger, osmanthus dengan rasa seimbang alami. 100% bebas kantong pemutih dan bebas mikroplastik serta tanpa daun senna keras, sangat aman dan nyaman dinikmati setiap hari.",
    "category_id": "c0000000-0000-4000-8000-000000000004",
    "category": {
      "id": "c0000000-0000-4000-8000-000000000004",
      "name": "Winter Blends (Musim Dingin)",
      "slug": "winter-season",
      "description": "Racikan herbal selaras musim Winter.",
      "type": "product",
      "created_at": "2026-10-20T07:40:53.921Z"
    },
    "ingredients": [
      "Red dates",
      "Ginger",
      "Osmanthus"
    ],
    "brewing_guide": {
      "water_temp": "90°C - 95°C (Seduh Panas)",
      "steep_time": "2-3 Menit",
      "serving_size": "250ml - 300ml air murni",
      "notes": "Deep, warm and gently floral. Dirancang praktis untuk penyajian cepat di bawah 3 menit tanpa ampas mengganggu."
    },
    "characteristics": {
      "aroma": "Deep, warm and gently floral.",
      "taste": "Alami & Segar (Best hot)",
      "body": "Silky smooth",
      "caffeine": "Bebas Senna & Rendah Kafein"
    },
    "packaging_info": "Kemasan botol & pouch eksklusif bebas mikroplastik (microplastic-free & bleach-free).",
    "price": 24000,
    "weight_grams": 50,
    "featured_image": "/images/products/winter-solstice.jpg",
    "gallery": [
      "/images/products/winter-solstice.jpg",
      "/images/products-nobg/winter-solstice.png"
    ],
    "is_featured": false,
    "status": "published",
    "seo_title": "CHANGKEER Solstice Cup - Winter Solstice Herbal Tea",
    "seo_description": "Teh herbal fungsional CHANGKEER Solstice Cup (Winter Solstice). 100% alami tanpa daun senna & bebas mikroplastik.",
    "created_at": "2026-10-20T07:40:53.921Z",
    "updated_at": "2026-10-20T07:40:53.921Z"
  },
  {
    "id": "b0000000-0000-4000-8000-000000000023",
    "name": "CHANGKEER Red Date Warmth",
    "slug": "minor-cold",
    "tagline": "Minor Cold (小寒) • Rich and mellow.",
    "description": "Racikan teh herbal fungsional Red Date Warmth terinspirasi kearifan 24 Solar Terms (Minor Cold - 小寒). Memadukan racikan red dates, longan, ginger dengan rasa seimbang alami. 100% bebas kantong pemutih dan bebas mikroplastik serta tanpa daun senna keras, sangat aman dan nyaman dinikmati setiap hari.",
    "category_id": "c0000000-0000-4000-8000-000000000004",
    "category": {
      "id": "c0000000-0000-4000-8000-000000000004",
      "name": "Winter Blends (Musim Dingin)",
      "slug": "winter-season",
      "description": "Racikan herbal selaras musim Winter.",
      "type": "product",
      "created_at": "2026-10-20T07:40:53.921Z"
    },
    "ingredients": [
      "Red dates",
      "Longan",
      "Ginger"
    ],
    "brewing_guide": {
      "water_temp": "90°C - 95°C (Seduh Panas)",
      "steep_time": "2-3 Menit",
      "serving_size": "250ml - 300ml air murni",
      "notes": "Rich and mellow. Dirancang praktis untuk penyajian cepat di bawah 3 menit tanpa ampas mengganggu."
    },
    "characteristics": {
      "aroma": "Rich and mellow.",
      "taste": "Alami & Segar (Best hot)",
      "body": "Silky smooth",
      "caffeine": "Bebas Senna & Rendah Kafein"
    },
    "packaging_info": "Kemasan botol & pouch eksklusif bebas mikroplastik (microplastic-free & bleach-free).",
    "price": 26000,
    "weight_grams": 50,
    "featured_image": "/images/products/minor-cold.jpg",
    "gallery": [
      "/images/products/minor-cold.jpg",
      "/images/products-nobg/minor-cold.png"
    ],
    "is_featured": false,
    "status": "published",
    "seo_title": "CHANGKEER Red Date Warmth - Minor Cold Herbal Tea",
    "seo_description": "Teh herbal fungsional CHANGKEER Red Date Warmth (Minor Cold). 100% alami tanpa daun senna & bebas mikroplastik.",
    "created_at": "2026-10-20T07:40:53.921Z",
    "updated_at": "2026-10-20T07:40:53.921Z"
  },
  {
    "id": "b0000000-0000-4000-8000-000000000024",
    "name": "CHANGKEER Cinnamon Ember",
    "slug": "major-cold",
    "tagline": "Major Cold (大寒) • Spicy-sweet, the last blend before spring.",
    "description": "Racikan teh herbal fungsional Cinnamon Ember terinspirasi kearifan 24 Solar Terms (Major Cold - 大寒). Memadukan racikan cinnamon, ginger, orange peel dengan rasa seimbang alami. 100% bebas kantong pemutih dan bebas mikroplastik serta tanpa daun senna keras, sangat aman dan nyaman dinikmati setiap hari.",
    "category_id": "c0000000-0000-4000-8000-000000000004",
    "category": {
      "id": "c0000000-0000-4000-8000-000000000004",
      "name": "Winter Blends (Musim Dingin)",
      "slug": "winter-season",
      "description": "Racikan herbal selaras musim Winter.",
      "type": "product",
      "created_at": "2026-10-20T07:40:53.921Z"
    },
    "ingredients": [
      "Cinnamon",
      "Ginger",
      "Orange peel"
    ],
    "brewing_guide": {
      "water_temp": "90°C - 95°C (Seduh Panas)",
      "steep_time": "2-3 Menit",
      "serving_size": "250ml - 300ml air murni",
      "notes": "Spicy-sweet, the last blend before spring. Dirancang praktis untuk penyajian cepat di bawah 3 menit tanpa ampas mengganggu."
    },
    "characteristics": {
      "aroma": "Spicy-sweet, the last blend before spring.",
      "taste": "Alami & Segar (Best hot)",
      "body": "Silky smooth",
      "caffeine": "Bebas Senna & Rendah Kafein"
    },
    "packaging_info": "Kemasan botol & pouch eksklusif bebas mikroplastik (microplastic-free & bleach-free).",
    "price": 18000,
    "weight_grams": 50,
    "featured_image": "/images/products/major-cold.jpg",
    "gallery": [
      "/images/products/major-cold.jpg",
      "/images/products-nobg/major-cold.png"
    ],
    "is_featured": false,
    "status": "published",
    "seo_title": "CHANGKEER Cinnamon Ember - Major Cold Herbal Tea",
    "seo_description": "Teh herbal fungsional CHANGKEER Cinnamon Ember (Major Cold). 100% alami tanpa daun senna & bebas mikroplastik.",
    "created_at": "2026-10-20T07:40:53.921Z",
    "updated_at": "2026-10-20T07:40:53.921Z"
  }
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

// ============================================================================
// E-COMMERCE MOCK SEED DATA (CAFE ORDERING, VOUCHERS, TABLES)
// ============================================================================

import { BotanicalAddon, Voucher, CafeTable, Order } from '@/types';

export const BOTANICAL_ADDONS: BotanicalAddon[] = [
  // --- BUNGA KERING (DRIED FLOWERS) ---
  {
    id: 'addon-1',
    name: 'Dried Rose Buds (Kuntum Mawar)',
    price: 3000,
    category: 'flower',
    note: 'Aroma mawar lembut, menenangkan saraf',
  },
  {
    id: 'addon-2',
    name: 'Golden Chrysanthemum (Krisan Emas)',
    price: 3000,
    category: 'flower',
    note: 'Meredakan panas dalam & menyegarkan',
  },
  {
    id: 'addon-3',
    name: 'Butterfly Pea (Bunga Telang)',
    price: 3000,
    category: 'flower',
    note: 'Warna biru alami & kaya antioksidan',
  },
  {
    id: 'addon-4',
    name: 'Whole Jasmine Bloom (Melati Utuh)',
    price: 4000,
    category: 'flower',
    note: 'Aroma melati pekat, relaksasi pikiran',
  },
  {
    id: 'addon-5',
    name: 'Golden Osmanthus (Bunga Osmanthus)',
    price: 4000,
    category: 'flower',
    note: 'Aroma aprikot manis alami yang elegan',
  },
  {
    id: 'addon-6',
    name: 'Organic Hibiscus (Kelopak Rosella)',
    price: 3000,
    category: 'flower',
    note: 'Rasa asam segar buah & merah delima alami',
  },

  // --- BUAH KERING (DRIED FRUITS) ---
  {
    id: 'addon-7',
    name: 'Goji Berries (Keci Merah)',
    price: 3000,
    category: 'fruit',
    note: 'Manis-asam alami, kaya vitamin & stamina',
  },
  {
    id: 'addon-8',
    name: 'Red Dates / Jujube (Angco)',
    price: 3000,
    category: 'fruit',
    note: 'Manis karamel alami, menghangatkan tubuh',
  },
  {
    id: 'addon-9',
    name: 'Dried Longan (Kelengkeng Kering)',
    price: 4000,
    category: 'fruit',
    note: 'Rasa madu buah pekat, menenangkan saraf',
  },
  {
    id: 'addon-10',
    name: 'Dried Pear Slice (Pir Kering)',
    price: 3000,
    category: 'fruit',
    note: 'Manis lembut melegakan tenggorokan',
  },
  {
    id: 'addon-11',
    name: 'Dried Apple Crisp (Apel Kering)',
    price: 3000,
    category: 'fruit',
    note: 'Karakter buah segar & aroma harum',
  },
  {
    id: 'addon-12',
    name: 'Dried Mango (Mangga Kering)',
    price: 4000,
    category: 'fruit',
    note: 'Aroma tropis matang & manis alami',
  },
  {
    id: 'addon-13',
    name: 'Dried Lemon Slice (Lemon Kering)',
    price: 2000,
    category: 'fruit',
    note: 'Sentuhan sitrus cerah & menyegarkan',
  },
  {
    id: 'addon-14',
    name: 'Sun-Dried Orange Peel (Kulit Jeruk)',
    price: 2000,
    category: 'fruit',
    note: 'Zesty & aromatik, melancarkan pencernaan',
  },
];

export const SEED_VOUCHERS: Voucher[] = [
  {
    id: 'v-01',
    code: 'CHANGKEERFIRST',
    title: 'Diskon 20% Pembelian Pertama',
    description: 'Potongan 20% untuk pesanan pertama seduhan teh herbal Changkeer.',
    discount_type: 'percentage',
    discount_value: 20,
    min_spend: 30000,
    max_discount: 25000,
    quota: 500,
    used_count: 14,
    valid_from: new Date().toISOString(),
    valid_until: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'v-02',
    code: 'ATELIER10K',
    title: 'Potongan Botani Rp 10.000',
    description: 'Potongan langsung Rp 10.000 dengan minimal belanja Rp 50.000.',
    discount_type: 'fixed',
    discount_value: 10000,
    min_spend: 50000,
    max_discount: 10000,
    quota: 200,
    used_count: 32,
    valid_from: new Date().toISOString(),
    valid_until: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'v-03',
    code: 'CAFEDINEIN',
    title: 'Promo Dine-In Meja Cafe 15%',
    description: 'Diskon 15% khusus pemesanan santap langsung di meja cafe Changkeer.',
    discount_type: 'percentage',
    discount_value: 15,
    min_spend: 35000,
    max_discount: 20000,
    quota: 300,
    used_count: 8,
    valid_from: new Date().toISOString(),
    valid_until: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'v-loyalty-01',
    code: 'GRATIS1CUP',
    title: 'Reward 5 Stempel: Gratis 1 Cup Teh',
    description: 'Klaim hadiah gratis 1 cup racikan herbal Changkeer setelah mengumpulkan 5 stempel teh.',
    discount_type: 'fixed',
    discount_value: 28000,
    min_spend: 28000,
    max_discount: null,
    quota: 1000,
    used_count: 0,
    valid_from: new Date().toISOString(),
    valid_until: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const SEED_CAFE_TABLES: CafeTable[] = [
  { id: 'tab-01', table_number: 'Meja 01', capacity: 2, description: 'Dekat jendela brew bar indoor', is_active: true, created_at: new Date().toISOString() },
  { id: 'tab-02', table_number: 'Meja 02', capacity: 2, description: 'Indoor tengah dekat tanaman pakis', is_active: true, created_at: new Date().toISOString() },
  { id: 'tab-03', table_number: 'Meja 03', capacity: 4, description: 'Sofa botanical lounge', is_active: true, created_at: new Date().toISOString() },
  { id: 'tab-04', table_number: 'Meja 04', capacity: 6, description: 'Meja komunal kayu jati solid', is_active: true, created_at: new Date().toISOString() },
  { id: 'tab-05', table_number: 'Meja 05', capacity: 4, description: 'Outdoor garden terrace barat', is_active: true, created_at: new Date().toISOString() },
  { id: 'tab-06', table_number: 'Bar 06', capacity: 1, description: 'Brew bar counter seat barista', is_active: true, created_at: new Date().toISOString() },
];

export const SEED_ORDERS: Order[] = [
  {
    id: 'ord-101',
    order_number: 'CK-261014-001',
    customer_name: 'Dewi Lestari',
    customer_email: 'dewi.lestari@example.com',
    customer_phone: '081298765432',
    order_type: 'dine_in',
    table_number: 'Meja 03',
    subtotal: 58000,
    discount_amount: 10000,
    delivery_fee: 0,
    tax_amount: 0,
    total_amount: 48000,
    voucher_code: 'ATELIER10K',
    payment_method: 'qris',
    payment_status: 'paid',
    order_status: 'brewing',
    notes: 'Tanpa gula, sajikan hangat.',
    paid_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 6 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    items: [
      {
        id: 'item-101',
        order_id: 'ord-101',
        product_id: SEED_PRODUCTS[0]?.id || 'b0000000-0000-4000-8000-000000000001',
        product_name: 'CHANGKEER First Bloom',
        product_slug: 'start-of-spring',
        product_image: SEED_PRODUCTS[0]?.featured_image,
        serving_size: 'regular',
        temperature: 'hot',
        sweetness_level: '0%',
        selected_addons: [BOTANICAL_ADDONS[0]],
        unit_price: 32000,
        quantity: 1,
        subtotal: 32000,
        created_at: new Date().toISOString(),
      },
      {
        id: 'item-102',
        order_id: 'ord-101',
        product_id: SEED_PRODUCTS[1]?.id || 'b0000000-0000-4000-8000-000000000002',
        product_name: 'CHANGKEER Rain Garden',
        product_slug: 'rain-water',
        product_image: SEED_PRODUCTS[1]?.featured_image,
        serving_size: 'regular',
        temperature: 'hot',
        sweetness_level: '50%',
        selected_addons: [],
        unit_price: 26000,
        quantity: 1,
        subtotal: 26000,
        created_at: new Date().toISOString(),
      },
    ],
  },
  {
    id: 'ord-102',
    order_number: 'CK-261014-002',
    customer_name: 'Budi Santoso',
    customer_email: 'budi.santoso@example.com',
    customer_phone: '081311223344',
    order_type: 'takeaway',
    pickup_time: '15 Menit Lagi',
    subtotal: 62000,
    discount_amount: 12400,
    delivery_fee: 0,
    tax_amount: 0,
    total_amount: 49600,
    voucher_code: 'CHANGKEERFIRST',
    payment_method: 'cashier',
    payment_status: 'unpaid',
    order_status: 'received',
    notes: 'Es batu dipisah.',
    created_at: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    items: [
      {
        id: 'item-103',
        order_id: 'ord-102',
        product_id: SEED_PRODUCTS[2]?.id || 'b0000000-0000-4000-8000-000000000003',
        product_name: 'CHANGKEER Green Wake',
        product_slug: 'awakening-of-insects',
        product_image: SEED_PRODUCTS[2]?.featured_image,
        serving_size: 'regular',
        temperature: 'iced',
        sweetness_level: '0%',
        ice_level: 'less',
        selected_addons: [BOTANICAL_ADDONS[3]],
        unit_price: 31000,
        quantity: 2,
        subtotal: 62000,
        created_at: new Date().toISOString(),
      },
    ],
  },
];

