import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, FolderTree, Building2, Trophy, FileText, ArrowRight, TrendingUp, Sparkles, ShieldCheck, PlusCircle } from 'lucide-react';
import { useAuth } from '../../auth/hooks/useAuth';
import StatCard from '../../core/design-system/StatCard';
import LoadingSpinner from '../../core/design-system/LoadingSpinner';
import Badge from '../../core/design-system/Badge';
import { Tarea2_UsuarioService as usuariosService } from '../../usuarios/services/Tarea2_UsuarioService';
import { Tarea1_CategoriasService as categoriasService } from '../../categorias/services/Tarea1_CategoriasService';
import { Tarea4_EmpresasService as empresasService } from '../../empresas/services/Tarea4_EmpresasService';
import { Tarea3_RetosService as retosService } from '../../retos/services/Tarea3_RetosService';
import { Tarea5_RegistroService as registrosService } from '../../registros/services/Tarea5_RegistroService';
import { formatDate } from '../../core/utils/formatters';

export const Dashboard = () => {
    const { user, isAdmin } = useAuth();
    const [stats, setStats] = useState({
        usuarios: 0,
        categorias: 0,
        empresas: 0,
        retos: 0,
        registros: 0
    });
    const [recentRegistros, setRecentRegistros] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            try {
                const [usrList, catList, empList, retList, regList] = await Promise.all([
                    usuariosService.getAll(),
                    categoriasService.getAll(),
                    empresasService.getAll(),
                    retosService.getAll(),
                    registrosService.getAll()
                ]);
                setStats({
                    usuarios: usrList.length,
                    categorias: catList.length,
                    empresas: empList.length,
                    retos: retList.length,
                    registros: regList.length
                });
                setRecentRegistros(regList.slice(0, 5));
            }
            catch (e) {
                console.error('Error cargando métricas del dashboard', e);
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (isLoading) {
        return <LoadingSpinner message="Cargando panel de control e indicadores..."/>;
    }

    return (<div>
      {/* Welcome Banner */}
      <div style={{
            background: 'linear-gradient(135deg, #1e0b36 0%, #3b0764 45%, #831843 85%, #e5007d 125%)',
            borderRadius: 'var(--radius-xl)',
            padding: '2.25rem 2.5rem',
            color: 'white',
            marginBottom: '2rem',
            boxShadow: '0 14px 28px -4px rgba(74, 15, 75, 0.25), 0 0 25px var(--primary-glow)',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid rgba(245, 158, 11, 0.3)'
        }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div className="flex items-center gap-2" style={{ marginBottom: '0.5rem' }}>
            <Sparkles size={20} style={{ color: '#f59e0b' }}/>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fde68a', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              CESDE Gamified Challenges • Retos, XP & Recompensas
            </span>
          </div>

          <h2 style={{ fontSize: '1.95rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            ¡Bienvenido(a), {user?.nombre} {user?.apellido}!
          </h2>
          <p style={{ color: '#f3e8ff', fontSize: '0.975rem', maxWidth: '680px', lineHeight: 1.6 }}>
            ¡Demuestra tus habilidades de código! Conquista desafíos propuestos por empresas aliadas, acumula puntos de experiencia (XP), sube en el leaderboard y desbloquea oportunidades laborales.
          </p>

          <div className="flex items-center flex-wrap gap-3" style={{ marginTop: '1.5rem' }}>
            <Link to="/retos" className="btn btn-primary" style={{ background: 'var(--primary)', border: 'none', fontWeight: 600, boxShadow: '0 4px 14px var(--primary-glow)' }}>
              <Trophy size={18} style={{ color: '#fde68a' }}/>
              <span>Explorar Retos & Ganar XP</span>
            </Link>
            <Badge variant="warning" style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fef3c7', border: '1px solid rgba(245, 158, 11, 0.4)', padding: '0.5rem 0.85rem' }}>
              <ShieldCheck size={14} style={{ marginRight: '6px' }}/>
              Nivel de Usuario: {user?.rol}
            </Badge>
          </div>
        </div>
      </div>

      {/* Stats KPIs Cards */}
      <div className="dashboard-stats-grid">
        <StatCard label="Retos Activos" value={stats.retos} icon={<Trophy size={24}/>} iconBgColor="#e5007d" change="Desafíos abiertos" changeType="positive"/>
        <StatCard label="Empresas Patrocinadoras" value={stats.empresas} icon={<Building2 size={24}/>} iconBgColor="#8b5cf6" change="Organizaciones aliadas" changeType="positive"/>
        <StatCard label="Estudiantes / Devs" value={stats.usuarios} icon={<Users size={24}/>} iconBgColor="#1e0b36" change="Talento activo" changeType="positive"/>
        <StatCard label="Categorías Tech" value={stats.categorias} icon={<FolderTree size={24}/>} iconBgColor="#06b6d4" change="Especialidades" changeType="neutral"/>
        <StatCard label="Misiones / Registros" value={stats.registros} icon={<FileText size={24}/>} iconBgColor="#f59e0b" change="Logros alcanzados" changeType="positive"/>
      </div>

      {/* Grid: Recent Registros & Quick Navigation */}
      <div className="dashboard-sections-grid">
        {/* Recent Activity Table */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title flex items-center gap-2">
              <TrendingUp size={20} style={{ color: 'var(--primary)' }}/>
              <span>Actividad y Radicaciones Recientes</span>
            </h3>
            <Link to="/registros" className="btn btn-outline btn-sm flex items-center gap-1">
              <span>Ver todos</span>
              <ArrowRight size={14}/>
            </Link>
          </div>

          {recentRegistros.length === 0 ? (<div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No hay radicaciones recientes aún.
            </div>) : (<div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Radicado</th>
                    <th>Tipo</th>
                    <th>Usuario</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRegistros.map((reg) => (<tr key={reg.id}>
                      <td>
                        <span className="font-semibold" style={{ fontFamily: 'monospace' }}>
                          {reg.codigo}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.85rem' }}>{reg.tipo}</span>
                      </td>
                      <td>{reg.usuarioNombre || `Usuario #${reg.usuarioId}`}</td>
                      <td>
                        <Badge variant={reg.estado === 'APROBADO' || reg.estado === 'COMPLETADO'
                    ? 'success'
                    : reg.estado === 'PENDIENTE'
                        ? 'warning'
                        : 'danger'}>
                          {reg.estado}
                        </Badge>
                      </td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {formatDate(reg.createdAt)}
                      </td>
                    </tr>))}
                </tbody>
              </table>
            </div>)}
        </div>

        {/* Quick Actions & Navigation Cards */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3 className="dashboard-card-title flex items-center gap-2">
              <PlusCircle size={20} style={{ color: 'var(--secondary)' }}/>
              <span>Accesos Directos a Módulos</span>
            </h3>
          </div>

          <div className="quick-action-list">
            <Link to="/usuarios" className="quick-action-item">
              <div className="flex items-center gap-3">
                <Users size={18} style={{ color: '#4f46e5' }}/>
                <span>{isAdmin ? 'Gestión de Usuarios' : 'Comunidad de Talentos'}</span>
              </div>
              <ArrowRight size={16}/>
            </Link>

            <Link to="/categorias" className="quick-action-item">
              <div className="flex items-center gap-3">
                <FolderTree size={18} style={{ color: '#10b981' }}/>
                <span>{isAdmin ? 'Gestión de Categorías' : 'Especialidades Tech'}</span>
              </div>
              <ArrowRight size={16}/>
            </Link>

            <Link to="/empresas" className="quick-action-item">
              <div className="flex items-center gap-3">
                <Building2 size={18} style={{ color: '#0ea5e9' }}/>
                <span>{isAdmin ? 'Gestión de Empresas' : 'Empresas Aliadas'}</span>
              </div>
              <ArrowRight size={16}/>
            </Link>

            <Link to="/retos" className="quick-action-item">
              <div className="flex items-center gap-3">
                <Trophy size={18} style={{ color: '#f59e0b' }}/>
                <span>Módulo de Retos & XP</span>
              </div>
              <ArrowRight size={16}/>
            </Link>

            <Link to="/registros" className="quick-action-item">
              <div className="flex items-center gap-3">
                <FileText size={18} style={{ color: '#8b5cf6' }}/>
                <span>{isAdmin ? 'Auditoría de Registros' : 'Mis Postulaciones'}</span>
              </div>
              <ArrowRight size={16}/>
            </Link>
          </div>
        </div>
      </div>
    </div>);
};

export default Dashboard;
