import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, FolderTree, FileText, Building2, Trophy, LogOut, Code2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const Sidebar = ({ isOpen, onClose, isCollapsed, onToggleCollapse }) => {
    const { user, logout } = useAuth();
    const navLinks = [
        { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/retos', label: 'Retos de Software', icon: Trophy },
        { to: '/empresas', label: 'Empresas Aliadas', icon: Building2 },
        { to: '/usuarios', label: 'Estudiantes & Usuarios', icon: Users },
        { to: '/categorias', label: 'Categorías Tech', icon: FolderTree },
        { to: '/registros', label: 'Postulaciones / Historial', icon: FileText }
    ];

    return (<>
      {isOpen && <div className="sidebar-backdrop" onClick={onClose}/>}

      <aside className={`sidebar ${isOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand" title="CESDE Tech - Plataforma Conexión Universidad Empresa">
            <div className="sidebar-brand-icon">
              <Code2 size={20}/>
            </div>
            {!isCollapsed && (
              <div className="sidebar-brand-text">
                <span style={{ fontWeight: 800, letterSpacing: '-0.02em' }}>CESDE</span>
                <span style={{ color: 'var(--primary)', marginLeft: '4px', fontWeight: 700 }}>Tech</span>
              </div>
            )}
          </div>

          {/* Desktop Collapse / Expand Chevron */}
          <button 
            type="button"
            className="sidebar-collapse-btn desktop-only" 
            onClick={onToggleCollapse} 
            title={isCollapsed ? "Desplegar menú lateral" : "Minimizar menú lateral"}
            aria-label={isCollapsed ? "Desplegar menú lateral" : "Minimizar menú lateral"}
          >
            {isCollapsed ? <ChevronRight size={16}/> : <ChevronLeft size={16}/>}
          </button>

          {/* Mobile Close Button */}
          <button 
            type="button"
            className="sidebar-close-btn mobile-only" 
            onClick={onClose} 
            aria-label="Cerrar menú"
          >
            <X size={20}/>
          </button>
        </div>

        <nav className="sidebar-nav">
          {!isCollapsed && <span className="nav-section-title">Módulos del Sistema</span>}
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink 
                key={item.to} 
                to={item.to} 
                onClick={onClose} 
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                title={item.label}
              >
                <Icon size={19} className="nav-item-icon"/>
                {!isCollapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="user-mini-profile" title={isCollapsed ? `${user?.nombre} (${user?.rol})` : undefined}>
            <div className="user-avatar">
              {user?.nombre?.charAt(0) || 'U'}
              {user?.apellido?.charAt(0) || ''}
            </div>
            {!isCollapsed && (
              <div className="user-info">
                <span className="user-name">{user?.nombre} {user?.apellido}</span>
                <span className="user-role">{user?.rol || 'USUARIO'}</span>
              </div>
            )}
          </div>

          <button 
            type="button"
            className="nav-item logout-nav-btn" 
            style={{ background: 'transparent', border: 'none', width: '100%', cursor: 'pointer' }} 
            onClick={() => logout()}
            title="Cerrar Sesión"
          >
            <LogOut size={18} style={{ color: 'var(--danger)' }}/>
            {!isCollapsed && <span style={{ color: 'var(--danger)', fontWeight: 500 }}>Cerrar Sesión</span>}
          </button>
        </div>
      </aside>
    </>);
};
export default Sidebar;
