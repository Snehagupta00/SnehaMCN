const express = require('express');
const router = express.Router();
const rewardController = require('../controllers/rewardController');
const { authenticateToken } = require('../middleware/auth');

router.get('/wallet', authenticateToken, rewardController.getWallet.bind(rewardController));
router.get('/history', authenticateToken, rewardController.getRewardHistory.bind(rewardController));

module.exports = router;
