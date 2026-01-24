const Goal = require('../models/Goal');

exports.createGoal = async (req, res) => {
  try {
    const { title, description, targetAmount, category, targetDate, priority } = req.body;

    const goal = new Goal({
      userId: req.user.userId,
      title,
      description,
      targetAmount,
      category,
      targetDate: new Date(targetDate),
      priority,
    });

    await goal.save();

    res.status(201).json({ message: 'Goal created successfully', goal });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getGoals = async (req, res) => {
  try {
    const { status = 'Active', page = 1, limit = 10 } = req.query;

    const query = {
      userId: req.user.userId,
    };

    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const goals = await Goal.find(query)
      .sort({ priority: -1, targetDate: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Goal.countDocuments(query);

    res.json({
      goals,
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

exports.getGoalById = async (req, res) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    res.json(goal);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateGoal = async (req, res) => {
  try {
    const { title, description, targetAmount, currentAmount, category, targetDate, priority, status } = req.body;

    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      {
        title,
        description,
        targetAmount,
        currentAmount: currentAmount !== undefined ? currentAmount : undefined,
        category,
        targetDate: new Date(targetDate),
        priority,
        status,
        updatedAt: Date.now(),
      },
      { new: true }
    );

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    res.json({ message: 'Goal updated successfully', goal });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateGoalProgress = async (req, res) => {
  try {
    const { currentAmount } = req.body;

    const goal = await Goal.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    goal.currentAmount = currentAmount;

    if (currentAmount >= goal.targetAmount) {
      goal.status = 'Achieved';
    }

    await goal.save();

    res.json({ message: 'Goal progress updated successfully', goal });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getGoalProgress = async (req, res) => {
  try {
    const goals = await Goal.find({
      userId: req.user.userId,
      status: 'Active',
    });

    const progressData = goals.map((goal) => {
      const daysRemaining = Math.ceil((new Date(goal.targetDate) - new Date()) / (1000 * 60 * 60 * 24));
      const progress = (goal.currentAmount / goal.targetAmount) * 100;
      const monthlyRequired = daysRemaining > 0 ? (goal.targetAmount - goal.currentAmount) / (daysRemaining / 30) : 0;

      return {
        ...goal.toObject(),
        progress: Math.round(progress),
        daysRemaining: Math.max(0, daysRemaining),
        monthlyRequired: Math.round(monthlyRequired * 100) / 100,
      };
    });

    res.json(progressData);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
