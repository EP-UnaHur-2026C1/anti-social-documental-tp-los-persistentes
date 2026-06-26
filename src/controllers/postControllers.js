const Post = require("../models/post.model");
const PostImage = require("../models/postimage.model");
const Comment = require("../models/comment.model");
const Tag = require("../models/tag.model");
const redisClient = require("../../config/redisClient");

const ANTIGUEDAD_MESES = parseInt(process.env.ANTIGUEDAD_VIBILIDAD_COMENTARIOS, 10) || 6;

// CREAR PUBLICACIÓN
const crearPublicacion = async (req, res) => { 
  const { idUser, description, imageUrls } = req.body;
  try {
    const nuevaPublicacion = await Post.create({ idUser, description });
    
    if (imageUrls && imageUrls.length > 0) {
      const imagenes = imageUrls.map((url) => ({
        idPost: nuevaPublicacion._id,
        imageUrl: url,
      }));

      const resultados = await PostImage.insertMany(imagenes);
      const idsImagenes = resultados.map(img => img._id);
      
      nuevaPublicacion.imagen.push(...idsImagenes);
      await nuevaPublicacion.save();
    }

    const postCompleto = await Post.findById(nuevaPublicacion._id)
      .populate({ path: "idUser", select: "nickName _id" })
      .populate({ path: "imagen", select: "imageUrl" })
      .populate({ path: "tags", select: "name" });

    // Invalidamos la caché de la lista de publicaciones
    await redisClient.del("posts:all");

    res.status(201).json(postCompleto);
  } catch (error) {
    res.status(500).json({
      message: "Error al crear la publicación.",
      error: error.message,
    });
  }
};

// OBTENER TODAS LAS PUBLICACIONES (Con caché en Redis)
const obtenerTodosLosPosts = async (req, res) => {
  const cacheKey = "posts:all";
  try {
    const cachedPosts = await redisClient.get(cacheKey);
    if (cachedPosts) {
      return res.status(200).json(JSON.parse(cachedPosts));
    }

    const publicaciones = await Post.find()
      .populate({ path: "idUser", select: "nickName _id" })
      .populate({ path: "imagen", select: "imageUrl" })
      .populate({ path: "tags", select: "name" })
      .sort({ createdAt: -1 });

    // Guardamos en caché por 5 minutos
    await redisClient.set(cacheKey, JSON.stringify(publicaciones), { EX: 300 });

    res.status(200).json(publicaciones);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener la lista de publicaciones.",
      error: error.message,
    });
  }
};

// OBTENER UNA PUBLICACIÓN POR ID (Filtro temporal de comentarios + Caché individual)
const obtenerPost = async (req, res) => {
  const { idPost } = req.params;
  const cacheKey = `post:${idPost}`;

  try {
    const cachedPost = await redisClient.get(cacheKey);
    if (cachedPost) {
      return res.status(200).json(JSON.parse(cachedPost));
    }

    const post = await Post.findById(idPost)
      .populate({ path: "idUser", select: "nickName _id" })
      .populate({ path: "imagen", select: "imageUrl" })
      .populate({ path: "tags", select: "name" });

    if (!post) {
      return res.status(404).json({ error: `Post con ID ${idPost} no encontrado` });
    }

    const fechaUmbral = new Date();
    fechaUmbral.setMonth(fechaUmbral.getMonth() - ANTIGUEDAD_MESES);
    
    const comentariosVisibles = await Comment.find({
      idPost,
      createdAt: { $gte: fechaUmbral },
    })
      .populate({ path: "idUser", select: "nickName _id" })
      .sort({ createdAt: -1 });

    const postConComentarios = {
      ...post.toJSON(),
      Comments: comentariosVisibles,
    };

    // Almacenamos en Redis el post completo con sus comentarios filtrados
    await redisClient.set(cacheKey, JSON.stringify(postConComentarios), { EX: 60 });

    res.status(200).json(postConComentarios);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener la publicación.",
      error: error.message,
    });
  }
};

// ACTUALIZAR PUBLICACIÓN
const actualizarDescripcionPost = async (req, res) => {
  const { idPost } = req.params;
  const { description } = req.body;

  try {
    const postActualizado = await Post.findByIdAndUpdate(
      idPost,
      { description },
      { new: true, runValidators: true } 
    )
      .populate({ path: "idUser", select: "nickName _id" })
      .populate({ path: "imagen", select: "imageUrl" })
      .populate({ path: "tags", select: "name" });
    
    // Limpiamos caché global e individual
    await redisClient.del("posts:all");
    await redisClient.del(`post:${idPost}`);

    res.status(200).json(postActualizado);
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar la publicación.",
      error: error.message,
    });
  }
};

// ELIMINAR PUBLICACIÓN
const eliminarPost = async (req, res) => {
  const { idPost } = req.params;
  try {
    await Post.findByIdAndDelete(idPost);
    
    // Limpiamos la caché
    await redisClient.del("posts:all");
    await redisClient.del(`post:${idPost}`);

    res.status(200).json({ message: `Post ID: ${idPost} eliminado correctamente.` });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar la publicación.",
      error: error.message,
    });
  }
};

// AGREGAR IMÁGENES
const agregarImagen = async (req, res) => {
  const { idPost } = req.params;
  const { imageUrls } = req.body;
  
  try {
    const post = await Post.findById(idPost);
    if (!post) return res.status(404).json({ error: "Post no encontrado" });

    const imagenesExistentes = await PostImage.find({ idPost });
    const urlsExistentes = imagenesExistentes.map((img) => img.imageUrl);

    const nuevasImagenes = imageUrls
      .filter((url) => !urlsExistentes.includes(url))
      .map((url) => ({
        idPost,
        imageUrl: url,
      }));

    if (nuevasImagenes.length === 0) {
      return res.status(409).json({ message: "Todas las URLs ya existen en la base de datos." });
    }

    const resultados = await PostImage.insertMany(nuevasImagenes);
    post.imagen.push(...resultados.map(img => img._id));
    await post.save();

    await redisClient.del("posts:all");
    await redisClient.del(`post:${idPost}`);

    res.status(201).json({
      message: "Imágenes agregadas correctamente.",
      agregadas: resultados.length,
      imagenes: resultados,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al agregar imágenes.",
      error: error.message,
    });
  }
};

// ELIMINAR IMAGEN
const eliminarImagen = async (req, res) => {
  const { idPost, idImage } = req.params;
  try {
    const post = await Post.findById(idPost);
    if (!post) return res.status(404).json({ error: "Post no encontrado" });

    await PostImage.deleteOne({ _id: idImage, idPost });
    post.imagen = post.imagen.filter(imgId => imgId.toString() !== idImage);
    await post.save();

    await redisClient.del("posts:all");
    await redisClient.del(`post:${idPost}`);

    res.status(200).json({ message: `Imagen ID: ${idImage} eliminada correctamente.` });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la imagen.", error: error.message });
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