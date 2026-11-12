export const errorHandler = (err, req, res, next) => {
  console.error('[Error Handler]', err);

  // Error de clave duplicada en MySQL (ER_DUP_ENTRY)
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      success: false,
      message: 'Ya existe un registro con ese valor único (código, nit o email duplicado)',
      error: err.sqlMessage || err.message
    });
  }

  // Error de restricción de clave foránea en MySQL
  if (err.code === 'ER_NO_REFERENCED_ROW_2' || err.code === 'ER_ROW_IS_REFERENCED_2') {
    return res.status(400).json({
      success: false,
      message: 'Conflicto de integridad referencial: El registro referenciado no existe o está en uso',
      error: err.sqlMessage || err.message
    });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};
