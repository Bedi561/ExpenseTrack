
import React, { useEffect } from 'react';
import { useSetRecoilState, useRecoilState } from 'recoil';
import { expensesState, loadingState } from '../lib/recoil/atoms';
import { fetchExpenses } from '../lib/api';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

import ExpenseForm from '@/components/ExpenseForm';
import ExpenseList from '@/components/ExpenseList';
import ExpenseFilter from '@/components/ExpenseFilter';
import ExpenseSummary from '@/components/ExpenseSummary';

const Index = () => {
  const setExpenses = useSetRecoilState(expensesState);
  const [isLoading, setIsLoading] = useRecoilState(loadingState);

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        setIsLoading(true);
        const data = await fetchExpenses();
        setExpenses(data);
      } catch (error) {
        console.error('Failed to load expenses:', error);
        toast.error('Failed to load expenses. Using sample data instead.');
        
        // Fallback to sample data if API is not available
        setExpenses([
          {
            id: '1',
            amount: 45.99,
            category: 'Food',
            date: '2023-11-15',
            description: 'Grocery shopping',
          },
          {
            id: '2',
            amount: 30.00,
            category: 'Transportation',
            date: '2023-11-14',
            description: 'Gas',
          },
          {
            id: '3',
            amount: 12.99,
            category: 'Entertainment',
            date: '2023-11-13',
            description: 'Movie ticket',
          },
          {
            id: '4',
            amount: 120.50,
            category: 'Utilities',
            date: '2023-11-10',
            description: 'Electricity bill',
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    loadExpenses();
  }, [setExpenses, setIsLoading]);

  return (
    <div className="min-h-screen bg-background">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="py-8 text-center"
      >
        <h1 className="text-3xl font-bold tracking-tight">Expense Tracker</h1>
        <p className="text-muted-foreground mt-2">Keep track of your spending habits</p>
      </motion.header>

      <main className="container px-4 pb-16 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <ExpenseForm />
            <ExpenseSummary />
          </div>
          
          <div className="lg:col-span-2 space-y-8">
            <ExpenseFilter />
            <ExpenseList />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
