const { Router } = require('express');
const commentControllers = require('../controllers/commentControllers'); // importo los controladores de comment

// Importamos también commentExists para chequear la DB
const {
  validarCreacionComentario,
  validarActualizacionComentario,
  commentExists, 
} = require('../middlewares/validateComment');

const router = Router();

// Crear comentario (Ya validaba el cuerpo con Joi, perfecto)
router.post('/', validarCreacionComentario, commentControllers.crearComentario);

// Obtener todos los comentarios (Pasa de largo, no requiere ID)
router.get('/', commentControllers.obtenerComentarios);

// MODIFICADO: Antes de buscarlo, verificamos si existe en la DB
router.get('/:idComment', commentExists, commentControllers.obtenerComentario);

// MODIFICADO: Valida el nuevo formato del texto Y que el comentario exista antes de editar
router.put('/:idComment', validarActualizacionComentario, commentExists, commentControllers.actualizarComentario);

// MODIFICADO: Verifica que exista antes de meter el DELETE en SQLite
router.delete('/:idComment', commentExists, commentControllers.eliminarComentario);

module.exports = router;