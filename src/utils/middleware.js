const logger = require('./logger');
const admin = require('../lib/firebase-admin');

const errorHandler = (error, req, res, next) => {
  logger.error(error.message);

  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  } else if (error.name === 'CastError') {
    return res.status(400).json({ error: 'malformatted id' });
  }

  next(error);
};

const paginatedResults = model => {
  return async (req, res, next) => {
    const limit = parseInt(req.query.limit) || 10;
    const documentsCount = await model.countDocuments().exec();
    const totalPage = Math.ceil(documentsCount / limit);
    let page = parseInt(req.query.page) || 1;

    // Handling edge case
    if (page < 1) {
      page = 1;
    } else if (page > totalPage) {
      page = totalPage;
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {
      totalPage,
    };

    if (endIndex < documentsCount) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
      };
    }

    results.results = await model.find().limit(limit).skip(startIndex).exec();
    res.paginatedResults = results;
    next();
  };
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization');

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.token = authorization.substring(7);
  } else {
    req.token = null;
  }

  next();
};

const userExtractor = async (req, res, next) => {
  const decodedToken = await admin.auth.verifyIdToken(req.token);

  if (!req.token || !decodedToken.uid) {
    return res.status(401).json({
      error: 'Invalid or missing token',
    });
  }

  req.user = decodedToken;
  next();
};

module.exports = {
  errorHandler,
  paginatedResults,
  tokenExtractor,
  userExtractor,
};
