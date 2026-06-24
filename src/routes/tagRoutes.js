const { Router } = require('express');
const tagControllers = require('../controllers/tagControllers'); // importo los controladores de tag

// Importamos los middlewares
const { validateTag, validateExisteTag, validateTagNoExiste } = require('../middlewares/validateTag');

const router = Router();

// 1. Para crear: Primero valida el formato con Joi, después que no esté repetido en la DB
router.post('/', validateTag, validateTagNoExiste, tagControllers.crearTag);

// 2. Traer todos no necesita filtros, pasa directo
router.get('/', tagControllers.obtenerTags);

// 3. Para traer uno solo por ID: Primero valida que el ID exista
router.get('/:idTag', validateExisteTag, tagControllers.obtenerTag);

// 4. Para actualizar: Valida formato de texto Joi y que el ID exista
router.put('/:idTag', validateTag, validateExisteTag, tagControllers.actualizarTag);

// 5. Para borrar: Valida que el ID exista antes de intentar eliminarlo
router.delete('/:idTag', validateExisteTag, tagControllers.eliminarTag);

// 6. Rutas de la tabla intermedia (Muchos a Muchos)
// NOTA: Estas las dejamos pasar directo al controlador por ahora, 
// ya que la lógica interna del controlador se va a encargar de chequear si el Post y el Tag existen.
router.post('/post/:idPost/tag/:idTag', tagControllers.asignarTagApost);
router.delete('/post/:idPost/tag/:idTag', tagControllers.quitarTagDePost);

module.exports = router;