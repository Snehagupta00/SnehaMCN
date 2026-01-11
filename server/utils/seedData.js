const Mission = require('../models/Mission');
const { v4: uuidv4 } = require('uuid');

async function seedMissions() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(23, 59, 59, 999);

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
        title: 'Phone-Free 10 Minutes',
        description: 'Put your phone away for 10 minutes and focus on the present moment.',
        difficulty: 'EASY',
        base_reward: 15,
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
        title: 'Complete Financial Quiz',
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
        title: 'Track One Expense',
        description: 'Log at least one expense today to build better financial habits.',
        difficulty: 'MEDIUM',
        base_reward: 25,
        requirement_type: 'EXPENSE_TRACK',
        requirement_value: 1,
        created_at: today,
        expires_at: tomorrow,
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

    // Clear existing missions for today
    await Mission.deleteMany({
      created_at: { $gte: today, $lt: tomorrow },
    });

    // Insert new missions
    await Mission.insertMany(missions);

    console.log(`✅ Seeded ${missions.length} missions for ${today.toDateString()}`);
    return missions;
  } catch (error) {
    console.error('❌ Error seeding missions:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
  const { connectMongoDB } = require('../config/database');

  async function run() {
    try {
      await connectMongoDB();
      await seedMissions();
      process.exit(0);
    } catch (error) {
      console.error('Error:', error);
      process.exit(1);
    }
  }

  run();
}

module.exports = { seedMissions };
