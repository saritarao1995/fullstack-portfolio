const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.use(auth);
router.get('/stats', dashboardController.stats);
router.get('/transactions', dashboardController.list);
router.get('/transactions/:hash', dashboardController.getOne);

module.exports = router;
