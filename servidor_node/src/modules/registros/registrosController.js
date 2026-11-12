import pool from '../../config/db.js';

export const getRegistros = async (req, res, next) => {
  try {
    const { search, tipo, estado, usuarioId, retoId, empresaId } = req.query;
    let query = `
      SELECT reg.id, reg.codigo, reg.tipo, reg.descripcion, reg.estado, reg.observaciones, 
             reg.usuario_id AS usuarioId, CONCAT(u.nombre, ' ', u.apellido) AS usuarioNombre, 
             reg.empresa_id AS empresaId, e.nombre AS empresaNombre, 
             reg.reto_id AS retoId, r.titulo AS retoTitulo, 
             reg.created_at AS createdAt, reg.updated_at AS updatedAt 
      FROM registros reg 
      JOIN usuarios u ON reg.usuario_id = u.id 
      LEFT JOIN empresas e ON reg.empresa_id = e.id 
      LEFT JOIN retos r ON reg.reto_id = r.id 
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      query += ` AND (LOWER(reg.codigo) LIKE ? OR LOWER(reg.descripcion) LIKE ? OR LOWER(u.nombre) LIKE ? OR LOWER(u.apellido) LIKE ?)`;
      const term = `%${search.toLowerCase().trim()}%`;
      params.push(term, term, term, term);
    }

    if (tipo) {
      query += ` AND reg.tipo = ?`;
      params.push(tipo);
    }

    if (estado) {
      query += ` AND reg.estado = ?`;
      params.push(estado);
    }

    if (usuarioId) {
      query += ` AND reg.usuario_id = ?`;
      params.push(Number(usuarioId));
    }

    if (retoId) {
      query += ` AND reg.reto_id = ?`;
      params.push(Number(retoId));
    }

    if (empresaId) {
      query += ` AND reg.empresa_id = ?`;
      params.push(Number(empresaId));
    }

    query += ` ORDER BY reg.id DESC`;

    const [rows] = await pool.query(query, params);
    return res.status(200).json(rows);
  } catch (error) {
    next(error);
  }
};

export const getRegistroById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      `SELECT reg.id, reg.codigo, reg.tipo, reg.descripcion, reg.estado, reg.observaciones, 
              reg.usuario_id AS usuarioId, CONCAT(u.nombre, ' ', u.apellido) AS usuarioNombre, 
              reg.empresa_id AS empresaId, e.nombre AS empresaNombre, 
              reg.reto_id AS retoId, r.titulo AS retoTitulo, 
              reg.created_at AS createdAt, reg.updated_at AS updatedAt 
       FROM registros reg 
       JOIN usuarios u ON reg.usuario_id = u.id 
       LEFT JOIN empresas e ON reg.empresa_id = e.id 
       LEFT JOIN retos r ON reg.reto_id = r.id 
       WHERE reg.id = ? LIMIT 1`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Registro no encontrado' });
    }

    return res.status(200).json(rows[0]);
  } catch (error) {
    next(error);
  }
};

export const createRegistro = async (req, res, next) => {
  try {
    const {
      codigo,
      tipo,
      descripcion,
      usuarioId,
      usuario_id,
      empresaId,
      empresa_id,
      retoId,
      reto_id,
      estado,
      observaciones
    } = req.body;

    const usrId = Number(usuarioId || usuario_id);
    const empId = empresaId || empresa_id ? Number(empresaId || empresa_id) : null;
    const retId = retoId || reto_id ? Number(retoId || reto_id) : null;

    if (!descripcion || !usrId) {
      return res.status(400).json({
        success: false,
        message: 'Descripción y usuario postulante son campos obligatorios'
      });
    }

    // Auto-generación de código de radicado si no se proporciona
    let radicadoCode = codigo ? codigo.trim().toUpperCase() : null;
    if (!radicadoCode) {
      const year = new Date().getFullYear();
      const randomSuffix = Math.floor(100 + Math.random() * 900);
      radicadoCode = `REG-${year}-${randomSuffix}`;
    }

    const [result] = await pool.query(
      `INSERT INTO registros (codigo, tipo, descripcion, usuario_id, empresa_id, reto_id, estado, observaciones) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        radicadoCode,
        tipo || 'INSCRIPCION',
        descripcion.trim(),
        usrId,
        empId,
        retId,
        estado || 'PENDIENTE',
        observaciones ? observaciones.trim() : null
      ]
    );

    const [newRow] = await pool.query(
      `SELECT reg.id, reg.codigo, reg.tipo, reg.descripcion, reg.estado, reg.observaciones, 
              reg.usuario_id AS usuarioId, CONCAT(u.nombre, ' ', u.apellido) AS usuarioNombre, 
              reg.empresa_id AS empresaId, e.nombre AS empresaNombre, 
              reg.reto_id AS retoId, r.titulo AS retoTitulo, 
              reg.created_at AS createdAt 
       FROM registros reg 
       JOIN usuarios u ON reg.usuario_id = u.id 
       LEFT JOIN empresas e ON reg.empresa_id = e.id 
       LEFT JOIN retos r ON reg.reto_id = r.id 
       WHERE reg.id = ?`,
      [result.insertId]
    );

    return res.status(201).json(newRow[0]);
  } catch (error) {
    next(error);
  }
};

export const updateRegistro = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      codigo,
      tipo,
      descripcion,
      usuarioId,
      usuario_id,
      empresaId,
      empresa_id,
      retoId,
      reto_id,
      estado,
      observaciones
    } = req.body;

    const [exists] = await pool.query('SELECT id FROM registros WHERE id = ?', [id]);
    if (exists.length === 0) {
      return res.status(404).json({ success: false, message: 'Registro no encontrado' });
    }

    const usrId = usuarioId || usuario_id ? Number(usuarioId || usuario_id) : null;
    const empId = empresaId !== undefined ? (empresaId ? Number(empresaId) : null) : (empresa_id ? Number(empresa_id) : null);
    const retId = retoId !== undefined ? (retoId ? Number(retoId) : null) : (reto_id ? Number(reto_id) : null);

    await pool.query(
      `UPDATE registros 
       SET codigo = COALESCE(?, codigo),
           tipo = COALESCE(?, tipo),
           descripcion = COALESCE(?, descripcion),
           usuario_id = COALESCE(?, usuario_id),
           empresa_id = COALESCE(?, empresa_id),
           reto_id = COALESCE(?, reto_id),
           estado = COALESCE(?, estado),
           observaciones = COALESCE(?, observaciones)
       WHERE id = ?`,
      [
        codigo ? codigo.trim().toUpperCase() : null,
        tipo || null,
        descripcion ? descripcion.trim() : null,
        usrId,
        empId,
        retId,
        estado || null,
        observaciones !== undefined ? observaciones : null,
        id
      ]
    );

    const [updatedRow] = await pool.query(
      `SELECT reg.id, reg.codigo, reg.tipo, reg.descripcion, reg.estado, reg.observaciones, 
              reg.usuario_id AS usuarioId, CONCAT(u.nombre, ' ', u.apellido) AS usuarioNombre, 
              reg.empresa_id AS empresaId, e.nombre AS empresaNombre, 
              reg.reto_id AS retoId, r.titulo AS retoTitulo, 
              reg.created_at AS createdAt, reg.updated_at AS updatedAt 
       FROM registros reg 
       JOIN usuarios u ON reg.usuario_id = u.id 
       LEFT JOIN empresas e ON reg.empresa_id = e.id 
       LEFT JOIN retos r ON reg.reto_id = r.id 
       WHERE reg.id = ?`,
      [id]
    );

    return res.status(200).json(updatedRow[0]);
  } catch (error) {
    next(error);
  }
};

export const deleteRegistro = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query('DELETE FROM registros WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Registro no encontrado' });
    }

    return res.status(200).json({ success: true, message: 'Registro eliminado exitosamente' });
  } catch (error) {
    next(error);
  }
};
