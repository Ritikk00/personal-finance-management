const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/database');
const { processRecurringIncome, processRecurringExpenses } = require('./utils/recurringProcessor');

const app = express();

// Connect to MongoDB
connectDB();

// Schedule recurring income/expense processing
// Run every day at midnight
setInterval(async () => {
  await processRecurringIncome();
  await processRecurringExpenses();
}, 24 * 60 * 60 * 1000); // Daily

// Run once on startup
processRecurringIncome();
processRecurringExpenses();

// Middleware
// --- CORS updated with your live frontend URL ---
app.use(cors({
  origin: [
    'https://personal-finance-frontend-vs0g.onrender.com', // Aapka Live URL
    'http://localhost:5173',                              // Local development ke liye
    'http://localhost:3000'                               // Agar koi aur port use ho raha ho
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));
app.use('/api/budgets', require('./routes/budgetRoutes'));
app.use('/api/goals', require('./routes/goalRoutes'));
app.use('/api/income', require('./routes/incomeRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Error handling middleware (must be last)
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ 
    message: err.message || 'Server error', 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

