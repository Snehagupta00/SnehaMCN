require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { connectMongoDB } = require('../config/database');
const Mission = require('../models/Mission');
const MissionAttempt = require('../models/MissionAttempt');
const Wallet = require('../models/Wallet');
const Streak = require('../models/Streak');
const Reward = require('../models/Reward');
const Notification = require('../models/Notification');
const PhoneActivity = require('../models/PhoneActivity');

/**
 * Clear all data except User data
 */
async function clearAllData() {
  try {
    await connectMongoDB();
    console.log('🗑️  Starting data cleanup (preserving users)...\n');

    // Clear all collections except User
    const missionCount = await Mission.countDocuments();
    const attemptCount = await MissionAttempt.countDocuments();
    const walletCount = await Wallet.countDocuments();
    const streakCount = await Streak.countDocuments();
    const rewardCount = await Reward.countDocuments();
    const notificationCount = await Notification.countDocuments();
    const phoneActivityCount = await PhoneActivity.countDocuments();

    console.log('📊 Current data counts:');
    console.log(`   - Missions: ${missionCount}`);
    console.log(`   - Mission Attempts: ${attemptCount}`);
    console.log(`   - Wallets: ${walletCount}`);
    console.log(`   - Streaks: ${streakCount}`);
    console.log(`   - Rewards: ${rewardCount}`);
    console.log(`   - Notifications: ${notificationCount}`);
    console.log(`   - Phone Activities: ${phoneActivityCount}\n`);

    // Delete all data
    await Mission.deleteMany({});
    console.log('✅ Cleared all Missions');

    await MissionAttempt.deleteMany({});
    console.log('✅ Cleared all Mission Attempts');

    await Wallet.deleteMany({});
    console.log('✅ Cleared all Wallets');

    await Streak.deleteMany({});
    console.log('✅ Cleared all Streaks');

    await Reward.deleteMany({});
    console.log('✅ Cleared all Rewards');

    await Notification.deleteMany({});
    console.log('✅ Cleared all Notifications');

    await PhoneActivity.deleteMany({});
    console.log('✅ Cleared all Phone Activities');

    console.log('\n🎉 All data cleared successfully (Users preserved)!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing data:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  clearAllData();
}

module.exports = { clearAllData };
