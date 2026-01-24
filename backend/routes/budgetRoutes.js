const express = require('express');
const budgetController = require('../controllers/budgetController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, budgetController.createBudget);
router.get('/', auth, budgetController.getBudgets);
router.get('/status', auth, budgetController.checkBudgetStatus);
router.get('/:id', auth, budgetController.getBudgetById);
router.put('/:id', auth, budgetController.updateBudget);
router.delete('/:id', auth, budgetController.deleteBudget);

module.exports = router;
