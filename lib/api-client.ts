import { API_CONFIG } from './api-config';

type PrimitiveParam = string | number | boolean;
type FetchOptions = RequestInit & {
    params?: Record<string, PrimitiveParam | null | undefined>;
    skipApiKey?: boolean;
    skipAuth?: boolean;
    credentials?: RequestCredentials;
};

function getToken() {
    if (typeof window === 'undefined') return null;
    const authStorage = localStorage.getItem('auth-storage');
    if (!authStorage) return null;
    try {
        const parsed = JSON.parse(authStorage);
        return parsed.state?.token || null;
    } catch {
        return null;
    }
}

export class ApiError extends Error {
    status: number;
    data: unknown;

    constructor(message: string, status: number, data: unknown) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}

function buildUrl(endpoint: string, params?: FetchOptions['params']) {
    const url = new URL(`${API_CONFIG.BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`);

    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                url.searchParams.append(key, String(value));
            }
        });
    }

    return url.toString();
}

async function handleResponse(response: Response) {
    const contentType = response.headers.get('content-type');
    const isJson = Boolean(contentType && contentType.includes('application/json'));
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
        const errorMessage =
            (typeof data === 'object' && data !== null && 'message' in data && typeof (data as { message: unknown }).message === 'string'
                ? (data as { message: string }).message
                : response.statusText) ||
            'An error occurred';

        throw new ApiError(errorMessage, response.status, data);
    }

    return data;
}

async function request<T>(method: string, endpoint: string, body?: unknown, options: FetchOptions = {}): Promise<T> {
    const { params, headers: optionHeaders, skipApiKey, skipAuth, ...restOptions } = options;
    const url = buildUrl(endpoint, params);
    const token = getToken();
    const isFormData = body instanceof FormData;

    const response = await fetch(url, {
        ...restOptions,
        method,
        credentials: "include",
        ...(options.credentials ? { credentials: options.credentials } : {}),
        headers: {
            "Cache-Control": "no-cache",
            Accept: 'application/json',
            ...(skipApiKey ? {} : { 'x-api-key': API_CONFIG.API_KEY }),
            ...(!isFormData && body !== undefined ? { 'Content-Type': 'application/json' } : {}),
            ...(token && !skipAuth ? { Authorization: `Bearer ${token}` } : {}),
            ...optionHeaders,
        },
        ...(body !== undefined ? { body: isFormData ? body : JSON.stringify(body) } : {}),
    });

    return handleResponse(response);
}

export const api = {
    async get<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
        return request<T>('GET', endpoint, undefined, options);
    },

    async post<T>(endpoint: string, body?: unknown, options: FetchOptions = {}): Promise<T> {
        return request<T>('POST', endpoint, body, options);
    },

    async patch<T>(endpoint: string, body?: unknown, options: FetchOptions = {}): Promise<T> {
        return request<T>('PATCH', endpoint, body, options);
    },

    async delete<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
        return request<T>('DELETE', endpoint, undefined, options);
    },
};
