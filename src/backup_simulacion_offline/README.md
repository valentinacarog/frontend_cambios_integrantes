# 📦 Respaldo de Simulación Offline y Base de Datos Local (Mock Data)

Este directorio contiene una copia intacta de la **capa de simulación de backend y datos mock en JavaScript** que se utilizaba antes de conectar el proyecto con el backend real en **Java Spring Boot y MySQL**.

---

## 📄 Archivos Aislados en esta Carpeta

| Archivo de Respaldo | Módulo Original | Función que Cumplía |
| :--- | :--- | :--- |
| `mockData.backup.js` | `src/modules/core/lib/mockData.js` | Tablas y datos iniciales en memoria (usuarios, retos, empresas, etc.). |
| `authService.fallback.js` | `src/modules/auth/services/authService.js` | Generación de JWT simulado en cliente y autenticación contra localStorage. |
| `Tarea1_CategoriasService.fallback.js` | `src/modules/categorias/services/` | Simulación CRUD de Categorías con persistencia en localStorage. |
| `Tarea2_UsuarioService.fallback.js` | `src/modules/usuarios/services/` | Simulación CRUD de Usuarios y roles con persistencia en localStorage. |
| `Tarea3_RetosService.fallback.js` | `src/modules/retos/services/` | Simulación de Retos y cruce de llaves foráneas en JavaScript. |
| `Tarea4_EmpresasService.fallback.js` | `src/modules/empresas/services/` | Simulación de Empresas aliadas con persistencia en localStorage. |
| `Tarea5_RegistroService.fallback.js` | `src/modules/registros/services/` | Simulación de Radicados, bitácora y auditorías en localStorage. |

---

## ℹ️ ¿Por qué se aisló este código?

1. **Backend Real en Java:** Ahora el sistema consume directamente los controladores REST de **Java Spring Boot** (`http://localhost:3000/api`) conectados a la base de datos **MySQL** (`proyecto_integrador_db`).
2. **Preservación Total:** Ninguna línea de la lógica previa fue eliminada; se conserva aquí como referencia, estudio o respaldo si se desea consultar el funcionamiento offline anterior.

