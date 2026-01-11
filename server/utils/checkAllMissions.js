require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { connectMongoDB } = require('../config/database');
const Mission = require('../models/Mission');

async function checkAllMissions() {
  try {
    await connectMongoDB();
    console.log('✅ Connected to MongoDB\n');

    const totalCount = await Mission.countDocuments({});
    console.log(`📊 Total missions in database: ${totalCount}\n`);

    if (totalCount > 0) {
      const allMissions = await Mission.find({}).sort({ created_at: -1 }).limit(5);
      console.log('📋 Recent missions:');
      allMissions.forEach((mission, index) => {
        console.log(`\n   ${index + 1}. ${mission.title}`);
        console.log(`      Created: ${mission.created_at}`);
        console.log(`      Expires: ${mission.expires_at}`);
        console.log(`      Active: ${mission.is_active}`);
      });
    }

    const today = new Date();
    const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 0, 0, 0, 0));
    const tomorrowUTC = new Date(todayUTC);
    tomorrowUTC.setUTCDate(tomorrowUTC.getUTCDate() + 1);

    console.log(`\n📅 Checking for missions between:`);
    console.log(`   ${todayUTC.toISOString()} and ${tomorrowUTC.toISOString()}`);

    const todayCount = await Mission.countDocuments({
      created_at: { $gte: todayUTC, $lt: tomorrowUTC },
      is_active: true,
    });

    console.log(`\n📊 Missions for today: ${todayCount}`);

    if (todayCount === 0) {
      console.log('\n⚠️  No missions found for today!');
      console.log('💡 Run: npm run seed:all');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkAllMissions();
