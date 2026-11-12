import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Textarea } from '../common/Textarea';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { usuariosService } from '../../services/usuariosService';
import { empresasService } from '../../services/empresasService';
import { retosService } from '../../services/retosService';
export const RegistroModal = ({ isOpen, onClose, onSubmit, registroToEdit, isLoading = false }) => {
    const isEditing = !!registroToEdit;
    const [usuarios, setUsuarios] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    const [retos, setRetos] = useState([]);
    const [formData, setFormData] = useState({
        codigo: '',
        tipo: 'INSCRIPCION',
        descripcion: '',
        usuarioId: 1,
        empresaId: undefined,
        retoId: undefined,
        estado: 'PENDIENTE',
        observaciones: ''
    });
    const [errors, setErrors] = useState({});
    useEffect(() => {
        if (!isOpen)
            return;
        const loadRelations = async () => {
            try {
                const [usrData, empData, retData] = await Promise.all([
                    usuariosService.getAll({ estado: 'ACTIVO' }),
                    empresasService.getAll({ estado: 'ACTIVO' }),
                    retosService.getAll({ estado: 'ABIERTO' })
                ]);
                setUsuarios(usrData);
                setEmpresas(empData);
                setRetos(retData);
                // Ensure default usuarioId is valid if creating new
                if (!registroToEdit && usrData.length > 0) {
                    setFormData(prev => ({
                        ...prev,
                        usuarioId: prev.usuarioId || usrData[0].id
                    }));
                }
            }
            catch (e) {
                console.error('Error cargando relaciones para modal de registros', e);
            }
        };
        loadRelations();
        if (registroToEdit) {
            setFormData({
                codigo: registroToEdit.codigo,
                tipo: registroToEdit.tipo,
                descripcion: registroToEdit.descripcion,
                usuarioId: registroToEdit.usuarioId,
                empresaId: registroToEdit.empresaId,
                retoId: registroToEdit.retoId,
                estado: registroToEdit.estado,
                observaciones: registroToEdit.observaciones || ''
            });
        }
        else {
            setFormData({
                codigo: `REG-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
                tipo: 'INSCRIPCION',
                descripcion: '',
                usuarioId: 1,
                empresaId: undefined,
                retoId: undefined,
                estado: 'PENDIENTE',
                observaciones: ''
            });
        }
        setErrors({});
    }, [registroToEdit, isOpen]);
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
        if (!formData.codigo.trim())
            errs.codigo = 'El código del registro es requerido';
        if (!formData.descripcion.trim())
            errs.descripcion = 'La descripción es obligatoria';
        if (!formData.usuarioId)
            errs.usuarioId = 'Debe seleccionar un usuario responsable';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate())
            return;
        await onSubmit({
            ...formData,
            usuarioId: Number(formData.usuarioId),
            empresaId: formData.empresaId ? Number(formData.empresaId) : undefined,
            retoId: formData.retoId ? Number(formData.retoId) : undefined
        });
    };
    return (<Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Editar Registro' : 'Crear Nuevo Registro'} size="lg" footer={<>
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit} isLoading={isLoading}>
            {isEditing ? 'Actualizar Registro' : 'Guardar Registro'}
          </Button>
        </>}>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.85rem' }}>
          <Input label="Código Radicado" value={formData.codigo} onChange={(e) => handleChange('codigo', e.target.value)} error={errors.codigo} required/>

          <Select label="Tipo de Registro" value={formData.tipo} onChange={(e) => handleChange('tipo', e.target.value)} options={[
            { value: 'INSCRIPCION', label: 'Inscripción a Reto' },
            { value: 'EVALUACION', label: 'Evaluación Técnica' },
            { value: 'AUDITORIA', label: 'Auditoría' },
            { value: 'SOLICITUD', label: 'Solicitud' }
        ]} required/>

          <Select label="Estado" value={formData.estado} onChange={(e) => handleChange('estado', e.target.value)} options={[
            { value: 'PENDIENTE', label: 'Pendiente' },
            { value: 'APROBADO', label: 'Aprobado' },
            { value: 'RECHAZADO', label: 'Rechazado' },
            { value: 'COMPLETADO', label: 'Completado' }
        ]} required/>
        </div>

        <Textarea label="Descripción del Asunto" placeholder="Detalle el motivo y alcance de este registro..." value={formData.descripcion} onChange={(e) => handleChange('descripcion', e.target.value)} error={errors.descripcion} rows={2} required/>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
          <Select label="Usuario Responsable" value={formData.usuarioId} onChange={(e) => handleChange('usuarioId', e.target.value)} options={usuarios.map(u => ({ value: u.id, label: `${u.nombre} ${u.apellido} (${u.email})` }))} error={errors.usuarioId} required/>

          <Select label="Empresa Asociada (Opcional)" value={formData.empresaId || ''} onChange={(e) => handleChange('empresaId', e.target.value || undefined)} options={empresas.map(e => ({ value: e.id, label: e.nombre }))} placeholder="Seleccione una empresa..."/>
        </div>

        <div style={{ marginTop: '0.5rem' }}>
          <Select label="Reto Vinculado (Opcional)" value={formData.retoId || ''} onChange={(e) => handleChange('retoId', e.target.value || undefined)} options={retos.map(r => ({ value: r.id, label: r.titulo }))} placeholder="Seleccione un reto..."/>
        </div>

        <Textarea label="Observaciones / Comentarios Internos" placeholder="Notas adicionales o requerimientos del comité..." value={formData.observaciones || ''} onChange={(e) => handleChange('observaciones', e.target.value)} rows={2}/>
      </form>
    </Modal>);
};
export default RegistroModal;
