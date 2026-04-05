import { api } from '../api-client';
import { ApiResponse, Order } from './types';

export const adminService = {
    async getAllOrders(): Promise<ApiResponse<Order[]>> {
        return api.get<ApiResponse<Order[]>>('/api/admin/orders');
    },

    async updateOrderStatus(orderNumber: string, status: string): Promise<ApiResponse<Order>> {
        return api.patch<ApiResponse<Order>>(`/api/admin/orders/${orderNumber}/status`, undefined, {
            params: { status },
        });
    },
};
