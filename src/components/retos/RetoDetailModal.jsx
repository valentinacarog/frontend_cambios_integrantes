import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { formatDateOnly, formatPoints } from '../../utils/formatters';
export const RetoDetailModal = ({ isOpen, onClose, reto, onAccept }) => {
    if (!reto)
        return null;
    return (<Modal isOpen={isOpen} onClose={onClose} title="Detalle del Reto Tecnológico" size="lg" footer={<div className="flex items-center gap-2" style={{ width: '100%', justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
          <Button variant="primary" style={{ background: 'var(--primary)', border: 'none', boxShadow: '0 4px 14px var(--primary-glow)' }} onClick={() => {
            if (onAccept) onAccept(reto);
            onClose();
          }}>
            ★ Aceptar Desafío (CESDE)
          </Button>
        </div>}>
      <div className="flex flex-col gap-4">
        <div>
          <span className="detail-label">Título del Reto</span>
          <h3 style={{ fontSize: '1.25rem', marginTop: '0.2rem', color: 'var(--text-main)' }}>
            {reto.titulo}
          </h3>
        </div>

        <div className="detail-grid">
          <div className="detail-item">
            <span className="detail-label">Empresa Promotora</span>
            <span className="detail-value">{reto.empresaNombre || `#${reto.empresaId}`}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Categoría</span>
            <span className="detail-value">{reto.categoriaNombre || `#${reto.categoriaId}`}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Dificultad</span>
            <div>
              <Badge variant={reto.dificultad === 'FACIL'
            ? 'success'
            : reto.dificultad === 'MEDIA'
                ? 'warning'
                : 'danger'}>
                {reto.dificultad}
              </Badge>
            </div>
          </div>

          <div className="detail-item">
            <span className="detail-label">Puntos / Recompensa</span>
            <span className="detail-value" style={{ color: 'var(--primary)', fontWeight: 700 }}>
              {formatPoints(reto.puntos)}
            </span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Fecha Límite</span>
            <span className="detail-value">{formatDateOnly(reto.fechaLimite)}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Estado</span>
            <div>
              <Badge variant={reto.estado === 'ABIERTO'
            ? 'success'
            : reto.estado === 'EN_PROGRESO'
                ? 'warning'
                : reto.estado === 'CERRADO'
                    ? 'neutral'
                    : 'danger'}>
                {reto.estado}
              </Badge>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '0.5rem', background: 'var(--bg-surface-alt)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
          <span className="detail-label">Descripción Completa</span>
          <p style={{ marginTop: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.925rem', whiteSpace: 'pre-line' }}>
            {reto.descripcion}
          </p>
        </div>
      </div>
    </Modal>);
};
export default RetoDetailModal;
