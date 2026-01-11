require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { connectMongoDB } = require('../config/database');
const Mission = require('../models/Mission');

async function checkMissions() {
  try {
    await connectMongoDB();
    console.log('✅ Connected to MongoDB\n');

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    console.log('📅 Date Range:');
    console.log(`   Today: ${today.toISOString()}`);
    console.log(`   Tomorrow: ${tomorrow.toISOString()}\n`);

    const count = await Mission.countDocuments({
      created_at: { $gte: today, $lt: tomorrow },
      is_active: true,
    });

    console.log(`📊 Missions found: ${count}\n`);

    if (count > 0) {
      const missions = await Mission.find({
        created_at: { $gte: today, $lt: tomorrow },
        is_active: true,
      }).limit(3);

      console.log('📋 Sample missions:');
      missions.forEach((mission, index) => {
        console.log(`\n   ${index + 1}. ${mission.title}`);
        console.log(`      ID: ${mission.mission_id}`);
        console.log(`      Created: ${mission.created_at}`);
        console.log(`      Expires: ${mission.expires_at}`);
        console.log(`      Active: ${mission.is_active}`);
      });
    } else {
      console.log('⚠️  No missions found for today!');
      console.log('\n💡 Try running: npm run seed:all');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkMissions();
