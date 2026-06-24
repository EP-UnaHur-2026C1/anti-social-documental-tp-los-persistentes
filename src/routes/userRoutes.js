const { Router } = require('express');
const userControllers = require('../controllers/userControllers');
const {
    validarCreacionUsuario,
    validarUnicidadNickName,
    validarUnicidadMail,
    validarUsuarioExiste,
    validarUpdateUsuario,
    validarEmailUpdate,
    validarNickNameUpdate
} = require('../middlewares/validateUser');

const router = Router();

// C: Crear un nuevo usuario
router.post('/', validarCreacionUsuario, validarUnicidadNickName, validarUnicidadMail, userControllers.crearUsuario);

// R: Obtener todos los usuarios
router.get('/', userControllers.obtenerUsuarios);

// R: Obtener un usuario por su ID
router.get('/:idUser', validarUsuarioExiste, userControllers.obtenerUsuario);

// U: Actualizar un usuario por su ID
router.put('/:idUser', validarUpdateUsuario, validarUsuarioExiste, validarEmailUpdate, validarNickNameUpdate, userControllers.actualizarUsuario);

// D: Eliminar un usuario por su ID
router.delete('/:idUser', validarUsuarioExiste, userControllers.eliminarUsuario);

module.exports = router;