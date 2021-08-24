const favoriteRecipesRouter = require('express').Router();

const Recipe = require('../models/recipe');
const { userExtractor } = require('../utils/middleware');

favoriteRecipesRouter.get('/', userExtractor, async (req, res) => {
  const user = await req.user.populate('favoriteRecipes').execPopulate();
  const recipes = user.favoriteRecipes;

  res.json(recipes);
});

favoriteRecipesRouter.post('/', userExtractor, async (req, res) => {
  const user = req.user;
  const body = req.body;
  const recipe = await Recipe.findById(body.recipeId);

  user.favoriteRecipes = [...user.favoriteRecipes, recipe];
  await user.save();

  res.status(201).json(recipe);
});

favoriteRecipesRouter.delete('/:id', userExtractor, async (req, res) => {
  const user = req.user;
  const recipeId = req.params.id;

  user.favoriteRecipes = user.favoriteRecipes.filter(
    favoritedRecipeId => favoritedRecipeId.toString() !== recipeId
  );
  await user.save();

  res.status(204).end();
});

module.exports = favoriteRecipesRouter;
