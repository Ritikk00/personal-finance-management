const Expense = require('../models/Expense');
const Budget = require('../models/Budget');

exports.createExpense = async (req, res) => {
  try {
    const { amount, category, description, date, paymentMethod, isRecurring, recurringFrequency, notes } = req.body;

    // Validate required fields
    if (!amount || !category) {
      return res.status(400).json({ message: 'Amount and category are required' });
    }

    const expense = new Expense({
      userId: req.user.userId,
      amount: parseFloat(amount),
      category,
      description: description || '',
      date: date ? new Date(date) : new Date(),
      paymentMethod: paymentMethod || 'Card',
      isRecurring: isRecurring || false,
      recurringFrequency: isRecurring ? recurringFrequency : null,
      notes: notes || '',
    });

    await expense.save();

    // Update budget spent amount
    if (category) {
      const budget = await Budget.findOne({
        userId: req.user.userId,
        category: category,
        startDate: { $lte: new Date(date || Date.now()) },
        endDate: { $gte: new Date(date || Date.now()) },
      });

      if (budget) {
        budget.spent = (budget.spent || 0) + parseFloat(amount);
        await budget.save();
      }
    }

    res.status(201).json({ message: 'Expense created successfully', expense });
  } catch (error) {
    console.error('Expense creation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const { category, startDate, endDate, page = 1, limit = 10 } = req.query;

    let query = { userId: req.user.userId };

    if (category) {
      query.category = category;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;

    const expenses = await Expense.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Expense.countDocuments(query);

    res.json({
      expenses,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: parseInt(page),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const { amount, category, description, date, paymentMethod, notes } = req.body;

    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      {
        amount,
        category,
        description,
        date,
        paymentMethod,
        notes,
        updatedAt: Date.now(),
      },
      { new: true }
    );

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json({ message: 'Expense updated successfully', expense });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Update budget
    const budget = await Budget.findOne({
      userId: req.user.userId,
      category: expense.category,
      startDate: { $lte: expense.date },
      endDate: { $gte: expense.date },
    });

    if (budget) {
      budget.spent = Math.max(0, budget.spent - expense.amount);
      await budget.save();
    }

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getExpenseStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let query = { userId: req.user.userId };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const expenses = await Expense.find(query);

    const stats = {
      totalExpenses: expenses.reduce((sum, exp) => sum + exp.amount, 0),
      byCategory: {},
      byPaymentMethod: {},
    };

    expenses.forEach((expense) => {
      stats.byCategory[expense.category] = (stats.byCategory[expense.category] || 0) + expense.amount;
      stats.byPaymentMethod[expense.paymentMethod] = (stats.byPaymentMethod[expense.paymentMethod] || 0) + expense.amount;
    });

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
