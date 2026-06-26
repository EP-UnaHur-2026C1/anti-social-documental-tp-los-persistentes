const { User } = require("../models/user.model");
const ATRIBUTOS_EXCLUIDOS = ["updatedAt"];

const redisClient = require("../../config/redisClient");

// CREAR USUARIO
const crearUsuario = async (req, res) => {
  const { nickName, firstName, lastName, email, password } = req.body;
  try {
    const nuevoUsuario = new User({
      nickName,
      firstName,
      lastName,
      email,
      password,
    });

    await nuevoUsuario.save();
    
    const usuarioRespuesta = nuevoUsuario.toJSON();
    delete usuarioRespuesta.password; // Evitamos mandar la contraseña de vuelta

    res.status(201).json(usuarioRespuesta);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error interno al crear el usuario.",
      details: error.message,
    });
  }
};

// OBTENER TODOS LOS USUARIOS
const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await User.find({}, { password: 0, updatedAt: 0, __v: 0 });
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener la lista de usuarios.",
      details: error.message,
    });
  }
};

// OBTENER UN USUARIO POR ID (Con caché en Redis)
const obtenerUsuario = async (req, res) => {
  const { idUser } = req.params;
  const cacheKey = `user:${idUser}`;
  try {
    const cachedUser = await redisClient.get(cacheKey);
    if (cachedUser) {
      return res.json(JSON.parse(cachedUser));
    }
    
    const usuario = await User.findById(idUser, {
      password: 0,
      updatedAt: 0,
      __v: 0,
    });
    
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    
    await redisClient.set(cacheKey, JSON.stringify(usuario), {
      EX: 3600, // Expira en 1 hora
    });

    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({
      message: `Error al obtener el usuario con ID ${idUser}.`,
      details: error.message,
    });
  }
};

// ACTUALIZAR USUARIO
const actualizarUsuario = async (req, res) => {
  const { idUser } = req.params;
  const cacheKey = `user:${idUser}`;
  const updateData = { ...req.body };

  try {
    const usuario = await User.findByIdAndUpdate(idUser, updateData, {
      new: true,
      projection: { password: 0 },
    });
    
    await redisClient.del(cacheKey); // Invalidamos la caché vieja
    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar el usuario.",
      details: error.message,
    });
  }
};

// ELIMINAR USUARIO
const eliminarUsuario = async (req, res) => {
  const { idUser } = req.params;
  const cacheKey = `user:${idUser}`;
  try {
    const eliminado = await User.findByIdAndDelete(idUser);
    await redisClient.del(cacheKey); // Invalidamos la caché
    
    res.status(200).json({
      message: `Usuario ID ${idUser} eliminado correctamente.`,
      eliminado: eliminado.nickName,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar el usuario.",
      details: error.message,
    });
  }
};

module.exports = {
  crearUsuario,
  obtenerUsuarios,
  obtenerUsuario,
  actualizarUsuario,
  eliminarUsuario,
};