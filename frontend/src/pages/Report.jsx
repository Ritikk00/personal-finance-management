import React, { useState, useEffect } from 'react';
import { Card, Button, LoadingSpinner, Alert } from '../components/Common';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { getExpenseStats, getFinancialSummary, generateExpenseReport, generateBudgetReport } from '../utils/api';

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export const ReportPage = () => {
  const [expenseStats, setExpenseStats] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [startDate, setStartDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const [statsRes, summaryRes] = await Promise.all([
        getExpenseStats({ startDate, endDate }),
        getFinancialSummary({ startDate, endDate }),
      ]);
      setExpenseStats(statsRes.data);
      setSummary(summaryRes.data);
    } catch (err) {
      setError('Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = async () => {
    try {
      setError('');
      console.log('Exporting CSV with dates:', { startDate, endDate });
      
      const response = await generateExpenseReport(
        { startDate, endDate, format: 'csv' },
        { responseType: 'blob' }
      );
      
      console.log('CSV Response received:', response.status, response.data);
      
      if (!response.data || response.data.size === 0) {
        setError('No data to export. Please ensure you have expenses in the selected date range.');
        return;
      }

      const blob = response.data instanceof Blob ? response.data : new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `expenses-${startDate}-to-${endDate}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setSuccess('CSV exported successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('CSV Export Error:', err.response || err);
      setError('Failed to export to CSV: ' + (err.response?.data?.message || err.message || 'Unknown error'));
    }
  };

  const exportToPDF = async () => {
    try {
      setError('');
      console.log('Exporting PDF with dates:', { startDate, endDate });
      
      const response = await generateExpenseReport(
        { startDate, endDate, format: 'pdf' },
        { responseType: 'blob' }
      );
      
      console.log('PDF Response received:', response.status, response.data);
      
      if (!response.data || response.data.size === 0) {
        setError('No data to export. Please ensure you have expenses in the selected date range.');
        return;
      }

      const blob = response.data instanceof Blob ? response.data : new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `expenses-report-${startDate}-to-${endDate}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setSuccess('PDF exported successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('PDF Export Error:', err.response || err);
      setError('Failed to export to PDF: ' + (err.response?.data?.message || err.message || 'Unknown error'));
    }
  };

  if (loading) return <LoadingSpinner />;

  const categoryChartData = {
    labels: Object.keys(expenseStats?.byCategory || {}),
    datasets: [
      {
        label: 'Expenses by Category',
        data: Object.values(expenseStats?.byCategory || {}),
        backgroundColor: [
          '#3B82F6',
          '#10B981',
          '#F59E0B',
          '#EF4444',
          '#8B5CF6',
          '#EC4899',
        ],
      },
    ],
  };

  const paymentMethodChartData = {
    labels: Object.keys(expenseStats?.byPaymentMethod || {}),
    datasets: [
      {
        label: 'Expenses by Payment Method',
        data: Object.values(expenseStats?.byPaymentMethod || {}),
        backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
      },
    ],
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Financial Reports</h1>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <p className="text-gray-600 text-sm">Total Income</p>
          <p className="text-3xl font-bold text-green-600">${summary?.totalIncome.toFixed(2)}</p>
        </Card>
        <Card>
          <p className="text-gray-600 text-sm">Total Expenses</p>
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

      <div className="flex gap-4 mb-6">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg"
        />
        <Button onClick={fetchReportData} variant="primary">Filter</Button>
        <Button onClick={exportToCSV} variant="secondary">Export CSV</Button>
        <Button onClick={exportToPDF} variant="secondary">Export PDF</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-semibold text-lg mb-4">Expenses by Category</h3>
          <Pie data={categoryChartData} />
        </Card>
        <Card>
          <h3 className="font-semibold text-lg mb-4">Expenses by Payment Method</h3>
          <Pie data={paymentMethodChartData} />
        </Card>
      </div>
    </div>
  );
};
