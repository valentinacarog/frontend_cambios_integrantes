/**
 * Configuraciones globales y constantes de la aplicación
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_BACKEND_URL || 'https://backend-proyecto-integrador-5j8v.onrender.com/api';

export const APP_CONFIG = {
    appName: 'CESDE Gamified Challenges',
    version: '1.0.0',
    defaultPageSize: 10,
    toastDuration: 4500
};

export default {
    API_BASE_URL,
    APP_CONFIG
};
