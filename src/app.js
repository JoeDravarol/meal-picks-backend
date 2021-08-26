const express = require('express');
require('express-async-errors');
const cors = require('cors');
const mongoose = require('mongoose');

const config = require('./utils/config');
const logger = require('./utils/logger');
const app = express();
const recipesRouter = require('./controllers/recipes');
const favoriteRecipesRouter = require('./controllers/favoriteRecipes');
const usersRouter = require('./controllers/users');
const mealPlansRouter = require('./controllers/mealPlans');
const middleware = require('./utils/middleware');

mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch(error => {
    logger.error('error connecting to MongoDB:', error.message);
  });

app.use(cors());
app.use(express.json());
app.use(middleware.tokenExtractor);

app.use('/api/recipes', recipesRouter);
app.use('/api/favoriteRecipes', favoriteRecipesRouter);
app.use('/api/users', usersRouter);
app.use('/api/mealPlans', mealPlansRouter);

app.use(middleware.errorHandler);

module.exports = app;
