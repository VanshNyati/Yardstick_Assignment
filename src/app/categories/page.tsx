'use client';

import React, { useState, useEffect } from 'react';
import { getTransactions } from '@/actions/transactions';
import CategoryPieChart from '@/components/CategoryPieChart';
import BackToDashboard from '@/components/shared/BackToDashboard';

interface Transaction {
  _id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
}

export default function CategoriesPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const data = await getTransactions();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Process data for category chart
  const processCategoryData = () => {
    const categoryMap = new Map<string, number>();
    
    transactions.forEach(transaction => {
      const category = transaction.category || 'Uncategorized';
      const currentAmount = categoryMap.get(category) || 0;
      categoryMap.set(category, currentAmount + Math.abs(transaction.amount));
    });

    const colors = [
      '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
      '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
    ];

    return Array.from(categoryMap.entries()).map(([category, amount], index) => ({
      category,
      amount,
      color: colors[index % colors.length]
    }));
  };

  const categoryData = processCategoryData();

  return (
    <div className="container mx-auto px-4 py-8">
      <BackToDashboard />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Categories
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          View your spending breakdown by category
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500 dark:text-gray-400">Loading...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CategoryPieChart data={categoryData} />
          
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Category Summary
            </h3>
            <div className="space-y-3">
              {categoryData.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium text-gray-800 dark:text-white">
                      {item.category}
                    </span>
                  </div>
                  <span className="text-gray-600 dark:text-gray-400 font-medium">
                    ₹{item.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
