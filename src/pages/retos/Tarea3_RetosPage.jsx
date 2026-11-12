/**
 * ====================================================================
 * PROYECTO INTEGRADOR: CESDE GAMIFIED CHALLENGES
 * TAREA INDIVIDUAL 3: MÓDULO DE RETOS & GAMIFICACIÓN (VISTA PRINCIPAL)
 * ====================================================================
 * Responsabilidad: Creación de desafíos técnicos, dificultad, recompensas XP y fechas
 * Tabla BD asociada: retos
 * Servicio API: src/services/Tarea3_RetosService.js
 * Componentes vinculados: RetoModal, RetoDetailModal
 * ====================================================================
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Trophy, Plus, Edit2, Trash2, Eye, RotateCcw, LayoutGrid, List, Calendar, Building2, CheckCircle2, Star, Sparkles, ArrowRight, Code2, Briefcase } from 'lucide-react';
import { Tarea3_RetosService as retosService } from '../../services/Tarea3_RetosService';
import { useNotification } from '../../hooks/useNotification';
import Button from '../../components/common/Button';
import SearchBar from '../../components/common/SearchBar';
import Select from '../../components/common/Select';
import Badge from '../../components/common/Badge';
import Pagination from '../../components/common/Pagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import RetoModal from '../../components/retos/RetoModal';
import RetoDetailModal from '../../components/retos/RetoDetailModal';
import { formatDateOnly, formatPoints } from '../../utils/formatters';

// Helper to assign realistic software tags based on challenge topic
const getTechTags = (reto) => {
  const text = `${reto.titulo} ${reto.descripcion} ${reto.categoriaNombre}`.toLowerCase();
  const tags = [];
  if (text.includes('servidor') || text.includes('autoescalado') || text.includes('cloud')) {
    tags.push('Python', 'Docker', 'Linux', 'AWS');
  } else if (text.includes('móvil') || text.includes('aplicación') || text.includes('trazabilidad')) {
    tags.push('React Native', 'Node.js', 'PostgreSQL');
  } else if (text.includes('crédito') || text.includes('riesgo') || text.includes('fintech') || text.includes('predictivo')) {
    tags.push('Python', 'FastAPI', 'Machine Learning');
  } else if (text.includes('web') || text.includes('frontend') || text.includes('interfaz')) {
    tags.push('React', 'TypeScript', 'TailwindCSS');
  } else {
    tags.push('Node.js', 'REST API', 'Git');
  }
  return tags;
};

export const Tarea3_RetosPage = () => {
    const { showSuccess, showError } = useNotification();
    const [retos, setRetos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [dificultadFilter, setDificultadFilter] = useState('');
    const [estadoFilter, setEstadoFilter] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
    const [activeTab, setActiveTab] = useState('all'); // 'all' | 'accepted'
    const [acceptedRetos, setAcceptedRetos] = useState(() => {
      try {
        return JSON.parse(localStorage.getItem('cesde_accepted_retos') || '[]');
      } catch {
        return [];
      }
    });

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // Modals
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedReto, setSelectedReto] = useState(null);
    const [detailReto, setDetailReto] = useState(null);
    const [deleteReto, setDeleteReto] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchRetos = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await retosService.getAll({
                search: searchTerm,
                dificultad: dificultadFilter || undefined,
                estado: estadoFilter || undefined
            });
            setRetos(data);
            setCurrentPage(1);
        }
        catch (err) {
            showError(err.message || 'Error al cargar retos');
        }
        finally {
            setIsLoading(false);
        }
    }, [searchTerm, dificultadFilter, estadoFilter, showError]);

    useEffect(() => {
        fetchRetos();
    }, [fetchRetos]);

    const handleResetFilters = () => {
        setSearchTerm('');
        setDificultadFilter('');
        setEstadoFilter('');
    };

    const handleAcceptReto = (reto) => {
        if (acceptedRetos.includes(reto.id)) {
            showSuccess(`Ya tienes en progreso el reto "${reto.titulo}".`);
            return;
        }
        const updated = [...acceptedRetos, reto.id];
        setAcceptedRetos(updated);
        try {
            localStorage.setItem('cesde_accepted_retos', JSON.stringify(updated));
        } catch (e) {
            console.error(e);
        }
        showSuccess(`¡Has aceptado el desafío "${reto.titulo}" de ${reto.empresaNombre || 'la empresa'}!`);
    };

    const handleSaveReto = async (formData) => {
        setIsSubmitting(true);
        try {
            if (selectedReto) {
                await retosService.update(selectedReto.id, formData);
                showSuccess('Reto actualizado correctamente');
            }
            else {
                await retosService.create(formData);
                showSuccess('Reto publicado correctamente');
            }
            setIsModalOpen(false);
            setSelectedReto(null);
            await fetchRetos();
        }
        catch (err) {
            showError(err.message || 'Error al guardar el reto');
        }
        finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteReto = async () => {
        if (!deleteReto)
            return;
        setIsSubmitting(true);
        try {
            await retosService.delete(deleteReto.id);
            showSuccess(`Reto "${deleteReto.titulo}" eliminado exitosamente`);
            setDeleteReto(null);
            await fetchRetos();
        }
        catch (err) {
            showError(err.message || 'Error al eliminar reto');
        }
        finally {
            setIsSubmitting(false);
        }
    };

    const totalPuntos = retos.reduce((acc, r) => acc + (Number(r.puntos) || 0), 0);
    const displayedRetos = activeTab === 'accepted'
      ? retos.filter((r) => acceptedRetos.includes(r.id))
      : retos;
    const paginatedData = displayedRetos.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
      <div className="retos-page-hub">
        {/* TOP HUB BANNER & CONTEXT (HERO + PLATFORM METRICS) */}
        <div className="hub-header-container">
          <div className="hub-header-main">
            <div className="hub-title-wrapper">
              <div className="hub-pill-tag">
                <Sparkles size={13} style={{ color: 'var(--primary)' }}/>
                <span>Plataforma de Desafíos • CESDE</span>
              </div>
              <h1 className="hub-page-title">Retos de Desarrollo de Software</h1>
              <p className="hub-page-description">
                Desafíos reales propuestos por empresas aliadas para estudiantes y talentos tech. Valida tus soluciones en código y acumula experiencia profesional.
              </p>
            </div>

            <div className="hub-actions-cta">
              <Button 
                variant="primary" 
                size="md" 
                icon={<Plus size={18}/>} 
                style={{ 
                  background: 'var(--primary)', 
                  border: 'none', 
                  boxShadow: '0 4px 14px var(--primary-glow)',
                  fontWeight: 600,
                  whiteSpace: 'nowrap'
                }} 
                onClick={() => {
                  setSelectedReto(null);
                  setIsModalOpen(true);
                }}
              >
                Publicar Reto de Empresa
              </Button>
            </div>
          </div>

          {/* Real-time KPI Metric Chips */}
          <div className="hub-metrics-grid">
            <div className="hub-metric-card">
              <div className="hub-metric-icon bg-primary-soft">
                <Code2 size={20} style={{ color: 'var(--primary)' }}/>
              </div>
              <div className="hub-metric-info">
                <span className="hub-metric-value">{retos.length}</span>
                <span className="hub-metric-label">Desafíos Disponibles</span>
              </div>
            </div>

            <div className="hub-metric-card">
              <div className="hub-metric-icon bg-warning-soft">
                <Trophy size={20} style={{ color: '#D97706' }}/>
              </div>
              <div className="hub-metric-info">
                <span className="hub-metric-value">{formatPoints(totalPuntos)}</span>
                <span className="hub-metric-label">Puntos en Juego</span>
              </div>
            </div>

            <div className="hub-metric-card" style={{ borderColor: acceptedRetos.length > 0 ? 'var(--primary)' : undefined }}>
              <div className="hub-metric-icon bg-success-soft">
                <CheckCircle2 size={20} style={{ color: 'var(--success)' }}/>
              </div>
              <div className="hub-metric-info">
                <span className="hub-metric-value">{acceptedRetos.length}</span>
                <span className="hub-metric-label">Mis Retos en Curso</span>
              </div>
            </div>
          </div>
        </div>

        {/* ROLE / CONTEXT NAVIGATION TABS */}
        <div className="hub-nav-tabs">
          <button 
            type="button" 
            className={`hub-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => { setActiveTab('all'); setCurrentPage(1); }}
          >
            <Briefcase size={16}/>
            <span>Explorar Todos los Retos</span>
            <span className="hub-tab-count">{retos.length}</span>
          </button>

          <button 
            type="button" 
            className={`hub-tab-btn ${activeTab === 'accepted' ? 'active' : ''}`}
            onClick={() => { setActiveTab('accepted'); setCurrentPage(1); }}
          >
            <CheckCircle2 size={16}/>
            <span>Mis Retos Aceptados</span>
            <span className={`hub-tab-count ${acceptedRetos.length > 0 ? 'highlight' : ''}`}>
              {acceptedRetos.length}
            </span>
          </button>
        </div>

        {/* UNIFIED COMMAND & SEARCH TOOLBAR */}
        <div className="hub-command-bar">
          <div className="hub-command-row-top">
            {/* Search Box */}
            <div className="hub-search-box">
              <SearchBar 
                value={searchTerm} 
                onChange={setSearchTerm} 
                placeholder="Buscar por tecnología (React, Python...), título o empresa..."
              />
            </div>

            {/* Dropdown Filters */}
            <div className="hub-filters-group">
              <div className="hub-select-wrapper">
                <Select 
                  value={dificultadFilter} 
                  onChange={(e) => setDificultadFilter(e.target.value)} 
                  options={[
                    { value: '', label: 'Dificultad (Todas)' },
                    { value: 'FACIL', label: 'Junior (Fácil)' },
                    { value: 'MEDIA', label: 'Mid-level (Media)' },
                    { value: 'DIFICIL', label: 'Senior (Avanzada)' }
                  ]}
                />
              </div>

              <div className="hub-select-wrapper">
                <Select 
                  value={estadoFilter} 
                  onChange={(e) => setEstadoFilter(e.target.value)} 
                  options={[
                    { value: '', label: 'Estado (Todos)' },
                    { value: 'ABIERTO', label: 'Abierto' },
                    { value: 'EN_PROGRESO', label: 'En Progreso' },
                    { value: 'CERRADO', label: 'Cerrado' }
                  ]}
                />
              </div>

              {(searchTerm || dificultadFilter || estadoFilter) && (
                <button 
                  type="button"
                  className="hub-btn-reset"
                  onClick={handleResetFilters}
                  title="Restablecer filtros"
                >
                  <RotateCcw size={14}/>
                  <span>Limpiar</span>
                </button>
              )}
            </div>

            {/* View Mode Toggle */}
            <div className="hub-view-toggle">
              <button 
                type="button" 
                className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Vista en cuadrícula de tarjetas"
              >
                <LayoutGrid size={16}/>
              </button>
              <button 
                type="button" 
                className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
                onClick={() => setViewMode('table')}
                title="Vista en tabla administrativa"
              >
                <List size={16}/>
              </button>
            </div>
          </div>

          {/* Bottom Chips & Counter */}
          <div className="hub-command-row-bottom">
            <div className="hub-chips-list">
              <span className="hub-chips-label">Nivel rápido:</span>
              {[
                { value: '', label: 'Todos' },
                { value: 'FACIL', label: '🟢 Junior' },
                { value: 'MEDIA', label: '🟡 Mid-level' },
                { value: 'DIFICIL', label: '🔴 Senior' }
              ].map((chip) => (
                <button
                  key={chip.value}
                  type="button"
                  className={`hub-chip ${dificultadFilter === chip.value ? 'active' : ''}`}
                  onClick={() => setDificultadFilter(chip.value)}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            <div className="hub-results-count">
              Mostrando <strong>{displayedRetos.length}</strong> {displayedRetos.length === 1 ? 'desafío' : 'desafíos'}
              {activeTab === 'accepted' ? ' en desarrollo' : ' disponibles'}
            </div>
          </div>
        </div>

        {/* Content Rendering */}
        {isLoading ? (
          <LoadingSpinner message="Cargando retos de desarrollo..."/>
        ) : displayedRetos.length === 0 ? (
          <EmptyState 
            title={activeTab === 'accepted' ? "No tienes retos en curso" : "No se encontraron retos disponibles"} 
            description={activeTab === 'accepted' ? "Aún no has aceptado ningún desafío. Explora la lista completa y haz clic en 'Aceptar Reto' para poner a prueba tus habilidades." : "No hay retos que coincidan con tus criterios de búsqueda. Ajusta los filtros o publica un nuevo desafío."} 
            actionText={activeTab === 'accepted' ? "Explorar Retos" : "Publicar Reto"} 
            onAction={() => {
              if (activeTab === 'accepted') {
                setActiveTab('all');
              } else {
                setSelectedReto(null);
                setIsModalOpen(true);
              }
            }}
          />
        ) : viewMode === 'grid' ? (
        /* CARD GRID VIEW (OPTION B: SPLIT HORIZONTAL MARKETPLACE ACTIONS) */
        <div>
          <div className="retos-cards-grid">
            {paginatedData.map((reto) => {
              const tags = getTechTags(reto);
              const isAccepted = acceptedRetos.includes(reto.id);

              return (
                <div key={reto.id} className="reto-card">
                  <div>
                    {/* Header: Company Info + Difficulty Badge + Management Actions */}
                    <div className="reto-card-header">
                      <div className="reto-company-badge">
                        <div className="reto-company-icon">
                          <Building2 size={18}/>
                        </div>
                        <div className="reto-company-info">
                          <span className="reto-company-name">{reto.empresaNombre || `Empresa #${reto.empresaId}`}</span>
                          <span className="reto-company-cat">{reto.categoriaNombre || 'Tecnología'}</span>
                        </div>
                      </div>

                      <div className="reto-header-actions">
                        <Badge variant={reto.dificultad === 'FACIL' ? 'success' : reto.dificultad === 'MEDIA' ? 'warning' : 'danger'}>
                          {reto.dificultad === 'FACIL' ? 'Fácil' : reto.dificultad === 'MEDIA' ? 'Media' : 'Avanzada'}
                        </Badge>

                        <button 
                          className="btn-icon-subtle" 
                          title="Editar reto"
                          onClick={() => {
                            setSelectedReto(reto);
                            setIsModalOpen(true);
                          }}
                        >
                          <Edit2 size={14}/>
                        </button>

                        <button 
                          className="btn-icon-subtle danger-hover" 
                          title="Eliminar reto"
                          onClick={() => setDeleteReto(reto)}
                        >
                          <Trash2 size={14}/>
                        </button>
                      </div>
                    </div>

                    {/* Title & Description with Clear Visual Hierarchy */}
                    <h3 
                      className="reto-card-title" 
                      title={reto.titulo}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setDetailReto(reto)}
                    >
                      {reto.titulo}
                    </h3>
                    <p className="reto-card-desc">
                      {reto.descripcion}
                    </p>

                    {/* Tech Tags */}
                    <div className="reto-tags">
                      {tags.map((tag, idx) => (
                        <span key={idx} className={`reto-tag-pill ${idx === 0 ? 'accent-tag' : ''}`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer (Option B: Split Horizontal Marketplace Layout) */}
                  <div className="reto-footer-split">
                    <div className="reto-meta-stack">
                      <div className="reto-points">
                        <Trophy size={16}/>
                        <span>{formatPoints(reto.puntos)}</span>
                      </div>
                      <div className="reto-deadline">
                        <Calendar size={13}/>
                        <span>Cierra: {formatDateOnly(reto.fechaLimite)}</span>
                      </div>
                    </div>

                    <div className="reto-buttons-group">
                      <button 
                        type="button"
                        className="btn-reto-secondary"
                        onClick={() => setDetailReto(reto)}
                        title="Ver especificaciones del reto"
                      >
                        <Eye size={15}/>
                        <span>Detalle</span>
                      </button>

                      {isAccepted ? (
                        <button 
                          type="button"
                          className="btn-reto-secondary"
                          style={{ borderColor: 'var(--success)', color: 'var(--success)', fontWeight: 600 }}
                          onClick={() => setDetailReto(reto)}
                        >
                          <CheckCircle2 size={16}/>
                          <span>En Progreso</span>
                        </button>
                      ) : (
                        <button 
                          type="button"
                          className="btn-reto-primary"
                          onClick={() => handleAcceptReto(reto)}
                        >
                          <span>Aceptar Reto</span>
                          <ArrowRight size={15} className="arrow-icon"/>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <Pagination currentPage={currentPage} totalItems={displayedRetos.length} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage}/>
        </div>
      ) : (
        /* TABLE VIEW (TABULAR / ADMINISTRATIVE LAYOUT) */
        <div className="table-card">
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Título del Reto</th>
                  <th>Empresa Promotora</th>
                  <th>Categoría</th>
                  <th>Dificultad</th>
                  <th>Recompensa</th>
                  <th>Fecha Límite</th>
                  <th>Estado</th>
                  <th style={{ textAlign: 'center' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((reto) => (
                  <tr key={reto.id}>
                    <td>
                      <span className="font-semibold" style={{ color: 'var(--text-muted)' }}>
                        #{reto.id}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'var(--primary-light)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--primary)'
                        }}>
                          <Trophy size={16}/>
                        </div>
                        <span className="font-semibold" style={{ maxWidth: '240px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {reto.titulo}
                        </span>
                      </div>
                    </td>
                    <td>{reto.empresaNombre || `Empresa #${reto.empresaId}`}</td>
                    <td>
                      <Badge variant="neutral">
                        {reto.categoriaNombre || `Cat #${reto.categoriaId}`}
                      </Badge>
                    </td>
                    <td>
                      <Badge variant={reto.dificultad === 'FACIL' ? 'success' : reto.dificultad === 'MEDIA' ? 'warning' : 'danger'}>
                        {reto.dificultad}
                      </Badge>
                    </td>
                    <td className="font-semibold" style={{ color: 'var(--primary)' }}>
                      {formatPoints(reto.puntos)}
                    </td>
                    <td>{formatDateOnly(reto.fechaLimite)}</td>
                    <td>
                      <Badge variant={reto.estado === 'ABIERTO' ? 'success' : reto.estado === 'EN_PROGRESO' ? 'warning' : reto.estado === 'CERRADO' ? 'neutral' : 'danger'}>
                        {reto.estado}
                      </Badge>
                    </td>
                    <td>
                      <div className="table-actions" style={{ justifyContent: 'center' }}>
                        <button className="btn btn-outline btn-icon" title="Ver detalle del reto" onClick={() => setDetailReto(reto)}>
                          <Eye size={16}/>
                        </button>
                        <button className="btn btn-secondary btn-icon" title="Editar reto" onClick={() => {
                          setSelectedReto(reto);
                          setIsModalOpen(true);
                        }}>
                          <Edit2 size={16}/>
                        </button>
                        <button className="btn btn-outline btn-icon" style={{ color: 'var(--danger)', borderColor: 'var(--border-medium)' }} title="Eliminar reto" onClick={() => setDeleteReto(reto)}>
                          <Trash2 size={16}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination currentPage={currentPage} totalItems={displayedRetos.length} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage}/>
        </div>
      )}

      {/* Modals */}
      <RetoModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setSelectedReto(null);
        }} 
        onSubmit={handleSaveReto} 
        retoToEdit={selectedReto} 
        isLoading={isSubmitting}
      />

      <RetoDetailModal 
        isOpen={!!detailReto} 
        onClose={() => setDetailReto(null)} 
        reto={detailReto}
        onAccept={handleAcceptReto}
      />

      <ConfirmDialog 
        isOpen={!!deleteReto} 
        onClose={() => setDeleteReto(null)} 
        onConfirm={handleDeleteReto} 
        title="Confirmar Eliminación" 
        message={`¿Estás seguro de que deseas eliminar el reto "${deleteReto?.titulo}"?`} 
        isLoading={isSubmitting}
      />
    </div>);
};

export const RetosPage = Tarea3_RetosPage;
export default Tarea3_RetosPage;
