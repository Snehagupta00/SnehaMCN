# Micro Missions - FOMO UI

React Native app built with Expo, React Navigation, and Redux Toolkit following the detailed UI specifications.

## 🚀 Features

- ✅ Complete navigation structure (AuthStack + MainTabs)
- ✅ HomeScreen with StreakCard, WalletWidget, and Mission Cards
- ✅ FOMO triggers (pulsing animations, urgency banners)
- ✅ Redux state management
- ✅ Reusable UI components
- ✅ All screens structured and ready for enhancement

## 📁 Project Structure

```
fomo/
├── App.js                    # Root app component
├── index.js                  # Entry point
├── src/
│   ├── navigation/
│   │   ├── RootNavigator.js  # Main navigation router
│   │   ├── AuthStack.js      # Authentication screens
│   │   ├── MainTabs.js       # Bottom tab navigator
│   │   └── stacks/
│   │       ├── HomeStack.js
│   │       ├── WalletStack.js
│   │       ├── StreakStack.js
│   │       ├── ProfileStack.js
│   │       └── AnalyticsStack.js
│   ├── screens/
│   │   ├── auth/             # Login, Register, etc.
│   │   ├── home/             # HomeScreen, MissionDetail, etc.
│   │   ├── wallet/           # Wallet, Transactions, Redeem
│   │   ├── streak/           # Streak Dashboard, Leaderboard
│   │   ├── profile/          # Profile, Settings, Help
│   │   └── analytics/        # Weekly, Monthly, Insights
│   ├── components/
│   │   ├── ui/               # Reusable UI components
│   │   │   ├── Card.js
│   │   │   └── Button.js
│   │   └── home/             # Home-specific components
│   │       ├── StreakCard.js
│   │       ├── WalletWidget.js
│   │       ├── UrgencyBanner.js
│   │       └── MissionCard.js
│   └── store/
│       ├── index.js          # Redux store
│       └── slices/
│           ├── authSlice.js
│           ├── missionSlice.js
│           ├── rewardSlice.js
│           ├── streakSlice.js
│           └── uiSlice.js
└── package.json
```

## 🛠️ Setup

1. **Install dependencies:**
```bash
cd fomo
npm install
```

2. **Start the app:**
```bash
npm start
# or
npm run android
npm run ios
npm run web
```

## 🎨 Design System

### Colors
- **Sharp Blue**: #1E88E5 (primary CTA)
- **Success Green**: #4CAF50 (completed missions)
- **Warning Red**: #FF5252 (expiry warnings)
- **Gold**: #FFC107 (badges, achievements)

### Gradients
- **Streak**: #FF6B6B → #FFE66D
- **Earn**: #1E88E5 → #00BCD4
- **Grow**: #4CAF50 → #8BC34A

### Typography
- **Headlines**: Inter Bold, 28px
- **Subheadings**: Inter SemiBold, 18px
- **Body**: Inter Regular, 16px
- **Coins**: IBM Plex Mono, 24px

## 📱 Navigation Flow

```
RootNavigator
├── AuthStack (if not authenticated)
│   ├── Login
│   ├── Register
│   ├── ForgotPassword
│   └── PhoneVerification
│
└── MainTabs (if authenticated)
    ├── Home
    │   ├── HomeScreen
    │   ├── MissionDetailModal
    │   ├── MissionCompletionModal
    │   └── ProofCaptureScreen
    ├── Wallet
    │   ├── WalletScreen
    │   ├── TransactionHistory
    │   ├── RedeemVoucher
    │   └── VoucherDetails
    ├── Streak
    │   ├── StreakDashboard
    │   ├── Leaderboard
    │   ├── AchievementBadges
    │   └── Statistics
    ├── Profile
    │   ├── ProfileScreen
    │   ├── Settings
    │   ├── NotificationPreferences
    │   ├── HelpFAQ
    │   └── Privacy
    └── Analytics
        ├── WeeklySummary
        ├── MonthlySummary
        ├── Insights
        └── CustomReport
```

## 🎯 FOMO Features

1. **Urgency Banner**: Shows when missions have <2 hours left
2. **Pulsing Animations**: Mission cards pulse when <1 hour remaining
3. **Red Borders**: Urgent missions get red pulsing borders
4. **Real-time Countdown**: Updates every second
5. **Visual Status Indicators**: Color-coded mission statuses

## 📦 Dependencies

- `expo` - React Native framework
- `@react-navigation/native` - Navigation
- `@react-navigation/bottom-tabs` - Bottom tabs
- `@react-navigation/native-stack` - Stack navigation
- `@reduxjs/toolkit` - State management
- `react-redux` - React bindings for Redux
- `expo-linear-gradient` - Gradient backgrounds
- `@react-native-async-storage/async-storage` - Local storage

## 🔧 Configuration

Update API URLs in Redux slices:
- `src/store/slices/authSlice.js`
- `src/store/slices/missionSlice.js`
- `src/store/slices/rewardSlice.js`
- `src/store/slices/streakSlice.js`

Change `http://localhost:3000` to your backend URL.

## 📝 Next Steps

1. Implement mission completion flow
2. Add image capture for proof
3. Enhance analytics screens with charts
4. Add leaderboard functionality
5. Implement voucher redemption
6. Add push notifications
7. Enhance animations and transitions

## 🐛 Troubleshooting

If you encounter issues:
1. Clear cache: `expo start -c`
2. Reinstall dependencies: `rm -rf node_modules && npm install`
3. Check Expo version compatibility

## 📄 License

Private project - All rights reserved
