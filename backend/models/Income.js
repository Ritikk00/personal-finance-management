const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  description: {
    type: String,
    default: '',
  },
  isRecurring: {
    type: Boolean,
    default: false,
  },
  recurringFrequency: {
    type: String,
    enum: ['Daily', 'Weekly', 'Monthly', 'Yearly'],
    default: null,
  },
  category: {
    type: String,
    default: 'Salary',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Income', incomeSchema);
