const mongoose = require('mongoose')

const postimageSchema = new mongoose.Schema({ // defino el esquema de las imágenes de los posts
    idPost: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true }, // el post al que pertenece la imagen
    imageUrl: { type: String, required: true, unique: true }, // la URL de la imagen. el unique es para asegurar que no se repitan imágenes en la base de datos
}, {
    strict: true,
    toJSON: {
        virtuals: true,
        transform: (_, ret) => {
            ret.id = ret._id
            delete ret._id
            delete ret.__v
        }
    }
})


const PostImage = mongoose.model('PostImage', postimageSchema) // creo el modelo de las imágenes de los posts

module.exports = PostImage; // exporto el modelo de las imágenes de los posts para poder usarlo en otros archivos