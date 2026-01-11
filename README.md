# Sharp Rewards - Micro Missions System

FOMO-driven habit building game for Gen Z users (ages 16-25) with daily missions, streaks, and reward multipliers.

## 🚀 Tech Stack

- **Backend**: Node.js 18+, Express.js
- **Database**: MongoDB 6.0+
- **Frontend**: React Native (Expo) with React Navigation
- **State Management**: Redux Toolkit
- **UI Components**: Custom components with Expo Linear Gradient
- **Authentication**: JWT tokens
- **APIs**: Google Fit, Apple HealthKit (planned)
- **Storage**: Cloudinary (image storage and CDN)
- **Deployment**: AWS EC2, Docker

## 📁 Project Structure

```
sharp-rewards-micro-missions/
├── server/                 # Backend API
│   ├── config/            # Database & Redis configuration
│   ├── models/            # MongoDB schemas
│   ├── controllers/       # Request handlers
│   ├── services/          # Business logic
│   ├── middleware/        # Auth, validation, rate limiting
│   ├── routes/            # API routes
│   ├── utils/             # Helpers, cron jobs
│   └── index.js           # Entry point
│
├── fomo/                  # React Native Mobile App
│   ├── src/
│   │   ├── navigation/     # React Navigation setup
│   │   │   ├── RootNavigator.js
│   │   │   ├── AuthStack.js
│   │   │   ├── MainTabs.js
│   │   │   └── stacks/    # Feature stacks
│   │   ├── screens/       # All app screens
│   │   │   ├── auth/      # Login, Register, etc.
│   │   │   ├── home/      # HomeScreen, MissionDetail, etc.
│   │   │   ├── wallet/    # Wallet, Transactions, Redeem
│   │   │   ├── streak/    # Streak Dashboard, Leaderboard
│   │   │   ├── profile/   # Profile, Settings, Help
│   │   │   └── analytics/ # Weekly, Monthly, Insights
│   │   ├── components/    # Reusable UI components
│   │   │   ├── ui/        # Card, Button
│   │   │   └── home/      # StreakCard, WalletWidget, etc.
│   │   ├── store/         # Redux state management
│   │   │   └── slices/    # auth, missions, rewards, streaks, ui
│   │   ├── constants/     # Colors, Typography, Spacing
│   │   └── utils/         # Animation utilities
│   ├── App.js             # Root component
│   └── index.js           # Entry point
│
└── README.md              # This file
```

## ✨ Features

### Core Features
- ✅ Daily missions with 24-hour expiration
- ✅ Streak tracking with multipliers (1x - 2.5x)
- ✅ Reward calculation engine
- ✅ Activity verification (Google Fit, HealthKit)
- ✅ Push notifications (FCM)
- ✅ Fraud detection
- ✅ Offline support
- ✅ Real-time countdown timers
- ✅ Phone activity tracking with permissions
- ✅ Real-time data sync to database
- ✅ Midnight automatic sync
- ✅ Username management system

### Mobile App Features
- ✅ Complete navigation structure (AuthStack + MainTabs)
- ✅ HomeScreen with StreakCard, WalletWidget, Mission Cards
- ✅ Mission Detail Modal with countdown and instructions
- ✅ 4-step Mission Completion Flow
- ✅ Wallet screen with rewards and transaction history
- ✅ Streak Dashboard with badges and leaderboards
- ✅ Profile & Settings with comprehensive options
- ✅ Analytics with weekly/monthly summaries
- ✅ Phone Activity tracking screen with usage statistics
- ✅ Permission check on app launch
- ✅ Custom app icons and splash screens (iOS, Android, Web)
- ✅ Custom fonts (Poppins, Roboto) integration
- ✅ Keyboard dismissal on tap outside inputs
- ✅ Session persistence (no logout on refresh)
- ✅ Username editing from profile
- ✅ FOMO triggers (pulsing animations, urgency banners)
- ✅ Real-time countdown timers
- ✅ Beautiful UI with gradients and animations

## Setup Instructions

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Setup environment variables:
```bash
node setup-env.js
```
This creates `server/.env` with default configuration.

4. Start MongoDB:
```bash
mongod
```

5. Seed sample missions (optional):
```bash
npm run seed
```

6. Run the server:
```bash
npm run dev
```

The server will start on `http://localhost:3000`

### Frontend Setup (React Native)

1. Navigate to fomo directory:
```bash
cd fomo
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables (optional):
Create a `.env` file if needed for API URLs:
```env
API_URL=http://localhost:3000/api/v1
```

4. Start the app:
```bash
# Start Expo dev server
npm start

# Or run on specific platform
npm run android
npm run ios
npm run web
```

The app will start and you can scan the QR code with Expo Go app or run on emulator.

**Note**: Make sure the backend server is running on port 3000 for full functionality.

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `PUT /api/v1/auth/username` - Update username (authenticated)

### Missions
- `GET /api/v1/missions/daily` - Fetch today's missions
- `GET /api/v1/missions/:id` - Get mission details
- `POST /api/v1/missions/:id/complete` - Complete a mission

### Rewards
- `GET /api/v1/rewards/wallet` - Get wallet balance
- `GET /api/v1/rewards/history` - Get reward history

### Streaks
- `GET /api/v1/streaks/current` - Get current streak
- `GET /api/v1/streaks/leaderboard` - Get leaderboard

### Phone Activity
- `POST /api/v1/phone-activity/sync` - Sync phone activity data
- `GET /api/v1/phone-activity/:date?` - Get activity data for specific date or all
- `GET /api/v1/phone-activity/stats/summary` - Get activity statistics summary

### User Management
- `PUT /api/v1/auth/username` - Update username

## 📱 Mobile App Structure

The React Native app (`fomo/`) follows a complete navigation structure:

### Navigation Flow
```
RootNavigator
├── AuthStack (if not authenticated)
│   ├── Login
│   ├── Register
│   ├── ForgotPassword
│   └── PhoneVerification
│
└── MainTabs (if authenticated)
    ├── Home (Daily Dashboard)
    ├── Wallet (Balance & Rewards)
    ├── Streak (Dashboard & Leaderboards)
    ├── Profile (Settings & Help)
    └── Analytics (Weekly/Monthly Reports)
```

### Key Screens
- **PermissionCheckScreen**: Checks phone activity permissions on app launch
- **HomeScreen**: Daily missions with streak, wallet, and mission cards
- **MissionDetailModal**: Detailed mission info with countdown and instructions
- **MissionCompletionModal**: 4-step completion flow (Permission → Loading → Success/Failure)
- **WalletScreen**: Balance, rewards, and transaction history
- **StreakDashboardScreen**: Streak stats, badges, and leaderboards
- **ProfileScreen**: User profile, stats, settings, and username editing
- **PhoneActivityScreen**: Phone usage statistics, daily/weekly summaries, device info
- **WeeklySummaryScreen**: Analytics with daily breakdown and insights

### Redux State Management
- `auth`: User authentication state
- `missions`: Daily missions and completion status
- `rewards`: Wallet balance and transaction history
- `streaks`: Streak count, multiplier, badges, leaderboard
- `ui`: Modal states, completion flow, active tab

### Design System
- **Colors**: Sharp Blue (#1E88E5), Success Green (#4CAF50), Warning Red (#FF5252), Gold (#FFC107)
- **Gradients**: Streak (red→gold), Earn (blue→cyan), Grow (green gradient)
- **Typography**: Poppins (Regular, Medium, SemiBold, Bold, ExtraBold) and Roboto (Regular, Medium, Bold) fonts
- **Spacing**: Consistent spacing scale (xs, sm, md, lg, xl)
- **Icons**: Custom AppIcon component with platform-specific app icons and Ionicons fallback

### FOMO Features
- Red pulsing borders on urgent missions (<1 hour)
- Real-time countdown timers
- Blinking warning icons (<30 minutes)
- Urgency banners (<2 hours)
- Animated mission cards

## 🎨 UI/UX Highlights

- **Gradient backgrounds** for visual appeal
- **Color-coded mission statuses** (Completed, In Progress, Not Started, Locked)
- **Real-time updates** for countdown timers
- **Smooth animations** for better user experience
- **FOMO triggers** to encourage timely mission completion
- **Responsive design** for different screen sizes

## 🔐 Phone Activity Tracking

### Features
- **Permission Management**: Checks and requests phone activity permissions on app launch
- **Real-time Tracking**: Tracks app usage automatically using React Native AppState API
- **Automatic Sync**: Syncs data to backend every 5 minutes and on app state changes
- **Midnight Sync**: Automatically syncs yesterday's data at midnight
- **Database Storage**: All activity data stored in MongoDB for analytics
- **Statistics**: Daily and weekly usage summaries with device information

### How It Works
1. **On App Launch**: Permission check screen appears if not previously granted
2. **During Usage**: Tracks foreground/background app state changes
3. **Real-time Sync**: Syncs to backend every 5 minutes while app is active
4. **Background Sync**: Syncs before app goes to background
5. **Midnight Sync**: Detects new day and syncs previous day's complete data

### Permissions
- **Android**: Requires `PACKAGE_USAGE_STATS` permission (can be skipped)
- **iOS**: Uses app state monitoring (no special permission needed)
- **Data Privacy**: All data stored locally and synced securely to backend

## 📚 Documentation

- **Quick Start**: See `QUICKSTART.md` for step-by-step setup guide
- **Architecture**: See `ARCHITECTURE.md` for detailed system architecture
- **Mobile App**: See `fomo/README.md` for React Native app details
- **Backend API**: See `server/README.md` for API documentation
- **Interview Prep**: See `INTERVIEW_QUESTIONS.md` for interview questions

## 🔧 Development

### Running the Full Stack

1. **Start Backend** (Terminal 1):
```bash
cd server
npm install
npm run dev
```

2. **Start Mobile App** (Terminal 2):
```bash
cd fomo
npm install
npm start
```

3. **Access Points**:
   - Backend API: `http://localhost:3000`
   - Mobile App: Expo Dev Server (scan QR code)

## 🚀 Deployment

- **Backend**: See `server/README.md` for deployment instructions
- **Mobile**: Build with `expo build` or EAS Build

## 📝 License

ISC
