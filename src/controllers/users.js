const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');
const { userExtractor } = require('../utils/middleware');

usersRouter.get('/me', userExtractor, (req, res) => {
  const user = {
    ...req.user,
    expiresIn: req.user.expiresIn,
  };

  res.json(user);
});

usersRouter.get('/:uid', async (req, res) => {
  const user = await User.findOne({ uid: req.params.uid });

  res.json(user);
});

usersRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body;

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({
      error: 'username must be unique',
    });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
    favoriteRecipes: [],
    mealPlans: [],
  });

  const savedUser = await user.save();

  res.status(201).json(savedUser);
});

module.exports = usersRouter;
