const mongoose = require('mongoose');

const mealPlanSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  recipes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recipe',
    },
  ],
});

mealPlanSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('MealPlan', mealPlanSchema);
