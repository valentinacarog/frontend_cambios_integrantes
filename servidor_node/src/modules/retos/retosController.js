import pool from '../../config/db.js';

export const getRetos = async (req, res, next) => {
  try {
    const { search, dificultad, estado, empresaId, categoriaId } = req.query;
    let query = `
      SELECT r.id, r.titulo, r.descripcion, r.dificultad, r.puntos, 
             r.fecha_limite AS fechaLimite, r.estado, 
             r.empresa_id AS empresaId, e.nombre AS empresaNombre, 
             r.categoria_id AS categoriaId, c.nombre AS categoriaNombre, 
             r.created_at AS createdAt, r.updated_at AS updatedAt 
      FROM retos r 
      JOIN empresas e ON r.empresa_id = e.id 
      JOIN categorias c ON r.categoria_id = c.id 
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      query += ` AND (LOWER(r.titulo) LIKE ? OR LOWER(r.descripcion) LIKE ? OR LOWER(e.nombre) LIKE ?)`;
      const term = `%${search.toLowerCase().trim()}%`;
      params.push(term, term, term);
    }

    if (dificultad) {
      query += ` AND r.dificultad = ?`;
      params.push(dificultad);
    }

    if (estado) {
      query += ` AND r.estado = ?`;
      params.push(estado);
    }

    if (empresaId) {
      query += ` AND r.empresa_id = ?`;
      params.push(Number(empresaId));
    }

    if (categoriaId) {
      query += ` AND r.categoria_id = ?`;
      params.push(Number(categoriaId));
    }

    query += ` ORDER BY r.id DESC`;

    const [rows] = await pool.query(query, params);
    return res.status(200).json(rows);
  } catch (error) {
    next(error);
  }
};

export const getRetoById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      `SELECT r.id, r.titulo, r.descripcion, r.dificultad, r.puntos, 
              r.fecha_limite AS fechaLimite, r.estado, 
              r.empresa_id AS empresaId, e.nombre AS empresaNombre, 
              r.categoria_id AS categoriaId, c.nombre AS categoriaNombre, 
              r.created_at AS createdAt, r.updated_at AS updatedAt 
       FROM retos r 
       JOIN empresas e ON r.empresa_id = e.id 
       JOIN categorias c ON r.categoria_id = c.id 
       WHERE r.id = ? LIMIT 1`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Reto no encontrado' });
    }

    return res.status(200).json(rows[0]);
  } catch (error) {
    next(error);
  }
};

export const createReto = async (req, res, next) => {
  try {
    const {
      titulo,
      descripcion,
      dificultad,
      puntos,
      fechaLimite,
      fecha_limite,
      empresaId,
      empresa_id,
      categoriaId,
      categoria_id,
      estado
    } = req.body;

    const empId = Number(empresaId || empresa_id);
    const catId = Number(categoriaId || categoria_id);
    const limitDate = fechaLimite || fecha_limite;

    if (!titulo || !descripcion || !empId || !catId || !puntos || !limitDate) {
      return res.status(400).json({
        success: false,
        message: 'Título, descripción, empresa, categoría, puntos y fecha límite son obligatorios'
      });
    }

    const [result] = await pool.query(
      `INSERT INTO retos (titulo, descripcion, dificultad, puntos, fecha_limite, empresa_id, categoria_id, estado) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        titulo.trim(),
        descripcion.trim(),
        dificultad || 'MEDIA',
        Number(puntos),
        limitDate,
        empId,
        catId,
        estado || 'ABIERTO'
      ]
    );

    const [newRow] = await pool.query(
      `SELECT r.id, r.titulo, r.descripcion, r.dificultad, r.puntos, 
              r.fecha_limite AS fechaLimite, r.estado, 
              r.empresa_id AS empresaId, e.nombre AS empresaNombre, 
              r.categoria_id AS categoriaId, c.nombre AS categoriaNombre, 
              r.created_at AS createdAt 
       FROM retos r 
       JOIN empresas e ON r.empresa_id = e.id 
       JOIN categorias c ON r.categoria_id = c.id 
       WHERE r.id = ?`,
      [result.insertId]
    );

    return res.status(201).json(newRow[0]);
  } catch (error) {
    next(error);
  }
};

export const updateReto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      titulo,
      descripcion,
      dificultad,
      puntos,
      fechaLimite,
      fecha_limite,
      empresaId,
      empresa_id,
      categoriaId,
      categoria_id,
      estado
    } = req.body;

    const [exists] = await pool.query('SELECT id FROM retos WHERE id = ?', [id]);
    if (exists.length === 0) {
      return res.status(404).json({ success: false, message: 'Reto no encontrado' });
    }

    const empId = empresaId || empresa_id ? Number(empresaId || empresa_id) : null;
    const catId = categoriaId || categoria_id ? Number(categoriaId || categoria_id) : null;
    const limitDate = fechaLimite || fecha_limite || null;

    await pool.query(
      `UPDATE retos 
       SET titulo = COALESCE(?, titulo),
           descripcion = COALESCE(?, descripcion),
           dificultad = COALESCE(?, dificultad),
           puntos = COALESCE(?, puntos),
           fecha_limite = COALESCE(?, fecha_limite),
           empresa_id = COALESCE(?, empresa_id),
           categoria_id = COALESCE(?, categoria_id),
           estado = COALESCE(?, estado)
       WHERE id = ?`,
      [
        titulo ? titulo.trim() : null,
        descripcion ? descripcion.trim() : null,
        dificultad || null,
        puntos ? Number(puntos) : null,
        limitDate,
        empId,
        catId,
        estado || null,
        id
      ]
    );

    const [updatedRow] = await pool.query(
      `SELECT r.id, r.titulo, r.descripcion, r.dificultad, r.puntos, 
              r.fecha_limite AS fechaLimite, r.estado, 
              r.empresa_id AS empresaId, e.nombre AS empresaNombre, 
              r.categoria_id AS categoriaId, c.nombre AS categoriaNombre, 
              r.created_at AS createdAt, r.updated_at AS updatedAt 
       FROM retos r 
       JOIN empresas e ON r.empresa_id = e.id 
       JOIN categorias c ON r.categoria_id = c.id 
       WHERE r.id = ?`,
      [id]
    );

    return res.status(200).json(updatedRow[0]);
  } catch (error) {
    next(error);
  }
};

export const deleteReto = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verificar si hay registros o postulaciones
    const [registros] = await pool.query('SELECT id FROM registros WHERE reto_id = ? LIMIT 1', [id]);
    if (registros.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'No se puede eliminar el reto porque ya tiene postulaciones o registros vinculados. Ciérrelo en su lugar.'
      });
    }

    const [result] = await pool.query('DELETE FROM retos WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Reto no encontrado' });
    }

    return res.status(200).json({ success: true, message: 'Reto eliminado exitosamente' });
  } catch (error) {
    next(error);
  }
};
