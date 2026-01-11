const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const Wallet = require('../models/Wallet');
const Streak = require('../models/Streak');
const { authenticateToken } = require('../middleware/auth');

router.post('/register', async (req, res) => {
  try {
    const { email, password, timezone, deviceId } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required',
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User already exists',
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Generate username from email (part before @)
    const emailParts = email.toLowerCase().split('@');
    const baseUsername = emailParts[0].charAt(0).toUpperCase() + emailParts[0].slice(1);
    
    // Check if username already exists, if so add a number
    let username = baseUsername;
    let counter = 1;
    while (await User.findOne({ username })) {
      username = `${baseUsername}${counter}`;
      counter++;
    }

    // Create user
    const userId = uuidv4();
    const user = new User({
      user_id: userId,
      email: email.toLowerCase(),
      username: username,
      password_hash: passwordHash,
      timezone: timezone || 'UTC',
      current_device_id: deviceId || null,
    });
    await user.save();

    const wallet = new Wallet({
      wallet_id: uuidv4(),
      user_id: userId,
      total_balance: 0,
    });
    await wallet.save();

    const streak = new Streak({
      streak_id: uuidv4(),
      user_id: userId,
      current_streak_count: 0,
      max_streak_ever: 0,
      multiplier: 1.0,
    });
    await streak.save();

    const token = jwt.sign(
      { user_id: userId, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      success: true,
      data: {
        user: {
          user_id: userId,
          email: user.email,
          username: user.username,
          timezone: user.timezone,
        },
        token,
      },
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to register user',
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password, deviceId } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    user.last_activity_at = new Date();
    if (deviceId) {
      user.current_device_id = deviceId;
    }
    await user.save();

    const token = jwt.sign(
      { user_id: user.user_id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      success: true,
      data: {
        user: {
          user_id: user.user_id,
          email: user.email,
          username: user.username || (user.email ? user.email.split('@')[0].charAt(0).toUpperCase() + user.email.split('@')[0].slice(1) : 'User'),
          timezone: user.timezone,
        },
        token,
      },
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to login',
    });
  }
});

router.put('/username', authenticateToken, async (req, res) => {
  try {
    const { username } = req.body;
    const userId = req.user.user_id;

    if (!username || username.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Username is required',
      });
    }

    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
    if (!usernameRegex.test(username.trim())) {
      return res.status(400).json({
        success: false,
        error: 'Username must be 3-20 characters and contain only letters, numbers, underscores, or hyphens',
      });
    }

    const existingUser = await User.findOne({ 
      username: username.trim(),
      user_id: { $ne: userId }
    });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Username already taken',
      });
    }

    const user = await User.findOne({ user_id: userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    user.username = username.trim();
    await user.save();

    res.json({
      success: true,
      data: {
        user: {
          user_id: user.user_id,
          email: user.email,
          username: user.username,
          timezone: user.timezone,
        },
      },
    });
  } catch (error) {
    console.error('Error updating username:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update username',
    });
  }
});

module.exports = router;
