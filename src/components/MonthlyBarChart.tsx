'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Transaction {
  _id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
}

interface MonthlyData {
  month: string;
  amount: number;
}

interface MonthlyBarChartProps {
  transactions: Transaction[];
}

const MonthlyBarChart: React.FC<MonthlyBarChartProps> = ({ transactions }) => {
  const processMonthlyData = (): MonthlyData[] => {
    const monthlyMap = new Map<string, number>();
    
    // Get last 6 months
    const months: MonthlyData[] = [];
    const currentDate = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      months.push({ month: monthKey, amount: 0 });
    }

    // Calculate amounts for each month
    transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.date);
      const monthKey = transactionDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      
      const existingMonth = months.find(m => m.month === monthKey);
      if (existingMonth) {
        existingMonth.amount += Math.abs(transaction.amount);
      }
    });

    return months;
  };

  const data = processMonthlyData();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="text-gray-600 dark:text-gray-400">{label}</p>
          <p className="text-blue-600 dark:text-blue-400 font-semibold">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
        Monthly Expenses
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="month" 
              stroke="#6B7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6B7280"
              fontSize={12}
              tickFormatter={(value) => `₹${value.toLocaleString()}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="amount" 
              fill="#3B82F6" 
              radius={[4, 4, 0, 0]}
              className="hover:opacity-80 transition-opacity"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {data.every(item => item.amount === 0) && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No transaction data available for the last 6 months
        </div>
      )}
    </div>
  );
};

export default MonthlyBarChart; 