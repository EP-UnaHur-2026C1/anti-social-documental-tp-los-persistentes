const Post = require('../models/postModel');
const PostImage = require('../models/postImageModel');

const crearPublicacion = async (req, res) => {
  try {
    const nuevoPost = await Post.create(req.body);
    res.status(201).json(nuevoPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const obtenerTodosLosPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'nickName email')
      .populate('tags', 'nombre')
      .populate('images', 'url');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const obtenerPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.idPost)
      .populate('author', 'nickName email')
      .populate('tags', 'nombre')
      .populate('images', 'url');
    if (!post) {
      return res.status(404).json({ message: 'Publicación no encontrada' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const actualizarDescripcionPost = async (req, res) => {
  try {
    const postActualizado = await Post.findByIdAndUpdate(
      req.params.idPost,
      req.body,
      { new: true, runValidators: true },
    );
    if (!postActualizado) {
      return res.status(404).json({ message: 'Publicación no encontrada' });
    }
    res.json(postActualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const eliminarPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.idPost);
    if (!post) {
      return res.status(404).json({ message: 'Publicación no encontrada' });
    }
    await PostImage.deleteMany({ post: post._id });
    await post.deleteOne();
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const agregarImagen = async (req, res) => {
  try {
    const post = await Post.findById(req.params.idPost);
    if (!post) {
      return res.status(404).json({ message: 'Publicación no encontrada' });
    }
    const nuevoImagen = await PostImage.create({ post: post._id, url: req.body.url });
    const yaExiste = post.images.some((imageId) => imageId.equals(nuevoImagen._id));
    if (!yaExiste) {
      post.images.push(nuevoImagen._id);
      await post.save();
    }
    res.status(201).json(nuevoImagen);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const eliminarImagen = async (req, res) => {
  try {
    const { idPost, idImage } = req.params;
    const post = await Post.findById(idPost);
    if (!post) {
      return res.status(404).json({ message: 'Publicación no encontrada' });
    }
    const imagen = await PostImage.findById(idImage);
    if (!imagen || !imagen.post.equals(post._id)) {
      return res.status(404).json({ message: 'Imagen no encontrada en esa publicación' });
    }
    post.images = post.images.filter((imageId) => !imageId.equals(imagen._id));
    await post.save();
    await imagen.deleteOne();
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  crearPublicacion,
  obtenerTodosLosPosts,
  obtenerPost,
  actualizarDescripcionPost,
  eliminarPost,
  agregarImagen,
  eliminarImagen,
};
