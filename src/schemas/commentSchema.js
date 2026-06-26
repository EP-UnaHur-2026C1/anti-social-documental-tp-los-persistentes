const Joi = require('joi'); // defino el esquema de validación para los comentarios

const objectIdPattern = /^[0-9a-fA-F]{24}$/; // regex para validar que el id del usuario y el id del post sean ObjectId válidos de MongoDB

const createCommentSchema = Joi.object({
  idUser: Joi.string() // defino el esquema de validación para el id del usuario que crea el comentario
    .trim()
    .pattern(objectIdPattern)
    .required()
    .messages({
      'string.base': 'El idUser debe ser un texto (ObjectId).',
      'string.empty': 'El idUser no puede estar vacío.',
      'string.pattern.base': 'El idUser debe ser un ObjectId válido.',
      'any.required': 'El idUser es obligatorio.'
    }),

  idPost: Joi.string() // defino el esquema de validación para el id del post al que pertenece el comentario
    .trim()
    .pattern(objectIdPattern)
    .required()
    .messages({
      'string.base': 'El idPost debe ser un texto (ObjectId).',
      'string.empty': 'El idPost no puede estar vacío.',
      'string.pattern.base': 'El idPost debe ser un ObjectId válido.',
      'any.required': 'El idPost es obligatorio.'
    }),

  content: Joi.string() // defino el esquema de validación para el contenido del comentario
    .trim()
    .min(1)
    .max(500)
    .required()
    .messages({
      'string.base': 'El contenido debe ser texto',
      'string.empty': 'El comentario no puede estar vacío',
      'string.min': 'El comentario debe tener al menos 1 carácter',
      'string.max': 'El comentario no puede exceder 500 caracteres',
      'any.required': 'El campo content es obligatorio'
    }),

  visible: Joi.boolean().optional()
});

const updateCommentSchema = Joi.object({
  content: Joi.string() // defino el esquema de validación para el contenido del comentario
    .trim()
    .min(1)
    .max(500)
    .optional()
    .messages({
      'string.base': 'El campo content debe ser texto',
      'string.empty': 'El campo content no puede estar vacío',
      'string.min': 'El comentario debe tener al menos 1 carácter',
      'string.max': 'El comentario no puede exceder 500 caracteres'
    }),

  visible: Joi.boolean().optional()
}).or('content', 'visible');

module.exports = { // exporto los esquemas de validación
  createCommentSchema,
  updateCommentSchema
}; 