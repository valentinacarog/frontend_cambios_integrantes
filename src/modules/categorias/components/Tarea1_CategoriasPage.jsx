/**
 * ====================================================================
 * PROYECTO INTEGRADOR: CESDE GAMIFIED CHALLENGES
 * TAREA INDIVIDUAL 1: MÓDULO DE CATEGORÍAS (VISTA PRINCIPAL)
 * ====================================================================
 * Responsabilidad: Gestión integral y clasificación de áreas temáticas
 * Tabla BD asociada: categorias
 * Servicio API: ../services/Tarea1_CategoriasService.js
 * Componentes vinculados: CategoriaModal
 * ====================================================================
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, RotateCcw } from 'lucide-react';
import { Tarea1_CategoriasService as categoriasService } from '../services/Tarea1_CategoriasService';
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
import CategoriaModal from './CategoriaModal';
import { formatDateOnly } from '../../core/utils/formatters';

export const Tarea1_CategoriasPage = () => {
    const { showSuccess, showError } = useNotification();
    const { isAdmin } = useAuth();
    const [categorias, setCategorias] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [estadoFilter, setEstadoFilter] = useState('');
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    // Modals
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategoria, setSelectedCategoria] = useState(null);
    const [deleteCategoria, setDeleteCategoria] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fetchCategorias = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await categoriasService.getAll({
                search: searchTerm,
                estado: estadoFilter || undefined
            });
            setCategorias(data);
            setCurrentPage(1);
        }
        catch (err) {
            showError(err.message || 'Error al cargar categorías');
        }
        finally {
            setIsLoading(false);
        }
    }, [searchTerm, estadoFilter, showError]);
    useEffect(() => {
        fetchCategorias();
    }, [fetchCategorias]);
    const handleResetFilters = () => {
        setSearchTerm('');
        setEstadoFilter('');
    };
    const handleSaveCategoria = async (formData) => {
        if (!isAdmin) {
            showError('Acción restringida: solo los administradores pueden crear o modificar categorías');
            return;
        }
        setIsSubmitting(true);
        try {
            if (selectedCategoria) {
                await categoriasService.update(selectedCategoria.id, formData);
                showSuccess('Categoría actualizada exitosamente');
            }
            else {
                await categoriasService.create(formData);
                showSuccess('Categoría creada exitosamente');
            }
            setIsModalOpen(false);
            setSelectedCategoria(null);
            await fetchCategorias();
        }
        catch (err) {
            showError(err.message || 'Error al guardar la categoría');
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleDeleteCategoria = async () => {
        if (!deleteCategoria)
            return;
        if (!isAdmin) {
            showError('Acción restringida: solo los administradores pueden eliminar categorías');
            return;
        }
        setIsSubmitting(true);
        try {
            await categoriasService.delete(deleteCategoria.id);
            showSuccess(`Categoría "${deleteCategoria.nombre}" eliminada exitosamente`);
            setDeleteCategoria(null);
            await fetchCategorias();
        }
        catch (err) {
            showError(err.message || 'Error al eliminar categoría');
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const paginatedData = categorias.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    return (<div>
      <div className="module-header">
        <div className="module-title-group">
          <h2 className="module-page-title">{isAdmin ? 'Módulo de Categorías' : 'Áreas y Especialidades Tech'}</h2>
          <p className="module-page-subtitle">
            {isAdmin 
              ? 'Organiza y clasifica las iniciativas, retos y registros temáticos de la plataforma.'
              : 'Explora las áreas temáticas y especialidades técnicas en las que puedes participar.'}
          </p>
        </div>

        {isAdmin && (
          <Button variant="primary" icon={<Plus size={18}/>} onClick={() => {
              setSelectedCategoria(null);
              setIsModalOpen(true);
          }}>
            Nueva Categoría
          </Button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="search-box">
          <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Buscar por nombre, código o descripción..."/>
        </div>

        <div className="filter-select">
          <Select value={estadoFilter} onChange={(e) => setEstadoFilter(e.target.value)} options={[
            { value: '', label: 'Todos los estados' },
            { value: 'ACTIVO', label: 'Activo' },
            { value: 'INACTIVO', label: 'Inactivo' }
        ]}/>
        </div>

        {(searchTerm || estadoFilter) && (<Button variant="outline" size="sm" icon={<RotateCcw size={15}/>} onClick={handleResetFilters}>
            Limpiar Filtros
          </Button>)}
      </div>

      {/* Table Content */}
      {isLoading ? (<LoadingSpinner message="Cargando categorías..."/>) : categorias.length === 0 ? (<EmptyState title="No hay categorías registradas" description={isAdmin ? "Crea una categoría para clasificar los retos y proyectos en el sistema." : "No hay categorías disponibles en este momento."} actionText={isAdmin ? "Nueva Categoría" : undefined} onAction={isAdmin ? () => {
                setSelectedCategoria(null);
                setIsModalOpen(true);
            } : undefined}/>) : (<div className="table-card">
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Categoría</th>
                  <th>Código</th>
                  <th>Descripción</th>
                  <th>Estado</th>
                  <th>Fecha Registro</th>
                  <th style={{ textAlign: 'center' }}>{isAdmin ? 'Acciones' : 'Modo'}</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((cat) => (<tr key={cat.id}>
                    <td>
                      <span className="font-semibold" style={{ color: 'var(--text-muted)' }}>
                        #{cat.id}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <span style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: cat.color || 'var(--primary)',
                    display: 'inline-block'
                }}/>
                        <span className="font-semibold">{cat.nombre}</span>
                      </div>
                    </td>
                    <td>
                      <code style={{ background: 'var(--bg-surface-alt)', padding: '2px 6px', borderRadius: '4px' }}>
                        {cat.codigo}
                      </code>
                    </td>
                    <td style={{ maxWidth: '320px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {cat.descripcion}
                    </td>
                    <td>
                      <Badge variant={cat.estado === 'ACTIVO' ? 'success' : 'danger'}>
                        {cat.estado}
                      </Badge>
                    </td>
                    <td>{formatDateOnly(cat.createdAt)}</td>
                    <td>
                      <div className="table-actions" style={{ justifyContent: 'center' }}>
                        {isAdmin ? (
                          <>
                            <button className="btn btn-secondary btn-icon" title="Editar categoría" onClick={() => {
                                setSelectedCategoria(cat);
                                setIsModalOpen(true);
                            }}>
                              <Edit2 size={16}/>
                            </button>
                            <button className="btn btn-outline btn-icon" style={{ color: 'var(--danger)', borderColor: 'var(--border-medium)' }} title="Eliminar categoría" onClick={() => setDeleteCategoria(cat)}>
                              <Trash2 size={16}/>
                            </button>
                          </>
                        ) : (
                          <Badge variant="neutral">Lectura</Badge>
                        )}
                      </div>
                    </td>
                  </tr>))}
              </tbody>
            </table>
          </div>

          <Pagination currentPage={currentPage} totalItems={categorias.length} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage}/>
        </div>)}

      {/* Modals */}
      <CategoriaModal isOpen={isModalOpen} onClose={() => {
            setIsModalOpen(false);
            setSelectedCategoria(null);
        }} onSubmit={handleSaveCategoria} categoriaToEdit={selectedCategoria} isLoading={isSubmitting}/>

      <ConfirmDialog isOpen={!!deleteCategoria} onClose={() => setDeleteCategoria(null)} onConfirm={handleDeleteCategoria} title="Confirmar Eliminación" message={`¿Estás seguro de que deseas eliminar la categoría "${deleteCategoria?.nombre}"? Esta acción puede afectar retos vinculados.`} isLoading={isSubmitting}/>
    </div>);
};

export const CategoriasPage = Tarea1_CategoriasPage;
export default Tarea1_CategoriasPage;
