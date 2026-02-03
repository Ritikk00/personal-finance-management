# Personal Finance Manager

A full-stack application for managing personal finances with budget tracking, expense management, income logging, and financial goal setting.

## 🚀 Quick Start

### Prerequisites
- Node.js 14+
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

## 📋 Documentation

### For Deployment Issues (Render)

If you're having issues with your Render deployment, start here:

1. **[QUICK_FIX_GUIDE.md](QUICK_FIX_GUIDE.md)** - Step-by-step fix for registration issues (5 min)
2. **[CHECKLIST.md](CHECKLIST.md)** - Action items checklist
3. **[INDEX.md](INDEX.md)** - Navigation guide for all documentation

### Common Issues & Solutions

#### Registration Not Working on Render?
→ Follow [QUICK_FIX_GUIDE.md](QUICK_FIX_GUIDE.md) - you likely just need to set environment variables

#### Need Environment Variable Help?
→ Read [RENDER_ENV_SETUP.md](RENDER_ENV_SETUP.md) or [ENV_SETUP_GUIDE.md](ENV_SETUP_GUIDE.md)

#### Still Having Issues?
→ Check [DEPLOYMENT_TROUBLESHOOTING.md](DEPLOYMENT_TROUBLESHOOTING.md)

#### Want Technical Details?
→ Read [COMPLETE_SOLUTION.md](COMPLETE_SOLUTION.md) or [FIXES_APPLIED.md](FIXES_APPLIED.md)

## 🏗️ Project Structure

### Backend
- **Node.js + Express** API server
- **MongoDB** database with Mongoose ODM
- **JWT** authentication
- RESTful endpoints for all features

See [backend/README.md](backend/README.md) for details.

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **Context API** for state management
- Responsive UI with modern design

See [frontend/README.md](frontend/README.md) for details.

## ✨ Features

- 👤 User Authentication (Register, Login, Profile Management)
- 💰 Budget Management (Create, Track, Update)
- 💸 Expense Tracking (Log, Categorize, Analyze)
- 💵 Income Management (Track multiple income sources)
- 🎯 Financial Goals (Set and monitor progress)
- 📊 Financial Reports (Detailed analytics and insights)

## 🚢 Deployment

### Deploying on Render

1. **Backend Setup**: Follow [backend/README.md](backend/README.md#deployment-on-render)
2. **Frontend Setup**: Follow [frontend/README.md](frontend/README.md#deployment)
3. **Environment Variables**: Set in Render dashboard (see [RENDER_ENV_SETUP.md](RENDER_ENV_SETUP.md))

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| [backend/README.md](backend/README.md) | Backend setup and API documentation |
| [frontend/README.md](frontend/README.md) | Frontend setup and configuration |
| [QUICK_FIX_GUIDE.md](QUICK_FIX_GUIDE.md) | Fast fix for registration issues |
| [CHECKLIST.md](CHECKLIST.md) | Action items and verification checklist |
| [INDEX.md](INDEX.md) | Documentation navigation guide |
| [RENDER_ENV_SETUP.md](RENDER_ENV_SETUP.md) | Quick environment variable reference |
| [ENV_SETUP_GUIDE.md](ENV_SETUP_GUIDE.md) | Detailed environment variable setup |
| [DEPLOYMENT_TROUBLESHOOTING.md](DEPLOYMENT_TROUBLESHOOTING.md) | Comprehensive troubleshooting guide |
| [COMPLETE_SOLUTION.md](COMPLETE_SOLUTION.md) | Full explanation of fixes |
| [FIXES_APPLIED.md](FIXES_APPLIED.md) | Technical summary of changes |
| [SUMMARY.md](SUMMARY.md) | Overall summary of registration fix |

## 🛠️ Development

### Backend Development
```bash
cd backend
npm start
```
Server runs on http://localhost:5000

### Frontend Development
```bash
cd frontend
npm run dev
```
Frontend runs on http://localhost:5173

## 🔐 Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/personal-finance-manager
JWT_SECRET=your-secret-key
```

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:5000/api
```

For production, see [RENDER_ENV_SETUP.md](RENDER_ENV_SETUP.md)

## 🧪 Testing

### API Testing
```bash
curl http://localhost:5000/api/health
```

### Registration Test
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName":"Test User",
    "email":"test@example.com",
    "password":"password123",
    "confirmPassword":"password123"
  }'
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (authenticated)
- `PUT /api/auth/profile` - Update profile (authenticated)

### Expenses
- `GET /api/expenses` - List expenses
- `POST /api/expenses` - Create expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Budgets
- `GET /api/budgets` - List budgets
- `POST /api/budgets` - Create budget
- `PUT /api/budgets/:id` - Update budget
- `DELETE /api/budgets/:id` - Delete budget

### Income
- `GET /api/income` - List income records
- `POST /api/income` - Add income
- `PUT /api/income/:id` - Update income
- `DELETE /api/income/:id` - Delete income

### Goals
- `GET /api/goals` - List financial goals
- `POST /api/goals` - Create goal
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal

### Reports
- `GET /api/reports/expenses` - Expense report
- `GET /api/reports/budgets` - Budget report
- `GET /api/reports/income` - Income report

## 🐛 Troubleshooting

### Registration Not Working?
→ See [QUICK_FIX_GUIDE.md](QUICK_FIX_GUIDE.md)

### Database Connection Issues?
→ Check [DEPLOYMENT_TROUBLESHOOTING.md](DEPLOYMENT_TROUBLESHOOTING.md#mongodb-setup-required-for-render)

### CORS Errors?
→ See [DEPLOYMENT_TROUBLESHOOTING.md](DEPLOYMENT_TROUBLESHOOTING.md#issue-cors-error-in-browser-console)

### Other Issues?
→ Check [DEPLOYMENT_TROUBLESHOOTING.md](DEPLOYMENT_TROUBLESHOOTING.md)

## 📝 Recent Updates

✅ **Registration Fix** - Fixed registration issues on Render deployment
- Better error handling and logging
- Fixed middleware chain
- Added comprehensive documentation

See [SUMMARY.md](SUMMARY.md) for details.

## 👥 Contributing

Feel free to submit pull requests for any improvements.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Support

For issues or questions:
1. Check the relevant documentation file
2. Review [DEPLOYMENT_TROUBLESHOOTING.md](DEPLOYMENT_TROUBLESHOOTING.md)
3. Check Render logs for detailed error messages
4. Ensure all environment variables are properly set

---

**Last Updated**: February 3, 2026
**Status**: ✅ Fully Functional
