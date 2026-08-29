const { env } = require('../config/env');
const { AppError } = require('../utils/AppError');

const notFound = (req, _res, next) => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
};

const errorHandler = (error, _req, res, _next) => {
  const statusCode = error.statusCode || 500;
  const body = {
    message: statusCode === 500 ? 'Internal server error.' : error.message,
  };

  if (error.details) body.details = error.details;
  if (env.nodeEnv !== 'production' && statusCode === 500) body.stack = error.stack;

  if (statusCode === 500 && env.nodeEnv !== 'test') {
    console.error(error);
  }

  res.status(statusCode).json(body);
};

module.exports = { notFound, errorHandler };
