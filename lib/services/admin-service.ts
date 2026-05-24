import { api } from '../api-client';
import { ApiResponse, Order, User, Faq, FaqInput, DashboardData } from './types';

export const adminService = {
    // ----- Orders -----
    async getAllOrders(): Promise<ApiResponse<Order[]>> {
        return api.get<ApiResponse<Order[]>>('/api/admin/orders');
    },

    async updateOrderStatus(orderNumber: string, status: string): Promise<ApiResponse<Order>> {
        const formData = new FormData();
        formData.append('status', status);
        return api.patch<ApiResponse<Order>>(
            `/api/admin/orders/${encodeURIComponent(orderNumber)}/status`,
            formData,
            { params: { status } },
        );
    },

    // ----- Dashboard -----
    async getDashboard(): Promise<ApiResponse<DashboardData>> {
        return api.get<ApiResponse<DashboardData>>('/api/admin/dashboard');
    },

    // ----- Users -----
    async getAllUsers(): Promise<ApiResponse<User[]>> {
        return api.get<ApiResponse<User[]>>('/api/admin/users');
    },

    async getAllCustomers(): Promise<ApiResponse<User[]>> {
        return api.get<ApiResponse<User[]>>('/api/admin/customers');
    },

    async editUser(id: string | number, formData: FormData): Promise<ApiResponse<User>> {
        return api.post<ApiResponse<User>>(`/api/admin/users/${id}`, formData);
    },

    async deleteUser(id: string | number): Promise<ApiResponse<null>> {
        return api.delete<ApiResponse<null>>(`/api/admin/users/${id}`);
    },

    // ----- FAQs -----
    /** Public FAQ list endpoint, reused by the admin FAQ manager. */
    async getFaqs(): Promise<ApiResponse<Faq[]>> {
        return api.get<ApiResponse<Faq[]>>('/api/faqs');
    },

    async addFaq(data: FaqInput): Promise<ApiResponse<Faq>> {
        return api.post<ApiResponse<Faq>>('/api/admin/faqs', toFaqFormData(data));
    },

    async editFaq(id: string | number, data: FaqInput): Promise<ApiResponse<Faq>> {
        return api.post<ApiResponse<Faq>>(`/api/admin/faqs/${id}`, toFaqFormData(data));
    },

    async deleteFaq(id: string | number): Promise<ApiResponse<null>> {
        return api.delete<ApiResponse<null>>(`/api/admin/faqs/${id}`);
    },
};

function toFaqFormData(data: FaqInput): FormData {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    if (data.is_active !== undefined) {
        formData.append('is_active', data.is_active ? '1' : '0');
    }
    (data.images ?? []).forEach((file, index) => {
        formData.append(`images[${index}]`, file);
    });
    return formData;
}
