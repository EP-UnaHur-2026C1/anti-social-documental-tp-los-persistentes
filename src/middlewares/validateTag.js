// Middleware para validar tag
const validateTag = (req, res, next) => {
  // Validar formato de tag con Joi
  next();
};

// Middleware para validar que el tag existe
const validateExisteTag = (req, res, next) => {
  // Validar que el tag existe en la BD
  next();
};

// Middleware para validar que el tag no existe
const validateTagNoExiste = (req, res, next) => {
  // Validar que el tag no esté repetido
  next();
};

module.exports = {
  validateTag,
  validateExisteTag,
  validateTagNoExiste
};
