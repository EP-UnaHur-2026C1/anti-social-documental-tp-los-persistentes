const { Router } = require('express');
const postControllers = require('../controllers/postControllers'); // importo los controladores de post

const {
  validarCreacionPost,
  validateExistePost 
} = require('../middlewares/validatePost');

const router = Router();

// Crear publicación 
router.post('/', validarCreacionPost, postControllers.crearPublicacion); 

// Obtener todos los posts (Pasa directo, no necesita ID)
router.get('/', postControllers.obtenerTodosLosPosts); 

// MODIFICADO: Validamos que el post exista antes de intentar traerlo
router.get('/:idPost', validateExistePost, postControllers.obtenerPost); 

// MODIFICADO: Validamos que el post exista antes de intentar actualizarlo
router.put('/:idPost', validateExistePost, postControllers.actualizarDescripcionPost); 

// MODIFICADO: Validamos que el post exista antes de borrarlo (evita borrar fantasmas)
router.delete('/:idPost', validateExistePost, postControllers.eliminarPost); 

// MODIFICADO: Validamos que el post exista antes de intentar colgarle una imagen
router.post('/:idPost/images', validateExistePost, postControllers.agregarImagen); 

// MODIFICADO: Validamos que al menos el post de origen exista
router.delete('/:idPost/images/:idImage', validateExistePost, postControllers.eliminarImagen); 

module.exports = router;