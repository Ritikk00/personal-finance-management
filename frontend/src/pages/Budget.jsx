import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Select, Alert, LoadingSpinner, Modal } from '../components/Common';
import { createBudget, getBudgets, updateBudget, deleteBudget, getBudgetStatus } from '../utils/api';

export const BudgetPage = () => {
  const [budgets, setbudgets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    category: 'Groceries',
    amount: '',
    period: 'Monthly',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    alertThreshold: 80,
  });

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const response = await getBudgets();
      setbudgets(response.data.budgets);
    } catch (err) {
      setError('Failed to load budgets');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateBudget(editingId, formData);
        setSuccess('Budget updated successfully');
      } else {
        await createBudget(formData);
        setSuccess('Budget created successfully');
      }
      setFormData({
        category: 'Groceries',
        amount: '',
        period: 'Monthly',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        alertThreshold: 80,
      });
      setEditingId(null);
      setShowModal(false);
      fetchBudgets();
    } catch (err) {
      setError('Failed to save budget');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteBudget(id);
        setSuccess('Budget deleted successfully');
        fetchBudgets();
      } catch (err) {
        setError('Failed to delete budget');
      }
    }
  };

  const categories = [
    { value: 'Groceries', label: 'Groceries' },
    { value: 'Entertainment', label: 'Entertainment' },
    { value: 'Utilities', label: 'Utilities' },
    { value: 'Transportation', label: 'Transportation' },
    { value: 'Healthcare', label: 'Healthcare' },
  ];

  const periods = [
    { value: 'Weekly', label: 'Weekly' },
    { value: 'Monthly', label: 'Monthly' },
    { value: 'Yearly', label: 'Yearly' },
  ];

  if (loading && budgets.length === 0) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Budgets</h1>
        <Button onClick={() => { setShowModal(true); setEditingId(null); }} variant="primary">
          Create Budget
        </Button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingId ? 'Edit Budget' : 'Create Budget'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            options={categories}
          />
          <Input
            label="Budget Amount"
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            placeholder="0.00"
            step="0.01"
            required
          />
          <Select
            label="Period"
            value={formData.period}
            onChange={(e) => setFormData({ ...formData, period: e.target.value })}
            options={periods}
          />
          <Input
            label="Start Date"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            required
          />
          <Input
            label="End Date"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            required
          />
          <Input
            label="Alert Threshold (%)"
            type="number"
            value={formData.alertThreshold}
            onChange={(e) => setFormData({ ...formData, alertThreshold: e.target.value })}
            min="0"
            max="100"
            required
          />
          <Button type="submit" className="w-full">Save</Button>
        </form>
      </Modal>

      <div className="grid gap-4">
        {budgets.map((budget) => {
          const percentageUsed = (budget.spent / budget.amount) * 100;
          const statusColor = percentageUsed > 100 ? 'red' : percentageUsed >= budget.alertThreshold ? 'yellow' : 'green';
          return (
            <Card key={budget._id} className="border-l-4" style={{ borderLeftColor: statusColor === 'red' ? '#ef4444' : statusColor === 'yellow' ? '#f59e0b' : '#10b981' }}>
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{budget.category}</h3>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${statusColor === 'red' ? 'bg-red-600' : statusColor === 'yellow' ? 'bg-yellow-600' : 'bg-green-600'}`}
                      style={{ width: `${Math.min(percentageUsed, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">${budget.spent.toFixed(2)} / ${budget.amount.toFixed(2)}</p>
                </div>
                <div className="space-x-2 ml-4">
                  <Button
                    onClick={() => {
                      setFormData({
                        category: budget.category,
                        amount: budget.amount,
                        period: budget.period,
                        startDate: new Date(budget.startDate).toISOString().split('T')[0],
                        endDate: new Date(budget.endDate).toISOString().split('T')[0],
                        alertThreshold: budget.alertThreshold,
                      });
                      setEditingId(budget._id);
                      setShowModal(true);
                    }}
                    variant="secondary"
                    className="py-1 px-3 text-sm"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(budget._id)}
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
