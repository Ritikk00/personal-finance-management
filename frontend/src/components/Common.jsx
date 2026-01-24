import React from 'react';
import { Navigation } from './Navigation';

export const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {children}
    </div>
  );
};

export const Button = ({ children, onClick, type = 'button', className = '', variant = 'primary' }) => {
  const baseStyles = 'px-4 py-2 rounded-lg font-medium transition duration-200';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    success: 'bg-green-600 text-white hover:bg-green-700',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export const Input = ({ label, type = 'text', value, onChange, placeholder, className = '', ...props }) => {
  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 ${className}`}
        {...props}
      />
    </div>
  );
};

export const Select = ({ label, value, onChange, options, className = '' }) => {
  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      <select
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 ${className}`}
      >
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export const Alert = ({ type = 'info', message, onClose }) => {
  const colors = {
    info: 'bg-blue-100 text-blue-700 border-blue-300',
    success: 'bg-green-100 text-green-700 border-green-300',
    warning: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    error: 'bg-red-100 text-red-700 border-red-300',
  };

  return (
    <div className={`border ${colors[type]} p-4 rounded-lg mb-4 flex justify-between items-center`}>
      <p>{message}</p>
      <button onClick={onClose} className="text-lg">×</button>
    </div>
  );
};

export const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
};
