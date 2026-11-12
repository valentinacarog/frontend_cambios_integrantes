const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';
export const storage = {
    getToken: () => {
        try {
            return localStorage.getItem(TOKEN_KEY);
        }
        catch (e) {
            console.error('Error accessing token in localStorage', e);
            return null;
        }
    },
    setToken: (token) => {
        try {
            localStorage.setItem(TOKEN_KEY, token);
        }
        catch (e) {
            console.error('Error saving token to localStorage', e);
        }
    },
    removeToken: () => {
        try {
            localStorage.removeItem(TOKEN_KEY);
        }
        catch (e) {
            console.error('Error removing token from localStorage', e);
        }
    },
    getUser: () => {
        try {
            const data = localStorage.getItem(USER_KEY);
            return data ? JSON.parse(data) : null;
        }
        catch (e) {
            console.error('Error parsing user from localStorage', e);
            return null;
        }
    },
    setUser: (user) => {
        try {
            localStorage.setItem(USER_KEY, JSON.stringify(user));
        }
        catch (e) {
            console.error('Error saving user to localStorage', e);
        }
    },
    removeUser: () => {
        try {
            localStorage.removeItem(USER_KEY);
        }
        catch (e) {
            console.error('Error removing user from localStorage', e);
        }
    },
    clearAuth: () => {
        try {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
        }
        catch (e) {
            console.error('Error clearing auth from localStorage', e);
        }
    }
};
