import React from 'react';
import { Modal } from '../../core/design-system/Modal';
import { Button } from '../../core/design-system/Button';
import { Badge } from '../../core/design-system/Badge';
import { formatDate } from '../../core/utils/formatters';

export const EmpresaDetailModal = ({ isOpen, onClose, empresa }) => {
    if (!empresa)
        return null;
    return (<Modal isOpen={isOpen} onClose={onClose} title="Ficha Técnica de la Empresa" footer={<Button variant="secondary" onClick={onClose}>
          Cerrar
        </Button>}>
      <div className="detail-grid">
        <div className="detail-item">
          <span className="detail-label">Razón Social</span>
          <span className="detail-value">{empresa.nombre}</span>
        </div>

        <div className="detail-item">
          <span className="detail-label">Estado</span>
          <div>
            <Badge variant={empresa.estado === 'ACTIVO' ? 'success' : 'danger'}>
              {empresa.estado}
            </Badge>
          </div>
        </div>

        <div className="detail-item">
          <span className="detail-label">NIT</span>
          <span className="detail-value">{empresa.nit}</span>
        </div>

        <div className="detail-item">
          <span className="detail-label">Sector Productivo</span>
          <span className="detail-value">{empresa.sector}</span>
        </div>

        <div className="detail-item">
          <span className="detail-label">Correo Corporativo</span>
          <span className="detail-value">{empresa.email}</span>
        </div>

        <div className="detail-item">
          <span className="detail-label">Teléfono</span>
          <span className="detail-value">{empresa.telefono}</span>
        </div>

        <div className="detail-item">
          <span className="detail-label">Ciudad / Sede</span>
          <span className="detail-value">{empresa.ciudad}</span>
        </div>

        <div className="detail-item">
          <span className="detail-label">Dirección</span>
          <span className="detail-value">{empresa.direccion || 'No registrada'}</span>
        </div>

        <div className="detail-item">
          <span className="detail-label">Fecha de Vinculación</span>
          <span className="detail-value">{formatDate(empresa.createdAt)}</span>
        </div>
      </div>
    </Modal>);
};

export default EmpresaDetailModal;
