import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../../core/hooks/useNotification';
import { Input } from '../../core/design-system/Input';
import { Button } from '../../core/design-system/Button';
import { isValidEmail } from '../../core/utils/validators';

export const LoginForm = () => {
    const { login } = useAuth();
    const { showSuccess, showError } = useNotification();
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [generalError, setGeneralError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const from = location.state?.from?.pathname || '/dashboard';

    const validate = () => {
        const newErrors = {};
        if (!email.trim()) {
            newErrors.email = 'El correo electrónico es requerido';
        }
        else if (!isValidEmail(email)) {
            newErrors.email = 'Ingrese un formato de correo electrónico válido';
        }
        if (!password) {
            newErrors.password = 'La contraseña es requerida';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setGeneralError(null);
        if (!validate())
            return;
        setIsSubmitting(true);
        try {
            await login({ email, password });
            showSuccess('Bienvenido al Sistema Administrativo', 'Inicio de sesión exitoso');
            navigate(from, { replace: true });
        }
        catch (err) {
            const msg = err.message || 'Error al iniciar sesión. Verifique sus credenciales.';
            setGeneralError(msg);
            showError(msg, 'Error de autenticación');
        }
        finally {
            setIsSubmitting(false);
        }
    };

    return (<form onSubmit={handleSubmit} noValidate>
      {generalError && (<div className="badge-danger flex items-center gap-2 p-3" style={{
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.25rem',
                padding: '0.75rem 1rem',
                fontSize: '0.875rem'
            }}>
          <AlertCircle size={18} style={{ flexShrink: 0 }}/>
          <span>{generalError}</span>
        </div>)}

      <Input label="Correo Electrónico" type="email" placeholder="ejemplo@sistema.com" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} icon={<Mail size={18}/>} required autoComplete="email"/>

      <div style={{ position: 'relative' }}>
        <Input label="Contraseña" type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} icon={<Lock size={18}/>} required autoComplete="current-password"/>
        <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
            position: 'absolute',
            right: '0.75rem',
            top: '2.3rem',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer'
        }} aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}>
          {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
        </button>
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <Button type="submit" variant="primary" className="w-full" isLoading={isSubmitting}>
          Iniciar Sesión
        </Button>
      </div>

      <div style={{
            marginTop: '1.25rem',
            padding: '0.75rem',
            background: 'var(--bg-surface-alt)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.5
        }}>
        <span className="font-semibold" style={{ color: 'var(--text-main)' }}>Credenciales de demostración:</span>
        <br />
        • <strong>Admin:</strong> <code>admin@sistema.com</code> / <code>admin123</code>
        <br />
        • <strong>Empresa:</strong> <code>carlos.mendoza@empresa.com</code> / <code>empresa123</code>
      </div>

      <div className="auth-footer">
        ¿No tienes una cuenta aún?{' '}
        <Link to="/registro" className="font-semibold">
          Regístrate aquí
        </Link>
      </div>
    </form>);
};

export default LoginForm;
