import React from 'react';
import RegisterForm from '../../components/auth/RegisterForm';
import { UserPlus } from 'lucide-react';
export const Register = () => {
    return (<>
      <div className="auth-header">
        <div className="auth-logo-badge">
          <UserPlus size={28}/>
        </div>
        <h2 className="auth-title">Crear Cuenta</h2>
        <p className="auth-subtitle">
          Completa tus datos para registrarte como usuario del sistema.
        </p>
      </div>

      <RegisterForm />
    </>);
};
export default Register;
