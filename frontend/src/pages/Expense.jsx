import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Select, Alert, LoadingSpinner, Modal } from '../components/Common';
import { createExpense, getExpenses, updateExpense, deleteExpense } from '../utils/api';

export const ExpensePage = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    amount: '',
    category: 'Groceries',
    description: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'Card',
    notes: '',
  });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const response = await getExpenses({ limit: 20 });
      setExpenses(response.data.expenses);
    } catch (err) {
      setError('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateExpense(editingId, formData);
        setSuccess('Expense updated successfully');
      } else {
        await createExpense(formData);
        setSuccess('Expense added successfully');
      }
      setFormData({
        amount: '',
        category: 'Groceries',
        description: '',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'Card',
        notes: '',
      });
      setEditingId(null);
      setShowModal(false);
      fetchExpenses();
    } catch (err) {
      setError('Failed to save expense');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteExpense(id);
        setSuccess('Expense deleted successfully');
        fetchExpenses();
      } catch (err) {
        setError('Failed to delete expense');
      }
    }
  };

  const categories = [
    { value: 'Groceries', label: 'Groceries' },
    { value: 'Entertainment', label: 'Entertainment' },
    { value: 'Utilities', label: 'Utilities' },
    { value: 'Transportation', label: 'Transportation' },
    { value: 'Healthcare', label: 'Healthcare' },
    { value: 'Other', label: 'Other' },
  ];

  const paymentMethods = [
    { value: 'Cash', label: 'Cash' },
    { value: 'Card', label: 'Card' },
    { value: 'Bank Transfer', label: 'Bank Transfer' },
    { value: 'Digital Wallet', label: 'Digital Wallet' },
  ];

  if (loading && expenses.length === 0) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Expenses</h1>
        <Button onClick={() => { setShowModal(true); setEditingId(null); }} variant="primary">
          Add Expense
        </Button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingId ? 'Edit Expense' : 'Add Expense'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Amount"
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            placeholder="0.00"
            step="0.01"
            required
          />
          <Select
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            options={categories}
          />
          <Input
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Expense description"
          />
          <Input
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
          <Select
            label="Payment Method"
            value={formData.paymentMethod}
            onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
            options={paymentMethods}
          />
          <Input
            label="Notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Additional notes"
          />
          <Button type="submit" className="w-full">Save</Button>
        </form>
      </Modal>

      <div className="grid gap-4">
        {expenses.map((expense) => (
          <Card key={expense._id}>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">{expense.description || expense.category}</h3>
                <p className="text-gray-600 text-sm">{new Date(expense.date).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-red-600">${expense.amount.toFixed(2)}</p>
                <p className="text-gray-600 text-sm">{expense.category}</p>
              </div>
              <div className="space-x-2">
                <Button
                  onClick={() => {
                    setFormData({
                      amount: expense.amount,
                      category: expense.category,
                      description: expense.description,
                      date: new Date(expense.date).toISOString().split('T')[0],
                      paymentMethod: expense.paymentMethod,
                      notes: expense.notes,
                    });
                    setEditingId(expense._id);
                    setShowModal(true);
                  }}
                  variant="secondary"
                  className="py-1 px-3 text-sm"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(expense._id)}
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
