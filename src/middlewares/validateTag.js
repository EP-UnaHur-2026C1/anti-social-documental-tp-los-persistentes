const Tag = require('../models/tag.model'); // importo el modelo de Tag para poder consultar la base de datos y verificar si un tag existe o no
const { createTagSchema, updateTagSchema } = require('../schemas/tagSchema');

const validateTag = (req, res, next) => {
  const schema = req.method === 'POST' ? createTagSchema : updateTagSchema; // determino qué esquema de validación usar según el método HTTP de la solicitud (POST para crear, PUT/PATCH para actualizar)
  const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true }); // valido el cuerpo de la solicitud contra el esquema de validación correspondiente, abortando al primer error y eliminando propiedades desconocidas

  if (error) {
    const mensajes = error.details.map((d) => d.message);
    return res.status(400).json({ errors: mensajes });
  }

  req.body = value.name
    ? {
        ...value,
        name: value.name.trim().toLowerCase(),
      }
    : value;
  next();
};

const validateUpdateTag = (req, res, next) => {
  const { error, value } = updateTagSchema.validate(req.body, { abortEarly: false, stripUnknown: true }); // valido el cuerpo de la solicitud contra el esquema de validación definido en updateTagSchema

  if (error) {
    const mensajes = error.details.map((d) => d.message);
    return res.status(400).json({ errors: mensajes });
  }

  if (value.name) {
    value.name = value.name.trim().toLowerCase();
  }

  req.body = value;
  next();
};

const validateTagNoExiste = async (req, res, next) => {
  try {
    const { name } = req.body
    const normalizedName = name.trim().toLowerCase();

    const existente = await Tag.findOne({ name: normalizedName }) // busco en la base de datos si ya existe un tag con el mismo nombre
    if (existente) {
      return res.status(409).json({ message: `La etiqueta "${normalizedName}" ya existe.` })
    }
    req.body.name = normalizedName;
    next();
  } catch (err) {
    res.status(500).json({ message: 'Error interno al validar etiqueta.', details: err.message });
  }
};

const validateExisteTag = async (req, res, next) => {
    const { idTag } = req.params;

    try {
      const tag = await Tag.findById(idTag); // busco el tag en la base de datos por su id
      if (!tag) return res.status(404).json({ message: `Etiqueta con ID ${idTag} no encontrada.` });
      req.tag = tag;
      next();
  } catch (err) {
    res.status(500).json({ message: 'Error interno al validar etiqueta.', details: err.message });
  }
};

module.exports = { // exporto los middlewares de validación para poder usarlos en las rutas
    validateTag,
  validateUpdateTag,
    validateExisteTag,
    validateTagNoExiste
};