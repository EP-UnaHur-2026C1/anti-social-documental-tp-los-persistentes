const mongoose = require('mongoose');

const userSchema = new mongoose.Schema( // defino el esquema de los usuarios
  {
    nickName: { type: String, required: true, unique: true, trim: true },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, trim: true }, // la contraseña del usuario. el required es para asegurar que no se creen usuarios sin contraseña
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // array de ObjectId que hace referencia a otros usuarios que siguen a este usuario. relacion muchos a muchos entre usuarios. un usuario puede tener muchos seguidores y un usuario puede seguir a muchos usuarios
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // array de ObjectId que hace referencia a otros usuarios a los que este usuario sigue.
  },
  {
    timestamps: true,
    strict: true,
    toJSON: {
      virtuals: true,
      transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

const User = mongoose.model('User', userSchema); // creo el modelo de los usuarios a partir del esquema definido

module.exports = { User }; // exporto el modelo de los usuarios para poder usarlo en otros archivos
