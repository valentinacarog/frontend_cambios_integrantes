import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/navigation/Sidebar';
import Navbar from '../components/navigation/Navbar';
import ToastContainer from '../components/common/ToastContainer';

export const MainLayout = () => {
    const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(() => {
      try {
        return localStorage.getItem('cesde_sidebar_collapsed') === 'true';
      } catch {
        return false;
      }
    });

    const handleToggleCollapse = () => {
      setIsCollapsed(prev => {
        const next = !prev;
        try {
          localStorage.setItem('cesde_sidebar_collapsed', String(next));
        } catch (e) {
          console.error(e);
        }
        return next;
      });
    };

    const handleToggleSidebar = () => {
      if (window.innerWidth <= 1024) {
        setSidebarMobileOpen(prev => !prev);
      } else {
        handleToggleCollapse();
      }
    };

    return (<div className="main-layout">
      <Sidebar 
        isOpen={sidebarMobileOpen} 
        onClose={() => setSidebarMobileOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />

      <div className={`main-wrapper ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Navbar 
          onToggleSidebar={handleToggleSidebar} 
          isSidebarCollapsed={isCollapsed}
        />
        <main className="content-body animate-fade-in">
          <Outlet />
        </main>
      </div>

      <ToastContainer />
    </div>);
};
export default MainLayout;
