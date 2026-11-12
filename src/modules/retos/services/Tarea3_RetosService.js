/**
 * ====================================================================
 * PROYECTO INTEGRADOR: CESDE GAMIFIED CHALLENGES
 * TAREA INDIVIDUAL 3: MÓDULO DE RETOS & GAMIFICACIÓN (SERVICIO API)
 * ====================================================================
 * ℹ️ NOTA DE ARQUITECTURA:
 * El backend oficial es provisto por Java Spring Boot 3 + MySQL en
 * http://localhost:3000/api/retos.
 * 
 * Todo el código previo de simulación con datos mock y persistencia en 
 * localStorage ha sido aislado intacto como respaldo en:
 * 'src/backup_simulacion_offline/Tarea3_RetosService.fallback.js'
 * ====================================================================
 */

import api, { ApiError } from '../../core/lib/apiClient';

export const Tarea3_RetosService = {
    /**
     * Obtiene todos los retos técnicos desde el backend Java (con soporte para búsqueda, dificultad y estado).
     */
    getAll: async (params) => {
        try {
            const response = await api.get('/retos', params);
            return Array.isArray(response) ? response : response?.data || [];
        } catch (error) {
            console.error('[RetosService] Error al consultar retos en backend Java:', error);
            throw error;
        }
    },

    /**
     * Consulta un reto por su ID.
     */
    getById: async (id) => {
        try {
            return await api.get(`/retos/${id}`);
        } catch (error) {
            console.error(`[RetosService] Error al consultar reto #${id}:`, error);
            throw error;
        }
    },

    /**
     * Crea un nuevo reto tecnológico en la base de datos MySQL a través de Spring Boot.
     */
    create: async (data) => {
        try {
            return await api.post('/retos', data);
        } catch (error) {
            console.error('[RetosService] Error al crear reto en backend Java:', error);
            throw error;
        }
    },

    /**
     * Actualiza un reto existente por su ID.
     */
    update: async (id, data) => {
        try {
            return await api.put(`/retos/${id}`, data);
        } catch (error) {
            console.error(`[RetosService] Error al actualizar reto #${id}:`, error);
            throw error;
        }
    },

    /**
     * Elimina un reto por su ID.
     */
    delete: async (id) => {
        try {
            return await api.delete(`/retos/${id}`);
        } catch (error) {
            console.error(`[RetosService] Error al eliminar reto #${id}:`, error);
            throw error;
        }
    }
};

export const retosService = Tarea3_RetosService;
export default Tarea3_RetosService;
