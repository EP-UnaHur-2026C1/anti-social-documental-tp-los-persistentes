// Middleware para validar creación de comentario
const validarCreacionComentario = (req, res, next) => {
  // Validar datos de creación de comentario
  next();
};

// Middleware para validar actualización de comentario
const validarActualizacionComentario = (req, res, next) => {
  // Validar datos de actualización de comentario
  next();
};

// Middleware para validar que el comentario existe
const commentExists = (req, res, next) => {
  // Validar que el comentario existe en la BD
  next();
};

module.exports = {
  validarCreacionComentario,
  validarActualizacionComentario,
  commentExists
};
