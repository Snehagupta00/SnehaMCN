# FOMO - Micro Missions System

FOMO-driven habit building game for Gen Z users (ages 16-25) with daily missions, streaks, and reward multipliers.

## 🚀 Tech Stack

- **Backend**: Node.js 18+, Express.js, MongoDB 6.0+, Redis
- **Frontend**: React Native (Expo SDK 54), Redux Toolkit, React Navigation
- **Auth**: JWT tokens
- **Storage**: Cloudinary (images)
- **Deployment**: AWS EC2, Docker

## 📁 Project Structure

```
├── server/          # Backend API (Node.js/Express)
│   ├── config/      # Database & Redis
│   ├── models/      # MongoDB schemas
│   ├── controllers/ # Request handlers
│   ├── services/    # Business logic
│   ├── routes/      # API routes
│   └── utils/       # Helpers, cron jobs
│
└── Fomo/            # React Native Mobile App
    ├── src/
    │   ├── navigation/  # React Navigation
    │   ├── screens/      # App screens
    │   ├── components/   # UI components
    │   ├── store/        # Redux state
    │   └── api/          # API client
    └── App.js
```

## ✨ Key Features

- ✅ Daily missions with 24-hour expiration & FOMO triggers
- ✅ Streak tracking with multipliers (1x - 2.5x)
- ✅ Reward calculation engine & wallet system
- ✅ Phone activity tracking with real-time sync
- ✅ Push notifications (FCM)
- ✅ Fraud detection & activity verification
- ✅ Analytics dashboard with weekly/monthly summaries

## 🚀 Quick Start

### Backend Setup

```bash
cd server
npm install
node setup-env.js  # Creates .env file
npm run dev        # Starts on http://localhost:3000
```

### Frontend Setup

```bash
cd Fomo
npm install
npm start          # Starts Expo dev server
```

Scan QR code with Expo Go app or run on emulator.

## 📡 API Endpoints

**Authentication**
- `POST /api/v1/auth/register` - Register user
- `POST /api/v1/auth/login` - Login
- `PUT /api/v1/auth/username` - Update username

**Missions**
- `GET /api/v1/missions/daily` - Get today's missions
- `POST /api/v1/missions/:id/complete` - Complete mission

**Rewards & Streaks**
- `GET /api/v1/rewards/wallet` - Wallet balance
- `GET /api/v1/streaks/current` - Current streak
- `GET /api/v1/streaks/leaderboard` - Leaderboard

**Phone Activity**
- `POST /api/v1/phone-activity/sync` - Sync activity data
- `GET /api/v1/phone-activity/stats/summary` - Activity stats

## 📱 Mobile App

**Navigation Structure**
- AuthStack: Login, Register, ForgotPassword
- MainTabs: Home, Wallet, Streak, Profile, Analytics

**Key Screens**
- HomeScreen: Daily missions with streak & wallet widgets
- MissionDetailModal: Mission details with countdown
- WalletScreen: Balance & transaction history
- StreakDashboardScreen: Streaks, badges, leaderboards
- PhoneActivityScreen: Usage statistics & summaries

## 🎨 Design System

- **Colors**: Sharp Blue (#1E88E5), Success Green, Warning Red, Gold
- **Fonts**: Poppins, Roboto
- **Gradients**: Streak (red→gold), Earn (blue→cyan)
- **FOMO Features**: Pulsing animations, urgency banners, countdown timers

## 📚 Documentation

- `Fomo/README.md` - Mobile app details
- `server/README.md` - Backend API docs

