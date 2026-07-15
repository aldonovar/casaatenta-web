/*
  ARCHIVED DESIGN DRAFT

  This first schema draft is intentionally kept inside the migration for review
  history, but is not executed. The deployable storefront schema starts after
  the closing marker below. Keeping only one executable model prevents duplicate
  table names and guarantees that the application and database use the same
  `store_*` contract.

-- Casa Atenta e-commerce foundation.
--
-- Security model:
--   * anon/authenticated may only read catalog rows that are currently published.
--   * authenticated customers may manage only their own profile and addresses,
--     and may read only their own customer-visible order and shipment history.
--   * checkout, payments, inventory, promotions administration, staff data,
--     audit records and the transactional outbox are server-side operations.
--   * service_role is deliberately granted only the privileges it needs below.

create extension if not exists pgcrypto with schema extensions;

-- Non-exposed schema for transactional entry points. It is intentionally not
-- included in the Data API schemas configured by Supabase.
create schema if not exists commerce_private;
revoke all on schema commerce_private from public, anon, authenticated, service_role;
grant usage on schema commerce_private to service_role;

-- ---------------------------------------------------------------------------
-- Customer accounts
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text check (display_name is null or char_length(btrim(display_name)) between 1 and 160),
  first_name text check (first_name is null or char_length(btrim(first_name)) between 1 and 80),
  last_name text check (last_name is null or char_length(btrim(last_name)) between 1 and 120),
  phone text check (phone is null or char_length(phone) between 7 and 30),
  avatar_url text check (avatar_url is null or char_length(avatar_url) <= 2048),
  preferred_locale text not null default 'es-PE'
    check (preferred_locale ~ '^[a-z]{2}(-[A-Z]{2})?$'),
  preferred_currency text not null default 'PEN'
    check (preferred_currency ~ '^[A-Z]{3}$'),
  marketing_consent boolean not null default false,
  marketing_consent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_marketing_consent_timestamp check (
    not marketing_consent or marketing_consent_at is not null
  )
);

create table public.customer_addresses (
  id uuid primary key default extensions.gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  label text check (label is null or char_length(btrim(label)) between 1 and 80),
  recipient_name text not null check (char_length(btrim(recipient_name)) between 2 and 160),
  recipient_phone text not null check (char_length(recipient_phone) between 7 and 30),
  document_type text check (document_type is null or char_length(document_type) between 2 and 24),
  document_number text check (document_number is null or char_length(document_number) between 5 and 24),
  address_line_1 text not null check (char_length(btrim(address_line_1)) between 3 and 240),
  address_line_2 text check (address_line_2 is null or char_length(address_line_2) <= 240),
  district text not null check (char_length(btrim(district)) between 1 and 120),
  province text not null check (char_length(btrim(province)) between 1 and 120),
  department text not null check (char_length(btrim(department)) between 1 and 120),
  postal_code text check (postal_code is null or char_length(postal_code) <= 20),
  country_code text not null default 'PE' check (country_code ~ '^[A-Z]{2}$'),
  delivery_reference text check (delivery_reference is null or char_length(delivery_reference) <= 500),
  latitude numeric(9, 6) check (latitude is null or latitude between -90 and 90),
  longitude numeric(9, 6) check (longitude is null or longitude between -180 and 180),
  is_default_shipping boolean not null default false,
  is_default_billing boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Catalog
-- ---------------------------------------------------------------------------

create table public.brands (
  id uuid primary key default extensions.gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null check (char_length(btrim(name)) between 1 and 160),
  description text check (description is null or char_length(description) <= 5000),
  logo_url text check (logo_url is null or char_length(logo_url) <= 2048),
  website_url text check (website_url is null or char_length(website_url) <= 2048),
  country_code text check (country_code is null or country_code ~ '^[A-Z]{2}$'),
  is_published boolean not null default false,
  sort_order integer not null default 0 check (sort_order >= 0),
  seo jsonb not null default '{}'::jsonb check (jsonb_typeof(seo) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default extensions.gen_random_uuid(),
  parent_id uuid references public.categories(id) on delete restrict,
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null check (char_length(btrim(name)) between 1 and 160),
  description text check (description is null or char_length(description) <= 5000),
  image_url text check (image_url is null or char_length(image_url) <= 2048),
  is_published boolean not null default false,
  sort_order integer not null default 0 check (sort_order >= 0),
  seo jsonb not null default '{}'::jsonb check (jsonb_typeof(seo) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint categories_not_own_parent check (parent_id is null or parent_id <> id)
);

create table public.products (
  id uuid primary key default extensions.gen_random_uuid(),
  brand_id uuid not null references public.brands(id) on delete restrict,
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null check (char_length(btrim(name)) between 1 and 240),
  short_description text check (short_description is null or char_length(short_description) <= 1000),
  description text check (description is null or char_length(description) <= 30000),
  status text not null default 'draft' check (status in ('draft', 'active', 'archived')),
  commercial_status text not null default 'pending' check (commercial_status in ('pending', 'approved', 'suspended')),
  commercial_verified_at timestamptz,
  commercial_verified_by uuid references auth.users(id) on delete set null,
  published_at timestamptz,
  requires_shipping boolean not null default true,
  warranty_months integer check (warranty_months is null or warranty_months between 0 and 240),
  attributes jsonb not null default '{}'::jsonb check (jsonb_typeof(attributes) = 'object'),
  seo jsonb not null default '{}'::jsonb check (jsonb_typeof(seo) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_categories (
  product_id uuid not null references public.products(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete restrict,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  primary key (product_id, category_id)
);

create table public.product_variants (
  id uuid primary key default extensions.gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  sku text not null unique check (char_length(btrim(sku)) between 1 and 100),
  barcode text check (barcode is null or char_length(barcode) between 4 and 64),
  name text not null check (char_length(btrim(name)) between 1 and 200),
  option_values jsonb not null default '{}'::jsonb check (jsonb_typeof(option_values) = 'object'),
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  price_minor bigint not null check (price_minor between 0 and 9000000000000000),
  compare_at_price_minor bigint check (
    compare_at_price_minor is null or
    compare_at_price_minor between price_minor and 9000000000000000
  ),
  weight_grams integer check (weight_grams is null or weight_grams between 0 and 100000000),
  length_mm integer check (length_mm is null or length_mm between 0 and 1000000),
  width_mm integer check (width_mm is null or width_mm between 0 and 1000000),
  height_mm integer check (height_mm is null or height_mm between 0 and 1000000),
  taxable boolean not null default true,
  tax_included boolean not null default true,
  allow_backorder boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'active', 'archived')),
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, product_id)
);

create table public.product_media (
  id uuid primary key default extensions.gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  variant_id uuid,
  media_type text not null check (media_type in ('image', 'video', 'spin_360')),
  url text not null check (char_length(url) between 1 and 2048),
  alt_text text check (alt_text is null or char_length(alt_text) <= 240),
  mime_type text check (mime_type is null or char_length(mime_type) <= 120),
  width_px integer check (width_px is null or width_px > 0),
  height_px integer check (height_px is null or height_px > 0),
  sort_order integer not null default 0 check (sort_order >= 0),
  is_primary boolean not null default false,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (variant_id, product_id)
    references public.product_variants(id, product_id) on delete cascade
);

create table public.product_documents (
  id uuid primary key default extensions.gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  document_type text not null
    check (document_type in ('manual', 'datasheet', 'certificate', 'warranty', 'safety', 'other')),
  title text not null check (char_length(btrim(title)) between 1 and 240),
  url text not null check (char_length(url) between 1 and 2048),
  mime_type text check (mime_type is null or char_length(mime_type) <= 120),
  language_code text not null default 'es' check (language_code ~ '^[a-z]{2}(-[A-Z]{2})?$'),
  version text check (version is null or char_length(version) <= 80),
  file_size_bytes bigint check (file_size_bytes is null or file_size_bytes >= 0),
  sort_order integer not null default 0 check (sort_order >= 0),
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Inventory
-- ---------------------------------------------------------------------------

create table public.inventory_locations (
  id uuid primary key default extensions.gen_random_uuid(),
  code text not null unique check (char_length(btrim(code)) between 1 and 60),
  name text not null check (char_length(btrim(name)) between 1 and 160),
  location_type text not null default 'warehouse'
    check (location_type in ('warehouse', 'store', 'supplier', 'virtual')),
  address jsonb not null default '{}'::jsonb check (jsonb_typeof(address) = 'object'),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.inventory_levels (
  variant_id uuid not null references public.product_variants(id) on delete restrict,
  location_id uuid not null references public.inventory_locations(id) on delete restrict,
  on_hand_quantity bigint not null default 0 check (on_hand_quantity >= 0),
  reserved_quantity bigint not null default 0 check (reserved_quantity >= 0),
  safety_stock_quantity bigint not null default 0 check (safety_stock_quantity >= 0),
  available_quantity bigint generated always as (on_hand_quantity - reserved_quantity) stored,
  updated_at timestamptz not null default now(),
  primary key (variant_id, location_id),
  constraint inventory_levels_reserved_not_above_stock check (reserved_quantity <= on_hand_quantity)
);

-- ---------------------------------------------------------------------------
-- Promotions, coupons and merchandising
-- ---------------------------------------------------------------------------

create table public.promotions (
  id uuid primary key default extensions.gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null check (char_length(btrim(name)) between 1 and 200),
  description text check (description is null or char_length(description) <= 5000),
  discount_type text not null check (discount_type in ('percentage', 'fixed_amount', 'free_shipping')),
  percentage_bps integer,
  amount_minor bigint,
  currency text check (currency is null or currency ~ '^[A-Z]{3}$'),
  minimum_subtotal_minor bigint not null default 0
    check (minimum_subtotal_minor between 0 and 9000000000000000),
  maximum_discount_minor bigint
    check (maximum_discount_minor is null or maximum_discount_minor between 0 and 9000000000000000),
  usage_limit bigint check (usage_limit is null or usage_limit > 0),
  per_customer_limit integer check (per_customer_limit is null or per_customer_limit > 0),
  combinable boolean not null default false,
  priority integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'active', 'paused', 'expired', 'archived')),
  is_public boolean not null default false,
  starts_at timestamptz not null,
  ends_at timestamptz,
  rules jsonb not null default '{}'::jsonb check (jsonb_typeof(rules) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint promotions_valid_window check (ends_at is null or ends_at > starts_at),
  constraint promotions_discount_shape check (
    (discount_type = 'percentage' and percentage_bps between 1 and 10000 and amount_minor is null) or
    (discount_type = 'fixed_amount' and percentage_bps is null and
      amount_minor between 1 and 9000000000000000 and currency is not null) or
    (discount_type = 'free_shipping' and percentage_bps is null and amount_minor is null)
  )
);

create table public.promotion_products (
  promotion_id uuid not null references public.promotions(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  primary key (promotion_id, product_id)
);

create table public.promotion_variants (
  promotion_id uuid not null references public.promotions(id) on delete cascade,
  variant_id uuid not null references public.product_variants(id) on delete cascade,
  primary key (promotion_id, variant_id)
);

create table public.promotion_categories (
  promotion_id uuid not null references public.promotions(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  primary key (promotion_id, category_id)
);

create table public.promotion_brands (
  promotion_id uuid not null references public.promotions(id) on delete cascade,
  brand_id uuid not null references public.brands(id) on delete cascade,
  primary key (promotion_id, brand_id)
);

create table public.coupons (
  id uuid primary key default extensions.gen_random_uuid(),
  promotion_id uuid not null references public.promotions(id) on delete cascade,
  code text not null unique check (
    code = upper(code) and char_length(code) between 4 and 64 and code ~ '^[A-Z0-9_-]+$'
  ),
  status text not null default 'active' check (status in ('active', 'paused', 'expired', 'revoked')),
  valid_from timestamptz,
  valid_until timestamptz,
  maximum_redemptions bigint check (maximum_redemptions is null or maximum_redemptions > 0),
  per_customer_limit integer check (per_customer_limit is null or per_customer_limit > 0),
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, promotion_id),
  constraint coupons_valid_window check (
    valid_until is null or valid_from is null or valid_until > valid_from
  )
);

create table public.banners (
  id uuid primary key default extensions.gen_random_uuid(),
  placement text not null check (char_length(btrim(placement)) between 1 and 80),
  title text not null check (char_length(btrim(title)) between 1 and 200),
  eyebrow text check (eyebrow is null or char_length(eyebrow) <= 120),
  body text check (body is null or char_length(body) <= 1000),
  image_url text not null check (char_length(image_url) between 1 and 2048),
  mobile_image_url text check (mobile_image_url is null or char_length(mobile_image_url) <= 2048),
  image_alt text not null check (char_length(image_alt) between 1 and 240),
  destination_url text check (destination_url is null or char_length(destination_url) <= 2048),
  cta_label text check (cta_label is null or char_length(cta_label) <= 80),
  product_id uuid references public.products(id) on delete set null,
  category_id uuid references public.categories(id) on delete set null,
  starts_at timestamptz not null,
  ends_at timestamptz,
  sort_order integer not null default 0 check (sort_order >= 0),
  is_published boolean not null default false,
  targeting jsonb not null default '{}'::jsonb check (jsonb_typeof(targeting) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint banners_valid_window check (ends_at is null or ends_at > starts_at)
);

-- ---------------------------------------------------------------------------
-- Orders and immutable customer-facing history
-- All monetary values use the smallest currency unit (for example, cents).
-- ---------------------------------------------------------------------------

create table public.orders (
  id uuid primary key default extensions.gen_random_uuid(),
  order_number bigint generated always as identity unique,
  user_id uuid references auth.users(id) on delete set null,
  checkout_idempotency_key text unique
    check (checkout_idempotency_key is null or char_length(checkout_idempotency_key) between 8 and 200),
  status text not null default 'pending_payment'
    check (status in ('pending_payment', 'confirmed', 'processing', 'completed', 'cancelled')),
  payment_status text not null default 'pending'
    check (payment_status in ('pending', 'authorized', 'paid', 'partially_refunded', 'refunded', 'failed', 'cancelled')),
  fulfillment_status text not null default 'unfulfilled'
    check (fulfillment_status in ('unfulfilled', 'partially_fulfilled', 'fulfilled', 'returned', 'cancelled')),
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  subtotal_minor bigint not null check (subtotal_minor between 0 and 9000000000000000),
  discount_minor bigint not null default 0 check (discount_minor between 0 and 9000000000000000),
  shipping_minor bigint not null default 0 check (shipping_minor between 0 and 9000000000000000),
  tax_minor bigint not null default 0 check (tax_minor between 0 and 9000000000000000),
  total_minor bigint not null check (total_minor between 0 and 9000000000000000),
  refunded_minor bigint not null default 0 check (refunded_minor between 0 and 9000000000000000),
  customer_snapshot jsonb not null check (jsonb_typeof(customer_snapshot) = 'object'),
  pricing_snapshot jsonb not null default '{}'::jsonb check (jsonb_typeof(pricing_snapshot) = 'object'),
  customer_note text check (customer_note is null or char_length(customer_note) <= 2000),
  placed_at timestamptz not null default now(),
  payment_expires_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint orders_discount_not_above_subtotal check (discount_minor <= subtotal_minor),
  constraint orders_total_matches_components check (
    total_minor = subtotal_minor - discount_minor + shipping_minor + tax_minor
  ),
  constraint orders_refund_not_above_total check (refunded_minor <= total_minor)
);

create table public.order_items (
  id uuid primary key default extensions.gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  variant_id uuid not null references public.product_variants(id) on delete restrict,
  sku text not null check (char_length(sku) between 1 and 100),
  name text not null check (char_length(name) between 1 and 300),
  quantity bigint not null check (quantity between 1 and 100000),
  fulfilled_quantity bigint not null default 0 check (fulfilled_quantity >= 0),
  refunded_quantity bigint not null default 0 check (refunded_quantity >= 0),
  unit_price_minor bigint not null check (unit_price_minor between 0 and 9000000000000000),
  discount_minor bigint not null default 0 check (discount_minor between 0 and 9000000000000000),
  tax_minor bigint not null default 0 check (tax_minor between 0 and 9000000000000000),
  line_total_minor bigint not null check (line_total_minor between 0 and 9000000000000000),
  product_snapshot jsonb not null check (jsonb_typeof(product_snapshot) = 'object'),
  variant_snapshot jsonb not null check (jsonb_typeof(variant_snapshot) = 'object'),
  created_at timestamptz not null default now(),
  unique (id, order_id),
  unique (id, order_id, variant_id),
  constraint order_items_fulfilled_not_above_ordered check (fulfilled_quantity <= quantity),
  constraint order_items_refunded_not_above_ordered check (refunded_quantity <= quantity),
  constraint order_items_total_matches_components check (
    line_total_minor::numeric =
      unit_price_minor::numeric * quantity::numeric - discount_minor::numeric + tax_minor::numeric
  )
);

create table public.order_addresses (
  id uuid primary key default extensions.gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  address_type text not null check (address_type in ('shipping', 'billing')),
  address_snapshot jsonb not null check (jsonb_typeof(address_snapshot) = 'object'),
  created_at timestamptz not null default now(),
  unique (order_id, address_type)
);

create table public.order_events (
  id uuid primary key default extensions.gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  event_type text not null check (char_length(btrim(event_type)) between 1 and 80),
  from_status text check (from_status is null or char_length(from_status) <= 40),
  to_status text check (to_status is null or char_length(to_status) <= 40),
  visibility text not null default 'internal' check (visibility in ('customer', 'internal')),
  message text check (message is null or char_length(message) <= 2000),
  actor_type text not null default 'system' check (actor_type in ('system', 'customer', 'staff', 'provider')),
  actor_user_id uuid references auth.users(id) on delete set null,
  payload jsonb not null default '{}'::jsonb check (jsonb_typeof(payload) = 'object'),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Payments (OpenPay-ready, but provider-neutral)
-- Provider payloads are never exposed to customer roles.
-- ---------------------------------------------------------------------------

create table public.payments (
  id uuid primary key default extensions.gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete restrict,
  provider text not null check (char_length(btrim(provider)) between 2 and 40),
  provider_payment_id text check (provider_payment_id is null or char_length(provider_payment_id) <= 200),
  idempotency_key text not null unique check (char_length(idempotency_key) between 8 and 200),
  status text not null default 'created'
    check (status in ('created', 'pending', 'authorized', 'captured', 'failed', 'cancelled', 'partially_refunded', 'refunded')),
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  amount_minor bigint not null check (amount_minor between 0 and 9000000000000000),
  captured_minor bigint not null default 0 check (captured_minor between 0 and 9000000000000000),
  refunded_minor bigint not null default 0 check (refunded_minor between 0 and 9000000000000000),
  payment_method_type text check (payment_method_type is null or char_length(payment_method_type) <= 60),
  payment_method_snapshot jsonb not null default '{}'::jsonb
    check (jsonb_typeof(payment_method_snapshot) = 'object'),
  provider_metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(provider_metadata) = 'object'),
  failure_code text check (failure_code is null or char_length(failure_code) <= 120),
  failure_message text check (failure_message is null or char_length(failure_message) <= 2000),
  authorized_at timestamptz,
  captured_at timestamptz,
  failed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint payments_captured_not_above_amount check (captured_minor <= amount_minor),
  constraint payments_refunded_not_above_captured check (refunded_minor <= captured_minor)
);

create table public.payment_events (
  id uuid primary key default extensions.gen_random_uuid(),
  payment_id uuid not null references public.payments(id) on delete cascade,
  provider_event_id text unique check (provider_event_id is null or char_length(provider_event_id) <= 200),
  event_type text not null check (char_length(btrim(event_type)) between 1 and 120),
  payload jsonb not null check (jsonb_typeof(payload) = 'object'),
  provider_created_at timestamptz,
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  processing_error text check (processing_error is null or char_length(processing_error) <= 4000)
);

-- ---------------------------------------------------------------------------
-- Fulfillment and shipment tracking
-- ---------------------------------------------------------------------------

create table public.shipments (
  id uuid primary key default extensions.gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete restrict,
  carrier text check (carrier is null or char_length(carrier) <= 120),
  service_level text check (service_level is null or char_length(service_level) <= 120),
  tracking_number text check (tracking_number is null or char_length(tracking_number) <= 200),
  tracking_url text check (tracking_url is null or char_length(tracking_url) <= 2048),
  status text not null default 'pending'
    check (status in ('pending', 'ready', 'shipped', 'in_transit', 'out_for_delivery', 'delivered', 'exception', 'returned', 'cancelled')),
  recipient_snapshot jsonb not null check (jsonb_typeof(recipient_snapshot) = 'object'),
  estimated_delivery_at timestamptz,
  shipped_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, order_id)
);

create table public.shipment_items (
  shipment_id uuid not null,
  order_item_id uuid not null,
  order_id uuid not null,
  quantity bigint not null check (quantity > 0),
  created_at timestamptz not null default now(),
  primary key (shipment_id, order_item_id),
  foreign key (shipment_id, order_id)
    references public.shipments(id, order_id) on delete cascade,
  foreign key (order_item_id, order_id)
    references public.order_items(id, order_id) on delete restrict
);

create table public.shipment_events (
  id uuid primary key default extensions.gen_random_uuid(),
  shipment_id uuid not null references public.shipments(id) on delete cascade,
  status text not null
    check (status in ('pending', 'ready', 'shipped', 'in_transit', 'out_for_delivery', 'delivered', 'exception', 'returned', 'cancelled')),
  description text check (description is null or char_length(description) <= 2000),
  location text check (location is null or char_length(location) <= 240),
  source text not null default 'system' check (char_length(source) between 1 and 80),
  is_customer_visible boolean not null default true,
  details jsonb not null default '{}'::jsonb check (jsonb_typeof(details) = 'object'),
  occurred_at timestamptz not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Coupon use and inventory reservation ledgers
-- ---------------------------------------------------------------------------

create table public.coupon_redemptions (
  id uuid primary key default extensions.gen_random_uuid(),
  coupon_id uuid not null,
  promotion_id uuid not null,
  order_id uuid not null references public.orders(id) on delete restrict,
  user_id uuid references auth.users(id) on delete set null,
  discount_minor bigint not null check (discount_minor between 0 and 9000000000000000),
  redeemed_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  unique (coupon_id, order_id),
  foreign key (coupon_id, promotion_id)
    references public.coupons(id, promotion_id) on delete restrict
);

create table public.inventory_reservations (
  id uuid primary key default extensions.gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  order_item_id uuid not null,
  variant_id uuid not null,
  location_id uuid not null,
  quantity bigint not null check (quantity > 0),
  status text not null default 'active' check (status in ('active', 'released', 'consumed', 'expired')),
  expires_at timestamptz,
  released_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (order_item_id, order_id, variant_id)
    references public.order_items(id, order_id, variant_id) on delete cascade,
  foreign key (variant_id, location_id)
    references public.inventory_levels(variant_id, location_id) on delete restrict
);

create table public.inventory_movements (
  id uuid primary key default extensions.gen_random_uuid(),
  variant_id uuid not null,
  location_id uuid not null,
  movement_type text not null
    check (movement_type in ('receive', 'adjust', 'reserve', 'release', 'sale', 'return', 'transfer_in', 'transfer_out')),
  on_hand_delta bigint not null default 0,
  reserved_delta bigint not null default 0,
  on_hand_after bigint not null check (on_hand_after >= 0),
  reserved_after bigint not null check (reserved_after >= 0),
  order_id uuid references public.orders(id) on delete set null,
  order_item_id uuid,
  reason text check (reason is null or char_length(reason) <= 1000),
  actor_user_id uuid references auth.users(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now(),
  foreign key (variant_id, location_id)
    references public.inventory_levels(variant_id, location_id) on delete restrict,
  foreign key (order_item_id, order_id)
    references public.order_items(id, order_id) on delete set null,
  constraint inventory_movements_nonzero check (on_hand_delta <> 0 or reserved_delta <> 0),
  constraint inventory_movements_reserved_not_above_stock check (reserved_after <= on_hand_after),
  constraint inventory_movements_item_requires_order check (order_item_id is null or order_id is not null)
);

-- ---------------------------------------------------------------------------
-- Staff authorization, audit log and transactional outbox
-- ---------------------------------------------------------------------------

create table public.staff_roles (
  id uuid primary key default extensions.gen_random_uuid(),
  role_key text not null unique check (role_key ~ '^[a-z][a-z0-9_]{1,63}$'),
  name text not null check (char_length(btrim(name)) between 1 and 120),
  description text check (description is null or char_length(description) <= 1000),
  permissions jsonb not null default '[]'::jsonb check (jsonb_typeof(permissions) = 'array'),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.staff_members (
  user_id uuid primary key references auth.users(id) on delete cascade,
  title text check (title is null or char_length(title) <= 120),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.staff_role_assignments (
  user_id uuid not null references public.staff_members(user_id) on delete cascade,
  role_id uuid not null references public.staff_roles(id) on delete restrict,
  assigned_by uuid references auth.users(id) on delete set null,
  assigned_at timestamptz not null default now(),
  primary key (user_id, role_id)
);

create table public.audit_logs (
  id uuid primary key default extensions.gen_random_uuid(),
  actor_type text not null check (actor_type in ('system', 'customer', 'staff', 'provider')),
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null check (char_length(btrim(action)) between 1 and 120),
  entity_type text not null check (char_length(btrim(entity_type)) between 1 and 120),
  entity_id text check (entity_id is null or char_length(entity_id) <= 200),
  request_id text check (request_id is null or char_length(request_id) <= 200),
  before_snapshot jsonb check (before_snapshot is null or jsonb_typeof(before_snapshot) = 'object'),
  after_snapshot jsonb check (after_snapshot is null or jsonb_typeof(after_snapshot) = 'object'),
  context jsonb not null default '{}'::jsonb check (jsonb_typeof(context) = 'object'),
  created_at timestamptz not null default now()
);

create table public.outbox_events (
  id uuid primary key default extensions.gen_random_uuid(),
  topic text not null check (char_length(btrim(topic)) between 1 and 160),
  aggregate_type text not null check (char_length(btrim(aggregate_type)) between 1 and 120),
  aggregate_id text not null check (char_length(aggregate_id) between 1 and 200),
  deduplication_key text unique check (deduplication_key is null or char_length(deduplication_key) <= 240),
  payload jsonb not null check (jsonb_typeof(payload) = 'object'),
  status text not null default 'pending' check (status in ('pending', 'processing', 'published', 'failed', 'dead')),
  attempts integer not null default 0 check (attempts between 0 and 100),
  available_at timestamptz not null default now(),
  locked_at timestamptz,
  locked_by text check (locked_by is null or char_length(locked_by) <= 200),
  published_at timestamptz,
  last_error text check (last_error is null or char_length(last_error) <= 4000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Indexes: all foreign-key/RLS columns plus primary storefront access paths
-- ---------------------------------------------------------------------------

create index customer_addresses_profile_idx
  on public.customer_addresses (profile_id, updated_at desc);
create unique index customer_addresses_default_shipping_uidx
  on public.customer_addresses (profile_id) where is_default_shipping;
create unique index customer_addresses_default_billing_uidx
  on public.customer_addresses (profile_id) where is_default_billing;

create index categories_parent_idx on public.categories (parent_id);
create index categories_published_sort_idx
  on public.categories (sort_order, name) where is_published;
create index brands_published_sort_idx
  on public.brands (sort_order, name) where is_published;
create index products_brand_idx on public.products (brand_id);
create index products_published_idx
  on public.products (published_at desc) where status = 'active';
create index products_attributes_gin_idx
  on public.products using gin (attributes jsonb_path_ops);
create index product_categories_category_idx
  on public.product_categories (category_id, product_id);
create unique index product_categories_primary_uidx
  on public.product_categories (product_id) where is_primary;
create index product_variants_product_idx
  on public.product_variants (product_id, status);
create unique index product_variants_barcode_uidx
  on public.product_variants (barcode) where barcode is not null;
create unique index product_variants_default_uidx
  on public.product_variants (product_id) where is_default and status <> 'archived';
create index product_media_product_sort_idx
  on public.product_media (product_id, sort_order) where is_published;
create index product_media_variant_product_idx
  on public.product_media (variant_id, product_id) where variant_id is not null;
create unique index product_media_product_primary_uidx
  on public.product_media (product_id) where is_primary and variant_id is null;
create unique index product_media_variant_primary_uidx
  on public.product_media (variant_id) where is_primary and variant_id is not null;
create index product_documents_product_sort_idx
  on public.product_documents (product_id, sort_order) where is_published;

create index inventory_levels_location_idx on public.inventory_levels (location_id, variant_id);

create index promotions_public_window_idx
  on public.promotions (starts_at, ends_at) where status = 'active' and is_public;
create index promotion_products_product_idx on public.promotion_products (product_id, promotion_id);
create index promotion_variants_variant_idx on public.promotion_variants (variant_id, promotion_id);
create index promotion_categories_category_idx on public.promotion_categories (category_id, promotion_id);
create index promotion_brands_brand_idx on public.promotion_brands (brand_id, promotion_id);
create index coupons_promotion_idx on public.coupons (promotion_id, status);
create index banners_public_placement_idx
  on public.banners (placement, sort_order) where is_published;
create index banners_product_idx on public.banners (product_id) where product_id is not null;
create index banners_category_idx on public.banners (category_id) where category_id is not null;

create index orders_user_created_idx on public.orders (user_id, created_at desc) where user_id is not null;
create index orders_status_created_idx on public.orders (status, created_at desc);
create index order_items_order_idx on public.order_items (order_id);
create index order_items_product_idx on public.order_items (product_id);
create index order_items_variant_idx on public.order_items (variant_id);
create index order_events_order_created_idx on public.order_events (order_id, created_at);
create index order_events_actor_idx on public.order_events (actor_user_id) where actor_user_id is not null;

create index payments_order_created_idx on public.payments (order_id, created_at desc);
create unique index payments_provider_id_uidx
  on public.payments (provider, provider_payment_id) where provider_payment_id is not null;
create index payments_status_created_idx on public.payments (status, created_at);
create index payment_events_payment_received_idx on public.payment_events (payment_id, received_at);

create index shipments_order_created_idx on public.shipments (order_id, created_at desc);
create unique index shipments_tracking_uidx
  on public.shipments (carrier, tracking_number) where tracking_number is not null;
create index shipment_items_order_item_idx on public.shipment_items (order_item_id, order_id);
create index shipment_items_order_idx on public.shipment_items (order_id);
create index shipment_events_shipment_occurred_idx
  on public.shipment_events (shipment_id, occurred_at);

create index coupon_redemptions_order_idx on public.coupon_redemptions (order_id);
create index coupon_redemptions_user_coupon_idx
  on public.coupon_redemptions (user_id, coupon_id, redeemed_at desc) where user_id is not null;
create index coupon_redemptions_promotion_idx on public.coupon_redemptions (promotion_id);
create index inventory_reservations_order_idx on public.inventory_reservations (order_id);
create index inventory_reservations_order_item_idx on public.inventory_reservations (order_item_id);
create index inventory_reservations_level_idx
  on public.inventory_reservations (variant_id, location_id);
create unique index inventory_reservations_active_uidx
  on public.inventory_reservations (order_item_id, location_id) where status = 'active';
create index inventory_reservations_expiry_idx
  on public.inventory_reservations (expires_at) where status = 'active' and expires_at is not null;
create index inventory_movements_level_created_idx
  on public.inventory_movements (variant_id, location_id, created_at desc);
create index inventory_movements_order_idx
  on public.inventory_movements (order_id) where order_id is not null;
create index inventory_movements_order_item_idx
  on public.inventory_movements (order_item_id) where order_item_id is not null;
create index inventory_movements_actor_idx
  on public.inventory_movements (actor_user_id) where actor_user_id is not null;

create index staff_role_assignments_role_idx on public.staff_role_assignments (role_id, user_id);
create index staff_role_assignments_assigned_by_idx
  on public.staff_role_assignments (assigned_by) where assigned_by is not null;
create index audit_logs_actor_created_idx
  on public.audit_logs (actor_user_id, created_at desc) where actor_user_id is not null;
create index audit_logs_entity_created_idx
  on public.audit_logs (entity_type, entity_id, created_at desc);
create index outbox_events_pending_idx
  on public.outbox_events (available_at, created_at) where status in ('pending', 'failed');

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- public.set_updated_at() is created by the preceding foundation migration and
-- is SECURITY INVOKER with an empty search_path.
-- ---------------------------------------------------------------------------

create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger customer_addresses_set_updated_at before update on public.customer_addresses
for each row execute function public.set_updated_at();
create trigger brands_set_updated_at before update on public.brands
for each row execute function public.set_updated_at();
create trigger categories_set_updated_at before update on public.categories
for each row execute function public.set_updated_at();
create trigger products_set_updated_at before update on public.products
for each row execute function public.set_updated_at();
create trigger product_variants_set_updated_at before update on public.product_variants
for each row execute function public.set_updated_at();
create trigger product_media_set_updated_at before update on public.product_media
for each row execute function public.set_updated_at();
create trigger product_documents_set_updated_at before update on public.product_documents
for each row execute function public.set_updated_at();
create trigger inventory_locations_set_updated_at before update on public.inventory_locations
for each row execute function public.set_updated_at();
create trigger inventory_levels_set_updated_at before update on public.inventory_levels
for each row execute function public.set_updated_at();
create trigger promotions_set_updated_at before update on public.promotions
for each row execute function public.set_updated_at();
create trigger coupons_set_updated_at before update on public.coupons
for each row execute function public.set_updated_at();
create trigger banners_set_updated_at before update on public.banners
for each row execute function public.set_updated_at();
create trigger orders_set_updated_at before update on public.orders
for each row execute function public.set_updated_at();
create trigger payments_set_updated_at before update on public.payments
for each row execute function public.set_updated_at();
create trigger shipments_set_updated_at before update on public.shipments
for each row execute function public.set_updated_at();
create trigger inventory_reservations_set_updated_at before update on public.inventory_reservations
for each row execute function public.set_updated_at();
create trigger staff_roles_set_updated_at before update on public.staff_roles
for each row execute function public.set_updated_at();
create trigger staff_members_set_updated_at before update on public.staff_members
for each row execute function public.set_updated_at();
create trigger outbox_events_set_updated_at before update on public.outbox_events
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Profile provisioning from Supabase Auth
-- This is the sole auth.users integration: it adds an official-style trigger
-- and never changes columns, constraints, indexes or grants in the auth schema.
-- User metadata is copied only as display data and is never used for access.
-- SECURITY DEFINER is required because supabase_auth_admin cannot insert into
-- protected public tables; direct execution is revoked from every API role.
-- ---------------------------------------------------------------------------

create or replace function commerce_private.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_display_name text;
  v_avatar_url text;
begin
  v_display_name := nullif(
    btrim(left(coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      ''
    ), 160)),
    ''
  );

  v_avatar_url := nullif(left(coalesce(
    new.raw_user_meta_data ->> 'avatar_url',
    new.raw_user_meta_data ->> 'picture',
    ''
  ), 2048), '');

  insert into public.profiles (id, display_name, avatar_url)
  values (new.id, v_display_name, v_avatar_url)
  on conflict (id) do nothing;

  return new;
end;
$$;

revoke all on function commerce_private.handle_new_auth_user()
  from public, anon, authenticated, service_role;

create trigger on_auth_user_created_create_commerce_profile
after insert on auth.users
for each row execute function commerce_private.handle_new_auth_user();

-- Backfill profiles for users that existed before this migration. The values
-- remain informational and are length-bounded so malformed metadata cannot
-- make the migration or future signups fail.
insert into public.profiles (id, display_name, avatar_url)
select
  users.id,
  nullif(btrim(left(coalesce(
    users.raw_user_meta_data ->> 'full_name',
    users.raw_user_meta_data ->> 'name',
    ''
  ), 160)), ''),
  nullif(left(coalesce(
    users.raw_user_meta_data ->> 'avatar_url',
    users.raw_user_meta_data ->> 'picture',
    ''
  ), 2048), '')
from auth.users as users
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- Atomic server-side checkout
--
-- Input items are objects with variant_id, quantity and inventory_location_id.
-- Prices and product snapshots are always read from the database. Variant and
-- inventory rows are locked in deterministic UUID order to prevent overselling
-- and reduce deadlock risk. Backordered lines are not partially reserved.
-- The function is SECURITY INVOKER and executable only by service_role.
-- ---------------------------------------------------------------------------

create or replace function commerce_private.create_order(
  p_user_id uuid,
  p_currency text,
  p_customer_snapshot jsonb,
  p_shipping_address jsonb,
  p_billing_address jsonb,
  p_items jsonb,
  p_discount_minor bigint default 0,
  p_shipping_minor bigint default 0,
  p_tax_minor bigint default 0,
  p_checkout_idempotency_key text default null,
  p_customer_note text default null,
  p_pricing_snapshot jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_order_id uuid := extensions.gen_random_uuid();
  v_existing_order_id uuid;
  v_existing_user_id uuid;
  v_order_item_id uuid;
  v_item record;
  v_variant record;
  v_inventory record;
  v_subtotal numeric := 0;
  v_total numeric;
begin
  if p_currency is null or p_currency !~ '^[A-Z]{3}$' then
    raise exception using errcode = '22023', message = 'Invalid order currency';
  end if;

  if p_customer_snapshot is null or jsonb_typeof(p_customer_snapshot) <> 'object' then
    raise exception using errcode = '22023', message = 'customer_snapshot must be a JSON object';
  end if;

  if p_shipping_address is null or jsonb_typeof(p_shipping_address) <> 'object' or
     p_billing_address is null or jsonb_typeof(p_billing_address) <> 'object' then
    raise exception using errcode = '22023', message = 'Order addresses must be JSON objects';
  end if;

  if p_pricing_snapshot is null or jsonb_typeof(p_pricing_snapshot) <> 'object' then
    raise exception using errcode = '22023', message = 'pricing_snapshot must be a JSON object';
  end if;

  if p_items is null or jsonb_typeof(p_items) <> 'array' then
    raise exception using errcode = '22023', message = 'items must be a JSON array';
  end if;

  if jsonb_array_length(p_items) < 1 or jsonb_array_length(p_items) > 100 then
    raise exception using errcode = '22023', message = 'An order must contain between 1 and 100 items';
  end if;

  if p_discount_minor not between 0 and 9000000000000000 or
     p_shipping_minor not between 0 and 9000000000000000 or
     p_tax_minor not between 0 and 9000000000000000 then
    raise exception using errcode = '22023', message = 'Invalid monetary component';
  end if;

  if p_customer_note is not null and char_length(p_customer_note) > 2000 then
    raise exception using errcode = '22023', message = 'Customer note is too long';
  end if;

  if p_checkout_idempotency_key is not null and
     char_length(p_checkout_idempotency_key) not between 8 and 200 then
    raise exception using errcode = '22023', message = 'Invalid checkout idempotency key';
  end if;

  if p_checkout_idempotency_key is not null then
    select orders.id, orders.user_id
      into v_existing_order_id, v_existing_user_id
    from public.orders as orders
    where orders.checkout_idempotency_key = p_checkout_idempotency_key;

    if found then
      if v_existing_user_id is not distinct from p_user_id then
        return v_existing_order_id;
      end if;
      raise exception using errcode = '23505', message = 'Checkout idempotency key is already in use';
    end if;
  end if;

  if exists (
    select 1
    from jsonb_to_recordset(p_items) as item(
      variant_id uuid,
      quantity bigint,
      inventory_location_id uuid
    )
    group by item.variant_id
    having count(*) > 1
  ) then
    raise exception using errcode = '22023', message = 'Each variant may appear only once per order';
  end if;

  -- Validate and lock in a stable order. Locks remain held until the caller's
  -- transaction completes, so the subsequent reservation is race-free.
  for v_item in
    select item.variant_id, item.quantity, item.inventory_location_id
    from jsonb_to_recordset(p_items) as item(
      variant_id uuid,
      quantity bigint,
      inventory_location_id uuid
    )
    order by item.variant_id, item.inventory_location_id nulls last
  loop
    if v_item.variant_id is null or v_item.quantity is null or
       v_item.quantity < 1 or v_item.quantity > 100000 then
      raise exception using errcode = '22023', message = 'Invalid order item';
    end if;

    select
      variants.id,
      variants.product_id,
      variants.sku,
      variants.name as variant_name,
      variants.option_values,
      variants.currency,
      variants.price_minor,
      variants.allow_backorder,
      products.slug as product_slug,
      products.name as product_name,
      brands.id as brand_id,
      brands.name as brand_name
    into strict v_variant
    from public.product_variants as variants
    join public.products as products on products.id = variants.product_id
    join public.brands as brands on brands.id = products.brand_id
    where variants.id = v_item.variant_id
      and variants.status = 'active'
      and products.status = 'active'
      and products.published_at is not null
      and products.published_at <= now()
    for key share of variants, products;

    if v_variant.currency <> p_currency then
      raise exception using errcode = '22023', message = 'All variants must use the order currency';
    end if;

    if v_item.inventory_location_id is null and not v_variant.allow_backorder then
      raise exception using errcode = '22023', message = 'An inventory location is required for stocked variants';
    end if;

    if v_item.inventory_location_id is not null then
      select levels.on_hand_quantity, levels.reserved_quantity, levels.available_quantity
        into v_inventory
      from public.inventory_levels as levels
      where levels.variant_id = v_item.variant_id
        and levels.location_id = v_item.inventory_location_id
      for update;

      if not found and not v_variant.allow_backorder then
        raise exception using errcode = 'P0001', message = 'Inventory level does not exist';
      end if;

      if found and v_inventory.available_quantity < v_item.quantity and not v_variant.allow_backorder then
        raise exception using errcode = 'P0001', message = 'Insufficient inventory';
      end if;
    end if;

    v_subtotal := v_subtotal + v_variant.price_minor::numeric * v_item.quantity::numeric;
    if v_subtotal > 9000000000000000 then
      raise exception using errcode = '22003', message = 'Order subtotal exceeds the supported range';
    end if;
  end loop;

  if p_discount_minor::numeric > v_subtotal then
    raise exception using errcode = '22023', message = 'Discount cannot exceed subtotal';
  end if;

  v_total := v_subtotal - p_discount_minor::numeric +
    p_shipping_minor::numeric + p_tax_minor::numeric;

  if v_total < 0 or v_total > 9000000000000000 then
    raise exception using errcode = '22003', message = 'Order total exceeds the supported range';
  end if;

  insert into public.orders (
    id,
    user_id,
    checkout_idempotency_key,
    currency,
    subtotal_minor,
    discount_minor,
    shipping_minor,
    tax_minor,
    total_minor,
    customer_snapshot,
    pricing_snapshot,
    customer_note
  ) values (
    v_order_id,
    p_user_id,
    p_checkout_idempotency_key,
    p_currency,
    v_subtotal::bigint,
    p_discount_minor,
    p_shipping_minor,
    p_tax_minor,
    v_total::bigint,
    p_customer_snapshot,
    p_pricing_snapshot,
    p_customer_note
  );

  insert into public.order_addresses (order_id, address_type, address_snapshot)
  values
    (v_order_id, 'shipping', p_shipping_address),
    (v_order_id, 'billing', p_billing_address);

  for v_item in
    select item.variant_id, item.quantity, item.inventory_location_id
    from jsonb_to_recordset(p_items) as item(
      variant_id uuid,
      quantity bigint,
      inventory_location_id uuid
    )
    order by item.variant_id, item.inventory_location_id nulls last
  loop
    select
      variants.id,
      variants.product_id,
      variants.sku,
      variants.name as variant_name,
      variants.option_values,
      variants.currency,
      variants.price_minor,
      variants.allow_backorder,
      products.slug as product_slug,
      products.name as product_name,
      brands.id as brand_id,
      brands.name as brand_name
    into strict v_variant
    from public.product_variants as variants
    join public.products as products on products.id = variants.product_id
    join public.brands as brands on brands.id = products.brand_id
    where variants.id = v_item.variant_id;

    insert into public.order_items (
      order_id,
      product_id,
      variant_id,
      sku,
      name,
      quantity,
      unit_price_minor,
      line_total_minor,
      product_snapshot,
      variant_snapshot
    ) values (
      v_order_id,
      v_variant.product_id,
      v_variant.id,
      v_variant.sku,
      v_variant.product_name || ' - ' || v_variant.variant_name,
      v_item.quantity,
      v_variant.price_minor,
      (v_variant.price_minor::numeric * v_item.quantity::numeric)::bigint,
      jsonb_build_object(
        'id', v_variant.product_id,
        'slug', v_variant.product_slug,
        'name', v_variant.product_name,
        'brand', jsonb_build_object('id', v_variant.brand_id, 'name', v_variant.brand_name)
      ),
      jsonb_build_object(
        'id', v_variant.id,
        'sku', v_variant.sku,
        'name', v_variant.variant_name,
        'options', v_variant.option_values,
        'currency', v_variant.currency,
        'unit_price_minor', v_variant.price_minor
      )
    )
    returning id into v_order_item_id;

    -- Conditional UPDATE is an additional guard against overselling if an
    -- inventory row was inserted concurrently after the validation pass.
    if v_item.inventory_location_id is not null then
      update public.inventory_levels as levels
      set reserved_quantity = levels.reserved_quantity + v_item.quantity
      where levels.variant_id = v_item.variant_id
        and levels.location_id = v_item.inventory_location_id
        and levels.available_quantity >= v_item.quantity
      returning levels.on_hand_quantity, levels.reserved_quantity, levels.available_quantity
        into v_inventory;

      if found then
        insert into public.inventory_reservations (
          order_id,
          order_item_id,
          variant_id,
          location_id,
          quantity
        ) values (
          v_order_id,
          v_order_item_id,
          v_item.variant_id,
          v_item.inventory_location_id,
          v_item.quantity
        );

        insert into public.inventory_movements (
          variant_id,
          location_id,
          movement_type,
          reserved_delta,
          on_hand_after,
          reserved_after,
          order_id,
          order_item_id,
          reason
        ) values (
          v_item.variant_id,
          v_item.inventory_location_id,
          'reserve',
          v_item.quantity,
          v_inventory.on_hand_quantity,
          v_inventory.reserved_quantity,
          v_order_id,
          v_order_item_id,
          'checkout'
        );
      elsif not v_variant.allow_backorder then
        raise exception using errcode = 'P0001', message = 'Inventory changed during checkout';
      end if;
    end if;
  end loop;

  insert into public.order_events (
    order_id,
    event_type,
    to_status,
    visibility,
    message,
    actor_type
  ) values (
    v_order_id,
    'order_created',
    'pending_payment',
    'customer',
    'Pedido creado y pendiente de pago.',
    'system'
  );

  insert into public.outbox_events (
    topic,
    aggregate_type,
    aggregate_id,
    deduplication_key,
    payload
  ) values (
    'commerce.order.created',
    'order',
    v_order_id::text,
    'commerce.order.created:' || v_order_id::text,
    jsonb_build_object('order_id', v_order_id, 'user_id', p_user_id)
  );

  return v_order_id;
exception
  when no_data_found then
    raise exception using errcode = '22023', message = 'One or more variants are unavailable';
end;
$$;

comment on function commerce_private.create_order(
  uuid, text, jsonb, jsonb, jsonb, jsonb,
  bigint, bigint, bigint, text, text, jsonb
) is 'Creates an order, snapshots catalog data, reserves stock and enqueues order.created atomically. Service role only.';

revoke all on function commerce_private.create_order(
  uuid, text, jsonb, jsonb, jsonb, jsonb,
  bigint, bigint, bigint, text, text, jsonb
) from public, anon, authenticated, service_role;
grant execute on function commerce_private.create_order(
  uuid, text, jsonb, jsonb, jsonb, jsonb,
  bigint, bigint, bigint, text, text, jsonb
) to service_role;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.customer_addresses enable row level security;
alter table public.brands enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_categories enable row level security;
alter table public.product_variants enable row level security;
alter table public.product_media enable row level security;
alter table public.product_documents enable row level security;
alter table public.inventory_locations enable row level security;
alter table public.inventory_levels enable row level security;
alter table public.promotions enable row level security;
alter table public.promotion_products enable row level security;
alter table public.promotion_variants enable row level security;
alter table public.promotion_categories enable row level security;
alter table public.promotion_brands enable row level security;
alter table public.coupons enable row level security;
alter table public.banners enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_addresses enable row level security;
alter table public.order_events enable row level security;
alter table public.payments enable row level security;
alter table public.payment_events enable row level security;
alter table public.shipments enable row level security;
alter table public.shipment_items enable row level security;
alter table public.shipment_events enable row level security;
alter table public.coupon_redemptions enable row level security;
alter table public.inventory_reservations enable row level security;
alter table public.inventory_movements enable row level security;
alter table public.staff_roles enable row level security;
alter table public.staff_members enable row level security;
alter table public.staff_role_assignments enable row level security;
alter table public.audit_logs enable row level security;
alter table public.outbox_events enable row level security;

-- Customer-owned data.
create policy profiles_select_own on public.profiles
for select to authenticated
using (id = (select auth.uid()));

create policy profiles_insert_own on public.profiles
for insert to authenticated
with check (id = (select auth.uid()));

create policy profiles_update_own on public.profiles
for update to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

create policy customer_addresses_select_own on public.customer_addresses
for select to authenticated
using (profile_id = (select auth.uid()));

create policy customer_addresses_insert_own on public.customer_addresses
for insert to authenticated
with check (profile_id = (select auth.uid()));

create policy customer_addresses_update_own on public.customer_addresses
for update to authenticated
using (profile_id = (select auth.uid()))
with check (profile_id = (select auth.uid()));

create policy customer_addresses_delete_own on public.customer_addresses
for delete to authenticated
using (profile_id = (select auth.uid()));

-- Published catalog and merchandising. Time windows are evaluated in the
-- database so expired campaigns disappear without relying on a client filter.
create policy brands_read_published on public.brands
for select to anon, authenticated
using (is_published);

create policy categories_read_published on public.categories
for select to anon, authenticated
using (is_published);

create policy products_read_published on public.products
for select to anon, authenticated
using (status = 'active' and published_at is not null and published_at <= now());

create policy product_categories_read_published on public.product_categories
for select to anon, authenticated
using (
  exists (
    select 1 from public.products as products
    where products.id = product_categories.product_id
      and products.status = 'active'
      and products.published_at is not null
      and products.published_at <= now()
  )
  and exists (
    select 1 from public.categories as categories
    where categories.id = product_categories.category_id
      and categories.is_published
  )
);

create policy product_variants_read_published on public.product_variants
for select to anon, authenticated
using (
  status = 'active'
  and exists (
    select 1 from public.products as products
    where products.id = product_variants.product_id
      and products.status = 'active'
      and products.published_at is not null
      and products.published_at <= now()
  )
);

create policy product_media_read_published on public.product_media
for select to anon, authenticated
using (
  is_published
  and exists (
    select 1 from public.products as products
    where products.id = product_media.product_id
      and products.status = 'active'
      and products.published_at is not null
      and products.published_at <= now()
  )
  and (
    variant_id is null or exists (
      select 1 from public.product_variants as variants
      where variants.id = product_media.variant_id
        and variants.product_id = product_media.product_id
        and variants.status = 'active'
    )
  )
);

create policy product_documents_read_published on public.product_documents
for select to anon, authenticated
using (
  is_published
  and exists (
    select 1 from public.products as products
    where products.id = product_documents.product_id
      and products.status = 'active'
      and products.published_at is not null
      and products.published_at <= now()
  )
);

create policy promotions_read_public_active on public.promotions
for select to anon, authenticated
using (
  is_public
  and status = 'active'
  and starts_at <= now()
  and (ends_at is null or ends_at > now())
);

create policy promotion_products_read_public on public.promotion_products
for select to anon, authenticated
using (
  exists (
    select 1 from public.promotions as promotions
    where promotions.id = promotion_products.promotion_id
      and promotions.is_public
      and promotions.status = 'active'
      and promotions.starts_at <= now()
      and (promotions.ends_at is null or promotions.ends_at > now())
  )
  and exists (
    select 1 from public.products as products
    where products.id = promotion_products.product_id
      and products.status = 'active'
      and products.published_at is not null
      and products.published_at <= now()
  )
);

create policy promotion_variants_read_public on public.promotion_variants
for select to anon, authenticated
using (
  exists (
    select 1 from public.promotions as promotions
    where promotions.id = promotion_variants.promotion_id
      and promotions.is_public
      and promotions.status = 'active'
      and promotions.starts_at <= now()
      and (promotions.ends_at is null or promotions.ends_at > now())
  )
  and exists (
    select 1 from public.product_variants as variants
    join public.products as products on products.id = variants.product_id
    where variants.id = promotion_variants.variant_id
      and variants.status = 'active'
      and products.status = 'active'
      and products.published_at is not null
      and products.published_at <= now()
  )
);

create policy promotion_categories_read_public on public.promotion_categories
for select to anon, authenticated
using (
  exists (
    select 1 from public.promotions as promotions
    where promotions.id = promotion_categories.promotion_id
      and promotions.is_public
      and promotions.status = 'active'
      and promotions.starts_at <= now()
      and (promotions.ends_at is null or promotions.ends_at > now())
  )
  and exists (
    select 1 from public.categories as categories
    where categories.id = promotion_categories.category_id
      and categories.is_published
  )
);

create policy promotion_brands_read_public on public.promotion_brands
for select to anon, authenticated
using (
  exists (
    select 1 from public.promotions as promotions
    where promotions.id = promotion_brands.promotion_id
      and promotions.is_public
      and promotions.status = 'active'
      and promotions.starts_at <= now()
      and (promotions.ends_at is null or promotions.ends_at > now())
  )
  and exists (
    select 1 from public.brands as brands
    where brands.id = promotion_brands.brand_id
      and brands.is_published
  )
);

create policy banners_read_published on public.banners
for select to anon, authenticated
using (
  is_published
  and starts_at <= now()
  and (ends_at is null or ends_at > now())
);

-- Customers can read, but never mutate, their order/fulfillment history.
create policy orders_select_own on public.orders
for select to authenticated
using (user_id = (select auth.uid()));

create policy order_items_select_own on public.order_items
for select to authenticated
using (
  exists (
    select 1 from public.orders as orders
    where orders.id = order_items.order_id
      and orders.user_id = (select auth.uid())
  )
);

create policy order_addresses_select_own on public.order_addresses
for select to authenticated
using (
  exists (
    select 1 from public.orders as orders
    where orders.id = order_addresses.order_id
      and orders.user_id = (select auth.uid())
  )
);

create policy order_events_select_own_visible on public.order_events
for select to authenticated
using (
  visibility = 'customer'
  and exists (
    select 1 from public.orders as orders
    where orders.id = order_events.order_id
      and orders.user_id = (select auth.uid())
  )
);

create policy shipments_select_own on public.shipments
for select to authenticated
using (
  exists (
    select 1 from public.orders as orders
    where orders.id = shipments.order_id
      and orders.user_id = (select auth.uid())
  )
);

create policy shipment_items_select_own on public.shipment_items
for select to authenticated
using (
  exists (
    select 1 from public.orders as orders
    where orders.id = shipment_items.order_id
      and orders.user_id = (select auth.uid())
  )
);

create policy shipment_events_select_own_visible on public.shipment_events
for select to authenticated
using (
  is_customer_visible
  and exists (
    select 1
    from public.shipments as shipments
    join public.orders as orders on orders.id = shipments.order_id
    where shipments.id = shipment_events.shipment_id
      and orders.user_id = (select auth.uid())
  )
);

-- ---------------------------------------------------------------------------
-- Explicit grants (Data API exposure and least privilege)
-- ---------------------------------------------------------------------------

grant usage on schema public to anon, authenticated, service_role;

revoke all on table
  public.profiles,
  public.customer_addresses,
  public.brands,
  public.categories,
  public.products,
  public.product_categories,
  public.product_variants,
  public.product_media,
  public.product_documents,
  public.inventory_locations,
  public.inventory_levels,
  public.promotions,
  public.promotion_products,
  public.promotion_variants,
  public.promotion_categories,
  public.promotion_brands,
  public.coupons,
  public.banners,
  public.orders,
  public.order_items,
  public.order_addresses,
  public.order_events,
  public.payments,
  public.payment_events,
  public.shipments,
  public.shipment_items,
  public.shipment_events,
  public.coupon_redemptions,
  public.inventory_reservations,
  public.inventory_movements,
  public.staff_roles,
  public.staff_members,
  public.staff_role_assignments,
  public.audit_logs,
  public.outbox_events
from public, anon, authenticated, service_role;

revoke all on sequence public.orders_order_number_seq
from public, anon, authenticated, service_role;

-- Public storefront catalog.
grant select on table
  public.brands,
  public.categories,
  public.products,
  public.product_categories,
  public.product_variants,
  public.product_media,
  public.product_documents,
  public.promotions,
  public.promotion_products,
  public.promotion_variants,
  public.promotion_categories,
  public.promotion_brands,
  public.banners
to anon, authenticated;

-- Authenticated customer self-service. No INSERT/UPDATE/DELETE privilege is
-- granted on orders, payments, events or shipments.
grant select, insert, update on table public.profiles to authenticated;
grant select, insert, update, delete on table public.customer_addresses to authenticated;
grant select on table
  public.orders,
  public.order_items,
  public.order_addresses,
  public.order_events,
  public.shipments,
  public.shipment_items,
  public.shipment_events
to authenticated;

-- Mutable aggregates and administrative configuration.
grant select, insert, update, delete on table
  public.profiles,
  public.customer_addresses,
  public.brands,
  public.categories,
  public.products,
  public.product_categories,
  public.product_variants,
  public.product_media,
  public.product_documents,
  public.inventory_locations,
  public.inventory_levels,
  public.promotions,
  public.promotion_products,
  public.promotion_variants,
  public.promotion_categories,
  public.promotion_brands,
  public.coupons,
  public.banners,
  public.orders,
  public.order_items,
  public.order_addresses,
  public.payments,
  public.shipments,
  public.shipment_items,
  public.inventory_reservations,
  public.staff_roles,
  public.staff_members,
  public.staff_role_assignments,
  public.outbox_events
to service_role;

-- Append-only ledgers and provider/customer event history.
grant select, insert on table
  public.order_events,
  public.payment_events,
  public.shipment_events,
  public.coupon_redemptions,
  public.inventory_movements,
  public.audit_logs
to service_role;

grant usage, select on sequence public.orders_order_number_seq to service_role;

-- Helpful invariants for future maintainers and API consumers.
comment on column public.product_variants.price_minor is
  'Sale price in the smallest unit of currency; never floating point.';
comment on column public.orders.customer_snapshot is
  'Immutable-at-checkout customer data snapshot used for historical integrity.';
comment on column public.order_items.product_snapshot is
  'Published product snapshot captured when the order is created.';
comment on column public.order_items.variant_snapshot is
  'Variant, options and unit-price snapshot captured when the order is created.';
comment on column public.payments.payment_method_snapshot is
  'Sanitized method summary only (for example brand/last4); never PAN, CVV or raw card data.';
comment on table public.audit_logs is
  'Append-only application audit ledger. API roles cannot update or delete rows.';
comment on table public.outbox_events is
  'Transactional outbox for reliable asynchronous processing after database commits.';
*/

-- Casa Atenta Store: commerce, identity, promotions, inventory and fulfilment.
-- Monetary values are stored as integer cents (minor units) to avoid rounding.

create extension if not exists pgcrypto with schema extensions;

create table public.store_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text check (full_name is null or char_length(full_name) between 2 and 160),
  phone text check (phone is null or char_length(phone) between 7 and 30),
  document_type text check (document_type is null or document_type in ('DNI', 'CE', 'RUC', 'PASSPORT')),
  document_number text check (document_number is null or char_length(document_number) between 5 and 20),
  account_type text not null default 'person' check (account_type in ('person', 'business')),
  business_name text check (business_name is null or char_length(business_name) <= 180),
  marketing_consent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.customer_addresses (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  label text not null default 'Principal' check (char_length(label) between 1 and 60),
  recipient_name text not null check (char_length(recipient_name) between 2 and 160),
  phone text not null check (char_length(phone) between 7 and 30),
  address_line_1 text not null check (char_length(address_line_1) between 5 and 240),
  address_line_2 text check (address_line_2 is null or char_length(address_line_2) <= 160),
  department text not null check (char_length(department) between 2 and 80),
  province text check (province is null or char_length(province) <= 80),
  district text not null check (char_length(district) between 2 and 100),
  postal_code text check (postal_code is null or char_length(postal_code) <= 20),
  reference text check (reference is null or char_length(reference) <= 300),
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index customer_addresses_one_default_idx
  on public.customer_addresses (user_id) where is_default;
create index customer_addresses_user_idx on public.customer_addresses (user_id, created_at desc);

create table public.store_brands (
  id bigint generated always as identity primary key,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null unique check (char_length(name) between 2 and 100),
  description text,
  logo_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_categories (
  id bigint generated always as identity primary key,
  parent_id bigint references public.product_categories(id) on delete set null,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null check (char_length(name) between 2 and 120),
  description text,
  position integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index product_categories_parent_idx on public.product_categories (parent_id, position);

create table public.store_products (
  id uuid primary key default extensions.gen_random_uuid(),
  brand_id bigint not null references public.store_brands(id),
  category_id bigint not null references public.product_categories(id),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  sku text not null unique,
  model text not null,
  name text not null check (char_length(name) between 3 and 220),
  short_name text not null check (char_length(short_name) between 2 and 140),
  description text not null,
  status text not null default 'draft' check (status in ('draft', 'active', 'archived')),
  commercial_status text not null default 'pending'
    check (commercial_status in ('pending', 'approved', 'suspended')),
  commercial_verified_at timestamptz,
  commercial_verified_by uuid references auth.users(id) on delete set null,
  price_minor bigint check (price_minor is null or price_minor >= 0),
  compare_at_minor bigint check (compare_at_minor is null or compare_at_minor >= price_minor),
  currency char(3) not null default 'PEN',
  tax_rate numeric(5, 4) not null default 0.18 check (tax_rate between 0 and 1),
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  allow_backorder boolean not null default false,
  shipping_class text not null default 'standard' check (shipping_class in ('standard', 'heavy', 'oversize')),
  weight_grams integer check (weight_grams is null or weight_grams > 0),
  highlights jsonb not null default '[]'::jsonb check (jsonb_typeof(highlights) = 'array'),
  specifications jsonb not null default '[]'::jsonb check (jsonb_typeof(specifications) = 'array'),
  included_items jsonb not null default '[]'::jsonb check (jsonb_typeof(included_items) = 'array'),
  compatibility text,
  warranty_text text,
  seo_title text,
  seo_description text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index store_products_category_idx on public.store_products (category_id, status, published_at desc);
create index store_products_brand_idx on public.store_products (brand_id, status);
create index store_products_search_idx on public.store_products using gin (
  to_tsvector('simple', coalesce(name, '') || ' ' || coalesce(model, '') || ' ' || coalesce(sku, ''))
);

create table public.product_variants (
  id uuid primary key default extensions.gen_random_uuid(),
  product_id uuid not null references public.store_products(id) on delete cascade,
  sku text not null unique,
  name text not null,
  attributes jsonb not null default '{}'::jsonb check (jsonb_typeof(attributes) = 'object'),
  price_minor bigint check (price_minor is null or price_minor >= 0),
  compare_at_minor bigint check (compare_at_minor is null or compare_at_minor >= price_minor),
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index product_variants_product_idx on public.product_variants (product_id, is_active);

create table public.product_media (
  id bigint generated always as identity primary key,
  product_id uuid not null references public.store_products(id) on delete cascade,
  kind text not null default 'image' check (kind in ('image', 'video')),
  url text not null,
  alt_text text not null default '',
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create index product_media_product_idx on public.product_media (product_id, position);

create table public.product_sources (
  id bigint generated always as identity primary key,
  product_id uuid not null references public.store_products(id) on delete cascade,
  source_kind text not null check (source_kind in ('manufacturer', 'authorized_distributor', 'supplier_catalog', 'commercial_reference')),
  publisher text not null check (char_length(publisher) between 2 and 160),
  label text not null check (char_length(label) between 2 and 220),
  source_url text not null,
  document_version text,
  verified_fields jsonb not null default '[]'::jsonb check (jsonb_typeof(verified_fields) = 'array'),
  notes text,
  is_primary boolean not null default false,
  is_public boolean not null default true,
  checked_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (product_id, source_url)
);

create index product_sources_product_idx on public.product_sources (product_id, is_primary desc, checked_at desc);

create table public.inventory_locations (
  id bigint generated always as identity primary key,
  code text not null unique,
  name text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.inventory_levels (
  id bigint generated always as identity primary key,
  product_id uuid not null references public.store_products(id) on delete cascade,
  variant_id uuid references public.product_variants(id) on delete cascade,
  location_id bigint not null references public.inventory_locations(id) on delete cascade,
  on_hand integer not null default 0 check (on_hand >= 0),
  reserved integer not null default 0 check (reserved >= 0 and reserved <= on_hand),
  updated_at timestamptz not null default now(),
  unique nulls not distinct (product_id, variant_id, location_id)
);

create table public.promotions (
  id bigint generated always as identity primary key,
  name text not null,
  description text,
  kind text not null check (kind in ('percentage', 'fixed', 'free_shipping')),
  value_minor integer not null default 0 check (value_minor >= 0),
  minimum_subtotal_minor bigint not null default 0 check (minimum_subtotal_minor >= 0),
  maximum_discount_minor bigint check (maximum_discount_minor is null or maximum_discount_minor >= 0),
  starts_at timestamptz not null,
  ends_at timestamptz,
  is_active boolean not null default true,
  rules jsonb not null default '{}'::jsonb check (jsonb_typeof(rules) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    (kind = 'percentage' and value_minor between 1 and 10000)
    or (kind = 'fixed' and value_minor > 0)
    or (kind = 'free_shipping' and value_minor = 0)
  ),
  check (ends_at is null or ends_at > starts_at)
);

create index promotions_schedule_idx on public.promotions (is_active, starts_at, ends_at);

create table public.coupons (
  id bigint generated always as identity primary key,
  promotion_id bigint not null references public.promotions(id) on delete cascade,
  code text not null unique check (code = upper(code) and char_length(code) between 3 and 40),
  total_redemption_limit integer check (total_redemption_limit is null or total_redemption_limit > 0),
  per_user_limit integer not null default 1 check (per_user_limit > 0),
  redemptions_count integer not null default 0 check (redemptions_count >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.promotion_banners (
  id bigint generated always as identity primary key,
  title text not null,
  eyebrow text,
  body text,
  image_url text,
  mobile_image_url text,
  destination_url text not null default '/catalogo',
  cta_label text not null default 'Ver productos',
  placement text not null default 'home_hero' check (placement in ('home_hero', 'home_strip', 'catalog', 'account')),
  starts_at timestamptz not null,
  ends_at timestamptz,
  position integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at is null or ends_at > starts_at)
);

create index promotion_banners_schedule_idx on public.promotion_banners (placement, is_active, starts_at, ends_at);

create sequence public.store_order_number_seq;

create table public.store_orders (
  id uuid primary key default extensions.gen_random_uuid(),
  order_number text not null unique default (
    'CA-' || to_char(timezone('America/Lima', now()), 'YYYYMMDD') || '-' ||
    lpad(nextval('public.store_order_number_seq')::text, 6, '0')
  ),
  user_id uuid references auth.users(id) on delete set null,
  email text not null check (char_length(email) between 5 and 254 and email = lower(email)),
  phone text not null check (char_length(phone) between 7 and 30),
  customer_name text not null check (char_length(customer_name) between 2 and 180),
  document_type text not null check (document_type in ('DNI', 'CE', 'RUC', 'PASSPORT')),
  document_number text not null check (char_length(document_number) between 5 and 20),
  order_state text not null default 'payment_pending' check (order_state in ('payment_pending', 'confirmed', 'processing', 'ready_to_ship', 'shipped', 'delivered', 'cancelled')),
  payment_state text not null default 'pending' check (payment_state in ('pending', 'authorized', 'paid', 'failed', 'refunded', 'partially_refunded', 'chargeback')),
  fulfilment_state text not null default 'unfulfilled' check (fulfilment_state in ('unfulfilled', 'preparing', 'ready', 'shipped', 'delivered', 'returned')),
  currency char(3) not null default 'PEN',
  subtotal_minor bigint not null check (subtotal_minor >= 0),
  discount_minor bigint not null default 0 check (discount_minor >= 0),
  shipping_minor bigint not null default 0 check (shipping_minor >= 0),
  tax_minor bigint not null default 0 check (tax_minor >= 0),
  total_minor bigint not null check (total_minor >= 0),
  coupon_code text,
  shipping_method text not null default 'delivery',
  invoice_type text not null default 'receipt' check (invoice_type in ('receipt', 'invoice')),
  invoice_data jsonb not null default '{}'::jsonb check (jsonb_typeof(invoice_data) = 'object'),
  idempotency_key text unique check (idempotency_key is null or char_length(idempotency_key) between 16 and 120),
  source text not null default 'web',
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  inventory_reserved boolean not null default true,
  paid_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (total_minor = subtotal_minor - discount_minor + shipping_minor),
  check (discount_minor <= subtotal_minor),
  check (tax_minor <= total_minor)
);

create index store_orders_user_idx on public.store_orders (user_id, created_at desc);
create index store_orders_state_idx on public.store_orders (order_state, created_at desc);
create index store_orders_email_idx on public.store_orders (email, created_at desc);

create table public.store_order_items (
  id bigint generated always as identity primary key,
  order_id uuid not null references public.store_orders(id) on delete restrict,
  product_id uuid references public.store_products(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  sku text not null,
  name text not null,
  quantity integer not null check (quantity between 1 and 100),
  unit_price_minor bigint not null check (unit_price_minor >= 0),
  discount_minor bigint not null default 0 check (discount_minor >= 0),
  total_minor bigint not null check (total_minor >= 0),
  product_snapshot jsonb not null check (jsonb_typeof(product_snapshot) = 'object'),
  created_at timestamptz not null default now(),
  check (total_minor = unit_price_minor * quantity - discount_minor)
);

create index store_order_items_order_idx on public.store_order_items (order_id);

create table public.store_order_addresses (
  id bigint generated always as identity primary key,
  order_id uuid not null references public.store_orders(id) on delete restrict,
  kind text not null check (kind in ('shipping', 'billing')),
  recipient_name text not null,
  phone text not null,
  address_line_1 text not null,
  address_line_2 text,
  department text not null,
  province text,
  district text not null,
  postal_code text,
  reference text,
  created_at timestamptz not null default now(),
  unique (order_id, kind)
);

create table public.store_order_events (
  id bigint generated always as identity primary key,
  order_id uuid not null references public.store_orders(id) on delete restrict,
  event_type text not null,
  from_state text,
  to_state text,
  public_message text,
  internal_note text,
  actor_type text not null default 'system' check (actor_type in ('system', 'customer', 'staff', 'provider')),
  created_at timestamptz not null default now()
);

create index store_order_events_order_idx on public.store_order_events (order_id, created_at);

create table public.store_payments (
  id uuid primary key default extensions.gen_random_uuid(),
  order_id uuid not null references public.store_orders(id) on delete restrict,
  provider text not null default 'openpay' check (provider in ('openpay')),
  external_id text unique,
  state text not null default 'pending' check (state in ('pending', 'authorized', 'paid', 'failed', 'refunded', 'partially_refunded', 'chargeback')),
  amount_minor bigint not null check (amount_minor >= 0),
  currency char(3) not null default 'PEN',
  authorization_code text,
  card_summary jsonb not null default '{}'::jsonb check (jsonb_typeof(card_summary) = 'object'),
  provider_response jsonb not null default '{}'::jsonb check (jsonb_typeof(provider_response) = 'object'),
  failure_code text,
  failure_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index store_payments_order_idx on public.store_payments (order_id, created_at desc);

create table public.store_payment_events (
  id bigint generated always as identity primary key,
  provider text not null,
  event_key text not null unique,
  event_type text not null,
  external_payment_id text,
  payment_id uuid references public.store_payments(id) on delete set null,
  order_id uuid references public.store_orders(id) on delete set null,
  payload jsonb not null,
  processed_at timestamptz,
  processing_error text,
  received_at timestamptz not null default now()
);

create index store_payment_events_external_idx on public.store_payment_events (external_payment_id, received_at desc);

create table public.store_outbox_events (
  id bigint generated always as identity primary key,
  topic text not null check (topic in (
    'order.payment_confirmed', 'order.payment_failed', 'order.refunded',
    'shipment.updated'
  )),
  aggregate_id uuid not null,
  recipient_email text not null check (char_length(recipient_email) between 5 and 254),
  payload jsonb not null check (jsonb_typeof(payload) = 'object'),
  idempotency_key text not null unique,
  attempts integer not null default 0 check (attempts >= 0),
  max_attempts integer not null default 8 check (max_attempts between 1 and 20),
  available_at timestamptz not null default now(),
  locked_at timestamptz,
  processed_at timestamptz,
  failed_at timestamptz,
  provider_message_id text,
  last_error text,
  created_at timestamptz not null default now()
);

create index store_outbox_pending_idx on public.store_outbox_events (
  available_at, id
) where processed_at is null and failed_at is null;

create table public.store_shipments (
  id uuid primary key default extensions.gen_random_uuid(),
  order_id uuid not null references public.store_orders(id) on delete restrict,
  carrier text,
  service text,
  tracking_number text,
  tracking_url text,
  state text not null default 'preparing' check (state in ('preparing', 'ready', 'in_transit', 'delivered', 'exception', 'returned')),
  estimated_delivery_at timestamptz,
  shipped_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index store_shipments_order_idx on public.store_shipments (order_id, created_at desc);

create or replace function public.enqueue_store_shipment_notification()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_order_number text;
  v_email text;
begin
  if tg_op = 'UPDATE'
    and new.state is not distinct from old.state
    and new.tracking_number is not distinct from old.tracking_number
    and new.tracking_url is not distinct from old.tracking_url then
    return new;
  end if;

  select orders.order_number, orders.email
  into v_order_number, v_email
  from public.store_orders orders
  where orders.id = new.order_id;

  if found then
    insert into public.store_outbox_events (
      topic, aggregate_id, recipient_email, payload, idempotency_key
    ) values (
      'shipment.updated',
      new.order_id,
      v_email,
      jsonb_build_object(
        'order_number', v_order_number,
        'shipment_state', new.state,
        'carrier', new.carrier,
        'tracking_number', new.tracking_number,
        'tracking_url', new.tracking_url,
        'estimated_delivery_at', new.estimated_delivery_at
      ),
      'shipment.updated:' || new.id::text || ':' || new.state || ':' ||
        coalesce(new.tracking_number, 'none')
    )
    on conflict (idempotency_key) do nothing;
  end if;
  return new;
end;
$$;

create trigger store_shipments_enqueue_notification
after insert or update on public.store_shipments
for each row execute function public.enqueue_store_shipment_notification();

create table public.coupon_redemptions (
  id bigint generated always as identity primary key,
  coupon_id bigint not null references public.coupons(id) on delete restrict,
  order_id uuid not null unique references public.store_orders(id) on delete restrict,
  user_id uuid references auth.users(id) on delete set null,
  email text not null,
  discount_minor bigint not null check (discount_minor >= 0),
  redeemed_at timestamptz not null default now()
);

create index coupon_redemptions_user_idx on public.coupon_redemptions (coupon_id, user_id, redeemed_at desc);

create table public.customer_wishlists (
  id bigint generated always as identity primary key,
  user_id uuid not null unique references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.customer_wishlist_items (
  wishlist_id bigint not null references public.customer_wishlists(id) on delete cascade,
  product_id uuid not null references public.store_products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (wishlist_id, product_id)
);

-- Keep profiles in sync with Supabase Auth without exposing an insert endpoint.
create or replace function public.handle_new_store_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_full_name text;
begin
  v_full_name := left(
    btrim(coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      ''
    )),
    160
  );
  if char_length(v_full_name) < 2 then
    v_full_name := null;
  end if;

  insert into public.store_profiles (id, full_name)
  values (new.id, v_full_name)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_store_profile on auth.users;
create trigger on_auth_user_created_store_profile
after insert on auth.users
for each row execute function public.handle_new_store_user();

insert into public.store_profiles (id, full_name)
select
  users.id,
  case
    when char_length(left(btrim(coalesce(
      users.raw_user_meta_data ->> 'full_name',
      users.raw_user_meta_data ->> 'name',
      ''
    )), 160)) between 2 and 160
    then left(btrim(coalesce(
      users.raw_user_meta_data ->> 'full_name',
      users.raw_user_meta_data ->> 'name',
      ''
    )), 160)
    else null
  end
from auth.users users
on conflict (id) do nothing;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'store_profiles', 'customer_addresses', 'store_brands', 'product_categories',
    'store_products', 'product_variants', 'promotions', 'promotion_banners',
    'store_orders', 'store_payments', 'store_shipments', 'customer_wishlists'
  ] loop
    execute format('drop trigger if exists %I_set_updated_at on public.%I', table_name, table_name);
    execute format(
      'create trigger %I_set_updated_at before update on public.%I for each row execute function public.set_updated_at()',
      table_name,
      table_name
    );
  end loop;
end;
$$;

-- Seed the reference catalogue used by the storefront. Commercial activation
-- still requires provider-approved prices, stock, warranty and photography.
insert into public.store_brands (slug, name, description)
values ('dongcheng', 'Dongcheng', 'Herramientas eléctricas y maquinaria profesional.')
on conflict (slug) do update set name = excluded.name, description = excluded.description;

insert into public.product_categories (slug, name, description, position)
values
  ('inalambricas', 'Herramientas inalámbricas', 'Plataformas de 12 V y 20 V.', 10),
  ('perforacion-demolicion', 'Perforación y demolición', 'Equipos para concreto y obra pesada.', 20),
  ('corte-desbaste', 'Corte, desbaste y acabado', 'Corte y preparación de superficies.', 30),
  ('taller-industria', 'Taller e industria', 'Maquinaria para producción y mantenimiento.', 40),
  ('limpieza', 'Limpieza profesional', 'Aspiración para obra y taller.', 50),
  ('baterias-accesorios', 'Baterías y accesorios', 'Energía, consumibles y repuestos.', 60)
on conflict (slug) do update set name = excluded.name, description = excluded.description, position = excluded.position;

insert into public.store_products (
  id, brand_id, category_id, slug, sku, model, name, short_name, description,
  status, price_minor, compare_at_minor, stock_quantity, shipping_class, published_at
)
select
  seed.id::uuid,
  brand.id,
  category.id,
  seed.slug,
  seed.sku,
  seed.model,
  seed.name,
  seed.short_name,
  seed.description,
  seed.status,
  seed.price_minor,
  seed.compare_at_minor,
  seed.stock_quantity,
  seed.shipping_class,
  case when seed.status = 'active' then now() else null end
from (values
  ('0d74ff65-8f44-4af9-aadc-622d74c53103', 'amoladora-inalambrica-dcsm04-125pfk-20v', 'CA-DON-DCSM04-125PFK', 'DCSM04-125PFK', 'Amoladora angular inalámbrica 5" 20 V Brushless', 'Amoladora inalámbrica 5"', 'corte-desbaste', 'Amoladora profesional sin escobillas con plataforma de 20 V.', 'active', null::bigint, null::bigint, 0, 'standard'),
  ('6f497bc2-f9d7-451e-8650-03e98a0fcab1', 'martillo-demoledor-dzg10-sds-max-1500w', 'CA-DON-DZG10', 'DZG10', 'Martillo demoledor SDS-Max 1500 W 16 J', 'Demoledor SDS-Max 16 J', 'perforacion-demolicion', 'Equipo SDS-Max para demolición continua en concreto y albañilería.', 'active', null, null, 0, 'heavy'),
  ('864f4db4-a349-46fe-bd50-fdd15dff6c39', 'taladro-magnetico-djc02-23-1600w', 'CA-DON-DJC02-23', 'DJC02-23', 'Taladro magnético 1600 W', 'Taladro magnético 1600 W', 'taller-industria', 'Taladro magnético para fabricación y montaje de estructuras metálicas.', 'active', null, null, 0, 'heavy'),
  ('6904ae52-b25d-480e-91c7-fe21e366f8ea', 'aspiradora-industrial-dvc30-30l-1200w', 'CA-DON-DVC30', 'DVC30', 'Aspiradora industrial polvo y agua 30 L 1200 W', 'Aspiradora polvo/agua 30 L', 'limpieza', 'Aspiración profesional para polvo y líquidos en obra y taller.', 'active', null, null, 0, 'heavy'),
  ('42b87baa-b3b1-47de-b329-21149fe8fba3', 'compresora-silenciosa-dqe1200-30l', 'CA-DON-DQE1200-30L', 'DQE1200/30L', 'Compresora silenciosa sin aceite 30 L 1200 W', 'Compresora silenciosa 30 L', 'taller-industria', 'Compresora compacta libre de aceite para trabajo de taller.', 'active', null, null, 0, 'heavy'),
  ('fac52cb8-a029-47fa-a466-63a32f8c92cf', 'martillo-demoledor-dzg06-6s-1400w', 'CA-DON-DZG06-6S', 'DZG06-6S', 'Martillo demoledor hexagonal 17 mm 1400 W', 'Demoledor hexagonal 17 mm', 'perforacion-demolicion', 'Demoledor compacto para demolición controlada.', 'active', null, null, 0, 'heavy'),
  ('ce5ca673-0851-4aca-bd65-030462869bd2', 'multiherramienta-dcmd20em-20v-brushless', 'CA-DON-DCMD20EM', 'DCMD20EM', 'Multiherramienta oscilante 20 V Brushless', 'Multiherramienta oscilante 20 V', 'inalambricas', 'Herramienta oscilante para corte, raspado y lijado.', 'active', null, null, 0, 'standard'),
  ('f8a71c31-6efc-4f63-b9cf-3bcf8ca6c512', 'bateria-dongcheng-ffbl2040-20v-4ah', 'CA-DON-FFBL2040', 'FFBL2040', 'Batería de ion-litio 20 V Max 4 Ah', 'Batería 20 V 4 Ah', 'baterias-accesorios', 'Batería recargable para la plataforma Dongcheng 20 V Max.', 'active', null, null, 0, 'standard'),
  ('464fdfbf-c63d-4ec5-a35d-e57058fe5bce', 'bateria-dongcheng-ffbl2050-20v-5ah', 'CA-DON-FFBL2050', 'FFBL2050', 'Batería de ion-litio 20 V Max 5 Ah', 'Batería 20 V 5 Ah', 'baterias-accesorios', 'Batería recargable para la plataforma Dongcheng 20 V Max.', 'active', null, null, 0, 'standard'),
  ('5c6db192-7678-4a1d-a96d-61a8856efe6e', 'bateria-dongcheng-ffbl2060-20v-6ah', 'CA-DON-FFBL2060', 'FFBL2060', 'Batería de ion-litio 20 V Max 6 Ah', 'Batería 20 V 6 Ah', 'baterias-accesorios', 'Batería recargable para la plataforma Dongcheng 20 V Max.', 'active', null, null, 0, 'standard'),
  ('37e4b47e-fdfa-4d5b-823b-75e8031f2ccc', 'llave-impacto-dcpb698-20v-brushless', 'CA-DON-DCPB698FK', 'DCPB698FK', 'Llave de impacto inalámbrica 20 V Brushless 698 Nm', 'Llave de impacto DCPB698FK', 'inalambricas', 'Llave de impacto para montaje y mantenimiento.', 'draft', null, null, 0, 'standard'),
  ('d8f8c208-fb8d-4924-a239-0d15d0e900b6', 'sierra-circular-dcmy02-185-20v-brushless', 'CA-DON-DCMY02-185BM', 'DCMY02-185BM', 'Sierra circular inalámbrica 185 mm 20 V Brushless', 'Sierra circular 185 mm', 'corte-desbaste', 'Sierra circular inalámbrica para cortes de obra y taller.', 'draft', null, null, 0, 'standard'),
  ('c32866bb-3a59-48c7-a0ce-5a8d65e7fb65', 'lijadora-roto-orbital-dsa02-125-125mm', 'CA-DON-DSA02-125', 'DSA02-125', 'Lijadora roto orbital 125 mm', 'Lijadora roto orbital 125 mm', 'corte-desbaste', 'Lijadora para preparación y terminación de superficies.', 'draft', null, null, 0, 'standard'),
  ('23d069e2-1b54-4ad5-99a5-7a9de856e22d', 'taladro-percutor-dcjz03-13em-20v-120nm', 'CA-DON-DCJZ03-13EM', 'DCJZ03-13EM', 'Taladro percutor inalámbrico 13 mm 20 V Brushless 120 Nm', 'Taladro percutor 20 V 120 Nm', 'inalambricas', 'Taladro percutor sin escobillas para perforación y atornillado exigente.', 'draft', null, null, 0, 'standard'),
  ('264ca881-dbe6-4af3-bf8e-b8d0ed22858b', 'llave-impacto-dcpb1218fk-20v-1218nm', 'CA-DON-DCPB1218FK', 'DCPB1218FK', 'Llave de impacto inalámbrica 20 V Brushless 1218 Nm', 'Llave de impacto 1218 Nm', 'inalambricas', 'Llave de impacto de alto torque para mantenimiento industrial.', 'draft', null, null, 0, 'standard'),
  ('3c8fee14-1b80-4325-858d-8dbc2d4e16f0', 'combo-dckit26am-taladro-atornillador-impacto-20v', 'CA-DON-DCKIT26AM', 'DCKIT26AM', 'Combo 20 V Brushless: taladro percutor + atornillador de impacto', 'Combo taladro + impacto 20 V', 'inalambricas', 'Kit combinado para perforación, atornillado e instalación.', 'draft', null, null, 0, 'standard'),
  ('ce3e9f37-2a11-4745-8818-98d7af48d031', 'amoladora-angular-dsm03-115s-950w', 'CA-DON-DSM03-115S', 'DSM03-115S', 'Amoladora angular 115 mm 950 W', 'Amoladora 4 1/2" 950 W', 'corte-desbaste', 'Amoladora compacta para corte y desbaste de metal.', 'draft', null, null, 0, 'standard'),
  ('2090e79c-6c38-419c-bf1c-00bc82869592', 'electrosierra-dccs40161h2s-40v-16', 'CA-DON-DCCS40161H2S', 'DCCS40161H2S', 'Electrosierra inalámbrica 16" 40 V Brushless', 'Electrosierra 16" 40 V', 'inalambricas', 'Electrosierra brushless que combina dos baterías 20 V.', 'draft', null, null, 0, 'heavy')
) as seed(id, slug, sku, model, name, short_name, category_slug, description, status, price_minor, compare_at_minor, stock_quantity, shipping_class)
join public.store_brands brand on brand.slug = 'dongcheng'
join public.product_categories category on category.slug = seed.category_slug
on conflict (id) do update set
  name = excluded.name,
  short_name = excluded.short_name,
  description = excluded.description,
  price_minor = excluded.price_minor,
  compare_at_minor = excluded.compare_at_minor,
  stock_quantity = excluded.stock_quantity,
  updated_at = now();

insert into public.product_sources (
  product_id, source_kind, publisher, label, source_url, document_version,
  verified_fields, notes, is_primary, is_public
)
select
  product.id,
  'supplier_catalog',
  'Uyustools Perú',
  'Catálogo Dongcheng — herramientas eléctricas e inalámbricas',
  'https://uyustools.com.pe/catalogos/',
  'Edición Perú 2025',
  '["model", "technical_specifications", "included_items", "feature_icons"]'::jsonb,
  'Fuente de alcance local aportada por el proveedor. Precio, stock y garantía requieren confirmación comercial de Casa Atenta.',
  true,
  true
from public.store_products product
on conflict (product_id, source_url) do update set
  document_version = excluded.document_version,
  verified_fields = excluded.verified_fields,
  notes = excluded.notes,
  checked_at = now();

insert into public.product_sources (
  product_id, source_kind, publisher, label, source_url, document_version,
  verified_fields, notes, is_primary, is_public
)
select
  product.id,
  'manufacturer',
  'Jiangsu Dongcheng Power Tools Co., Ltd.',
  'Catálogo internacional Dongcheng',
  'https://www.dongchengtool.com/es/club/download/detail/1471762978859663361?name=C%C3%81TALOGO',
  '2025.04',
  '["brand", "product_family", "platform"]'::jsonb,
  'La configuración exacta del kit puede variar según el mercado peruano.',
  false,
  true
from public.store_products product
on conflict (product_id, source_url) do update set
  document_version = excluded.document_version,
  checked_at = now();

insert into public.product_sources (
  product_id, source_kind, publisher, label, source_url, document_version,
  verified_fields, notes, is_primary, is_public
)
select
  product.id,
  'manufacturer',
  'DongCheng Tools',
  'Ficha oficial DCPB698',
  'https://www.dongcheng-tools.com/product/20v-max-brushless-cordless-impact-wrench-3.html',
  'Consulta 2026-07-14',
  '["model", "voltage", "motor", "power", "maximum_fastening_torque"]'::jsonb,
  'La ficha oficial distingue torque de apriete y torque de arranque; deben mostrarse por separado.',
  true,
  true
from public.store_products product
where product.model = 'DCPB698FK'
on conflict (product_id, source_url) do update set
  verified_fields = excluded.verified_fields,
  notes = excluded.notes,
  checked_at = now();

insert into public.product_sources (
  product_id, source_kind, publisher, label, source_url, document_version,
  verified_fields, notes, is_primary, is_public
)
select
  product.id,
  'manufacturer',
  'Jiangsu Dongcheng Power Tools Co., Ltd.',
  source.label,
  source.url,
  'Consulta 2026-07-14',
  source.verified_fields,
  source.notes,
  true,
  true
from (values
  ('DZG10', 'Ficha oficial DZG10', 'https://www.dongchengtool.com/product/detail/1646897210349', '["power", "impact_energy", "tool_holder", "weight"]'::jsonb, 'La ficha oficial prevalece para peso y especificación base.'),
  ('DCMY02-185BM', 'Ficha oficial DCMY02-185BM', 'https://www.dongchengtool.com/product/detail/1642205994951', '["voltage", "blade_diameter", "cut_depth"]'::jsonb, 'El contenido de baterías y cargador se aprueba por lote.'),
  ('DCCS40161H2S', 'Ficha oficial global DCCS40161H2S', 'https://www.dongchengtool.com/product/detail/1732083575003', '["model", "voltage", "bar_length", "motor"]'::jsonb, 'La ficha global actual y el catálogo Perú 2025 difieren en baterías; se conserva como discrepancia por resolver.')
) as source(model, label, url, verified_fields, notes)
join public.store_products product on product.model = source.model
on conflict (product_id, source_url) do update set
  verified_fields = excluded.verified_fields,
  notes = excluded.notes,
  checked_at = now();

create or replace function public.quote_store_coupon(
  p_code text,
  p_subtotal_minor bigint,
  p_shipping_minor bigint,
  p_user_id uuid,
  p_email text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_code text := upper(btrim(p_code));
  v_coupon_id bigint;
  v_kind text;
  v_value integer;
  v_minimum bigint;
  v_maximum bigint;
  v_total_limit integer;
  v_per_user_limit integer;
  v_redemptions integer;
  v_pending integer;
  v_customer_uses integer;
  v_discount bigint := 0;
  v_shipping bigint := p_shipping_minor;
begin
  if char_length(v_code) not between 3 and 40
    or p_subtotal_minor < 0
    or p_shipping_minor < 0 then
    raise exception 'coupon_invalid';
  end if;

  select coupon.id, promotion.kind, promotion.value_minor,
         promotion.minimum_subtotal_minor, promotion.maximum_discount_minor,
         coupon.total_redemption_limit, coupon.per_user_limit,
         coupon.redemptions_count
  into v_coupon_id, v_kind, v_value, v_minimum, v_maximum,
       v_total_limit, v_per_user_limit, v_redemptions
  from public.coupons coupon
  join public.promotions promotion on promotion.id = coupon.promotion_id
  where coupon.code = v_code
    and coupon.is_active
    and promotion.is_active
    and promotion.starts_at <= now()
    and (promotion.ends_at is null or promotion.ends_at > now())
    and promotion.rules = '{}'::jsonb;

  if not found or p_subtotal_minor < v_minimum then
    raise exception 'coupon_invalid';
  end if;

  select count(*)::integer into v_pending
  from public.store_orders orders
  where orders.coupon_code = v_code
    and orders.payment_state in ('pending', 'authorized')
    and orders.created_at > now() - interval '1 hour';

  if v_total_limit is not null and v_redemptions + v_pending >= v_total_limit then
    raise exception 'coupon_limit_reached';
  end if;

  if p_user_id is null and p_email is null then
    v_customer_uses := 0;
  else
    select (
    (select count(*) from public.coupon_redemptions redemption
     where redemption.coupon_id = v_coupon_id
       and ((p_user_id is not null and redemption.user_id = p_user_id)
         or (p_user_id is null and lower(redemption.email) = lower(p_email))))
    +
    (select count(*) from public.store_orders orders
     where orders.coupon_code = v_code
       and orders.payment_state in ('pending', 'authorized')
       and orders.created_at > now() - interval '1 hour'
       and ((p_user_id is not null and orders.user_id = p_user_id)
         or (p_user_id is null and lower(orders.email) = lower(p_email))))
    )::integer into v_customer_uses;
  end if;

  if v_customer_uses >= v_per_user_limit then
    raise exception 'coupon_customer_limit_reached';
  end if;

  if v_kind = 'percentage' then
    v_discount := (p_subtotal_minor * v_value) / 10000;
  elsif v_kind = 'fixed' then
    v_discount := least(p_subtotal_minor, v_value::bigint);
  elsif v_kind = 'free_shipping' then
    v_shipping := 0;
  end if;

  if v_maximum is not null then
    v_discount := least(v_discount, v_maximum);
  end if;

  return jsonb_build_object(
    'code', v_code,
    'kind', v_kind,
    'discount_minor', v_discount,
    'shipping_minor', v_shipping,
    'total_minor', p_subtotal_minor - v_discount + v_shipping
  );
end;
$$;

-- Creates the order, immutable snapshots, address, payment attempt and stock
-- reservation in one transaction. Only the service role can execute it.
create or replace function public.create_store_order(
  p_order jsonb,
  p_items jsonb,
  p_address jsonb
)
returns table (order_id uuid, order_number text, payment_id uuid)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_order_id uuid;
  v_order_number text;
  v_payment_id uuid;
  v_items_subtotal bigint;
  v_coupon_code text;
  v_coupon_id bigint;
  v_promotion_kind text;
  v_promotion_value integer;
  v_minimum_subtotal bigint;
  v_maximum_discount bigint;
  v_total_limit integer;
  v_per_user_limit integer;
  v_redemptions_count integer;
  v_pending_uses integer;
  v_customer_uses integer;
  v_expected_discount bigint := 0;
  v_expected_shipping bigint;
  v_checkout_user_id uuid;
  v_checkout_email text;
begin
  if jsonb_typeof(p_order) <> 'object'
    or jsonb_typeof(p_items) <> 'array'
    or jsonb_typeof(p_address) <> 'object'
    or jsonb_array_length(p_items) not between 1 and 50 then
    raise exception 'invalid_checkout_payload';
  end if;

  -- Row locks make stock validation and reservation race-safe.
  perform product.id
  from public.store_products product
  join (
    select (item ->> 'product_id')::uuid as product_id
    from jsonb_array_elements(p_items) item
  ) requested on requested.product_id = product.id
  order by product.id
  for update;

  if exists (
    select 1
    from (
      select
        (item ->> 'product_id')::uuid as product_id,
        sum((item ->> 'quantity')::integer)::integer as quantity,
        min((item ->> 'unit_price_minor')::bigint) as unit_price_minor
      from jsonb_array_elements(p_items) item
      group by (item ->> 'product_id')::uuid
    ) requested
    left join public.store_products product on product.id = requested.product_id
    where product.id is null
      or product.status <> 'active'
      or product.commercial_status <> 'approved'
      or product.price_minor is null
      or product.price_minor <> requested.unit_price_minor
      or product.stock_quantity < requested.quantity
  ) then
    raise exception 'catalog_or_stock_changed';
  end if;

  select coalesce(sum(
    (item ->> 'unit_price_minor')::bigint * (item ->> 'quantity')::integer
  ), 0)
  into v_items_subtotal
  from jsonb_array_elements(p_items) item;

  if v_items_subtotal <> (p_order ->> 'subtotal_minor')::bigint then
    raise exception 'invalid_order_total';
  end if;

  v_coupon_code := upper(nullif(btrim(p_order ->> 'coupon_code'), ''));
  v_checkout_user_id := nullif(p_order ->> 'user_id', '')::uuid;
  v_checkout_email := lower(p_order ->> 'email');
  v_expected_shipping := coalesce((p_order ->> 'shipping_minor')::bigint, 0);

  if v_coupon_code is not null then
    select coupon.id, promotion.kind, promotion.value_minor,
           promotion.minimum_subtotal_minor, promotion.maximum_discount_minor,
           coupon.total_redemption_limit, coupon.per_user_limit,
           coupon.redemptions_count
    into v_coupon_id, v_promotion_kind, v_promotion_value,
         v_minimum_subtotal, v_maximum_discount, v_total_limit,
         v_per_user_limit, v_redemptions_count
    from public.coupons coupon
    join public.promotions promotion on promotion.id = coupon.promotion_id
    where coupon.code = v_coupon_code
      and coupon.is_active
      and promotion.is_active
      and promotion.starts_at <= now()
      and (promotion.ends_at is null or promotion.ends_at > now())
      and promotion.rules = '{}'::jsonb
    for update of coupon;

    if not found or v_items_subtotal < v_minimum_subtotal then
      raise exception 'coupon_invalid';
    end if;

    select count(*)::integer
    into v_pending_uses
    from public.store_orders orders
    where orders.coupon_code = v_coupon_code
      and orders.payment_state in ('pending', 'authorized')
      and orders.created_at > now() - interval '1 hour';

    if v_total_limit is not null
      and v_redemptions_count + v_pending_uses >= v_total_limit then
      raise exception 'coupon_limit_reached';
    end if;

    select
      (select count(*) from public.coupon_redemptions redemption
       where redemption.coupon_id = v_coupon_id
         and ((v_checkout_user_id is not null and redemption.user_id = v_checkout_user_id)
           or (v_checkout_user_id is null and lower(redemption.email) = v_checkout_email)))
      +
      (select count(*) from public.store_orders orders
       where orders.coupon_code = v_coupon_code
         and orders.payment_state in ('pending', 'authorized')
         and orders.created_at > now() - interval '1 hour'
         and ((v_checkout_user_id is not null and orders.user_id = v_checkout_user_id)
           or (v_checkout_user_id is null and lower(orders.email) = v_checkout_email)))
    into v_customer_uses;

    if v_customer_uses >= v_per_user_limit then
      raise exception 'coupon_customer_limit_reached';
    end if;

    if v_promotion_kind = 'percentage' then
      v_expected_discount := (v_items_subtotal * v_promotion_value) / 10000;
    elsif v_promotion_kind = 'fixed' then
      v_expected_discount := least(v_items_subtotal, v_promotion_value::bigint);
    elsif v_promotion_kind = 'free_shipping' then
      v_expected_shipping := 0;
    end if;

    if v_maximum_discount is not null then
      v_expected_discount := least(v_expected_discount, v_maximum_discount);
    end if;

    if coalesce((p_order ->> 'discount_minor')::bigint, 0) <> v_expected_discount
      or coalesce((p_order ->> 'shipping_minor')::bigint, 0) <> v_expected_shipping then
      raise exception 'coupon_quote_changed';
    end if;
  elsif coalesce((p_order ->> 'discount_minor')::bigint, 0) <> 0 then
    raise exception 'discount_requires_coupon';
  end if;

  insert into public.store_orders (
    user_id, email, phone, customer_name, document_type, document_number,
    subtotal_minor, discount_minor, shipping_minor, tax_minor, total_minor,
    coupon_code, shipping_method, invoice_type, invoice_data, idempotency_key,
    source, metadata
  ) values (
    nullif(p_order ->> 'user_id', '')::uuid,
    lower(p_order ->> 'email'),
    p_order ->> 'phone',
    p_order ->> 'customer_name',
    p_order ->> 'document_type',
    p_order ->> 'document_number',
    (p_order ->> 'subtotal_minor')::bigint,
    coalesce((p_order ->> 'discount_minor')::bigint, 0),
    coalesce((p_order ->> 'shipping_minor')::bigint, 0),
    coalesce((p_order ->> 'tax_minor')::bigint, 0),
    (p_order ->> 'total_minor')::bigint,
    v_coupon_code,
    coalesce(nullif(p_order ->> 'shipping_method', ''), 'delivery'),
    coalesce(nullif(p_order ->> 'invoice_type', ''), 'receipt'),
    coalesce(p_order -> 'invoice_data', '{}'::jsonb),
    p_order ->> 'idempotency_key',
    'web',
    coalesce(p_order -> 'metadata', '{}'::jsonb)
  ) returning id, public.store_orders.order_number into v_order_id, v_order_number;

  insert into public.store_order_items (
    order_id, product_id, sku, name, quantity, unit_price_minor,
    discount_minor, total_minor, product_snapshot
  )
  select
    v_order_id,
    (item ->> 'product_id')::uuid,
    item ->> 'sku',
    item ->> 'name',
    (item ->> 'quantity')::integer,
    (item ->> 'unit_price_minor')::bigint,
    coalesce((item ->> 'discount_minor')::bigint, 0),
    (item ->> 'unit_price_minor')::bigint * (item ->> 'quantity')::integer
      - coalesce((item ->> 'discount_minor')::bigint, 0),
    coalesce(item -> 'product_snapshot', '{}'::jsonb)
  from jsonb_array_elements(p_items) item;

  insert into public.store_order_addresses (
    order_id, kind, recipient_name, phone, address_line_1, address_line_2,
    department, province, district, postal_code, reference
  ) values (
    v_order_id,
    'shipping',
    p_address ->> 'recipient_name',
    p_address ->> 'phone',
    p_address ->> 'address_line_1',
    nullif(p_address ->> 'address_line_2', ''),
    p_address ->> 'department',
    nullif(p_address ->> 'province', ''),
    p_address ->> 'district',
    nullif(p_address ->> 'postal_code', ''),
    nullif(p_address ->> 'reference', '')
  );

  insert into public.store_order_events (
    order_id, event_type, to_state, public_message, actor_type
  ) values (
    v_order_id, 'order_created', 'payment_pending',
    'Pedido recibido. Estamos validando el pago.', 'system'
  );

  insert into public.store_payments (order_id, amount_minor, currency)
  values (v_order_id, (p_order ->> 'total_minor')::bigint, 'PEN')
  returning id into v_payment_id;

  update public.store_products product
  set stock_quantity = product.stock_quantity - requested.quantity,
      updated_at = now()
  from (
    select
      (item ->> 'product_id')::uuid as product_id,
      sum((item ->> 'quantity')::integer)::integer as quantity
    from jsonb_array_elements(p_items) item
    group by (item ->> 'product_id')::uuid
  ) requested
  where product.id = requested.product_id;

  return query select v_order_id, v_order_number, v_payment_id;
end;
$$;

create or replace function public.release_store_order_inventory(
  p_order_id uuid,
  p_failure_code text default null,
  p_failure_message text default null
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_reserved boolean;
  v_payment_state text;
begin
  select inventory_reserved, payment_state
  into v_reserved, v_payment_state
  from public.store_orders
  where id = p_order_id
  for update;

  if not found or not v_reserved or v_payment_state not in ('pending', 'failed') then
    return false;
  end if;

  update public.store_products product
  set stock_quantity = product.stock_quantity + sold.quantity,
      updated_at = now()
  from (
    select product_id, sum(quantity)::integer as quantity
    from public.store_order_items
    where order_id = p_order_id and product_id is not null
    group by product_id
  ) sold
  where product.id = sold.product_id;

  update public.store_orders
  set inventory_reserved = false,
      payment_state = 'failed',
      order_state = 'cancelled',
      cancelled_at = now(),
      updated_at = now()
  where id = p_order_id;

  update public.store_payments
  set state = 'failed',
      failure_code = left(p_failure_code, 120),
      failure_message = left(p_failure_message, 500),
      updated_at = now()
  where order_id = p_order_id
    and state in ('pending', 'authorized');

  insert into public.store_order_events (
    order_id, event_type, from_state, to_state, public_message, actor_type
  ) values (
    p_order_id, 'payment_failed', 'payment_pending', 'cancelled',
    'El pago no fue aprobado y el pedido fue cancelado.', 'provider'
  );

  insert into public.store_outbox_events (
    topic, aggregate_id, recipient_email, payload, idempotency_key
  )
  select
    'order.payment_failed', orders.id, orders.email,
    jsonb_build_object(
      'order_number', orders.order_number,
      'customer_name', orders.customer_name,
      'total_minor', orders.total_minor
    ),
    'order.payment_failed:' || orders.id::text
  from public.store_orders orders
  where orders.id = p_order_id
  on conflict (idempotency_key) do nothing;

  return true;
end;
$$;

-- Applies provider events as a single, monotonic state-machine transition.
-- The event, payment and order are locked together, so webhook retries and the
-- immediate checkout response cannot partially update payment, order, stock or
-- customer timeline state.
create or replace function public.apply_openpay_event(
  p_event_id bigint,
  p_event_type text,
  p_external_payment_id text default null,
  p_payment_id uuid default null,
  p_amount_minor bigint default null,
  p_currency text default null,
  p_authorization text default null,
  p_card_summary jsonb default '{}'::jsonb,
  p_failure_message text default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_event_processed_at timestamptz;
  v_payment_id uuid;
  v_order_id uuid;
  v_payment_state text;
  v_payment_amount bigint;
  v_payment_currency text;
  v_existing_external_id text;
  v_order_state text;
  v_order_payment_state text;
  v_inventory_reserved boolean;
  v_result text := 'processed';
begin
  select event.processed_at
  into v_event_processed_at
  from public.store_payment_events event
  where event.id = p_event_id
  for update;

  if not found then
    raise exception 'payment_event_not_found';
  end if;

  if v_event_processed_at is not null then
    return jsonb_build_object('status', 'already_processed');
  end if;

  select payment.id, payment.order_id, payment.state, payment.amount_minor,
         payment.currency, payment.external_id
  into v_payment_id, v_order_id, v_payment_state, v_payment_amount,
       v_payment_currency, v_existing_external_id
  from public.store_payments payment
  where (p_external_payment_id is not null and payment.external_id = p_external_payment_id)
     or (p_payment_id is not null and payment.id = p_payment_id)
  order by case when payment.external_id = p_external_payment_id then 0 else 1 end,
           payment.created_at desc
  limit 1
  for update;

  if not found then
    update public.store_payment_events
    set processing_error = 'Pago local no encontrado; pendiente de conciliación'
    where id = p_event_id;
    return jsonb_build_object('status', 'pending_reconciliation');
  end if;

  select orders.order_state, orders.payment_state, orders.inventory_reserved
  into v_order_state, v_order_payment_state, v_inventory_reserved
  from public.store_orders orders
  where orders.id = v_order_id
  for update;

  if not found then
    update public.store_payment_events
    set payment_id = v_payment_id,
        processing_error = 'Pedido local no encontrado; pendiente de conciliación'
    where id = p_event_id;
    return jsonb_build_object('status', 'pending_reconciliation');
  end if;

  if v_existing_external_id is not null
    and p_external_payment_id is not null
    and v_existing_external_id <> p_external_payment_id then
    update public.store_payment_events
    set payment_id = v_payment_id,
        order_id = v_order_id,
        processed_at = now(),
        processing_error = 'External payment ID no coincide con el intento local'
    where id = p_event_id;
    return jsonb_build_object('status', 'rejected_mismatch');
  end if;

  if p_payment_id is not null and v_payment_id <> p_payment_id then
    update public.store_payment_events
    set payment_id = v_payment_id,
        order_id = v_order_id,
        processed_at = now(),
        processing_error = 'Payment attempt ID no coincide con el pago encontrado'
    where id = p_event_id;
    return jsonb_build_object('status', 'rejected_mismatch');
  end if;

  if (p_amount_minor is not null and p_amount_minor <> v_payment_amount)
    or (p_currency is not null and upper(p_currency) <> v_payment_currency) then
    update public.store_payment_events
    set payment_id = v_payment_id,
        order_id = v_order_id,
        processed_at = now(),
        processing_error = 'Importe o moneda no coincide con el intento local'
    where id = p_event_id;
    return jsonb_build_object('status', 'rejected_amount_or_currency');
  end if;

  update public.store_payments
  set external_id = coalesce(external_id, p_external_payment_id),
      authorization_code = coalesce(p_authorization, authorization_code),
      card_summary = case
        when jsonb_typeof(p_card_summary) = 'object' then p_card_summary
        else '{}'::jsonb
      end,
      updated_at = now()
  where id = v_payment_id;

  if p_event_type = 'charge.succeeded' then
    if v_payment_state in ('refunded', 'chargeback') then
      v_result := 'stale_success_ignored';
    elsif v_payment_state = 'failed' or (not v_inventory_reserved and v_order_payment_state <> 'paid') then
      update public.store_payment_events
      set payment_id = v_payment_id,
          order_id = v_order_id,
          processed_at = now(),
          processing_error = 'Éxito tardío después de liberar inventario; requiere conciliación manual'
      where id = p_event_id;
      return jsonb_build_object('status', 'manual_reconciliation');
    elsif v_payment_state <> 'paid' then
      update public.store_payments
      set state = 'paid', failure_code = null, failure_message = null, updated_at = now()
      where id = v_payment_id;

      update public.store_orders
      set order_state = 'confirmed', payment_state = 'paid',
          inventory_reserved = false, paid_at = coalesce(paid_at, now()),
          updated_at = now()
      where id = v_order_id;

      insert into public.store_order_events (
        order_id, event_type, from_state, to_state, public_message, actor_type
      ) values (
        v_order_id, 'payment_confirmed', v_order_state, 'confirmed',
        'Pago confirmado. Prepararemos tu pedido.', 'provider'
      );

      with inserted_redemption as (
        insert into public.coupon_redemptions (
          coupon_id, order_id, user_id, email, discount_minor
        )
        select coupon.id, orders.id, orders.user_id, orders.email,
               orders.discount_minor
        from public.store_orders orders
        join public.coupons coupon on coupon.code = orders.coupon_code
        where orders.id = v_order_id and orders.coupon_code is not null
        on conflict (order_id) do nothing
        returning coupon_id
      )
      update public.coupons coupon
      set redemptions_count = redemptions_count + 1
      where coupon.id in (select coupon_id from inserted_redemption);

      insert into public.store_outbox_events (
        topic, aggregate_id, recipient_email, payload, idempotency_key
      )
      select
        'order.payment_confirmed', orders.id, orders.email,
        jsonb_build_object(
          'order_number', orders.order_number,
          'customer_name', orders.customer_name,
          'total_minor', orders.total_minor
        ),
        'order.payment_confirmed:' || orders.id::text
      from public.store_orders orders
      where orders.id = v_order_id
      on conflict (idempotency_key) do nothing;
    else
      v_result := 'already_paid';
    end if;
  elsif p_event_type in ('charge.failed', 'charge.cancelled') then
    if v_payment_state in ('paid', 'refunded', 'partially_refunded', 'chargeback') then
      v_result := 'stale_failure_ignored';
    elsif v_payment_state in ('pending', 'authorized') then
      update public.store_payments
      set state = 'failed', failure_message = left(p_failure_message, 500), updated_at = now()
      where id = v_payment_id;

      if v_inventory_reserved then
        update public.store_products product
        set stock_quantity = product.stock_quantity + sold.quantity,
            updated_at = now()
        from (
          select product_id, sum(quantity)::integer as quantity
          from public.store_order_items
          where order_id = v_order_id and product_id is not null
          group by product_id
        ) sold
        where product.id = sold.product_id;
      end if;

      update public.store_orders
      set inventory_reserved = false, payment_state = 'failed',
          order_state = 'cancelled', cancelled_at = coalesce(cancelled_at, now()),
          updated_at = now()
      where id = v_order_id;

      insert into public.store_order_events (
        order_id, event_type, from_state, to_state, public_message, actor_type
      ) values (
        v_order_id, 'payment_failed', v_order_state, 'cancelled',
        'El pago no fue aprobado y el pedido fue cancelado.', 'provider'
      );

      insert into public.store_outbox_events (
        topic, aggregate_id, recipient_email, payload, idempotency_key
      )
      select
        'order.payment_failed', orders.id, orders.email,
        jsonb_build_object(
          'order_number', orders.order_number,
          'customer_name', orders.customer_name,
          'total_minor', orders.total_minor
        ),
        'order.payment_failed:' || orders.id::text
      from public.store_orders orders
      where orders.id = v_order_id
      on conflict (idempotency_key) do nothing;
    else
      v_result := 'already_failed';
    end if;
  elsif p_event_type = 'charge.refunded' then
    if v_payment_state in ('paid', 'partially_refunded') then
      update public.store_payments set state = 'refunded', updated_at = now()
      where id = v_payment_id;
      update public.store_orders set payment_state = 'refunded', updated_at = now()
      where id = v_order_id;
      insert into public.store_order_events (
        order_id, event_type, public_message, actor_type
      ) values (v_order_id, 'payment_refunded', 'El reembolso fue registrado.', 'provider');

      insert into public.store_outbox_events (
        topic, aggregate_id, recipient_email, payload, idempotency_key
      )
      select
        'order.refunded', orders.id, orders.email,
        jsonb_build_object(
          'order_number', orders.order_number,
          'customer_name', orders.customer_name,
          'total_minor', orders.total_minor
        ),
        'order.refunded:' || orders.id::text
      from public.store_orders orders
      where orders.id = v_order_id
      on conflict (idempotency_key) do nothing;
    else
      v_result := 'stale_refund_ignored';
    end if;
  elsif p_event_type = 'chargeback.rejected' then
    if v_payment_state = 'chargeback' then
      update public.store_payments set state = 'paid', updated_at = now()
      where id = v_payment_id;
      update public.store_orders set payment_state = 'paid', updated_at = now()
      where id = v_order_id;
      insert into public.store_order_events (
        order_id, event_type, internal_note, actor_type
      ) values (v_order_id, 'chargeback_won', 'Openpay rechazó el contracargo.', 'provider');
    else
      v_result := 'chargeback_rejection_not_applicable';
    end if;
  elsif p_event_type in ('chargeback.created', 'chargeback.accepted') then
    if v_payment_state in ('paid', 'refunded', 'partially_refunded') then
      update public.store_payments set state = 'chargeback', updated_at = now()
      where id = v_payment_id;
      update public.store_orders set payment_state = 'chargeback', updated_at = now()
      where id = v_order_id;
      insert into public.store_order_events (
        order_id, event_type, internal_note, actor_type
      ) values (v_order_id, 'payment_chargeback', 'Evento Openpay: ' || p_event_type, 'provider');
    else
      v_result := 'stale_chargeback_ignored';
    end if;
  else
    v_result := 'event_recorded_no_state_change';
  end if;

  update public.store_payment_events
  set payment_id = v_payment_id,
      order_id = v_order_id,
      processed_at = now(),
      processing_error = null
  where id = p_event_id;

  return jsonb_build_object(
    'status', v_result,
    'payment_id', v_payment_id,
    'order_id', v_order_id
  );
end;
$$;

create or replace function public.claim_store_outbox_events(p_limit integer default 20)
returns setof public.store_outbox_events
language sql
security definer
set search_path = ''
as $$
  with candidates as (
    select event.id
    from public.store_outbox_events event
    where event.processed_at is null
      and event.failed_at is null
      and event.available_at <= now()
      and (event.locked_at is null or event.locked_at < now() - interval '10 minutes')
      and event.attempts < event.max_attempts
    order by event.available_at, event.id
    for update skip locked
    limit least(greatest(p_limit, 1), 50)
  )
  update public.store_outbox_events event
  set locked_at = now(), attempts = attempts + 1
  from candidates
  where event.id = candidates.id
  returning event.*;
$$;

create or replace function public.complete_store_outbox_event(
  p_event_id bigint,
  p_provider_message_id text
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.store_outbox_events
  set processed_at = now(), locked_at = null,
      provider_message_id = left(p_provider_message_id, 240), last_error = null
  where id = p_event_id and processed_at is null and failed_at is null;
  return found;
end;
$$;

create or replace function public.fail_store_outbox_event(
  p_event_id bigint,
  p_error text,
  p_retry_seconds integer default 300
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.store_outbox_events
  set locked_at = null,
      last_error = left(p_error, 1000),
      available_at = now() + make_interval(secs => least(greatest(p_retry_seconds, 30), 86400)),
      failed_at = case when attempts >= max_attempts then now() else null end
  where id = p_event_id and processed_at is null and failed_at is null;
  return found;
end;
$$;

-- RLS is enabled on every table exposed through PostgREST.
do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'store_profiles', 'customer_addresses', 'store_brands', 'product_categories',
    'store_products', 'product_variants', 'product_media', 'inventory_locations',
    'product_sources', 'inventory_levels', 'promotions', 'coupons', 'promotion_banners', 'store_orders',
    'store_order_items', 'store_order_addresses', 'store_order_events', 'store_payments',
    'store_payment_events', 'store_outbox_events', 'store_shipments', 'coupon_redemptions',
    'customer_wishlists', 'customer_wishlist_items'
  ] loop
    execute format('alter table public.%I enable row level security', table_name);
    execute format('revoke all on table public.%I from public, anon, authenticated, service_role', table_name);
    execute format('grant all on table public.%I to service_role', table_name);
  end loop;
end;
$$;

revoke all on sequence public.store_order_number_seq from public, anon, authenticated, service_role;
grant usage, select on sequence public.store_order_number_seq to service_role;
grant usage, select on all sequences in schema public to service_role;
grant usage, select on sequence public.customer_addresses_id_seq,
  public.customer_wishlists_id_seq to authenticated;

revoke all on function public.handle_new_store_user() from public, anon, authenticated, service_role;
revoke all on function public.enqueue_store_shipment_notification() from public, anon, authenticated, service_role;
revoke all on function public.quote_store_coupon(text, bigint, bigint, uuid, text) from public, anon, authenticated, service_role;
revoke all on function public.create_store_order(jsonb, jsonb, jsonb) from public, anon, authenticated, service_role;
revoke all on function public.release_store_order_inventory(uuid, text, text) from public, anon, authenticated, service_role;
revoke all on function public.apply_openpay_event(bigint, text, text, uuid, bigint, text, text, jsonb, text) from public, anon, authenticated, service_role;
revoke all on function public.claim_store_outbox_events(integer) from public, anon, authenticated, service_role;
revoke all on function public.complete_store_outbox_event(bigint, text) from public, anon, authenticated, service_role;
revoke all on function public.fail_store_outbox_event(bigint, text, integer) from public, anon, authenticated, service_role;
grant execute on function public.create_store_order(jsonb, jsonb, jsonb) to service_role;
grant execute on function public.quote_store_coupon(text, bigint, bigint, uuid, text) to service_role;
grant execute on function public.release_store_order_inventory(uuid, text, text) to service_role;
grant execute on function public.apply_openpay_event(bigint, text, text, uuid, bigint, text, text, jsonb, text) to service_role;
grant execute on function public.claim_store_outbox_events(integer) to service_role;
grant execute on function public.complete_store_outbox_event(bigint, text) to service_role;
grant execute on function public.fail_store_outbox_event(bigint, text, integer) to service_role;

grant select, update on public.store_profiles to authenticated;
grant select, insert, update, delete on public.customer_addresses to authenticated;
grant select on public.store_brands, public.product_categories, public.store_products,
  public.product_variants, public.product_media, public.product_sources,
  public.promotions, public.promotion_banners
  to anon, authenticated;
grant select on public.store_order_items, public.store_order_addresses,
  public.store_shipments to authenticated;
grant select (
  id, order_number, user_id, email, phone, customer_name, document_type,
  document_number, order_state, payment_state, fulfilment_state, currency,
  subtotal_minor, discount_minor, shipping_minor, tax_minor, total_minor,
  coupon_code, shipping_method, invoice_type, paid_at, cancelled_at,
  created_at, updated_at
) on public.store_orders to authenticated;
grant select (
  id, order_id, event_type, from_state, to_state, public_message,
  actor_type, created_at
) on public.store_order_events to authenticated;
grant select, insert, update, delete on public.customer_wishlists,
  public.customer_wishlist_items to authenticated;

create policy "profiles_select_own" on public.store_profiles for select to authenticated
  using ((select auth.uid()) = id);
create policy "profiles_update_own" on public.store_profiles for update to authenticated
  using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create policy "addresses_select_own" on public.customer_addresses for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "addresses_insert_own" on public.customer_addresses for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "addresses_update_own" on public.customer_addresses for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "addresses_delete_own" on public.customer_addresses for delete to authenticated
  using ((select auth.uid()) = user_id);

create policy "brands_public_read" on public.store_brands for select to anon, authenticated
  using (is_active);
create policy "categories_public_read" on public.product_categories for select to anon, authenticated
  using (is_active);
create policy "products_public_read" on public.store_products for select to anon, authenticated
  using (status = 'active' and commercial_status = 'approved' and published_at <= now());
create policy "variants_public_read" on public.product_variants for select to anon, authenticated
  using (is_active and exists (
    select 1 from public.store_products product
    where product.id = product_variants.product_id and product.status = 'active'
      and product.commercial_status = 'approved' and product.published_at <= now()
  ));
create policy "media_public_read" on public.product_media for select to anon, authenticated
  using (exists (
    select 1 from public.store_products product
    where product.id = product_media.product_id and product.status = 'active'
      and product.commercial_status = 'approved' and product.published_at <= now()
  ));
create policy "product_sources_public_read" on public.product_sources for select to anon, authenticated
  using (is_public and exists (
    select 1 from public.store_products product
    where product.id = product_sources.product_id and product.status = 'active'
      and product.commercial_status = 'approved' and product.published_at <= now()
  ));
create policy "promotions_public_read" on public.promotions for select to anon, authenticated
  using (is_active and starts_at <= now() and (ends_at is null or ends_at > now()));
create policy "banners_public_read" on public.promotion_banners for select to anon, authenticated
  using (is_active and starts_at <= now() and (ends_at is null or ends_at > now()));

create policy "orders_select_own" on public.store_orders for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "order_items_select_own" on public.store_order_items for select to authenticated
  using (exists (
    select 1 from public.store_orders orders
    where orders.id = store_order_items.order_id and orders.user_id = (select auth.uid())
  ));
create policy "order_addresses_select_own" on public.store_order_addresses for select to authenticated
  using (exists (
    select 1 from public.store_orders orders
    where orders.id = store_order_addresses.order_id and orders.user_id = (select auth.uid())
  ));
create policy "order_events_select_own" on public.store_order_events for select to authenticated
  using (exists (
    select 1 from public.store_orders orders
    where orders.id = store_order_events.order_id and orders.user_id = (select auth.uid())
  ));
create policy "shipments_select_own" on public.store_shipments for select to authenticated
  using (exists (
    select 1 from public.store_orders orders
    where orders.id = store_shipments.order_id and orders.user_id = (select auth.uid())
  ));

create policy "wishlists_select_own" on public.customer_wishlists for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "wishlists_insert_own" on public.customer_wishlists for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "wishlists_update_own" on public.customer_wishlists for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "wishlists_delete_own" on public.customer_wishlists for delete to authenticated
  using ((select auth.uid()) = user_id);
create policy "wishlist_items_select_own" on public.customer_wishlist_items for select to authenticated
  using (exists (
    select 1 from public.customer_wishlists list
    where list.id = customer_wishlist_items.wishlist_id and list.user_id = (select auth.uid())
  ));
create policy "wishlist_items_insert_own" on public.customer_wishlist_items for insert to authenticated
  with check (exists (
    select 1 from public.customer_wishlists list
    where list.id = customer_wishlist_items.wishlist_id and list.user_id = (select auth.uid())
  ));
create policy "wishlist_items_delete_own" on public.customer_wishlist_items for delete to authenticated
  using (exists (
    select 1 from public.customer_wishlists list
    where list.id = customer_wishlist_items.wishlist_id and list.user_id = (select auth.uid())
  ));
