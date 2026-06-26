const { Router } = require('express');
const followerControllers = require('../controllers/followerControllers'); 

// Importamos los middlewares
const { 
    validarAmbosUsuariosExisten, 
    validarSeguir, 
    validarUsuarioSeSigueASiMismo, 
    validarDejarDeSeguir 
} = require('../middlewares/validateFollowers');

const router = Router();

// // RUTAS DE GESTIÓN DE SEGUIDORES

// Seguir a otro usuario
router.post('/:followerId/follow/:followingId', 
    validarUsuarioSeSigueASiMismo, 
    validarAmbosUsuariosExisten, 
    validarSeguir, 
    followerControllers.seguirUsuario
);

// Dejar de seguir a otro usuario
router.delete('/:followerId/unfollow/:followingId', 
    validarAmbosUsuariosExisten, 
    validarDejarDeSeguir, 
    followerControllers.dejarDeSeguirUsuario
);

// Obtener la lista de usuarios a los que sigue un usuario (Followings)
router.get('/:followerId/followings', 
    followerControllers.obtenerSeguidos
);

// Obtener la lista de seguidores de un usuario (Followers)
router.get('/:followerId/followers', 
    followerControllers.obtenerSeguidores
);

module.exports = router;