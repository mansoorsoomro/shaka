import { api } from '../api-client';
import { ApiResponse, Product, Category } from './types';

export const productService = {
    async getProducts(
        params?: Record<string, string | number | boolean>
    ): Promise<ApiResponse<Product[]>> {
        return api.get<ApiResponse<Product[]>>('/api/products', {
            params: {
                paginated: true,
                pagination: 1,
                ...params,
            },
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
