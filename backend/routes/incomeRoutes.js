const express = require('express');
const incomeController = require('../controllers/incomeController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, incomeController.createIncome);
router.get('/', auth, incomeController.getIncome);
router.get('/stats', auth, incomeController.getIncomeStats);
router.put('/:id', auth, incomeController.updateIncome);
router.delete('/:id', auth, incomeController.deleteIncome);

module.exports = router;
