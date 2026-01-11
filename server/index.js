require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { connectMongoDB } = require('./config/database');
const missionRoutes = require('./routes/missionRoutes');
const rewardRoutes = require('./routes/rewardRoutes');
const streakRoutes = require('./routes/streakRoutes');
const authRoutes = require('./routes/authRoutes');
const phoneActivityRoutes = require('./routes/phoneActivityRoutes');
const { apiLimiter } = require('./middleware/rateLimiter');

require('./utils/cronJobs');

const app = express();
const PORT = process.env.PORT || 3000;
const API_VERSION = process.env.API_VERSION || 'v1';

app.use(helmet());
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(apiLimiter);

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Sharp Rewards - Micro Missions API',
  });
});

app.use(`/api/${API_VERSION}/auth`, authRoutes);
app.use(`/api/${API_VERSION}/missions`, missionRoutes);
app.use(`/api/${API_VERSION}/rewards`, rewardRoutes);
app.use(`/api/${API_VERSION}/streaks`, streakRoutes);
app.use(`/api/${API_VERSION}/phone-activity`, phoneActivityRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
});

async function startServer() {
  try {
    await connectMongoDB();

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 API available at http://localhost:${PORT}/api/${API_VERSION}`);
      console.log(`📡 API available at http://127.0.0.1:${PORT}/api/${API_VERSION}`);
      console.log(`🏥 Health check: http://localhost:${PORT}/health`);
    }).on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use!`);
        console.error(`💡 Solutions:`);
        console.error(`   1. Kill the process: Get-NetTCPConnection -LocalPort ${PORT} | Stop-Process -Id (Get-NetTCPConnection -LocalPort ${PORT}).OwningProcess -Force`);
        console.error(`   2. Change PORT in .env file to a different port (e.g., 3001)`);
        process.exit(1);
      } else {
        throw err;
      }
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;
