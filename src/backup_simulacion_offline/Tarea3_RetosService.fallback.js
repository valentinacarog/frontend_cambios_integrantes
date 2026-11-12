/**
 * ====================================================================
 * PROYECTO INTEGRADOR: CESDE GAMIFIED CHALLENGES
 * TAREA INDIVIDUAL 3: MÓDULO DE RETOS & GAMIFICACIÓN (SERVICIO API)
 * ====================================================================
 * Métodos: getAll, getById, create, update, delete
 * Tabla BD: retos
 * ====================================================================
 */

import api, { ApiError } from '../../core/lib/apiClient';
import { INITIAL_RETOS, INITIAL_EMPRESAS, INITIAL_CATEGORIAS } from '../../core/lib/mockData';

const LOCAL_STORAGE_KEY = 'app_retos_cache';

const getLocalEmpresas = () => {
    try {
        const cached = localStorage.getItem('app_empresas_cache');
        return cached ? JSON.parse(cached) : INITIAL_EMPRESAS;
    }
    catch {
        return INITIAL_EMPRESAS;
    }
};

const getLocalCategorias = () => {
    try {
        const cached = localStorage.getItem('app_categorias_cache');
        return cached ? JSON.parse(cached) : INITIAL_CATEGORIAS;
    }
    catch {
        return INITIAL_CATEGORIAS;
    }
};

const getLocalData = () => {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!cached) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_RETOS));
        return INITIAL_RETOS;
    }
    try {
        const parsed = JSON.parse(cached);
        return Array.isArray(parsed) ? parsed : INITIAL_RETOS;
    }
    catch {
        return INITIAL_RETOS;
    }
};

const setLocalData = (data) => {
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    }
    catch (e) {
        console.error('Error guardando retos en localStorage', e);
    }
};

export const Tarea3_RetosService = {
    getAll: async (params) => {
        let list = [];
        try {
            const response = await api.get('/retos', params);
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
            console.warn('[retosService] Backend no disponible. Usando datos locales.');
            list = getLocalData();
        }
        if (params?.search) {
            const q = params.search.toLowerCase();
            list = list.filter(r => r.titulo.toLowerCase().includes(q) ||
                r.descripcion.toLowerCase().includes(q) ||
                (r.empresaNombre && r.empresaNombre.toLowerCase().includes(q)));
        }
        if (params?.dificultad) {
            list = list.filter(r => r.dificultad === params.dificultad);
        }
        if (params?.estado) {
            list = list.filter(r => r.estado === params.estado);
        }
        if (params?.empresaId) {
            list = list.filter(r => r.empresaId === Number(params.empresaId));
        }
        if (params?.categoriaId) {
            list = list.filter(r => r.categoriaId === Number(params.categoriaId));
        }
        return list;
    },
    getById: async (id) => {
        try {
            const r = await api.get(`/retos/${id}`);
            if (r)
                return r;
        }
        catch {
            // Fallback local
        }
        const list = getLocalData();
        const item = list.find(r => r.id === id);
        if (!item)
            throw new ApiError('Reto no encontrado', 404);
        return item;
    },
    create: async (data) => {
        let createdFromBackend = null;
        try {
            createdFromBackend = await api.post('/retos', data);
        }
        catch {
            console.warn('[retosService] Backend no respondió. Guardando reto en local.');
        }
        const list = getLocalData();
        if (createdFromBackend && createdFromBackend.id) {
            const updated = [createdFromBackend, ...list.filter(r => r.id !== createdFromBackend.id)];
            setLocalData(updated);
            return createdFromBackend;
        }
        const newId = list.length > 0 ? Math.max(...list.map(r => r.id || 0)) + 1 : 1;
        const empresas = getLocalEmpresas();
        const categorias = getLocalCategorias();
        const emp = empresas.find(e => e.id === Number(data.empresaId)) || INITIAL_EMPRESAS.find(e => e.id === Number(data.empresaId));
        const cat = categorias.find(c => c.id === Number(data.categoriaId)) || INITIAL_CATEGORIAS.find(c => c.id === Number(data.categoriaId));
        const newItem = {
            ...data,
            id: newId,
            empresaNombre: emp ? emp.nombre : `Empresa #${data.empresaId}`,
            categoriaNombre: cat ? cat.nombre : `Categoría #${data.categoriaId}`,
            createdAt: new Date().toISOString()
        };
        const updated = [newItem, ...list];
        setLocalData(updated);
        return newItem;
    },
    update: async (id, data) => {
        let updatedFromBackend = null;
        try {
            updatedFromBackend = await api.put(`/retos/${id}`, data);
        }
        catch {
            console.warn(`[retosService] Backend no respondió. Actualizando reto en local.`);
        }
        const list = getLocalData();
        const index = list.findIndex(r => r.id === id);
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
            throw new ApiError('Reto no encontrado', 404);
        const empresas = getLocalEmpresas();
        const categorias = getLocalCategorias();
        const emp = data.empresaId ? (empresas.find(e => e.id === Number(data.empresaId)) || INITIAL_EMPRESAS.find(e => e.id === Number(data.empresaId))) : undefined;
        const cat = data.categoriaId ? (categorias.find(c => c.id === Number(data.categoriaId)) || INITIAL_CATEGORIAS.find(c => c.id === Number(data.categoriaId))) : undefined;
        const updatedItem = {
            ...list[index],
            ...data,
            empresaNombre: emp ? emp.nombre : list[index].empresaNombre,
            categoriaNombre: cat ? cat.nombre : list[index].categoriaNombre,
            updatedAt: new Date().toISOString()
        };
        list[index] = updatedItem;
        setLocalData([...list]);
        return updatedItem;
    },
    delete: async (id) => {
        try {
            await api.delete(`/retos/${id}`);
        }
        catch {
            console.warn(`[retosService] Backend no respondió. Eliminando reto en local.`);
        }
        const list = getLocalData();
        const filtered = list.filter(r => r.id !== id);
        setLocalData(filtered);
        return { success: true, message: 'Reto eliminado exitosamente' };
    }
};

export const retosService = Tarea3_RetosService;
export default Tarea3_RetosService;
