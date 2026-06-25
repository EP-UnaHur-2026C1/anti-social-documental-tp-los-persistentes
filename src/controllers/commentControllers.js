const Comment = require('../models/commentModel');

const crearComentario = async (req, res) => {
  try {
    const nuevoComentario = await Comment.create(req.body);
    res.status(201).json(nuevoComentario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const obtenerComentarios = async (req, res) => {
  try {
    const comentarios = await Comment.find();
    res.json(comentarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const obtenerComentario = async (req, res) => {
  try {
    const comentario = await Comment.findById(req.params.idComment);
    if (!comentario) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }
    res.json(comentario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const actualizarComentario = async (req, res) => {
  try {
    const comentarioActualizado = await Comment.findByIdAndUpdate(
      req.params.idComment,
      req.body,
      { new: true, runValidators: true },
    );
    if (!comentarioActualizado) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }
    res.json(comentarioActualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const eliminarComentario = async (req, res) => {
  try {
    const comentarioEliminado = await Comment.findByIdAndDelete(req.params.idComment);
    if (!comentarioEliminado) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  crearComentario,
  obtenerComentarios,
  obtenerComentario,
  actualizarComentario,
  eliminarComentario,
};
