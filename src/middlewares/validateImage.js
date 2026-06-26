const { createImageSchema, updateImageSchema } = require('../schemas/imageSchema'); // importo los esquemas de validación para las imágenes
const PostImage = require('../models/postimage.model'); // importo el modelo de PostImage para poder consultar la base de datos y verificar si una imagen ya existe
const Post = require('../models/post.model'); // importo el modelo de Post para poder consultar la base de datos y verificar si un post existe

const validarImagen = (req, res, next) => {
  if (!req.body.idPost && req.params.idPost) { // si no se proporciona idPost en el cuerpo de la solicitud pero sí en los parámetros, lo asigno al cuerpo para que pase la validación
    req.body.idPost = req.params.idPost;
  }

  const { error, value } = createImageSchema.validate(req.body, { abortEarly: false, stripUnknown: true }); // valido el cuerpo de la solicitud contra el esquema de validación definido en createImageSchema
  
  if (error) {
    const mensajes = error.details.map((err) => err.message);
    return res.status(400).json({ errors: mensajes });
  }
  req.body = value;
  next();
};

const validarActualizacionImagen = (req, res, next) => {
  const { error, value } = updateImageSchema.validate(req.body, { abortEarly: false, stripUnknown: true });

  if (error) {
    const mensajes = error.details.map((err) => err.message);
    return res.status(400).json({ errors: mensajes });
  }

  req.body = value;
  next();
};

const validarPostExistente = async (req, res, next) => {
  try {
    const { idPost } = req.body;
    const post = await Post.findById(idPost); // busco el post en la base de datos por su id
    if (!post) {
      return res.status(404).json({ error: "El post asociado no existe" });
    }
    req.post = post;
    next();
  } catch (err) {
    res.status(500).json({ error: "Error al verificar el post" });
  }
};

const validarImagenDuplicada = async (req, res, next) => {
  try {
    const { imageUrls } = req.body; // obtengo el array de URLs de las imágenes desde el cuerpo de la solicitud

    for (const url of imageUrls) { // itero sobre cada URL de imagen para verificar si ya existe en la base de datos
      const imagenExistente = await PostImage.findOne({ imageUrl: url });
      if (imagenExistente) {
        return res.status(400).json({ error: `Ya existe una imagen con la URL: ${url}` });
      }
    }

    next();
  } catch (err) {
    res.status(500).json({ error: "Error al verificar las imágenes" });
  }
};

module.exports = { // exporto los middlewares de validación para poder usarlos en las rutas
  validarImagen,
  validarActualizacionImagen,
  validarPostExistente,
  validarImagenDuplicada,
};