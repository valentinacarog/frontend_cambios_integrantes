import React from 'react';
import { useNotification } from '../../hooks/useNotification';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
export const ToastContainer = () => {
    const { notifications, removeNotification } = useNotification();
    if (notifications.length === 0)
        return null;
    return (<div className="toast-container" role="region" aria-label="Notificaciones">
      {notifications.map((n) => {
            let Icon = CheckCircle2;
            let iconColor = 'var(--success)';
            if (n.type === 'error') {
                Icon = AlertCircle;
                iconColor = 'var(--danger)';
            }
            else if (n.type === 'warning') {
                Icon = AlertTriangle;
                iconColor = 'var(--warning)';
            }
            else if (n.type === 'info') {
                Icon = Info;
                iconColor = 'var(--info)';
            }
            return (<div key={n.id} className={`toast toast-${n.type}`}>
            <Icon size={20} style={{ color: iconColor, flexShrink: 0, marginTop: '2px' }}/>
            <div className="toast-content">
              {n.title && <div className="toast-title">{n.title}</div>}
              <div className="toast-message">{n.message}</div>
            </div>
            <button className="toast-close" onClick={() => removeNotification(n.id)} aria-label="Cerrar notificación">
              <X size={16}/>
            </button>
          </div>);
        })}
    </div>);
};
export default ToastContainer;
