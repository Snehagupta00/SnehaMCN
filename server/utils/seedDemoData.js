require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { connectMongoDB } = require('../config/database');
const Mission = require('../models/Mission');
const Wallet = require('../models/Wallet');
const Streak = require('../models/Streak');
const MissionAttempt = require('../models/MissionAttempt');
const Reward = require('../models/Reward');
const { v4: uuidv4 } = require('uuid');

const USER_ID = '1c8541c1-dcfa-4ef0-89bc-09b3300d6389';

async function seedDemoData() {
  try {
    await connectMongoDB();
    console.log('📦 Starting demo data seeding...\n');

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(23, 59, 59, 999);

    const now = new Date();
    const expiresIn3Hours = new Date(now.getTime() + 3 * 60 * 60 * 1000);

    const missions = [
      {
        mission_id: uuidv4(),
        title: 'Walk 1,000 Steps',
        description: 'Take a walk and reach 1,000 steps today to earn Sharp Coins!',
        difficulty: 'EASY',
        base_reward: 10,
        requirement_type: 'STEPS',
        requirement_value: 1000,
        created_at: today,
        expires_at: tomorrow,
        proof_requirement: 'API_VERIFICATION',
        is_active: true,
        metadata: {
          tags: ['health', 'fitness'],
          category: 'Fitness',
          icon_url: '🚶',
        },
      },
      {
        mission_id: uuidv4(),
        title: 'No Phone for 10 min',
        description: 'Put your phone away for 10 minutes and focus on the present moment.',
        difficulty: 'EASY',
        base_reward: 20,
        requirement_type: 'PHONE_FREE',
        requirement_value: 10,
        created_at: today,
        expires_at: tomorrow,
        proof_requirement: 'MANUAL_CONFIRMATION',
        is_active: true,
        metadata: {
          tags: ['mindfulness', 'wellness'],
          category: 'Wellness',
          icon_url: '📱',
        },
      },
      {
        mission_id: uuidv4(),
        title: 'Track 1 Expense',
        description: 'Log at least one expense today to build better financial habits.',
        difficulty: 'MEDIUM',
        base_reward: 25,
        requirement_type: 'EXPENSE_TRACK',
        requirement_value: 1,
        created_at: today,
        expires_at: expiresIn3Hours,
        proof_requirement: 'MANUAL_CONFIRMATION',
        is_active: true,
        metadata: {
          tags: ['finance', 'tracking'],
          category: 'Finance',
          icon_url: '💰',
        },
      },
      {
        mission_id: uuidv4(),
        title: 'Answer Financial Quiz',
        description: 'Answer one financial literacy question to improve your money knowledge.',
        difficulty: 'MEDIUM',
        base_reward: 20,
        requirement_type: 'QUIZ',
        requirement_value: 1,
        created_at: today,
        expires_at: tomorrow,
        proof_requirement: 'MANUAL_CONFIRMATION',
        is_active: true,
        metadata: {
          tags: ['education', 'finance'],
          category: 'Learning',
          icon_url: '📚',
        },
      },
      {
        mission_id: uuidv4(),
        title: 'Complete Productivity Task',
        description: 'Finish one important task from your to-do list today.',
        difficulty: 'HARD',
        base_reward: 40,
        requirement_type: 'PRODUCTIVITY',
        requirement_value: 1,
        created_at: today,
        expires_at: tomorrow,
        proof_requirement: 'MANUAL_CONFIRMATION',
        is_active: true,
        metadata: {
          tags: ['productivity', 'goals'],
          category: 'Productivity',
          icon_url: '✅',
        },
      },
    ];

    await Mission.deleteMany({
      created_at: { $gte: today, $lt: tomorrow },
    });

    const insertedMissions = await Mission.insertMany(missions);
    console.log(`✅ Seeded ${insertedMissions.length} missions`);

    let wallet = await Wallet.findOne({ user_id: USER_ID });
    if (!wallet) {
      wallet = new Wallet({
        wallet_id: uuidv4(),
        user_id: USER_ID,
        total_balance: 2450,
        currency: 'SHARP_COINS',
      });
      await wallet.save();
      console.log('✅ Created wallet with 2,450 coins');
    } else {
      wallet.total_balance = 2450;
      await wallet.save();
      console.log('✅ Updated wallet balance to 2,450 coins');
    }

    let streak = await Streak.findOne({ user_id: USER_ID });
    if (!streak) {
      streak = new Streak({
        streak_id: uuidv4(),
        user_id: USER_ID,
        current_streak_count: 7,
        max_streak_ever: 7,
        last_completion_date: today,
        streak_started_at: new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000),
        multiplier: 2.0,
        badges_earned: ['7_DAY_STREAK'],
      });
      await streak.save();
      console.log('✅ Created streak: 7-day streak with 2.0x multiplier');
    } else {
      streak.current_streak_count = 7;
      streak.max_streak_ever = 7;
      streak.multiplier = 2.0;
      streak.last_completion_date = today;
      await streak.save();
      console.log('✅ Updated streak: 7-day streak with 2.0x multiplier');
    }

    await MissionAttempt.deleteMany({ user_id: USER_ID });

    const completedMission1 = insertedMissions[0];
    const completedMission2 = insertedMissions[1];
    const inProgressMission = insertedMissions[2];

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
    console.log('   - Walk 1,000 Steps: COMPLETED (+10 coins)');
    console.log('   - No Phone for 10 min: COMPLETED (+20 coins)');
    console.log('   - Track 1 Expense: IN PROGRESS');

    const reward1 = new Reward({
      reward_id: uuidv4(),
      user_id: USER_ID,
      attempt_id: attempt1.attempt_id,
      amount: 10,
      type: 'COINS',
      source: 'MISSION_COMPLETION',
      is_credited: true,
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
      created_at: new Date(now.getTime() - 1 * 60 * 60 * 1000),
    });
    await reward2.save();

    console.log('✅ Created reward transactions');

    console.log('\n🎉 Demo data seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - User ID: ${USER_ID}`);
    console.log('   - Wallet Balance: 2,450 Coins');
    console.log('   - Streak: 7 days (2.0x multiplier)');
    console.log('   - Missions: 5 total');
    console.log('     • 2 Completed');
    console.log('     • 1 In Progress');
    console.log('     • 2 Not Started (1 locked)');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding demo data:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  seedDemoData();
}

module.exports = { seedDemoData };
