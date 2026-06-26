const commentSchema = require('../schemas/commentSchema'); // importo el esquema de validación para los comentarios
const Comment  = require('../models/comment.model'); // importo el modelo de Comment para poder consultar la base de datos y verificar si un comentario existe o no
const { createCommentSchema, updateCommentSchema } = commentSchema;

const validarCreacionComentario = (req, res, next) => {
  const { error, value } = createCommentSchema.validate(req.body, { abortEarly: false, stripUnknown: true }) // valido el cuerpo de la solicitud contra el esquema de validación definido en createCommentSchema

  if (error) {
    const mensajes = error.details.map(d => d.message)
    return res.status(400).json({ errors: mensajes })
  }

  req.body = value
  next()
}

const validarActualizacionComentario = (req, res, next) => {
  const { error, value } = updateCommentSchema.validate(req.body,{abortEarly: false, stripUnknown: true}) // valido el cuerpo de la solicitud contra el esquema de validación definido en updateCommentSchema

  if (error) {
    const mensajes = error.details.map(d => d.message)
    return res.status(400).json({ errors: mensajes })
  }

  req.body = value
  next()
}

const commentExists = async (req, res, next) => {
  try {
    const {idComment} = req.params
    const comentario = await Comment.findById(idComment)
    if (!comentario) {
      return res.status(404).json({ message: `Comentario con ID ${idComment} no encontrado.` })
    }

    next()
  } catch (err) {
    console.error('Error validarComentarioExiste:', err)
    res.status(500).json({ message: 'Error interno al validar comentario.', details: err.message })
  }
}

const commentNoExiste = async (req, res, next) => {
  try {
    const {idComment} = req.params
    const comentario = await Comment.findById(idComment) // busco el comentario en la base de datos por su id
    if (comentario) {
      return res.status(409).json({ message: `Comentario con ID ${idComment} ya existe.` })
    }

    next()
  } catch (err) {
    console.error('Error validarComentarioNoExiste:', err)
    res.status(500).json({ message: 'Error interno al validar comentario.', details: err.message })
  }
}

module.exports = { // exporto los middlewares de validación para poder usarlos en las rutas
    commentExists,
    commentNoExiste,
  validarCreacionComentario,
  validarActualizacionComentario,
  validarCrearComentario: validarCreacionComentario,
  validarActualizarComentario: validarActualizacionComentario
} 