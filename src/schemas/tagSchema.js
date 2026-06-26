const Joi = require('joi');

const createTagSchema = Joi.object({
  name: Joi.string() // defino el esquema de validación para el nombre del tag
    .trim()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.base': 'El nombre debe ser texto.',
      'string.empty': 'El nombre no puede estar vacío.',
      'string.min': 'El nombre debe tener al menos 2 caracteres.',
      'string.max': 'El nombre no puede exceder 50 caracteres.',
      'any.required': 'El nombre del tag es obligatorio.'
    })
});

const updateTagSchema = Joi.object({
  name: Joi.string() // defino el esquema de validación para el nombre del tag
    .trim()
    .min(2)
    .max(50)
    .optional()
    .messages({
      'string.base': 'El nombre debe ser texto.',
      'string.empty': 'El nombre no puede estar vacío.',
      'string.min': 'El nombre debe tener al menos 2 caracteres.',
      'string.max': 'El nombre no puede exceder 50 caracteres.'
    })
});

module.exports = { // exporto los esquemas de validación
  createTagSchema,
  updateTagSchema
};