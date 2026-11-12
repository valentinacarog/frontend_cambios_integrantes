import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Textarea } from '../common/Textarea';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { empresasService } from '../../services/empresasService';
import { categoriasService } from '../../services/categoriasService';
export const RetoModal = ({ isOpen, onClose, onSubmit, retoToEdit, isLoading = false }) => {
    const isEditing = !!retoToEdit;
    const [empresas, setEmpresas] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        empresaId: 1,
        categoriaId: 1,
        dificultad: 'MEDIA',
        puntos: 1000,
        fechaLimite: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        estado: 'ABIERTO'
    });
    const [errors, setErrors] = useState({});
    useEffect(() => {
        const loadDropdownData = async () => {
            try {
                const [empData, catData] = await Promise.all([
                    empresasService.getAll({ estado: 'ACTIVO' }),
                    categoriasService.getAll({ estado: 'ACTIVO' })
                ]);
                setEmpresas(empData);
                setCategorias(catData);
            }
            catch (e) {
                console.error('Error cargando listas para el modal de retos', e);
            }
        };
        if (isOpen) {
            loadDropdownData();
        }
    }, [isOpen]);
    useEffect(() => {
        if (retoToEdit) {
            setFormData({
                titulo: retoToEdit.titulo,
                descripcion: retoToEdit.descripcion,
                empresaId: retoToEdit.empresaId,
                categoriaId: retoToEdit.categoriaId,
                dificultad: retoToEdit.dificultad,
                puntos: retoToEdit.puntos,
                fechaLimite: retoToEdit.fechaLimite.split('T')[0],
                estado: retoToEdit.estado
            });
        }
        else {
            setFormData({
                titulo: '',
                descripcion: '',
                empresaId: empresas.length > 0 ? empresas[0].id : 1,
                categoriaId: categorias.length > 0 ? categorias[0].id : 1,
                dificultad: 'MEDIA',
                puntos: 1000,
                fechaLimite: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                estado: 'ABIERTO'
            });
        }
        setErrors({});
    }, [retoToEdit, isOpen, empresas, categorias]);
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
        if (!formData.titulo.trim())
            errs.titulo = 'El título del reto es obligatorio';
        if (!formData.descripcion.trim())
            errs.descripcion = 'La descripción es obligatoria';
        if (!formData.empresaId)
            errs.empresaId = 'Debe seleccionar una empresa';
        if (!formData.categoriaId)
            errs.categoriaId = 'Debe seleccionar una categoría';
        if (!formData.fechaLimite)
            errs.fechaLimite = 'La fecha límite es requerida';
        if (formData.puntos <= 0)
            errs.puntos = 'Los puntos deben ser mayores a 0';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate())
            return;
        await onSubmit({
            ...formData,
            empresaId: Number(formData.empresaId),
            categoriaId: Number(formData.categoriaId),
            puntos: Number(formData.puntos)
        });
    };
    return (<Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Editar Reto' : 'Crear Nuevo Reto'} size="lg" footer={<>
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit} isLoading={isLoading}>
            {isEditing ? 'Actualizar Reto' : 'Publicar Reto'}
          </Button>
        </>}>
      <form onSubmit={handleSubmit}>
        <Input label="Título del Reto" placeholder="Ej: Optimización de Algoritmo de Enrutamiento" value={formData.titulo} onChange={(e) => handleChange('titulo', e.target.value)} error={errors.titulo} required/>

        <Textarea label="Descripción y Objetivos" placeholder="Detalla el problema a resolver, especificaciones y criterios de aceptación..." value={formData.descripcion} onChange={(e) => handleChange('descripcion', e.target.value)} error={errors.descripcion} rows={3} required/>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
          <Select label="Empresa Promotora" value={formData.empresaId} onChange={(e) => handleChange('empresaId', e.target.value)} options={empresas.map(emp => ({ value: emp.id, label: emp.nombre }))} error={errors.empresaId} required/>

          <Select label="Categoría Temática" value={formData.categoriaId} onChange={(e) => handleChange('categoriaId', e.target.value)} options={categorias.map(cat => ({ value: cat.id, label: cat.nombre }))} error={errors.categoriaId} required/>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr 1fr', gap: '0.85rem' }}>
          <Select label="Dificultad" value={formData.dificultad} onChange={(e) => handleChange('dificultad', e.target.value)} options={[
            { value: 'FACIL', label: 'Fácil' },
            { value: 'MEDIA', label: 'Media' },
            { value: 'DIFICIL', label: 'Difícil' }
        ]} required/>

          <Input label="Puntos / Recompensa" type="number" min="100" step="50" value={formData.puntos} onChange={(e) => handleChange('puntos', e.target.value)} error={errors.puntos} required/>

          <Input label="Fecha Límite" type="date" value={formData.fechaLimite} onChange={(e) => handleChange('fechaLimite', e.target.value)} error={errors.fechaLimite} required/>

          <Select label="Estado" value={formData.estado} onChange={(e) => handleChange('estado', e.target.value)} options={[
            { value: 'ABIERTO', label: 'Abierto' },
            { value: 'EN_PROGRESO', label: 'En Progreso' },
            { value: 'CERRADO', label: 'Cerrado' },
            { value: 'CANCELADO', label: 'Cancelado' }
        ]} required/>
        </div>
      </form>
    </Modal>);
};
export default RetoModal;
