const redis = require("redis");

const DEFAULT_PASSWORD = process.env.REDIS_PASSWORD || "123456"; 
const DEFAULT_URL = `redis://:${DEFAULT_PASSWORD}@localhost:6379`;

const redisClient = redis.createClient({
  url: process.env.REDIS_URL ?? DEFAULT_URL,
  connectTimeout: 10000, // 10 segundos de tiempo de espera máximo
});

// Eventos para monitorear el estado en la consola
redisClient.on("error", (err) => console.log("Redis Client Error", err));
redisClient.on("connect", () => console.log("Redis Client conectado OK"));

// Autoejecutable asíncrono para iniciar la conexión
(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.error('Fallo al conectar con Redis:', err);
  }
})();

module.exports = redisClient;