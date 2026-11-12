/**
 * ====================================================================
 * PROYECTO INTEGRADOR: CESDE GAMIFIED CHALLENGES
 * TAREA INDIVIDUAL 1: MÓDULO DE CATEGORÍAS (VISTA PRINCIPAL)
 * ====================================================================
 * Responsabilidad: Gestión integral y clasificación de áreas temáticas
 * Tabla BD asociada: categorias
 * Servicio API: src/services/Tarea1_CategoriasService.js
 * Componentes vinculados: CategoriaModal, CategoriaDetailModal
 * ====================================================================
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, RotateCcw } from 'lucide-react';
import { Tarea1_CategoriasService as categoriasService } from '../../services/Tarea1_CategoriasService';
import { useNotification } from '../../hooks/useNotification';
import Button from '../../components/common/Button';
import SearchBar from '../../components/common/SearchBar';
import Select from '../../components/common/Select';
import Badge from '../../components/common/Badge';
import Pagination from '../../components/common/Pagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import CategoriaModal from '../../components/categorias/CategoriaModal';
import { formatDateOnly } from '../../utils/formatters';

export const Tarea1_CategoriasPage = () => {
    const { showSuccess, showError } = useNotification();
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
          <h2 className="module-page-title">Módulo de Categorías</h2>
          <p className="module-page-subtitle">
            Organiza y clasifica las iniciativas, retos y registros temáticos de la plataforma.
          </p>
        </div>

        <Button variant="primary" icon={<Plus size={18}/>} onClick={() => {
            setSelectedCategoria(null);
            setIsModalOpen(true);
        }}>
          Nueva Categoría
        </Button>
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
      {isLoading ? (<LoadingSpinner message="Cargando categorías..."/>) : categorias.length === 0 ? (<EmptyState title="No hay categorías registradas" description="Crea una categoría para clasificar los retos y proyectos en el sistema." actionText="Nueva Categoría" onAction={() => {
                setSelectedCategoria(null);
                setIsModalOpen(true);
            }}/>) : (<div className="table-card">
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
                  <th style={{ textAlign: 'center' }}>Acciones</th>
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
                        <button className="btn btn-secondary btn-icon" title="Editar categoría" onClick={() => {
                    setSelectedCategoria(cat);
                    setIsModalOpen(true);
                }}>
                          <Edit2 size={16}/>
                        </button>
                        <button className="btn btn-outline btn-icon" style={{ color: 'var(--danger)', borderColor: 'var(--border-medium)' }} title="Eliminar categoría" onClick={() => setDeleteCategoria(cat)}>
                          <Trash2 size={16}/>
                        </button>
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
