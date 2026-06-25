const Follower = require('../models/followerModel');
const User = require('../models/userModel');

const seguirUsuario = async (req, res) => {
  try {
    const { followerId, followingId } = req.params;
    if (followerId === followingId) {
      return res.status(400).json({ message: 'No se puede seguir a sí mismo' });
    }
    const follower = await User.findById(followerId);
    const following = await User.findById(followingId);
    if (!follower || !following) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    const existe = await Follower.findOne({ follower: followerId, following: followingId });
    if (existe) {
      return res.status(409).json({ message: 'Ya se sigue a ese usuario' });
    }
    const nuevoSeguimiento = await Follower.create({ follower: followerId, following: followingId });
    res.status(201).json(nuevoSeguimiento);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const dejarDeSeguirUsuario = async (req, res) => {
  try {
    const { followerId, followingId } = req.params;
    const eliminado = await Follower.findOneAndDelete({ follower: followerId, following: followingId });
    if (!eliminado) {
      return res.status(404).json({ message: 'Relación de seguimiento no encontrada' });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const obtenerSeguidos = async (req, res) => {
  try {
    const relaciones = await Follower.find({ follower: req.params.followerId }).populate('following', 'nickName email');
    res.json(relaciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const obtenerSeguidores = async (req, res) => {
  try {
    const relaciones = await Follower.find({ following: req.params.followerId }).populate('follower', 'nickName email');
    res.json(relaciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  seguirUsuario,
  dejarDeSeguirUsuario,
  obtenerSeguidos,
  obtenerSeguidores,
};
