import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/Common';
import { LoginPage, RegisterPage } from './pages/Auth';
import { DashboardPage } from './pages/Dashboard';
import { ExpensePage } from './pages/Expense';
import { BudgetPage } from './pages/Budget';
import { GoalPage } from './pages/Goal';
import { IncomePage } from './pages/Income';
import { ReportPage } from './pages/Report';
import { ProfilePage } from './pages/Profile';
import './App.css';

function ProtectedRoute({ element }) {
  const { token } = useAuth();
  return token ? element : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const { token } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      <Route path="/dashboard" element={<ProtectedRoute element={<Layout><DashboardPage /></Layout>} />} />
      <Route path="/expenses" element={<ProtectedRoute element={<Layout><ExpensePage /></Layout>} />} />
      <Route path="/budgets" element={<ProtectedRoute element={<Layout><BudgetPage /></Layout>} />} />
      <Route path="/goals" element={<ProtectedRoute element={<Layout><GoalPage /></Layout>} />} />
      <Route path="/income" element={<ProtectedRoute element={<Layout><IncomePage /></Layout>} />} />
      <Route path="/reports" element={<ProtectedRoute element={<Layout><ReportPage /></Layout>} />} />
      <Route path="/profile" element={<ProtectedRoute element={<Layout><ProfilePage /></Layout>} />} />
      
      <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} replace />} />
      <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
