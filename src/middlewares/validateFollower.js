// Middleware para validar seguidores
const validarFollowerExiste = (req, res, next) => {
  // Validar que el usuario seguidor existe
  next();
};

// Middleware para validar que el usuario a seguir existe
const validarFollowingExiste = (req, res, next) => {
  // Validar que el usuario a seguir existe
  next();
};

// Middleware para validar que no se sigue a sí mismo
const validarNoAutoFollow = (req, res, next) => {
  // Validar que no se intenta seguir a sí mismo
  next();
};

module.exports = {
  validarFollowerExiste,
  validarFollowingExiste,
  validarNoAutoFollow
};
