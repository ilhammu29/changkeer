export type ProductStatus = 'draft' | 'published' | 'archived';
export type ArticleStatus = 'draft' | 'published' | 'archived';
export type CategoryType = 'product' | 'article';
export type AdminRole = 'super_admin' | 'admin' | 'editor';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  type: CategoryType;
  created_at: string;
}

export interface BrewingGuide {
  water_temp: string;
  steep_time: string;
  serving_size: string;
  notes?: string;
}

export type ProductCharacteristics = Record<string, string>;


export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline?: string | null;
  description?: string | null;
  category_id?: string | null;
  category?: Category | null;
  ingredients: string[];
  brewing_guide: BrewingGuide;
  characteristics: ProductCharacteristics;
  packaging_info?: string | null;
  price: number;
  weight_grams?: number | null;
  featured_image?: string | null;
  gallery: string[];
  is_featured: boolean;
  status: ProductStatus;
  seo_title?: string | null;
  seo_description?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  category_id?: string | null;
  category?: Category | null;
  featured_image?: string | null;
  author_name: string;
  read_time_minutes: number;
  is_featured: boolean;
  status: ArticleStatus;
  seo_title?: string | null;
  seo_description?: string | null;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PageContent {
  id: string;
  slug: string;
  title: string;
  sections: Record<string, any>;
  seo_title?: string | null;
  seo_description?: string | null;
  updated_at: string;
}

export interface MediaAsset {
  id: string;
  bucket: string;
  file_path: string;
  file_name: string;
  file_size?: number | null;
  mime_type?: string | null;
  alt_text?: string | null;
  public_url: string;
  created_at: string;
}

export interface SiteSettings {
  id: string;
  key: string;
  site_name: string;
  tagline: string;
  contact_email?: string | null;
  contact_phone?: string | null;
  contact_address?: string | null;
  social_instagram?: string | null;
  social_youtube?: string | null;
  social_tiktok?: string | null;
  raw_json?: Record<string, any>;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  ip_address?: string | null;
  created_at: string;
}

export interface AdminProfile {
  id: string;
  email: string;
  full_name: string;
  role: AdminRole;
  created_at: string;
  updated_at: string;
}
