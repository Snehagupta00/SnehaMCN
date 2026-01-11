# Sharp Rewards Server

Backend API server for the Micro Missions system.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment

```bash
node setup-env.js
```

This creates a `.env` file with default configuration. Edit it as needed.

### 3. Start MongoDB

Make sure MongoDB is running:

```bash
mongod
```

### 4. Seed Sample Missions (Optional)

```bash
npm run seed
```

### 5. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3000`

## Environment Variables

All environment variables are stored in `server/.env`. Key variables:

- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 3000)
- `CLOUDINARY_*` - Cloudinary credentials (optional)
- `FIREBASE_*` - Firebase credentials (optional)

## API Endpoints

- `GET /health` - Health check
- `POST /api/v1/auth/register` - Register user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/missions/daily` - Get daily missions
- `POST /api/v1/missions/:id/complete` - Complete mission
- `GET /api/v1/rewards/wallet` - Get wallet balance
- `GET /api/v1/streaks/current` - Get current streak

## Project Structure

```
server/
├── config/          # Database configuration
├── controllers/     # Request handlers
├── middleware/       # Auth, rate limiting, upload
├── models/          # MongoDB schemas
├── routes/          # API routes
├── services/        # Business logic
├── utils/           # Helpers, cron jobs, seed data
├── .env             # Environment variables
├── index.js         # Entry point
└── package.json     # Dependencies
```

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed sample missions
- `npm test` - Run tests

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`

### Redis Connection Error
- Ensure Redis is running: `redis-server`
- Check Redis host/port in `.env`

### Port Already in Use
- Change `PORT` in `.env`
- Or kill the process using the port
