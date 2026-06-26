require('dotenv').config(); 

console.log("UnaHur - Anti-Social net prueba");

const express = require('express');
const mongoose = require('mongoose');
const app = express();

// COMENTAMOS SWAGGER TEMPORALMENTE PARA QUE NO CORTE EL ARRANQUE
// const swaggerUi = require('swagger-ui-express');
// const YAML = require('yamljs');
// const swaggerDocument = YAML.load('./doc/swagger.yaml');
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// --- Middlewares Globales ---
app.use(express.json());

// --- Importación de Rutas ---
const userRoutes = require('./routes/userRoutes');
const tagRouter = require('./routes/tagRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const followerRoutes = require('./routes/followerRoutes');

// --- Registro de Rutas ---
app.use('/user', userRoutes);
app.use('/post', postRoutes);
app.use('/tag', tagRouter);
app.use('/comment', commentRoutes);
app.use('/followers', followerRoutes);

// --- Configuración de Puertos y Conexiones ---
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/tienda';

// Conexión a MongoDB (Docker)
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("Conectado a MongoDB correctamente");
  })
  .catch((err) => {
    console.error("Error conectando a MongoDB:", err);
  });

// Encendemos el servidor de Express
app.listen(PORT, () => {
    console.log('Servidor corriendo de forma permanente en el puerto ' + PORT);
});