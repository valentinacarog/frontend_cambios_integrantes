import bcrypt from 'bcryptjs';
import pool from '../../config/db.js';

export const getUsuarios = async (req, res, next) => {
  try {
    const { search, rol, estado } = req.query;
    let query = `
      SELECT u.id, u.nombre, u.apellido, u.email, u.telefono, u.rol, 
             u.avatar_url AS avatar, u.estado, u.empresa_id AS empresaId, 
             e.nombre AS empresaNombre, 
             u.created_at AS createdAt, u.updated_at AS updatedAt 
      FROM usuarios u 
      LEFT JOIN empresas e ON u.empresa_id = e.id 
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      query += ` AND (LOWER(u.nombre) LIKE ? OR LOWER(u.apellido) LIKE ? OR LOWER(u.email) LIKE ?)`;
      const term = `%${search.toLowerCase().trim()}%`;
      params.push(term, term, term);
    }

    if (rol) {
      query += ` AND u.rol = ?`;
      params.push(rol);
    }

    if (estado) {
      query += ` AND u.estado = ?`;
      params.push(estado);
    }

    query += ` ORDER BY u.id DESC`;

    const [rows] = await pool.query(query, params);
    return res.status(200).json(rows);
  } catch (error) {
    next(error);
  }
};

export const getUsuarioById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      `SELECT u.id, u.nombre, u.apellido, u.email, u.telefono, u.rol, 
              u.avatar_url AS avatar, u.estado, u.empresa_id AS empresaId, 
              e.nombre AS empresaNombre, 
              u.created_at AS createdAt, u.updated_at AS updatedAt 
       FROM usuarios u 
       LEFT JOIN empresas e ON u.empresa_id = e.id 
       WHERE u.id = ? LIMIT 1`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    return res.status(200).json(rows[0]);
  } catch (error) {
    next(error);
  }
};

export const createUsuario = async (req, res, next) => {
  try {
    const { nombre, apellido, email, password, telefono, rol, empresaId, estado } = req.body;

    if (!nombre || !apellido || !email) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, apellido y email son campos obligatorios'
      });
    }

    const defaultPassword = password || 'Admin123!';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);
    const assignedRole = ['ADMIN', 'EMPRESA', 'USUARIO'].includes(rol) ? rol : 'USUARIO';

    const [result] = await pool.query(
      `INSERT INTO usuarios (nombre, apellido, email, password_hash, telefono, rol, empresa_id, estado) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nombre.trim(),
        apellido.trim(),
        email.trim().toLowerCase(),
        hashedPassword,
        telefono ? telefono.trim() : null,
        assignedRole,
        empresaId ? Number(empresaId) : null,
        estado || 'ACTIVO'
      ]
    );

    const [newRow] = await pool.query(
      `SELECT u.id, u.nombre, u.apellido, u.email, u.telefono, u.rol, 
              u.avatar_url AS avatar, u.estado, u.empresa_id AS empresaId, 
              e.nombre AS empresaNombre, u.created_at AS createdAt 
       FROM usuarios u 
       LEFT JOIN empresas e ON u.empresa_id = e.id 
       WHERE u.id = ?`,
      [result.insertId]
    );

    return res.status(201).json(newRow[0]);
  } catch (error) {
    next(error);
  }
};

export const updateUsuario = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, email, password, telefono, rol, empresaId, estado } = req.body;

    const [exists] = await pool.query('SELECT id FROM usuarios WHERE id = ?', [id]);
    if (exists.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    let passwordClause = '';
    const params = [
      nombre ? nombre.trim() : null,
      apellido ? apellido.trim() : null,
      email ? email.trim().toLowerCase() : null,
      telefono !== undefined ? telefono : null,
      rol || null,
      empresaId !== undefined ? (empresaId ? Number(empresaId) : null) : null,
      estado || null
    ];

    if (password && password.trim().length > 0) {
      const hashedPassword = await bcrypt.hash(password.trim(), 10);
      passwordClause = ', password_hash = ?';
      params.push(hashedPassword);
    }

    params.push(id);

    await pool.query(
      `UPDATE usuarios 
       SET nombre = COALESCE(?, nombre),
           apellido = COALESCE(?, apellido),
           email = COALESCE(?, email),
           telefono = COALESCE(?, telefono),
           rol = COALESCE(?, rol),
           empresa_id = COALESCE(?, empresa_id),
           estado = COALESCE(?, estado)
           ${passwordClause}
       WHERE id = ?`,
      params
    );

    const [updatedRow] = await pool.query(
      `SELECT u.id, u.nombre, u.apellido, u.email, u.telefono, u.rol, 
              u.avatar_url AS avatar, u.estado, u.empresa_id AS empresaId, 
              e.nombre AS empresaNombre, 
              u.created_at AS createdAt, u.updated_at AS updatedAt 
       FROM usuarios u 
       LEFT JOIN empresas e ON u.empresa_id = e.id 
       WHERE u.id = ?`,
      [id]
    );

    return res.status(200).json(updatedRow[0]);
  } catch (error) {
    next(error);
  }
};

export const deleteUsuario = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verificar registros dependientes
    const [registros] = await pool.query('SELECT id FROM registros WHERE usuario_id = ? LIMIT 1', [id]);
    if (registros.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'No se puede eliminar el usuario porque tiene postulaciones o auditorías asociadas. Cambie su estado a INACTIVO.'
      });
    }

    const [result] = await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    return res.status(200).json({ success: true, message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    next(error);
  }
};
