const recipesRouter = require('express').Router();
const recipeScraper = require('recipe-scraper');

const Recipe = require('../models/recipe');
const { paginatedResults, userExtractor } = require('../utils/middleware');

recipesRouter.get('/', paginatedResults(Recipe), (req, res) => {
  res.json(res.paginatedResults);
});

recipesRouter.get('/:id', async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);

  res.json(recipe);
});

recipesRouter.post('/', async (req, res) => {
  const { url } = req.body;

  const scrapedRecipe = await recipeScraper(url);

  const recipe = new Recipe({ ...scrapedRecipe, url });
  const savedRecipe = await recipe.save();

  res.status(201).json(savedRecipe);
});

recipesRouter.post('/:id/favoriteRecipe', userExtractor, async (req, res) => {
  const user = req.user;
  const recipe = await Recipe.findById(req.params.id);

  user.favoriteRecipes = [...user.favoriteRecipes, recipe];
  await user.save();

  res.status(201).json(recipe);
});

recipesRouter.delete('/:id/favoriteRecipe', userExtractor, async (req, res) => {
  const user = req.user;
  const recipeId = req.params.id;

  user.favoriteRecipes = user.favoriteRecipes.filter(
    favoritedRecipeId => favoritedRecipeId.toString() !== recipeId
  );
  await user.save();

  res.status(204).end();
});

module.exports = recipesRouter;
