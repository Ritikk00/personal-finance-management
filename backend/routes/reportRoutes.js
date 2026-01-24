const express = require('express');
const reportController = require('../controllers/reportController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/expenses', auth, reportController.generateExpenseReport);
router.get('/budgets', auth, reportController.generateBudgetReport);
router.get('/income', auth, reportController.generateIncomeReport);
router.get('/summary', auth, reportController.getFinancialSummary);

module.exports = router;
