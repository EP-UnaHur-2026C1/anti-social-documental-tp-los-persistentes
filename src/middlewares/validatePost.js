const { createPostSchema, updatePostSchema } = require('../schemas/postSchema'); // importo los esquemas de validación para los posts
const Post = require('../models/post.model'); // importo el modelo de Post para poder consultar la base de datos y verificar si un post existe o si la descripción es única

const validarCreacionPost = (req, res, next) => {
    const { error, value } = createPostSchema.validate(req.body, { abortEarly: false, stripUnknown: true }); // valido el cuerpo de la solicitud contra el esquema de validación definido en createPostSchema

    if (error) {
        const mensajes = error.details.map((err) => err.message);
        return res.status(400).json({ errors: mensajes });
    }

    req.body = value;
    next();
};

const validarActualizacionPost = (req, res, next) => {
    const { error, value } = updatePostSchema.validate(req.body, { abortEarly: false, stripUnknown: true }); // valido el cuerpo de la solicitud contra el esquema de validación definido en updatePostSchema

    if (error) {
        const mensajes = error.details.map((err) => err.message);
        return res.status(400).json({ errors: mensajes });
    }

    req.body = value;
    next();
};

const validarDescripcionUnica = async (req, res, next) => {
    const { description } = req.body;

    try {
        const postExistente = await Post.findOne({ description }); // busco en la base de datos si ya existe un post con la misma descripción
        if (postExistente) {
            return res.status(400).json({ error: 'Ya existe un post con esa descripción' });
        }
        next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al verificar la descripción del post' });
    }
};

const validarPostExistente = async (req, res, next) => {
    const { idPost } = req.params;

    try {
        const post = await Post.findById(idPost); // busco el post en la base de datos por su id
        if (!post) {
            return res.status(404).json({ error: `Post con ID ${idPost} no encontrado` });
        }

        req.post = post;
        return next();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al verificar el post' });
    }
};

module.exports = { // exporto los middlewares de validación para poder usarlos en las rutas
    validarCreacionPost,
    validarActualizacionPost,
    validarDescripcionUnica,
    validarPostExistente,
    validateExistePost: validarPostExistente,
};