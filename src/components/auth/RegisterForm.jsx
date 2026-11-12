import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Phone, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { isValidEmail, isValidPassword } from '../../utils/validators';
export const RegisterForm = () => {
    const { register } = useAuth();
    const { showSuccess, showError } = useNotification();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        rol: 'USUARIO',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [generalError, setGeneralError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => {
                const next = { ...prev };
                delete next[field];
                return next;
            });
        }
    };
    const validate = () => {
        const newErrors = {};
        if (!formData.nombre.trim())
            newErrors.nombre = 'El nombre es requerido';
        if (!formData.apellido.trim())
            newErrors.apellido = 'El apellido es requerido';
        if (!formData.email.trim()) {
            newErrors.email = 'El correo electrónico es requerido';
        }
        else if (!isValidEmail(formData.email)) {
            newErrors.email = 'Ingrese un correo electrónico válido';
        }
        if (!formData.password) {
            newErrors.password = 'La contraseña es requerida';
        }
        else if (!isValidPassword(formData.password, 6)) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setGeneralError(null);
        setSuccessMessage(null);
        if (!validate())
            return;
        setIsSubmitting(true);
        try {
            const res = await register(formData);
            setSuccessMessage(res.message || 'Usuario creado exitosamente. Redirigiendo...');
            showSuccess('Tu cuenta ha sido creada con éxito', 'Registro completado');
            setTimeout(() => {
                navigate('/login');
            }, 1800);
        }
        catch (err) {
            const msg = err.message || 'Ocurrió un error al registrar el usuario.';
            setGeneralError(msg);
            showError(msg, 'Error en el registro');
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

      {successMessage && (<div className="badge-success flex items-center gap-2 p-3" style={{
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.25rem',
                padding: '0.75rem 1rem',
                fontSize: '0.875rem'
            }}>
          <CheckCircle2 size={18} style={{ flexShrink: 0 }}/>
          <span>{successMessage}</span>
        </div>)}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <Input label="Nombre" placeholder="Ej: Valeria" value={formData.nombre} onChange={(e) => handleChange('nombre', e.target.value)} error={errors.nombre} icon={<User size={18}/>} required/>
        <Input label="Apellido" placeholder="Ej: Castrillón" value={formData.apellido} onChange={(e) => handleChange('apellido', e.target.value)} error={errors.apellido} required/>
      </div>

      <Input label="Correo Electrónico" type="email" placeholder="valeria@cesde.edu.co" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} error={errors.email} icon={<Mail size={18}/>} required/>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.75rem' }}>
        <Input label="Teléfono" placeholder="+57 300 000 0000" value={formData.telefono} onChange={(e) => handleChange('telefono', e.target.value)} icon={<Phone size={18}/>}/>
        <Select label="Tipo de Cuenta / Rol" value={formData.rol} onChange={(e) => handleChange('rol', e.target.value)} options={[
            { value: 'USUARIO', label: 'Estudiante / Talento Tech' },
            { value: 'EMPRESA', label: 'Empresa Aliada' },
            { value: 'ADMIN', label: 'Administrador' }
        ]}/>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <Input label="Contraseña" type="password" placeholder="••••••••" value={formData.password} onChange={(e) => handleChange('password', e.target.value)} error={errors.password} icon={<Lock size={18}/>} required/>
        <Input label="Confirmar Clave" type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={(e) => handleChange('confirmPassword', e.target.value)} error={errors.confirmPassword} icon={<Lock size={18}/>} required/>
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <Button type="submit" variant="primary" className="w-full" isLoading={isSubmitting}>
          Crear Cuenta
        </Button>
      </div>

      <div className="auth-footer">
        ¿Ya tienes una cuenta registrada?{' '}
        <Link to="/login" className="font-semibold">
          Inicia sesión aquí
        </Link>
      </div>
    </form>);
};
export default RegisterForm;
