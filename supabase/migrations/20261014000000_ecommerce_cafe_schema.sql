-- ============================================================================
-- CHANGKEER E-COMMERCE & CAFE BREW BAR ORDERING SCHEMA
-- Migration: 20261014000000_ecommerce_cafe_schema.sql
-- ============================================================================

-- 1. Customer Profiles (Linked to Supabase Auth or guest checkout)
CREATE TABLE IF NOT EXISTS customer_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone_number TEXT,
  default_address TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Vouchers & Promo Codes
CREATE TABLE IF NOT EXISTS vouchers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC(10, 2) NOT NULL,
  min_spend NUMERIC(10, 2) NOT NULL DEFAULT 0,
  max_discount NUMERIC(10, 2),
  quota INTEGER NOT NULL DEFAULT 100,
  used_count INTEGER NOT NULL DEFAULT 0,
  valid_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  valid_until TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vouchers_code ON vouchers(code);
CREATE INDEX IF NOT EXISTS idx_vouchers_active ON vouchers(is_active);

-- 3. Cafe Tables (Dine-in QR ordering)
CREATE TABLE IF NOT EXISTS cafe_tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_number VARCHAR(20) NOT NULL UNIQUE,
  capacity INTEGER NOT NULL DEFAULT 2,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  order_type TEXT NOT NULL CHECK (order_type IN ('dine_in', 'takeaway', 'delivery')),
  table_number VARCHAR(20),
  pickup_time TEXT,
  delivery_address TEXT,
  delivery_notes TEXT,
  subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0,
  discount_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  delivery_fee NUMERIC(12, 2) NOT NULL DEFAULT 0,
  tax_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  voucher_id UUID REFERENCES vouchers(id) ON DELETE SET NULL,
  voucher_code TEXT,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('qris', 'cashier', 'bank_transfer')),
  payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded')),
  order_status TEXT NOT NULL DEFAULT 'received' CHECK (order_status IN ('received', 'brewing', 'ready', 'completed', 'cancelled')),
  notes TEXT,
  paid_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_type ON orders(order_type);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);

-- 5. Order Items
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_slug TEXT NOT NULL,
  product_image TEXT,
  serving_size TEXT NOT NULL DEFAULT 'regular',
  temperature TEXT NOT NULL CHECK (temperature IN ('hot', 'iced')),
  sweetness_level TEXT NOT NULL DEFAULT '0%',
  ice_level TEXT DEFAULT 'normal',
  selected_addons JSONB NOT NULL DEFAULT '[]'::jsonb,
  unit_price NUMERIC(10, 2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  subtotal NUMERIC(12, 2) NOT NULL,
  item_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- 6. Row Level Security (RLS)
ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE cafe_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Customer Profiles RLS
DROP POLICY IF EXISTS "Customers can view own profile" ON customer_profiles;
CREATE POLICY "Customers can view own profile"
  ON customer_profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

DROP POLICY IF EXISTS "Customers can update own profile" ON customer_profiles;
CREATE POLICY "Customers can update own profile"
  ON customer_profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

DROP POLICY IF EXISTS "Customers can insert own profile" ON customer_profiles;
CREATE POLICY "Customers can insert own profile"
  ON customer_profiles FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

-- Vouchers RLS (Public can read active vouchers, admins full access)
DROP POLICY IF EXISTS "Public can view active vouchers" ON vouchers;
CREATE POLICY "Public can view active vouchers"
  ON vouchers FOR SELECT
  TO anon, authenticated
  USING (is_active = TRUE);

DROP POLICY IF EXISTS "Admins can manage vouchers" ON vouchers;
CREATE POLICY "Admins can manage vouchers"
  ON vouchers FOR ALL
  TO authenticated
  USING (id = auth.uid());

-- Cafe Tables RLS
DROP POLICY IF EXISTS "Public can view active tables" ON cafe_tables;
CREATE POLICY "Public can view active tables"
  ON cafe_tables FOR SELECT
  TO anon, authenticated
  USING (is_active = TRUE);

-- Orders RLS (Customers view own orders, public can insert, admins manage all)
DROP POLICY IF EXISTS "Anyone can insert order" ON orders;
CREATE POLICY "Anyone can insert order"
  ON orders FOR INSERT
  TO anon, authenticated
  WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Customers can view own orders" ON orders;
CREATE POLICY "Customers can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (customer_id = auth.uid());

-- Order Items RLS
DROP POLICY IF EXISTS "Anyone can insert order items" ON order_items;
CREATE POLICY "Anyone can insert order items"
  ON order_items FOR INSERT
  TO anon, authenticated
  WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Customers can view own order items" ON order_items;
CREATE POLICY "Customers can view own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
        AND orders.customer_id = auth.uid()
    )
  );

-- Initial Vouchers Seed
INSERT INTO vouchers (code, title, description, discount_type, discount_value, min_spend, max_discount, quota)
VALUES 
  ('CHANGKEERFIRST', 'Promo Seduhan Pertama', 'Diskon 20% khusus pemesanan pertama Anda di Changkeer.', 'percentage', 20.00, 30000, 25000, 500),
  ('ATELIER10K', 'Potongan Botani Rp 10.000', 'Potongan langsung Rp 10.000 untuk minimal belanja Rp 50.000.', 'fixed', 10000.00, 50000, 10000, 200),
  ('CAFEDINEIN', 'Dine-In Special Meja', 'Diskon 15% untuk santap seduhan di tempat.', 'percentage', 15.00, 35000, 20000, 300)
ON CONFLICT (code) DO NOTHING;

-- Initial Cafe Tables Seed
INSERT INTO cafe_tables (table_number, capacity, description)
VALUES
  ('Meja 01', 2, 'Meja indoor samping jendela bar'),
  ('Meja 02', 2, 'Meja indoor tengah'),
  ('Meja 03', 4, 'Sofa botanical lounge'),
  ('Meja 04', 4, 'Meja komunal kayu jati'),
  ('Meja 05', 2, 'Outdoor terrace barat'),
  ('Bar Meja 06', 1, 'Brew Bar counter seat')
ON CONFLICT (table_number) DO NOTHING;
