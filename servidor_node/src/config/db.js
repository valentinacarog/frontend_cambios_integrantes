import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'proyecto_integrador_db',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '-05:00', // Colombia Timezone UTC-5
  dateStrings: true
});

// Función de diagnóstico inicial de conexión
export const testDbConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log(`✅ [MySQL] Conectado exitosamente a la base de datos '${process.env.DB_NAME || 'proyecto_integrador_db'}'`);
    connection.release();
    return true;
  } catch (error) {
    console.warn(`⚠️ [MySQL] No se pudo conectar a la base de datos: ${error.message}`);
    console.warn(`👉 Asegúrate de tener XAMPP/MySQL encendido y de haber ejecutado 'backend/database/schema.sql'.`);
    return false;
  }
};

export default pool;
