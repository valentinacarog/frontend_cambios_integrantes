/**
 * ====================================================================
 * PROYECTO INTEGRADOR: CESDE GAMIFIED CHALLENGES
 * TAREA INDIVIDUAL 4: MÓDULO DE EMPRESAS (VISTA PRINCIPAL)
 * ====================================================================
 * Responsabilidad: Gestión y administración de empresas aliadas colaboradoras
 * Tabla BD asociada: empresas
 * Servicio API: src/services/Tarea4_EmpresasService.js
 * Componentes vinculados: EmpresaModal, EmpresaDetailModal
 * ====================================================================
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Building2, Plus, Edit2, Trash2, Eye, RotateCcw } from 'lucide-react';
import { Tarea4_EmpresasService as empresasService } from '../../services/Tarea4_EmpresasService';
import { useNotification } from '../../hooks/useNotification';
import Button from '../../components/common/Button';
import SearchBar from '../../components/common/SearchBar';
import Select from '../../components/common/Select';
import Badge from '../../components/common/Badge';
import Pagination from '../../components/common/Pagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmpresaModal from '../../components/empresas/EmpresaModal';
import EmpresaDetailModal from '../../components/empresas/EmpresaDetailModal';

export const Tarea4_EmpresasPage = () => {
    const { showSuccess, showError } = useNotification();
    const [empresas, setEmpresas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sectorFilter, setSectorFilter] = useState('');
    const [estadoFilter, setEstadoFilter] = useState('');
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    // Modals
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEmpresa, setSelectedEmpresa] = useState(null);
    const [detailEmpresa, setDetailEmpresa] = useState(null);
    const [deleteEmpresa, setDeleteEmpresa] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fetchEmpresas = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await empresasService.getAll({
                search: searchTerm,
                sector: sectorFilter || undefined,
                estado: estadoFilter || undefined
            });
            setEmpresas(data);
            setCurrentPage(1);
        }
        catch (err) {
            showError(err.message || 'Error al cargar empresas');
        }
        finally {
            setIsLoading(false);
        }
    }, [searchTerm, sectorFilter, estadoFilter, showError]);
    useEffect(() => {
        fetchEmpresas();
    }, [fetchEmpresas]);
    const handleResetFilters = () => {
        setSearchTerm('');
        setSectorFilter('');
        setEstadoFilter('');
    };
    const handleSaveEmpresa = async (formData) => {
        setIsSubmitting(true);
        try {
            if (selectedEmpresa) {
                await empresasService.update(selectedEmpresa.id, formData);
                showSuccess('Empresa actualizada correctamente');
            }
            else {
                await empresasService.create(formData);
                showSuccess('Empresa registrada correctamente');
            }
            setIsModalOpen(false);
            setSelectedEmpresa(null);
            await fetchEmpresas();
        }
        catch (err) {
            showError(err.message || 'Error al guardar empresa');
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleDeleteEmpresa = async () => {
        if (!deleteEmpresa)
            return;
        setIsSubmitting(true);
        try {
            await empresasService.delete(deleteEmpresa.id);
            showSuccess(`Empresa "${deleteEmpresa.nombre}" eliminada correctamente`);
            setDeleteEmpresa(null);
            await fetchEmpresas();
        }
        catch (err) {
            showError(err.message || 'Error al eliminar empresa');
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const paginatedData = empresas.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    return (<div>
      <div className="module-header">
        <div className="module-title-group">
          <h2 className="module-page-title">Módulo de Empresas</h2>
          <p className="module-page-subtitle">
            Gestiona las organizaciones vinculadas, datos corporativos y contacto institucional.
          </p>
        </div>

        <Button variant="primary" icon={<Plus size={18}/>} onClick={() => {
            setSelectedEmpresa(null);
            setIsModalOpen(true);
        }}>
          Nueva Empresa
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="search-box">
          <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Buscar por nombre, NIT, ciudad o sector..."/>
        </div>

        <div className="filter-select">
          <Select value={sectorFilter} onChange={(e) => setSectorFilter(e.target.value)} options={[
            { value: '', label: 'Todos los sectores' },
            { value: 'Tecnología', label: 'Tecnología' },
            { value: 'Financiero', label: 'Financiero' },
            { value: 'Medio Ambiente', label: 'Medio Ambiente' },
            { value: 'Salud', label: 'Salud' },
            { value: 'Educación', label: 'Educación' },
            { value: 'Manufactura', label: 'Manufactura' }
        ]}/>
        </div>

        <div className="filter-select">
          <Select value={estadoFilter} onChange={(e) => setEstadoFilter(e.target.value)} options={[
            { value: '', label: 'Todos los estados' },
            { value: 'ACTIVO', label: 'Activo' },
            { value: 'INACTIVO', label: 'Inactivo' }
        ]}/>
        </div>

        {(searchTerm || sectorFilter || estadoFilter) && (<Button variant="outline" size="sm" icon={<RotateCcw size={15}/>} onClick={handleResetFilters}>
            Limpiar Filtros
          </Button>)}
      </div>

      {/* Content */}
      {isLoading ? (<LoadingSpinner message="Cargando empresas..."/>) : empresas.length === 0 ? (<EmptyState title="No se encontraron empresas" description="Agrega una nueva empresa o modifica los criterios de búsqueda actuales." actionText="Registrar Empresa" onAction={() => {
                setSelectedEmpresa(null);
                setIsModalOpen(true);
            }}/>) : (<div className="table-card">
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Empresa / Razón Social</th>
                  <th>NIT</th>
                  <th>Sector</th>
                  <th>Contacto</th>
                  <th>Ciudad</th>
                  <th>Estado</th>
                  <th style={{ textAlign: 'center' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((emp) => (<tr key={emp.id}>
                    <td>
                      <span className="font-semibold" style={{ color: 'var(--text-muted)' }}>
                        #{emp.id}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-surface-alt)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary)'
                }}>
                          <Building2 size={16}/>
                        </div>
                        <span className="font-semibold">{emp.nombre}</span>
                      </div>
                    </td>
                    <td>{emp.nit}</td>
                    <td>
                      <Badge variant="neutral">{emp.sector}</Badge>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem' }}>
                        <div>{emp.email}</div>
                        <div style={{ color: 'var(--text-muted)' }}>{emp.telefono}</div>
                      </div>
                    </td>
                    <td>{emp.ciudad}</td>
                    <td>
                      <Badge variant={emp.estado === 'ACTIVO' ? 'success' : 'danger'}>
                        {emp.estado}
                      </Badge>
                    </td>
                    <td>
                      <div className="table-actions" style={{ justifyContent: 'center' }}>
                        <button className="btn btn-outline btn-icon" title="Ver ficha técnica" onClick={() => setDetailEmpresa(emp)}>
                          <Eye size={16}/>
                        </button>
                        <button className="btn btn-secondary btn-icon" title="Editar empresa" onClick={() => {
                    setSelectedEmpresa(emp);
                    setIsModalOpen(true);
                }}>
                          <Edit2 size={16}/>
                        </button>
                        <button className="btn btn-outline btn-icon" style={{ color: 'var(--danger)', borderColor: 'var(--border-medium)' }} title="Eliminar empresa" onClick={() => setDeleteEmpresa(emp)}>
                          <Trash2 size={16}/>
                        </button>
                      </div>
                    </td>
                  </tr>))}
              </tbody>
            </table>
          </div>

          <Pagination currentPage={currentPage} totalItems={empresas.length} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage}/>
        </div>)}

      {/* Modals */}
      <EmpresaModal isOpen={isModalOpen} onClose={() => {
            setIsModalOpen(false);
            setSelectedEmpresa(null);
        }} onSubmit={handleSaveEmpresa} empresaToEdit={selectedEmpresa} isLoading={isSubmitting}/>

      <EmpresaDetailModal isOpen={!!detailEmpresa} onClose={() => setDetailEmpresa(null)} empresa={detailEmpresa}/>

      <ConfirmDialog isOpen={!!deleteEmpresa} onClose={() => setDeleteEmpresa(null)} onConfirm={handleDeleteEmpresa} title="Confirmar Eliminación" message={`¿Estás seguro de que deseas eliminar la empresa "${deleteEmpresa?.nombre}"?`} isLoading={isSubmitting}/>
    </div>);
};

export const EmpresasPage = Tarea4_EmpresasPage;
export default Tarea4_EmpresasPage;
