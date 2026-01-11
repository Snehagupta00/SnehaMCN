# Architecture Documentation

## Table of Contents
1. [ERD (Entity Relationship Diagram)](#erd-entity-relationship-diagram)
2. [DRD (Data Relationship Diagram)](#drd-data-relationship-diagram)
3. [User Journey / Flow Diagrams](#user-journey--flow-diagrams)

---

## ERD (Entity Relationship Diagram)

### Database Schema Overview

The application uses MongoDB with Mongoose ODM. The following entities and their relationships are defined:

```mermaid
erDiagram
    USER ||--o{ MISSION_ATTEMPT : "creates"
    USER ||--|| WALLET : "has"
    USER ||--|| STREAK : "has"
    USER ||--o{ PHONE_ACTIVITY : "tracks"
    USER ||--o{ NOTIFICATION : "receives"
    
    MISSION ||--o{ MISSION_ATTEMPT : "has"
    MISSION_ATTEMPT ||--o{ REWARD : "generates"
    
    WALLET ||--o{ REWARD : "contains"
    STREAK ||--o{ REWARD : "affects"

    USER {
        string user_id PK
        string email UK
        string username
        string password_hash
        string timezone
        date created_at
        date last_activity_at
        boolean is_active
        string fcm_token
        string device_fingerprint
        string current_device_id
        object preferences
    }

    MISSION {
        string mission_id PK
        string title
        string description
        string difficulty
        number base_reward
        string requirement_type
        number requirement_value
        date created_at
        date expires_at
        string proof_requirement
        boolean is_active
        object metadata
    }

    MISSION_ATTEMPT {
        string attempt_id PK
        string user_id FK
        string mission_id FK
        date submitted_at
        date completed_at
        object proof
        string verification_status
        number fraud_score
        object api_response
        string notes
    }

    REWARD {
        string reward_id PK
        string user_id FK
        string attempt_id FK
        number amount
        string type
        string source
        date created_at
        boolean is_credited
        string reason
    }

    WALLET {
        string wallet_id PK
        string user_id FK UK
        number total_balance
        date updated_at
        string currency
        array transaction_history
    }

    STREAK {
        string streak_id PK
        string user_id FK UK
        number current_streak_count
        number max_streak_ever
        date last_completion_date
        date streak_started_at
        number multiplier
        array badges_earned
    }

    PHONE_ACTIVITY {
        string activity_id PK
        string user_id FK
        string date
        number total_seconds
        number sessions
        object device_info
        date last_updated
        date synced_at
    }

    NOTIFICATION {
        string notification_id PK
        string user_id FK
        string type
        date sent_at
        string fcm_token
        boolean is_delivered
        object metadata
    }
```

### Entity Relationships

#### 1. User Relationships
- **User → Wallet**: One-to-One (1:1)
  - Each user has exactly one wallet
  - Wallet is created automatically on user registration
  
- **User → Streak**: One-to-One (1:1)
  - Each user has exactly one streak record
  - Streak is created automatically on user registration

- **User → MissionAttempt**: One-to-Many (1:N)
  - A user can create multiple mission attempts
  - Each attempt is linked to a specific mission

- **User → PhoneActivity**: One-to-Many (1:N)
  - A user can have multiple phone activity records (one per day)
  - Unique constraint on (user_id, date)

- **User → Notification**: One-to-Many (1:N)
  - A user can receive multiple notifications

#### 2. Mission Relationships
- **Mission → MissionAttempt**: One-to-Many (1:N)
  - A mission can have multiple attempts from different users
  - Each attempt represents a user's completion attempt

#### 3. MissionAttempt Relationships
- **MissionAttempt → Reward**: One-to-Many (1:N)
  - Each approved attempt generates one or more rewards
  - Rewards can be mission completion coins, streak bonuses, or all-missions bonuses

#### 4. Wallet Relationships
- **Wallet → Reward**: One-to-Many (1:N)
  - Wallet contains transaction history referencing reward IDs
  - Wallet balance is updated when rewards are credited

#### 5. Streak Relationships
- **Streak → Reward**: Indirect (affects multiplier)
  - Streak count determines reward multiplier
  - Multiplier affects reward calculation in RewardEngine

### Key Indexes

```javascript
// User indexes
{ email: 1 } - Unique
{ created_at: 1 }
{ last_activity_at: 1 }

// Mission indexes
{ expires_at: 1 } - TTL index (expires after 86400 seconds)
{ is_active: 1, expires_at: 1 } - Compound

// MissionAttempt indexes
{ user_id: 1, mission_id: 1, submitted_at: 1 } - Compound
{ verification_status: 1, submitted_at: 1 } - Compound

// Reward indexes
{ user_id: 1, created_at: -1 }
{ is_credited: 1 }

// Wallet indexes
{ user_id: 1 } - Unique

// Streak indexes
{ user_id: 1 } - Unique
{ last_completion_date: 1 }

// PhoneActivity indexes
{ user_id: 1, date: 1 } - Unique compound

// Notification indexes
{ user_id: 1, is_delivered: 1 }
{ sent_at: 1 }
```

---

## DRD (Data Relationship Diagram)

### Data Flow Architecture

```mermaid
graph TB
    subgraph "Client Layer (React Native)"
        UI[User Interface]
        Redux[Redux Store]
        API_Client[API Client]
    end

    subgraph "API Layer (Express.js)"
        Auth_MW[Authentication Middleware]
        Rate_Limiter[Rate Limiter]
        Routes[API Routes]
        Controllers[Controllers]
    end

    subgraph "Service Layer"
        MissionEngine[Mission Engine]
        RewardEngine[Reward Engine]
        StreakManager[Streak Manager]
        NotificationService[Notification Service]
        ActivityVerification[Activity Verification]
    end

    subgraph "Data Layer"
        MongoDB[(MongoDB)]
        Redis[(Redis Cache)]
        Cloudinary[Cloudinary Storage]
    end

    subgraph "External Services"
        GoogleFit[Google Fit API]
        FCM[Firebase Cloud Messaging]
    end

    UI --> Redux
    Redux --> API_Client
    API_Client --> Auth_MW
    Auth_MW --> Rate_Limiter
    Rate_Limiter --> Routes
    Routes --> Controllers
    Controllers --> MissionEngine
    Controllers --> RewardEngine
    Controllers --> StreakManager
    Controllers --> NotificationService
    Controllers --> ActivityVerification
    
    MissionEngine --> MongoDB
    RewardEngine --> MongoDB
    RewardEngine --> Redis
    StreakManager --> MongoDB
    NotificationService --> MongoDB
    NotificationService --> FCM
    ActivityVerification --> GoogleFit
    ActivityVerification --> Cloudinary
    
    MissionEngine -.-> RewardEngine
    RewardEngine -.-> StreakManager
```

### Data Flow Patterns

#### 1. Mission Retrieval Flow
```
User Request → API Client → GET /missions/daily
  → MissionController.getDailyMissions()
  → MissionEngine.getDailyMissions(userId)
  → MongoDB Query (Mission collection)
  → Calculate time remaining
  → Return enriched mission data
  → Redux Store (missionSlice)
  → UI Update
```

#### 2. Mission Completion Flow
```
User Action → API Client → POST /missions/:id/complete
  → Authentication Middleware (verify JWT)
  → Rate Limiter (prevent abuse)
  → Upload Middleware (handle proof image)
  → Cloudinary Upload
  → MissionController.completeMission()
  → MissionEngine.createAttempt()
  → MongoDB Insert (MissionAttempt)
  → ActivityVerification.verify()
  → Google Fit API (if API_VERIFICATION)
  → RewardEngine.calculateReward()
  → RewardEngine.creditReward()
  → MongoDB Transaction:
    - Update Wallet (total_balance)
    - Insert Reward record
  → StreakManager.incrementStreak()
  → MongoDB Update (Streak)
  → NotificationService.sendCompletionNotification()
  → FCM Push Notification
  → Return success response
  → Redux Store Update
  → UI Success Animation
```

#### 3. Reward Calculation Flow
```
Mission Completion → RewardEngine.calculateReward()
  → Fetch Mission (base_reward)
  → Fetch Streak (current_streak_count)
  → Calculate Multiplier:
    - 1.0x (0-6 days)
    - 1.5x (7-13 days)
    - 2.0x (14-29 days)
    - 2.5x (30+ days)
  → Calculate earned_coins = base_reward × multiplier
  → Check if all missions completed
  → Add bonus_coins if applicable
  → Return reward calculation object
```

#### 4. Wallet Update Flow
```
Reward Credit → RewardEngine.creditReward()
  → Start MongoDB Transaction
  → Fetch/Create Wallet
  → Update total_balance += total_coins
  → Push reward_id to transaction_history
  → Insert Reward record
  → Commit Transaction
  → Return updated wallet
```

#### 5. Streak Management Flow
```
Mission Approved → StreakManager.incrementStreak()
  → Fetch Streak record
  → Check last_completion_date
  → If same day: No change
  → If next day: Increment streak
  → If gap > 1 day: Reset streak
  → Update multiplier based on streak count
  → Update max_streak_ever if needed
  → Save to MongoDB
```

### Data Synchronization

#### Real-time Updates
- **Missions**: Polled every 30 seconds on HomeScreen
- **Wallet**: Updated immediately after reward credit
- **Streak**: Updated immediately after mission completion
- **Notifications**: Pushed via FCM, stored in MongoDB

#### Caching Strategy
- **Redis**: Used for rate limiting and session management
- **Redux**: Client-side state management for UI updates
- **MongoDB**: Primary data store with TTL indexes for expired missions

---

## User Journey / Flow Diagrams

### 1. Authentication Flow

```mermaid
flowchart TD
    Start([App Launch]) --> CheckAuth{Authenticated?}
    CheckAuth -->|No| LoginScreen[Login Screen]
    CheckAuth -->|Yes| HomeScreen[Home Screen]
    
    LoginScreen --> LoginForm[Enter Email/Password]
    LoginForm --> Validate{Valid?}
    Validate -->|No| ShowError[Show Error]
    ShowError --> LoginForm
    Validate -->|Yes| API[POST /auth/login]
    API --> Success{Success?}
    Success -->|No| ShowError
    Success -->|Yes| StoreToken[Store JWT Token]
    StoreToken --> ReduxAuth[Update Redux Auth State]
    ReduxAuth --> HomeScreen
    
    LoginScreen --> RegisterLink[Tap Register]
    RegisterLink --> RegisterScreen[Register Screen]
    RegisterScreen --> RegisterForm[Enter Email/Password]
    RegisterForm --> ValidateEmail{Valid Gmail?}
    ValidateEmail -->|No| ShowEmailError[Show Email Error]
    ShowEmailError --> RegisterForm
    ValidateEmail -->|Yes| RegisterAPI[POST /auth/register]
    RegisterAPI --> CreateUser[Create User]
    CreateUser --> CreateWallet[Create Wallet]
    CreateWallet --> CreateStreak[Create Streak]
    CreateStreak --> ReturnToken[Return JWT Token]
    ReturnToken --> StoreToken
```

### 2. Mission Discovery & Completion Flow

```mermaid
flowchart TD
    HomeScreen[Home Screen] --> LoadMissions[Load Daily Missions]
    LoadMissions --> API[GET /missions/daily]
    API --> DisplayMissions[Display Mission Cards]
    
    DisplayMissions --> TapMission[Tap Mission Card]
    TapMission --> MissionDetail[Mission Detail Modal]
    
    MissionDetail --> ViewDetails[View Mission Details]
    ViewDetails --> Instructions[Read Instructions]
    Instructions --> Countdown[View Countdown Timer]
    
    Countdown --> CompleteBtn[Tap Complete Mission]
    CompleteBtn --> MissionCompletion[Mission Completion Modal]
    
    MissionCompletion --> Step1[Step 1: Permission Request]
    Step1 --> AllowAccess{Allow Access?}
    AllowAccess -->|No| ManualEntry[Manual Entry Option]
    AllowAccess -->|Yes| Step2[Step 2: Verification Loading]
    
    Step2 --> VerifyAPI[Activity Verification]
    VerifyAPI --> GoogleFit[Google Fit API Check]
    GoogleFit --> VerifyResult{Verified?}
    
    VerifyResult -->|Yes| Step3[Step 3: Success Screen]
    VerifyResult -->|No| Step4[Step 4: Failure Screen]
    
    Step3 --> RewardCalc[Calculate Reward]
    RewardCalc --> CreditWallet[Credit Wallet]
    CreditWallet --> UpdateStreak[Update Streak]
    UpdateStreak --> ShowReward[Show Reward Animation]
    ShowReward --> Continue[Continue Button]
    Continue --> HomeScreen
    
    Step4 --> TryAgain[Try Again Button]
    TryAgain --> MissionCompletion
    
    ManualEntry --> ProofCapture[Proof Capture Screen]
    ProofCapture --> UploadProof[Upload Screenshot]
    UploadProof --> ManualVerify[Manual Verification]
    ManualVerify --> VerifyResult
```

### 3. Reward & Wallet Flow

```mermaid
flowchart TD
    MissionComplete[Mission Completed] --> RewardEngine[Reward Engine]
    RewardEngine --> FetchMission[Fetch Mission Base Reward]
    FetchMission --> FetchStreak[Fetch User Streak]
    FetchStreak --> CalcMultiplier[Calculate Multiplier]
    
    CalcMultiplier --> CheckStreak{Streak Days}
    CheckStreak -->|0-6| Mult1[1.0x Multiplier]
    CheckStreak -->|7-13| Mult2[1.5x Multiplier]
    CheckStreak -->|14-29| Mult3[2.0x Multiplier]
    CheckStreak -->|30+| Mult4[2.5x Multiplier]
    
    Mult1 --> CalcCoins[Calculate Earned Coins]
    Mult2 --> CalcCoins
    Mult3 --> CalcCoins
    Mult4 --> CalcCoins
    
    CalcCoins --> CheckAllMissions{All Missions<br/>Completed?}
    CheckAllMissions -->|Yes| AddBonus[Add Bonus Coins]
    CheckAllMissions -->|No| SkipBonus[Skip Bonus]
    
    AddBonus --> TotalCoins[Total Coins]
    SkipBonus --> TotalCoins
    
    TotalCoins --> StartTransaction[Start MongoDB Transaction]
    StartTransaction --> UpdateWallet[Update Wallet Balance]
    UpdateWallet --> CreateReward[Create Reward Record]
    CreateReward --> CommitTransaction[Commit Transaction]
    CommitTransaction --> UpdateUI[Update UI Wallet Display]
    
    UpdateUI --> WalletScreen[Wallet Screen]
    WalletScreen --> ViewBalance[View Total Balance]
    ViewBalance --> ViewHistory[View Transaction History]
    ViewHistory --> ViewRewards[View Reward Details]
    
    ViewRewards --> Redeem[Tap Redeem]
    Redeem --> VoucherScreen[Voucher Selection Screen]
    VoucherScreen --> SelectVoucher[Select Voucher]
    SelectVoucher --> ConfirmRedeem[Confirm Redemption]
    ConfirmRedeem --> DeductCoins[Deduct Coins from Wallet]
    DeductCoins --> ShowVoucher[Show Voucher Code]
```

### 4. Streak Management Flow

```mermaid
flowchart TD
    MissionApproved[Mission Approved] --> StreakManager[Streak Manager]
    StreakManager --> FetchStreak[Fetch User Streak]
    FetchStreak --> CheckDate{Check last_completion_date}
    
    CheckDate -->|Same Day| NoChange[No Streak Change]
    CheckDate -->|Next Day| Increment[Increment Streak]
    CheckDate -->|Gap > 1 Day| Reset[Reset Streak to 1]
    
    Increment --> UpdateCount[Update current_streak_count]
    Reset --> UpdateCount
    NoChange --> End1[End]
    
    UpdateCount --> CheckMax{current > max?}
    CheckMax -->|Yes| UpdateMax[Update max_streak_ever]
    CheckMax -->|No| SkipMax[Skip]
    
    UpdateMax --> CalcMultiplier[Calculate New Multiplier]
    SkipMax --> CalcMultiplier
    
    CalcMultiplier --> CheckStreakDays{Streak Days}
    CheckStreakDays -->|0-6| Mult1[1.0x]
    CheckStreakDays -->|7-13| Mult1_5[1.5x]
    CheckStreakDays -->|14-29| Mult2[2.0x]
    CheckStreakDays -->|30+| Mult2_5[2.5x]
    
    Mult1 --> SaveStreak[Save to MongoDB]
    Mult1_5 --> SaveStreak
    Mult2 --> SaveStreak
    Mult2_5 --> SaveStreak
    
    SaveStreak --> CheckBadges{Badge Milestones?}
    CheckBadges -->|7 days| Badge7[7-Day Badge]
    CheckBadges -->|14 days| Badge14[14-Day Badge]
    CheckBadges -->|30 days| Badge30[30-Day Badge]
    CheckBadges -->|No| SkipBadge[Skip]
    
    Badge7 --> UpdateBadges[Update badges_earned]
    Badge14 --> UpdateBadges
    Badge30 --> UpdateBadges
    SkipBadge --> UpdateUI
    UpdateBadges --> UpdateUI[Update UI Streak Display]
    
    UpdateUI --> StreakDashboard[Streak Dashboard]
    StreakDashboard --> ViewStats[View Statistics]
    ViewStats --> ViewBadges[View Earned Badges]
    ViewBadges --> ViewLeaderboard[View Leaderboard]
```

### 5. Navigation Flow

```mermaid
flowchart TD
    AppStart[App Start] --> RootNav{Root Navigator}
    RootNav --> CheckAuth{Is Authenticated?}
    
    CheckAuth -->|No| AuthStack[Auth Stack]
    CheckAuth -->|Yes| MainTabs[Main Tabs]
    
    AuthStack --> Login[Login Screen]
    AuthStack --> Register[Register Screen]
    AuthStack --> ForgotPassword[Forgot Password]
    AuthStack --> PhoneVerification[Phone Verification]
    
    MainTabs --> HomeTab[Home Tab]
    MainTabs --> WalletTab[Wallet Tab]
    MainTabs --> AnalyticsTab[Analytics Tab]
    MainTabs --> StreakTab[Streak Tab]
    MainTabs --> ProfileTab[Profile Tab]
    
    HomeTab --> HomeStack[Home Stack]
    HomeStack --> HomeScreen[Home Screen]
    HomeStack --> MissionDetail[Mission Detail Modal]
    HomeStack --> MissionCompletion[Mission Completion Modal]
    HomeStack --> ProofCapture[Proof Capture Screen]
    
    WalletTab --> WalletStack[Wallet Stack]
    WalletStack --> WalletScreen[Wallet Screen]
    WalletStack --> TransactionHistory[Transaction History]
    WalletStack --> RedeemVoucher[Redeem Voucher]
    WalletStack --> VoucherDetails[Voucher Details]
    
    AnalyticsTab --> AnalyticsStack[Analytics Stack]
    AnalyticsStack --> PhoneActivity[Phone Activity Screen]
    AnalyticsStack --> WeeklySummary[Weekly Summary]
    AnalyticsStack --> MonthlySummary[Monthly Summary]
    AnalyticsStack --> Insights[Insights Screen]
    AnalyticsStack --> CustomReport[Custom Report]
    
    StreakTab --> StreakStack[Streak Stack]
    StreakStack --> StreakDashboard[Streak Dashboard]
    StreakStack --> Statistics[Statistics Screen]
    StreakStack --> Leaderboard[Leaderboard]
    StreakStack --> AchievementBadges[Achievement Badges]
    
    ProfileTab --> ProfileStack[Profile Stack]
    ProfileStack --> ProfileScreen[Profile Screen]
    ProfileStack --> Settings[Settings]
    ProfileStack --> NotificationPrefs[Notification Preferences]
    ProfileStack --> Privacy[Privacy Screen]
    ProfileStack --> HelpFAQ[Help & FAQ]
```

### 6. Notification Flow

```mermaid
flowchart TD
    Trigger[Event Trigger] --> NotificationService[Notification Service]
    
    Trigger --> MissionExpiring[Mission Expiring < 1 hour]
    Trigger --> BonusEarned[Bonus Earned]
    Trigger --> StreakReminder[Streak Reminder]
    Trigger --> StreakLost[Streak Lost]
    Trigger --> MissionReady[New Mission Ready]
    
    NotificationService --> CheckPrefs{User Preferences}
    CheckPrefs -->|Disabled| Skip[Skip Notification]
    CheckPrefs -->|Enabled| CreateNotification[Create Notification Record]
    
    CreateNotification --> StoreDB[(Store in MongoDB)]
    StoreDB --> GetFCMToken[Get FCM Token]
    GetFCMToken --> SendFCM[Send via Firebase Cloud Messaging]
    
    SendFCM --> FCMResult{Success?}
    FCMResult -->|Yes| UpdateDelivered[Update is_delivered = true]
    FCMResult -->|No| LogError[Log Error]
    
    UpdateDelivered --> StoreDB
    LogError --> StoreDB
    
    SendFCM --> PushNotification[Push to Device]
    PushNotification --> DisplayNotification[Display Notification]
    DisplayNotification --> UserAction{User Action}
    
    UserAction -->|Tap| Navigate[Navigate to Relevant Screen]
    UserAction -->|Dismiss| Dismiss[Dismiss Notification]
    
    Navigate --> HomeScreen[Home Screen]
    Navigate --> MissionDetail[Mission Detail]
    Navigate --> WalletScreen[Wallet Screen]
    Navigate --> StreakDashboard[Streak Dashboard]
```

### 7. Data Synchronization Flow

```mermaid
flowchart TD
    AppOpen[App Opens] --> CheckConnection{Internet<br/>Connected?}
    CheckConnection -->|No| OfflineMode[Offline Mode]
    CheckConnection -->|Yes| LoadData[Load Initial Data]
    
    LoadData --> ParallelLoad[Parallel API Calls]
    ParallelLoad --> FetchMissions[Fetch Daily Missions]
    ParallelLoad --> FetchWallet[Fetch Wallet]
    ParallelLoad --> FetchStreak[Fetch Streak]
    
    FetchMissions --> StoreRedux1[Store in Redux]
    FetchWallet --> StoreRedux2[Store in Redux]
    FetchStreak --> StoreRedux3[Store in Redux]
    
    StoreRedux1 --> UpdateUI[Update UI]
    StoreRedux2 --> UpdateUI
    StoreRedux3 --> UpdateUI
    
    UpdateUI --> StartPolling[Start Polling]
    StartPolling --> PollInterval[Every 30 seconds]
    PollInterval --> PollMissions[Poll Missions API]
    PollMissions --> CompareData{Data Changed?}
    CompareData -->|Yes| UpdateRedux[Update Redux Store]
    CompareData -->|No| Wait[Wait for Next Poll]
    UpdateRedux --> UpdateUI
    Wait --> PollInterval
    
    OfflineMode --> ShowOffline[Show Offline Indicator]
    ShowOffline --> RetryConnection{Retry Connection?}
    RetryConnection -->|Yes| CheckConnection
    RetryConnection -->|No| CacheData[Use Cached Data]
    
    CacheData --> DisplayCached[Display Cached Missions]
    DisplayCached --> QueueActions[Queue User Actions]
    QueueActions --> SyncOnConnect[Sync When Connected]
    SyncOnConnect --> CheckConnection
```

---

## Key Architectural Patterns

### 1. **Layered Architecture**
- **Presentation Layer**: React Native UI components
- **State Management Layer**: Redux store with slices
- **API Layer**: Express.js REST API
- **Service Layer**: Business logic engines (MissionEngine, RewardEngine, etc.)
- **Data Layer**: MongoDB with Mongoose ODM

### 2. **Transaction Management**
- MongoDB transactions for atomic wallet updates
- Ensures data consistency during reward crediting
- Prevents race conditions in concurrent requests

### 3. **Rate Limiting**
- Redis-based rate limiting middleware
- Prevents API abuse and fraud
- Configurable limits per endpoint

### 4. **Authentication & Authorization**
- JWT-based authentication
- Token stored securely on client
- Middleware validates tokens on each request

### 5. **Error Handling**
- Centralized error handling in controllers
- User-friendly error messages
- Comprehensive logging for debugging

### 6. **Caching Strategy**
- Redis for session and rate limit data
- Redux for client-side state caching
- MongoDB indexes for query optimization

---

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Cache**: Redis
- **File Storage**: Cloudinary
- **Authentication**: JWT

### Frontend
- **Framework**: React Native
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation
- **UI Components**: Custom components with Expo
- **Animations**: React Native Reanimated

### External Services
- **Fitness API**: Google Fit
- **Push Notifications**: Firebase Cloud Messaging (FCM)
- **Image Storage**: Cloudinary

---

## Security Considerations

1. **Password Hashing**: bcrypt with salt rounds
2. **JWT Tokens**: Secure token generation and validation
3. **Rate Limiting**: Prevents brute force attacks
4. **Input Validation**: Server-side validation for all inputs
5. **File Upload Security**: Cloudinary integration with validation
6. **Fraud Detection**: Fraud score tracking in MissionAttempt

---

*Last Updated: 2024*