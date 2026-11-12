import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ message = 'Cargando información...', size = 36 }) => {
    return (<div className="spinner-container">
      <Loader2 size={size} className="animate-spin" style={{ color: 'var(--primary)' }}/>
      {message && <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{message}</p>}
    </div>);
};

export default LoadingSpinner;
