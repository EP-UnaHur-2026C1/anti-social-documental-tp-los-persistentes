const Joi = require('joi');

// 1. Esquema para la creación (Registro) de usuarios - Campos obligatorios (.required())
const createUserSchema = Joi.object({
  nickName: Joi.string()
    .trim()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.base': 'El nickName debe ser texto.',
      'string.empty': 'El nickName no puede estar vacío.',
      'string.min': 'El nickName debe tener al menos 3 caracteres.',
      'string.max': 'El nickName no puede tener más de 30 caracteres.',
      'any.required': 'El nickName es obligatorio.'
    }),

  firstName: Joi.string()
    .trim()
    .max(50)
    .optional()
    .messages({
      'string.max': 'El firstName no puede tener más de 50 caracteres.'
    }),

  lastName: Joi.string()
    .trim()
    .max(50)
    .optional()
    .messages({
      'string.max': 'El lastName no puede tener más de 50 caracteres.'
    }),

  email: Joi.string()
    .trim()
    .email()
    .required()
    .messages({
      'string.email': 'El email debe tener un formato válido.',
      'any.required': 'El email es obligatorio.'
    }),

  password: Joi.string()
    .min(6)
    .max(100)
    .required()
    .messages({
      'string.min': 'La password debe tener al menos 6 caracteres.',
      'any.required': 'La password es obligatoria.'
    })
});

// 2. Esquema para actualizar (PUT/PATCH) - Todos los campos son opcionales (.optional())
const updateUserSchema = Joi.object({
  nickName: Joi.string()
    .trim()
    .min(3)
    .max(30)
    .optional()
    .messages({
      'string.base': 'El nickName debe ser texto.',
      'string.empty': 'El nickName no puede estar vacío.',
      'string.min': 'El nickName debe tener al menos 3 caracteres.',
      'string.max': 'El nickName no puede tener más de 30 caracteres.',
    }),

  firstName: Joi.string()
    .trim()
    .max(50)
    .optional()
    .messages({
      'string.max': 'El firstName no puede tener más de 50 caracteres.'
    }),

  lastName: Joi.string()
    .trim()
    .max(50)
    .optional()
    .messages({
      'string.max': 'El lastName no puede tener más de 50 caracteres.'
    }),

  email: Joi.string()
    .trim()
    .email()
    .optional()
    .messages({
      'string.email': 'El email debe tener un formato válido.',
    }),

  password: Joi.string()
    .min(6)
    .max(100)
    .optional()
    .messages({
      'string.min': 'La password debe tener al menos 6 caracteres.',
    })
});

// 3. Esquema mixto o alternativo
const createUpdateUserSchema = Joi.object({
  nickName: Joi.string()
    .trim()
    .min(3)
    .max(30)
    .optional()
    .messages({
      'string.base': 'El nickName debe ser texto.',
      'string.empty': 'El nickName no puede estar vacío.',
      'string.min': 'El nickName debe tener al menos 3 caracteres.',
      'string.max': 'El nickName no puede tener más de 30 caracteres.',
      'any.required': 'El nickName es obligatorio.'
    }),

  firstName: Joi.string()
    .trim()
    .max(50)
    .optional()
    .messages({
      'string.max': 'El firstName no puede tener más de 50 caracteres.'
    }),

  lastName: Joi.string()
    .trim()
    .max(50)
    .optional()
    .messages({
      'string.max': 'El lastName no puede tener más de 50 caracteres.'
    }),

  email: Joi.string()
    .trim()
    .email()
    .optional()
    .messages({
      'string.email': 'El email debe tener un formato válido.',
    }),

  password: Joi.string()
    .min(6)
    .max(100)
    .optional()
    .messages({
      'string.min': 'La password debe tener al menos 6 caracteres.',
    })
});

// Exportamos los tres para que los middlewares los puedan usar
module.exports = {
  createUserSchema,
  updateUserSchema,
  createUpdateUserSchema
};