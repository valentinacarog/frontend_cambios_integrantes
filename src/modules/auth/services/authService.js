/**
 * ====================================================================
 * PROYECTO INTEGRADOR: CESDE GAMIFIED CHALLENGES
 * MÓDULO DE AUTENTICACIÓN (SERVICIO API)
 * ====================================================================
 * ℹ️ NOTA DE ARQUITECTURA:
 * El backend oficial es provisto por Java Spring Boot 3 + Spring Security + JWT en
 * http://localhost:3000/api/auth.
 * 
 * Todo el código previo de simulación con tokens locales y usuarios mock 
 * ha sido aislado intacto como respaldo en:
 * 'src/backup_simulacion_offline/authService.fallback.js'
 * ====================================================================
 */

import api, { ApiError } from '../../core/lib/apiClient';
import { storage } from '../../core/utils/storage';

export const authService = {
    /**
     * Inicia sesión contra el backend en Java Spring Boot (POST /api/auth/login).
     * Guarda el token JWT emitido y la información del usuario en almacenamiento local.
     */
    login: async (credentials) => {
        try {
            const response = await api.post('/auth/login', credentials);
            if (response && response.token) {
                storage.setToken(response.token);
                storage.setUser(response.user);
                return response;
            }
            throw new Error('Respuesta de autenticación inválida del servidor');
        } catch (error) {
            console.error('[authService] Error en inicio de sesión con backend Java:', error);
            throw error;
        }
    },

    /**
     * Registra un nuevo usuario en la base de datos MySQL (POST /api/auth/register).
     */
    register: async (data) => {
        try {
            const response = await api.post('/auth/register', {
                nombre: data.nombre,
                apellido: data.apellido,
                email: data.email,
                password: data.password,
                rol: data.rol || 'USUARIO',
                telefono: data.telefono,
                empresaId: data.empresaId || null
            });

            if (response && response.token) {
                storage.setToken(response.token);
                storage.setUser(response.user);
            }

            return response;
        } catch (error) {
            console.error('[authService] Error en registro de usuario en backend Java:', error);
            throw error;
        }
    },

    /**
     * Obtiene los datos del usuario autenticado actual desde el backend Java (GET /api/auth/me).
     */
    getProfile: async () => {
        try {
            const user = await api.get('/auth/me');
            if (user) {
                storage.setUser(user);
                return user;
            }
            return storage.getUser();
        } catch (error) {
            const stored = storage.getUser();
            if (stored) return stored;
            throw error;
        }
    },

    /**
     * Cierra la sesión activa en el cliente y remueve el token JWT.
     */
    logout: async () => {
        try {
            await api.post('/auth/logout', {});
        } catch (e) {
            // Cierre seguro en cliente incluso si la red falla
        } finally {
            storage.clearAuth();
        }
    }
};

export default authService;
