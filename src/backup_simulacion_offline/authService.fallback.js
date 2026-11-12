import api, { ApiError } from '../../core/lib/apiClient';
import { storage } from '../../core/utils/storage';
import { INITIAL_USER } from '../../core/lib/mockData';

const LOCAL_CREDENTIALS_KEY = 'app_local_credentials';

const getLocalAccounts = () => {
    try {
        const data = localStorage.getItem(LOCAL_CREDENTIALS_KEY);
        return data ? JSON.parse(data) : [];
    }
    catch {
        return [];
    }
};

const saveLocalAccount = (account) => {
    try {
        const list = getLocalAccounts();
        const filtered = list.filter(a => a.email.toLowerCase() !== account.email.toLowerCase());
        localStorage.setItem(LOCAL_CREDENTIALS_KEY, JSON.stringify([account, ...filtered]));
        // Sincronizar también con app_usuarios_cache para que aparezca en el módulo de usuarios y selectores
        const cachedUsers = localStorage.getItem('app_usuarios_cache');
        const users = cachedUsers ? JSON.parse(cachedUsers) : [];
        const newUsuario = {
            id: account.user.id,
            nombre: account.user.nombre,
            apellido: account.user.apellido,
            email: account.user.email,
            telefono: '',
            rol: account.user.rol,
            estado: 'ACTIVO',
            createdAt: new Date().toISOString()
        };
        if (!users.some((u) => u.email.toLowerCase() === account.email.toLowerCase())) {
            localStorage.setItem('app_usuarios_cache', JSON.stringify([newUsuario, ...users]));
        }
    }
    catch (e) {
        console.error('Error guardando cuenta en localStorage', e);
    }
};

export const authService = {
    login: async (credentials) => {
        try {
            const response = await api.post('/auth/login', credentials);
            if (response && response.token) {
                storage.setToken(response.token);
                storage.setUser(response.user);
                return response;
            }
            throw new Error('Respuesta de autenticación inválida del servidor');
        }
        catch (error) {
            if (error instanceof ApiError && error.status === 400) {
                throw error;
            }
            console.warn('[authService] Conexión backend no disponible. Evaluando credenciales locales y de prueba.');
            // 1. Verificar cuentas registradas localmente
            const localAccounts = getLocalAccounts();
            const matched = localAccounts.find(a => a.email.toLowerCase() === credentials.email.toLowerCase() && a.password === credentials.password);
            if (matched) {
                const localAuth = {
                    token: 'mock-jwt-token-local-' + Date.now(),
                    user: matched.user
                };
                storage.setToken(localAuth.token);
                storage.setUser(localAuth.user);
                return localAuth;
            }
            // 2. Verificar credenciales demo precargadas
            if ((credentials.email.toLowerCase() === 'admin@sistema.com' && credentials.password === 'admin123') ||
                (credentials.email.toLowerCase() === 'valeria@cesde.edu.co' && credentials.password === '123456')) {
                const mockAuth = {
                    token: 'mock-jwt-token-valeria-' + Date.now(),
                    user: {
                        ...INITIAL_USER,
                        email: credentials.email
                    }
                };
                storage.setToken(mockAuth.token);
                storage.setUser(mockAuth.user);
                return mockAuth;
            }
            if ((credentials.email.toLowerCase() === 'carlos.mendoza@empresa.com' || credentials.email.toLowerCase() === 'empresa@tech.com') && 
                (credentials.password === 'empresa123' || credentials.password === '123456')) {
                const mockAuth = {
                    token: 'mock-jwt-token-empresa-' + Date.now(),
                    user: {
                        id: 2,
                        nombre: 'Carlos (Innovación Digital)',
                        apellido: 'Mendoza',
                        email: credentials.email,
                        rol: 'EMPRESA',
                        estado: 'ACTIVO'
                    }
                };
                storage.setToken(mockAuth.token);
                storage.setUser(mockAuth.user);
                return mockAuth;
            }
            throw new ApiError('Credenciales incorrectas. Verifique usuario y contraseña o use: admin@sistema.com / admin123 o carlos.mendoza@empresa.com / empresa123', 401);
        }
    },
    register: async (data) => {
        let backendUser = undefined;
        try {
            const res = await api.post('/auth/register', {
                nombre: data.nombre,
                apellido: data.apellido,
                email: data.email,
                password: data.password,
                rol: data.rol || 'USUARIO',
                telefono: data.telefono
            });
            backendUser = res?.user;
        }
        catch {
            console.warn('[authService] Backend offline o endpoint no disponible. Guardando registro de usuario en local.');
        }
        const newUser = backendUser || {
            id: Date.now(),
            nombre: data.nombre,
            apellido: data.apellido,
            email: data.email,
            rol: data.rol || 'USUARIO',
            estado: 'ACTIVO'
        };
        // Guardar siempre la cuenta en local para permitir inicio de sesión y persistencia
        saveLocalAccount({
            email: data.email,
            password: data.password,
            user: newUser
        });
        return {
            message: 'Usuario registrado exitosamente en el sistema.',
            user: newUser
        };
    },
    getProfile: async () => {
        try {
            const user = await api.get('/auth/me');
            storage.setUser(user);
            return user;
        }
        catch (error) {
            const stored = storage.getUser();
            if (stored)
                return stored;
            throw error;
        }
    },
    logout: async () => {
        try {
            await api.post('/auth/logout', {});
        }
        catch (e) {
            // Ignorar error al cerrar sesión si el backend está offline
        }
        finally {
            storage.clearAuth();
        }
    }
};

export default authService;
