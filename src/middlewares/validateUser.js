// Middleware para validar creación de usuario
const validarCreacionUsuario = (req, res, next) => {
  // Validar datos de creación de usuario
  next();
};

// Middleware para validar unicidad del nickname
const validarUnicidadNickName = (req, res, next) => {
  // Validar que el nickname no exista
  next();
};

// Middleware para validar unicidad del email
const validarUnicidadMail = (req, res, next) => {
  // Validar que el email no exista
  next();
};

// Middleware para validar que el usuario existe
const validarUsuarioExiste = (req, res, next) => {
  // Validar que el usuario existe en la BD
  next();
};

// Middleware para validar actualización de usuario
const validarUpdateUsuario = (req, res, next) => {
  // Validar datos de actualización
  next();
};

// Middleware para validar email en actualización
const validarEmailUpdate = (req, res, next) => {
  // Validar email en update
  next();
};

// Middleware para validar nickname en actualización
const validarNickNameUpdate = (req, res, next) => {
  // Validar nickname en update
  next();
};

module.exports = {
  validarCreacionUsuario,
  validarUnicidadNickName,
  validarUnicidadMail,
  validarUsuarioExiste,
  validarUpdateUsuario,
  validarEmailUpdate,
  validarNickNameUpdate
};
