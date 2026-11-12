import React from 'react';
import LoginForm from '../../components/auth/LoginForm';
import { Shield } from 'lucide-react';
export const Login = () => {
    return (<>
      <div className="auth-header">
        <div className="auth-logo-badge">
          <Shield size={28}/>
        </div>
        <h2 className="auth-title">Iniciar Sesión</h2>
        <p className="auth-subtitle">
          Ingresa tus credenciales para acceder al sistema administrativo.
        </p>
      </div>

      <LoginForm />
    </>);
};
export default Login;
