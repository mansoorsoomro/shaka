import { api } from '../api-client';
import { ApiResponse, Product, Category } from './types';

export const productService = {
    async getProducts(
        params?: Record<string, string | number | boolean>
    ): Promise<{ status: boolean; data: Product[] }> {
        return api.get<{ status: boolean; data: Product[] }>('/api/products', {
            params: {
                paginated: true,
                pagination: 1,
                ...params,
            },
        });
    },

    async getProduct(idOrSlug: string | number): Promise<{ status: boolean; data: Product }> {
        return api.get<{ status: boolean; data: Product }>(`/api/products/${idOrSlug}`);
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

    async getCategories(): Promise<{ status: boolean; data: Category[] }> {
        return api.get<{ status: boolean; data: Category[] }>('/api/get-categories');
    },
};
