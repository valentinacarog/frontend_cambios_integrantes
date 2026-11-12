/**
 * ====================================================================
 * PROYECTO INTEGRADOR: CESDE GAMIFIED CHALLENGES
 * TAREA INDIVIDUAL 5: MÓDULO DE REGISTROS (SERVICIO API)
 * ====================================================================
 * Métodos: getAll, getById, create, update, delete
 * Tabla BD: registros
 * ====================================================================
 */

import api, { ApiError } from '../../core/lib/apiClient';
import { INITIAL_REGISTROS, INITIAL_USUARIOS, INITIAL_EMPRESAS, INITIAL_RETOS } from '../../core/lib/mockData';

const LOCAL_STORAGE_KEY = 'app_registros_cache';

const getLocalUsuarios = () => {
    try {
        const cached = localStorage.getItem('app_usuarios_cache');
        return cached ? JSON.parse(cached) : INITIAL_USUARIOS;
    }
    catch {
        return INITIAL_USUARIOS;
    }
};

const getLocalEmpresas = () => {
    try {
        const cached = localStorage.getItem('app_empresas_cache');
        return cached ? JSON.parse(cached) : INITIAL_EMPRESAS;
    }
    catch {
        return INITIAL_EMPRESAS;
    }
};

const getLocalRetos = () => {
    try {
        const cached = localStorage.getItem('app_retos_cache');
        return cached ? JSON.parse(cached) : INITIAL_RETOS;
    }
    catch {
        return INITIAL_RETOS;
    }
};

const getLocalData = () => {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!cached) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_REGISTROS));
        return INITIAL_REGISTROS;
    }
    try {
        const parsed = JSON.parse(cached);
        return Array.isArray(parsed) ? parsed : INITIAL_REGISTROS;
    }
    catch {
        return INITIAL_REGISTROS;
    }
};

const setLocalData = (data) => {
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    }
    catch (e) {
        console.error('Error guardando en localStorage:', e);
    }
};

export const Tarea5_RegistroService = {
    getAll: async (params) => {
        let list = [];
        try {
            const response = await api.get('/registros', params);
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
            console.warn('[registrosService] Backend no disponible o ruta no encontrada. Usando datos locales.');
            list = getLocalData();
        }
        if (params?.search) {
            const q = params.search.toLowerCase();
            list = list.filter(r => r.codigo.toLowerCase().includes(q) ||
                r.descripcion.toLowerCase().includes(q) ||
                (r.usuarioNombre && r.usuarioNombre.toLowerCase().includes(q)) ||
                (r.empresaNombre && r.empresaNombre.toLowerCase().includes(q)));
        }
        if (params?.tipo) {
            list = list.filter(r => r.tipo === params.tipo);
        }
        if (params?.estado) {
            list = list.filter(r => r.estado === params.estado);
        }
        if (params?.usuarioId) {
            list = list.filter(r => r.usuarioId === Number(params.usuarioId));
        }
        return list;
    },
    getById: async (id) => {
        try {
            const item = await api.get(`/registros/${id}`);
            if (item)
                return item;
        }
        catch {
            // Fallback a local
        }
        const list = getLocalData();
        const found = list.find(r => r.id === id);
        if (!found)
            throw new ApiError('Registro no encontrado', 404);
        return found;
    },
    create: async (data) => {
        let newItemFromBackend = null;
        try {
            newItemFromBackend = await api.post('/registros', data);
        }
        catch (error) {
            console.warn('[registrosService] Backend no respondió a la creación. Guardando registro localmente en localStorage.');
        }
        const list = getLocalData();
        if (newItemFromBackend && newItemFromBackend.id) {
            const updated = [newItemFromBackend, ...list.filter(r => r.id !== newItemFromBackend.id)];
            setLocalData(updated);
            return newItemFromBackend;
        }
        const newId = list.length > 0 ? Math.max(...list.map(r => r.id || 0)) + 1 : 1;
        const usuarios = getLocalUsuarios();
        const empresas = getLocalEmpresas();
        const retos = getLocalRetos();
        const usr = usuarios.find(u => u.id === Number(data.usuarioId)) || INITIAL_USUARIOS.find(u => u.id === Number(data.usuarioId));
        const emp = data.empresaId ? (empresas.find(e => e.id === Number(data.empresaId)) || INITIAL_EMPRESAS.find(e => e.id === Number(data.empresaId))) : undefined;
        const ret = data.retoId ? (retos.find(r => r.id === Number(data.retoId)) || INITIAL_RETOS.find(r => r.id === Number(data.retoId))) : undefined;
        const newItem = {
            ...data,
            id: newId,
            codigo: data.codigo || `REG-${new Date().getFullYear()}-${String(newId).padStart(3, '0')}`,
            usuarioNombre: usr ? `${usr.nombre} ${usr.apellido}` : `Usuario #${data.usuarioId}`,
            empresaNombre: emp ? emp.nombre : undefined,
            retoTitulo: ret ? ret.titulo : undefined,
            createdAt: new Date().toISOString()
        };
        const updated = [newItem, ...list];
        setLocalData(updated);
        return newItem;
    },
    update: async (id, data) => {
        let updatedFromBackend = null;
        try {
            updatedFromBackend = await api.put(`/registros/${id}`, data);
        }
        catch {
            console.warn(`[registrosService] Backend no respondió a la actualización. Actualizando localmente en localStorage.`);
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
            throw new ApiError('Registro no encontrado', 404);
        const usuarios = getLocalUsuarios();
        const empresas = getLocalEmpresas();
        const retos = getLocalRetos();
        const usr = data.usuarioId ? (usuarios.find(u => u.id === Number(data.usuarioId)) || INITIAL_USUARIOS.find(u => u.id === Number(data.usuarioId))) : undefined;
        const emp = data.empresaId ? (empresas.find(e => e.id === Number(data.empresaId)) || INITIAL_EMPRESAS.find(e => e.id === Number(data.empresaId))) : undefined;
        const ret = data.retoId ? (retos.find(r => r.id === Number(data.retoId)) || INITIAL_RETOS.find(r => r.id === Number(data.retoId))) : undefined;
        const updatedItem = {
            ...list[index],
            ...data,
            usuarioNombre: usr ? `${usr.nombre} ${usr.apellido}` : list[index].usuarioNombre,
            empresaNombre: emp ? emp.nombre : list[index].empresaNombre,
            retoTitulo: ret ? ret.titulo : list[index].retoTitulo,
            updatedAt: new Date().toISOString()
        };
        list[index] = updatedItem;
        setLocalData([...list]);
        return updatedItem;
    },
    delete: async (id) => {
        try {
            await api.delete(`/registros/${id}`);
        }
        catch {
            console.warn(`[registrosService] Backend no respondió al eliminar. Eliminando localmente en localStorage.`);
        }
        const list = getLocalData();
        const filtered = list.filter(r => r.id !== id);
        setLocalData(filtered);
        return { success: true, message: 'Registro eliminado exitosamente' };
    }
};

export const registrosService = Tarea5_RegistroService;
export default Tarea5_RegistroService;
