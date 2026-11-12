-- ====================================================================
-- PROYECTO INTEGRADOR: CESDE GAMIFIED CHALLENGES
-- TAREA INDIVIDUAL 1: MÓDULO DE CATEGORÍAS
-- ====================================================================
-- Responsabilidad: Gestión y clasificación de las áreas temáticas
-- Integrante responsable: [Nombre del Integrante 1]
-- Archivos Frontend Vinculados:
--   - Vista: src/pages/categorias/CategoriasPage.jsx
--   - Modal Edición/Creación: src/components/categorias/CategoriaModal.jsx
--   - Modal Detalle: src/components/categorias/CategoriaDetailModal.jsx
--   - Servicio API: src/services/categoriasService.js
-- ====================================================================

USE proyecto_integrador_db;

-- 1. Creación de la Tabla CATEGORIAS
CREATE TABLE IF NOT EXISTS categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    codigo VARCHAR(30) NOT NULL UNIQUE,
    descripcion TEXT NOT NULL,
    color VARCHAR(10) DEFAULT '#6366f1',
    estado ENUM('ACTIVO', 'INACTIVO') NOT NULL DEFAULT 'ACTIVO',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Datos de Prueba / Iniciales (Semilla)
INSERT INTO categorias (id, nombre, codigo, descripcion, color, estado, created_at) VALUES
(1, 'Tecnología e Inteligencia Artificial', 'CAT-TECH-01', 'Proyectos de machine learning, desarrollo de software y transformación digital.', '#6366f1', 'ACTIVO', '2026-01-10 08:00:00'),
(2, 'Sostenibilidad y Energías Limpias', 'CAT-SOST-02', 'Iniciativas de economía circular, reducción de huella de carbono y energías renovables.', '#10b981', 'ACTIVO', '2026-01-12 10:15:00'),
(3, 'Fintech e Inclusión Financiera', 'CAT-FINT-03', 'Soluciones financieras ágiles, pagos digitales y microcréditos.', '#f59e0b', 'ACTIVO', '2026-02-01 15:30:00'),
(4, 'Salud y Biotecnología', 'CAT-HLTH-04', 'Innovaciones médicas, telemedicina y dispositivos diagnósticos.', '#ec4899', 'ACTIVO', '2026-02-15 09:00:00')
ON DUPLICATE KEY UPDATE nombre=VALUES(nombre);

-- 3. Consultas CRUD Típicas del Módulo
-- SELECT * FROM categorias WHERE estado = 'ACTIVO';
-- SELECT * FROM categorias WHERE id = 1;
-- UPDATE categorias SET nombre = 'Nuevo Nombre', estado = 'ACTIVO' WHERE id = 1;
-- DELETE FROM categorias WHERE id = 1;
