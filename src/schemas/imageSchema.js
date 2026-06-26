const Joi = require('joi');

const objectIdPattern = /^[0-9a-fA-F]{24}$/; // regex para validar que el id del post sea un ObjectId válido de MongoDB

const createImageSchema = Joi.object({
  idPost: Joi.string() // defino el esquema de validación para el id del post al que pertenece la imagen
    .trim() // elimina espacios en blanco al inicio y al final de la cadena
    .pattern(objectIdPattern)
    .required()
    .messages({
      'string.base': 'El idPost debe ser un texto (ObjectId).',
      'string.empty': 'El idPost no puede estar vacío.',
      'string.pattern.base': 'El idPost debe ser un ObjectId válido.',
      'any.required': 'Debe indicar a qué post pertenece la imagen.'
    }),

  imageUrls: Joi.array() // defino el esquema de validación para el array de URLs de las imágenes
    .items(
      Joi.string()
        .trim()
        .uri()
        .required()
        .messages({
          'string.uri': 'Cada URL debe ser válida.',
          'string.empty': 'Cada URL no puede estar vacía.',
          'any.required': 'Cada URL es obligatoria.'
        })
    )
    .min(1)
    .required()
    .messages({
      'array.base': 'Se requiere un array de imageUrls válidas.',
      'array.min': 'Debe enviar al menos una URL.'
    })
});

const updateImageSchema = Joi.object({
  imageUrls: Joi.array() // defino el esquema de validación para el array de URLs de las imágenes
    .items(
      Joi.string()
        .trim() // 
        .uri() 
        .required()
        .messages({
          'string.uri': 'Cada URL debe ser válida.',
          'string.empty': 'Cada URL no puede estar vacía.',
          'any.required': 'Cada URL es obligatoria.'
        })
    )
    .min(1)
    .optional()
    .messages({
      'array.base': 'Se requiere un array de imageUrls válidas.',
      'array.min': 'Debe enviar al menos una URL.'
    })
});

module.exports = { // exporto los esquemas de validación
  createImageSchema,
  updateImageSchema
};