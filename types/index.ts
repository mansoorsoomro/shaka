export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'Active' | 'Inactive';
  joinDate: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive';
  joinDate: string;
  phone?: string;
}

export interface OrderItem {
  id: number;
  product_variation_id: number;
  product_name: string;
  sku: string;
  size: string;
  absorbency_level: string;
  quantity_per_pack: number;
  unit_price: number;
  quantity: number;
  subtotal: number;
}

export interface ShippingAddress {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  street_address: string;
  city: string;
  state: string;
  zip_code: string;
}

export interface ShippingMethod {
  id: number;
  name: string;
  price: number;
  business_days: number;
}

export interface OrderUser {
  id: number;
  firstname: string;
  lastname: string;
  username: string | null;
  email: string;
  dob: string | null;
  phone: string | null;
  gender: string;
  social_id: string | null;
  social_type: string | null;
  email_verifed_at: string;
  image: string | null;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: number;
  order_number: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'shipped';
  shipping_address: ShippingAddress;
  shipping_method: ShippingMethod;
  subtotal: number;
  shipping_cost: number;
  total: number;
  payment: any; // null in the response
  notes: string | null;
  items: OrderItem[];
  user: OrderUser;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: number;
  image_path: string;
  image_url: string;
  is_featured: number;
  alt_text: string;
  created_at: string;
}

export interface ProductSize {
  id: number;
  name: string;
  code: string;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface ProductVariation {
  id: number;
  product_id: number;
  size: ProductSize;
  sku: string;
  price: number;
  quantity_per_pack: number;
  stock: number;
  absorbency_level: string;
  is_active: number;
  price_per_piece: number;
  total_pieces: number;
  created_at: string;
  updated_at: string;
}

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  sku: string;
  category: ProductCategory;
  is_active: number;
  featured_image: ProductImage | null;
  images: ProductImage[];
  variations: ProductVariation[];
  created_at: string;
  updated_at: string;
}
