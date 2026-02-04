import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Auth
export const register = (data) =>
  axios.post(`${API_URL}/auth/register`, data);

export const login = (data) =>
  axios.post(`${API_URL}/auth/login`, data);

export const getProfile = () =>
  axios.get(`${API_URL}/auth/profile`, { headers: getAuthHeader() });

export const updateProfile = (data) =>
  axios.put(`${API_URL}/auth/profile`, data, { headers: getAuthHeader() });

// Expenses
export const createExpense = (data) =>
  axios.post(`${API_URL}/expenses`, data, { headers: getAuthHeader() });

export const getExpenses = (params) =>
  axios.get(`${API_URL}/expenses`, { params, headers: getAuthHeader() });

export const getExpenseStats = (params) =>
  axios.get(`${API_URL}/expenses/stats`, { params, headers: getAuthHeader() });

export const updateExpense = (id, data) =>
  axios.put(`${API_URL}/expenses/${id}`, data, { headers: getAuthHeader() });

export const deleteExpense = (id) =>
  axios.delete(`${API_URL}/expenses/${id}`, { headers: getAuthHeader() });

// Budgets
export const createBudget = (data) =>
  axios.post(`${API_URL}/budgets`, data, { headers: getAuthHeader() });

export const getBudgets = (params) =>
  axios.get(`${API_URL}/budgets`, { params, headers: getAuthHeader() });

export const getBudgetStatus = () =>
  axios.get(`${API_URL}/budgets/status`, { headers: getAuthHeader() });

export const updateBudget = (id, data) =>
  axios.put(`${API_URL}/budgets/${id}`, data, { headers: getAuthHeader() });

export const deleteBudget = (id) =>
  axios.delete(`${API_URL}/budgets/${id}`, { headers: getAuthHeader() });

// Goals
export const createGoal = (data) =>
  axios.post(`${API_URL}/goals`, data, { headers: getAuthHeader() });

export const getGoals = (params) =>
  axios.get(`${API_URL}/goals`, { params, headers: getAuthHeader() });

export const getGoalProgress = () =>
  axios.get(`${API_URL}/goals/progress`, { headers: getAuthHeader() });

export const updateGoal = (id, data) =>
  axios.put(`${API_URL}/goals/${id}`, data, { headers: getAuthHeader() });

export const updateGoalProgress = (id, data) =>
  axios.put(`${API_URL}/goals/${id}/progress`, data, { headers: getAuthHeader() });

export const addFundsToGoal = (id, data) =>
  axios.put(`${API_URL}/goals/${id}/add-funds`, data, { headers: getAuthHeader() });

export const deleteGoal = (id) =>
  axios.delete(`${API_URL}/goals/${id}`, { headers: getAuthHeader() });

// Income
export const createIncome = (data) =>
  axios.post(`${API_URL}/income`, data, { headers: getAuthHeader() });

export const getIncome = (params) =>
  axios.get(`${API_URL}/income`, { params, headers: getAuthHeader() });

export const getIncomeStats = (params) =>
  axios.get(`${API_URL}/income/stats`, { params, headers: getAuthHeader() });

export const updateIncome = (id, data) =>
  axios.put(`${API_URL}/income/${id}`, data, { headers: getAuthHeader() });

export const deleteIncome = (id) =>
  axios.delete(`${API_URL}/income/${id}`, { headers: getAuthHeader() });

// Reports
export const generateExpenseReport = (params, config) =>
  axios.get(`${API_URL}/reports/expenses`, { params, headers: getAuthHeader(), ...config });

export const generateBudgetReport = (params) =>
  axios.get(`${API_URL}/reports/budgets`, { params, headers: getAuthHeader() });

export const generateIncomeReport = (params) =>
  axios.get(`${API_URL}/reports/income`, { params, headers: getAuthHeader() });

export const getFinancialSummary = (params) =>
  axios.get(`${API_URL}/reports/summary`, { params, headers: getAuthHeader() });
