const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({ // defino el esquema de los comentarios
    idPost: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true }, // el post al que pertenece el comentario
    idUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // el usuario que crea el comentario
    content: { type: String, required: true, trim: true}, // el contenido del comentario
    
}, {
    timestamps:true,
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


const Comment = mongoose.model('Comment', commentSchema) // creo el modelo de los comentarios a partir del esquema definido

module.exports = Comment; // exporto el modelo de los comentarios para poder usarlo en otros archivos