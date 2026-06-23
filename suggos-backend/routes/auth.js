const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

/* GET /api/auth/check-username/:username — live availability check */
router.get('/check-username/:username', async (req, res) => {
  try {
    const username = req.params.username.toLowerCase().trim();

    if (username.length < 3) {
      return res.json({ available: false, message: 'Too short' });
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return res.json({ available: false, message: 'Only letters, numbers, underscores allowed' });
    }

    const existing = await User.findOne({ username });
    res.json({
      available: !existing,
      message: existing ? 'Username already taken' : 'Username available',
    });
  } catch (err) {
    res.status(500).json({ available: false, message: 'Server error checking username' });
  }
});

/* POST /api/auth/signup */
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, captchaAnswer, captchaExpected } = req.body;

    if (
      captchaAnswer === undefined ||
      captchaExpected === undefined ||
      Number(captchaAnswer) !== Number(captchaExpected)
    ) {
      return res.status(400).json({ error: 'Captcha verification failed. Please try again.' });
    }

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are all required.' });
    }

    const cleanUsername = username.toLowerCase().trim();
    const cleanEmail = email.toLowerCase().trim();

    const existingUsername = await User.findOne({ username: cleanUsername });
    if (existingUsername) {
      return res.status(409).json({ error: 'That username is already taken.' });
    }

    const existingEmail = await User.findOne({ email: cleanEmail });
    if (existingEmail) {
      return res.status(409).json({ error: 'An account with that email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username: cleanUsername,
      email: cleanEmail,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Account created successfully!',
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(409).json({ error: `That ${field} is already taken.` });
    }
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

/* POST /api/auth/login */
router.post('/login', async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;
    if (!emailOrUsername || !password) {
      return res.status(400).json({ error: 'Please provide your email/username and password.' });
    }

    const identifier = emailOrUsername.toLowerCase().trim();
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    }).select('+password');

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Logged in successfully!',
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

module.exports = router;
