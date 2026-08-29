const { asyncHandler } = require('../utils/asyncHandler');
const certificateService = require('../services/certificateService');

const stats = asyncHandler(async (_req, res) => {
  const data = await certificateService.dashboardStats();
  res.json(data);
});

const list = asyncHandler(async (req, res) => {
  const items = await certificateService.listTransactions(req.query);
  res.json({ items });
});

const getOne = asyncHandler(async (req, res) => {
  const transaction = await certificateService.getTransaction(req.params.hash);
  res.json({ transaction });
});

module.exports = { stats, list, getOne };
