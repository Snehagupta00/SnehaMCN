require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { connectMongoDB } = require('../config/database');
const Mission = require('../models/Mission');
const Wallet = require('../models/Wallet');
const Streak = require('../models/Streak');
const MissionAttempt = require('../models/MissionAttempt');
const Reward = require('../models/Reward');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');

/**
 * Seed data for a specific user
 * Usage: node utils/seedUserData.js [user_id]
 */
const USER_ID = process.argv[2] || '505ca046-936f-43e4-9c44-09a3fd1aa49c';

async function seedUserData() {
  try {
    await connectMongoDB();
    console.log('📦 Starting data seeding for user...\n');

    // Check if user exists
    const user = await User.findOne({ user_id: USER_ID });
    if (!user) {
      console.log(`❌ User with ID ${USER_ID} not found in database.`);
      process.exit(1);
    }

    console.log(`👤 Seeding data for user: ${user.email || user.username || USER_ID}\n`);

    // Use UTC to avoid timezone issues
    const today = new Date();
    const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 0, 0, 0, 0));
    const tomorrowUTC = new Date(todayUTC);
    tomorrowUTC.setUTCDate(tomorrowUTC.getUTCDate() + 1);
    tomorrowUTC.setUTCHours(23, 59, 59, 999);

    const now = new Date();
    // Calculate expiration times relative to today UTC
    const expiresIn2Hours = new Date(todayUTC.getTime() + 2 * 60 * 60 * 1000);
    const expiresIn6Hours = new Date(todayUTC.getTime() + 6 * 60 * 60 * 1000);
    const expiresIn12Hours = new Date(todayUTC.getTime() + 12 * 60 * 60 * 1000);

    const missions = [
      {
        mission_id: uuidv4(),
        title: 'Walk 5,000 Steps',
        description: 'Take a walk and reach 5,000 steps today to stay active and earn Sharp Coins!',
        difficulty: 'EASY',
        base_reward: 15,
        requirement_type: 'STEPS',
        requirement_value: 5000,
        created_at: todayUTC,
        expires_at: tomorrowUTC,
        proof_requirement: 'API_VERIFICATION',
        is_active: true,
        metadata: {
          tags: ['health', 'fitness', 'walking'],
          category: 'Fitness',
          icon_url: '🚶',
        },
      },
      {
        mission_id: uuidv4(),
        title: 'Phone-Free 15 Minutes',
        description: 'Put your phone away for 15 minutes and focus on the present moment. Practice mindfulness!',
        difficulty: 'EASY',
        base_reward: 20,
        requirement_type: 'PHONE_FREE',
        requirement_value: 15,
        created_at: todayUTC,
        expires_at: tomorrowUTC,
        proof_requirement: 'MANUAL_CONFIRMATION',
        is_active: true,
        metadata: {
          tags: ['mindfulness', 'wellness', 'digital-detox'],
          category: 'Wellness',
          icon_url: '📱',
        },
      },
      {
        mission_id: uuidv4(),
        title: 'Track 3 Expenses',
        description: 'Log at least 3 expenses today to build better financial tracking habits.',
        difficulty: 'MEDIUM',
        base_reward: 30,
        requirement_type: 'EXPENSE_TRACK',
        requirement_value: 3,
        created_at: todayUTC,
        expires_at: expiresIn6Hours,
        proof_requirement: 'MANUAL_CONFIRMATION',
        is_active: true,
        metadata: {
          tags: ['finance', 'tracking', 'budgeting'],
          category: 'Finance',
          icon_url: '💰',
        },
      },
      {
        mission_id: uuidv4(),
        title: 'Complete Financial Quiz',
        description: 'Answer 2 financial literacy questions to improve your money knowledge and earn rewards!',
        difficulty: 'MEDIUM',
        base_reward: 25,
        requirement_type: 'QUIZ',
        requirement_value: 2,
        created_at: todayUTC,
        expires_at: expiresIn12Hours,
        proof_requirement: 'MANUAL_CONFIRMATION',
        is_active: true,
        metadata: {
          tags: ['education', 'finance', 'learning'],
          category: 'Learning',
          icon_url: '📚',
        },
      },
      {
        mission_id: uuidv4(),
        title: 'Complete 2 Productivity Tasks',
        description: 'Finish 2 important tasks from your to-do list today. Boost your productivity!',
        difficulty: 'HARD',
        base_reward: 50,
        requirement_type: 'PRODUCTIVITY',
        requirement_value: 2,
        created_at: todayUTC,
        expires_at: tomorrowUTC,
        proof_requirement: 'MANUAL_CONFIRMATION',
        is_active: true,
        metadata: {
          tags: ['productivity', 'goals', 'tasks'],
          category: 'Productivity',
          icon_url: '✅',
        },
      },
      {
        mission_id: uuidv4(),
        title: 'Walk 10,000 Steps',
        description: 'Achieve the daily goal of 10,000 steps! This is a great way to stay healthy.',
        difficulty: 'MEDIUM',
        base_reward: 35,
        requirement_type: 'STEPS',
        requirement_value: 10000,
        created_at: todayUTC,
        expires_at: tomorrowUTC,
        proof_requirement: 'API_VERIFICATION',
        is_active: true,
        metadata: {
          tags: ['health', 'fitness', 'challenge'],
          category: 'Fitness',
          icon_url: '🏃',
        },
      },
      {
        mission_id: uuidv4(),
        title: 'Phone-Free 30 Minutes',
        description: 'Take a longer break from your phone for 30 minutes. Read a book, meditate, or enjoy nature!',
        difficulty: 'MEDIUM',
        base_reward: 30,
        requirement_type: 'PHONE_FREE',
        requirement_value: 30,
        created_at: todayUTC,
        expires_at: expiresIn2Hours,
        proof_requirement: 'MANUAL_CONFIRMATION',
        is_active: true,
        metadata: {
          tags: ['mindfulness', 'wellness', 'focus'],
          category: 'Wellness',
          icon_url: '🧘',
        },
      },
    ];

    // Clear existing missions for today
    await Mission.deleteMany({
      created_at: { $gte: todayUTC, $lt: tomorrowUTC },
    });

    const insertedMissions = await Mission.insertMany(missions);
    console.log(`✅ Seeded ${insertedMissions.length} missions for today\n`);

    // Create or update Wallet
    let wallet = await Wallet.findOne({ user_id: USER_ID });
    if (!wallet) {
      wallet = new Wallet({
        wallet_id: uuidv4(),
        user_id: USER_ID,
        total_balance: 2450,
        currency: 'SHARP_COINS',
      });
      await wallet.save();
      console.log(`✅ Created wallet with 2,450 coins`);
    } else {
      wallet.total_balance = 2450;
      await wallet.save();
      console.log(`✅ Updated wallet balance to 2,450 coins`);
    }

    // Create or update Streak
    let streak = await Streak.findOne({ user_id: USER_ID });
    if (!streak) {
      streak = new Streak({
        streak_id: uuidv4(),
        user_id: USER_ID,
        current_streak_count: 7,
        max_streak_ever: 7,
        multiplier: 2.0,
        last_completion_date: todayUTC,
        streak_started_at: new Date(todayUTC.getTime() - 6 * 24 * 60 * 60 * 1000),
        badges_earned: ['WEEK_WARRIOR'],
      });
      await streak.save();
      console.log(`✅ Created streak: 7-day streak with 2.0x multiplier`);
    } else {
      streak.current_streak_count = 7;
      streak.max_streak_ever = 7;
      streak.multiplier = 2.0;
      streak.last_completion_date = todayUTC;
      streak.streak_started_at = new Date(todayUTC.getTime() - 6 * 24 * 60 * 60 * 1000);
      streak.badges_earned = ['WEEK_WARRIOR'];
      await streak.save();
      console.log(`✅ Updated streak: 7-day streak with 2.0x multiplier`);
    }

    // Clear old attempts and rewards for this user
    await MissionAttempt.deleteMany({ user_id: USER_ID });
    await Reward.deleteMany({ user_id: USER_ID });

    // Create mission attempts (first 3 missions)
    const completedMission1 = insertedMissions[0]; // Walk 5,000 Steps
    const completedMission2 = insertedMissions[1]; // Phone-Free 15 Minutes
    const inProgressMission = insertedMissions[2]; // Track 3 Expenses

    const attempt1 = await MissionAttempt.create({
      attempt_id: uuidv4(),
      user_id: USER_ID,
      mission_id: completedMission1.mission_id,
      verification_status: 'APPROVED',
      completed_at: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      submitted_at: new Date(now.getTime() - 2 * 60 * 60 * 1000),
    });

    const attempt2 = await MissionAttempt.create({
      attempt_id: uuidv4(),
      user_id: USER_ID,
      mission_id: completedMission2.mission_id,
      verification_status: 'APPROVED',
      completed_at: new Date(now.getTime() - 1 * 60 * 60 * 1000),
      submitted_at: new Date(now.getTime() - 1 * 60 * 60 * 1000),
    });

    const attempt3 = await MissionAttempt.create({
      attempt_id: uuidv4(),
      user_id: USER_ID,
      mission_id: inProgressMission.mission_id,
      verification_status: 'PENDING',
      submitted_at: new Date(now.getTime() - 30 * 60 * 1000),
    });

    console.log('✅ Created mission attempts:');
    console.log('   - Walk 5,000 Steps: COMPLETED');
    console.log('   - Phone-Free 15 Minutes: COMPLETED');
    console.log('   - Track 3 Expenses: IN PROGRESS');

    // Create rewards for completed missions
    const reward1 = new Reward({
      reward_id: uuidv4(),
      user_id: USER_ID,
      attempt_id: attempt1.attempt_id,
      amount: 15,
      type: 'COINS',
      source: 'MISSION_COMPLETION',
      is_credited: true,
      reason: 'Mission completion: Walk 5,000 Steps - 15 coins (1.0x multiplier)',
      created_at: new Date(now.getTime() - 2 * 60 * 60 * 1000),
    });
    await reward1.save();

    const reward2 = new Reward({
      reward_id: uuidv4(),
      user_id: USER_ID,
      attempt_id: attempt2.attempt_id,
      amount: 20,
      type: 'COINS',
      source: 'MISSION_COMPLETION',
      is_credited: true,
      reason: 'Mission completion: Phone-Free 15 Minutes - 20 coins (1.0x multiplier)',
      created_at: new Date(now.getTime() - 1 * 60 * 60 * 1000),
    });
    await reward2.save();

    console.log('✅ Created reward transactions (35 coins total)');

    console.log('\n🎉 Data seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - User: ${user.email || user.username || USER_ID}`);
    console.log(`   - Wallet Balance: 2,450 Coins`);
    console.log(`   - Streak: 7 days (2.0x multiplier)`);
    console.log(`   - Missions: ${insertedMissions.length} total`);
    console.log(`     • 2 Completed (Walk 5,000 Steps, Phone-Free 15 Minutes)`);
    console.log(`     • 1 In Progress (Track 3 Expenses)`);
    console.log(`     • 4 Not Started (1 locked until 3 completed)`);
    console.log(`   - Rewards: 2 transactions (35 coins earned)`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  seedUserData();
}

module.exports = { seedUserData };
