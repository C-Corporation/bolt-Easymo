import { Transaction } from '@/types/transaction';
import { format } from 'date-fns';

export const calculateMonthlyStats = (transactions: Transaction[]) => {
  const monthlyData = {};
  
  transactions.forEach(transaction => {
    const month = format(new Date(transaction.date), 'MMM');
    const amount = transaction.amount;
    
    if (!monthlyData[month]) {
      monthlyData[month] = { revenus: 0, depenses: 0 };
    }
    
    if (transaction.type === 'income') {
      monthlyData[month].revenus += amount;
    } else {
      monthlyData[month].depenses += amount;
    }
  });

  return Object.entries(monthlyData).map(([month, values]) => ({
    name: month,
    ...values
  }));
};

export const calculatePieData = (transactions: Transaction[]) => {
  const categoryData = {};
  
  transactions.forEach(transaction => {
    if (transaction.type === 'expense') {
      const amount = transaction.amount;
      if (!categoryData[transaction.category]) {
        categoryData[transaction.category] = 0;
      }
      categoryData[transaction.category] += amount;
    }
  });

  return Object.entries(categoryData).map(([category, amount]) => ({
    name: category,
    value: amount
  }));
};

export const calculateCurrentStats = (transactions: Transaction[]) => {
  const currentMonth = format(new Date(), 'MMMM');
  const currentYear = format(new Date(), 'yyyy');
  
  const currentMonthTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return format(transactionDate, 'MMMM yyyy') === `${currentMonth} ${currentYear}`;
  });

  const totalIncome = currentMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalIncome - totalExpenses;
  const profitability = netProfit / totalIncome * 100;

  return {
    revenu: totalIncome,
    depenses: totalExpenses,
    benefice: netProfit,
    rentabilite: profitability
  };
};
