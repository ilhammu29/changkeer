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

// ============================================================================
// E-COMMERCE & CAFE BREW BAR ORDERING TYPES
// ============================================================================

export type OrderType = 'dine_in' | 'takeaway' | 'delivery';
export type OrderStatus = 'received' | 'brewing' | 'ready' | 'completed' | 'cancelled';
export type PaymentMethod = 'qris' | 'cashier' | 'bank_transfer';
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded';
export type DiscountType = 'percentage' | 'fixed';

export interface BotanicalAddon {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  cart_item_id: string; // unique key in cart
  product_id: string;
  product_name: string;
  product_slug: string;
  product_image?: string | null;
  serving_size: 'regular' | 'pot';
  temperature: 'hot' | 'iced';
  sweetness_level: '0%' | '25%' | '50%' | '100%';
  ice_level?: 'normal' | 'less' | 'none';
  selected_addons: BotanicalAddon[];
  unit_price: number;
  quantity: number;
  subtotal: number;
  item_notes?: string;
}

export interface Voucher {
  id: string;
  code: string;
  title: string;
  description?: string | null;
  discount_type: DiscountType;
  discount_value: number;
  min_spend: number;
  max_discount?: number | null;
  quota: number;
  used_count: number;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CafeTable {
  id: string;
  table_number: string;
  capacity: number;
  description?: string | null;
  is_active: boolean;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string | null;
  product_name: string;
  product_slug: string;
  product_image?: string | null;
  serving_size: string;
  temperature: 'hot' | 'iced';
  sweetness_level: string;
  ice_level?: string | null;
  selected_addons: BotanicalAddon[];
  unit_price: number;
  quantity: number;
  subtotal: number;
  item_notes?: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id?: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  order_type: OrderType;
  table_number?: string | null;
  pickup_time?: string | null;
  delivery_address?: string | null;
  delivery_notes?: string | null;
  subtotal: number;
  discount_amount: number;
  delivery_fee: number;
  tax_amount: number;
  total_amount: number;
  voucher_id?: string | null;
  voucher_code?: string | null;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  notes?: string | null;
  paid_at?: string | null;
  completed_at?: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface CustomerProfile {
  id: string;
  email: string;
  full_name: string;
  phone_number?: string | null;
  default_address?: string | null;
  avatar_url?: string | null;
  created_at: string;
  updated_at: string;
}

