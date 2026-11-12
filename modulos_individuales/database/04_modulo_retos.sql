-- ====================================================================
-- PROYECTO INTEGRADOR: CESDE GAMIFIED CHALLENGES
-- TAREA INDIVIDUAL 4: MÓDULO DE RETOS & GAMIFICACIÓN (XP)
-- ====================================================================
-- Responsabilidad: Creación, dificultad, fechas límite y puntos XP de los retos
-- Integrante responsable: [Nombre del Integrante 4]
-- Archivos Frontend Vinculados:
--   - Vista: src/pages/retos/RetosPage.jsx
--   - Modal Edición/Creación: src/components/retos/RetoModal.jsx
--   - Modal Detalle: src/components/retos/RetoDetailModal.jsx
--   - Servicio API: src/services/retosService.js
-- ====================================================================

USE proyecto_integrador_db;

-- 1. Creación de la Tabla RETOS
CREATE TABLE IF NOT EXISTS retos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empresa_id INT NOT NULL,
    categoria_id INT NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT NOT NULL,
    dificultad ENUM('FACIL', 'MEDIA', 'DIFICIL') NOT NULL DEFAULT 'MEDIA',
    puntos INT NOT NULL,
    fecha_limite DATE NOT NULL,
    estado ENUM('ABIERTO', 'EN_PROGRESO', 'CERRADO', 'FINALIZADO') NOT NULL DEFAULT 'ABIERTO',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_reto_empresa FOREIGN KEY (empresa_id) 
        REFERENCES empresas(id) ON DELETE RESTRICT,
    CONSTRAINT fk_reto_categoria FOREIGN KEY (categoria_id) 
        REFERENCES categorias(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Datos de Prueba / Iniciales (Semilla)
INSERT INTO retos (id, empresa_id, categoria_id, titulo, descripcion, dificultad, puntos, fecha_limite, estado, created_at) VALUES
(1, 1, 1, 'Optimización de Consumo Energético en Servidores', 'Diseñar un algoritmo de autoescalado para reducir el gasto eléctrico en centros de datos durante horas valle.', 'DIFICIL', 1500, '2026-12-15', 'ABIERTO', '2026-02-01 10:00:00'),
(2, 2, 2, 'Sistema de Trazabilidad de Residuos Reciclables', 'Aplicación móvil para registrar y verificar el pesaje y entrega de materiales reciclables en plantas de acopio.', 'MEDIA', 850, '2026-11-30', 'EN_PROGRESO', '2026-02-14 09:30:00'),
(3, 3, 3, 'Microcréditos con Evaluación de Riesgo Alternativo', 'Modelo predictivo para calificar capacidad de pago de microempresarios sin historial crediticio bancario formal.', 'MEDIA', 1200, '2026-10-25', 'ABIERTO', '2026-03-01 16:00:00')
ON DUPLICATE KEY UPDATE titulo=VALUES(titulo);

-- 3. Consultas CRUD y Reportes Típicos del Módulo
-- SELECT r.*, e.nombre AS empresa, c.nombre AS categoria FROM retos r JOIN empresas e ON r.empresa_id = e.id JOIN categorias c ON r.categoria_id = c.id;
-- SELECT * FROM retos WHERE estado = 'ABIERTO' AND dificultad = 'DIFICIL';
-- UPDATE retos SET puntos = 1800, estado = 'EN_PROGRESO' WHERE id = 1;
-- DELETE FROM retos WHERE id = 3;
