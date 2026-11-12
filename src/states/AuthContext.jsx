import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { storage } from '../utils/storage';

export const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const storedToken = storage.getToken();
                const storedUser = storage.getUser();
                if (storedToken && storedUser) {
                    setToken(storedToken);
                    setUser(storedUser);
                    // Opcional: verificar perfil con el backend de fondo si está conectado
                    authService.getProfile().then(profile => {
                        if (profile)
                            setUser(profile);
                    }).catch(() => {
                        // Si el backend no responde o falla, mantenemos la sesión existente
                    });
                }
            }
            catch (e) {
                console.error('Error inicializando autenticación', e);
                storage.clearAuth();
            }
            finally {
                setIsLoading(false);
            }
        };
        initializeAuth();
        // Escuchar expiración de token lanzada por apiService
        const handleUnauthorized = () => {
            setUser(null);
            setToken(null);
        };
        window.addEventListener('auth:unauthorized', handleUnauthorized);
        return () => {
            window.removeEventListener('auth:unauthorized', handleUnauthorized);
        };
    }, []);

    const login = async (credentials) => {
        setIsLoading(true);
        try {
            const response = await authService.login(credentials);
            setToken(response.token);
            setUser(response.user);
        }
        finally {
            setIsLoading(false);
        }
    };

    const register = async (data) => {
        setIsLoading(true);
        try {
            return await authService.register(data);
        }
        finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
        }
        finally {
            setUser(null);
            setToken(null);
        }
    };

    return (<AuthContext.Provider value={{
            user,
            token,
            isAuthenticated: !!token && !!user,
            isLoading,
            login,
            register,
            logout
        }}>
      {children}
    </AuthContext.Provider>);
};

export default AuthContext;
