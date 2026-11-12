# MAPA DE IDENTIFICACIÓN DE TAREAS INDIVIDUALES
## Proyecto Integrador: CESDE Gamified Challenges • Sistema Administrativo

Este documento organiza y delimita las **5 tareas individuales** del proyecto para que cada integrante pueda sustentar e identificar con total claridad qué archivos del Frontend, qué servicios y qué tablas de la Base de Datos (`proyecto_integrador_db`) le pertenecen.

---

### Resumen General de Responsabilidades

| Tarea # | Módulo / Categoría | Responsable | Archivo Vista Principal | Servicio API | Tabla BD | Script SQL Individual |
| :---: | :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | **Categorías** | Integrante 1 | `src/pages/categorias/Tarea1_CategoriasPage.jsx` | `src/services/Tarea1_CategoriasService.js` | `categorias` | `01_modulo_categorias.sql` |
| **2** | **Usuario** | Integrante 2 | `src/pages/usuarios/Tarea2_UsuarioPage.jsx` | `src/services/Tarea2_UsuarioService.js` | `usuarios` | `03_modulo_usuarios.sql` |
| **3** | **Retos** | Integrante 3 | `src/pages/retos/Tarea3_RetosPage.jsx` | `src/services/Tarea3_RetosService.js` | `retos` | `04_modulo_retos.sql` |
| **4** | **Empresas** | Integrante 4 | `src/pages/empresas/Tarea4_EmpresasPage.jsx` | `src/services/Tarea4_EmpresasService.js` | `empresas` | `02_modulo_empresas.sql` |
| **5** | **Registro** | Integrante 5 | `src/pages/registros/Tarea5_RegistroPage.jsx` | `src/services/Tarea5_RegistroService.js` | `registros` | `05_modulo_registros.sql` |

---

## Detalle por Tarea Individual

---

### 📁 TAREA 1: MÓDULO DE CATEGORÍAS
* **Propósito:** Administración de los ejes temáticos y áreas del conocimiento que clasifican los retos tecnológicos.
* **Archivos Frontend:**
  * **Vista principal renombrada:** `src/pages/categorias/Tarea1_CategoriasPage.jsx`
  * **Servicio API renombrado:** `src/services/Tarea1_CategoriasService.js`
  * Formulario / Modal creación y edición: `src/components/categorias/CategoriaModal.jsx`
  * Modal de detalle / consulta: `src/components/categorias/CategoriaDetailModal.jsx`
  * *Re-export de compatibilidad:* `src/pages/categorias/CategoriasPage.jsx` y `src/services/categoriasService.js`
* **Base de Datos:**
  * Tabla: `categorias`
  * Script individual: `modulos_individuales/database/01_modulo_categorias.sql`
  * Campos administrados: `id`, `nombre`, `codigo` (único), `descripcion`, `color`, `estado`.
* **Endpoints API asociados:**
  * `GET /api/categorias` - Listar todas con filtros por nombre y estado.
  * `GET /api/categorias/:id` - Consultar una categoría por ID.
  * `POST /api/categorias` - Crear una nueva categoría con código único.
  * `PUT /api/categorias/:id` - Actualizar información o estado.
  * `DELETE /api/categorias/:id` - Eliminación física o lógica.

---

### 📁 TAREA 2: MÓDULO DE USUARIO & ACCESOS
* **Propósito:** Gestión de cuentas, roles (`ADMIN`, `EMPRESA`, `USUARIO`), teléfonos, credenciales y autenticación.
* **Archivos Frontend:**
  * **Vista principal renombrada:** `src/pages/usuarios/Tarea2_UsuarioPage.jsx`
  * **Servicio API renombrado:** `src/services/Tarea2_UsuarioService.js`
  * Formulario / Modal creación y edición: `src/components/usuarios/UsuarioModal.jsx`
  * Modal de detalle / consulta: `src/components/usuarios/UsuarioDetailModal.jsx`
  * Autenticación y credenciales: `src/services/authService.js`
  * *Re-export de compatibilidad:* `src/pages/usuarios/UsuariosPage.jsx` y `src/services/usuariosService.js`
* **Base de Datos:**
  * Tabla: `usuarios`
  * Script individual: `modulos_individuales/database/03_modulo_usuarios.sql`
  * Clave Foránea: `empresa_id` (vincula opcionalmente a un usuario de rol `EMPRESA` con su compañía).
  * Campos administrados: `id`, `empresa_id`, `nombre`, `apellido`, `email`, `password_hash`, `telefono`, `rol`, `estado`.
* **Endpoints API asociados:**
  * `POST /api/auth/login` - Autenticación y emisión de token.
  * `POST /api/auth/register` - Registro de nuevos talentos/usuarios.
  * `GET /api/usuarios` - Listado con filtros por rol y estado.
  * `GET /api/usuarios/:id` - Ver perfil o usuario específico.
  * `POST /api/usuarios` - Crear usuario desde el panel administrativo.
  * `PUT /api/usuarios/:id` - Editar datos del usuario.
  * `DELETE /api/usuarios/:id` - Desactivar o eliminar cuenta.

---

### 📁 TAREA 3: MÓDULO DE RETOS (CHALLENGES & XP)
* **Propósito:** Núcleo de gamificación donde se crean y gestionan los desafíos técnicos, niveles de dificultad, recompensas de puntos XP y fechas límites.
* **Archivos Frontend:**
  * **Vista principal renombrada:** `src/pages/retos/Tarea3_RetosPage.jsx`
  * **Servicio API renombrado:** `src/services/Tarea3_RetosService.js`
  * Formulario / Modal creación y edición: `src/components/retos/RetoModal.jsx`
  * Modal de detalle / consulta: `src/components/retos/RetoDetailModal.jsx`
  * *Re-export de compatibilidad:* `src/pages/retos/RetosPage.jsx` y `src/services/retosService.js`
* **Base de Datos:**
  * Tabla: `retos`
  * Script individual: `modulos_individuales/database/04_modulo_retos.sql`
  * Claves Foráneas:
    * `empresa_id` -> Relaciona el reto con la empresa aliada que lo propone.
    * `categoria_id` -> Relaciona el reto con su categoría temática.
  * Campos administrados: `id`, `empresa_id`, `categoria_id`, `titulo`, `descripcion`, `dificultad`, `puntos`, `fecha_limite`, `estado`.
* **Endpoints API asociados:**
  * `GET /api/retos` - Listado con filtros por búsqueda, dificultad, empresa, categoría y estado.
  * `GET /api/retos/:id` - Consulta detallada de un reto.
  * `POST /api/retos` - Publicación de un nuevo reto empresarial.
  * `PUT /api/retos/:id` - Edición de contenidos, puntos o estado.
  * `DELETE /api/retos/:id` - Eliminar o archivar un reto.

---

### 📁 TAREA 4: MÓDULO DE EMPRESAS
* **Propósito:** Registro y administración de empresas aliadas que patrocinan los retos y evalúan talento.
* **Archivos Frontend:**
  * **Vista principal renombrada:** `src/pages/empresas/Tarea4_EmpresasPage.jsx`
  * **Servicio API renombrado:** `src/services/Tarea4_EmpresasService.js`
  * Formulario / Modal creación y edición: `src/components/empresas/EmpresaModal.jsx`
  * Modal de detalle / consulta: `src/components/empresas/EmpresaDetailModal.jsx`
  * *Re-export de compatibilidad:* `src/pages/empresas/EmpresasPage.jsx` y `src/services/empresasService.js`
* **Base de Datos:**
  * Tabla: `empresas`
  * Script individual: `modulos_individuales/database/02_modulo_empresas.sql`
  * Campos administrados: `id`, `nombre`, `nit` (único), `sector`, `email` (único), `telefono`, `direccion`, `ciudad`, `estado`.
* **Endpoints API asociados:**
  * `GET /api/empresas` - Listado de empresas aliadas registradas.
  * `GET /api/empresas/:id` - Perfil corporativo de la empresa.
  * `POST /api/empresas` - Vinculación de nueva empresa.
  * `PUT /api/empresas/:id` - Actualización de datos de contacto y sector.
  * `DELETE /api/empresas/:id` - Baja o inactivación de empresa.

---

### 📁 TAREA 5: MÓDULO DE REGISTRO (INSCRIPCIONES & AUDITORÍAS)
* **Propósito:** Bitácora transaccional que registra la interacción entre usuarios, empresas y retos (inscripciones a retos, entregas, evaluaciones y auditorías).
* **Archivos Frontend:**
  * **Vista principal renombrada:** `src/pages/registros/Tarea5_RegistroPage.jsx`
  * **Servicio API renombrado:** `src/services/Tarea5_RegistroService.js`
  * Formulario / Modal creación y edición: `src/components/registros/RegistroModal.jsx`
  * Modal de detalle / consulta: `src/components/registros/RegistroDetailModal.jsx`
  * *Re-export de compatibilidad:* `src/pages/registros/RegistrosPage.jsx` y `src/services/registrosService.js`
* **Base de Datos:**
  * Tabla: `registros`
  * Script individual: `modulos_individuales/database/05_modulo_registros.sql`
  * Claves Foráneas:
    * `usuario_id` -> Usuario que realiza la acción o radicación.
    * `empresa_id` -> Empresa asociada al proceso.
    * `reto_id` -> Reto objeto de la inscripción o evaluación.
  * Campos administrados: `id`, `codigo`, `tipo`, `descripcion`, `usuario_id`, `empresa_id`, `reto_id`, `estado`, `observaciones`.
* **Endpoints API asociados:**
  * `GET /api/registros` - Listado con filtros por tipo, usuario, empresa o estado.
  * `GET /api/registros/:id` - Consulta de un registro específico.
  * `POST /api/registros` - Radicar una nueva inscripción, auditoría o evaluación.
  * `PUT /api/registros/:id` - Actualizar dictamen, observaciones o estado (`APROBADO`, `RECHAZADO`).
  * `DELETE /api/registros/:id` - Anulación de registro.
