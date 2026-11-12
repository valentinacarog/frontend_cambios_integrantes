/**
 * ====================================================================
 * SERVICIO CENTRAL DE CONEXIÓN CON BACKEND JAVA (Spring Boot)
 * ====================================================================
 * - URL base configurable por .env / .env.local (VITE_API_URL)
 * - Manejo automático de encabezados y token JWT
 * - Peticiones HTTP tipadas (GET, POST, PUT, DELETE, PATCH)
 * - Manejo centralizado de errores y expiración de sesión (401)
 * ====================================================================
 */

export const API_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_BACKEND_URL || "https://backend-proyecto-integrador-5j8v.onrender.com/api";

// 1. Obtener token JWT guardado en sesión
export const getToken = () => {
    try {
        return localStorage.getItem('cesde_token');
    } catch {
        return null;
    }
};

// 2. Configurar encabezados con envío de token JWT automático
export const getHeaders = (customHeaders = {}) => {
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...customHeaders
    };
    const token = getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

// 3. Manejador de errores personalizado
export class ApiError extends Error {
    constructor(message, status, data) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }
}

// 4. Función central para peticiones HTTP
export const apiRequest = async (endpoint, options = {}) => {
    const { params, headers, body, method = 'GET' } = options;
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    
    let url = `${API_URL.replace(/\/$/, '')}${cleanEndpoint}`;
    if (params) {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([k, v]) => {
            if (v !== undefined && v !== null && v !== '') {
                searchParams.append(k, String(v));
            }
        });
        const queryString = searchParams.toString();
        if (queryString) {
            url += `?${queryString}`;
        }
    }

    const config = {
        method,
        headers: getHeaders(headers)
    };

    if (body && method !== 'GET') {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url, config);

        // Manejo automático de sesión expirada
        if (response.status === 401) {
            localStorage.removeItem('cesde_token');
            localStorage.removeItem('cesde_user');
            window.dispatchEvent(new CustomEvent('auth:unauthorized'));
            throw new ApiError('Sesión expirada o no autorizada.', 401);
        }

        const contentType = response.headers.get('content-type');
        let data = null;
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        if (!response.ok) {
            const errorMessage = (data && (data.message || data.error)) || `Error HTTP ${response.status}: ${response.statusText}`;
            throw new ApiError(errorMessage, response.status, data);
        }

        return data;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        console.error(`[API Error] ${method} ${url}:`, error.message);
        throw new ApiError('No se pudo establecer conexión con el servidor backend en Java (puerto 3000).', 503, error);
    }
};

// 5. Métodos HTTP simplificados
export const api = {
    get: (endpoint, params) => apiRequest(endpoint, { method: 'GET', params }),
    post: (endpoint, body) => apiRequest(endpoint, { method: 'POST', body }),
    put: (endpoint, body) => apiRequest(endpoint, { method: 'PUT', body }),
    delete: (endpoint) => apiRequest(endpoint, { method: 'DELETE' }),
    patch: (endpoint, body) => apiRequest(endpoint, { method: 'PATCH', body })
};

export default API_URL;
