
const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');

// Get all expenses with optional filters
router.get('/', async (req, res) => {
  try {
    const { category, date } = req.query;
    let query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      query.date = { $gte: startOfDay, $lte: endOfDay };
    }
    
    const expenses = await Expense.find(query).sort({ date: -1 });
    
    // Format response for frontend
    const formattedExpenses = expenses.map(expense => ({
      id: expense._id,
      amount: expense.amount,
      category: expense.category,
      date: expense.date.toISOString().split('T')[0],
      description: expense.description
    }));
    
    res.json(formattedExpenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new expense
router.post('/', async (req, res) => {
  try {
    const { amount, category, date, description } = req.body;
    
    const newExpense = new Expense({
      amount,
      category,
      date: new Date(date),
      description
    });
    
    const savedExpense = await newExpense.save();
    
    // Format response for frontend
    res.status(201).json({
      id: savedExpense._id,
      amount: savedExpense.amount,
      category: savedExpense.category,
      date: savedExpense.date.toISOString().split('T')[0],
      description: savedExpense.description
    });
  } catch (error) {
    console.error('Error adding expense:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get total expenses for a date range
router.get('/total', async (req, res) => {
  try {
    const { start, end } = req.query;
    let query = {};
    
    if (start || end) {
      query.date = {};
      
      if (start) {
        const startDate = new Date(start);
        startDate.setHours(0, 0, 0, 0);
        query.date.$gte = startDate;
      }
      
      if (end) {
        const endDate = new Date(end);
        endDate.setHours(23, 59, 59, 999);
        query.date.$lte = endDate;
      }
    }
    
    const expenses = await Expense.find(query);
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    res.json({ total });
  } catch (error) {
    console.error('Error calculating total expenses:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
