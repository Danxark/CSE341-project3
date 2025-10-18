require('dotenv').config({ path: 'C:/Users/PC/Downloads/CSE341-project3/.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Verificar entorno
console.log('Directorio actual:', __dirname);
console.log('MONGODB_URI cargado:', process.env.MONGODB_URI);

// ✅ Conexión a MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB correctamente');
  })
  .catch((error) => {
    console.error('❌ Error de conexión a MongoDB:', error.message);
  });

// ✅ Rutas
const destinationRoutes = require('./routes/destinations');
const reviewRoutes = require('./routes/reviews');

app.use('/api/destinations', destinationRoutes);
app.use('/api/reviews', reviewRoutes);

// ✅ Swagger (documentación)
const setupSwagger = require('./swagger');
setupSwagger(app);

// ✅ Ruta base
app.get('/', (req, res) => {
  res.send('🌍 Bienvenido a la API de Travel Destinations con Reviews');
});

// ✅ Servidor
app.listen(PORT, () => {
  console.log(`🌐 Servidor corriendo en el puerto ${PORT}`);
});
