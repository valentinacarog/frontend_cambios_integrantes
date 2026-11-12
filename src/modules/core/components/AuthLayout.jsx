import React from 'react';
import { Outlet } from 'react-router-dom';
import ToastContainer from '../design-system/ToastContainer';

export const AuthLayout = () => {
    return (<div className="auth-layout-container">
      <div className="auth-card animate-fade-in">
        <Outlet />
      </div>
      <ToastContainer />
    </div>);
};

export default AuthLayout;
