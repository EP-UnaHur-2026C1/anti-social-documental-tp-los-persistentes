const Tag = require('../models/tag.model');
const Post = require('../models/post.model');
const redisClient = require('../../config/redisClient');

// CREAR ETIQUETA
const crearTag = async (req, res) => {
  const { name } = req.body; 
  try {
    const nuevoNombre = name.toLowerCase();
    const nuevaEtiqueta = await Tag.create({ name: nuevoNombre });

    await redisClient.del('tags:all');

    res.status(201).json(nuevaEtiqueta);
  } catch (error) {
    res.status(500).json({ message: 'Error interno al crear la etiqueta.', details: error.message });
  }
};

// OBTENER TODAS LAS ETIQUETAS
const obtenerTags = async (req, res) => {
  const cacheKey = 'tags:all';
  try {
    const cachedTags = await redisClient.get(cacheKey);
    if (cachedTags) {
      return res.status(200).json(JSON.parse(cachedTags));
    }

    const etiquetas = await Tag.find().sort({ name: 1 });
    await redisClient.set(cacheKey, JSON.stringify(etiquetas), { EX: 600 });

    res.status(200).json(etiquetas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las etiquetas.', details: error.message });
  }
};

// OBTENER UNA ETIQUETA POR ID
const obtenerTag = async (req, res) => {
  const { idTag } = req.params;
  const cacheKey = `tag:${idTag}`;
  try {
    const cachedTag = await redisClient.get(cacheKey);
    if (cachedTag) {
      return res.status(200).json(JSON.parse(cachedTag));
    }

    const tag = await Tag.findById(idTag).populate('posts', 'description idUser createdAt');
    if (!tag) {
      return res.status(404).json({ message: `Etiqueta con ID ${idTag} no encontrada.` });
    }

    await redisClient.set(cacheKey, JSON.stringify(tag), { EX: 300 });

    res.status(200).json(tag);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la etiqueta.', details: error.message });
  }
};

// ACTUALIZAR ETIQUETA
const actualizarTag = async (req, res) => {
  const { idTag } = req.params;
  const { name } = req.body;
  try {
    const nuevoNombre = name.toLowerCase();
    const tagActualizada = await Tag.findByIdAndUpdate(
      idTag,
      { name: nuevoNombre },
      { new: true, runValidators: true }
    );

    await redisClient.del('tags:all');
    await redisClient.del(`tag:${idTag}`);

    res.status(200).json(tagActualizada);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la etiqueta.', details: error.message });
  }
};

// ELIMINAR ETIQUETA
const eliminarTag = async (req, res) => {
  const { idTag } = req.params;
  try {
    const tagEliminada = await Tag.findByIdAndDelete(idTag);

    await redisClient.del('tags:all');
    await redisClient.del(`tag:${idTag}`);

    res.status(200).json({ message: `Etiqueta "${tagEliminada.name}" eliminada correctamente.` });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la etiqueta.', details: error.message });
  }
};

// ASIGNAR TAG A POST (Nombre adaptado al enrutador: asignarTagApost)
const asignarTagApost = async (req, res) => {
  const { idPost, idTag } = req.params;
  try {
    const post = await Post.findById(idPost);
    const tag = await Tag.findById(idTag);

    if (!post) return res.status(404).json({ message: 'Post no encontrado.' });
    if (!tag) return res.status(404).json({ message: 'Etiqueta no encontrada.' });

    if (!post.tags.includes(idTag)) post.tags.push(idTag);
    if (!tag.posts.includes(idPost)) tag.posts.push(idPost);

    await post.save();
    await tag.save();

    await redisClient.del('tags:all');
    await redisClient.del(`tag:${idTag}`);
    await redisClient.del('posts:all');
    await redisClient.del(`post:${idPost}`);

    res.status(200).json({ message: `Etiqueta '${tag.name}' vinculada al post de forma bidireccional.`, tag });
  } catch (error) {
    res.status(500).json({ message: 'Error al asociar la etiqueta al post.', details: error.message });
  }
};

// QUITAR TAG DE POST
const quitarTagDePost = async (req, res) => {
  const { idPost, idTag } = req.params;
  try {
    const post = await Post.findById(idPost);
    const tag = await Tag.findById(idTag);

    if (post) {
      post.tags = post.tags.filter(t => t.toString() !== idTag);
      await post.save();
    }
    if (tag) {
      tag.posts = tag.posts.filter(p => p.toString() !== idPost);
      await tag.save();
    }

    await redisClient.del('tags:all');
    await redisClient.del(`tag:${idTag}`);
    await redisClient.del('posts:all');
    await redisClient.del(`post:${idPost}`);

    res.status(200).json({ message: `Vínculo removido correctamente entre Post ${idPost} y Tag ${idTag}.` });
  } catch (error) {
    res.status(500).json({ message: 'Error al desasociar la etiqueta.', details: error.message });
  }
};

module.exports = {
  crearTag,
  obtenerTag,
  obtenerTags,
  actualizarTag,
  eliminarTag,
  asignarTagApost, 
  quitarTagDePost  
};