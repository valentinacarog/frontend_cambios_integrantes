import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/common/LoadingSpinner';
export const PrivateRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();
    if (isLoading) {
        return (<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner message="Verificando sesión..."/>
      </div>);
    }
    if (!isAuthenticated) {
        // Redirigir a login conservando la ruta intentada
        return <Navigate to="/login" state={{ from: location }} replace/>;
    }
    return children ? <>{children}</> : <Outlet />;
};
export default PrivateRoute;
