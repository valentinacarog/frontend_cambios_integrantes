import React, { useState, useEffect } from 'react';
import { Modal } from '../../core/design-system/Modal';
import { Input } from '../../core/design-system/Input';
import { Textarea } from '../../core/design-system/Textarea';
import { Select } from '../../core/design-system/Select';
import { Button } from '../../core/design-system/Button';

export const CategoriaModal = ({ isOpen, onClose, onSubmit, categoriaToEdit, isLoading = false }) => {
    const isEditing = !!categoriaToEdit;
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        codigo: '',
        estado: 'ACTIVO',
        color: '#4f46e5'
    });
    const [errors, setErrors] = useState({});
    useEffect(() => {
        if (categoriaToEdit) {
            setFormData({
                nombre: categoriaToEdit.nombre,
                descripcion: categoriaToEdit.descripcion,
                codigo: categoriaToEdit.codigo,
                estado: categoriaToEdit.estado,
                color: categoriaToEdit.color || '#4f46e5'
            });
        }
        else {
            setFormData({
                nombre: '',
                descripcion: '',
                codigo: '',
                estado: 'ACTIVO',
                color: '#4f46e5'
            });
        }
        setErrors({});
    }, [categoriaToEdit, isOpen]);
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
            errs.nombre = 'El nombre de la categoría es requerido';
        if (!formData.descripcion.trim())
            errs.descripcion = 'La descripción es requerida';
        if (!formData.codigo.trim())
            errs.codigo = 'El código de la categoría es requerido';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate())
            return;
        await onSubmit(formData);
    };
    return (<Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Editar Categoría' : 'Crear Nueva Categoría'} footer={<>
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit} isLoading={isLoading}>
            {isEditing ? 'Actualizar Categoría' : 'Guardar Categoría'}
          </Button>
        </>}>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '0.85rem' }}>
          <Input label="Nombre de la Categoría" placeholder="Ej: Sostenibilidad Ambiental" value={formData.nombre} onChange={(e) => handleChange('nombre', e.target.value)} error={errors.nombre} required/>
          <Input label="Código Identificador" placeholder="Ej: CAT-SOST-01" value={formData.codigo} onChange={(e) => handleChange('codigo', e.target.value)} error={errors.codigo} required/>
        </div>

        <Textarea label="Descripción Detallada" placeholder="Describe el alcance y temas que abarca esta categoría..." value={formData.descripcion} onChange={(e) => handleChange('descripcion', e.target.value)} error={errors.descripcion} rows={3} required/>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
          <Select label="Estado" value={formData.estado} onChange={(e) => handleChange('estado', e.target.value)} options={[
            { value: 'ACTIVO', label: 'Activo' },
            { value: 'INACTIVO', label: 'Inactivo' }
        ]} required/>

          <div className="form-group">
            <label className="form-label">Color Distintivo</label>
            <div className="flex items-center gap-3" style={{ marginTop: '0.2rem' }}>
              <input type="color" value={formData.color || '#4f46e5'} onChange={(e) => handleChange('color', e.target.value)} style={{
            width: '44px',
            height: '38px',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            padding: '2px'
        }}/>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                {formData.color}
              </span>
            </div>
          </div>
        </div>
      </form>
    </Modal>);
};

export default CategoriaModal;
