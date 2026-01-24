# Personal Finance Manager

A comprehensive financial management application built with the MERN stack (MongoDB, Express, React, Node.js) to help users track expenses, manage budgets, plan finances, and achieve financial goals.

## Features

### Expense Tracking
- Record expenses with amount, date, category, and description
- Categorize expenses (Groceries, Entertainment, Utilities, Transportation, Healthcare, etc.)
- Support for recurring expenses
- Multiple payment methods (Cash, Card, Bank Transfer, Digital Wallet)

### Budgeting
- Create and manage budgets for different categories
- Set spending limits and track budget adherence
- Real-time budget usage monitoring
- Budget alerts when thresholds are reached
- Support for different time periods (Weekly, Monthly, Yearly)

### Financial Planning
- Set financial goals with target amounts and deadlines
- Track progress towards goals
- Priority-based goal management (Low, Medium, High)
- Automatic status updates (Active, Achieved, Cancelled)

### Income Tracking
- Record income from various sources
- Track income by category and source
- Support for recurring income

### Financial Reports
- Generate detailed expense, budget, and income reports
- Visual representations with charts and graphs
- Export data to CSV and PDF formats
- Financial summary with income, expenses, and savings rate

### User Management
- Secure user authentication with JWT
- Profile management and preferences
- Customizable categories and currency
- Notification preferences

## Tech Stack

- **Frontend:** React 18, React Router, TailwindCSS, Chart.js, Axios
- **Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT
- **Export Tools:** pdfmake, json2csv
- **Styling:** TailwindCSS
- **Charts:** Chart.js with react-chartjs-2

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```
MONGODB_URI=mongodb://localhost:27017/personal-finance-manager
JWT_SECRET=your-secret-key-change-this
PORT=5000
NODE_ENV=development
```

4. Start the backend server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Expenses
- `POST /api/expenses` - Create expense
- `GET /api/expenses` - Get all expenses
- `GET /api/expenses/stats` - Get expense statistics
- `GET /api/expenses/:id` - Get expense by ID
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Budgets
- `POST /api/budgets` - Create budget
- `GET /api/budgets` - Get all budgets
- `GET /api/budgets/status` - Check budget status
- `GET /api/budgets/:id` - Get budget by ID
- `PUT /api/budgets/:id` - Update budget
- `DELETE /api/budgets/:id` - Delete budget

### Goals
- `POST /api/goals` - Create goal
- `GET /api/goals` - Get all goals
- `GET /api/goals/progress` - Get goal progress
- `GET /api/goals/:id` - Get goal by ID
- `PUT /api/goals/:id` - Update goal
- `PUT /api/goals/:id/progress` - Update goal progress
- `DELETE /api/goals/:id` - Delete goal

### Income
- `POST /api/income` - Create income
- `GET /api/income` - Get all income
- `GET /api/income/stats` - Get income statistics
- `PUT /api/income/:id` - Update income
- `DELETE /api/income/:id` - Delete income

### Reports
- `GET /api/reports/expenses` - Generate expense report
- `GET /api/reports/budgets` - Generate budget report
- `GET /api/reports/income` - Generate income report
- `GET /api/reports/summary` - Get financial summary

## Usage

1. **Register/Login:** Create an account and log in
2. **Add Expenses:** Record your daily expenses with categories
3. **Create Budgets:** Set budget limits for different categories
4. **Set Goals:** Define financial goals with target amounts and dates
5. **Track Income:** Record income from various sources
6. **View Reports:** Generate and export financial reports
7. **Monitor Dashboard:** View financial overview and budget status

## Project Structure

```
personal-finance-manager/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Expense.js
│   │   ├── Budget.js
│   │   ├── Goal.js
│   │   └── Income.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── expenseController.js
│   │   ├── budgetController.js
│   │   ├── goalController.js
│   │   ├── incomeController.js
│   │   └── reportController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── expenseRoutes.js
│   │   ├── budgetRoutes.js
│   │   ├── goalRoutes.js
│   │   ├── incomeRoutes.js
│   │   └── reportRoutes.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── config/
│   │   └── database.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Common.jsx
│   │   ├── pages/
│   │   │   ├── Auth.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Expense.jsx
│   │   │   ├── Budget.jsx
│   │   │   ├── Goal.jsx
│   │   │   ├── Report.jsx
│   │   │   └── Profile.jsx
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.jsx
│   │   └── index.css
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
└── README.md
```

## Features in Detail

### Dashboard
- Real-time financial overview
- Expense and income distribution charts
- Budget alert notifications
- 30-day financial summary

### Expense Management
- Add, edit, and delete expenses
- Filter by category and date range
- Recurring expense support
- Payment method tracking

### Budget Management
- Set category-specific budgets
- Visual progress bars showing spending
- Alert thresholds customization
- Budget period selection

### Goal Setting
- Define financial objectives
- Track progress visually
- Set priorities and deadlines
- Calculate required monthly savings

### Financial Reports
- Expense breakdowns by category
- Budget adherence reports
- Income source analysis
- Data export (CSV, PDF)

### User Settings
- Profile management
- Currency selection
- Custom expense categories
- Notification preferences

## Future Enhancements

- Mobile app version
- Cloud synchronization
- Advanced financial forecasting
- Multi-currency support
- Investment tracking
- Bill reminders and notifications
- Social features (family budgeting)
- AI-powered spending recommendations

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and questions, please create an issue in the repository.

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.
