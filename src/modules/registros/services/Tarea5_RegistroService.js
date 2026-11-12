/**
 * ====================================================================
 * PROYECTO INTEGRADOR: CESDE GAMIFIED CHALLENGES
 * TAREA INDIVIDUAL 5: MÓDULO DE REGISTROS (SERVICIO API)
 * ====================================================================
 * ℹ️ NOTA DE ARQUITECTURA:
 * El backend oficial es provisto por Java Spring Boot 3 + MySQL en
 * http://localhost:3000/api/registros.
 * 
 * Todo el código previo de simulación con datos mock y persistencia en 
 * localStorage ha sido aislado intacto como respaldo en:
 * 'src/backup_simulacion_offline/Tarea5_RegistroService.fallback.js'
 * ====================================================================
 */

import api, { ApiError } from '../../core/lib/apiClient';

export const Tarea5_RegistroService = {
    /**
     * Obtiene el historial de registros/postulaciones desde el backend Java (con filtros por tipo, estado, etc.).
     */
    getAll: async (params) => {
        try {
            const response = await api.get('/registros', params);
            return Array.isArray(response) ? response : response?.data || [];
        } catch (error) {
            console.error('[RegistroService] Error al consultar registros en backend Java:', error);
            throw error;
        }
    },

    /**
     * Consulta un registro específico por su ID.
     */
    getById: async (id) => {
        try {
            return await api.get(`/registros/${id}`);
        } catch (error) {
            console.error(`[RegistroService] Error al consultar registro #${id}:`, error);
            throw error;
        }
    },

    /**
     * Crea un nuevo registro o postulación en MySQL a través de Spring Boot.
     */
    create: async (data) => {
        try {
            return await api.post('/registros', data);
        } catch (error) {
            console.error('[RegistroService] Error al crear registro en backend Java:', error);
            throw error;
        }
    },

    /**
     * Actualiza el estado o detalles de un registro por su ID.
     */
    update: async (id, data) => {
        try {
            return await api.put(`/registros/${id}`, data);
        } catch (error) {
            console.error(`[RegistroService] Error al actualizar registro #${id}:`, error);
            throw error;
        }
    },

    /**
     * Elimina un registro por su ID.
     */
    delete: async (id) => {
        try {
            return await api.delete(`/registros/${id}`);
        } catch (error) {
            console.error(`[RegistroService] Error al eliminar registro #${id}:`, error);
            throw error;
        }
    }
};

export const registrosService = Tarea5_RegistroService;
export default Tarea5_RegistroService;
