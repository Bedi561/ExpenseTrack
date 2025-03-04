import React, { useState, useEffect } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { expensesState, filterState, loadingState } from '../lib/recoil/atoms';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

const ExpenseList = () => {
  // recoil se data fetch kr rhe hai
  const expenses = useRecoilValue(expensesState);
  const filter = useRecoilValue(filterState);
  const [isLoading] = useRecoilState(loadingState);
  
  // filtered expenses ko track krne k liye local state
  const [filteredExpenses, setFilteredExpenses] = useState(expenses);

  // jab bhi expenses ya filters change honge, filtering logic chalegi
  useEffect(() => {
    // sabse pehle original expenses ka copy banaya
    let result = [...expenses];
    
    // category filter lagaya - agar selected hai to
    if (filter.category) {
      result = result.filter(expense => expense.category === filter.category);
    }
    
    // start date se filter kiya - purane expenses hatane k liye
    if (filter.startDate) {
      result = result.filter(expense => new Date(expense.date) >= new Date(filter.startDate));
    }
    
    // end date se filter kiya - new expenses hatane k liye
    if (filter.endDate) {
      result = result.filter(expense => new Date(expense.date) <= new Date(filter.endDate));
    }
    
    setFilteredExpenses(result);
  }, [expenses, filter]);

  // paise ko USD format me convert krne k liye helper function
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    // main container with animation
    <div className="w-full">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-xl shadow-sm overflow-hidden"
      >
        <div className="p-6 pb-3">
          <h2 className="text-xl font-medium">Your Expenses</h2>
          <p className="text-muted-foreground text-sm mt-1">
            {filteredExpenses.length} {filteredExpenses.length === 1 ? 'expense' : 'expenses'} found
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredExpenses.length === 0 ? (
          <div className="text-center py-12 px-4">
            <p className="text-muted-foreground">No expenses found for the selected filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-secondary text-left">
                  <th className="px-6 py-3 text-sm font-medium">Date</th>
                  <th className="px-6 py-3 text-sm font-medium">Category</th>
                  <th className="px-6 py-3 text-sm font-medium">Description</th>
                  <th className="px-6 py-3 text-sm font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredExpenses.map((expense) => (
                    <motion.tr 
                      key={expense.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 text-sm">
                        {format(new Date(expense.date), 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-secondary">
                          {expense.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-[200px] truncate">
                        {expense.description || '—'}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-right">
                        {formatCurrency(expense.amount)}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ExpenseList;
