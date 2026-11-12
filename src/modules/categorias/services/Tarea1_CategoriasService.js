/**
 * ====================================================================
 * PROYECTO INTEGRADOR: CESDE GAMIFIED CHALLENGES
 * TAREA INDIVIDUAL 1: MÓDULO DE CATEGORÍAS (SERVICIO API)
 * ====================================================================
 * ℹ️ NOTA DE ARQUITECTURA:
 * El backend oficial es provisto por Java Spring Boot 3 + MySQL en
 * http://localhost:3000/api/categorias.
 * 
 * Todo el código previo de simulación con datos mock y persistencia en 
 * localStorage ha sido aislado intacto como respaldo en:
 * 'src/backup_simulacion_offline/Tarea1_CategoriasService.fallback.js'
 * ====================================================================
 */

import api, { ApiError } from '../../core/lib/apiClient';

export const Tarea1_CategoriasService = {

    /**
     * Obtiene el listado de categorías desde el backend en Java (con filtros opcionales de búsqueda y estado).
     */
    getAll: async (params) => {
        try {
            const response = await api.get('/categorias', params);
            return Array.isArray(response) ? response : response?.data || [];
        } catch (error) {
            console.error('[CategoriasService] Error al consultar categorías en el backend Java:', error);
            throw error;
        }
    },

    /**
     * Consulta una categoría específica por su ID en el backend Java.
     */
    getById: async (id) => {
        try {
            return await api.get(`/categorias/${id}`);
        } catch (error) {
            console.error(`[CategoriasService] Error al consultar categoría #${id}:`, error);
            throw error;
        }
    },

    /**
     * Crea una nueva categoría técnica en MySQL a través del controlador REST en Spring Boot.
     */
    create: async (data) => {
        try {
            return await api.post('/categorias', data);
        } catch (error) {
            console.error('[CategoriasService] Error al crear categoría en backend Java:', error);
            throw error;
        }
    },

    /**
     * Actualiza una categoría existente por su ID.
     */
    update: async (id, data) => {
        try {
            return await api.put(`/categorias/${id}`, data);
        } catch (error) {
            console.error(`[CategoriasService] Error al actualizar categoría #${id}:`, error);
            throw error;
        }
    },

    /**
     * Elimina una categoría por su ID en la base de datos MySQL.
     */
    delete: async (id) => {
        try {
            return await api.delete(`/categorias/${id}`);
        } catch (error) {
            console.error(`[CategoriasService] Error al eliminar categoría #${id}:`, error);
            throw error;
        }
    }
};

export const categoriasService = Tarea1_CategoriasService;
export default Tarea1_CategoriasService;
