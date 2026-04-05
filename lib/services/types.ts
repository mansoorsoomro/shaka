export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    firstname: string;
    lastname: string;
    email: string;
    dob: string;
    password: string;
    password_confirmation: string;
    phone: string;
    gender: 'male' | 'female' | 'other';
    image?: File;
}

export interface ResetPasswordData {
    token: string;
    password: string;
    password_confirmation: string;
}

export interface User {
    id: number;
    firstname: string;
    lastname: string;
    username?: string | null;
    email: string;
    phone: string;
    dob: string;
    gender: string;
    image?: string | null;
    email_verified_at?: string;
    email_verifed_at?: string;
    created_at: string;
    updated_at: string;
}

export interface ApiResponse<T = unknown> {
    status?: boolean;
    success?: boolean;
    message?: string;
    data?: T;
}

export interface AuthResponse {
    status?: boolean;
    success?: boolean;
    message: string;
    data?: {
        user: User;
        token: string;
    };
}

export interface ForgotPasswordResponse {
    status?: boolean;
    success?: boolean;
    message: string;
}

export interface VerifyCodeResponse {
    status?: boolean;
    success?: boolean;
    message: string;
    data?: {
        token: string;
    };
}

export interface GoogleRedirectResponse {
    status?: boolean;
    success?: boolean;
    url: string;
}

export interface Size {
    id: number;
    name: string;
    slug?: string;
}

export interface Role {
    id: number;
    name: string;
    slug?: string;
}

export interface ShippingMethod {
    id: number;
    name: string;
    price?: number;
    code?: string;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    image?: string;
    description?: string;
}

export interface ProductVariation {
    id: number;
    size_id?: number;
    quantity_per_pack?: number;
    stock?: number;
    price?: number;
    absorbency_level?: string;
    is_active?: boolean;
}

export interface Product {
    id: number;
    category_id: number;
    name: string;
    slug: string;
    description: string;
    price: number;
    image: string;
    stock: number;
    absorbency?: string;
    rating?: number;
    reviews_count?: number;
    category?: Category;
    variations?: ProductVariation[];
}

export interface CartItemPayload {
    variation_id: number;
    quantity: number;
}

export interface CartApiItem {
    variation_id: number;
    product_id: number;
    product_name: string;
    product_slug: string;
    sku: string;
    size: string;
    size_code: string;
    absorbency_level: string;
    price: number;
    quantity_per_pack: number;
    quantity: number;
    subtotal: number;
    stock: number;
    image: string;
    added_at: string;
}

export interface CartSummary {
    total_items: number;
    total_units: number;
    subtotal: number;
}

export interface CartResponseData {
    cart: CartApiItem[];
    summary: CartSummary;
}

export interface CartItem {
    id?: number;
    variation_id: number;
    quantity: number;
    product?: Product;
}

export interface CheckoutData {
    shipping_method_id: string | number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    street_address: string;
    city: string;
    state: string;
    zip_code: string;
    notes?: string;
}

export interface OrderItem {
    product_id: number;
    quantity: number;
    price: number;
    size?: string;
}

export interface OrderData {
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip_code: string;
    shipping_method: string;
    payment_method: string;
    items: OrderItem[];
    total: number;
}

export interface Order {
    id?: number;
    order_number?: string;
    status?: string;
    total?: number;
    items?: OrderItem[];
    [key: string]: unknown;
}

export interface OrderResponse {
    status?: boolean;
    success?: boolean;
    message: string;
    data?: {
        order_id?: number;
        order_number?: string;
        [key: string]: unknown;
    };
}
