const { User } = require('../models/user.model');
const redisClient = require('../../config/redisClient');

// 1. SEGUIR USUARIO (Bidireccional: corregido a inglés)
const seguirUsuario = async (req, res) => {
  const { followerId, followingId } = req.params;

  try {
    // Buscamos ambos usuarios para modificar sus respectivos arrays
    const follower = await User.findById(followerId);
    const following = await User.findById(followingId);

    if (!follower || !following) {
      return res.status(404).json({ message: 'Uno o ambos usuarios no existen.' });
    }

    // El que sigue guarda al que es seguido en su lista de 'following'
    follower.following.push(following._id);
    // El seguido guarda al que lo empezó a seguir en su lista de 'followers'
    following.followers.push(follower._id);

    await follower.save();
    await following.save();

    // Invalidamos las cachés de relaciones en Redis para ambos usuarios
    await redisClient.del(`user:${followerId}:followings`);
    await redisClient.del(`user:${followerId}:followers`);
    await redisClient.del(`user:${followingId}:followings`);
    await redisClient.del(`user:${followingId}:followers`);

    res.status(201).json({
      message: `Usuario ${followerId} ahora sigue a ${followingId}.`,
      followerId: follower._id,
      followingId: following._id
    });

  } catch (error) {
    console.error('Error al seguir usuario:', error);
    res.status(500).json({ message: 'Error al seguir al usuario.', error: error.message });
  }
};

// 2. DEJAR DE SEGUIR USUARIO (Bidireccional: corregido a inglés)
const dejarDeSeguirUsuario = async (req, res) => {
  const { followerId, followingId } = req.params;

  try {
    const follower = await User.findById(followerId);
    const following = await User.findById(followingId);

    if (!follower || !following) {
      return res.status(404).json({ message: 'Uno o ambos usuarios no existen.' });
    }

    // Removemos la relación usando filtros nativos de Mongoose
    follower.following = follower.following.filter(id => !id.equals(following._id));
    following.followers = following.followers.filter(id => !id.equals(follower._id));

    await follower.save();
    await following.save();

    // Limpiamos las memorias de caché correspondientes
    await redisClient.del(`user:${followerId}:followings`);
    await redisClient.del(`user:${followerId}:followers`);
    await redisClient.del(`user:${followingId}:followings`);
    await redisClient.del(`user:${followingId}:followers`);

    res.status(200).json({
      message: `El usuario ID: ${followerId} dejó de seguir al Usuario ID: ${followingId}`
    });

  } catch (error) {
    console.error('Error al dejar de seguir usuario:', error);
    res.status(500).json({ message: 'Error al dejar de seguir al usuario.', error: error.message });
  }
};

// 3. OBTENER LISTA DE SEGUIDOS (Corregido populate a inglés)
const obtenerSeguidos = async (req, res) => {
  const { followerId } = req.params; 
  const cacheKey = `user:${followerId}:followings`;

  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    // Buscamos el usuario y cargamos su array 'following'
    const usuario = await User.findById(followerId)
      .select('nickName following') 
      .populate({
        path: 'following',
        select: 'nickName email firstName lastName' 
      });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    const respuesta = {
      idUser: usuario._id,
      nickName: usuario.nickName,
      followings: usuario.following
    };

    // Almacenamos el resultado en caché por 5 minutos
    await redisClient.set(cacheKey, JSON.stringify(respuesta), { EX: 300 });

    res.status(200).json(respuesta);

  } catch (error) {
    console.error('Error al obtener seguidos:', error);
    res.status(500).json({ message: 'Error al obtener la lista de seguidos.', error: error.message });
  }
};

// 4. OBTENER LISTA DE SEGUIDORES (Corregido populate a inglés)
const obtenerSeguidores = async (req, res) => {
  const { followerId } = req.params; 
  const cacheKey = `user:${followerId}:followers`;

  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }

    // Buscamos el usuario y cargamos su array 'followers'
    const usuario = await User.findById(followerId)
      .select('nickName followers') 
      .populate({
        path: 'followers',
        select: 'nickName email firstName lastName' 
      });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    const respuesta = {
      idUser: usuario._id,
      nickName: usuario.nickName,
      followers: usuario.followers
    };

    await redisClient.set(cacheKey, JSON.stringify(respuesta), { EX: 300 });

    res.status(200).json(respuesta);

  } catch (error) {
    console.error('Error al obtener seguidores:', error);
    res.status(500).json({ message: 'Error al obtener la lista de seguidores.', error: error.message });
  }
};

module.exports = {
  seguirUsuario,
  dejarDeSeguirUsuario,
  obtenerSeguidos,
  obtenerSeguidores
};