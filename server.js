// server.js

// Cargar variables de entorno desde .env
require('dotenv').config({ path: 'C:/Users/PC/Downloads/CSE341-project3/.env' });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const setupSwagger = require('./swagger'); // Swagger

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Debug dotenv
console.log('Directorio actual:', __dirname);
console.log('MONGODB_URI cargado:', process.env.MONGODB_URI);

// Rutas
const destinationRoutes = require('./routes/destinations');
const reviewRoutes = require('./routes/reviews');

app.use('/api/destinations', destinationRoutes);
app.use('/api/reviews', reviewRoutes);

// Configurar Swagger
setupSwagger(app);

// Conexión a MongoDB
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ Falta MONGODB_URI en el archivo .env');
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('✅ Conectado a MongoDB correctamente'))
  .catch((err) => console.error('❌ Error de conexión a MongoDB:', err.message));

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 Servidor corriendo en el puerto ${PORT}`);
});
