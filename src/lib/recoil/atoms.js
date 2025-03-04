
import { atom } from 'recoil';

export const expensesState = atom({
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
