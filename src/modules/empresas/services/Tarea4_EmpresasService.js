/**
 * ====================================================================
 * PROYECTO INTEGRADOR: CESDE GAMIFIED CHALLENGES
 * TAREA INDIVIDUAL 4: MÓDULO DE EMPRESAS (SERVICIO API)
 * ====================================================================
 * ℹ️ NOTA DE ARQUITECTURA:
 * El backend oficial es provisto por Java Spring Boot 3 + MySQL en
 * http://localhost:3000/api/empresas.
 * 
 * Todo el código previo de simulación con datos mock y persistencia en 
 * localStorage ha sido aislado intacto como respaldo en:
 * 'src/backup_simulacion_offline/Tarea4_EmpresasService.fallback.js'
 * ====================================================================
 */

import api, { ApiError } from '../../core/lib/apiClient';

export const Tarea4_EmpresasService = {
    /**
     * Obtiene el directorio de empresas desde el backend en Java (con soporte para búsqueda, sector y estado).
     */
    getAll: async (params) => {
        try {
            const response = await api.get('/empresas', params);
            return Array.isArray(response) ? response : response?.data || [];
        } catch (error) {
            console.error('[EmpresasService] Error al consultar empresas en backend Java:', error);
            throw error;
        }
    },

    /**
     * Consulta una empresa por su ID.
     */
    getById: async (id) => {
        try {
            return await api.get(`/empresas/${id}`);
        } catch (error) {
            console.error(`[EmpresasService] Error al consultar empresa #${id}:`, error);
            throw error;
        }
    },

    /**
     * Registra una nueva empresa aliada en MySQL a través de Spring Boot.
     */
    create: async (data) => {
        try {
            return await api.post('/empresas', data);
        } catch (error) {
            console.error('[EmpresasService] Error al registrar empresa en backend Java:', error);
            throw error;
        }
    },

    /**
     * Actualiza la información de una empresa por su ID.
     */
    update: async (id, data) => {
        try {
            return await api.put(`/empresas/${id}`, data);
        } catch (error) {
            console.error(`[EmpresasService] Error al actualizar empresa #${id}:`, error);
            throw error;
        }
    },

    /**
     * Elimina una empresa por su ID.
     */
    delete: async (id) => {
        try {
            return await api.delete(`/empresas/${id}`);
        } catch (error) {
            console.error(`[EmpresasService] Error al eliminar empresa #${id}:`, error);
            throw error;
        }
    }
};

export const empresasService = Tarea4_EmpresasService;
export default Tarea4_EmpresasService;
