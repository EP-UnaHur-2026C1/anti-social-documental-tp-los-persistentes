const mongoose = require('mongoose'); // importo mongoose para poder crear el esquema de usuario

const userSchema = new mongoose.Schema({
    nickName: { type: String, required: true, unique: true, trim: true }, // el nickname
    name: { type: String, trim: true }, // el nombre del usuario
    email: { type: String, trim: true }, // el correo electrónico
    password: { type: String }, // la contraseña
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // los usuarios que siguen al usuario
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // los usuarios que sigue el usuario
}, {
    timestamps: true, // agrega automáticamente los campos createdAt y updatedAt
    strict: true, // aseguro que solo se guarden los campos definidos en el esquema
    toJSON: { // configuro la forma en que se devuelve el objeto JSON
        virtuals: true,
        transform: (_, ret) => {
            ret.id = ret._id
            delete ret._id
            delete ret.__v
        }
    }
});

const User = mongoose.model('User', userSchema); // creo el modelo de usuario a partir del esquema definido

module.exports = User; // exporto el modelo de usuario para poder usarlo en otros archivos