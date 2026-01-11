const express = require('express');
const router = express.Router();
const missionController = require('../controllers/missionController');
const { authenticateToken } = require('../middleware/auth');
const { missionCompletionLimiter } = require('../middleware/rateLimiter');
const { upload, uploadToCloudinary } = require('../middleware/upload');

router.get('/daily', authenticateToken, missionController.getDailyMissions.bind(missionController));
router.get('/:id', authenticateToken, missionController.getMissionDetails.bind(missionController));
router.post(
  '/:id/complete',
  authenticateToken,
  missionCompletionLimiter,
  upload.single('proof_image'),
  uploadToCloudinary,
  missionController.completeMission.bind(missionController)
);

module.exports = router;
