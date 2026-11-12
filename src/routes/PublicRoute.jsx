import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/common/LoadingSpinner';
export const PublicRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();
    if (isLoading) {
        return (<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner message="Comprobando acceso..."/>
      </div>);
    }
    if (isAuthenticated) {
        // Si ya está autenticado, redirigir al Dashboard
        return <Navigate to="/dashboard" replace/>;
    }
    return children ? <>{children}</> : <Outlet />;
};
export default PublicRoute;
