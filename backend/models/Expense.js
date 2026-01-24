const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Card', 'Bank Transfer', 'Digital Wallet'],
    default: 'Card',
  },
  isRecurring: {
    type: Boolean,
    default: false,
  },
  recurringFrequency: {
    type: String,
    enum: ['Daily', 'Weekly', 'Monthly', 'Yearly', null],
    default: null,
  },
  recurringExpenseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RecurringExpense',
    default: null,
  },
  notes: {
    type: String,
    default: '',
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

module.exports = mongoose.model('Expense', expenseSchema);
