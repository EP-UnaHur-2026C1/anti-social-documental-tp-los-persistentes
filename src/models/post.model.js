const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({ // defino el esquema de los posts
	idUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // el usuario que crea el post
	description: { type: String, required: true, trim: true }, // la descripción del post
	tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }], //array de tags. ref sirve para la relacion muchos a muchos entre tags y posts. un tag puede estar en muchos posts y un post puede tener muchos tags
	imagen: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PostImage' }] // array de imágenes. relacion muchos a muchos entre imágenes y posts. una imagen puede estar en muchos posts y un post puede tener muchas imágenes
}, {
	timestamps: true,
	strict: true,
	toJSON: {
		virtuals: true,
		transform: (_, ret) => {
			ret.id = ret._id
			delete ret._id
			delete ret.__v
		}
	}
});

const Post = mongoose.model('Post', postSchema); // creo el modelo de los posts a partir del esquema definido

module.exports = Post; // exporto el modelo de los posts para poder usarlo en otros archivos

