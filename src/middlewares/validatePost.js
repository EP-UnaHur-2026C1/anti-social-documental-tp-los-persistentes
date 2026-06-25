// Middleware para validar creación de post
const validarCreacionPost = (req, res, next) => {
  // Validar datos de creación de post
  next();
};

// Middleware para validar que el post existe
const validateExistePost = (req, res, next) => {
  // Validar que el post existe en la BD
  next();
};

module.exports = {
  validarCreacionPost,
  validateExistePost
};
