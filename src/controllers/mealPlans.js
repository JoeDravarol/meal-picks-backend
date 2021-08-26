const mealPlansRouter = require('express').Router();

const MealPlan = require('../models/mealPlan');
const Recipe = require('../models/recipe');
const { userExtractor } = require('../utils/middleware');

mealPlansRouter.get('/', userExtractor, async (req, res) => {
  const user = await req.user
    .populate({
      path: 'mealPlans',
      populate: { path: 'recipes' },
    })
    .execPopulate();
  const mealPlans = user.mealPlans;

  res.json(mealPlans);
});

mealPlansRouter.post('/', userExtractor, async (req, res) => {
  const body = req.body;
  const user = req.user;
  const recipe = await Recipe.findById(body.recipeId);

  if (!recipe) {
    return res.status(400).json({
      error: 'Malformatted recipe id',
    });
  }

  const mealPlan = new MealPlan({
    date: body.date,
    recipes: [recipe],
  });

  const savedMealPlan = await mealPlan.save();
  await savedMealPlan.populate('recipes');
  user.mealPlans = [...user.mealPlans, mealPlan];
  await user.save();

  res.status(201).json(savedMealPlan);
});

// Trust that the client has send the recipes as ids
mealPlansRouter.put('/:id', userExtractor, async (req, res) => {
  const mealPlan = req.body;

  const updatedMealPlan = await MealPlan.findByIdAndUpdate(
    req.params.id,
    mealPlan,
    { new: true }
  );
  await updatedMealPlan.populate('recipes').execPopulate();
  res.json(updatedMealPlan);
});

module.exports = mealPlansRouter;
