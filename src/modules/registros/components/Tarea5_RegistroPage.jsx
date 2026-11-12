/**
 * ====================================================================
 * PROYECTO INTEGRADOR: CESDE GAMIFIED CHALLENGES
 * TAREA INDIVIDUAL 5: MÓDULO DE REGISTROS (VISTA PRINCIPAL)
 * ====================================================================
 * Responsabilidad: Bitácora de inscripciones, evaluaciones técnicas y auditorías
 * Tabla BD asociada: registros
 * Servicio API: ../services/Tarea5_RegistroService.js
 * Componentes vinculados: RegistroModal, RegistroDetailModal
 * ====================================================================
 */

import React, { useState, useEffect, useCallback } from 'react';
import { FileText, Plus, Edit2, Trash2, Eye, RotateCcw } from 'lucide-react';
import { Tarea5_RegistroService as registrosService } from '../services/Tarea5_RegistroService';
import { useNotification } from '../../core/hooks/useNotification';
import { useAuth } from '../../auth/hooks/useAuth';
import Button from '../../core/design-system/Button';
import SearchBar from '../../core/design-system/SearchBar';
import Select from '../../core/design-system/Select';
import Badge from '../../core/design-system/Badge';
import Pagination from '../../core/design-system/Pagination';
import LoadingSpinner from '../../core/design-system/LoadingSpinner';
import EmptyState from '../../core/design-system/EmptyState';
import ConfirmDialog from '../../core/design-system/ConfirmDialog';
import RegistroModal from './RegistroModal';
import RegistroDetailModal from './RegistroDetailModal';
import { formatDateOnly } from '../../core/utils/formatters';

export const Tarea5_RegistroPage = () => {
    const { showSuccess, showError } = useNotification();
    const { isAdmin } = useAuth();
    const [registros, setRegistros] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [tipoFilter, setTipoFilter] = useState('');
    const [estadoFilter, setEstadoFilter] = useState('');
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    // Modals
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRegistro, setSelectedRegistro] = useState(null);
    const [detailRegistro, setDetailRegistro] = useState(null);
    const [deleteRegistro, setDeleteRegistro] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fetchRegistros = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await registrosService.getAll({
                search: searchTerm,
                tipo: tipoFilter || undefined,
                estado: estadoFilter || undefined
            });
            setRegistros(data);
            setCurrentPage(1);
        }
        catch (err) {
            showError(err.message || 'Error al cargar registros');
        }
        finally {
            setIsLoading(false);
        }
    }, [searchTerm, tipoFilter, estadoFilter, showError]);
    useEffect(() => {
        fetchRegistros();
    }, [fetchRegistros]);
    const handleResetFilters = () => {
        setSearchTerm('');
        setTipoFilter('');
        setEstadoFilter('');
    };
    const handleSaveRegistro = async (formData) => {
        setIsSubmitting(true);
        try {
            if (selectedRegistro) {
                await registrosService.update(selectedRegistro.id, formData);
                showSuccess('Registro actualizado correctamente');
            }
            else {
                await registrosService.create(formData);
                showSuccess('Registro radicado correctamente');
            }
            setIsModalOpen(false);
            setSelectedRegistro(null);
            await fetchRegistros();
        }
        catch (err) {
            showError(err.message || 'Error al guardar registro');
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleDeleteRegistro = async () => {
        if (!deleteRegistro)
            return;
        if (!isAdmin) {
            showError('Acción restringida: solo los administradores pueden eliminar registros del historial');
            return;
        }
        setIsSubmitting(true);
        try {
            await registrosService.delete(deleteRegistro.id);
            showSuccess(`Registro radicado ${deleteRegistro.codigo} eliminado`);
            setDeleteRegistro(null);
            await fetchRegistros();
        }
        catch (err) {
            showError(err.message || 'Error al eliminar registro');
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const paginatedData = registros.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    return (<div>
      <div className="module-header">
        <div className="module-title-group">
          <h2 className="module-page-title">Módulo de Registros</h2>
          <p className="module-page-subtitle">
            Control de auditoría, trazabilidad de solicitudes, inscripciones y evaluaciones.
          </p>
        </div>

        <Button variant="primary" icon={<Plus size={18}/>} onClick={() => {
            setSelectedRegistro(null);
            setIsModalOpen(true);
        }}>
          Nuevo Registro
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="search-box">
          <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Buscar por código, responsable, empresa o asunto..."/>
        </div>

        <div className="filter-select">
          <Select value={tipoFilter} onChange={(e) => setTipoFilter(e.target.value)} options={[
            { value: '', label: 'Todos los tipos' },
            { value: 'INSCRIPCION', label: 'Inscripción' },
            { value: 'EVALUACION', label: 'Evaluación' },
            { value: 'AUDITORIA', label: 'Auditoría' },
            { value: 'SOLICITUD', label: 'Solicitud' }
        ]}/>
        </div>

        <div className="filter-select">
          <Select value={estadoFilter} onChange={(e) => setEstadoFilter(e.target.value)} options={[
            { value: '', label: 'Todos los estados' },
            { value: 'PENDIENTE', label: 'Pendiente' },
            { value: 'APROBADO', label: 'Aprobado' },
            { value: 'RECHAZADO', label: 'Rechazado' },
            { value: 'COMPLETADO', label: 'Completado' }
        ]}/>
        </div>

        {(searchTerm || tipoFilter || estadoFilter) && (<Button variant="outline" size="sm" icon={<RotateCcw size={15}/>} onClick={handleResetFilters}>
            Limpiar Filtros
          </Button>)}
      </div>

      {/* Content */}
      {isLoading ? (<LoadingSpinner message="Cargando registros..."/>) : registros.length === 0 ? (<EmptyState title="No se encontraron registros" description="Radica un nuevo trámite o ajusta los criterios de filtrado seleccionados." actionText="Radicar Registro" onAction={() => {
                setSelectedRegistro(null);
                setIsModalOpen(true);
            }}/>) : (<div className="table-card">
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Radicado</th>
                  <th>Tipo</th>
                  <th>Descripción</th>
                  <th>Usuario</th>
                  <th>Empresa</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th style={{ textAlign: 'center' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((reg) => (<tr key={reg.id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <FileText size={16} style={{ color: 'var(--primary)' }}/>
                        <span className="font-semibold" style={{ fontFamily: 'monospace' }}>
                          {reg.codigo}
                        </span>
                      </div>
                    </td>
                    <td>
                      <Badge variant="neutral">{reg.tipo}</Badge>
                    </td>
                    <td style={{ maxWidth: '240px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {reg.descripcion}
                    </td>
                    <td>{reg.usuarioNombre || `Usuario #${reg.usuarioId}`}</td>
                    <td>{reg.empresaNombre || '-'}</td>
                    <td>{formatDateOnly(reg.createdAt)}</td>
                    <td>
                      <Badge variant={reg.estado === 'APROBADO' || reg.estado === 'COMPLETADO'
                    ? 'success'
                    : reg.estado === 'PENDIENTE'
                        ? 'warning'
                        : 'danger'}>
                        {reg.estado}
                      </Badge>
                    </td>
                    <td>
                      <div className="table-actions" style={{ justifyContent: 'center' }}>
                        <button className="btn btn-outline btn-icon" title="Ver detalle del registro" onClick={() => setDetailRegistro(reg)}>
                          <Eye size={16}/>
                        </button>
                        {isAdmin && (
                          <>
                            <button className="btn btn-secondary btn-icon" title="Editar registro" onClick={() => {
                                setSelectedRegistro(reg);
                                setIsModalOpen(true);
                            }}>
                              <Edit2 size={16}/>
                            </button>
                            <button className="btn btn-outline btn-icon" style={{ color: 'var(--danger)', borderColor: 'var(--border-medium)' }} title="Eliminar registro" onClick={() => setDeleteRegistro(reg)}>
                              <Trash2 size={16}/>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>))}
              </tbody>
            </table>
          </div>

          <Pagination currentPage={currentPage} totalItems={registros.length} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage}/>
        </div>)}

      {/* Modals */}
      <RegistroModal isOpen={isModalOpen} onClose={() => {
            setIsModalOpen(false);
            setSelectedRegistro(null);
        }} onSubmit={handleSaveRegistro} registroToEdit={selectedRegistro} isLoading={isSubmitting}/>

      <RegistroDetailModal isOpen={!!detailRegistro} onClose={() => setDetailRegistro(null)} registro={detailRegistro}/>

      <ConfirmDialog isOpen={!!deleteRegistro} onClose={() => setDeleteRegistro(null)} onConfirm={handleDeleteRegistro} title="Confirmar Eliminación" message={`¿Estás seguro de que deseas eliminar el registro "${deleteRegistro?.codigo}"?`} isLoading={isSubmitting}/>
    </div>);
};

export const RegistrosPage = Tarea5_RegistroPage;
export default Tarea5_RegistroPage;
