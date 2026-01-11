const redis = require('redis');

let redisClient = null;
let redisEnabled = process.env.REDIS_ENABLED !== 'false';

async function getRedisClient() {
  if (!redisEnabled) {
    return null;
  }

  if (redisClient) {
    return redisClient;
  }

  try {
    redisClient = redis.createClient({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      socket: {
        connectTimeout: 5000,
        reconnectStrategy: (retries) => {
          if (retries > 3) {
            console.warn('⚠️  Redis reconnection failed, continuing without cache');
            return null;
          }
          return Math.min(retries * 100, 3000);
        },
      },
    });

    redisClient.on('error', (err) => {
      if (err.code === 'ECONNREFUSED') {
        redisEnabled = false;
        redisClient = null;
      } else {
        console.error('❌ Redis connection error:', err.message);
      }
    });

    await redisClient.connect();
    console.log('✅ Redis connected successfully');
    return redisClient;
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      redisEnabled = false;
      redisClient = null;
      return null;
    }
    console.error('❌ Redis connection error:', error.message);
    redisEnabled = false;
    redisClient = null;
    return null;
  }
}

module.exports = getRedisClient;
