import React, { useState, useEffect } from 'react';
import { Modal } from '../../core/design-system/Modal';
import { Input } from '../../core/design-system/Input';
import { Select } from '../../core/design-system/Select';
import { Button } from '../../core/design-system/Button';
import { isValidEmail } from '../../core/utils/validators';

export const EmpresaModal = ({ isOpen, onClose, onSubmit, empresaToEdit, isLoading = false }) => {
    const isEditing = !!empresaToEdit;
    const [formData, setFormData] = useState({
        nombre: '',
        nit: '',
        sector: 'Tecnología',
        email: '',
        telefono: '',
        direccion: '',
        ciudad: 'Medellín',
        estado: 'ACTIVO'
    });
    const [errors, setErrors] = useState({});
    useEffect(() => {
        if (empresaToEdit) {
            setFormData({
                nombre: empresaToEdit.nombre,
                nit: empresaToEdit.nit,
                sector: empresaToEdit.sector,
                email: empresaToEdit.email,
                telefono: empresaToEdit.telefono,
                direccion: empresaToEdit.direccion || '',
                ciudad: empresaToEdit.ciudad,
                estado: empresaToEdit.estado
            });
        }
        else {
            setFormData({
                nombre: '',
                nit: '',
                sector: 'Tecnología',
                email: '',
                telefono: '',
                direccion: '',
                ciudad: 'Medellín',
                estado: 'ACTIVO'
            });
        }
        setErrors({});
    }, [empresaToEdit, isOpen]);
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
            errs.nombre = 'El nombre o razón social es obligatorio';
        if (!formData.nit.trim())
            errs.nit = 'El NIT es obligatorio';
        if (!formData.email.trim()) {
            errs.email = 'El correo electrónico corporativo es obligatorio';
        }
        else if (!isValidEmail(formData.email)) {
            errs.email = 'Formato de correo no válido';
        }
        if (!formData.telefono.trim())
            errs.telefono = 'El teléfono es obligatorio';
        if (!formData.ciudad.trim())
            errs.ciudad = 'La ciudad es obligatoria';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate())
            return;
        await onSubmit(formData);
    };
    return (<Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Editar Empresa' : 'Registrar Nueva Empresa'} footer={<>
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit} isLoading={isLoading}>
            {isEditing ? 'Actualizar Empresa' : 'Guardar Empresa'}
          </Button>
        </>}>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '0.85rem' }}>
          <Input label="Nombre o Razón Social" placeholder="Ej: Soluciones Digitales S.A.S." value={formData.nombre} onChange={(e) => handleChange('nombre', e.target.value)} error={errors.nombre} required/>
          <Input label="NIT" placeholder="Ej: 900.123.456-7" value={formData.nit} onChange={(e) => handleChange('nit', e.target.value)} error={errors.nit} required/>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
          <Select label="Sector Productivo" value={formData.sector} onChange={(e) => handleChange('sector', e.target.value)} options={[
            { value: 'Tecnología', label: 'Tecnología y Software' },
            { value: 'Financiero', label: 'Financiero y Fintech' },
            { value: 'Medio Ambiente', label: 'Medio Ambiente y Sostenibilidad' },
            { value: 'Salud', label: 'Salud y Farmacéutica' },
            { value: 'Educación', label: 'Educación y EdTech' },
            { value: 'Manufactura', label: 'Manufactura y Comercio' }
        ]} required/>
          <Input label="Ciudad / Municipio" placeholder="Ej: Medellín" value={formData.ciudad} onChange={(e) => handleChange('ciudad', e.target.value)} error={errors.ciudad} required/>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.85rem' }}>
          <Input label="Correo de Contacto" type="email" placeholder="contacto@empresa.com" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} error={errors.email} required/>
          <Input label="Teléfono" placeholder="+57 4 444 0000" value={formData.telefono} onChange={(e) => handleChange('telefono', e.target.value)} error={errors.telefono} required/>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '0.85rem' }}>
          <Input label="Dirección Física" placeholder="Ej: Calle 10 # 43E-20" value={formData.direccion || ''} onChange={(e) => handleChange('direccion', e.target.value)}/>
          <Select label="Estado" value={formData.estado} onChange={(e) => handleChange('estado', e.target.value)} options={[
            { value: 'ACTIVO', label: 'Activo' },
            { value: 'INACTIVO', label: 'Inactivo' }
        ]} required/>
        </div>
      </form>
    </Modal>);
};

export default EmpresaModal;
