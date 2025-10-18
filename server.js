// server.js

// Cargar variables de entorno desde .env de forma explícita con ruta absoluta
require('dotenv').config({ path: 'C:/Users/PC/Downloads/CSE341-project3/.env' });

// Debug: verificar que dotenv carga correctamente
console.log('Directorio actual:', __dirname);
console.log('MONGODB_URI cargado:', process.env.MONGODB_URI);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Rutas
const destinationRoutes = require('./routes/destinations');
app.use('/api/destinations', destinationRoutes);

// Conexión a MongoDB
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ Falta MONGODB_URI en el archivo .env');
  process.exit(1); // detener el servidor si no hay URI
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
