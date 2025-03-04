
const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');

// GET /expenses - Get all expenses (with optional filters)
router.get('/', async (req, res) => {
  try {
    const { category, date, startDate, endDate } = req.query;
    
    // Build filter query
    const filter = {};
    
    if (category) {
      filter.category = category;
    }
    
    if (date) {
      // Filter by specific date
      const startOfDay = new Date(date);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      filter.date = { $gte: startOfDay, $lte: endOfDay };
    } else if (startDate || endDate) {
      // Filter by date range
      filter.date = {};
      
      if (startDate) {
        filter.date.$gte = new Date(startDate);
      }
      
      if (endDate) {
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);
        filter.date.$lte = endOfDay;
      }
    }
    
    const expenses = await Expense.find(filter).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /expenses/total - Get total expenses for a date range
router.get('/total', async (req, res) => {
  try {
    const { start, end } = req.query;
    
    const filter = {};
    
    if (start || end) {
      filter.date = {};
      
      if (start) {
        filter.date.$gte = new Date(start);
      }
      
      if (end) {
        const endOfDay = new Date(end);
        endOfDay.setHours(23, 59, 59, 999);
        filter.date.$lte = endOfDay;
      }
    }
    
    const expenses = await Expense.find(filter);
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    res.json({ total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /expenses - Add a new expense
router.post('/', async (req, res) => {
  try {
    const { amount, category, date, description } = req.body;
    
    // Simple validation
    if (!amount || !category || !date) {
      return res.status(400).json({ message: 'Please provide amount, category, and date' });
    }
    
    const newExpense = new Expense({
      amount,
      category,
      date,
      description: description || '',
    });
    
    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
