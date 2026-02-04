import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Alert, LoadingSpinner, Modal } from '../components/Common';
import { createGoal, getGoals, updateGoal, deleteGoal, addFundsToGoal } from '../utils/api';

export const GoalPage = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showFundsModal, setShowFundsModal] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState(null);
  const [fundAmount, setFundAmount] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetAmount: '',
    category: 'Savings',
    targetDate: '',
    priority: 'Medium',
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const response = await getGoals({ status: 'Active' });
      setGoals(response.data.goals);
    } catch (err) {
      setError('Failed to load goals');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateGoal(editingId, formData);
        setSuccess('Goal updated successfully');
      } else {
        await createGoal(formData);
        setSuccess('Goal created successfully');
      }
      setFormData({
        title: '',
        description: '',
        targetAmount: '',
        category: 'Savings',
        targetDate: '',
        priority: 'Medium',
      });
      setEditingId(null);
      setShowModal(false);
      fetchGoals();
    } catch (err) {
      setError('Failed to save goal');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteGoal(id);
        setSuccess('Goal deleted successfully');
        fetchGoals();
      } catch (err) {
        setError('Failed to delete goal');
      }
    }
  };

  const handleAddFunds = async () => {
    try {
      if (!fundAmount || fundAmount <= 0) {
        setError('Please enter a valid amount');
        return;
      }
      await addFundsToGoal(selectedGoalId, { amount: parseFloat(fundAmount) });
      setSuccess('Funds added to goal successfully');
      setFundAmount('');
      setShowFundsModal(false);
      setSelectedGoalId(null);
      fetchGoals();
    } catch (err) {
      setError('Failed to add funds to goal');
    }
  };

  if (loading && goals.length === 0) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Financial Goals</h1>
        <Button onClick={() => { setShowModal(true); setEditingId(null); }} variant="primary">
          Add Goal
        </Button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingId ? 'Edit Goal' : 'Create Goal'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Goal Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., Save for Vacation"
            required
          />
          <Input
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Goal description"
          />
          <Input
            label="Target Amount"
            type="number"
            value={formData.targetAmount}
            onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
            placeholder="0.00"
            step="0.01"
            required
          />
          <Input
            label="Target Date"
            type="date"
            value={formData.targetDate}
            onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
            required
          />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <Button type="submit" className="w-full">Save</Button>
        </form>
      </Modal>

      <Modal isOpen={showFundsModal} onClose={() => { setShowFundsModal(false); setFundAmount(''); }} title="Add Funds to Goal">
        <div className="space-y-4">
          <Input
            label="Amount to Add"
            type="number"
            value={fundAmount}
            onChange={(e) => setFundAmount(e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0"
            required
          />
          <div className="flex gap-2">
            <Button onClick={handleAddFunds} className="flex-1">Add Funds</Button>
            <Button onClick={() => { setShowFundsModal(false); setFundAmount(''); }} variant="secondary" className="flex-1">Cancel</Button>
          </div>
        </div>
      </Modal>

      <div className="grid gap-4">
        {goals.map((goal) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;
          const daysRemaining = Math.ceil((new Date(goal.targetDate) - new Date()) / (1000 * 60 * 60 * 24));
          
          return (
            <Card key={goal._id}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{goal.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{goal.description}</p>
                  <div className="space-y-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-blue-600"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      ></div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Current</p>
                        <p className="font-semibold">${goal.currentAmount.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Target</p>
                        <p className="font-semibold">${goal.targetAmount.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Days Left</p>
                        <p className="font-semibold">{Math.max(0, daysRemaining)}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-x-2 ml-4">
                  <Button
                    onClick={() => {
                      setSelectedGoalId(goal._id);
                      setShowFundsModal(true);
                    }}
                    variant="primary"
                    className="py-1 px-3 text-sm"
                  >
                    Add Funds
                  </Button>
                  <Button
                    onClick={() => {
                      setFormData({
                        title: goal.title,
                        description: goal.description,
                        targetAmount: goal.targetAmount,
                        category: goal.category,
                        targetDate: new Date(goal.targetDate).toISOString().split('T')[0],
                        priority: goal.priority,
                      });
                      setEditingId(goal._id);
                      setShowModal(true);
                    }}
                    variant="secondary"
                    className="py-1 px-3 text-sm"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(goal._id)}
                    variant="danger"
                    className="py-1 px-3 text-sm"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
