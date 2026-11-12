import pool from '../../config/db.js';

export const getEmpresas = async (req, res, next) => {
  try {
    const { search, sector, estado } = req.query;
    let query = `
      SELECT id, nombre, nit, sector, email, telefono, direccion, ciudad, estado, 
             created_at AS createdAt, updated_at AS updatedAt 
      FROM empresas 
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      query += ` AND (LOWER(nombre) LIKE ? OR LOWER(nit) LIKE ? OR LOWER(email) LIKE ? OR LOWER(sector) LIKE ?)`;
      const term = `%${search.toLowerCase().trim()}%`;
      params.push(term, term, term, term);
    }

    if (sector) {
      query += ` AND sector = ?`;
      params.push(sector);
    }

    if (estado) {
      query += ` AND estado = ?`;
      params.push(estado);
    }

    query += ` ORDER BY id DESC`;

    const [rows] = await pool.query(query, params);
    return res.status(200).json(rows);
  } catch (error) {
    next(error);
  }
};

export const getEmpresaById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      `SELECT id, nombre, nit, sector, email, telefono, direccion, ciudad, estado, 
              created_at AS createdAt, updated_at AS updatedAt 
       FROM empresas WHERE id = ? LIMIT 1`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Empresa no encontrada' });
    }

    return res.status(200).json(rows[0]);
  } catch (error) {
    next(error);
  }
};

export const createEmpresa = async (req, res, next) => {
  try {
    const { nombre, nit, sector, email, telefono, direccion, ciudad, estado } = req.body;

    if (!nombre || !nit || !sector || !email || !telefono) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, NIT, sector, email y teléfono son campos obligatorios'
      });
    }

    const [result] = await pool.query(
      `INSERT INTO empresas (nombre, nit, sector, email, telefono, direccion, ciudad, estado) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nombre.trim(),
        nit.trim(),
        sector.trim(),
        email.trim().toLowerCase(),
        telefono.trim(),
        direccion ? direccion.trim() : null,
        ciudad ? ciudad.trim() : 'Medellín',
        estado || 'ACTIVO'
      ]
    );

    const [newRow] = await pool.query(
      `SELECT id, nombre, nit, sector, email, telefono, direccion, ciudad, estado, created_at AS createdAt 
       FROM empresas WHERE id = ?`,
      [result.insertId]
    );

    return res.status(201).json(newRow[0]);
  } catch (error) {
    next(error);
  }
};

export const updateEmpresa = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, nit, sector, email, telefono, direccion, ciudad, estado } = req.body;

    const [exists] = await pool.query('SELECT id FROM empresas WHERE id = ?', [id]);
    if (exists.length === 0) {
      return res.status(404).json({ success: false, message: 'Empresa no encontrada' });
    }

    await pool.query(
      `UPDATE empresas 
       SET nombre = COALESCE(?, nombre),
           nit = COALESCE(?, nit),
           sector = COALESCE(?, sector),
           email = COALESCE(?, email),
           telefono = COALESCE(?, telefono),
           direccion = COALESCE(?, direccion),
           ciudad = COALESCE(?, ciudad),
           estado = COALESCE(?, estado)
       WHERE id = ?`,
      [
        nombre ? nombre.trim() : null,
        nit ? nit.trim() : null,
        sector ? sector.trim() : null,
        email ? email.trim().toLowerCase() : null,
        telefono ? telefono.trim() : null,
        direccion !== undefined ? direccion : null,
        ciudad !== undefined ? ciudad : null,
        estado || null,
        id
      ]
    );

    const [updatedRow] = await pool.query(
      `SELECT id, nombre, nit, sector, email, telefono, direccion, ciudad, estado, created_at AS createdAt, updated_at AS updatedAt 
       FROM empresas WHERE id = ?`,
      [id]
    );

    return res.status(200).json(updatedRow[0]);
  } catch (error) {
    next(error);
  }
};

export const deleteEmpresa = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verificar si tiene retos asignados
    const [retos] = await pool.query('SELECT id FROM retos WHERE empresa_id = ? LIMIT 1', [id]);
    if (retos.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'No se puede eliminar la empresa porque tiene retos registrados. Inactívela en su lugar.'
      });
    }

    const [result] = await pool.query('DELETE FROM empresas WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Empresa no encontrada' });
    }

    return res.status(200).json({ success: true, message: 'Empresa eliminada exitosamente' });
  } catch (error) {
    next(error);
  }
};
