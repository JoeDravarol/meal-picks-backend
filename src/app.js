const config = require('./utils/config');
const express = require('express');
require('express-async-errors');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.use('/hello', (req, res) => {
  res.json('hello world');
});

module.exports = app;
