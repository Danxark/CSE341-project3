// swagger.js
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Travel API',
      version: '1.0.0',
      description: 'API for managing travel destinations and user reviews',
    },
    servers: [
      {
        url: 'https://cse341-project3-6ymh.onrender.com',
        description: 'Render Deployment',
      },
      {
        url: 'http://localhost:3000',
        description: 'Local Development',
      },
    ],
    components: {
      schemas: {
        Destination: {
          type: 'object',
          required: ['name', 'country', 'description'],
          properties: {
            _id: {
              type: 'string',
              description: 'MongoDB auto-generated ID',
              example: '67124be4cabc12345a6789d0',
            },
            name: {
              type: 'string',
              description: 'Destination name',
              example: 'Quito',
            },
            country: {
              type: 'string',
              description: 'Country where the destination is located',
              example: 'Ecuador',
            },
            description: {
              type: 'string',
              description: 'Short description of the destination',
              example: 'Capital city of Ecuador surrounded by mountains.',
            },
          },
        },
        Review: {
          type: 'object',
          required: ['destinationId', 'reviewerName', 'rating'],
          properties: {
            _id: {
              type: 'string',
              description: 'MongoDB auto-generated ID',
              example: '67124be4cabc12345a6789d1',
            },
            destinationId: {
              type: 'string',
              description: 'ID of the destination being reviewed',
              example: '67124be4cabc12345a6789d0',
            },
            reviewerName: {
              type: 'string',
              description: 'Name of the reviewer',
              example: 'Danny Alonzo',
            },
            rating: {
              type: 'integer',
              description: 'Rating of the destination (1 to 5)',
              example: 5,
            },
            comment: {
              type: 'string',
              description: 'User’s written feedback',
              example: 'A beautiful place with rich culture and friendly people.',
            },
            date: {
              type: 'string',
              format: 'date-time',
              description: 'Date when the review was created',
              example: '2025-10-18T03:45:00Z',
            },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js'], // reads swagger comments from routes
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = function (app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
