const Tag = require('../models/tagModel');
const Post = require('../models/postModel');

const crearTag = async (req, res) => {
  try {
    const nuevoTag = await Tag.create(req.body);
    res.status(201).json(nuevoTag);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const obtenerTags = async (req, res) => {
  try {
    const tags = await Tag.find();
    res.json(tags);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const obtenerTag = async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.idTag);
    if (!tag) {
      return res.status(404).json({ message: 'Etiqueta no encontrada' });
    }
    res.json(tag);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const actualizarTag = async (req, res) => {
  try {
    const tagActualizado = await Tag.findByIdAndUpdate(
      req.params.idTag,
      req.body,
      { new: true, runValidators: true },
    );
    if (!tagActualizado) {
      return res.status(404).json({ message: 'Etiqueta no encontrada' });
    }
    res.json(tagActualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const eliminarTag = async (req, res) => {
  try {
    const tagEliminado = await Tag.findByIdAndDelete(req.params.idTag);
    if (!tagEliminado) {
      return res.status(404).json({ message: 'Etiqueta no encontrada' });
    }
    await Post.updateMany({ tags: tagEliminado._id }, { $pull: { tags: tagEliminado._id } });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const asignarTagApost = async (req, res) => {
  try {
    const { idPost, idTag } = req.params;
    const post = await Post.findById(idPost);
    if (!post) {
      return res.status(404).json({ message: 'Publicación no encontrada' });
    }
    const tag = await Tag.findById(idTag);
    if (!tag) {
      return res.status(404).json({ message: 'Etiqueta no encontrada' });
    }
    const tieneTag = post.tags.some((tagId) => tagId.equals(tag._id));
    if (!tieneTag) {
      post.tags.push(tag._id);
      await post.save();
    }
    res.json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const quitarTagDePost = async (req, res) => {
  try {
    const { idPost, idTag } = req.params;
    const post = await Post.findById(idPost);
    if (!post) {
      return res.status(404).json({ message: 'Publicación no encontrada' });
    }
    post.tags = post.tags.filter((tagId) => !tagId.equals(idTag));
    await post.save();
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  crearTag,
  obtenerTags,
  obtenerTag,
  actualizarTag,
  eliminarTag,
  asignarTagApost,
  quitarTagDePost,
};
