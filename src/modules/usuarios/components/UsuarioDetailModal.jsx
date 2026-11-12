import React from 'react';
import { Modal } from '../../core/design-system/Modal';
import { Button } from '../../core/design-system/Button';
import { Badge } from '../../core/design-system/Badge';
import { formatDate } from '../../core/utils/formatters';

export const UsuarioDetailModal = ({ isOpen, onClose, usuario }) => {
    if (!usuario)
        return null;
    return (<Modal isOpen={isOpen} onClose={onClose} title="Detalle del Usuario" footer={<Button variant="secondary" onClick={onClose}>
          Cerrar
        </Button>}>
      <div className="detail-grid">
        <div className="detail-item">
          <span className="detail-label">ID de Usuario</span>
          <span className="detail-value">#{usuario.id}</span>
        </div>

        <div className="detail-item">
          <span className="detail-label">Estado</span>
          <div>
            <Badge variant={usuario.estado === 'ACTIVO' ? 'success' : 'danger'}>
              {usuario.estado}
            </Badge>
          </div>
        </div>

        <div className="detail-item">
          <span className="detail-label">Nombre Completo</span>
          <span className="detail-value">{usuario.nombre} {usuario.apellido}</span>
        </div>

        <div className="detail-item">
          <span className="detail-label">Rol</span>
          <div>
            <Badge variant={usuario.rol === 'ADMIN' ? 'primary' : (usuario.rol === 'EMPRESA' || usuario.rol === 'SUPERVISOR') ? 'warning' : 'neutral'}>
              {usuario.rol === 'SUPERVISOR' || usuario.rol === 'EMPRESA' ? 'EMPRESA' : usuario.rol === 'USUARIO' ? 'ESTUDIANTE' : usuario.rol}
            </Badge>
          </div>
        </div>

        <div className="detail-item">
          <span className="detail-label">Correo Electrónico</span>
          <span className="detail-value">{usuario.email}</span>
        </div>

        <div className="detail-item">
          <span className="detail-label">Teléfono de Contacto</span>
          <span className="detail-value">{usuario.telefono || 'No registrado'}</span>
        </div>

        <div className="detail-item">
          <span className="detail-label">Fecha de Registro</span>
          <span className="detail-value">{formatDate(usuario.createdAt)}</span>
        </div>

        {usuario.updatedAt && (<div className="detail-item">
            <span className="detail-label">Última Actualización</span>
            <span className="detail-value">{formatDate(usuario.updatedAt)}</span>
          </div>)}
      </div>
    </Modal>);
};

export default UsuarioDetailModal;
