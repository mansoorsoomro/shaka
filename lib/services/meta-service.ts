import { api } from '../api-client';
import { ApiResponse, Size, Category, Role, ShippingMethod, Faq } from './types';

export const metaService = {
    async getSizes(): Promise<ApiResponse<Size[]>> {
        return api.get<ApiResponse<Size[]>>('/api/get-sizes');
    },

    /** Public FAQ list shown on the storefront resources page. */
    async getFaqs(): Promise<ApiResponse<Faq[]>> {
        return api.get<ApiResponse<Faq[]>>('/api/faqs');
    },

    async getCategories(): Promise<ApiResponse<Category[]>> {
        return api.get<ApiResponse<Category[]>>('/api/get-categories');
    },

    async getRoles(): Promise<ApiResponse<Role[]>> {
        return api.get<ApiResponse<Role[]>>('/api/get-roles');
    },

    async getShippingMethods(): Promise<ApiResponse<ShippingMethod[]>> {
        return api.get<ApiResponse<ShippingMethod[]>>('/api/get-shipping-methods');
    },
};
