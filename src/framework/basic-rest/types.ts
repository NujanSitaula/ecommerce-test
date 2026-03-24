import { QueryKey } from '@tanstack/react-query';

export type CollectionsQueryOptionsType = {
  text?: string;
  collection?: string;
  status?: string;
  limit?: number;
};

export type CategoriesQueryOptionsType = {
  text?: string;
  category?: string;
  status?: string;
  limit?: number;
};
export type ProductsQueryOptionsType = {
  type: string;
  text?: string;
  category?: string;
  status?: string;
  limit?: number;
};
export type QueryOptionsType = {
  text?: string;
  category?: string;
  status?: string;
  limit?: number;
};

export type QueryParamsType = {
  queryKey: QueryKey;
  pageParam?: string;
};
export type Attachment = {
  id: string | number;
  thumbnail: string;
  original: string;
};
export type Category = {
  id: number | string;
  name: string;
  slug: string;
  details?: string;
  image?: Attachment;
  icon?: string;
  children?: [Category];
  products?: Product[];
  productCount?: number;
  [key: string]: unknown;
};
export type Collection = {
  id: number | string;
  name: string;
  slug: string;
  details?: string;
  image?: Attachment;
  icon?: string;
  products?: Product[];
  productCount?: number;
};
export type Brand = {
  id: number | string;
  name: string;
  slug: string;
  image?: Attachment;
  [key: string]: unknown;
};
export type Dietary = {
  id: number | string;
  name: string;
  slug: string;
  [key: string]: unknown;
};
export type Tag = {
  id: string | number;
  name: string;
  slug: string;
};
export type ProductPersonalizationOption = {
  id: number;
  product_id: number;
  name: string;
  type: 'text' | 'number' | 'select' | 'color' | 'file_upload' | 'checkbox';
  required: boolean;
  options?: string[];
  max_length?: number;
  price_adjustment?: number;
  order: number;
};

export type Product = {
  id: number | string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  sold: number;
  unit: string;
  sale_price?: number;
  min_price?: number;
  max_price?: number;
  image: Attachment;
  sku?: string;
  gallery?: Attachment[];
  category?: Category;
  tag?: Tag[];
  meta?: any[];
  brand?: Brand;
  description?: string;
  variations?: object;
  // Etsy-like inventory fields
  inventory_type?: 'in_stock' | 'made_to_order' | 'both';
  production_time_days?: number;
  min_quantity?: number;
  max_quantity?: number;
  available_quantity?: number;
  is_low_stock?: boolean;
  track_inventory?: boolean;
  personalization_options?: ProductPersonalizationOption[];
  seo?: {
    seo_title?: string | null;
    seo_description?: string | null;
    seo_keywords?: string | null;
    canonical_url?: string | null;
    meta_robots?: string | null;
    og_title?: string | null;
    og_description?: string | null;
    og_image_url?: string | null;
    og_type?: string | null;
    og_url_override?: string | null;
    twitter_title?: string | null;
    twitter_description?: string | null;
    twitter_image_url?: string | null;
    twitter_card_type?: string | null;
    seo_status?: 'red' | 'yellow' | 'green' | null;
    seo_score?: number | null;
    [key: string]: unknown;
  } | null;
  [key: string]: unknown;
};
export type OrderItem = {
  id: number | string;
  name: string;
  price: number;
  quantity: number;
};
export type Order = {
  id: string | number;
  name?: string;
  slug?: string;
  products?: OrderItem[];
  items?: OrderItem[];
  total: number;
  subtotal?: number;
  tracking_number?: string;
  customer?: {
    id: number;
    email: string;
  };
  guest_email?: string | null;
  user_id?: number | null;
  shipping_fee?: number;
  shipping_discount?: number;
  discount_amount?: number;
  tax_amount?: number;
  payment_gateway?: string;
  payment_method?: {
    brand?: string | null;
    last4?: string | null;
    cardholder_name?: string | null;
  } | null;
  status?: string;
  delivery_date?: string;
  gift_wrapped?: boolean;
  leave_at_door?: boolean;
  delivery_instructions?: string | null;
  contact_number?: {
    title?: string | null;
    phone?: string | null;
  } | null;
  address?: any;
};

export type ShopsQueryOptionsType = {
  text?: string;
  shop?: Shop;
  status?: string;
  limit?: number;
};

export type Shop = {
  id: string | number;
  owner_id: string | number;
  owner_name: string;
  address: string;
  phone: string;
  website: string;
  ratings: string;
  name: string;
  slug: string;
  description: string;
  cover_image: Attachment;
  logo: Attachment;
  socialShare: any;
  created_at: string;
  updated_at: string;
};
