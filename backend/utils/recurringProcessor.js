const Income = require('../models/Income');
const Expense = require('../models/Expense');

// Process recurring income - should be called daily or on schedule
exports.processRecurringIncome = async () => {
  try {
    const recurringIncomes = await Income.find({ isRecurring: true });

    for (const income of recurringIncomes) {
      const lastIncome = await Income.findOne({
        $and: [
          { userId: income.userId },
          { source: income.source },
          { _id: { $ne: income._id } },
        ],
      }).sort({ date: -1 });

      if (!lastIncome) continue;

      const lastDate = new Date(lastIncome.date);
      const today = new Date();
      const nextDate = calculateNextRecurringDate(lastDate, income.recurringFrequency);

      // If next date is today or earlier, create a new income entry
      if (nextDate <= today) {
        const newIncome = new Income({
          userId: income.userId,
          source: income.source,
          amount: income.amount,
          date: nextDate,
          description: income.description,
          isRecurring: true,
          recurringFrequency: income.recurringFrequency,
          category: income.category,
        });

        await newIncome.save();
        console.log(`Created recurring income for user ${income.userId}: ${income.source}`);
      }
    }

    console.log('Recurring income processing completed');
  } catch (error) {
    console.error('Error processing recurring income:', error);
  }
};

// Process recurring expenses - similar logic
exports.processRecurringExpenses = async () => {
  try {
    const recurringExpenses = await Expense.find({ isRecurring: true });

    for (const expense of recurringExpenses) {
      const lastExpense = await Expense.findOne({
        $and: [
          { userId: expense.userId },
          { category: expense.category },
          { _id: { $ne: expense._id } },
        ],
      }).sort({ date: -1 });

      if (!lastExpense) continue;

      const lastDate = new Date(lastExpense.date);
      const today = new Date();
      const nextDate = calculateNextRecurringDate(lastDate, expense.recurringFrequency);

      // If next date is today or earlier, create a new expense entry
      if (nextDate <= today) {
        const newExpense = new Expense({
          userId: expense.userId,
          amount: expense.amount,
          category: expense.category,
          description: expense.description,
          date: nextDate,
          paymentMethod: expense.paymentMethod,
          isRecurring: true,
          recurringFrequency: expense.recurringFrequency,
          notes: expense.notes,
        });

        await newExpense.save();
        console.log(`Created recurring expense for user ${expense.userId}: ${expense.category}`);
      }
    }

    console.log('Recurring expense processing completed');
  } catch (error) {
    console.error('Error processing recurring expense:', error);
  }
};

// Calculate next occurrence date based on frequency
function calculateNextRecurringDate(lastDate, frequency) {
  const nextDate = new Date(lastDate);

  switch (frequency) {
    case 'Daily':
      nextDate.setDate(nextDate.getDate() + 1);
      break;
    case 'Weekly':
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case 'Monthly':
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case 'Yearly':
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
    default:
      nextDate.setMonth(nextDate.getMonth() + 1);
  }

  return nextDate;
}
