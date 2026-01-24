const express = require('express');
const goalController = require('../controllers/goalController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, goalController.createGoal);
router.get('/', auth, goalController.getGoals);
router.get('/progress', auth, goalController.getGoalProgress);
router.get('/:id', auth, goalController.getGoalById);
router.put('/:id', auth, goalController.updateGoal);
router.put('/:id/progress', auth, goalController.updateGoalProgress);
router.delete('/:id', auth, goalController.deleteGoal);

module.exports = router;
