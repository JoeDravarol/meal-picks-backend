const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.post('/', async (req, res) => {
  const body = req.body;
  const uid = body.uid;

  const existingUser = await User.findOne({ uid }).exec();

  if (existingUser) {
    return res.json(existingUser);
  }

  const user = new User({
    uid,
    email: body.email,
    name: body.name,
    provider: body.provider,
    photoUrl: body.photoUrl,
  });

  const savedUser = await user.save();

  res.status(201).json(savedUser);
});

module.exports = usersRouter;
