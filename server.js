require('dotenv').config({ path: './.env' });
const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const destinationRoutes = require('./routes/destinations');
const reviewRoutes = require('./routes/reviews');
const ensureAuthenticated = require('./middleware/auth'); // placeholder for OAuth

const app = express();
app.use(express.json());

// --- MongoDB connection ---
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Conectado a MongoDB correctamente'))
  .catch(err => console.error('❌ Error de conexión a MongoDB:', err));

// --- Swagger setup ---
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Travel API',
      version: '1.0.0',
      description: 'API para gestionar destinos y reseñas',
    },
    servers: [
      {
        url: 'https://cse341-project3-6ymh.onrender.com',
      },
    ],
    components: {
      securitySchemes: {
        githubAuth: {
          type: 'oauth2',
          flows: {
            authorizationCode: {
              authorizationUrl: 'https://github.com/login/oauth/authorize',
              tokenUrl: 'https://github.com/login/oauth/access_token',
              scopes: {},
            },
          },
        },
      },
      schemas: {
        Destination: {
          type: 'object',
          required: ['name', 'location', 'price'],
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            location: { type: 'string' },
            price: { type: 'number' },
            description: { type: 'string' },
          },
        },
        Review: {
          type: 'object',
          required: ['destinationId', 'reviewerName', 'rating'],
          properties: {
            _id: { type: 'string' },
            destinationId: { type: 'string' },
            reviewerName: { type: 'string' },
            rating: { type: 'number' },
            comment: { type: 'string' },
            date: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js'], // point to your route files
};

const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --- Routes ---
app.use('/api/destinations', destinationRoutes);
app.use('/api/reviews', reviewRoutes);

// --- Default route ---
app.get('/', (req, res) => {
  res.send('Welcome to Travel API!');
});

// --- Server start ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🌐 Servidor corriendo en el puerto ${PORT}`));
