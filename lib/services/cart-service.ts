import { api } from '../api-client';
import { ApiResponse, CartApiItem, CartResponseData } from './types';

function buildCartFormData(data: Record<string, string | number>): FormData {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => formData.append(key, String(value)));
    return formData;
}

export const cartService = {
    // async getCartItems(cartToken: string): Promise<ApiResponse<CartResponseData>> {
    //     return api.get<ApiResponse<CartResponseData>>('/api/cart', { params: { cart_token: cartToken } });
    // },

    
    async getCartItems(cartToken: string): Promise<{ status: boolean; data: CartApiItem }> {
        return api.get<{ status: boolean; data: CartApiItem }>(`/api/cart` ,{ params: { cart_token: cartToken }} );
    },

    async getCartQuantity(cartToken: string): Promise<ApiResponse<{ quantity: number }>> {
        return api.get<ApiResponse<{ quantity: number }>>('/api/cart/quantity', { params: { cart_token: cartToken } });
    },

    async addOrUpdateCartItem(payload: {
        cart_token: string;
        variation_id: number;
        quantity: number;
    }): Promise<ApiResponse<CartResponseData>> {
        return api.post<ApiResponse<CartResponseData>>('/api/cart', buildCartFormData(payload));
    },

    async mergeGuestCart(payload: {
        guest_cart_token: string;
        variation_id: number;
        quantity: number;
    }): Promise<ApiResponse<CartResponseData>> {
        return api.post<ApiResponse<CartResponseData>>('/api/cart/merge', buildCartFormData(payload));
    },

    async removeCartItem(cartToken: string, variationId: number): Promise<ApiResponse<null>> {
        return api.delete<ApiResponse<null>>('/api/cart/item', {
            params: { cart_token: cartToken, variation_id: variationId },
        });
    },

    async clearCart(cartToken: string): Promise<ApiResponse<null>> {
        return api.delete<ApiResponse<null>>('/api/cart', { params: { cart_token: cartToken } });
    },
};
