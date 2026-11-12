import { storage } from '../utils/storage';
import { API_BASE_URL } from '../configs/constants';

export { API_BASE_URL };

export class ApiError extends Error {
    status;
    data;
    constructor(message, status, data) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}

class ApiService {
    baseUrl;
    constructor(baseUrl) {
        this.baseUrl = baseUrl.replace(/\/$/, '');
    }
    buildUrl(endpoint, params) {
        const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
        const url = new URL(`${this.baseUrl}${cleanEndpoint}`);
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    url.searchParams.append(key, String(value));
                }
            });
        }
        return url.toString();
    }
    getHeaders(customHeaders) {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...customHeaders
        });
        const token = storage.getToken();
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    }
    async request(endpoint, options = {}) {
        const { params, headers, ...rest } = options;
        const url = this.buildUrl(endpoint, params);
        try {
            const response = await fetch(url, {
                ...rest,
                headers: this.getHeaders(headers)
            });
            // Handle 401 Unauthorized
            if (response.status === 401) {
                storage.clearAuth();
                // Dispath custom event to inform AuthContext
                window.dispatchEvent(new CustomEvent('auth:unauthorized'));
                throw new ApiError('Sesión expirada o no autorizada.', 401);
            }
            const contentType = response.headers.get('content-type');
            let data = null;
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            }
            else {
                data = await response.text();
            }
            if (!response.ok) {
                const errorMessage = (data && (data.message || data.error)) || `Error HTTP ${response.status}: ${response.statusText}`;
                throw new ApiError(errorMessage, response.status, data);
            }
            return data;
        }
        catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            // Network error or backend offline
            console.warn(`[ApiService] Fallo de conexión con ${url}. Verificando fallback local...`, error.message);
            throw new ApiError(error.message || 'No se pudo establecer conexión con el servidor backend.', 0, { isNetworkError: true });
        }
    }
    get(endpoint, params) {
        return this.request(endpoint, { method: 'GET', params });
    }
    post(endpoint, body, params) {
        return this.request(endpoint, {
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined,
            params
        });
    }
    put(endpoint, body, params) {
        return this.request(endpoint, {
            method: 'PUT',
            body: body ? JSON.stringify(body) : undefined,
            params
        });
    }
    delete(endpoint, params) {
        return this.request(endpoint, { method: 'DELETE', params });
    }
}

export const api = new ApiService(API_BASE_URL);
export default api;
