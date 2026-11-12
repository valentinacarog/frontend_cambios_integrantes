import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testDbConnection } from './config/db.js';
import { errorHandler } from './middlewares/errorHandler.js';

// Rutas modulares por tareas individuales
import authRoutes from './modules/auth/authRoutes.js';
import categoriasRoutes from './modules/categorias/categoriasRoutes.js';
import empresasRoutes from './modules/empresas/empresasRoutes.js';
import usuariosRoutes from './modules/usuarios/usuariosRoutes.js';
import retosRoutes from './modules/retos/retosRoutes.js';
import registrosRoutes from './modules/registros/registrosRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// Middlewares Globales
// ==========================================
app.use(cors({
  origin: process.env.CORS_ORIGIN === '*' ? '*' : (process.env.CORS_ORIGIN || 'http://localhost:5173'),
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// Verificación de Salud de la API
// ==========================================
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ONLINE',
    project: 'Proyecto Integrador CESDE Gamified Challenges',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// ==========================================
// Registro de Rutas de la API (/api/...)
// ==========================================
app.use('/api/auth', authRoutes);
app.use('/api/categorias', categoriasRoutes); // Tarea 1
app.use('/api/usuarios', usuariosRoutes);     // Tarea 2
app.use('/api/retos', retosRoutes);           // Tarea 3
app.use('/api/empresas', empresasRoutes);     // Tarea 4
app.use('/api/registros', registrosRoutes);   // Tarea 5

// Manejo de rutas inexistentes (404)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta '${req.originalUrl}' no encontrada en el servidor API`
  });
});

// Manejador central de errores
app.use(errorHandler);

// ==========================================
// Inicialización del Servidor
// ==========================================
app.listen(PORT, async () => {
  console.log(`\n======================================================`);
  console.log(`🚀 SERVIDOR BACKEND ACTIVO EN: http://localhost:${PORT}`);
  console.log(`📡 URL Base API: http://localhost:${PORT}/api`);
  console.log(`======================================================`);
  await testDbConnection();
});

export default app;
