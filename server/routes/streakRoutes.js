const express = require('express');
const router = express.Router();
const streakController = require('../controllers/streakController');
const { authenticateToken } = require('../middleware/auth');

router.get('/current', authenticateToken, streakController.getCurrentStreak.bind(streakController));
router.get('/leaderboard', authenticateToken, streakController.getLeaderboard.bind(streakController));

module.exports = router;
