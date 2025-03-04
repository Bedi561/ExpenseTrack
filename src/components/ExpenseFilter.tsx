
import React from 'react';
import { useRecoilState } from 'recoil';
import { filterState } from '@/lib/recoil/atoms';
import { motion } from 'framer-motion';

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
  const [filter, setFilter] = useRecoilState(filterState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (category: string) => {
    setFilter(prev => ({ 
      ...prev, 
      category: category === 'All' ? '' : category 
    }));
  };

  const resetFilters = () => {
    setFilter({
      category: '',
      startDate: '',
      endDate: '',
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-xl shadow-sm p-6 mb-8"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-medium">Filter Expenses</h2>
        
        <button 
          onClick={resetFilters}
          className="text-sm text-primary hover:text-primary/80 transition-colors"
        >
          Reset
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
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
