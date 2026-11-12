-- ====================================================================
-- PROYECTO INTEGRADOR: CESDE GAMIFIED CHALLENGES
-- TAREA INDIVIDUAL 2: MÓDULO DE EMPRESAS
-- ====================================================================
-- Responsabilidad: Registro y administración de empresas aliadas
-- Integrante responsable: [Nombre del Integrante 2]
-- Archivos Frontend Vinculados:
--   - Vista: src/pages/empresas/EmpresasPage.jsx
--   - Modal Edición/Creación: src/components/empresas/EmpresaModal.jsx
--   - Modal Detalle: src/components/empresas/EmpresaDetailModal.jsx
--   - Servicio API: src/services/empresasService.js
-- ====================================================================

USE proyecto_integrador_db;

-- 1. Creación de la Tabla EMPRESAS
CREATE TABLE IF NOT EXISTS empresas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    nit VARCHAR(30) NOT NULL UNIQUE,
    sector VARCHAR(80) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    telefono VARCHAR(30) NOT NULL,
    direccion VARCHAR(200),
    ciudad VARCHAR(100) NOT NULL DEFAULT 'Medellín',
    estado ENUM('ACTIVO', 'INACTIVO') NOT NULL DEFAULT 'ACTIVO',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Datos de Prueba / Iniciales (Semilla)
INSERT INTO empresas (id, nombre, nit, sector, email, telefono, direccion, ciudad, estado, created_at) VALUES
(1, 'Innovación Digital S.A.S.', '901.452.321-8', 'Tecnología', 'contacto@innovaciondigital.co', '+57 4 444 8899', 'Cra 43A # 1-50, El Poblado', 'Medellín', 'ACTIVO', '2026-01-05 08:30:00'),
(2, 'Ecosistemas Verdes Corp', '890.102.943-4', 'Medio Ambiente', 'info@ecosistemasverdes.com', '+57 1 650 3322', 'Calle 100 # 8A-45', 'Bogotá', 'ACTIVO', '2026-01-18 11:00:00'),
(3, 'Finanzas Ágiles Global', '900.781.205-1', 'Financiero', 'soporte@finanzasagiles.co', '+57 4 310 9900', 'Circular 4 # 73-12, Laureles', 'Medellín', 'ACTIVO', '2026-02-05 13:45:00')
ON DUPLICATE KEY UPDATE nombre=VALUES(nombre);

-- 3. Consultas CRUD Típicas del Módulo
-- SELECT * FROM empresas WHERE estado = 'ACTIVO';
-- SELECT * FROM empresas WHERE nit = '901.452.321-8';
-- UPDATE empresas SET sector = 'Software', ciudad = 'Envigado' WHERE id = 1;
-- DELETE FROM empresas WHERE id = 1;
