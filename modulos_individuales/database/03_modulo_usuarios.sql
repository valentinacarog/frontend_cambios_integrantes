-- ====================================================================
-- PROYECTO INTEGRADOR: CESDE GAMIFIED CHALLENGES
-- TAREA INDIVIDUAL 3: MÓDULO DE USUARIOS & ACCESOS
-- ====================================================================
-- Responsabilidad: Gestión de cuentas, roles (ADMIN/EMPRESA/USUARIO) y autenticación
-- Integrante responsable: [Nombre del Integrante 3]
-- Archivos Frontend Vinculados:
--   - Vista: src/pages/usuarios/UsuariosPage.jsx
--   - Modal Edición/Creación: src/components/usuarios/UsuarioModal.jsx
--   - Modal Detalle: src/components/usuarios/UsuarioDetailModal.jsx
--   - Servicio API: src/services/usuariosService.js
--   - Servicio Autenticación: src/services/authService.js
-- ====================================================================

USE proyecto_integrador_db;

-- 1. Creación de la Tabla USUARIOS
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empresa_id INT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    telefono VARCHAR(30),
    rol ENUM('ADMIN', 'EMPRESA', 'USUARIO') NOT NULL DEFAULT 'USUARIO',
    avatar_url VARCHAR(255),
    estado ENUM('ACTIVO', 'INACTIVO') NOT NULL DEFAULT 'ACTIVO',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_usuario_empresa FOREIGN KEY (empresa_id) 
        REFERENCES empresas(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Datos de Prueba / Iniciales (Semilla)
INSERT INTO usuarios (id, empresa_id, nombre, apellido, email, password_hash, telefono, rol, estado, created_at) VALUES
(1, NULL, 'Valeria', 'Castrillón', 'admin@sistema.com', '$2y$10$e8T2PzBqgLqj1dM0wH8bweZt4U0fO8rQ/t1m9rW7uE9fW8e9bW9eO', '+57 300 123 4567', 'ADMIN', 'ACTIVO', '2026-01-15 09:30:00'),
(2, 1, 'Carlos', 'Mendoza', 'carlos.mendoza@empresa.com', '$2y$10$e8T2PzBqgLqj1dM0wH8bweZt4U0fO8rQ/t1m9rW7uE9fW8e9bW9eO', '+57 312 456 7890', 'EMPRESA', 'ACTIVO', '2026-02-10 14:20:00'),
(3, NULL, 'Mariana', 'Gómez', 'mariana.gomez@tech.co', '$2y$10$e8T2PzBqgLqj1dM0wH8bweZt4U0fO8rQ/t1m9rW7uE9fW8e9bW9eO', '+57 320 987 6543', 'USUARIO', 'ACTIVO', '2026-02-28 11:00:00'),
(4, NULL, 'Felipe', 'Restrepo', 'felipe.r@soluciones.com', '$2y$10$e8T2PzBqgLqj1dM0wH8bweZt4U0fO8rQ/t1m9rW7uE9fW8e9bW9eO', '+57 301 555 1234', 'USUARIO', 'INACTIVO', '2026-03-05 16:45:00')
ON DUPLICATE KEY UPDATE nombre=VALUES(nombre);

-- 3. Consultas CRUD Típicas del Módulo
-- SELECT * FROM usuarios WHERE rol = 'USUARIO' AND estado = 'ACTIVO';
-- SELECT * FROM usuarios WHERE email = 'admin@sistema.com';
-- UPDATE usuarios SET rol = 'ADMIN', telefono = '+57 310 000 0000' WHERE id = 3;
-- DELETE FROM usuarios WHERE id = 4;
