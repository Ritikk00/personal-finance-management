# Personal Finance Manager - Backend

## Overview
The backend of the Personal Finance Manager is a Node.js/Express API that handles all business logic, database operations, and authentication. It provides RESTful endpoints for managing users, budgets, expenses, income, goals, and financial reports.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Configured in `config/database.js`
- **Authentication**: JWT-based (see middleware/auth.js)

## Project Structure
```
backend/
├── config/              # Configuration files
│   └── database.js      # Database connection setup
├── controllers/         # Request handlers
│   ├── authController.js
│   ├── budgetController.js
│   ├── expenseController.js
│   ├── goalController.js
│   ├── incomeController.js
│   └── reportController.js
├── middleware/          # Custom middleware
│   ├── auth.js          # Authentication middleware
│   └── errorHandler.js  # Error handling middleware
├── models/              # Database models
│   ├── Budget.js
│   ├── Expense.js
│   ├── Goal.js
│   ├── Income.js
│   └── User.js
├── routes/              # API routes
│   ├── authRoutes.js
│   ├── budgetRoutes.js
│   ├── expenseRoutes.js
│   ├── goalRoutes.js
│   ├── incomeRoutes.js
│   └── reportRoutes.js
├── server.js            # Main application entry point
└── package.json         # Dependencies and scripts
```

## Features
- User authentication and authorization
- User profile management
- Budget CRUD operations
- Expense tracking and management
- Income logging
- Financial goal setting and tracking
- Financial reports and analytics
- Error handling and validation

## Installation
```bash
npm install
```

## Environment Setup
Create a `.env` file in the backend directory with the following variables (see `.env.example` for reference):
```
PORT=5000
NODE_ENV=production
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=your_frontend_url
```

## Development
```bash
npm start
```
Starts the Express server on the configured PORT (default: 5000).

## API Routes
- **Authentication**: `/api/auth/*` - User registration, login, password reset
- **Budgets**: `/api/budgets/*` - Create, read, update, delete budgets
- **Expenses**: `/api/expenses/*` - Track and manage expenses
- **Income**: `/api/income/*` - Log and manage income
- **Goals**: `/api/goals/*` - Set and track financial goals
- **Reports**: `/api/reports/*` - Generate financial reports and analytics

## Middleware
- **auth.js**: Validates JWT tokens and authenticates requests
- **errorHandler.js**: Centralizes error handling and response formatting

## Database Models
All models include standard CRUD operations and are configured in the `models/` directory.

## CORS
Configure CORS settings in `server.js` to allow frontend requests.

## Deployment on Render

### Prerequisites
- MongoDB Atlas account (for cloud MongoDB)
- Render account
- GitHub repository with your code

### Steps to Deploy

1. **Set up MongoDB Atlas**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a cluster
   - Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/dbname`

2. **Create Render Service**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the branch to deploy (usually `main`)

3. **Configure Environment Variables in Render**
   - In the Render dashboard, go to your service
   - Go to "Environment" section
   - Add these environment variables:
     ```
     PORT=5000
     NODE_ENV=production
     MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/personal-finance-manager
     JWT_SECRET=your-secure-random-key-here
     FRONTEND_URL=https://your-frontend-url.onrender.com
     ```

4. **Set Build Command**
   ```bash
   npm install
   ```

5. **Set Start Command**
   ```bash
   npm start
   ```

6. **Deploy**
   - Click "Deploy" button
   - Wait for the build and deployment to complete

### Troubleshooting Registration Issues

If registration is not working after deployment:

1. **Check Logs on Render**
   - Go to your service dashboard
   - Check "Logs" tab for error messages

2. **Verify Environment Variables**
   - Ensure `MONGODB_URI` and `JWT_SECRET` are set
   - Verify MongoDB connection is working

3. **Check CORS Configuration**
   - Ensure frontend URL in `server.js` CORS matches your deployed frontend URL
   - The CORS origin should include your frontend domain

4. **Test API Health**
   ```bash
   curl https://your-backend-url.onrender.com/api/health
   ```
   Should return: `{"message":"Server is running"}`

5. **Test Registration Endpoint**
   ```bash
   curl -X POST https://your-backend-url.onrender.com/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"fullName":"Test User","email":"test@example.com","password":"password123","confirmPassword":"password123"}'
   ```

### Common Issues

- **MongoDB Connection Failed**: Check your `MONGODB_URI` and ensure your IP address is whitelisted in MongoDB Atlas
- **CORS Errors**: Verify the frontend URL matches exactly in the CORS configuration
- **Registration Returns 500 Error**: Check Render logs and ensure all environment variables are set correctly
