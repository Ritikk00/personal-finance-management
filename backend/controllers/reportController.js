const Expense = require('../models/Expense');
const Income = require('../models/Income');
const Budget = require('../models/Budget');
const Goal = require('../models/Goal');
const pdfMake = require('pdfmake/build/pdfmake');
const pdfFonts = require('pdfmake/build/vfs_fonts');
const { json2csv } = require('json2csv');

// Set up PDF fonts
if (pdfFonts && pdfFonts.pdfMake) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
} else {
  // Fallback for different pdfmake versions
  pdfMake.vfs = pdfFonts.vfs;
}

exports.generateExpenseReport = async (req, res) => {
  try {
    const { startDate, endDate, format = 'json' } = req.query;

    let query = { userId: req.user.userId };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // Fetch all data
    const [expenses, incomes, budgets, goals] = await Promise.all([
      Expense.find(query).sort({ date: -1 }),
      Income.find(query).sort({ date: -1 }),
      Budget.find({ userId: req.user.userId }),
      Goal.find({ userId: req.user.userId }),
    ]);

    const expenseStats = {
      totalExpenses: expenses.reduce((sum, exp) => sum + exp.amount, 0),
      byCategory: {},
      byPaymentMethod: {},
      averageDailyExpense: 0,
    };

    expenses.forEach((expense) => {
      expenseStats.byCategory[expense.category] = (expenseStats.byCategory[expense.category] || 0) + expense.amount;
      expenseStats.byPaymentMethod[expense.paymentMethod] = (expenseStats.byPaymentMethod[expense.paymentMethod] || 0) + expense.amount;
    });

    const incomeStats = {
      totalIncome: incomes.reduce((sum, inc) => sum + inc.amount, 0),
      bySource: {},
    };

    incomes.forEach((income) => {
      incomeStats.bySource[income.source] = (incomeStats.bySource[income.source] || 0) + income.amount;
    });

    if (expenses.length > 0) {
      const days = Math.ceil((new Date(endDate || Date.now()) - new Date(startDate || Date.now())) / (1000 * 60 * 60 * 24));
      expenseStats.averageDailyExpense = Math.round((expenseStats.totalExpenses / days) * 100) / 100;
    }

    if (format === 'csv') {
      try {
        // Combine all data for CSV
        const csvData = [
          ['EXPENSES'],
          ['date', 'category', 'description', 'amount', 'paymentMethod', 'notes'],
          ...expenses.map(exp => [
            exp.date ? new Date(exp.date).toLocaleDateString() : '',
            exp.category || '',
            exp.description || '',
            exp.amount || 0,
            exp.paymentMethod || '',
            exp.notes || '',
          ]),
          [],
          ['INCOME'],
          ['date', 'source', 'amount', 'category'],
          ...incomes.map(inc => [
            inc.date ? new Date(inc.date).toLocaleDateString() : '',
            inc.source || '',
            inc.amount || 0,
            inc.category || '',
          ]),
          [],
          ['BUDGETS'],
          ['category', 'budget', 'spent', 'remaining', 'percentageUsed'],
          ...budgets.map(b => {
            const percentageUsed = (b.spent / b.amount) * 100;
            return [
              b.category,
              b.amount.toFixed(2),
              b.spent.toFixed(2),
              (b.amount - b.spent).toFixed(2),
              Math.round(percentageUsed) + '%',
            ];
          }),
          [],
          ['GOALS'],
          ['title', 'targetAmount', 'currentAmount', 'progress', 'targetDate', 'status'],
          ...goals.map(g => {
            const progress = (g.currentAmount / g.targetAmount) * 100;
            return [
              g.title,
              g.targetAmount.toFixed(2),
              g.currentAmount.toFixed(2),
              Math.round(progress) + '%',
              g.targetDate ? new Date(g.targetDate).toLocaleDateString() : '',
              g.status,
            ];
          }),
          [],
          ['SUMMARY'],
          ['Total Income', incomeStats.totalIncome.toFixed(2)],
          ['Total Expenses', expenseStats.totalExpenses.toFixed(2)],
          ['Balance', (incomeStats.totalIncome - expenseStats.totalExpenses).toFixed(2)],
        ];

        let csv = csvData.map(row => row.join(',')).join('\n');
        
        res.header('Content-Type', 'text/csv; charset=utf-8');
        res.header('Content-Disposition', 'attachment; filename="financial-report.csv"');
        res.send(csv);
      } catch (csvError) {
        console.error('CSV Generation Error:', csvError);
        return res.status(400).json({ message: 'Failed to generate CSV', error: csvError.message });
      }
    } else if (format === 'pdf') {
      const budgetRows = budgets.map(b => {
        const percentageUsed = (b.spent / b.amount) * 100;
        return [
          b.category,
          `$${b.amount.toFixed(2)}`,
          `$${b.spent.toFixed(2)}`,
          `${Math.round(percentageUsed)}%`,
        ];
      });

      const goalRows = goals.map(g => {
        const progress = (g.currentAmount / g.targetAmount) * 100;
        return [
          g.title,
          `$${g.targetAmount.toFixed(2)}`,
          `$${g.currentAmount.toFixed(2)}`,
          `${Math.round(progress)}%`,
          g.status,
        ];
      });

      const docDefinition = {
        content: [
          { text: 'Financial Report', style: 'header' },
          { text: `Period: ${startDate || 'All'} to ${endDate || 'All'}`, style: 'subheader', margin: [0, 0, 0, 10] },
          
          // Summary
          {
            text: 'Summary',
            style: 'subheader',
            margin: [0, 20, 0, 10],
          },
          {
            table: {
              headerRows: 0,
              widths: ['*', '*'],
              body: [
                ['Total Income', `$${incomeStats.totalIncome.toFixed(2)}`],
                ['Total Expenses', `$${expenseStats.totalExpenses.toFixed(2)}`],
                ['Balance', `$${(incomeStats.totalIncome - expenseStats.totalExpenses).toFixed(2)}`],
              ],
            },
            margin: [0, 0, 0, 20],
          },

          // Expenses by Category
          {
            text: 'Expenses by Category',
            style: 'subheader',
            margin: [0, 0, 0, 10],
          },
          {
            table: {
              headerRows: 1,
              widths: ['*', '*'],
              body: [
                ['Category', 'Amount'],
                ...Object.entries(expenseStats.byCategory).map(([cat, amount]) => [cat, `$${amount.toFixed(2)}`]),
              ],
            },
            margin: [0, 0, 0, 20],
          },

          // Income by Source
          {
            text: 'Income by Source',
            style: 'subheader',
            margin: [0, 0, 0, 10],
          },
          {
            table: {
              headerRows: 1,
              widths: ['*', '*'],
              body: [
                ['Source', 'Amount'],
                ...Object.entries(incomeStats.bySource).map(([source, amount]) => [source, `$${amount.toFixed(2)}`]),
              ],
            },
            margin: [0, 0, 0, 20],
          },

          // Budgets
          budgets.length > 0 ? {
            text: 'Budget Status',
            style: 'subheader',
            margin: [0, 0, 0, 10],
          } : null,
          budgets.length > 0 ? {
            table: {
              headerRows: 1,
              widths: ['*', '*', '*', '*'],
              body: [
                ['Category', 'Budget', 'Spent', '% Used'],
                ...budgetRows,
              ],
            },
            margin: [0, 0, 0, 20],
          } : null,

          // Goals
          goals.length > 0 ? {
            text: 'Goals Progress',
            style: 'subheader',
            margin: [0, 0, 0, 10],
          } : null,
          goals.length > 0 ? {
            table: {
              headerRows: 1,
              widths: ['*', '*', '*', '*', '*'],
              body: [
                ['Goal', 'Target', 'Current', 'Progress', 'Status'],
                ...goalRows,
              ],
            },
            margin: [0, 0, 0, 20],
          } : null,
        ].filter(el => el !== null),
        styles: {
          header: { fontSize: 24, bold: true, margin: [0, 0, 0, 20] },
          subheader: { fontSize: 14, bold: true },
        },
      };

      const pdfDoc = pdfMake.createPdf(docDefinition);
      pdfDoc.getBase64((base64) => {
        res.header('Content-Type', 'application/pdf');
        res.header('Content-Disposition', 'attachment; filename="financial-report.pdf"');
        res.send(Buffer.from(base64, 'base64'));
      });
    } else {
      res.json({ expenseStats, incomeStats, expenses, incomes, budgets, goals });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.generateBudgetReport = async (req, res) => {
  try {
    const { format = 'json' } = req.query;

    const budgets = await Budget.find({ userId: req.user.userId, isActive: true });

    const report = budgets.map((budget) => {
      const percentageUsed = (budget.spent / budget.amount) * 100;
      return {
        ...budget.toObject(),
        percentageUsed: Math.round(percentageUsed),
        remaining: Math.max(0, budget.amount - budget.spent),
        status: percentageUsed > 100 ? 'Exceeded' : percentageUsed >= budget.alertThreshold ? 'Alert' : 'Normal',
      };
    });

    if (format === 'csv') {
      const csv = json2csv.parse(report);
      res.header('Content-Type', 'text/csv');
      res.header('Content-Disposition', 'attachment; filename="budget-report.csv"');
      res.send(csv);
    } else if (format === 'pdf') {
      const docDefinition = {
        content: [
          { text: 'Budget Report', style: 'header' },
          {
            table: {
              headerRows: 1,
              widths: ['*', '*', '*', '*', '*'],
              body: [
                ['Category', 'Budget', 'Spent', '% Used', 'Status'],
                ...report.map((b) => [
                  b.category,
                  `$${b.amount.toFixed(2)}`,
                  `$${b.spent.toFixed(2)}`,
                  `${b.percentageUsed}%`,
                  b.status,
                ]),
              ],
            },
          },
        ],
        styles: {
          header: { fontSize: 24, bold: true, margin: [0, 0, 0, 20] },
        },
      };

      const pdfDoc = pdfMake.createPdf(docDefinition);
      pdfDoc.getBase64((base64) => {
        res.header('Content-Type', 'application/pdf');
        res.header('Content-Disposition', 'attachment; filename="budget-report.pdf"');
        res.send(Buffer.from(base64, 'base64'));
      });
    } else {
      res.json(report);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.generateIncomeReport = async (req, res) => {
  try {
    const { startDate, endDate, format = 'json' } = req.query;

    let query = { userId: req.user.userId };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const incomes = await Income.find(query).sort({ date: -1 });

    const stats = {
      totalIncome: incomes.reduce((sum, inc) => sum + inc.amount, 0),
      bySource: {},
      byCategory: {},
    };

    incomes.forEach((income) => {
      stats.bySource[income.source] = (stats.bySource[income.source] || 0) + income.amount;
      stats.byCategory[income.category] = (stats.byCategory[income.category] || 0) + income.amount;
    });

    if (format === 'csv') {
      const csv = json2csv.parse(incomes);
      res.header('Content-Type', 'text/csv');
      res.header('Content-Disposition', 'attachment; filename="income-report.csv"');
      res.send(csv);
    } else if (format === 'pdf') {
      const docDefinition = {
        content: [
          { text: 'Income Report', style: 'header' },
          { text: `Total Income: $${stats.totalIncome.toFixed(2)}`, margin: [0, 10, 0, 20] },
          { text: 'Income by Source', style: 'subheader', margin: [0, 0, 0, 10] },
          {
            table: {
              headerRows: 1,
              widths: ['*', '*'],
              body: [
                ['Source', 'Amount'],
                ...Object.entries(stats.bySource).map(([source, amount]) => [source, `$${amount.toFixed(2)}`]),
              ],
            },
          },
        ],
        styles: {
          header: { fontSize: 24, bold: true, margin: [0, 0, 0, 20] },
          subheader: { fontSize: 14, bold: true },
        },
      };

      const pdfDoc = pdfMake.createPdf(docDefinition);
      pdfDoc.getBase64((base64) => {
        res.header('Content-Type', 'application/pdf');
        res.header('Content-Disposition', 'attachment; filename="income-report.pdf"');
        res.send(Buffer.from(base64, 'base64'));
      });
    } else {
      res.json({ stats, incomes });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getFinancialSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let expenseQuery = { userId: req.user.userId };
    let incomeQuery = { userId: req.user.userId };

    if (startDate || endDate) {
      expenseQuery.date = {};
      incomeQuery.date = {};
      if (startDate) {
        expenseQuery.date.$gte = new Date(startDate);
        incomeQuery.date.$gte = new Date(startDate);
      }
      if (endDate) {
        expenseQuery.date.$lte = new Date(endDate);
        incomeQuery.date.$lte = new Date(endDate);
      }
    }

    const expenses = await Expense.find(expenseQuery);
    const incomes = await Income.find(incomeQuery);

    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);
    const balance = totalIncome - totalExpenses;

    res.json({
      totalIncome,
      totalExpenses,
      balance,
      savingsRate: totalIncome > 0 ? Math.round(((balance / totalIncome) * 100) * 100) / 100 : 0,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
