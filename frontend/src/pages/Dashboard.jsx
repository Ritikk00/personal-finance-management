import React, { useState, useEffect } from 'react';
import { Card, LoadingSpinner, Alert } from '../components/Common';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { getExpenseStats, getIncomeStats, getFinancialSummary, getBudgetStatus, getGoals } from '../utils/api';

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [incomeStats, setIncomeStats] = useState(null);
  const [summary, setSummary] = useState(null);
  const [budgetStatus, setBudgetStatus] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const today = new Date().toISOString().split('T')[0];

      const [expenseRes, incomeRes, summaryRes, budgetRes, goalsRes] = await Promise.all([
        getExpenseStats({ startDate: thirtyDaysAgo, endDate: today }),
        getIncomeStats({ startDate: thirtyDaysAgo, endDate: today }),
        getFinancialSummary({ startDate: thirtyDaysAgo, endDate: today }),
        getBudgetStatus(),
        getGoals({ limit: 5 }),
      ]);

      setStats(expenseRes.data);
      setIncomeStats(incomeRes.data);
      setSummary(summaryRes.data);
      setBudgetStatus(budgetRes.data);
      setGoals(goalsRes.data.goals || []);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const expenseCategoryData = {
    labels: Object.keys(stats?.byCategory || {}),
    datasets: [
      {
        label: 'Expenses by Category',
        data: Object.values(stats?.byCategory || {}),
        backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'],
      },
    ],
  };

  const incomeCategoryData = {
    labels: Object.keys(incomeStats?.bySource || {}),
    datasets: [
      {
        label: 'Income by Source',
        data: Object.values(incomeStats?.bySource || {}),
        backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6'],
      },
    ],
  };

  const alertBudgets = budgetStatus.filter((b) => b.status !== 'Normal');

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <p className="text-gray-600 text-sm">Total Income (30 days)</p>
          <p className="text-3xl font-bold text-green-600">${summary?.totalIncome.toFixed(2)}</p>
        </Card>
        <Card>
          <p className="text-gray-600 text-sm">Total Expenses (30 days)</p>
          <p className="text-3xl font-bold text-red-600">${summary?.totalExpenses.toFixed(2)}</p>
        </Card>
        <Card>
          <p className="text-gray-600 text-sm">Balance</p>
          <p className={`text-3xl font-bold ${summary?.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${summary?.balance.toFixed(2)}
          </p>
        </Card>
        <Card>
          <p className="text-gray-600 text-sm">Savings Rate</p>
          <p className="text-3xl font-bold text-blue-600">{summary?.savingsRate}%</p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-semibold text-lg mb-4">Expenses by Category (30 days)</h3>
          <Pie data={expenseCategoryData} />
        </Card>
        <Card>
          <h3 className="font-semibold text-lg mb-4">Income by Source (30 days)</h3>
          <Pie data={incomeCategoryData} />
        </Card>
      </div>

      {/* Budget Alerts */}
      {alertBudgets.length > 0 && (
        <Card className="border-l-4 border-yellow-500 bg-yellow-50">
          <h3 className="font-semibold text-lg mb-4 text-yellow-800">Budget Alerts</h3>
          <div className="space-y-2">
            {alertBudgets.map((budget) => (
              <div key={budget._id} className="flex justify-between items-center p-2 bg-white rounded">
                <span className="font-medium">{budget.category}</span>
                <span className={budget.status === 'Exceeded' ? 'text-red-600 font-bold' : 'text-yellow-600 font-bold'}>
                  {budget.percentageUsed}% used
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Goals Section */}
      {goals.length > 0 && (
        <Card>
          <h3 className="font-semibold text-lg mb-4">Goals</h3>
          <div className="space-y-4">
            {goals.map((goal) => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100;
              return (
                <div key={goal._id} className="border-b pb-4 last:border-b-0">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-800">{goal.title}</span>
                    <span className="text-sm text-gray-600">${goal.currentAmount} / ${goal.targetAmount}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.min(progress, 100)}%` }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{Math.round(progress)}% complete</p>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
};
