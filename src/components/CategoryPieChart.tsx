'use client';

import React from 'react';

interface CategoryData {
  category: string;
  amount: number;
  color: string;
}

interface CategoryPieChartProps {
  data: CategoryData[];
  title?: string;
}

export default function CategoryPieChart({ data, title = 'Spending by Category' }: CategoryPieChartProps) {
  const total = data.reduce((sum, item) => sum + item.amount, 0);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatPercentage = (amount: number) => {
    return ((amount / total) * 100).toFixed(1);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">{title}</h3>
      
      {data.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          No data available
        </div>
      ) : (
        <div className="space-y-4">
          {/* Simple bar chart representation */}
          <div className="space-y-2">
            {data.map((item, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <div className="flex-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-800 dark:text-white">{item.category}</span>
                    <span className="text-gray-600 dark:text-gray-400">{formatCurrency(item.amount)}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                    <div
                      className="h-2 rounded-full"
                      style={{ 
                        backgroundColor: item.color,
                        width: `${(item.amount / total) * 100}%`
                      }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatPercentage(item.amount)}% of total
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
            <div className="flex justify-between text-sm font-medium">
              <span className="text-gray-800 dark:text-white">Total</span>
              <span className="text-gray-800 dark:text-white">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 