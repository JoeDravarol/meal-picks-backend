const recipesRouter = require('express').Router();

const Recipe = require('../models/recipe');
const {
  paginatedResults,
  userExtractor,
  upload,
} = require('../utils/middleware');
const cloudinary = require('../utils/cloudinary');

recipesRouter.get('/', paginatedResults(Recipe), (req, res) => {
  res.json(res.paginatedResults);
});

recipesRouter.get('/:id', async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);

  res.json(recipe);
});

recipesRouter.post(
  '/',
  [userExtractor, upload.single('file')],
  async (req, res) => {
    const {
      name,
      description,
      ingredients,
      instructions,
      tags,
      time,
      servings,
      url,
    } = req.body;
    // Upload image to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    const recipe = new Recipe({
      url,
      name,
      description,
      tags,
      servings,
      time: JSON.parse(time),
      ingredients: JSON.parse(ingredients),
      instructions: JSON.parse(instructions),
      image: result.secure_url,
      cloudinaryId: result.public_id,
      user: req.user._id,
    });

    const savedRecipe = await recipe.save();

    res.status(201).json(savedRecipe);
  }
);

module.exports = recipesRouter;
