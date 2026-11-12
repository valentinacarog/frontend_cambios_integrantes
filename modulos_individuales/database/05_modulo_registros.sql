-- ====================================================================
-- PROYECTO INTEGRADOR: CESDE GAMIFIED CHALLENGES
-- TAREA INDIVIDUAL 5: MÓDULO DE REGISTROS (INSCRIPCIONES / AUDITORÍAS)
-- ====================================================================
-- Responsabilidad: Bitácora de inscripciones de usuarios a retos, evaluaciones y auditorías
-- Integrante responsable: [Nombre del Integrante 5]
-- Archivos Frontend Vinculados:
--   - Vista: src/pages/registros/RegistrosPage.jsx
--   - Modal Edición/Creación: src/components/registros/RegistroModal.jsx
--   - Modal Detalle: src/components/registros/RegistroDetailModal.jsx
--   - Servicio API: src/services/registrosService.js
-- ====================================================================

USE proyecto_integrador_db;

-- 1. Creación de la Tabla REGISTROS
CREATE TABLE IF NOT EXISTS registros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(40) NOT NULL UNIQUE,
    tipo ENUM('INSCRIPCION', 'EVALUACION', 'AUDITORIA', 'ENTREGA') NOT NULL DEFAULT 'INSCRIPCION',
    descripcion TEXT NOT NULL,
    usuario_id INT NOT NULL,
    empresa_id INT NULL,
    reto_id INT NULL,
    estado ENUM('PENDIENTE', 'APROBADO', 'COMPLETADO', 'RECHAZADO') NOT NULL DEFAULT 'PENDIENTE',
    observaciones TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_registro_usuario FOREIGN KEY (usuario_id) 
        REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT fk_registro_empresa FOREIGN KEY (empresa_id) 
        REFERENCES empresas(id) ON DELETE SET NULL,
    CONSTRAINT fk_registro_reto FOREIGN KEY (reto_id) 
        REFERENCES retos(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Datos de Prueba / Iniciales (Semilla)
INSERT INTO registros (id, codigo, tipo, descripcion, usuario_id, empresa_id, reto_id, estado, observaciones, created_at) VALUES
(1, 'REG-2026-001', 'INSCRIPCION', 'Inscripción de equipo al reto de Optimización de Consumo Energético.', 3, 1, 1, 'APROBADO', 'Documentación técnica completa verificada por la empresa aliada.', '2026-02-05 14:30:00'),
(2, 'REG-2026-002', 'EVALUACION', 'Evaluación de propuesta técnica fase 1 del sistema de trazabilidad.', 2, 2, 2, 'PENDIENTE', 'En revisión por comité evaluador técnico.', '2026-02-20 10:15:00'),
(3, 'REG-2026-003', 'AUDITORIA', 'Verificación de políticas de cumplimiento y confidencialidad de datos.', 1, 3, 3, 'COMPLETADO', 'Auditoría aprobada sin no conformidades críticas.', '2026-03-02 16:40:00')
ON DUPLICATE KEY UPDATE codigo=VALUES(codigo);

-- 3. Consultas CRUD y Trazabilidad Típicas del Módulo
-- SELECT reg.*, u.nombre AS usuario, r.titulo AS reto, e.nombre AS empresa FROM registros reg JOIN usuarios u ON reg.usuario_id = u.id LEFT JOIN retos r ON reg.reto_id = r.id LEFT JOIN empresas e ON reg.empresa_id = e.id;
-- SELECT * FROM registros WHERE estado = 'PENDIENTE';
-- UPDATE registros SET estado = 'APROBADO', observaciones = 'Validado por el comité' WHERE id = 2;
-- DELETE FROM registros WHERE id = 1;
