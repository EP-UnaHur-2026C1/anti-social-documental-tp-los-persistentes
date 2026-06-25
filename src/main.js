console.log("UnaHur - Anti-Social net prueba");

const express = require("express");
const dotenv = require("dotenv");

const conectarDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const tagRoutes = require("./routes/tagRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const followerRoutes = require("./routes/followerRoutes");

dotenv.config();

conectarDB();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API de UnaHur - Anti-Social net funcionando correctamente");
});

app.use("/users", userRoutes);
app.use("/tags", tagRoutes);
app.use("/posts", postRoutes);
app.use("/comments", commentRoutes);
app.use("/followers", followerRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
