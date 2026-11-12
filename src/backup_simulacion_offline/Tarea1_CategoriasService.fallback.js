/**
 * ====================================================================
 * PROYECTO INTEGRADOR: CESDE GAMIFIED CHALLENGES
 * TAREA INDIVIDUAL 1: MÓDULO DE CATEGORÍAS (SERVICIO API)
 * ====================================================================
 * Métodos: getAll, getById, create, update, delete
 * Tabla BD: categorias
 * ====================================================================
 */

import api, { ApiError } from '../../core/lib/apiClient';
import { INITIAL_CATEGORIAS } from '../../core/lib/mockData';

const LOCAL_STORAGE_KEY = 'app_categorias_cache';

const getLocalData = () => {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!cached) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_CATEGORIAS));
        return INITIAL_CATEGORIAS;
    }
    try {
        return JSON.parse(cached);
    }
    catch {
        return INITIAL_CATEGORIAS;
    }
};

const setLocalData = (data) => {
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    }
    catch (e) {
        console.error('Error guardando categorias en localStorage', e);
    }
};

export const Tarea1_CategoriasService = {
    getAll: async (params) => {
        let list = [];
        try {
            const response = await api.get('/categorias', params);
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
            console.warn('[categoriasService] Backend no disponible. Usando datos locales.');
            list = getLocalData();
        }
        if (params?.search) {
            const q = params.search.toLowerCase();
            list = list.filter(c => c.nombre.toLowerCase().includes(q) ||
                c.codigo.toLowerCase().includes(q) ||
                c.descripcion.toLowerCase().includes(q));
        }
        if (params?.estado) {
            list = list.filter(c => c.estado === params.estado);
        }
        return list;
    },
    getById: async (id) => {
        try {
            const c = await api.get(`/categorias/${id}`);
            if (c)
                return c;
        }
        catch {
            // Fallback local
        }
        const list = getLocalData();
        const item = list.find(c => c.id === id);
        if (!item)
            throw new ApiError('Categoría no encontrada', 404);
        return item;
    },
    create: async (data) => {
        let createdFromBackend = null;
        try {
            createdFromBackend = await api.post('/categorias', data);
        }
        catch {
            console.warn('[categoriasService] Backend no respondió. Guardando categoría en local.');
        }
        const list = getLocalData();
        if (createdFromBackend && createdFromBackend.id) {
            const updated = [createdFromBackend, ...list.filter(c => c.id !== createdFromBackend.id)];
            setLocalData(updated);
            return createdFromBackend;
        }
        const newId = list.length > 0 ? Math.max(...list.map(c => c.id || 0)) + 1 : 1;
        const newItem = {
            id: newId,
            nombre: data.nombre,
            descripcion: data.descripcion,
            codigo: data.codigo || `CAT-${Date.now().toString().slice(-4)}`,
            estado: data.estado || 'ACTIVO',
            color: data.color || '#6366f1',
            createdAt: new Date().toISOString()
        };
        const updated = [newItem, ...list];
        setLocalData(updated);
        return newItem;
    },
    update: async (id, data) => {
        let updatedFromBackend = null;
        try {
            updatedFromBackend = await api.put(`/categorias/${id}`, data);
        }
        catch {
            console.warn(`[categoriasService] Backend no respondió. Actualizando categoría en local.`);
        }
        const list = getLocalData();
        const index = list.findIndex(c => c.id === id);
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
            throw new ApiError('Categoría no encontrada', 404);
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
            await api.delete(`/categorias/${id}`);
        }
        catch {
            console.warn(`[categoriasService] Backend no respondió. Eliminando categoría en local.`);
        }
        const list = getLocalData();
        const filtered = list.filter(c => c.id !== id);
        setLocalData(filtered);
        return { success: true, message: 'Categoría eliminada exitosamente' };
    }
};

export const categoriasService = Tarea1_CategoriasService;
export default Tarea1_CategoriasService;
