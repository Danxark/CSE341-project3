require('dotenv').config({ path: './.env' });
const express = require('express');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

const destinationRoutes = require('./routes/destinations');
const reviewRoutes = require('./routes/reviews');

const app = express();
app.use(express.json());

// --- MongoDB connection ---
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Conectado a MongoDB correctamente'))
  .catch(err => console.error('❌ Error de conexión a MongoDB:', err));

// --- Session setup ---
app.use(
  session({
    secret: 'super-secret-key',
    resave: false,
    saveUninitialized: true,
  })
);

// --- Passport setup ---
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: 'https://cse341-project3-6ymh.onrender.com/auth/github/callback',
    },
    function (accessToken, refreshToken, profile, done) {
      // Here you could save user info to DB if needed
      return done(null, profile);
    }
  )
);

// --- GitHub OAuth routes ---
app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

app.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    // Redirect to Swagger docs after login
    res.redirect('/api-docs');
  }
);

// --- Auth middleware for protecting routes ---
function ensureLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: 'Unauthorized - please log in with GitHub' });
}

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
  apis: ['./routes/*.js'], // point to route files
};

const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --- Routes ---
// Protect POST/PUT routes with GitHub OAuth
app.use('/api/destinations', destinationRoutes);
app.use('/api/reviews', reviewRoutes);

// --- Default route ---
app.get('/', (req, res) => {
  res.send('Welcome to Travel API!');
});

// --- Server start ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🌐 Servidor corriendo en el puerto ${PORT}`));
