export const INITIAL_USER = {
    id: 1,
    nombre: 'Administrador',
    apellido: 'Principal',
    email: 'admin@sistema.com',
    rol: 'ADMIN',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    estado: 'ACTIVO'
};
export const INITIAL_USUARIOS = [
    {
        id: 1,
        nombre: 'Valeria',
        apellido: 'Castrillón',
        email: 'admin@sistema.com',
        telefono: '+57 300 123 4567',
        rol: 'ADMIN',
        estado: 'ACTIVO',
        createdAt: '2026-01-15T09:30:00.000Z'
    },
    {
        id: 2,
        nombre: 'Carlos',
        apellido: 'Mendoza',
        email: 'carlos.mendoza@empresa.com',
        telefono: '+57 312 456 7890',
        rol: 'EMPRESA',
        estado: 'ACTIVO',
        createdAt: '2026-02-10T14:20:00.000Z'
    },
    {
        id: 3,
        nombre: 'Mariana',
        apellido: 'Gómez',
        email: 'mariana.gomez@tech.co',
        telefono: '+57 320 987 6543',
        rol: 'USUARIO',
        estado: 'ACTIVO',
        createdAt: '2026-02-28T11:00:00.000Z'
    },
    {
        id: 4,
        nombre: 'Felipe',
        apellido: 'Restrepo',
        email: 'felipe.r@soluciones.com',
        telefono: '+57 301 555 1234',
        rol: 'USUARIO',
        estado: 'INACTIVO',
        createdAt: '2026-03-05T16:45:00.000Z'
    }
];
export const INITIAL_CATEGORIAS = [
    {
        id: 1,
        nombre: 'Tecnología e Inteligencia Artificial',
        descripcion: 'Proyectos de machine learning, desarrollo de software y transformación digital.',
        codigo: 'CAT-TECH-01',
        estado: 'ACTIVO',
        color: '#6366f1',
        createdAt: '2026-01-10T08:00:00.000Z'
    },
    {
        id: 2,
        nombre: 'Sostenibilidad y Energías Limpias',
        descripcion: 'Iniciativas de economía circular, reducción de huella de carbono y energías renovables.',
        codigo: 'CAT-SOST-02',
        estado: 'ACTIVO',
        color: '#10b981',
        createdAt: '2026-01-12T10:15:00.000Z'
    },
    {
        id: 3,
        nombre: 'Fintech e Inclusión Financiera',
        descripcion: 'Soluciones financieras ágiles, pagos digitales y microcréditos.',
        codigo: 'CAT-FINT-03',
        estado: 'ACTIVO',
        color: '#f59e0b',
        createdAt: '2026-02-01T15:30:00.000Z'
    },
    {
        id: 4,
        nombre: 'Salud y Biotecnología',
        descripcion: 'Innovaciones médicas, telemedicina y dispositivos diagnósticos.',
        codigo: 'CAT-HLTH-04',
        estado: 'ACTIVO',
        color: '#ec4899',
        createdAt: '2026-02-15T09:00:00.000Z'
    }
];
export const INITIAL_EMPRESAS = [
    {
        id: 1,
        nombre: 'Innovación Digital S.A.S.',
        nit: '901.452.321-8',
        sector: 'Tecnología',
        email: 'contacto@innovaciondigital.co',
        telefono: '+57 4 444 8899',
        direccion: 'Cra 43A # 1-50, El Poblado',
        ciudad: 'Medellín',
        estado: 'ACTIVO',
        createdAt: '2026-01-05T08:30:00.000Z'
    },
    {
        id: 2,
        nombre: 'Ecosistemas Verdes Corp',
        nit: '890.102.943-4',
        sector: 'Medio Ambiente',
        email: 'info@ecosistemasverdes.com',
        telefono: '+57 1 650 3322',
        direccion: 'Calle 100 # 8A-45',
        ciudad: 'Bogotá',
        estado: 'ACTIVO',
        createdAt: '2026-01-18T11:00:00.000Z'
    },
    {
        id: 3,
        nombre: 'Finanzas Ágiles Global',
        nit: '900.781.205-1',
        sector: 'Financiero',
        email: 'soporte@finanzasagiles.co',
        telefono: '+57 4 310 9900',
        direccion: 'Circular 4 # 73-12, Laureles',
        ciudad: 'Medellín',
        estado: 'ACTIVO',
        createdAt: '2026-02-05T13:45:00.000Z'
    }
];
export const INITIAL_RETOS = [
    {
        id: 1,
        titulo: 'Optimización de Consumo Energético en Servidores',
        descripcion: 'Diseñar un algoritmo de autoescalado para reducir el gasto eléctrico en centros de datos durante horas valle.',
        empresaId: 1,
        empresaNombre: 'Innovación Digital S.A.S.',
        categoriaId: 1,
        categoriaNombre: 'Tecnología e Inteligencia Artificial',
        dificultad: 'DIFICIL',
        puntos: 1500,
        fechaLimite: '2026-12-15',
        estado: 'ABIERTO',
        createdAt: '2026-02-01T10:00:00.000Z'
    },
    {
        id: 2,
        titulo: 'Sistema de Trazabilidad de Residuos Reciclables',
        descripcion: 'Aplicación móvil para registrar y verificar el pesaje y entrega de materiales reciclables en plantas de acopio.',
        empresaId: 2,
        empresaNombre: 'Ecosistemas Verdes Corp',
        categoriaId: 2,
        categoriaNombre: 'Sostenibilidad y Energías Limpias',
        dificultad: 'MEDIA',
        puntos: 850,
        fechaLimite: '2026-11-30',
        estado: 'EN_PROGRESO',
        createdAt: '2026-02-14T09:30:00.000Z'
    },
    {
        id: 3,
        titulo: 'Microcréditos con Evaluación de Riesgo Alternativo',
        descripcion: 'Modelo predictivo para calificar capacidad de pago de microempresarios sin historial crediticio bancario formal.',
        empresaId: 3,
        empresaNombre: 'Finanzas Ágiles Global',
        categoriaId: 3,
        categoriaNombre: 'Fintech e Inclusión Financiera',
        dificultad: 'MEDIA',
        puntos: 1200,
        fechaLimite: '2026-10-25',
        estado: 'ABIERTO',
        createdAt: '2026-03-01T16:00:00.000Z'
    }
];
export const INITIAL_REGISTROS = [
    {
        id: 1,
        codigo: 'REG-2026-001',
        tipo: 'INSCRIPCION',
        descripcion: 'Inscripción de equipo al reto de Optimización de Consumo Energético.',
        usuarioId: 3,
        usuarioNombre: 'Mariana Gómez',
        empresaId: 1,
        empresaNombre: 'Innovación Digital S.A.S.',
        retoId: 1,
        retoTitulo: 'Optimización de Consumo Energético en Servidores',
        estado: 'APROBADO',
        observaciones: 'Documentación técnica completa verificada por la empresa aliada.',
        createdAt: '2026-02-05T14:30:00.000Z'
    },
    {
        id: 2,
        codigo: 'REG-2026-002',
        tipo: 'EVALUACION',
        descripcion: 'Evaluación de propuesta técnica fase 1 del sistema de trazabilidad.',
        usuarioId: 2,
        usuarioNombre: 'Carlos Mendoza',
        empresaId: 2,
        empresaNombre: 'Ecosistemas Verdes Corp',
        retoId: 2,
        retoTitulo: 'Sistema de Trazabilidad de Residuos Reciclables',
        estado: 'PENDIENTE',
        observaciones: 'En revisión por comité evaluador técnico.',
        createdAt: '2026-02-20T10:15:00.000Z'
    },
    {
        id: 3,
        codigo: 'REG-2026-003',
        tipo: 'AUDITORIA',
        descripcion: 'Verificación de políticas de cumplimiento y confidencialidad de datos.',
        usuarioId: 1,
        usuarioNombre: 'Valeria Castrillón',
        empresaId: 3,
        empresaNombre: 'Finanzas Ágiles Global',
        retoId: 3,
        retoTitulo: 'Microcréditos con Evaluación de Riesgo Alternativo',
        estado: 'COMPLETADO',
        observaciones: 'Auditoría aprobada sin no conformidades críticas.',
        createdAt: '2026-03-02T16:40:00.000Z'
    }
];
