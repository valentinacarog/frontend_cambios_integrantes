import React from 'react';
import { FolderOpen } from 'lucide-react';
import { Button } from './Button';
export const EmptyState = ({ title = 'No se encontraron registros', description = 'No hay datos disponibles en esta vista o no coinciden con los filtros aplicados.', icon, actionText, onAction }) => {
    return (<div className="empty-state">
      <div className="empty-state-icon">
        {icon || <FolderOpen size={32}/>}
      </div>
      <h4 className="empty-state-title">{title}</h4>
      <p className="empty-state-desc">{description}</p>
      {actionText && onAction && (<Button variant="primary" size="sm" onClick={onAction}>
          {actionText}
        </Button>)}
    </div>);
};
export default EmptyState;
