const jwt = require('jsonwebtoken');
const { env } = require('../config/env');
const { User } = require('../models/User');
const { AppError } = require('../utils/AppError');
const { asyncHandler } = require('../utils/asyncHandler');

const auth = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || '';
  const [, token] = header.split(' ');

  if (!token) throw new AppError('Authentication required.', 401);

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(payload.sub);

    if (!user) throw new AppError('Account no longer exists.', 401);

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Invalid or expired token.', 401);
  }
});

module.exports = { auth };
