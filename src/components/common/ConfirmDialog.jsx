import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';
export const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Eliminar', cancelText = 'Cancelar', isLoading = false }) => {
    return (<Modal isOpen={isOpen} onClose={onClose} title={title} footer={<>
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button variant="danger" onClick={onConfirm} isLoading={isLoading}>
            {confirmText}
          </Button>
        </>}>
      <div className="flex items-center gap-4">
        <div style={{ color: 'var(--danger)', flexShrink: 0 }}>
          <AlertTriangle size={36}/>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          {message}
        </p>
      </div>
    </Modal>);
};
export default ConfirmDialog;
