import React, { createContext, useState, useCallback } from 'react';

export const NotificationContext = createContext(undefined);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const removeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    const showNotification = useCallback((type, message, title) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newNotification = { id, type, message, title };
        setNotifications(prev => [...prev, newNotification]);
        setTimeout(() => {
            removeNotification(id);
        }, 4500);
    }, [removeNotification]);

    const showSuccess = useCallback((message, title = 'Éxito') => {
        showNotification('success', message, title);
    }, [showNotification]);

    const showError = useCallback((message, title = 'Error') => {
        showNotification('error', message, title);
    }, [showNotification]);

    const showWarning = useCallback((message, title = 'Atención') => {
        showNotification('warning', message, title);
    }, [showNotification]);

    const showInfo = useCallback((message, title = 'Información') => {
        showNotification('info', message, title);
    }, [showNotification]);

    return (<NotificationContext.Provider value={{
            notifications,
            showNotification,
            showSuccess,
            showError,
            showWarning,
            showInfo,
            removeNotification
        }}>
      {children}
    </NotificationContext.Provider>);
};

export default NotificationContext;
