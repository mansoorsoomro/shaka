import { api } from '../api-client';
import type {
    LoginCredentials,
    RegisterData,
    AuthResponse,
    ForgotPasswordResponse,
    VerifyCodeResponse,
    ResetPasswordData,
    GoogleRedirectResponse
} from '@/lib/services/types';

export const authService = {
    /**
     * Login user
     */
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const formData = new FormData();
        formData.append('email', credentials.email);
        formData.append('password', credentials.password);

        return api.post<AuthResponse>('/api/login', formData);
    },

    /**
     * Register new user
     */
    async register(data: RegisterData): Promise<AuthResponse> {
        const formData = new FormData();
        formData.append('firstname', data.firstname);
        formData.append('lastname', data.lastname);
        formData.append('email', data.email);
        formData.append('dob', data.dob);
        formData.append('password', data.password);
        formData.append('password_confirmation', data.password_confirmation);
        formData.append('phone', data.phone);
        formData.append('gender', data.gender);

        if (data.image) {
            formData.append('image', data.image);
        }

        return api.post<AuthResponse>('/api/register', formData, {
            skipAuth: true,
            credentials: 'omit'
        });
    },

    /**
     * Request password reset code
     */
    async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
        const formData = new FormData();
        formData.append('email', email);

        return api.post<ForgotPasswordResponse>('/api/forgot-password', formData);
    },

    /**
     * Verify reset code
     */
    async verifyCode(token: string): Promise<VerifyCodeResponse> {
        const formData = new FormData();
        formData.append('token', token);

        return api.post<VerifyCodeResponse>('/api/verify-code', formData);
    },

    /**
     * Reset password with token
     */
    async resetPassword(data: ResetPasswordData): Promise<AuthResponse> {
        const formData = new FormData();
        formData.append('token', data.token);
        formData.append('password', data.password);
        formData.append('password_confirmation', data.password_confirmation);

        return api.post<AuthResponse>('/api/reset-password', formData);
    },

    /**
     * Get Google Social Login Redirect URL
     */
    async getGoogleRedirect(): Promise<GoogleRedirectResponse> {
        return api.get<GoogleRedirectResponse>('/api/social/google/redirect');
    },

    /**
     * Handle Google Callback
     */
    async handleGoogleCallback(params?: Record<string, string>): Promise<any> {
        return api.get('/api/social/google/callback', { params });
    }
};
