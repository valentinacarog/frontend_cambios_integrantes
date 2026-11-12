import React, { useState, useEffect } from 'react';
import { Modal } from '../../core/design-system/Modal';
import { Input } from '../../core/design-system/Input';
import { Select } from '../../core/design-system/Select';
import { Button } from '../../core/design-system/Button';
import { isValidEmail } from '../../core/utils/validators';

export const UsuarioModal = ({ isOpen, onClose, onSubmit, usuarioToEdit, isLoading = false }) => {
    const isEditing = !!usuarioToEdit;
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        rol: 'USUARIO',
        estado: 'ACTIVO',
        password: ''
    });
    const [errors, setErrors] = useState({});
    useEffect(() => {
        if (usuarioToEdit) {
            setFormData({
                nombre: usuarioToEdit.nombre,
                apellido: usuarioToEdit.apellido,
                email: usuarioToEdit.email,
                telefono: usuarioToEdit.telefono || '',
                rol: usuarioToEdit.rol,
                estado: usuarioToEdit.estado
            });
        }
        else {
            setFormData({
                nombre: '',
                apellido: '',
                email: '',
                telefono: '',
                rol: 'USUARIO',
                estado: 'ACTIVO',
                password: ''
            });
        }
        setErrors({});
    }, [usuarioToEdit, isOpen]);
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
        const errs = {};
        if (!formData.nombre.trim())
            errs.nombre = 'El nombre es obligatorio';
        if (!formData.apellido.trim())
            errs.apellido = 'El apellido es obligatorio';
        if (!formData.email.trim()) {
            errs.email = 'El correo electrónico es obligatorio';
        }
        else if (!isValidEmail(formData.email)) {
            errs.email = 'El formato de correo electrónico no es válido';
        }
        if (!isEditing && !formData.password) {
            errs.password = 'La contraseña inicial es requerida';
        }
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate())
            return;
        await onSubmit(formData);
    };
    return (<Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Editar Usuario' : 'Crear Nuevo Usuario'} footer={<>
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit} isLoading={isLoading}>
            {isEditing ? 'Actualizar Usuario' : 'Guardar Usuario'}
          </Button>
        </>}>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
          <Input label="Nombre" value={formData.nombre} onChange={(e) => handleChange('nombre', e.target.value)} error={errors.nombre} required/>
          <Input label="Apellido" value={formData.apellido} onChange={(e) => handleChange('apellido', e.target.value)} error={errors.apellido} required/>
        </div>

        <Input label="Correo Electrónico" type="email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} error={errors.email} required/>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.85rem' }}>
          <Input label="Teléfono" value={formData.telefono || ''} onChange={(e) => handleChange('telefono', e.target.value)} placeholder="+57 300 000 0000"/>
          <Select label="Rol del Usuario" value={formData.rol} onChange={(e) => handleChange('rol', e.target.value)} options={[
            { value: 'USUARIO', label: 'Estudiante / Talento' },
            { value: 'EMPRESA', label: 'Empresa (Publicador de Retos)' },
            { value: 'ADMIN', label: 'Administrador' }
        ]} required/>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isEditing ? '1fr' : '1fr 1fr', gap: '0.85rem' }}>
          <Select label="Estado" value={formData.estado} onChange={(e) => handleChange('estado', e.target.value)} options={[
            { value: 'ACTIVO', label: 'Activo' },
            { value: 'INACTIVO', label: 'Inactivo' }
        ]} required/>

          {!isEditing && (<Input label="Contraseña Inicial" type="password" value={formData.password || ''} onChange={(e) => handleChange('password', e.target.value)} error={errors.password} placeholder="••••••••" required/>)}
        </div>
      </form>
    </Modal>);
};

export default UsuarioModal;
