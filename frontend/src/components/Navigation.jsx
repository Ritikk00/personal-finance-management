import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Expenses', path: '/expenses' },
    { label: 'Income', path: '/income' },
    { label: 'Budgets', path: '/budgets' },
    { label: 'Goals', path: '/goals' },
    { label: 'Reports', path: '/reports' },
    { label: 'Profile', path: '/profile' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-600 focus:ring-white rounded-md px-2 py-1">
              💰 Finance Manager
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 ${
                  isActive(item.path) ? 'bg-blue-700 text-white' : 'hover:bg-blue-700'
                }`}
              >
                {item.label}
              </Link>
            ))}
            {user && (
              <>
                <span className="text-sm px-6 py-3 rounded-sm bg-blue-800 font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2 focus:ring-offset-blue-600"> Welcome <br></br>{user.fullName}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-red-600"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <span className="text-2xl">☰</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-2 rounded-md text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 ${
                  isActive(item.path) ? 'bg-red-700 text-white' : 'hover:bg-red-700'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {user && (
              <>
                <div className="px-4 py-2 text-sm rounded-full bg-red-500 font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2 focus:ring-offset-red-600 mb-2">{user.fullName}</div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-red-600"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
