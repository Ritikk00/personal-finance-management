import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Select, Alert, LoadingSpinner, Modal } from '../components/Common';
import { createIncome, getIncome, updateIncome, deleteIncome, getIncomeStats } from '../utils/api';

export const IncomePage = () => {
  const [incomes, setIncomes] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    source: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    isRecurring: false,
    recurringFrequency: 'Monthly',
    category: 'Salary',
  });

  useEffect(() => {
    fetchIncome();
  }, []);

  const fetchIncome = async () => {
    setLoading(true);
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const today = new Date().toISOString().split('T')[0];

      const [incomeRes, statsRes] = await Promise.all([
        getIncome({ limit: 20 }),
        getIncomeStats({ startDate: thirtyDaysAgo, endDate: today }),
      ]);

      setIncomes(incomeRes.data.incomes);
      setStats(statsRes.data);
    } catch (err) {
      setError('Failed to load income');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateIncome(editingId, formData);
        setSuccess('Income updated successfully');
      } else {
        await createIncome(formData);
        setSuccess('Income added successfully');
      }
      setFormData({
        source: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        isRecurring: false,
        recurringFrequency: 'Monthly',
        category: 'Salary',
      });
      setEditingId(null);
      setShowModal(false);
      fetchIncome();
    } catch (err) {
      setError('Failed to save income');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteIncome(id);
        setSuccess('Income deleted successfully');
        fetchIncome();
      } catch (err) {
        setError('Failed to delete income');
      }
    }
  };

  const frequencies = [
    { value: 'Daily', label: 'Daily' },
    { value: 'Weekly', label: 'Weekly' },
    { value: 'Monthly', label: 'Monthly' },
    { value: 'Yearly', label: 'Yearly' },
  ];

  if (loading && incomes.length === 0) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Income</h1>
        <Button onClick={() => { setShowModal(true); setEditingId(null); }} variant="primary">
          Add Income
        </Button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      {/* Income Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <p className="text-gray-600 text-sm">Total Income (30 days)</p>
            <p className="text-3xl font-bold text-green-600">${stats.totalIncome.toFixed(2)}</p>
          </Card>
          <Card>
            <p className="text-gray-600 text-sm">Income Sources</p>
            <p className="text-3xl font-bold text-blue-600">{Object.keys(stats.bySource || {}).length}</p>
          </Card>
          <Card>
            <p className="text-gray-600 text-sm">Average Per Source</p>
            <p className="text-3xl font-bold text-purple-600">
              $
              {Object.keys(stats.bySource || {}).length > 0
                ? (stats.totalIncome / Object.keys(stats.bySource || {}).length).toFixed(2)
                : '0.00'}
            </p>
          </Card>
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingId ? 'Edit Income' : 'Add Income'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Income Source"
            value={formData.source}
            onChange={(e) => setFormData({ ...formData, source: e.target.value })}
            placeholder="e.g., Salary, Freelance, Investment"
            required
          />
          <Input
            label="Amount"
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            placeholder="0.00"
            step="0.01"
            required
          />
          <Input
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
          <Input
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Income description"
          />
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isRecurring}
                onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                className="mr-2"
              />
              <span>Recurring Income</span>
            </label>
          </div>
          {formData.isRecurring && (
            <Select
              label="Frequency"
              value={formData.recurringFrequency}
              onChange={(e) => setFormData({ ...formData, recurringFrequency: e.target.value })}
              options={frequencies}
            />
          )}
          <Button type="submit" className="w-full">Save</Button>
        </form>
      </Modal>

      <div className="grid gap-4">
        {incomes.map((income) => (
          <Card key={income._id}>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">{income.source}</h3>
                <p className="text-gray-600 text-sm">{new Date(income.date).toLocaleDateString()}</p>
                {income.description && <p className="text-gray-600 text-sm mt-1">{income.description}</p>}
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">${income.amount.toFixed(2)}</p>
                <p className="text-gray-600 text-sm">{income.category}</p>
                {income.isRecurring && <p className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded mt-1">Recurring</p>}
              </div>
              <div className="space-x-2">
                <Button
                  onClick={() => {
                    setFormData({
                      source: income.source,
                      amount: income.amount,
                      date: new Date(income.date).toISOString().split('T')[0],
                      description: income.description,
                      isRecurring: income.isRecurring,
                      recurringFrequency: income.recurringFrequency,
                      category: income.category,
                    });
                    setEditingId(income._id);
                    setShowModal(true);
                  }}
                  variant="secondary"
                  className="py-1 px-3 text-sm"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(income._id)}
                  variant="danger"
                  className="py-1 px-3 text-sm"
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
