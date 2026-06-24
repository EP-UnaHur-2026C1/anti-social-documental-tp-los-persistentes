const { Router } = require('express');
const followerControllers = require('../controllers/followerControllers'); // Importo los controladores de follower

const router = Router();

// RUTAS DE GESTIÓN DE SEGUIDORES

// Seguir a otro usuario
// Se esperan followerId (el que sigue) y followingId (el seguido) como parámetros en la URL
router.post('/:followerId/follow/:followingId', followerControllers.seguirUsuario);

// Dejar de seguir a otro usuario
router.delete('/:followerId/unfollow/:followingId', followerControllers.dejarDeSeguirUsuario);

// Obtener la lista de usuarios a los que sigue un usuario (Followings)
router.get('/:followerId/followings', followerControllers.obtenerSeguidos);

// Obtener la lista de seguidores de un usuario (Followers)
router.get('/:followerId/followers', followerControllers.obtenerSeguidores);

module.exports = router;