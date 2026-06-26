const Joi = require('joi');
const { User } = require('../models/user.model');
const { createUpdateUserSchema, updateUserSchema, createUserSchema } = require('../schemas/userSchema');

const validarCreacionUsuario = (req, res, next) => {
  const { error, value } = createUserSchema.validate(req.body, { abortEarly: false, stripUnknown: true });

  if (error) {
    const mensajes = error.details.map((d) => d.message);
    return res.status(400).json({ errors: mensajes });
  }

  req.body = value; 
  next();
};

const validarUnicidadNickName = async (req, res, next) => {
  const { nickName } = req.body;

  try {
    const usuarioExistente = await User.findOne({ nickName });

    if (usuarioExistente) {
      return res.status(400).json({ errors: ['El nickName ya está en uso.'] });
    }

    next();
  } catch (err) {
    console.error('Error al validar unicidad:', err);
    res.status(500).json({ message: 'Error interno al validar usuario.', details: err.message });
  }
};

const validarUnicidadMail = async (req, res, next) => {
  const { email } = req.body;

  try {
    const mailExistente = await User.findOne({ email });

    if (mailExistente) {
      return res.status(400).json({ errors: ['El email ya está en uso.'] });
    }

    next();
  } catch (err) {
    console.error('Error al validar unicidad:', err);
    res.status(500).json({ message: 'Error interno al validar usuario.', details: err.message });
  }
};

const validarUsuarioExiste = async (req, res, next) => {
  const idUser = req.params.idUser || req.body.idUser;

  if (!idUser) {
    return res.status(400).json({ message: 'Falta el idUser en la solicitud.' });
  }

  try {
    const user = await User.findById(idUser);
    if (!user) {
      return res.status(404).json({ message: `Usuario con ID ${idUser} no encontrado.` });
    }
    next();
  } catch (error) {
    console.error('Error en validarUsuarioExiste:', error);
    res.status(500).json({ message: 'Error verificando existencia del usuario.', error: error.message });
  }
};

const validarUpdateUsuario = (req, res, next) => {
  const { error, value } = createUpdateUserSchema.validate(req.body, { abortEarly: false, stripUnknown: true });

  if (error) {
    const mensajes = error.details.map((d) => d.message);
    return res.status(400).json({ errors: mensajes });
  }

  req.body = value;
  next();
};

const validarEmailUpdate = async (req, res, next) => {
  const { email } = req.body;

  if (typeof email === 'undefined') {
    return next();
  }

  try {
    const usuarioExistente = await User.findOne({ email });

    if (usuarioExistente) {
      return res.status(400).json({ errors: ['El email ya está en uso.'] });
    }

    next();
  } catch (err) {
    console.error('Error al validar unicidad:', err);
    res.status(500).json({ message: 'Error interno al validar usuario.', details: err.message });
  }
};

const validarNickNameUpdate = async (req, res, next) => {
  const { nickName } = req.body;

  if (typeof nickName === 'undefined') {
    return next();
  }

  try {
    const usuarioExistente = await User.findOne({ nickName });

    if (usuarioExistente) {
      return res.status(400).json({ errors: ['El nickName ya está en uso.'] });
    }

    next();
  } catch (err) {
    console.error('Error al validar unicidad:', err);
    res.status(500).json({ message: 'Error interno al validar usuario.', details: err.message });
  }
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