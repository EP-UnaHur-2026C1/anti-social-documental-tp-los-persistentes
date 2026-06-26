const mongoose = require('mongoose')

const tagSchema = new mongoose.Schema({ // defino el esquema de los tags
    name: { type: String, required: true, unique: true, trim: true }, // el nombre del tag. el unique es para asegurar que no se repitan tags en la base de datos
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }] //array de posts. ref sirve para la relacion muchos a muchos entre tags y posts. un tag puede estar en muchos posts y un post puede tener muchos tags
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

const Tag = mongoose.model('Tag', tagSchema) // creo el modelo de los tags a partir del esquema definido

module.exports = Tag; // exporto el modelo de los tags para poder usarlo en otros archivos