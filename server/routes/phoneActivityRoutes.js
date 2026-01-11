const express = require('express');
const router = express.Router();
const phoneActivityController = require('../controllers/phoneActivityController');
const { authenticateToken } = require('../middleware/auth');

router.post('/sync', authenticateToken, phoneActivityController.syncActivity.bind(phoneActivityController));
router.get('/:date?', authenticateToken, phoneActivityController.getActivity.bind(phoneActivityController));
router.get('/stats/summary', authenticateToken, phoneActivityController.getStatsSummary.bind(phoneActivityController));

module.exports = router;
