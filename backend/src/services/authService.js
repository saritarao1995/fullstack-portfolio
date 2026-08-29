const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { env } = require('../config/env');
const { User } = require('../models/User');
const { AppError } = require('../utils/AppError');

const signToken = (user) =>
  jwt.sign({ sub: user.id, role: user.role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

const seedAdmin = async () => {
  const existing = await User.findOne({ email: env.admin.email });
  if (existing) return existing;

  const passwordHash = await bcrypt.hash(env.admin.password, 12);

  return User.create({
    name: env.admin.name,
    email: env.admin.email,
    passwordHash,
    walletAddress: env.admin.wallet,
  });
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+passwordHash');

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password.', 401);
  }

  return { token: signToken(user), user: user.toSafeJSON() };
};

const updateProfile = async (user, { name, walletAddress }) => {
  if (name) user.name = name.trim();
  if (walletAddress !== undefined) user.walletAddress = walletAddress.trim();
  await user.save();

  return user.toSafeJSON();
};

module.exports = { seedAdmin, login, updateProfile };
