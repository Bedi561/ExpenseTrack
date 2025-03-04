import React from 'react';
import { useRecoilState } from 'recoil';
import { filterState } from '../lib/recoil/atoms';
import { motion } from 'framer-motion';

// ye sare categories hai jo user select kr skta hai expense k liye
const categories = [
  'All',
  'Food', 
  'Transportation', 
  'Entertainment', 
  'Utilities', 
  'Shopping', 
  'Housing',
  'Healthcare',
  'Other'
];

const ExpenseFilter = () => {
  // recoil se state management kr rhe hai, filter ka data store krne k liye
  const [filter, setFilter] = useRecoilState(filterState);

  // normal date inputs k liye handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };

  // category button click krne pe ye function call hoga
  // All select krne pe empty string set hogi, wrna jo category click ki wo set hogi
  const handleCategoryChange = (category) => {
    setFilter(prev => ({ 
      ...prev, 
      category: category === 'All' ? '' : category 
    }));
  };

  // Reset button click krne pe sare filters clear ho jayenge
  const resetFilters = () => {
    setFilter({
      category: '',
      startDate: '',
      endDate: '',
    });
  };

  return (
    // framer-motion se smooth animation add ki hai jab component load hota hai
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-xl shadow-sm p-6 mb-8"
    >
      {/* filter section ka main container */}
      <div className="flex items-center justify-between mb-4 ">
        <h2 className="text-xl font-medium">Filter Expenses</h2>
        
        <button 
          onClick={resetFilters}
          className="text-sm text-primary hover:text-primary/80 transition-colors"
        >
          Reset
        </button>
      </div>

      {/* 2 columns me divide kiya hai - date aur category k liye */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* date wala section - start date aur end date k inputs */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Date Range
          </label>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input 
                type="date" 
                name="startDate"
                value={filter.startDate}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                placeholder="Start Date"
              />
            </div>
            
            <div>
              <input 
                type="date" 
                name="endDate"
                value={filter.endDate}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                placeholder="End Date"
              />
            </div>
          </div>
        </div>
        
        {/* category buttons ka section - map krke sare categories show kr rhe */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                  (category === 'All' && filter.category === '') || 
                  category === filter.category
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ExpenseFilter;
