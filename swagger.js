// swagger.js
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Travel API",
      version: "1.0.0",
      description: "API para destinos turísticos",
    },
    servers: [
      {
        url: "http://localhost:3000", // Cambiar después por URL de Render
      },
    ],
  },
  apis: ["./routes/*.js"], // Lee los comentarios de tus rutas
};

const specs = swaggerJsdoc(options);

function setupSwagger(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
}

module.exports = setupSwagger;
