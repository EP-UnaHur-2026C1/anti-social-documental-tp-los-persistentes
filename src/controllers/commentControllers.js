const Comment = require('../models/comment.model');
const redisClient = require('../../config/redisClient');

// CREAR COMENTARIO 
const crearComentario = async (req, res) => {
  const { idPost, idUser, content } = req.body;
  try {
    const nuevoComentario = await Comment.create({ idPost, idUser, content });

    // Invalidamos las cachés vinculadas
    await redisClient.del('comments:all');
    await redisClient.del(`post:${idPost}`);

    res.status(201).json(nuevoComentario);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el comentario.', error: error.message });
  }
};

// OBTENER TODOS LOS COMENTARIOS 
const obtenerComentarios = async (req, res) => {
  const cacheKey = 'comments:all';
  try {
    const cachedComments = await redisClient.get(cacheKey);
    if (cachedComments) {
      return res.status(200).json(JSON.parse(cachedComments));
    }

    const comentarios = await Comment.find().sort({ createdAt: -1 });
    await redisClient.set(cacheKey, JSON.stringify(comentarios), { EX: 300 });

    res.status(200).json(comentarios);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la lista de comentarios.', error: error.message });
  }
};

// OBTENER UN COMENTARIO POR ID 
const obtenerComentario = async (req, res) => {
  const { idComment } = req.params;
  const cacheKey = `comment:${idComment}`;
  try {
    const cachedComment = await redisClient.get(cacheKey);
    if (cachedComment) {
      return res.status(200).json(JSON.parse(cachedComment));
    }

    const comentario = await Comment.findById(idComment);
    if (!comentario) {
      return res.status(404).json({ message: `Comentario con ID ${idComment} no encontrado.` });
    }

    await redisClient.set(cacheKey, JSON.stringify(comentario), { EX: 300 });
    res.status(200).json(comentario);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el comentario.', error: error.message });
  }
};

// ACTUALIZAR COMENTARIO 
const actualizarComentario = async (req, res) => {
  const { idComment } = req.params;
  const { content } = req.body;

  try {
    const comentarioActualizado = await Comment.findByIdAndUpdate(
      idComment,
      { content },
      { new: true, runValidators: true } 
    ).select('-__v'); 

    // Limpiamos cachés en Redis
    await redisClient.del('comments:all');
    await redisClient.del(`comment:${idComment}`);
    if (comentarioActualizado) {
      await redisClient.del(`post:${comentarioActualizado.idPost}`);
    }

    res.status(200).json(comentarioActualizado);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar the comentario.', error: error.message });
  }
};

// ELIMINAR COMENTARIO 
const eliminarComentario = async (req, res) => {
  const { idComment } = req.params;

  try {
    const comentarioEliminado = await Comment.findByIdAndDelete(idComment);

    // Limpiamos las cachés afectadas
    await redisClient.del('comments:all');
    await redisClient.del(`comment:${idComment}`);
    if (comentarioEliminado) {
      await redisClient.del(`post:${comentarioEliminado.idPost}`);
    }

    res.status(200).json({ 
      message: `Comentario ID: ${idComment} eliminado correctamente.`, 
      eliminado: comentarioEliminado 
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar el comentario.",
      error: error.message,
    });
  }
};

module.exports = {
  crearComentario,
  obtenerComentarios,
  obtenerComentario,
  actualizarComentario,
  eliminarComentario
};