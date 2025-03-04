
import React, { useState } from 'react';
import { useSetRecoilState, useRecoilState } from 'recoil';
import { expensesState, loadingState } from '../lib/recoil/atoms';
import { addExpense } from '../lib/api';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const categories = [
  'Food', 
  'Transportation', 
  'Entertainment', 
  'Utilities', 
  'Shopping', 
  'Housing',
  'Healthcare',
  'Other'
];

const ExpenseForm = () => {
  const [expense, setExpense] = useState({
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
  });
  
  const setExpenses = useSetRecoilState(expensesState);
  const [isLoading, setIsLoading] = useRecoilState(loadingState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpense(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!expense.amount || !expense.category || !expense.date) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      setIsLoading(true);
      const newExpense = await addExpense({
        ...expense,
        amount: parseFloat(expense.amount),
      });
      
      setExpenses(prev => [...prev, newExpense]);
      
      // Reset form
      setExpense({
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
      });
      
      toast.success('Expense added successfully');
    } catch (error) {
      toast.error('Failed to add expense');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md mx-auto bg-white rounded-xl shadow-sm p-6 mb-8"
    >
      <h2 className="text-xl font-medium mb-4 text-center">Add New Expense</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Amount *
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={expense.amount}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
        
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <select
            id="category"
            name="category"
            value={expense.category}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Date *
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={expense.date}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={expense.description}
            onChange={handleChange}
            placeholder="Add details about this expense"
            rows={3}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary text-white font-medium py-2 px-4 rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Adding...' : 'Add Expense'}
        </button>
      </form>
    </motion.div>
  );
};

export default ExpenseForm;
