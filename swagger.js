// swagger.js
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Travel API',
      version: '1.0.0',
      description: 'API for managing travel destinations, user reviews, users, and bookings',
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
          required: ['name', 'country', 'price'],
          properties: {
            _id: { type: 'string', description: 'MongoDB auto-generated ID', example: '67124be4cabc12345a6789d0', readOnly: true },
            name: { type: 'string', description: 'Destination name', example: 'Quito' },
            country: { type: 'string', description: 'Country where the destination is located', example: 'Ecuador' },
            price: { type: 'number', description: 'Price of visiting the destination', example: 50 },
            description: { type: 'string', description: 'Short description of the destination', example: 'Capital city of Ecuador surrounded by mountains.' },
          },
        },
        Review: {
          type: 'object',
          required: ['destinationId', 'reviewerName', 'rating'],
          properties: {
            _id: { type: 'string', description: 'MongoDB auto-generated ID', example: '67124be4cabc12345a6789d1', readOnly: true },
            destinationId: { type: 'string', description: 'ID of the destination being reviewed', example: '67124be4cabc12345a6789d0' },
            reviewerName: { type: 'string', description: 'Name of the reviewer', example: 'Danny Alonzo' },
            rating: { type: 'integer', description: 'Rating of the destination (1 to 5)', example: 5 },
            comment: { type: 'string', description: 'User’s written feedback', example: 'A beautiful place with rich culture and friendly people.' },
            date: { type: 'string', format: 'date-time', description: 'Date when the review was created', example: '2025-10-18T03:45:00Z' },
          },
        },
        User: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            _id: { type: 'string', description: 'MongoDB ID', example: '67124be4cabc12345a6789d2', readOnly: true },
            name: { type: 'string', description: 'Full name of the user', example: 'Danny Alonzo' },
            email: { type: 'string', description: 'User email', example: 'danny@test.com' },
            password: { type: 'string', description: 'User password', example: 'hashedpassword123' },
            role: { type: 'string', description: 'User role', example: 'user' },
          },
        },
        Booking: {
          type: 'object',
          required: ['userId', 'destinationId', 'startDate', 'endDate'],
          properties: {
            _id: { type: 'string', description: 'MongoDB ID', example: '67124be4cabc12345a6789d3', readOnly: true },
            userId: { type: 'string', description: 'ID of the user who booked', example: '67124be4cabc12345a6789d2' },
            destinationId: { type: 'string', description: 'ID of the booked destination', example: '67124be4cabc12345a6789d0' },
            startDate: { type: 'string', format: 'date-time', description: 'Start date of the booking', example: '2025-11-01T00:00:00Z' },
            endDate: { type: 'string', format: 'date-time', description: 'End date of the booking', example: '2025-11-07T00:00:00Z' },
            status: { type: 'string', description: 'Booking status', example: 'confirmed' },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js'], // reads swagger comments from routes
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = function (app) {
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      swaggerOptions: {
        oauth2RedirectUrl: process.env.GITHUB_CALLBACK_URL,
        oauth: {
          clientId: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
          appName: 'Travel API',
        },
      },
    })
  );
};
