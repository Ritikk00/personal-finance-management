const Income = require('../models/Income');

exports.createIncome = async (req, res) => {
  try {
    const { source, amount, date, description, isRecurring, recurringFrequency, category } = req.body;

    const income = new Income({
      userId: req.user.userId,
      source,
      amount,
      date: date || Date.now(),
      description,
      isRecurring,
      recurringFrequency: isRecurring ? recurringFrequency : null,
      category,
    });

    await income.save();

    res.status(201).json({ message: 'Income created successfully', income });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getIncome = async (req, res) => {
  try {
    const { startDate, endDate, page = 1, limit = 10 } = req.query;

    let query = { userId: req.user.userId };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;

    const incomes = await Income.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Income.countDocuments(query);

    res.json({
      incomes,
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

exports.getIncomeStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let query = { userId: req.user.userId };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const incomes = await Income.find(query);

    const stats = {
      totalIncome: incomes.reduce((sum, inc) => sum + inc.amount, 0),
      bySource: {},
      byCategory: {},
      averageMonthlyIncome: 0,
    };

    incomes.forEach((income) => {
      stats.bySource[income.source] = (stats.bySource[income.source] || 0) + income.amount;
      stats.byCategory[income.category] = (stats.byCategory[income.category] || 0) + income.amount;
    });

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateIncome = async (req, res) => {
  try {
    const { source, amount, date, description, category } = req.body;

    const income = await Income.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      {
        source,
        amount,
        date,
        description,
        category,
        updatedAt: Date.now(),
      },
      { new: true }
    );

    if (!income) {
      return res.status(404).json({ message: 'Income not found' });
    }

    res.json({ message: 'Income updated successfully', income });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteIncome = async (req, res) => {
  try {
    const income = await Income.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!income) {
      return res.status(404).json({ message: 'Income not found' });
    }

    res.json({ message: 'Income deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
