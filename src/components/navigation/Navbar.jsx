import React from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, LogOut, ShieldCheck, Building2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Badge } from '../common/Badge';
const pageTitles = {
    '/dashboard': 'Panel Principal',
    '/usuarios': 'Gestión de Usuarios',
    '/categorias': 'Gestión de Categorías',
    '/registros': 'Historial de Registros',
    '/empresas': 'Directorio de Empresas',
    '/retos': 'Módulo de Retos'
};
export const Navbar = ({ onToggleSidebar }) => {
    const location = useLocation();
    const { user, logout } = useAuth();
    const title = pageTitles[location.pathname] || 'Sistema Administrativo';
    return (<header className="navbar">
      <div className="navbar-left">
        <button 
          className="menu-toggle-btn" 
          onClick={onToggleSidebar} 
          aria-label="Desplegar o minimizar menú lateral"
          title="Desplegar o minimizar menú lateral"
        >
          <Menu size={20}/>
        </button>
        <h1 className="navbar-page-title">{title}</h1>
      </div>

      <div className="navbar-right">
        {user?.rol && (
          <Badge 
            variant={user.rol === 'ADMIN' ? 'primary' : (user.rol === 'EMPRESA' || user.rol === 'SUPERVISOR') ? 'warning' : 'neutral'} 
            className="flex items-center gap-1"
          >
            {user.rol === 'EMPRESA' || user.rol === 'SUPERVISOR' ? <Building2 size={13}/> : <ShieldCheck size={14}/>}
            <span>{user.rol === 'SUPERVISOR' || user.rol === 'EMPRESA' ? 'EMPRESA' : user.rol === 'USUARIO' ? 'ESTUDIANTE' : user.rol}</span>
          </Badge>
        )}

        <div className="flex items-center gap-2" style={{ borderLeft: '1px solid var(--border-light)', paddingLeft: '1rem' }}>
          <div className="user-avatar" style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}>
            {user?.nombre?.charAt(0) || 'U'}
          </div>
          <span className="font-medium" style={{ fontSize: '0.875rem', color: 'var(--text-main)' }}>
            {user?.nombre}
          </span>
        </div>

        <button className="navbar-btn logout-btn" onClick={() => logout()} title="Cerrar Sesión">
          <LogOut size={16}/>
          <span>Salir</span>
        </button>
      </div>
    </header>);
};
export default Navbar;
