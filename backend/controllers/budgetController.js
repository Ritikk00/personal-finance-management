const Budget = require('../models/Budget');

exports.createBudget = async (req, res) => {
  try {
    const { category, amount, period, startDate, endDate, alertThreshold } = req.body;

    const budget = new Budget({
      userId: req.user.userId,
      category,
      amount,
      period,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      alertThreshold,
      isActive: true,
      spent: 0,
    });

    await budget.save();

    res.status(201).json({ message: 'Budget created successfully', budget });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getBudgets = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    let query = { userId: req.user.userId };

    const skip = (page - 1) * limit;

    const budgets = await Budget.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Budget.countDocuments(query);

    res.json({
      budgets,
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

exports.getBudgetById = async (req, res) => {
  try {
    const budget = await Budget.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    res.json(budget);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateBudget = async (req, res) => {
  try {
    const { amount, period, startDate, endDate, alertThreshold, isActive } = req.body;

    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      {
        amount,
        period,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        alertThreshold,
        isActive,
        updatedAt: Date.now(),
      },
      { new: true }
    );

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    res.json({ message: 'Budget updated successfully', budget });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    res.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.checkBudgetStatus = async (req, res) => {
  try {
    const budgets = await Budget.find({
      userId: req.user.userId,
      isActive: true,
    });

    const budgetStatus = budgets.map((budget) => {
      const percentageUsed = (budget.spent / budget.amount) * 100;
      const isExceeded = percentageUsed > 100;
      const isAlerted = percentageUsed >= budget.alertThreshold;

      return {
        ...budget.toObject(),
        percentageUsed: Math.round(percentageUsed),
        remaining: Math.max(0, budget.amount - budget.spent),
        status: isExceeded ? 'Exceeded' : isAlerted ? 'Alert' : 'Normal',
      };
    });

    res.json(budgetStatus);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
