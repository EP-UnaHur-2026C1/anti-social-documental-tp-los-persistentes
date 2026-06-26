const { User } = require("../models/user.model"); // importo el modelo de User para poder consultar la base de datos y verificar si un usuario existe o no

const validarAmbosUsuariosExisten = async (req, res, next) => {
  try {
    const { followerId, followingId } = req.params;

    const [follower, following] = await Promise.all([ // busco ambos usuarios en paralelo para optimizar la consulta a la base de datos
      User.findById(followerId),
      User.findById(followingId),
    ]);

    if (!follower || !following) { // si alguno de los dos usuarios no existe, devuelvo un error 404 indicando que uno o ambos usuarios no existen
      return res.status(404).json({
        message: "Uno o ambos usuarios no existen.",
      });
    }

    req.follower = follower;
    req.following = following;
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const validarSeguir = async (req, res, next) => {
  try {
    const follower = req.follower;
    const following = req.following;

    if (!Array.isArray(follower.following)) { // si el campo following del usuario que sigue no es un array, lo inicializo como un array vacío para evitar errores al intentar acceder a él
      follower.following = [];
    }

    if (follower.following.some((userId) => userId.toString() === following._id.toString())) {
      return res
        .status(409)
        .json({ message: "El usuario ya sigue a este otro usuario." });
    }

    next();
  } catch (error) {
    console.error("Error en validarSeguir:", error);
    res.status(500).json({ message: "Error al validar la acción de seguir." });
  }
};

const validarUsuarioSeSigueASiMismo = async (req, res, next) => {
  const { followerId, followingId } = req.params;
  if (followerId === followingId) { // si el usuario que intenta seguir es el mismo que el usuario a seguir, devuelvo un error 400 indicando que un usuario no puede seguirse a sí mismo
    return res.status(400).json({ message: 'Un usuario no puede seguirse a sí mismo.' });
  }
  next();
};

const validarDejarDeSeguir = async (req, res, next) => {
  try {
    const follower = req.follower;
    const following = req.following;

    if (!Array.isArray(follower.following)) { // si el campo following del usuario que sigue no es un array, lo inicializo como un array vacío para evitar errores al intentar acceder a él
      follower.following = [];
    }

    if (!follower.following.some((userId) => userId.toString() === following._id.toString())) { // si el usuario que intenta dejar de seguir no sigue al usuario objetivo, devuelvo un error 404 indicando que la relación de seguimiento no existía
      return res
        .status(404)
        .json({ message: 'La relación de seguimiento no existía.' });
    }

    next();
  } catch (error) {
    console.error("Error en validarDejarDeSeguir:", error);
    res.status(500).json({ message: "Error al validar la acción de dejar de seguir." });
  }
};

module.exports = { // exporto los middlewares de validación para poder usarlos en las rutas
    validarAmbosUsuariosExisten, 
    validarSeguir, 
    validarUsuarioSeSigueASiMismo, 
    validarDejarDeSeguir 
};