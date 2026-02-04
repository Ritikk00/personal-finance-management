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
      setBudgetStatus(budgetRes.data || []);
      setGoals(goalsRes.data.goals || []);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const hasExpenseData = stats && stats.byCategory && Object.keys(stats.byCategory).length > 0;
  const hasIncomeData = incomeStats && incomeStats.bySource && Object.keys(incomeStats.bySource).length > 0;

  const expenseCategoryData = {
    labels: hasExpenseData ? Object.keys(stats.byCategory) : ['No Data'],
    datasets: [
      {
        label: 'Expenses by Category',
        data: hasExpenseData ? Object.values(stats.byCategory) : [0],
        backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'],
        borderColor: '#fff',
        borderWidth: 2,
      },
    ],
  };

  const incomeCategoryData = {
    labels: hasIncomeData ? Object.keys(incomeStats.bySource) : ['No Data'],
    datasets: [
      {
        label: 'Income by Source',
        data: hasIncomeData ? Object.values(incomeStats.bySource) : [0],
        backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6'],
        borderColor: '#fff',
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
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
          <p className="text-3xl font-bold text-green-600">${summary?.periodTotalIncome?.toFixed(2) || '0.00'}</p>
        </Card>
        <Card>
          <p className="text-gray-600 text-sm">Total Expenses (30 days)</p>
          <p className="text-3xl font-bold text-red-600">${summary?.periodTotalExpenses?.toFixed(2) || '0.00'}</p>
        </Card>
        <Card>
          <p className="text-gray-600 text-sm">Available Balance</p>
          <p className={`text-3xl font-bold ${(summary?.overallBalance || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${summary?.overallBalance?.toFixed(2) || '0.00'}
          </p>
          <p className="text-xs text-gray-500 mt-1">Total Income - Total Expenses</p>
        </Card>
        <Card>
          <p className="text-gray-600 text-sm">Savings Rate</p>
          <p className="text-3xl font-bold text-blue-600">{summary?.savingsRate || 0}%</p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-semibold text-lg mb-4">Expenses by Category (30 days)</h3>
          {hasExpenseData ? (
            <div style={{ position: 'relative', height: '300px' }}>
              <Pie data={expenseCategoryData} options={chartOptions} />
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-500">
              <p>No expense data available for the selected period</p>
            </div>
          )}
        </Card>
        <Card>
          <h3 className="font-semibold text-lg mb-4">Income by Source (30 days)</h3>
          {hasIncomeData ? (
            <div style={{ position: 'relative', height: '300px' }}>
              <Pie data={incomeCategoryData} options={chartOptions} />
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-500">
              <p>No income data available for the selected period</p>
            </div>
          )}
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
                    <span className="text-sm text-gray-600">${goal.currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)}</span>
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
