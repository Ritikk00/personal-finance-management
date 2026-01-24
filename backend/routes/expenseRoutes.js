const express = require('express');
const expenseController = require('../controllers/expenseController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, expenseController.createExpense);
router.get('/stats', auth, expenseController.getExpenseStats);
router.get('/', auth, expenseController.getExpenses);
router.get('/:id', auth, expenseController.getExpenseById);
router.put('/:id', auth, expenseController.updateExpense);
router.delete('/:id', auth, expenseController.deleteExpense);

module.exports = router;
