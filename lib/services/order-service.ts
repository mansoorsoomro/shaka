import { api } from '../api-client';
import { OrderData, OrderResponse, CheckoutData, ApiResponse, Order } from './types';

function toCheckoutFormData(data: CheckoutData): FormData {
    const formData = new FormData();
    formData.append('shipping_method_id', String(data.shipping_method_id));
    formData.append('first_name', data.first_name);
    formData.append('last_name', data.last_name);
    formData.append('email', data.email);
    formData.append('phone', data.phone);
    formData.append('street_address', data.street_address);
    formData.append('city', data.city);
    formData.append('state', data.state);
    formData.append('zip_code', data.zip_code);
    if (data.notes) formData.append('notes', data.notes);
    return formData;
}

export const orderService = {
    async placeUserOrder(data: CheckoutData): Promise<OrderResponse> {
        return api.post<OrderResponse>('/api/orders/checkout', toCheckoutFormData(data));
    },

    async placeOrder(data: OrderData): Promise<OrderResponse> {
        return this.placeUserOrder({
            shipping_method_id: data.shipping_method,
            first_name: data.firstname,
            last_name: data.lastname,
            email: data.email,
            phone: data.phone,
            street_address: data.address,
            city: data.city,
            state: data.state,
            zip_code: data.zip_code,
        });
    },

    async getMyOrders(): Promise<ApiResponse<Order[]>> {
        return api.get<ApiResponse<Order[]>>('/api/orders');
    },

    async getOrderByNumber(orderNumber: string | number): Promise<ApiResponse<Order>> {
        return api.get<ApiResponse<Order>>(`/api/orders/${String(orderNumber)}`);
    },

    async getOrderDetails(orderIdentifier: string | number): Promise<ApiResponse<Order>> {
        return this.getOrderByNumber(orderIdentifier);
    },

    async getOrderBySession(sessionId: string): Promise<ApiResponse<Order>> {
        return api.get<ApiResponse<Order>>(`/api/orders/session/${sessionId}`);
    },

    async cancelMyOrder(orderNumber: string | number): Promise<ApiResponse<Order>> {
        return api.patch<ApiResponse<Order>>(`/api/orders/${String(orderNumber)}/cancel`);
    },

    async cancelOrder(orderIdentifier: string | number): Promise<ApiResponse<Order>> {
        return this.cancelMyOrder(orderIdentifier);
    },
};
