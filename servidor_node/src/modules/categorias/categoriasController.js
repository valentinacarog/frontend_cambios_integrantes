import pool from '../../config/db.js';

export const getCategorias = async (req, res, next) => {
  try {
    const { search, estado } = req.query;
    let query = `
      SELECT id, nombre, codigo, descripcion, color, estado, 
             created_at AS createdAt, updated_at AS updatedAt 
      FROM categorias 
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      query += ` AND (LOWER(nombre) LIKE ? OR LOWER(codigo) LIKE ? OR LOWER(descripcion) LIKE ?)`;
      const term = `%${search.toLowerCase().trim()}%`;
      params.push(term, term, term);
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

export const getCategoriaById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      `SELECT id, nombre, codigo, descripcion, color, estado, 
              created_at AS createdAt, updated_at AS updatedAt 
       FROM categorias WHERE id = ? LIMIT 1`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Categoría no encontrada' });
    }

    return res.status(200).json(rows[0]);
  } catch (error) {
    next(error);
  }
};

export const createCategoria = async (req, res, next) => {
  try {
    const { nombre, codigo, descripcion, color, estado } = req.body;

    if (!nombre || !codigo || !descripcion) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, código y descripción son obligatorios'
      });
    }

    const [result] = await pool.query(
      `INSERT INTO categorias (nombre, codigo, descripcion, color, estado) 
       VALUES (?, ?, ?, ?, ?)`,
      [nombre.trim(), codigo.trim().toUpperCase(), descripcion.trim(), color || '#6366f1', estado || 'ACTIVO']
    );

    const [newRow] = await pool.query(
      `SELECT id, nombre, codigo, descripcion, color, estado, created_at AS createdAt 
       FROM categorias WHERE id = ?`,
      [result.insertId]
    );

    return res.status(201).json(newRow[0]);
  } catch (error) {
    next(error);
  }
};

export const updateCategoria = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, codigo, descripcion, color, estado } = req.body;

    const [exists] = await pool.query('SELECT id FROM categorias WHERE id = ?', [id]);
    if (exists.length === 0) {
      return res.status(404).json({ success: false, message: 'Categoría no encontrada' });
    }

    await pool.query(
      `UPDATE categorias 
       SET nombre = COALESCE(?, nombre),
           codigo = COALESCE(?, codigo),
           descripcion = COALESCE(?, descripcion),
           color = COALESCE(?, color),
           estado = COALESCE(?, estado)
       WHERE id = ?`,
      [
        nombre ? nombre.trim() : null,
        codigo ? codigo.trim().toUpperCase() : null,
        descripcion ? descripcion.trim() : null,
        color || null,
        estado || null,
        id
      ]
    );

    const [updatedRow] = await pool.query(
      `SELECT id, nombre, codigo, descripcion, color, estado, created_at AS createdAt, updated_at AS updatedAt 
       FROM categorias WHERE id = ?`,
      [id]
    );

    return res.status(200).json(updatedRow[0]);
  } catch (error) {
    next(error);
  }
};

export const deleteCategoria = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verificar si está asociada a retos
    const [retosAsociados] = await pool.query(
      'SELECT id FROM retos WHERE categoria_id = ? LIMIT 1',
      [id]
    );

    if (retosAsociados.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'No se puede eliminar la categoría porque tiene retos técnicos asignados. Inactívela en su lugar.'
      });
    }

    const [result] = await pool.query('DELETE FROM categorias WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Categoría no encontrada' });
    }

    return res.status(200).json({ success: true, message: 'Categoría eliminada exitosamente' });
  } catch (error) {
    next(error);
  }
};
