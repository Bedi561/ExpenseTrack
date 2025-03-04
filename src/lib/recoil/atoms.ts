
import { atom } from 'recoil';

export interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string;
  description: string;
}

export const expensesState = atom<Expense[]>({
  key: 'expensesState',
  default: [],
});

export const filterState = atom({
  key: 'filterState',
  default: {
    category: '',
    startDate: '',
    endDate: '',
  },
});

export const loadingState = atom({
  key: 'loadingState',
  default: false,
});
