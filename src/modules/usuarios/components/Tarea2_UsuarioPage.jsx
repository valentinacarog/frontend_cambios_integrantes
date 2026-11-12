/**
 * ====================================================================
 * PROYECTO INTEGRADOR: CESDE GAMIFIED CHALLENGES
 * TAREA INDIVIDUAL 2: MÓDULO DE USUARIOS & ACCESOS (VISTA PRINCIPAL)
 * ====================================================================
 * Responsabilidad: Gestión de cuentas de usuario, roles (ADMIN/EMPRESA/USUARIO) y accesos
 * Tabla BD asociada: usuarios
 * Servicios API: ../services/Tarea2_UsuarioService.js
 * Componentes vinculados: UsuarioModal, UsuarioDetailModal
 * ====================================================================
 */

import React, { useState, useEffect, useCallback } from 'react';
import { UserPlus, Edit2, Trash2, Eye, RotateCcw } from 'lucide-react';
import { Tarea2_UsuarioService as usuariosService } from '../services/Tarea2_UsuarioService';
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
import UsuarioModal from './UsuarioModal';
import UsuarioDetailModal from './UsuarioDetailModal';
import { formatDateOnly } from '../../core/utils/formatters';

export const Tarea2_UsuarioPage = () => {
    const { showSuccess, showError } = useNotification();
    const { isAdmin } = useAuth();
    const [usuarios, setUsuarios] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [rolFilter, setRolFilter] = useState('');
    const [estadoFilter, setEstadoFilter] = useState('');
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    // Modals
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUsuario, setSelectedUsuario] = useState(null);
    const [detailUsuario, setDetailUsuario] = useState(null);
    const [deleteUsuario, setDeleteUsuario] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fetchUsuarios = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await usuariosService.getAll({
                search: searchTerm,
                rol: rolFilter || undefined,
                estado: estadoFilter || undefined
            });
            setUsuarios(data);
            setCurrentPage(1);
        }
        catch (err) {
            showError(err.message || 'Error al cargar usuarios');
        }
        finally {
            setIsLoading(false);
        }
    }, [searchTerm, rolFilter, estadoFilter, showError]);
    useEffect(() => {
        fetchUsuarios();
    }, [fetchUsuarios]);
    const handleResetFilters = () => {
        setSearchTerm('');
        setRolFilter('');
        setEstadoFilter('');
    };
    const handleSaveUsuario = async (formData) => {
        if (!isAdmin) {
            showError('Acción restringida: solo los administradores tienen permiso para crear o modificar usuarios');
            return;
        }
        setIsSubmitting(true);
        try {
            if (selectedUsuario) {
                await usuariosService.update(selectedUsuario.id, formData);
                showSuccess('Usuario actualizado correctamente');
            }
            else {
                await usuariosService.create(formData);
                showSuccess('Usuario creado correctamente');
            }
            setIsModalOpen(false);
            setSelectedUsuario(null);
            await fetchUsuarios();
        }
        catch (err) {
            showError(err.message || 'Error al guardar el usuario');
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleDeleteUsuario = async () => {
        if (!deleteUsuario)
            return;
        if (!isAdmin) {
            showError('Acción restringida: solo los administradores pueden eliminar usuarios');
            return;
        }
        setIsSubmitting(true);
        try {
            await usuariosService.delete(deleteUsuario.id);
            showSuccess(`Usuario ${deleteUsuario.nombre} ${deleteUsuario.apellido} eliminado correctamente`);
            setDeleteUsuario(null);
            await fetchUsuarios();
        }
        catch (err) {
            showError(err.message || 'Error al eliminar usuario');
        }
        finally {
            setIsSubmitting(false);
        }
    };
    // Pagination calculations
    const paginatedData = usuarios.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    return (<div>
      <div className="module-header">
        <div className="module-title-group">
          <h2 className="module-page-title">{isAdmin ? 'Módulo de Usuarios' : 'Directorio de Talentos & Comunidad'}</h2>
          <p className="module-page-subtitle">
            {isAdmin 
              ? 'Administra las cuentas de usuario, asignación de roles y estados del sistema.'
              : 'Directorio y comunidad de estudiantes, talentos y miembros de la plataforma CESDE.'}
          </p>
        </div>

        {isAdmin && (
          <Button variant="primary" icon={<UserPlus size={18}/>} onClick={() => {
              setSelectedUsuario(null);
              setIsModalOpen(true);
          }}>
            Nuevo Usuario
          </Button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="search-box">
          <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Buscar por nombre, apellido o email..."/>
        </div>

        <div className="filter-select">
          <Select value={rolFilter} onChange={(e) => setRolFilter(e.target.value)} options={[
            { value: '', label: 'Todos los roles' },
            { value: 'ADMIN', label: 'Administrador' },
            { value: 'EMPRESA', label: 'Empresa Aliada' },
            { value: 'USUARIO', label: 'Estudiante / Talento' }
        ]}/>
        </div>

        <div className="filter-select">
          <Select value={estadoFilter} onChange={(e) => setEstadoFilter(e.target.value)} options={[
            { value: '', label: 'Todos los estados' },
            { value: 'ACTIVO', label: 'Activo' },
            { value: 'INACTIVO', label: 'Inactivo' }
        ]}/>
        </div>

        {(searchTerm || rolFilter || estadoFilter) && (<Button variant="outline" size="sm" icon={<RotateCcw size={15}/>} onClick={handleResetFilters}>
            Limpiar Filtros
          </Button>)}
      </div>

      {/* Content */}
      {isLoading ? (<LoadingSpinner message="Cargando listado de usuarios..."/>) : usuarios.length === 0 ? (<EmptyState title="No se encontraron usuarios" description={isAdmin ? "Intenta modificar los filtros de búsqueda o crea un nuevo usuario en el sistema." : "No hay usuarios que coincidan con los filtros seleccionados."} actionText={isAdmin ? "Crear Usuario" : undefined} onAction={isAdmin ? () => {
                setSelectedUsuario(null);
                setIsModalOpen(true);
            } : undefined}/>) : (<div className="table-card">
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Usuario</th>
                  <th>Correo Electrónico</th>
                  <th>Teléfono</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Fecha Registro</th>
                  <th style={{ textAlign: 'center' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((usr) => (<tr key={usr.id}>
                    <td>
                      <span className="font-semibold" style={{ color: 'var(--text-muted)' }}>
                        #{usr.id}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="user-avatar" style={{ width: '30px', height: '30px', fontSize: '0.75rem' }}>
                          {usr.nombre.charAt(0)}
                        </div>
                        <span className="font-semibold">
                          {usr.nombre} {usr.apellido}
                        </span>
                      </div>
                    </td>
                    <td>{usr.email}</td>
                    <td>{usr.telefono || '-'}</td>
                    <td>
                      <Badge variant={usr.rol === 'ADMIN' ? 'primary' : (usr.rol === 'EMPRESA' || usr.rol === 'SUPERVISOR') ? 'warning' : 'neutral'}>
                        {usr.rol === 'SUPERVISOR' || usr.rol === 'EMPRESA' ? 'EMPRESA' : usr.rol === 'USUARIO' ? 'ESTUDIANTE' : usr.rol}
                      </Badge>
                    </td>
                    <td>
                      <Badge variant={usr.estado === 'ACTIVO' ? 'success' : 'danger'}>
                        {usr.estado}
                      </Badge>
                    </td>
                    <td>{formatDateOnly(usr.createdAt)}</td>
                    <td>
                      <div className="table-actions" style={{ justifyContent: 'center' }}>
                        <button className="btn btn-outline btn-icon" title="Ver detalle" onClick={() => setDetailUsuario(usr)}>
                          <Eye size={16}/>
                        </button>
                        {isAdmin && (
                          <>
                            <button className="btn btn-secondary btn-icon" title="Editar usuario" onClick={() => {
                                setSelectedUsuario(usr);
                                setIsModalOpen(true);
                            }}>
                              <Edit2 size={16}/>
                            </button>
                            <button className="btn btn-outline btn-icon" style={{ color: 'var(--danger)', borderColor: 'var(--border-medium)' }} title="Eliminar usuario" onClick={() => setDeleteUsuario(usr)}>
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

          <Pagination currentPage={currentPage} totalItems={usuarios.length} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage}/>
        </div>)}

      {/* Modals */}
      <UsuarioModal isOpen={isModalOpen} onClose={() => {
            setIsModalOpen(false);
            setSelectedUsuario(null);
        }} onSubmit={handleSaveUsuario} usuarioToEdit={selectedUsuario} isLoading={isSubmitting}/>

      <UsuarioDetailModal isOpen={!!detailUsuario} onClose={() => setDetailUsuario(null)} usuario={detailUsuario}/>

      <ConfirmDialog isOpen={!!deleteUsuario} onClose={() => setDeleteUsuario(null)} onConfirm={handleDeleteUsuario} title="Confirmar Eliminación" message={`¿Estás seguro de que deseas eliminar permanentemente al usuario "${deleteUsuario?.nombre} ${deleteUsuario?.apellido}"? Esta acción no se puede deshacer.`} isLoading={isSubmitting}/>
    </div>);
};

export const UsuariosPage = Tarea2_UsuarioPage;
export default Tarea2_UsuarioPage;
