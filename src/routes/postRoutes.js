const { Router } = require('express');
const postControllers = require('../controllers/postControllers'); // importo los controladores de post

const {
  validarCreacionPost,
  validateExistePost 
} = require('../middlewares/validatePost');

const router = Router();

// Crear publicación (Ya estaba protegido, ¡perfecto!)
router.post('/', validarCreacionPost, postControllers.crearPublicacion); 

// Obtener todos los posts (Pasa directo, no necesita ID)
router.get('/', postControllers.obtenerTodosLosPosts); 

// 2. MODIFICADO: Validamos que el post exista antes de intentar traerlo
router.get('/:idPost', validateExistePost, postControllers.obtenerPost); 

// 3. MODIFICADO: Validamos que el post exista antes de intentar actualizarlo
router.put('/:idPost', validateExistePost, postControllers.actualizarDescripcionPost); 

// 4. MODIFICADO: Validamos que el post exista antes de borrarlo (evita borrar fantasmas)
router.delete('/:idPost', validateExistePost, postControllers.eliminarPost); 

// 5. MODIFICADO: Validamos que el post exista antes de intentar colgarle una imagen
router.post('/:idPost/images', validateExistePost, postControllers.agregarImagen); 

// 6. MODIFICADO: Validamos que al menos el post de origen exista
router.delete('/:idPost/images/:idImage', validateExistePost, postControllers.eliminarImagen); 

module.exports = router;