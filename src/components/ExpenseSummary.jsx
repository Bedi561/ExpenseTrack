
import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { expensesState, filterState } from '@/lib/recoil/atoms';
import { motion } from 'framer-motion';

const ExpenseSummary = () => {
  const expenses = useRecoilValue(expensesState);
  const filter = useRecoilValue(filterState);
  const [filteredExpenses, setFilteredExpenses] = useState(expenses);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    // Apply filters
    let result = [...expenses];
    
    if (filter.category) {
      result = result.filter(expense => expense.category === filter.category);
    }
    
    if (filter.startDate) {
      result = result.filter(expense => new Date(expense.date) >= new Date(filter.startDate));
    }
    
    if (filter.endDate) {
      result = result.filter(expense => new Date(expense.date) <= new Date(filter.endDate));
    }
    
    setFilteredExpenses(result);
    
    // Calculate total
    const total = result.reduce((sum, expense) => sum + expense.amount, 0);
    setTotalAmount(total);
  }, [expenses, filter]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-gradient-to-br from-primary/90 to-primary rounded-xl shadow-md p-6 text-white mb-8"
    >
      <h2 className="text-xl font-medium mb-1">Expense Summary</h2>
      
      <div className="flex flex-col space-y-1 mb-3">
        <span className="text-sm opacity-90">
          {filter.startDate && filter.endDate 
            ? `From ${new Date(filter.startDate).toLocaleDateString()} to ${new Date(filter.endDate).toLocaleDateString()}`
            : filter.startDate 
              ? `From ${new Date(filter.startDate).toLocaleDateString()}`
              : filter.endDate 
                ? `Until ${new Date(filter.endDate).toLocaleDateString()}`
                : "All time"}
        </span>
        
        {filter.category && (
          <span className="text-sm opacity-90">
            Category: {filter.category}
          </span>
        )}
      </div>
      
      <div className="mt-3">
        <div className="text-3xl font-bold">{formatCurrency(totalAmount)}</div>
        <div className="text-sm opacity-90 mt-1">
          Total from {filteredExpenses.length} {filteredExpenses.length === 1 ? 'expense' : 'expenses'}
        </div>
      </div>
    </motion.div>
  );
};

export default ExpenseSummary;
