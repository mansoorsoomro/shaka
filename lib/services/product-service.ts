import { api } from '../api-client';
import { ApiResponse, Product, Category } from './types';

export interface ProductFilters {
    page?: number;
    pagination?: number;
    /** Free-text search (matches product name/description on the backend). */
    search?: string;
    /** Filter by category id (storefront only). */
    categoryId?: number | string;
    /** Price range filters. */
    minPrice?: number | string;
    maxPrice?: number | string;
}

/**
 * Translate UI filters into the API query params. Supported by the products
 * endpoints: paginated, pagination, search, min_price, max_price (+ category_id
 * on the storefront). Change param names ONLY here if the backend differs.
 */
function buildProductParams(filters: ProductFilters): Record<string, string | number | boolean> {
    const params: Record<string, string | number | boolean> = {
        paginated: true,
        pagination: filters.pagination ?? 12,
    };

    if (filters.page) params.page = filters.page;

    const search = String(filters.search ?? '').trim();
    if (search) params.search = search;

    if (filters.categoryId !== undefined && filters.categoryId !== '' && filters.categoryId !== null) {
        params.category_id = filters.categoryId;
    }

    if (filters.minPrice !== undefined && filters.minPrice !== '' && filters.minPrice !== null) {
        params.min_price = filters.minPrice;
    }

    if (filters.maxPrice !== undefined && filters.maxPrice !== '' && filters.maxPrice !== null) {
        params.max_price = filters.maxPrice;
    }

    return params;
}

export const productService = {
    async getProducts(
        params?: Record<string, string | number | boolean>
    ): Promise<ApiResponse<Product[]>> {
        return api.get<ApiResponse<Product[]>>('/api/products', {
            params: {
                paginated: true,
                // pagination: 1,
                pagination: 50,
                ...params,
            },
        });
    },

    /** Storefront product listing with filters (search / category / price). */
    async getFilteredProducts(filters: ProductFilters = {}): Promise<ApiResponse<Product[]>> {
        return api.get<ApiResponse<Product[]>>('/api/products', {
            params: buildProductParams(filters),
        });
    },

    /** Admin product listing (search / price). Endpoint: GET /api/admin/products */
    async getAdminProducts(filters: ProductFilters = {}): Promise<ApiResponse<Product[]>> {
        return api.get<ApiResponse<Product[]>>('/api/admin/products', {
            params: buildProductParams(filters),
        });
    },

    async getProduct(idOrSlug: string | number): Promise<ApiResponse<Product>> {
        return api.get<ApiResponse<Product>>(`/api/products/${idOrSlug}`);
    },

    async addProduct(formData: FormData): Promise<ApiResponse<Product>> {
        return api.post<ApiResponse<Product>>('/api/products', formData);
    },

    async editProduct(id: string | number, formData: FormData): Promise<ApiResponse<Product>> {
        return api.post<ApiResponse<Product>>(`/api/products/${id}`, formData);
    },

    async deleteProduct(id: string | number): Promise<ApiResponse<null>> {
        return api.delete<ApiResponse<null>>(`/api/products/${id}`);
    },

    async getCategories(): Promise<ApiResponse<Category[]>> {
        return api.get<ApiResponse<Category[]>>('/api/get-categories');
    },
};
