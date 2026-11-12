import { useContext } from 'react';
import { NotificationContext } from '../states/NotificationContext';

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification debe ser utilizado dentro de un NotificationProvider');
    }
    return context;
};

export default useNotification;
