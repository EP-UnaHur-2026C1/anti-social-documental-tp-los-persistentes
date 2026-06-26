const Joi = require('joi');

const objectIdPattern = /^[0-9a-fA-F]{24}$/; // regex para validar que el id del usuario y el id del post sean ObjectId válidos de MongoDB

const createPostSchema = Joi.object({
  description: Joi.string() // defino el esquema de validación para la descripción del post
    .trim()
    .min(10)
    .max(1000)
    .required()
    .messages({
      'string.base': 'La descripción debe ser texto.',
      'string.empty': 'La descripción no puede estar vacía.',
      'string.min': 'La descripción debe tener al menos 10 caracteres.',
      'string.max': 'La descripción no puede exceder 1000 caracteres.',
      'any.required': 'La descripción es obligatoria.'
    }),

  idUser: Joi.string() // defino el esquema de validación para el id del usuario que crea el post
    .trim()
    .pattern(objectIdPattern)
    .required()
    .messages({
      'string.base': 'El idUser debe ser un texto (ObjectId).',
      'string.empty': 'El idUser no puede estar vacío.',
      'string.pattern.base': 'El idUser debe ser un ObjectId válido.',
      'any.required': 'Debe indicar a qué usuario pertenece el post.'
    }),

  tags: Joi.array() // defino el esquema de validación para el array de tags del post
    .items(Joi.string().trim().pattern(objectIdPattern))
    .optional()
    .messages({
      'array.base': 'Los tags deben ser un array de ObjectIds.',
      'string.pattern.base': 'Cada tag debe ser un ObjectId válido.'
    }),

  images: Joi.array() // defino el esquema de validación para el array de imágenes del post
    .items(Joi.string().trim().pattern(objectIdPattern))
    .optional()
    .messages({
      'array.base': 'Las imágenes deben ser un array de ObjectIds.',
      'string.pattern.base': 'Cada imagen debe ser un ObjectId válido.'
    }),

  visible: Joi.boolean().optional()
});

const updatePostSchema = Joi.object({
  description: Joi.string() // defino el esquema de validación para la descripción del post
    .trim()
    .min(10)
    .max(1000)
    .optional()
    .messages({
      'string.base': 'La descripción debe ser texto.',
      'string.empty': 'La descripción no puede estar vacía.',
      'string.min': 'La descripción debe tener al menos 10 caracteres.',
      'string.max': 'La descripción no puede exceder 1000 caracteres.'
    }),

  tags: Joi.array() // defino el esquema de validación para el array de tags del post
    .items(Joi.string().trim().pattern(objectIdPattern))
    .optional()
    .messages({
      'array.base': 'Los tags deben ser un array de ObjectIds.',
      'string.pattern.base': 'Cada tag debe ser un ObjectId válido.'
    }),

  images: Joi.array() // defino el esquema de validación para el array de imágenes del post
    .items(Joi.string().trim().pattern(objectIdPattern))
    .optional()
    .messages({
      'array.base': 'Las imágenes deben ser un array de ObjectIds.',
      'string.pattern.base': 'Cada imagen debe ser un ObjectId válido.'
    }),

  visible: Joi.boolean().optional() // defino el esquema de validación para el campo visible del post
}).or('description', 'tags', 'images', 'visible');

module.exports = { // exporto los esquemas de validación
  createPostSchema,
  updatePostSchema
};