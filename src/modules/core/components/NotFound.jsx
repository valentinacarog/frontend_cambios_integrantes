import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Home, ArrowLeft } from 'lucide-react';
import { Button } from '../design-system/Button';

export const NotFound = () => {
    return (<div style={{
            minHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '2rem'
        }}>
      <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'var(--danger-light)',
            color: 'var(--danger)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem'
        }}>
        <AlertCircle size={44}/>
      </div>

      <h1 style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
        404
      </h1>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '1rem' }}>
        Página no encontrada
      </h2>
      <p style={{ maxWidth: '460px', color: 'var(--text-muted)', marginBottom: '2rem' }}>
        La ruta a la que intentas acceder no existe en el sistema o fue movida temporalmente.
      </p>

      <div className="flex items-center gap-3">
        <Link to="/dashboard">
          <Button variant="primary" icon={<Home size={18}/>}>
            Ir al Dashboard
          </Button>
        </Link>
        <button className="btn btn-outline flex items-center gap-2" onClick={() => window.history.back()}>
          <ArrowLeft size={18}/>
          <span>Regresar</span>
        </button>
      </div>
    </div>);
};

export default NotFound;
