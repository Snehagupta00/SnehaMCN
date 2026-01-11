const RewardEngine = require('../services/RewardEngine');

class RewardController {
  async getWallet(req, res) {
    try {
      const userId = req.user.user_id;
      const wallet = await RewardEngine.getWallet(userId);

      res.json({
        success: true,
        data: wallet,
      });
    } catch (error) {
      console.error('Error fetching wallet:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch wallet',
      });
    }
  }

  async getRewardHistory(req, res) {
    try {
      const userId = req.user.user_id;
      const limit = parseInt(req.query.limit) || 50;
      const history = await RewardEngine.getRewardHistory(userId, limit);

      res.json({
        success: true,
        data: {
          rewards: history,
          count: history.length,
        },
      });
    } catch (error) {
      console.error('Error fetching reward history:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch reward history',
      });
    }
  }
}

module.exports = new RewardController();
