const { asyncHandler } = require('../utils/asyncHandler');
const { AppError } = require('../utils/AppError');
const authService = require('../services/authService');

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) throw new AppError('Email and password are required.');

  const result = await authService.login({ email, password });
  res.json(result);
});

const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user.toSafeJSON() });
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await authService.updateProfile(req.user, req.body || {});
  res.json({ user });
});

module.exports = { login, me, updateProfile };
