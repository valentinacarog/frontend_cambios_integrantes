/**
 * ====================================================================
 * PROYECTO INTEGRADOR: CESDE GAMIFIED CHALLENGES
 * TAREA INDIVIDUAL 2: MÓDULO DE USUARIOS & ACCESOS (SERVICIO API)
 * ====================================================================
 * Métodos: getAll, getById, create, update, delete
 * Tabla BD: usuarios
 * ====================================================================
 */

import api, { ApiError } from '../../core/lib/apiClient';
import { INITIAL_USUARIOS } from '../../core/lib/mockData';

const LOCAL_STORAGE_KEY = 'app_usuarios_cache';

const getLocalData = () => {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!cached) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_USUARIOS));
        return INITIAL_USUARIOS;
    }
    try {
        const parsed = JSON.parse(cached);
        return parsed.map(u => u.rol === 'SUPERVISOR' ? { ...u, rol: 'EMPRESA' } : u);
    }
    catch {
        return INITIAL_USUARIOS;
    }
};

const setLocalData = (data) => {
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    }
    catch (e) {
        console.error('Error guardando usuarios en localStorage', e);
    }
};

export const Tarea2_UsuarioService = {
    getAll: async (params) => {
        let list = [];
        try {
            const response = await api.get('/usuarios', params);
            const data = Array.isArray(response) ? response : response?.data || [];
            if (Array.isArray(data) && data.length > 0) {
                list = data;
                setLocalData(data);
            }
            else {
                list = getLocalData();
            }
        }
        catch {
            console.warn('[usuariosService] Conexión backend no disponible. Utilizando repositorio local.');
            list = getLocalData();
        }
        if (params?.search) {
            const q = params.search.toLowerCase();
            list = list.filter(u => u.nombre.toLowerCase().includes(q) ||
                u.apellido.toLowerCase().includes(q) ||
                u.email.toLowerCase().includes(q));
        }
        if (params?.rol) {
            list = list.filter(u => u.rol === params.rol);
        }
        if (params?.estado) {
            list = list.filter(u => u.estado === params.estado);
        }
        return list;
    },
    getById: async (id) => {
        try {
            const u = await api.get(`/usuarios/${id}`);
            if (u)
                return u;
        }
        catch {
            // Fallback local
        }
        const list = getLocalData();
        const item = list.find(u => u.id === id);
        if (!item)
            throw new ApiError('Usuario no encontrado', 404);
        return item;
    },
    create: async (data) => {
        let createdFromBackend = null;
        try {
            createdFromBackend = await api.post('/usuarios', data);
        }
        catch {
            console.warn('[usuariosService] Backend no respondió. Guardando usuario localmente.');
        }
        const list = getLocalData();
        if (createdFromBackend && createdFromBackend.id) {
            const updated = [createdFromBackend, ...list.filter(u => u.id !== createdFromBackend.id)];
            setLocalData(updated);
            return createdFromBackend;
        }
        const newId = list.length > 0 ? Math.max(...list.map(u => u.id || 0)) + 1 : 1;
        const newItem = {
            id: newId,
            nombre: data.nombre,
            apellido: data.apellido,
            email: data.email,
            telefono: data.telefono,
            rol: data.rol,
            estado: data.estado || 'ACTIVO',
            createdAt: new Date().toISOString()
        };
        const updated = [newItem, ...list];
        setLocalData(updated);
        return newItem;
    },
    update: async (id, data) => {
        let updatedFromBackend = null;
        try {
            updatedFromBackend = await api.put(`/usuarios/${id}`, data);
        }
        catch {
            console.warn(`[usuariosService] Backend no respondió. Actualizando usuario localmente.`);
        }
        const list = getLocalData();
        const index = list.findIndex(u => u.id === id);
        if (updatedFromBackend && updatedFromBackend.id) {
            if (index !== -1) {
                list[index] = updatedFromBackend;
            }
            else {
                list.unshift(updatedFromBackend);
            }
            setLocalData([...list]);
            return updatedFromBackend;
        }
        if (index === -1)
            throw new ApiError('Usuario no encontrado', 404);
        const updatedItem = {
            ...list[index],
            ...data,
            updatedAt: new Date().toISOString()
        };
        list[index] = updatedItem;
        setLocalData([...list]);
        return updatedItem;
    },
    delete: async (id) => {
        try {
            await api.delete(`/usuarios/${id}`);
        }
        catch {
            console.warn(`[usuariosService] Backend no respondió. Eliminando usuario localmente.`);
        }
        const list = getLocalData();
        const filtered = list.filter(u => u.id !== id);
        setLocalData(filtered);
        return { success: true, message: 'Usuario eliminado exitosamente' };
    }
};

export const usuariosService = Tarea2_UsuarioService;
export default Tarea2_UsuarioService;
