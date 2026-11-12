/**
 * ====================================================================
 * PROYECTO INTEGRADOR: CESDE GAMIFIED CHALLENGES
 * TAREA INDIVIDUAL 4: MÓDULO DE EMPRESAS (SERVICIO API)
 * ====================================================================
 * Métodos: getAll, getById, create, update, delete
 * Tabla BD: empresas
 * ====================================================================
 */

import api, { ApiError } from '../../core/lib/apiClient';
import { INITIAL_EMPRESAS } from '../../core/lib/mockData';

const LOCAL_STORAGE_KEY = 'app_empresas_cache';

const getLocalData = () => {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!cached) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_EMPRESAS));
        return INITIAL_EMPRESAS;
    }
    try {
        return JSON.parse(cached);
    }
    catch {
        return INITIAL_EMPRESAS;
    }
};

const setLocalData = (data) => {
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    }
    catch (e) {
        console.error('Error guardando empresas en localStorage', e);
    }
};

export const Tarea4_EmpresasService = {
    getAll: async (params) => {
        let list = [];
        try {
            const response = await api.get('/empresas', params);
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
            console.warn('[empresasService] Backend no disponible. Usando datos locales.');
            list = getLocalData();
        }
        if (params?.search) {
            const q = params.search.toLowerCase();
            list = list.filter(e => e.nombre.toLowerCase().includes(q) ||
                e.nit.toLowerCase().includes(q) ||
                e.ciudad.toLowerCase().includes(q) ||
                e.sector.toLowerCase().includes(q));
        }
        if (params?.sector) {
            list = list.filter(e => e.sector === params.sector);
        }
        if (params?.estado) {
            list = list.filter(e => e.estado === params.estado);
        }
        return list;
    },
    getById: async (id) => {
        try {
            const emp = await api.get(`/empresas/${id}`);
            if (emp)
                return emp;
        }
        catch {
            // Fallback local
        }
        const list = getLocalData();
        const item = list.find(e => e.id === id);
        if (!item)
            throw new ApiError('Empresa no encontrada', 404);
        return item;
    },
    create: async (data) => {
        let createdFromBackend = null;
        try {
            createdFromBackend = await api.post('/empresas', data);
        }
        catch {
            console.warn('[empresasService] Backend no respondió. Guardando empresa en local.');
        }
        const list = getLocalData();
        if (createdFromBackend && createdFromBackend.id) {
            const updated = [createdFromBackend, ...list.filter(e => e.id !== createdFromBackend.id)];
            setLocalData(updated);
            return createdFromBackend;
        }
        const newId = list.length > 0 ? Math.max(...list.map(e => e.id || 0)) + 1 : 1;
        const newItem = {
            id: newId,
            nombre: data.nombre,
            nit: data.nit,
            sector: data.sector,
            email: data.email,
            telefono: data.telefono,
            direccion: data.direccion,
            ciudad: data.ciudad,
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
            updatedFromBackend = await api.put(`/empresas/${id}`, data);
        }
        catch {
            console.warn(`[empresasService] Backend no respondió. Actualizando empresa en local.`);
        }
        const list = getLocalData();
        const index = list.findIndex(e => e.id === id);
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
            throw new ApiError('Empresa no encontrada', 404);
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
            await api.delete(`/empresas/${id}`);
        }
        catch {
            console.warn(`[empresasService] Backend no respondió. Eliminando empresa en local.`);
        }
        const list = getLocalData();
        const filtered = list.filter(e => e.id !== id);
        setLocalData(filtered);
        return { success: true, message: 'Empresa eliminada exitosamente' };
    }
};

export const empresasService = Tarea4_EmpresasService;
export default Tarea4_EmpresasService;
