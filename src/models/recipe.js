const mongoose = require('mongoose');

// Schema may changes if recipeScraper changes it's recipe format https://github.com/jadkins89/Recipe-Scraper
const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  ingredients: [
    {
      type: String,
      required: true,
    },
  ],
  instructions: [
    {
      type: String,
      required: true,
    },
  ],
  tags: [String],
  time: {
    prep: String,
    cook: String,
    active: String,
    inactive: String,
    ready: String,
    total: String,
  },
  servings: String,
  image: String,
  url: String,
});

recipeSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Recipe', recipeSchema);
