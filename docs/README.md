# Documentation

This directory contains comprehensive architecture and design documentation for the FOMO Mission Rewards application.

## Files

- **ARCHITECTURE.md** - Complete architecture documentation including:
  - ERD (Entity Relationship Diagram)
  - DRD (Data Relationship Diagram)
  - User Journey / Flow diagrams

## How to View Diagrams

The documentation uses Mermaid diagrams which can be viewed in:

1. **GitHub/GitLab**: Native Mermaid support in markdown files
2. **VS Code**: Install "Markdown Preview Mermaid Support" extension
3. **Online**: Copy diagram code to [Mermaid Live Editor](https://mermaid.live)
4. **Documentation Sites**: Most modern documentation platforms support Mermaid

## Quick Reference

### ERD (Entity Relationship Diagram)
Shows all database entities and their relationships:
- User, Mission, MissionAttempt, Reward, Wallet, Streak, PhoneActivity, Notification

### DRD (Data Relationship Diagram)
Illustrates data flow through the system:
- Client → API → Services → Database
- External service integrations

### User Journey / Flow Diagrams
Covers all major user flows:
1. Authentication Flow
2. Mission Discovery & Completion Flow
3. Reward & Wallet Flow
4. Streak Management Flow
5. Navigation Flow
6. Notification Flow
7. Data Synchronization Flow

## Architecture Overview

The application follows a **layered architecture** pattern:

```
┌─────────────────────────────────┐
│   Presentation Layer (React)    │
├─────────────────────────────────┤
│   State Management (Redux)      │
├─────────────────────────────────┤
│   API Layer (Express.js)        │
├─────────────────────────────────┤
│   Service Layer (Engines)        │
├─────────────────────────────────┤
│   Data Layer (MongoDB/Redis)     │
└─────────────────────────────────┘
```

## Key Components

### Backend Services
- **MissionEngine**: Manages mission lifecycle and attempts
- **RewardEngine**: Calculates and credits rewards
- **StreakManager**: Tracks and updates user streaks
- **NotificationService**: Handles push notifications
- **ActivityVerification**: Verifies mission completion

### Frontend Screens
- **Home**: Mission discovery and completion
- **Wallet**: Balance and transaction history
- **Analytics**: Phone activity and insights
- **Streak**: Streak tracking and achievements
- **Profile**: User settings and preferences

## Database Schema

The application uses MongoDB with the following collections:
- `users` - User accounts and preferences
- `missions` - Daily mission definitions
- `missionattempts` - User mission completion attempts
- `rewards` - Reward transaction records
- `wallets` - User wallet balances
- `streaks` - User streak tracking
- `phoneactivities` - Daily phone usage data
- `notifications` - Push notification records

## API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `PUT /auth/username` - Update username

### Missions
- `GET /missions/daily` - Get daily missions
- `GET /missions/:id` - Get mission details
- `POST /missions/:id/complete` - Complete mission

### Rewards
- `GET /rewards/wallet` - Get wallet balance
- `GET /rewards/history` - Get reward history

### Streaks
- `GET /streaks/current` - Get current streak
- `GET /streaks/stats` - Get streak statistics

### Phone Activity
- `POST /phone-activity` - Submit phone activity data
- `GET /phone-activity` - Get activity history

## External Integrations

- **Google Fit API**: For step count and activity verification
- **Firebase Cloud Messaging**: For push notifications
- **Cloudinary**: For image storage and processing

## Security

- JWT-based authentication
- bcrypt password hashing
- Rate limiting on sensitive endpoints
- Input validation and sanitization
- Fraud detection scoring

---

For detailed information, see [ARCHITECTURE.md](./ARCHITECTURE.md)