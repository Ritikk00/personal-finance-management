# Personal Finance Manager - Frontend

## Overview
The frontend of the Personal Finance Manager is a modern, responsive web application built with React and Vite. It provides a user-friendly interface for managing personal finances including budgets, expenses, income, goals, and financial reports.

## Tech Stack
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Styling Tool**: PostCSS
- **HTTP Client**: Axios (api.js)

## Project Structure
```
src/
├── components/      # Reusable UI components
│   ├── Common.jsx
│   └── Navigation.jsx
├── context/        # React Context for state management
│   └── AuthContext.jsx
├── pages/          # Page components
│   ├── Auth.jsx
│   ├── Budget.jsx
│   ├── Dashboard.jsx
│   ├── Expense.jsx
│   ├── Goal.jsx
│   ├── Income.jsx
│   ├── Profile.jsx
│   └── Report.jsx
├── utils/          # Utility functions
│   └── api.js
├── App.jsx         # Main App component
├── index.jsx       # Entry point
├── App.css         # App styles
└── index.css       # Global styles
```

## Features
- User authentication and profile management
- Dashboard with financial overview
- Budget creation and management
- Expense tracking
- Income logging
- Financial goal setting and tracking
- Financial reports and analytics

## Installation
```bash
npm install
```

## Development
```bash
npm run dev
```
This will start the Vite development server with hot module replacement.

## Build
```bash
npm run build
```
Creates an optimized production build in the `dist` folder.

## Environment Variables
Configure your backend API endpoint in the `.env` file:
```
VITE_API_URL=http://localhost:5000/api
```

## Configuration Files
- **vite.config.js**: Vite configuration
- **tailwind.config.js**: Tailwind CSS customization
- **postcss.config.js**: PostCSS plugins configuration
