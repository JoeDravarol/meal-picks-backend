const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../utils/config');
const loginRouter = require('express').Router();
const User = require('../models/user');

loginRouter.post('/', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  // prettier-ignore
  const passwordCorrect = user === null 
    ? false 
    : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'invalid username or password',
    });
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  };

  // token expires in 120*60 seconds, that is, in two hour
  // prettier-ignore
  const token = jwt.sign(
    userForToken,
    config.SECRET,
    { expiresIn: 120*60 }
  )

  // prettier-ignore
  res
    .status(200)
    .send({ token, username: user.username, name: user.name });
});

module.exports = loginRouter;
