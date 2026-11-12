/**
 * ====================================================================
 * PROYECTO INTEGRADOR: CESDE GAMIFIED CHALLENGES
 * TAREA INDIVIDUAL 2: MÓDULO DE USUARIOS & ACCESOS (SERVICIO API)
 * ====================================================================
 * ℹ️ NOTA DE ARQUITECTURA:
 * El backend oficial es provisto por Java Spring Boot 3 + MySQL en
 * http://localhost:3000/api/usuarios.
 * 
 * Todo el código previo de simulación con datos mock y persistencia en 
 * localStorage ha sido aislado intacto como respaldo en:
 * 'src/backup_simulacion_offline/Tarea2_UsuarioService.fallback.js'
 * ====================================================================
 */

import api, { ApiError } from '../../core/lib/apiClient';

export const Tarea2_UsuarioService = {
    /**
     * Obtiene todos los usuarios desde el backend Java (con soporte para búsqueda, rol y estado).
     */
    getAll: async (params) => {
        try {
            const response = await api.get('/usuarios', params);
            return Array.isArray(response) ? response : response?.data || [];
        } catch (error) {
            console.error('[UsuarioService] Error al consultar usuarios en backend Java:', error);
            throw error;
        }
    },

    /**
     * Consulta un usuario por su ID.
     */
    getById: async (id) => {
        try {
            return await api.get(`/usuarios/${id}`);
        } catch (error) {
            console.error(`[UsuarioService] Error al consultar usuario #${id}:`, error);
            throw error;
        }
    },

    /**
     * Registra un nuevo usuario en la base de datos MySQL a través de Spring Boot.
     */
    create: async (data) => {
        try {
            return await api.post('/usuarios', data);
        } catch (error) {
            console.error('[UsuarioService] Error al crear usuario en backend Java:', error);
            throw error;
        }
    },

    /**
     * Actualiza la información o estado de un usuario por su ID.
     */
    update: async (id, data) => {
        try {
            return await api.put(`/usuarios/${id}`, data);
        } catch (error) {
            console.error(`[UsuarioService] Error al actualizar usuario #${id}:`, error);
            throw error;
        }
    },

    /**
     * Elimina un usuario por su ID.
     */
    delete: async (id) => {
        try {
            return await api.delete(`/usuarios/${id}`);
        } catch (error) {
            console.error(`[UsuarioService] Error al eliminar usuario #${id}:`, error);
            throw error;
        }
    }
};

export const usuariosService = Tarea2_UsuarioService;
export default Tarea2_UsuarioService;
