import React from 'react';
import { Modal } from '../../core/design-system/Modal';
import { Button } from '../../core/design-system/Button';
import { Badge } from '../../core/design-system/Badge';
import { formatDate } from '../../core/utils/formatters';

export const RegistroDetailModal = ({ isOpen, onClose, registro }) => {
    if (!registro)
        return null;
    return (<Modal isOpen={isOpen} onClose={onClose} title="Detalle del Registro de Auditoría" size="lg" footer={<Button variant="secondary" onClick={onClose}>
          Cerrar
        </Button>}>
      <div className="flex flex-col gap-4">
        <div className="detail-grid">
          <div className="detail-item">
            <span className="detail-label">Código Radicado</span>
            <span className="detail-value" style={{ fontFamily: 'monospace', fontWeight: 700 }}>
              {registro.codigo}
            </span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Estado</span>
            <div>
              <Badge variant={registro.estado === 'APROBADO' || registro.estado === 'COMPLETADO'
            ? 'success'
            : registro.estado === 'PENDIENTE'
                ? 'warning'
                : 'danger'}>
                {registro.estado}
              </Badge>
            </div>
          </div>

          <div className="detail-item">
            <span className="detail-label">Tipo de Trámite</span>
            <span className="detail-value">{registro.tipo}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Fecha de Radicación</span>
            <span className="detail-value">{formatDate(registro.createdAt)}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Usuario Responsable</span>
            <span className="detail-value">{registro.usuarioNombre || `#${registro.usuarioId}`}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Empresa Asociada</span>
            <span className="detail-value">{registro.empresaNombre || 'N/A'}</span>
          </div>

          <div className="detail-item" style={{ gridColumn: 'span 2' }}>
            <span className="detail-label">Reto Vinculado</span>
            <span className="detail-value">{registro.retoTitulo || 'Ninguno'}</span>
          </div>
        </div>

        <div style={{ background: 'var(--bg-surface-alt)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
          <span className="detail-label">Descripción del Asunto</span>
          <p style={{ marginTop: '0.35rem', color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
            {registro.descripcion}
          </p>
        </div>

        {registro.observaciones && (<div style={{ background: '#fefce8', border: '1px solid #fef08a', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <span className="detail-label" style={{ color: '#854d0e' }}>Observaciones del Revisor</span>
            <p style={{ marginTop: '0.35rem', color: '#713f12', fontSize: '0.9rem' }}>
              {registro.observaciones}
            </p>
          </div>)}
      </div>
    </Modal>);
};

export default RegistroDetailModal;
