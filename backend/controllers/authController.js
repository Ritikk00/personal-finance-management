const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

exports.register = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
    }

    const { fullName, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({
      fullName,
      email,
      password,
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        currency: user.currency,
        categories: user.categories,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { fullName, currency, categories, notificationPreferences } = req.body;

    // Validation
    if (!fullName || fullName.trim().length === 0) {
      return res.status(400).json({ message: 'Full name is required' });
    }

    if (fullName.length > 100) {
      return res.status(400).json({ message: 'Full name must be less than 100 characters' });
    }

    // Validate currency if provided
    const validCurrencies = ['USD', 'EUR', 'GBP', 'INR'];
    if (currency && !validCurrencies.includes(currency)) {
      return res.status(400).json({ message: 'Invalid currency' });
    }

    // Validate categories
    if (categories && (!Array.isArray(categories) || categories.length === 0)) {
      return res.status(400).json({ message: 'Categories must be a non-empty array' });
    }

    if (categories && categories.some(cat => typeof cat !== 'string' || cat.trim().length === 0)) {
      return res.status(400).json({ message: 'All categories must be non-empty strings' });
    }

    // Validate notification preferences
    if (notificationPreferences) {
      if (typeof notificationPreferences !== 'object') {
        return res.status(400).json({ message: 'Notification preferences must be an object' });
      }

      if (notificationPreferences.emailNotifications !== undefined && typeof notificationPreferences.emailNotifications !== 'boolean') {
        return res.status(400).json({ message: 'emailNotifications must be a boolean' });
      }

      if (notificationPreferences.budgetAlerts !== undefined && typeof notificationPreferences.budgetAlerts !== 'boolean') {
        return res.status(400).json({ message: 'budgetAlerts must be a boolean' });
      }

      if (notificationPreferences.goalReminders !== undefined && typeof notificationPreferences.goalReminders !== 'boolean') {
        return res.status(400).json({ message: 'goalReminders must be a boolean' });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {
        fullName: fullName.trim(),
        currency: currency || 'USD',
        categories: categories || ['Groceries', 'Entertainment', 'Utilities', 'Transportation', 'Healthcare', 'Other'],
        notificationPreferences: notificationPreferences || {
          emailNotifications: true,
          budgetAlerts: true,
          goalReminders: true,
        },
        updatedAt: Date.now(),
      },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
