import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
// Layouts
import AuthLayout from '../components/AuthLayout';
import MainLayout from '../components/MainLayout';
// Route Guards
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
// Modules / Pages
import Login from '../../auth/components/Login';
import Register from '../../auth/components/Register';
import Dashboard from '../../dashboard/components/Dashboard';
import Tarea1_CategoriasPage from '../../categorias/components/Tarea1_CategoriasPage';
import Tarea2_UsuarioPage from '../../usuarios/components/Tarea2_UsuarioPage';
import Tarea3_RetosPage from '../../retos/components/Tarea3_RetosPage';
import Tarea4_EmpresasPage from '../../empresas/components/Tarea4_EmpresasPage';
import Tarea5_RegistroPage from '../../registros/components/Tarea5_RegistroPage';
import NotFound from '../components/NotFound';

export const AppRouter = () => {
    return (<Routes>
      {/* Redirección inicial */}
      <Route path="/" element={<Navigate to="/dashboard" replace/>}/>

      {/* Rutas Públicas (AuthLayout) */}
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />}/>
          <Route path="/registro" element={<Register />}/>
        </Route>
      </Route>

      {/* Rutas Privadas Protegidas (MainLayout) */}
      <Route element={<PrivateRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />}/>
          {/* 5 Módulos / Tareas Individuales */}
          <Route path="/categorias" element={<Tarea1_CategoriasPage />}/>
          <Route path="/usuarios" element={<Tarea2_UsuarioPage />}/>
          <Route path="/retos" element={<Tarea3_RetosPage />}/>
          <Route path="/empresas" element={<Tarea4_EmpresasPage />}/>
          <Route path="/registros" element={<Tarea5_RegistroPage />}/>
        </Route>
      </Route>

      {/* Ruta para páginas no encontradas */}
      <Route path="*" element={<NotFound />}/>
    </Routes>);
};

export default AppRouter;
